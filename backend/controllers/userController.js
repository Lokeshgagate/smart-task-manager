const { users } = require("../data/store");

exports.getAllUsers = (req, res) => {
  res.json(users);
};

exports.createUser = (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email
  };

  users.push(newUser);
  res.status(201).json(newUser);
};