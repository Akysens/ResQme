import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to HelphubNearby.web.ts
// and on native platforms to HelphubNearby.ts
import HelphubNearbyModule from './src/HelphubNearbyModule';
import { InfoPayload } from './src/HelphubNearby.types';


export function sendPayload(endpoint: string, payload: string) {
  HelphubNearbyModule.sendPayload(endpoint, payload);
}

export function startAdvertising(name: string) {
  console.log("Advertisement started.");
  HelphubNearbyModule.startAdvertising(name);
}

export function stopAdvertising() {
  HelphubNearbyModule.stopAdvertising();
}

export function startDiscovery(name: string) {
  console.log("Discovery started.");
  HelphubNearbyModule.startDiscovery(name);
}

export function stopDiscovery() {
  HelphubNearbyModule.stopDiscovery();
}

export function requestConnection(endpoint: string) {
  HelphubNearbyModule.requestConnection(endpoint);
}

export function getMessages() {
  return HelphubNearbyModule.getMessages();
}

export function getEndpointMessage(endpoint: string) {
  return HelphubNearbyModule.getEndpointMessage(endpoint)
}

export function getDiscoveredEndpoints() {
  console.log("discovered");
  return HelphubNearbyModule.getDiscoveredEndpoints();
}

export function getConnectedEndpoints() {
  return HelphubNearbyModule.getConnectedEndpoints();
}

const emitter = new EventEmitter(HelphubNearbyModule);

export function addDeviceDiscoveryListener(listener: (event: InfoPayload) => void) : Subscription {
  return emitter.addListener("onNewDeviceDiscovered", listener);
}

export function addConnectionUpdateListener(listener: (event: InfoPayload) => void) : Subscription {
  return emitter.addListener("onConnectionUpdate", listener);
}

export function addPayloadUpdateListener(listener: (event: InfoPayload) => void) : Subscription {
  return emitter.addListener("onPayloadTransferUpdate", listener);
}

export function addNewConnectionListener(listener: (event: InfoPayload) => void) : Subscription {
  return emitter.addListener("onNewConnectionInitiated", listener);
}