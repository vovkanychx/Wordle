const GRID = document.querySelector('.grid');
const ROWS = document.querySelectorAll('.row');
const CELLS = document.querySelectorAll('.cell');

ROWS.forEach((row, index) => {
    row.firstElementChild.classList.add('first'); // mark the first cell in the row
    row.lastElementChild.classList.add('last'); // mark the last cell in the row
})

CELLS.forEach((cell, index) => {
    cell.addEventListener('keydown', e => {
        // BACKSPACE HANDLING
        if (cell.classList.contains('first') && cell.value.length === 1 && e.key === 'Backspace') { // fix first cell focus on next cell if Backspace pressed
            cell.value = '';
        }
        if (cell.value.length === 1 && e.key === 'Backspace') { // focus on current cell if Backspace pressed and current has data then focus on the previous cell
            if (cell.classList.contains('last')) { // fix for overriding last cell value = '' when Enter was pressed then Backspace was pressed and inputs were editable
                return
            }
            cell.focus();
            cell.value = '';
            cell.previousElementSibling.focus();
        } else if (cell.value.length === 0 && e.key === 'Backspace') { // focus on previous cell if Backspace pressed and current has no data
            if (cell.classList.contains('first')) { // stop focusing on previous cell if current cell is the first one
                return
            }
            cell.previousElementSibling.focus();
            cell.value = '';
        }
        // ENTER HANDLING
        if (cell.parentElement.querySelector('.last').value.length === 1 && e.key === 'Enter') { // focus on the next row's first cell when enter pressed
            if (CELLS[CELLS.length - 1] === document.activeElement) { // if last cell is filled and enter hit, don't move to the next
                cell.parentElement.childNodes.forEach(child => { child.readOnly = true; child.disabled = true; }) // make inputs readonly and disabled after "Enter" pressed
                return;
            } else {
                cell.parentElement.childNodes.forEach(child => { child.readOnly = true; child.disabled = true; }) // make inputs readonly and disabled after "Enter" pressed
                cell.parentElement.nextElementSibling.firstElementChild.focus(); // focus on the first cell in the next row
            }
        }
        if (e.target.value.length === 1) { // focus on the next cell when current cell is filled
            if (e.target.classList.contains('last')) { // dont continue focusing on next cell if current is the last one in the row
                return;
            }
            CELLS[index].nextElementSibling.focus(); // focus on the next cell if it exists
        }
    })
})

function getRandomInt(max) {
    return Math.floor(Math.random() * max); // get random INT number
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

document.addEventListener('keydown', e => {
    const lastInRowCells = document.querySelectorAll('.last'); // get all last cells in all rows
    GUESSED_WORD += e.target.value; // save guessed word from inputs in a row of filled cells
    if (e.target.classList.contains('last') && e.key === 'Enter') {
        lastInRowCells.forEach(lastInRowCells => { // loop through all last in the rows cells
            Array.from(lastInRowCells.parentElement.children).forEach((cell, index) => { // take last row's cell parent, then parent's children and convert them to array and loop through
                if (cell.value.toLowerCase() === CURRENT_WORD[index].toLowerCase()) { // make lowercase each input value and today's word to guess, if they equal, add correct class to a cell
                    cell.classList.add('correct'); // CORRECT LETTERS HANDLING
                } else if (CURRENT_WORD.includes(cell.value.toLowerCase()) && cell.value !== '') { 
                    cell.classList.add('inword'); // IN WORD LETTERS HANDLING
                } else if (!CURRENT_WORD.includes(cell.value.toLowerCase()) && cell.value !== '') { 
                    cell.classList.add('wrong'); // WRONG LETTERS HANDLING
                }
            });
        });
        if (GUESSED_WORD.toLowerCase() === CURRENT_WORD.toLowerCase()) { // if all letters from guessed word match current word
            CELLS.forEach(cell => cell.disabled = true); // disable inputs
            return; // stop the game
        }
        GUESSED_WORD = ''; // reset guessed word when enter pressed
    }
})

CELLS.forEach(cell => {
    cell.addEventListener('select', e => {
        e.target.selectionStart = e.target.selectionEnd; // disable a selection in the cell that can be focused by Tab key press
    }, false)
});