const GRID = document.querySelector('.grid');
const ROWS = document.querySelectorAll('.row');
const CELLS = document.querySelectorAll('.cell');
const WINSTREAK = document.querySelector('.winstreak').firstElementChild;
const settingsDialog = document.getElementById('dialog_settings');
const settingsBtn = document.getElementById('settings');
const themeBtn = document.getElementById('theme');
const hintBtn = document.getElementById('hint');
const charsBtn = document.getElementById('characters');
const infoBtn = document.getElementById('info');
const closeSettingsBtn = document.querySelector('.close.dialog_settings');

let isWin;
let winStreak = 0;

localStorage.getItem('winStreak') == null ? localStorage.setItem('winStreak', winStreak) : winStreak = Number.parseInt(localStorage.getItem('winStreak'));
localStorage.getItem('winStreak') == null ? WINSTREAK.textContent = 0 : WINSTREAK.textContent = localStorage.getItem('winStreak');

console.log(localStorage.getItem('winStreak'))

function getRandomInt(max) {
    return Math.floor(Math.random() * max); // get random INT number
}

function overlayClickClose(event) {
    if (event.target === this) {
        this.close();
    }
}

const WORDS = { // JSON object containing 5 letter words
    1: 'nigga',
    2: 'crack',
    3: 'whore',
    4: 'sluts',
    5: 'floyd'
}

const WORDS_LENGTH = Object.keys(WORDS).length; // length of objects in JSON object named WORDS
const CURRENT_WORD = WORDS[getRandomInt(WORDS_LENGTH) + 1]; // get today's word guess from JSON object named WORDS
let GUESSED_WORD = ''; // initialize guessed word in a row

console.log(CURRENT_WORD);

ROWS.forEach((row, index) => {
    row.firstElementChild.classList.add('first'); // mark the first cell in the row
    row.lastElementChild.classList.add('last'); // mark the last cell in the row
})

CELLS.forEach((cell, index) => {
    cell.addEventListener('keydown', e => {
        // BACKSPACE HANDLING
        if (e.key === 'Backspace') {
            if (e.target.value.length === 0) {
                if (e.target.previousElementSibling === null) { return } // if first cell in a row is empty and backspace hit - stop focusing
                e.target.previousElementSibling.focus();
            }
            else if (e.target.value.length > 0) {
                e.target.value = '';
            }
        }
        // CELLS FOCUSING HANDLING
        if (e.target.value.length === 1) { // focus on the next cell when current cell is filled
            if (e.target.classList.contains('last')) { // if last row's cell is active at the moment
                if (e.key === 'Enter') { // when Enter was pressed
                    if (e.target.parentElement.nextElementSibling === null) { return } // stop if there's no next row (last row at the moment active)
                    e.target.parentElement.nextElementSibling.firstElementChild.focus(); // focus on the next row's first cell
                }
            } else {
                e.target.nextElementSibling.focus(); // focus on the next cell if it exists
            }
        }
    })
})

document.addEventListener('keydown', e => {
    if (e.key === ' ' || e.key === 'Spacebar') { // ' ' is standard, 'Spacebar' was used by IE9 and Firefox < 37
        e.preventDefault()
    }
    const lastInRowCells = document.querySelectorAll('.last'); // get all last cells in all rows
    if (e.target.classList.contains('last') && e.key === 'Enter') {
        Array.from(e.target.parentElement.children).forEach(guess => GUESSED_WORD += guess.value) // save guessed word from inputs in a row of filled cells
        // LETTERS CHECKING
        lastInRowCells.forEach(lastInRowCells => { // loop through all last in the rows cells
            Array.from(lastInRowCells.parentElement.children).forEach((cell, index) => { // take last row's cell parent, then parent's children and convert them to array and loop through
                if (cell.value.toLowerCase() === CURRENT_WORD[index].toLowerCase()) { // make lowercase each input value and today's word to guess, if they equal, add correct class to a cell
                    cell.classList.add('correct'); // CORRECT LETTERS HANDLING
                } else if (CURRENT_WORD.includes(cell.value.toLowerCase()) && cell.value !== '') { 
                    cell.classList.add('inword'); // IN WORD LETTERS HANDLING
                } else if (!CURRENT_WORD.includes(cell.value.toLowerCase()) && cell.value !== '') { 
                    cell.classList.add('wrong'); // WRONG LETTERS HANDLING
                    isWin = false;
                }
            });
        });
        // WIN HANDLING
        if (GUESSED_WORD.toLowerCase() === CURRENT_WORD.toLowerCase()) { // if all letters from guessed word match current word
            CELLS.forEach(cell => cell.disabled = true); // disable inputs
            winStreak += 1;
            localStorage.setItem('winStreak', winStreak);
            WINSTREAK.textContent = winStreak;
            isWin = true;
            console.log(localStorage)
            return; // stop the game
        }
        GUESSED_WORD = ''; // reset guessed word when enter pressed
        isWin === false ? localStorage.setItem('winStreak', 0) : isWin;
    }
})

CELLS.forEach(cell => {
    cell.addEventListener('select', e => {
        e.target.selectionStart = e.target.selectionEnd; // disable a selection in the cell that can be focused by Tab key press
    }, false)
});

CELLS[CELLS.length - 1].addEventListener('keydown', e => { // last cell in the grid
    if (e.key === 'Enter' && e.target.value.length === 1) {
        // LOSE HANDLING
        isWin === false ? console.log('loss') : console.log('win')
            console.log('end')
            return
    } else {
        console.log('not end')
    }
})

settingsBtn.addEventListener('click', (e) => {
    settingsDialog.showModal();
})

closeSettingsBtn.addEventListener('click', (e) => {
    settingsDialog.close();
})

settingsDialog.addEventListener('click', overlayClickClose)
settingsDialog.addEventListener('cancel', e => { e.target.close() })