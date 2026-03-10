import {Statut, Task} from '../../../models/task.model';
import {create, enforce, only, test, Suite} from 'vest';

type ValidationFn = (data: Partial<Task>, field?: string) => void;

export const taskSuite = create((data: Partial<Task>, field?: string) => {
  test('nom', 'Le nom est requis', () => {
    enforce(data.nom).isNotBlank();
  });

  test('nom', 'Minimum 3 caractères', () => {
    enforce(data.nom).longerThanOrEquals(3);
  });

  test('statut', 'Statut invalide', () => {
    const validStatuts: Statut[] = ['A_FAIRE', 'EN_COURS', 'TERMINE'];
    enforce(validStatuts).condition((val) => validStatuts.includes(val as Statut));
  });
})
