import express, { json } from "express";
import { connect } from "mongoose";
import cron from 'node-cron';
import taskRoutes from "./src/routes/taskRoutes.js";
import subTaskRoutes from "./src/routes/subTaskRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import updateTaskPriorities from "./src/cron/priorityChange.js";
// import makeVoiceCall from "./src/cronJobs/twilioVoiceCall";
import "dotenv/config";
import { dbURI } from "./config.js";
import { scheduleVoiceCalls } from "./src/cron/twilio.js";


const app = express();

// Connect to MongoDB
connect(dbURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error("MongoDB connection error:", err));

  cron.schedule('0 0 * * *', () => {
    updateTaskPriorities();
  });

  cron.schedule('0 10,17 * * *', async () => {
    scheduleVoiceCalls();
  });

  // initiateVoiceCall(918281810887, 2)
  

app.use(json());

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/subtasks", subTaskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// });


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
