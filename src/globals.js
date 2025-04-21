import React from 'react'
import { namespace } from './constants.js'
import importMap from './importMap.js'

// Store import map in the global namespace
// This is a workaround for the fact that esbuild doesn't know modules compiled by vite
window[namespace] = importMap

export const getComfySpace = () => `window['${namespace}']`

// Import React everywhere esbuild is annoying otherwise
window.React = React
