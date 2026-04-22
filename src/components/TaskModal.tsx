"use client";
import { useState, useEffect } from "react";
import { X, Calendar, AlignLeft, Tag } from "lucide-react";

export default function TaskModal({
  isOpen,
  onClose,
  onTaskAdded,
  editData,
}: any) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || "",
        description: editData.description || "",
        priority: editData.priority || "Medium",
        dueDate: editData.dueDate ? editData.dueDate.split("T")[0] : "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
      });
    }
  }, [editData, isOpen]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const url = editData ? `/api/tasks/${editData._id}` : "/api/tasks";
    const method = editData ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      onTaskAdded();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 transition-opacity">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
          <h2 className="text-lg font-bold text-slate-800">
            {editData ? "Edit Task" : "Add New Task"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wide">
              <Tag size={14} /> Title
            </label>
            <input
              required
              type="text"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none font-medium text-slate-800 transition-all"
              placeholder="Enter project name..."
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wide">
              <AlignLeft size={14} /> Description
            </label>
            <textarea
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none 
                         min-h-[140px] max-h-[250px] overflow-y-auto text-sm leading-relaxed text-slate-600 font-medium transition-all"
              style={{ resize: "none" }}
              placeholder="Provide details about the task..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Priority
              </label>
              <select
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 transition-all"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wide">
                <Calendar size={14} /> Due Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 transition-all"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98] mt-2"
          >
            {editData ? "Update Task" : "Save Task"}
          </button>
        </form>
      </div>
    </div>
  );
}
