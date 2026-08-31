import React, { useState, useEffect } from 'react';
import { getParagraphListeners, createParagraphListener, updateParagraphListener, deleteParagraphListener } from '../api';
import { Pencil, Trash2, Plus, Mic, X } from 'lucide-react';

const AdminParagraphListeners = () => {
  const [listeners, setListeners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListener, setSelectedListener] = useState(null);
  const [formData, setFormData] = useState({
    paragraph_Speak_UserName: '',
    paragraph_ReadID: 0,
    userID: 0,
    accuracy: ''
  });

  useEffect(() => {
    fetchListeners();
  }, []);

  const fetchListeners = async () => {
    try {
      const response = await getParagraphListeners();
      setListeners(response.data);
    } catch (error) {
      console.error('Failed to fetch paragraph listeners');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedListener) {
        await updateParagraphListener(selectedListener.paragraph_SpeakID, {
          ...formData,
          paragraph_SpeakID: selectedListener.paragraph_SpeakID
        });
      } else {
        await createParagraphListener(formData);
      }
      setIsModalOpen(false);
      fetchListeners();
    } catch (error) {
      console.error('Failed to save paragraph listener');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this paragraph listener?')) {
      try {
        await deleteParagraphListener(id);
        fetchListeners();
      } catch (error) {
        console.error('Failed to delete paragraph listener');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-white/10 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20 border border-white/20">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">Paragraph Listeners</h2>
            <p className="text-xs text-slate-400">View voice submissions & evaluation logs</p>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedListener(null);
            setFormData({ paragraph_Speak_UserName: '', paragraph_ReadID: 0, userID: 0, accuracy: '' });
            setIsModalOpen(true);
          }}
          className="btn-3d-cyan px-5 py-2.5 flex items-center space-x-2 text-sm font-semibold shadow-lg"
        >
          <Plus size={18} />
          <span>Add Listener Entry</span>
        </button>
      </div>

      {/* 3D Glass Data Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/40 backdrop-blur-md shadow-2xl">
        <table className="table-3d">
          <thead>
            <tr>
              <th>Speak ID</th>
              <th>Spoken Transcript</th>
              <th>Read ID</th>
              <th>User ID</th>
              <th>Accuracy Score</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listeners.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-slate-400">
                  No listener records found.
                </td>
              </tr>
            ) : (
              listeners.map((listener) => (
                <tr key={listener.paragraph_SpeakID}>
                  <td className="font-mono text-xs text-sky-400 font-semibold">#{listener.paragraph_SpeakID}</td>
                  <td className="text-slate-200 text-sm max-w-md">{listener.paragraph_Speak_UserName}</td>
                  <td className="font-mono text-xs text-slate-300">{listener.paragraph_ReadID}</td>
                  <td className="font-mono text-xs text-slate-300">{listener.userID}</td>
                  <td>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {listener.accuracy}%
                    </span>
                  </td>
                  <td>
                    <div className="flex space-x-2 justify-end">
                      <button
                        onClick={() => {
                          setSelectedListener(listener);
                          setFormData({
                            paragraph_Speak_UserName: listener.paragraph_Speak_UserName,
                            paragraph_ReadID: listener.paragraph_ReadID,
                            userID: listener.userID,
                            accuracy: listener.accuracy
                          });
                          setIsModalOpen(true);
                        }}
                        className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 hover:text-white transition-colors"
                        title="Edit Entry"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(listener.paragraph_SpeakID)}
                        className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:text-white transition-colors"
                        title="Delete Entry"
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

      {/* Modal Dialog */}
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
              {selectedListener ? 'Edit Paragraph Listener' : 'Add Paragraph Listener'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Spoken Transcript</label>
                <input
                  type="text"
                  value={formData.paragraph_Speak_UserName}
                  onChange={(e) => setFormData({ ...formData, paragraph_Speak_UserName: e.target.value })}
                  className="w-full px-3.5 py-2.5 input-3d text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Accuracy Score</label>
                <input
                  type="text"
                  value={formData.accuracy}
                  onChange={(e) => setFormData({ ...formData, accuracy: e.target.value })}
                  className="w-full px-3.5 py-2.5 input-3d text-sm"
                  required
                />
              </div>

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
                  {selectedListener ? 'Update Listener' : 'Create Listener'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminParagraphListeners;
