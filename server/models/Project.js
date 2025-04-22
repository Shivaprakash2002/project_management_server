const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  created_at: { type: Date, default: Date.now },
});

const Project = mongoose.model('Project', projectSchema);

const createProject = async (name, description) => {
  const project = new Project({ name, description });
  return await project.save();
};

const getProjects = async (search = '') => {
  const regex = new RegExp(search, 'i');
  return await Project.find({
    $or: [{ name: regex }, { description: regex }],
  });
};

const updateProject = async (id, name, description) => {
  return await Project.findByIdAndUpdate(
    id,
    { name, description },
    { new: true }
  );
};

const deleteProject = async (id) => {
  await Project.findByIdAndDelete(id);
};

module.exports = { createProject, getProjects, updateProject, deleteProject };