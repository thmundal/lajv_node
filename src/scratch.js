var pg = require('pg'); 

var conString = "tcp://lajv-db-user:zX5bA709@localhost/lajv_node";

//error handling omitted
testPg = function() {  
  pg.connect(conString, function(err, client) {
               if(err)
                 return _swank.output(err);

               client.query("SELECT NOW() as when", function(err, result) {
                              _swank.output("Row count: %d",result.rows.length);  // 1
                              _swank.output("Current year: %d", result.rows[0].when.getYear());
                            });

               return true;
             });
}