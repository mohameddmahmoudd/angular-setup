import { Component, Input } from '@angular/core';
import { Todo } from '../types';
import { TodoService } from '../todo.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-todo-item',
  imports: [],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.css'
})
export class TodoItem 
{
  @Input({required: true}) todo!: Todo;
  busy = false;
  private todoService: TodoService;

  constructor(todoService: TodoService) {
    this.todoService = todoService;
  }

  toggle() {
  this.busy = true;
  this.todoService.toggle(this.todo.id)
    .pipe(finalize(() => this.busy = false))
    .subscribe();
}

remove() {
  this.busy = true;
  this.todoService.remove(this.todo.id)
    .pipe(finalize(() => this.busy = false))
    .subscribe();
}

}
