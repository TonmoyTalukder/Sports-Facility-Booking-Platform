"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const Port = process.env.PORT || '5000';
const DB_url = process.env.DB_URL;
if (!DB_url) {
    console.warn('Warning: DB_URL environment variable is not set. Using default.');
}
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
}
exports.default = {
    port: Port,
    db_url: DB_url,
    jwt_secret: jwtSecret,
};
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next(); // Proceed if validation passes
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errorMessages = error.errors.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
            }));
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: 'Validation Error',
                errorMessages,
                stack: error.stack,
            });
        }
        next(error); // Pass other types of errors to the global error handler
    }
};
exports.validate = validate;
