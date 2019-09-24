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
    // var filePath = path.join(__dirname, 'data', id + '.txt');
    var filePath = path.join(exports.dataDir, id + '.txt');
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

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error reading directory');
    } else {
      var data = _.map(files, (text, id) => {
        var ID = text.slice(0, text.length - 4);
        return { id: ID, text: ID };
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {

  fs.readFile(path.join(exports.dataDir, id + '.txt'), (err, data) => {
    if (err) {
      // throw (err);
      //could not read the file
      callback(new Error(`Cannot read file with id: ${id}`));
    } else if (!data) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      console.log('readOne else data: ', String(data), 'id: ', id);
      callback(null, { id: id, text: String(data) });
    }

  });

};

exports.update = (id, text, callback) => {
  var filePath = path.join(exports.dataDir, id + '.txt');

  fs.readFile(filePath, (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(filePath, text, (err, data) => {
        if (err) {
          throw ('error updating id file');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var filePath = path.join(exports.dataDir, id + '.txt');

  fs.unlink(filePath, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });

  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  // } else {
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
