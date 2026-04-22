"use client";
import { useEffect, useState } from "react";
import TaskModal from "@/components/TaskModal";
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  ListTodo,
  Trash2,
  Edit3,
  ArrowRight,
  ArrowLeft,
  LogOut,
  LayoutDashboard,
  Calendar,
} from "lucide-react";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const moveTask = async (
    e: any,
    taskId: string,
    currentStatus: string,
    direction: "next" | "prev",
  ) => {
    e.stopPropagation();
    let nextStatus =
      direction === "next"
        ? currentStatus === "Pending"
          ? "In Progress"
          : "Completed"
        : currentStatus === "Completed"
          ? "In Progress"
          : "Pending";

    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    fetchTasks();
  };

  const deleteTask = async (e: any, taskId: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this project?")) return;
    await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    fetchTasks();
  };

  const formatDate = (date: string) => {
    if (!date) return "TBD";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  const renderColumn = (status: string, icon: any, colorClass: string) => (
    <div className="flex-1 min-w-[320px] max-w-[400px]">
      <div className="flex items-center gap-3 mb-6 px-2">
        <div
          className={`p-2 rounded-lg ${colorClass} bg-opacity-10 text-current`}
        >
          {icon}
        </div>
        <h3 className="font-bold text-slate-700 text-sm tracking-tight uppercase">
          {status}
        </h3>
        <span className="ml-auto text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
          {tasks.filter((t: any) => t.status === status).length}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {tasks
          .filter((t: any) => t.status === status)
          .map((task: any) => (
            <div
              key={task._id}
              className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-default"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-slate-900 text-[15px] leading-tight">
                  {task.title}
                </h4>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={(e) => deleteTask(e, task._id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-500 mb-5 line-clamp-2 leading-relaxed">
                {task.description || "No project description provided."}
              </p>

              <div className="flex items-center gap-4 mb-5 pb-4 border-b border-slate-50">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                  <Calendar size={13} />
                  <span>
                    Created:{" "}
                    <b className="text-slate-600">
                      {formatDate(task.createdAt)}
                    </b>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                  <Clock size={13} />
                  <span>
                    Due:{" "}
                    <b className="text-blue-600">{formatDate(task.dueDate)}</b>
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {status !== "Pending" && (
                  <button
                    onClick={(e) => moveTask(e, task._id, task.status, "prev")}
                    className="flex-1 py-2 text-[11px] font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-100 flex items-center justify-center gap-1"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                )}
                {status !== "Completed" && (
                  <button
                    onClick={(e) => moveTask(e, task._id, task.status, "next")}
                    className="flex-1 py-2 text-[11px] font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1"
                  >
                    Move Next <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 selection:bg-blue-100">
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md shadow-blue-100">
            <LayoutDashboard size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            FocusFlow
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setSelectedTask(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <PlusCircle size={18} /> New Task
          </button>
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
            className="p-2.5 text-slate-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start overflow-x-auto pb-10">
          {renderColumn("Pending", <ListTodo size={20} />, "text-orange-600")}
          {renderColumn("In Progress", <Clock size={20} />, "text-blue-600")}
          {renderColumn(
            "Completed",
            <CheckCircle2 size={20} />,
            "text-green-600",
          )}
        </div>
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onTaskAdded={fetchTasks}
        editData={selectedTask}
      />
    </div>
  );
}
