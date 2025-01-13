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
    menuScreen.style.display = 'none';
    flashcardScreen.style.display = 'flex';
    updateCard();
}

function nextCard() {
    card.classList.remove('flipped');
    
    // Wait for flip animation to complete before updating content
    // otherwise we will see the new answer
    setTimeout(() => {
        currentCardIndex = (currentCardIndex + 1) % hsk1Data.lessons[currentSet].length;
        updateCard();
    }, 500); // flip the card back aroiund before updating the content
}


function previousCard() {
    card.classList.remove('flipped');
    currentCardIndex = (currentCardIndex - 1 + hsk1Data.lessons[currentSet].length) % hsk1Data.lessons[currentSet].length;
    updateCard();
}

function flipCard() {
    card.classList.toggle('flipped');
}

// Update Display
function updateCard() {
    const cards = hsk1Data.lessons[currentSet];
    const currentCard = cards[currentCardIndex];


    frontCharacter.textContent = currentCard.front;
    frontPinyin.textContent = currentCard.frontSubtitle;
    backTranslation.textContent = currentCard.back;
    cardProgress.textContent = `${currentCardIndex + 1}/${hsk1Data.lessons[currentSet].length}`;

    // lesson title when we click to learn
    // this will be the same for all the cards in the lesson
    lessonTitle.textContent = hsk1Data.title + ' - ' + currentSet;  

    // Update navigation buttons
    nextButton.disabled = currentCardIndex === cards.length - 1;
    prevButton.disabled = currentCardIndex === 0;
}

// Start the app
initialize();