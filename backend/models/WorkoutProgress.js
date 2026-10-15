const mongoose = require('mongoose');

const workoutProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutProgram',
    default: null
  },
  date: { type: Date, default: Date.now },
  duration: { type: Number, comment: 'Duration in minutes' },
  caloriesBurned: { type: Number, default: 0 },
  exercisesCompleted: [{ type: String }],
  notes: { type: String, default: '' },
  weight: { type: Number, default: null },
  mood: {
    type: String,
    enum: ['great', 'good', 'okay', 'tired', 'bad', ''],
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('WorkoutProgress', workoutProgressSchema);
