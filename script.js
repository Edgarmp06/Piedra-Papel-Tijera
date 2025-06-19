// Variables globales
let playerScore = 0;
let computerScore = 0;
let isPlaying = false;

// Configuración del juego
const choices = {
    rock: '🗿',
    paper: '📄',
    scissors: '✂️'
};

const choiceNames = {
    rock: 'Piedra',
    paper: 'Papel',
    scissors: 'Tijera'
};

// Función para obtener la elección de la computadora
function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * choices.length)];
}

// Función para determinar el ganador
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'tie';
    }
    
    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return 'win';
    }
    
    return 'lose';
}

// Función para actualizar el marcador
function updateScore(result) {
    if (result === 'win') {
        playerScore++;
        document.getElementById('player-score').textContent = playerScore;
    } else if (result === 'lose') {
        computerScore++;
        document.getElementById('computer-score').textContent = computerScore;
    }
}

// Función para actualizar la pantalla
function updateDisplay(playerChoice, computerChoice, result) {
    const playerChoiceEl = document.getElementById('player-choice');
    const computerChoiceEl = document.getElementById('computer-choice');
    const resultEl = document.getElementById('result');

    // Mostrar las elecciones
    playerChoiceEl.textContent = choices[playerChoice];
    computerChoiceEl.textContent = choices[computerChoice];

    // Añadir animación
    playerChoiceEl.classList.add('animate');
    computerChoiceEl.classList.add('animate');

    // Mostrar resultado
    let resultText = '';
    let resultClass = '';

    if (result === 'win') {
        resultText = `¡Ganaste! ${choiceNames[playerChoice]} vence a ${choiceNames[computerChoice]}`;
        resultClass = 'win';
    } else if (result === 'lose') {
        resultText = `¡Perdiste! ${choiceNames[computerChoice]} vence a ${choiceNames[playerChoice]}`;
        resultClass = 'lose';
    } else {
        resultText = `¡Empate! Ambos eligieron ${choiceNames[playerChoice]}`;
        resultClass = 'tie';
    }

    resultEl.textContent = resultText;
    resultEl.className = `result ${resultClass}`;

    // Agregar mensaje para continuar jugando
    setTimeout(() => {
        resultText += ' - ¡Vuelve a elegir para seguir jugando!';
        resultEl.textContent = resultText;
    }, );

    // Remover animaciones después de un tiempo
    setTimeout(() => {
        playerChoiceEl.classList.remove('animate');
        computerChoiceEl.classList.remove('animate');
    }, 600);
}

// Función principal del juego
async function playGame(playerChoice) {
    if (isPlaying) return;
    isPlaying = true;

    // Deshabilitar botones temporalmente
    const buttons = document.querySelectorAll('.choice-btn');
    buttons.forEach(btn => btn.style.pointerEvents = 'none');

    // Referencias a elementos
    const resultEl = document.getElementById('result');
    const playerChoiceEl = document.getElementById('player-choice');
    const computerChoiceEl = document.getElementById('computer-choice');

    // Reset display
    playerChoiceEl.textContent = '❓';
    computerChoiceEl.textContent = '❓';

    // Countdown animation
    for (let i = 3; i > 0; i--) {
        resultEl.textContent = i;
        resultEl.className = 'result countdown';
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    resultEl.textContent = '¡YA!';
    await new Promise(resolve => setTimeout(resolve, 300));

    // Ejecutar el juego
    const computerChoice = getComputerChoice();
    const result = determineWinner(playerChoice, computerChoice);

    updateDisplay(playerChoice, computerChoice, result);
    updateScore(result);

    // Reactivar botones
    buttons.forEach(btn => btn.style.pointerEvents = 'auto');
    isPlaying = false;

    // Efecto de vibración en caso de empate
    if (result === 'tie') {
        document.querySelector('.game-container').classList.add('shake');
        setTimeout(() => {
            document.querySelector('.game-container').classList.remove('shake');
        }, 500);
    }
}

// Función para reiniciar el juego
function resetGame() {
    playerScore = 0;
    computerScore = 0;
    document.getElementById('player-score').textContent = '0';
    document.getElementById('computer-score').textContent = '0';
    document.getElementById('player-choice').textContent = '❓';
    document.getElementById('computer-choice').textContent = '❓';
    document.getElementById('result').textContent = '¡Elige tu jugada!';
    document.getElementById('result').className = 'result';
}

// Función para reproducir sonidos
function playSound(frequency, duration = 200) {
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (AudioContext || webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    }
}

// Inicialización cuando la página carga
document.addEventListener('DOMContentLoaded', function() {
    // Añadir sonidos a los botones
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => playSound(440, 100));
    });
    
    console.log('🎮 Juego de Piedra, Papel o Tijera cargado correctamente!');
});