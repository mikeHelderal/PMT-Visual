import { create, test, enforce, only } from 'vest';

export const INVITE_SUITE = create((data: any = {}, fieldName?: string) => {
  only(fieldName);

  test('email', 'L\'email est obligatoire', () => {
    enforce(data.email).isNotBlank();
  });

  test('email', 'Format d\'email invalide', () => {
    enforce(data.email).matches(/^\S+@\S+\.\S+$/);
  });

  test('roleName', 'Le rôle est obligatoire', () => {
    enforce(data.roleName).isNotBlank();
  });
});
