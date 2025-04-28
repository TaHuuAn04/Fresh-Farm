import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendOtpDto } from './dto/sendOtp.dto';
import { otpEmailTemplate } from './templates/welcome.template';
//import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    //@InjectQueue('mailQueue') private mailQueue: Queue,
  ) {}

  async sendOtp(sendOtpDto: SendOtpDto) {
    const emailBody = otpEmailTemplate(sendOtpDto.name, sendOtpDto.code);

    await this.mailerService.sendMail({
      from: '"Hệ thống FreshFarm" <no-reply@freshfarm.com>', // Địa chỉ email và tên người gửi
      to: sendOtpDto.email,
      subject: 'THÔNG BÁO FRESHFARM',
      html: emailBody,
    });
  }

  // async sendOtp(sendOtpDto: SendOtpDto) {
  //   const emailBody = otpEmailTemplate(sendOtpDto.name, sendOtpDto.code);

  //   await this.mailQueue.add('sendOtp', {
  //     sendOtpDto: {
  //       ...sendOtpDto,
  //       html: emailBody,
  //     },
  //   });
  // }
}
