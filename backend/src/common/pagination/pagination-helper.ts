export interface PaginatedResult<T> {
    data: T[];
    meta: PaginationMeta;
  }
  
  export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }
  
  export function paginate<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedResult<T> {
    const totalPages = Math.ceil(total / limit);
  
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
  
  export function getPaginationParams(page: number = 1, limit: number = 10) {
    return {
      skip: (page - 1) * limit,
      take: limit,
    };
  }
  