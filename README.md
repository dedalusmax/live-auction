# Live Auction
A WebRTC Proof-of-concept project developed in Angular 4 CLI, using Node.js and socket.io as a signalling server.

## The Concept

What do we need to achieve? Well, we need a sort of a “switchboard” for people talking to each other in the context of an auction platform. 

The typical setup for WebRTC for two people to talk to each other is in the below diagram, where you have some sort of signaling via the web server and audio streams directly. 

![alt text](https://github.com/dedalusmax/live-auction/blob/master/webrtc1.jpg)

Now, we need to make a solution in the context of *“auctions”* where you have **one auction master** and **many buyers**. In a very short summary the system boils to this: 

> the auction master starts an auction in his website in his browser and buyers can see the price dropping on in there browsers and can buy that lot. 

For example, the auction master offers 1000 kilos of fish, and the buyers (fish shops or so) see the price dropping, and, the first one pressing a button wins the lot. This is how traditional auctions usually work, but, then a second step is usually done in these systems.

> The second step is that the auction master can *“talk”* to the buyer that just bought the lot, and this is done to have the opportunity to sell for example more than one lot at the same price. 

For example, you press the buy button and have the first lot of 1000kg fish and then you are in communication with the auction master and you can say *“I want another 2 boxes of 1000kg for the same price, but shipped in boxes of 500kg”*. The auction master fills this in his management system and the next lot is put up for auction. So you have the master and the buyers, and, the master is very shortly connected to one of the buyers after the sale, then disconnects, sells another lot and then connects to another buyer, and in while selling she is temporarily disconnected.

![alt text](https://github.com/dedalusmax/live-auction/blob/master/webrtc2.jpg)

The thing is, that it goes really fast. So a sale is only a couple of seconds, and the time they talk is only a couple of seconds because these people do this every day, so the price at which the auction starts is almost the right price (a little higher), so people buy really quickly, and the auction masters know the buyers so they usually something short like “2 extra split in 6” and then things move on because else it takes to much time (auction is with about hundred people, with hundreds of lots, so there is no time for a friendly chat… it must al go very fast). 

How can we best achieve this? Setting up the channels each time from scratch would take too long, but, since we must work in the browser and must work with WebRTC, audio streams peer to peer and moving that to the server would be hard (I think again, because it is research)? Is it possible to connect all these buyers to the auction master’s browser and build this kind of switching in the browser with javascript? 

Also, we’ll need to see which browser are capable of doing this and on which platforms. Maybe we can invent something that uses the audio capture from WebRTC in the browser, but then uses something like websockets to the server and we can still do the switching overthere? 

## Creating a project from scratch

### Creating project stub and client-side project in Angular:

```bash 
git clone https://github.com/dedalusmax/live-auction.git
npm install @angular/cli -g
ng new live-auction --minimal --routing --style scss -v 
npm install ng-socket-io --save
cd live-auction
ng serve
```

- open .angular-cli.json and change *inlineStyle* and *inlineTemplate* for *component* in **false**
- clean the **app.component.ts** of HTML content except for router-outlet

## Creating socket.io server-side project:

> https://github.com/bougarfaoui/ng-socket-io

> https://github.com/bougarfaoui/ng-socket-io/tree/master/examples/chat-app

- open another terminal window 
- create *server* folder
- add **app.js**:

```javascript
var http = require('http');
var path = require('path');
var express = require('express');
var app = express();

app.use(express.static(path.join(__dirname, '../src/dist')));

app.get('*', function(req, res, next) {
  res.sendFile(__dirname+"../src/dist/index.html");
});

var server = http.createServer(app);
var io = require('socket.io')(server);
io.on('connection', function (socket) {
    socket.emit('msg', { msg: 'Welcome bro!' });
    socket.on('msg',function(msg){
    	socket.emit('msg', { msg: "you sent : "+msg });
    })
});

server.listen(8988);
```

- add .gitignore
- add **package.json**:

```json
{
    "name": "live-auction-socket-io",
    "version": "0.0.0",
    "private": true,
    "scripts": {
      "start": "node ./bin/www"
    },
    "dependencies": {
      "body-parser": "~1.15.1",
      "cookie-parser": "~1.4.3",
      "debug": "~2.2.0",
      "express": "~4.13.4",
      "jade": "~1.11.0",
      "morgan": "~1.7.0",
      "serve-favicon": "~2.3.0",
      "socket.io": "^1.7.3"
    }
  }
```

```bash
npm install
```

### Connect with the socket.io on the client

in the **app.module.ts**:

- import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
- const config: SocketIoConfig = { url: 'http://localhost:8988', options: {} };
- SocketIoModule.forRoot(config) 

- open new terminal window
- create **signalling.service.ts**: 

```bash
ng g service shared/services/signalling -m app
```

implement signalling service:

- import { Observable } from 'rxjs/Observable'
- import 'rxjs/add/operator/map'; 
- import { Socket } from 'ng-socket-io';
- constructor(private socket: Socket) {}
- implement incoming and outgoing messages:

```typescript
    getMessage() {
        return this.socket
            .fromEvent<any>("msg")
            .map(data => data.msg);
    }

    sendMessage(msg: string) {
        this.socket
            .emit("msg", msg);
    }
```

implement chat in **app.component.ts** for testing the signalling mechanism:

- add the following template:

```html
<div>
    <input type="text" #msgInput name="" value="">
    <button (click)="sendMsg(msgInput.value)">Send</button>
    <br>
    <p>{{msg}}  </p>
</div>
```

- import { SignallingService } from './shared/services/signalling.service';
- providers: [SignallingService]
- fill out the class with the following code:

```typescript
  private msg: string;

  constructor(private signalling: SignallingService) { }

  ngOnInit() {
    this.signalling.getMessage().subscribe(msg => {
      this.msg = "1st " + msg;
    });
  }

  sendMsg(msg) {
    this.signalling.sendMessage(msg);
  }
```

- browse to http://localhost:4200/ 
- test the app

