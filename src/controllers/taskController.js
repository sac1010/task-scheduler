import Task from '../models/task.js';

const createTask = async (req, res) => {
  try {
    const { title, description, due_date } = req.body;
    const userId = req.user.id; 

    // Calculate priority based on due date
    let priority;
    const currentDate = new Date();
    const dueDate = new Date(due_date);

    const diffInDays = Math.ceil((dueDate - currentDate) / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) {
      priority = 0;
    } else if (diffInDays <= 2) {
      priority = 1;
    } else if (diffInDays <= 4) {
      priority = 2;
    } else {
      priority = 3;
    }

    const newTask = new Task({ title, description, due_date, user: userId, priority });

    await newTask.save();

    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const getAllUserTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    // Filter criteria
    const filterCriteria = { user: userId };

    // Apply priority filter if provided
    if (req.query.priority) {
      filterCriteria.priority = req.query.priority;
    }

    if (req.query.status) {
      filterCriteria.status = req.query.status;
    }

    // Apply due date filter if provided
    if (req.query.due_date) {
      filterCriteria.due_date = { $lte: new Date(req.query.due_date) };
    }

    // Pagination
    const perPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * perPage;

    // Fetch tasks matching the filter criteria with pagination
    const tasks = await Task.find(filterCriteria)
      .limit(perPage)
      .skip(skip)
      .populate('subTasks') 
      .exec();

    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Controller method to update task (due_date, status)
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { due_date, status } = req.body;

    // Validate if due_date is provided and in valid format
    if (due_date && !Date.parse(due_date)) {
      return res.status(400).json({ message: 'Invalid due date format' });
    }

    // Validate if status is valid
    if (status !== 'TODO' && status !== 'DONE') {
      return res.status(400).json({ message: 'Invalid status. Status must be either "TODO" or "DONE"' });
    }

    // Find the existing task
    const existingTask = await Task.findById(taskId);

    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Calculate new priority if due date is changed
    let priority = existingTask.priority;
    if (due_date && existingTask.due_date !== due_date) {
      const currentDate = new Date();
      const newDueDate = new Date(due_date);
      const diffInDays = Math.ceil((newDueDate - currentDate) / (1000 * 60 * 60 * 24));
      if (diffInDays === 0) {
        priority = 0;
      } else if (diffInDays <= 2) {
        priority = 1;
      } else if (diffInDays <= 4) {
        priority = 2;
      } else {
        priority = 3;
      }
    }

    // Update task with new values
    existingTask.due_date = due_date || existingTask.due_date;
    existingTask.status = status || existingTask.status;
    existingTask.priority = priority;

    // Save the updated task
    const updatedTask = await existingTask.save();

    res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    
    // Soft delete task by ID
    const task = await Task.findByIdAndUpdate(taskId, { deleted_at: new Date() });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task soft deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


export default {
  createTask,
  getAllUserTasks,
  updateTask,
  deleteTask
};
