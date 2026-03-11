import {Component, inject, input, output, signal} from '@angular/core';
import {Priorite, Statut, Task} from '../../../models/task.model';
import {TuiTable} from '@taiga-ui/addon-table';
import {TuiBadge} from '@taiga-ui/kit';
import {DatePipe} from '@angular/common';
import {TaskService} from '../../../services/task/task-service';
import {TuiButton, TuiTextfield} from '@taiga-ui/core';

@Component({
  selector: 'tr [app-task-item]',
  imports: [
    TuiTable,
    TuiBadge,
    DatePipe,
    TuiButton,
    TuiTextfield
  ],
  templateUrl: './task-item.html',
  styleUrl: './task-item.css',
})
export class TaskItem {

  private taskService = inject(TaskService);
  private readonly nextStatus: Record<Statut,  Statut> = {
    'A_FAIRE': 'EN_COURS',
    'EN_COURS': 'TERMINE',
    'TERMINE': 'A_FAIRE'
  }
  private readonly priorities: Priorite[] = ['BASSE', 'MOYENNE', 'HAUTE'];
  private readonly memberId = localStorage.getItem('projectMemberId');
  public task = input.required<Task>();
  public taskDeleted = output<number>();
  public isEditing = signal<boolean>(false);

  changeStatus(){
    const memberId = Number(this.memberId);

    if (!memberId) {
      console.error('projectMemberId introuvable');
      return;
    }

    const currentStatus: Statut = this.task().statut;
    const next: Statut = this.nextStatus[currentStatus] || 'A_FAIRE';

    this.taskService.updateTaskStatus(this.task().id!, next,Number(this.memberId!)).subscribe({
      next: () => {
        this.task().statut = next;
     },
      error: (err) => console.error('Erreurs lors du changement de statut', err)
    });
  }

  changePriority(){
    const memberId = Number(this.memberId);

    if (!memberId) {
      console.error('projectMemberId introuvable');
      return;
    }
    const currentIndex = this.priorities.indexOf(this.task().priorite as any);
    const nextPriority: Priorite = this.priorities[(currentIndex + 1) % this.priorities.length];

    this.taskService.updateTask(this.task().id!, { priorite: nextPriority },Number(this.memberId!)).subscribe(() => {
      this.task().priorite = nextPriority;
    });
  }

  toggleEdit() {
    this.isEditing.set(!this.isEditing());
  }

  getPriorityAppearance(priority: Priorite): string {
    switch (priority) {
      case 'HAUTE': return 'danger';
      case 'MOYENNE': return 'warning';
      case 'BASSE': return 'success';
      default: return 'neutral';
    }
  }

  saveName(newName: string) {
    console.log('change nom ')
    const memberId = Number(this.memberId);

    if (!memberId) {
      console.error('projectMemberId introuvable');
      return;
    }
    if (newName !== this.task().nom) {
      this.taskService.updateTask(this.task().id!, { nom: newName },Number(this.memberId!)).subscribe({
        next: () => {
          this.task().nom = newName; // Mise à jour locale
          this.isEditing.set(false);
        }
      });
    } else {
      this.isEditing.set(false);
    }
  }

  onDelete(){
    const id = this.task().id;
    if (id && confirm('Voulez-vous supprimer cette tâche ?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.taskDeleted.emit(id);
        },
        error: (err) => console.error('La suppression a échoué', err)
      });
    }
  }

}
