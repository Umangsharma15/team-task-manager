const prisma = require('../prisma');

exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, projectId, assigneeId } = req.body;
    
    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: parseInt(projectId),
        assigneeId: assigneeId ? parseInt(assigneeId) : null,
      },
      include: { assignee: { select: { id: true, name: true } } }
    });
    
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating task' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    // Member only sees their assigned tasks, admin sees all
    let tasks;
    if (req.user.role === 'ADMIN') {
      tasks = await prisma.task.findMany({
        include: { project: { select: { id: true, name: true } }, assignee: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      tasks = await prisma.task.findMany({
        where: { assigneeId: req.user.id },
        include: { project: { select: { id: true, name: true } }, assignee: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' }
      });
    }
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching tasks' });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "TODO", "IN_PROGRESS", "DONE"

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { status },
      include: { assignee: { select: { id: true, name: true } }, project: { select: { id: true, name: true } } }
    });

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating task' });
  }
};

exports.assignTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { assigneeId } = req.body;

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { assigneeId: parseInt(assigneeId) },
      include: { assignee: { select: { id: true, name: true } }, project: { select: { id: true, name: true } } }
    });

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error assigning task' });
  }
};
