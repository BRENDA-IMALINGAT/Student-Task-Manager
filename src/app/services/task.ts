import { Injectable } from '@angular/core';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  completed: boolean;
}

const SAMPLE_TASKS: Task[] = [
  { id: 'sample-1', title: 'Review AWS cloud fundamentals', description: 'Go over the shared responsibility model and core services before the study group.', priority: 'High', dueDate: '2026-11-18', completed: false },
  { id: 'sample-2', title: 'Finish algorithms problem set', description: 'Complete the graph traversal exercises and add notes to the solution.', priority: 'Medium', dueDate: '2026-11-20', completed: false },
  { id: 'sample-3', title: 'Read chapter 4: networking', description: 'Review subnetting, routing, and DNS concepts.', priority: 'Low', dueDate: '2026-11-16', completed: true },
];

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly taskKey = 'devtasks-items';

  getTasks(): Task[] {
    if (typeof localStorage === 'undefined') return SAMPLE_TASKS;
    try {
      const stored = localStorage.getItem(this.taskKey);
      if (stored === null) {
        this.saveTasks(SAMPLE_TASKS);
        return [...SAMPLE_TASKS];
      }
      const parsed: unknown = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed as Task[] : [];
    } catch {
      return [];
    }
  }

  saveTasks(tasks: Task[]): void {
    if (typeof localStorage !== 'undefined') localStorage.setItem(this.taskKey, JSON.stringify(tasks));
  }

  addTask(task: Omit<Task, 'id' | 'completed'>): Task {
    const created: Task = { ...task, id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`, completed: false };
    this.saveTasks([...this.getTasks(), created]);
    return created;
  }

  updateTask(updated: Task): void {
    this.saveTasks(this.getTasks().map(task => task.id === updated.id ? updated : task));
  }

  deleteTask(id: string): void {
    this.saveTasks(this.getTasks().filter(task => task.id !== id));
  }
}
