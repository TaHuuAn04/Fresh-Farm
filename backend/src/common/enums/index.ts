export enum DeviceStatus {
  OFFLINE = 'offline',
  ONLINE = 'online',
}

export enum UserStatus {
  Pending = 'P',    // Chờ xác thực
  Active = 'A',     // Đã xác thực
  Banned = 'B',     // Bị cấm
}

export enum OtpStatus {
  Pending = 'pending',    // Chờ xác thực
  Verified = 'verified',  // Đã xác thực
  Blocked = 'blocked',    // Bị cấm
}

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}
