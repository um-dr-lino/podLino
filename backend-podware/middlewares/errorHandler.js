// middlewares/errorHandler.js
// Handler central de erros da API. Sempre responde em JSON.
const { error: errorResponse } = require('./apiResponse');

module.exports = (err, req, res, next) => {
    const status = err.status || 500;

    if (status >= 500) {
        console.error(err);
    }

    return errorResponse(
        res,
        err.message || 'Ocorreu um erro inesperado.',
        status,
        err.errors || []
    );
};
