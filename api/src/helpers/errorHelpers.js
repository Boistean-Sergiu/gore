import { validationResult } from 'express-validator/check'

export function catchErrors (fn) {
  return function (req, res, next) {
    return fn(req, res, next).catch(next)
  }
}
