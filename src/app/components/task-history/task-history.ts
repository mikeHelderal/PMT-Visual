import {Component, effect, inject, input, signal} from '@angular/core';
import {TaskService} from '../../services/task/task-service';
import { TaskHistoryModel } from '../../models/taskHistory.model';
import {DatePipe} from '@angular/common';
import {TuiAvatar, TuiBadge} from '@taiga-ui/kit';
import {TuiCardLarge} from '@taiga-ui/layout';
import {TuiAppearance, TuiTitle} from '@taiga-ui/core';
@Component({
  selector: 'app-task-history',
  imports: [
    DatePipe,
    TuiAvatar,
    TuiBadge,
    TuiCardLarge,
    TuiTitle,
    TuiAppearance
  ],
  templateUrl: './task-history.html',
  styleUrl: './task-history.css',
})
export class TaskHistory {

  public taskId = input.required<number>();

 public  historyItems = signal<TaskHistoryModel[]>([])

  private readonly taskService: TaskService = inject(TaskService);

  constructor() {
    effect(() => {
      const id = this.taskId();
      if(id){
        this.loadHistory(id);
      }
    });
  }
  private loadHistory(id: number): void {
    this.taskService.getTaskHistory(id).subscribe({
      next: (data: TaskHistoryModel[]) => this.historyItems.set(data),
      error: (err) => {
        console.error("Erreur lors du chargement de l'historique", err);
      }
    });
  }



}
