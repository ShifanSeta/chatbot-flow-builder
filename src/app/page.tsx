"use client";
import MessageInit from "@/components/MessageInit";
import { initialEdges, initialNodes } from "@/constants/flows.constants";
import { Button, Input, Textarea } from "@nextui-org/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  ReactFlowProvider,
  Edge,
} from "reactflow";
import Image from "next/image";
import "reactflow/dist/style.css";
import toast from "react-hot-toast";

export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isSelectable, setIsSelectable] = useState(false);
  const [reactFlowInstance, setReactFlowInstance]: any = useState(null);
  const [nodeName, setNodeName] = useState("Node 1");
  const [nodeId, setNodeId]: any = useState({});

  useEffect(() => {
    let NodeData = localStorage.getItem("nodesData") || '';
    if(NodeData && NodeData != ''){
      NodeData = JSON.parse(NodeData);
    }
    let EdgeData = localStorage.getItem("edgesData") || '';
    if(EdgeData && EdgeData != ''){
      EdgeData = JSON.parse(EdgeData);
    }
    if (NodeData && NodeData.length >= 1 && typeof NodeData != 'string' ) {
      setNodes(NodeData)
    }else{
      setNodes(initialNodes)
    }
    if (EdgeData && EdgeData.length >= 1 && typeof EdgeData != 'string' ) {
      setEdges(EdgeData)
    }else{
      setEdges(initialEdges)
    }    

  },[])
  //onClick features for drag button and input change
  const onNodeClick = (event: any, node: any) => {
    setNodeId(node);
    setNodeName(node.data.label);
    setIsSelectable(true);
  };
  

  const nodeTypes = useMemo(
    () => ({
      messageInit: MessageInit,
    }),
    []
  );

  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  // connection 
  const onConnect = useCallback(
    (params: any) => {
      const existingConnections = edges.filter(
        (edge) =>
          edge.source === params.source &&
          edge.sourceHandle === params.sourceHandle
      );

      if (existingConnections.length === 0) {
        setEdges((eds) => addEdge(params, eds));
      } else {
        console.log("Only one connection allowed from this handle.");
      }
    },
    [edges]
  );
  let id = 0;
  const getId = () => `dndnode_${id++}`;

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type: "messageInit",
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },

    [reactFlowInstance]
  );

  //drag feature function

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId.id) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          node.data = {
            ...node.data,
            label: nodeName,
          };
        }
        return node;
      })
    );
  }, [nodeName, setNodes]);

  const hasEmptyTargetHandle = (nodeId: string, edges: Edge[]): boolean => {
    return !edges.some((edge) => edge.target === nodeId);
  };


// useEffect to check for nodes with empty target handles
const checkNodesWithEmptyTargets = () => {
    const nodesWithEmptyTargetHandles = nodes.filter((node) =>
      hasEmptyTargetHandle(node.id, edges)
    );
    if (nodesWithEmptyTargetHandles.length > 1) {
      toast.error("Cannot save Flow");
    }else{
      const nodesData = JSON.stringify(nodes)     
      const edgesData = JSON.stringify(edges)    
      localStorage.setItem("nodesData", nodesData );
      localStorage.setItem("edgesData", edgesData );
      toast.success("Flow Saved Sucessfully")
    }
  };

  return (
    <>
    <main className="bg-white text-black max-md:hidden">
      <nav className=" sticky top-0 z-50 flex w-screen justify-end items-center p-2 bg-[#f3f2f4]">
        <Button
          style={{ border: "2px solid #4b69c8", marginRight: "30px" }}
          className="rounded-lg text-[#4b69c8]"
          variant="bordered"
          onClick={() => checkNodesWithEmptyTargets()}
        >
          Save Changes
        </Button>
      </nav>
      <section className="flex justify-between items-start">
        <div style={{ width: "100vw", height: "100vh" }}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView={true}
              nodeTypes={nodeTypes}
              onNodeClick={onNodeClick}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onInit={setReactFlowInstance}
            >
              <Background />
              <Controls />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
        <div
          className="w-[300px]"
          style={{ borderLeft: "1px solid black", height: "100vh" }}
        >
          {!isSelectable ? (
            <div
              draggable
              onDragStart={(event) => onDragStart(event, "default")}
              style={{ border: "1px solid #4b69c8", width: "50%" }}
              className="flex flex-col m-3 justify-center rounded items-center p-1"
            >
              <Image
                src="/images/message-btn.svg"
                className="text-[#7587ee]"
                alt="message"
                height={20}
                width={20}
              />
              <p className="text-[#7587ee]">Message</p>
            </div>
          ) : (
            <div>
              <div className="flex justify-center bg-light sticky items-center p-2">
                <Image
                  className="absolute right-[218px]"
                  onClick={() => setIsSelectable(false)}
                  src="/images/arrow.png"
                  alt="arrow"
                  width={15}
                  height={15}
                />
                <p className="">Message</p>
              </div>
              <Textarea
                className="px-2"
                label="Enter Flow Name"
                variant="bordered"
                type="text"
                size="sm"
                placeholder="Enter Text"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
              >
                {nodeName}
              </Textarea>
              <hr className="m-2 mt-4" />
            </div>
          )}
        </div>
      </section>
    </main>
    <main className="lg:hidden md:hidden flex justify-center items-center text-center h-screen card">
            <h1 className="text-xl">In Able to use the service desktop view is required</h1>
    </main>
    </>
    
  );
}
