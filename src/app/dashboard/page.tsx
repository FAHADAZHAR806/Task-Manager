"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import TaskModal from "@/components/TaskModal";
import {
  Plus,
  Calendar,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Layout,
  Trash2,
  Edit3,
  Clock,
} from "lucide-react";

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "Pending" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  createdAt: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/api/tasks");
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateStatus = async (taskId: string, nextStatus: string) => {
    try {
      await axios.patch(`/api/tasks/${taskId}`, { status: nextStatus });
      fetchTasks();
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    )
      return;
    updateStatus(draggableId, destination.droppableId);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  const columns: Task["status"][] = ["Pending", "In Progress", "Completed"];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans">
      {/* Brand Aligned Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#E2E8F0] px-6 py-4 flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-[#2563EB] p-2 rounded-lg shadow-sm">
            <Layout size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#0F172A]">
            FocusFlow
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setSelectedTask(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#2563EB] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#1D4ED8] transition-all shadow-sm active:scale-95"
          >
            <Plus size={18} /> New Task
          </button>
          <button
            onClick={async () => {
              await axios.post("/api/auth/logout");
              window.location.href = "/login";
            }}
            className="p-2 text-[#94A3B8] hover:text-[#EF4444] transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="p-6 md:p-8 max-w-[1400px] mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-20 text-[#64748B] font-medium animate-pulse uppercase tracking-widest text-xs">
            Synchronizing Data...
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {columns.map((col) => (
                <div key={col} className="flex flex-col gap-5">
                  {/* Cohesive Column Header */}
                  <div className="flex items-center justify-between px-2 py-1 border-l-4 border-[#CBD5E1]">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-[#64748B] ml-2">
                      {col}
                    </h2>
                    <span className="text-xs font-bold bg-[#E2E8F0] text-[#475569] px-2.5 py-0.5 rounded-full">
                      {tasks.filter((t) => t.status === col).length}
                    </span>
                  </div>

                  <Droppable droppableId={col}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex flex-col gap-5 min-h-[550px] rounded-2xl transition-all duration-200 p-2 ${snapshot.isDraggingOver ? "bg-[#F1F5F9]" : ""}`}
                      >
                        {tasks
                          .filter((t) => t.status === col)
                          .map((task, index) => (
                            <Draggable
                              key={task._id}
                              draggableId={task._id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-white border border-[#E2E8F0] p-6 rounded-2xl flex flex-col justify-between transition-all h-[280px] shadow-sm ${
                                    snapshot.isDragging
                                      ? "shadow-2xl border-[#3B82F6] ring-2 ring-[#DBEAFE] scale-105 z-50 bg-white"
                                      : "hover:border-[#3B82F6] hover:shadow-md"
                                  }`}
                                >
                                  <div>
                                    <div className="flex justify-between items-start mb-3">
                                      <div className="flex flex-col gap-1 overflow-hidden">
                                        <span
                                          className={`text-[10px] font-bold uppercase tracking-wider ${task.priority === "High" ? "text-[#EF4444]" : "text-[#10B981]"}`}
                                        >
                                          • {task.priority} Priority
                                        </span>
                                        <h3 className="font-bold text-[16px] text-[#0F172A] truncate tracking-tight">
                                          {task.title}
                                        </h3>
                                      </div>
                                      <div className="flex gap-1 shrink-0 ml-2">
                                        <button
                                          onClick={() => {
                                            setSelectedTask(task);
                                            setIsModalOpen(true);
                                          }}
                                          className="p-1.5 text-[#94A3B8] hover:text-[#2563EB] hover:bg-[#F1F5F9] rounded-md transition-colors"
                                        >
                                          <Edit3 size={15} />
                                        </button>
                                        <button
                                          onClick={() => deleteTask(task._id)}
                                          className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-md transition-colors"
                                        >
                                          <Trash2 size={15} />
                                        </button>
                                      </div>
                                    </div>
                                    <p className="text-sm text-[#64748B] line-clamp-3 leading-relaxed font-normal">
                                      {task.description ||
                                        "No description provided for this task."}
                                    </p>
                                  </div>

                                  <div className="mt-auto pt-4 border-t border-[#F1F5F9] space-y-4">
                                    {/* Functional Dates Display */}
                                    <div className="flex items-center justify-between">
                                      <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-tighter">
                                          Assigned
                                        </span>
                                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#475569]">
                                          <Clock
                                            size={12}
                                            className="text-[#94A3B8]"
                                          />{" "}
                                          {formatDate(task.createdAt)}
                                        </div>
                                      </div>
                                      <div className="flex flex-col items-end gap-1">
                                        <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-tighter">
                                          Deadline
                                        </span>
                                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-md">
                                          <Calendar size={12} />{" "}
                                          {formatDate(task.dueDate)}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Navigation Controls */}
                                    <div className="flex gap-2">
                                      {col !== "Pending" && (
                                        <button
                                          onClick={() =>
                                            updateStatus(
                                              task._id,
                                              col === "Completed"
                                                ? "In Progress"
                                                : "Pending",
                                            )
                                          }
                                          className="flex-1 py-2 text-[11px] font-bold text-[#475569] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-lg flex items-center justify-center gap-1 transition-colors"
                                        >
                                          <ChevronLeft size={14} /> Back
                                        </button>
                                      )}
                                      {col !== "Completed" && (
                                        <button
                                          onClick={() =>
                                            updateStatus(
                                              task._id,
                                              col === "Pending"
                                                ? "In Progress"
                                                : "Completed",
                                            )
                                          }
                                          className="flex-1 py-2 text-[11px] font-bold text-white bg-[#0F172A] hover:bg-[#1E293B] rounded-lg flex items-center justify-center gap-1 transition-colors"
                                        >
                                          Next <ChevronRight size={14} />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        )}
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
