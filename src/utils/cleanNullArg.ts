import _isNull from 'lodash/isNull';

const cleanNullArgs = (obj: object): object => {
  const resultNotNull: object = {};

  for (const [key, value] of Object.entries(obj)) {
    if (!_isNull(value)) {
      resultNotNull[key] = value;
    }
  }

  return resultNotNull;
};

export default cleanNullArgs;
