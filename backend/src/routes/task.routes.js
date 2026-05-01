const express = require('express');
const { createTask, getTasks, updateTaskStatus, assignTask } = require('../controllers/task.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.post('/', authorize('ADMIN'), createTask);
router.get('/', getTasks);
router.put('/:id/status', updateTaskStatus); // Any assigned member can update status
router.put('/:id/assign', authorize('ADMIN'), assignTask);

module.exports = router;
