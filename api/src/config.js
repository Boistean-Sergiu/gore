import Joi from 'joi'
import dotenv from 'dotenv'

dotenv.config()

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  SERVER_PORT: Joi.number()
    .default(8080),
  CRYPTON_SECRET: Joi.string().required()
    .description('Secret required for crypton encryption'),
  JWT_SECRET: Joi.string().required()
    .description('Secret required for jwt encryption'),
  MONGODB_HOST: Joi.string().required()
    .description('MONGO DB host'),
  MONGODB_DATABASE: Joi.string().required()
    .description('MONGO DB database'),
  MONGODB_PORT: Joi.string().required()
    .description('MONGO DB port'),
  MONGODB_USERNAME: Joi.string().required()
    .description('MONGO DB USERNAME'),
  MONGODB_PASSWORD: Joi.string().required()
    .description('MONGO DB PASSWORD')
}).unknown()
  .required()

const {error, value: envVars} = Joi.validate(process.env, envVarsSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.SERVER_PORT,
  cryptonSecret: envVars.CRYPTON_SECRET,
  jwtSecret: envVars.JWT_SECRET,
  mongodb: {
    host: envVars.MONGODB_HOST,
    database: envVars.MONGODB_DATABASE,
    port: envVars.MONGODB_PORT,
    username: envVars.MONGODB_USERNAME,
    password: envVars.MONGODB_PASSWORD
  },
  oauth2: {
    // Use mandatory client secret in the auth request
    useClientSecret: true,
    // Enables authentications strategies
    authentications: ['basic', 'bearer'],
    // Enables authorizations grants
    grants: ['client_credentials', 'password', 'refresh_token', 'authorization_code']
  },
  validation: {
    // Enables input validation
    enabled: false,
    // Regexp for username
    username: /^[\w\.]{2,100}$/g,
    // Regexp for password
    password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[.)(=,|$@$!%*#?&])[A-Za-z\d.)(=, | $@ $!%*#?&]{8,255}$/g,
    // Regexp for client name
    clientId: /^[\w\.]{2,100}$/g,
    // Regexp for client secret
    clientSecret: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[.)(=,|$@$!%*#?&])[A-Za-z\d.)(=, | $@ $!%*#?&]{8,255}$/g
  },
  user: {
    passwordEnc: 'bcrypt' // bcrypt|crypto|none
  },
  ldap: {
    enabled: false,
    authAttributes: ['cn', 'mail'],
    returnAttribute: 'dn',
    ldapper: null
  },
  crypton: {
    crypto: {
      secretKey: envVars.CRYPTON_SECRET,
      algorithm: 'AES-256-CBC',
      inputEncoding: 'utf8',
      outputEncoding: 'base64'
    },
    bcrypt: {
      saltRounds: 5
    }
  },
  token: {
    // Token life in seconds
    life: 3600,
    // Token length in bytes
    length: 64, // bytes
    // Delete active tokens on login
    autoRemove: false,
    jwt: {
      // Enables jwt token instead the standard token
      enabled: true,
      // Check if IP caller are the same of jwt IP when it was created
      ipcheck: false,
      // Check if user-agent caller are the same of jwt user-agent when it was created
      uacheck: false,
      // Secret key for signing jwt token
      secretKey: envVars.JWT_SECRET,
      cert: null
    }
  }
}
export default config
