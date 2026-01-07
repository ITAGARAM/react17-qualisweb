import React from 'react';
import { MarkerType } from 'react-flow-renderer';

export const nodes = [
  {
    id: '1',
    type: 'input',
    data: {
      label: (
        <>
           <strong>Registration</strong>
        </>
      ),
    },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: {
      label: (
        <>
          Job Allocation
        </>
      ),
    },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    data: {
      label: (
        <>
          My Job
        </>
      ),
    },
    position: { x: 400, y: 100 },
    style: {
      background: '#D6D5E6',
      color: '#333',
      border: '1px solid #222138',
      width: 180,
    },
  },
  {
    id: '4',
    position: { x: 250, y: 200 },
    data: {
      label: 'Result Entry',
    },
  },
  {
    id: '5',
    data: {
      label: 'Approval',
    },
    position: { x: 250, y: 325 },
  },
  {
    id: '6',
    type: 'output',
    data: {
      label: (
        <>
          <strong>Release</strong>
        </>
      ),
    },
    position: { x: 100, y: 480 },
  },
  // {
  //   id: '7',
  //   type: 'output',
  //   data: { label: 'Another output node' },
  //   position: { x: 400, y: 450 },
  // },
];

export const edges = [
  { id: 'e1-2', source: '1', target: '2', label: 'optional flow',  animated: true, },
  { id: 'e1-3', source: '1', target: '3',  label: 'optional flow', animated: true, },  
  { id: 'e1-4', source: '1', target: '4' , markerEnd: {type: MarkerType.ArrowClosed,},},
  { id: 'e2-3', source: '2', target: '3' , markerEnd: {type: MarkerType.ArrowClosed,},},
  { id: 'e2-4', source: '2', target: '4' , markerEnd: {type: MarkerType.ArrowClosed,},},
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    markerEnd: {
        type: MarkerType.ArrowClosed,
      },
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    label: 'edge with arrow head',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    type: 'smoothstep',
    label: 'smooth step edge',
  },
  // {
  //   id: 'e5-7',
  //   source: '5',
  //   target: '7',
  //   type: 'step',
  //   style: { stroke: '#f6ab6c' },
  //   label: 'a step edge',
  //   animated: true,
  //   labelStyle: { fill: '#f6ab6c', fontWeight: 700 },
  // },
];
