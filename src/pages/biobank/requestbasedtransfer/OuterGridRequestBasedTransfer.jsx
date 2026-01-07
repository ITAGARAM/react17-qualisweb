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
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from '../../../actions/LoginTypes';
import AcceptRejectRequestBasedTransfer from './AcceptRejectRequestBasedTransfer';
import AddRequestBasedTransfer from "./AddRequestBasedTransfer";

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class OuterGridRequestBasedTransfer extends React.Component {
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
            lstChildBioRequestbasedTransfer: props.lstChildBioRequestbasedTransfer,
            lstBioRequestBasedTransfer: props.lstBioRequestBasedTransfer,
            selectedBioRequestBasedTransfer: props.selectedBioRequestBasedTransfer,
            selectedChildRecord: {},
            selectedViewRecord: {},
            data: props.lstChildBioRequestbasedTransfer

        }
    }


    componentDidUpdate(prevProps, prevState) {
        const updates = {};

        // ✅ helper for deep compare
        const isChanged = (curr, prev) => JSON.stringify(curr) !== JSON.stringify(prev);

        // --- Handle dataResult change ---
        if (isChanged(prevState?.dataResult, this.state?.dataResult)) {
            const addedChildBioRequestBasedTransfer = (this.state?.dataResult || [])
                .filter(dr =>
                    (this.state?.lstChildBioRequestbasedTransfer || []).some(lc => lc?.nserialno === dr?.nserialno) &&
                    dr?.selected === true
                )
                .map(item => ({ ...item }));

            updates.selectedRecord = {
                ...this.state?.selectedRecord,
                addedChildBioRequestBasedTransfer
            };
        }

        // --- Props-based updates ---
        const propsToStateMap = {
            selectedRecord: 'selectedRecord',
            selectedChildRecord: 'selectedChildRecord',
            selectedViewRecord: 'selectedViewRecord',
            loadEsignStateHandle: 'loadEsignStateHandle',
            openModalShow: 'openModalShow',
            openAcceptRejectRequestBasedTransfer: 'openAcceptRejectRequestBasedTransfer',
            lstSampleCondition: 'lstSampleCondition',
            lstReason: 'lstReason'
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
            updates.dataResult = (this.props?.Login?.masterData?.lstChildBioRequestbasedTransfer || []).slice(updates.dataState.skip, updates.dataState.skip + updates.dataState.take);
            updates.lstChildBioRequestbasedTransfer = this.props?.Login?.masterData?.lstChildBioRequestbasedTransfer;
        }

        // --- Handle masterData.lstChildBioRequestbasedTransfer ---
        if (isChanged(this.props?.Login?.masterData?.lstChildBioRequestbasedTransfer, prevProps?.Login?.masterData?.lstChildBioRequestbasedTransfer)) {
            const processed = this.props?.Login?.masterData?.lstChildBioRequestbasedTransfer && process(this.props?.Login?.masterData?.lstChildBioRequestbasedTransfer, this.props?.dataState);
            updates.lstChildBioRequestbasedTransfer = this.props?.Login?.masterData?.lstChildBioRequestbasedTransfer;
            updates.dataResult = processed ? processed.data : [];
            updates.total = processed ? processed.total : 0;
            updates.dataState = this.props?.dataState || {};
        }

        // --- Handle lstChildBioRequestbasedTransfer ---
        if (isChanged(this.props?.Login?.lstChildBioRequestbasedTransfer, prevProps?.Login?.lstChildBioRequestbasedTransfer)) {
            // const { dataState, selectedRecord: prevSelected = {} } = this.state;
            let dataState = this.state?.dataState || {};
            const prevSelected = this.state?.selectedRecord || {};
            const newList = this.props?.Login?.lstChildBioRequestbasedTransfer || [];

            if (newList.length <= dataState.skip) {
                dataState = {
                    skip: 0,
                    take: this.props.settings ? parseInt(this.props.settings[14]) : 10,
                };
            }

            const addedMap = new Map((prevSelected?.addedChildBioRequestBasedTransfer || []).map(item => [item?.nserialno, item]));

            const updatedlstChildBioRequestbasedTransfer = newList.map(item => {
                if (addedMap.has(item?.nserialno)) {
                    const updated = { ...item, selected: true };
                    addedMap.set(item?.nserialno, updated);
                    return updated;
                }
                return { ...item };
            });

            const addedChildBioRequestBasedTransfer = Array.from(addedMap.values());
            const processed = process(updatedlstChildBioRequestbasedTransfer, dataState);
            updates.lstChildBioRequestbasedTransfer = updatedlstChildBioRequestbasedTransfer;
            updates.dataResult = processed ? processed.data : [];
            updates.total = processed ? processed.total : 0;
            updates.dataState = dataState;
            updates.selectedRecord = { ...prevSelected, addedChildBioRequestBasedTransfer };
        }

        if (this.props.Login.selectedViewRecord !== prevProps.Login.selectedViewRecord) {
            updates.selectedViewRecord = this.props.Login.selectedViewRecord;
        }
        // ✅ Apply all updates in one setState
        if (Object.keys(updates).length > 0) {
            this.setState(updates);
        }
    }
    // componentDidUpdate(prevProps, prevState) {
    //     if (JSON.stringify(this.props.Login.selectedRecord) !== JSON.stringify(prevProps.Login.selectedRecord)) {
    //         this.setState({ selectedRecord: this.props.Login.selectedRecord })
    //     }
    //     if (JSON.stringify(this.props.Login.masterData.lstChildBioRequestbasedTransfer) !== JSON.stringify(prevProps.Login.masterData.lstChildBioRequestbasedTransfer)) {
    //         this.setState({ lstChildBioRequestbasedTransfer: this.props.Login.masterData.lstChildBioRequestbasedTransfer })
    //     }
    //     if (JSON.stringify(this.props.Login.lstChildBioRequestbasedTransfer) !== JSON.stringify(prevProps.Login.lstChildBioRequestbasedTransfer)) {
    //         this.setState({ lstChildBioRequestbasedTransfer: this.props.Login.lstChildBioRequestbasedTransfer })
    //     }
    //     if (JSON.stringify(this.props.Login.selectedChildRecord) !== JSON.stringify(prevProps.Login.selectedChildRecord)) {
    //         this.setState({ selectedChildRecord: this.props.Login.selectedChildRecord })
    //     }
    //     if (JSON.stringify(this.props.Login.selectedViewRecord) !== JSON.stringify(prevProps.Login.selectedViewRecord)) {
    //         this.setState({ selectedViewRecord: this.props.Login.selectedViewRecord });
    //     }
    //     if (JSON.stringify(this.props.Login.loadEsignStateHandle) !== JSON.stringify(prevProps.Login.loadEsignStateHandle)) {
    //         this.setState({ loadEsignStateHandle: this.props.Login.loadEsignStateHandle });
    //     }
    //     if (JSON.stringify(this.props.Login.openModalShow) !== JSON.stringify(prevProps.Login.openModalShow)) {
    //         this.setState({ openModalShow: this.props.Login.openModalShow });
    //     }
    //     if (JSON.stringify(this.props.Login.openAcceptRejectRequestBasedTransfer) !== JSON.stringify(prevProps.Login.openAcceptRejectRequestBasedTransfer)) {
    //         this.setState({ openAcceptRejectRequestBasedTransfer: this.props.Login.openAcceptRejectRequestBasedTransfer });
    //     }
    //     if (JSON.stringify(this.props.Login.lstSampleCondition) !== JSON.stringify(prevProps.Login.lstSampleCondition)) {
    //         this.setState({ lstSampleCondition: this.props.Login.lstSampleCondition });
    //     }
    //     if (JSON.stringify(this.props.Login.lstReason) !== JSON.stringify(prevProps.Login.lstReason)) {
    //         this.setState({ lstReason: this.props.Login.lstReason });
    //     }
    // }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.Login.openChildModal && (this.props.Login.openChildRequestBasedTransfer || this.state.openModalShow) && nextState.isInitialRender === false &&
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
                { "idsName": "IDS_PARENTSAMPLECODE", "dataField": "sparentsamplecode", "width": "150px" },
                { "idsName": "IDS_BIOSAMPLETYPE", "dataField": "sproductname", "width": "130px" },
                { "idsName": "IDS_VOLUMEµL", "dataField": "svolume", "width": "100px" },
                { "idsName": "IDS_SAMPLECONDITION", "dataField": "ssamplecondition", "width": "130px" },
                { "idsName": "IDS_TRANSFERSTATUS", "dataField": "stransferstatus", "width": "120px" },
                // { "idsName": "IDS_SAMPLESTATUS", "dataField": "ssamplestatus", "width": "100px" },
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
                                        onClick={() => this.addChildRequestBasedTransfer(addChildID, 'create', 'IDS_SAMPLE')}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Nav.Link>
                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_SAMPLEVALIDATION" })} data-place="left"
                                        hidden={this.props.userRoleControlRights.indexOf(acceptRejectID) === -1}
                                        onClick={() => this.acceptRejectRequestBasedTransfer(acceptRejectID, 'accept', 'IDS_SAMPLECONDITION')}>
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
                            //data={this.state?.lstChildBioRequestbasedTransfer || []}
                            selectAll={this.state.selectedRecord?.addSelectAll}
                            userInfo={this.props.Login.userInfo}
                            title={this.props.intl.formatMessage({ id: "IDS_SELECTTODELETE" })}
                            headerSelectionChange={this.headerSelectionChange}
                            selectionChange={this.selectionChange}
                            dataStateChange={this.dataStateChange}
                            extractedColumnList={this.extractedFields}
                            dataState={this.state.dataState}
                            dataResult={this.state.dataResult || []}
                            //dataResult={process(this.state?.lstChildBioRequestbasedTransfer || [], this.state.dataState)}
                            scrollable={'scrollable'}
                            pageable={true}
                            isActionRequired={true}
                            removeNotRequired={true}
                            methodUrl={"ChildRequestBasedTransfer"}
                            controlMap={this.props.controlMap}
                            userRoleControlRights={this.props.userRoleControlRights}
                            fetchRecord={this.viewRequestBasedTransferDetails}
                        />
                    </Col>
                </Row>

                {(this.props.Login.openChildModal) ?
                    <SlideOutModal
                        show={this.props.Login.openChildModal}
                        hideSave={this.props.Login.operation === "view" ? true : false}
                        showSaveContinue={this.props.Login.loadEsignStateHandle ? false : true}
                        //size={this.props.Login.operation === 'view' ? 'lg' : this.props.Login.operation === 'delete' ? 'lg' : this.props.Login.operation === 'dispose' ? 'lg' : 'xl'}
                        size={['view', 'delete', 'dispose', 'undo'].includes(this.props.Login.operation) ? 'lg' : 'xl'}
                        closeModal={this.closeChildModal}
                        operation={(this.props.Login.loadEsignStateHandle || this.props.Login.viewRequestBasedTransferDetails) ? undefined : this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.loadEsignStateHandle ? this.props.intl.formatMessage({ id: "IDS_ESIGN" })
                            : this.props.Login.screenName}
                        esign={false}
                        onSaveClick={this.onMandatoryCheck}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        showSave={!this.props.Login.viewRequestBasedTransferDetails}
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
                            : this.props.Login.openChildRequestBasedTransfer ?
                                <AddRequestBasedTransfer
                                    controlMap={this.props.controlMap}
                                    userRoleControlRights={this.props.userRoleControlRights}
                                    operation={this.props.Login.operation}
                                    childDataChange={this.subChildDataChange}
                                    selectedRecord={this.state.selectedChildRecord || {}}
                                    lstBioProject={this.props.Login.masterData?.lstBioProject || []}
                                    isChildSlideOut={true}
                                    lstStorageType={this.props.Login.masterData?.lstStorageType || []}
                                    lstRequestFormNo={this.props.Login.masterData?.lstRequestFormNo || []}

                                />
                                : this.props.Login.viewRequestBasedTransferDetails ?
                                    <ContentPanel className="panel-main-content">
                                        <Card className="border-0">
                                            <Card.Body>
                                                <Row>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel>
                                                                <FormattedMessage
                                                                    id="IDS_REQUESTFORMNO"
                                                                    message="RequestFormNo."
                                                                />
                                                            </FormLabel>
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
                                                                    id="IDS_ORIGINSITE"
                                                                    message="OriginSite"
                                                                />
                                                            </FormLabel>
                                                            <ReadOnlyText>
                                                                {
                                                                    this.state.selectedViewRecord ?
                                                                        this.state.selectedViewRecord.originsite
                                                                            ? this.state.selectedViewRecord.originsite
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
                                                                        this.state.selectedViewRecord.sparentsamplecode
                                                                            ? this.state.selectedViewRecord.sparentsamplecode
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
                                                                    id="IDS_BIOSAMPLETYPE"
                                                                    message="SampleType"
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
                                this.state.openAcceptRejectRequestBasedTransfer ?
                                    <AcceptRejectRequestBasedTransfer
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
        const { lstChildBioRequestbasedTransfer, selectedRecord } = this.state;

        // Always filter from full list
        let dataSource = lstChildBioRequestbasedTransfer || [];

        // Reapply selection from addedChildBioRequestBasedTransfer
        const addedChildBioRequestBasedTransfer = selectedRecord?.addedChildBioRequestBasedTransfer || [];
        const selectedMap = new Map(addedChildBioRequestBasedTransfer.map(item => [item.nserialno, item]));

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
            lstChildBioRequestbasedTransfer: dataSource, // keep selection persisted
            dataResult: processed.data,
            total: processed.total,
            dataState: event.dataState,
            selectedRecord: {
                ...selectedRecord,
                addSelectAll: allSelected,
                addedChildBioRequestBasedTransfer: Array.from(selectedMap.values())
            }
        });
    };
    // dataStateChange = (event) => {
    //     let updatedList = [];
    //     let selectedRecord = this.state.selectedRecord;
    //     if (event.dataState && event.dataState.filter === null) {
    //         let addedChildBioRequestBasedTransfer = selectedRecord.addedChildBioRequestBasedTransfer || this.state.lstChildBioRequestbasedTransfer || [];
    //         addedChildBioRequestBasedTransfer.forEach(x => {
    //             const exists = this.state.addedChildBioRequestBasedTransfer.some(
    //                 item => item.nserialno === x.nserialno
    //             );
    //             if (!exists) {
    //                 updatedList.push(x);
    //             }
    //         });
    //     } else {
    //         updatedList = this.state.lstChildBioRequestbasedTransfer || []
    //     }
    //     selectedRecord['addSelectAll'] = event.dataState && event.dataState.filter === null ?
    //         this.validateCheckAll(updatedList) :
    //         this.validateCheckAll(process(updatedList || [], event.dataState).data);
    //     this.setState({
    //         dataResult: process(this.state.lstChildBioRequestbasedTransfer || [], event.dataState),
    //         lstChildBioRequestbasedTransfer: updatedList,
    //         dataState: event.dataState,
    //         selectedRecord
    //     });
    // }

    headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        const eventData = event.target.props.data.hasOwnProperty('data') ? event.target.props.data.data || [] : event.target.props.data || [];
        let lstChildBioRequestbasedTransfer = this.state?.dataResult || [];
        let addedChildBioRequestBasedTransfer = this.state.selectedRecord?.addedChildBioRequestBasedTransfer || [];
        let selectedRecord = this.state.selectedRecord;
        if (checked) {
            const data = lstChildBioRequestbasedTransfer.map(item => {
                const matchingData = eventData.find(dataItem => dataItem.nserialno === item.nserialno);
                if (matchingData) {
                    const existingIndex = addedChildBioRequestBasedTransfer.findIndex(
                        x => x.nserialno === item.nserialno
                    );

                    if (existingIndex === -1) {
                        const newItem = {
                            ...item,
                            selected: true,
                        };
                        addedChildBioRequestBasedTransfer.push(newItem);
                    }
                    return { ...item, selected: true };
                } else {
                    return { ...item, selected: item.selected ? true : false };
                }
            });
            selectedRecord['addedChildBioRequestBasedTransfer'] = addedChildBioRequestBasedTransfer;
            selectedRecord['addSelectAll'] = checked;
            this.setState({
                selectedRecord,
                dataResult: data
            });
            this.props.childDataChange(selectedRecord);
        } else {
            let addedChildBioRequestBasedTransfer = this.state.selectedRecord?.addedChildBioRequestBasedTransfer || [];
            const data = lstChildBioRequestbasedTransfer.map(x => {
                const matchedItem = eventData.find(item => x.nserialno === item.nserialno);
                if (matchedItem) {
                    addedChildBioRequestBasedTransfer = addedChildBioRequestBasedTransfer.filter(item1 => item1.nserialno !== matchedItem.nserialno);
                    matchedItem.selected = false;
                    return matchedItem;
                }
                return x;
            });
            selectedRecord['addedChildBioRequestBasedTransfer'] = addedChildBioRequestBasedTransfer;
            selectedRecord['addSelectAll'] = checked;
            this.setState({
                selectedRecord,
                dataResult: data

                //lstChildBioRequestbasedTransfer: data
            });
            this.props.childDataChange(selectedRecord);
        }
    }

    selectionChange = (event) => {
        let addedChildBioRequestBasedTransfer = this.state.selectedRecord?.addedChildBioRequestBasedTransfer || [];
        let selectedRecord = this.state.selectedRecord;
        const lstChildBioRequestbasedTransfer = this.state?.dataResult.map(item => {
            if (item.nserialno === event.dataItem.nserialno) {
                item.selected = !event.dataItem.selected;
                if (item.selected) {
                    const newItem = JSON.parse(JSON.stringify(item));
                    delete newItem['selected']
                    newItem.selected = true;
                    addedChildBioRequestBasedTransfer.push(newItem);
                } else {
                    addedChildBioRequestBasedTransfer = addedChildBioRequestBasedTransfer.filter(item1 => item1.nserialno !== item.nserialno)
                }
            }
            return item;
        })
        selectedRecord['addedChildBioRequestBasedTransfer'] = addedChildBioRequestBasedTransfer;
        selectedRecord['addSelectAll'] = this.validateCheckAll(process(lstChildBioRequestbasedTransfer || [], this.state.dataState).data);
        this.setState({
            selectedRecord,
            dataResult: lstChildBioRequestbasedTransfer
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

    addChildRequestBasedTransfer = (addChildID, operation, screenName) => {
        if (operation === "create") {
            let selectedBioRequestBasedTransfer = this.props?.selectedBioRequestBasedTransfer;
            if (selectedBioRequestBasedTransfer) {
                this.setState({ loading: true });
                rsapi().post("biorequestbasedtransfer/findStatusRequestBasedtTransfer", {
                    'nbiorequestbasedtransfercode': selectedBioRequestBasedTransfer?.nbiorequestbasedtransfercode ?? -1,
                    'userinfo': this.props.Login.userInfo
                })
                    .then(response => {
                        if (response.data === transactionStatus.DRAFT || response.data === transactionStatus.VALIDATION) {
                            const getChildRequestBasedRecord = rsapi().post("biorequestbasedtransfer/getChildRequestBasedRecord",
                                {
                                    'nbiorequestbasedtransfercode': selectedBioRequestBasedTransfer?.nbiorequestbasedtransfercode ?? -1,
                                    'userinfo': this.props.Login.userInfo
                                });
                            const getSiteBasedOnTransferType = rsapi().post("biorequestbasedtransfer/getTransferType", {
                                'userinfo': this.props.Login.userInfo
                            });
                            const getStorageType = rsapi().post("biorequestbasedtransfer/getStorageType", { 'userinfo': this.props.Login.userInfo });
                            let urlArray = [getChildRequestBasedRecord, getSiteBasedOnTransferType, getStorageType];
                            Axios.all(urlArray)
                                .then(response => {
                                    let masterData = {};
                                    masterData = { ...this.props.Login.masterData, ...response[2].data, ...response?.[0]?.data?.lstRequestFormNo?.body?.lstRequestFormNo };
                                    let selectedChildRecord = this.state.selectedChildRecord;
                                    let selectedBioRequestBasedTransfer = { ...this.props.Login.masterData?.selectedBioRequestBasedTransfer }
                                    selectedChildRecord['dtransferdate'] = rearrangeDateFormat(this.props.Login.userInfo,
                                        selectedBioRequestBasedTransfer?.stransferdate);
                                    const ntransfertypecode = response?.[0]?.data?.ntransfertypecode;
                                    selectedChildRecord['originsiteorthirdparty'] = response?.[0]?.data?.selectedOrignSiteorThirdParty
                                    selectedChildRecord['ntransfertypecode'] = response?.[1]?.data.lstTransferTypeCombo.find(option => option.value === ntransfertypecode) || [];

                                    masterData['lstRequestFormNo'] = response?.[0]?.data?.lstRequestFormNo?.body?.lstRequestFormNo
                                    const updateInfo = {
                                        typeName: DEFAULT_RETURN,
                                        data: {
                                            masterData, screenName, operation, openChildModal: true,
                                            openChildRequestBasedTransfer: true,
                                            selectedChildRecord
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

    acceptRejectRequestBasedTransfer = (acceptRejectID, operation, screenName) => {
        let selectedBioRequestBasedTransfer = this.props?.selectedBioRequestBasedTransfer;
        if (selectedBioRequestBasedTransfer) {
            this.setState({ loading: true });
            rsapi().post("biorequestbasedtransfer/findStatusRequestBasedtTransfer", {
                'nbiorequestbasedtransfercode': selectedBioRequestBasedTransfer?.nbiorequestbasedtransfercode ?? -1,
                'userinfo': this.props.Login.userInfo
            })
                .then(response => {
                    if (response.data === transactionStatus.DRAFT) {
                        let selectedRecord = this.state.selectedRecord;
                        if (selectedRecord && selectedRecord.addedChildBioRequestBasedTransfer && selectedRecord.addedChildBioRequestBasedTransfer.length > 0) {
                            const getSampleConditionStatus = rsapi().post("biorequestbasedtransfer/getSampleConditionStatus", { 'userinfo': this.props.Login.userInfo });
                            const getReason = rsapi().post("biorequestbasedtransfer/getReason", { 'userinfo': this.props.Login.userInfo });
                            let urlArray = [getSampleConditionStatus, getReason];
                            Axios.all(urlArray)
                                .then(response => {
                                    let lstSampleCondition = response[0].data?.lstSampleCondition;
                                    let lstReason = response[1].data?.lstReason;

                                    const updateInfo = {
                                        typeName: DEFAULT_RETURN,
                                        data: {
                                            lstSampleCondition, lstReason, openAcceptRejectRequestBasedTransfer: true, openModalShow: true,
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
                    } else {
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
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
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLESTVALIDATE" }));
            this.setState({ loading: false });
        }
    }


    onUndoDisposeEsignCheck = (undoID, operation, screenName) => {
        let selectedRecord = this.state.selectedRecord;
        let selectedBioRequestBasedTransfer = this.props?.selectedBioRequestBasedTransfer;

        if (selectedBioRequestBasedTransfer?.ntransactionstatus === transactionStatus.VALIDATION) {
            if (selectedRecord?.addedChildBioRequestBasedTransfer && selectedRecord?.addedChildBioRequestBasedTransfer.length > 0) {
                let dataState = this.state.dataState;
                // let addedChildBioRequestBasedTransfer = selectedRecord?.addedChildBioRequestBasedTransfer.slice(dataState.skip, dataState.skip + dataState.take);
                let addedChildBioRequestBasedTransfer = selectedRecord?.addedChildBioRequestBasedTransfer;
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["nbiorequestbasedtransferdetailcode"] = addedChildBioRequestBasedTransfer.map(x => x.nbiorequestbasedtransferdetailcode).join(',');
                inputData["nbiorequestbasedtransfercode"] = addedChildBioRequestBasedTransfer[0].nbiorequestbasedtransfercode;

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
        rsapi().post("biorequestbasedtransfer/undoDisposeSamples", {
            ...inputData
        })
            .then(response => {
                let lstChildBioRequestbasedTransfer = response.data?.lstChildBioRequestbasedTransfer;
                let selectedRecord = this.state.selectedRecord;
                // selectedRecord['addSelectAll'] = false;
                selectedRecord['addedSampleReceivingDetails'] = [];
                // selectedRecord['addedChildBioFormAcceptance'] = [];
                sortData(lstChildBioRequestbasedTransfer);

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        lstChildBioRequestbasedTransfer, selectedRecord, loadEsignStateHandle: false, openModalShow: false, openChildModal: false
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




    onDisposeEsignCheck = (disposeID, operation, screenName) => {

        let selectedBioRequestBasedTransfer = this.props.selectedBioRequestBasedTransfer;
        let selectedRecord = this.state.selectedRecord;

        if (selectedBioRequestBasedTransfer && selectedBioRequestBasedTransfer.ntransactionstatus === transactionStatus.VALIDATION) {
            if (selectedRecord?.addedChildBioRequestBasedTransfer && selectedRecord?.addedChildBioRequestBasedTransfer.length > 0) {

                const childRecordStatusCheck = selectedRecord?.addedChildBioRequestBasedTransfer?.some(item => item.ntransferstatus === 116);

                if (childRecordStatusCheck) {
                    return toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTVALIDATEDSAMPLERECORDDISPOSE" }));
                }

                let dataState = this.state.dataState;
                // let addedChildBioRequestBasedTransfer = selectedRecord?.addedChildBioRequestBasedTransfer.slice(dataState.skip, dataState.skip + dataState.take);
                let addedChildBioRequestBasedTransfer = selectedRecord?.addedChildBioRequestBasedTransfer;
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["nbiorequestbasedtransferdetailcode"] = addedChildBioRequestBasedTransfer.map(x => x.nbiorequestbasedtransferdetailcode).join(',');
                inputData["nbiorequestbasedtransfercode"] = addedChildBioRequestBasedTransfer[0].nbiorequestbasedtransfercode;

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


    disposeSamples = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("biorequestbasedtransfer/disposeSamples", {
            ...inputData
        })
            .then(response => {
                let lstChildBioRequestbasedTransfer = response.data?.lstChildBioRequestbasedTransfer;
                let selectedRecord = this.state.selectedRecord;
                //selectedRecord['addSelectAll'] = false;
                selectedRecord['addedSampleReceivingDetails'] = [];
                //selectedRecord['addedChildBioRequestBasedTransfer'] = [];
                sortData(lstChildBioRequestbasedTransfer);

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        lstChildBioRequestbasedTransfer, selectedRecord, loadEsignStateHandle: false, openModalShow: false, openChildModal: false
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
        let selectedBioRequestBasedTransfer = this.props.selectedBioRequestBasedTransfer;
        let selectedRecord = this.state.selectedRecord;
        if (selectedBioRequestBasedTransfer && selectedBioRequestBasedTransfer.ntransactionstatus === transactionStatus.DRAFT
            || selectedBioRequestBasedTransfer.ntransactionstatus === transactionStatus.VALIDATION
        ) {
            if (selectedRecord?.addedChildBioRequestBasedTransfer && selectedRecord?.addedChildBioRequestBasedTransfer.length > 0) {
                let dataState = this.state.dataState;
                // let addedChildBioRequestBasedTransfer = selectedRecord?.addedChildBioRequestBasedTransfer.slice(dataState.skip, dataState.skip + dataState.take);
                let addedChildBioRequestBasedTransfer = selectedRecord?.addedChildBioRequestBasedTransfer;
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["nbiorequestbasedtransferdetailcode"] = addedChildBioRequestBasedTransfer.map(x => x.nbiorequestbasedtransferdetailcode).join(',');
                inputData["nbiorequestbasedtransfercode"] = addedChildBioRequestBasedTransfer[0].nbiorequestbasedtransfercode;

                let inputParam = {
                    inputData: inputData,
                    screenName: "IDS_TRANSFERFORM",
                    operation: "delete"
                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteID)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            operation, loadEsignStateHandle: true, openChildModal: true, screenData: { inputParam }, screenName: "IDS_TRANSFERFORM"
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.deleteRequestBasedTransferDetails(inputData);
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

    deleteRequestBasedTransferDetails = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("biorequestbasedtransfer/deleteChildRequestBasedTransfer", {
            ...inputData
        })
            .then(response => {
                let lstChildBioRequestbasedTransfer = response.data?.lstChildBioRequestbasedTransfer;
                let selectedRecord = this.state.selectedRecord;
                sortData(lstChildBioRequestbasedTransfer);
                selectedRecord['addedChildBioRequestBasedTransfer'] = [];
                selectedRecord['addSelectAll'] = false;
                let masterData = { ...this.props.Login.masterData, ...response.data }

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData, lstChildBioRequestbasedTransfer, selectedRecord, loadEsignStateHandle: false, openModalShow: false, openChildModal: false
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
        if (this.props.Login.loadEsignStateHandle && this.props.Login.openAcceptRejectRequestBasedTransfer) {
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
        const mandatoryFields = (this.state.openAcceptRejectRequestBasedTransfer ? this.state.loadEsignStateHandle : this.props.Login.loadEsignStateHandle) ?
            [
                { "idsName": "IDS_PASSWORD", "dataField": "esignpassword", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_REASON", "dataField": "esignreason", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "idsName": "IDS_COMMENTS", "dataField": "esigncomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            ]
            :
            this.props.Login.openChildRequestBasedTransfer ? this.props.Login.operation === 'create' ?
                [
                    { "idsName": "IDS_REQUESTTYPE", "dataField": "ntransfertypecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
                    { "idsName": "IDS_TRANSFERDATE", "dataField": "dtransferdate", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "datepicker" },
                    { "idsName": "IDS_BIOPROJECT", "dataField": "nbioprojectcode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
                ]
                : []
                : this.state.openAcceptRejectRequestBasedTransfer ?
                    [
                        { "idsName": "IDS_SAMPLECONDITION", "dataField": "nsamplecondition", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                        { "idsName": "IDS_REASON", "dataField": "nreasoncode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
                    ] : [];

        onSaveMandatoryValidation(this.state.selectedChildRecord, mandatoryFields, (this.state.openAcceptRejectRequestBasedTransfer ? this.state.loadEsignStateHandle : this.props.Login.loadEsignStateHandle) ? this.validateChildEsign :
            this.props.Login.openChildRequestBasedTransfer ? this.onSaveClick : this.state.openAcceptRejectRequestBasedTransfer ?
                this.onModalSaveEsignCheck
                : "", (this.state.openAcceptRejectRequestBasedTransfer ? this.state.loadEsignStateHandle : this.props.Login.loadEsignStateHandle), saveType);
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
        this.validateChildEsignforRequestBasedTransfer(inputParam, modalName);
    }

    validateChildEsignforRequestBasedTransfer = (inputParam) => {
        rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {
                    if (inputParam["screenData"]["inputParam"]["operation"] === "accept"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_SAMPLECONDITION") {
                        this.onModalSave(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "delete"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_TRANSFERFORM") {
                        this.deleteRequestBasedTransferDetails(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "dispose"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_TRANSFERFORM") {
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

    validateReturnQuantities = (sacceptedvolume, convertKey) => {

        //const convertKey = parseInt(userInfo[90]) || ".";
        return sacceptedvolume = sacceptedvolume.replace(convertKey, '.');
        //return sacceptedvolume;
    }


    onSaveClick = (saveType) => {
        let selectedChildRecord = this.state.selectedChildRecord;
        let selectedRecord = this.state.selectedRecord;
        let inputData = [];
        let operation = this.props.Login.operation;
        if (operation === "create") {
            //const sacceptedvolume = this.validateReturnQuantities(selectedChildRecord.sacceptedvolume, this.props.Login.settings[90])

            inputData["biorequestbasedtransfer"] = {
                "sformnumber": this.props.selectedBioRequestBasedTransfer?.sformnumber || '',
                "stransferdate": selectedRecord.dtransferdate && selectedRecord.dtransferdate !== null ?
                    convertDateTimetoStringDBFormat(selectedRecord.dtransferdate, this.props.Login.userInfo) : '',
                "nbioprojectcode": selectedChildRecord?.nbioprojectcode?.value || -1,
                "nproductcode": selectedChildRecord?.nproductcode?.value || -1,
                "sremarks": selectedChildRecord?.sremarks || '',
                "nstoragetypecode": selectedChildRecord?.nstoragetypecode?.value || -1,
                "sstoragetypename": selectedChildRecord?.nstoragetypecode?.label || '',
                "srepositoryid": selectedChildRecord.addedSampleReceivingDetails &&
                    selectedChildRecord.addedSampleReceivingDetails.map(item => item.srepositoryid).join(', ') || '',
                "ssamplestoragetransactioncode":
                    selectedChildRecord.addedSampleReceivingDetails
                        ?.map(item => item.nsamplestoragetransactioncode)
                        .join(",") || [],
                'sbioparentsamplecode': selectedChildRecord.sbioparentsamplecode?.value || "",
            }
            inputData["necatrequestreqapprovalcode"] = selectedChildRecord?.necatrequestreqapprovalcode?.value || -1;
            inputData["filterSelectedSamples"] = selectedChildRecord.addedSampleReceivingDetails && selectedChildRecord.addedSampleReceivingDetails || [];
            inputData["nbiorequestbasedtransfercode"] = this.props?.selectedBioRequestBasedTransfer?.nbiorequestbasedtransfercode;
            inputData["userinfo"] = this.props.Login.userInfo;
            inputData["selectedsamplecount"] = selectedChildRecord.addedSampleReceivingDetails
                ? selectedChildRecord.addedSampleReceivingDetails.length
                : 0;


            if (selectedChildRecord.addedSampleReceivingDetails && selectedChildRecord.addedSampleReceivingDetails.length > 0) {
                // let total_accepted_volume = selectedChildRecord.addedSampleReceivingDetails.reduce((sum, item) => {
                //     const qty = Number(item.sqty) || 0; return sum + qty;
                // }, 0);

                //inputData["total_accepted_volume"] = String(total_accepted_volume) || -1;

                //total_accepted_volume = (Number(total_accepted_volume) || 0) + (Number(selectedChildRecord.total_accepted_volume) || 0);
                //total_accepted_volume = (Number(selectedChildRecord.total_accepted_volume) || 0) - (Number(total_accepted_volume) || 0);

                // if (Number(sacceptedvolume) <= Number(total_accepted_volume)) {
                //     toast.warn(this.props.intl.formatMessage({ id: "IDS_ADDEDQUANTITYISHIGH" }));
                //     this.setState({ loading: false });
                // } else {
                this.setState({ loading: true });
                rsapi().post("biorequestbasedtransfer/createChildBioRequestBasedTransfer", { ...inputData })
                    .then(response => {

                        let masterData = { ...this.props.Login.masterData };
                        let responseData = response.data;
                        let lstBioRequestBasedTransfer = this.props.Login.masterData?.lstBioRequestBasedTransfer;
                        let searchedData = this.props.Login.masterData?.searchedData;

                        const index = lstBioRequestBasedTransfer.findIndex(item => item && item.nbiorequestbasedtransfercode === responseData.selectedBioRequestBasedTransfer.nbiorequestbasedtransfercode);
                        const searchedDataIndex = searchedData ? searchedData.findIndex(item => item && item.nbiorequestbasedtransfercode === response.data.selectedBioRequestBasedTransfer.nbiorequestbasedtransfercode) : -1;

                        if (index !== -1) {
                            lstBioRequestBasedTransfer[index] = responseData.selectedBioRequestBasedTransfer;
                        }
                        if (searchedDataIndex !== -1) {
                            searchedData[searchedDataIndex] = response.data.selectedBioRequestBasedTransfer;
                        }
                        masterData['lstBioRequestBasedTransfer'] = lstBioRequestBasedTransfer;
                        masterData['searchedData'] = searchedData;

                        masterData = { ...masterData, ...responseData };

                        let openChildModal = false;
                        let openChildRequestBasedTransfer = false;
                        if (saveType === 2) {
                            openChildModal = true;
                            openChildRequestBasedTransfer = true;
                            selectedChildRecord['lstParentSample'] = [];
                            selectedChildRecord['lstSampleType'] = [];
                            selectedChildRecord['nbioprojectcode'] = '';
                            selectedChildRecord['nbioparentsamplecode'] = '';
                            selectedChildRecord['nstoragetypecode'] = '';
                            selectedChildRecord['nproductcode'] = '';
                            selectedChildRecord['sbioparentsamplecode'] = '';
                            selectedChildRecord['saccminvolume'] = '';
                            selectedChildRecord['naccnoofsamples'] = '';
                            selectedChildRecord['naccnoofsamplesremaining'] = '';
                            selectedChildRecord['lstGetSampleReceivingDetails'] = [];
                            selectedChildRecord['addSelectAll'] = false;
                            selectedChildRecord['addedSampleReceivingDetails'] = [];
                        } else {
                            selectedChildRecord = {};
                        }
                        selectedRecord['addSelectAll'] = false;
                        selectedRecord['addedChildBioRequestBasedTransfer'] = [];
                        const updateInfo = {
                            typeName: DEFAULT_RETURN,
                            data: {
                                masterData, openChildModal, openChildRequestBasedTransfer, selectedChildRecord, selectedRecord: { ...selectedChildRecord, selectedRecord }
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

                // }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLESTOADD" }));
                this.setState({ loading: false });
            }
        }
    }

    closeChildModal = () => {
        let openChildModal = this.props.Login.openChildModal;
        let selectedChildRecord = this.props.Login.selectedChildRecord;
        let openChildRequestBasedTransfer = this.props.Login.openChildRequestBasedTransfer;
        let viewRequestBasedTransferDetails = this.props.Login.viewRequestBasedTransferDetails;
        let loadEsignStateHandle = this.props.Login.loadEsignStateHandle;

        if (this.props.Login.loadEsignStateHandle) {
            openChildModal = false;
            selectedChildRecord = {};
            openChildRequestBasedTransfer = false;
            viewRequestBasedTransferDetails = false;
            loadEsignStateHandle = false;
        } else {
            openChildModal = false;
            selectedChildRecord = {};
            openChildRequestBasedTransfer = false;
            viewRequestBasedTransferDetails = false;
            loadEsignStateHandle = false;
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                ...this.state.data,
                openChildModal,
                selectedChildRecord,
                selectedId: null,
                openChildRequestBasedTransfer,
                viewRequestBasedTransferDetails,
                loadEsignStateHandle,
                operation: undefined,
            }
        }
        this.props.updateStore(updateInfo);

    }

    closeModalShow = () => {
        let openAcceptRejectRequestBasedTransfer = this.state.openAcceptRejectRequestBasedTransfer;
        let openModalShow = this.state.openModalShow;
        let loadEsignStateHandle = this.state.loadEsignStateHandle;
        let selectedChildRecord = this.state.selectedChildRecord;
        let screenName = this.props.Login.screenName;
        let operation = this.props.Login.operation;

        if (this.props.Login.loadEsignStateHandle) {
            loadEsignStateHandle = false;
            openModalShow = (screenName === "IDS_SAMPLECONDITION" && operation === "accept") ? true : false;
            openAcceptRejectRequestBasedTransfer = (screenName === "IDS_SAMPLECONDITION" && operation === "accept") ? true : false;
        } else {
            openAcceptRejectRequestBasedTransfer = false;
            openModalShow = false;
            selectedChildRecord = {};
        }


        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openAcceptRejectRequestBasedTransfer, openModalShow, selectedChildRecord, loadEsignStateHandle
            }
        }
        this.props.updateStore(updateInfo);
    }

    onModalSaveEsignCheck = () => {
        let selectedChildRecord = this.state.selectedChildRecord;
        let selectedRecord = this.state.selectedRecord;
        let dataState = this.state.dataState;
        // let addedChildBioRequestBasedTransfer = selectedRecord?.addedChildBioRequestBasedTransfer.slice(dataState.skip, dataState.skip + dataState.take);
        let addedChildBioRequestBasedTransfer = selectedRecord?.addedChildBioRequestBasedTransfer;
        let inputData = {
            'nbiorequestbasedtransfercode': addedChildBioRequestBasedTransfer[0].nbiorequestbasedtransfercode,
            'nbiorequestbasedtransferdetailcode': addedChildBioRequestBasedTransfer.map(x => x.nbiorequestbasedtransferdetailcode).join(',') || '-1',
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
        rsapi().post("biorequestbasedtransfer/updateSampleCondition", { ...inputData })
            .then(response => {
                let lstChildBioRequestbasedTransfer = response.data?.lstChildBioRequestbasedTransfer;
                masterData['lstChildBioRequestbasedTransfer'] = lstChildBioRequestbasedTransfer;
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        lstChildBioRequestbasedTransfer, openAcceptRejectRequestBasedTransfer: false, openModalShow: false, selectedChildRecord: {},
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

    viewRequestBasedTransferDetails = (paramData) => {
        let selectedViewRecord = paramData.treeView;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openChildModal: true,
                viewRequestBasedTransferDetails: true,
                selectedViewRecord, operation: 'view', screenName: 'IDS_SAMPLESDETAILS'
            }
        }
        this.props.updateStore(updateInfo);
    }

}

export default connect(mapStateToProps, { updateStore })(injectIntl(OuterGridRequestBasedTransfer));