import { faCheck, faPlus, faDolly, faTrashAlt, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { process } from '@progress/kendo-data-query';
import Axios from 'axios';
import React from 'react';
import { Card, Col, FormGroup, FormLabel, Nav, Row } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { updateStore } from '../../../actions';
import { ReadOnlyText } from "../../../components/App.styles";
import { convertDateTimetoStringDBFormat, onSaveMandatoryValidation, rearrangeDateFormat, showEsign, sortData } from '../../../components/CommonScript';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';
import DataGridWithSelection from '../../../components/data-grid/DataGridWithSelection';
import { transactionStatus } from '../../../components/Enumeration';
import ModalShow from '../../../components/ModalShow';
import Preloader from '../../../components/preloader/preloader.component';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import rsapi from '../../../rsapi';
import EsignStateHandle from '../../audittrail/EsignStateHandle';
import { ContentPanel, ProductList } from '../../product/product.styled';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './../../../actions/LoginTypes';
import AcceptRejectDirectTransfer from './AcceptRejectDirectTransfer';
import AddDirectTransfer from "./AddDirectTransfer";

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class OuterGridDirectTransfer extends React.Component {
    constructor(props) {
        super(props);
        this.confirmMessage = new ConfirmMessage();
        const dataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 10,
        };
        this.state = {
            loading: false,
            dataState: dataState,
            operation: props.operation,
            selectedRecord: props.selectedRecord,
            data: props.lstChildBioDirectTransfer,
            controlMap: props.controlMap,
            userRoleControlRights: props.userRoleControlRights,
            lstChildBioDirectTransfer: props.lstChildBioDirectTransfer,
            lstBioDirectTransfer: props.lstBioDirectTransfer,
            selectedBioDirectTransfer: props.selectedBioDirectTransfer,
            selectedChildRecord: {},
            selectedViewRecord: {}
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const updates = {};

        // ✅ helper for deep compare
        const isChanged = (curr, prev) =>
            JSON.stringify(curr || {}) !== JSON.stringify(prev || {});

        // --- Handle dataResult change ---
        if (isChanged(prevState?.dataResult, this.state?.dataResult)) {
            const addedChildBioDirectTransfer = (this.state?.dataResult || [])
                .filter(dr =>
                    (this.state?.lstChildBioDirectTransfer || []).some(
                        lc => lc?.nserialno === dr?.nserialno
                    ) && dr?.selected === true
                )
                .map(item => ({ ...item }));

            updates.selectedRecord = {
                ...(this.state?.selectedRecord || {}),
                addedChildBioDirectTransfer
            };
        }

        // --- Props-based updates ---
        const propsToStateMap = {
            selectedRecord: "selectedRecord",
            selectedChildRecord: "selectedChildRecord",
            selectedViewRecord: "selectedViewRecord",
            loadEsignStateHandle: "loadEsignStateHandle",
            openModalShow: "openModalShow",
            openAcceptRejectDirectTransfer: "openAcceptRejectDirectTransfer",
            lstSampleCondition: "lstSampleCondition",
            lstReason: "lstReason"
        };

        for (const [propKey, stateKey] of Object.entries(propsToStateMap)) {
            if (
                isChanged(
                    this.props?.Login?.[propKey],
                    prevProps?.Login?.[propKey]
                )
            ) {
                updates[stateKey] = this.props?.Login?.[propKey];
            }
        }

        if (isChanged(this.props?.Login?.isGridClear, prevProps?.Login?.isGridClear)) {
            updates.selectedRecord = {};
            updates.dataState = {
                skip: 0,
                take: this.props.settings ? parseInt(this.props.settings[14]) : 10,
            };
            updates.dataResult = (this.props?.Login?.masterData?.lstChildBioDirectTransfer || []).slice(updates.dataState.skip, updates.dataState.skip + updates.dataState.take);
            updates.lstChildBioDirectTransfer = this.props?.Login?.masterData?.lstChildBioDirectTransfer;
        }

        // --- Handle masterData.lstChildBioDirectTransfer ---
        if (
            isChanged(
                this.props?.Login?.masterData?.lstChildBioDirectTransfer,
                prevProps?.Login?.masterData?.lstChildBioDirectTransfer
            )
        ) {
            const processed =
                this.props?.Login?.masterData?.lstChildBioDirectTransfer &&
                process(
                    this.props?.Login?.masterData?.lstChildBioDirectTransfer,
                    this.props?.dataState
                );
            updates.lstChildBioDirectTransfer =
                this.props?.Login?.masterData?.lstChildBioDirectTransfer || [];
            updates.dataResult = processed ? processed.data : [];
            updates.total = processed ? processed.total : 0;
            updates.dataState = this.props?.dataState || {};
        }

        // --- Handle lstChildBioDirectTransfer ---
        if (
            isChanged(
                this.props?.Login?.lstChildBioDirectTransfer,
                prevProps?.Login?.lstChildBioDirectTransfer
            )
        ) {
            let dataState = this.state?.dataState || {};
            const prevSelected = this.state?.selectedRecord || {};
            const newList = this.props?.Login?.lstChildBioDirectTransfer || [];

            if(newList.length <= dataState.skip){
                dataState = {
                    skip: 0,
                    take: this.props.settings ? parseInt(this.props.settings[14]) : 10,
                };
            }

            const addedMap = new Map(
                (prevSelected?.addedChildBioDirectTransfer || []).map(item => [
                    item?.nserialno,
                    item
                ])
            );

            const updatedLstChildBioDirectTransfer = newList.map(item => {
                if (addedMap.has(item?.nserialno)) {
                    const updated = { ...item, selected: true };
                    addedMap.set(item?.nserialno, updated);
                    return updated;
                }
                return { ...item };
            });

            const addedChildBioDirectTransfer = Array.from(addedMap.values());
            const processed = process(updatedLstChildBioDirectTransfer, dataState);

            updates.lstChildBioDirectTransfer = updatedLstChildBioDirectTransfer;
            updates.dataResult = processed ? processed.data : [];
            updates.total = processed ? processed.total : 0;
            updates.dataState = dataState;
            updates.selectedRecord = {
                ...prevSelected,
                addedChildBioDirectTransfer
            };
        }
        if(this.props.Login.selectedViewRecord !== prevProps.Login.selectedViewRecord){
            updates.selectedViewRecord = this.props.Login.selectedViewRecord ;
        }
        // ✅ Apply all updates in one setState
        if (Object.keys(updates).length > 0) {
            this.setState(updates);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.Login.openChildModal && (this.props.Login.openChildDirectTransfer || this.state.openModalShow) && nextState.isInitialRender === false &&
            (nextState.selectedChildRecord !== this.state.selectedChildRecord)) {
            return false;
        } else {
            return true;
        }
    }

    render() {
        this.extractedFields =
            [
                { "idsName": "IDS_REPOSITORYID", "dataField": "srepositoryid", "width": "150px" },
                { "idsName": "IDS_PARENTSAMPLECODE", "dataField": "sparentsamplecode", "width": "130px" },
                { "idsName": "IDS_BIOSAMPLETYPE", "dataField": "sproductname", "width": "150px" },
                { "idsName": "IDS_VOLUMEµL", "dataField": "svolume", "width": "110px" },
                { "idsName": "IDS_SAMPLECONDITION", "dataField": "ssamplecondition", "width": "150px" },
                { "idsName": "IDS_TRANSFERSTATUS", "dataField": "stransferstatus", "width": "150px" }
            ];

        const addChildID = this.props.addChildID;
        const acceptRejectID = this.props.acceptRejectID;
        const deleteID = this.props.deleteChildID;
        const disposeID = this.props.disposeID;
        const undoID = this.props.undoID;

        let selectedChildRecord = this.props.Login.selectedChildRecord !== undefined ? this.props.Login.selectedChildRecord : this.state.selectedChildRecord;
        return (
            <>
                <Preloader loading={this.state.loading} />
                <ContentPanel className="panel-main-content">
                    <Card className="border-0">
                        <Card.Header>
                            <Card.Subtitle>
                                <ProductList className="d-flex product-category float-right icon-group-wrap">
                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_SAMPLEADD" })} data-place="left"
                                        hidden={this.props.userRoleControlRights.indexOf(addChildID) === -1}
                                        onClick={() => this.addChildDirectTransfer(addChildID, 'create', 'IDS_SAMPLE')}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Nav.Link>
                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_SAMPLEVALIDATION" })} data-place="left"
                                        hidden={this.props.userRoleControlRights.indexOf(acceptRejectID) === -1}
                                        onClick={() => this.acceptRejectDirectTransfer(acceptRejectID, 'accept', 'IDS_SAMPLECONDITION')}>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </Nav.Link>
                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_SAMPLEDELETE" })} data-place="left"
                                        hidden={this.props.userRoleControlRights.indexOf(deleteID) === -1}
                                        onClick={() => this.handleDelete(deleteID, 'delete', 'IDS_TRANSFERFORM')}>
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </Nav.Link>
                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_MOVETODISPOSE" })} data-place="left"
                                        hidden={this.props.userRoleControlRights.indexOf(disposeID) === -1}
                                        onClick={() => this.onDisposeEsignCheck(disposeID, 'dispose', 'IDS_TRANSFERFORM')}>
                                        <FontAwesomeIcon icon={faDolly} />
                                    </Nav.Link>
                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_UNDODISPOSE" })} data-place="left"
                                        hidden={this.props.userRoleControlRights.indexOf(undoID) === -1}
                                        onClick={() => this.onUndoDisposeEsignCheck(undoID, 'undo', 'IDS_UNDODISPOSE')}>
                                        <FontAwesomeIcon icon={faUndo} />
                                    </Nav.Link>
                                </ProductList>
                            </Card.Subtitle>
                        </Card.Header>
                    </Card>
                </ContentPanel>
                <Row>
                    <Col md={12} className="side-padding">
                        <DataGridWithSelection
                            primaryKeyField={"nserialno"}
                            total={this.state.total || 0}
                            //dataResult={this.state?.dataResult || []}
                            //data={process(this.state?.lstChildBioDirectTransfer || [], this.state.dataState)}
                            selectAll={this.state.selectedRecord?.addSelectAll}
                            userInfo={this.props.Login.userInfo}
                            title={this.props.intl.formatMessage({ id: "IDS_SELECTTODELETE" })}
                            headerSelectionChange={this.headerSelectionChange}
                            selectionChange={this.selectionChange}
                            dataStateChange={this.dataStateChange}
                            extractedColumnList={this.extractedFields}
                            dataState={this.state.dataState}
                            dataResult={this.state.dataResult || []}
                            scrollable={'scrollable'}
                            pageable={true}
                            isActionRequired={true}
                            removeNotRequired={true}
                            methodUrl={"ChildDirectTransfer"}
                            controlMap={this.props.controlMap}
                            userRoleControlRights={this.props.userRoleControlRights}
                            fetchRecord={this.viewDirectTransferDetails}
                            gridHeight={this.props.gridHeight}
                        />
                    </Col>
                </Row>

                {(this.props.Login.openChildModal) ?
                    <SlideOutModal
                        show={this.props.Login.openChildModal}
                        closeModal={this.closeChildModal}
                        operation={(this.props.Login.loadEsignStateHandle || this.props.Login.viewDirectTransferDetails) ? undefined : this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.loadEsignStateHandle ? this.props.intl.formatMessage({ id: "IDS_ESIGN" })
                            : this.props.Login.screenName}
                        esign={false}
                        needClose={this.props.Login.operation === "view" ? true : false}
                        onSaveClick={this.onMandatoryCheck}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        showSaveContinue={this.props.Login.loadEsignStateHandle ? false : true}
                        showSave={!this.props.Login.viewDirectTransferDetails}
                        hideSave={this.props.Login.operation === "view" ? true : false}
                        mandatoryFields={[]}
                        selectedRecord={this.props.Login.openChildModal ? this.state.selectedChildRecord || {} :
                            this.props.Login.loadEsignStateHandle ? {
                                ...this.state.selectedChildRecord,
                                'esignpassword': this.state.selectedChildRecord['esignpassword'],
                                'esigncomments': this.state.selectedChildRecord['esigncomments'],
                                'esignreason': this.state.selectedChildRecord['esignreason']
                            } : this.state.selectedChildRecord || {}
                        }
                        addComponent={this.props.Login.loadEsignStateHandle ?
                            <EsignStateHandle
                                operation={this.props.Login.operation}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedChildRecord || {}}
                                childDataChange={this.subChildDataChange}
                            />
                            : this.props.Login.openChildDirectTransfer ?
                                <AddDirectTransfer
                                    controlMap={this.props.controlMap}
                                    userRoleControlRights={this.props.userRoleControlRights}
                                    operation={this.props.Login.operation}
                                    childDataChange={this.subChildDataChange}
                                    selectedRecord={this.state.selectedChildRecord || {}}
                                    lstBioProject={this.props.Login.masterData?.lstBioProject || []}
                                    isChildSlideOut={true}
                                    lstStorageType={this.props.Login.masterData?.lstStorageType || []}
                                />
                                : this.props.Login.viewDirectTransferDetails ?
                                    <ContentPanel className="panel-main-content">
                                        <Card className="border-0">
                                            <Card.Body>
                                                <Row>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel>
                                                                <FormattedMessage
                                                                    id="IDS_PARENTSAMPLECODE"
                                                                    message="ParentSampleCode"
                                                                />
                                                            </FormLabel>
                                                            <ReadOnlyText>
                                                                {
                                                                    this.state.selectedViewRecord ?
                                                                        this.state.selectedViewRecord.sparentsamplecodecohortno
                                                                            ? this.state.selectedViewRecord.sparentsamplecodecohortno
                                                                            : "-" : "-"
                                                                }
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel>
                                                                <FormattedMessage
                                                                    id="IDS_REPOSITORYID"
                                                                    message="RepositoryId"
                                                                />
                                                            </FormLabel>
                                                            <ReadOnlyText>
                                                                {
                                                                    this.state.selectedViewRecord ?
                                                                        this.state.selectedViewRecord.srepositoryid
                                                                            ? this.state.selectedViewRecord.srepositoryid
                                                                            : "-" : "-"
                                                                }
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    {/* <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel>
                                                                <FormattedMessage
                                                                    id="IDS_LOCATIONCODE"
                                                                    message="LocationCode"
                                                                />
                                                            </FormLabel>
                                                            <ReadOnlyText>
                                                                {
                                                                    this.state.selectedViewRecord ?
                                                                        this.state.selectedViewRecord.slocationcode
                                                                            ? this.state.selectedViewRecord.slocationcode
                                                                            : "-" : "-"
                                                                }
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col> */}
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel>
                                                                <FormattedMessage
                                                                //jira bgsi-160 by Mullai Balaji V [17-11-2025]
                                                                    id="IDS_BIOSAMPLETYPE"
                                                                    message="BioSampleType"
                                                                />
                                                            </FormLabel>
                                                            <ReadOnlyText>
                                                                {
                                                                    this.state.selectedViewRecord ?
                                                                        this.state.selectedViewRecord.sproductname
                                                                            ? this.state.selectedViewRecord.sproductname
                                                                            : "-" : "-"
                                                                }
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel>
                                                                <FormattedMessage
                                                                    id="IDS_VOLUMEµL"
                                                                    message="Volume(µL)"
                                                                />
                                                            </FormLabel>
                                                            <ReadOnlyText>
                                                                {
                                                                    this.state.selectedViewRecord ?
                                                                        this.state.selectedViewRecord.svolume
                                                                            ? this.state.selectedViewRecord.svolume
                                                                            : "-" : "-"
                                                                }
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel>
                                                                <FormattedMessage
                                                                    id="IDS_SAMPLECONDITION"
                                                                    message="SampleCondition"
                                                                />
                                                            </FormLabel>
                                                            <ReadOnlyText>
                                                                {
                                                                    this.state.selectedViewRecord ?
                                                                        this.state.selectedViewRecord.ssamplecondition
                                                                            ? this.state.selectedViewRecord.ssamplecondition
                                                                            : "-" : "-"
                                                                }
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel>
                                                                <FormattedMessage
                                                                    id="IDS_TRANSFERSTATUS"
                                                                    message="TransferStatus"
                                                                />
                                                            </FormLabel>
                                                            <ReadOnlyText>
                                                                {
                                                                    this.state.selectedViewRecord ?
                                                                        this.state.selectedViewRecord.stransferstatus
                                                                            ? this.state.selectedViewRecord.stransferstatus
                                                                            : "-" : "-"
                                                                }
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel>
                                                                <FormattedMessage
                                                                    id="IDS_REASON"
                                                                    message="Reason"
                                                                />
                                                            </FormLabel>
                                                            <ReadOnlyText>
                                                                {
                                                                    this.state.selectedViewRecord ?
                                                                        this.state.selectedViewRecord.sreason
                                                                            ? this.state.selectedViewRecord.sreason
                                                                            : "-" : "-"
                                                                }
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </ContentPanel>
                                    : ""}
                    /> : ""}

                {this.state.openModalShow ? (
                    <ModalShow
                        modalShow={this.state.openModalShow}
                        closeModal={this.closeModalShow}
                        onSaveClick={this.onMandatoryCheck}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        mandatoryFields={""}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedChildRecord || {}}
                        modalTitle={this.state.loadEsignStateHandle ? this.props.intl.formatMessage({ id: "IDS_ESIGN" })
                            : this.props.intl.formatMessage({ id: "IDS_SAMPLEVALIDATION" })}
                        modalBody={
                            this.state.loadEsignStateHandle ?
                                <EsignStateHandle
                                    operation={this.props.Login.operation}
                                    inputParam={this.props.Login.inputParam}
                                    selectedRecord={this.state.selectedChildRecord || {}}
                                    childDataChange={this.subModalChildDataChange}
                                /> :
                                this.state.openAcceptRejectDirectTransfer ?
                                    <AcceptRejectDirectTransfer
                                        lstSampleCondition={this.state.lstSampleCondition}
                                        lstReason={this.state.lstReason}
                                        controlMap={this.props.controlMap}
                                        userRoleControlRights={this.props.userRoleControlRights}
                                        operation={this.props.Login.operation}
                                        childDataChange={this.subChildDataChange}
                                        selectedRecord={this.state.selectedChildRecord || {}}
                                    />
                                    : ""
                        }
                    />
                ) : (
                    ""
                )}
            </>
        );
    }

    dataStateChange = (event) => {
        const { lstChildBioDirectTransfer, selectedRecord } = this.state;

        // Always filter from full list
        let dataSource = lstChildBioDirectTransfer || [];

        // Reapply selection from addedChildBioDirectTransfer
        const addedChildBioDirectTransfer = selectedRecord?.addedChildBioDirectTransfer || [];
        const selectedMap = new Map(addedChildBioDirectTransfer.map(item => [item.nserialno, item]));

        dataSource = dataSource.map(item =>
            selectedMap.has(item.nserialno)
                ? { ...item, selected: true }
                : { ...item, selected: item.selected || false }
        );

        // Apply filter/sort/page
        const processed = process(dataSource, event.dataState);

        // Check if all visible rows are selected
        const allSelected = processed.data.length > 0 && processed.data.every(item => item.selected === true);

        this.setState({
            lstChildBioDirectTransfer: dataSource, // keep selection persisted
            dataResult: processed.data,
            total: processed.total,
            dataState: event.dataState,
            selectedRecord: {
                ...selectedRecord,
                addSelectAll: allSelected,
                addedChildBioDirectTransfer: Array.from(selectedMap.values())
            }
        });
    };



    headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        const eventData = event.target.props.data.hasOwnProperty('data') ? event.target.props.data.data || [] : event.target.props.data || [];
        let lstChildBioDirectTransfer = this.state?.dataResult || [];
        let addedChildBioDirectTransfer = this.state.selectedRecord?.addedChildBioDirectTransfer || [];
        let selectedRecord = this.state.selectedRecord;
        if (checked) {
            const data = lstChildBioDirectTransfer.map(item => {
                const matchingData = eventData.find(dataItem => dataItem.nserialno === item.nserialno);
                if (matchingData) {
                    const existingIndex = addedChildBioDirectTransfer.findIndex(
                        x => x.nserialno === item.nserialno
                    );

                    if (existingIndex === -1) {
                        const newItem = {
                            ...item,
                            selected: true,
                        };
                        addedChildBioDirectTransfer.push(newItem);
                    }
                    return { ...item, selected: true };
                } else {
                    return { ...item, selected: item.selected ? true : false };
                }
            });
            selectedRecord['addedChildBioDirectTransfer'] = addedChildBioDirectTransfer;
            selectedRecord['addSelectAll'] = checked;
            this.setState({
                selectedRecord,
                //lstChildBioDirectTransfer: data,
                dataResult: data
            });
            this.props.childDataChange(selectedRecord);
        } else {
            let addedChildBioDirectTransfer = this.state.selectedRecord?.addedChildBioDirectTransfer || [];
            const data = lstChildBioDirectTransfer.map(x => {
                const matchedItem = eventData.find(item => x.nserialno === item.nserialno);
                if (matchedItem) {
                    addedChildBioDirectTransfer = addedChildBioDirectTransfer.filter(item1 => item1.nserialno !== matchedItem.nserialno);
                    matchedItem.selected = false;
                    return matchedItem;
                }
                return x;
            });
            selectedRecord['addedChildBioDirectTransfer'] = addedChildBioDirectTransfer;
            selectedRecord['addSelectAll'] = checked;
            this.setState({
                selectedRecord,
                //lstChildBioDirectTransfer: data,
                dataResult: data
            });
            this.props.childDataChange(selectedRecord);
        }
    }

    selectionChange = (event) => {
        let addedChildBioDirectTransfer = this.state.selectedRecord?.addedChildBioDirectTransfer || [];
        let selectedRecord = this.state.selectedRecord;
        const lstChildBioDirectTransfer = this.state?.dataResult.map(item => {
            if (item.nserialno === event.dataItem.nserialno) {
                item.selected = !event.dataItem.selected;
                if (item.selected) {
                    const newItem = JSON.parse(JSON.stringify(item));
                    delete newItem['selected']
                    newItem.selected = true;
                    addedChildBioDirectTransfer.push(newItem);
                } else {
                    addedChildBioDirectTransfer = addedChildBioDirectTransfer.filter(item1 => item1.nserialno !== item.nserialno)
                }
            }
            return item;
        })
        selectedRecord['addedChildBioDirectTransfer'] = addedChildBioDirectTransfer;
        selectedRecord['addSelectAll'] = this.validateCheckAll(process(lstChildBioDirectTransfer || [], this.state.dataState).data);
        this.setState({
            selectedRecord,
            //lstChildBioDirectTransfer,
            dataResult: lstChildBioDirectTransfer
        });
        this.props.childDataChange(selectedRecord);
    }

    validateCheckAll(data) {
        let selectAll = true;
        if (data && data.length > 0) {
            data.forEach(dataItem => {
                if (dataItem.selected) {
                    if (dataItem.selected === false) {
                        selectAll = false;
                    }
                } else {
                    selectAll = false;
                }
            })
        } else {
            selectAll = false;
        }
        return selectAll;
    }

    addChildDirectTransfer = (addChildID, operation, screenName) => {
        if (operation === "create") {
            let selectedBioDirectTransfer = this.props?.selectedBioDirectTransfer;
            if (selectedBioDirectTransfer) {
                this.setState({ loading: true });
                rsapi().post("biodirecttransfer/findStatusDirectTransfer", {
                    'nbiodirecttransfercode': selectedBioDirectTransfer.nbiodirecttransfercode,
                    'userinfo': this.props.Login.userInfo
                })
                    .then(response => {
                        if (response.data === transactionStatus.DRAFT || response.data === transactionStatus.VALIDATION) {
                            const getSiteBasedOnTransferType = rsapi().post("biodirecttransfer/getProjectBasedOnSite", {
                                'userinfo': this.props.Login.userInfo,
                                'nbiobanksitecode': this.props?.selectedBioDirectTransfer?.nreceiversitecode
                            });
                            const getStorageType = rsapi().post("biodirecttransfer/getStorageType", { 'userinfo': this.props.Login.userInfo });
                            let urlArray = [getSiteBasedOnTransferType, getStorageType];
                            Axios.all(urlArray)
                                .then(response => {
                                    let masterData = {};
                                    masterData = { ...this.props.Login.masterData, ...response[0].data, ...response[1].data };
                                    let selectedChildRecord = this.state.selectedChildRecord;
                                    let selectedBioDirectTransferData = { ...this.props.Login.masterData?.selectedBioDirectTransfer }
                                    let selectedBioDirectTransfer = {
                                        label: selectedBioDirectTransferData.sreceiversitename,
                                        value: selectedBioDirectTransferData.nreceiversitecode,
                                        item: selectedBioDirectTransferData
                                    }
                                    selectedChildRecord['nbiobanksitecode'] = selectedBioDirectTransfer;
                                    selectedChildRecord['dtransferdate'] = rearrangeDateFormat(this.props.Login.userInfo,
                                        selectedBioDirectTransferData?.stransferdate);
                                    const updateInfo = {
                                        typeName: DEFAULT_RETURN,
                                        data: {
                                            masterData, screenName, operation, openChildModal: true, openChildDirectTransfer: true, selectedChildRecord
                                        }
                                    }
                                    this.props.updateStore(updateInfo);
                                    this.setState({ loading: false });
                                })
                                .catch(error => {
                                    if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    this.props.updateStore({ typeName: DEFAULT_RETURN, data: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                                        const UnAuthorizedAccess = {
                                            typeName: UN_AUTHORIZED_ACCESS,
                                            data: {
                                                navigation: 'forbiddenaccess',
                                                loading: false,
                                                responseStatus: error.response.status
                                            }

                                        }
                                        this.props.updateStore(UnAuthorizedAccess);
                                        this.setState({ loading: false });
                                    } else if (error.response.status === 500) {
                                        toast.error(error.message);
                                        this.setState({ loading: true });
                                    }
                                    else {
                                        toast.warn(error.response.data);
                                        this.setState({ loading: false });
                                    }
                                })
                        } else {
                            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTVALIDATEDRECORD" }));
                            this.setState({ loading: false });
                        }
                    })
                    .catch(error => {
                        if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    this.props.updateStore({ typeName: DEFAULT_RETURN, data: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                            const UnAuthorizedAccess = {
                                typeName: UN_AUTHORIZED_ACCESS,
                                data: {
                                    navigation: 'forbiddenaccess',
                                    loading: false,
                                    responseStatus: error.response.status
                                }

                            }
                            this.props.updateStore(UnAuthorizedAccess);
                            this.setState({ loading: false });
                        } else if (error.response.status === 500) {
                            toast.error(error.message);
                            this.setState({ loading: false });
                        }
                        else {
                            toast.warn(error.response.data);
                            this.setState({ loading: false });
                        }
                    })
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLESTOADD" }));
                this.setState({ loading: false });
            }

        }
    }

    acceptRejectDirectTransfer = (acceptRejectID, operation, screenName) => {
        let selectedBioDirectTransfer = this.props?.selectedBioDirectTransfer;
        let selectedRecord = this.state.selectedRecord;
        if (selectedBioDirectTransfer) {
            this.setState({ loading: true });
            rsapi().post("biodirecttransfer/acceptRejectDirectTransferSlide", {
                'addedChildBioDirectTransfer': selectedRecord?.addedChildBioDirectTransfer || [],
                'nbiodirecttransfercode': selectedBioDirectTransfer.nbiodirecttransfercode,
                'userinfo': this.props.Login.userInfo
            })
                .then(response => {

                    let lstSampleCondition = response.data?.lstSampleCondition;
                    let lstReason = response.data?.lstReason;
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            lstSampleCondition, lstReason, openAcceptRejectDirectTransfer: true, openModalShow: true,
                            selectedChildRecord: {}, ncontrolCode: acceptRejectID, screenName, operation, ...this.state.data
                        }
                    }
                    this.props.updateStore(updateInfo);
                    this.setState({ loading: false });
                })
                .catch(error => {
                    if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    this.props.updateStore({ typeName: DEFAULT_RETURN, data: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                        const UnAuthorizedAccess = {
                            typeName: UN_AUTHORIZED_ACCESS,
                            data: {
                                navigation: 'forbiddenaccess',
                                loading: false,
                                responseStatus: error.response.status
                            }
                        }
                        this.props.updateStore(UnAuthorizedAccess);
                        this.setState({ loading: false });
                    } else if (error.response.status === 500) {
                        toast.error(error.message);
                        this.setState({ loading: false });
                    }
                    else {
                        toast.warn(error.response.data);
                        this.setState({ loading: false });
                    }
                })
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLESTVALIDATE" }));
            this.setState({ loading: false });
        }
    }

    onDisposeEsignCheck = (disposeID, operation, screenName) => {

        let selectedBioDirectTransfer = this.props.selectedBioDirectTransfer;
        let selectedRecord = this.state.selectedRecord;

        if (selectedBioDirectTransfer && selectedBioDirectTransfer.ntransactionstatus === transactionStatus.VALIDATION) {
            if (selectedRecord?.addedChildBioDirectTransfer && selectedRecord?.addedChildBioDirectTransfer.length > 0) {
                const childRecordStatusCheck = selectedRecord?.addedChildBioDirectTransfer?.some(item => item.ntransferstatus === transactionStatus.TOBEDISPOSE);

                if (childRecordStatusCheck) {
                    return toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTVALIDATEDSAMPLERECORDDISPOSE" }));
                }

                let dataState = this.state.dataState;
                // let addedChildBioDirectTransfer = selectedRecord?.addedChildBioDirectTransfer.slice(dataState.skip, dataState.skip + dataState.take);
                let addedChildBioDirectTransfer = selectedRecord?.addedChildBioDirectTransfer;
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["nbiodirecttransferdetailscode"] = addedChildBioDirectTransfer.map(x => x.nbiodirecttransferdetailscode).join(',');
                inputData["nbiodirecttransfercode"] = addedChildBioDirectTransfer[0].nbiodirecttransfercode;

                let inputParam = {
                    inputData: inputData,
                    screenName: "IDS_TRANSFERFORM",
                    operation: "dispose"
                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, disposeID)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsignStateHandle: true, openChildModal: true, screenData: { inputParam }, operation, screenName
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.disposeSamples(inputData);
                }

            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLESTODISPOSE" }));
                this.setState({ loading: false });
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTVALIDATEDRECORD" }));
            this.setState({ loading: false });
        }
    }

    onUndoDisposeEsignCheck = (undoID, operation, screenName) => {
        let selectedRecord = this.state.selectedRecord;
        let selectedBioDirectTransfer = this.props?.selectedBioDirectTransfer;

        if (selectedBioDirectTransfer?.ntransactionstatus === transactionStatus.VALIDATION) {
            if (selectedRecord?.addedChildBioDirectTransfer && selectedRecord?.addedChildBioDirectTransfer.length > 0) {
                let dataState = this.state.dataState;
                // let addedChildBioDirectTransfer = selectedRecord?.addedChildBioDirectTransfer.slice(dataState.skip, dataState.skip + dataState.take);
                let addedChildBioDirectTransfer = selectedRecord?.addedChildBioDirectTransfer;
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["nbiodirecttransferdetailscode"] = addedChildBioDirectTransfer.map(x => x.nbiodirecttransferdetailscode).join(',');
                inputData["nbiodirecttransfercode"] = addedChildBioDirectTransfer[0].nbiodirecttransfercode;

                let inputParam = {
                    inputData: inputData,
                    screenName: screenName,
                    operation: "undo"
                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, undoID)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsignStateHandle: true, openChildModal: true, screenData: { inputParam }, operation, screenName
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.undoDisposeSamples(inputData);
                }

            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLESTOUNDODISPOSE" }));
                this.setState({ loading: false });
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTVALIDATEDRECORD" }));
        }
    }

    undoDisposeSamples = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("biodirecttransfer/undoDisposeSamples", {
            ...inputData
        })
            .then(response => {
                let lstChildBioDirectTransfer = response.data?.lstChildBioDirectTransfer;
                let selectedRecord = this.state.selectedRecord;
                // selectedRecord['addSelectAll'] = false;
                selectedRecord['addedSampleReceivingDetails'] = [];
                // selectedRecord['addedChildBioFormAcceptance'] = [];
                sortData(lstChildBioDirectTransfer);

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        lstChildBioDirectTransfer, selectedRecord, loadEsignStateHandle: false, openModalShow: false, openChildModal: false
                    }
                }
                this.props.updateStore(updateInfo);
                this.setState({ loading: false });
            })
            .catch(error => {
                if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    this.props.updateStore({ typeName: DEFAULT_RETURN, data: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                    const UnAuthorizedAccess = {
                        typeName: UN_AUTHORIZED_ACCESS,
                        data: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    }
                    this.props.updateStore(UnAuthorizedAccess);
                    this.setState({ loading: false });
                } else if (error.response.status === 500) {
                    toast.error(error.message);
                    this.setState({ loading: false });
                }
                else {
                    toast.warn(error.response.data);
                    this.setState({ loading: false });
                }
            })
    }

    disposeSamples = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("biodirecttransfer/disposeSamples", {
            ...inputData
        })
            .then(response => {
                let lstChildBioDirectTransfer = response.data?.lstChildBioDirectTransfer;
                let selectedRecord = this.state.selectedRecord;
                //selectedRecord['addSelectAll'] = false;
                selectedRecord['addedSampleReceivingDetails'] = [];
                //selectedRecord['addedChildBioDirectTransfer'] = [];
                sortData(lstChildBioDirectTransfer);

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        lstChildBioDirectTransfer, selectedRecord, loadEsignStateHandle: false, openModalShow: false, openChildModal: false
                    }
                }
                this.props.updateStore(updateInfo);
                this.setState({ loading: false });
            })
            .catch(error => {
                if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    this.props.updateStore({ typeName: DEFAULT_RETURN, data: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                    const UnAuthorizedAccess = {
                        typeName: UN_AUTHORIZED_ACCESS,
                        data: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    }
                    this.props.updateStore(UnAuthorizedAccess);
                    this.setState({ loading: false });
                } else if (error.response.status === 500) {
                    toast.error(error.message);
                    this.setState({ loading: false });
                }
                else {
                    toast.warn(error.response.data);
                    this.setState({ loading: false });
                }
            })
    }

    handleDelete = (deleteID, operation, screenName) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.onDeleteEsignCheck(deleteID, operation, screenName));
    }

    onDeleteEsignCheck = (deleteID, operation, screenName) => {
        let selectedBioDirectTransfer = this.props.selectedBioDirectTransfer;
        let selectedRecord = this.state.selectedRecord;
        if (selectedBioDirectTransfer && selectedBioDirectTransfer.ntransactionstatus === transactionStatus.DRAFT
            || selectedBioDirectTransfer.ntransactionstatus === transactionStatus.VALIDATION
        ) {
            if (selectedRecord?.addedChildBioDirectTransfer && selectedRecord?.addedChildBioDirectTransfer.length > 0) {
                let dataState = this.state.dataState;
                // let addedChildBioDirectTransfer = selectedRecord?.addedChildBioDirectTransfer.slice(dataState.skip, dataState.skip + dataState.take);
                let addedChildBioDirectTransfer = selectedRecord?.addedChildBioDirectTransfer;
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["nbiodirecttransferdetailscode"] = addedChildBioDirectTransfer.map(x => x.nbiodirecttransferdetailscode).join(',');
                inputData["nbiodirecttransfercode"] = addedChildBioDirectTransfer[0].nbiodirecttransfercode;

                let inputParam = {
                    inputData: inputData,
                    screenName: "IDS_TRANSFERFORM",
                    operation: "delete"
                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteID)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsignStateHandle: true, openChildModal: true, screenData: { inputParam }, screenName: "IDS_TRANSFERFORM"
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.deleteDirectTransferDetails(inputData);
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLESTODELETE" }));
                this.setState({ loading: false });
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTVALIDATEDRECORD" }));
            this.setState({ loading: false });
        }
    }

    deleteDirectTransferDetails = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("biodirecttransfer/deleteChildDirectTransfer", {
            ...inputData
        })
            .then(response => {
                let lstChildBioDirectTransfer = response.data?.lstChildBioDirectTransfer;
                let selectedRecord = this.state.selectedRecord;
                sortData(lstChildBioDirectTransfer);
                selectedRecord['addedChildBioDirectTransfer'] = [];
                selectedRecord['addSelectAll'] = false;
                let masterData = { ...this.props.Login.masterData, ...response.data }
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData, lstChildBioDirectTransfer, selectedRecord, loadEsignStateHandle: false, openModalShow: false, openChildModal: false
                    }
                }
                this.props.updateStore(updateInfo);

                this.setState({ loading: false });
            })
            .catch(error => {
                if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    this.props.updateStore({ typeName: DEFAULT_RETURN, data: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                    const UnAuthorizedAccess = {
                        typeName: UN_AUTHORIZED_ACCESS,
                        data: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    }
                    this.props.updateStore(UnAuthorizedAccess);
                    this.setState({ loading: false });
                } else if (error.response.status === 500) {
                    toast.error(error.message);
                    this.setState({ loading: false });
                }
                else {
                    toast.warn(error.response.data);
                    this.setState({ loading: false });
                }
            })

    }

    subModalChildDataChange = (selectedRecord) => {
        let isInitialRender = false;
        if (this.props.Login.loadEsignStateHandle && this.props.Login.openAcceptRejectDirectTransfer) {
            this.setState({
                selectedChildRecord: {
                    ...selectedRecord
                },
                isInitialRender
            });
        }
    }

    subChildDataChange = (selectedRecord) => {
        let isInitialRender = false;
        this.setState({
            selectedChildRecord: {
                ...selectedRecord
            },
            isInitialRender
        });
    }

    onMandatoryCheck = (saveType, formRef) => {
        const mandatoryFields = (this.state.openAcceptRejectDirectTransfer ? this.state.loadEsignStateHandle : this.props.Login.loadEsignStateHandle) ?
            [
                { "idsName": "IDS_PASSWORD", "dataField": "esignpassword", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_REASON", "dataField": "esignreason", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "idsName": "IDS_COMMENTS", "dataField": "esigncomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            ]
            :
            this.props.Login.openChildDirectTransfer ? this.props.Login.operation === 'create' ?
                [
                    { "idsName": "IDS_TRANSFERSITE", "dataField": "nbiobanksitecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_TRANSFERDATE", "dataField": "dtransferdate", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "datepicker" },
                    { "idsName": "IDS_BIOPROJECT", "dataField": "nbioprojectcode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_PARENTSAMPLECODE", "dataField": "sparentsamplecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
                ]
                : []
                : this.state.openAcceptRejectDirectTransfer ?
                    [
                        { "idsName": "IDS_SAMPLECONDITION", "dataField": "nsamplecondition", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                        { "idsName": "IDS_REASON", "dataField": "nreasoncode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
                    ] : [];

        onSaveMandatoryValidation(this.state.selectedChildRecord, mandatoryFields, (this.state.openAcceptRejectDirectTransfer ? this.state.loadEsignStateHandle : this.props.Login.loadEsignStateHandle) ? this.validateChildEsign :
            this.props.Login.openChildDirectTransfer ? this.onSaveClick : this.state.openAcceptRejectDirectTransfer ?
                this.onModalSaveEsignCheck
                : "", (this.state.openAcceptRejectDirectTransfer ? this.state.loadEsignStateHandle : this.props.Login.loadEsignStateHandle), saveType);
    }

    validateChildEsign = () => {
        let ncontrolcode = this.props.Login.ncontrolcode;
        let modalName = "";
        modalName = "openChildModal";
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sreason: this.state.selectedChildRecord["esigncomments"],
                    nreasoncode: this.state.selectedChildRecord["esignreason"] && this.state.selectedChildRecord["esignreason"].value,
                    spredefinedreason: this.state.selectedChildRecord["esignreason"] && this.state.selectedChildRecord["esignreason"].label,
                },
                password: this.state.selectedChildRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }
        this.validateChildEsignforDirectTransfer(inputParam, modalName);
    }

    validateChildEsignforDirectTransfer = (inputParam) => {
        rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {
                    if (inputParam["screenData"]["inputParam"]["operation"] === "accept"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_SAMPLECONDITION") {
                        this.onModalSave(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "delete"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_TRANSFERFORM") {
                        this.deleteDirectTransferDetails(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "dispose"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_TRANSFERFORM") {
                        this.disposeSamples(inputParam["screenData"]["inputParam"]["inputData"]);
                    }else if (inputParam["screenData"]["inputParam"]["operation"] === "undo"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_UNDODISPOSE") {
                        this.undoDisposeSamples(inputParam["screenData"]["inputParam"]["inputData"]);
                    }
                }
            })
            .catch(error => {
                if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    this.props.updateStore({ typeName: DEFAULT_RETURN, data: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                    const UnAuthorizedAccess = {
                        typeName: UN_AUTHORIZED_ACCESS,
                        data: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    }
                    this.props.updateStore(UnAuthorizedAccess);
                    this.setState({ loading: false });
                } else if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.info(error.response.data);
                }
            })
    }

    onSaveClick = (saveType) => {
        let selectedChildRecord = this.state.selectedChildRecord;
        let selectedRecord = this.state.selectedRecord;
        let inputData = [];
        let operation = this.props.Login.operation;
        if (operation === "create") {
            inputData["bioChildDirectTransfer"] = {
                "sformnumber": this.props.selectedBioDirectTransfer?.sformnumber || '',
                "nbiobanksitecode": selectedChildRecord?.nbiobanksitecode?.value || -1,
                "stransferdate": selectedChildRecord.dtransferdate && selectedChildRecord.dtransferdate !== null ?
                    convertDateTimetoStringDBFormat(selectedChildRecord.dtransferdate, this.props.Login.userInfo) : '',
                "nbioprojectcode": selectedChildRecord?.nbioprojectcode?.value || -1,
                "nbioparentsamplecode": selectedChildRecord?.sparentsamplecode?.item?.nbioparentsamplecode || -1,
                "sparentsamplecode": selectedChildRecord?.sparentsamplecode?.item?.sparentsamplecode || '',
                "ncohortno": selectedChildRecord?.sparentsamplecode?.item?.ncohortno || -1,
                "nstoragetypecode": selectedChildRecord?.nstoragetypecode?.value || -1,
                "nproductcode": selectedChildRecord?.nproductcode?.value || -1,
                "sproductname": selectedChildRecord?.nproductcode?.label || '',
                "sremarks": selectedChildRecord?.sremarks || '',
                "sstoragetypename": selectedChildRecord?.nstoragetypecode?.label || '',
                "srepositoryid": selectedChildRecord.addedSampleReceivingDetails &&
                    selectedChildRecord.addedSampleReceivingDetails.map(item => item.srepositoryid).join(', ') || ''
            }
            inputData["filterSelectedSamples"] = selectedChildRecord.addedSampleReceivingDetails && selectedChildRecord.addedSampleReceivingDetails || [];
            inputData["nbiodirecttransfercode"] = this.props?.selectedBioDirectTransfer?.nbiodirecttransfercode;
            inputData["userinfo"] = this.props.Login.userInfo;
            if (selectedChildRecord.addedSampleReceivingDetails && selectedChildRecord.addedSampleReceivingDetails.length > 0) {
                this.setState({ loading: true });
                rsapi().post("biodirecttransfer/createChildBioDirectTransfer", { ...inputData })
                    .then(response => {

                        let masterData = { ...this.props.Login.masterData };
                        let responseData = response.data;
                        let lstBioDirectTransfer = this.props.Login.masterData?.lstBioDirectTransfer;
                        let searchedData = this.props.Login.masterData?.searchedData;

                        const index = lstBioDirectTransfer.findIndex(item => item && item.nbiodirecttransfercode === responseData.selectedBioDirectTransfer.nbiodirecttransfercode);
                        const searchedDataIndex = searchedData ? searchedData.findIndex(item => item && item.nbiodirecttransfercode === response.data.selectedBioDirectTransfer.nbiodirecttransfercode) : -1;

                        if (index !== -1) {
                            lstBioDirectTransfer[index] = responseData.selectedBioDirectTransfer;
                        }
                        if (searchedDataIndex !== -1) {
                            searchedData[searchedDataIndex] = response.data.selectedBioDirectTransfer;
                        }
                        masterData['lstBioDirectTransfer'] = lstBioDirectTransfer;
                        masterData['searchedData'] = searchedData;

                        masterData = { ...masterData, ...responseData };

                        let openChildModal = false;
                        let openChildDirectTransfer = false;
                        if (saveType === 2) {
                            openChildModal = true;
                            openChildDirectTransfer = true;
                            selectedChildRecord['lstParentSample'] = [];
                            selectedChildRecord['lstSampleType'] = [];
                            selectedChildRecord['nbioprojectcode'] = '';
                            selectedChildRecord['sparentsamplecode'] = '';
                            selectedChildRecord['nstoragetypecode'] = '';
                            selectedChildRecord['nproductcode'] = '';
                            selectedChildRecord['lstGetSampleReceivingDetails'] = [];
                            selectedChildRecord['addSelectAll'] = false;
                            selectedChildRecord['addedSampleReceivingDetails'] = [];
                        } else {
                            selectedChildRecord = {};
                        }
                        selectedRecord['addSelectAll'] = false;
                        selectedRecord['addedChildBioDirectTransfer'] = [];
                        const updateInfo = {
                            typeName: DEFAULT_RETURN,
                            data: {
                                masterData, openChildModal, openChildDirectTransfer, selectedChildRecord, selectedRecord: { ...selectedRecord, selectedChildRecord }
                            }
                        }
                        this.props.updateStore(updateInfo);
                        this.setState({ loading: false });
                    })
                    .catch(error => {
                        if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    this.props.updateStore({ typeName: DEFAULT_RETURN, data: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                            const UnAuthorizedAccess = {
                                typeName: UN_AUTHORIZED_ACCESS,
                                data: {
                                    navigation: 'forbiddenaccess',
                                    loading: false,
                                    responseStatus: error.response.status
                                }
                            }
                            this.props.updateStore(UnAuthorizedAccess);
                            this.setState({ loading: false });
                        } else if (error.response.status === 500) {
                            toast.error(error.message);
                            this.setState({ loading: false });
                        }
                        else {
                            toast.warn(error.response.data);
                            this.setState({ loading: false });
                        }
                    })
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLESTOADD" }));
                this.setState({ loading: false });
            }
        }
    }

    closeChildModal = () => {
        let openChildModal = this.props.Login.openChildModal;
        let selectedChildRecord = this.props.Login.selectedChildRecord;
        let openChildDirectTransfer = this.props.Login.openChildDirectTransfer;
        let viewDirectTransferDetails = this.props.Login.viewDirectTransferDetails;
        let loadEsignStateHandle = this.props.Login.loadEsignStateHandle;

        if (this.props.Login.loadEsignStateHandle) {
            openChildModal = false;
            selectedChildRecord = {};
            openChildDirectTransfer = false;
            viewDirectTransferDetails = false;
            loadEsignStateHandle = false;
        } else {
            openChildModal = false;
            selectedChildRecord = {};
            openChildDirectTransfer = false;
            viewDirectTransferDetails = false;
            loadEsignStateHandle = false;
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                ...this.state.data,
                openChildModal,
                operation: undefined,
                selectedChildRecord,
                selectedId: null,
                openChildDirectTransfer,
                viewDirectTransferDetails,
                loadEsignStateHandle
            }
        }
        this.props.updateStore(updateInfo);

    }

    closeModalShow = () => {
        let openAcceptRejectDirectTransfer = this.state.openAcceptRejectDirectTransfer;
        let openModalShow = this.state.openModalShow;
        let loadEsignStateHandle = this.state.loadEsignStateHandle;
        let selectedChildRecord = this.state.selectedChildRecord;
        let screenName = this.props.Login.screenName;
        let operation = this.props.Login.operation;

        if (this.props.Login.loadEsignStateHandle) {
            loadEsignStateHandle = false;
            openModalShow = (screenName === "IDS_SAMPLECONDITION" && operation === "accept") ? true : false;
            openAcceptRejectDirectTransfer = (screenName === "IDS_SAMPLECONDITION" && operation === "accept") ? true : false;
            if (selectedChildRecord) {
                delete selectedChildRecord["esigncomments"];
                delete selectedChildRecord["esignpassword"];
                delete selectedChildRecord["esignreason"];
            }
        } else {
            openAcceptRejectDirectTransfer = false;
            openModalShow = false;
            selectedChildRecord = {};
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openAcceptRejectDirectTransfer, openModalShow, selectedChildRecord, loadEsignStateHandle
            }
        }
        this.props.updateStore(updateInfo);
    }

    onModalSaveEsignCheck = () => {
        let selectedChildRecord = this.state.selectedChildRecord;
        let selectedRecord = this.state.selectedRecord;
        let dataState = this.state.dataState;
        // let addedChildBioDirectTransfer = selectedRecord?.addedChildBioDirectTransfer.slice(dataState.skip, dataState.skip + dataState.take);
        let addedChildBioDirectTransfer = selectedRecord?.addedChildBioDirectTransfer;
        let inputData = {
            'nbiodirecttransfercode': addedChildBioDirectTransfer[0].nbiodirecttransfercode,
            'nbiodirecttransferdetailscode': addedChildBioDirectTransfer.map(x => x.nbiodirecttransferdetailscode).join(',') || '-1',
            'userinfo': this.props.Login.userInfo,
            'nreasoncode': selectedChildRecord?.nreasoncode.value,
            'nsamplecondition': selectedChildRecord?.nsamplecondition.value
        };

        let inputParam = {
            inputData: inputData,
            screenName: "IDS_SAMPLECONDITION",
            operation: "accept"
        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsignStateHandle: true, openModalShow: true, screenData: { inputParam }, screenName: "IDS_SAMPLECONDITION"
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.onModalSave(inputData);
        }
    }

    onModalSave = (inputData) => {
        let selectedRecord = this.state.selectedRecord;
        let masterData = this.props.Login.masterData;
        this.setState({ loading: true });
        rsapi().post("biodirecttransfer/updateSampleCondition", { ...inputData })
            .then(response => {
                let lstChildBioDirectTransfer = response.data?.lstChildBioDirectTransfer;
                masterData['lstChildBioDirectTransfer'] = lstChildBioDirectTransfer; 
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        lstChildBioDirectTransfer, openAcceptRejectDirectTransfer: false, openModalShow: false, selectedChildRecord: {},
                        selectedRecord, loadEsignStateHandle: false, masterData
                    }
                }
                this.props.updateStore(updateInfo);
                this.setState({ loading: false });
            })
            .catch(error => {
                if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    this.props.updateStore({ typeName: DEFAULT_RETURN, data: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                    const UnAuthorizedAccess = {
                        typeName: UN_AUTHORIZED_ACCESS,
                        data: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
                    }
                    this.props.updateStore(UnAuthorizedAccess);
                    this.setState({ loading: false });
                } else if (error.response.status === 500) {
                    toast.error(error.message);
                    this.setState({ loading: false });
                }
                else {
                    toast.warn(error.response.data);
                    this.setState({ loading: false });
                }
            })
    }

    viewDirectTransferDetails = (paramData) => {
        let selectedViewRecord = paramData.treeView;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openChildModal: true,
                viewDirectTransferDetails: true,
                selectedViewRecord, operation: 'view', screenName: 'IDS_SAMPLESDETAILS'
            }
        }
        this.props.updateStore(updateInfo);
    }

}

export default connect(mapStateToProps, { updateStore })(injectIntl(OuterGridDirectTransfer));