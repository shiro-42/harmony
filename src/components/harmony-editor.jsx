import { useState, useCallback } from 'react'
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react'
import { ReactFlow, Controls, Background } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { nodeTypes } from '@/components/nodes'
import { SidebarTrigger } from '@/components/ui/sidebar'

const initialNodes = [
    { id: '1', position: { x: 100, y: 100 }, data: { label: '1' } },
    { id: '2', position: { x: 100, y: 300 }, data: { label: '2' } },
    {
        id: '3',
        type: 'StringInput',
        position: { x: 100, y: 500 },
        data: { value: '2' },
    },
    {
        id: '4',
        type: 'JSONViewer',
        dragHandle: 'drag-handle__label',
        position: { x: 100, y: 500 },
        data: { value: '2' },
    },
]
const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', label: 'to', type: 'smoothstep' },
]

function useNodesChanges(setNodes) {
    return useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    )
}

function useEdgesChanges(setEdges) {
    return useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    )
}

export default function ({ ...props }) {
    const [nodes, setNodes] = useState(initialNodes)
    const [edges, setEdges] = useState(initialEdges)

    const onNodesChange = useNodesChanges(setNodes)
    const onEdgesChange = useEdgesChanges(setEdges)

    return (
        <div className="h-full w-full">
            <ReactFlow
                colorMode="dark"
                nodes={nodes}
                onNodesChange={onNodesChange}
                edges={edges}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                onPaneScroll={(e) => console.log(e)}
                fitView
                {...props}
            >
                <Background />
                <Controls position="top-left">
                    <SidebarTrigger
                        variant="ghost"
                        className="bg-zinc-800 rounded-none w-full hover:bg-zinc-400"
                    />
                </Controls>
            </ReactFlow>
        </div>
    )
}
