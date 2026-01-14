export interface HttpRequestConfig {
  headers?: Record<string, string>
  params?: Record<string, unknown>
  timeout?: number
}

export interface HttpClient {
  setToken(token: string): void
  get<T>(url: string, config?: HttpRequestConfig): Promise<T>
  post<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T>
  put<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T>
  delete<T>(url: string, config?: HttpRequestConfig): Promise<T>
  patch<T>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T>
}
