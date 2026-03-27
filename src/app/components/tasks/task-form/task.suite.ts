import {Statut, Task} from '../../../models/task.model';
import {create, enforce, only, test} from 'vest';


export const taskSuite = create((data: Partial<Task>, field?: string) => {
  if (field) {
    only(field);
  }
  test('nom', 'Le nom est requis', () => {
    enforce(data.nom).isNotBlank();
  });

  test('nom', 'Minimum 3 caractères', () => {
    enforce(data.nom).longerThanOrEquals(3);
  });

  test('statut', 'Statut invalide', () => {
    const validStatuts: Statut[] = ['A_FAIRE', 'EN_COURS', 'TERMINE'];

    enforce(validStatuts.includes(data.status as Statut)).isTruthy();
  });
})
