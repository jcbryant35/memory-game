let cardArray = [
	{
		name: 'Card A',
		img: `tree.png`,
	},
	{
		name: 'Card A',
		img: `tree.png`,
	},
	{
		name: 'Card B',
		img: `mask.png`,
	},
	{
		name: 'Card B',
		img: `mask.png`,
	},
	{
		name: 'Card C',
		img: `jester.jpg`,
	},
	{
		name: 'Card C',
		img: `jester.jpg`,
	},
	{
		name: 'Card D',
		img: `hat.png`,
	},
	{
		name: 'Card D',
		img: `hat.png`,
	},
	{
		name: 'Card E',
		img: `fleur_de_lis.png`,
	},
	{
		name: 'Card E',
		img: `fleur_de_lis.png`,
	},
	{
		name: 'Card F',
		img: `crown.png`,
	},
	{
		name: 'Card F',
		img: `crown.png`,
	}
];

let gameBoard = document.getElementById('gameBoard');
let selectedCards = [];
let selectedCardsID = [];
let cardsMatched = [];

// Shuffle cards
cardArray.sort(() => 0.5 - Math.random())

// Populate the game board
function populateGameBoard() {
    for(let i = 0; i < cardArray.length; i++) {

        let card = document.createElement('div');
        let cardBack = document.createElement('div');
        let cardFront = document.createElement('div');
        let cardImg = document.createElement('img');
        let cardBackImg = document.createElement('img');
    
        card.className = 'card';
        cardBack.className = 'card-back';
        cardFront.className = 'card-front';
        cardImg.className = 'image';
        cardBackImg.className = 'card-back-image';

        card.setAttribute('data-id', i);
        cardImg.setAttribute('src', cardArray[i].img);
        cardBackImg.setAttribute('src', 'card_back.jpg');
    
        cardFront.appendChild(cardImg);
        cardBack.appendChild(cardBackImg);
        card.appendChild(cardBack);
        card.appendChild(cardFront);
        gameBoard.appendChild(card);
    
        card.addEventListener('click', flipCard);  

        //board disabled until start game is clicked
        gameBoard.style.pointerEvents = 'none';
    }
};
window.onload = populateGameBoard();


// Flip the cards
let isFlipped = false;
let firstCard, secondCard;

function flipCard() {
    let cardID = this.getAttribute('data-id');

    if(this ===  firstCard) return;

    this.classList.add('flip');

    if(!isFlipped) {
        isFlipped = true;
        firstCard = this;
        selectedCards.push(cardArray[cardID].name);

        return;
    }

    secondCard = this;

    console.log(firstCard, secondCard)

    selectedCards.push(cardArray[cardID].name);
    selectedCardsID.push(cardID); 
    
    checkMatch();
};

// Check for matches
function checkMatch() {
    let len = selectedCards.length;
    let cardOne = selectedCards[0];
    let cardTwo = selectedCards[1];
	
    //only 2 cards can be clicked at a time until resolved with match or no match
    if(len === 2) {
        gameBoard.style.pointerEvents = 'none';    
    }
	
    //if matches are found
    if(len === 2 && cardOne === cardTwo) {

        // add to number of matches box & attempts box
		cardsMatched.push(len);
		document.getElementById('match').innerHTML = cardsMatched.length;
		document.getElementById('attempt').innerHTML = selectedCardsID.length * 2 / 2;


        setTimeout(() => {

            playMatchedSound();

            firstCard.removeEventListener('click', flipCard);
            secondCard.removeEventListener('click', flipCard);  
            
            resetVariables();
		
	    //make cards clickable again	
            gameBoard.style.pointerEvents = 'auto';

        }, 400);

        selectedCards = [];
    } 
    
    //if no matches are found
    if(len == 2 && cardOne !== cardTwo) {
        
        setTimeout(() => {

            playNoMatchSound();

        }, 500);

        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');

            resetVariables();
		
            //make cards clickable again
            gameBoard.style.pointerEvents = 'none';

        }, 1000);

		// add to number of attempts box
		document.getElementById('attempt').innerHTML = selectedCardsID.length *2 / 2;

        selectedCards = [];
    }
};

// Reset the variables
function resetVariables() {
    [isFlipped] = [null];
    [firstCard, secondCard] = [null, null];
};

// reset game
const resetBtn = document.querySelector('#reset');
resetBtn.addEventListener('click', resetGame);

function resetGame() {
	window.location.reload();
};

// start game
const startBtn = document.getElementById('start');
startBtn.addEventListener('click', startGame);

function startGame() {

	//play background music
	playBackgroundMusic()

	//make cards clickable
	document.getElementById('gameBoard').style.pointerEvents = 'auto';

	//disable start button
	document.getElementById('start').disabled = true;
	document.getElementById('start').style.color = 'gray';

	//timer
	let displayTime = document.getElementById('time');
	let startTime = 30;

	let time = setInterval(() => {
		displayTime.innerHTML = startTime--;

		if(startTime <= 0 - 1) {
			clearInterval(time);

			setTimeout(() => {
				gameOver();
			}, 300);
		};

		if(startTime <= 10 - 1) {
			displayTime.style.color = 'tomato';
		}

	}, 1000);

};

//game over modal
function gameOver() {

	let allCards = document.querySelectorAll('.card');
	for(let c = 0; c < allCards.length; c++) {
		allCards[c].style.display = 'none';
	}

	let endModal = document.createElement('div');
	endModal.setAttribute('id', 'endModal');
	document.body.appendChild(endModal);

	let heading = document.createElement('h1');
	heading.setAttribute('id', 'endModalHeading');
	heading.style.textAlign = 'center';
	endModal.appendChild(heading);
	heading.innerHTML = 'GAME OVER'

	//display a different message if all matches were found
	if(cardsMatched.length === 6) {
		heading.innerHTML = `You Won! <br> <h6>All matches were found!</h6>`
		document.getElementById('timer').style.display = 'none';
	}

	let button = document.createElement('button');
	button.setAttribute('id', 'restartBtn');
	button.addEventListener('click', playAgain);
	button.innerHTML = '&#8634; Play Again';
	endModal.appendChild(button);

	//disable start and reset buttons
	document.getElementById('start').disabled = true;
	document.getElementById('reset').disabled = true;

};


//play again button
function playAgain() {
	window.location.reload();
}



//background music
function playBackgroundMusic() {
  var audio = new Audio('Monkeys-Spinning-Monkeys-[AudioTrimmer.com] (1).mp3');
  audio.play();

  //turn off background music
  let muteBtn = document.getElementById('muteSound');
  let mutedIcon = document.querySelector('.fa-volume-mute');
  let unmutedIcon = document.querySelector('.fa-volume-up');
  muteBtn.addEventListener('click', _=> {
  	audio.pause();
  	muteBtn.style.opacity = '0.8';
    unmutedIcon.style.display = 'none';
    mutedIcon.style.display = 'block';
  });

  	/*Monkeys Spinning Monkeys Kevin MacLeod (incompetech.com)
	Licensed under Creative Commons: By Attribution 3.0 License
	http://creativecommons.org/licenses/by/3.0/
	Music promoted by https://www.chosic.com/ 
	*/
};

//matched sound
function playMatchedSound() {
	var matchedSound = new Audio('mixkit-achievement-bell-600 (online-audio-converter.com).mp3');
	matchedSound.play();
};

//not matched sound
function playNoMatchSound() {
	var notMatchedSound = new Audio('mixkit-apartment-buzzer-bell-press-932 (online-audio-converter.com).mp3');
	notMatchedSound.play();
}
