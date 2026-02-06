"use client";

import { useState } from "react";
import { TaskPriority, TaskCategory } from "@/lib/types";
import { getSoundSystem } from "@/lib/sounds";

interface TaskFormProps {
  onSubmit: (data: { 
    title: string; 
    description?: string;
    priority?: TaskPriority;
    category?: TaskCategory;
    due_date?: string;
  }) => Promise<void>;
  onCancel: () => void;
  initialData?: { 
    title: string; 
    description?: string;
    priority?: TaskPriority;
    category?: TaskCategory;
    due_date?: string;
  };
}

export default function TaskForm({
  onSubmit,
  onCancel,
  initialData,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [priority, setPriority] = useState<TaskPriority>(
    initialData?.priority || TaskPriority.MEDIUM
  );
  const [category, setCategory] = useState<TaskCategory>(
    initialData?.category || TaskCategory.OTHER
  );
  const [dueDate, setDueDate] = useState(initialData?.due_date || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (typeof window !== "undefined") {
      const soundSystem = getSoundSystem();
      soundSystem.buttonClick();
    }

    try {
      await onSubmit({ 
        title, 
        description: description || undefined,
        priority,
        category,
        due_date: dueDate || undefined,
      });
      setTitle("");
      setDescription("");
      setPriority(TaskPriority.MEDIUM);
      setCategory(TaskCategory.OTHER);
      setDueDate("");
      
      if (typeof window !== "undefined") {
        const soundSystem = getSoundSystem();
        soundSystem.taskCreated();
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      if (typeof window !== "undefined") {
        const soundSystem = getSoundSystem();
        soundSystem.error();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-terminal-bgLight/90 backdrop-blur-sm rounded border border-neon-green/40 shadow-[0_0_20px_rgba(0,255,65,0.2)] p-6 space-y-5">
      <div className="animate-slideInLeft" style={{ animationDelay: "0.1s" }}>
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-neon-cyan/80 mb-2 font-mono"
        >
          [TASK_TITLE]
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-neon-cyan/60 font-mono">{'>'}</span>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            className="w-full pl-8 pr-4 py-3 border border-neon-cyan/30 bg-terminal-bg text-neon-cyan rounded focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all duration-200 font-mono placeholder-neon-cyan/30 focus:outline-none"
            placeholder="task_name"
          />
        </div>
      </div>

      <div className="animate-slideInLeft" style={{ animationDelay: "0.2s" }}>
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-neon-green/80 mb-2 font-mono"
        >
          [DESCRIPTION] <span className="text-neon-green/50 text-xs">(optional)</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-neon-green/60 font-mono">{'>'}</span>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
            rows={3}
            className="w-full pl-8 pr-4 py-3 border border-neon-green/30 bg-terminal-bg text-neon-green rounded focus:border-neon-green focus:shadow-[0_0_15px_rgba(0,255,65,0.3)] transition-all duration-200 resize-none font-mono placeholder-neon-green/30 focus:outline-none"
            placeholder="task details..."
          />
        </div>
      </div>

      {/* Priority and Category Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slideInLeft" style={{ animationDelay: "0.3s" }}>
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-semibold text-neon-purple/80 mb-2 font-mono"
          >
            [PRIORITY]
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-neon-purple/60 font-mono">{'>'}</span>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full pl-8 pr-4 py-3 border border-neon-purple/30 bg-terminal-bg text-neon-purple rounded focus:border-neon-purple focus:shadow-[0_0_15px_rgba(157,78,221,0.3)] transition-all duration-200 font-mono focus:outline-none cursor-pointer appearance-none"
            >
              <option value={TaskPriority.LOW}>🟢 LOW</option>
              <option value={TaskPriority.MEDIUM}>🟡 MEDIUM</option>
              <option value={TaskPriority.HIGH}>🟠 HIGH</option>
              <option value={TaskPriority.URGENT}>🔴 URGENT</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neon-purple">▼</div>
          </div>
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-semibold text-neon-blue/80 mb-2 font-mono"
          >
            [CATEGORY]
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-neon-blue/60 font-mono">{'>'}</span>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="w-full pl-8 pr-4 py-3 border border-neon-blue/30 bg-terminal-bg text-neon-blue rounded focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,150,255,0.3)] transition-all duration-200 font-mono focus:outline-none cursor-pointer appearance-none"
            >
              <option value={TaskCategory.PERSONAL}>🏠 PERSONAL</option>
              <option value={TaskCategory.WORK}>💼 WORK</option>
              <option value={TaskCategory.SHOPPING}>🛒 SHOPPING</option>
              <option value={TaskCategory.HEALTH}>❤️ HEALTH</option>
              <option value={TaskCategory.LEARNING}>📚 LEARNING</option>
              <option value={TaskCategory.PROJECT}>🚀 PROJECT</option>
              <option value={TaskCategory.OTHER}>📌 OTHER</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neon-blue">▼</div>
          </div>
        </div>
      </div>

      {/* Due Date */}
      <div className="animate-slideInLeft" style={{ animationDelay: "0.4s" }}>
        <label
          htmlFor="dueDate"
          className="block text-sm font-semibold text-neon-pink/80 mb-2 font-mono"
        >
          [DUE_DATE] <span className="text-neon-pink/50 text-xs">(optional)</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-neon-pink/60 font-mono">{'>'}</span>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full pl-8 pr-4 py-3 border border-neon-pink/30 bg-terminal-bg text-neon-pink rounded focus:border-neon-pink focus:shadow-[0_0_15px_rgba(255,0,110,0.3)] transition-all duration-200 font-mono focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-3 animate-slideInLeft" style={{ animationDelay: "0.5s" }}>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-neon-cyan/20 border border-neon-cyan text-neon-cyan rounded hover:bg-neon-cyan/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] disabled:bg-terminal-border/20 disabled:border-terminal-border disabled:text-neon-green/30 disabled:cursor-not-allowed font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 font-mono"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>EXECUTING...</span>
            </>
          ) : (
            <>
              <span>{'>'}</span>
              <span>{initialData ? "UPDATE" : "CREATE"}</span>
              <span>✓</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-neon-pink/10 border border-neon-pink/50 text-neon-pink rounded hover:bg-neon-pink/20 hover:shadow-[0_0_15px_rgba(255,0,110,0.3)] font-semibold shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 font-mono"
        >
          {'>'} ABORT
        </button>
      </div>
    </form>
  );
}
