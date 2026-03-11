import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProjectService} from '../../../services/project/project-service';
import {Project} from '../../../models/project.model';
import {TasksList} from '../../tasks/tasks-list/tasks-list';
import {ProjectMemberList} from '../../project-member-list/project-member-list';
@Component({
  selector: 'app-project-detail',
  imports: [
    TasksList,
    ProjectMemberList

  ],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css',
})
export class ProjectDetail implements OnInit {

  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);

  projectId!: number;
  project = signal<Project | null>(null);

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));

    this.projectService.getProjectById(this.projectId).subscribe({
      next: project => this.project.set(project),
      error: err => console.error('Erreur chargement projet', err),
    });
  }

}
