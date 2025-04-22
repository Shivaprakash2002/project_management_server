const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/auth');
const { createProject, getProjects, updateProject, deleteProject } = require('../models/Project');

router.get('/', authenticate, async (req, res) => {
  const { search = '' } = req.query;
  const projects = await getProjects(search);
  res.json(projects);
});

router.post('/', authenticate, isAdmin, async (req, res) => {
  const { name, description } = req.body;
  const project = await createProject(name, description);
  req.io.emit('projectCreated', project);
  res.json(project);
});

router.put('/:id', authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const project = await updateProject(id, name, description);
  req.io.emit('projectUpdated', project);
  res.json(project);
});

router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;
  await deleteProject(id);
  req.io.emit('projectDeleted', { id });
  res.json({ message: 'Project deleted' });
});

module.exports = router;