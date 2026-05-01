const prisma = require('../prisma');

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const project = await prisma.project.create({
      data: {
        name,
        description,
        members: {
          connect: { id: req.user.id }
        }
      },
    });
    
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating project' });
  }
};

exports.getProjects = async (req, res) => {
  try {
    // If Admin, get all projects. If member, get projects they are part of.
    let projects;
    if (req.user.role === 'ADMIN') {
      projects = await prisma.project.findMany({
        include: { members: { select: { id: true, name: true, email: true } }, tasks: true }
      });
    } else {
      projects = await prisma.project.findMany({
        where: {
          members: {
            some: { id: req.user.id }
          }
        },
        include: { members: { select: { id: true, name: true, email: true } }, tasks: true }
      });
    }
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching projects' });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        members: { select: { id: true, name: true, email: true, role: true } },
        tasks: { include: { assignee: { select: { id: true, name: true } } } }
      }
    });

    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching project' });
  }
};

exports.addMemberToProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email } = req.body;

    const userToAdd = await prisma.user.findUnique({ where: { email } });
    if (!userToAdd) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(projectId) },
      data: {
        members: {
          connect: { id: userToAdd.id }
        }
      },
      include: { members: { select: { id: true, name: true, email: true } } }
    });

    res.json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error adding member' });
  }
};
