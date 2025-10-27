export interface Page<T> {
  content: T[];
  info: {
    page: number;
    perPage: number;
    totalElements: number;
    totalPages: number;
  };
}
