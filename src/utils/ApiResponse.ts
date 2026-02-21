import { StatusCodes } from "http-status-codes";

interface ApiResponse {
  statusCode: StatusCodes;
  data?: any;
  message: string;
  success?: boolean;
}

class ApiResponse {
  constructor({ statusCode, data, message = "Success", success }: ApiResponse) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = success || statusCode < 400;
  }
}

export { ApiResponse };
