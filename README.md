<div align="center">

# ⚙️ FCFS Process Scheduling Simulator

### See how First Come First Served scheduling works.

Build a process set and watch the FCFS Gantt chart and timing metrics update instantly.

![React](https://img.shields.io/badge/React-UI-0b4f6c?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build-01baef?style=for-the-badge&logo=vite&logoColor=040f16)
![Tailwind](https://img.shields.io/badge/Tailwind-Styles-b80c09?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-Runtime-0b4f6c?style=for-the-badge&logo=bun&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-Tested-01baef?style=for-the-badge&logo=vitest&logoColor=040f16)

**FCFS only**

</div>

---

## Features

- FCFS scheduling: earliest-arrived processes run first; arrival ties follow process-list order.
- Edit arrival and burst times, and add, remove, reset, or randomize up to 12 processes.
- View completion, turnaround, and waiting times per process and as averages.
- Responsive, light-only theme using `#b80c09`, `#0b4f6c`, `#01baef`, `#fbfbff`, and `#040f16`.

## How it works

FCFS is non-preemptive: once a process starts, it runs to completion. When the CPU is free, the earliest-arrived waiting process runs next. If no process has arrived, the CPU idles until the next arrival.

```text
Turnaround Time = Completion Time − Arrival Time
Waiting Time    = Turnaround Time − Burst Time
```

The built-in sample produces an average waiting time of **3.80** and average turnaround time of **7.60**.

## Getting started

**Requirements:** [Bun](https://bun.sh/) and a current web browser.

```sh
bun install --frozen-lockfile
bun run dev
```

## Scripts

| Command | What it does |
|---|---|
| `bun run dev` | Start the Vite development server |
| `bun run test` | Run unit and UI tests once |
| `bun run test:watch` | Run tests in watch mode |
| `bun run lint` | Check the code with Oxlint |
| `bun run build` | Create the production build in `dist/` |
| `bun run preview` | Preview the production build locally |

Run all checks with:

```sh
bun run test && bun run lint && bun run build
```

## Project structure

```text
src/
├── components/          Simulator UI components
├── lib/
│   ├── scheduling.js    FCFS scheduling and metrics
│   └── scheduling.test.js
├── test/                Shared test setup
├── App.jsx              App state and component composition
├── App.test.jsx         UI interaction tests
└── index.css            Tailwind import and theme tokens
```
---

<div align="center">

**Built by Moeed and Huzaifa** · OS Lab OEL, and semester 5th

</div>
