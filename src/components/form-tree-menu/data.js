export const treeData = [
    {
      key: 'first-level-node-1',
      label: 'Node 1 at the first level',
      nodes: [
        {
          key: 'second-level-node-1',
          label: 'Node 1 at the second level',
          nodes: [
            {
              key: 'third-level-node-1',
              label: 'Last node of the branch',
              nodes: [] // you can remove the nodes property or leave it as an empty array
            },
          ],
        },
      ],
    },
    {
      key: 'first-level-node-2',
      label: 'Node 2 at the first level',
    },
];
