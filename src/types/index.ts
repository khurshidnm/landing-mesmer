// Интерфейс для пагинации
export interface IPagination {
    page: number
    limit: number
    total: number
    pages: number
    next: number
    prev: number
  }