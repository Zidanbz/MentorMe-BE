const HTTPStatus = {
    OK: { code: 200, message: 'OK' },
    CREATED: { code: 201, message: 'Created' },
    BAD_REQUEST: { code: 400, message: 'Bad Request' },
    UNAUTHORIZED: { code: 401, message: 'Unauthorized' },
    NOT_FOUND: { code: 404, message: 'Not Found' },
    INTERNAL_SERVER_ERROR: { code: 500, message: 'Internal Server Error' },
    FORBIDDEN: { code: 403, message: 'Forbidden' },
}

module.exports = HTTPStatus;