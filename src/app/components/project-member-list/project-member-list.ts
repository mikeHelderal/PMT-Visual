import {Component, effect, inject, input, signal} from '@angular/core';
import {ProjectMember} from '../../models/projectMember.model';
import {ProjectMemberService} from '../../services/projectMember/project-member';
import {TuiAppearance, TuiButton, TuiLoader, TuiTitle} from '@taiga-ui/core';
import {TuiAvatar, TuiBadge} from '@taiga-ui/kit';
import {TuiCardLarge, TuiHeader} from '@taiga-ui/layout';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-project-member-list',
  imports: [
    TuiTitle,
    TuiLoader,
    TuiAvatar,
    TuiCardLarge,
    TuiAppearance,
    TuiBadge,
    DatePipe,
    TuiHeader,
    TuiButton,
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
      this.loadMembers();
    });
  }
  loadMembers(): void {
    this.isLoading.set(true);
    this.memberService.getMembers(this.projectId()).subscribe({
      next: (data) => {
        this.members.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
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
