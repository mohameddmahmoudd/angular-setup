import { Component } from '@angular/core';

@Component({
  selector: 'app-lists',
  imports: [],
  templateUrl: './lists.html',
  styleUrl: './lists.css'
})
export class Lists {

  onAddTask(task: string) {
    // Logic to add a new task
  }

  onCompleteTask(task: string) {
    // Logic to mark a task as completed
  }

  onReloadTasks() {
    // Logic to add tasks when the page is reloaded
  }

  searchTasks(query: string) {
    // Logic to search tasks
  }

  

}
