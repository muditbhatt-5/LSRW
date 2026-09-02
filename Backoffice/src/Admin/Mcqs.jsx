import React, { useState, useEffect } from 'react';
import { getMcqs, createMcq, updateMcq, deleteMcq } from '../api';
import { Pencil, Trash2, Plus, HelpCircle, X } from 'lucide-react';

const Mcqs = () => {
  const [mcqs, setMcqs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMcq, setSelectedMcq] = useState(null);
  const [formData, setFormData] = useState({
    userID: '',
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    answer: ''
  });

  useEffect(() => {
    fetchMcqs();
  }, []);

  const fetchMcqs = async () => {
    try {
      const response = await getMcqs();
      setMcqs(response.data);
    } catch (error) {
      alert('Failed to fetch MCQs');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedMcq) {
        await updateMcq(selectedMcq.mcqID, { ...formData, mcqID: selectedMcq.mcqID });
        alert('MCQ updated successfully');

        setMcqs((prevMcqs) =>
          prevMcqs.map((mcq) =>
            mcq.mcqID === selectedMcq.mcqID ? { ...mcq, ...formData } : mcq
          )
        );
      } else {
        const response = await createMcq(formData);
        alert('MCQ created successfully');

        setMcqs((prevMcqs) => [...prevMcqs, response.data]);
      }

      setIsModalOpen(false);
      setSelectedMcq(null);
      setFormData({
        userID: '',
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        answer: ''
      });
    } catch (error) {
      alert(selectedMcq ? 'Failed to update MCQ' : 'Failed to create MCQ');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this MCQ?')) {
      try {
        await deleteMcq(id);
        alert('MCQ deleted successfully');
        fetchMcqs();
      } catch (error) {
        alert('Failed to delete MCQ');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-white/10 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20 border border-white/20">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">MCQ Question Bank</h2>
            <p className="text-xs text-slate-400">Manage exam questions, choices, and answers</p>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedMcq(null);
            setFormData({
              userID: '',
              question: '',
              optionA: '',
              optionB: '',
              optionC: '',
              optionD: '',
              answer: ''
            });
            setIsModalOpen(true);
          }}
          className="btn-3d-cyan px-5 py-2.5 flex items-center space-x-2 text-sm font-semibold shadow-lg"
        >
          <Plus size={18} />
          <span>Add New MCQ</span>
        </button>
      </div>

      {/* 3D Glass Data Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/40 backdrop-blur-md shadow-2xl">
        <table className="table-3d">
          <thead>
            <tr>
              <th className="w-16">ID</th>
              <th>Question</th>
              <th>Options (A, B, C, D)</th>
              <th>Correct Answer</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mcqs.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slate-400">
                  No MCQ records found.
                </td>
              </tr>
            ) : (
              mcqs.map((mcq) => (
                <tr key={mcq.mcqID}>
                  <td className="font-mono text-xs text-sky-400 font-semibold">#{mcq.mcqID}</td>
                  <td className="text-slate-200 text-sm font-medium">{mcq.question}</td>
                  <td className="text-slate-300 text-xs">
                    <div className="grid grid-cols-2 gap-1 font-sans">
                      <span><b className="text-sky-400">A:</b> {mcq.optionA}</span>
                      <span><b className="text-sky-400">B:</b> {mcq.optionB}</span>
                      <span><b className="text-sky-400">C:</b> {mcq.optionC}</span>
                      <span><b className="text-sky-400">D:</b> {mcq.optionD}</span>
                    </div>
                  </td>
                  <td>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {mcq.answer}
                    </span>
                  </td>
                  <td>
                    <div className="flex space-x-2 justify-end">
                      <button
                        onClick={() => {
                          setSelectedMcq(mcq);
                          setFormData(mcq);
                          setIsModalOpen(true);
                        }}
                        className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 hover:text-white transition-colors"
                        title="Edit MCQ"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(mcq.mcqID)}
                        className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:text-white transition-colors"
                        title="Delete MCQ"
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
              {selectedMcq ? 'Edit MCQ Record' : 'Create MCQ Entry'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">User ID</label>
                <input
                  type="number"
                  value={formData.userID}
                  onChange={(e) => setFormData({ ...formData, userID: e.target.value })}
                  className="w-full px-3.5 py-2.5 input-3d text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Question</label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3.5 py-2.5 input-3d text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Option A</label>
                  <input
                    type="text"
                    value={formData.optionA}
                    onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                    className="w-full px-3.5 py-2.5 input-3d text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Option B</label>
                  <input
                    type="text"
                    value={formData.optionB}
                    onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                    className="w-full px-3.5 py-2.5 input-3d text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Option C</label>
                  <input
                    type="text"
                    value={formData.optionC}
                    onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                    className="w-full px-3.5 py-2.5 input-3d text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Option D</label>
                  <input
                    type="text"
                    value={formData.optionD}
                    onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                    className="w-full px-3.5 py-2.5 input-3d text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Correct Answer</label>
                <input
                  type="text"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
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
                  {selectedMcq ? 'Update MCQ' : 'Create MCQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mcqs;
