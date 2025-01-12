// DOM Elements
const menuScreen = document.getElementById('menu-screen');
const flashcardScreen = document.getElementById('flashcard-screen');
const menuContainer = document.querySelector('.menu-container');
const cardProgress = document.getElementById('card-progress');
const frontCharacter = document.getElementById('front-character');
const frontPinyin = document.getElementById('front-pinyin');
const backTranslation = document.getElementById('back-translation');
const card = document.querySelector('.card');

const nextButton = document.getElementById('next-button');
const prevButton = document.getElementById('prev-button');

// State
let currentSet = null;
let currentCardIndex = 0;

// Event Listeners
document.querySelector('.back-button').addEventListener('click', showMenu);
prevButton.addEventListener('click', previousCard);
nextButton.addEventListener('click', nextCard);
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
    const cards = hsk1Data[currentSet];
    const currentCard = cards[currentCardIndex];

    frontCharacter.textContent = currentCard.front;
    frontPinyin.textContent = currentCard.frontSubtitle;
    backTranslation.textContent = currentCard.back;
    cardProgress.textContent = `${currentCardIndex + 1}/${hsk1Data[currentSet].length}`;

    // Disable/enable buttons based on position
    nextButton.disabled = currentCardIndex === cards.length - 1;
    prevButton.disabled = currentCardIndex === 0;
}

// Start the app
initialize();