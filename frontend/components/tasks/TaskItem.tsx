"use client";

import { useState } from "react";
import { Task, TaskUpdate, TaskPriority, TaskCategory } from "@/lib/types";
import { getSoundSystem } from "@/lib/sounds";

interface TaskItemProps {
  task: Task;
  onUpdate: (taskId: number, data: TaskUpdate) => Promise<Task | null>;
  onDelete: (taskId: number) => Promise<boolean>;
}

const priorityColors = {
  [TaskPriority.LOW]: "text-neon-green border-neon-green bg-neon-green/10",
  [TaskPriority.MEDIUM]: "text-neon-yellow border-neon-yellow bg-neon-yellow/10",
  [TaskPriority.HIGH]: "text-orange-400 border-orange-400 bg-orange-400/10",
  [TaskPriority.URGENT]: "text-neon-pink border-neon-pink bg-neon-pink/10",
};

const priorityIcons = {
  [TaskPriority.LOW]: "🟢",
  [TaskPriority.MEDIUM]: "🟡",
  [TaskPriority.HIGH]: "🟠",
  [TaskPriority.URGENT]: "🔴",
};

const categoryIcons = {
  [TaskCategory.PERSONAL]: "🏠",
  [TaskCategory.WORK]: "💼",
  [TaskCategory.SHOPPING]: "🛒",
  [TaskCategory.HEALTH]: "❤️",
  [TaskCategory.LEARNING]: "📚",
  [TaskCategory.PROJECT]: "🚀",
  [TaskCategory.OTHER]: "📌",
};

