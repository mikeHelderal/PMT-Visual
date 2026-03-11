import {Component, effect, inject, input, signal} from '@angular/core';
import {ProjectMember} from '../../models/projectMember.model';
import {ProjectMemberService} from '../../services/projectMember/project-member';
import { TuiButton, TuiLoader, TuiTitle} from '@taiga-ui/core';
import {TuiAvatar, TuiBadge} from '@taiga-ui/kit';
import {TuiCardLarge, TuiHeader} from '@taiga-ui/layout';
import {DatePipe} from '@angular/common';
import {ProjectMemberInvite} from '../project-member-invite/project-member-invite';

@Component({
  selector: 'app-project-member-list',
  imports: [
    TuiTitle,
    TuiLoader,
    TuiAvatar,
    TuiCardLarge,
    TuiBadge,
    DatePipe,
    TuiHeader,
    TuiButton,
    ProjectMemberInvite,
  ],
  templateUrl: './project-member-list.html',
  styleUrl: './project-member-list.css',
})
export class ProjectMemberList {

  readonly projectId = input.required<number>();

  readonly members = signal<ProjectMember[]>([]);
  readonly isLoading = signal<boolean>(false)

  private readonly memberService = inject(ProjectMemberService);

  constructor() {
    effect(() => {
      const id = this.projectId();
      if (id) {
        this.loadMembers();
      }
    });
  }

  loadMembers(): void {
    this.isLoading.set(true);
    this.memberService.getMembers(this.projectId()).subscribe({
      next: data => {
        this.members.set(data);
        this.isLoading.set(false);

        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

        const currentProjectMember = data.find(
          member => member.user?.id === currentUser.id
        );
        if (currentProjectMember?.id) {
          localStorage.setItem(
            'projectMemberId',
            currentProjectMember.id.toString()
          );
        } else {
          localStorage.removeItem('projectMemberId');
        }
      },
      error: err => {
        this.isLoading.set(false);
        console.error('Erreur chargement membres', err);
      },
    });
  }


  deleteMember(id: number): void {

    if (confirm('Voulez-vous vraiment retirer ce membre ?')) {
      this.memberService.removeMember(id).subscribe(() => {
        this.members.update(prev => prev.filter(m => m.id !== id));
      });
    }
  }
}
