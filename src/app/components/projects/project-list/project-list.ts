import {Component, inject, OnInit, signal, TemplateRef} from '@angular/core';
import {ProjectCard} from '../project-card/project-card';
import {TuiAlertService, TuiButton, TuiDialogService, TuiTextfield} from '@taiga-ui/core';
import {ProjectService} from '../../../services/project/project-service';
import {Project} from '../../../models/project.model';
import {FormsModule} from '@angular/forms';
import {TuiInputRange, TuiTextarea} from '@taiga-ui/kit';
import {AuthService} from '../../../services/auth/auth';

@Component({
  selector: 'app-project-list',
  imports: [ProjectCard, TuiButton, FormsModule, TuiInputRange, TuiTextfield, TuiTextarea],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
})
export class ProjectList implements OnInit {

  private projectService = inject(ProjectService);
  private readonly dialogs = inject(TuiDialogService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly alerts = inject(TuiAlertService);

  projects = signal<Project[]>([])
  newProject: Project = {dateDebut: '', nom: '', description: ''};

  ngOnInit() {
   this.refreshProject();
  }

  refreshProject(){
    const user = JSON.parse(localStorage.getItem('currentUser')|| '{}');
    if(user.id){
      this.projectService.getProjectsById(user.id).subscribe({
        next: (data: Project[]) => this.projects.set(data),
        error:(err) => console.error('Erreur lors de la récupération des projects', err)
      });
    }
  }

  showDialog(content: TemplateRef<any>){
    this.dialogs.open(content,{label: 'Nouveau projet', size: 'm'}).subscribe(() => {
    });
  }

  submitProject(observer: any){
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const projectToSave: Project = {
      ...this.newProject,adminId: user.id
    };
    this.projectService.createProject(projectToSave).subscribe({
      next: () => {
        this.refreshProject();
        this.newProject = {dateDebut: '', nom: '', description: '' };
        observer.complete()
      }
    })
  }
  deleteProject(id: number) {
    const requesterId = this.authService.getCurrentMemberId();

    if (!requesterId) return;

    if (confirm('Supprimer ce projet ?')) {
      this.projectService.deleteProject(id, requesterId!).subscribe({
        next: () => {
          this.projects.update(list => list.filter(p => p.id !== id));

          this.alerts.open('Projet supprimé').subscribe();
        },
        error: (err) => {
          console.error('Erreur suppression', err);
          this.alerts.open('Action non autorisée').subscribe();
        }
      });
    }
  }

}
