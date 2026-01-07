import { faArrowLeft, faCheck, faDolly, faUndo, faWarehouse, faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { process } from '@progress/kendo-data-query';
import Axios from 'axios';
import React from 'react';
import { Button, Card, Col, FormGroup, FormLabel, Nav, Row } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { updateStore } from '../../../actions';
import { ReadOnlyText } from "../../../components/App.styles";
import { constructOptionList, onSaveMandatoryValidation, showEsign, sortData } from '../../../components/CommonScript';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';
import DataGridWithSelection from '../../../components/data-grid/DataGridWithSelection';
import { transactionStatus, formType } from '../../../components/Enumeration';
import ModalShow from '../../../components/ModalShow';
import Preloader from '../../../components/preloader/preloader.component';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import rsapi from '../../../rsapi';
import EsignStateHandle from '../../audittrail/EsignStateHandle';
import { ContentPanel, ProductList } from '../../product/product.styled';
import AcceptRejectDirectTransfer from '../directtransfer/AcceptRejectDirectTransfer';
import StorageStrcutreViewFormAcceptance from '../formacceptance/StorageStrcutreViewFormAcceptance';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './../../../actions/LoginTypes';
import { ReactComponent as MoveToreturnStoredSamples } from './../../../assets/image/delivery-hand-package-icon.svg';


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class OuterGridFormAcceptance extends React.Component {
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
            controlMap: props.controlMap,
            userRoleControlRights: props.userRoleControlRights,
            data: props.lstChildBioFormAcceptance,
            lstChildBioFormAcceptance: props.lstChildBioFormAcceptance,
            lstBioFormAcceptance: props.lstBioFormAcceptance,
            selectedBioFormAcceptance: props.selectedBioFormAcceptance,
            selectedChildRecord: {},
            selectedViewRecord: {},
            selectedFreezerRecord: {},
            initialSelectedFreezerRecord: {},
            shouldRender: true,
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const updates = {};

        // ✅ helper for deep compare
        const isChanged = (curr, prev) => JSON.stringify(curr) !== JSON.stringify(prev);

        // --- Handle dataResult change ---
        if (isChanged(prevState?.dataResult, this.state?.dataResult)) {
            const addedChildBioFormAcceptance = (this.state?.dataResult || [])
                .filter(dr =>
                    (this.state?.lstChildBioFormAcceptance || []).some(lc => lc?.nserialno === dr?.nserialno) &&
                    dr?.selected === true
                )
                .map(item => ({ ...item }));

            updates.selectedRecord = {
                ...this.state?.selectedRecord,
                addedChildBioFormAcceptance
            };
        }

        // --- Props-based updates ---
        const propsToStateMap = {
            selectedRecord: 'selectedRecord',
            selectedChildRecord: 'selectedChildRecord',
            selectedViewRecord: 'selectedViewRecord',
            loadEsignStateHandle: 'loadEsignStateHandle',
            openModalShow: 'openModalShow',
            openAcceptRejectFormAcceptance: 'openAcceptRejectFormAcceptance',
            lstSampleCondition: 'lstSampleCondition',
            lstReason: 'lstReason',
            lstChildBioFormAcceptance: 'lstChildBioFormAcceptance',
            selectedFreezerRecord: 'selectedFreezerRecord',
            initialSelectedFreezerRecord: 'initialSelectedFreezerRecord',
            shouldRender: 'shouldRender'
        };

        for (const [propKey, stateKey] of Object.entries(propsToStateMap)) {
            if (isChanged(this.props?.Login?.[propKey], prevProps?.Login?.[propKey])) {
                updates[stateKey] = this.props?.Login?.[propKey];
            }
        }

        if (isChanged(this.props?.Login?.isGridClear, prevProps?.Login?.isGridClear)) {
            updates.selectedRecord = {};
            updates.dataState = {
                skip: 0,
                take: this.props.settings ? parseInt(this.props.settings[14]) : 10,
            };
            updates.dataResult = (this.props?.Login?.masterData?.lstChildBioFormAcceptance || []).slice(updates.dataState.skip, updates.dataState.skip + updates.dataState.take);
            updates.lstChildBioFormAcceptance = this.props?.Login?.masterData?.lstChildBioFormAcceptance;
        }

        if (isChanged(this.props?.Login?.masterData?.selectedSampleStorageVersion, prevProps?.Login?.masterData?.selectedSampleStorageVersion)) {
            if (this.props.Login.masterData.selectedSampleStorageVersion && this.props.Login.masterData.selectedSampleStorageVersion !== undefined) {
                updates.treeDataView = {};
                updates.treeDataView = this.props.Login.masterData.selectedSampleStorageVersion["jsondata"].data;
            }
        }

        // --- Handle masterData.lstChildBioFormAcceptance ---
        if (isChanged(this.props?.Login?.masterData?.lstChildBioFormAcceptance, prevProps?.Login?.masterData?.lstChildBioFormAcceptance)) {
            const processed = this.props?.Login?.masterData?.lstChildBioFormAcceptance && process(this.props?.Login?.masterData?.lstChildBioFormAcceptance, this.props?.dataState);
            updates.lstChildBioFormAcceptance = this.props?.Login?.masterData?.lstChildBioFormAcceptance;
            updates.dataResult = processed ? processed.data : [];
            updates.total = processed ? processed.total : 0;
            updates.dataState = this.props?.dataState || {};
        }

        // --- Handle lstChildBioDirectTransfer ---
        if (isChanged(this.props?.Login?.lstChildBioFormAcceptance, prevProps?.Login?.lstChildBioFormAcceptance)) {
            // const { dataState, selectedRecord: prevSelected = {} } = this.state;
            let dataState = this.state?.dataState || {};
            const prevSelected = this.state?.selectedRecord || {};
            const newList = this.props?.Login?.lstChildBioFormAcceptance || [];

            if (newList.length <= dataState.skip) {
                dataState = {
                    skip: 0,
                    take: this.props.settings ? parseInt(this.props.settings[14]) : 10,
                };
            }

            const addedMap = new Map((prevSelected?.addedChildBioFormAcceptance || []).map(item => [item?.nserialno, item]));

            const updatedLstChildBioFormAcceptance = newList.map(item => {
                if (addedMap.has(item?.nserialno)) {
                    const updated = { ...item, selected: true };
                    addedMap.set(item?.nserialno, updated);
                    return updated;
                }
                return { ...item };
            });

            const addedChildBioFormAcceptance = Array.from(addedMap.values());
            const processed = process(updatedLstChildBioFormAcceptance, dataState);
            updates.lstChildBioFormAcceptance = updatedLstChildBioFormAcceptance;
            updates.dataResult = processed ? processed.data : [];
            updates.total = processed ? processed.total : 0;
            updates.dataState = dataState;
            updates.selectedRecord = { ...prevSelected, addedChildBioFormAcceptance };
        }

        if (this.props.Login.selectedViewRecord !== prevProps.Login.selectedViewRecord) {
            updates.selectedViewRecord = this.props.Login.selectedViewRecord;
        }

        // ✅ Apply all updates in one setState
        if (Object.keys(updates).length > 0) {
            this.setState(updates);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.Login.openChildModal && (this.state.openModalShow) && nextState.isInitialRender === false &&
            (nextState.selectedChildRecord !== this.state.selectedChildRecord)) {
            return false;
        } else if ((this.props.Login.storageModal) && this.state.shouldRender === false && nextProps.Login.shouldRender === false) {
            return false;
        } else {
            return true;
        }
    }

    render() {
        this.extractedFields =
            [
                { "idsName": "IDS_REPOSITORYID", "dataField": "srepositoryid", "width": "100px" },
                { "idsName": "IDS_PARENTSAMPLECODE", "dataField": "sparentsamplecode", "width": "130px" },
                { "idsName": "IDS_BIOSAMPLETYPE", "dataField": "sproductname", "width": "130px" },
                { "idsName": "IDS_VOLUMEµL", "dataField": "sreceivedvolume", "width": "100px" },
                { "idsName": "IDS_SAMPLECONDITION", "dataField": "ssamplecondition", "width": "120px" },
                { "idsName": "IDS_SAMPLESTATUS", "dataField": "ssamplestatus", "width": "100px" },
            ];

        const acceptRejectID = this.props.acceptRejectID;
        const moveToDisposeID = this.props.moveToDisposeID;
        const moveToReturnID = this.props.moveToReturnID;
        const undoID = this.props.undoID;
        const storeID = this.props.storeID;
        const moveToReturnCompleteID = this.props.moveToReturnaftercompleteID;

        // console.log("Parent Render");
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
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_SAMPLEVALIDATION" })} data-place="left"
                                        hidden={this.props.userRoleControlRights.indexOf(acceptRejectID) === -1}
                                        onClick={() => this.acceptRejectFormAcceptance(acceptRejectID, 'accept', 'IDS_SAMPLECONDITION')}>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </Nav.Link>
                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_MOVETODISPOSE" })} data-place="left"
                                        hidden={this.props.userRoleControlRights.indexOf(moveToDisposeID) === -1}
                                        onClick={() => this.onMoveToDisposeEsignCheck(moveToDisposeID, 'movetodispose', 'IDS_MOVETODISPOSE')}>
                                        <FontAwesomeIcon icon={faDolly} />
                                    </Nav.Link>
                                    {this.props.realSelectedFormType && this.props.realSelectedFormType.value === formType.TRANSFER &&
                                        <Nav.Link
                                            className="btn btn-circle outline-grey ml-2"
                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_MOVETORETURN" })} data-place="left"
                                            hidden={this.props.userRoleControlRights.indexOf(moveToReturnID) === -1}
                                            onClick={() => this.onMoveToReturnEsignCheck(moveToReturnID, 'movetoreturn', 'IDS_MOVETORETURN')}>
                                            <FontAwesomeIcon icon={faArrowLeft} />
                                        </Nav.Link>
                                    }
                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_UNDODISPOSERETURN" })} data-place="left"
                                        hidden={this.props.userRoleControlRights.indexOf(undoID) === -1}
                                        onClick={() => this.onUndoReturnDisposeEsignCheck(undoID, 'undo', 'IDS_UNDODISPOSERETURN')}>
                                        <FontAwesomeIcon icon={faUndo} />
                                    </Nav.Link>
                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_STORE" })} data-place="left"
                                        hidden={this.props.userRoleControlRights.indexOf(storeID) === -1}
                                        onClick={() => this.onStore(storeID, 'store', 'IDS_STORE')}>
                                        <FontAwesomeIcon icon={faWarehouse} />
                                    </Nav.Link>
                                    {this.props.realSelectedFormType && this.props.realSelectedFormType.value === formType.TRANSFER &&

                                        <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_RETURNUSEDSAMPLES" })}
                                            hidden={this.props.userRoleControlRights.indexOf(moveToReturnCompleteID) === -1}
                                            onClick={() => this.onMoveReturnDisposeAfterCompleteEsignCheck(moveToReturnCompleteID, 'movetoreturncomplete', 'IDS_MOVETORETURNCOMPLETE')}>
                                            <MoveToreturnStoredSamples className='custom_icons' />
                                        </Button>
                                    }
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
                            // data={this.state?.lstChildBioFormAcceptance || []}
                            selectAll={this.state.selectedRecord?.addSelectAll}
                            userInfo={this.props.Login.userInfo}
                            title={this.props.intl.formatMessage({ id: "IDS_SELECTTODELETE" })}
                            headerSelectionChange={this.headerSelectionChange}
                            selectionChange={this.selectionChange}
                            dataStateChange={this.dataStateChange}
                            extractedColumnList={this.extractedFields}
                            dataState={this.state.dataState}
                            // dataResult={process(this.state?.lstChildBioFormAcceptance || [], this.state.dataState)}
                            dataResult={this.state.dataResult || []}
                            scrollable={'scrollable'}
                            pageable={true}
                            isActionRequired={true}
                            removeNotRequired={true}
                            methodUrl={"ChildFormAcceptance"}
                            controlMap={this.props.controlMap}
                            userRoleControlRights={this.props.userRoleControlRights}
                            fetchRecord={this.viewFormAcceptanceDetails}
                            gridHeight={this.props.gridHeight}
                        />
                    </Col>
                </Row>

                {(this.props.Login.openChildModal) ?
                    <SlideOutModal
                        show={this.props.Login.openChildModal}
                        closeModal={this.closeChildModal}
                        operation={(this.props.Login.loadEsignStateHandle || this.props.Login.viewFormAcceptanceDetails) ? undefined : this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.loadEsignStateHandle ? this.props.intl.formatMessage({ id: "IDS_ESIGN" })
                            : this.props.Login.storageModal ? "" : this.props.Login.screenName}
                        esign={false}
                        needClose={this.props.Login.operation === "view" ? true : false}
                        hideSave={this.props.Login.operation === "view" ? true : false}
                        onSaveClick={this.onMandatoryCheck}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        showSaveContinue={this.props.Login.loadEsignStateHandle ? false : true}
                        showSave={!this.props.Login.viewFormAcceptanceDetails}
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
                            : this.props.Login.storageModal ?
                                <StorageStrcutreViewFormAcceptance
                                    id="samplestoragelocation"
                                    name="samplestoragelocation"
                                    treeDataView={this.state.treeDataView}
                                    freezerData={this.props.Login.masterData.freezerList}
                                    initialSelectedFreezerRecord={this.state.initialSelectedFreezerRecord || this.props.Login.initialSelectedFreezerRecord}
                                    expandIcons={true}
                                    selectField={'active-node'}
                                    onFreezerChange={(updatedRecord) => this.setState({
                                        selectedFreezerRecord: updatedRecord, shouldRender: false
                                    })}
                                    onTreeDataChange={(newTreeData) => this.setState({
                                        treeDataView: newTreeData, shouldRender: false
                                    })}
                                />
                                : this.props.Login.viewFormAcceptanceDetails ?
                                    <ContentPanel className="panel-main-content">
                                        <Card className="border-0">
                                            <Card.Body>
                                                <Row>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel>
                                                                <FormattedMessage
                                                                    id="IDS_REQUESTFORMNO"
                                                                    message="Requestformno"
                                                                />
                                                            </FormLabel>
                                                            {/* modified by sujatha ATE_274 bgsi-292 for from ecatalogrequestapproval to sformnumber for an issue of getting null in this field in the bgsi return flow */}
                                                            <ReadOnlyText>
                                                                {
                                                                    this.state.selectedViewRecord ?
                                                                        this.state.selectedViewRecord.sformnumber
                                                                            ? this.state.selectedViewRecord.sformnumber
                                                                            : "-" : "-"
                                                                }
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
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
                                                    <Col md={4}>
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
                                                    </Col>
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
                                                                    id="IDS_ACTUALVOLUMEµL"
                                                                    message="ActualVolume(µL)"
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
                                                                    id="IDS_RECEIVEDVOLUMEµL"
                                                                    message="Received Volume(µL)"
                                                                />
                                                            </FormLabel>
                                                            <ReadOnlyText>
                                                                {
                                                                    this.state.selectedViewRecord ?
                                                                        this.state.selectedViewRecord.sreceivedvolume
                                                                            ? this.state.selectedViewRecord.sreceivedvolume
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
                                                                    id="IDS_SAMPLESTATUS"
                                                                    message="SampleStatus"
                                                                />
                                                            </FormLabel>
                                                            <ReadOnlyText>
                                                                {
                                                                    this.state.selectedViewRecord ?
                                                                        this.state.selectedViewRecord.ssamplestatus
                                                                            ? this.state.selectedViewRecord.ssamplestatus
                                                                            : "-" : "-"
                                                                }
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    {/* <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel>
                                                                <FormattedMessage
                                                                    id="IDS_SAMPLESTATUS"
                                                                    message="SampleStatus"
                                                                />
                                                            </FormLabel>
                                                            <ReadOnlyText>
                                                                {
                                                                    this.state.selectedViewRecord ?
                                                                        this.state.selectedViewRecord.ssamplestatus
                                                                            ? this.state.selectedViewRecord.ssamplestatus
                                                                            : "-" : "-"
                                                                }
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col> */}
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
                                this.state.openAcceptRejectFormAcceptance ?
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

    // dataStateChange = (event) => {
    //     let updatedList = [];
    //     let selectedRecord = this.state.selectedRecord;
    //     if (event.dataState && event.dataState.filter === null) {
    //         let addedChildBioFormAcceptance = selectedRecord.addedChildBioFormAcceptance || this.state.lstChildBioFormAcceptance || [];
    //         addedChildBioFormAcceptance.forEach(x => {
    //             const exists = this.state.addedChildBioFormAcceptance.some(
    //                 item => item.nserialno === x.nserialno
    //             );
    //             if (!exists) {
    //                 updatedList.push(x);
    //             }
    //         });
    //     } else {
    //         updatedList = this.state.lstChildBioFormAcceptance || []
    //     }
    //     selectedRecord['addSelectAll'] = event.dataState && event.dataState.filter === null ?
    //         this.validateCheckAll(updatedList) :
    //         this.validateCheckAll(process(updatedList || [], event.dataState).data);
    //     this.setState({
    //         dataResult: process(this.state.lstChildBioFormAcceptance || [], event.dataState),
    //         lstChildBioFormAcceptance: updatedList,
    //         dataState: event.dataState,
    //         selectedRecord
    //     });
    // }

    dataStateChange = (event) => {
        const { lstChildBioFormAcceptance, selectedRecord } = this.state;

        // Always filter from full list
        let dataSource = lstChildBioFormAcceptance || [];

        // Reapply selection from addedChildBioFormAcceptance
        const addedChildBioFormAcceptance = selectedRecord?.addedChildBioFormAcceptance || [];
        const selectedMap = new Map(addedChildBioFormAcceptance.map(item => [item.nserialno, item]));

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
            lstChildBioFormAcceptance: dataSource, // keep selection persisted
            dataResult: processed.data,
            total: processed.total,
            dataState: event.dataState,
            selectedRecord: {
                ...selectedRecord,
                addSelectAll: allSelected,
                addedChildBioFormAcceptance: Array.from(selectedMap.values())
            }
        });
    }

    headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        const eventData = event.target.props.data.hasOwnProperty('data') ? event.target.props.data.data || [] : event.target.props.data || [];
        let lstChildBioFormAcceptance = this.state?.dataResult || [];
        let addedChildBioFormAcceptance = this.state.selectedRecord?.addedChildBioFormAcceptance || [];
        let selectedRecord = this.state.selectedRecord;
        if (checked) {
            const data = lstChildBioFormAcceptance.map(item => {
                const matchingData = eventData.find(dataItem => dataItem.nserialno === item.nserialno);
                if (matchingData) {
                    const existingIndex = addedChildBioFormAcceptance.findIndex(
                        x => x.nserialno === item.nserialno
                    );

                    if (existingIndex === -1) {
                        const newItem = {
                            ...item,
                            selected: true,
                        };
                        addedChildBioFormAcceptance.push(newItem);
                    }
                    return { ...item, selected: true };
                } else {
                    return { ...item, selected: item.selected ? true : false };
                }
            });
            selectedRecord['addedChildBioFormAcceptance'] = addedChildBioFormAcceptance;
            selectedRecord['addSelectAll'] = checked;
            this.setState({
                selectedRecord,
                // lstChildBioFormAcceptance: data
                dataResult: data
            });
            this.props.childDataChange(selectedRecord);
        } else {
            let addedChildBioFormAcceptance = this.state.selectedRecord?.addedChildBioFormAcceptance || [];
            const data = lstChildBioFormAcceptance.map(x => {
                const matchedItem = eventData.find(item => x.nserialno === item.nserialno);
                if (matchedItem) {
                    addedChildBioFormAcceptance = addedChildBioFormAcceptance.filter(item1 => item1.nserialno !== matchedItem.nserialno);
                    matchedItem.selected = false;
                    return matchedItem;
                }
                return x;
            });
            selectedRecord['addedChildBioFormAcceptance'] = addedChildBioFormAcceptance;
            selectedRecord['addSelectAll'] = checked;
            this.setState({
                selectedRecord,
                // lstChildBioFormAcceptance: data
                dataResult: data
            });
            this.props.childDataChange(selectedRecord);
        }
    }

    selectionChange = (event) => {
        let addedChildBioFormAcceptance = this.state.selectedRecord?.addedChildBioFormAcceptance || [];
        let selectedRecord = this.state.selectedRecord;
        const lstChildBioFormAcceptance = this.state?.dataResult.map(item => {
            if (item.nserialno === event.dataItem.nserialno) {
                item.selected = !event.dataItem.selected;
                if (item.selected) {
                    const newItem = JSON.parse(JSON.stringify(item));
                    delete newItem['selected']
                    newItem.selected = true;
                    addedChildBioFormAcceptance.push(newItem);
                } else {
                    addedChildBioFormAcceptance = addedChildBioFormAcceptance.filter(item1 => item1.nserialno !== item.nserialno)
                }
            }
            return item;
        })
        selectedRecord['addedChildBioFormAcceptance'] = addedChildBioFormAcceptance;
        selectedRecord['addSelectAll'] = this.validateCheckAll(process(lstChildBioFormAcceptance || [], this.state.dataState).data);
        this.setState({
            selectedRecord,
            // lstChildBioFormAcceptance
            dataResult: lstChildBioFormAcceptance
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

    acceptRejectFormAcceptance = (acceptRejectID, operation, screenName) => {
        let selectedBioFormAcceptance = this.props?.selectedBioFormAcceptance;
        if (selectedBioFormAcceptance) {
            this.setState({ loading: true });
            rsapi().post("formacceptance/findStatusFormAcceptance", {
                'nbioformacceptancecode': selectedBioFormAcceptance.nbioformacceptancecode,
                'userinfo': this.props.Login.userInfo
            })
                .then(response => {
                    if (response.data === transactionStatus.RECEIVED) {
                        let selectedRecord = this.state.selectedRecord;
                        if (selectedRecord && selectedRecord.addedChildBioFormAcceptance && selectedRecord.addedChildBioFormAcceptance.length > 0) {
                            const getSampleConditionStatus = rsapi().post("formacceptance/getSampleConditionStatus", { 'userinfo': this.props.Login.userInfo });
                            const getReason = rsapi().post("formacceptance/getReason", { 'userinfo': this.props.Login.userInfo });
                            let urlArray = [getSampleConditionStatus, getReason];
                            Axios.all(urlArray)
                                .then(response => {
                                    let lstSampleCondition = response[0].data?.lstSampleCondition;
                                    let lstReason = response[1].data?.lstReason;

                                    const updateInfo = {
                                        typeName: DEFAULT_RETURN,
                                        data: {
                                            lstSampleCondition, lstReason, openAcceptRejectFormAcceptance: true, openModalShow: true,
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
                            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLESTOVALIDATE" }));
                            this.setState({ loading: false });
                        }
                    } else {
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTRECEIVEDRECORD" }));
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
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLESTOVALIDATE" }));
            this.setState({ loading: false });
        }
    }

    onMoveToDisposeEsignCheck = (moveToDisposeID, operation, screenName) => {

        let selectedRecord = this.state.selectedRecord;
        let selectedBioFormAcceptance = this.props?.selectedBioFormAcceptance;

        if (selectedBioFormAcceptance?.ntransactionstatus === transactionStatus.VALIDATION) {
            if (selectedRecord?.addedChildBioFormAcceptance && selectedRecord?.addedChildBioFormAcceptance.length > 0) {
                let dataState = this.state.dataState;
                // let addedChildBioFormAcceptance = selectedRecord?.addedChildBioFormAcceptance.slice(dataState.skip, dataState.skip + dataState.take);
                let addedChildBioFormAcceptance = selectedRecord?.addedChildBioFormAcceptance;
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["nbioformacceptancedetailscode"] = addedChildBioFormAcceptance.map(x => x.nbioformacceptancedetailscode).join(',');
                inputData["nbioformacceptancecode"] = addedChildBioFormAcceptance[0].nbioformacceptancecode;

                let inputParam = {
                    inputData: inputData,
                    screenName: screenName,
                    operation: "movetodispose"
                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, moveToDisposeID)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsignStateHandle: true, openChildModal: true, screenData: { inputParam }, operation, screenName
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.moveToDisposeSamples(inputData);
                }

            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLESTODISPOSE" }));
                this.setState({ loading: false });
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTVALIDATEDRECORD" }));
        }
    }

    onMoveToReturnEsignCheck = (moveToReturnID, operation, screenName) => {

        let selectedRecord = this.state.selectedRecord;
        let selectedBioFormAcceptance = this.props?.selectedBioFormAcceptance;

        if (selectedBioFormAcceptance?.ntransactionstatus === transactionStatus.VALIDATION) {
            if (selectedRecord?.addedChildBioFormAcceptance && selectedRecord?.addedChildBioFormAcceptance.length > 0) {
                let dataState = this.state.dataState;
                // let addedChildBioFormAcceptance = selectedRecord?.addedChildBioFormAcceptance.slice(dataState.skip, dataState.skip + dataState.take);
                let addedChildBioFormAcceptance = selectedRecord?.addedChildBioFormAcceptance;
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["nbioformacceptancedetailscode"] = addedChildBioFormAcceptance.map(x => x.nbioformacceptancedetailscode).join(',');
                inputData["nbioformacceptancecode"] = addedChildBioFormAcceptance[0].nbioformacceptancecode;

                let inputParam = {
                    inputData: inputData,
                    screenName: screenName,
                    operation: "movetoreturn"
                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, moveToReturnID)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsignStateHandle: true, openChildModal: true, screenData: { inputParam }, operation, screenName
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.moveToReturnSamples(inputData);
                }

            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLETORETURN" }));   // modified by sujatha ATE_274 for an wrong ids issue bgsi-248
                this.setState({ loading: false });
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTVALIDATEDRECORD" }));
        }
    }

    onUndoReturnDisposeEsignCheck = (undoID, operation, screenName) => {

        let selectedRecord = this.state.selectedRecord;
        let selectedBioFormAcceptance = this.props?.selectedBioFormAcceptance;

        if (selectedBioFormAcceptance?.ntransactionstatus === transactionStatus.VALIDATION) {
            if (selectedRecord?.addedChildBioFormAcceptance && selectedRecord?.addedChildBioFormAcceptance.length > 0) {
                let dataState = this.state.dataState;
                // let addedChildBioFormAcceptance = selectedRecord?.addedChildBioFormAcceptance.slice(dataState.skip, dataState.skip + dataState.take);
                let addedChildBioFormAcceptance = selectedRecord?.addedChildBioFormAcceptance;
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["nbioformacceptancedetailscode"] = addedChildBioFormAcceptance.map(x => x.nbioformacceptancedetailscode).join(',');
                inputData["nbioformacceptancecode"] = addedChildBioFormAcceptance[0].nbioformacceptancecode;

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
                    this.undoReturnDisposeSamples(inputData);
                }

            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLESTOUNDODISPOSERETURN" }));
                this.setState({ loading: false });
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTVALIDATEDRECORD" }));
        }
    }

    onStoreEsignCheck = () => {

        // this.setState({ loading: true });
        //Need to check the buid merge

        let selectedBioFormAcceptance = this.props.selectedBioFormAcceptance;
        let selectedRecord = this.state.selectedRecord;
        let selectedFreezerRecord = this.state.selectedFreezerRecord;
        let masterData = this.props.Login.masterData;

        if (selectedBioFormAcceptance && selectedBioFormAcceptance.ntransactionstatus === transactionStatus.VALIDATION) {
            if (selectedRecord?.addedChildBioFormAcceptance && selectedRecord?.addedChildBioFormAcceptance.length > 0) {
                let dataState = this.state.dataState;
                // let addedChildBioFormAcceptance = selectedRecord?.addedChildBioFormAcceptance.slice(dataState.skip, dataState.skip + dataState.take);
                let addedChildBioFormAcceptance = selectedRecord?.addedChildBioFormAcceptance;
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["nbioformacceptancedetailscode"] = addedChildBioFormAcceptance.map(x => x.nbioformacceptancedetailscode).join(',');
                inputData["nbioformacceptancecode"] = addedChildBioFormAcceptance[0].nbioformacceptancecode;
                inputData["sbiosamplereceivingcodes"] = addedChildBioFormAcceptance.map(x => x.nbiosamplereceivingcode).join(',') || "";
                inputData["nstorageinstrumentcode"] = selectedFreezerRecord?.nstorageinstrumentcode?.item?.nstorageinstrumentcode || -1;
                inputData["nsamplestoragelocationcode"] = selectedFreezerRecord?.nstorageinstrumentcode?.item?.nsamplestoragelocationcode || -1;
                inputData["nsamplestorageversioncode"] = selectedFreezerRecord?.nstorageinstrumentcode?.item?.nsamplestorageversioncode || -1;
                inputData["selectedBioParentSampleCollection"] = masterData?.selectedBioParentSampleCollection;

                const selectedCount = addedChildBioFormAcceptance.length || 0;
                inputData["selectedCount"] = selectedCount;

                const selectedNode = this.findFirstSelectedNode(this.state.treeDataView) || null;
                if (selectedNode !== null) {
                    inputData["selectedNodeID"] = selectedNode.id;
                    inputData["selectedNodeItemHierarchy"] = selectedNode.itemhierarchy;
                    inputData["selectedNodeChildItems"] = selectedNode.items;
                    let inputParam = {
                        inputData: inputData,
                        screenName: "IDS_STORE",
                        operation: "store"
                    }
                    if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
                        const updateInfo = {
                            typeName: DEFAULT_RETURN,
                            data: {
                                loadEsignStateHandle: true, openChildModal: true, screenData: { inputParam }, operation: "store", screenName: "IDS_STORE", shouldRender: true
                            }
                        }
                        this.props.updateStore(updateInfo);
                    } else {
                        this.storeSamples(inputData);
                    }
                } else {
                    toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTANODETOSTORE" }));
                    this.setState({ loading: false });
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLESTOSTORE" }));
                this.setState({ loading: false });
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTACCEPTEDVALIDATEDRECORDSTOSTORE" }));
            this.setState({ loading: false });
        }
    }

    findFirstSelectedNode = (tree) => {
        let found = null;
        function traverse(nodes) {
            for (const node of nodes) {
                if (node.selected) {
                    found = {
                        id: node.id,
                        itemhierarchy: node.itemhierarchy,
                        items: node.items || []
                    };
                    return true; // stop traversal
                }
                if (node.items && traverse(node.items)) {
                    return true; // bubble up the stop
                }
            }
            return false;
        }
        traverse(tree);
        return found;
    }

    moveToDisposeSamples = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("formacceptance/moveToDisposeSamples", {
            ...inputData
        })
            .then(response => {
                let lstChildBioFormAcceptance = response.data?.lstChildBioFormAcceptance;
                let selectedRecord = this.state.selectedRecord;
                // selectedRecord['addSelectAll'] = false;
                selectedRecord['addedSampleReceivingDetails'] = [];
                // selectedRecord['addedChildBioFormAcceptance'] = [];
                sortData(lstChildBioFormAcceptance);

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        lstChildBioFormAcceptance, selectedRecord, loadEsignStateHandle: false, openModalShow: false, openChildModal: false
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

    moveToReturnSamples = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("formacceptance/moveToReturnSamples", {
            ...inputData
        })
            .then(response => {
                let lstChildBioFormAcceptance = response.data?.lstChildBioFormAcceptance;
                let selectedRecord = this.state.selectedRecord;
                // selectedRecord['addSelectAll'] = false;
                selectedRecord['addedSampleReceivingDetails'] = [];
                // selectedRecord['addedChildBioFormAcceptance'] = [];
                sortData(lstChildBioFormAcceptance);

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        lstChildBioFormAcceptance, selectedRecord, loadEsignStateHandle: false, openModalShow: false, openChildModal: false
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

    undoReturnDisposeSamples = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("formacceptance/undoReturnDisposeSamples", {
            ...inputData
        })
            .then(response => {
                let lstChildBioFormAcceptance = response.data?.lstChildBioFormAcceptance;
                let selectedRecord = this.state.selectedRecord;
                // selectedRecord['addSelectAll'] = false;
                selectedRecord['addedSampleReceivingDetails'] = [];
                // selectedRecord['addedChildBioFormAcceptance'] = [];
                sortData(lstChildBioFormAcceptance);

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        lstChildBioFormAcceptance, selectedRecord, loadEsignStateHandle: false, openModalShow: false, openChildModal: false
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

    storeSamples = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("formacceptance/storeSamples", {
            ...inputData
        })
            .then(response => {

                let responseData = response.data;
                if (responseData.containsNonAccessibleSamples) {
                    this.confirmMessage.confirm("alertMsg", this.props.intl.formatMessage({ id: "IDS_STORESAMPLES" }), responseData.salertMsg,
                        null, this.props.intl.formatMessage({ id: "IDS_OK" }),
                        () => "");
                    this.setState({ loading: false });
                } else {
                    let lstChildBioFormAcceptance = response.data?.lstChildBioFormAcceptance;
                    let selectedRecord = this.state.selectedRecord;
                    // selectedRecord['addSelectAll'] = false;
                    selectedRecord['addedSampleReceivingDetails'] = [];
                    // selectedRecord['addedChildBioFormAcceptance'] = [];
                    sortData(lstChildBioFormAcceptance);

                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            lstChildBioFormAcceptance, selectedRecord, loadEsignStateHandle: false, openModalShow: false,
                            openChildModal: false, storageModal: false, shouldRender: true
                        }
                    }
                    this.props.updateStore(updateInfo);
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
    }

    subModalChildDataChange = (selectedRecord) => {
        let isInitialRender = false;
        if (this.props.Login.loadEsignStateHandle && this.props.Login.openAcceptRejectFormAcceptance) {
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
        const mandatoryFields = (this.state.openAcceptRejectFormAcceptance ? this.state.loadEsignStateHandle : this.props.Login.loadEsignStateHandle) ?
            [
                { "idsName": "IDS_PASSWORD", "dataField": "esignpassword", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_REASON", "dataField": "esignreason", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "idsName": "IDS_COMMENTS", "dataField": "esigncomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            ]
            :
            this.state.openAcceptRejectFormAcceptance ?
                [
                    { "idsName": "IDS_SAMPLECONDITION", "dataField": "nsamplecondition", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_REASON", "dataField": "nreasoncode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
                ] :
                this.props.Login.storageModal ? [
                    { "idsName": "IDS_STORAGENAME", "dataField": "nstorageinstrumentcode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", },
                ] :
                    [];

        onSaveMandatoryValidation(this.props.Login.storageModal ? (this.props.Login.loadEsignStateHandle ? this.state.selectedChildRecord : this.state.selectedFreezerRecord)
            : this.state.selectedChildRecord,
            mandatoryFields, (this.state.openAcceptRejectFormAcceptance ? this.state.loadEsignStateHandle :
                this.props.Login.loadEsignStateHandle) ? this.validateChildEsign : this.state.openAcceptRejectFormAcceptance ?
            this.onModalSaveEsignCheck : this.props.Login.storageModal ? this.onStoreEsignCheck : "",
            (this.state.openAcceptRejectFormAcceptance ? this.state.loadEsignStateHandle : this.props.Login.loadEsignStateHandle),
            saveType);
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
        this.validateChildEsignforFormAcceptance(inputParam, modalName);
    }

    validateChildEsignforFormAcceptance = (inputParam) => {
        rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {
                    if (inputParam["screenData"]["inputParam"]["operation"] === "movetodispose"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_MOVETODISPOSE") {
                        this.moveToDisposeSamples(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "movetoreturn"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_MOVETORETURN") {
                        this.moveToReturnSamples(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "undo"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_UNDODISPOSERETURN") {
                        this.undoReturnDisposeSamples(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "store"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_STORE") {
                        this.storeSamples(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "accept"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_SAMPLECONDITION") {
                        this.onModalSave(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "movetoreturncomplete"  // Added by janakumar for jira.id:BGSI-213
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_MOVETORETURNCOMPLETE") {
                        this.moveReturnDisposeAfterCompleteForm(inputParam["screenData"]["inputParam"]["inputData"]);
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

    closeChildModal = () => {
        let openChildModal = this.props.Login.openChildModal;
        let selectedChildRecord = this.props.Login.selectedChildRecord;
        let viewFormAcceptanceDetails = this.props.Login.viewFormAcceptanceDetails;
        let loadEsignStateHandle = this.props.Login.loadEsignStateHandle;
        let storageModal = this.props.Login.storageModal;
        let screenName = this.props.Login.screenName;
        let operation = this.props.Login.operation;
        let shouldRender = this.state.shouldRender;

        if (this.props.Login.loadEsignStateHandle) {
            openChildModal = (screenName === "IDS_STORE" && operation === "store") ? true : false;
            // selectedChildRecord = {};
            viewFormAcceptanceDetails = false;
            loadEsignStateHandle = false;
            if (selectedChildRecord) {
                delete selectedChildRecord["esigncomments"];
                delete selectedChildRecord["esignpassword"];
                delete selectedChildRecord["esignreason"];
            }
        } else {
            openChildModal = false;
            selectedChildRecord = {};
            viewFormAcceptanceDetails = false;
            loadEsignStateHandle = false;
            storageModal = false
            shouldRender = true;
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                ...this.state.data,
                operation: undefined,
                openChildModal,
                selectedChildRecord,
                selectedId: null,
                viewFormAcceptanceDetails,
                loadEsignStateHandle,
                storageModal,
                shouldRender
            }
        }
        this.props.updateStore(updateInfo);

    }

    closeModalShow = () => {
        let openAcceptRejectFormAcceptance = this.state.openAcceptRejectFormAcceptance;
        let openModalShow = this.state.openModalShow;
        let loadEsignStateHandle = this.state.loadEsignStateHandle;
        let selectedChildRecord = this.state.selectedChildRecord;
        let screenName = this.props.Login.screenName;
        let operation = this.props.Login.operation;

        if (this.props.Login.loadEsignStateHandle) {
            loadEsignStateHandle = false;
            openModalShow = (screenName === "IDS_SAMPLECONDITION" && operation === "accept") ? true : false;
            openAcceptRejectFormAcceptance = (screenName === "IDS_SAMPLECONDITION" && operation === "accept") ? true : false;
            if (selectedChildRecord) {
                delete selectedChildRecord["esigncomments"];
                delete selectedChildRecord["esignpassword"];
                delete selectedChildRecord["esignreason"];
            }
        } else {
            openAcceptRejectFormAcceptance = false;
            openModalShow = false;
            selectedChildRecord = {};
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openAcceptRejectFormAcceptance, openModalShow, selectedChildRecord, loadEsignStateHandle
            }
        }
        this.props.updateStore(updateInfo);
    }

    onModalSaveEsignCheck = () => {
        let selectedChildRecord = this.state.selectedChildRecord;
        let selectedRecord = this.state.selectedRecord;
        let dataState = this.state.dataState;
        // let addedChildBioFormAcceptance = selectedRecord?.addedChildBioFormAcceptance.slice(dataState.skip, dataState.skip + dataState.take);
        let addedChildBioFormAcceptance = selectedRecord?.addedChildBioFormAcceptance;
        let inputData = {
            'nbioformacceptancecode': addedChildBioFormAcceptance[0].nbioformacceptancecode,
            'nbioformacceptancedetailscode': addedChildBioFormAcceptance.map(x => x.nbioformacceptancedetailscode).join(',') || '-1',
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
        this.setState({ loading: true });
        rsapi().post("formacceptance/updateSampleCondition", { ...inputData })
            .then(response => {
                let lstChildBioFormAcceptance = response.data?.lstChildBioFormAcceptance;
                // selectedRecord['addedChildBioFormAcceptance'] = [];
                // selectedRecord['addSelectAll'] = false;

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        lstChildBioFormAcceptance, openAcceptRejectFormAcceptance: false, openModalShow: false, selectedChildRecord: {},
                        selectedRecord, loadEsignStateHandle: false
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

    viewFormAcceptanceDetails = (paramData) => {
        let selectedViewRecord = paramData.treeView;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openChildModal: true,
                viewFormAcceptanceDetails: true,
                selectedViewRecord, operation: 'view', screenName: 'IDS_SAMPLESDETAILS'
            }
        }
        this.props.updateStore(updateInfo);
    }

    onStore = (storeID, operation, screenName) => {
        this.setState({ loading: true });

        let selectedRecord = this.state.selectedRecord;
        if (selectedRecord && selectedRecord.addedChildBioFormAcceptance && selectedRecord.addedChildBioFormAcceptance.length > 0) {
            const hasAcceptedValidatedRecords = selectedRecord.addedChildBioFormAcceptance.some(item =>
                item.nsamplecondition === transactionStatus.ACCEPT && item.nsamplestatus === transactionStatus.VALIDATION
            );
            if (hasAcceptedValidatedRecords) {
                const nbioFormAcceptanceDetailsCode = selectedRecord.addedChildBioFormAcceptance.map(x => x.nbioformacceptancedetailscode).join(',');
                return rsapi().post("formacceptance/getStorageFreezerData", {
                    'userinfo': this.props.Login.userInfo,
                    'nstorageinstrumentcode': selectedRecord.addedChildBioFormAcceptance[0].nstorageinstrumentcode || -1,
                    'nbioFormAcceptanceDetailsCode': nbioFormAcceptanceDetailsCode
                })
                    .then(response => {
                        let responseData = response.data;
                        if (responseData.containsNonAccessibleSamples) {
                            this.confirmMessage.confirm("alertMsg", this.props.intl.formatMessage({ id: "IDS_STORESAMPLES" }), responseData.salertMsg,
                                null, this.props.intl.formatMessage({ id: "IDS_OK" }),
                                () => "");
                        } else {
                            let masterDataValues = {};
                            const freezerListData = constructOptionList(response.data['freezerList'] || [], "nstorageinstrumentcode",
                                "sinstrumentid", "nstorageinstrumentcode", undefined, false);
                            const freezerDatas = freezerListData.get("OptionList");
                            const selectedFreezerRecord = {
                                "nstorageinstrumentcode": {
                                    label: response.data.selectedFreezerData.sinstrumentid,
                                    value: response.data.selectedFreezerData.nstorageinstrumentcode,
                                    item: response.data.selectedFreezerData
                                },
                                "selectedSuggestedStorage": response.data.selectedSuggestedStorage
                            }
                            masterDataValues = {
                                ...this.props.Login.masterData,
                                ...response.data,
                                'freezerList': freezerDatas
                            }

                            const updateInfo = {
                                typeName: DEFAULT_RETURN,
                                data: {
                                    masterData: masterDataValues, selectedFreezerRecord, initialSelectedFreezerRecord: { ...selectedFreezerRecord },
                                    storageModal: true, openChildModal: true, loadEsign: false, operation, screenName, ncontrolcode: storeID, loading: false
                                }
                            }
                            this.props.updateStore(updateInfo);
                        }
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
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTACCEPTEDVALIDATEDRECORDS" }));
                this.setState({ loading: false });
            }

        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLESTOSTORE" }));
            this.setState({ loading: false });
        }
    }

    // Added by janakumar for jira.id:BGSI-213      --- Start
    onMoveReturnDisposeAfterCompleteEsignCheck = (undoID, operation, screenName) => {

        let selectedRecord = this.state.selectedRecord;
        let selectedBioFormAcceptance = this.props?.selectedBioFormAcceptance;

        if (selectedBioFormAcceptance?.ntransactionstatus === transactionStatus.COMPLETED) {
            if (selectedRecord?.addedChildBioFormAcceptance && selectedRecord?.addedChildBioFormAcceptance.length > 0) {
                let dataState = this.state.dataState;
                // let addedChildBioFormAcceptance = selectedRecord?.addedChildBioFormAcceptance.slice(dataState.skip, dataState.skip + dataState.take);
                let addedChildBioFormAcceptance = selectedRecord?.addedChildBioFormAcceptance;
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["nbioformacceptancedetailscode"] = addedChildBioFormAcceptance.map(x => x.nbioformacceptancedetailscode).join(',');
                inputData["nbioformacceptancecode"] = addedChildBioFormAcceptance[0].nbioformacceptancecode;

                let inputParam = {
                    inputData: inputData,
                    screenName: screenName,
                    operation: operation
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
                    this.moveReturnDisposeAfterCompleteForm(inputData);
                }

            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLETORETURN" }));
                this.setState({ loading: false });
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTCOMPLETERECORD" }));
        }
    }


    moveReturnDisposeAfterCompleteForm = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("formacceptance/moveToReturnDisposeAfterCompleteForm", {
            ...inputData
        })
            .then(response => {
                let lstChildBioFormAcceptance = response.data?.lstChildBioFormAcceptance;
                let selectedRecord = this.state.selectedRecord;
                // selectedRecord['addSelectAll'] = false;
                selectedRecord['addedSampleReceivingDetails'] = [];
                // selectedRecord['addedChildBioFormAcceptance'] = [];
                sortData(lstChildBioFormAcceptance);

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        lstChildBioFormAcceptance, selectedRecord, loadEsignStateHandle: false, openModalShow: false, openChildModal: false
                    }
                }
                this.props.updateStore(updateInfo);
                this.setState({ loading: false });
            })
            .catch(error => {
                if (error.response.status === 401 || error.response.status === 403) {
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

    // Added by janakumar for jira.id:BGSI-213       ---- End

}


export default connect(mapStateToProps, { updateStore })(injectIntl(OuterGridFormAcceptance));