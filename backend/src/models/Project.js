const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project creator is required']
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true
  }
);

// Ensure creator is automatically added to members list if not already present
projectSchema.pre('save', function (next) {
  if (this.isNew && this.createdBy) {
    const creatorIdStr = this.createdBy.toString();
    const exists = this.members.some((m) => m.toString() === creatorIdStr);
    if (!exists) {
      this.members.push(this.createdBy);
    }
  }
  next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
