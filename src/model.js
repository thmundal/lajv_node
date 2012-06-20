var pg = require("pg");
var swank = process.swank;
var spawn = require("child_process").fork;

var constring = "postgres://lajv:1234@localhost/lajv_node";
pg.defaults.poolSize = 10;

function dbg_print(obj) {
  swank.output(JSON.stringify(obj));
}

function runInBackground(func) {
  var thread = spawn("./thread.js");

  thread.send({cb: "(" + func.toString() + ")()", params:(typeof args != "undefined" ? args : null)});

  thread.on("message", function(m) {
              with(m.params != null ? m.params : {}) {
                eval(m.cb);
              }
             });
}

var model = function(properties) {
  this.db_connection.connect();

  if(typeof properies == "object") {
    for(var i in properties) {
      this[i] = properties[i];
    }
  }

  this.db_schema = null;
};

model.prototype.db_connection = new pg.Client(constring);
model.prototype.destroyed = false;

model.prototype.destroy = function() {
  this.db_connection.end();
  this.destroyed = true;
  delete this;
};

model.prototype.load_database_schema = function() {
  if(typeof this.table_name != "undefined") {
    // Get schema-information from database here
    this.db_connection.query("SELECT * FROM users;", 
                             function(err, result) {
                               dbg_print(result);
                             });
  }
};

model.prototype.populate_fields = function() {
  if(typeof this.id != "undefined" && typeof this.db_schema != null) {
    // Load information of this model based on the table name and the id specified
  }
};

model.prototype.set = function(value_map) {
  var replicate = {};

  if(typeof value_map == "object") {
    for(var i in value_map) {
      if(this[i] != value_map[i]) {
        replicate[i] = value_map[i];
        this[i] = value_map[i];
      }
    }

    this.replicate_to_database(replicate);
  }
};

model.prototype.replicate_to_database = function(fields_to_replicate) {
  with(args = {model:this, 
               fields: fields_to_replicate}) {
    runInBackground(function() {
                      for(var i in fields) {
                        console.log(i + " => " + fields[i]);
                      }

                      with(args = {model:model}) {
                        sendToForeground(function() {
                                           dbg_print(model);
                                         });
                      }
                      
                    });
  }
};

exports.model = model;