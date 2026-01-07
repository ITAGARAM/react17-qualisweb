import React, { Component } from 'react';
import { TreeDiv } from './TreeStyledComponent';
import TreeNode from './TreeNode';

class CustomTree extends Component {
    
    state = {
        nodes: this.props.data, selectedNode: {}
    }

    getRootNodes = () => {
        const { nodes } = this.state;
        const rootList = nodes? Object.keys(nodes).map((key) => nodes[key]): [];
        return rootList.filter(node => 
            node.isRoot === true
        );
    }

    getChildNodes = (node) => {
        const { nodes } = this.state;
        if(!node.lstChildren) return [];
        return node.lstChildren.map(path=> 
            nodes[path]
        );
    }

    onToggle = (node) => {
        const { nodes } = this.state;
        nodes[node.path].isOpen = !node.isOpen;
        this.setState({ nodes });
    }

    onNodeSelect = (selectedNode) => {
        this.props.nodeSelect({ ...this.props.getParam, selectedRecord: selectedNode}, this.props.masterData);
        this.setState({
            selectedNode: selectedNode 
        });
    }

    render() {
        const rootNodes = this.getRootNodes();
        return (
            <TreeDiv>
                {rootNodes.map(node => {
                    return(
                        <TreeNode
                            primaryKeyField={this.props.primaryKeyField}
                            selectedNode={this.state.selectedNode}
                            node={node}
                            level={0}
                            getChildNodes={this.getChildNodes}
                            onToggle={this.onToggle}
                            onNodeSelect={this.onNodeSelect}
                        ></TreeNode>
                    )
                })}
            </TreeDiv>
        );
    }

    componentDidUpdate(prevProps) {
        if(this.props.data !== prevProps.data) {
            this.setState({ nodes: this.props.data,
                selectedNode: this.props.selectedNode 
            })
        }
    }
}

export default CustomTree;