# Node.js Proxy Protocol Parser

Parses the HA Proxy/stud proxy protocol line using strtok.

## Usage

```
var proxy_protocol = require("./");

proxy_protocol.parse(tcp4, function(err, obj) {
  console.log('Got proxy details');
  console.log(obj);
});
```
