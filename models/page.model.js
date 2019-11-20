const mongoose = require('mongoose')

const Schema = mongoose.Schema

const pageSchema = new Schema({
  blockNum: {
    type: Number,
    required: true,
    index: true
  },
  blockContent: [Schema.Types.Mixed]
}, {
  timestamps: true,
})

const Page = mongoose.model('Page', pageSchema)

module.exports = Page