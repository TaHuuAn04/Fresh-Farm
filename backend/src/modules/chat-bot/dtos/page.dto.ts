import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> {
  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }

  @ApiProperty({ type: 'array', isArray: true })
  @Expose()
  data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  @Type(() => PageMetaDto)
  @Expose()
  meta: PageMetaDto;
}
