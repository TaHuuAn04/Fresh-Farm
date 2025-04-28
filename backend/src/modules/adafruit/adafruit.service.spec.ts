import { Test, TestingModule } from '@nestjs/testing';
import { AdafruitService } from './adafruit.service';

describe('AdafruitService', () => {
  let service: AdafruitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdafruitService],
    }).compile();

    service = module.get<AdafruitService>(AdafruitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
