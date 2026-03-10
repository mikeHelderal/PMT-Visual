export interface Task {
  id?: number ;
  nom: string;
  description?: string;
  priorite: Priorite ;
  statut: Statut ;
  dateEcheance?: string;
  dateFinReelle?: string ;
  project: {id: number};
}

export type Statut = 'A_FAIRE' | 'EN_COURS' | 'TERMINE'

export type Priorite = 'HAUTE' | 'MOYENNE' | 'BASSE' ;

