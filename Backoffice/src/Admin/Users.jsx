import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../api';
import { Pencil, Trash2, Plus, Users as UsersIcon, X, Shield, CheckCircle } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailUser, setDetailUser] = useState(null);
  const [isImageFullScreen, setIsImageFullScreen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
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

  const handleDelete = (id) => {
    setUserToDelete(id);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete);
      alert('User deleted successfully');
      fetchUsers();
    } catch (error) {
      alert('Failed to delete user');
    } finally {
      setUserToDelete(null);
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
                <tr 
                  key={user.userID} 
                  className="cursor-pointer hover:bg-white/[0.06] transition-colors"
                  onClick={() => setDetailUser(user)}
                >
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
                        onClick={(e) => {
                          e.stopPropagation();
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(user.userID);
                        }}
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
          <div className="w-full max-w-lg cyan-panel-3d p-6 sm:p-8 relative z-50 text-white animate-in fade-in zoom-in duration-200">
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
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 input-3d text-sm"
                  required
                >
                  <option value="" disabled className="bg-[#0b1437] text-slate-400">Select Role</option>
                  <option value="admin" className="bg-[#0b1437] text-white">admin</option>
                  <option value="user" className="bg-[#0b1437] text-white">user</option>
                </select>
              </div>

              {selectedUser && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">User Access Status (active / inactive)</label>
                  <select
                    value={formData.userAccess}
                    onChange={(e) => setFormData({ ...formData, userAccess: e.target.value })}
                    className="w-full px-3.5 py-2.5 input-3d text-sm"
                    required
                  >
                    <option value="" disabled className="bg-[#0b1437] text-slate-400">Select Status</option>
                    <option value="active" className="bg-[#0b1437] text-white">active</option>
                    <option value="inactive" className="bg-[#0b1437] text-white">inactive</option>
                  </select>
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

      {/* User Detail Modal */}
      {detailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="blur-background" onClick={() => setDetailUser(null)} />
          <div className="w-full max-w-sm cyan-panel-3d p-5 sm:p-6 relative z-50 text-white animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setDetailUser(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-5 pb-2.5 border-b border-white/10 flex items-center space-x-2">
              <UsersIcon className="w-5 h-5 text-sky-400" />
              <span>User Details</span>
            </h3>

            <div className="flex flex-col items-center text-center mb-5">
              <div className="relative mb-2.5">
                {detailUser.userImage ? (
                  <img 
                    src={detailUser.userImage} 
                    alt="" 
                    className="w-28 h-28 rounded-full border-[3px] border-sky-400 object-cover cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-sky-500/20" 
                    onClick={() => setIsImageFullScreen(true)}
                  />
                ) : (
                  <div 
                    className="w-28 h-28 rounded-full bg-sky-500/20 border-[3px] border-sky-500/40 text-sky-300 font-bold flex items-center justify-center text-5xl cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-sky-500/20"
                    onClick={() => setIsImageFullScreen(true)}
                  >
                    {detailUser.userName?.charAt(0) || 'U'}
                  </div>
                )}
                <span className={`absolute bottom-0 right-0 px-2 py-0.5 text-[9px] uppercase font-bold rounded-full shadow-lg ${
                  detailUser.userAccess === 'active' ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                }`}>
                  {detailUser.userAccess || 'pending'}
                </span>
              </div>
              <h4 className="text-lg font-bold text-white">{detailUser.userName}</h4>
              <p className="text-xs text-sky-400 font-medium">{detailUser.userEmail}</p>
            </div>

            <div className="space-y-2.5 p-4 rounded-2xl bg-[#0b1437]/70 border border-white/5 text-xs mb-5">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">User ID:</span>
                <span className="text-slate-200 font-mono">#{detailUser.userID}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Mobile:</span>
                <span className="text-slate-200 font-mono">{detailUser.userMobile || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Enrollment:</span>
                <span className="text-slate-200 font-mono">{detailUser.enrollment || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">System Role:</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  detailUser.role === 'admin'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                }`}>
                  {detailUser.role || 'user'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2.5 pt-3.5 border-t border-white/10">
              <button
                onClick={() => {
                  const targetUser = detailUser;
                  setDetailUser(null);
                  setSelectedUser(targetUser);
                  setFormData(targetUser);
                  setIsModalOpen(true);
                }}
                className="flex-1 py-2 px-1.5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 hover:text-white rounded-none text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-lg shadow-sky-500/5"
              >
                <Pencil size={13} />
                <span>Edit User</span>
              </button>

              <button
                onClick={() => {
                  const targetId = detailUser.userID;
                  setDetailUser(null);
                  handleDelete(targetId);
                }}
                className="flex-1 py-2 px-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-white rounded-none text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-lg shadow-rose-500/5"
              >
                <Trash2 size={13} />
                <span>Delete User</span>
              </button>

              <button
                onClick={() => setDetailUser(null)}
                className="py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white rounded-none text-xs font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="blur-background" onClick={() => setUserToDelete(null)} />
          <div className="w-full max-w-sm cyan-panel-3d p-6 relative z-50 text-white animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-white mb-4 pb-3 border-b border-white/10 flex items-center space-x-2">
              <Trash2 className="w-5 h-5 text-rose-500" />
              <span>Confirm Deletion</span>
            </h3>
            <p className="text-sm text-slate-300 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="btn-3d-glass px-4 py-2 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn-3d-danger px-5 py-2 text-xs font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Image Modal */}
      {isImageFullScreen && detailUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="blur-background" onClick={() => setIsImageFullScreen(false)} />
          <div className="relative z-[60] animate-in fade-in zoom-in duration-200 flex flex-col items-center">
            <div className="cyan-panel-3d p-2 rounded-[1.5rem] overflow-hidden shadow-2xl relative">
              <button
                onClick={() => setIsImageFullScreen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors z-10 backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
              {detailUser.userImage ? (
                <img 
                  src={detailUser.userImage} 
                  alt="" 
                  className="w-[85vw] max-w-xl aspect-square object-cover rounded-[1.25rem]" 
                />
              ) : (
                <div className="w-[85vw] max-w-xl aspect-square rounded-[1.25rem] bg-[#0b1437] text-sky-300 font-bold flex items-center justify-center text-[10rem]">
                  {detailUser.userName?.charAt(0) || 'U'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
