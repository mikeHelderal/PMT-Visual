import { User } from './user.model';
import { Project } from './project.model';

export interface ProjectMember {
  id?: number;
  user: User;
  project: Project;
  role: any;

  dateArrivee?: Date | string;
}
