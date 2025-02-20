import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';

export const routes: Routes = [
  { path: 'tasks', component: TaskListComponent },
  { path: 'create-task', component: TaskFormComponent },
  { path: '', redirectTo: '/tasks', pathMatch: 'full' } 
];
