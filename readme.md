# Task Manager

This is a backend application built using Node.js, Express, and MongoDB for managing tasks and subtasks. The application provides various APIs for creating, updating, and deleting tasks and subtasks, as well as fetching user tasks with filtering and pagination options. It also includes cron jobs for updating task priorities and performing voice calling using Twilio for overdue tasks.

## Features

- User authentication using JWT tokens.
- CRUD operations for tasks and subtasks.
- Filtering user tasks by priority, due date, and pagination.
- Soft deletion of tasks and subtasks.
- Cron jobs for updating task priorities and voice calling for overdue tasks.

## Requirements

- Node.js
- MongoDB
- npm or yarn

## Setup

1. Clone the repository:
2. Install dependencies:

3. Set up environment variables:

Create a `.env` file in the root directory and add the following environment variables:


Replace `your_jwt_secret`, `your_twilio_account_sid`, `your_twilio_auth_token`, and `your_twilio_phone_number` with your actual values.

4. Start the server:


The server will start running on port 3000 by default.

## API Documentation

### Authentication

- **POST /api/auth/login**: Login with email and password to obtain a JWT token.

### Users

- **POST /api/users/register**: Register a new user with email, password, phone number, and priority.

### Tasks

- **POST /api/tasks**: Create a new task with title, description, due date, and priority.
- **GET /api/tasks**: Get all user tasks with optional filtering and pagination.
- **PUT /api/tasks/:taskId**: Update task due date and status (TODO/DONE).
- **DELETE /api/tasks/:taskId**: Soft delete a task.

### Subtasks

- **POST /api/subtasks**: Create a new subtask with title and task ID.
- **PUT /api/subtasks/:subTaskId**: Update subtask status (0/1).
- **DELETE /api/subtasks/:subTaskId**: Soft delete a subtask.

## Cron Jobs

- **Priority Change**: Updates task priorities based on due dates.
- **Voice Calling**: Calls users for overdue tasks based on priority.


