// // src/bull/mail.processor.ts
// // import { Process, Processor } from '@nestjs/bull';
// import { Job } from 'bull';
// import { MailService } from '../mail/mail.service';
// import { SendOtpDto } from '../mail/dto/sendOtp.dto';

// @Processor('mailQueue')
// export class MailProcessor {
//   constructor(private readonly mailService: MailService) {}

//   @Process('sendOtp')
//   async handleSendOtp(job: Job<SendOtpDto>) {
//     const sendOtpDto = new SendOtpDto();
//     await this.mailService.sendOtp(sendOtpDto);
//     console.log('Email sent to', sendOtpDto.email);
//   }
// }
