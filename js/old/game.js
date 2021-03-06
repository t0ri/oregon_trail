
var OregonH = OregonH || {};


OregonH.Game = {};

//initiate the game
OregonH.Game.init = function(){

  //reference ui
  this.ui = OregonH.UI;

  //reference event manager
  this.eventManager = OregonH.Event;

  //setup caravan
  this.caravan = OregonH.Caravan;
  this.caravan = new Caravan(0, 0, 30, 80, 2, 300, 2);

  //pass references
  this.caravan.ui = this.ui;
  this.caravan.eventManager = this.eventManager;

  this.ui.game = this;
  this.ui.caravan = this.caravan;
  this.ui.eventManager = this.eventManager;

  this.eventManager.game = this;
  this.eventManager.caravan = this.caravan;
  this.eventManager.ui = this.ui;

  //begin adventure!
  this.startJourney();
};

//start the journey and time starts running
OregonH.Game.startJourney = function() {
  this.gameActive = true;
  this.previousTime = null;
  this.ui.notify('A great adventure begins', 'positive');

  this.step();
};

//game loop
OregonH.Game.step = function(timestamp) {

  //starting, setup the previous time for the first time
  if(!this.previousTime){
    this.previousTime = timestamp;
    this.updateGame();
  }

  //time difference
  let progress = timestamp - this.previousTime;

  //game update
  if(progress >= OregonH.GAME_SPEED) {
    this.previousTime = timestamp;
    this.updateGame();
  }

  //we use "bind" so that we can refer to the context "this" inside of the step method
  if(this.gameActive) window.requestAnimationFrame(this.step.bind(this));
};

//update game stats
OregonH.Game.updateGame = function() {
  //day update
  this.caravan.day += OregonH.DAY_PER_STEP;

  //food consumption
  this.caravan.consumeFood();

  //game over no food
  if(this.caravan.food === 0) {
    this.ui.notify('Your caravan starved to death', 'negative');
    this.gameActive = false;
    return;
  }

  //update weight
  this.caravan.updateWeight();

  //update progress
  this.caravan.updateDistance();

  //show stats
  this.ui.refreshStats();

  //check if everyone died
  if(this.caravan.crew <= 0) {
    this.caravan.crew = 0;
    this.ui.notify('Everyone died', 'negative');
    this.gameActive = false;
    return;
  }

  //check win game
  if(this.caravan.distance >= OregonH.FINAL_DISTANCE) {
    this.ui.notify('You have returned home!', 'positive');
    this.gameActive = false;
    return;
  }

  //random events
    if(Math.random() <= OregonH.EVENT_PROBABILITY) {
      this.eventManager.generateEvent();
    }
};

//pause the journey
OregonH.Game.pauseJourney = function() {
  this.gameActive = false;
};

//resume the journey
OregonH.Game.resumeJourney = function() {
  this.gameActive = true;
  this.step();
};


//init game
OregonH.Game.init();
