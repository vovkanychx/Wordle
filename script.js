document.querySelectorAll('.cell').forEach((cell, index) => {
    cell.addEventListener('keyup', e => {
        if (document.querySelector('.grid').lastElementChild.value.length === 1) { //stop keyup event listener at the last cell when it's filled
            return
        }
        if (e.target.value.length === 1) { // focus on the next cell when current cell is filled
            document.querySelectorAll('.cell')[index].nextElementSibling.focus();
        }
    })
})
