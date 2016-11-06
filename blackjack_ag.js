// Card constractore
function Card(point, suit){
    this.point = point;
    this.suit = suit;
}


Card.prototype.getImgUrl = function() {
    var pointOfTheCard = this.point;
    var suitType = this.suit;
    if (this.point === 11) {
        pointOfTheCard = 'jack';
    }
    else if (this.point === 12) {
        pointOfTheCard = 'queen';
    }
    else if (this.point === 13) {
        pointOfTheCard = 'king';
    }
    else if (this.point === 1) {
        pointOfTheCard = 'ace';
    }
  return 'images/' + pointOfTheCard + '_of_' + suitType + '.png';
};


// Hand constractore
function Hand(){
    this.cardsInHand = [];
}

Hand.prototype.addCard = function(card) {
    return this.cardsInHand.push(card);
};

Hand.prototype.getPoints = function(){
    cards = this.cardsInHand.slice(0);
    cards.sort(function(a,b) {
        return b.point - a.point;
    });
    var sum = cards.reduce(function(a,b) {
        if(b.point >10 && b.suit != 'ace'){
            b.point = 10;
        }
        if(b.point === 1 && a < 11){
            b.point = 11;
        }
    return a + b.point;
    }, 0);
    return sum;
};

Hand.prototype.deal = function(whichDeck, whichHand){
    this.addCard(whichDeck.draw());
    $(whichHand).append('<img class="card" src="' + (this.cardsInHand[0].getImgUrl()) + '"/>');
    this.addCard(whichDeck.draw());
    $(whichHand).append('<img class="card" src="' + (this.cardsInHand[1].getImgUrl()) + '" />');
};

Hand.prototype.hitMe = function(whichDeck, whichHand, whichPoints){
    this.addCard(whichDeck.draw());
    var handPoints = this.getPoints();
    var counter = this.cardsInHand.length-1;

    if(handPoints <=20){
        $(whichHand).append('<img class="card" src="' + (this.cardsInHand[counter].getImgUrl()) + '"/>');
        $(whichPoints).text(handPoints);
    }
    else if(handPoints === 21) {
        $(whichHand).append('<img class="card" src="' + (this.cardsInHand[counter].getImgUrl()) + '"/>');
        $(whichPoints).text('BlackJack!!');
        $('#hit-button').prop('disabled', true);
    }
    else if(handPoints >=22){
        $(whichHand).append('<img class="card" src="' + (this.cardsInHand[counter].getImgUrl()) + '"/>');
        $(whichPoints).text('Busted!');
        $('#hit-button').prop('disabled', true);
    }
};

function checkWin(playerHand, dealerHand){
    if(playerHand.getPoints() > dealerHand.getPoints() && playerHand.getPoints() <= 21){
        $('#player-points').text('You win!');
    }
    else{
        $('#dealer-points').text('Dealer win!');
    }
}



// Deck constractore
function Deck(){
    this.deck = [];
    var suits = ['hearts', 'diamonds', 'spades', 'clubs'];
    for(var point=1; point<=13; point++){
        for(var j= 0; j<=3; j++){
            this.deck.push(new Card(point, suits[j]));
        }
    }
}

Deck.prototype.draw = function(){
    function randomNum(min, max) {
        return Math.random() * (max - min) + min;
    }
    drawFromDeck = this.deck.slice(0);
    var randCard = Math.floor(randomNum(0, this.deck.length -1));
    this.deck.splice(randCard, 1);
    return drawFromDeck[randCard];
};

Deck.prototype.numCardsLeft = function() {
    return this.deck.length;
};


// jQuery.fn.extend({
//     disable: function(state) {
//         return this.each(function() {
//             this.disabled = state;
//         });
//     }
// });


$(document).ready(function() {
    var deck = new Deck();
    var playerHand = new Hand();
    var dealerHand = new Hand();
    var dealt = true;

    $('#deal-button').click(function() {
        playerHand.cardsInHand.length = 0;
        dealerHand.cardsInHand.length = 0;
        if(dealt === true){
            $('#player-hand').html();
            $('#dealer-hand').html();
            $('#player-points').html();
            $('#dealer-points').html();

            playerHand.deal(deck, '#player-hand');
            dealerHand.deal(deck, '#dealer-hand');
            dealt = false;
        }
        else{
            $('#deal-button').prop('disabled', true);
        }
    });

    $('#hit-button').click(function() {
        playerHand.hitMe(deck, '#player-hand', '#player-points');
        dealerHand.hitMe(deck, '#dealer-hand', '#dealer-points');
    });

    $('#stand-button').click(function() {
        checkWin(playerHand, dealerHand);
        $('#hit-button').prop('disabled', true);
    });


    // $('#strat-button').click(function() {
    //     if(){
    //
    //     }
    // });

});
