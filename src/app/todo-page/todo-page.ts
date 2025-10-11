import { Component } from '@angular/core';
import { TodoService } from '../todo.service';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TodoItem } from '../todo-item/todo-item';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { Todo } from '../types';
import { HeaderComponent } from "../header/header"; 

@Component({
  selector: 'app-todo-page',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    DragDropModule,
    TodoItem, HeaderComponent],
  templateUrl: './todo-page.html',
  styleUrl: './todo-page.css'
})
export class TodoPage {

  private todoService: TodoService;
  pendingSearch = new FormControl('', { nonNullable: true });
  completedSearch = new FormControl('', { nonNullable: true });
  title = new FormControl('', { nonNullable: true });
  loading = false;

  readonly pending$: Observable<Todo[]>;
  readonly completed$: Observable<Todo[]>;
  //readonly all$: Observable<Todo[]>;
 
  constructor(todoService: TodoService) {
    this.todoService = todoService;
    this.pending$ = combineLatest([
      this.todoService.pending$(),
      this.pendingSearch.valueChanges.pipe(startWith(''))
    ]).pipe(map(([items, q]) => this.filter(items, q)));
 
    this.completed$ = combineLatest([this.todoService.completed$(),
    this.completedSearch.valueChanges.pipe(startWith(''))
    ]).pipe(map(([items, q]) => this.filter(items, q)));
  }
 
  private filter(items: Todo[], q: string): Todo[]
  {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(t => t.title.toLowerCase().includes(s));
  }

  dropPending(ev: CdkDragDrop<Todo[]>) 
  {
    // Reorder in-pending list (client-side only)
    const from = ev.previousContainer.data ?? [];
    const to = ev.container.data ?? [];

    if (ev.previousContainer === ev.container) {
      moveItemInArray(to, ev.previousIndex, ev.currentIndex);
    } else {
      const todo = from[ev.previousIndex];
      if (todo.completed) {
        this.todoService.update(todo.id, { completed: false }).subscribe();
      }
    }
  }

  dropCompleted(ev: CdkDragDrop<Todo[]>)
  {
    const from = ev.previousContainer.data ?? [];
    const to = ev.container.data ?? [];
    
    if( ev.previousContainer === ev.container) {
      moveItemInArray(to, ev.previousIndex, ev.currentIndex);
    } else {
      const todo = ev.previousContainer.data[ev.previousIndex];
      if (!todo.completed) {
        this.todoService.update(todo.id, { completed: true }).subscribe();
      }
    }

  }

  add() {
    const value = this.title.value?.trim();
    if (!value) return;
    this.loading = true;
    this.todoService.add(value).subscribe({
      next: () => {
        this.title.setValue('');
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  trackById(_index: number, t: Todo) {
  return t.id;
}


}
