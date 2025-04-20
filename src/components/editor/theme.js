import { createTheme } from '@uiw/codemirror-themes'
import { tags as t } from '@lezer/highlight'

const bg0 = '#24273a'
const bg1 = '#8087a2'
const bg4 = '#6e738d'
const fg = '#cad3f5'
const fg3 = '#a5adcb'
const gray = '#b8c0e0'
const blue = '#8aadf4'
const yellow = '#eed49f'
const aqua = '#8aadf4'
const orange = '#f5a97f'
const primarybg = '#24273a'
const currentLine = '#363a4f'
const selection = '#5b6078'
const atom = '#b7bdf8'
const cursor = '#8087a2'
const keyword = '#ed8796'
const operator = '#91d7e3'
const number = '#f5a97f'
const definition = '#8aadf4'
const string = '#a6da95'

export const baseTheme = createTheme({
    theme: 'dark',
    settings: {
        background: 'oklch(0.145 0 0)',
        foreground: fg,
        caret: cursor,
        selection: selection,
        selectionMatch: selection,
        selectionBackground: selection,
        selectionForeground: fg,
        gutterBackground: 'oklch(0.145 0 0)',
        gutterForeground: fg3,
        lineHighlight: 'oklch(0.145 0 0)',
    },
    styles: [
        { tag: t.comment, color: gray },
        { tag: t.name, color: blue },
        { tag: t.className, color: blue },
        { tag: t.labelName, color: blue },
        { tag: t.namespace, color: blue },
        { tag: t.literal, color: blue },
        { tag: t.string, color: string },
        { tag: t.special(t.string), color: string },
        { tag: t.docString, color: string },
        { tag: t.character, color: string },
        { tag: t.number, color: number },
        { tag: t.bool, color: number },
        { tag: t.keyword, color: keyword },
        { tag: t.operator, color: operator },
        { tag: t.variableName, color: definition },
        { tag: t.function(t.variableName), color: definition },
        { tag: t.tagName, color: definition },
        { tag: t.typeName, color: definition },
        { tag: t.definition(t.typeName), color: definition },
    ],
})
