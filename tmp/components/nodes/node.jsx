import './node.css'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { cn } from '@/grimoire/utils'

export function Node({
    className,
    selected,
    id,
    parentId,
    data,
    dragHandle,
    type,
    isConnectable,
    zIndex,
    positionAbsoluteX,
    positionAbsoluteY,
    deletable,
    selectable,
    dragging,
    targetPosition,
    sourcePosition,
    ...props
}) {
    return (
        <Card
            className={cn(
                'harmony-node border-[1px]',
                'hover:shadow-sm hover:shadow-zinc-500/50',
                'rounded-sm',
                selected ? 'border-zinc-500' : 'border-zinc-700',
                className
            )}
            {...props}
        />
    )
}

export function NodeHeader({ className, ...props }) {
    return <CardHeader className={cn('', className)} {...props} />
}
export function NodeContent({ className, ...props }) {
    return <CardContent className={cn('', className)} {...props} />
}
export function NodeFooter({ className, ...props }) {
    return <CardFooter className={cn('', className)} {...props} />
}
export function NodeTitle({ className, ...props }) {
    return <CardTitle className={cn('', className)} {...props} />
}

export function NodeDescription({ className, ...props }) {
    return <CardDescription className={cn('', className)} {...props} />
}
