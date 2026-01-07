import React, { Component } from 'react';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NodeIcon, NodeInput, ListNode, ChildNode } from './TreeStyledComponent';

class TreeNode extends Component {

    render() {
        const { node, getChildNodes, level, onToggle, onNodeSelect, primaryKeyField } = this.props;
        const childLength = node.lstChildren.length;
        return (
            <React.Fragment>
                <ListNode className="form-label-group tree-level">
                    <NodeIcon className="line" style={{ width: (level + 1) * 10 }}> </NodeIcon>
                    <NodeIcon length={childLength} type={node.type} onClick={()=>onToggle(node)}
                        className={`${childLength>0?"node-indicator":"not-node-indicator"} ${childLength>0 && level===0?"first-node-top":""}`} >
                            {childLength > 0 && 
                            <>
                                { node.type === 'root' && childLength > 0 && (node.isOpen === true ? 
                                <FontAwesomeIcon icon={faMinus} className="node-indicator" />: <FontAwesomeIcon icon={faPlus} />)}
                                { node.type === 'folder' && childLength > 0 && node.isOpen && <FontAwesomeIcon icon={faMinus} />}
                                { node.type === 'folder' && childLength > 0 && !node.isOpen && <FontAwesomeIcon icon={faPlus} />}
                            </>
                            }
                        
                    </NodeIcon>
                    <NodeIcon md={1} className="ml-1">{node.slabelname}</NodeIcon>
                    <ChildNode level={level} type={node.type} childLength={childLength}
                        className={`${node.content !== null && this.props.selectedNode !== null 
                            && node.content[primaryKeyField] === this.props.selectedNode[primaryKeyField] ? "selected-node":
                            node.content === null && this.props.selectedNode === null? "selected-node": ""}`}
                        onClick={()=>onNodeSelect(node.content, level)}>
                        <NodeInput>{node.path}</NodeInput>
                    </ChildNode>
                </ListNode>
                { node.isOpen && getChildNodes(node).map(childNode => {
                    return (
                        <TreeNode
                            {...this.props}
                            node={childNode}
                            level={level+1}
                        />
                    )
                })}
            </React.Fragment>
        );
    }
}

export default TreeNode;