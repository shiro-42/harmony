import { useEffect, useCallback } from 'react'
import { Handle, Position } from '@xyflow/react'
import {
    Node,
    NodeContent,
    NodeDescription,
    NodeFooter,
    NodeHeader,
    NodeTitle,
} from '@/components/nodes/node'
import Editor from '@/components/editor'

export function JSONViewer({ data, ...props }) {
    const onChange = useCallback((evt) => {
        console.log(evt.target.value)
    }, [])

    return (
        <Node {...props}>
            <Handle type="target" position={Position.Top} />
            <NodeHeader>
                <NodeTitle>Result</NodeTitle>
            </NodeHeader>
            <NodeContent>
                <Editor />
            </NodeContent>
            <Handle type="source" position={Position.Bottom} id="a" />
        </Node>
    )
}
