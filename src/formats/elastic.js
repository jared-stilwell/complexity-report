/*globals exports, JSON */
const path = require('path');
const cwd = process.cwd();

'use strict';

exports.format = format;

function format (result) {
    function replacer(key, value) {
      if (typeof value === "boolean" || key === 'identifiers') {
          return String(value);
        }
      return value;
    }

    let formattedResult = '';
    result.reports.forEach( (r,index) => formattedResult += JSON.stringify({index: {_id: index}}) +'\n' + JSON.stringify(r, replacer) + '\n')

    return formattedResult;
}

