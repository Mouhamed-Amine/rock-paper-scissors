'use script'

//Rules
const rules = document.querySelector('.rules-btn');
let lobbyMusic;
// Function to show the popup
function showPopup() {
    document.getElementById("popup").style.display = "block";
}
// Function to close the popup
function closePopup() {
    document.getElementById("popup").style.display = "none";
}
rules.addEventListener('click',(e)=>{
    e.preventDefault();
    showPopup()
});

function getRandomInt(max){
    return Math.floor(Math.random() * max)
}


function loadGame (){
    lobbyMusic = new Audio('Hollow Knight OST - Hollow Knight.mp3');
    lobbyMusic.loop = true;
    lobbyMusic.play();
    const roundsPlayed = localStorage.getItem('roundsPlayed') || 10 ;
    playerScore = parseInt(localStorage.getItem('playerScore')) || 0;
    computerScore = parseInt(localStorage.getItem('computerScore')) || 0;

    document.querySelector('.round').innerText=`${roundsPlayed} Rounds`
    // Update the display with the retrieved scores
    document.querySelector('.p-count').innerText = ` ${playerScore} `;
    document.querySelector('.c-count').innerText = ` ${computerScore}`;
    
}

window.onload= loadGame;

const game = () => {
    let playerScore = parseInt(localStorage.getItem('playerScore')) || 0;
    let computerScore = parseInt(localStorage.getItem('computerScore')) || 0;

    function playGame(event) {
        // Stop the lobby music when the game starts
        if (lobbyMusic) {
            lobbyMusic.pause();
            lobbyMusic.currentTime = 0; // Reset music time to the beginning
        }

        const computerOptions = ['rock', 'paper', 'scissors'];
        // Get the clicked button element
        let clickedButton = event.currentTarget;
        
        clickedButton.classList.add('picker');

        // Get the alt attribute from the clicked button's img element (player's choice)
        let playerChoice = clickedButton.querySelector('img').getAttribute('alt');

        // Randomly select the computer's choice
        const choiceNumber = Math.floor(Math.random() * 3);
        const computerChoice = computerOptions[choiceNumber];

     // Define border colors for each choice
        let borderColor = '';
        if (computerChoice === 'rock') {
            borderColor = 'hsl(349, 71%, 52%)';
        } else if (computerChoice === 'scissors') {
            borderColor = 'hsl(39, 89%, 49%)';
        } else if (computerChoice === 'paper') {
            borderColor = 'hsl(230, 89%, 62%)';
        }

        // Define corresponding HTML for each computer choice
        const computerHTML = `
            <button class="icon" data-index="${choiceNumber}" style="border: 10px solid ${borderColor};">
                <img class="${computerChoice}" src="images/icon-${computerChoice}.svg" alt="${computerChoice}">
            </button>
        `;
        
       
        // Set the innerHTML with the outerHTML of the clicked button and the computer's choice
        const play = document.querySelector('.first');
        play.innerHTML = `
        <div class="pick_phase">
            <!-- First Picker (Player's Choice) -->
            <div class="first-picker">
                <h3>YOU PICKED</h3> 
                <div class="spot">${clickedButton.outerHTML}</div> 
            </div>

            <!-- Second Picker (Computer's Choice) -->
            <div class="second-picker">
                <h3>THE HOUSE PICKED</h3> 
                <div class="spot ">${computerHTML}</div>
            </div>
        </div>
        <!-- Headline and Score Section in the middle -->
        <div class="middle-section">
            <h1 class="result">Waiting for result...</h1>
            <div>
            <button class="retry">Play again</button>
            </div>
        </div>
        `;

        document.querySelector('.retry').addEventListener('click',playAgain);
        winner(playerChoice, computerChoice);
    }

    const buttons = document.querySelectorAll('.icon');
    buttons.forEach(button => {
        button.addEventListener('click', playGame);
    });

    function winner(player, computer) {
        // Select the result and scoreboards from the middle section
        const result = document.querySelector('.result');
        const playerScoreBoard = document.querySelector('.p-count');
        const computerScoreBoard = document.querySelector('.c-count');
        
    
        
        // Determine the outcome
        if (player === computer) {
            result.textContent = 'It\'s a Tie!';

            document.querySelector('.fade').style.display='none'
        } else if ((player === 'rock' && computer === 'scissors') ||
                   (player === 'scissors' && computer === 'paper') ||
                   (player === 'paper' && computer === 'rock')) {
            result.textContent = 'YOU WON!';
            document.querySelector('.fade').style.display='none'
            document.querySelector('.first-picker .spot button').classList.add('shadow');
            playerScore++;
            localStorage.setItem('playerScore',playerScore);
            playerScoreBoard.textContent = playerScore; // Update player score
        } else {
            result.textContent = 'YOU LOST!';
            document.querySelector('.fade').style.display='none'
            document.querySelector('.second-picker .spot button').classList.add('shadow');
            computerScore++;
            localStorage.setItem('computerScore',computerScore);
            computerScoreBoard.textContent = computerScore; // Update computer score
        }

        
    }

    
}


game();


function playAgain() {
    // Get roundsPlayed, playerScore, and computerScore from localStorage
    let roundsPlayed = localStorage.getItem('roundsPlayed');
    let pScore = localStorage.getItem('playerScore');
    let cScore = localStorage.getItem('computerScore');
    let Lost = new Audio('videoplayback.m4a');
    let Win = new Audio('Super Mario Bros. Music - Level Complete.mp3');


    // Initialize roundsPlayed if not already set in localStorage
    if (!roundsPlayed) {
        roundsPlayed = 10; // Start with 10 rounds if undefined
    } else {
        roundsPlayed = parseInt(roundsPlayed);
    }

    // Decrement rounds only if it's greater than 0
    if (roundsPlayed > 0) {
        roundsPlayed--;
        localStorage.setItem('roundsPlayed', roundsPlayed);  // Save the updated rounds count
    }

    // Update the displayed rounds and scores
    document.querySelector('.round').innerText = `${roundsPlayed} Rounds Left`;
    document.querySelector('.p-count').innerText = `${pScore} `;
    document.querySelector('.c-count').innerText = `${cScore} `;

    // When rounds hit zero, show the popup, play music, and restart the game
    if (roundsPlayed === 0) {
        // Show SweetAlert popup
        if (pScore>cScore){
            Win.play();
        Swal.fire({
            title: 'You Won!',
            text: 'You have completed all rounds!',
            icon: 'Success',
            imageAlt: 'Custom image',
        }).then(() => { 
            // Delay to allow popup and music to display before resetting
            setTimeout(function () {
                localStorage.clear();  // Clear localStorage
                location.reload();      // Reload the page to restart the game
            }, 3000);  // 3-second delay before reload (adjust as needed)
        }); 
    }else{
        Lost.play();
        Swal.fire({
            title: 'You Lost!',
            text: 'You have completed all rounds!',
            icon: 'info',
            imageUrl: './images/gameOver.png',
            imageWidth: 100,
            imageHeight: 100,
            imageAlt: 'Custom image',
        }).then(() => { 
            // Delay to allow popup and music to display before resetting
            setTimeout(function () {
                localStorage.clear();  // Clear localStorage
                location.reload();      // Reload the page to restart the game
            }, 3000);  // 3-second delay before reload (adjust as needed)
        }); 
    }


    } else {
        // If rounds are not zero, just reload to go back to the game
        location.reload();
    }
}




// Optional: Close the popup if user clicks outside of it
window.onclick = function(event) {
    var popup = document.getElementById("popup");
    if (event.target == popup) {
        popup.style.display = "none";
    }
}


