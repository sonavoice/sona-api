var mongoose = require('mongoose');

var extensionSchema = mongoose.Schema({
  developerEmail: String,
  name: String,
  description: String,
  commands: Array,
  iconURL: String,
});

var Extension = mongoose.model('Extension', extensionSchema);

module.exports = Extension;
