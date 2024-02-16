import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to HelphubNearby.web.ts
// and on native platforms to HelphubNearby.ts
import HelphubNearbyModule from './src/HelphubNearbyModule';
import HelphubNearbyView from './src/HelphubNearbyView';
import { ChangeEventPayload, HelphubNearbyViewProps } from './src/HelphubNearby.types';

// Get the native constant value.
export const PI = HelphubNearbyModule.PI;

export function hello(): string {
  return HelphubNearbyModule.hello();
}

export async function setValueAsync(value: string) {
  return await HelphubNearbyModule.setValueAsync(value);
}

const emitter = new EventEmitter(HelphubNearbyModule ?? NativeModulesProxy.HelphubNearby);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { HelphubNearbyView, HelphubNearbyViewProps, ChangeEventPayload };
