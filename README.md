# Live Auction
An WebRTC Proof-of-concept project in Angular 4 CLI

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

## Setup of project

- Preparation:

```bash 
git clone https://github.com/dedalusmax/live-auction.git
npm install @angular/cli -g
ng new live-auction --minimal --routing --style scss -v 
cd live-auction
ng serve
```

