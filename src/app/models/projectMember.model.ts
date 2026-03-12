import { User } from './user.model';
import { Project } from './project.model';
import {Role} from './role.model';

export interface ProjectMemberALL {
  id?: number;
  user: User;
  project: Project;
  role: Role;
  dateArrivee?: Date | string;
}

export interface ProjectMember{
  id: number;
  userId: number;
  email: string;
  username: string;
  role: string;
  dateArrivee?: Date | string;


}
