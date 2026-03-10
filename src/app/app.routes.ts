import { Routes } from '@angular/router';
import {Login} from './components/login/login';
import {Register} from './components/register/register';
import {ProjectDetail} from './components/projects/project-detail/project-detail';

export const routes: Routes = [
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  {path: 'projects/:id', component: ProjectDetail},
  { path: '', redirectTo: 'login', pathMatch: 'full' } //
];
