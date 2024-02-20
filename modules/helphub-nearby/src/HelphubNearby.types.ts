export type InfoPayload = {
  endpointId: string,
  info: string
}

export type ConnectionInfoType = {
  endpointId: string,
  endpointName: string,
  authenticationToken: string,
  isIncomingConnection: boolean
}

export type PayloadUpdateType = {
  endpointId: string,
  status: number
}

export type ConnectionResolutionType = {
  endpointId: string,
  status: string
}

export type DiscoveredEndpointType = {
  endpointId: string,
  serviceId: string,
  endpointName: string
}