export default function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority);
  const [category, setCategory] = useState(task.category);
  const [dueDate, setDueDate] = useState(task.due_date || "");
  const [loading, setLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleToggleComplete = async () => {
    setLoading(true);
    setIsCompleting(true);
    
    // Add a small delay for animation
    await new Promise(resolve => setTimeout(resolve, 300));
    await onUpdate(task.id, { completed: !task.completed });
    
    if (!task.completed && typeof window !== "undefined") {
      const soundSystem = getSoundSystem();
      soundSystem.taskCompleted();
    }
    
    setLoading(false);
    setIsCompleting(false);
  };

  const handleUpdate = async () => {
    setLoading(true);
    
    if (typeof window !== "undefined") {
      const soundSystem = getSoundSystem();
      soundSystem.buttonClick();
    }
    
    const result = await onUpdate(task.id, {
      title,
      description: description || undefined,
      priority,
      category,
      due_date: dueDate || undefined,
    });
    
    if (result) {
      setIsEditing(false);
      if (typeof window !== "undefined") {
        const soundSystem = getSoundSystem();
        soundSystem.notification();
      }
    } else {
      if (typeof window !== "undefined") {
        const soundSystem = getSoundSystem();
        soundSystem.error();
      }
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      setLoading(true);
      
      if (typeof window !== "undefined") {
        const soundSystem = getSoundSystem();
        soundSystem.buttonClick();
      }
      
      const success = await onDelete(task.id);
      
      if (typeof window !== "undefined") {
        const soundSystem = getSoundSystem();
        if (success) {
          soundSystem.taskDeleted();
        } else {
          soundSystem.error();
        }
      }
    }
  };

  if (isEditing) {
    return (
      <div className="rounded bg-terminal-bgLight/90 backdrop-blur-sm p-5 shadow-[0_0_20px_rgba(0,255,255,0.3)] border border-neon-cyan animate-scaleIn">
        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-3 top-3 text-neon-cyan/60 font-mono text-sm">{'>'}</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full pl-8 pr-4 py-3 rounded border border-neon-cyan/30 bg-terminal-bg text-neon-cyan font-mono shadow-sm focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,255,255,0.4)] transition-all duration-200 placeholder-neon-cyan/30 focus:outline-none"
              placeholder="task_title"
              maxLength={200}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-3 text-neon-green/60 font-mono text-sm">{'>'}</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="block w-full pl-8 pr-4 py-3 rounded border border-neon-green/30 bg-terminal-bg text-neon-green font-mono shadow-sm focus:border-neon-green focus:shadow-[0_0_15px_rgba(0,255,65,0.4)] transition-all duration-200 resize-none placeholder-neon-green/30 focus:outline-none"
              placeholder="task_description"
              maxLength={2000}
            />
          </div>
          
          {/* Priority and Category */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <span className="absolute left-3 top-3 text-neon-purple/60 font-mono text-sm">{'>'}</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="block w-full pl-8 pr-4 py-3 rounded border border-neon-purple/30 bg-terminal-bg text-neon-purple font-mono shadow-sm focus:border-neon-purple focus:shadow-[0_0_15px_rgba(157,78,221,0.4)] transition-all duration-200 focus:outline-none appearance-none cursor-pointer"
              >
                <option value={TaskPriority.LOW}>🟢 LOW</option>
                <option value={TaskPriority.MEDIUM}>🟡 MEDIUM</option>
                <option value={TaskPriority.HIGH}>🟠 HIGH</option>
                <option value={TaskPriority.URGENT}>🔴 URGENT</option>
              </select>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-3 text-neon-blue/60 font-mono text-sm">{'>'}</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="block w-full pl-8 pr-4 py-3 rounded border border-neon-blue/30 bg-terminal-bg text-neon-blue font-mono shadow-sm focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,150,255,0.4)] transition-all duration-200 focus:outline-none appearance-none cursor-pointer"
              >
                <option value={TaskCategory.PERSONAL}>🏠 PERSONAL</option>
                <option value={TaskCategory.WORK}>💼 WORK</option>
                <option value={TaskCategory.SHOPPING}>🛒 SHOPPING</option>
                <option value={TaskCategory.HEALTH}>❤️ HEALTH</option>
                <option value={TaskCategory.LEARNING}>📚 LEARNING</option>
                <option value={TaskCategory.PROJECT}>🚀 PROJECT</option>
                <option value={TaskCategory.OTHER}>📌 OTHER</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="relative">
            <span className="absolute left-3 top-3 text-neon-pink/60 font-mono text-sm">{'>'}</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="block w-full pl-8 pr-4 py-3 rounded border border-neon-pink/30 bg-terminal-bg text-neon-pink font-mono shadow-sm focus:border-neon-pink focus:shadow-[0_0_15px_rgba(255,0,110,0.4)] transition-all duration-200 focus:outline-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              disabled={loading || !title.trim()}
              className="flex-1 rounded bg-neon-cyan/20 border border-neon-cyan px-4 py-2.5 text-sm font-semibold text-neon-cyan hover:bg-neon-cyan/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] disabled:bg-terminal-border/20 disabled:border-terminal-border disabled:text-neon-green/30 shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 font-mono"
            >
              {'>'} SAVE
            </button>
            <button
              onClick={() => {
                setTitle(task.title);
                setDescription(task.description || "");
                setPriority(task.priority);
                setCategory(task.category);
                setDueDate(task.due_date || "");
                setIsEditing(false);
              }}
              className="rounded bg-neon-pink/10 border border-neon-pink/50 px-4 py-2.5 text-sm font-semibold text-neon-pink hover:bg-neon-pink/20 hover:shadow-[0_0_15px_rgba(255,0,110,0.3)] shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 font-mono"
            >
              {'>'} ABORT
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative rounded bg-terminal-bgLight/80 backdrop-blur-sm p-6 shadow-lg border ${
        task.completed 
          ? "border-neon-green/30 opacity-60" 
          : "border-neon-cyan/30 hover:border-neon-cyan hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
      } transition-all duration-300 transform hover:scale-[1.01] ${
        isCompleting ? "animate-pulse" : ""
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Priority/Status Indicator */}
      <div className={`absolute top-0 left-0 w-1 h-full ${
        task.completed 
          ? "bg-gradient-to-b from-neon-green to-neon-cyan" 
          : "bg-gradient-to-b from-neon-cyan to-neon-purple"
      } rounded-l shadow-[0_0_10px_rgba(0,255,255,0.5)]`}></div>
      
      {/* Completion Celebration Effect */}
      {isCompleting && !task.completed && (
        <div className="absolute inset-0 bg-gradient-to-r from-neon-green/20 to-neon-cyan/20 rounded animate-pulse"></div>
      )}

      <div className="flex items-start gap-4">
        {/* Enhanced Checkbox */}
        <div className="flex-shrink-0 pt-0.5">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggleComplete}
              disabled={loading}
              className="sr-only peer"
            />
            <div className={`w-7 h-7 rounded border-2 flex items-center justify-center transition-all duration-300 ${
              task.completed
                ? "bg-neon-green/20 border-neon-green shadow-[0_0_10px_rgba(0,255,65,0.5)]"
                : "bg-terminal-bg border-neon-cyan/50 hover:border-neon-cyan hover:shadow-[0_0_10px_rgba(0,255,255,0.3)]"
            } shadow-md`}>
              {task.completed ? (
                <span className="text-neon-green text-lg font-bold animate-scaleIn">✓</span>
              ) : (
                <span className="text-neon-cyan/40 text-xs">○</span>
              )}
            </div>
          </label>
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3
              className={`text-lg font-bold transition-all duration-300 font-mono ${
                task.completed
                  ? "line-through text-neon-green/40"
                  : "text-neon-cyan group-hover:text-neon-green"
              }`}
            >
              <span className="text-neon-cyan/60">{'>'} </span>{task.title}
            </h3>
            
            {/* Priority Badge */}
            {task.priority && (
              <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium ${priorityColors[task.priority]} border font-mono shadow-md`}>
                {priorityIcons[task.priority]} {task.priority.toUpperCase()}
              </span>
            )}
          </div>

          {/* Category and Status Row */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {task.category && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-neon-blue/10 border border-neon-blue/50 text-neon-blue font-mono">
                {categoryIcons[task.category]} {task.category.toUpperCase()}
              </span>
            )}
            
            {!task.completed && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan font-mono shadow-[0_0_5px_rgba(0,255,255,0.3)]">
                [ACTIVE]
              </span>
            )}
            {task.completed && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neon-green/10 border border-neon-green/50 text-neon-green font-mono shadow-[0_0_5px_rgba(0,255,65,0.3)]">
                [DONE]
              </span>
            )}

            {/* Due Date Badge */}
            {task.due_date && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border font-mono ${
                new Date(task.due_date) < new Date() && !task.completed
                  ? "bg-neon-pink/20 border-neon-pink text-neon-pink animate-pulse"
                  : "bg-neon-purple/10 border-neon-purple/50 text-neon-purple"
              }`}>
                ⏰ {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>

          {task.description && (
            <p
              className={`mt-2 text-sm leading-relaxed transition-all duration-200 font-mono ${
                task.completed
                  ? "text-neon-green/40"
                  : "text-neon-green/70"
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Metadata */}
          <div className="mt-4 flex items-center gap-2 text-xs text-neon-cyan/50 font-mono">
            <span>📅</span>
            <span>[{new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}]</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex gap-2 transition-all duration-300 ${
          showActions ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        }`}>
          <button
            onClick={() => setIsEditing(true)}
            disabled={loading}
            title="Edit task"
            className="group/btn rounded bg-neon-cyan/20 border border-neon-cyan/50 hover:bg-neon-cyan/30 hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] p-3 text-neon-cyan disabled:bg-terminal-border/20 disabled:border-terminal-border disabled:text-neon-green/30 disabled:cursor-not-allowed shadow-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
          >
            <span className="text-sm font-bold">✎</span>
          </button>
          
          <button
            onClick={handleDelete}
            disabled={loading}
            title="Delete task"
            className="rounded bg-neon-pink/20 border border-neon-pink/50 hover:bg-neon-pink/30 hover:shadow-[0_0_15px_rgba(255,0,110,0.5)] p-3 text-neon-pink disabled:bg-terminal-border/20 disabled:border-terminal-border disabled:text-neon-green/30 disabled:cursor-not-allowed shadow-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
          >
            <span className="text-sm font-bold">🗑</span>
          </button>
        </div>
      </div>

      {/* Hover Effect Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/0 via-neon-green/0 to-neon-cyan/0 group-hover:from-neon-cyan/5 group-hover:via-neon-green/5 group-hover:to-neon-cyan/5 rounded transition-all duration-500 pointer-events-none"></div>
    </div>
  );
}
