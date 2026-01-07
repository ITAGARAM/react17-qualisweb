import shortid from "shortid";
import { ReactComponents } from "../Enumeration";
import { ROW, COLUMN, COMPONENT, COMPONENTROW } from "./constants";

// a little function to help us with reordering the result
export const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed); // inserting task in new index

    return result;
};

export const remove = (arr, index) => [
    // part of the array before the specified index
    ...arr.slice(0, index),
    // part of the array after the specified index
    ...arr.slice(index + 1)
];

export const replacechild = (origalarray, replacearray, index) => [
    // part of the array before the specified index
    ...origalarray.slice(0, index),
    replacearray,
    // part of the array after the specified index
    ...origalarray.slice(index + 1)
];

export const insert = (arr, index, newItem) => [
    // part of the array before the specified index
    ...arr.slice(0, index),
    // inserted item
    newItem,
    // part of the array after the specified index
    ...arr.slice(index)
];

export const reorderChildren = (children, splitDropZonePath, splitItemPath) => {
    if (splitDropZonePath.length === 1) {
        const dropZoneIndex = Number(splitDropZonePath[0]);
        const itemIndex = Number(splitItemPath[0]);
        return reorder(children, itemIndex, dropZoneIndex);
    }

    const updatedChildren = [...children];

    const curIndex = Number(splitDropZonePath.slice(0, 1));

    // Update the specific node's children
    const splitDropZoneChildrenPath = splitDropZonePath.slice(1);
    const splitItemChildrenPath = splitItemPath.slice(1);
    const nodeChildren = updatedChildren[curIndex];
    updatedChildren[curIndex] = {
        ...nodeChildren,
        children: reorderChildren(
            nodeChildren.children,
            splitDropZoneChildrenPath,
            splitItemChildrenPath
        )
    };

    return updatedChildren;
};

export const removeChildFromChildren = (children, splitItemPath) => {
    if (splitItemPath.length === 1) {
        const itemIndex = Number(splitItemPath[0]);
        return remove(children, itemIndex);
    }

    let updatedChildren = [...children];

    const curIndex = Number(splitItemPath.slice(0, 1));

    // Update the specific node's children
    const splitItemChildrenPath = splitItemPath.slice(1);
    const nodeChildren = updatedChildren[curIndex];
    // updatedChildren[curIndex] = {
    //   ...nodeChildren,
    //   children: removeChildFromChildren(
    //     nodeChildren.children,
    //     splitItemChildrenPath
    //   )
    // };

    if (nodeChildren.children !== undefined) {
        if (nodeChildren.type === COMPONENTROW &&
            nodeChildren.children.length === 1) {
            const list = removeChildFromChildren(children, splitItemPath.slice(0, 1))
            updatedChildren = [...list]
        } else if (nodeChildren.type === COMPONENTROW &&
            (nodeChildren.children.length === 1 ||
                nodeChildren.children.length === 2)) {
            const list = removeChildFromChildren(nodeChildren.children, splitItemChildrenPath)
            const list1 = replacechild(children, ...list, curIndex)
            updatedChildren = [...list1]
        } else {
            updatedChildren[curIndex] = {
                ...nodeChildren,
                children: removeChildFromChildren(
                    nodeChildren.children,
                    splitItemChildrenPath
                )
            };
        }

    } else {
        // if(nodeChildren.type===COMPONENTROW){
        const list = removeChildFromChildren(children, splitItemPath.slice(0, 1))
        updatedChildren = [...list]
        // }

    }
    return updatedChildren;
};

export const addChildToChildren = (children, splitDropZonePath, item) => {
    if (splitDropZonePath.length === 1) {
        const dropZoneIndex = Number(splitDropZonePath[0]);
        return insert(children, dropZoneIndex, item);
    }

    const updatedChildren = [...children];

    const curIndex = Number(splitDropZonePath.slice(0, 1));

    // Update the specific node's children
    const splitItemChildrenPath = splitDropZonePath.slice(1);
    const nodeChildren = updatedChildren[curIndex];
    if (nodeChildren.children !== undefined) {
        updatedChildren[curIndex] = {
            ...nodeChildren,
            children: addChildToChildren(
                nodeChildren.children,
                splitItemChildrenPath,
                item
            )
        };
    } else {
        updatedChildren[curIndex] = {
            type: COMPONENTROW,
            id: shortid.generate(),
            children: addChildToChildren(
                [nodeChildren],
                splitItemChildrenPath,
                item
            )
        };
    }
    return updatedChildren;
};

