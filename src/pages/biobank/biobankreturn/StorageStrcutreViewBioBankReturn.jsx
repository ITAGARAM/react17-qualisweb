import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from "react-redux";

import { Row, Col } from "react-bootstrap";
import TreeViewEditable from "../../../components/form-tree-editable/form-tree-editable.component";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBoxOpen, faLocationArrow, faBox,
    faHandPointLeft
} from '@fortawesome/free-solid-svg-icons';
import { faFolderOpen, faFolder } from '@fortawesome/free-regular-svg-icons';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import { intl } from '../../../components/App';
import FormInput from '../../../components/form-input/form-input.component';
import rsapi from "../../../rsapi";
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from '../../../actions/LoginTypes';
import { toast } from 'react-toastify';
import { initRequest } from '../../../actions/LoginAction';



const StorageStrcutreViewBioBankReturn = (props) => {
    const toggleActionView = false;
    const initialTreeDataView = props.treeDataView;
    const initialFreezerData = props.freezerData;
    const initialSelectedFreezerRecord = props.initialSelectedFreezerRecord;
    const [freezerData, setfreezerData] = useState([]);
    const [treeDataView, setTreeDataView] = useState([]);
    const [searchedTreeData, setSearchedTreeData] = useState();
    const pointedItemRef = useRef(undefined);
    const [selectedFreezerRecord, setSelectedFreezerRecord] = useState();
    const dispatch = useDispatch(); // ✅ Now you can use dispatch

    // useEffect(() => {
    //     if (initialTreeDataView) {
    //         setTreeDataView(initialTreeDataView);
    //     }
    //     if (initialFreezerData) {
    //         setfreezerData(initialFreezerData);
    //     }
    //     if (initialSelectedFreezerRecord) {
    //         setSelectedFreezerRecord(initialSelectedFreezerRecord);
    //     }
    // }, [, , initialSelectedFreezerRecord]);

    useEffect(() => {
    if (initialTreeDataView !== undefined) {
        setTreeDataView(initialTreeDataView);
    }
    if (initialFreezerData !== undefined) {
        setfreezerData(initialFreezerData);
    }
    // allow null too, so it can clear
    if (initialSelectedFreezerRecord !== undefined) {
        setSelectedFreezerRecord(initialSelectedFreezerRecord);
    }
}, [initialTreeDataView, initialFreezerData, initialSelectedFreezerRecord]);

    // 🌲 Unified tree updater (handles editable + selected + hierarchy)
    const updateTree = (data, targetItem, hierarchicalIndex) => {
        return data.map((node, i) => {
            const isTarget = node.id === targetItem.id;
            let updatedNode = {
                ...node,
                editable: isTarget,
                selected: isTarget
            };

            // Set hierarchy if selected
            if (isTarget && hierarchicalIndex) {
                const indices = hierarchicalIndex.split('_').map(Number);
                let result = Array.isArray(data) ? data[indices[0]] : undefined;
                let itemText = result ? result.text : '';

                for (let j = 1; j < indices.length; j++) {
                    if (result && result.items && result.items[indices[j]]) {
                        result = result.items[indices[j]];
                        itemText += ` > ${result.text}`;
                    } else {
                        result = undefined;
                        break;
                    }
                }

                if (result) {
                    updatedNode.itemhierarchy = itemText;
                }


                // Reset pointedItem if same
                if (pointedItemRef.current && pointedItemRef.current.id === updatedNode.id) {
                    pointedItemRef.current = undefined;
                }
            } else {
                updatedNode.itemhierarchy = undefined;
            }

            // Recurse into children
            if (node.items && node.items.length > 0) {
                updatedNode.items = updateTree(node.items, targetItem, hierarchicalIndex);
            }

            return updatedNode;
        });
    };

    const onItemClickView = (event) => {
        const clickedItem = event.item;
        const hierarchicalIndex = event.itemHierarchicalIndex;

        let updatedSearchedData;
        if (searchedTreeData) {
            updatedSearchedData = updateTree(searchedTreeData, clickedItem, hierarchicalIndex);
            setSearchedTreeData(updatedSearchedData);
        }

        const updatedTreeData = updateTree(treeDataView, clickedItem, hierarchicalIndex);
        setTreeDataView(updatedTreeData);
        if (props.onTreeDataChange) {
            props.onTreeDataChange(updatedTreeData);
        }
    };

    const onExpandChangeView = (event) => {
        const toggleExpand = (nodes) =>
            nodes.map((node) => {
                if (node.id === event.item.id) {
                    return { ...node, expanded: !node.expanded };
                }
                if (node.items) {
                    return { ...node, items: toggleExpand(node.items) };
                }
                return node;
            });

        setTreeDataView(prev => toggleExpand(prev));
    };

    const itemRenderView = (clickedItem) => {
        const item = clickedItem.item;
        if (!toggleActionView && item) {
            const isPointed = pointedItemRef.current && pointedItemRef.current.id === item.id;

            return (
                <span className='d-flex align-items-center'>
                    {isPointed && !item.selected && (
                        <input type="text" className='hidden-treeview-focus' id='selected-tree-point' />
                    )}
                    <span
                        className={`normal-node text-truncate
                            ${isPointed && !item.selected ? "pointed-node" : item.selected ? "active-node" : ""}
                            ${item.expanded ? "expand-node" : "collapse-node"}`}
                        data-tooltip-id="my-tooltip" data-tooltip-content={item.text}
                    >
                        {item.containerfirstnode ? <FontAwesomeIcon icon={faBoxOpen} /> :
                            item.locationlastnode ? <FontAwesomeIcon icon={faLocationArrow} /> :
                                item.containerlastnode ? <FontAwesomeIcon icon={faBox} /> :
                                    item.expanded ? <FontAwesomeIcon icon={faFolderOpen} /> :
                                        <FontAwesomeIcon icon={faFolder} />
                        }
                        {item.text}
                    </span>
                    {isPointed
                        ? <FontAwesomeIcon icon={faHandPointLeft} bounce />
                        : item.editable && <></>
                    }
                </span>
            );
        }
        return null;
    };

    const onComboChange = (selectedOption, name) => {
        const updatedRecord = { ...selectedFreezerRecord, [name]: selectedOption };
        setSelectedFreezerRecord(updatedRecord);
        if (props.onFreezerChange) {
            props.onFreezerChange(updatedRecord);
        }

        dispatch(initRequest(true));
        rsapi()
            .post("processedsamplereceiving/getStorageStructure", {
                "nsamplestorageversioncode": selectedOption.item.nsamplestorageversioncode,
                "nstorageinstrumentcode": selectedOption.item.nstorageinstrumentcode
            })
            .then(response => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false, shouldRender: false } });
                setTreeDataView(response.data.selectedSampleStorageVersion['jsondata'].data);
                if (props.onTreeDataChange) {
                    props.onTreeDataChange(response.data.selectedSampleStorageVersion['jsondata'].data);
                }
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 401 || error.response?.status === 403) {
                    // Unauthorized
                    dispatch({
                        type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    });
                } else if (error.response?.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response?.data || "Error fetching tree data");
                }
            });
    };

    return (
        <Row className='mb-2'>
            {/* <Col md={6}>
                <FormInput
                    label={intl.formatMessage({ id: "IDS_SUGGESTEDSTORAGE" })}
                    name="SuggestedStorage"
                    type="text"
                    value={initialSelectedFreezerRecord && initialSelectedFreezerRecord["selectedSuggestedStorage"] &&
                        initialSelectedFreezerRecord["selectedSuggestedStorage"].sinstrumentid || ""}
                    //onChange={(e) => onInputOnChange(e, "naliquotcount")}
                    //onFocus={handleFocus}
                    isMandatory={false}
                    maxLength={2}
                    readOnly={true}
                />
            </Col> */}

            <Col md={6}>
                <FormSelectSearch
                    formLabel={intl.formatMessage({ id: "IDS_STORAGENAME" })}
                    name="nstorageinstrumentcode"
                    options={freezerData}
                    optionId="nstorageinstrumentcode"
                    optionValue="sinstrumentid"
                    value={selectedFreezerRecord && selectedFreezerRecord["nstorageinstrumentcode"] || ""}
                    onChange={(e) => onComboChange(e, "nstorageinstrumentcode")}
                    isMandatory={true}
                />
            </Col>
            <Col md={12}>
                {/* <div className='tree-view-container'> */}
                <TreeViewEditable
                    id="samplestoragelocation"
                    name="samplestoragelocation"
                    data={treeDataView}
                    expandIcons={true}
                    item={itemRenderView}
                    selectField={'active-node'}
                    onExpandChange={onExpandChangeView}
                    onItemClick={onItemClickView}
                />
                {/* </div> */}
            </Col>
        </Row>
    );
};

export default StorageStrcutreViewBioBankReturn;
