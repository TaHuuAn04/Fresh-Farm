import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IOtpRepository } from './otp.repository.interface';
import { Otp } from 'database/entities/otp.entity';
import { OtpStatus } from '@common/enums';

@Injectable()
export class OtpRepository implements IOtpRepository {
  constructor(
    @InjectRepository(Otp)
    private readonly repo: Repository<Otp>,
  ) {}

  create(data: Partial<Otp>): Otp {
    return this.repo.create(data);
  }

  save(otp: Otp): Promise<Otp> {
    return this.repo.save(otp);
  }

  find(): Promise<Otp[]> {
    return this.repo.find();
  }

  async findOneById(id: string): Promise<Otp | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findOtpActiveByPhone(phone: string): Promise<Otp | null> {
    return this.repo.findOne({ where: { phone, status: OtpStatus.Pending } });
  }
}
