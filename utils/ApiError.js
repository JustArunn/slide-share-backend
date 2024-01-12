class ApiError {
  constructor(statusCode, message) {
    this.message = message;
    this.statusCode = statusCode;
    this.success = false;
  }
}

module.exports = {
  ApiError,
};
