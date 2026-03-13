import {Component, inject, input, output} from '@angular/core';
import {TuiButton, TuiTitle} from '@taiga-ui/core';
import {TuiCardLarge, TuiHeader} from '@taiga-ui/layout';
import {Project} from '../../../models/project.model';
import {RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';
import {AuthService} from '../../../services/auth/auth';

@Component({
  selector: 'app-project-card',
  imports: [TuiCardLarge, TuiButton, TuiTitle, TuiHeader, RouterLink, DatePipe],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css',
})
export class ProjectCard {

  private readonly authService: AuthService = inject(AuthService);

  project = input.required<Project>()
  onDelete = output<number>()

  get canDelete() : boolean {
    const currentUserId = this.authService.currentUser()?.id;
    return currentUserId === this.project().adminId;
  }


}
