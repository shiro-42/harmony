import { useCallback } from 'react'
import { Handle, Position } from '@xyflow/react'
import {
    Node,
    NodeContent,
    NodeDescription,
    NodeFooter,
    NodeHeader,
    NodeTitle,
} from '@/components/nodes/node'
import { Input } from '@/components/ui/input'

export function StringInput({ data, ...props }) {
    const onChange = useCallback((evt) => {
        console.log(evt.target.value)
    }, [])

    return (
        <Node {...props}>
            <Handle type="target" position={Position.Top} />
            <NodeHeader>
                <NodeTitle>String</NodeTitle>
                <NodeDescription>Type something</NodeDescription>
            </NodeHeader>
            <NodeContent>
                <Input onChange={onChange} className="nodrag" />
            </NodeContent>
            <Handle type="source" position={Position.Bottom} id="a" />
        </Node>
    )
}
