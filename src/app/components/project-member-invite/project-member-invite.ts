import {Component, inject, input, output, signal, TemplateRef} from '@angular/core';
import {ProjectMemberService} from '../../services/projectMember/project-member';
import {INVITE_SUITE} from './project-member-validation';
import {FormsModule} from '@angular/forms';
import {TuiButton, TuiDialogService, TuiError, TuiLabel, TuiLoader, TuiTextfield} from '@taiga-ui/core';
import {TuiChevron, TuiDataListWrapper, TuiSelect} from '@taiga-ui/kit';

@Component({
  selector: 'app-project-member-invite',
  imports: [
    FormsModule,
    TuiError,
    TuiDataListWrapper,
    TuiLabel,
    TuiTextfield,
    TuiButton,
    TuiLoader,
    TuiChevron,
    TuiSelect
  ],
  templateUrl: './project-member-invite.html',
  styleUrl: './project-member-invite.css',
})
export class ProjectMemberInvite {

  readonly projectId = input.required<number>();
  readonly memberAdded = output<void>();

  private readonly memberService = inject(ProjectMemberService);
  private readonly dialogs = inject(TuiDialogService);


  form = { email: '', roleName: 'MEMBER' };
  result = signal(INVITE_SUITE.get());
  roles = ['ADMIN', 'MEMBER', 'GUEST'];
  isLoading = signal(false);

  onInput(field: string): void {
    this.result.set(INVITE_SUITE.run(this.form, field));
  }

  getError(field: string): string | undefined {
    return this.result().getErrors(field)[0];
  }

  openAddMemberDialog(content : TemplateRef<any>): void {
    this.dialogs.open(content, {
      label: 'Nouveau membre',
      size: 'm',
    }).subscribe({
      complete: () => console.log('Dialog fermée'),
    });
  }

  submit(): void {
    const report = INVITE_SUITE.run(this.form);
    this.result.set(report);

    if (report.hasErrors()) return;

    this.isLoading.set(true);
    this.memberService.addMember(this.projectId(), this.form.email, this.form.roleName).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.form = { email: '', roleName: 'MEMBER' };
        this.result.set(INVITE_SUITE.get()); // Reset validation
        this.memberAdded.emit();
      },
      error: () => this.isLoading.set(false)
    });
  }
}
