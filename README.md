# Harmony

Create your application from the ground up using no code.
To proof Harmony work we built the ui using itself.

## Cool ideas

- Use the same code to build the UI and the backend

## Concepts

Node: Have an internal state, a list of edges and can inherit a context
Edge: defines the relationship between source and sink
Socket: the type of the edge

## TODO
•	Cache compiled files by graph hash (injectDependencies() checksum + node IDs)
•	Add file watching and auto recompile on node edit
•	Inject debug flags into runtime code via getComfySpace()
•	Eventually wrap scriptResolver() into a reactive signal to support hot reloads