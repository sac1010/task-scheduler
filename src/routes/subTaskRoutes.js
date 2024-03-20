import express from 'express';
import subTaskController from '../controllers/subTaskController.js';
import authMiddleware from '../utils/authMiddleWare.js';

const router = express.Router();

router.use(authMiddleware);

// Route to create a subtask
router.post('/', subTaskController.createSubTask);

// Route to update subtask status
router.put('/:subTaskId', subTaskController.updateSubTaskStatus);

// Route to soft delete a subtask
router.delete('/:subTaskId', subTaskController.deleteSubTask);

// Route to find all subtasks by taskId
router.get('/task/:taskId', subTaskController.findAllSubTasksByTaskId);

export default router;
