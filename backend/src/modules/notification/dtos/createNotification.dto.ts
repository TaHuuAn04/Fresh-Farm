import { IsEnum, IsNotEmpty, IsUUID, IsString, IsDate } from 'class-validator';
import { Severity } from '@common/enums';
import { Type } from 'class-transformer';

export class CreateNotificationDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsDate()
    @Type(() => Date)
    time: Date;

    @IsEnum(Severity)
    severity: Severity;
}
