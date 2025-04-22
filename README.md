# Harmony

Create your application from the ground up using no code.
To proof Harmony work we built the ui using itself.

## Cool ideas

- Use the same code to build the UI and the backend

## Concepts

| Concept           | Name                 | Description                                                                 |
| ----------------- | -------------------- | --------------------------------------------------------------------------- |
| The Whole App     | World                | The total environment—where dimensions, systems, and echoes live.          |
| Workspace         | Dimension            | A localized realm with its own logic, layout, and perception of reality.    |
| Node              | System               | A self-contained function or entity. Think of it as a living machine.       |
| Edge              | Connection           | A visible line of communication between Systems. Data. Power. Memory.       |
| Socket            | Sens                 | A sensory port on a System. Not just input/output—it's perception.         |
| Node Group        | Higher System        | Recursive clusters of Systems and Connections. Complex thoughts.            |
| Saved Views       | Mirage               | A specific way to visualize a Dimension or System. Like memories.           |
| App State Context | Reality              | The current truth of the World. Can be overridden by Dimensions or Systems. |
| Root System       | First Circle of Hell | The bootstrapping point of the World. Every journey starts here.            |
| Reactive Event    | Echo                 | A ripple through Reality. Triggers reactions, effects, or flows.            |

## TODO

•	Cache compiled files by graph hash (injectDependencies() checksum + node IDs)
•	Add file watching and auto recompile on node edit
•	Inject debug flags into runtime code via getComfySpace()
•	Eventually wrap scriptResolver() into a reactive signal to support hot reloads
