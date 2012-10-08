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

var strtok = require('strtok');

var c = {
  "proxy": "PROXY ",
  "tcp6": "TCP6 ",
  "tcp4": "TCP4 ",
  "unknown": "UNKNOW",
  "port": "65535 ",
  "ip4": "255.255.255.255 ",
  "ip6": "2001:0db8:85a3:0042:0000:8a2e:0370:73 ",
};

var states = ["NONE", "PROXY", "PROTO", "SRCA", "DSTA", "SRCP", "DSTP", "LF"];
var parse_error = new Error('Failed to parse PROXY protocol');


function parse(stream, callback) {
  var state = 0;
  var space = {};
  var obj = {};

  function parseError() {
    obj = null;
    callback(parse_error, null);
  }

  function spaceStart(max) {
    space.buffer = '';
    space.searching = true;
    space.max = max;
    space.searching = true;
    return new strtok.StringType(1, 'utf-8');
  }

  function ipSearchStart() {
    if (obj.proto === "TCP6") {
      return spaceStart(c.ip6.length);
    } else {
      return spaceStart(c.ip4.length);
    }
  }

  function portSearchStart() {
    return spaceStart(c.port.length);
  }

  strtok.parse(stream, function(v) {
    /* Buffer until we find a space */
    if (space.max > 0) {
      space.max--;
      switch (v)
      {
      case ' ':
        space.max = 0;
        space.searching = false;
        break;

      case '\r':
        space.max = 0;
        space.searching = false;
        break;

      default:
        space.buffer += v;
        return new strtok.StringType(1, 'utf-8');
        break;
      }
    }

    /* Never found that space, bail */
    if (space.searching === true) {
      parseError();
      return strtok.DONE;
    }

    switch (states[state])
    {

    /* Searching for PROXY */
    case "NONE":
      state++;
      return new strtok.StringType(c.proxy.length, 'utf-8');
      break;

    case "PROXY":
      if (v === c.proxy) {
        state++;
        return new strtok.StringType(c.tcp4.length, 'utf-8');
      } else {
        parseError();
        return strtok.DONE;
      }
      break;

    /* Confirm PROTO and find SRCA */
    case "PROTO":
      if (v === c.tcp6 || v === c.tcp4) {
        state++;
        obj.proto = v.slice(0, v.length - 1);
      } else {
        parseError();
        return strtok.DONE;
      }

      return ipSearchStart();

      break;

    case "SRCA":
      obj.srca = space.buffer;
      state++;

      return ipSearchStart();
      break;

    case "DSTA":
      obj.desta = space.buffer;
      state++;

      return portSearchStart();
      break;

    case "SRCP":
      obj.srcp = space.buffer;
      state++;

      return portSearchStart();
      break;

    case "DSTP":
      obj.dstp = space.buffer;
      state++;

      return new strtok.StringType(1, 'utf-8');
      break;

    case "LF":
      /* Protocol ends in \n */
      if (v !== '\n') {
        parseError();
        return strtok.DONE;
      }

      callback(null, obj);

      return strtok.DONE;

      break;

    default:
      return strtok.DONE;
    }
  });
}

exports.parse = parse
