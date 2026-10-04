// In-Memory Data Store

const users = [
  { id: "1", name: "Aarav Sharma", email: "aarav.sharma@example.com" },
  { id: "2", name: "Priya Verma", email: "priya.verma@example.com" },
  { id: "3", name: "Rohan Mehta", email: "rohan.mehta@example.com" },
  { id: "4", name: "Ananya Gupta", email: "ananya.gupta@example.com" },
  { id: "5", name: "Vikram Singh", email: "vikram.singh@example.com" }
];

const tasks = [
  {
    id: "101",
    title: "Database Setup",
    description: "Initialize store.js data structure",
    priority: "High",
    status: "Done",
    assignedTo: "1",
    dependencies: []
  }
];

module.exports = {
  users,
  tasks
};