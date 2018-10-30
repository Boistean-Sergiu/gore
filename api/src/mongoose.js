import mongoose from 'mongoose'
import config from './config'

mongoose.connect(`mongodb://${config.mongodb.username}:${config.mongodb.password}@${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.database}`, {
  useNewUrlParser: true,
  autoIndex: false
})
export default mongoose.connection
