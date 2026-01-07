import { faCheck, faPlus, faDolly, faTrashAlt, faWarehouse, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { process } from '@progress/kendo-data-query';
import React from 'react';
import { Card, Col, FormGroup, FormLabel, Nav, Row } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { updateStore } from '../../../actions';
import { ReadOnlyText } from "../../../components/App.styles";
import { onSaveMandatoryValidation, rearrangeDateFormat, showEsign, sortData, constructOptionList } from '../../../components/CommonScript';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';
import DataGridWithSelection from '../../../components/data-grid/DataGridWithSelection';
import { transactionStatus } from '../../../components/Enumeration';
import ModalShow from '../../../components/ModalShow';
import Preloader from '../../../components/preloader/preloader.component';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import rsapi from '../../../rsapi';
import EsignStateHandle from '../../audittrail/EsignStateHandle';
import { ContentPanel, ProductList } from '../../product/product.styled';
import AcceptRejectDirectTransfer from '../directtransfer/AcceptRejectDirectTransfer';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './../../../actions/LoginTypes';
import AddThirdPartyReturn from "./AddThirdPartyReturn";

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class OuterGridThirdPartyReturn extends React.Component {
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
            data: props.lstChildBioThirdPartyReturn,
            controlMap: props.controlMap,
            userRoleControlRights: props.userRoleControlRights,
            lstChildBioThirdPartyReturn: props.lstChildBioThirdPartyReturn,
            lstBioThirdPartyReturn: props.lstBioThirdPartyReturn,
            selectedBioThirdPartyReturn: props.selectedBioThirdPartyReturn,
            selectedChildRecord: {},
            selectedViewRecord: {},
            data: props.lstChildBioThirdPartyReturn,
            selectedFreezerRecord: {},
            initialSelectedFreezerRecord: {},
            shouldRender: true
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const updates = {};

        // ✅ helper for deep compare
        const isChanged = (curr, prev) => JSON.stringify(curr) !== JSON.stringify(prev);

        // --- Handle dataResult change ---
        if (isChanged(prevState?.dataResult, this.state?.dataResult)) {
            const addedChildBioThirdPartyReturn = (this.state?.dataResult || [])
                .filter(dr =>
                    (this.state?.lstChildBioThirdPartyReturn || []).some(lc => lc?.nserialno === dr?.nserialno) &&
                    dr?.selected === true
                )
                .map(item => ({ ...item }));

            updates.selectedRecord = {
                ...this.state?.selectedRecord,
                addedChildBioThirdPartyReturn
            };
        }

        // --- Props-based updates ---1
        const propsToStateMap = {
            selectedRecord: 'selectedRecord',
            selectedChildRecord: 'selectedChildRecord',
            selectedViewRecord: 'selectedViewRecord',
            loadEsignStateHandle: 'loadEsignStateHandle',
            openModalShow: 'openModalShow',
            openAcceptRejectThirdPartyReturn: 'openAcceptRejectThirdPartyReturn',
            lstSampleCondition: 'lstSampleCondition',
            lstReason: 'lstReason',
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
            updates.dataResult = (this.props?.Login?.masterData?.lstChildBioThirdPartyReturn || []).slice(updates.dataState.skip, updates.dataState.skip + updates.dataState.take);
            updates.lstChildBioThirdPartyReturn = this.props?.Login?.masterData?.lstChildBioThirdPartyReturn;
        }

        if (isChanged(this.props?.Login?.masterData?.selectedSampleStorageVersion, prevProps?.Login?.masterData?.selectedSampleStorageVersion)) {
            if (this.props.Login.masterData.selectedSampleStorageVersion && this.props.Login.masterData.selectedSampleStorageVersion !== undefined) {
                updates.treeDataView = {};
                updates.treeDataView = this.props.Login.masterData.selectedSampleStorageVersion["jsondata"].data;
            }
        }

        // --- Handle masterData.lstChildBioThirdPartyReturn ---
        if (isChanged(this.props?.Login?.masterData?.lstChildBioThirdPartyReturn, prevProps?.Login?.masterData?.lstChildBioThirdPartyReturn)) {
            const processed = this.props?.Login?.masterData?.lstChildBioThirdPartyReturn && process(this.props?.Login?.masterData?.lstChildBioThirdPartyReturn, this.props?.dataState);
            updates.lstChildBioThirdPartyReturn = this.props?.Login?.masterData?.lstChildBioThirdPartyReturn;
            updates.dataResult = processed ? processed.data : [];
            updates.total = processed ? processed.total : 0;
            updates.dataState = this.props?.dataState || {};
        }

        // --- Handle lstChildBioThirdPartyReturn ---
        if (isChanged(this.props?.Login?.lstChildBioThirdPartyReturn, prevProps?.Login?.lstChildBioThirdPartyReturn)) {
            let dataState = this.state?.dataState || {};
            const prevSelected = this.state?.selectedRecord || {};
            const newList = this.props?.Login?.lstChildBioThirdPartyReturn || [];

            if(newList.length <= dataState.skip){
                dataState = {
                    skip: 0,
                    take: this.props.settings ? parseInt(this.props.settings[14]) : 10,
                };
            }

            const addedMap = new Map((prevSelected?.addedChildBioThirdPartyReturn || []).map(item => [item?.nserialno, item]));

            const updatedLstChildBioThirdPartyReturn = newList.map(item => {
                if (addedMap.has(item?.nserialno)) {
                    const updated = { ...item, selected: true };
                    addedMap.set(item?.nserialno, updated);
                    return updated;
                }
                return { ...item };
            });

            const addedChildBioThirdPartyReturn = Array.from(addedMap.values());
            const processed = process(updatedLstChildBioThirdPartyReturn, dataState);
            updates.lstChildBioThirdPartyReturn = updatedLstChildBioThirdPartyReturn;
            updates.dataResult = processed ? processed.data : [];
            updates.total = processed ? processed.total : 0;
            updates.dataState = dataState;
            updates.selectedRecord = { ...prevSelected, addedChildBioThirdPartyReturn };
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
        if (this.props.Login.openChildModal && (this.props.Login.openChildThirdPartyReturn || this.state.openModalShow) && nextState.isInitialRender === false &&
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
                { "idsName": "IDS_RECEIVEDFORMNUMBER", "dataField": "sformnumber", "width": "200px" },
                { "idsName": "IDS_REPOSITORYID", "dataField": "srepositoryid", "width": "130px" },
                { "idsName": "IDS_PARENTSAMPLECODE", "dataField": "sparentsamplecode", "width": "180px" },
                { "idsName": "IDS_BIOSAMPLETYPE", "dataField": "sproductname", "width": "150px" },
                { "idsName": "IDS_RECEIVEDVOLUMEµL", "dataField": "svolume", "width": "180px" },
                { "idsName": "IDS_RETURNVOLUMEµL", "dataField": "sreturnvolume", "width": "180px" },
                { "idsName": "IDS_EXTRACTEDSAMPLEID", "dataField": "sextractedsampleid", "width": "180px" },
                { "idsName": "IDS_SAMPLECONDITION", "dataField": "ssamplecondition", "width": "150px" },
                { "idsName": "IDS_SAMPLESTATUS", "dataField": "ssamplestatus", "width": "130px" },
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
                                        onClick={() => this.addChildThirdPartyReturn(addChildID, 'create', 'IDS_SAMPLE')}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Nav.Link>
                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_SAMPLEVALIDATION" })} data-place="left"
                                        hidden={this.props.userRoleControlRights.indexOf(acceptRejectID) === -1}
                                        onClick={() => this.acceptRejectThirdPartyReturn(acceptRejectID, 'accept', 'IDS_SAMPLECONDITION')}>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </Nav.Link>
                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_SAMPLEDELETE" })} data-place="left"
                                        hidden={this.props.userRoleControlRights.indexOf(deleteID) === -1}
                                        onClick={() => this.handleDelete(deleteID, 'delete', 'IDS_RETURNFORM')}>
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </Nav.Link>
                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_MOVETODISPOSE" })} data-place="left"
                                        hidden={this.props.userRoleControlRights.indexOf(disposeID) === -1}
                                        onClick={() => this.onDisposeEsignCheck(disposeID, 'dispose', 'IDS_RETURNFORM')}>
                                        <FontAwesomeIcon icon={faDolly} />
                                    </Nav.Link>
                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_UNDODISPOSE" })} data-place="left"
                                        hidden={this.props.userRoleControlRights.indexOf(undoID) === -1}
                                        onClick={() => this.onUndoDisposeEsignCheck(undoID, 'undo', 'IDS_UNDODISPOSE')}>
                                        <FontAwesomeIcon icon={faUndo} />
                                    </Nav.Link>
                                    {/* <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_STORE" })} data-place="left"
                                        hidden={this.props.userRoleControlRights.indexOf(storeID) === -1}
                                        onClick={() => this.onStore(storeID, 'store', 'IDS_STORE')}>
                                        <FontAwesomeIcon icon={faWarehouse} />
                                    </Nav.Link> */}
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
                            selectAll={this.state.selectedRecord?.addSelectAll}
                            userInfo={this.props.Login.userInfo}
                            title={this.props.intl.formatMessage({ id: "IDS_SELECTTODELETE" })}
                            headerSelectionChange={this.headerSelectionChange}
                            selectionChange={this.selectionChange}
                            dataStateChange={this.dataStateChange}
                            extractedColumnList={this.extractedFields}
                            dataState={this.state.dataState}
                            dataResult={this.state?.dataResult || []}
                            scrollable={'scrollable'}
                            pageable={true}
                            isActionRequired={true}
                            removeNotRequired={true}
                            methodUrl={"ChildThirdPartyReturnForm"}
                            controlMap={this.props.controlMap}
                            userRoleControlRights={this.props.userRoleControlRights}
                            fetchRecord={this.viewThirdPartyReturnDetails}
                            gridHeight={this.props.gridHeight}
                        />
                    </Col>
                </Row>

                {(this.props.Login.openChildModal) ?
                    <SlideOutModal
                        show={this.props.Login.openChildModal}
                        closeModal={this.closeChildModal}
                        operation={(this.props.Login.loadEsignStateHandle || this.props.Login.viewThirdPartyReturnDetails) ? undefined : this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.loadEsignStateHandle ? this.props.intl.formatMessage({ id: "IDS_ESIGN" })
                            : this.props.Login.screenName}
                        esign={false}
                        onSaveClick={this.onMandatoryCheck}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        showSaveContinue={this.props.Login.loadEsignStateHandle ? false : true}
                        showSave={!this.props.Login.viewThirdPartyReturnDetails}
                        mandatoryFields={[]}
                        needClose={this.props.Login.operation === "view" ? true : false}
                        hideSave={this.props.Login.operation === "view" ? true : false}
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
                            : this.props.Login.openChildThirdPartyReturn ?
                                <AddThirdPartyReturn
                                    controlMap={this.props.controlMap}
                                    userRoleControlRights={this.props.userRoleControlRights}
                                    operation={this.props.Login.operation}
                                    childDataChange={this.subChildDataChange}
                                    selectedRecord={this.state.selectedChildRecord || {}}
                                    isChildSlideOut={true}
                                    lstFormNumberDetails={this.props.Login.masterData?.lstFormNumberDetails || []}
                                />
                                : this.props.Login.viewThirdPartyReturnDetails ?
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
                                                    {/* <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel>
                                                                    <FormattedMessage
                                                                        id="IDS_LOCATIONCODE"
                                                                        message="Location Code"
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
                                                                    id="IDS_BIOSAMPLETYPE"
                                                                    message="Bio Sample Type"
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
                                                                    id="IDS_RECEIVEDVOLUMEµL"
                                                                    message="Received Volume(µL)"
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
                                                                    id="IDS_RETURNVOLUMEµL"
                                                                    message="Return Volume(µL)"
                                                                />
                                                            </FormLabel>
                                                            <ReadOnlyText>
                                                                {
                                                                    this.state.selectedViewRecord ?
                                                                        this.state.selectedViewRecord.sreturnvolume
                                                                            ? this.state.selectedViewRecord.sreturnvolume
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
                                                                    message="Sample Status"
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
                                                <Row>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel>
                                                                <FormattedMessage
                                                                    id="IDS_CONCENTRATION"
                                                                    message="Concentration"
                                                                />
                                                            </FormLabel>
                                                            <ReadOnlyText>
                                                                {
                                                                    this.state.selectedViewRecord ?
                                                                        this.state.selectedViewRecord.sconcentration
                                                                            ? this.state.selectedViewRecord.sconcentration
                                                                            : "-" : "-"
                                                                }
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel>
                                                                <FormattedMessage
                                                                    id="IDS_QCPLATFORM"
                                                                    message="QC Platform"
                                                                />
                                                            </FormLabel>
                                                            <ReadOnlyText>
                                                                {
                                                                    this.state.selectedViewRecord ?
                                                                        this.state.selectedViewRecord.sqcplatform
                                                                            ? this.state.selectedViewRecord.sqcplatform
                                                                            : "-" : "-"
                                                                }
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel>
                                                                <FormattedMessage
                                                                    id="IDS_ELUENT"
                                                                    message="Eluent"
                                                                />
                                                            </FormLabel>
                                                            <ReadOnlyText>
                                                                {
                                                                    this.state.selectedViewRecord ?
                                                                        this.state.selectedViewRecord.seluent
                                                                            ? this.state.selectedViewRecord.seluent
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
                                this.state.openAcceptRejectThirdPartyReturn ?
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
        const { lstChildBioThirdPartyReturn, selectedRecord } = this.state;

        // Always filter from full list
        let dataSource = lstChildBioThirdPartyReturn || [];

        // Reapply selection from addedChildBioDirectTransfer
        const addedChildBioThirdPartyReturn = selectedRecord?.addedChildBioThirdPartyReturn || [];
        const selectedMap = new Map(addedChildBioThirdPartyReturn.map(item => [item.nserialno, item]));

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
            lstChildBioThirdPartyReturn: dataSource, // keep selection persisted
            dataResult: processed.data,
            total: processed.total,
            dataState: event.dataState,
            selectedRecord: {
                ...selectedRecord,
                addSelectAll: allSelected,
                addedChildBioThirdPartyReturn: Array.from(selectedMap.values())
            }
        });
    };

    headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        const eventData = event.target.props.data.hasOwnProperty('data') ? event.target.props.data.data || [] : event.target.props.data || [];
        let lstChildBioThirdPartyReturn = this.state?.dataResult || [];
        let addedChildBioThirdPartyReturn = this.state.selectedRecord?.addedChildBioThirdPartyReturn || [];
        let selectedRecord = this.state.selectedRecord;
        if (checked) {
            const data = lstChildBioThirdPartyReturn.map(item => {
                const matchingData = eventData.find(dataItem => dataItem.nserialno === item.nserialno);
                if (matchingData) {
                    const existingIndex = addedChildBioThirdPartyReturn.findIndex(
                        x => x.nserialno === item.nserialno
                    );

                    if (existingIndex === -1) {
                        const newItem = {
                            ...item,
                            selected: true,
                        };
                        addedChildBioThirdPartyReturn.push(newItem);
                    }
                    return { ...item, selected: true };
                } else {
                    return { ...item, selected: item.selected ? true : false };
                }
            });
            selectedRecord['addedChildBioThirdPartyReturn'] = addedChildBioThirdPartyReturn;
            selectedRecord['addSelectAll'] = checked;
            this.setState({
                selectedRecord,
                dataResult: data
            });
            this.props.childDataChange(selectedRecord);
        } else {
            let addedChildBioThirdPartyReturn = this.state.selectedRecord?.addedChildBioThirdPartyReturn || [];
            const data = lstChildBioThirdPartyReturn.map(x => {
                const matchedItem = eventData.find(item => x.nserialno === item.nserialno);
                if (matchedItem) {
                    addedChildBioThirdPartyReturn = addedChildBioThirdPartyReturn.filter(item1 => item1.nserialno !== matchedItem.nserialno);
                    matchedItem.selected = false;
                    return matchedItem;
                }
                return x;
            });
            selectedRecord['addedChildBioThirdPartyReturn'] = addedChildBioThirdPartyReturn;
            selectedRecord['addSelectAll'] = checked;
            this.setState({
                selectedRecord,
                dataResult: data
            });
            this.props.childDataChange(selectedRecord);
        }
    }

    selectionChange = (event) => {
        let addedChildBioThirdPartyReturn = this.state.selectedRecord?.addedChildBioThirdPartyReturn || [];
        let selectedRecord = this.state.selectedRecord;
        const lstChildBioThirdPartyReturn = this.state?.dataResult.map(item => {
            if (item.nserialno === event.dataItem.nserialno) {
                item.selected = !event.dataItem.selected;
                if (item.selected) {
                    const newItem = JSON.parse(JSON.stringify(item));
                    delete newItem['selected']
                    newItem.selected = true;
                    addedChildBioThirdPartyReturn.push(newItem);
                } else {
                    addedChildBioThirdPartyReturn = addedChildBioThirdPartyReturn.filter(item1 => item1.nserialno !== item.nserialno)
                }
            }
            return item;
        })
        selectedRecord['addedChildBioThirdPartyReturn'] = addedChildBioThirdPartyReturn;
        selectedRecord['addSelectAll'] = this.validateCheckAll(process(lstChildBioThirdPartyReturn || [], this.state.dataState).data);
        this.setState({
            selectedRecord,
            dataResult: lstChildBioThirdPartyReturn
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

    addChildThirdPartyReturn = (addChildID, operation, screenName) => {
        if (operation === "create") {
            let selectedBioThirdPartyReturn = this.props?.selectedBioThirdPartyReturn;
            if (selectedBioThirdPartyReturn) {
                this.setState({ loading: true });
                rsapi().post("biothirdpartyreturn/addThirdPartyReturnDetails", {
                    'nbiothirdpartyreturncode': selectedBioThirdPartyReturn.nbiothirdpartyreturncode,
                    'noriginsitecode': selectedBioThirdPartyReturn.noriginsitecode,
                    'soriginsitename': selectedBioThirdPartyReturn.soriginsitename,
                    'userinfo': this.props.Login.userInfo
                })
                    .then(response => {
                        let masterData = { ...this.props.Login.masterData };
                        let responseData = { ...response.data };
                        masterData["lstFormNumberDetails"] = responseData.lstFormNumberDetails || [];
                        let selectedChildRecord = this.state.selectedChildRecord;
                        let selectedBioThirdPartyReturnData = { ...this.props.Login.masterData?.selectedBioThirdPartyReturn }
                        let selectedBioThirdPartyReturn = {
                            label: selectedBioThirdPartyReturnData.soriginsitename,
                            value: selectedBioThirdPartyReturnData.noriginsitecode,
                        }
                        selectedChildRecord['noriginsitecode'] = selectedBioThirdPartyReturn;
                        selectedChildRecord['dreturndate'] = rearrangeDateFormat(this.props.Login.userInfo,
                            selectedBioThirdPartyReturnData?.sreturndate);
                        selectedChildRecord["sremarks"] = selectedBioThirdPartyReturnData.sremarks
                        const updateInfo = {
                            typeName: DEFAULT_RETURN,
                            data: {
                                masterData, screenName, operation, openChildModal: true, openChildThirdPartyReturn: true, selectedChildRecord
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

    acceptRejectThirdPartyReturn = (acceptRejectID, operation, screenName) => {
        let selectedBioThirdPartyReturn = this.props?.selectedBioThirdPartyReturn;
        let selectedRecord = this.state.selectedRecord;
        if (selectedBioThirdPartyReturn) {
            this.setState({ loading: true });
            rsapi().post("biothirdpartyreturn/acceptRejectThirdPartyReturnSlide", {
                'addedChildBioThirdPartyReturn': selectedRecord?.addedChildBioThirdPartyReturn || [],
                'nbiothirdpartyreturncode': selectedBioThirdPartyReturn.nbiothirdpartyreturncode,
                'userinfo': this.props.Login.userInfo
            })
                .then(response => {

                    let lstSampleCondition = response.data?.lstSampleCondition;
                    let lstReason = response.data?.lstReason;

                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            lstSampleCondition, lstReason, openAcceptRejectThirdPartyReturn: true, openModalShow: true,
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
    }

    onDisposeEsignCheck = (disposeID, operation, screenName) => {

        let selectedBioThirdPartyReturn = this.props.selectedBioThirdPartyReturn;
        let selectedRecord = this.state.selectedRecord;

        if (selectedBioThirdPartyReturn && selectedBioThirdPartyReturn.ntransactionstatus === transactionStatus.VALIDATION) {
            if (selectedRecord?.addedChildBioThirdPartyReturn && selectedRecord?.addedChildBioThirdPartyReturn.length > 0) {

                const childRecordStatusCheck = selectedRecord?.addedChildBioDirectTransfer?.some(item => item.ntransferstatus === transactionStatus.TOBEDISPOSE);

                if (childRecordStatusCheck) {
                    return toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTVALIDATEDSAMPLERECORDDISPOSE" }));
                }

                let dataState = this.state.dataState;
                // let addedChildBioThirdPartyReturn = selectedRecord?.addedChildBioThirdPartyReturn.slice(dataState.skip, dataState.skip + dataState.take);
                let addedChildBioThirdPartyReturn = selectedRecord?.addedChildBioThirdPartyReturn;
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["nbiothirdpartyreturndetailscode"] = addedChildBioThirdPartyReturn.map(x => x.nbiothirdpartyreturndetailscode).join(',');
                inputData["nbiothirdpartyreturncode"] = addedChildBioThirdPartyReturn[0].nbiothirdpartyreturncode;

                let inputParam = {
                    inputData: inputData,
                    screenName: "IDS_RETURNFORM",
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


    disposeSamples = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("biothirdpartyreturn/disposeSamples", {
            ...inputData
        })
            .then(response => {
                let lstChildBioThirdPartyReturn = response.data?.lstChildBioThirdPartyReturn;
                let selectedRecord = this.state.selectedRecord;
                selectedRecord['addedSampleReceivingDetails'] = [];
                sortData(lstChildBioThirdPartyReturn);

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        lstChildBioThirdPartyReturn, selectedRecord, loadEsignStateHandle: false, openModalShow: false, openChildModal: false
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
        let selectedBioThirdPartyReturn = this.props.selectedBioThirdPartyReturn;
        let selectedRecord = this.state.selectedRecord;
        if (selectedBioThirdPartyReturn && selectedBioThirdPartyReturn.ntransactionstatus === transactionStatus.DRAFT
            || selectedBioThirdPartyReturn.ntransactionstatus === transactionStatus.VALIDATION
        ) {
            if (selectedRecord?.addedChildBioThirdPartyReturn && selectedRecord?.addedChildBioThirdPartyReturn.length > 0) {
                let dataState = this.state.dataState;
                // let addedChildBioThirdPartyReturn = selectedRecord?.addedChildBioThirdPartyReturn.slice(dataState.skip, dataState.skip + dataState.take);
                let addedChildBioThirdPartyReturn = selectedRecord?.addedChildBioThirdPartyReturn;
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["nbiothirdpartyreturndetailscode"] = addedChildBioThirdPartyReturn.map(x => x.nbiothirdpartyreturndetailscode).join(',');
                inputData["nbiothirdpartyreturncode"] = addedChildBioThirdPartyReturn[0].nbiothirdpartyreturncode;

                let inputParam = {
                    inputData: inputData,
                    screenName: "IDS_RETURNFORM",
                    operation: "delete"
                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteID)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsignStateHandle: true, openChildModal: true, screenData: { inputParam }, screenName: "IDS_RETURNFORM"
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.deleteThirdPartyReturnDetails(inputData);
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

    deleteThirdPartyReturnDetails = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("biothirdpartyreturn/deleteChildThirdPartyReturn", {
            ...inputData
        })
            .then(response => {
                let lstChildBioThirdPartyReturn = response.data?.lstChildBioThirdPartyReturn;
                let selectedRecord = this.state.selectedRecord;
                sortData(lstChildBioThirdPartyReturn);
                selectedRecord['addedChildBioThirdPartyReturn'] = [];
                selectedRecord['addSelectAll'] = false;
                let masterData = { ...this.props.Login.masterData, ...response.data }
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData, lstChildBioThirdPartyReturn, selectedRecord, loadEsignStateHandle: false, openModalShow: false, openChildModal: false
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
        if (this.props.Login.loadEsignStateHandle && this.props.Login.openAcceptRejectThirdPartyReturn) {
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
        const mandatoryFields = (this.state.openAcceptRejectThirdPartyReturn ? this.state.loadEsignStateHandle : this.props.Login.loadEsignStateHandle) ?
            [
                { "idsName": "IDS_PASSWORD", "dataField": "esignpassword", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_REASON", "dataField": "esignreason", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "idsName": "IDS_COMMENTS", "dataField": "esigncomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            ]
            :
            this.props.Login.openChildThirdPartyReturn ? this.props.Login.operation === 'create' ?
                [
                    { "idsName": "IDS_FORMNUMBER", "dataField": "nbiothirdpartyformacceptancecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_ORIGINSITE", "dataField": "noriginsitecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "datepicker" },
                    { "idsName": "IDS_RETURNDATE", "dataField": "dreturndate", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "datepicker" }
                ]
                : []
                : this.state.openAcceptRejectThirdPartyReturn ?
                    [
                        { "idsName": "IDS_SAMPLECONDITION", "dataField": "nsamplecondition", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                        { "idsName": "IDS_REASON", "dataField": "nreasoncode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
                    ] : this.props.Login.storageModal ? [
                        { "idsName": "IDS_STORAGENAME", "dataField": "nstorageinstrumentcode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", },
                    ] : [];

        onSaveMandatoryValidation(
            // this.props.Login.storageModal ? (this.props.Login.loadEsignStateHandle ? this.state.selectedChildRecord : this.state.selectedFreezerRecord)
            // : 
            this.state.selectedChildRecord,
            mandatoryFields, (this.state.openAcceptRejectThirdPartyReturn ? this.state.loadEsignStateHandle :
                this.props.Login.loadEsignStateHandle) ? this.validateChildEsign : this.props.Login.openChildThirdPartyReturn ?
            this.onSaveClick : this.state.openAcceptRejectThirdPartyReturn ?
                this.onModalSaveEsignCheck :
                // this.props.Login.storageModal ? this.onStoreEsignCheck : 
                "",
            (this.state.openAcceptRejectThirdPartyReturn ? this.state.loadEsignStateHandle : this.props.Login.loadEsignStateHandle), saveType);
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
        this.validateChildEsignforThirdPartyReturn(inputParam, modalName);
    }

    validateChildEsignforThirdPartyReturn = (inputParam) => {
        rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {
                    if (inputParam["screenData"]["inputParam"]["operation"] === "accept"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_SAMPLECONDITION") {
                        this.onModalSave(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "delete"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_RETURNFORM") {
                        this.deleteThirdPartyReturnDetails(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "dispose"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_RETURNFORM") {
                        this.disposeSamples(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "undo"
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
        let userInfo = this.props.Login.userInfo;
        if (operation === "create") {
            let lstThirdPartyFormAcceptanceDetails = selectedChildRecord.lstThirdPartyFormAcceptanceDetails && selectedChildRecord.lstThirdPartyFormAcceptanceDetails || [];

            let validationQuantity = this.props.validateReturnQuantities(lstThirdPartyFormAcceptanceDetails, userInfo);

            if (validationQuantity.rtnValue === "Success") {
                if (lstThirdPartyFormAcceptanceDetails && lstThirdPartyFormAcceptanceDetails.length > 0) {
                    inputData["filterSelectedSamples"] = lstThirdPartyFormAcceptanceDetails || [];
                    inputData["nbiothirdpartyreturncode"] = this.props?.selectedBioThirdPartyReturn?.nbiothirdpartyreturncode;
                    inputData["nbiothirdpartyformacceptancecode"] = lstThirdPartyFormAcceptanceDetails[0].nbiothirdpartyformacceptancecode;
                    inputData["saveType"] = saveType;
                    inputData["userinfo"] = this.props.Login.userInfo;
                    this.setState({ loading: true });
                    rsapi().post("biothirdpartyreturn/createChildBioThirdPartyReturn", { ...inputData })
                        .then(response => {

                            let masterData = { ...this.props.Login.masterData };
                            let responseData = response.data;
                            let lstBioThirdPartyReturn = this.props.Login.masterData?.lstBioThirdPartyReturn;
                            let searchedData = this.props.Login.masterData?.searchedData;

                            const index = lstBioThirdPartyReturn.findIndex(item => item && item.nbiothirdpartyreturncode === responseData.selectedBioThirdPartyReturn.nbiothirdpartyreturncode);
                            const searchedDataIndex = searchedData ? searchedData.findIndex(item => item && item.nbiothirdpartyreturncode === response.data.selectedBioThirdPartyReturn.nbiothirdpartyreturncode) : -1;

                            if (index !== -1) {
                                lstBioThirdPartyReturn[index] = responseData.selectedBioThirdPartyReturn;
                            }
                            if (searchedDataIndex !== -1) {
                                searchedData[searchedDataIndex] = response.data.selectedBioThirdPartyReturn;
                            }
                            masterData['lstBioThirdPartyReturn'] = lstBioThirdPartyReturn;
                            masterData['searchedData'] = searchedData;
                            masterData['lstFormNumberDetails'] = responseData.lstFormNumberDetails;

                            masterData = { ...masterData, ...responseData };

                            let openChildModal = false;
                            let openChildThirdPartyReturn = false;
                            if (saveType === 2) {
                                openChildModal = true;
                                openChildThirdPartyReturn = true;
                                selectedChildRecord['nbiothirdpartyformacceptancecode'] = '';
                                selectedChildRecord['lstGetSampleReceivingDetails'] = [];
                                selectedChildRecord['addSelectAll'] = false;
                                selectedChildRecord['addedSampleReceivingDetails'] = [];
                                selectedChildRecord['lstThirdPartyFormAcceptanceDetails'] = [];
                            } else {
                                selectedChildRecord = {};
                            }
                            selectedRecord['addSelectAll'] = false;
                            selectedRecord['addedChildBioThirdPartyReturn'] = [];
                            const updateInfo = {
                                typeName: DEFAULT_RETURN,
                                data: {
                                    masterData, openChildModal, openChildThirdPartyReturn, selectedChildRecord, selectedRecord: { ...selectedRecord, selectedChildRecord }
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
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_FORMCONTAINSNOSAMPLESTOADD" }));
                    this.setState({ loading: false });
                }
            } else {
                toast.warn(validationQuantity.idsName);
                this.setState({ loading: false });
            }
        }
    }

    closeChildModal = () => {
        let openChildModal = this.props.Login.openChildModal;
        let selectedChildRecord = this.props.Login.selectedChildRecord;
        let openChildThirdPartyReturn = this.props.Login.openChildThirdPartyReturn;
        let viewThirdPartyReturnDetails = this.props.Login.viewThirdPartyReturnDetails;
        let loadEsignStateHandle = this.props.Login.loadEsignStateHandle;
        let lstSampleCondition = this.props.Login.lstSampleCondition;
        let lstReason = this.props.Login.lstReason;
        let storageModal = this.props.Login.storageModal;

        if (this.props.Login.loadEsignStateHandle) {
            openChildModal = false;
            selectedChildRecord = {};
            openChildThirdPartyReturn = false;
            viewThirdPartyReturnDetails = false;
            loadEsignStateHandle = false;
        } else {
            openChildModal = false;
            selectedChildRecord = {};
            openChildThirdPartyReturn = false;
            viewThirdPartyReturnDetails = false;
            loadEsignStateHandle = false;
            lstSampleCondition = [];
            lstReason = [];
            storageModal = false
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                ...this.state.data,
                openChildModal,
                operation: undefined,
                selectedChildRecord,
                selectedId: null,
                openChildThirdPartyReturn,
                viewThirdPartyReturnDetails,
                loadEsignStateHandle,
                lstSampleCondition,
                lstReason,
                storageModal
            }
        }
        this.props.updateStore(updateInfo);

    }

    closeModalShow = () => {
        let openAcceptRejectThirdPartyReturn = this.state.openAcceptRejectThirdPartyReturn;
        let openModalShow = this.state.openModalShow;
        let loadEsignStateHandle = this.state.loadEsignStateHandle;
        let selectedChildRecord = this.state.selectedChildRecord;
        let screenName = this.props.Login.screenName;
        let operation = this.props.Login.operation;

        if (this.props.Login.loadEsignStateHandle) {
            loadEsignStateHandle = false;
            openModalShow = (screenName === "IDS_SAMPLECONDITION" && operation === "accept") ? true : false;
            openAcceptRejectThirdPartyReturn = (screenName === "IDS_SAMPLECONDITION" && operation === "accept") ? true : false;
            if (selectedChildRecord) {
                delete selectedChildRecord["esigncomments"];
                delete selectedChildRecord["esignpassword"];
                delete selectedChildRecord["esignreason"];
            }
        } else {
            openAcceptRejectThirdPartyReturn = false;
            openModalShow = false;
            selectedChildRecord = {};
        }


        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openAcceptRejectThirdPartyReturn, openModalShow, selectedChildRecord, loadEsignStateHandle
            }
        }
        this.props.updateStore(updateInfo);
    }

    onModalSaveEsignCheck = () => {
        let selectedChildRecord = this.state.selectedChildRecord;
        let selectedRecord = this.state.selectedRecord;
        let dataState = this.state.dataState;
        // let addedChildBioThirdPartyReturn = selectedRecord?.addedChildBioThirdPartyReturn.slice(dataState.skip, dataState.skip + dataState.take);
        let addedChildBioThirdPartyReturn = selectedRecord?.addedChildBioThirdPartyReturn;
        let inputData = {
            'nbiothirdpartyreturncode': addedChildBioThirdPartyReturn[0].nbiothirdpartyreturncode,
            'nbiothirdpartyreturndetailscode': addedChildBioThirdPartyReturn.map(x => x.nbiothirdpartyreturndetailscode).join(',') || '-1',
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
        rsapi().post("biothirdpartyreturn/updateSampleCondition", { ...inputData })
            .then(response => {
                let lstChildBioThirdPartyReturn = response.data?.lstChildBioThirdPartyReturn;

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        lstChildBioThirdPartyReturn, openAcceptRejectThirdPartyReturn: false, openModalShow: false, selectedChildRecord: {},
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

    viewThirdPartyReturnDetails = (paramData) => {
        let selectedViewRecord = paramData.treeView;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openChildModal: true,
                viewThirdPartyReturnDetails: true,
                selectedViewRecord, operation: 'view', screenName: 'IDS_SAMPLESDETAILS'
            }
        }
        this.props.updateStore(updateInfo);
    }

    onUndoDisposeEsignCheck = (undoID, operation, screenName) => {
        let selectedRecord = this.state.selectedRecord;
        let selectedBioThirdPartyReturn = this.props?.selectedBioThirdPartyReturn;

        if (selectedBioThirdPartyReturn?.ntransactionstatus === transactionStatus.VALIDATION) {
            if (selectedRecord?.addedChildBioThirdPartyReturn && selectedRecord?.addedChildBioThirdPartyReturn.length > 0) {
                let dataState = this.state.dataState;
                // let addedChildBioThirdPartyReturn = selectedRecord?.addedChildBioThirdPartyReturn.slice(dataState.skip, dataState.skip + dataState.take);
                let addedChildBioThirdPartyReturn = selectedRecord?.addedChildBioThirdPartyReturn;
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["nbiothirdpartyreturndetailscode"] = addedChildBioThirdPartyReturn.map(x => x.nbiothirdpartyreturndetailscode).join(',');
                inputData["nbiothirdpartyreturncode"] = addedChildBioThirdPartyReturn[0].nbiothirdpartyreturncode;

                let inputParam = {
                    inputData: inputData,
                    screenName: "IDS_UNDODISPOSE",
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
        rsapi().post("biothirdpartyreturn/undoDisposeSamples", {
            ...inputData
        })
            .then(response => {
                let lstChildBioThirdPartyReturn = response.data?.lstChildBioThirdPartyReturn;
                let selectedRecord = this.state.selectedRecord;
                selectedRecord['addedSampleReceivingDetails'] = [];
                sortData(lstChildBioThirdPartyReturn);

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        lstChildBioThirdPartyReturn, selectedRecord, loadEsignStateHandle: false, openModalShow: false, openChildModal: false
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

}

export default connect(mapStateToProps, { updateStore })(injectIntl(OuterGridThirdPartyReturn));