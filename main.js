const letters = Array.from("abcdefghijklmnopqrstuvwxyz");
const successAudio = document.querySelector("#success");
const failAudio = document.querySelector("#fail");
let letters_box = document.querySelector('.letters');
let wrongTries = 0;

game();

function finish(status, word = ''){
	letters_box.style.pointerEvents = 'none';
	let popup = document.createElement('div');
	let playAgainButton = document.createElement('button');
	playAgainButton.textContent = "Play Again";
	playAgainButton.onclick = function() {
		// reload page
		window.location.reload();
	}
	popup.classList.add('pop-up');
	if (status){
		popup.textContent = `Congratulations your number of wrong tries is: ${wrongTries}.`;
	}
	else{
		popup.textContent = `Game over the word is ${word}.`;
	}
	
	popup.appendChild(playAgainButton);
	document.body.appendChild(popup);
}

function getRandomElement(arr){
	return arr[Math.floor(Math.random() * arr.length)];
}

function game(){

	fetch('words.json').then(response => {
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		return response.json();
	})
	.then(WORDS => {

		letters.forEach(letter => {
			let l = document.createElement("div");
			l.classList.add("letter");
			l.innerHTML = letter.toUpperCase();
			letters_box.appendChild(l);
			l.onclick = function() {
				l.classList.add("clicked");
				let found = false;
				let allLetters = lettersGuessContainer.querySelectorAll('span');
				lettersGuess.forEach((ch, index) => {
					if (ch === letter || ch.toLowerCase() === letter){
						allLetters[index].textContent = ch;
						found = true;
					}
				})
				if (!found){
					wrongTries++;
					document.querySelector(`.wrong-${wrongTries}`).style.visibility = 'visible';
					failAudio.play();
				}
				else
					successAudio.play();
				if (wrongTries == 8)
					finish(0, randomValue);
				let finished = true;
				allLetters.forEach((e) =>{
					if (e.textContent === '_'){
						finished = false;
					}
				})
				if (finished)
					finish(1);
			}
		});


		let allKeys = Object.keys(WORDS)
		let randomKey = getRandomElement(allKeys)
		let randomValue = getRandomElement(WORDS[randomKey])


		document.querySelector('.game-info .category span').textContent = randomKey;


		let lettersGuessContainer = document.querySelector('.letters-guess');

		let lettersGuess = Array.from(randomValue);

		lettersGuess.forEach((e) =>{
			let letter = document.createElement('span');
			if (e === ' '){
				letter.textContent = '-';
				letter.className = 'space';
			}
			else{
				letter.textContent = '_';
				letter.className = 'letter-guess'
			}
			lettersGuessContainer.appendChild(letter);
	});
	})
	.catch(error => {
		console.error('There was a problem with the fetch operation:', error);
	});

}