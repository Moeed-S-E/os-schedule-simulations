<div align="center">

# ⚙️ Process Scheduling Simulator

### See exactly how the CPU decides who runs next.

Build a process set, pick a non-preemptive algorithm, and watch the Gantt chart and metrics update instantly.

![React](https://img.shields.io/badge/React-UI-5f8a62?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build-c4694f?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-Styles-d19a3c?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-Runtime-8a6a4f?style=for-the-badge&logo=bun&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-Tested-7a9a5a?style=for-the-badge&logo=vitest&logoColor=white)

**FCFS** · **SJF** · **Priority**

</div>

---

<!-- Add a screenshot or GIF here:
<p align="center"><img src="docs/demo.gif" alt="Simulator demo" width="820"></p>
-->

## ✨ Why this exists

Scheduling algorithms look simple on paper, but small changes in arrival time or burst length can shuffle the whole timeline. This simulator makes those effects visible. Edit a number, and the schedule, the Gantt chart, and every metric recalculate.

## 🚀 Features

| | |
|---|---|
| 🧮 **Three algorithms** | FCFS, SJF, and Priority scheduling, all non-preemptive |
| ✏️ **Live editing** | Change arrival, burst, and priority, then add, remove, reset, or randomize up to 12 processes |
| 📊 **Full metrics** | Completion, turnaround, and waiting time per process, plus averages |
| ⚖️ **Side-by-side comparison** | See average waiting and turnaround time for all three algorithms at once |
| 🎞️ **Replayable Gantt chart** | Scrub the timeline with the slider or step through it with the arrow buttons |
| 🌗 **Light and dark themes** | Responsive layout that works on desktop and mobile |

## 🧠 How it works

All three algorithms are **non-preemptive**: once a process gets the CPU, it runs to completion. Whenever the CPU frees up, the scheduler looks at the processes that have already arrived and picks one:

| Algorithm | Picks the ready process with… | Best known for |
|---|---|---|
| **FCFS** | the earliest arrival | Simplicity and fairness in arrival order |
| **SJF** | the shortest burst time | Low average waiting time |
| **Priority** | the smallest priority number (highest priority) | Favoring important work |

**Tie-breaking:** equal candidates are resolved by arrival time, then by process order.
**Idle time:** if no process has arrived yet, the CPU idles until the next arrival, and the Gantt chart shows the gap.

### The formulas

```text
Turnaround Time = Completion Time − Arrival Time
Waiting Time    = Turnaround Time − Burst Time
```

## 📈 Example run

Built-in sample set:

| Process | Arrival | Burst | Priority |
|:-:|:-:|:-:|:-:|
| P1 | 0 | 7 | 3 |
| P2 | 2 | 4 | 1 |
| P3 | 4 | 1 | 4 |
| P4 | 5 | 4 | 2 |
| P5 | 20 | 3 | 1 |

FCFS Gantt chart (note the idle gap before P5 arrives):

```text
| P1      | P2    | P3 | P4    | idle  | P5  |
0         7       11   12      16      20    23
```

Averages across the algorithms:

| Algorithm | Avg waiting | Avg turnaround |
|:-:|:-:|:-:|
| FCFS | 3.80 | 7.60 |
| **SJF** | **3.20** | **7.00** |
| Priority | 4.40 | 8.20 |

SJF gives the lowest averages here. The best algorithm depends on the process set, so try your own.

## 🏁 Getting started

**Requirements:** [Bun](https://bun.sh/) (recommended, and used for the lockfile) and a current web browser.

```sh
bun install --frozen-lockfile
bun run dev
```

Then open the local URL printed by Vite.

## 🛠️ Scripts

| Command | What it does |
|---|---|
| `bun run dev` | Start the Vite development server |
| `bun run test` | Run the unit and UI interaction tests once |
| `bun run test:watch` | Run tests in watch mode |
| `bun run lint` | Check the code with Oxlint |
| `bun run build` | Create the production build in `dist/` |
| `bun run preview` | Preview the production build locally |

Before pushing, run the full check:

```sh
bun run test && bun run lint && bun run build
```

## ✅ Testing

The suite covers the logic and the interface.

- **Scheduling logic:** order and tie-breaking for each algorithm, idle periods, timing metrics, empty input, and input immutability.
- **UI behavior:** algorithm selection, process editing and validation, randomize and reset, the empty state, results, Gantt replay, and timeline navigation.

Built with Vitest, React Testing Library, `user-event`, and jsdom.

## 🗂️ Project structure

```text
src/
├── components/          Simulator UI components
├── lib/
│   ├── scheduling.js    Scheduling algorithms and metrics
│   └── scheduling.test.js
├── test/                Shared test setup
├── App.jsx              App state and component composition
├── App.test.jsx         End-to-end UI interaction tests
└── index.css            Tailwind import and theme tokens
```

## 🌱 Publishing to GitHub

The repository includes a `.gitignore` for dependencies, build output, logs, local files, and common editor files.

```sh
git add .
git commit -m "Add process scheduling simulator"
git push -u origin main
```

Use your repository's branch name if it isn't `main`.

---

<div align="center">

**Built by [Your Team Name]** · Add names, course, and semester here

</div>