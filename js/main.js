// Module to display gameboard
const Gameboard = (function () {

  // Positions on the board that equal a win if taken up by one player
  const _winningPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8]
  ];

  // A tally of X's and O's played that are a part of _winningPatterns
  let _tallyX = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
  ];
  let _tallyO = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
  ];

  // Starts the game with Player 1 as "X"
  let playerTurn = 'one';
  let _marker = 'X';

  // Empty gameboard to start
  let gameboardArray = [' ', ' ', ' ',
    ' ', ' ', ' ',
    ' ', ' ', ' '
  ];

  // Result to be a win by Player 1, Player 2, or a tie
  let result = null;

  // Refresh page
  const refreshBtn = document.getElementById('reset-btn');
  refreshBtn.addEventListener('click', function () {
    location.reload()
  });

  // Variable for each square and click event
  const _squares = document.querySelectorAll('.square');
  _squares.forEach(square => square.addEventListener('click', addPiece));

  // Variable to check if game is 1 or 2 players
  const playerTwoLabel = document.getElementById('player-two');

  const aiChoice = function () {
    function aiFunc() {
      while (playerTurn === 'two') {
        let randomPosition = Math.floor(Math.random() * Math.floor(_squares.length));
        if (_squares[randomPosition].innerHTML === '') {
          _squares[randomPosition].innerHTML = 'O';
          gameboardArray.splice(randomPosition, 1, 'O');
          playerTurn = 'one';
          break;
        }
      }
    };

    if (result === null) {
      setTimeout(aiFunc, 800);
      setTimeout(checkGame, 900);
      setTimeout(checkTie, 900);
    }

  };

  // Check if the square clicked is not taken then add "X" or "O" to that square
  function addPiece(e) {
    let _position = Number(e.target.id.slice(-1));

    if (playerTurn === 'one' && e.target.innerHTML === '') {
      e.target.innerHTML = 'X';
      _marker = 'X';
      gameboardArray.splice(_position, 1, _marker);
      playerTurn = 'two';
    } else if (e.target.innerHTML === '') {
      e.target.innerHTML = 'O';
      _marker = 'O';
      gameboardArray.splice(_position, 1, _marker);
      playerTurn = 'one';
    }

    // Play AI's turn first
    if (playerTwoLabel.innerHTML.includes('COMPUTER (O)') &&
      playerTurn === 'two' &&
      result === null) {
      setTimeout(aiChoice, 350);
    }

    checkGame();
    checkTie();
  };

  // Check for a winner or tie
  function checkGame() {
    let positionsOfX = [];
    let positionsOfO = [];

    // Keeps track of positions taken by "X" and "O"
    for (let i = 0; i < gameboardArray.length; i++) {
      if (gameboardArray[i] === 'X') {
        positionsOfX.push(i);
      } else if (gameboardArray[i] === 'O') {
        positionsOfO.push(i);
      }
    }

    // Determine if "X" wins
    for (let i = 0; i < _winningPatterns.length; i++) {
      for (let y = 0; y < positionsOfX.length; y++) {
        if (_winningPatterns[i].includes(positionsOfX[y]) && _tallyX[i].includes(positionsOfX[y]) === false) {
          _tallyX[i].push(positionsOfX[y]);
        }
        if (_tallyX[i].length === 3 && result === null) {
          result = 'Player One';
          endGame();
          setTimeout(trackScore, 350);
          break;
        }
      }
    }

    // Determine if "O" wins
    for (let i = 0; i < _winningPatterns.length; i++) {
      for (let y = 0; y < positionsOfO.length; y++) {
        if (_winningPatterns[i].includes(positionsOfO[y]) && _tallyO[i].includes(positionsOfO[y]) === false) {
          _tallyO[i].push(positionsOfO[y]);
        }
        if (_tallyO[i].length === 3 && result === null) {
          result = 'Player Two';
          endGame();
          setTimeout(trackScore, 350);
          break;
        }
      }
    }
  };


  // Check for a tie
  const checkTie = function () {
    if (gameboardArray.includes(' ') === false && result === null) {
      result = 'Tie';
      endGame();
      setTimeout(trackScore, 350);
    }
  }

  // Alert the end of the game
  const endGame = function () {
    const popup = document.getElementById('popup-container');
    const popupText = document.getElementById('popup-text');
    const closePopup = document.getElementById('popup-close');
    const boardMarkers = document.getElementsByClassName('square');

    setTimeout(function () {
      result === 'Tie' ? popupText.innerHTML = 'It\s a Tie!' : popupText.innerHTML = `${result} Wins!`;
      popup.style.display = 'block';
    }, 300);

    closePopup.addEventListener('click', function () {
      popup.style.display = 'none';
      _tallyX = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
      ];
      _tallyO = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
      ];
      playerTurn = 'one';
      _marker = 'X';
      gameboardArray = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
      result = null;

      for (let i = 0; i < boardMarkers.length; i++) {
        boardMarkers[i].innerHTML = '';
      }
    });
  }

  const trackScore = function () {
    const playerOneTally = document.getElementById('player-one');
    const playerTwoTally = document.getElementById('player-two');
    const tieTally = document.getElementById('tie');

    if (result === 'Player One') {
      playerOneTally.innerHTML = playerOneTally.firstChild.textContent + '<br>' + (Number(playerOneTally.firstElementChild.nextSibling.textContent) + 1);
    } else if (result === 'Player Two') {
      playerTwoTally.innerHTML = playerTwoTally.firstChild.textContent + '<br>' + (Number(playerTwoTally.firstElementChild.nextSibling.textContent) + 1);
    } else {
      tieTally.innerHTML = tieTally.firstChild.textContent + '<br>' + (Number(tieTally.firstElementChild.nextSibling.textContent) + 1);
    }
  }

  return {
    gameboardArray
  }

})();


