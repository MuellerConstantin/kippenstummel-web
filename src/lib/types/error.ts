export interface ErrorDto {
  code: string;
  timestamp: string;
  message: string;
  path: string;
  details?: Record<string, unknown>[];
}
