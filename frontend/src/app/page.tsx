'use client';

import { useState, useEffect } from 'react';
import { getUsers, getTasks, getMyTasks, getBlockedTasks, createTask, updateTask, deleteTask } from './lib/api';

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'all' | 'my' | 'blocked'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [dependencies, setDependencies] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [viewMode, selectedUser, priorityFilter]);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
      if (res.data.length > 0) setSelectedUser(res.data[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      let res;
      if (viewMode === 'my' && selectedUser) {
        res = await getMyTasks(selectedUser);
      } else if (viewMode === 'blocked') {
        res = await getBlockedTasks();
      } else {
        res = await getTasks(priorityFilter);
      }
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert('Title is required');
    try {
      await createTask({
        title,
        description,
        priority,
        status: 'To Do',
        assignedTo: assignedTo || selectedUser,
        dependencies,
      });
      setTitle('');
      setDescription('');
      setDependencies([]);
      fetchTasks();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    setErrorMsg('');
    try {
      await updateTask(taskId, { status: newStatus });
      fetchTasks();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header & Mock Auth */}
        <header className="flex justify-between items-center bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
          <div>
            <h1 className="text-2xl font-bold text-indigo-400">Smart Task Manager</h1>
            <p className="text-sm text-slate-400">In-Memory Real-time Collaboration Engine</p>
          </div>
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-slate-300">Mock User Login:</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
        </header>

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500 text-rose-400 p-4 rounded-lg text-center font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Task Creation Form */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-fit">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Task Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Task title..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Description..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-sm"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Assignee</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-sm"
                  >
                    <option value="">Default (Self)</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Dependencies (Select Tasks)</label>
                <select
                  multiple
                  value={dependencies}
                  onChange={(e) =>
                    setDependencies(Array.from(e.target.selectedOptions, (option) => option.value))
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-sm h-24"
                >
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} [{t.status}]
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400">Hold Ctrl/Cmd to select multiple dependencies</span>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg text-sm transition"
              >
                Add Task
              </button>
            </form>
          </div>

          {/* Task Listing View */}
          <div className="md:col-span-2 space-y-6">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    viewMode === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  All Tasks
                </button>
                <button
                  onClick={() => setViewMode('my')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    viewMode === 'my' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  My Tasks
                </button>
                <button
                  onClick={() => setViewMode('blocked')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    viewMode === 'blocked' ? 'bg-rose-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Blocked Tasks 🚫
                </button>
              </div>

              {viewMode === 'all' && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400">Priority:</span>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="bg-slate-700 border border-slate-600 rounded-lg text-xs px-2.5 py-1 text-slate-200"
                  >
                    <option value="">All</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              )}
            </div>

            {/* Task Cards */}
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 text-center text-slate-400 text-sm">
                  No tasks found in this view.
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-slate-100">{task.title}</h3>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                            task.priority === 'High'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : task.priority === 'Medium'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{task.description}</p>
                      {task.dependencies?.length > 0 && (
                        <p className="text-[11px] text-amber-400/80">
                          Depends on IDs: {task.dependencies.join(', ')}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="bg-slate-700 text-xs border border-slate-600 rounded-lg px-2.5 py-1.5 focus:outline-none"
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>

                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-xs bg-slate-700 hover:bg-rose-600/30 text-rose-400 px-3 py-1.5 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}