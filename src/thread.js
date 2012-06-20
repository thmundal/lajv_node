function sendToForeground(func) {
  process.send({cb: "(" + func.toString() + ")()", params:(typeof args != "undefined" ? args : null)});
}

process.on("message", function(m) {
             with(m.params != null ? m.params : {}) {
               eval(m.cb);
             }
           });