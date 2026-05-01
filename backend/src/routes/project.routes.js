const express = require('express');
const { createProject, getProjects, getProjectById, addMemberToProject } = require('../controllers/project.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.post('/', authorize('ADMIN'), createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/:projectId/members', authorize('ADMIN'), addMemberToProject);

module.exports = router;
