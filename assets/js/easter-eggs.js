/**
 * Easter Eggs for CoSmoG Website
 * Adds fun interactive elements that users can discover
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize easter eggs
  initKonamiCode();
  initStarClickEffect();
  initSecretMessage();
  initHiddenGame();
});

/**
 * Secret Message Easter Egg
 * Shows a hidden message when a specific sequence is followed
 */
function initSecretMessage() {
  // Secret sequence: click logo, then footer, then header within 5 seconds
  let sequenceStep = 0;
  let sequenceTimer = null;
  
  // Logo click
  const logo = document.querySelector('.logo') || document.querySelector('header img');
  if (logo) {
    logo.addEventListener('click', () => {
      if (sequenceStep === 0) {
        sequenceStep = 1;
        resetSequenceTimer();
      } else {
        sequenceStep = 0;
      }
    });
  }
  
  // Footer click
  const footer = document.querySelector('footer');
  if (footer) {
    footer.addEventListener('click', () => {
      if (sequenceStep === 1) {
        sequenceStep = 2;
        resetSequenceTimer();
      } else {
        sequenceStep = 0;
      }
    });
  }
  
  // Header click
  const header = document.querySelector('header');
  if (header) {
    header.addEventListener('click', () => {
      if (sequenceStep === 2) {
        showSecretMessage();
        sequenceStep = 0;
        clearTimeout(sequenceTimer);
      } else {
        sequenceStep = 0;
      }
    });
  }
  
  function resetSequenceTimer() {
    clearTimeout(sequenceTimer);
    sequenceTimer = setTimeout(() => {
      sequenceStep = 0;
    }, 5000);
  }
  
  function showSecretMessage() {
    const message = document.createElement('div');
    message.className = 'secret-message';
    message.innerHTML = `
      <h3>🔍 You Found a Secret! 🔍</h3>
      <p>The first CoSmoG event was actually planned on a napkin during lunch!</p>
      <p>Check back for more hidden secrets...</p>
    `;
    document.body.appendChild(message);
    
    // Add CSS for the message
    const style = document.createElement('style');
    style.textContent = `
      .secret-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ff9966, #ff5e62);
        color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 9999;
        text-align: center;
        animation: message-fade 0.5s ease-in-out;
      }
      
      @keyframes message-fade {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      }
    `;
    document.head.appendChild(style);
    
    // Store achievement in database if available
    if (window.CosmogDB && window.CosmogDB.Users) {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        window.CosmogDB.Users.update({
          id: currentUser,
          achievements: ['secret_finder'],
          secretsFound: true
        });
      }
    }
    
    // Remove message after 5 seconds
    setTimeout(() => {
      message.remove();
      style.remove();
    }, 5000);
  }
}

/**
 * Konami Code Easter Egg
 * When user enters: ↑ ↑ ↓ ↓ ← → ← → B A
 */
function initKonamiCode() {
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    // Check if the key pressed matches the next key in the Konami code
    if (e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase()) {
      konamiIndex++;
      
      // If the full code is entered
      if (konamiIndex === konamiCode.length) {
        activateKonamiCode();
        konamiIndex = 0; // Reset for next time
      }
    } else {
      konamiIndex = 0; // Reset if wrong key
    }
  });
}

/**
 * Activate special effects when Konami code is entered
 */
