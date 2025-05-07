import { Module } from '@nestjs/common';
import { AdafruitService } from './adafruit.service';

@Module({
  providers: [AdafruitService,

  ],
  exports: [AdafruitService]
})
export class AdafruitModule { }
