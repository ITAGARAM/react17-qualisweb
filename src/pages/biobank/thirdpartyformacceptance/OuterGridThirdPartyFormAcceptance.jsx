import { faArrowLeft, faCheck, faDolly, faUndo, faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { process } from '@progress/kendo-data-query';
import React from 'react';
import { Button, Card, Col, FormGroup, FormLabel, Nav, Row } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { updateStore } from '../../../actions';
import { ReadOnlyText } from "../../../components/App.styles";
import { onSaveMandatoryValidation, showEsign, sortData } from '../../../components/CommonScript';
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
import { ReactComponent as MoveToreturnStoredSamples } from './../../../assets/image/delivery-hand-package-icon.svg';


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class OuterGridThirdPartyFormAcceptance extends React.Component {
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
            data: props.lstChildBioThirdPartyFormAcceptance,
            lstChildBioThirdPartyFormAcceptance: props.lstChildBioThirdPartyFormAcceptance,
            lstBioThirdPartyFormAcceptance: props.lstBioThirdPartyFormAcceptance,
            selectedBioThirdPartyFormAcceptance: props.selectedBioThirdPartyFormAcceptance,
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
            const addedChildBioThirdPartyFormAcceptance = (this.state?.dataResult || [])
                .filter(dr =>
                    (this.state?.lstChildBioThirdPartyFormAcceptance || []).some(lc => lc?.nserialno === dr?.nserialno) &&
                    dr?.selected === true
                )
                .map(item => ({ ...item }));

            updates.selectedRecord = {
                ...this.state?.selectedRecord,
                addedChildBioThirdPartyFormAcceptance
            };
        }

        // --- Props-based updates ---
        const propsToStateMap = {
            selectedRecord: 'selectedRecord',
            selectedChildRecord: 'selectedChildRecord',
            selectedViewRecord: 'selectedViewRecord',
            loadEsignStateHandle: 'loadEsignStateHandle',
            openModalShow: 'openModalShow',
            openAcceptRejectBioThirdPartyFormAcceptance: 'openAcceptRejectBioThirdPartyFormAcceptance',
            lstSampleCondition: 'lstSampleCondition',
            lstReason: 'lstReason',
            lstChildBioThirdPartyFormAcceptance: 'lstChildBioThirdPartyFormAcceptance',
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
            updates.dataResult = (this.props?.Login?.masterData?.lstChildBioThirdPartyFormAcceptance || []).slice(updates.dataState.skip, updates.dataState.skip + updates.dataState.take);
            updates.lstChildBioThirdPartyFormAcceptance = this.props?.Login?.masterData?.lstChildBioThirdPartyFormAcceptance;
        }

        if (isChanged(this.props?.Login?.masterData?.selectedSampleStorageVersion, prevProps?.Login?.masterData?.selectedSampleStorageVersion)) {
            if (this.props.Login.masterData.selectedSampleStorageVersion && this.props.Login.masterData.selectedSampleStorageVersion !== undefined) {
                updates.treeDataView = {};
                updates.treeDataView = this.props.Login.masterData.selectedSampleStorageVersion["jsondata"].data;
            }
        }

        // --- Handle masterData.lstChildBioThirdPartyFormAcceptance ---
        if (isChanged(this.props?.Login?.masterData?.lstChildBioThirdPartyFormAcceptance, prevProps?.Login?.masterData?.lstChildBioThirdPartyFormAcceptance)) {
            const processed = this.props?.Login?.masterData?.lstChildBioThirdPartyFormAcceptance && process(this.props?.Login?.masterData?.lstChildBioThirdPartyFormAcceptance, this.props?.dataState);
            updates.lstChildBioThirdPartyFormAcceptance = this.props?.Login?.masterData?.lstChildBioThirdPartyFormAcceptance;
            updates.dataResult = processed ? processed.data : [];
            updates.total = processed ? processed.total : 0;
            updates.dataState = this.props?.dataState || {};
        }

        // --- Handle lstChildBioDirectTransfer ---
        if (isChanged(this.props?.Login?.lstChildBioThirdPartyFormAcceptance, prevProps?.Login?.lstChildBioThirdPartyFormAcceptance)) {
            let dataState = this.state?.dataState || {};
            const prevSelected = this.state?.selectedRecord || {};
            const newList = this.props?.Login?.lstChildBioThirdPartyFormAcceptance || [];

            if (newList.length <= dataState.skip) {
                dataState = {
                    skip: 0,
                    take: this.props.settings ? parseInt(this.props.settings[14]) : 10,
                };
            }

            const addedMap = new Map((prevSelected?.addedChildBioThirdPartyFormAcceptance || []).map(item => [item?.nserialno, item]));

            const updatedLstChildBioThirdPartyFormAcceptance = newList.map(item => {
                if (addedMap.has(item?.nserialno)) {
                    const updated = { ...item, selected: true };
                    addedMap.set(item?.nserialno, updated);
                    return updated;
                }
                return { ...item };
            });

            const addedChildBioThirdPartyFormAcceptance = Array.from(addedMap.values());
            const processed = process(updatedLstChildBioThirdPartyFormAcceptance, dataState);
            updates.lstChildBioThirdPartyFormAcceptance = updatedLstChildBioThirdPartyFormAcceptance;
            updates.dataResult = processed ? processed.data : [];
            updates.total = processed ? processed.total : 0;
            updates.dataState = dataState;
            updates.selectedRecord = { ...prevSelected, addedChildBioThirdPartyFormAcceptance };
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
        } else {
            return true;
        }
    }

    render() {
        this.extractedFields =
            [
                { "idsName": "IDS_REPOSITORYID", "dataField": "srepositoryid", "width": "100px" },
                { "idsName": "IDS_BIOSAMPLETYPE", "dataField": "sproductname", "width": "100px" },
                { "idsName": "IDS_VOLUMEµL", "dataField": "sreceivedvolume", "width": "100px" },
                { "idsName": "IDS_SAMPLECONDITION", "dataField": "ssamplecondition", "width": "100px" },
                { "idsName": "IDS_SAMPLESTATUS", "dataField": "ssamplestatus", "width": "100px" },
            ];

        const acceptRejectID = this.props.acceptRejectID;
        const moveToDisposeID = this.props.moveToDisposeID;
        const moveToReturnID = this.props.moveToReturnID;
        const undoID = this.props.undoID;
        const moveToReturnaftercompleteID = this.props.moveToReturnaftercompleteID;

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
                                        onClick={() => this.acceptRejectBioThirdPartyFormAcceptance(acceptRejectID, 'accept', 'IDS_SAMPLECONDITION')}>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </Nav.Link>
                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_MOVETODISPOSE" })} data-place="left"
                                        hidden={this.props.userRoleControlRights.indexOf(moveToDisposeID) === -1}
                                        onClick={() => this.onMoveToDisposeEsignCheck(moveToDisposeID, 'movetodispose', 'IDS_MOVETODISPOSE')}>
                                        <FontAwesomeIcon icon={faDolly} />
                                    </Nav.Link>
                                    {/* this.props.realSelectedFormType && this.props.realSelectedFormType.value === formType.TRANSFER && */}
                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_MOVETORETURN" })} data-place="left"
                                        hidden={this.props.userRoleControlRights.indexOf(moveToReturnID) === -1}
                                        onClick={() => this.onMoveToReturnEsignCheck(moveToReturnID, 'movetoreturn', 'IDS_MOVETORETURN')}>
                                        <FontAwesomeIcon icon={faArrowLeft} />
                                    </Nav.Link>
                                    {/* } */}
                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_UNDODISPOSERETURN" })} data-place="left"
                                        hidden={this.props.userRoleControlRights.indexOf(undoID) === -1}
                                        onClick={() => this.onUndoReturnDisposeEsignCheck(undoID, 'undo', 'IDS_UNDODISPOSERETURN')}>
                                        <FontAwesomeIcon icon={faUndo} />
                                    </Nav.Link>


                                    <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_RETURNUSEDSAMPLES" })} data-place="left"
                                        hidden={this.props.userRoleControlRights.indexOf(moveToReturnaftercompleteID) === -1}
                                        onClick={() => this.onMoveToReturnAfterCompleteEsignCheck(moveToReturnaftercompleteID, 'movetoreturncomplete', 'IDS_MOVETORETURNCOMPLETE')}>
                                        <MoveToreturnStoredSamples className='custom_icons' />
                                    </Button>

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
                            dataResult={this.state.dataResult || []}
                            scrollable={'scrollable'}
                            pageable={true}
                            isActionRequired={true}
                            removeNotRequired={true}
                            methodUrl={"ChildBioThirdPartyFormAcceptance"}
                            controlMap={this.props.controlMap}
                            userRoleControlRights={this.props.userRoleControlRights}
                            fetchRecord={this.viewBioThirdPartyFormAcceptanceDetails}
                            gridHeight={this.props.gridHeight}
                        />
                    </Col>
                </Row>

                {(this.props.Login.openChildModal) ?
                    <SlideOutModal
                        show={this.props.Login.openChildModal}
                        closeModal={this.closeChildModal}
                        operation={(this.props.Login.loadEsignStateHandle || this.props.Login.viewBioThirdPartyFormAcceptanceDetails) ? undefined : this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.loadEsignStateHandle ? this.props.intl.formatMessage({ id: "IDS_ESIGN" })
                            : this.props.Login.screenName}
                        esign={false}
                        needClose={this.props.Login.operation === "view" ? true : false}
                        hideSave={this.props.Login.operation === "view" ? true : false}
                        onSaveClick={this.onMandatoryCheck}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        showSaveContinue={this.props.Login.loadEsignStateHandle ? false : true}
                        showSave={!this.props.Login.viewBioThirdPartyFormAcceptanceDetails}
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
                            : this.props.Login.viewBioThirdPartyFormAcceptanceDetails ?
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
                                                        <ReadOnlyText>
                                                            {
                                                                this.state.selectedViewRecord ?
                                                                    this.state.selectedViewRecord.ecatalogrequestapproval
                                                                        ? this.state.selectedViewRecord.ecatalogrequestapproval
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
                                this.state.openAcceptRejectBioThirdPartyFormAcceptance ?
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
        const { lstChildBioThirdPartyFormAcceptance, selectedRecord } = this.state;

        // Always filter from full list
        let dataSource = lstChildBioThirdPartyFormAcceptance || [];

        // Reapply selection from addedChildBioThirdPartyFormAcceptance
        const addedChildBioThirdPartyFormAcceptance = selectedRecord?.addedChildBioThirdPartyFormAcceptance || [];
        const selectedMap = new Map(addedChildBioThirdPartyFormAcceptance.map(item => [item.nserialno, item]));

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
            lstChildBioThirdPartyFormAcceptance: dataSource, // keep selection persisted
            dataResult: processed.data,
            total: processed.total,
            dataState: event.dataState,
            selectedRecord: {
                ...selectedRecord,
                addSelectAll: allSelected,
                addedChildBioThirdPartyFormAcceptance: Array.from(selectedMap.values())
            }
        });
    }

    headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        const eventData = event.target.props.data.hasOwnProperty('data') ? event.target.props.data.data || [] : event.target.props.data || [];
        let lstChildBioThirdPartyFormAcceptance = this.state?.dataResult || [];
        let addedChildBioThirdPartyFormAcceptance = this.state.selectedRecord?.addedChildBioThirdPartyFormAcceptance || [];
        let selectedRecord = this.state.selectedRecord;
        if (checked) {
            const data = lstChildBioThirdPartyFormAcceptance.map(item => {
                const matchingData = eventData.find(dataItem => dataItem.nserialno === item.nserialno);
                if (matchingData) {
                    const existingIndex = addedChildBioThirdPartyFormAcceptance.findIndex(
                        x => x.nserialno === item.nserialno
                    );

                    if (existingIndex === -1) {
                        const newItem = {
                            ...item,
                            selected: true,
                        };
                        addedChildBioThirdPartyFormAcceptance.push(newItem);
                    }
                    return { ...item, selected: true };
                } else {
                    return { ...item, selected: item.selected ? true : false };
                }
            });
            selectedRecord['addedChildBioThirdPartyFormAcceptance'] = addedChildBioThirdPartyFormAcceptance;
            selectedRecord['addSelectAll'] = checked;
            this.setState({
                selectedRecord,
                dataResult: data
            });
            this.props.childDataChange(selectedRecord);
        } else {
            let addedChildBioThirdPartyFormAcceptance = this.state.selectedRecord?.addedChildBioThirdPartyFormAcceptance || [];
            const data = lstChildBioThirdPartyFormAcceptance.map(x => {
                const matchedItem = eventData.find(item => x.nserialno === item.nserialno);
                if (matchedItem) {
                    addedChildBioThirdPartyFormAcceptance = addedChildBioThirdPartyFormAcceptance.filter(item1 => item1.nserialno !== matchedItem.nserialno);
                    matchedItem.selected = false;
                    return matchedItem;
                }
                return x;
            });
            selectedRecord['addedChildBioThirdPartyFormAcceptance'] = addedChildBioThirdPartyFormAcceptance;
            selectedRecord['addSelectAll'] = checked;
            this.setState({
                selectedRecord,
                dataResult: data
            });
            this.props.childDataChange(selectedRecord);
        }
    }

    selectionChange = (event) => {
        let addedChildBioThirdPartyFormAcceptance = this.state.selectedRecord?.addedChildBioThirdPartyFormAcceptance || [];
        let selectedRecord = this.state.selectedRecord;
        const lstChildBioThirdPartyFormAcceptance = this.state?.dataResult.map(item => {
            if (item.nserialno === event.dataItem.nserialno) {
                item.selected = !event.dataItem.selected;
                if (item.selected) {
                    const newItem = JSON.parse(JSON.stringify(item));
                    delete newItem['selected']
                    newItem.selected = true;
                    addedChildBioThirdPartyFormAcceptance.push(newItem);
                } else {
                    addedChildBioThirdPartyFormAcceptance = addedChildBioThirdPartyFormAcceptance.filter(item1 => item1.nserialno !== item.nserialno)
                }
            }
            return item;
        })
        selectedRecord['addedChildBioThirdPartyFormAcceptance'] = addedChildBioThirdPartyFormAcceptance;
        selectedRecord['addSelectAll'] = this.validateCheckAll(process(lstChildBioThirdPartyFormAcceptance || [], this.state.dataState).data);
        this.setState({
            selectedRecord,
            dataResult: lstChildBioThirdPartyFormAcceptance
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

    acceptRejectBioThirdPartyFormAcceptance = (acceptRejectID, operation, screenName) => {
        let selectedBioThirdPartyFormAcceptance = this.props?.selectedBioThirdPartyFormAcceptance;
        let selectedRecord = this.state.selectedRecord;
        if (selectedBioThirdPartyFormAcceptance) {
            this.setState({ loading: true });
            rsapi().post("biothirdpartyformacceptance/acceptRejectBioThirdPartyFormAcceptanceSlide", {
                'addedChildBioThirdPartyFormAcceptance': selectedRecord?.addedChildBioThirdPartyFormAcceptance || [],
                'nbiothirdpartyformacceptancecode': selectedBioThirdPartyFormAcceptance.nbiothirdpartyformacceptancecode,
                'userinfo': this.props.Login.userInfo
            })
                .then(response => {
                    let lstSampleCondition = response.data?.lstSampleCondition;
                    let lstReason = response.data?.lstReason;

                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            lstSampleCondition, lstReason, openAcceptRejectBioThirdPartyFormAcceptance: true, openModalShow: true,
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
        let selectedBioThirdPartyFormAcceptance = this.props?.selectedBioThirdPartyFormAcceptance;

        if (selectedBioThirdPartyFormAcceptance?.ntransactionstatus === transactionStatus.VALIDATION) {
            if (selectedRecord?.addedChildBioThirdPartyFormAcceptance && selectedRecord?.addedChildBioThirdPartyFormAcceptance.length > 0) {
                let dataState = this.state.dataState;
                // let addedChildBioThirdPartyFormAcceptance = selectedRecord?.addedChildBioThirdPartyFormAcceptance.slice(dataState.skip, dataState.skip + dataState.take);
                let addedChildBioThirdPartyFormAcceptance = selectedRecord?.addedChildBioThirdPartyFormAcceptance;
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["nbiothirdpartyformacceptancedetailscode"] = addedChildBioThirdPartyFormAcceptance.map(x => x.nbiothirdpartyformacceptancedetailscode).join(',');
                inputData["nbiothirdpartyformacceptancecode"] = addedChildBioThirdPartyFormAcceptance[0].nbiothirdpartyformacceptancecode;

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
        let selectedBioThirdPartyFormAcceptance = this.props?.selectedBioThirdPartyFormAcceptance;

        if (selectedBioThirdPartyFormAcceptance?.ntransactionstatus === transactionStatus.VALIDATION) {
            if (selectedRecord?.addedChildBioThirdPartyFormAcceptance && selectedRecord?.addedChildBioThirdPartyFormAcceptance.length > 0) {
                let dataState = this.state.dataState;
                // let addedChildBioThirdPartyFormAcceptance = selectedRecord?.addedChildBioThirdPartyFormAcceptance.slice(dataState.skip, dataState.skip + dataState.take);
                let addedChildBioThirdPartyFormAcceptance = selectedRecord?.addedChildBioThirdPartyFormAcceptance;
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["nbiothirdpartyformacceptancedetailscode"] = addedChildBioThirdPartyFormAcceptance.map(x => x.nbiothirdpartyformacceptancedetailscode).join(',');
                inputData["nbiothirdpartyformacceptancecode"] = addedChildBioThirdPartyFormAcceptance[0].nbiothirdpartyformacceptancecode;

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
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLESTORETURN" }));
                this.setState({ loading: false });
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTVALIDATEDRECORD" }));
        }
    }

    onUndoReturnDisposeEsignCheck = (undoID, operation, screenName) => {

        let selectedRecord = this.state.selectedRecord;
        let selectedBioThirdPartyFormAcceptance = this.props?.selectedBioThirdPartyFormAcceptance;

        if (selectedBioThirdPartyFormAcceptance?.ntransactionstatus === transactionStatus.VALIDATION) {
            if (selectedRecord?.addedChildBioThirdPartyFormAcceptance && selectedRecord?.addedChildBioThirdPartyFormAcceptance.length > 0) {
                let dataState = this.state.dataState;
                // let addedChildBioThirdPartyFormAcceptance = selectedRecord?.addedChildBioThirdPartyFormAcceptance.slice(dataState.skip, dataState.skip + dataState.take);
                let addedChildBioThirdPartyFormAcceptance = selectedRecord?.addedChildBioThirdPartyFormAcceptance;
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["nbiothirdpartyformacceptancedetailscode"] = addedChildBioThirdPartyFormAcceptance.map(x => x.nbiothirdpartyformacceptancedetailscode).join(',');
                inputData["nbiothirdpartyformacceptancecode"] = addedChildBioThirdPartyFormAcceptance[0].nbiothirdpartyformacceptancecode;

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
        rsapi().post("biothirdpartyformacceptance/moveToDisposeSamples", {
            ...inputData
        })
            .then(response => {
                let lstChildBioThirdPartyFormAcceptance = response.data?.lstChildBioThirdPartyFormAcceptance;
                let selectedRecord = this.state.selectedRecord;
                selectedRecord['addedSampleReceivingDetails'] = [];
                sortData(lstChildBioThirdPartyFormAcceptance);

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        lstChildBioThirdPartyFormAcceptance, selectedRecord, loadEsignStateHandle: false, openModalShow: false, openChildModal: false
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
        rsapi().post("biothirdpartyformacceptance/moveToReturnSamples", {
            ...inputData
        })
            .then(response => {
                let lstChildBioThirdPartyFormAcceptance = response.data?.lstChildBioThirdPartyFormAcceptance;
                let selectedRecord = this.state.selectedRecord;
                selectedRecord['addedSampleReceivingDetails'] = [];
                sortData(lstChildBioThirdPartyFormAcceptance);

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        lstChildBioThirdPartyFormAcceptance, selectedRecord, loadEsignStateHandle: false, openModalShow: false, openChildModal: false
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
        rsapi().post("biothirdpartyformacceptance/undoReturnDisposeSamples", {
            ...inputData
        })
            .then(response => {
                let lstChildBioThirdPartyFormAcceptance = response.data?.lstChildBioThirdPartyFormAcceptance;
                let selectedRecord = this.state.selectedRecord;
                selectedRecord['addedSampleReceivingDetails'] = [];
                sortData(lstChildBioThirdPartyFormAcceptance);

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        lstChildBioThirdPartyFormAcceptance, selectedRecord, loadEsignStateHandle: false, openModalShow: false, openChildModal: false
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
        if (this.props.Login.loadEsignStateHandle && this.props.Login.openAcceptRejectBioThirdPartyFormAcceptance) {
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
        const mandatoryFields = (this.state.openAcceptRejectBioThirdPartyFormAcceptance ? this.state.loadEsignStateHandle : this.props.Login.loadEsignStateHandle) ?
            [
                { "idsName": "IDS_PASSWORD", "dataField": "esignpassword", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_REASON", "dataField": "esignreason", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "idsName": "IDS_COMMENTS", "dataField": "esigncomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            ]
            :
            this.state.openAcceptRejectBioThirdPartyFormAcceptance ?
                [
                    { "idsName": "IDS_SAMPLECONDITION", "dataField": "nsamplecondition", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_REASON", "dataField": "nreasoncode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
                ] :
                [];

        onSaveMandatoryValidation(this.state.selectedChildRecord,
            mandatoryFields, (this.state.openAcceptRejectBioThirdPartyFormAcceptance ? this.state.loadEsignStateHandle :
                this.props.Login.loadEsignStateHandle) ? this.validateChildEsign : this.state.openAcceptRejectBioThirdPartyFormAcceptance ?
            this.onModalSaveEsignCheck :
            "",
            (this.state.openAcceptRejectBioThirdPartyFormAcceptance ? this.state.loadEsignStateHandle : this.props.Login.loadEsignStateHandle),
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
        this.validateChildEsignforBioThirdPartyFormAcceptance(inputParam, modalName);
    }

    validateChildEsignforBioThirdPartyFormAcceptance = (inputParam) => {
        rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {
                    if (inputParam["screenData"]["inputParam"]["operation"] === "movetodispose"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_MOVETODISPOSE") {
                        this.moveToDisposeSamples(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "undo"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_UNDODISPOSERETURN") {
                        this.undoReturnDisposeSamples(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "accept"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_SAMPLECONDITION") {
                        this.onModalSave(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "movetoreturn"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_MOVETORETURN") { // Added by Gowtham for jira.id:BGSI-195
                        this.moveToReturnSamples(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "movetoreturncomplete"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_MOVETORETURNCOMPLETE") { // Added by janakumar for jira.id:BGSI-213
                        this.moveToReturnSamplesAfterComplete(inputParam["screenData"]["inputParam"]["inputData"]);
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
        let viewBioThirdPartyFormAcceptanceDetails = this.props.Login.viewBioThirdPartyFormAcceptanceDetails;
        let loadEsignStateHandle = this.props.Login.loadEsignStateHandle;
        let screenName = this.props.Login.screenName;
        let operation = this.props.Login.operation;
        let shouldRender = this.state.shouldRender;

        if (this.props.Login.loadEsignStateHandle) {
            openChildModal = (screenName === "IDS_STORE" && operation === "store") ? true : false;
            viewBioThirdPartyFormAcceptanceDetails = false;
            loadEsignStateHandle = false;
            if (selectedChildRecord) {
                delete selectedChildRecord["esigncomments"];
                delete selectedChildRecord["esignpassword"];
                delete selectedChildRecord["esignreason"];
            }
        } else {
            openChildModal = false;
            selectedChildRecord = {};
            viewBioThirdPartyFormAcceptanceDetails = false;
            loadEsignStateHandle = false;
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
                viewBioThirdPartyFormAcceptanceDetails,
                loadEsignStateHandle,
                shouldRender
            }
        }
        this.props.updateStore(updateInfo);

    }

    closeModalShow = () => {
        let openAcceptRejectBioThirdPartyFormAcceptance = this.state.openAcceptRejectBioThirdPartyFormAcceptance;
        let openModalShow = this.state.openModalShow;
        let loadEsignStateHandle = this.state.loadEsignStateHandle;
        let selectedChildRecord = this.state.selectedChildRecord;
        let screenName = this.props.Login.screenName;
        let operation = this.props.Login.operation;

        if (this.props.Login.loadEsignStateHandle) {
            loadEsignStateHandle = false;
            openModalShow = (screenName === "IDS_SAMPLECONDITION" && operation === "accept") ? true : false;
            openAcceptRejectBioThirdPartyFormAcceptance = (screenName === "IDS_SAMPLECONDITION" && operation === "accept") ? true : false;
            if (selectedChildRecord) {
                delete selectedChildRecord["esigncomments"];
                delete selectedChildRecord["esignpassword"];
                delete selectedChildRecord["esignreason"];
            }
        } else {
            openAcceptRejectBioThirdPartyFormAcceptance = false;
            openModalShow = false;
            selectedChildRecord = {};
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openAcceptRejectBioThirdPartyFormAcceptance, openModalShow, selectedChildRecord, loadEsignStateHandle
            }
        }
        this.props.updateStore(updateInfo);
    }

    onModalSaveEsignCheck = () => {
        let selectedChildRecord = this.state.selectedChildRecord;
        let selectedRecord = this.state.selectedRecord;
        let dataState = this.state.dataState;
        // let addedChildBioThirdPartyFormAcceptance = selectedRecord?.addedChildBioThirdPartyFormAcceptance.slice(dataState.skip, dataState.skip + dataState.take);
        let addedChildBioThirdPartyFormAcceptance = selectedRecord?.addedChildBioThirdPartyFormAcceptance;
        let inputData = {
            'nbiothirdpartyformacceptancecode': addedChildBioThirdPartyFormAcceptance[0].nbiothirdpartyformacceptancecode,
            'nbiothirdpartyformacceptancedetailscode': addedChildBioThirdPartyFormAcceptance.map(x => x.nbiothirdpartyformacceptancedetailscode).join(',') || '-1',
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
        rsapi().post("biothirdpartyformacceptance/updateSampleCondition", { ...inputData })
            .then(response => {
                let lstChildBioThirdPartyFormAcceptance = response.data?.lstChildBioThirdPartyFormAcceptance;
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        lstChildBioThirdPartyFormAcceptance, openAcceptRejectBioThirdPartyFormAcceptance: false, openModalShow: false, selectedChildRecord: {},
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

    viewBioThirdPartyFormAcceptanceDetails = (paramData) => {
        let selectedViewRecord = paramData.treeView;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openChildModal: true,
                viewBioThirdPartyFormAcceptanceDetails: true,
                selectedViewRecord, operation: 'view', screenName: 'IDS_SAMPLESDETAILS'
            }
        }
        this.props.updateStore(updateInfo);
    }

    onMoveToReturnAfterCompleteEsignCheck = (moveToReturnID, operation, screenName) => {

        let selectedRecord = this.state.selectedRecord;
        let selectedBioThirdPartyFormAcceptance = this.props?.selectedBioThirdPartyFormAcceptance;

        if (selectedBioThirdPartyFormAcceptance?.ntransactionstatus === transactionStatus.COMPLETED) {
            if (selectedRecord?.addedChildBioThirdPartyFormAcceptance && selectedRecord?.addedChildBioThirdPartyFormAcceptance.length > 0) {
                let dataState = this.state.dataState;
                // let addedChildBioThirdPartyFormAcceptance = selectedRecord?.addedChildBioThirdPartyFormAcceptance.slice(dataState.skip, dataState.skip + dataState.take);
                let addedChildBioThirdPartyFormAcceptance = selectedRecord?.addedChildBioThirdPartyFormAcceptance;
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["nbiothirdpartyformacceptancedetailscode"] = addedChildBioThirdPartyFormAcceptance.map(x => x.nbiothirdpartyformacceptancedetailscode).join(',');
                inputData["nbiothirdpartyformacceptancecode"] = addedChildBioThirdPartyFormAcceptance[0].nbiothirdpartyformacceptancecode;

                let inputParam = {
                    inputData: inputData,
                    screenName: screenName,
                    operation: "movetoreturncomplete"
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
                    this.moveToReturnSamplesAfterComplete(inputData);
                }

            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLESTORETURN" }));
                this.setState({ loading: false });
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTCOMPLETERECORD" }));
        }
    }
    // Added by janakumar for jira.id:BGSI-213    -- Start
    moveToReturnSamplesAfterComplete = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("biothirdpartyformacceptance/moveToReturnSamplesAfterComplete", {
            ...inputData
        })
            .then(response => {
                let lstChildBioThirdPartyFormAcceptance = response.data?.lstChildBioThirdPartyFormAcceptance;
                let selectedRecord = this.state.selectedRecord;
                selectedRecord['addedSampleReceivingDetails'] = [];
                sortData(lstChildBioThirdPartyFormAcceptance);

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        lstChildBioThirdPartyFormAcceptance, selectedRecord, loadEsignStateHandle: false, openModalShow: false, openChildModal: false
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
    // Added by janakumar for jira.id:BGSI-213     --End

}

export default connect(mapStateToProps, { updateStore })(injectIntl(OuterGridThirdPartyFormAcceptance));