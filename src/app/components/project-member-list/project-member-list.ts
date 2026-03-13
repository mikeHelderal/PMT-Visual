import {Component, effect, inject, input, signal} from '@angular/core';
import {ProjectMember} from '../../models/projectMember.model';
import {ProjectMemberService} from '../../services/projectMember/project-member';
import {TuiAlertService, TuiButton, TuiLoader, TuiTitle} from '@taiga-ui/core';
import {TuiAvatar, TuiBadge} from '@taiga-ui/kit';
import {TuiCardLarge, TuiHeader} from '@taiga-ui/layout';
import {DatePipe} from '@angular/common';
import {ProjectMemberInvite} from '../project-member-invite/project-member-invite';
import {AuthService} from '../../services/auth/auth';

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

  private readonly authService: AuthService = inject(AuthService);
  private readonly alerts = inject(TuiAlertService);
  private readonly memberService = inject(ProjectMemberService);

  readonly projectId = input.required<number>();

  readonly members = signal<ProjectMember[]>([]);
  readonly isLoading = signal<boolean>(false)


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
        console.log("data => ", data);
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
    const requesterId = this.authService.getCurrentMemberId();
    if (!requesterId) {
      console.error("Impossible d'inviter un membre : Utilisateur non identifié");
      return;
    }

    if (confirm('Voulez-vous vraiment retirer ce membre ?')) {
      this.memberService.removeMember(id,requesterId).subscribe({
        next: () => {
          this.alerts.open(`L'utilisateur a été supprimé du projet !`, {
            label: 'Succès',
            appearance: 'success',
            autoClose: 3000
          }).subscribe();
        },
        error: (err) => {
          if (err.status === 403) {
            alert("Action refusée : Vous n'avez pas les droits d'administrateur.");
          }else{
            const errorMsg = err.error?.message || 'Une erreur est survenue';
            this.alerts.open(errorMsg, {
              label: 'Erreur',
              appearance: 'error',
              autoClose: 3000}).subscribe();
          }
        }
      })
    }
  }
}
