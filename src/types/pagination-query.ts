import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationQuery {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Minimum allowed value is 1' })
  readonly page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Items per page must be a number' })
  @Min(1, { message: 'Minimum allowed value is 1' })
  readonly itemsPerPage?: number = 10;
}

export type Pagination = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  firstItemIndex: number;
  lastItemIndex: number;
};

export type PaginatedItems<T> = {
  data: T[];
  pagination: Pagination;
};
