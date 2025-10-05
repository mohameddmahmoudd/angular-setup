import { Component, signal } from '@angular/core';
import { HeaderComponent } from './header/header';
import { Lists } from './lists/lists';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent,Lists],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('TodoListAng');
}
