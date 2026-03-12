import {Component, inject, input, OnInit, output, signal, TemplateRef} from '@angular/core';
import {TuiButton, TuiDialogService, TuiTextfield} from '@taiga-ui/core';
import {TuiDataListWrapper, TuiSelect} from '@taiga-ui/kit';
import {TaskService} from '../../../services/task/task-service';
import {ProjectMemberService} from '../../../services/projectMember/project-member';
import {FormsModule} from '@angular/forms';
import {ProjectMember} from '../../../models/projectMember.model';
import {Task} from '../../../models/task.model';

@Component({
  selector: 'app-task-add-member',
  imports: [
    TuiButton,
    TuiTextfield,
    TuiSelect,
    TuiDataListWrapper,
    FormsModule
  ],
  templateUrl: './task-add-member.html',
  styleUrl: './task-add-member.css',
})
export class TaskAddMember implements OnInit {

  private readonly dialogs = inject(TuiDialogService)
  private readonly taskService: TaskService = inject(TaskService);
  private readonly projectMemberService: ProjectMemberService = inject(ProjectMemberService);

  readonly task = input.required<Task>();
  readonly projectId = input.required<number>();
  readonly memberAdded = output<void>();
  public listMember = signal<ProjectMember[]>([]);
  public newMember = signal<ProjectMember>({email: '', id: 0, role: '', userId: 0, username: ''});

  ngOnInit() {
    this.getMembers();
  }


  getMembers(){
    this.projectMemberService.getMembers(this.projectId()).subscribe({
      next: (result: ProjectMember[]) => {
        this.listMember.set(result);
        console.log(result)
      }
    })

  }

  stringify = (item: ProjectMember): string => {
    return item.username ;
  }


openAssignDialog(content : TemplateRef<any>){
  this.dialogs.open(content, {
    label: "Assigner un membre",
    size: "s",
  }).subscribe(result => {
    console.log("result => ", result)
  });
}

  assign(observer: any){
    console.log(this.newMember());
    if(this.newMember().id){
      this.taskService.assignTask(this.task().id!,this.projectId(),this.newMember().id).subscribe({
       next: () => {
         observer.complete();
         this.memberAdded.emit()
       }
      })
    }
  }


}
