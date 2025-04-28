// email.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SendOtpDto } from './dto/sendOtp.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { otpEmailTemplate } from './templates/welcome.template';
import { AppError } from '@common/dtos/errorResponse.dto';
import { HttpStatus } from '@nestjs/common';

@Processor('email')
export class MailProcessor {
  constructor(private mailerService: MailerService) {}

  @Process('send-email')
  async handleSendEmail(job: Job<SendOtpDto>) {
    const sendOtpDto = job.data;

    const emailBody = otpEmailTemplate(sendOtpDto.email, sendOtpDto.code);

    try {
      await this.mailerService.sendMail({
        from: '"Hệ thống FreshFarm" <no-reply@freshfarm.com>',
        to: sendOtpDto.email,
        subject: 'THÔNG BÁO FRESHFARM',
        html: emailBody,
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log(`Email sent to ${sendOtpDto.email}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        'Xảy ra lỗi trong quá trình gửi mail',
        'SEND_MAIL_FAIL',
      );
    }
  }
}
