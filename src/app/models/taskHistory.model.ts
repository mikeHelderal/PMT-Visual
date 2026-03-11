import { Task } from './task.model';
import { ProjectMember } from './projectMember.model';

export interface TaskHistoryModel {
  id?: number;
  task: Task;
  authorMember: ProjectMember;
  action: string;
  dateAction: Date | string;
}
