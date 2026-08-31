import React, { useState, useEffect } from 'react';
import { getParagraphReaders, createParagraphReader, updateParagraphReader, deleteParagraphReader } from '../api';
import { Pencil, Trash2, Plus, BookOpen, X } from 'lucide-react';

const AdminParagraphReaders = () => {
  const [readers, setReaders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReader, setSelectedReader] = useState(null);
  const [formData, setFormData] = useState({
    paragraph_ReadID: 6,
    paragraphs: '',
    userID: 0,
  });

  useEffect(() => {
    fetchReaders();
  }, []);

  const fetchReaders = async () => {
    try {
      const response = await getParagraphReaders();
      setReaders(response.data);
    } catch (error) {
      console.error('Error fetching paragraph readers:', error);
      alert('Failed to fetch paragraph readers');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedReader) {
        await updateParagraphReader(selectedReader.paragraph_ReadID, formData);
        alert('Paragraph reader updated successfully');
      } else {
        await createParagraphReader({
          ...formData,
          paragraph_ReadID: 0,
        });
        alert('Paragraph reader created successfully');
      }
      setIsModalOpen(false);
      setFormData({ paragraph_ReadID: 0, paragraphs: '', userID: 0 });
      fetchReaders();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(selectedReader ? 'Failed to update paragraph reader' : 'Failed to create paragraph reader');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this paragraph reader?')) {
      try {
        await deleteParagraphReader(id);
        alert('Paragraph reader deleted successfully');
        fetchReaders();
      } catch (error) {
        console.error('Error deleting paragraph reader:', error);
        alert('Failed to delete paragraph reader');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-white/10 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20 border border-white/20">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">Paragraph Readers</h2>
            <p className="text-xs text-slate-400">Manage reading content for students & practice sessions</p>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedReader(null);
            setFormData({ paragraph_ReadID: 0, paragraphs: '', userID: 0 });
            setIsModalOpen(true);
          }}
          className="btn-3d-cyan px-5 py-2.5 flex items-center space-x-2 text-sm font-semibold shadow-lg"
        >
          <Plus size={18} />
          <span>Add Paragraph Reader</span>
        </button>
      </div>

      {/* 3D Glass Data Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/40 backdrop-blur-md shadow-2xl">
        <table className="table-3d">
          <thead>
            <tr>
              <th className="w-20">ID</th>
              <th>Paragraph Text Content</th>
              <th className="w-32">User ID</th>
              <th className="w-32 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {readers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-slate-400">
                  No paragraph records found.
                </td>
              </tr>
            ) : (
              readers.map((reader) => (
                <tr key={reader.paragraph_ReadID}>
                  <td className="font-mono text-xs text-sky-400 font-semibold">#{reader.paragraph_ReadID}</td>
                  <td className="text-slate-200 text-sm leading-relaxed max-w-xl">{reader.paragraphs}</td>
                  <td className="font-mono text-xs text-slate-300">{reader.userID}</td>
                  <td>
                    <div className="flex space-x-2 justify-end">
                      <button
                        onClick={() => {
                          setSelectedReader(reader);
                          setFormData({
                            paragraph_ReadID: reader.paragraph_ReadID,
                            paragraphs: reader.paragraphs,
                            userID: reader.userID,
                          });
                          setIsModalOpen(true);
                        }}
                        className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 hover:text-white transition-colors"
                        title="Edit Reader"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(reader.paragraph_ReadID)}
                        className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:text-white transition-colors"
                        title="Delete Reader"
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
              {selectedReader ? 'Edit Paragraph Reader' : 'Add Paragraph Reader'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Paragraph Text</label>
                <textarea
                  value={formData.paragraphs}
                  onChange={(e) => setFormData({ ...formData, paragraphs: e.target.value })}
                  className="w-full px-3.5 py-2.5 input-3d text-sm placeholder-slate-500"
                  rows={5}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">User ID</label>
                <input
                  type="number"
                  value={formData.userID}
                  onChange={(e) => setFormData({ ...formData, userID: parseInt(e.target.value) || 0 })}
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
                  {selectedReader ? 'Update Reader' : 'Create Reader'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminParagraphReaders;