export const handleMoveWithinParent = (
    layout,
    splitDropZonePath,
    splitItemPath
) => {
    return reorderChildren(layout, splitDropZonePath, splitItemPath);
};

export const handleAddColumDataToRow = layout => {
    const layoutCopy = [...layout];
    const COLUMN_STRUCTURE = {
        type: COLUMN,
        id: shortid.generate(),
        children: []
    };

    return layoutCopy.map(row => {
        if (!row.children.length) {
            row.children = [COLUMN_STRUCTURE];
        }
        return row;
    });
};

export const handleMoveToDifferentParent = (
    layout,
    splitDropZonePath,
    splitItemPath,
    item
) => {
    let newLayoutStructure;
    const COLUMN_STRUCTURE = {
        type: COLUMN,
        id: shortid.generate(),
        children: [{ type: COMPONENT, id: shortid.generate(), ...item }]
    };

    const ROW_STRUCTURE = {
        type: ROW,
        id: shortid.generate()
    };

    switch (splitDropZonePath.length) {
        case 1:
            {
                // moving column outside into new row made on the fly
                if (item.type === COLUMN) {
                    newLayoutStructure = {
                        ...ROW_STRUCTURE,
                        children: [item]
                    };
                } else {
                    // moving component outside into new row made on the fly
                    newLayoutStructure = {
                        ...ROW_STRUCTURE,
                        children: [COLUMN_STRUCTURE]
                    };
                }
                break;
            }
        case 2:
            {
                // moving component outside into a row which creates column
                if (item.type === COMPONENTROW) {
                    newLayoutStructure = COLUMN_STRUCTURE;
                } else {
                    // moving column into existing row
                    newLayoutStructure = item;
                }

                break;
            }
        case 3:
            {
                // moving component outside into a column which creates componentrow
                if (item.type === COMPONENTROW) {
                    newLayoutStructure = {
                        ...item,
                        type: COMPONENT,
                        id: shortid.generate(),
                    };
                } else {
                    // moving column into existing row
                    if (item.children === undefined) {
                        newLayoutStructure = item
                        delete newLayoutStructure["children"]
                    } else {
                        newLayoutStructure = { ...item, type: COMPONENTROW };
                    }

                }
                break;
            }
        default:
            {
                newLayoutStructure = item;
            }
    }

    let updatedLayout = layout;
    updatedLayout = removeChildFromChildren(updatedLayout, splitItemPath);
    updatedLayout = handleAddColumDataToRow(updatedLayout);
    updatedLayout = addChildToChildren(
        updatedLayout,
        splitDropZonePath,
        newLayoutStructure
    );

    return updatedLayout;
};

export const handleMoveSidebarComponentIntoParent = (
    layout,
    splitDropZonePath,
    item
) => {
    let newLayoutStructure;
    switch (splitDropZonePath.length) {
        case 1:
            {
                newLayoutStructure = {
                    type: ROW,
                    id: shortid.generate(),
                    children: [{
                        type: COLUMN,
                        id: shortid.generate(),
                        children: [{ type: COMPONENT, id: shortid.generate(), ...item }]
                    }]
                };
                break;
            }
        case 2:
            {
                newLayoutStructure = {
                    type: COLUMN,
                    id: shortid.generate(),
                    children: [{ type: COMPONENT, id: shortid.generate(), ...item }]
                };
                break;
            }
        case 3:
            {
                newLayoutStructure = {
                    type: COMPONENT,
                    id: shortid.generate(),
                    ...item
                };
                break;
            }
        case 4:
            {
                newLayoutStructure = {
                    type: COMPONENT,
                    id: shortid.generate(),
                    ...item
                };
                break;
            }
        default:
            {
                newLayoutStructure = item;
            }
    }

    return addChildToChildren(layout, splitDropZonePath, newLayoutStructure);
};

export const handleRemoveItemFromLayout = (layout, splitItemPath) => {
    return removeChildFromChildren(layout, splitItemPath);
};
export const getcomponentdata = (children, splitItemPath) => {
    const itemIndex = Number(splitItemPath[0]);
    let updatedata = children[itemIndex] !== undefined ? children[itemIndex] : children[itemIndex - 1] !==
        undefined ? children[itemIndex - 1] : {};
    if (updatedata.children !== undefined) {
        const splitItemChildrenPath = splitItemPath.length > 1 ? splitItemPath.slice(1) : splitItemPath;
        updatedata = getcomponentdata(updatedata.children, splitItemChildrenPath)
    } else {
        return updatedata;
    }
    return updatedata;
};

