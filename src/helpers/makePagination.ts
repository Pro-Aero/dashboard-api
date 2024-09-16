import { Pagination } from '../types/pagination-query';

export function makePagination(
  page: number,
  itemsPerPage: number,
  totalItems: number,
): Pagination {
  const pagination: Pagination = {
    totalItems,
    totalPages: Math.ceil(totalItems / itemsPerPage),
    currentPage: page,
    firstItemIndex: (page - 1) * itemsPerPage,
    lastItemIndex: Math.min(page * itemsPerPage - 1, totalItems - 1),
  };

  return pagination;
}
