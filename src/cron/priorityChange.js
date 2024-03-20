import Task from '../models/task.js';


const updateTaskPriorities = async () => {
  try {
    const tasks = await Task.find({ due_date: { $exists: true } });

    // Update priorities based on due dates
    tasks.forEach(async task => {
      let priority = 0;
      const dueDate = new Date(task.due_date);
      const currentDate = new Date();

      const diffInDays = Math.ceil((dueDate - currentDate) / (1000 * 60 * 60 * 24));

      // Assign priority based on due date
      if (diffInDays === 0) {
        priority = 0;
      } else if (diffInDays <= 2) {
        priority = 1;
      } else if (diffInDays <= 4) {
        priority = 2;
      } else {
        priority = 3;
      }

      // Update task priority
      task.priority = priority;
      await task.save();
    });
  } catch (error) {
    console.error('Error updating task priorities:', error);
  }
};

export default updateTaskPriorities;
