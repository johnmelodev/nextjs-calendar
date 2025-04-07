export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";

    // Capturar stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string): ApiError {
    return new ApiError(400, message);
  }

  static unauthorized(message: string = "Não autorizado"): ApiError {
    return new ApiError(401, message);
  }

  static forbidden(message: string = "Acesso proibido"): ApiError {
    return new ApiError(403, message);
  }

  static notFound(message: string = "Recurso não encontrado"): ApiError {
    return new ApiError(404, message);
  }

  static conflict(message: string): ApiError {
    return new ApiError(409, message);
  }

  static internalServer(
    message: string = "Erro interno do servidor"
  ): ApiError {
    return new ApiError(500, message);
  }
}
