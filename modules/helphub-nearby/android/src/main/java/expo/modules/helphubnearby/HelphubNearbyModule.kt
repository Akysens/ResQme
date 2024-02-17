package expo.modules.helphubnearby

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

import android.content.Context;
import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.connection.AdvertisingOptions;
import com.google.android.gms.nearby.connection.BandwidthInfo;
import com.google.android.gms.nearby.connection.ConnectionInfo;
import com.google.android.gms.nearby.connection.ConnectionLifecycleCallback;
import com.google.android.gms.nearby.connection.ConnectionOptions;
import com.google.android.gms.nearby.connection.ConnectionResolution;
import expo.modules.kotlin.activityresult.AppContextActivityResultLauncher
import com.google.android.gms.nearby.connection.ConnectionType;
import com.google.android.gms.nearby.connection.DiscoveredEndpointInfo;
import com.google.android.gms.nearby.connection.DiscoveryOptions;
import com.google.android.gms.nearby.connection.EndpointDiscoveryCallback;
import com.google.android.gms.nearby.connection.Payload;
import com.google.android.gms.nearby.connection.PayloadCallback;
import com.google.android.gms.nearby.connection.PayloadTransferUpdate;
import com.google.android.gms.nearby.connection.Strategy;
import com.google.android.gms.nearby.connection.ConnectionsClient;
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.exception.Exceptions
import java.nio.charset.StandardCharsets.UTF_8

class HelphubNearbyModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  override fun definition() = ModuleDefinition {
    Name("HelphubNearby")

    Function("getTheme") {
      return@Function "system"
    }

    class ClientMessage() {

    }

    val STRATEGY = Strategy.P2P_CLUSTER

    lateinit var connectionsClient : ConnectionsClient

    val REQUEST_CODE_REQUIRED_PERMISSIONS = 1

    val messages : HashMap<String, String> = HashMap()

    OnCreate {
      connectionsClient = Nearby.getConnectionsClient(context);
    }

    fun sendPayload(endpointId : String, message : String) {
      Payload.fromBytes(message.toByteArray(UTF_8)).let {
        connectionsClient.sendPayload(endpointId, it)
      }
    }

    val payloadCallback : PayloadCallback = object : PayloadCallback() {
      override fun onPayloadReceived(endpointId: String, payload: Payload) {
        payload.asBytes()?.let {
          messages[endpointId] = String(it, UTF_8)
        }
      }

      override fun onPayloadTransferUpdate(endpointId: String, update: PayloadTransferUpdate) {
      }
    }

    val connectionLifecycleCallback : ConnectionLifecycleCallback = object : ConnectionLifecycleCallback() {
      override fun onConnectionInitiated(p0: String, p1: ConnectionInfo) {
      }

      override fun onConnectionResult(p0: String, p1: ConnectionResolution) {

      }

      override fun onDisconnected(p0: String) {

      }

    }

  }
}