export const replaceChildFromChildren = (children, splitItemPath, replacedata) => {
    if (splitItemPath.length === 1) {
        const itemIndex = Number(splitItemPath[0]);
        return replacechild(children, replacedata, itemIndex);
    } else if (splitItemPath.length === 2) {
        splitItemPath[2] = '0'
        return replaceChildFromChildren(children, splitItemPath, replacedata)
    }
    let updatedChildren = [...children];
    const curIndex = Number(splitItemPath.slice(0, 1));
    // Update the specific node's children
    const splitItemChildrenPath = splitItemPath.slice(1);
    const nodeChildren = updatedChildren[curIndex];
    if (nodeChildren.children !== undefined) {
        if (nodeChildren.type === COMPONENTROW) {
            updatedChildren[curIndex] = {
                ...nodeChildren,
                children: replaceChildFromChildren(
                    nodeChildren.children,
                    splitItemChildrenPath,
                    replacedata
                )
            };
        } else {
            updatedChildren[curIndex] = {
                ...nodeChildren,
                children: replaceChildFromChildren(
                    nodeChildren.children,
                    splitItemChildrenPath,
                    replacedata
                )
            };
        }
    } else {
        const list = replaceChildFromChildren(children, splitItemPath.slice(0, 1), replacedata)
        updatedChildren = [...list]
    }
    return updatedChildren;
};

export const getValidComponent = (selectedFieldRecord, components, columnInfo) => {
    let validComponents = [];
    let currentCompChild = [];
    components.map(comp => {
        if (selectedFieldRecord.componentcode === ReactComponents.COMBO) {
            selectedFieldRecord.child && selectedFieldRecord.child.map(myChild => currentCompChild.push(myChild.label))
            if (columnInfo && columnInfo[comp.nquerybuildertablecode]) {
                if (columnInfo[selectedFieldRecord.nquerybuildertablecode]) {
                    if (columnInfo[selectedFieldRecord.nquerybuildertablecode].numericColumns.length) {
                        columnInfo[selectedFieldRecord.nquerybuildertablecode].numericColumns.map(mycol => {
                            //commented by pravinth
                            //  if (mycol.foriegntablePK === columnInfo[comp.nquerybuildertablecode].primaryKeyName) {
                            if (mycol.foriegntablePK === 'ndynamicmastercode') {
                                //  columnInfo[comp.nquerybuildertablecode].jstaticColumns.map(mycol2=>{
                                const index = columnInfo[comp.nquerybuildertablecode].staicColumns.findIndex(x => x.columnname === mycol.parentforeignPK&&comp.nformcode===mycol.foreigntableformcode)
                                if (index !== -1) {
                                    // const val=columnInfo[comp.nquerybuildertablecode].jstaticColumns[index]
                                    if (!currentCompChild.includes(comp.label) && selectedFieldRecord.label !== comp.label) {
                                        validComponents.push(comp)
                                        currentCompChild.push(comp.label)
                                    }
                                }
                                // if (mycol2.label columnInfo[comp.nquerybuildertablecode].jstaticco) {
                                //     if (!currentCompChild.includes(comp.label)&&selectedFieldRecord.label!==comp.label) {
                                //         validComponents.push(comp)
                                //         currentCompChild.push(comp.label)
                                //     }
                                // }
                                //  })                                                                  
                            } else {
                                if (mycol.foriegntablePK === columnInfo[comp.nquerybuildertablecode].primaryKeyName) {
                                    if (!currentCompChild.includes(comp.label) && selectedFieldRecord.label !== comp.label) {
                                        validComponents.push(comp)
                                        currentCompChild.push(comp.label)
                                    }
                                }
                            }
                        })
                        columnInfo[comp.nquerybuildertablecode].numericColumns.map(otherCol => {
                            //commented by pravinth
                            //if (selectedFieldRecord.valuemember === otherCol.foriegntablePK) {
                            if (selectedFieldRecord.valuemember==='ndynamicmastercode') {
                                const index = columnInfo[selectedFieldRecord.nquerybuildertablecode].staicColumns.findIndex(x => x.columnname === otherCol.parentforeignPK&&selectedFieldRecord.table.item.nformcode===otherCol.foreigntableformcode)
                                if(index!==-1){
                                    if (!currentCompChild.includes(comp.label) && selectedFieldRecord.label !== comp.label) {
                                        validComponents.push(comp);
                                        currentCompChild.push(comp.label);
                                    }
                                }


                            }else{
                                if (selectedFieldRecord.valuemember === otherCol.foriegntablePK) {
                                    if (!currentCompChild.includes(comp.label) && selectedFieldRecord.label !== comp.label) {
                                        validComponents.push(comp);
                                        currentCompChild.push(comp.label);
                                    }
                                }
                            }


                        
                        })

                    } else {
                        columnInfo[comp.nquerybuildertablecode].numericColumns.map(otherCol => {
                            //commented by pravinth
                            //if (selectedFieldRecord.valuemember === otherCol.foriegntablePK) {
                                if (selectedFieldRecord.valuemember==='ndynamicmastercode') {
                                    const index = columnInfo[selectedFieldRecord.nquerybuildertablecode].staicColumns.findIndex(x => x.columnname === otherCol.parentforeignPK&&selectedFieldRecord.table.item.nformcode===otherCol.foreigntableformcode)
                                    if(index!==-1){
                                        if (!currentCompChild.includes(comp.label) && selectedFieldRecord.label !== comp.label) {
                                            validComponents.push(comp);
                                            currentCompChild.push(comp.label);
                                        }
                                    }
    
    
                                }else{

                            if (selectedFieldRecord.valuemember === otherCol.foriegntablePK) {
                                if (!currentCompChild.includes(comp.label) && selectedFieldRecord.label !== comp.label) {
                                    validComponents.push(comp);
                                    currentCompChild.push(comp.label);
                                }
                            }
                                }
                        })
                    }
                }
            }
            if (comp.inputtype === 'radio') {
                if (selectedFieldRecord.label !== comp.label) {
                    validComponents.push(comp)
                }
            }
        } else if (selectedFieldRecord.componentcode === ReactComponents.CUSTOMSEARCHFILTER) {
            if (comp.inputtype === 'radio') {
                if (selectedFieldRecord.label !== comp.label) {
                    validComponents.push(comp)
                }

            }
        }
        else {
            if (selectedFieldRecord.label !== comp.label)
                validComponents.push(comp)
        }
    })
    return validComponents;
}

