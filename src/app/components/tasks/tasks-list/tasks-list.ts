import {Component, inject, input, OnInit, output, signal, TemplateRef} from '@angular/core';
import {TaskForm} from '../task-form/task-form';
import {TaskItem} from '../task-item/task-item';
import {TuiTableDirective, TuiTableTbody, TuiTableTh, TuiTableThGroup} from '@taiga-ui/addon-table';
import {TuiButton, TuiDialogService} from '@taiga-ui/core';
import {Task} from '../../../models/task.model';
import {ProjectStateService} from '../../../services/project/project-state-service';

@Component({
  selector: 'app-tasks-list',
  imports: [
    TaskForm,
    TaskItem,
    TuiTableDirective,
    TuiTableTbody,
    TuiTableTh,
    TuiTableThGroup,
    TuiButton
  ],
  templateUrl: './tasks-list.html',
  styleUrl: './tasks-list.css',
})
export class TasksList implements OnInit {

  private readonly dialogs = inject(TuiDialogService);
  private readonly projectStateService: ProjectStateService = inject(ProjectStateService);


  readonly projectId = input.required<number>();
  readonly tasks = input.required<Task[]>();

  readonly taskCreated = output<Task>();
  readonly taskDeleted = output<number>();
  readonly taskUpdated = output<void>();

  public readonly role = signal<any>(null);
  ngOnInit(): void {

    this.role.set(this.projectStateService.role)

  }


  openCreateTaskDialog(content: TemplateRef<unknown>): void {
    this.dialogs.open(content, {
      label: 'Nouvelle tâche',
      size: 'm',
    }).subscribe({

    });
  }
  onTaskCreated(newTask: Task): void {
    this.taskCreated.emit(newTask);
  }

  onTaskUpdated(){
    this.taskUpdated.emit();
  }

  onTaskDeleted(taskId: number): void {
    this.taskDeleted.emit(taskId);
  }


}
