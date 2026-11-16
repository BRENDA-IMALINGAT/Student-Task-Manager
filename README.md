# DevTasks

DevTasks is a lightweight student task manager built with Angular, TypeScript, Bootstrap 5, and Bootstrap Icons. Tasks are stored in the browser with LocalStorage; no backend or account is required.

## Run locally

Install dependencies with `npm install`, then start the Angular development server:

```bash
npm start
```

Open [http://localhost:4200](http://localhost:4200). The first visit seeds three example tasks. Add, search, filter, complete, and delete tasks from the dashboard. Data stays in the current browser profile.

## Production build

```bash
npm run build
```

The optimized static site is written to `dist/student-task-manager/browser/` for static hosting. No deployment URL is configured in the app.
