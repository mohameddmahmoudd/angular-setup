import { Component, signal } from '@angular/core';
import { HeaderComponent } from './header/header';
import {TodoPage} from './todo-page/todo-page';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('TodoListAng');
}
