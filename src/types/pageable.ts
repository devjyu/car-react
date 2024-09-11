export interface Pageable<T> {
    content: T;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    totalElements: number;
    totalPages: number;
    size: number;
    pageable: {
      offset: number;
      pageNumber: number;
      pageSize: number;
      paged: boolean;
    }
  }