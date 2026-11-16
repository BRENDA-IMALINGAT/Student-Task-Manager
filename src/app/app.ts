import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskService } from './services/task';

type TaskFilter = 'all' | 'pending' | 'completed';

@Component({
  selector: 'app-root',
  imports: [FormsModule, DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly taskService = inject(TaskService);
  readonly tasks = signal<Task[]>(this.taskService.getTasks());
  readonly filter = signal<TaskFilter>('all');
  readonly query = signal('');
  readonly notice = signal('');
  readonly showForm = signal(false);
  readonly title = signal('');
  readonly description = signal('');
  readonly priority = signal<Task['priority']>('Medium');
  readonly dueDate = signal('');
  readonly today = new Date();

  readonly completedCount = computed(() => this.tasks().filter(task => task.completed).length);
  readonly pendingCount = computed(() => this.tasks().length - this.completedCount());
  readonly completion = computed(() => this.tasks().length ? Math.round(this.completedCount() / this.tasks().length * 100) : 0);
  readonly visibleTasks = computed(() => {
    const query = this.query().trim().toLowerCase();
    return this.tasks().filter(task => {
      const matchesFilter = this.filter() === 'all' || (this.filter() === 'completed' ? task.completed : !task.completed);
      return matchesFilter && (!query || task.title.toLowerCase().includes(query));
    });
  });

  setFilter(filter: TaskFilter): void { this.filter.set(filter); }

  addTask(): void {
    const title = this.title().trim();
    if (!title) { this.notice.set('Add a task title to continue.'); return; }
    this.taskService.addTask({ title, description: this.description().trim(), priority: this.priority(), dueDate: this.dueDate() || undefined });
    this.tasks.set(this.taskService.getTasks());
    this.title.set(''); this.description.set(''); this.priority.set('Medium'); this.dueDate.set('');
    this.showForm.set(false); this.notice.set('Task added successfully.');
    window.setTimeout(() => this.notice.set(''), 3000);
  }

  toggleTask(task: Task): void {
    this.taskService.updateTask({ ...task, completed: !task.completed });
    this.tasks.set(this.taskService.getTasks());
    this.notice.set(task.completed ? 'Task moved to pending.' : 'Task completed. Nice work!');
    window.setTimeout(() => this.notice.set(''), 3000);
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task.id);
    this.tasks.set(this.taskService.getTasks());
    this.notice.set('Task deleted.');
    window.setTimeout(() => this.notice.set(''), 3000);
  }

  dueLabel(date?: string): string {
    if (!date) return 'No due date';
    return new Date(`${date}T00:00:00`).toLocaleDateString('en', { month: 'short', day: 'numeric' });
  }
}
