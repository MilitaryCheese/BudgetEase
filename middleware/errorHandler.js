const { ValidationError } = require('joi');

const errorHandler = (error, req, res, next) => {
    // Default error structure
    let status = 500;
    let data = {
        message: 'Internal Server Error',
    };

    // Validation errors (Joi)
    if (error instanceof ValidationError) {
        status = 400; // Bad Request
        data.message = error.message;
    }

    // Custom errors with `status` or `message`
    if (error.status) {
        status = error.status;
    }
    if (error.message) {
        data.message = error.message;
    }

    // Send JSON response
    res.status(status).json(data);
};

module.exports = errorHandler;
