// just a sample event emitter 


/*
How Event Emitters Work
Event emitters allow you to create objects that can emit events and have listeners respond to those events. This enables asynchronous, event-driven programming which is central to Node.js architecture.


Key Methods
Adding listeners:

on(event, listener) - Adds a listener that will be called every time the event is emitted
once(event, listener) - Adds a listener that will be called only once, then removed
addListener(event, listener) - Alias for on()

Emitting events:

emit(event, ...args) - Emits an event with optional arguments

Removing listeners:

removeListener(event, listener) - Removes a specific listener
removeAllListeners(event) - Removes all listeners for an event
off(event, listener) - Alias for removeListener()

Common Use Cases
Event emitters are used throughout Node.js core modules:

HTTP servers emit 'request' events when clients connect
File streams emit 'data', 'end', and 'error' events
Process object emits 'exit' and 'uncaughtException' events
Custom applications for decoupling components

*/

const EventEmitter = require('events');

class MyServer extends EventEmitter {
  start() {
    // Simulate server starting
    setTimeout(() => {
      this.emit('started', { port: 3000 });
    }, 1000);
  }
  
  handleRequest(req) {
    setTimeout(() => {
        this.emit('request', req);
    }, 2000);
  }
}

const server = new MyServer();

server.on('started', (info) => {
  console.log(`Server started on port ${info.port}`);
});

server.on('request', (req) => {
  console.log('Handling request:', req);
});

server.start();
server.handleRequest("onePiece")