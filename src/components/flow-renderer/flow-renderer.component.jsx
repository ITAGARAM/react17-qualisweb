import React, {useCallback, useState } from 'react';

import ReactFlow, {
  addEdge,
  //MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';

//import { nodes as initialNodes, edges as initialEdges } from './initial-element';

import './react-flow-style.css';

const onInit = (reactFlowInstance) => console.log('flow loaded:', reactFlowInstance);

//const getNodeId = () => `randomnode_${+new Date()}`;

const FlowRenderer = (props) => {
        const [nodes, setNodes, onNodesChange] = useNodesState(props.initialNodes);
        const [edges, setEdges, onEdgesChange] = useEdgesState(props.initialEdges);
 
        // const [rfInstance, setRfInstance] = useState(null);
        // const { setViewport } = useReactFlow();
  
        const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
        // const onSave = useCallback(() => {
        //   if (rfInstance) {
        //     const flow = rfInstance.toObject();
        //     localStorage.setItem(flowKey, JSON.stringify(flow));
        //   }
        // }, [rfInstance]);
  
        // const onRestore = useCallback(() => {
        //   const restoreFlow = async () => {
        //     const flow = JSON.parse(localStorage.getItem(flowKey));
    
        //     if (flow) {
        //       const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        //       setNodes(flow.nodes || []);
        //       setEdges(flow.edges || []);
        //       setViewport({ x, y, zoom });
        //     }
        //   };
  
        //   restoreFlow();
        // }, [setNodes, setViewport]);

        // const onAdd = useCallback(() => {
        //     const newNode = {
        //     id: getNodeId(),
        //     data: { label: 'Added node' },
        //     position: {
        //         x: Math.random() * window.innerWidth - 100,
        //         y: Math.random() * window.innerHeight,
        //     },
        //     };
        //     setNodes((nds) => nds.concat(newNode));
        // }, [setNodes]);

        const [zoomOnScroll, setZoomOnScroll] = useState(false);

        return (
            <div style={{ height: 600 }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    //onNodesChange={onNodesChange}
                    //onEdgesChange={onEdgesChange}
                    zoomOnScroll={zoomOnScroll}
                    onConnect={onConnect}
                    onInit={onInit}
                    fitView
                    attributionPosition="top-right"
                    
                >
                    {/* <MiniMap
                        nodeStrokeColor={(n) => {
                        if (n.style?.background) return n.style.background;
                        if (n.type === 'input') return '#0041d0';
                        if (n.type === 'output') return '#ff0072';
                        if (n.type === 'default') return '#1a192b';
                        return '#eee';
                        }}
                        nodeColor={(n) => {
                        if (n.style?.background) return n.style.background;

                        return '#fff';
                        }}
                        nodeBorderRadius={2}
                    /> */}
                    <Controls showInteractive={false}/>
                    <Background color="#aaa" gap={16} />
                    
                    {/* <div className="save__controls">
                        <button onClick={onSave}>save</button>
                        <button onClick={onRestore}>restore</button>
                        <button onClick={onAdd}>Add Node</button>
                    </div> */}
                </ReactFlow>
            </div>
        );
};

export default FlowRenderer;

// import * as React from 'react'
// import { FlowChartWithState, Content, Page, Sidebar, SidebarItem } from 'react-work-flow'

// // Initializes an empty panel
// const chartSimple = {
//     offset: {
//         x: 0,
//         y: 0
//     },
//     nodes: {
//     },
//     links: {
//     },
//     selected: {},
//     hovered: {}
// }

// const RegistrationType = () => {
//     let workFlowValue = {}

//     let getWorkFlowChartValue = (newWorkFlowValue) => {
//         workFlowValue = newWorkFlowValue
//         console.log("work-flow :", workFlowValue)
//     }
//     return (

//         <Page>
//             <Content>
//                 <FlowChartWithState initialValue={chartSimple} getWorkFlowChartValue={getWorkFlowChartValue} />
//             </Content>
//             <Sidebar>
//                 <div style={{ margin: "50px", padding: "10px", background: "rgba(0,0,0,0.05)" }}>
//                     Drag and drop these items onto the canvas.
//                 </div>
//                 <SidebarItem type="start" />
//                 <SidebarItem type="process-queue" />
//                 <SidebarItem type="process-point" />
//                 <SidebarItem type="process-queue" />
//                 <SidebarItem type="process-point" />
//                 <SidebarItem type="end" />
//             </Sidebar>
//         </Page>
//     )
// }

// export default RegistrationType;