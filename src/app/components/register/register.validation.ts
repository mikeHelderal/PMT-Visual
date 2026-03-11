import { create, test, enforce, only } from 'vest';


export const registerSuite = create(
  (data = {}, fieldName?: string) => {
  if (fieldName) {
    only(fieldName);
  }

  test('username', "Le nom d'utilisateur est requis", () => {
    enforce(data.username).isNotBlank();
  });

  test("username", "Minimum 3 caractères", () => {
    enforce(data.username).longerThanOrEquals(3);
  })

  test("email", "l'email est invalide", () => {
    enforce(data.email).matches(/^\S+@\S+\.\S+$/);
  });

  test("password", "le mot de passe doit faire au moins 6 caractères", () => {
    enforce(data.password).longerThanOrEquals(6);
  });

});

