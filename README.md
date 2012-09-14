# Node.js Proxy Protocol Parser

Parses the HA Proxy/stud proxy protocol line using strtok.

## Usage

```
var proxy_protocol = require("./");

stream.on('proxy', function(obj) {
  console.log('Got proxy details');
  console.log(obj);
});
proxy_protocol.parse(tcp4);
```
