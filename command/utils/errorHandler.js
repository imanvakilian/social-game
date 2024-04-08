const createHttpError = require("http-errors");

function errorHandler(app) {
    app.use((req, res, next) => {
        next(createHttpError.NotFound("page not found"));
    });
    app.use((err, req, res, next) => {
        const internalError = createHttpError.InternalServerError();
        const status = err.statusCode || internalError.statusCode;
        const message = err.message || internalError.message;
        return res.status(status).json({
            status,
            message,
        })
    })
}

module.exports = errorHandler;