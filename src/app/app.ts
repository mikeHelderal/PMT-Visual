import { TuiRoot } from "@taiga-ui/core";
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ToastContainer} from './components/toast-container/toast-container/toast-container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, ToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('pmt-frontend');
}
