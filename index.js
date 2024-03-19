import express, { json } from "express";
import { connect } from "mongoose";
import { dbURI } from "./config";
import taskRoutes from "./src/routes/taskRoutes";
import subTaskRoutes from "./src/routes/subTaskRoutes";
import userRoutes from "./src/routes/userRoutes";
import updateTaskPriorities from "./src/cronJobs/priorityChange";
import makeVoiceCall from "./src/cronJobs/twilioVoiceCall";

// Initialize Express app
const app = express();

// Connect to MongoDB
connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    // Start priority change cron job
    setInterval(updateTaskPriorities, 24 * 60 * 60 * 1000); // Run every 24 hours
    // Start twilio voice call cron job
    setInterval(makeVoiceCall, 24 * 60 * 60 * 1000); // Run every 24 hours
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(json());

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/subtasks", subTaskRoutes);
app.use("/api/users", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
