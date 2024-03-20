import Task from '../models/task.js';
import twilio from 'twilio';

// Initialize Twilio client with your Twilio credentials
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Function to initiate voice call using Twilio
const initiateVoiceCall = async (phoneNumber, priority) => {
  try {
    // Define TwiML instructions for the voice call
    let twiml = new twilio.twiml.VoiceResponse();
    twiml.say('This is an automated voice call from your task management system.');

    // Adjust voice call message based on priority
    if (priority === 0) {
      twiml.say('Your task has reached its due date today.');
    } else if (priority === 1) {
      twiml.say('Your task is approaching its due date.');
    } else if (priority === 2) {
      twiml.say('Your task due date is nearing.');
    } else {
      twiml.say('Your task due date is in the near future.');
    }

    // Make the voice call
    await client.calls.create({
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
      twiml: twiml.toString()
    });

    console.log('Voice call initiated successfully.');
  } catch (error) {
    console.error('Error initiating voice call:', error);
  }
};

// Function to schedule voice calls for overdue tasks based on user priority
export const scheduleVoiceCalls = async () => {
  try {
    // Find overdue tasks
    const currentDate = new Date();
    const overdueTasks = await Task.find({ due_date: { $lt: currentDate }, status: 'TODO' }).populate('user');

    // Group overdue tasks by user priority
    const tasksByPriority = {};
    overdueTasks.forEach(task => {
      const priority = task.user.priority;
      if (!tasksByPriority[priority]) {
        tasksByPriority[priority] = [];
      }
      tasksByPriority[priority].push(task);
    });

    // Schedule voice calls based on user priority
    for (let priority = 0; priority <= 2; priority++) {
      const tasks = tasksByPriority[priority];
      if (tasks && tasks.length > 0) {
        // Schedule voice call for the first task of this priority
        const task = tasks[0];
        await initiateVoiceCall(task.user.phone_number, priority);
        break; // Exit loop after scheduling the call for this priority
      }
    }
  } catch (error) {
    console.error('Error scheduling voice calls:', error);
  }
};