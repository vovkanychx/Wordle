import WORDS from "./words.js"

const cells = document.querySelectorAll(".cell")
const keys = document.querySelectorAll(".key")
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

    if (event.code === "Tab") { // disable tab indexing
        event.preventDefault()
        return
    }
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
                GUESSED_WORD += cell.value.toUpperCase()
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
        setTimeout(() => {
            current.parentElement.nextElementSibling.firstElementChild.focus() // focus on first cell of next row
            return
        }, 2000)
        return
    }

    if (!latinLettersRegex.test(event.key)) { // check if entered latin chars
        event.preventDefault()
        return
    }

    if (current.value.length === 0) { // assing entered key to input's value
        current.value = event.key
        current.classList.add("full")
    } 
    else {
        if (next) { // focus on next cell
            next.focus()
            next.value = event.key
            next.classList.add("full")
        }
    }
})

function CheckWord(row) {
    let CurrentWordArray = GUESSED_WORD.toUpperCase().split("")
    let SecretWordArray = SECRET_WORD.toUpperCase().split("")

    for (let i = 0; i < SECRET_WORD.length; i++) {
        let cell = row.querySelectorAll(".cell")[i]
        let poolIndex = SecretWordArray.indexOf(CurrentWordArray[i]);

        if (CurrentWordArray[i] === SecretWordArray[i]) {
            row.querySelectorAll(".cell")[i].classList.add("correct")
        }
        else if (poolIndex !== -1) {
            row.querySelectorAll(".cell")[i].classList.add("match")
        } 
        else {
            row.querySelectorAll(".cell")[i].classList.add("wrong")
        }
    
        const delay = i * 400
        cell.classList.add("flip")
        cell.style.animationDelay = `${delay}ms`;
        cell.style.transitionDelay = `${delay}ms`;
    }
}

document.addEventListener("mousedown", function(event) { // auto focus on cell if mouse clicked anywhere
    event.preventDefault(); 
    if (activeCell) {
        activeCell.focus();
    }
})

document.querySelector(".keyboard").addEventListener("click", function KeyClick(event) {
    event.preventDefault()
    if (event.target.matches(".key")) {
        if (activeCell.value.length === 0) {
            activeCell.value = event.target.dataset.key.toUpperCase()
            activeCell.classList.add("full")
            setTimeout(() => {
                activeCell.nextElementSibling.focus()
                activeCell.nextElementSibling.select()
            }, 0);
            } else {
                if (activeCell.value.length === 1) {
                    setTimeout(() => {
                        activeCell.nextElementSibling.focus()
                        activeCell.nextElementSibling.select()
                    }, 0);
                }
            }
    }
    console.log(activeCell)
})

// document.querySelector(".keyboard").addEventListener("mousedown", function KeyClick(event) {
//     if (!event.target.matches(".key")) return
//     event.preventDefault()

//     const active = document.activeElement
//     if (!active || !active.matches(".cell")) return
//     const keyText = event.target.dataset.key.toUpperCase()

//     active.value = keyText;
//     active.classList.add("full");

//     const freshCells = document.querySelectorAll('.cell');
//     const cellsArray = Array.from(freshCells);
//     const currentIndex = cellsArray.indexOf(active);

//     if (currentIndex !== -1 && currentIndex < cellsArray.length - 1) {
//         const nextCell = cellsArray[currentIndex + 1];

//         setTimeout(() => {
//             nextCell.focus();
            
//             // Якщо на мобільних пристроях фокус усе одно вередує, 
//             // цей рядок примусово виділить наступний інпут
//             nextCell.select(); 
//         }, 0);
//     }
// });