import mongoose from 'mongoose';
import config from './config';
import app from './app';
import { Server } from 'http';


let server: Server;

const startServer = async () => {
  try {
    // Ensure DB URL and Port are available
    if (!config.db_url || !config.port) {
      throw new Error("Database URL and Port must be defined in the config");
    }

    // Connect to MongoDB
    await mongoose.connect(config.db_url);
    console.log('Database connected successfully');

    // Start the Express server
    server = app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Error connecting to the database', error);
    process.exit(1); // Exit process with failure
  }
};

startServer();

// Shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  if (server) {
    server.close(() => {
      console.log('HTTP server closed');
      
      // Closing the mongoose connection properly
      mongoose.connection.close()
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
