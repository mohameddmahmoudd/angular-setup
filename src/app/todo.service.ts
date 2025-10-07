import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Todo } from './types';


@Injectable({ providedIn: 'root' })
export class TodoService {

private readonly base = '/api/todos';
private readonly _todos = new BehaviorSubject<Todo[]>([]);
readonly todos$ = this._todos.asObservable();


constructor(private http: HttpClient) {
this.load();
}

load(): void {
this.http.get<Todo[]>(this.base)
.subscribe({ next: (todos) => this._todos.next(todos) });
}


add(title: string): Observable<Todo> {
return this.http.post<Todo>(this.base, { title }).pipe(
tap(todo => this._todos.next([todo, ...this._todos.value]))
);
}


update(id: Todo['id'], patch: Partial<Todo>): Observable<Todo> {
return this.http.put<Todo>(`${this.base}/${id}`, patch).pipe(
tap(updated => {
const next = this._todos.value.map(t => t.id === id ? { ...t, ...updated } : t);
this._todos.next(next);
})
);
}


toggle(id: Todo['id']): Observable<Todo> {
const current = this._todos.value.find(t => t.id === id);
if (!current) { throw new Error('Todo not found'); }
return this.update(id, { completed: !current.completed });
}


remove(id: Todo['id']): Observable<void> {
return this.http.delete<void>(`${this.base}/${id}`).pipe(
tap(() => this._todos.next(this._todos.value.filter(t => t.id !== id)))
);
}


// Helpers
pending$(): Observable<Todo[]> { return this.todos$.pipe(map(ts => ts.filter(t => !t.completed))); }
completed$(): Observable<Todo[]> { return this.todos$.pipe(map(ts => ts.filter(t => t.completed))); }
}