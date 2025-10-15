export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super("Um erro interno nao esperado", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Entre em contato com suporte";
    this.statusCode = statusCode;
  }

  toJSON() {
    return {
      message: this.message,
      name: this.name,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  constructor({ cause, message }) {
    super(message || "Serviço indisponivel no momento", {
      cause,
    });
    this.name = "Service Error";
    this.action = "Entre em contato com suporte";
    this.statusCode = 503;
  }

  toJSON() {
    return {
      message: this.message,
      name: this.name,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ValidateError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Um erro de validaçao ocorreu", {
      cause,
    });
    this.name = "Validate Error";
    this.action = action || "Entre em contato com suporte";
    this.statusCode = 400;
  }

  toJSON() {
    return {
      message: this.message,
      name: this.name,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class NotFoundError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Um erro foi reportado", {
      cause,
    });
    this.name = "NotFoundError";
    this.action = action || "Verifique se o username está correto";
    this.statusCode = 404;
  }

  toJSON() {
    return {
      message: this.message,
      name: this.name,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
export class NotAllowedMethodError extends Error {
  constructor() {
    super("Metodo nao permitido nesse endpoint");
    this.name = "MethodNotAllowedError";
    this.action = "Use o metodo GET";
    this.statusCode = 405;
  }

  toJSON() {
    return {
      message: this.message,
      name: this.name,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
