import { makeAutoObservable } from 'mobx'

export function createWorld() {
    const world = makeAutoObservable({})

    return world
}
