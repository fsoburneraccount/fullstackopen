const mongoose = require('mongoose')

mongoose.set('useCreateIndex', true)

const commentSchema = mongoose.Schema({
  comment: { type: String, required: true, minlength: 3 },
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true }
})

commentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('Comment', commentSchema)

