const GRID = document.querySelector('.grid');
const ROWS = document.querySelectorAll('.row');
const CELLS = document.querySelectorAll('.cell');
const LAST = document.querySelectorAll('.last')

CELLS.forEach((cell, index) => {
    cell.addEventListener('keyup', e => {
        if (cell.value.length === 1 && e.key === 'Enter') { // focus on the next row's first cell when enter pressed
            if (CELLS[CELLS.length - 1] === document.activeElement) { // if last cell is filled and enter hit, don't move to the next
                cell.parentElement.childNodes.forEach(child => { child.readOnly = true }) // make inputs readonly after "Enter" pressed
                return;
            } else {
                cell.parentElement.childNodes.forEach(child => { child.readOnly = true }) // make inputs readonly after "Enter" pressed
                cell.parentElement.nextElementSibling.firstElementChild.focus(); // focus on the next cell
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

ROWS.forEach((row, index) => {
    row.lastElementChild.classList.add('last'); // mark the last cell in the row

    // document.addEventListener('keydown', e => {
    //     if (e.key === 'Enter' && row.lastElementChild.value.length === 1) {
    //         row.nextElementSibling.firstElementChild.focus();
    //     }
    // })
})
