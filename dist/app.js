"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const globalErrorhandler_1 = __importDefault(require("./middleware/globalErrorhandler"));
const notFound_1 = __importDefault(require("./middleware/notFound"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// Parsers
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api', routes_1.default);
app.get('/', (req, res) => {
    res.send('Welcome to the Sports Facility Booking Platform API');
});
// Global error handler
app.use(globalErrorhandler_1.default);
// Not Found handler middleware
app.use(notFound_1.default);
exports.default = app;
