import { board } from "./board";
import { aiFirstBtn, humanFirstBtn, twoPlayerBtn } from './button';
import { setThemeOnLoad, switchTheme } from "./theme";

window.onload = () => {
    board.createSpaces();
    aiFirstBtn().append()
    humanFirstBtn().append()
    twoPlayerBtn().append()
    
    const themeToggle = document.getElementById('themeToggle')
    setThemeOnLoad(themeToggle)
    themeToggle.addEventListener('click', switchTheme)
}


