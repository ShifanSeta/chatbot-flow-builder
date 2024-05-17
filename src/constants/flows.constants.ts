import { Edge, Node } from "reactflow";



export const initialEdges: Edge[] = []

export const initialNodes: Node[]= [
    {
        id: "1",
        position: {x: 0, y:0},
        data: {
            label: "Hey There"
        },
        type: "messageInit"
    },
]
