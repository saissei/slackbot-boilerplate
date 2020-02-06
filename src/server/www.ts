#!/usr/bin/env node

/**
 * Module dependencies.
 */
import { default as app } from './App';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require('debug')('express-boilerplate-api:server');
import * as http from 'http';

/**
 * Get port from environment and store in Express.
 */

// eslint-disable-next-line @typescript-eslint/no-use-before-define
const port: string = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
// eslint-disable-next-line @typescript-eslint/no-use-before-define
server.on('error', onError);
// eslint-disable-next-line @typescript-eslint/no-use-before-define
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any
function normalizePort(val: any) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any
function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bind: any = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES': {
      console.error(bind + ' requires elevated privileges');
      return process.exit(1);
    }
    case 'EADDRINUSE':{
      console.error(bind + ' is already in use');
      return process.exit(1);
    }
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any
function onListening() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addr: any = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
