"use client";

import { Task, TaskUpdate } from "@/lib/types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onUpdate: (taskId: number, data: TaskUpdate) => Promise<Task | null>;
  onDelete: (taskId: number) => Promise<boolean>;
}

export default function TaskList({
  tasks,
  loading,
  onUpdate,
  onDelete,
}: TaskListProps) {
  if (loading) {
    return (
      <div className="rounded bg-terminal-bgLight/80 backdrop-blur-sm p-12 shadow-[0_0_20px_rgba(0,255,65,0.2)] text-center border border-neon-green/40 animate-pulse-subtle">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded border-2 border-neon-cyan bg-terminal-bg mb-4 shadow-[0_0_20px_rgba(0,255,255,0.5)]">
          <svg
            className="animate-spin h-8 w-8 text-neon-cyan"
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
        </div>
        <p className="text-neon-green text-lg font-mono">{'>'} Loading task database...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded bg-terminal-bgLight/80 backdrop-blur-sm p-12 shadow-[0_0_20px_rgba(0,255,65,0.2)] text-center border border-neon-green/40 animate-fadeIn">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded border-2 border-neon-cyan bg-terminal-bg mb-6 shadow-[0_0_20px_rgba(0,255,255,0.3)]">
          <span className="text-4xl">📋</span>
        </div>
        <h3 className="text-xl font-semibold text-neon-cyan mb-2 font-mono">
          [NO_TASKS_FOUND]
        </h3>
        <p className="text-neon-green/70 font-mono text-sm">
          {'>'} Initialize task creation to begin...
        </p>
      </div>
    );
  }

  // Separate completed and incomplete tasks
  const incompleteTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="space-y-8">
      {/* Incomplete Tasks */}
      {incompleteTasks.length > 0 && (
        <div className="animate-slideInLeft">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-shrink-0 w-1 h-8 bg-gradient-to-b from-neon-cyan to-neon-green rounded shadow-[0_0_10px_rgba(0,255,255,0.5)]"></div>
            <h2 className="text-2xl font-bold text-neon-cyan font-mono">
              {'>'} [ACTIVE_TASKS]
            </h2>
            <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-semibold text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/50 rounded shadow-[0_0_10px_rgba(0,255,255,0.3)] font-mono">
              {incompleteTasks.length}
            </span>
          </div>
          <div className="space-y-4">
            {incompleteTasks.map((task, index) => (
              <div
                key={task.id}
                className="animate-slideInLeft"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TaskItem
                  task={task}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="animate-slideInRight">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-shrink-0 w-1 h-8 bg-gradient-to-b from-neon-green to-neon-cyan rounded shadow-[0_0_10px_rgba(0,255,65,0.5)]"></div>
            <h2 className="text-2xl font-bold text-neon-green font-mono">
              {'>'} [COMPLETED]
            </h2>
            <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-semibold text-neon-green bg-neon-green/10 border border-neon-green/50 rounded shadow-[0_0_10px_rgba(0,255,65,0.3)] font-mono">
              {completedTasks.length}
            </span>
          </div>
          <div className="space-y-4">
            {completedTasks.map((task, index) => (
              <div
                key={task.id}
                className="animate-slideInRight"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TaskItem
                  task={task}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
