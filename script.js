const GRID = document.querySelector('.grid');
const ROWS = document.querySelectorAll('.row');
const CELLS = document.querySelectorAll('.cell');
const LAST = document.querySelectorAll('.last')

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
                cell.parentElement.childNodes.forEach(child => { child.readOnly = true }) // make inputs readonly after "Enter" pressed
                return;
            } else {
                cell.parentElement.childNodes.forEach(child => { child.readOnly = true }) // make inputs readonly after "Enter" pressed
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