function activateKonamiCode() {
  // Create a fun animation
  document.body.classList.add('konami-active');
  
  // Add some visual effects
  const stars = document.querySelectorAll('.star');
  stars.forEach(star => {
    star.style.animation = 'spin 1s infinite linear';
    star.style.backgroundColor = getRandomColor();
  });
  
  // Show a special message
  const message = document.createElement('div');
  message.className = 'konami-message';
  message.innerHTML = `
    <h3>🎮 Konami Code Activated! 🎮</h3>
    <p>You've unlocked a special discount code: <strong>COSMOG2025</strong></p>
    <p>Use it during registration for a surprise!</p>
  `;
  document.body.appendChild(message);
  
  // Add CSS for the message
  const style = document.createElement('style');
  style.textContent = `
    .konami-message {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #6e8efb, #a777e3);
      color: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 9999;
      text-align: center;
      animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    @keyframes bounce-in {
      0% { transform: translate(-50%, -50%) scale(0); }
      100% { transform: translate(-50%, -50%) scale(1); }
    }
    
    .konami-active {
      background: linear-gradient(135deg, #121212, #2a2a2a);
      transition: background 1s ease;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  
  // Remove effects after 5 seconds
  setTimeout(() => {
    document.body.classList.remove('konami-active');
    stars.forEach(star => {
      star.style.animation = '';
      star.style.backgroundColor = '';
    });
    message.remove();
    style.remove();
  }, 5000);
  
  // Store the discount code in the database if available
  if (window.CosmogDB && window.CosmogDB.Users) {
    // If user is logged in, save their discount
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      window.CosmogDB.Users.update({
        id: currentUser,
        discountCode: 'COSMOG2025',
        discountApplied: false
      });
    }
  }
}

/**
 * Create a star burst effect when clicking on stars
 */
function initStarClickEffect() {
  document.addEventListener('click', (e) => {
    // Check if clicked element is a star
    if (e.target.classList.contains('star')) {
      createStarBurst(e.clientX, e.clientY);
      
      // Play a sound
      playStarSound();
      
      // Add a small counter in localStorage
      const starClicks = parseInt(localStorage.getItem('starClicks') || '0') + 1;
      localStorage.setItem('starClicks', starClicks);
      
      // If clicked 10 stars, show a special message
      if (starClicks === 10) {
        showStarCollectorMessage();
      }
    }
  });
}

/**
 * Create a burst of stars at the given coordinates
 */
function createStarBurst(x, y) {
  const burstContainer = document.createElement('div');
  burstContainer.className = 'star-burst';
  burstContainer.style.position = 'fixed';
  burstContainer.style.left = `${x}px`;
  burstContainer.style.top = `${y}px`;
  burstContainer.style.pointerEvents = 'none';
  document.body.appendChild(burstContainer);
  
  // Create 10 mini stars
  for (let i = 0; i < 10; i++) {
    const miniStar = document.createElement('div');
    miniStar.className = 'mini-star';
    miniStar.style.position = 'absolute';
    miniStar.style.width = '10px';
    miniStar.style.height = '10px';
    miniStar.style.backgroundColor = getRandomColor();
    miniStar.style.borderRadius = '50%';
    miniStar.style.transform = 'translate(-50%, -50%)';
    
    // Random direction
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 50;
    const duration = 0.5 + Math.random() * 0.5;
    
    miniStar.style.animation = `star-fly-out ${duration}s ease-out forwards`;
    miniStar.style.animationFillMode = 'forwards';
    
    // Set the final position using CSS custom properties
    miniStar.style.setProperty('--end-x', `${Math.cos(angle) * distance}px`);
    miniStar.style.setProperty('--end-y', `${Math.sin(angle) * distance}px`);
    
    burstContainer.appendChild(miniStar);
  }
  
  // Add the animation style if it doesn't exist
  if (!document.querySelector('#star-burst-style')) {
    const style = document.createElement('style');
    style.id = 'star-burst-style';
    style.textContent = `
      @keyframes star-fly-out {
        0% { 
          transform: translate(-50%, -50%) scale(0.8); 
          opacity: 1;
        }
        100% { 
          transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(0);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Remove the burst container after animation completes
  setTimeout(() => {
    burstContainer.remove();
  }, 1000);
}

/**
 * Hidden Game Easter Egg
 * A simple space shooter game that can be activated with a special key combination
 */
function initHiddenGame() {
  // Game is activated by pressing 'G' + 'A' + 'M' + 'E' keys in sequence
  const gameCode = ['g', 'a', 'm', 'e'];
  let gameIndex = 0;
  
  document.addEventListener('keydown', (e) => {
    // Check if the key pressed matches the next key in the game code
    if (e.key.toLowerCase() === gameCode[gameIndex]) {
      gameIndex++;
      
      // If the full code is entered
      if (gameIndex === gameCode.length) {
        startHiddenGame();
        gameIndex = 0; // Reset for next time
      }
    } else {
      gameIndex = 0; // Reset if wrong key
    }
  });
  
  function startHiddenGame() {
    // Create game container
    const gameContainer = document.createElement('div');
    gameContainer.className = 'hidden-game';
    gameContainer.innerHTML = `
      <div class="game-header">
        <h3>CoSmoG Space Shooter</h3>
        <div class="game-score">Score: <span id="game-score">0</span></div>
        <button id="close-game">Close</button>
      </div>
      <div class="game-area">
        <div class="player"></div>
      </div>
    `;
    document.body.appendChild(gameContainer);
    
    // Add CSS for the game
    const style = document.createElement('style');
    style.id = 'hidden-game-style';
    style.textContent = `
      .hidden-game {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        height: 500px;
        background-color: #000;
        border: 2px solid #30cfd0;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(48, 207, 208, 0.5);
        z-index: 10000;
        overflow: hidden;
      }
      
      .game-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background: linear-gradient(90deg, #30cfd0, #330867);
        color: white;
      }
      
      .game-header h3 {
        margin: 0;
        font-size: 16px;
      }
      
      .game-score {
        font-size: 14px;
      }
      
      #close-game {
        background: transparent;
        border: 1px solid white;
        color: white;
        border-radius: 4px;
        cursor: pointer;
      }
      
      .game-area {
        position: relative;
        width: 100%;
        height: 450px;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23000"/><circle cx="10" cy="10" r="1" fill="%23FFF" opacity="0.5"/><circle cx="30" cy="40" r="0.5" fill="%23FFF" opacity="0.5"/><circle cx="70" cy="20" r="0.8" fill="%23FFF" opacity="0.5"/><circle cx="90" cy="60" r="0.6" fill="%23FFF" opacity="0.5"/><circle cx="50" cy="80" r="0.7" fill="%23FFF" opacity="0.5"/></svg>');
        overflow: hidden;
      }
      
      .player {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 30px;
        height: 30px;
        background-color: #30cfd0;
        clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
      }
      
      .enemy {
        position: absolute;
        width: 20px;
        height: 20px;
        background-color: #ff5e62;
        border-radius: 50%;
      }
      
      .laser {
        position: absolute;
        width: 2px;
        height: 10px;
        background-color: #fff;
      }
    `;
    document.head.appendChild(style);
    
    // Game variables
    let score = 0;
    let gameActive = true;
    let playerX = 200;
    const playerSpeed = 5;
    const enemies = [];
    const lasers = [];
    let keys = {};
    
    // Game loop
    const gameLoop = setInterval(() => {
      if (!gameActive) return;
      
      // Move player
      if (keys['ArrowLeft'] && playerX > 15) {
        playerX -= playerSpeed;
      }
      if (keys['ArrowRight'] && playerX < 385) {
        playerX += playerSpeed;
      }
      document.querySelector('.player').style.left = `${playerX}px`;
      
      // Create enemies randomly
      if (Math.random() < 0.02) {
        createEnemy();
      }
      
      // Move enemies
      moveEnemies();
      
      // Move lasers
      moveLasers();
      
      // Check collisions
      checkCollisions();
      
    }, 16);
    
    // Key event listeners
    document.addEventListener('keydown', (e) => {
      keys[e.key] = true;
      
      // Fire laser with space
      if (e.key === ' ' && gameActive) {
        fireLaser();
      }
    });
    
    document.addEventListener('keyup', (e) => {
      keys[e.key] = false;
    });
    
    // Close button
    document.getElementById('close-game').addEventListener('click', () => {
      endGame();
    });
    
    function createEnemy() {
      const enemy = document.createElement('div');
      enemy.className = 'enemy';
      const x = Math.random() * 380;
      enemy.style.left = `${x}px`;
      enemy.style.top = '0px';
      document.querySelector('.game-area').appendChild(enemy);
      enemies.push({ element: enemy, x, y: 0 });
    }
    
    function moveEnemies() {
      for (let i = 0; i < enemies.length; i++) {
        enemies[i].y += 2;
        enemies[i].element.style.top = `${enemies[i].y}px`;
        
        // Remove enemies that go off screen
        if (enemies[i].y > 450) {
          enemies[i].element.remove();
          enemies.splice(i, 1);
          i--;
        }
      }
    }
    
    function fireLaser() {
      const laser = document.createElement('div');
      laser.className = 'laser';
      laser.style.left = `${playerX + 14}px`;
      laser.style.bottom = '50px';
      document.querySelector('.game-area').appendChild(laser);
      lasers.push({ element: laser, x: playerX + 14, y: 400 });
    }
    
    function moveLasers() {
      for (let i = 0; i < lasers.length; i++) {
        lasers[i].y -= 5;
        lasers[i].element.style.top = `${lasers[i].y}px`;
        
        // Remove lasers that go off screen
        if (lasers[i].y < 0) {
          lasers[i].element.remove();
          lasers.splice(i, 1);
          i--;
        }
      }
    }
    
    function checkCollisions() {
      for (let i = 0; i < lasers.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
          if (
            lasers[i] && enemies[j] &&
            Math.abs(lasers[i].x - enemies[j].x - 10) < 15 &&
            Math.abs(lasers[i].y - enemies[j].y - 10) < 15
          ) {
            // Collision detected
            score += 10;
            document.getElementById('game-score').textContent = score;
            
            // Remove both laser and enemy
            lasers[i].element.remove();
            enemies[j].element.remove();
            lasers.splice(i, 1);
            enemies.splice(j, 1);
            i--;
            break;
          }
        }
      }
      
      // Check if enemy hits player
      for (let i = 0; i < enemies.length; i++) {
        if (
          Math.abs(enemies[i].x - playerX) < 25 &&
          enemies[i].y > 400
        ) {
          // Game over
          gameActive = false;
          showGameOver();
          break;
        }
      }
    }
    
    function showGameOver() {
      const gameOver = document.createElement('div');
      gameOver.className = 'game-over';
      gameOver.innerHTML = `
        <h2>Game Over</h2>
        <p>Your score: ${score}</p>
        <button id="restart-game">Play Again</button>
      `;
      document.querySelector('.game-area').appendChild(gameOver);
      
      // Add CSS for game over
      const gameOverStyle = document.createElement('style');
      gameOverStyle.textContent = `
        .game-over {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          z-index: 100;
        }
        
        #restart-game {
          background: #30cfd0;
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
        }
      `;
      document.head.appendChild(gameOverStyle);
      
      // Restart button
      document.getElementById('restart-game').addEventListener('click', () => {
        gameOver.remove();
        gameOverStyle.remove();
        resetGame();
      });
      
      // Store achievement in database if available and score is high enough
      if (window.CosmogDB && window.CosmogDB.Users && score >= 100) {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
          window.CosmogDB.Users.update({
            id: currentUser,
            achievements: ['game_master'],
            highScore: score
          });
        }
      }
    }
    
    function resetGame() {
      // Clear all enemies and lasers
      enemies.forEach(enemy => enemy.element.remove());
      lasers.forEach(laser => laser.element.remove());
      enemies.length = 0;
      lasers.length = 0;
      
      // Reset variables
      score = 0;
      document.getElementById('game-score').textContent = '0';
      playerX = 200;
      document.querySelector('.player').style.left = `${playerX}px`;
      gameActive = true;
    }
    
    function endGame() {
      clearInterval(gameLoop);
      gameContainer.remove();
      style.remove();
      document.removeEventListener('keydown', (e) => keys[e.key] = true);
      document.removeEventListener('keyup', (e) => keys[e.key] = false);
    }
  }
}

