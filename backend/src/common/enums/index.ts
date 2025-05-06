export enum DeviceStatus {
  PA = 'pending activce',
  OFFLINE = 'offline',
  ONLINE = 'online',
}

export enum UserStatus {
  Pending = 'P', // Chờ xác thực
  Active = 'A', // Đã xác thực
  Banned = 'B', // Bị cấm
}

export enum OtpStatus {
  Pending = 'pending', // Chờ xác thực
  Verified = 'verified', // Đã xác thực
  Blocked = 'blocked', // Bị cấm
}

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD',
}

export enum EventType {
  MESSAGE_RECEIVED = 'message_received',
  MESSAGE_SENT = 'message_sent',
  MESSAGE_DELIVERED = 'message_delivered',
  MESSAGE_READ = 'message_read',
}

export enum ChatType {
  BLOCKING = 'blocking',
  STREAMING = 'streaming',
}

export enum Severity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum DeviceType {
  SENSOR_HUMIDITY = 'SENSOR_HUMIDITY',
  SENSOR_TEMPERATURE = 'SENSOR_TEMPERATURE',
  ACTUATOR_PUMP = 'ACTUATOR_PUMP',
  ACTUATOR_FAN = 'ACTUATOR_FAN',
  ACTUATOR_LIGHT = 'ACTUATOR_LIGHT',
  CAMERA = 'CAMERA',
  OTHERS = 'OTHERS',
}
