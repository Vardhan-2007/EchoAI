import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, Cell,
} from "recharts";

// ─── GLOBAL STYLES ───────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Figtree:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { width: 100%; overflow-x: hidden; }
html { scroll-behavior: smooth; }
body {
  font-family: 'Figtree', -apple-system, sans-serif;
  background: #07070a;
  color: #e2e2e8;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

:root {
  --bg:  #07070a;
  --s1:  #0e0e14;
  --s2:  #13131a;
  --s3:  #1a1a24;
  --s4:  #21212d;
  --s5:  #2a2a38;
  --b1:  rgba(255,255,255,.06);
  --b2:  rgba(255,255,255,.1);
  --b3:  rgba(255,255,255,.16);

  --q1-c:#f87171; --q1-bg:rgba(248,113,113,.08); --q1-bd:rgba(248,113,113,.2);
  --q2-c:#34d399; --q2-bg:rgba(52,211,153,.08);  --q2-bd:rgba(52,211,153,.2);
  --q3-c:#fbbf24; --q3-bg:rgba(251,191,36,.08);  --q3-bd:rgba(251,191,36,.2);
  --q4-c:#60a5fa; --q4-bg:rgba(96,165,250,.08);  --q4-bd:rgba(96,165,250,.2);

  --ac:  #7c5cfc; --ac2: #a48bff; --ac3: #c4b5fd;
  --acg: rgba(124,92,252,.16); --acg2: rgba(124,92,252,.07);

  --ok:  #34d399; --warn: #fbbf24; --err: #f87171; --info: #38bdf8;
  --t1: #ededf2; --t2: #8b8b9e; --t3: #3d3d52; --t4: #25252f;

  --radius-sm: 7px; --radius-md: 11px; --radius-lg: 16px; --radius-xl: 20px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,.5); --shadow-md: 0 4px 14px rgba(0,0,0,.6);
  --shadow-ac: 0 6px 20px rgba(124,92,252,.3);
  --transition: all .18s cubic-bezier(.4,0,.2,1);
}

.f-display { font-family: 'Outfit', sans-serif; }
.f-mono    { font-family: 'JetBrains Mono', monospace; }

/* ── Cards ── */
.card {
  background: var(--s1); border: 1px solid var(--b1);
  border-radius: var(--radius-xl);
  transition: border-color .2s;
}
.card-sm {
  background: var(--s1); border: 1px solid var(--b1);
  border-radius: var(--radius-lg);
  transition: var(--transition);
}
.card-sm:hover { border-color: var(--b2); }
.glass {
  background: rgba(14,14,20,.85); backdrop-filter: blur(20px) saturate(1.4);
  border: 1px solid var(--b2);
}

/* ── Inputs ── */
.inp {
  background: var(--s3); border: 1px solid var(--b1);
  border-radius: var(--radius-md); padding: 9px 13px;
  color: var(--t1); font-family: 'Figtree', sans-serif; font-size: 13.5px;
  width: 100%; outline: none; transition: var(--transition); line-height: 1.5;
}
.inp:hover  { border-color: var(--b2); }
.inp:focus  { border-color: var(--ac); box-shadow: 0 0 0 3px rgba(124,92,252,.13); background: var(--s2); }
.inp::placeholder { color: #a3a3b5; }
.inp:disabled { opacity: .45; cursor: not-allowed; }
select.inp option { background: var(--s2); color: var(--t1); }
textarea.inp { resize: vertical; }

/* ── Buttons ── */
.btn {
  border: none; border-radius: var(--radius-md);
  padding: 8px 15px; font-family: 'Figtree', sans-serif;
  font-weight: 500; cursor: pointer; transition: var(--transition);
  font-size: 13px; display: inline-flex; align-items: center;
  gap: 6px; line-height: 1; letter-spacing: -.01em; white-space: nowrap;
}
.btn:focus-visible { outline: 2px solid var(--ac); outline-offset: 2px; }
.btn-p {
  background: var(--ac); color: #fff;
  box-shadow: var(--shadow-ac);
}
.btn-p:hover:not(:disabled)  { background: #6d4ee8; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(124,92,252,.4); }
.btn-p:active:not(:disabled) { transform: translateY(0); }
.btn-p:disabled { opacity: .4; cursor: not-allowed; transform: none; box-shadow: none; }
.btn-s { background: var(--s3); color: var(--t1); border: 1px solid var(--b2); }
.btn-s:hover:not(:disabled) { background: var(--s4); border-color: var(--b3); }
.btn-s:disabled { opacity: .4; cursor: not-allowed; }
.btn-ghost { background: transparent; color: var(--t2); border: 1px solid transparent; }
.btn-ghost:hover { background: var(--s3); color: var(--t1); }
.btn-danger { background: rgba(248,113,113,.09); color: var(--err); border: 1px solid rgba(248,113,113,.18); }
.btn-danger:hover { background: rgba(248,113,113,.17); }
.btn-sm { padding: 5px 11px; font-size: 11.5px; border-radius: var(--radius-sm); }

/* ── Sidebar ── */
.echo-sidebar {
  background: linear-gradient(
    180deg,
    #12121a 0%,
    #0e0e14 60%,
    #0a0a10 100%
  );
  border-right: 1px solid rgba(255,255,255,0.08);
}
  .echo-sidebar::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(124,92,252,.35),
    transparent
  );
}
/* ── Navigation ── */
.nav-item {
  display: flex; align-items: center; gap: 9px; padding: 8px 11px;
  border-radius: var(--radius-md); cursor: pointer; transition: var(--transition);
  color: #a3a3b5; font-size: 13px; font-weight: 500; border: none;
  background: none; width: 100%; font-family: 'Figtree', sans-serif; text-align: left;
}
.nav-item:hover {
  background: rgba(255,255,255,0.05);
  color: #ffffff;
}
.nav-item.on {
  background: rgba(124,92,252,0.18);
  color: #c4b5fd;
  border: 1px solid rgba(124,92,252,.3);
  box-shadow: 0 0 12px rgba(124,92,252,.25);
}
.nav-badge {
  background: var(--err); color: #fff; font-size: 9px; font-weight: 700;
  padding: 2px 6px; border-radius: 20px; margin-left: auto;
  font-family: 'Outfit', sans-serif; letter-spacing: .02em;
}

/* ── Chat ── */
.bubble-u {
  background: var(--ac); color: #fff; padding: 10px 14px;
  border-radius: 14px 14px 3px 14px; max-width: 80%;
  align-self: flex-end; font-size: 13.5px; line-height: 1.65;
}
.bubble-a {
  background: var(--s3); border: 1px solid var(--b1); color: var(--t1);
  padding: 12px 15px; border-radius: 14px 14px 14px 3px;
  max-width: 90%; align-self: flex-start; font-size: 13.5px;
  line-height: 1.8; white-space: pre-wrap;
}

/* ── Progress ── */
.pbar  { height: 4px; border-radius: 9px; background: var(--s4); overflow: hidden; }
.pfill { height: 100%; border-radius: 9px; transition: width .7s cubic-bezier(.4,0,.2,1); }

/* ── Quadrant cells ── */
.qcell {
  border-radius: var(--radius-lg); padding: 16px; position: relative;
  overflow: hidden; transition: box-shadow .22s, border-color .22s;
}
.qcell:hover { box-shadow: 0 6px 24px rgba(0,0,0,.35); }
.tag {
  padding: 2px 9px; border-radius: 20px; font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: .07em; display: inline-flex; align-items: center; gap: 4px;
}
.task-pill {
  display: flex; align-items: center; gap: 8px; padding: 8px 11px;
  border-radius: var(--radius-md); cursor: grab; transition: var(--transition);
}
.task-pill:hover { transform: translateX(2px); }
.task-pill:active { cursor: grabbing; }

/* ── NBT highlight ── */
.nbt-card {
  background: linear-gradient(135deg, rgba(52,211,153,.1), rgba(52,211,153,.03));
  border: 1px solid rgba(52,211,153,.25); border-radius: var(--radius-lg);
  position: relative; overflow: hidden;
}
.nbt-card::before {
  content:''; position: absolute; inset: 0;
  background: radial-gradient(ellipse at 10% 50%, rgba(52,211,153,.07) 0%, transparent 65%);
  pointer-events: none;
}

/* ── Scrollbar ── */
.scroll-thin::-webkit-scrollbar { width: 4px; }
.scroll-thin::-webkit-scrollbar-track { background: transparent; }
.scroll-thin::-webkit-scrollbar-thumb { background: var(--s5); border-radius: 4px; }
.scroll-thin { scrollbar-width: thin; scrollbar-color: var(--s5) transparent; }