/**
 * Play a star sound effect
 */
function playStarSound() {
  // Create a simple beep sound using AudioContext
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440 + Math.random() * 220, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);
  } catch (e) {
    // Audio not supported
  }
}

/**
 * Show a message when user collects 10 stars
 */
function showStarCollectorMessage() {
  const message = document.createElement('div');
  message.className = 'star-collector-message';
  message.innerHTML = `
    <h3>⭐ Star Collector! ⭐</h3>
    <p>You've clicked 10 stars! Your registration for the next event will receive a special gift.</p>
  `;
  document.body.appendChild(message);
  
  // Add CSS for the message
  const style = document.createElement('style');
  style.textContent = `
    .star-collector-message {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #ffd700, #ff8c00);
      color: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 9999;
      text-align: center;
      animation: float 3s ease-in-out infinite;
    }
    
    @keyframes float {
      0% { transform: translate(-50%, -50%); }
      50% { transform: translate(-50%, -55%); }
      100% { transform: translate(-50%, -50%); }
    }
  `;
  document.head.appendChild(style);
  
  // Store achievement in database if available
  if (window.CosmogDB && window.CosmogDB.Users) {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      window.CosmogDB.Users.update({
        id: currentUser,
        achievements: ['star_collector'],
        specialGift: true
      });
    }
  }
  
  // Remove message after 5 seconds
  setTimeout(() => {
    message.remove();
    style.remove();
  }, 5000);
}

