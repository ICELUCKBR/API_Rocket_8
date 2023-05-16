class AppError {
  message;
  statusCode;

  constructor(message, statuscode = 400) {
    this.message = message;
    this.statusCode = statuscode;
  }
}

module.exports = AppError;
