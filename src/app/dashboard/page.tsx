"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
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
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  BarChart3,
  TrendingUp,
  User,
  ChevronDown,
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
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");

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

  const fetchUserProfile = async () => {
    try {
      // 1. Cookies se token nikalne ka logic
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (token) {
        // 2. JWT Decode karke user ka data nikalna
        const decoded: any = jwtDecode(token);
        setUser({
          name: decoded.name || "User",
          email: decoded.email || "",
        });
      } else {
        // Agar token nahi milta to /api/auth/me se koshish karein
        const res = await axios.get("/api/auth/me");
        setUser(res.data);
      }
    } catch (error) {
      console.error("Profile fetch failed:", error);
      // Logout logic agar token expired ho
      // window.location.href = "/login";
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUserProfile();
  }, []);

  // --- STATS LOGIC ---
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "In Progress",
  ).length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

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
      <header className="sticky top-0 z-50 border-b border-[#E2E8F0] px-4 md:px-6 py-3 flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-[#2563EB] p-2 rounded-lg shadow-sm">
            <Layout size={18} className="text-white" />
          </div>
          <h1 className="text-lg md:xl font-bold tracking-tight text-[#0F172A]">
            FocusFlow
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => {
              setSelectedTask(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-[#2563EB] text-white p-2 md:px-5 md:py-2 rounded-lg text-sm font-semibold hover:bg-[#1D4ED8] transition-all shadow-sm active:scale-95"
          >
            <Plus size={18} />
            <span className="hidden md:inline">New Task</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-1 md:gap-2 p-1 rounded-full hover:bg-[#F1F5F9] transition-colors border border-transparent hover:border-[#E2E8F0]"
            >
              <div className="w-8 h-8 rounded-full bg-[#DBEAFE] flex items-center justify-center text-[#2563EB] font-bold">
                {user?.name?.charAt(0).toUpperCase() || <User size={18} />}
              </div>
              <span className="text-sm font-bold text-[#475569] hidden md:block max-w-[100px] truncate">
                {user?.name || "User"}
              </span>
              <ChevronDown
                size={14}
                className={`text-[#94A3B8] transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 md:w-56 bg-white border border-[#E2E8F0] rounded-xl shadow-xl py-2 z-[60]">
                <div className="px-4 py-2 border-b border-[#F1F5F9] mb-1">
                  <p className="text-xs font-bold text-[#94A3B8] uppercase">
                    Account
                  </p>
                  <p className="text-sm font-bold text-[#0F172A] truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[10px] text-[#64748B] truncate">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={async () => {
                    document.cookie =
                      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    localStorage.removeItem("token");
                    await axios.post("/api/auth/logout");
                    window.location.href = "/logout";
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-rose-600 font-bold hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<BarChart3 size={20} />}
            label="Total Tasks"
            value={totalTasks}
            color="blue"
          />
          <StatCard
            icon={<AlertCircle size={20} />}
            label="In Progress"
            value={inProgressTasks}
            color="amber"
          />
          <StatCard
            icon={<CheckCircle size={20} />}
            label="Completed"
            value={completedTasks}
            color="emerald"
          />
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center gap-4">
            <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
              <TrendingUp size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-bold text-[#64748B] uppercase">
                Completion Rate
              </p>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{completionRate}%</h3>
                <div className="flex-1 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              size={18}
            />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] outline-none transition-all shadow-sm text-sm"
            />
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none shadow-sm text-sm font-medium text-[#475569]"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 animate-pulse text-xs font-bold uppercase tracking-widest text-[#64748B]">
            Syncing...
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {columns.map((col) => (
                <div key={col} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between px-2 border-l-4 border-[#CBD5E1]">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-[#64748B] ml-2">
                      {col}
                    </h2>
                    <span className="text-xs font-bold bg-[#E2E8F0] text-[#475569] px-2.5 py-0.5 rounded-full">
                      {filteredTasks.filter((t) => t.status === col).length}
                    </span>
                  </div>

                  <Droppable droppableId={col}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex flex-col gap-4 min-h-[500px] rounded-2xl transition-all p-1 ${snapshot.isDraggingOver ? "bg-[#F1F5F9]" : ""}`}
                      >
                        {filteredTasks
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
                                  className={`bg-white border border-[#E2E8F0] p-5 rounded-2xl flex flex-col justify-between transition-all h-[260px] shadow-sm ${
                                    snapshot.isDragging
                                      ? "shadow-2xl border-[#3B82F6] ring-2 ring-[#DBEAFE] scale-105 z-50"
                                      : "hover:border-[#3B82F6]"
                                  }`}
                                >
                                  <div>
                                    <div className="flex justify-between items-start mb-2">
                                      <span
                                        className={`text-[10px] font-bold uppercase tracking-wider ${task.priority === "High" ? "text-rose-500" : "text-emerald-500"}`}
                                      >
                                        • {task.priority}
                                      </span>
                                      <div className="flex gap-1">
                                        <button
                                          onClick={() => {
                                            setSelectedTask(task);
                                            setIsModalOpen(true);
                                          }}
                                          className="p-1.5 text-[#94A3B8] hover:text-[#2563EB] hover:bg-[#F1F5F9] rounded-md transition-colors"
                                        >
                                          <Edit3 size={14} />
                                        </button>
                                        <button
                                          onClick={() => deleteTask(task._id)}
                                          className="p-1.5 text-[#94A3B8] hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    </div>
                                    <h3 className="font-bold text-base text-[#0F172A] truncate mb-1">
                                      {task.title}
                                    </h3>
                                    <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed">
                                      {task.description ||
                                        "No description provided."}
                                    </p>
                                  </div>

                                  <div className="mt-auto pt-4 border-t border-[#F1F5F9]">
                                    <div className="flex justify-between mb-4">
                                      <div className="flex flex-col">
                                        <span className="text-[9px] font-bold text-[#94A3B8] uppercase">
                                          Due Date
                                        </span>
                                        <div className="flex items-center gap-1 text-[11px] font-bold text-[#2563EB]">
                                          <Calendar size={12} />{" "}
                                          {formatDate(task.dueDate)}
                                        </div>
                                      </div>
                                    </div>
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
                                          className="flex-1 py-2 text-[10px] font-bold text-[#475569] bg-[#F1F5F9] rounded-lg flex items-center justify-center gap-1 transition-colors hover:bg-[#E2E8F0]"
                                        >
                                          <ChevronLeft size={12} /> Back
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
                                          className="flex-1 py-2 text-[10px] font-bold text-white bg-[#0F172A] rounded-lg flex items-center justify-center gap-1 transition-colors hover:bg-[#1E293B]"
                                        >
                                          Next <ChevronRight size={12} />
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

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
}) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center gap-4">
      <div className={`${colors[color]} p-3 rounded-xl`}>{icon}</div>
      <div>
        <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
          {label}
        </p>
        <h3 className="text-xl font-bold text-[#0F172A]">{value}</h3>
      </div>
    </div>
  );
}