const PlayerDisplay = (function () {
  // Player selection and current gameboard variables
  const onePlayerIcon = document.getElementById('one-player');
  const twoPlayersIcon = document.getElementById('two-player');
  const playerIconLabel = document.getElementById('player-label');
  const playerOneLabel = document.getElementById('player-one');
  const playerTwoLabel = document.getElementById('player-two');
  let currentBoard;

  const selectOnePlayer = function () {
    currentBoard = Gameboard.gameboardArray.filter((index) => index === ' ');

    if (currentBoard.length === 9) {
      onePlayerIcon.classList.toggle('show');
      onePlayerIcon.classList.toggle('hidden');
      twoPlayersIcon.classList.toggle('show');
      twoPlayersIcon.classList.toggle('hidden');
      playerIconLabel.innerHTML = '1P';
      playerOneLabel.innerHTML = 'PLAYER (X)<br>0';
      playerTwoLabel.innerHTML = 'COMPUTER (O)<br>0';
    }
  }

  const selectTwoPlayers = function () {
    currentBoard = Gameboard.gameboardArray.filter((index) => index === ' ');

    if (currentBoard.length === 9) {
      twoPlayersIcon.classList.toggle('show');
      twoPlayersIcon.classList.toggle('hidden');
      onePlayerIcon.classList.toggle('show');
      onePlayerIcon.classList.toggle('hidden');
      playerIconLabel.innerHTML = '2P';
      playerOneLabel.innerHTML = 'PLAYER 1 (X)<br>0';
      playerTwoLabel.innerHTML = 'PLAYER 2 (O)<br>0';
    }
  }

  onePlayerIcon.addEventListener('click', selectTwoPlayers);
  twoPlayersIcon.addEventListener('click', selectOnePlayer);

})();


const Audio = (function () {
  // Audio file variables
  const refreshSound = document.getElementById('refresh-audio');

  const setPieceSound = document.getElementById('set-piece-sound');
  setPieceSound.playbackRate = 4;

  const playerChangeSound = document.getElementById('player-select-audio');
  playerChangeSound.playbackRate = 4;

  const setPiece = () => setPieceSound.play();

  // Play refresh sound
  window.onload = function () {
    refreshSound.play();
  }

  // Mute and unmute sounds
  const muteBtn = document.getElementById('sound');
  const unmuteBtn = document.getElementById('mute');
  let sound = 'on';

  const toggleSound = () => {
    if (sound === 'on') {
      muteBtn.classList.toggle('hide-sound');
      unmuteBtn.classList.toggle('hide-sound');
      refreshSound.muted = true;
      playerChangeSound.muted = true;
      setPieceSound.muted = true;
      sound = 'off';
    } else {
      muteBtn.classList.toggle('hide-sound');
      unmuteBtn.classList.toggle('hide-sound');
      refreshSound.muted = false;
      playerChangeSound.muted = false;
      setPieceSound.muted = false;
      sound = 'on';
    }
  }

  muteBtn.addEventListener('click', toggleSound);
  unmuteBtn.addEventListener('click', toggleSound);

  // Play audio when number of players button is clicked
  const playerChange = () => playerChangeSound.play();

  const playerIcons = document.getElementById('num-of-players');
  playerIcons.addEventListener('click', playerChange);

  const _squares = document.querySelectorAll('.square');
  _squares.forEach(square => square.addEventListener('click', setPiece));

})();