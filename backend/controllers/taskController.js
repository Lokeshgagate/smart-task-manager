const { tasks } = require("../data/store");

// Helper function to verify if task dependencies are completed
const areDependenciesCompleted = (depIds) => {
  if (!depIds || depIds.length === 0) return true;
  return depIds.every((depId) => {
    const parentTask = tasks.find((t) => t.id === depId);
    return parentTask && parentTask.status === "Done";
  });
};

// 1. Create a Task
exports.createTask = (req, res) => {
  const { title, description, priority, status, assignedTo, dependencies } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const newTask = {
    id: Date.now().toString(),
    title,
    description: description || "",
    priority: priority || "Medium",
    status: status || "To Do",
    assignedTo: assignedTo || null,
    dependencies: dependencies || []
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
};

// 2. Get All Tasks (Optional priority filter: ?priority=High)
exports.getAllTasks = (req, res) => {
  const { priority } = req.query;
  let result = tasks;
  if (priority) {
    result = result.filter((t) => t.priority.toLowerCase() === priority.toLowerCase());
  }
  res.json(result);
};

// 3. Get Blocked Tasks
exports.getBlockedTasks = (req, res) => {
  const blockedTasks = tasks.filter((task) => {
    return task.status !== "Done" && !areDependenciesCompleted(task.dependencies);
  });
  res.json(blockedTasks);
};

// 4. Get User Specific Tasks
exports.getMyTasks = (req, res) => {
  const { userId } = req.params;
  const userTasks = tasks.filter((t) => t.assignedTo === userId);
  res.json(userTasks);
};

// 5. Update Task (With Dependency Check Logic)
exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, priority, status, assignedTo, dependencies } = req.body;

  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  const currentTask = tasks[taskIndex];
  const newDependencies = dependencies !== undefined ? dependencies : currentTask.dependencies;
  const newStatus = status !== undefined ? status : currentTask.status;

  // Rule: Cannot mark as 'Done' if dependencies are incomplete
  if (newStatus === "Done" && !areDependenciesCompleted(newDependencies)) {
    return res.status(400).json({
      message: "Cannot mark task as Done until all dependent tasks are completed!"
    });
  }

  tasks[taskIndex] = {
    ...currentTask,
    ...(title && { title }),
    ...(description && { description }),
    ...(priority && { priority }),
    status: newStatus,
    ...(assignedTo && { assignedTo }),
    dependencies: newDependencies
  };

  res.json(tasks[taskIndex]);
};

// 6. Delete Task
exports.deleteTask = (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks.splice(index, 1);
  res.json({ message: "Task deleted successfully" });
};