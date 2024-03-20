import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  due_date: { type: Date, required: true },
  priority: { type: Number, default: 0, min: 0, max: 3 },
  status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'DONE'], default: 'TODO' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubTask' }],
  deleted_at: { type: Date }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;
