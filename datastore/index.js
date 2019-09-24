const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, data) => {
    var id = data;
    console.log('create id: ', id);
    items[id] = text;
    var filePath = path.join(__dirname, 'data', id + '.txt');
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        throw ('error writing id file');
      } else {
        console.log('writing id file success!');
        //callback(null, text);
      }
    });
    callback(null, { id, text }); //addTodo renders
  });
};

exports.readAll = (callback) => {

  fs.readdir(path.join(__dirname, 'data'), (err, files) => {
    if (err) {
      throw ('error reading directory');
    } else {
      var data = _.map(files, (text, id) => {
        var ID = text.slice(0, text.length - 4)
        return { id: ID, text: ID };
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
