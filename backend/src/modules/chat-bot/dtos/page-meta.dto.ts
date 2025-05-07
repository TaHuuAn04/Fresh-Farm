import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

export class PageMetaDto {
  constructor({
    page,
    take,
    itemCount,
    recommendBegin,
  }: {
    page: number;
    take: number;
    itemCount: number;
    recommendBegin?: number | undefined;
  }) {
    this.page = page;
    this.take = take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;

    if (recommendBegin !== undefined) {
      this.recommendBegin = recommendBegin;
    } else {
      this.recommendBegin = null;
    }
  }

  @ApiProperty({
    type: Number,
    required: true,
    example: 1,
    description: 'The current page number.',
  })
  @Expose()
  page: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: 10,
    description: 'The number of items per page.',
  })
  @Expose()
  take: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: 100,
    description: 'The total number of items.',
  })
  @Expose()
  itemCount: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: 10,
    description: 'The total number of pages.',
  })
  @Expose()
  pageCount: number;

  @ApiProperty({
    type: Boolean,
    required: true,
    example: true,
    description: 'Whether the current page has a previous page.',
  })
  @Expose()
  hasPreviousPage: boolean;

  @ApiProperty({
    type: Boolean,
    required: true,
    example: true,
    description: 'Whether the current page has a next page.',
  })
  @Expose()
  hasNextPage: boolean;

  @ApiProperty({
    type: Number,
    required: false,
    example: 10,
    description: 'The recommend begin number.',
  })
  @Expose()
  recommendBegin?: number | null;
}
