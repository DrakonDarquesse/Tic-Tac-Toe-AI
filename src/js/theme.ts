import { dark, light } from "./constants"

function checkDarkTheme() {
    const isUserSetDark = localStorage.getItem('theme') == dark
    const isThemeDark = window.matchMedia("(prefers-color-scheme: dark)")?.matches
    return isUserSetDark || isThemeDark
}

export const setThemeOnLoad = (themeToggle: HTMLSpanElement) => {
    const theme = checkDarkTheme() ? dark : light
    document.documentElement.setAttribute("data-theme", theme)
    themeToggle.textContent = theme
}

export const switchTheme = (evt: Event) => {
    const themeToggle = evt.target as HTMLSpanElement
    const newTheme = themeToggle.textContent
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
    themeToggle.textContent = newTheme == dark ? light : dark
}
