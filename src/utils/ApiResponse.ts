import { StatusCodes } from "http-status-codes";

interface ApiResponse {
  statusCode: StatusCodes;
  data?: any;
  meta?: any;
  message: string;
  success?: boolean;
}

class ApiResponse {
  constructor({
    statusCode,
    data,
    meta,
    message = "Success",
    success,
  }: ApiResponse) {
    this.statusCode = statusCode;
    this.data = data;
    this.meta = meta;
    this.message = message;
    this.success = success || statusCode < 400;
  }
}

export { ApiResponse };
