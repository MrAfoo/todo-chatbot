"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { betterAuthWrapper } from "@/lib/auth-wrapper";
import { useTasks } from "@/hooks/useTasks";
import TaskList from "@/components/tasks/TaskList";
import TaskForm from "@/components/tasks/TaskForm";
import Navigation from "@/components/Navigation";
import ParticleEffect from "@/components/ParticleEffect";
import GlitchText from "@/components/GlitchText";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = betterAuthWrapper.useSession();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const { tasks, loading, error, createTask, updateTask, deleteTask } =
    useTasks(session?.user?.id ? Number(session.user.id) : null);

  const handleLogout = async () => {
    await betterAuthWrapper.signOut();
    router.push("/login");
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-terminal-bg">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded border-2 border-neon-green mb-4 animate-pulse-glow bg-terminal-bgLight">
            <svg
              className="animate-spin h-8 w-8 text-neon-green"
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
          <p className="text-neon-cyan font-mono">{'>'} Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const pendingTasks = totalTasks - completedTasks;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="min-h-screen bg-terminal-bg relative overflow-hidden">
      {/* Particle Effects */}
      <ParticleEffect />

      {/* Matrix-style background effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-neon-green to-transparent animate-matrix-rain" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-neon-cyan to-transparent animate-matrix-rain" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-neon-green to-transparent animate-matrix-rain" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute w-full h-1 bg-neon-cyan shadow-[0_0_10px_rgba(0,255,255,0.8)] animate-scan-line"></div>
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        {/* Welcome Section */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-3xl font-bold text-neon-cyan mb-2 font-terminal">
            {'>'} WELCOME, <GlitchText intensity="medium">{(session.user.name || "USER").toUpperCase()}</GlitchText> <span className="animate-pulse">_</span>
          </h1>
          <p className="text-neon-green/70 font-mono text-sm">
            <span className="animate-neon-flicker">[SYSTEM STATUS]</span> Task overview loaded successfully
          </p>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slideInLeft">
          {/* Total Tasks Card */}
          <div className="bg-terminal-bgLight/80 backdrop-blur-sm rounded border border-neon-cyan/40 shadow-[0_0_20px_rgba(0,255,255,0.2)] p-6 text-neon-cyan transform hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neon-cyan/70 text-xs font-mono mb-2 uppercase tracking-wider">[TOTAL_TASKS]</p>
                <p className="text-5xl font-bold font-mono">{totalTasks.toString().padStart(2, '0')}</p>
              </div>
              <div className="bg-neon-cyan/10 border border-neon-cyan/50 rounded p-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Completed Tasks Card */}
          <div className="bg-terminal-bgLight/80 backdrop-blur-sm rounded border border-neon-green/40 shadow-[0_0_20px_rgba(0,255,65,0.2)] p-6 text-neon-green transform hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,65,0.4)] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neon-green/70 text-xs font-mono mb-2 uppercase tracking-wider">[COMPLETED]</p>
                <p className="text-5xl font-bold font-mono">{completedTasks.toString().padStart(2, '0')}</p>
              </div>
              <div className="bg-neon-green/10 border border-neon-green/50 rounded p-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Pending Tasks Card */}
          <div className="bg-terminal-bgLight/80 backdrop-blur-sm rounded border border-neon-purple/40 shadow-[0_0_20px_rgba(157,78,221,0.2)] p-6 text-neon-purple transform hover:scale-105 hover:shadow-[0_0_30px_rgba(157,78,221,0.4)] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neon-purple/70 text-xs font-mono mb-2 uppercase tracking-wider">[PENDING]</p>
                <p className="text-5xl font-bold font-mono">{pendingTasks.toString().padStart(2, '0')}</p>
              </div>
              <div className="bg-neon-purple/10 border border-neon-purple/50 rounded p-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <div className="mb-8 animate-fadeIn" style={{ animationDelay: "0.1s" }}>
          <div className="bg-terminal-bgLight/80 backdrop-blur-sm rounded border border-neon-cyan/40 shadow-[0_0_20px_rgba(0,255,255,0.2)] p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-neon-cyan flex items-center gap-2 font-mono">
                  <span>📈</span>
                  [PROGRESS_METRICS]
                </h3>
                <p className="text-sm text-neon-green/70 mt-1 font-mono">
                  {'>'} {completedTasks}/{totalTasks} tasks executed
                </p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-neon-cyan font-mono">
                  {Math.round(progressPercentage)}%
                </p>
              </div>
            </div>
            <div className="relative w-full bg-terminal-border rounded h-4 overflow-hidden border border-neon-cyan/30">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-neon-cyan via-neon-green to-neon-purple rounded transition-all duration-700 ease-out shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Task Button */}
        <div className="mb-6 animate-slideInRight">
          <button
            onClick={() => setShowForm(!showForm)}
            className="group flex items-center gap-2 rounded border border-neon-green bg-neon-green/20 px-6 py-3 text-sm font-semibold text-neon-green shadow-[0_0_15px_rgba(0,255,65,0.3)] hover:bg-neon-green/30 hover:shadow-[0_0_25px_rgba(0,255,65,0.5)] transition-all duration-200 transform hover:scale-105 active:scale-95 font-mono"
          >
            {showForm ? (
              <>
                <span className="text-lg">✗</span>
                {'>'} CANCEL
              </>
            ) : (
              <>
                <span className="text-lg transform group-hover:rotate-90 transition-transform">➕</span>
                {'>'} NEW_TASK
              </>
            )}
          </button>
        </div>

        {/* Task Form */}
        {showForm && (
          <div className="mb-6 animate-scaleIn">
            <TaskForm
              onSubmit={async (data) => {
                const result = await createTask(data);
                if (result) {
                  setShowForm(false);
                }
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded bg-neon-pink/10 p-4 animate-slideInLeft border border-neon-pink/50 shadow-[0_0_15px_rgba(255,0,110,0.3)]">
            <div className="flex items-center gap-3">
              <span className="text-neon-pink text-lg">✗</span>
              <p className="text-sm text-neon-pink font-mono">[ERROR] {error}</p>
            </div>
          </div>
        )}

        {/* Task List */}
        <div className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
          <TaskList
            tasks={tasks}
            loading={loading}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        </div>
      </main>
    </div>
  );
}
