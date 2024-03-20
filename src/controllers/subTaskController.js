import SubTask from '../models/subTask.js';
import Task from '../models/task.js';

// Controller method to create a subtask
const createSubTask = async (req, res) => {
  try {
    const { task_id, title } = req.body;

    // Create a new subtask
    const newSubTask = new SubTask({ task_id, title });
    await newSubTask.save();

    // Find the corresponding task and update its subTasks array
    const task = await Task.findById(task_id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    task.subTasks.push(newSubTask._id); // Add the new subtask's ID to the subTasks array
    await task.save();

    res.status(201).json({ message: 'Subtask created successfully', subTask: newSubTask });
  } catch (error) {
    console.error('Error creating subtask:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Controller method to update subtask status
const updateSubTaskStatus = async (req, res) => {
  try {
    const { subTaskId } = req.params;
    const { status } = req.body;

    const updatedSubTask = await SubTask.findByIdAndUpdate(subTaskId, { status }, { new: true });
    if (!updatedSubTask) {
      return res.status(404).json({ message: 'Subtask not found' });
    }

    res.status(200).json({ message: 'Subtask status updated successfully', subTask: updatedSubTask });
  } catch (error) {
    console.error('Error updating subtask status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const findAllSubTasksByTaskId = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Find all subtasks with the given taskId
    const subTasks = await SubTask.find({ task_id: taskId });

    res.status(200).json({ subTasks });
  } catch (error) {
    console.error('Error finding subtasks by taskId:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Controller method to soft delete a subtask
const deleteSubTask = async (req, res) => {
  try {
    const { subTaskId } = req.params;

    const deletedSubTask = await SubTask.findByIdAndUpdate(subTaskId, { deleted_at: new Date() });
    if (!deletedSubTask) {
      return res.status(404).json({ message: 'Subtask not found' });
    }

    res.status(200).json({ message: 'Subtask deleted successfully' });
  } catch (error) {
    console.error('Error deleting subtask:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default {
  createSubTask,
  updateSubTaskStatus,
  deleteSubTask,
  findAllSubTasksByTaskId
};
