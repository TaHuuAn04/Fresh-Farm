import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendOtpDto } from './dto/sendOtp.dto';

@Controller('email')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  // Endpoint gửi OTP qua email
  @Post('send-otp')
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    try {
      // Gọi service gửi email OTP
      await this.mailService.sendOtp(sendOtpDto);
      return { message: 'OTP đã được gửi thành công!' };
    } catch (error) {
      return { message: 'Có lỗi xảy ra khi gửi OTP', error: error.message };
    }
  }
}
