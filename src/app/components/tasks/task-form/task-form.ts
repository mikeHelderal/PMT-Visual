import {Component, inject, input, output} from '@angular/core';
import {TaskService} from '../../../services/task/task-service';
import {Task} from '../../../models/task.model';
import {taskSuite} from './task.suite';
import {FormsModule} from '@angular/forms';
import {TuiAppearance, TuiButton, TuiTextfield} from '@taiga-ui/core';

@Component({
  selector: 'app-task-form',
  imports: [
    FormsModule,
    TuiTextfield,
    TuiButton,
    TuiAppearance
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {

  private taskService = inject(TaskService);
  public projectId = input.required<number>()
  public taskCreated = output<Task>();
  public newTask: Partial<Task> = {
    nom: '',
    priorite: 'MOYENNE',
    statut: 'A_FAIRE'
  };
  public  result = taskSuite.get();

  onInput(field: string) {
    // 2. On utilise une petite ruse de typage ici pour débloquer l'IDE
    const suite = taskSuite as any;
    this.result = suite(this.newTask, field);
  }

  submitTask() {
    const suite = taskSuite as any;
    this.result = suite(this.newTask);

    if(this.result.isValid()){
      const taskToSave = {...this.newTask, project: {id: this.projectId()}} as Task;
      this.taskService.createTask(taskToSave).subscribe({
        next: (savedTask) => {
          this.taskCreated.emit(savedTask);
          this.resetForm();
        },
        error: (err) => {
          console.log('Erreur lors de la création : ',err);
        }
      })
    }
  }

  private resetForm(): void {
    this.newTask = {nom: '', priorite: 'MOYENNE', statut: 'A_FAIRE'};
    this.result = taskSuite.get();
  }

}
