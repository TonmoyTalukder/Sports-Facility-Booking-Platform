"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Port = process.env.PORT || '5000';
const DB_url = process.env.DB_URL || 'mongodb+srv://apollo-flix:y8wLJk7UgjcvMV1k@traversymedia.a77qb.mongodb.net/?retryWrites=true&w=majority&appName=TraversyMedia';
if (!DB_url) {
    console.warn("Warning: DB_URL environment variable is not set. Using default.");
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
