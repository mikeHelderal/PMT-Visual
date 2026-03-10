import {Component, inject, input, signal} from '@angular/core';
import {ProjectMemberService} from '../../../services/projectMember/project-member';
import {TuiAlertService, TuiButton, TuiTextfield} from '@taiga-ui/core';
import {FormsModule} from '@angular/forms';
import {TuiChevron, TuiDataListWrapper, TuiSelect} from '@taiga-ui/kit';

@Component({
  selector: 'app-project-members',
  imports: [
    FormsModule,
    TuiDataListWrapper,
    TuiTextfield,
    TuiButton,
    TuiSelect,
    TuiChevron
  ],
  templateUrl: './project-members.html',
  styles: ``,
})
export class ProjectMembers {
  private readonly memberService = inject(ProjectMemberService);
  private readonly alerts = inject(TuiAlertService);

  projectId = input.required<number>();

  email = signal('');
  role = signal('DEVELOPER');
  roles = ['ADMIN', 'DEVELOPER', 'VIEWER'];

  onAddMember(): void {
    if (!this.email()) return;

    this.memberService.addMember(this.projectId(), this.email(), this.role()).subscribe({
      next: () => {

        this.alerts.open(`L'utilisateur a été ajouté au projet !`, {
          label: 'Succès',
          appearance: 'success',
          autoClose: 3000
        }).subscribe();
        this.email.set('');
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Une erreur est survenue';
        this.alerts.open(errorMsg, {
          label: 'Erreur',
          appearance: 'error',
          autoClose: 3000}).subscribe();
      }
    });
  }
}
