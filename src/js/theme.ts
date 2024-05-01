import { dark, light } from "./constants"

const checkSetTheme = localStorage.getItem('theme')

const checkDefaultTheme = window.matchMedia("(prefers-color-scheme: dark)")?.matches ? dark : light

const themeInverse = (theme: string) => theme == light ? dark : light

const setTheme = (theme: string, themeToggle: HTMLSpanElement) => {
    document.documentElement.setAttribute("data-theme", theme)
    themeToggle.textContent = themeInverse(theme)
}

export const setThemeOnLoad = (themeToggle: HTMLSpanElement) => {
    const theme = checkSetTheme ?? checkDefaultTheme
    setTheme(theme, themeToggle)
}

export const switchTheme = (evt: Event) => {
    const themeToggle = evt.target as HTMLSpanElement
    const newTheme = themeToggle.textContent
    localStorage.setItem('theme', newTheme)
    setTheme(newTheme, themeToggle)
}