// Remove the burst container after animation completes
function getRandomColor() {
  const colors = ['#ff5e62', '#ff9966', '#6e8efb', '#a777e3', '#30cfd0', '#330867'];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Play a star sound effect
 */
function playStarSound() {
  const audio = new Audio();
  audio.volume = 0.2;
  
  // Try to use different sounds each time
  const soundIndex = Math.floor(Math.random() * 3) + 1;
  audio.src = `data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCgUFBQUFDMzMzMzM0dHR0dHR1tbW1tbW2ZmZmZmZnp6enp6eoqKioqKipSUlJSUlKOjo6Ojo7e3t7e3t8fHx8fHx9bW1tbW1uTk5OTk5PT09PT09P////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAHjOZTf9/AAAAAAAAAAAAAAAAAAAAAP/7kGQAAANUMEoFPeACNQV40KEYABEY41g5vAAA9RjpZxRwAImU+W8eshaFpAQgALAAYALATx/nYDYCMJ0HITQYYA7AH4c7MoGsnCMU5pnW+OQnBcDrQ9Xx7w37/D+PimYavV8elKUpT5fqx5VjV6vZ38eJR48eRKa9KUp7v396UgPHkQwMAAAAAA//8MAOp39CECAAhlIEEIIECBAgTT1oj///tEQYT0wgEIYxgDC09aIiE7u7u7uIiIz+LtoIQGE/+XAGYLjpTAIOGYYy0ZACgDgSNFxC7YYiINocwERjAEDhIy0mRoGwAE7lOTBsGhj1qrXNCU9GrgwSPr80jj0dIpT9DRUNHKJbRxiWSiifVHuD2b0EbjLkOUzSXztP3uE1JpHzV6NPq+f3P5T0/f/lNH7lWTavQ5Xz1yLVe653///qf93B7f/vMdaKJAAJAMAIwIMAHMpzDkoYwD8CR717zVb8/p54P3MikXGCEWhQOEAOAdP6v8b8oNL/EzdnROC8Zo+z+71O8VVAGIKFEglKbidkoLam0mAFiwo0ZoVExf/7kmQLgAQyZFxvPWAENcVKXeK0ABAk2WFMaSNIzBMptBYfArbkZgpWjEQpcmjxQoG2qREWQcvpzuuIm29V+NWm1holmRvaaO1ptaMJmY39jL6Zmms82g8yqVS3rrh5BAFB4PEHh4BAEQTDmDwNB2T8fj8X8X8X5+PvX+Xn/Lx/8/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4/F/4