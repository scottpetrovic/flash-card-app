// DOM Elements
const menuScreen = document.getElementById('menu-screen');
const flashcardScreen = document.getElementById('flashcard-screen');
const menuContainer = document.querySelector('.menu-container');
const cardProgress = document.getElementById('card-progress');
const frontCharacter = document.getElementById('front-character');
const frontPinyin = document.getElementById('front-pinyin');
const backTranslation = document.getElementById('back-translation');
const card = document.querySelector('.card');

// State
let currentSet = null;
let currentCardIndex = 0;

// Event Listeners
document.querySelector('.back-button').addEventListener('click', showMenu);
document.getElementById('prev-button').addEventListener('click', previousCard);
document.getElementById('next-button').addEventListener('click', nextCard);
card.addEventListener('click', flipCard);

// Initialize
function initialize() {
    // Create menu buttons
    Object.entries(hsk1Data).forEach(([setName, cards]) => {
        const button = document.createElement('button');
        button.className = 'menu-button';
        button.textContent = `${setName} (${cards.length} cards)`;
        button.addEventListener('click', () => startSet(setName));
        menuContainer.appendChild(button);
    });
}

// Navigation Functions
function showMenu() {
    menuScreen.style.display = 'flex';
    flashcardScreen.style.display = 'none';
    currentSet = null;
}

function startSet(setName) {
    currentSet = setName;
    currentCardIndex = 0;
    menuScreen.style.display = 'none';
    flashcardScreen.style.display = 'flex';
    updateCard();
}

function nextCard() {
    card.classList.remove('flipped');
    currentCardIndex = (currentCardIndex + 1) % hsk1Data[currentSet].length;
    updateCard();
}

function previousCard() {
    card.classList.remove('flipped');
    currentCardIndex = (currentCardIndex - 1 + hsk1Data[currentSet].length) % hsk1Data[currentSet].length;
    updateCard();
}

function flipCard() {
    card.classList.toggle('flipped');
}

// Update Display
function updateCard() {
    const currentCard = hsk1Data[currentSet][currentCardIndex];
    frontCharacter.textContent = currentCard.front;
    frontPinyin.textContent = currentCard.frontSubtitle;
    backTranslation.textContent = currentCard.back;
    cardProgress.textContent = `${currentCardIndex + 1}/${hsk1Data[currentSet].length}`;
}

// Start the app
initialize();