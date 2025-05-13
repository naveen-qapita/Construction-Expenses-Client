import axios, { AxiosError, type AxiosResponse } from "axios";
import { API_BASE_URL } from "./apiConfig";

export abstract class BaseService<TCreate, TUpdate, TResponse> {
  protected readonly resourceUrl: string;

  constructor(resourcePath: string) {
    this.resourceUrl = `${API_BASE_URL}/${resourcePath}`;
  }

  protected async handleRequest<T>(
    request: Promise<AxiosResponse<T>>
  ): Promise<T> {
    try {
      const response = await request;
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  protected handleError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      console.error("API Error:", {
        message: axiosError.message,
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      });
    } else {
      console.error("Unexpected Error:", error);
    }
  }

  getAll(): Promise<TResponse[]> {
    return this.handleRequest(axios.get(this.resourceUrl));
  }

  getSingle(id: string): Promise<TResponse> {
    return this.handleRequest(axios.get(`${this.resourceUrl}/${id}`));
  }

  create(body: TCreate): Promise<TResponse> {
    return this.handleRequest(axios.post(this.resourceUrl, body));
  }

  update(id: string, body: TUpdate): Promise<TResponse> {
    return this.handleRequest(axios.put(`${this.resourceUrl}/${id}`, body));
  }
}
