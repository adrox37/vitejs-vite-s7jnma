export const requiredValidator = {
  attribute: 'required',
  key: 'valueMissing',
  message: 'You must include a value',
  callback(instance, value) {
    let valid = true;

    if (instance.required && !value) {
      valid = false;
    }

    return valid;
  },
};

export const programmaticValidator = {
  attribute: 'error',
  message(instance) {
    return instance.error;
  },
  callback(instance) {
    return !instance.error;
  },
};

export const minLengthValidator = {
  attribute: 'minlength',
  key: 'rangeUnderflow',
  message(instance) {
    return `Value must be at least ${instance.minLength} characters long`;
  },
  callback(instance, value) {
    if (!!value && instance.minLength >= value.length) {
      return false;
    }
    return true;
  },
};

export const maxLengthValidator = {
  attribute: 'maxlength',
  key: 'rangeOverflow',
  message(instance) {
    return `Value must not be more than ${instance.maxLength} characters long`;
  },
  callback(instance, value) {
    if (!!value && instance.maxLength < value.length) {
      return false;
    }
    return true;
  },
};

export const patternValidator = {
  attribute: 'pattern',
  key: 'patternMismatch',
  message(instance) {
    return `The value does not match the required format`;
  },
  callback(instance, value) {
    const regExp = new RegExp(instance.pattern);
    return !!regExp.exec(value);
  },
};