/* ── Animations ── */
@keyframes fadeUp   { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
@keyframes pop      { 0% { transform:scale(.93); opacity:0; } 55% { transform:scale(1.02); } 100% { transform:scale(1); opacity:1; } }
@keyframes slideIn  { from { transform:translateX(-6px); opacity:0; } to { transform:translateX(0); opacity:1; } }
@keyframes spin     { to { transform:rotate(360deg); } }
@keyframes pulse    { 0%,100% { opacity:1; } 50% { opacity:.3; } }
@keyframes glow     { 0%,100% { box-shadow:0 0 10px var(--ac); } 50% { box-shadow:0 0 22px var(--ac2), 0 0 40px rgba(124,92,252,.2); } }
@keyframes shimmer  { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
@keyframes blink    { 0%,100%{opacity:1;} 50%{opacity:0;} }

.anim     { animation: fadeUp .3s ease both; }
.anim-pop { animation: pop .32s cubic-bezier(.34,1.56,.64,1) both; }
.spin     { animation: spin .7s linear infinite; }
.pulse    { animation: pulse 2s ease-in-out infinite; }
.shimmer-bg {
  background: linear-gradient(90deg, var(--s2) 25%, var(--s3) 50%, var(--s2) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* ── Tooltip ── */
.recharts-tooltip-wrapper { outline: none !important; }
.recharts-tooltip-cursor  { fill: rgba(124,92,252,.05) !important; }

/* ── Skeleton ── */
.skel {
  background: var(--s3); border-radius: var(--radius-md);
  animation: shimmer 1.5s infinite;
  background: linear-gradient(90deg, var(--s3) 25%, var(--s4) 50%, var(--s3) 75%);
  background-size: 200% 100%;
}

/* ── Divider ── */
.divider { height:1px; background: var(--b1); width:100%; }

/* ── Dot status ── */
.status-dot {
  display: inline-block; width: 6px; height: 6px;
  border-radius: 50%; flex-shrink: 0;
}
  .qcell.drag-over {
  outline: 2px dashed var(--ac);
  background: rgba(108,99,255,0.08);
}
  .echo-sidebar::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(124,92,252,.3),
    transparent
  );
}
  .echo-sidebar {
  backdrop-filter: blur(20px);
}
`;

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date().toISOString().split("T")[0];
const fmtTime = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CATS = ["Work", "Study", "Health", "Personal", "Project", "Finance", "Other"];
const HOUR = new Date().getHours();
const GREETING = HOUR < 12 ? "Good morning" : HOUR < 17 ? "Good afternoon" : "Good evening";

const QUOTES = [
  { text: "What is important is seldom urgent, and what is urgent is seldom important.", by: "Dwight D. Eisenhower" },
  { text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.", by: "Stephen Covey" },
  { text: "Focus on being productive instead of busy.", by: "Tim Ferriss" },
  { text: "Deep work is the superpower of the 21st century.", by: "Cal Newport" },
  { text: "Energy, not time, is the fundamental currency of high performance.", by: "Jim Loehr" },
];

const QUADS = {
  Q1: { label: "Do First", desc: "Urgent & Important", color: "var(--q1-c)", bg: "var(--q1-bg)", bd: "var(--q1-bd)", icon: "🔥", hint: "Crises, deadlines, emergencies" },
  Q2: { label: "Schedule", desc: "Not Urgent & Important", color: "var(--q2-c)", bg: "var(--q2-bg)", bd: "var(--q2-bd)", icon: "🎯", hint: "Planning, growth, strategy" },
  Q3: { label: "Delegate", desc: "Urgent & Not Important", color: "var(--q3-c)", bg: "var(--q3-bg)", bd: "var(--q3-bd)", icon: "📤", hint: "Interruptions, some meetings" },
  Q4: { label: "Eliminate", desc: "Not Urgent & Not Impt", color: "var(--q4-c)", bg: "var(--q4-bg)", bd: "var(--q4-bd)", icon: "🗑️", hint: "Time-wasters, trivial tasks" },
};

const INIT_TASKS = [
  { id: uid(), title: "Submit project report", desc: "Final Q3 analysis", priority: "critical", cat: "Work", due: today(), status: "todo", notes: "", quad: "Q1", urgency: 9, importance: 9, aiRationale: "" },
  { id: uid(), title: "Study system design", desc: "Review distributed systems", priority: "high", cat: "Study", due: today(), status: "todo", notes: "Focus on CAP theorem", quad: "Q2", urgency: 4, importance: 9, aiRationale: "" },
  { id: uid(), title: "Answer Slack messages", desc: "Routine team updates", priority: "medium", cat: "Work", due: today(), status: "in-progress", notes: "", quad: "Q3", urgency: 8, importance: 3, aiRationale: "" },
  { id: uid(), title: "Morning workout", desc: "30min cardio + strength", priority: "medium", cat: "Health", due: today(), status: "done", notes: "", quad: "Q2", urgency: 3, importance: 8, aiRationale: "" },
  { id: uid(), title: "Read Atomic Habits ch.6", desc: "The 1% improvement loop", priority: "low", cat: "Personal", due: today(), status: "todo", notes: "", quad: "Q2", urgency: 2, importance: 7, aiRationale: "" },
  { id: uid(), title: "Scroll social media", desc: "Random browsing", priority: "low", cat: "Personal", due: today(), status: "todo", notes: "", quad: "Q4", urgency: 1, importance: 1, aiRationale: "" },
];
const INIT_HABITS = [
  { id: uid(), name: "Exercise", emoji: "🏋️", streak: 7, days: [true, false, true, true, false, true, false] },
  { id: uid(), name: "Read 30min", emoji: "📚", streak: 12, days: [true, true, true, false, true, true, false] },
  { id: uid(), name: "Meditate", emoji: "🧘", streak: 4, days: [false, true, false, true, false, true, false] },
  { id: uid(), name: "Deep Work", emoji: "🎯", streak: 9, days: [true, true, false, true, true, false, false] },
  { id: uid(), name: "Drink Water", emoji: "💧", streak: 21, days: [true, true, true, true, true, false, false] },
];

// ─── ICONS ────────────────────────────────────────────────────────────────────
const I = {
  dash: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
  task: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>,
  matrix: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="8" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /><rect x="13" y="13" width="8" height="8" rx="1" /></svg>,
  plan: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>,
  habit: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
  focus: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg>,
  chart: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>,
  review: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg>,
  ai: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 010 4h-1a2 2 0 00-2 2v1a2 2 0 01-4 0v-1a2 2 0 00-2-2H7a2 2 0 010-4h1a2 2 0 002-2V4a2 2 0 012-2z" /></svg>,
  nbt: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  plus: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>,
  trash: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></svg>,
  edit: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
  chk: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M20 6L9 17l-5-5" /></svg>,
  send: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>,
  play: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>,
  pause: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>,
  reset: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>,
  zap: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  x: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>,
  menu: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>,
  refresh: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6" /><path d="M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>,
  brain: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.5 2A2.5 2.5 0 007 4.5v0A2.5 2.5 0 014.5 7v0A2.5 2.5 0 012 9.5v5A2.5 2.5 0 014.5 17v0A2.5 2.5 0 017 19.5v0A2.5 2.5 0 019.5 22h5a2.5 2.5 0 002.5-2.5v0A2.5 2.5 0 0119.5 17v0A2.5 2.5 0 0122 14.5v-5A2.5 2.5 0 0119.5 7v0A2.5 2.5 0 0117 4.5v0A2.5 2.5 0 0014.5 2h-5z" /></svg>,
  fire: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 01-7 7 7 7 0 01-7-7c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" /></svg>,
  info: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>,
  warn: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
};

// ─── localStorage helpers ─────────────────────────────────────────────────────
const LS = {
  get: (k, def) => { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : def; } catch { return def; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } },
};

// ─── AI CALL with retry logic ─────────────────────────────────────────────────
async function callAI(messages, system = "", retries = 2) {
  const body = {
    model: "meta-llama/llama-3-8b-instruct",
    messages: [
      ...(system ? [{ role: "system", content: system }] : []),
      ...messages.map(m => ({ role: m.role, content: m.content || "" })),
    ],
  };

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": "Bearer ", "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) throw new Error("Empty response");
      return content;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 600 * (attempt + 1)));
    }
  }
}

// Safe JSON parse from AI response
function safeParseJSON(text, fallback = null) {
  if (!text) return fallback;
  try {
    const clean = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const start = clean.indexOf("[") !== -1 ? clean.indexOf("[") : clean.indexOf("{");
    const end = clean.lastIndexOf("]") !== -1 && clean.indexOf("[") !== -1
      ? clean.lastIndexOf("]")
      : clean.lastIndexOf("}");
    if (start === -1 || end === -1) return fallback;
    return JSON.parse(clean.slice(start, end + 1));
  } catch {
    return fallback;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── REUSABLE PRIMITIVES ────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const Spinner = ({ size = 14, color = "var(--ac2)" }) => (
  <span style={{
    display: "inline-block", width: size, height: size,
    border: `2px solid rgba(255,255,255,.1)`, borderTopColor: color,
    borderRadius: "50%", flexShrink: 0
  }} className="spin" />
);

const QuadBadge = ({ quad, small = false }) => {
  if (!quad || !QUADS[quad]) return null;
  const q = QUADS[quad];
  return (
    <span style={{
      background: q.bg, color: q.color, border: `1px solid ${q.bd}`,
      borderRadius: 20, fontSize: small ? 9 : 10, fontWeight: 700,
      padding: small ? "1px 6px" : "2px 8px",
      display: "inline-flex", alignItems: "center", gap: 3, whiteSpace: "nowrap",
    }}>
      {q.icon} {quad}
    </span>
  );
};

const UIBadge = ({ children, color = "var(--ac)", bg = "var(--acg2)", bd = "rgba(124,92,252,.2)", small = false }) => (
  <span style={{
    background: bg, color, border: `1px solid ${bd}`,
    borderRadius: 20, fontSize: small ? 9 : 10, fontWeight: 700,
    padding: small ? "1px 6px" : "2px 9px",
    display: "inline-flex", alignItems: "center", gap: 3,
  }}>{children}</span>
);

const StatCard = ({ label, value, suffix = "", color = "var(--ac2)", icon }) => (
  <div className="card-sm" style={{ padding: "16px 18px" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
      <span style={{ color, opacity: .65 }}>{icon}</span>
      <span style={{ fontSize: 10, color: "var(--t3)", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase" }}>{label}</span>
    </div>
    <div className="f-display" style={{ fontSize: 24, fontWeight: 700, color, letterSpacing: "-.02em" }}>
      {value}<span style={{ fontSize: 12, color: "var(--t3)", marginLeft: 2 }}>{suffix}</span>
    </div>
  </div>
);

const EmptyState = ({ icon, title, body, action }) => (
  <div style={{ textAlign: "center", padding: "52px 24px" }}>
    <div style={{ fontSize: 42, marginBottom: 14, filter: "grayscale(.3)" }}>{icon}</div>
    <div className="f-display" style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{title}</div>
    {body && <div style={{ fontSize: 13.5, color: "var(--t2)", marginBottom: 20, maxWidth: 320, margin: "0 auto 20px" }}>{body}</div>}
    {action}
  </div>
);

const SectionHeader = ({ title, subtitle, actions }) => (
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 4 }}>
    <div>
      <h2 className="f-display" style={{ fontSize: 21, fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.15 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 13, color: "var(--t2)", marginTop: 5 }}>{subtitle}</p>}
    </div>
    {actions && <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{actions}</div>}
  </div>
);

const SkeletonBlock = ({ h = 60, mb = 0 }) => (
  <div className="skel" style={{ height: h, borderRadius: 11, marginBottom: mb }} />
);

const ErrorBanner = ({ msg, onRetry }) => (
  <div style={{
    background: "rgba(248,113,113,.09)", border: "1px solid rgba(248,113,113,.2)", borderRadius: 11,
    padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--err)"
  }}>
    {I.warn} {msg}
    {onRetry && <button className="btn btn-sm btn-ghost" style={{ marginLeft: "auto", color: "var(--err)" }} onClick={onRetry}>Retry</button>}
  </div>
);

// Modal wrapper
const Modal = ({ show, onClose, title, children, maxW = 540 }) => {
  useEffect(() => {
    const handler = e => e.key === "Escape" && onClose();
    if (show) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [show, onClose]);
  if (!show) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.78)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 100, padding: 20, animation: "fadeIn .15s ease"
    }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card scroll-thin" style={{
        width: "100%", maxWidth: maxW, padding: 26,
        maxHeight: "90vh", overflowY: "auto", animation: "pop .25s ease", boxShadow: "0 24px 64px rgba(0,0,0,.7)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 className="f-display" style={{ fontSize: 17, fontWeight: 700 }}>{title}</h3>
          <button className="btn btn-ghost btn-sm" style={{ padding: "5px 7px" }} onClick={onClose}>{I.x}</button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Tooltip chart style
const ChartTooltipStyle = { background: "var(--s2)", border: "1px solid var(--b2)", borderRadius: 9, fontSize: 12, color: "var(--t1)" };

// ═══════════════════════════════════════════════════════════════════════════════
// ─── SIDEBAR ────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function Sidebar({ view, setView, open, setOpen, tasks }) {
  const Q1count = useMemo(() => tasks.filter(t => t?.quad === "Q1" && t?.status !== "done").length, [tasks]);
  const nav = [
    { id: "dash", label: "Dashboard", icon: I.dash },
    { id: "matrix", label: "AI Matrix", icon: I.matrix, badge: Q1count || null },
    { id: "tasks", label: "Tasks", icon: I.task },
    { id: "planner", label: "Planner", icon: I.plan },
    { id: "habits", label: "Habits", icon: I.habit },
    { id: "focus", label: "Focus Mode", icon: I.focus },
    { id: "analytics", label: "Analytics", icon: I.chart },
    { id: "review", label: "Weekly Review", icon: I.review },
    { id: "ai", label: "Echo AI", icon: I.ai },
  ];
  return (
    <>
      {open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.65)", zIndex: 40 }}
          onClick={() => setOpen(false)} />
      )}
      <aside className="echo-sidebar" style={{
        width: 220, background: "var(--s1)", borderRight: "1px solid var(--b1)",
        display: "flex", flexDirection: "column", padding: "18px 10px",
        position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 50,
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform .22s cubic-bezier(.4,0,.2,1)",
      }}>
        {/* Logo */}
        <div style={{ padding: "4px 8px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: "linear-gradient(135deg, var(--ac), var(--ac2))",
              boxShadow: "0 0 20px rgba(124,92,252,.35)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, boxShadow: "0 4px 12px var(--acg)", flexShrink: 0,
            }}>◈</div>
            <div>
              <div className="f-display" style={{ fontSize: 15, fontWeight: 700, color: "var(--t1)", letterSpacing: "-.02em" }}>Echo</div>
              <div style={{ fontSize: 9.5, color: "var(--t3)", letterSpacing: ".06em", textTransform: "uppercase" }}>Productivity AI</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {nav.map(n => (
            <button key={n.id} className={`nav-item${view === n.id ? " on" : ""}`}
              onClick={() => { setView(n.id); setOpen(false); }}>
              <span style={{ opacity: view === n.id ? 1 : .75, display: "flex" }}>{n.icon}</span>
              {n.label}
              {n.badge ? <span className="nav-badge">{n.badge}</span> : null}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ paddingTop: 14, borderTop: "1px solid var(--b1)", paddingLeft: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span className="status-dot pulse" style={{ background: "var(--ok)" }} />
            <span style={{ fontSize: 11, color: "var(--t3)" }}>Echo AI · Active</span>
          </div>
        </div>
      </aside>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── EISENHOWER ENGINE ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function EisenhowerEngine({ tasks, setTasks, setView }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [nbtLoading, setNbtLoading] = useState(false);
  const [nbt, setNbt] = useState(null);
  const [nbtHistory, setNbtHistory] = useState([]);
  const [dragTask, setDragTask] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const analyzingRef = useRef(false);
  const nbtRef = useRef(false);

  const active = useMemo(() => tasks.filter(t => t?.status !== "done"), [tasks]);

  const runFullAnalysis = useCallback(async () => {

    if (analyzingRef.current) return;

    analyzingRef.current = true;
    setAnalyzing(true);
    setError("");

    const taskList = active
      .map(t =>
        `ID:${t.id} | "${t.title}" | priority:${t.priority} | cat:${t.cat} | due:${t.due}`
      )
      .join("\n");

    try {

      const txt = await callAI([
        {
          role: "user",
          content: `Classify each task using the Eisenhower Matrix.

Return ONLY a valid JSON array in this format:
[
{"id":"...","quad":"Q1|Q2|Q3|Q4","urgency":1-10,"importance":1-10,"rationale":"one sentence"}
]

Tasks (today=${today()}):
${taskList}

No markdown. No explanation.`
        }
      ]);

      const results = safeParseJSON(txt, []);

      if (!Array.isArray(results) || results.length === 0) {
        throw new Error("Invalid AI response");
      }

      setTasks(prev =>
        prev.map(task => {

          const match = results.find(r => r?.id === task.id);

          if (!match) return task;

          return {
            ...task,
            quad: match.quad ?? task.quad,
            urgency: match.urgency ?? task.urgency,
            importance: match.importance ?? task.importance,
            aiRationale: match.rationale ?? task.aiRationale
          };

        })
      );

    } catch (err) {

      console.error("Analysis failed:", err);
      setError("Analysis failed. Check your API key or try again.");

    }

    setAnalyzing(false);
    analyzingRef.current = false;

  }, [active, setTasks]);

  const suggestNextBestTask = useCallback(async () => {
    if (nbtRef.current || active.length === 0) return;
    nbtRef.current = true;
    setNbtLoading(true); setError("");
    const taskList = active.map(t =>
      `ID:${t.id} | "${t.title}" | Q:${t.quad || "?"} | U:${t.urgency || 5} | I:${t.importance || 5} | cat:${t.cat}`
    ).join("\n");
    const timeOfDay = HOUR < 12 ? "morning" : HOUR < 17 ? "afternoon" : "evening";
    try {
      const txt = await callAI([{
        role: "user", content:
          `Pick the single best task to work on now.\nTime: ${timeOfDay} (${HOUR}:00). Previously suggested: ${nbtHistory.slice(-2).join(", ") || "none"}.\n\nTasks:\n${taskList}\n\nRespond ONLY as valid JSON:\n{"taskId":"...","taskTitle":"...","quad":"Q1|Q2|Q3|Q4","reason":"2-3 sentence why","energyMatch":"why it fits this time of day","estimatedTime":"X min","focusTip":"one tip","alternativeId":"...","alternativeTitle":"..."}\nNo markdown.`
      }]);
      const result = safeParseJSON(txt);
      if (!result?.taskId) throw new Error("Invalid response");
      setNbt(result);
      setNbtHistory(h => [...h, result.taskId]);
    } catch {
      setError("Couldn't get a suggestion. Try again.");
    }
    setNbtLoading(false);
    nbtRef.current = false;
  }, [active, nbtHistory]);

  useEffect(() => {
    const hasQuads = active.some(t => t.quad);
    if (hasQuads && !nbt) suggestNextBestTask();
  }, []); // eslint-disable-line

  const handleDrop = useCallback((e, quad) => {
    e.preventDefault();
    if (!dragTask) return;
    setTasks(prev => {

      const updated = prev.map(t =>
        t.id === dragTask
          ? { ...t, quad, aiRationale: "Manually moved" }
          : t
      );

      localStorage.setItem("jv_tasks", JSON.stringify(updated));

      return updated;
    });

    setDragTask(null);
    requestAnimationFrame(() => setDropTarget(null));

  }, [dragTask, setTasks]);

  const filteredActive = useMemo(() =>
    active.filter(t => filter === "all" ? true : t.cat === filter), [active, filter]);

  const byQuad = useCallback(
    q => filteredActive.filter(t => t.quad === q),
    [filteredActive]
  );

  const Q1count = byQuad("Q1").length;
  const Q2count = byQuad("Q2").length;
  const matScore = active.length
    ? Math.round(((Q2count * 2 + Q1count) / (active.length * 2)) * 100) : 0;

  return (
    <div className="anim" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <SectionHeader
        title="Eisenhower Matrix"
        subtitle="AI-powered task prioritization · drag tasks between quadrants"
        actions={<>
          <button className="btn btn-s" onClick={suggestNextBestTask} disabled={nbtLoading || active.length === 0} style={{ fontSize: 12 }}>
            {nbtLoading ? <Spinner /> : I.nbt} Suggest Next
          </button>
          <button className="btn btn-p" onClick={runFullAnalysis} disabled={analyzing} style={{ fontSize: 12 }}>
            {analyzing ? <Spinner color="#fff" /> : I.brain} Analyze All
          </button>
        </>}
      />

      {error && <ErrorBanner msg={error} onRetry={() => setError("")} />}

      {/* NBT Banner */}
      {(nbt || nbtLoading) && (
        <div className="nbt-card anim-pop" style={{ padding: "18px 22px" }}>
          {nbtLoading ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--t2)", fontSize: 13.5 }}>
              <Spinner size={15} color="var(--ok)" />
              Echo is selecting the best task for you…
            </div>
          ) : nbt && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,var(--ok),#00a87e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>⚡</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ok)", marginBottom: 2 }}>Next Best Task · Echo Recommendation</div>
                  <div className="f-display" style={{ fontSize: 17, fontWeight: 700, color: "var(--t1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nbt.taskTitle || "—"}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
                  <QuadBadge quad={nbt.quad} />
                  <span style={{ fontSize: 10.5, color: "var(--t3)" }}>~{nbt.estimatedTime || "?"}</span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10, marginBottom: 14 }}>
                {[
                  { icon: "💡", label: "Why now", val: nbt.reason },
                  { icon: "🕐", label: "Energy match", val: nbt.energyMatch },
                  { icon: "🎯", label: "Focus tip", val: nbt.focusTip },
                ].map(r => r.val && (
                  <div key={r.label} style={{ background: "rgba(52,211,153,.05)", border: "1px solid rgba(52,211,153,.1)", borderRadius: 10, padding: "10px 13px" }}>
                    <div style={{ fontSize: 10.5, color: "var(--ok)", fontWeight: 700, marginBottom: 4 }}>{r.icon} {r.label}</div>
                    <div style={{ fontSize: 12, color: "var(--t1)", lineHeight: 1.6 }}>{r.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                <button className="btn btn-p" style={{ fontSize: 12 }} onClick={() => setView("focus")}>{I.play} Start Focus</button>
                <button className="btn btn-s" style={{ fontSize: 12 }} onClick={suggestNextBestTask}>{I.refresh} Different Task</button>
                {nbt.alternativeTitle && (
                  <span style={{ fontSize: 12, color: "var(--t2)" }}>Alt: <span style={{ color: "var(--ac2)" }}>{nbt.alternativeTitle}</span></span>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 9 }}>
        {Object.entries(QUADS).map(([key, q]) => (
          <div key={key} style={{ background: q.bg, border: `1px solid ${q.bd}`, borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 17, marginBottom: 5 }}>{q.icon}</div>
            <div className="f-display" style={{ fontSize: 20, fontWeight: 700, color: q.color }}>{byQuad(key).length}</div>
            <div style={{ fontSize: 9.5, color: q.color, fontWeight: 700, opacity: .8, marginTop: 1 }}>{q.label}</div>
          </div>
        ))}
        <div style={{ background: "var(--acg2)", border: "1px solid rgba(124,92,252,.15)", borderRadius: 12, padding: "12px 14px" }}>
          <div style={{ fontSize: 17, marginBottom: 5 }}>🧠</div>
          <div className="f-display" style={{ fontSize: 20, fontWeight: 700, color: "var(--ac2)" }}>{matScore}%</div>
          <div style={{ fontSize: 9.5, color: "var(--ac2)", fontWeight: 700, opacity: .8, marginTop: 1 }}>Focus Quality</div>
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {["all", ...CATS].map(c => (
          <button key={c} className={`btn btn-sm ${filter === c ? "btn-p" : "btn-ghost"}`}
            onClick={() => setFilter(c)}>{c === "all" ? "All" : c}</button>
        ))}
      </div>

      {/* 2×2 Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {Object.entries(QUADS).map(([key, q]) => {
          const tasksInQuad = byQuad(key);
          const isDrop = dropTarget === key;
          return (
            <div
              key={key}
              className="qcell"
              style={{
                background: q.bg,
                border: `1px solid ${isDrop ? q.color : q.bd}`,
                minHeight: 190,
                outline: isDrop ? `2px dashed ${q.color}` : "none",
                outlineOffset: -3
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDropTarget(key);
              }}
              onDragLeave={() => setDropTarget(null)}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(e, key);
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                <span style={{ fontSize: 16 }}>{q.icon}</span>
                <span className="f-display" style={{ fontSize: 13.5, fontWeight: 700, color: q.color }}>{key} · {q.label}</span>
                <span style={{ background: q.color, color: "#000", borderRadius: 20, fontSize: 9.5, fontWeight: 800, padding: "1px 7px", opacity: .8 }}>{tasksInQuad.length}</span>
              </div>
              <div style={{ fontSize: 10.5, color: "var(--t3)", marginBottom: 10, marginLeft: 23 }}>{q.hint}</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {tasksInQuad.length === 0 && (
                  <div style={{ textAlign: "center", padding: "20px 0", color: "var(--t3)", fontSize: 12, fontStyle: "italic" }}>Drop tasks here</div>
                )}
                {tasksInQuad.map(t => (
                  <div
                    key={t.id}
                    className="task-pill"
                    draggable
                    onDragStart={(e) => {
                      setDragTask(t.id);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragEnd={() => {
                      setDragTask(null);
                      setDropTarget(null);
                    }}
                    style={{
                      background: dragTask === t.id ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.22)",
                      border: `1px solid ${t.id === nbt?.taskId ? q.color : "rgba(255,255,255,.05)"}`,
                      boxShadow: t.id === nbt?.taskId ? `0 0 0 2px ${q.color}33` : "none",
                      opacity: dragTask === t.id ? .4 : 1,
                    }}
                    onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
                  >
                    {t.id === nbt?.taskId && <span className="status-dot pulse" style={{ background: "var(--ok)", boxShadow: "0 0 5px var(--ok)" }} />}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: t.status === "done" ? "var(--t3)" : "var(--t1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div>
                      {t.aiRationale && <div style={{ fontSize: 10, color: "var(--t3)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.aiRationale}</div>}
                    </div>
                    {(t.urgency != null && t.importance != null) && (
                      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                        <span title="Urgency" style={{ background: "rgba(248,113,113,.12)", color: "var(--q1-c)", borderRadius: 5, padding: "2px 5px", fontSize: 9, fontWeight: 700 }}>U{t.urgency}</span>
                        <span title="Importance" style={{ background: "rgba(52,211,153,.1)", color: "var(--q2-c)", borderRadius: 5, padding: "2px 5px", fontSize: 9, fontWeight: 700 }}>I{t.importance}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Expanded detail */}
              {expandedId && tasksInQuad.find(t => t.id === expandedId) && (() => {
                const t = tasksInQuad.find(x => x.id === expandedId);
                return (
                  <div className="anim" style={{ marginTop: 10, background: "rgba(0,0,0,.3)", borderRadius: 10, padding: 13, border: `1px solid ${q.bd}` }}>
                    <div className="f-display" style={{ fontSize: 13, fontWeight: 700, color: q.color, marginBottom: 6 }}>{t.title}</div>
                    {t.desc && <div style={{ fontSize: 11.5, color: "var(--t2)", marginBottom: 5 }}>{t.desc}</div>}
                    {t.aiRationale && (
                      <div style={{ fontSize: 11, color: "var(--t1)", lineHeight: 1.65, background: "rgba(255,255,255,.04)", borderRadius: 7, padding: "7px 10px" }}>
                        <span style={{ color: q.color, fontWeight: 700 }}>◈ Echo: </span>{t.aiRationale}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                      <span style={{ fontSize: 11, color: "var(--t3)" }}>Due: <span style={{ color: "var(--t2)" }}>{t.due}</span></span>
                      <span style={{ fontSize: 11, color: "var(--t3)" }}>Cat: <span style={{ color: "var(--t2)" }}>{t.cat}</span></span>
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>

      <UrgencyImportanceChart tasks={filteredActive} nbtId={nbt?.taskId} />
    </div>
  );
}

function UrgencyImportanceChart({ tasks, nbtId }) {
  const validTasks = useMemo(() => tasks.filter(t => t.urgency != null && t.importance != null), [tasks]);
  return (
    <div className="card" style={{ padding: 22 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div className="f-display" style={{ fontSize: 14, fontWeight: 700 }}>Urgency × Importance Map</div>
          <div style={{ fontSize: 11.5, color: "var(--t2)", marginTop: 3 }}>Scatter view · hover dots for details</div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {Object.entries(QUADS).map(([k, q]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: q.color }} />
              <span style={{ fontSize: 10, color: "var(--t3)" }}>{k}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "relative", height: 260 }}>
        <div style={{ position: "absolute", left: 50, right: 0, top: 0, bottom: 28, border: "1px solid var(--s5)", borderRadius: 8, overflow: "hidden" }}>
          {[
            { left: "50%", top: 0, width: "50%", height: "50%", color: "var(--q1-bg)" },
            { left: 0, top: 0, width: "50%", height: "50%", color: "var(--q2-bg)" },
            { left: "50%", top: "50%", width: "50%", height: "50%", color: "var(--q3-bg)" },
            { left: 0, top: "50%", width: "50%", height: "50%", color: "var(--q4-bg)" },
          ].map((qb, i) => <div key={i} style={{ position: "absolute", ...qb, opacity: .7 }} />)}
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "var(--b1)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: "var(--b1)" }} />
          {[
            { text: "Q1", left: "75%", top: "7%", color: "var(--q1-c)" },
            { text: "Q2", left: "25%", top: "7%", color: "var(--q2-c)" },
            { text: "Q3", left: "75%", top: "57%", color: "var(--q3-c)" },
            { text: "Q4", left: "25%", top: "57%", color: "var(--q4-c)" },
          ].map(l => (
            <div key={l.text} style={{ position: "absolute", transform: "translateX(-50%)", fontSize: 9, fontWeight: 800, letterSpacing: ".07em", color: l.color, opacity: .5, fontFamily: "'Outfit',sans-serif", left: l.left, top: l.top }}>{l.text}</div>
          ))}
          {validTasks.map(t => {
            const x = `${(t.urgency / 10) * 100}%`;
            const y = `${(1 - t.importance / 10) * 100}%`;
            const q = QUADS[t.quad];
            const isNbt = t.id === nbtId;
            return (
              <div key={t.id}
                title={`${t.title}\nU:${t.urgency} I:${t.importance}\n${q?.label || ""}`}
                style={{
                  position: "absolute", left: x, top: y, width: isNbt ? 13 : 9, height: isNbt ? 13 : 9,
                  borderRadius: "50%", background: q?.color || "var(--t2)", transform: "translate(-50%,-50%)",
                  border: isNbt ? "2px solid #fff" : "none",
                  boxShadow: isNbt ? `0 0 10px ${q?.color}` : `0 0 4px ${q?.color}55`,
                  cursor: "pointer", zIndex: isNbt ? 2 : 1, transition: "all .2s"
                }}
              />
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%) rotate(-90deg)", fontSize: 9.5, color: "var(--t3)", fontWeight: 600, letterSpacing: ".06em", transformOrigin: "center" }}>IMPORTANCE ↑</div>
        <div style={{ position: "absolute", left: "55%", bottom: 6, transform: "translateX(-50%)", fontSize: 9.5, color: "var(--t3)", fontWeight: 600, letterSpacing: ".06em" }}>URGENCY →</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── DASHBOARD ──────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function Dashboard({ tasks, habits, focusSess, setView }) {
  const q = useMemo(
    () => QUOTES[Math.floor(Date.now() / 86400000) % QUOTES.length],
    []
  );
  const done = useMemo(() => tasks.filter(t => t?.status === "done").length, [tasks]);
  const total = tasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const Q1 = useMemo(() => tasks.filter(t => t?.quad === "Q1" && t?.status !== "done"), [tasks]);
  const Q2 = useMemo(() => tasks.filter(t => t?.quad === "Q2" && t?.status !== "done"), [tasks]);
  const focusHrs = useMemo(() => (focusSess.reduce((a, s) => a + (s?.mins || 0), 0) / 60).toFixed(1), [focusSess]);
  const topStreak = useMemo(() => Math.max(...habits.map(h => h?.streak || 0), 0), [habits]);

  return (
    <div className="anim" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* Hero */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
        <div>
          <div style={{ fontSize: 11.5, color: "var(--t3)", marginBottom: 6, letterSpacing: ".04em" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </div>
          <h1 className="f-display" style={{ fontSize: 28, fontWeight: 700, color: "var(--t1)", letterSpacing: "-.04em", lineHeight: 1.1 }}>
            {GREETING} ✦
          </h1>
          <p style={{ color: "var(--t2)", marginTop: 8, fontSize: 13.5, lineHeight: 1.6 }}>
            <span style={{ color: "var(--q1-c)", fontWeight: 600 }}>{Q1.length} urgent</span> · <span style={{ color: "var(--q2-c)", fontWeight: 600 }}>{Q2.length} important</span> tasks need attention.
          </p>
        </div>
        <div style={{ background: "var(--acg2)", border: "1px solid rgba(124,92,252,.14)", borderRadius: 14, padding: "14px 18px", maxWidth: 290 }}>
          <div style={{ fontSize: 12.5, fontStyle: "italic", color: "var(--t1)", lineHeight: 1.7 }}>"{q.text}"</div>
          <div style={{ fontSize: 11, color: "var(--ac2)", marginTop: 7, fontWeight: 600 }}>— {q.by}</div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10 }}>
        <StatCard label="Tasks Done" value={`${done}/${total}`} color="var(--ok)" icon={I.task} />
        <StatCard label="Focus Hours" value={`${focusHrs}`} suffix="h" color="var(--ac2)" icon={I.focus} />
        <StatCard label="Top Streak" value={`${topStreak}`} suffix="d" color="var(--warn)" icon={I.fire} />
        <StatCard label="Productivity" value={`${pct}`} suffix="%" color="var(--info)" icon={I.chart} />
      </div>

      {/* Matrix overview + tasks */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 14, display: "flex", alignItems: "center", gap: 7, color: "var(--t2)" }}>
            {I.matrix} Matrix Overview
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {Object.entries(QUADS).map(([k, q]) => {
              const n = tasks.filter(t => t?.quad === k && t?.status !== "done").length;
              return (
                <div key={k} style={{ background: q.bg, border: `1px solid ${q.bd}`, borderRadius: 10, padding: "10px 13px", cursor: "pointer", transition: "var(--transition)" }}
                  onClick={() => setView("matrix")}>
                  <div style={{ fontSize: 16, marginBottom: 4 }}>{q.icon}</div>
                  <div className="f-display" style={{ fontSize: 20, fontWeight: 700, color: q.color }}>{n}</div>
                  <div style={{ fontSize: 9.5, color: q.color, fontWeight: 700, opacity: .75, marginTop: 1 }}>{k} · {q.label}</div>
                </div>
              );
            })}
          </div>
          <button className="btn btn-p" style={{ marginTop: 14, width: "100%", justifyContent: "center", fontSize: 12 }}
            onClick={() => setView("matrix")}>{I.brain} Open AI Matrix</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Q1.length > 0 && (
            <div className="card-sm" style={{ padding: 16, background: "var(--q1-bg)", borderColor: "var(--q1-bd)" }}>
              <div style={{ fontSize: 10.5, color: "var(--q1-c)", fontWeight: 700, letterSpacing: ".07em", marginBottom: 9 }}>🔥 DO FIRST — Q1 URGENT</div>
              {Q1.slice(0, 3).map(t => (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span className="status-dot" style={{ background: "var(--q1-c)" }} />
                  <span style={{ fontSize: 12.5, fontWeight: 500 }}>{t.title}</span>
                </div>
              ))}
              {Q1.length > 3 && <div style={{ fontSize: 11, color: "var(--t3)" }}>+{Q1.length - 3} more</div>}
            </div>
          )}
          <div className="card-sm" style={{ padding: 16, flex: 1 }}>
            <div style={{ fontSize: 10.5, color: "var(--t2)", fontWeight: 600, letterSpacing: ".06em", marginBottom: 10 }}>TODAY'S PROGRESS</div>
            <div className="pbar" style={{ marginBottom: 12 }}>
              <div className="pfill" style={{ width: `${pct}%`, background: pct > 70 ? "var(--ok)" : pct > 40 ? "var(--warn)" : "var(--ac)" }} />
            </div>
            {tasks.slice(0, 5).map(t => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: "1px solid var(--s3)" }}>
                <div style={{ width: 14, height: 14, borderRadius: 4, background: t.status === "done" ? "var(--ok)" : "transparent", border: `1.5px solid ${t.status === "done" ? "var(--ok)" : "var(--b2)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff" }}>
                  {t.status === "done" && I.chk}
                </div>
                <span style={{ fontSize: 12, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: t.status === "done" ? "var(--t3)" : "var(--t1)", textDecoration: t.status === "done" ? "line-through" : "none" }}>{t.title}</span>
                <QuadBadge quad={t.quad} small />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── TASK MANAGER ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function TaskManager({ tasks, setTasks }) {
  const EMPTY = { title: "", desc: "", priority: "medium", cat: "Work", due: today(), status: "todo", notes: "", quad: "Q2", urgency: 5, importance: 5, aiRationale: "" };
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [modal, setModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [nlInput, setNlInput] = useState("");
  const [parsing, setParsing] = useState(false);
  const [classifying, setClassifying] = useState(null);
  const [error, setError] = useState("");
  const classifyRef = useRef(null);

  const save = useCallback(() => {
    if (!form.title?.trim()) return;
    if (editId) {
      setTasks(t => t.map(x => x.id === editId ? { ...form, id: editId } : x));
      setEditId(null);
    } else {
      setTasks(t => [...t, { ...form, id: uid() }]);
    }
    setForm(EMPTY); setModal(false); setError("");
  }, [form, editId, setTasks]);

  const del = useCallback(id => setTasks(t => t.filter(x => x.id !== id)), [setTasks]);
  const toggle = useCallback(id => setTasks(t => t.map(x => x.id === id ? { ...x, status: x.status === "done" ? "todo" : "done" } : x)), [setTasks]);
  const startEdit = useCallback(task => { setForm({ ...EMPTY, ...task }); setEditId(task.id); setModal(true); }, []);

  const classifyOne = useCallback(async task => {
    if (classifyRef.current === task.id) return;
    classifyRef.current = task.id;
    setClassifying(task.id);
    try {
      const txt = await callAI([{
        role: "user", content:
          `Classify this task with the Eisenhower Matrix:\n"${task.title}" | priority:${task.priority} | cat:${task.cat} | due:${task.due} | desc:"${task.desc || ""}"\n\nReturn ONLY valid JSON: {"quad":"Q1|Q2|Q3|Q4","urgency":1-10,"importance":1-10,"rationale":"one sentence"}\nNo markdown.`
      }]);
      const r = safeParseJSON(txt);
      if (r?.quad) {
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, quad: r.quad, urgency: r.urgency ?? t.urgency, importance: r.importance ?? t.importance, aiRationale: r.rationale || t.aiRationale } : t));
      }
    } catch { }
    setClassifying(null);
    classifyRef.current = null;
  }, [setTasks]);

  const parseNL = useCallback(async () => {
    if (!nlInput.trim()) return;
    setParsing(true); setError("");
    try {
      const txt = await callAI([{
        role: "user", content:
          `Parse this task: "${nlInput}"\nReturn ONLY valid JSON with fields: title, desc, priority (critical/high/medium/low), cat (Work/Study/Health/Personal/Project/Other), due (YYYY-MM-DD, default ${today()}), status ("todo"), notes, quad (Q1/Q2/Q3/Q4), urgency (1-10), importance (1-10), aiRationale.\nNo markdown.`
      }]);
      const parsed = safeParseJSON(txt);
      if (parsed?.title) {
        setForm(f => ({ ...EMPTY, ...f, ...parsed }));
        setModal(true);
      } else {
        setForm({ ...EMPTY, title: nlInput });
        setModal(true);
      }
    } catch {
      setForm({ ...EMPTY, title: nlInput });
      setModal(true);
    }
    setNlInput(""); setParsing(false);
  }, [nlInput]);

  const filtered = useMemo(() =>
    tasks.filter(t => filter === "all" ? true : filter === "done" ? t.status === "done" : t.status !== "done"),
    [tasks, filter]
  );

  const FormField = ({ label, children }) => (
    <div>
      {label && <label style={{ fontSize: 11.5, color: "var(--t2)", marginBottom: 6, display: "block", fontWeight: 500 }}>{label}</label>}
      {children}
    </div>
  );

  return (
    <div className="anim" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <SectionHeader title="Task Manager" actions={
        <button className="btn btn-p" onClick={() => { setEditId(null); setForm(EMPTY); setModal(true); }}>{I.plus} New Task</button>
      } />

      {/* NL Parse */}
      <div style={{ display: "flex", gap: 8 }}>
        <input className="inp" placeholder='✨ Natural language: "Fix auth bug by Friday, high priority"'
          value={nlInput} onChange={e => setNlInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !parsing && parseNL()}
          style={{ flex: 1 }} />
        <button className="btn btn-s" onClick={parseNL} disabled={parsing || !nlInput.trim()} style={{ flexShrink: 0 }}>
          {parsing ? <Spinner /> : I.zap} Parse
        </button>
      </div>

      {error && <ErrorBanner msg={error} onRetry={() => setError("")} />}

      <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
        {["all", "active", "done"].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? "btn-p" : "btn-ghost"}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--t3)" }}>{filtered.length} task{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Task Form Modal */}
      <Modal show={modal} onClose={() => { setModal(false); setError(""); }} title={editId ? "Edit Task" : "New Task"}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <FormField>
            <input className="inp" placeholder="Task title *" value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              style={{ borderColor: !form.title?.trim() && error ? "var(--err)" : undefined }} />
          </FormField>
          <FormField>
            <textarea className="inp" placeholder="Description (optional)" value={form.desc}
              onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} style={{ height: 68 }} />
          </FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <FormField label="Priority">
              <select className="inp" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                <option value="critical">🔴 Critical</option>
                <option value="high">🟠 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </FormField>
            <FormField label="Category">
              <select className="inp" value={form.cat} onChange={e => setForm(f => ({ ...f, cat: e.target.value }))}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="Due date">
              <input type="date" className="inp" value={form.due} onChange={e => setForm(f => ({ ...f, due: e.target.value }))} />
            </FormField>
            <FormField label="Status">
              <select className="inp" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </FormField>
          </div>
          {/* Eisenhower override */}
          <div style={{ background: "var(--s2)", border: "1px solid var(--b1)", borderRadius: 11, padding: "13px 15px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--t2)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              {I.matrix} Eisenhower Quadrant
              <span style={{ fontSize: 10, color: "var(--t3)", fontWeight: 400 }}>(or let AI decide)</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
              {Object.entries(QUADS).map(([k, q]) => (
                <button key={k} type="button"
                  style={{ background: form.quad === k ? q.bg : "transparent", border: `1px solid ${form.quad === k ? q.color : "var(--b1)"}`, borderRadius: 9, padding: "8px 11px", cursor: "pointer", textAlign: "left", transition: "var(--transition)" }}
                  onClick={() => setForm(f => ({ ...f, quad: k }))}>
                  <div style={{ fontSize: 12.5 }}>{q.icon} <span style={{ fontSize: 11, fontWeight: 700, color: form.quad === k ? q.color : "var(--t2)" }}>{k} {q.label}</span></div>
                  <div style={{ fontSize: 10, color: "var(--t3)", marginTop: 2 }}>{q.desc}</div>
                </button>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
              {[{ l: "Urgency", k: "urgency" }, { l: "Importance", k: "importance" }].map(f => (
                <div key={f.k}>
                  <div style={{ fontSize: 11, color: "var(--t3)", marginBottom: 5 }}>{f.l}: <span style={{ color: "var(--t1)", fontWeight: 600 }}>{form[f.k]}/10</span></div>
                  <input type="range" min="1" max="10" value={form[f.k]}
                    onChange={e => setForm(x => ({ ...x, [f.k]: +e.target.value }))}
                    style={{ width: "100%", accentColor: "var(--ac)", cursor: "pointer" }} />
                </div>
              ))}
            </div>
          </div>
          <FormField label="Notes">
            <textarea className="inp" placeholder="Notes (optional)" value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ height: 52 }} />
          </FormField>
          {error && <ErrorBanner msg={error} />}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 4 }}>
            <button className="btn btn-ghost" onClick={() => { setModal(false); setError(""); }}>Cancel</button>
            <button className="btn btn-p" onClick={() => { if (!form.title?.trim()) { setError("Title is required."); return; } save(); }}>{editId ? "Save Changes" : "Add Task"}</button>
          </div>
        </div>
      </Modal>

      {/* Task list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {filtered.length === 0 && <EmptyState icon="📋" title="No tasks" body="Add tasks above or use natural language to create one instantly." />}
        {filtered.map(t => {
          const q = t.quad ? QUADS[t.quad] : null;
          return (
            <div key={t.id} className="card-sm" style={{ padding: "12px 15px", display: "flex", alignItems: "center", gap: 11, opacity: t.status === "done" ? .55 : 1, transition: "var(--transition)" }}>
              <button
                style={{ width: 17, height: 17, borderRadius: 5, background: t.status === "done" ? "var(--ok)" : "transparent", border: `1.5px solid ${t.status === "done" ? "var(--ok)" : "var(--b2)"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, color: "#fff", transition: "var(--transition)" }}
                onClick={() => toggle(t.id)}>
                {t.status === "done" && I.chk}
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: t.status === "done" ? "var(--t3)" : "var(--t1)", textDecoration: t.status === "done" ? "line-through" : "none" }}>{t.title}</span>
                  <QuadBadge quad={t.quad} small />
                  <span style={{ fontSize: 10, color: "var(--t3)", background: "var(--s3)", padding: "2px 7px", borderRadius: 7 }}>{t.cat}</span>
                </div>
                {t.aiRationale && <div style={{ fontSize: 11, color: "var(--t3)", marginTop: 2, fontStyle: "italic" }}>◈ {t.aiRationale}</div>}
              </div>
              {t.urgency != null && (
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  <span style={{ background: "rgba(248,113,113,.1)", color: "var(--q1-c)", borderRadius: 5, padding: "2px 5px", fontSize: 9.5, fontWeight: 700 }}>U{t.urgency}</span>
                  <span style={{ background: "rgba(52,211,153,.08)", color: "var(--q2-c)", borderRadius: 5, padding: "2px 5px", fontSize: 9.5, fontWeight: 700 }}>I{t.importance}</span>
                </div>
              )}
              <span style={{ fontSize: 11, color: "var(--t3)", whiteSpace: "nowrap" }}>{t.due}</span>
              <div style={{ display: "flex", gap: 4 }}>
                <button className="btn btn-ghost btn-sm" title="AI Classify" onClick={() => classifyOne(t)} disabled={classifying === t.id}>
                  {classifying === t.id ? <Spinner size={11} /> : I.brain}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => startEdit(t)}>{I.edit}</button>
                <button className="btn btn-ghost btn-sm" style={{ color: "var(--err)" }} onClick={() => del(t.id)}>{I.trash}</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── PLANNER ────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function Planner({ tasks, plan, setPlan }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const loadingRef = useRef(false);

  const generate = useCallback(async () => {

    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    setError("");

    const taskList = tasks
      .filter(t => t?.status !== "done")
      .map(t => `- [${t.quad || "Q2"}] ${t.title} (${t.priority}, ${t.cat})`)
      .join("\n");

    try {

      const txt = await callAI([
        {
          role: "user",
          content: `Create a time-blocked schedule from 7AM to 10PM.

Order tasks by Eisenhower priority:
Q1 → Q2 → Q3 → Q4.

Include deep work blocks, breaks, and meals.

Tasks:
${taskList || "General productive day"}

Return ONLY a JSON array like this:

[
{"time":"7:00 AM","title":"...","type":"work|break|meal|exercise|study","duration":"X min","quad":"Q1|Q2|Q3|Q4|null","tip":"..."}
]

No markdown. No explanation.`
        }
      ]);

      const clean = txt
        .replace(/```json\s*/g, "")
        .replace(/```/g, "")
        .trim();

      const start = clean.indexOf("[");
      const end = clean.lastIndexOf("]");

      if (start === -1 || end === -1) {
        throw new Error("Planner JSON missing");
      }

      const json = clean.slice(start, end + 1);

      const parsed = JSON.parse(json);

      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("Planner response invalid");
      }

      setPlan(parsed);

    } catch (err) {

      console.error("Planner error:", err);
      setError("Failed to generate plan. Please try again.");
      setPlan([]);

    }

    setLoading(false);
    loadingRef.current = false;

  }, [tasks, setPlan]);

  const typeColor = { work: "var(--ac2)", study: "var(--info)", exercise: "var(--ok)", meal: "var(--warn)", break: "var(--t2)" };
  const typeBg = { work: "rgba(167,139,250,.08)", study: "rgba(56,189,248,.08)", exercise: "rgba(52,211,153,.08)", meal: "rgba(251,191,36,.08)", break: "rgba(100,100,130,.05)" };

  return (
    <div className="anim" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionHeader title="Daily Planner" subtitle="AI schedules Q1→Q2→Q3→Q4 priority order"
        actions={<button className="btn btn-p" onClick={generate} disabled={loading}>
          {loading ? <Spinner color="#fff" /> : I.zap} {loading ? "Planning…" : "Plan My Day"}
        </button>}
      />

      {error && <ErrorBanner msg={error} onRetry={generate} />}

      {!loading && plan.length === 0 && !error && (
        <div className="card">
          <EmptyState icon="📅" title="No Schedule Yet"
            body="Echo will analyze your Eisenhower Matrix and build an optimized time-blocked schedule."
            action={<button className="btn btn-p" onClick={generate}>{I.zap} Generate My Schedule</button>} />
        </div>
      )}

      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {[...Array(7)].map((_, i) => <SkeletonBlock key={i} h={68} />)}
        </div>
      )}

      {!loading && plan.length > 0 && (
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 70, top: 0, bottom: 0, width: 1, background: "var(--s4)" }} />
          {plan.map((item, i) => {
            if (!item) return null;
            const q = item.quad ? QUADS[item.quad] : null;
            return (
              <div key={i} style={{ display: "flex", gap: 15, paddingBottom: 4, position: "relative", zIndex: 1, animation: `slideIn .22s ${i * .035}s both` }}>
                <div style={{ width: 70, textAlign: "right", paddingTop: 15, flexShrink: 0 }}>
                  <span className="f-mono" style={{ fontSize: 11, color: "var(--t3)" }}>{item.time || "—"}</span>
                </div>
                <div style={{ width: 12, paddingTop: 20, flexShrink: 0 }}>
                  <div style={{ width: 9, height: 9, borderRadius: "50%", background: q ? q.color : (typeColor[item.type] || "var(--ac2)"), marginLeft: 1, border: "2px solid var(--bg)" }} />
                </div>
                <div style={{ flex: 1, background: typeBg[item.type] || "var(--acg2)", border: `1px solid ${q ? q.bd : "rgba(124,92,252,.12)"}`, borderRadius: 11, padding: "11px 15px", marginBottom: 7 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: q ? q.color : (typeColor[item.type] || "var(--t1)") }}>{item.title || "—"}</span>
                      {q && <QuadBadge quad={item.quad} small />}
                    </div>
                    <span style={{ fontSize: 11, color: "var(--t3)", whiteSpace: "nowrap" }}>{item.duration || ""}</span>
                  </div>
                  {item.tip && <div style={{ fontSize: 11.5, color: "var(--t2)", marginTop: 5, fontStyle: "italic" }}>💡 {item.tip}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── HABIT TRACKER ──────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function HabitTracker({ habits, setHabits }) {
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("⭐");
  const todayIdx = new Date().getDay();

  const add = useCallback(() => {
    if (!newName.trim()) return;
    setHabits(h => [...h, { id: uid(), name: newName.trim(), emoji: newEmoji || "⭐", streak: 0, days: Array(7).fill(false) }]);
    setNewName(""); setNewEmoji("⭐");
  }, [newName, newEmoji, setHabits]);

  const toggleDay = useCallback((hid, di) => {
    setHabits(h => h.map(x => {
      if (x.id !== hid) return x;
      const days = [...x.days]; days[di] = !days[di];
      const streak = di === todayIdx ? (days[di] ? x.streak + 1 : Math.max(0, x.streak - 1)) : x.streak;
      return { ...x, days, streak };
    }));
  }, [todayIdx, setHabits]);

  const del = useCallback(id => setHabits(h => h.filter(x => x.id !== id)), [setHabits]);

  const weeklyData = useMemo(() =>
    DAYS.map((d, i) => ({ day: d, done: habits.filter(h => h?.days?.[i]).length })), [habits]);

  return (
    <div className="anim" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <SectionHeader title="Habit Tracker" subtitle={new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} />

      <div style={{ display: "flex", gap: 8 }}>
        <input className="inp" placeholder="New habit name…" value={newName}
          onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} style={{ flex: 1 }} />
        <input className="inp" placeholder="Emoji" value={newEmoji}
          onChange={e => setNewEmoji(e.target.value)} style={{ width: 68 }} />
        <button className="btn btn-p" onClick={add} disabled={!newName.trim()}>{I.plus}</button>
      </div>

      {habits.length > 0 && (
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 12, color: "var(--t2)" }}>Weekly Completion</div>
          <ResponsiveContainer width="100%" height={96}>
            <BarChart data={weeklyData} barSize={16}>
              <XAxis dataKey="day" tick={{ fill: "var(--t3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={ChartTooltipStyle} cursor={{ fill: "rgba(124,92,252,.05)" }} />
              <Bar dataKey="done" radius={[4, 4, 0, 0]}>
                {weeklyData.map((_, i) => <Cell key={i} fill={i === todayIdx ? "var(--ac)" : "var(--s5)"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {habits.length === 0 && <EmptyState icon="🌱" title="No habits yet" body="Add your first habit above to start building your streak." />}

      {habits.map(h => (
        <div key={h.id} className="card-sm" style={{ padding: "15px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 13 }}>
            <span style={{ fontSize: 22 }}>{h.emoji || "⭐"}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{h.name}</div>
              <div style={{ fontSize: 11.5, color: "var(--warn)", marginTop: 2 }}>🔥 {h.streak} day streak</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div className="pbar" style={{ width: 64 }}>
                <div className="pfill" style={{ width: `${Math.min(100, (h.streak / 30) * 100)}%`, background: "var(--warn)" }} />
              </div>
              <button className="btn btn-ghost btn-sm" style={{ color: "var(--err)" }} onClick={() => del(h.id)}>{I.trash}</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {DAYS.map((d, i) => (
              <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 9, color: i === todayIdx ? "var(--ac2)" : "var(--t3)", fontWeight: i === todayIdx ? 700 : 400 }}>{d}</span>
                <button style={{
                  width: 25, height: 25, borderRadius: 7,
                  background: h.days?.[i] ? "var(--ok)" : "transparent",
                  border: `1.5px solid ${h.days?.[i] ? "var(--ok)" : i === todayIdx ? "var(--ac)" : "var(--b1)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", outline: i === todayIdx ? "2px solid rgba(124,92,252,.2)" : "none",
                  outlineOffset: 2, transition: "var(--transition)", color: "#fff",
                }} onClick={() => toggleDay(h.id, i)}>
                  {h.days?.[i] && I.chk}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── FOCUS MODE ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function FocusMode({ tasks, focusSess, setFocusSess }) {
  const MODES = [
    { label: "Focus", mins: 25, color: "var(--ac2)" },
    { label: "Short Break", mins: 5, color: "var(--ok)" },
    { label: "Long Break", mins: 15, color: "var(--info)" },
  ];
  const [modeIdx, setModeIdx] = useState(0);
  const [secs, setSecs] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [selTask, setSelTask] = useState("");
  const timerRef = useRef(null);

  const totalSecs = MODES[modeIdx].mins * 60;
  const pct = ((totalSecs - secs) / totalSecs) * 100;
  const R = 104; const C = 2 * Math.PI * R;

  useEffect(() => {
    const q1 = tasks.find(t => t?.quad === "Q1" && t?.status !== "done");
    const q2 = tasks.find(t => t?.quad === "Q2" && t?.status !== "done");
    const fb = tasks.find(t => t?.status !== "done");
    const best = q1 || q2 || fb;
    if (best) setSelTask(best.id);
  }, []); // eslint-disable-line

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setSecs(s => {
          if (s <= 1) {
            clearInterval(timerRef.current); setRunning(false);
            if (modeIdx === 0) {
              setSessions(c => c + 1);
              const task = tasks.find(t => t.id === selTask);
              setFocusSess(f => [...f, { id: uid(), date: today(), mins: MODES[0].mins, task: task?.title || "Focus Session" }]);
            }
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [running, modeIdx]); // eslint-disable-line

  const switchMode = i => { setModeIdx(i); setSecs(MODES[i].mins * 60); setRunning(false); clearInterval(timerRef.current); };
  const reset = () => { setSecs(MODES[modeIdx].mins * 60); setRunning(false); clearInterval(timerRef.current); };

  const todayMins = useMemo(() => focusSess.filter(s => s.date === today()).reduce((a, b) => a + (b?.mins || 0), 0), [focusSess]);
  const totalMins = useMemo(() => focusSess.reduce((a, b) => a + (b?.mins || 0), 0), [focusSess]);
  const selTaskObj = tasks.find(t => t.id === selTask);
  const selQ = selTaskObj?.quad ? QUADS[selTaskObj.quad] : null;

  return (
    <div className="anim" style={{ display: "flex", flexDirection: "column", gap: 22, alignItems: "center", maxWidth: 460, margin: "0 auto" }}>
      <div style={{ alignSelf: "flex-start", width: "100%" }}>
        <SectionHeader title="Focus Mode" subtitle="Pomodoro timer with Eisenhower task priority" />
      </div>

      <div style={{ display: "flex", gap: 7 }}>
        {MODES.map((m, i) => (
          <button key={m.label} className={`btn ${modeIdx === i ? "btn-p" : "btn-ghost"}`}
            style={{ padding: "7px 14px", fontSize: 12 }} onClick={() => switchMode(i)}>{m.label}</button>
        ))}
      </div>

      {/* Timer ring */}
      <div style={{ position: "relative", width: 240, height: 240, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="240" height="240" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
          <circle cx="120" cy="120" r={R} fill="none" stroke="var(--s4)" strokeWidth="9" />
          <circle cx="120" cy="120" r={R} fill="none" stroke={MODES[modeIdx].color} strokeWidth="9"
            strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear", filter: `drop-shadow(0 0 8px ${MODES[modeIdx].color})` }} />
        </svg>
        <div style={{ textAlign: "center", zIndex: 1 }}>
          <div className="f-mono f-display" style={{ fontSize: 42, fontWeight: 700, color: MODES[modeIdx].color, letterSpacing: -1 }}>{fmtTime(secs)}</div>
          <div style={{ fontSize: 12, color: "var(--t2)", marginTop: 4 }}>{MODES[modeIdx].label}</div>
          {sessions > 0 && <div style={{ fontSize: 11, color: "var(--warn)", marginTop: 4 }}>🍅 {sessions} session{sessions !== 1 ? "s" : ""}</div>}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-p" style={{ width: 105, justifyContent: "center", fontSize: 15 }} onClick={() => setRunning(r => !r)}>
          {running ? I.pause : I.play}
        </button>
        <button className="btn btn-s" style={{ padding: "10px 12px" }} onClick={reset}>{I.reset}</button>
      </div>

      <div style={{ width: "100%" }}>
        <label style={{ fontSize: 12, color: "var(--t2)", marginBottom: 7, display: "flex", alignItems: "center", gap: 7, fontWeight: 500 }}>
          Working on:
          {selQ && <QuadBadge quad={selTaskObj?.quad} />}
        </label>
        <select className="inp" value={selTask} onChange={e => setSelTask(e.target.value)}>
          <option value="">— Select task —</option>
          {["Q1", "Q2", "Q3", "Q4"].map(q => {
            const qt = tasks.filter(t => t.quad === q && t.status !== "done");
            if (!qt.length) return null;
            return <optgroup key={q} label={`${QUADS[q].icon} ${q} — ${QUADS[q].label}`}>{qt.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}</optgroup>;
          })}
          <optgroup label="Unclassified">{tasks.filter(t => !t.quad && t.status !== "done").map(t => <option key={t.id} value={t.id}>{t.title}</option>)}</optgroup>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, width: "100%" }}>
        {[
          { l: "Today", v: `${Math.floor(todayMins / 60)}h ${todayMins % 60}m`, c: "var(--ac2)" },
          { l: "Sessions", v: `${sessions}`, c: "var(--ok)" },
          { l: "Total", v: `${Math.floor(totalMins / 60)}h`, c: "var(--warn)" },
        ].map(s => (
          <div key={s.l} className="card-sm" style={{ padding: "13px 14px", textAlign: "center" }}>
            <div className="f-display" style={{ fontSize: 20, fontWeight: 700, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 10, color: "var(--t3)", marginTop: 3 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── ANALYTICS ──────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function Analytics({ tasks, habits, focusSess }) {
  const done = useMemo(() => tasks.filter(t => t?.status === "done").length, [tasks]);
  const totalFocusMins = useMemo(() => focusSess.reduce((a, b) => a + (b?.mins || 0), 0), [focusSess]);
  const topStreak = useMemo(() => Math.max(...habits.map(h => h?.streak || 0), 0), [habits]);

  const score = useMemo(() => {
    if (!tasks.length) return 0;
    return Math.round(
      (done / tasks.length) * 40 +
      Math.min(40, (totalFocusMins / 60) * 8) +
      Math.min(20, (habits.filter(h => h?.days?.[new Date().getDay()]).length / Math.max(habits.length, 1)) * 20)
    );
  }, [done, tasks.length, totalFocusMins, habits]);

  const quadData = useMemo(() => Object.entries(QUADS).map(([k, q]) => ({
    name: k, label: q.label, total: tasks.filter(t => t?.quad === k).length,
    done: tasks.filter(t => t?.quad === k && t?.status === "done").length, color: q.color,
  })), [tasks]);

  const focusData = useMemo(() => [...Array(7)].map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const ds = d.toISOString().split("T")[0];
    return { day: DAYS[d.getDay()], hrs: +(focusSess.filter(s => s.date === ds).reduce((a, b) => a + (b?.mins || 0), 0) / 60).toFixed(1) };
  }), [focusSess]);

  const radarData = useMemo(() => [
    { subject: "Q1 Clear", A: Math.max(0, 10 - tasks.filter(t => t?.quad === "Q1" && t?.status !== "done").length * 2) },
    { subject: "Q2 Focus", A: Math.min(10, tasks.filter(t => t?.quad === "Q2" && t?.status === "done").length * 2) },
    { subject: "Habits", A: Math.round((habits.filter(h => (h?.days || []).filter(Boolean).length >= 5).length / Math.max(habits.length, 1)) * 10) },
    { subject: "Focus Hrs", A: Math.min(10, totalFocusMins / 60) },
    { subject: "Tasks", A: Math.round((done / Math.max(tasks.length, 1)) * 10) },
    { subject: "Streak", A: Math.min(10, topStreak / 3) },
  ], [tasks, habits, totalFocusMins, done, topStreak]);

  return (
    <div className="anim" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <SectionHeader title="Analytics" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10 }}>
        <StatCard label="Score" value={score} suffix="/100" color={score > 70 ? "var(--ok)" : score > 40 ? "var(--warn)" : "var(--err)"} icon={I.chart} />
        <StatCard label="Done" value={`${done}`} suffix={`/${tasks.length}`} color="var(--ac2)" icon={I.task} />
        <StatCard label="Focus Hrs" value={(totalFocusMins / 60).toFixed(1)} suffix="h" color="var(--info)" icon={I.focus} />
        <StatCard label="Top Streak" value={topStreak} suffix="d" color="var(--warn)" icon={I.fire} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: "var(--t2)" }}>Quadrant Distribution</div>
          <ResponsiveContainer width="100%" height={148}>
            <BarChart data={quadData} barSize={18}>
              <XAxis dataKey="name" tick={{ fill: "var(--t3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={ChartTooltipStyle} cursor={{ fill: "rgba(124,92,252,.04)" }} />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                {quadData.map((e, i) => <Cell key={i} fill={e.color} opacity={.35} />)}
              </Bar>
              <Bar dataKey="done" radius={[4, 4, 0, 0]}>
                {quadData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: "var(--t2)" }}>Focus Hours (7 days)</div>
          <ResponsiveContainer width="100%" height={148}>
            <AreaChart data={focusData}>
              <defs><linearGradient id="fg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--ac)" stopOpacity={.28} /><stop offset="95%" stopColor="var(--ac)" stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="day" tick={{ fill: "var(--t3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--t3)", fontSize: 11 }} axisLine={false} tickLine={false} width={22} />
              <Tooltip contentStyle={ChartTooltipStyle} />
              <Area type="monotone" dataKey="hrs" stroke="var(--ac)" fill="url(#fg)" strokeWidth={2} dot={{ fill: "var(--ac)", r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: "var(--t2)" }}>Productivity Radar</div>
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={radarData} outerRadius={72}>
            <PolarGrid stroke="var(--b1)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--t2)", fontSize: 11 }} />
            <Radar name="You" dataKey="A" stroke="var(--ac)" fill="var(--ac)" fillOpacity={0.15} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── WEEKLY REVIEW ──────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function WeeklyReview({ tasks, habits, focusSess, reflections, setReflections }) {
  const [journal, setJournal] = useState(reflections?.journal || "");
  const [wins, setWins] = useState(reflections?.wins || "");
  const [improve, setImprove] = useState(reflections?.improve || "");
  const [aiReview, setAiReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const loadingRef = useRef(false);

  const save = useCallback(() => {
    setReflections({ journal, wins, improve, date: today() });
    setSaved(true); setTimeout(() => setSaved(false), 2200);
  }, [journal, wins, improve, setReflections]);

  const getAIReview = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true); setError("");
    const q1d = tasks.filter(t => t?.quad === "Q1" && t?.status === "done").length;
    const q2d = tasks.filter(t => t?.quad === "Q2" && t?.status === "done").length;
    const fh = (focusSess.reduce((a, b) => a + (b?.mins || 0), 0) / 60).toFixed(1);
    try {
      const txt = await callAI([{
        role: "user", content:
          `Weekly review as a productivity coach:\n- Q1 done: ${q1d}, Q2 done: ${q2d}\n- Total done: ${tasks.filter(t => t?.status === "done").length}/${tasks.length}\n- Focus hours: ${fh}h, Best streak: ${Math.max(...habits.map(h => h?.streak || 0), 0)} days\n- Wins: "${wins || "Not shared"}", Improvements: "${improve || "Not shared"}"\n\nWrite an insightful 3-paragraph coaching review:\n1) Eisenhower matrix quality\n2) Key wins & patterns\n3) Next week priorities & strategies\n\nBe encouraging and concrete.`
      }]);
      if (!txt) throw new Error("Empty response");
      setAiReview(txt);
    } catch {
      setError("Couldn't generate review. Please try again.");
    }
    setLoading(false);
    loadingRef.current = false;
  }, [tasks, habits, focusSess, wins, improve]);

  const doneT = tasks.filter(t => t?.status === "done").length;
  const focusH = (focusSess.reduce((a, b) => a + (b?.mins || 0), 0) / 60).toFixed(1);
  const topStreak = Math.max(...habits.map(h => h?.streak || 0), 0);
  const q2done = tasks.filter(t => t?.quad === "Q2" && t?.status === "done").length;

  return (
    <div className="anim" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <SectionHeader title="Weekly Review" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        <StatCard label="Tasks Done" value={`${doneT}/${tasks.length}`} color="var(--ok)" icon={I.task} />
        <StatCard label="Focus Time" value={`${focusH}`} suffix="h" color="var(--ac2)" icon={I.focus} />
        <StatCard label="Top Streak" value={topStreak} suffix="d" color="var(--warn)" icon={I.fire} />
        <StatCard label="Q2 Done" value={q2done} color="var(--q2-c)" icon={I.matrix} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          <div>
            <label style={{ fontSize: 12, color: "var(--t2)", marginBottom: 7, display: "block", fontWeight: 500 }}>🌟 Biggest Wins</label>
            <textarea className="inp" placeholder="What went really well this week?" value={wins} onChange={e => setWins(e.target.value)} style={{ height: 88 }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "var(--t2)", marginBottom: 7, display: "block", fontWeight: 500 }}>🔧 Areas to Improve</label>
            <textarea className="inp" placeholder="What could be better next week?" value={improve} onChange={e => setImprove(e.target.value)} style={{ height: 88 }} />
          </div>
        </div>
        <div>
          <label style={{ fontSize: 12, color: "var(--t2)", marginBottom: 7, display: "block", fontWeight: 500 }}>📓 Reflection Journal</label>
          <textarea className="inp" placeholder="How was your week? What did you learn? Goals for next week?" value={journal} onChange={e => setJournal(e.target.value)} style={{ height: 192 }} />
        </div>
      </div>

      {error && <ErrorBanner msg={error} onRetry={getAIReview} />}

      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn btn-p" onClick={save} style={{ fontSize: 12 }}>
          {saved ? "✓ Saved!" : "Save Reflection"}
        </button>
        <button className="btn btn-s" onClick={getAIReview} disabled={loading} style={{ fontSize: 12 }}>
          {loading ? <Spinner /> : I.ai} Echo Review
        </button>
      </div>

      {loading && (
        <div className="card" style={{ padding: 24 }}>
          {[...Array(3)].map((_, i) => <SkeletonBlock key={i} h={18} mb={10} />)}
        </div>
      )}

      {aiReview && !loading && (
        <div className="card" style={{ padding: 22, background: "var(--acg2)", borderColor: "rgba(124,92,252,.18)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,var(--ac),var(--ac2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>◈</div>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ac2)" }}>Echo Weekly Review</span>
          </div>
          <div style={{ fontSize: 13.5, color: "var(--t1)", lineHeight: 1.85, whiteSpace: "pre-wrap" }}>{aiReview}</div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── AI ASSISTANT (Echo) ────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function AIAssistant({ tasks, habits, focusSess, setView }) {
  const INIT_MSG = {
    role: "assistant",
    content: "Hey! I'm Echo, your AI productivity coach. ◈\n\nI have full context on your tasks and their Eisenhower quadrant scores. Ask me anything:\n\n• What should I work on next?\n• Analyze my task priorities\n• How do I escape Q1 firefighting?\n• Help me plan my day\n• Break down my hardest task",
  };
  const [msgs, setMsgs] = useState([INIT_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);
  const loadingRef = useRef(false);

  const SUGGESTIONS = ["What should I do next?", "Analyze my matrix", "Help plan my day", "How to reduce Q1 overload?", "Motivate me"];

  const ctx = useMemo(() => `You are Echo, an expert AI productivity coach. You know the Eisenhower Matrix, GTD, time-blocking, and deep work.

User's tasks:
${tasks.map(t => `- [${t.quad || "?"}] "${t.title}" | U:${t.urgency || "?"} I:${t.importance || "?"} | ${t.status} | ${t.cat} | due:${t.due}`).join("\n") || "No tasks yet."}

Habits: ${habits.map(h => `${h.emoji || ""}${h.name}(${h.streak}d)`).join(", ") || "None."}
Today's focus: ${focusSess.filter(s => s.date === today()).reduce((a, b) => a + (b?.mins || 0), 0)} minutes

Active Q1 tasks: ${tasks.filter(t => t.quad === "Q1" && t.status !== "done").length}
Active Q2 tasks: ${tasks.filter(t => t.quad === "Q2" && t.status !== "done").length}
Active Q3 tasks: ${tasks.filter(t => t.quad === "Q3" && t.status !== "done").length}
Active Q4 tasks: ${tasks.filter(t => t.quad === "Q4" && t.status !== "done").length}

Be concise, actionable, specific to their data. Max 180 words unless detailed analysis requested.`,
    [tasks, habits, focusSess]
  );

  const send = useCallback(async txt => {
    const msg = (txt || input).trim();
    if (!msg || loadingRef.current) return;
    loadingRef.current = true;
    const userMsg = { role: "user", content: msg };
    setMsgs(m => [...m, userMsg]); setInput(""); setLoading(true); setError("");
    try {
      const hist = [...msgs, userMsg].map(m => ({ role: m.role, content: m.content || "" }));
      const reply = await callAI(hist, ctx);
      if (!reply) throw new Error("Empty reply");
      setMsgs(m => [...m, { role: "assistant", content: reply }]);
    } catch {
      setError("Connection issue. Please try again.");
      setMsgs(m => m.slice(0, -1)); // remove optimistic user msg
    }
    setLoading(false);
    loadingRef.current = false;
  }, [input, msgs, ctx]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  return (
    <div className="anim" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)", minHeight: 500 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg,var(--ac),var(--ac2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, boxShadow: "0 4px 14px var(--acg)" }}>◈</div>
        <div>
          <h2 className="f-display" style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.2 }}>Echo AI</h2>
          <div style={{ fontSize: 11, color: "var(--ok)", display: "flex", alignItems: "center", gap: 5 }}>
            <span className="status-dot pulse" style={{ background: "var(--ok)" }} />
            Matrix-aware · Always on
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          {["Q1", "Q2"].map(q => {
            const n = tasks.filter(t => t?.quad === q && t?.status !== "done").length;
            if (!n) return null;
            return (
              <div key={q} style={{ background: QUADS[q].bg, border: `1px solid ${QUADS[q].bd}`, color: QUADS[q].color, borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>
                {QUADS[q].icon} {n} {q}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat window */}
      <div className="card" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div className="scroll-thin" style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {msgs.map((m, i) => (
            <div key={i} className={m.role === "user" ? "bubble-u" : "bubble-a"} style={{ animation: "fadeUp .25s ease" }}>{m.content}</div>
          ))}
          {loading && (
            <div className="bubble-a" style={{ display: "flex", gap: 5, alignItems: "center", padding: "13px 16px" }}>
              {[0, 1, 2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--ac2)", display: "inline-block", animation: `pulse 1.1s ${i * .18}s infinite` }} />)}
            </div>
          )}
          {error && <ErrorBanner msg={error} onRetry={() => setError("")} />}
          <div ref={endRef} />
        </div>

        <div style={{ padding: "11px 15px", borderTop: "1px solid var(--b1)" }}>
          <div style={{ display: "flex", gap: 5, marginBottom: 9, flexWrap: "wrap" }}>
            {SUGGESTIONS.map(s => (
              <button key={s} className="btn btn-ghost btn-sm"
                style={{ fontSize: 11, color: "var(--t2)" }} onClick={() => !loading && send(s)}>{s}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input className="inp" placeholder="Ask Echo anything…" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              disabled={loading} />
            <button className="btn btn-p" style={{ padding: "9px 14px", flexShrink: 0 }}
              onClick={() => send()} disabled={loading || !input.trim()}>{I.send}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── ROOT APP ───────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [view, setView] = useState("matrix");
  const [sidebar, setSidebar] = useState(false);

  // ── State with localStorage persistence ──
  const [tasks, setTasksRaw] = useState(() => LS.get("echo_tasks", INIT_TASKS));
  const [habits, setHabitsRaw] = useState(() => LS.get("echo_habits", INIT_HABITS));
  const [focusSess, setFocusRaw] = useState(() => LS.get("echo_focus", []));
  const [plan, setPlanRaw] = useState(() => LS.get("echo_plan", []));
  const [reflections, setReflRaw] = useState(() => LS.get("echo_refl", {}));

  // ── Wrapped setters that also persist ──
  const setTasks = useCallback(v => {
    setTasksRaw(prev => {
      const next = typeof v === "function" ? v(prev) : v;
      LS.set("echo_tasks", next); return next;
    });
  }, []);
  const setHabits = useCallback(v => {
    setHabitsRaw(prev => {
      const next = typeof v === "function" ? v(prev) : v;
      LS.set("echo_habits", next); return next;
    });
  }, []);
  const setFocusSess = useCallback(v => {
    setFocusRaw(prev => {
      const next = typeof v === "function" ? v(prev) : v;
      LS.set("echo_focus", next); return next;
    });
  }, []);
  const setPlan = useCallback(v => { setPlanRaw(v); LS.set("echo_plan", v); }, []);
  const setReflections = useCallback(v => { setReflRaw(v); LS.set("echo_refl", v); }, []);

  // ── Responsive sidebar: open on desktop, hidden on mobile ──
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  useEffect(() => {
    if (isDesktop) setSidebar(false);
  }, [isDesktop]);
  const pages = useMemo(() => ({
    dash: <Dashboard tasks={tasks} habits={habits} focusSess={focusSess} setView={setView} />,
    matrix: <EisenhowerEngine tasks={tasks} setTasks={setTasks} setView={setView} />,
    tasks: <TaskManager tasks={tasks} setTasks={setTasks} />,
    planner: <Planner tasks={tasks} plan={plan} setPlan={setPlan} />,
    habits: <HabitTracker habits={habits} setHabits={setHabits} />,
    focus: <FocusMode tasks={tasks} focusSess={focusSess} setFocusSess={setFocusSess} />,
    analytics: <Analytics tasks={tasks} habits={habits} focusSess={focusSess} />,
    review: <WeeklyReview tasks={tasks} habits={habits} focusSess={focusSess} reflections={reflections} setReflections={setReflections} />,
    ai: <AIAssistant tasks={tasks} habits={habits} focusSess={focusSess} setView={setView} />,
  }), [tasks, habits, focusSess, plan, reflections, setTasks, setHabits, setFocusSess, setPlan, setReflections, setView]);

  return (
    <>
      <style>{STYLES}</style>
      <style>{`
        @media(min-width:768px){ .echo-sidebar{ transform:translateX(0) !important; } }
        @keyframes slideIn { from{ transform:translateX(-6px); opacity:0; } to{ transform:translateX(0); opacity:1; } }
        input[type=range]::-webkit-slider-thumb { width:14px; height:14px; }
      `}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
        <Sidebar view={view} setView={setView} open={sidebar} setOpen={setSidebar} tasks={tasks} />

        <main style={{
          flex: 1, marginLeft: isDesktop ? "220px" : "0",
          padding: isDesktop ? "24px 32px" : "18px 16px",
          minHeight: "100vh", transition: "margin-left .22s",
        }}>
          <div style={{ maxWidth: 920, margin: "0 auto" }}>
            {/* Topbar */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: 22 }}>
              {!isDesktop && (
                <button className="btn btn-ghost" style={{ padding: "7px", marginRight: 10 }}
                  onClick={() => setSidebar(true)}>{I.menu}</button>
              )}
              <div style={{ flex: 1 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 7, background: "var(--s1)", border: "1px solid var(--b1)", borderRadius: 20, padding: "5px 13px" }}>
                <span className="status-dot pulse" style={{ background: "var(--ok)" }} />
                <span style={{ fontSize: 11, color: "var(--t2)", fontFamily: "'Figtree'" }}>Echo AI · Active</span>
              </div>
            </div>
            {pages[view] || pages.dash}
          </div>
        </main>
      </div>
    </>
  );
}