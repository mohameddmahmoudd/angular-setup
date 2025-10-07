import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { TodoPage } from './todo-page/todo-page';

export const routes: Routes = [
    {path:'', component: TodoPage},
    {path:'**', redirectTo:''}
];
