var express = require('express'),
    expressApp = express(),
    socketio = require('socket.io'),
    http = require('http'),
    server = http.createServer(expressApp),
    uuid = require('node-uuid'),
    rooms = {},
    userIds = {};
