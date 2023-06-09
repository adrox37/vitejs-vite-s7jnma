export const requiredValidator = {
  attribute: 'required',
  key: 'valueMissing',
  message: 'Please fill out this field',
  isValid(instance, value) {
    let valid = true;

    if ((instance.hasAttribute('required') || instance.required) && !value) {
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
  isValid(instance) {
    return !instance.error;
  },
};

export const minLengthValidator = {
  attribute: 'minlength',
  key: 'tooShort',
  message(instance, value) {
    const _value = value || '';
    return `Please use at least ${instance.minLength} characters (you are currently using ${_value.length} characters).`;
  },
  isValid(instance, value) {
    /** If no value is provided, this validator should return true */
    if (!value) {
      return true;
    }

    if (!!value && instance.minLength > value.length) {
      return false;
    }

    return true;
  },
};

export const maxLengthValidator = {
  attribute: 'maxlength',
  key: 'tooLong',
  message(instance, value) {
    const _value = value || '';
    return `Please use no more than ${instance.maxLength} characters (you are currently using ${_value.length} characters).`;
  },
  isValid(instance, value) {
    /** If maxLength isn't set, this is valid */
    if (!instance.maxLength) {
      return true;
    }

    if (!!value && instance.maxLength < value.length) {
      return false;
    }

    return true;
  },
};

export const patternValidator = {
  attribute: 'pattern',
  key: 'patternMismatch',
  message: 'Please match the requested format',
  isValid(instance, value) {
    /** If no value is provided, this validator should return true */
    if (!value || !instance.pattern) {
      return true;
    }

    const regExp = new RegExp(instance.pattern);
    return !!regExp.exec(value);
  },
};
