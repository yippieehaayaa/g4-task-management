import { AppError } from "@g4/error-handler";

class BadGatewayError extends AppError {
  constructor(message = "Bad Gateway", details?: unknown) {
    super(message, 502, details);
  }
}

class ServiceUnavailableError extends AppError {
  constructor(message = "Service Unavailable", details?: unknown) {
    super(message, 503, details);
  }
}

export { BadGatewayError, ServiceUnavailableError };
