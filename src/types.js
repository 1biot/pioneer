export const CONTROL_TOPIC = '$CONTROL/dynamic-security/v1'

export const CONTROL_TOPIC_RESPONSE = `${CONTROL_TOPIC}/response`

export const CONNECTION_STATE = {
  NOT_INIT: -1,
  DISCONNECT: 0,
  CONNECTING: 1,
  CONNECT_FAILED: 2,
  CONNECT: 3,
  RECONNECT: 4
}

export const COMMAND_2_STATE = {
  enableClient: 'enabled'
}
