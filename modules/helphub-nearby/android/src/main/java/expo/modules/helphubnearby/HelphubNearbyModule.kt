package expo.modules.helphubnearby

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

import android.content.Context;
import android.os.Build
import android.os.Bundle
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.core.os.bundleOf
import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.connection.AdvertisingOptions;
import com.google.android.gms.nearby.connection.BandwidthInfo;
import com.google.android.gms.nearby.connection.ConnectionInfo;
import com.google.android.gms.nearby.connection.ConnectionLifecycleCallback;
import com.google.android.gms.nearby.connection.ConnectionOptions;
import com.google.android.gms.nearby.connection.ConnectionResolution;
import com.google.android.gms.nearby.connection.ConnectionType;
import com.google.android.gms.nearby.connection.DiscoveredEndpointInfo;
import com.google.android.gms.nearby.connection.DiscoveryOptions;
import com.google.android.gms.nearby.connection.EndpointDiscoveryCallback;
import com.google.android.gms.nearby.connection.Payload;
import com.google.android.gms.nearby.connection.PayloadCallback;
import com.google.android.gms.nearby.connection.PayloadTransferUpdate;
import com.google.android.gms.nearby.connection.Strategy;
import com.google.android.gms.nearby.connection.ConnectionsClient;
import com.google.android.gms.nearby.connection.ConnectionsStatusCodes
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.exception.Exceptions
import java.nio.charset.StandardCharsets.UTF_8

class HelphubNearbyModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  override fun definition() = ModuleDefinition {
    Name("HelphubNearby")

    val STRATEGY = Strategy.P2P_CLUSTER

    val TAG = "Helphub-Nearby"

    lateinit var connectionsClient : ConnectionsClient

    data class EndpointInfo(val id: String, val name: String)

    val SERVICE_ID = "helphub"
    val REQUEST_CODE_REQUIRED_PERMISSIONS = 1

    val messages : HashMap<String, String> = hashMapOf<String, String>()
    val discoveredEndpoints : MutableSet<Bundle> = mutableSetOf<Bundle>();

    OnCreate {
      connectionsClient = Nearby.getConnectionsClient(context);
    }

    Events("onNewDeviceDiscovered", "onConnectionUpdate", "onPayloadTransferUpdate", "onNewConnectionInitiated")

    fun sendPayload(endpointId : String, message : String) {
      Payload.fromBytes(message.toByteArray(UTF_8)).let {
        connectionsClient.sendPayload(endpointId, it)
      }
    }

    val payloadCallback : PayloadCallback = object : PayloadCallback() {
      override fun onPayloadReceived(endpointId: String, payload: Payload) {
        payload.asBytes()?.let {
          if (messages.containsKey(endpointId)) {
            messages[endpointId] = String(it, UTF_8)
          } else {
            messages.put(endpointId, String(it, UTF_8))
          }
        }
      }

      override fun onPayloadTransferUpdate(endpointId: String, update: PayloadTransferUpdate) {
        this@HelphubNearbyModule.sendEvent("onPayloadTransferUpdate", bundleOf("endpointId" to endpointId, "status" to update.status))
      }
    }

    val connectionLifecycleCallback : ConnectionLifecycleCallback = object : ConnectionLifecycleCallback() {
      override fun onConnectionInitiated(endpointId: String, info: ConnectionInfo) {
        this@HelphubNearbyModule.sendEvent("onNewConnectionInitiated", bundleOf("endpointId" to endpointId, "endpointName" to info.endpointName,
          "authenticationToken" to info.authenticationDigits, "isIncomingConnection" to info.isIncomingConnection))
        connectionsClient.acceptConnection(endpointId, payloadCallback)
      }

      override fun onConnectionResult(endpointId: String, resolution: ConnectionResolution) {
        this@HelphubNearbyModule.sendEvent("onConnectionUpdate", bundleOf("endpointId" to endpointId, "status" to resolution.status.statusMessage))
        when (resolution.status.statusCode) {
          ConnectionsStatusCodes.STATUS_OK -> {
            Log.d(TAG, "Succesfully connected to endpoint $endpointId")
            messages[endpointId] = ""
            connectionsClient.stopAdvertising()
            connectionsClient.stopDiscovery()
          }

          ConnectionsStatusCodes.STATUS_CONNECTION_REJECTED -> {
            Log.d(TAG, "This or endpoint $endpointId rejected the connection.")
          }

          ConnectionsStatusCodes.STATUS_ERROR -> {
            Log.w(TAG, "Connection to endpoint $endpointId failed with error ${resolution.status.statusMessage}")
          }
        }
      }

      override fun onDisconnected(endpointId: String) {
        messages.remove(endpointId)
      }
    }

    val endpointDiscoveryCallback = object : EndpointDiscoveryCallback() {
      override fun onEndpointFound(endpointId: String, info: DiscoveredEndpointInfo) {
          discoveredEndpoints.add(bundleOf("id" to endpointId, "name" to info.endpointName))
          this@HelphubNearbyModule.sendEvent(
            "onNewDeviceDiscovered", bundleOf(
              "endpointId" to endpointId,
              "serviceId" to info.serviceId, "endpointName" to info.endpointName))
      }

      @RequiresApi(Build.VERSION_CODES.N)
      override fun onEndpointLost(endpointId: String) {
        discoveredEndpoints.removeIf {
          it.getString("id") == endpointId
        }
      }
    }

    fun requestConnection(name : String, endpointId : String) {
      connectionsClient.requestConnection(name, endpointId, connectionLifecycleCallback)
        .addOnSuccessListener {
          Log.d(TAG, "Requested connection to endpoint $endpointId.")
        } .addOnFailureListener {
          Log.w(TAG, "Connection request to endpoint $endpointId failed with: $it")
        }
    }

    fun startAdvertising(name : String) {
      val advertisingOptions : AdvertisingOptions = AdvertisingOptions.Builder().setStrategy(STRATEGY).build()
      connectionsClient.startAdvertising(name, SERVICE_ID, connectionLifecycleCallback, advertisingOptions)
        .addOnSuccessListener { Log.d(TAG, "Advertisement started successfully.")}
        .addOnFailureListener {
          Log.w(TAG, "Advertisement failed with $it")
        }
    }

    fun startDiscovery() {
      val discoveryOptions : DiscoveryOptions = DiscoveryOptions.Builder().setStrategy(STRATEGY).build()
      connectionsClient.startDiscovery(SERVICE_ID, endpointDiscoveryCallback, discoveryOptions)
        .addOnSuccessListener {
          Log.d(TAG, "Discovery started successfully.")
        }.addOnFailureListener {
          Log.w(TAG, "Discovery failed with $it")
        }
    }

    Function("sendPayload") {
        endpoint : String, payload : String -> sendPayload(endpoint, payload);
    }

    Function("startAdvertising") {
      name : String -> startAdvertising(name)
    }

    Function("stopAdvertising") {
      connectionsClient.stopAdvertising()
    }

    Function("startDiscovery") {
      startDiscovery()
    }

    Function("stopDiscovery") {
      connectionsClient.stopDiscovery()
    }

    Function("requestConnection") {
      name : String, endpoint : String -> requestConnection(name, endpoint)
    }

    Function("getMessages") {
      return@Function messages
    }

    Function("getEndpointMessage") {
      endpointId : String -> return@Function messages[endpointId]
    }

    Function("getDiscoveredEndpoints") {
      return@Function discoveredEndpoints
    }
  }
}


