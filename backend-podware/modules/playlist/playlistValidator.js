const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const firstError = errors.array()[0].msg;
    const error = new Error(firstError);
    error.status = 400;
    error.errors = errors.array();
    throw error;
};

exports.createPlaylistValidator = [
    body("title")
        .trim()
        .notEmpty().withMessage("O título da playlist é obrigatório.")
        .isLength({ min: 3, max: 100 }).withMessage("O título da playlist deve ter entre 3 e 100 caracteres."),
    body("description")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 500 }).withMessage("A descrição da playlist não pode exceder 500 caracteres."),
    validate
];
