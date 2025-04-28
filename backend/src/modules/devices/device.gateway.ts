import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as mqtt from 'mqtt';
import { DevicesService } from './devices.service';
import { ADAFRUIT_KEY, ADAFRUIT_USERNAME } from '@environments';
import { UseGuards } from '@nestjs/common';
import JwtAuthGuard from '@modules/auth/guard/jwtAuth.guard';

@WebSocketGateway(3010, { cors: true })
export class DeviceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users: Map<string, Socket> = new Map();
  private deviceToUserCache: Map<string, string> = new Map();
  private client: mqtt.MqttClient;

  constructor(
    private readonly deviceService: DevicesService,
  ) {
    this.setupMqttClient();
  }

  private setupMqttClient() {
    this.client = mqtt.connect('mqtts://io.adafruit.com', {
      username: ADAFRUIT_USERNAME,
      password: ADAFRUIT_KEY,
    });

    this.client.on('connect', () => {
      this.client.subscribe(`${ADAFRUIT_USERNAME}/feeds/#`, (err) => {
        if (err) console.error('❌ Failed to subscribe:', err.message);
        else console.log('📡 MQTT Subscribed to all feeds');
      });
    });

    this.client.on('message', async (topic, message) => {
      const deviceId = this.extractDeviceIdFromTopic(topic);
      const userId = await this.getUserIdByDeviceId(deviceId);

      if (userId) {
        this.sendDataToUser(userId, {
          deviceId,
          data: message.toString(),
        });
      } else {
        console.warn(`⚠️ No user found for device ${deviceId}`);
      }
    });
  }

  async getUserIdByDeviceId(deviceId: string): Promise<string | null> {
    if (this.deviceToUserCache.has(deviceId)) {
      console.log("cache")
      return this.deviceToUserCache.get(deviceId)!; 
    }

    const userId = await this.deviceService.findUserIdByDeviceId(deviceId);

    if (userId) {
      this.deviceToUserCache.set(deviceId, userId); 
    }

    return userId;
  }

  @UseGuards(JwtAuthGuard)
  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    console.log(userId)
    if (userId) {
      this.users.set(userId, client);
      console.log(`✅ User connected: ${userId}`);
    } else {
      console.warn('⚠️ User connected without userId');
    }
  }

  handleDisconnect(client: Socket) {
    const userId = [...this.users.entries()].find(
      ([_, socket]) => socket.id === client.id,
    )?.[0];

    if (userId) {
      this.users.delete(userId);
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

  private extractDeviceIdFromTopic(topic: string): string {
    const parts = topic.split('/');
    return parts[2] || 'unknown-device';
  }
}

