import express from 'express';
import taskController from '../controllers/taskController.js';
import authMiddleware from '../utils/authMiddleWare.js';

const router = express.Router();

router.use(authMiddleware);

// Route to create a new task
router.post('/', taskController.createTask);

// Route to get all user tasks with filters (priority, due date, pagination)
router.get('/', taskController.getAllUserTasks);

// Route to update task (due_date, status)
router.put('/:taskId', taskController.updateTask);

// Route to soft delete a task
router.delete('/:taskId', taskController.deleteTask);

export default router;
