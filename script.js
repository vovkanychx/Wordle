import WORDS from "./words.js"

const cells = document.querySelectorAll(".cell")
const latinLettersRegex = /^[a-zA-Z]$/
const randomIndex = Math.floor(Math.random() * WORDS.length);
const SECRET_WORD = WORDS[randomIndex].toUpperCase();
let GUESSED_WORD = ""
console.log(SECRET_WORD)

let activeCell = cells[0]
window.addEventListener('DOMContentLoaded', () => {
    if (activeCell) activeCell.focus(); // focus on first cell as game loads
});

document.addEventListener("keydown", function (event) {
    const current = event.target
    const previous = event.target.previousElementSibling
    const next = event.target.nextElementSibling
    activeCell = current // for autofocus when mouse clicked

    if (event.code === "Tab") return // allow tab indexing
    if (event.code === "Backspace") { // handle backspace
        event.preventDefault()
        current.value = ""
        current.classList.remove("full")
        if (previous) {
            previous.focus()
        }
        return;
    }

    if (event.code === "Enter") { // handle enter pressed/guess made
        if (current.id % 5 === 0) { // when enter and last cell of each row
            current.parentElement.querySelectorAll(".cell").forEach(cell => { // save inputs as 1 word
                GUESSED_WORD += cell.value
            });
            CheckWord(current.parentElement)
            for (let i = 0; i < SECRET_WORD.length; i++) { // check win
                if (GUESSED_WORD.toUpperCase() === SECRET_WORD.toUpperCase()) {
                    console.log("WIN")
                    cells.forEach(cell => cell.disabled = true) // disable all cells because win
                    event.preventDefault()
                    return
                }
            }
            if (!current.parentElement.nextElementSibling) { // last guess aka last row
                console.log('end')
                return 
            }
            current.parentElement.querySelectorAll(".cell").forEach(cell => cell.disabled = true) // disable current row's cells
            GUESSED_WORD = "" // reset guessed word after guess was made
        }
        // current.parentElement.nextElementSibling.firstElementChild.focus() // focus on first cell of next row
        return
    }

    if (!latinLettersRegex.test(event.key)) { // check if entered latin chars
        event.preventDefault()
        return
    }

    if (current.value.length === 0) { // assing entered key to input's value
        current.value = event.key
        current.classList.add("full")
    } else {
        if (next) { // focus on next cell
            next.focus()
            next.value = event.key
            next.classList.add("full")
        }
    }
})

function CheckWord(row) {
    let CurrentWordArray = GUESSED_WORD.split("")
    let SecretWordArray = SECRET_WORD.split("")

    for (let i = 0; i < SECRET_WORD.length; i++) {
        let poolIndex = SecretWordArray.indexOf(CurrentWordArray[i]);

        if (CurrentWordArray[i].toUpperCase() === SecretWordArray[i].toUpperCase()) {
            row.querySelectorAll(".cell")[i].classList.add("correct")
        }
        else if (poolIndex !== -1) {
            row.querySelectorAll(".cell")[i].classList.add("match")
        } 
        else {
            row.querySelectorAll(".cell")[i].classList.add("wrong")
        }
    
        const delay = i * 400
        row.querySelectorAll(".cell")[i].style.cssText = 
            `animation: RotateTile 800ms ${delay}ms linear;
            transition: background 800ms ${delay}ms, border 800ms ${delay}ms;`
    }
}

document.addEventListener('mousedown', function(event) { // auto focus on cell if mouse clicked anywhere
    event.preventDefault(); 
    if (activeCell) {
        activeCell.focus();
    }
})