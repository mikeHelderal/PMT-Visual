export interface Task {
  id?: number ;
  nom: string;
  description?: string;
  priorite: Priorite ;
  status: Statut ;
  assignee?: Assignee ;
  dateEcheance?: string;
  dateFinReelle?: string ;
  project: {id: number};
}

export type Statut = 'A_FAIRE' | 'EN_COURS' | 'TERMINE'

export type Priorite = 'HAUTE' | 'MOYENNE' | 'BASSE' ;

export interface Assignee {
  email : string ;
  id: string;
  username: string
}
