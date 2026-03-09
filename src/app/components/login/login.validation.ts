import { create, test, enforce } from 'vest';

export const loginSuite = create((data: any = {}) => {
  test('email', "L'email est requis", () => {
    enforce(data.email).isNotBlank();
  });

  test('password', "Le mot de passe est requis", () => {
    enforce(data.password).isNotBlank();
  });
});
