export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T | null;
}

export interface ListResponseData<T> {
  total: number;
  page_size: number;
  page_from: number;
  data: T[];
}

export interface GetListPayload {
  resource: string;
  page_size: number;
  page_from: number;
  query?: Record<string, any>;
  sort?: Array<{ field: string; order: 'asc' | 'desc' }>;
}

export interface CreatePayload<T> {
  resource: string;
  payload: T;
}

export interface UpdatePayload<T> {
  resource: string;
  id: string;
  payload: Partial<T>;
}
