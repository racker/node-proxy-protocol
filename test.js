/**
 *  Copyright 2012 Rackspace
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

var proxy_protocol = require("./");
var fs = require("fs");

var tcp4 = fs.createReadStream("examples/tcp4.txt")
tcp4.on('proxy', function(obj) {
  console.log(obj);
});
proxy_protocol.parse(tcp4);

var tcp6 = fs.createReadStream("examples/tcp6.txt")
tcp6.on('proxy', function(obj) {
  console.log(obj);
});
proxy_protocol.parse(tcp6);

var unknown = fs.createReadStream("examples/unknown.txt")
unknown.on('proxy', function(obj) {
  console.log("ERROR");
});
proxy_protocol.parse(unknown);

var garbage = fs.createReadStream("examples/garbage.txt")
garbage.on('proxy', function(obj) {
  console.log("ERROR");
});
proxy_protocol.parse(garbage);
