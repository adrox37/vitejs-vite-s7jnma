import { PureValidators } from './validation/pure-validators.js';

// Validators for testing purposes

export const allRequired = (a) => {
  return a.controls.every((c) => !PureValidators.required(c))
    ? null
    : 'allRequired';
};

export const sameLength =
  (...fields) =>
  (g) => {
    const hasError = fields.some((field) => {
      const array = g.get(field);
      const firstArray = g.get(fields[0]);
      return array?.controls.length !== firstArray?.controls.length;
    });
    return hasError ? 'sameLength' : null;
  };

export const forbiddenCredentials =
  (forbiddenName, forbiddenSurname) => (g) => {
    return new Promise((res) => {
      setTimeout(() => {
        const name = g.get('name');
        const surname = g.get('surname');
        res(
          name?.value === forbiddenName && surname?.value === forbiddenSurname
            ? 'forbiddenCredentials'
            : null
        );
      }, 1000);
    });
  };
