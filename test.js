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
proxy_protocol.parse(tcp4, function(err, obj) {
  console.log(obj);
});

var tcp6 = fs.createReadStream("examples/tcp6.txt")
proxy_protocol.parse(tcp6, function(err, obj) {
  console.log(obj);
});

var unknown = fs.createReadStream("examples/unknown.txt")
proxy_protocol.parse(unknown, function(err, obj) {
  if (err !== null) {
    console.log(err);
    console.log("Error on unknown");
  }
});

var garbage = fs.createReadStream("examples/garbage.txt")
proxy_protocol.parse(garbage, function(err, obj) {
  if (err !== null) {
    console.log(err);
    console.log("Error on garbage");
  }
});

var newline = fs.createReadStream("examples/tcp4-no-newline.txt")
proxy_protocol.parse(newline, function(err, obj) {
  console.log('ERROR: We should not be here this test is for a short stream');
});