export const getChildComponentForeignKey = (selectedFieldRecord, comp, columnInfo) => {
    // let validComponents = [];
    //let currentCompChild = [];
    let tableForeignKey = ""
    if (selectedFieldRecord.componentcode === ReactComponents.COMBO) {
        //  selectedFieldRecord.child && selectedFieldRecord.child.map(myChild => currentCompChild.push(myChild.label))
        if (columnInfo && columnInfo[comp.nquerybuildertablecode]) {
            if (columnInfo[selectedFieldRecord.nquerybuildertablecode]) {
                if (columnInfo[selectedFieldRecord.nquerybuildertablecode].numericColumns.length) {
                    columnInfo[selectedFieldRecord.nquerybuildertablecode].numericColumns.map(mycol => {
                        if (mycol.foriegntablePK === columnInfo[comp.nquerybuildertablecode].primaryKeyName) {
                            // if (!currentCompChild.includes(comp.label)) {
                            // validComponents.push(comp)
                            //  currentCompChild.push(comp.label)
                            tableForeignKey = mycol.foriegntablePK
                            //  }
                        }
                    })
                    columnInfo[comp.nquerybuildertablecode].numericColumns.map(otherCol => {
                        if (selectedFieldRecord.valuemember === otherCol.foriegntablePK) {
                            // if (!currentCompChild.includes(comp.label)) {
                            tableForeignKey = otherCol.foriegntablePK
                            // validComponents.push(comp);
                            //  currentCompChild.push(comp.label);
                            // }
                        }
                    })

                }
                else {
                    columnInfo[comp.nquerybuildertablecode].numericColumns.map(otherCol => {
                        if (selectedFieldRecord.valuemember === otherCol.foriegntablePK) {
                            //  if (!currentCompChild.includes(comp.label)) {
                            tableForeignKey = otherCol.foriegntablePK
                            // validComponents.push(comp);
                            // currentCompChild.push(comp.label);
                            // }
                        }
                    })
                }

            }
        }

    }
    return tableForeignKey;
}