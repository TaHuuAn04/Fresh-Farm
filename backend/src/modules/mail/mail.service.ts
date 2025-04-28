import { Injectable } from '@nestjs/common';
import { SendOtpDto } from './dto/sendOtp.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  async sendOtpQueue(sendOtpDto: SendOtpDto) {
    await this.emailQueue.add('send-email', sendOtpDto, {
      delay: 1000, // optional: delay 1 giây
      attempts: 3, // optional: thử lại 3 lần nếu fail
    });
  }
}
