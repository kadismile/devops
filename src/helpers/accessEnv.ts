import ApplicationError from '../errors/application-error';

const cache: { [key: string]: any} = {}

const accessEnv = (key: string, defaultValue?: any) => {

  if (!(key in process.env)) {
    if (defaultValue) return defaultValue;
    throw new ApplicationError(`${key} not found in process.env!`, 500)
  }

  if (cache[key]) return cache[key]

  cache[key] = process.env[key]

  return process.env[key]
}

export default accessEnv;