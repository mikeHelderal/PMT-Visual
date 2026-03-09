import { create, test, enforce, only } from 'vest';


export const registerSuite = create(
  (data = {}, fieldName?: string) => {
  if (fieldName) {
    only(fieldName);
  }

  test('userName', "Le nom d'utilisateur est requis", () => {
    enforce(data.userName).isNotBlank();
  });

  test("userName", "Minimum 3 caractères", () => {
    enforce(data.userName).longerThanOrEquals(3);
  })

  test("email", "l'email est invalide", () => {
    enforce(data.email).matches(/^\S+@\S+\.\S+$/);
  });

  test("password", "lem ot de passe doit faire au moins 6 caractères", () => {
    enforce(data.password).longerThanOrEquals(6);
  });

});

