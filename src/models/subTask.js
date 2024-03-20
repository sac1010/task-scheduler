import mongoose from 'mongoose';

const subTaskSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title of the subtask
  task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  status: { type: Number, enum: [0, 1], default: 0 }, // 0 for incomplete, 1 for complete
  deleted_at: { type: Date }
}, { timestamps: true });

const SubTask = mongoose.model('SubTask', subTaskSchema);

export default SubTask;
