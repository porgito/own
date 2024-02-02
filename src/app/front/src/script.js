
document.addEventListener("DOMContentLoaded", function () {
    const paddle1 = document.getElementById("paddle1");
    const paddle2 = document.getElementById("paddle2");
    const ball = document.querySelector(".ball");
    const playButton = document.querySelector(".btn-start")
    const scoreDisplay1 = document.getElementById("player1-score");
    const scoreDisplay2 = document.getElementById("player2-score");

    const gameContainer = document.querySelector(".game-container");

    const keysPressed = {
        ArrowUp: false,
        ArrowDown: false,
        w: false,
        s: false,
    };
	let paddle1Y = 170;
    let paddle2Y = 170;
    let ballX = 300;
    let ballY = 200;
    let ballSpeedX = 2;
    let ballSpeedY = 2;
    let player1Score = 0;
    let player2Score = 0;
    let gameActive = true;

    function updateScore() {
		document.getElementById("player1-score").innerText = player1Score;
		document.getElementById("player2-score").innerText = player2Score;
	}

	function update() {
        if (!gameActive) return;
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        handleBallCollision();
        updateBallPosition();
		updatePaddlePositions();
    }

    // Fonction de gestion des collisions de la balle
    function handleBallCollision() {
        if (ballY < 5 || ballY > 395) ballSpeedY = -ballSpeedY;

        if (ballX < 0) scorePoint(2);
        else if (ballX > 600) scorePoint(1);

        if (isCollisionWithPaddle()) ballSpeedX = -ballSpeedX;
    }

    // Fonction de détection des collisions avec les palettes
    function isCollisionWithPaddle() {
        const paddle1Collision = ballX < 25 && ballX > 15 && ballY > paddle1Y && ballY < paddle1Y + 80;
        const paddle2Collision = ballX > 575 && ballX < 585 && ballY > paddle2Y && ballY < paddle2Y + 80;
        return paddle1Collision || paddle2Collision;
    }

    // Fonction de mise à jour de la position de la balle
    function updateBallPosition() {
        ball.style.left = ballX + "px";
        ball.style.top = ballY + "px";
    }

    // Fonction de marquage de points
    function scorePoint(player) {
        (player === 1) ? player1Score++ : player2Score++;

		updateScore();
        (player1Score === 5 || player2Score === 5) ? endGame() : reset();
    }

    // Fonction de réinitialisation de la balle
    function resetBall() {
        ballX = 300;
        ballY = 200;
        ballSpeedX = 0;
        ballSpeedY = 0;
        ball.style.display = "block";

		let counter = 3;
		const counterInterval = setInterval(function () {
			document.getElementById("countdown").innerText = counter;
			document.getElementById("countdown").style.display = "block";
			counter--;
			if (counter < 0) {
				clearInterval(counterInterval);
				document.getElementById("countdown").style.display = "none";
				ballSpeedX = 2;
				ballSpeedY = 2;
			}
		}, 1000);
}


    function reset() {
        resetBall();

       // paddle1Y = (400 - 80) / 2;
       // paddle2Y = (400 - 80) / 2;

      //  paddle1.style.top = paddle1Y + "px";
      //  paddle2.style.top = paddle2Y + "px";
    }

    function endGame() {
        ballSpeedX = 0;
        ballSpeedY = 0;
        ball.style.display = "none";
        if (player1Score > player2Score) {
            document.getElementById("winner").innerText = "Player 1 wins!";
        }
        else {
            document.getElementById("winner").innerText = "Player 2 wins!";
        }
       // saveScore(player1Score, player2Score);
        gameActive = false;
    }

	function gameLoop() {
        update();
        requestAnimationFrame(gameLoop);
    }
  
	document.addEventListener("keydown", function (event) {
		handleKeyPress(event.key, true);
	});
	
	document.addEventListener("keyup", function (event) {
		handleKeyPress(event.key, false);
	});
	
	function handleKeyPress(key, isPressed) {
		switch (key) {
			case "ArrowUp":
				keysPressed.ArrowUp = isPressed;
				break;
			case "ArrowDown":
				keysPressed.ArrowDown = isPressed;
				break;
			case "w":
				keysPressed.w = isPressed;
				break;
			case "s":
				keysPressed.s = isPressed;
				break;
		}
	}
	
	function updatePaddlePositions() {
		if (keysPressed.ArrowUp) {
			paddle2Y -= 3;
		}
		if (keysPressed.ArrowDown) {
			paddle2Y += 3;
		}
		if (keysPressed.w) {
			paddle1Y -= 3;
		}
		if (keysPressed.s) {
			paddle1Y += 3;
		}
	
		paddle1Y = Math.max(2, Math.min(paddle1Y, 338));
		paddle2Y = Math.max(2, Math.min(paddle2Y, 338));
	
		paddle1.style.top = paddle1Y + "px";
		paddle2.style.top = paddle2Y + "px";
	}
    // const saveScore = (player1Score, player2Score) => {
    //     // Obtenez le jeton CSRF à partir des cookies
    //     const csrfToken = document.cookie
    //         .split('; ')
    //         .find(row => row.startsWith('csrftoken='))
    //         .split('=')[1];
    
    //     // Données à envoyer dans la requête POST
    //     const data = {
    //         player1_score: player1Score,
    //         player2_score: player2Score,
    //     };
    
    //     // Requête Axios
    //     axios.post('/save_score/', data, {
    //         headers: {
    //             'X-CSRFToken': csrfToken,
    //         },
    //     })
    //     .then(response => {
    //         console.log(response.data);
    //         // Gérez la réponse en fonction de vos besoins
    //         addScoreToHistory(player1Score, player2Score);
    //     })
    //     .catch(error => {
    //         console.error(error);
    //         // Gérez les erreurs en fonction de vos besoins
    //     });
    // };

    // function addScoreToHistory(player1Score, player2Score) {
    //     const scoreList = document.getElementById('score-list');
    //     const newScoreItem = document.createElement('li');
    //     newScoreItem.textContent = `Player 1: ${player1Score}, Player 2: ${player2Score}`;
    //     scoreList.appendChild(newScoreItem);
    
    //     // Stockez également localement pour les futures actualisations de la page
    //     const scoreHistory = JSON.parse(localStorage.getItem('scoreHistory')) || [];
    //     scoreHistory.push({ player1Score, player2Score });
    //     localStorage.setItem('scoreHistory', JSON.stringify(scoreHistory));
    // }

    // function loadScoreHistory() {
    //     // Requête AJAX pour récupérer l'historique des scores depuis la base de données
    //     axios.get('/get_score_history/')
    //         .then(response => {
    //             const scoreList = document.getElementById('score-list');
    
    //             // Afficher les scores récupérés dans l'historique
    //             response.data.forEach(score => {
    //                 const newScoreItem = document.createElement('li');
    //                 newScoreItem.textContent = `Player 1: ${score.player1_score}, Player 2: ${score.player2_score}`;
    //                 scoreList.appendChild(newScoreItem);
    //             });
    //         })
    //         .catch(error => {
    //             console.error('Erreur lors du chargement de l\'historique des scores:', error);
    //         });
    // }

    // window.onload = loadScoreHistory;
    document.addEventListener('click', function (event) {
        if (event.target.matches('.btn-start')) {
            startGame();
        }
    });

    function startGame() {
        gameActive = true; // Le jeu est actif
        gameLoop(); // Démarrage de la boucle de jeu
        ball.style.display = "block"; // Affichage de la balle
        playButton.style.display = "none";
    }
});




