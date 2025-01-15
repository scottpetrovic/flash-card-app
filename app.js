// DOM Elements
const menuScreen = document.getElementById('menu-screen');
const flashcardScreen = document.getElementById('flashcard-screen');
const menuContainer = document.querySelector('.menu-container');
const cardProgress = document.getElementById('card-progress');
const frontCharacter = document.getElementById('front-character');
const frontPinyin = document.getElementById('front-pinyin');
const backTranslation = document.getElementById('back-translation');
const card = document.querySelector('.card');
const mainHeading = document.querySelector('h1.heading');
const lessonTitle = document.getElementById('lesson-title');

const nextButton = document.getElementById('next-button');
const prevButton = document.getElementById('prev-button');
const resetButton = document.getElementById('reset-button');


// State
let currentSet = null;
let currentCardIndex = 0;
let currentCards = null; // will hold the shuffled cards for current lesson

// Event Listeners
document.querySelector('.back-button').addEventListener('click', showMenu);
prevButton.addEventListener('click', previousCard);
nextButton.addEventListener('click', nextCard);
resetButton.addEventListener('click', resetCard);
card.addEventListener('click', flipCard);


// Show/Hide Pinyin functionality
const showPinyinBtn = document.getElementById('show-pinyin-btn');
const pinyinElement = document.getElementById('front-pinyin');

showPinyinBtn.addEventListener('mousedown', () => {
    pinyinElement.classList.remove('hidden');
});

showPinyinBtn.addEventListener('mouseup', () => {
    pinyinElement.classList.add('hidden');
});

showPinyinBtn.addEventListener('mouseleave', () => {
    pinyinElement.classList.add('hidden');
});

// Prevent card from flipping when pressing the pinyin button
showPinyinBtn.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Shuffle array helper function
function shuffleArray(array) {
    const shuffled = [...array];  // Create a copy of the array
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];  // Swap elements
    }
    return shuffled;
}


// Initialize
function initialize() {
    // Set the title from the data
    mainHeading.textContent = hsk1Data.title + " Flashcards";
    
    // Create menu buttons
    Object.entries(hsk1Data.lessons).forEach(([lessonName, cards]) => {
        const button = document.createElement('button');
        button.className = 'menu-button';
        button.textContent = `${lessonName} (${cards.length} cards)`;
        button.addEventListener('click', () => startSet(lessonName));
        menuContainer.appendChild(button);
    });
}

// Navigation Functions
function showMenu() {
    menuScreen.style.display = 'flex';
    flashcardScreen.style.display = 'none';
    currentSet = null;
}

function startSet(lessonName) {
    currentSet = lessonName;
    currentCardIndex = 0;
    currentCards = shuffleArray(hsk1Data.lessons[lessonName]);  // Shuffle cards when starting a lesson
    menuScreen.style.display = 'none';
    flashcardScreen.style.display = 'flex';
    card.classList.remove('flipped');  // Reset card to front face if it isn't
    updateCard();
}



function resetCard() {
    card.classList.remove('flipped');
    setTimeout(() => {
        currentCardIndex = 0;
        updateCard();
    }, 500);
}

function navigateCard(direction) {
    card.classList.remove('flipped');
    
    // Wait for flip animation to complete before updating content
    setTimeout(() => {
        if (direction === 'next') {
            currentCardIndex = (currentCardIndex + 1) % currentCards.length;
        } else {
            currentCardIndex = (currentCardIndex - 1 + currentCards.length) % currentCards.length;
        }
        updateCard();
    }, 500);
}

function nextCard() {
    navigateCard('next');
}

function previousCard() {
    navigateCard('prev');
}


function flipCard() {
    card.classList.toggle('flipped');
}

// Update Display
function updateCard() {
    const currentCard = currentCards[currentCardIndex];

    frontCharacter.textContent = currentCard.front;
    frontPinyin.textContent = currentCard.frontSubtitle;
    backTranslation.textContent = currentCard.back;
    cardProgress.textContent = `${currentCardIndex + 1}/${currentCards.length}`;

    // lesson title when we click to learn
    lessonTitle.textContent = hsk1Data.title + ' - ' + currentSet;  

    // Update navigation buttons
    nextButton.disabled = currentCardIndex === currentCards.length - 1;
    prevButton.disabled = currentCardIndex === 0;
}

// Start the app
initialize();