"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
const app_1 = __importDefault(require("./app"));
let server;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure DB URL and Port are available
        if (!config_1.default.db_url || !config_1.default.port) {
            throw new Error('Database URL and Port must be defined in the config');
        }
        // Connect to MongoDB
        yield mongoose_1.default.connect(config_1.default.db_url);
        console.log('Database connected successfully');
        // Start the Express server
        server = app_1.default.listen(config_1.default.port, () => {
            console.log(`Server running on port ${config_1.default.port}`);
        });
    }
    catch (error) {
        console.error('Error connecting to the database', error);
        process.exit(1); // Exit process with failure
    }
});
startServer();
// Shutdown handling
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    if (server) {
        server.close(() => {
            console.log('HTTP server closed');
            // Closing the mongoose connection properly
            mongoose_1.default.connection
                .close()
                .then(() => {
                console.log('MongoDB connection closed');
                process.exit(0); // Exit
            })
                .catch((err) => {
                console.error('Error closing MongoDB connection', err);
                process.exit(1); // Exit with error
            });
        });
    }
});
