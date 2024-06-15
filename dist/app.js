"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./modules/user/user.routes"));
const facility_route_1 = __importDefault(require("./modules/facility/facility.route"));
const booking_route_1 = __importDefault(require("./modules/booking/booking.route"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api', user_routes_1.default);
app.use('/api', facility_route_1.default);
app.use('/api', booking_route_1.default);
app.get('/', (req, res) => {
    res.send('Welcome to the Sports Facility Booking Platform API');
});
// Global error handler
app.use((err, req, res, next) => {
    console.error('Global Error:', err);
    res.status(500).json({
        success: false,
        message: 'Server error. Please try again later.',
        error: err.message,
    });
});
exports.default = app;
