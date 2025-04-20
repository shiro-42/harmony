import React from 'react'
import { pkgNamespace } from './constants.js'
import importMap from './importMap.js'

// Store import map in the global namespace
// This is a workaround for the fact that esbuild doesn't know modules compiled by vite
window[pkgNamespace] = importMap

// Import React everywhere esbuild is annoying otherwise
window.React = React
