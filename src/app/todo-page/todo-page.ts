import { Component } from '@angular/core';
import { TodoService } from '../todo.service';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { addExportToModule } from '@angular/cdk/schematics';
import { TodoItem } from '../todo-item/todo-item';
import { TodoList } from '../todo-list/todo-list';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { Todo } from '../types'; 

@Component({
  selector: 'app-todo-page',
  imports: [CommonModule,
    ReactiveFormsModule,
    DragDropModule,
    TodoItem,
    TodoList
  ],
  templateUrl: './todo-page.html',
  styleUrl: './todo-page.css'
})
export class TodoPage {

  private todoService: TodoService;
  pendingSearch = new FormControl('', { nonNullable: true });
  completedSearch = new FormControl('', { nonNullable: true });

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
    if (ev.previousContainer === ev.container) {
      moveItemInArray(ev.container.data, ev.previousIndex, ev.currentIndex);
    } else {
      const todo = ev.previousContainer.data[ev.previousIndex];
      if (todo.completed) {
        this.todoService.update(todo.id, { completed: false }).subscribe();
      }
    }
  }

  dropCompleted(ev: CdkDragDrop<Todo[]>)
  {
    if( ev.previousContainer === ev.container) {
      moveItemInArray(ev.container.data, ev.previousIndex, ev.currentIndex);
    } else {
      const todo = ev.previousContainer.data[ev.previousIndex];
      if (!todo.completed) {
        this.todoService.update(todo.id, { completed: true }).subscribe();
      }
    }

  }

 


}
