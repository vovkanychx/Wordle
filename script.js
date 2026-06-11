import WORDS from "./words.js"

const cells = document.querySelectorAll(".cell")
const keys = document.querySelectorAll(".key")
const latinLettersRegex = /^[a-zA-Z]$/
const randomIndex = Math.floor(Math.random() * WORDS.length)
// const SECRET_WORD = WORDS[randomIndex].toUpperCase()
const SECRET_WORD = "CLOUD"
let GUESSED_WORD = ""
let isLastGuess = false
let isWin = false
console.log(SECRET_WORD)

let activeCell = cells[0]
window.addEventListener('DOMContentLoaded', () => {
    if (activeCell) activeCell.focus() // focus on first cell as game loads
})
document.addEventListener("mousedown", function(event) { // auto focus on cell if mouse clicked anywhere
    event.preventDefault()
    if (isWin) return
    if (activeCell) {
        activeCell.focus()
    } else {
        activeCell.nextElementSibling.focus()
    }
})
window.addEventListener("click", () => {
    activeCell = document.querySelector(".current")
})

document.addEventListener("keydown", function (event) {
    if (isWin) return
    const current = event.target
    const previous = event.target.previousElementSibling
    const next = event.target.nextElementSibling

    if (event.code === "Tab") { // disable tab indexing
        event.preventDefault()
        return
    }
    if (event.code === "Backspace") { // handle backspace
        eraseChar(event, current, previous)
    }

    if (event.code === "Enter") { // handle enter pressed/guess made
        if (current.id % 5 === 0) { // when enter and last cell of each row
            current.parentElement.querySelectorAll(".cell").forEach(cell => { // save inputs as 1 word
                GUESSED_WORD += cell.value.toUpperCase()
            });
            checkWord(current.parentElement, GUESSED_WORD, SECRET_WORD)
            checkWin(GUESSED_WORD, SECRET_WORD, cells)
            if (!current.parentElement.nextElementSibling) { // last guess aka last row
                isLastGuess = true
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

    isEmpty(current)
    addChar(current, next, event.key)
})

document.querySelector(".keyboard").addEventListener("mousedown", function (event) {
    event.stopImmediatePropagation()
    event.preventDefault()
    if (isWin) return
    if (event.target.matches(".key")) {
        const current = document.activeElement
        const next = current.nextElementSibling
        const previous = current.previousElementSibling
        const keyText = event.target.dataset.key.toUpperCase()

        if (!current || !current.matches(".cell")) return

        if (keyText === "BACKSPACE") {
            eraseChar(event, current, previous)
        }

        if (keyText === "ENTER") {
            if (current.id % 5 === 0) {
                const row = current.parentElement
                row.querySelectorAll(".cell").forEach(cell => { // save inputs as 1 word
                    GUESSED_WORD += cell.value.toUpperCase()
                })
                checkWord(row, GUESSED_WORD, SECRET_WORD)
                checkWin(GUESSED_WORD, SECRET_WORD, cells)
                if (!current.parentElement.nextElementSibling) { // last guess aka last row
                    isLastGuess = true
                    return 
                }
                current.parentElement.querySelectorAll(".cell").forEach(cell => cell.disabled = true) // disable current row's cells
                GUESSED_WORD = "" // reset guessed word after guess was made
                setTimeout(() => {
                    current.parentElement.nextElementSibling.firstElementChild.focus() // focus on first cell of next row
                    return
                }, 2000)
            } else {
                return
            }
        }

        if (!latinLettersRegex.test(keyText)) { // check if entered latin chars
            event.preventDefault()
            return
        }

        isEmpty(current)
        addChar(current, next, keyText)
    }
})

function addChar(currentElement, nextElement, value) {
    if (currentElement.value.length === 0) {
        currentElement.value = value
        currentElement.classList.add("full", "current")
    } else {
        if (nextElement) {
            nextElement.focus()
            nextElement.value = value
            currentElement.classList.remove("current")
            nextElement.classList.add("full", "current")
        }
    }
}

function eraseChar(event, currentElement, previousElement) {
    event.preventDefault()
    if (isLastGuess) return
    if (currentElement.value.length === 1) {
        currentElement.value = ""
        currentElement.classList.remove("full")
    } else {
        if (previousElement) {
            previousElement.focus()
            currentElement.classList.remove("current")
            previousElement.classList.remove("full")
            previousElement.value = ""
            previousElement.classList.add("current")
        }
    }
    return
}

function checkWord(row, guessedWord, secretWord) {
    let CurrentWordArray = guessedWord.toUpperCase().split("")
    let SecretWordArray = secretWord.toUpperCase().split("")
    let animationEnd = (secretWord.length - 1) * 400 + 800
    for (let i = 0; i < secretWord.length; i++) {
        let cell = row.querySelectorAll(".cell")[i];
        if (CurrentWordArray[i] === SecretWordArray[i]) {
            cell.classList.add("correct")
            setTimeout(() => {
                document.querySelector(`[data-key="${cell.value.toUpperCase()}"]`).classList.add("correct")
            }, animationEnd)
            SecretWordArray[i] = null; 
            CurrentWordArray[i] = null; 
        }
    }
    for (let i = 0; i < secretWord.length; i++) {
        let cell = row.querySelectorAll(".cell")[i]
        let finalClass = "wrong"
        if (cell.classList.contains("correct")) {
            finalClass = "correct"
        } else {
            let poolIndex = SecretWordArray.indexOf(CurrentWordArray[i])
            if (poolIndex !== -1) {
                finalClass = "match"
                SecretWordArray[poolIndex] = null
            }
        }
        const delay = i * 400
        cell.classList.add("flip")
        cell.style.animationDelay = `${delay}ms`
        cell.style.transitionDelay = `${delay + 400}ms`
        cell.classList.add(finalClass)

        let originalLetter = CurrentWordArray[i]; 
        let key = document.querySelector(`[data-key="${originalLetter}"]`);
        setTimeout(() => {
            if (key) {
                if (finalClass === "correct") {
                    key.classList.remove("match", "wrong")
                    key.classList.add("correct")
                } 
                else if (finalClass === "match") {
                    if (!key.classList.contains("correct")) {
                        key.classList.remove("wrong")
                        key.classList.add("match")
                    }
                } 
                else if (finalClass === "wrong") {
                    if (!key.classList.contains("correct") && !key.classList.contains("match")) {
                        key.classList.add("wrong")
                    }
                }
            }
        }, animationEnd)
    }
}

function checkWin(guessedWord, secretWord, cellsArray) {
    for (let i = 0; i < secretWord.length; i++) { // check win
        if (guessedWord.toUpperCase() === secretWord.toUpperCase()) {
            console.log("WIN")
            cellsArray.forEach(cell => cell.disabled = true) // disable all cells because win
            isWin = true
            return
        }
    }
}

function isEmpty(cell) {
    if (cell.value.length === 0) {
        cell.classList.remove("full")
    }
}