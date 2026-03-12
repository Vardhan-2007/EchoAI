# Echo AI 🚀
### AI-Powered Productivity & Task Management System

![React](https://img.shields.io/badge/Frontend-React-blue)
![AI](https://img.shields.io/badge/AI-Llama--3--8B-green)
![API](https://img.shields.io/badge/API-OpenRouter-purple)
![Build](https://img.shields.io/badge/Built%20With-Vite-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

Echo is an **AI-assisted productivity web application** designed to help users organize tasks, prioritize work, and maintain focus throughout the day.

The system combines the **Eisenhower Matrix productivity framework** with **AI assistance** to analyze tasks, recommend priorities, and guide users toward better productivity habits.

Along with task management, Echo also provides tools for **habit tracking, focus sessions, daily planning, and productivity analytics**, making it a complete personal productivity dashboard.

---

# Project Overview

One of the biggest productivity problems people face is deciding **what they should work on next**.

Echo helps solve this by analyzing tasks based on **urgency and importance** and placing them into the **Eisenhower Matrix**.

Using this analysis, the system can recommend the **next best task** to focus on, helping users spend more time on high-impact work instead of reactive tasks.

This project demonstrates how **AI can be integrated into productivity tools to assist human decision-making**.

---

# Key Features

## Task Management

Users can:

- Create tasks
- Edit tasks
- Delete tasks
- Assign urgency and importance
- View tasks in a structured dashboard

Tasks are stored locally in the browser so that data persists between sessions.

---

## Eisenhower Matrix Visualization

Tasks are automatically categorized into four quadrants.

| Quadrant | Description |
|--------|--------|
| Q1 | Urgent & Important (Do First) |
| Q2 | Important & Not Urgent (Schedule) |
| Q3 | Urgent & Not Important (Delegate) |
| Q4 | Not Urgent & Not Important (Eliminate) |

This helps users clearly understand **which tasks require immediate attention and which should be scheduled or removed**.

---

## AI Task Analysis

Echo integrates AI to analyze tasks and improve prioritization.

The AI can:

- classify tasks into Eisenhower quadrants
- assign urgency and importance scores
- suggest the next task to focus on
- assist users through a chat interface

The project uses the **Llama-3-8B-Instruct model** via the **OpenRouter API**.

---

## Natural Language Task Input

Users can create tasks using simple natural language.

Example:

Finish project report by Friday high priority


The system converts this into structured task data automatically.

---

## Daily Planner

Echo helps users structure their day using simple time blocks.

Example schedule:

07:00 – Exercise
09:00 – Deep Work
12:30 – Lunch
15:00 – Project Work


This makes it easier to plan and manage daily work.

---

## Habit Tracker

Users can track habits and maintain streaks such as:

- Exercise
- Reading
- Coding
- Meditation

Progress is visualized through charts to help maintain consistency.

---

## Focus Mode (Pomodoro Timer)

Echo includes a focus timer based on the **Pomodoro technique**.

Typical cycle:

- 25 minutes focus
- 5 minutes break
- longer break after multiple sessions

Focus sessions are tracked to measure productivity.

---

## Productivity Analytics

The application provides analytics that help users understand their productivity patterns.

Examples include:

- task distribution across quadrants
- focus hours over time
- productivity trends

Charts are built using **Recharts**.

---

# Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### AI Integration
- OpenRouter API
- Llama-3-8B-Instruct

### Data Visualization
- Recharts

### Storage
- Browser LocalStorage

---

# Architecture

User
↓
React Frontend
↓
AI Request (OpenRouter API)
↓
Llama-3-8B Model
↓
Task Analysis & Recommendation
↓
Dashboard Visualization

---

# Project Structure

echo-ai/
│
├── src/
│ ├── components/
│ │ ├── Sidebar
│ │ ├── TaskManager
│ │ ├── EisenhowerEngine
│ │ ├── Planner
│ │ ├── HabitTracker
│ │ ├── FocusMode
│ │ ├── Analytics
│ │ └── WeeklyReview
│ │
│ ├── App.jsx
│ └── main.jsx
│
├── public/
├── package.json
└── vite.config.js

---

# Installation

Clone the repository

git clone https://github.com/yourusername/echo-ai.git

Navigate to the project folder

Navigate to the project folder


cd echo-ai


Install dependencies


npm install


Run the development server


npm run dev


Build the project


npm run build


Preview the production build


npm run preview


---

# Data Storage

Echo stores user data locally using the browser **LocalStorage API**.

Stored keys include:


echo_tasks
echo_habits
echo_focus
echo_plan
echo_refl


This allows persistent storage without requiring a backend database.

---

# Security Note

The OpenRouter API key should **not be exposed in frontend code in production**.

For production deployment, the API key should be stored in:


.env file
backend proxy server


---

# Learning Outcomes

This project demonstrates practical experience with:

- AI API integration
- prompt engineering
- React component architecture
- productivity system design
- data visualization
- client-side data persistence

---

# Future Improvements

Possible improvements include:

- backend database integration
- user authentication
- cloud synchronization
- collaborative task management
- advanced AI productivity insights

---

## Note

This project was developed as a personal learning project and is shared for educational purposes.
