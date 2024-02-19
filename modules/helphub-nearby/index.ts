import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to HelphubNearby.web.ts
// and on native platforms to HelphubNearby.ts
import HelphubNearbyModule from './src/HelphubNearbyModule';
import HelphubNearbyView from './src/HelphubNearbyView';
import { ChangeEventPayload, HelphubNearbyViewProps } from './src/HelphubNearby.types';

export function sendPayload(endpoint: string, payload: string) {
  HelphubNearbyModule.sendPayload(endpoint, payload);
}

export function startAdvertising(name: string) {
  HelphubNearbyModule.startAdvertising(name);
}

export function stopAdvertising() {
  HelphubNearbyModule.stopAdvertising();
}

export function startDiscovery() {
  HelphubNearbyModule.startDiscovery();
}

export function stopDiscovery() {
  HelphubNearbyModule.stopDiscovery();
}

export function requestConnection(endpoint: string) {
  HelphubNearbyModule.requestConnection(endpoint);
}

export function getMessages() {
  HelphubNearbyModule.getMessages();
}

export function getEndpointMessage(endpoint: string) {
  HelphubNearbyModule.getEndpointMessage(endpoint)
}

export function getDiscoveredEndpoints() {
  HelphubNearbyModule.getDiscoveredEndpoints()
}

export function getConnectedEndpoints() {
  HelphubNearbyModule.getConnectedEndpoints();
}

const emitter = new EventEmitter(HelphubNearbyModule ?? NativeModulesProxy.HelphubNearby);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { HelphubNearbyView, HelphubNearbyViewProps, ChangeEventPayload };
