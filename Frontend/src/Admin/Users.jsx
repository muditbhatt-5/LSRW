import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../api';
import { Pencil, Trash2, Plus, Users as UsersIcon, X, Shield, CheckCircle } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    userName: '',
    userMobile: '',
    userEmail: '',
    userImage: '',
    enrollment: '',
    password: '',
    role: '',
    userAccess: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      alert('Failed to fetch users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        await updateUser(selectedUser.userID, { ...formData, userID: selectedUser.userID });
        alert('User updated successfully');

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.userID === selectedUser.userID ? { ...user, ...formData } : user
          )
        );
      } else {
        const response = await createUser(formData);
        alert('User created successfully');

        setUsers((prevUsers) => [...prevUsers, response.data]);
      }

      setIsModalOpen(false);
      setSelectedUser(null);
      setFormData({
        userName: '',
        userMobile: '',
        userEmail: '',
        userImage: '',
        enrollment: '',
        password: '',
        role: '',
        userAccess: ''
      });
    } catch (error) {
      alert(selectedUser ? 'Failed to update user' : 'Failed to create user');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        alert('User deleted successfully');
        fetchUsers();
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Title & Add User Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-white/10 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20 border border-white/20">
            <UsersIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">User Management</h2>
            <p className="text-xs text-slate-400">View, add, update, and modify access roles</p>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedUser(null);
            setFormData({
              userName: '',
              userMobile: '',
              userEmail: '',
              userImage: '',
              enrollment: '',
              password: '',
              role: '',
              userAccess: ''
            });
            setIsModalOpen(true);
          }}
          className="btn-3d-cyan px-5 py-2.5 flex items-center space-x-2 text-sm font-semibold shadow-lg"
        >
          <Plus size={18} />
          <span>Add New User</span>
        </button>
      </div>

      {/* 3D Glass Data Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/40 backdrop-blur-md shadow-2xl">
        <table className="table-3d">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Enrollment</th>
              <th>Role</th>
              <th>User Access</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-slate-400">
                  No user records found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.userID}>
                  <td className="font-semibold text-white">
                    <div className="flex items-center space-x-3">
                      {user.userImage ? (
                        <img src={user.userImage} alt="" className="w-8 h-8 rounded-full border border-sky-400 object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 font-bold flex items-center justify-center text-xs">
                          {user.userName?.charAt(0) || 'U'}
                        </div>
                      )}
                      <span>{user.userName}</span>
                    </div>
                  </td>
                  <td className="font-mono text-xs text-slate-300">{user.userMobile}</td>
                  <td className="text-slate-300">{user.userEmail}</td>
                  <td className="font-mono text-xs text-sky-400">{user.enrollment}</td>
                  <td>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                      user.role === 'admin'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    }`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                      user.userAccess === 'active'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {user.userAccess || 'pending'}
                    </span>
                  </td>
                  <td>
                    <div className="flex space-x-2 justify-end">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setFormData(user);
                          setIsModalOpen(true);
                        }}
                        className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 hover:text-white transition-colors"
                        title="Edit User"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.userID)}
                        className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:text-white transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 3D Glass Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="blur-background" onClick={() => setIsModalOpen(false)} />
          <div className="w-full max-w-lg glass-modal-3d p-6 sm:p-8 relative z-50 text-white animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-6 pb-3 border-b border-white/10">
              {selectedUser ? 'Edit User Credentials' : 'Create New User Account'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="w-full px-3.5 py-2.5 input-3d text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={formData.userMobile}
                  onChange={(e) => setFormData({ ...formData, userMobile: e.target.value })}
                  className="w-full px-3.5 py-2.5 input-3d text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.userEmail}
                  onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 input-3d text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.userImage}
                  onChange={(e) => setFormData({ ...formData, userImage: e.target.value })}
                  className="w-full px-3.5 py-2.5 input-3d text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Enrollment Number</label>
                <input
                  type="text"
                  value={formData.enrollment}
                  onChange={(e) => setFormData({ ...formData, enrollment: e.target.value })}
                  className="w-full px-3.5 py-2.5 input-3d text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Role (admin / user)</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 input-3d text-sm"
                  required
                />
              </div>

              {selectedUser && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">User Access Status (active / inactive)</label>
                  <input
                    type="text"
                    value={formData.userAccess}
                    onChange={(e) => setFormData({ ...formData, userAccess: e.target.value })}
                    className="w-full px-3.5 py-2.5 input-3d text-sm"
                    required
                  />
                </div>
              )}

              {!selectedUser && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 input-3d text-sm"
                    required
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-3d-glass px-4 py-2 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-3d-cyan px-5 py-2 text-xs font-semibold"
                >
                  {selectedUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
