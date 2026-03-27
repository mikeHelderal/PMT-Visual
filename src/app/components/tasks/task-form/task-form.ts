import {Component, inject, input, OnInit, output, signal} from '@angular/core';
import {TaskService} from '../../../services/task/task-service';
import {Task} from '../../../models/task.model';
import {taskSuite} from './task.suite';
import {FormsModule} from '@angular/forms';
import { TuiButton, TuiTextfield} from '@taiga-ui/core';
import {TuiChevron, TuiDataListWrapper, TuiSelect, TuiTextarea} from '@taiga-ui/kit';
import {AuthService} from '../../../services/auth/auth';
import {ProjectStateService} from '../../../services/project/project-state-service';
import {NotificationsService} from '../../../services/notifications/notifications';

@Component({
  selector: 'app-task-form',
  imports: [
    FormsModule,
    TuiTextfield,
    TuiButton,
    TuiTextarea,
    TuiSelect,
    TuiChevron,
    TuiDataListWrapper,
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm implements OnInit {
  ngOnInit(): void {
    this.currentMemberId.set(this.authService.getCurrentMemberId())

  }

  private taskService = inject(TaskService);
  private readonly authService = inject(AuthService);
  private projectStateService = inject(ProjectStateService);
  private notifService = inject(NotificationsService);

  public projectId = input.required<number>()
  public taskCreated = output<Task>();
  public currentMemberId = signal<number | null>(null);

  public touched = {
    nom: false,
  };

  public newTask: Partial<Task> = {
    nom: '',
    description: '',
    priorite: 'MOYENNE',
    status: 'A_FAIRE',
    dateEcheance: undefined
  };

  priorites = ['BASSE', 'MOYENNE', 'HAUTE'];
  stringifyPriorite = (item: string): string => {
    switch (item) {
      case 'BASSE':
        return 'Basse';
      case 'MOYENNE':
        return 'Moyenne';
      case 'HAUTE':
        return 'Haute';
      default:
        return item;
    }
  };

  statut = ['A_FAIRE', 'EN_COURS', 'TERMINER']
  stringifyStatut = (item: string): string => {
    switch (item) {
      case 'A_FAIRE':
        return 'a faire';
      case 'EN_COURS':
        return 'en cours';
      case 'TERMINER':
        return 'terminé';
      default:
        return item;
    }
  };

  public  result = signal(taskSuite.run(this.newTask));

  onInput(field: string) {
    this.touched[field as keyof typeof this.touched] = true;
    this.result.set(taskSuite.run(this.newTask, field));
  }

  submitTask() {
    this.touched.nom = true;
    this.result.set(taskSuite.run(this.newTask));

    if(this.result().isValid()){
    const mid = this.projectStateService.memberId();
      if(mid){
        const taskToSave = {...this.newTask, project: {id: this.projectId()}} as Task;

        this.taskService.createTask(taskToSave, mid).subscribe({
          next: (savedTask) => {
            this.notifService.show("Tâche'"+ savedTask.nom + "'créée avec succès !");
            this.resetForm(savedTask);
          },
          error: (err) => {
            this.notifService.show("Impossible de créer la tâche. Vérifiez vos droits.", "error");
          }
        });
      }else {
        this.notifService.show("Aucun ID de membre trouvé pour ce projet");
      }
    }
  }

  private resetForm(saveTask : Task): void {
    this.newTask = {nom: '', priorite: 'MOYENNE', status: 'A_FAIRE'};
    this.touched = {
      nom: false,
    };
    this.result.set(taskSuite.run(this.newTask));
    this.taskCreated.emit(saveTask);
  }

}
