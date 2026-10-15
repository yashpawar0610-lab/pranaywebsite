const mongoose = require('mongoose');

const workoutProgramSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    required: true,
    enum: ['weight_training', 'muscle_building', 'fat_loss', 'cardio', 'strength', 'functional', 'beginner', 'flexibility']
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  duration: {
    type: Number,
    required: true,
    comment: 'Duration in minutes'
  },
  daysPerWeek: { type: Number, default: 3 },
  targetArea: [{ type: String }],
  exercises: [{
    name: { type: String, required: true },
    sets: { type: Number },
    reps: { type: String },
    duration: { type: String },
    restTime: { type: String }
  }],
  image: { type: String, default: '' },
  calories: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  enrolledUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

module.exports = mongoose.model('WorkoutProgram', workoutProgramSchema);
