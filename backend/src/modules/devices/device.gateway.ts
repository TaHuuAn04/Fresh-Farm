import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as mqtt from 'mqtt';
import { DevicesService } from './devices.service';
import { UsersService } from '@modules/users/users.service';
import { ADAFRUIT_KEY, ADAFRUIT_USERNAME } from '@environments';
import { validate as isUuid } from 'uuid';

@WebSocketGateway(3010, { cors: true, namespace: '/user' })
export class DeviceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users: Map<string, Socket> = new Map();
  private deviceToUserCache: Map<string, string> = new Map();
  private mqttClient: mqtt.MqttClient;

  constructor(

    private readonly deviceService: DevicesService,
    private readonly usersService: UsersService,
  ) {
    console.log('🔄 DeviceGateway constructor chạy');
    this.setupMqttClient();
  }

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;

    if (!userId || !isUuid(userId)) {
      console.log("ID người dùng không hợp lệ")
      return this.emitAndDisconnect(client, 'INVALID_USER_ID', 'ID người dùng không hợp lệ');
    }

    const user = await this.usersService.findById(userId);
    if (!user) {
      console.log("Không tìm thấy người dùng")
      return this.emitAndDisconnect(client, 'USER_NOT_FOUND', 'Không tìm thấy người dùng');
    }

    this.users.set(userId, client);

    client.emit('system-message', {
      type: 'success',
      message: 'Kết nối thành công',
    });

    console.log(`✅ User connected: ${userId}`);
  }

  handleDisconnect(client: Socket) {
    const entry = [...this.users.entries()].find(
      ([_, socket]) => socket.id === client.id,
    );

    if (entry) {
      const userId = entry[0];
      this.users.delete(userId);
      client.emit('system-message', {
        type: 'info',
        message: 'Đã ngắt kết nối khỏi hệ thống',
      });
      console.log(`❌ User disconnected: ${userId}`);
    }
  }

  sendDataToUser(userId: string, data: any) {
    const client = this.users.get(userId);
    if (client) {
      client.emit('device-update', data);
    } else {
      console.warn(`⚠️ No socket found for user ${userId}`);
    }
  }

  private emitAndDisconnect(client: Socket, code: string, message: string) {
    client.emit('system-message', { type: 'error', code, message });
    // client.disconnect();

    setTimeout(() => {
      client.disconnect();
    }, 150);

  }

  private setupMqttClient() {
    console.log(ADAFRUIT_USERNAME)
    console.log('🧪 Đang khởi tạo MQTT client...');
    this.mqttClient = mqtt.connect('mqtts://io.adafruit.com', {
      username: ADAFRUIT_USERNAME,
      password: ADAFRUIT_KEY,
    });

    this.mqttClient.on('connect', () => {
      console.log('📡 MQTT connected');
      this.mqttClient.subscribe(`${ADAFRUIT_USERNAME}/feeds/#`, (err) => {
        if (err) {
          console.error('❌ MQTT subscription failed:', err.message);
        } else {
          console.log('✅ Subscribed to Adafruit feeds');
        }
      });
    });

    this.mqttClient.on('message', async (topic, message) => {
      const deviceKey = this.extractDeviceIdFromTopic(topic);

      let parsed: any;

      try {
        parsed = JSON.parse(message.toString());
      } catch (err) {
        return;
      }

      if (!isUuid(deviceKey)) {
        return;
      }

      const userId = await this.getUserIdByDeviceId(deviceKey);

      if (userId) {
        const device = await this.deviceService.findOneByKey(deviceKey);

        this.sendDataToUser(userId, {
          statusCode: 200,
          message: 'Cập nhật giá trị mới thành công',
          data: {
            value: parsed?.data?.value,
            type: device.type,
            id: device.id,
            deviceKey

          }
        }
        );
      } else {
        console.warn(`⚠️ No user found for device ${deviceKey}`);
      }
    });
  }

  private extractDeviceIdFromTopic(topic: string): string {
    const parts = topic.split('/');
    return parts[2] || 'unknown-device';
  }

  private async getUserIdByDeviceId(deviceId: string): Promise<string | null> {
    if (this.deviceToUserCache.has(deviceId)) {
      return this.deviceToUserCache.get(deviceId)!;
    }

    const userId = await this.deviceService.findUserIdByDeviceId(deviceId);
    if (userId) {
      this.deviceToUserCache.set(deviceId, userId);
    }

    return userId;
  }
}
