import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProjectService} from '../../../services/project/project-service';
import {Project} from '../../../models/project.model';
import {TasksList} from '../../tasks/tasks-list/tasks-list';
import {ProjectMemberList} from '../../project-member-list/project-member-list';
import {TuiTabs} from '@taiga-ui/kit';
import {TuiIcon} from '@taiga-ui/core';
import {Task} from '../../../models/task.model';
import {ProjectDashboard} from '../../project-dashboard/project-dashboard';
import {TaskService} from '../../../services/task/task-service';
import {AuthService} from '../../../services/auth/auth';
import {ProjectStateService} from '../../../services/project/project-state-service';
@Component({
  selector: 'app-project-detail',
  imports: [
    TasksList,
    ProjectMemberList,
    TuiTabs,
    TuiIcon,
    ProjectDashboard

  ],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css',
})
export class ProjectDetail implements OnInit {

  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private projectStateService = inject(ProjectStateService);

  readonly activeTab = signal<'dashboard' | 'gestion'>('dashboard')

  projectId = signal<number | null>(null);
  project = signal<Project | null>(null);
  tasks= signal<Task[]>([]);

  ngOnInit(): void {
    this.projectId.set(Number(this.route.snapshot.paramMap.get('id')));

    this.projectService.getProjectById(this.projectId()!).subscribe({
      next: (project) => {
        this.project.set(project)
        if(project.id){
          this.loadTasks(project.id);
          this.projectStateService.setProject(project);
        }
      },
      error: err => console.error('Erreur chargement projet', err),
    });
  }

  protected loadTasks(projectId: number): void {
    this.taskService.getTasksByProject(projectId).subscribe({
      next: data => this.tasks.set(data),
      error: err => console.error('Erreur lors du chargement des tâches', err),
    });
  }



  onTaskCreated(newTask: Task,): void {
    this.tasks.update(currentTasks => [...currentTasks, newTask]);
  }

  removeTaskFromList(taskId: number): void {

    const currentMemberId = this.authService.getCurrentMemberId();

    if(confirm('Etes-vous sûr de vouloir supprimer cette tâche ?')){
      this.taskService.deleteTask(taskId, currentMemberId!).subscribe({
        next: () => {
          this.loadTasks(this.projectId()!);
        },
        error: (err) => {
          if(err.status === 403){
            alert("Action refusée : vous n'êtes pas administrateur");
          }
        }
      })
    }


    this.tasks.update(list => list.filter(task => task.id !== taskId));
  }



}
