import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { BullModule } from '@nestjs/bull';
import { MailController } from './mail.controller';
import { MAIL_PASS, MAIL_USER } from '@environments';
import { MailProcessor } from './mail.processor';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: MAIL_USER,
          pass: MAIL_PASS,
        },
      },
      defaults: {
        from: '"Hệ thống FreshFarm',
      },
      // template: {
      //   dir: path.join(__dirname, 'templates'),
      //   adapter: new HandlebarsAdapter(),
      //   options: {
      //     strict: true,
      //   },
      // },
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService],
  controllers: [MailController],
})
export class MailModule {}
