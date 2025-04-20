import './theme.css'
import { useCallback, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { baseTheme } from './theme'

const snippet = `
import CodeMirror from '@uiw/react-codemirror';
import { createTheme } from '@uiw/codemirror-themes';
import { javascript } from '@codemirror/lang-javascript';
import { tags as t } from '@lezer/highlight';

const myTheme = createTheme({
  theme: 'dark',
  settings: {
    background: '#1e1e1e',
    backgroundImage: '',
    foreground: '#ffffff',
    caret: '#AEAFAD',
    selection: '#919191',
    selectionMatch: '#D6D6D6',
    gutterBackground: '#1e1e1e',
    gutterForeground: '#ffffff',
    gutterBorder: '#dddddd',
    gutterActiveForeground: '',
    lineHighlight: '#232323',
  },
  styles: [
    { tag: t.comment, color: '#606060' },
    { tag: t.name, color: '#6ac4dc' },
    { tag: t.definition(t.typeName), color: '#194a7b' },
    { tag: t.typeName, color: '#194a7b' },
    { tag: t.tagName, color: '#008a02' },
    { tag: t.variableName, color: '#0a84ff' },
    { tag: t.definition(t.variableName), color: '#ff40ff' },
    { tag: t.function(t.variableName), color: '#ff40ff' },
    { tag: t.className, color: '#9a244f' },
    { tag: t.constant(t.className), color: '#9a244f' },
    { tag: t.labelName, color: '#2e073e' },
    { tag: t.namespace, color: '#831100' },
    { tag: t.macroName, color: '#4d22b3' },
    { tag: t.literal, color: '#450e59' },
    { tag: t.string, color: '#1a0a53' },
    { tag: t.special(t.string), color: '#5c0700' },
    { tag: t.docString, color: '#e32400' },
    { tag: t.character, color: '#791a3e' },
    { tag: t.number, color: '#791a3e' },
    { tag: t.integer, color: '#ff6a00' },
    { tag: t.float, color: '#561029' },
    { tag: t.bool, color: '#e32400' },
  ],
});

function App() {
  return (
    <CodeMirror
      value="console.log('hello world!');"
      height="200px"
      theme={myTheme}
      extensions={[javascript({ jsx: true })]}
      onChange={(value, viewUpdate) => {
        console.log('value:', value);
      }}
    />
  );
}
export default App;
`

export default function Editor() {
    const [value, setValue] = useState(snippet)
    const onChange = useCallback((val, viewUpdate) => {
        console.log('val:', val)
        setValue(val)
    }, [])
    return (
        <CodeMirror
            value={value}
            height="200px"
            theme={baseTheme}
            extensions={[javascript({ jsx: true })]}
            onChange={onChange}
        />
    )
}
