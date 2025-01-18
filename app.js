// DOM Elements
const menuScreen = document.getElementById('menu-screen');
const reviewModeScreen = document.getElementById('review-mode-container');

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

    initializeLessonReview()
}

function initializeLessonReview() {
    // Populate the lesson selector dropdown
    const lessonSelect = document.getElementById('lesson-select');
    const lessonKeys = Object.keys(hsk1Data.lessons);

    // Add options for each lesson
    lessonKeys.forEach((lessonName, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        
        // Calculate total cards up through this lesson
        const totalCards = lessonKeys
            .slice(0, index + 1)
            .reduce((sum, key) => sum + hsk1Data.lessons[key].length, 0);
            
        option.textContent = `Through Lesson ${lessonName} (${totalCards} cards)`;
        lessonSelect.appendChild(option);
    });

    // Add review button event listener
    document.getElementById('start-review').addEventListener('click', startReviewMode);

}

// Navigation Functions
function showMenu() {
    // show language selection menu
    menuScreen.style.display = 'flex';
    flashcardScreen.style.display = 'none';
    currentSet = null;

    // show the review mode section
    reviewModeScreen.style.display = 'flex';
}

function startSet(lessonName) {
    currentSet = lessonName;
    currentCardIndex = 0;
    currentCards = shuffleArray(hsk1Data.lessons[lessonName]);  // Shuffle cards when starting a lesson
    menuScreen.style.display = 'none';
    flashcardScreen.style.display = 'flex';
    card.classList.remove('flipped');  // Reset card to front face if it isn't
    updateCard();

    // we are going to do our set, so hide the review mode section
    reviewModeScreen.style.display = 'none';
}

// Get combined cards from selected lessons
function getCombinedReviewCards() {
    const selectedIndex = parseInt(document.getElementById('lesson-select').value);
    const lessonKeys = Object.keys(hsk1Data.lessons);
    const lessonsToReview = lessonKeys.slice(0, selectedIndex);
    
    let reviewCards = [];
    lessonsToReview.forEach(lessonName => {
        reviewCards.push(...hsk1Data.lessons[lessonName]);
    });
    
    return {
        cards: shuffleArray(reviewCards),
        firstLesson: lessonsToReview[0],
        lastLesson: lessonsToReview[lessonsToReview.length - 1]
    };
}

// Update the UI elements for review mode
function updateReviewUI(firstLesson, lastLesson, totalCards) {
    lessonTitle.textContent = `Review: ${firstLesson} through ${lastLesson} (${totalCards} cards)`;
    cardProgress.textContent = `1/${totalCards}`;
    
    // Reset navigation buttons
    prevButton.disabled = true;
    nextButton.disabled = currentCardIndex === totalCards - 1;
}

// Switch display to flashcard screen
function showFlashcardScreen() {
    menuScreen.style.display = 'none';
    flashcardScreen.style.display = 'flex';
    card.classList.remove('flipped');
}

// Main review mode function
function startReviewMode() {
    // Get the review cards and lesson range
    const { cards, firstLesson, lastLesson } = getCombinedReviewCards();
    
    // Set the current state
    currentCards = cards;
    currentSet = `Review through ${lastLesson}`;
    currentCardIndex = 0;
    
    // Update UI elements
    updateReviewUI(firstLesson, lastLesson, cards.length);
    showFlashcardScreen();
    updateCard();

    // hide the review mode
    reviewModeScreen.style.display = 'none';
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