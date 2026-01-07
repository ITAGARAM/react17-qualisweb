import { faCheck, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { process } from '@progress/kendo-data-query';
import Axios from 'axios';
import React from 'react';
import { Card, Col, Nav, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { updateStore } from '../../../actions';
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
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from '../../../actions/LoginTypes';
import AddDisposalSampleApproval from './AddDisposalSampleApproval';
import { faWarehouse } from '@fortawesome/free-solid-svg-icons';
import AcceptRejectDisposeSample from './AcceptRejectDisposeSample';
import StorageStructureViewDispose from './StorageStructureViewDispose';


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class OuterGridDisposeForm extends React.Component {
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
            lstChildBioDisposeForm: props.lstChildBioDisposeForm,
            lstBioDisposeForm: props.lstBioDisposeForm,
            selectedBioDisposeForm: props.selectedBioDisposeForm,
            selectedChildRecord: {},
            selectedViewRecord: {},
            data: props.lstChildBioDisposeForm,
            shouldRender: true,
            treeDataView: [],

        }
    }


    componentDidUpdate(prevProps, prevState) {
        const updates = {};

        const isChanged = (curr, prev) => JSON.stringify(curr) !== JSON.stringify(prev);

        if (isChanged(prevState?.dataResult, this.state?.dataResult)) {
            const addedChilddisposalsamplesapproval = (this.state?.dataResult || [])
                .filter(dr =>
                    (this.state?.lstChildBioDisposeForm || []).some(lc => lc?.nserialno === dr?.nserialno) &&
                    dr?.selected === true
                )
                .map(item => ({ ...item }));

            // Added addSelectAll by Gowtham on 11 nov 2025 jira.id:BGSI-179
            // updates.selectedRecord = {
            //     ...this.state?.selectedRecord,
            //     addedChilddisposalsamplesapproval,
            //     addSelectAll: this.validateCheckAll(process(this.state?.dataResult || [], this.state?.dataState).data)
            // };
            updates.selectedRecord = {
                ...this.state?.selectedRecord,
                addedChilddisposalsamplesapproval
            };
        }

        const propsToStateMap = {
            selectedRecord: 'selectedRecord',
            selectedChildRecord: 'selectedChildRecord',
            selectedViewRecord: 'selectedViewRecord',
            loadEsignStateHandle: 'loadEsignStateHandle',
            openModalShow: 'openModalShow',
            openAcceptRejectDisposeSamples: 'openAcceptRejectDisposeSamples',
            lstSampleCondition: 'lstSampleCondition',
            lstReason: 'lstReason',
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
            updates.dataResult = (this.props?.Login?.masterData?.lstChildBioDisposeForm || []).slice(updates.dataState.skip, updates.dataState.skip + updates.dataState.take);
            updates.lstChildBioDisposeForm = this.props?.Login?.masterData?.lstChildBioDisposeForm;
        }

        // --- Handle masterData.lstChildBioDisposeForm ---
        if (isChanged(this.props?.Login?.masterData?.lstChildBioDisposeForm, prevProps?.Login?.masterData?.lstChildBioDisposeForm)) {
            const processed = this.props?.Login?.masterData?.lstChildBioDisposeForm && process(this.props?.Login?.masterData?.lstChildBioDisposeForm, this.props?.dataState);
            updates.lstChildBioDisposeForm = this.props?.Login?.masterData?.lstChildBioDisposeForm;
            updates.dataResult = processed ? processed.data : [];
            updates.total = processed ? processed.total : 0;
            updates.dataState = this.props?.dataState || {};
        }

        // --- Handle lstChildBioDisposeForm ---
        if (isChanged(this.props?.Login?.lstChildBioDisposeForm, prevProps?.Login?.lstChildBioDisposeForm)) {
            // const { dataState, selectedRecord: prevSelected = {} } = this.state;
            let dataState = this.state?.dataState || {};
            const prevSelected = this.state?.selectedRecord || {};
            const newList = this.props?.Login?.lstChildBioDisposeForm || [];

            if(newList.length <= dataState.skip){
                dataState = {
                    skip: 0,
                    take: this.props.settings ? parseInt(this.props.settings[14]) : 10,
                };
            }

            const addedMap = new Map((prevSelected?.addedChilddisposalsamplesapproval || []).map(item => [item?.nserialno, item]));

            const updatedlstChildBioDisposeForm = newList.map(item => {
                if (addedMap.has(item?.nserialno)) {
                    const updated = { ...item, selected: true };
                    addedMap.set(item?.nserialno, updated);
                    return updated;
                }
                return { ...item };
            });

            const addedChilddisposalsamplesapproval = Array.from(addedMap.values());
            const processed = process(updatedlstChildBioDisposeForm, dataState);
            updates.lstChildBioDisposeForm = updatedlstChildBioDisposeForm;
            updates.dataResult = processed ? processed.data : [];
            updates.total = processed ? processed.total : 0;
            updates.dataState = dataState;
            updates.selectedRecord = { ...prevSelected, addedChilddisposalsamplesapproval
                // , addSelectAll: this.validateCheckAll(process(updates.dataResult || [], updates.dataState).data) 
            };
        }

        // Added addSelectAll by Gowtham on 11 nov 2025 jira.id:BGSI-179
        // if(isChanged(this.state.selectedRecord?.addSelectAll, prevState?.selectedRecord?.addSelectAll) && this.state.dataResult?.length > 0) {
        //     updates.dataResult = this.state.dataResult.map(item => { return { ...item, selected: false } });
        // }
        if(this.props.Login.selectedViewRecord !== prevProps.Login.selectedViewRecord){
            updates.selectedViewRecord = this.props.Login.selectedViewRecord ;
        }

        if (Object.keys(updates).length > 0) {
            this.setState(updates);
        }
    }


    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.Login.openChildModal && (this.props.Login.openChildDisposeSample || this.state.openModalShow) && nextState.isInitialRender === false &&
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
                { "idsName": "IDS_PARENTSAMPLECODE", "dataField": "sparentsamplecode", "width": "150px" },
                { "idsName": "IDS_REPOSITORYID", "dataField": "srepositoryid", "width": "100px" },
                { "idsName": "IDS_LOCATIONCODE", "dataField": "slocationcode", "width": "100px" },
                { "idsName": "IDS_BIOSAMPLETYPE", "dataField": "sproductname", "width": "130px" },
                { "idsName": "IDS_VOLUMEµL", "dataField": "svolume", "width": "100px" },
                { "idsName": "IDS_SAMPLECONDITION", "dataField": "ssamplecondition", "width": "150px" },
                { "idsName": "IDS_SAMPLESTATUS", "dataField": "ssamplestatus", "width": "150px" },
            ];

        const addChildID = this.props.addChildID;
        const sampleValidationID = this.props.sampleValidationID;
        const deleteID = this.props.deleteChildID;
        const genearateLocationID = this.props.generateLocationID;

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
                                        hidden={this.props.userRoleControlRights.indexOf(sampleValidationID) === -1}
                                        onClick={() => this.acceptRejectRequestBasedTransfer(sampleValidationID, 'accept', 'IDS_SAMPLECONDITION')}>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </Nav.Link>
                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_SAMPLEDELETE" })} data-place="left"
                                        hidden={this.props.userRoleControlRights.indexOf(deleteID) === -1}
                                        onClick={() => this.handleDelete(deleteID, 'delete', 'IDS_DISPOSESAMPLE')}>
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </Nav.Link>
                                    <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_STORE" })} data-place="left"
                                        hidden={this.props.userRoleControlRights.indexOf(genearateLocationID) === -1}
                                        onClick={() => this.storeSample(genearateLocationID, 'dispose', 'IDS_STORESAMPLE')}>
                                        <FontAwesomeIcon icon={faWarehouse} />
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
                            isActionRequired={false}
                            removeNotRequired={true}
                            methodUrl={"ChildRequestBasedTransfer"}
                            controlMap={this.props.controlMap}
                            userRoleControlRights={this.props.userRoleControlRights}
                            fetchRecord={this.viewRequestBasedTransferDetails}
                            gridHeight={this.props.gridHeight}
                        />
                    </Col>
                </Row>

                {(this.props.Login.openChildModal) ?
                    <SlideOutModal
                        show={this.props.Login.openChildModal}
                        hideSave={this.props.Login.operation === "view" ? true : false}
                        showSaveContinue={this.props.Login.loadEsignStateHandle ? false : true}
                        size={['delete', 'dispose', 'view', "", 'store'].includes(this.props.Login.operation) ? 'lg' : 'xl'}
                        //size={this.props.Login.operation === 'view' ? 'lg' : this.props.Login.operation === 'delete' ? 'lg' : this.props.Login.operation === 'dispose' ? 'lg' : 'xl'}
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
                            : this.props.Login.openChildDisposeSample ?
                                <AddDisposalSampleApproval
                                    controlMap={this.props.controlMap}
                                    userRoleControlRights={this.props.userRoleControlRights}
                                    operation={this.props.Login.operation}
                                    lstDisposalBatchTypeCombo={this.props.Login?.masterData?.lstDisposalBatchTypeCombo || []}
                                    childDataChange={this.subChildDataChange}
                                    selectedRecord={this.state.selectedChildRecord || {}}
                                    isChildSlideOut={true}

                                /> : this.props.Login.openStoreSample ?

                                    <StorageStructureViewDispose
                                        id="samplestoragelocation"
                                        name="samplestoragelocation"
                                        treeDataView={this.state?.treeDataView || []}
                                        freezerData={this.props.Login?.masterData?.freezerList || []}
                                        expandIcons={true}
                                        selectField={'active-node'}
                                        onFreezerChange={(updatedRecord) => this.setState({ selectedFreezerRecord: updatedRecord, shouldRender: false })}
                                        onTreeDataChange={(newTreeData) => this.setState({ treeDataView: newTreeData, shouldRender: false })}
                                    />
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
                                /> : this.state.openAcceptRejectDisposeSamples ?
                                    <AcceptRejectDisposeSample
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
        const { lstChildBioDisposeForm, selectedRecord } = this.state;

        // Always filter from full list
        let dataSource = lstChildBioDisposeForm || [];

        // Reapply selection from addedChilddisposalsamplesapproval
        const addedChilddisposalsamplesapproval = selectedRecord?.addedChilddisposalsamplesapproval || [];
        const selectedMap = new Map(addedChilddisposalsamplesapproval.map(item => [item.nserialno, item]));

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
            lstChildBioDisposeForm: dataSource, // keep selection persisted
            dataResult: processed.data,
            total: processed.total,
            dataState: event.dataState,
            selectedRecord: {
                ...selectedRecord,
                addSelectAll: allSelected,
                addedChilddisposalsamplesapproval: Array.from(selectedMap.values())
            }
        });
    };

    headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        const eventData = event.target.props.data.hasOwnProperty('data') ? event.target.props.data.data || [] : event.target.props.data || [];
        let lstChildBioDisposeForm = this.state?.dataResult || [];
        let addedChilddisposalsamplesapproval = this.state.selectedRecord?.addedChilddisposalsamplesapproval || [];
        let selectedRecord = this.state.selectedRecord;
        if (checked) {
            const data = lstChildBioDisposeForm.map(item => {
                const matchingData = eventData.find(dataItem => dataItem.nserialno === item.nserialno);
                if (matchingData) {
                    const existingIndex = addedChilddisposalsamplesapproval.findIndex(
                        x => x.nserialno === item.nserialno
                    );

                    if (existingIndex === -1) {
                        const newItem = {
                            ...item,
                            selected: true,
                        };
                        addedChilddisposalsamplesapproval.push(newItem);
                    }
                    return { ...item, selected: true };
                } else {
                    return { ...item, selected: item.selected ? true : false };
                }
            });
            selectedRecord['addedChilddisposalsamplesapproval'] = addedChilddisposalsamplesapproval;
            selectedRecord['addSelectAll'] = checked;
            this.setState({
                selectedRecord,
                dataResult: data
            });
            this.props.childDataChange(selectedRecord);
        } else {
            let addedChilddisposalsamplesapproval = this.state.selectedRecord?.addedChilddisposalsamplesapproval || [];
            const data = lstChildBioDisposeForm.map(x => {
                const matchedItem = eventData.find(item => x.nserialno === item.nserialno);
                if (matchedItem) {
                    addedChilddisposalsamplesapproval = addedChilddisposalsamplesapproval.filter(item1 => item1.nserialno !== matchedItem.nserialno);
                    matchedItem.selected = false;
                    return matchedItem;
                }
                return x;
            });
            selectedRecord['addedChilddisposalsamplesapproval'] = addedChilddisposalsamplesapproval;
            selectedRecord['addSelectAll'] = checked;
            this.setState({
                selectedRecord,
                dataResult: data

            });
            this.props.childDataChange(selectedRecord);
        }
    }

    selectionChange = (event) => {
        let addedChilddisposalsamplesapproval = this.state.selectedRecord?.addedChilddisposalsamplesapproval || [];
        let selectedRecord = this.state.selectedRecord;
        const lstChildBioDisposeForm = this.state?.dataResult.map(item => {
            if (item.nserialno === event.dataItem.nserialno) {
                item.selected = !event.dataItem.selected;
                if (item.selected) {
                    const newItem = JSON.parse(JSON.stringify(item));
                    delete newItem['selected']
                    newItem.selected = true;
                    addedChilddisposalsamplesapproval.push(newItem);
                } else {
                    addedChilddisposalsamplesapproval = addedChilddisposalsamplesapproval.filter(item1 => item1.nserialno !== item.nserialno)
                }
            }
            return item;
        })
        selectedRecord['addedChilddisposalsamplesapproval'] = addedChilddisposalsamplesapproval;
        selectedRecord['addSelectAll'] = this.validateCheckAll(process(lstChildBioDisposeForm || [], this.state.dataState).data);
        this.setState({
            selectedRecord,
            dataResult: lstChildBioDisposeForm
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
            let selectedBioDisposeForm = this.props?.selectedBioDisposeForm;
            if (selectedBioDisposeForm) {
                this.setState({ loading: true });
                rsapi().post("disposalsamplesapproval/findStatusDisposeSample", {
                    'nbiodisposeformcode': selectedBioDisposeForm?.nbiodisposeformcode ?? -1,
                    'userinfo': this.props.Login.userInfo
                })
                    .then(response => {
                        if (response.data === transactionStatus.DRAFT || response.data === transactionStatus.VALIDATION) {

                            const getDisposalBatchType = rsapi().post("disposalsamplesapproval/getDisposalBatchType", { 'userinfo': this.props.Login.userInfo });

                            let urlArray = [getDisposalBatchType];
                            Axios.all(urlArray)
                                .then(response => {
                                    let masterData = {};
                                    masterData = { ...this.props.Login.masterData, ...response?.[0]?.data };
                                    let selectedChildRecord = this.state.selectedChildRecord;
                                    let selectedBioDisposeForm = { ...this.props.Login.masterData?.selectedBioDisposeForm }
                                    selectedChildRecord['nbiodisposeformcode'] = selectedBioDisposeForm?.nbiodisposeformcode || -1;
                                    const updateInfo = {
                                        typeName: DEFAULT_RETURN,
                                        data: {
                                            masterData, screenName, operation, openChildModal: true,
                                            openChildDisposeSample: true,
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

    storeSample = (genearateLocationID, operation, screenName) => {
        let selectedBioDisposeForm = this.props?.selectedBioDisposeForm;
        if (selectedBioDisposeForm) {
            this.setState({ loading: true });

            let selectedRecord = this.state.selectedRecord;
            if (selectedRecord && selectedRecord.addedChilddisposalsamplesapproval && selectedRecord.addedChilddisposalsamplesapproval.length > 0) {
                const getStorageFreezerData = rsapi().post("disposalsamplesapproval/getStorageFreezerData", {
                    'userinfo': this.props.Login.userInfo,
                    'nbiodisposeformcode': Number(selectedBioDisposeForm.nbiodisposeformcode),
                    'nbiodisposeformdetailscode': selectedRecord.addedChilddisposalsamplesapproval.map(x => x.nbiodisposeformdetailscode).join(',') || '-1',

                });
                let urlArray = [getStorageFreezerData];
                Axios.all(urlArray)
                    .then(response => {

                        let masterData = this.props.Login?.masterData;
                        let lstChildBioDisposeForm = this.props.Login?.masterData.lstChildBioDisposeForm;

                        let openChildModal = false;
                        let openStoreSample = false;

                        if (response[0].data?.freezerList !== undefined) {

                            masterData['freezerList'] = response[0].data?.freezerList || [];

                            openChildModal = true;
                            openStoreSample = true

                        } else {
                            lstChildBioDisposeForm = response[0].data?.lstChildBioDisposeForm;

                            sortData(lstChildBioDisposeForm);

                            openChildModal = false;
                            openStoreSample = false
                        }

                        const updateInfo = {
                            typeName: DEFAULT_RETURN,
                            data: {
                                masterData, lstChildBioDisposeForm, openStoreSample: true, openChildModal: openChildModal, shouldRender: true,
                                selectedChildRecord: {}, ncontrolCode: genearateLocationID, screenName, operation: "", ...this.state.data
                            }
                        }
                        this.props.updateStore(updateInfo);
                        this.setState({ loading: false, treeDataView: [] });
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
                toast.warn(this.props.intl.formatMessage({ id: "IDS_NORECORDSAVAILABLE" }));
                this.setState({ loading: false });
            }
        }

    }

    onStoreEsignCheck = (values) => {

        let selectedBioDisposeForm = this.props.selectedBioDisposeForm;
        let selectedRecord = this.state.selectedRecord;
        let selectedFreezerRecord = this.state.selectedFreezerRecord;
        let masterData = this.props.Login.masterData;


        if (selectedBioDisposeForm && selectedBioDisposeForm.ntransactionstatus === transactionStatus.APPROVED) {
            if (selectedRecord?.addedChilddisposalsamplesapproval && selectedRecord?.addedChilddisposalsamplesapproval.length > 0) {
                let dataState = this.state.dataState;
                // let addedChilddisposalsamplesapproval = selectedRecord?.addedChilddisposalsamplesapproval.slice(dataState.skip, dataState.skip + dataState.take);
                let addedChilddisposalsamplesapproval = selectedRecord?.addedChilddisposalsamplesapproval;
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["nbiodisposeformdetailscode"] = addedChilddisposalsamplesapproval.map(x => x.nbiodisposeformdetailscode).join(',');
                inputData["nbiodisposeformcode"] = Number(addedChilddisposalsamplesapproval[0]?.nbiodisposeformcode || -1);
                inputData["nsamplestoragetransactioncode"] = addedChilddisposalsamplesapproval.map(x => x.nsamplestoragetransactioncode).join(',') || "";
                inputData["nstorageinstrumentcode"] = selectedFreezerRecord?.nstorageinstrumentcode?.item?.nstorageinstrumentcode || -1;
                inputData["nsamplestoragelocationcode"] = selectedFreezerRecord?.nstorageinstrumentcode?.item?.nsamplestoragelocationcode || -1;
                inputData["nsamplestorageversioncode"] = selectedFreezerRecord?.nstorageinstrumentcode?.item?.nsamplestorageversioncode || -1;
                inputData["selectedBioParentSampleCollection"] = masterData?.selectedBioParentSampleCollection;

                const selectedCount = addedChilddisposalsamplesapproval.length || 0;
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
                    if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                        const updateInfo = {
                            typeName: DEFAULT_RETURN,
                            data: {
                                loadEsignStateHandle: true, openChildModal: true, screenData: { inputParam }, operation: "store", screenName: "IDS_STORE"
                            }
                        }
                        this.props.updateStore(updateInfo);
                    } else {
                        this.saveStoreSamples(inputData);
                    }
                } else {
                    toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTANODETOSTORE" }));
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLESTOSTORE" }));
                this.setState({ loading: false });
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTAPPROVERECORD" }));
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

    saveStoreSamples = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("disposalsamplesapproval/createStoreSamples", {
            ...inputData
        })
            .then(response => {
                let lstChildBioDisposeForm = response.data?.lstChildBioDisposeForm;
                let selectedRecord = this.state.selectedRecord;
                selectedRecord['addedSampleReceivingDetails'] = [];
                sortData(lstChildBioDisposeForm);

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        lstChildBioDisposeForm, selectedRecord, loadEsignStateHandle: false, openModalShow: false,
                        openChildModal: false, openStoreSample: false, shouldRender: true
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


    acceptRejectRequestBasedTransfer = (sampleValidationID, operation, screenName) => {
        let selectedBioDisposeForm = this.props?.selectedBioDisposeForm;
        if (selectedBioDisposeForm) {
            this.setState({ loading: true });

            let selectedRecord = this.state.selectedRecord;
            if (selectedRecord && selectedRecord.addedChilddisposalsamplesapproval && selectedRecord.addedChilddisposalsamplesapproval.length > 0) {
                const getSampleConditionStatus = rsapi().post("disposalsamplesapproval/getSampleConditionStatus", { 'userinfo': this.props.Login.userInfo, 'nbiodisposeformcode': Number(selectedBioDisposeForm.nbiodisposeformcode) });
                const getReason = rsapi().post("disposalsamplesapproval/getReason", { 'userinfo': this.props.Login.userInfo });
                let urlArray = [getSampleConditionStatus, getReason];
                Axios.all(urlArray)
                    .then(response => {
                        let lstSampleCondition = response[0].data?.lstSampleCondition;
                        let lstReason = response[1].data?.lstReason;

                        const updateInfo = {
                            typeName: DEFAULT_RETURN,
                            data: {
                                lstSampleCondition, lstReason, openAcceptRejectDisposeSamples: true, openModalShow: true,
                                selectedChildRecord: {}, ncontrolCode: sampleValidationID, screenName, operation, ...this.state.data
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

    }

    onDisposeEsignCheck = (genearateLocationID, operation, screenName) => {

        let selectedBioDisposeForm = this.props.selectedBioDisposeForm;
        let selectedRecord = this.state.selectedRecord;

        if (selectedBioDisposeForm && selectedBioDisposeForm.ntransactionstatus === transactionStatus.VALIDATION) {
            if (selectedRecord?.addedChilddisposalsamplesapproval && selectedRecord?.addedChilddisposalsamplesapproval.length > 0) {

                const childRecordStatusCheck = selectedRecord?.addedChilddisposalsamplesapproval?.some(item => item.ntransferstatus === 116);

                if (childRecordStatusCheck) {
                    return toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTVALIDATEDSAMPLERECORDDISPOSE" }));
                }

                let dataState = this.state.dataState;
                // let addedChilddisposalsamplesapproval = selectedRecord?.addedChilddisposalsamplesapproval.slice(dataState.skip, dataState.skip + dataState.take);
                let addedChilddisposalsamplesapproval = selectedRecord?.addedChilddisposalsamplesapproval;
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["ndisposalsamplesapprovaldetailcode"] = addedChilddisposalsamplesapproval.map(x => x.ndisposalsamplesapprovaldetailcode).join(',');
                inputData["ndisposalsamplesapprovalcode"] = addedChilddisposalsamplesapproval[0].ndisposalsamplesapprovalcode;

                let inputParam = {
                    inputData: inputData,
                    screenName: "IDS_DISPOSEFORM",
                    operation: "dispose"
                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, genearateLocationID)) {
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
        rsapi().post("disposalsamplesapproval/disposeSamples", {
            ...inputData
        })
            .then(response => {
                let lstChildBioDisposeForm = response.data?.lstChildBioDisposeForm;
                let selectedRecord = this.state.selectedRecord;
                //selectedRecord['addSelectAll'] = false;
                selectedRecord['addedSampleReceivingDetails'] = [];
                //selectedRecord['addedChilddisposalsamplesapproval'] = [];
                sortData(lstChildBioDisposeForm);

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        lstChildBioDisposeForm, selectedRecord, loadEsignStateHandle: false, openModalShow: false, openChildModal: false
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
        let selectedBioDisposeForm = this.props.selectedBioDisposeForm;
        let selectedRecord = this.state.selectedRecord;
        if (selectedBioDisposeForm && selectedBioDisposeForm.ntransactionstatus === transactionStatus.DRAFT
            || selectedBioDisposeForm.ntransactionstatus === transactionStatus.VALIDATION
        ) {
            if (selectedRecord?.addedChilddisposalsamplesapproval && selectedRecord?.addedChilddisposalsamplesapproval.length > 0) {
                let dataState = this.state.dataState;
                // let addedChilddisposalsamplesapproval = selectedRecord?.addedChilddisposalsamplesapproval.slice(dataState.skip, dataState.skip + dataState.take);
                let addedChilddisposalsamplesapproval = selectedRecord?.addedChilddisposalsamplesapproval;
                let inputData = [];
                inputData["userinfo"] = this.props.Login.userInfo;
                inputData["nbiodisposeformdetailscode"] = addedChilddisposalsamplesapproval.map(x => x.nbiodisposeformdetailscode).join(',');
                inputData["nbiodisposeformcode"] = addedChilddisposalsamplesapproval[0].nbiodisposeformcode;

                let inputParam = {
                    inputData: inputData,
                    screenName: "IDS_DISPOSEFORM",
                    operation: "delete"
                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteID)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            operation, loadEsignStateHandle: true, openChildModal: true, screenData: { inputParam }, screenName: "IDS_DISPOSEFORM"
                        }
                    }
                    this.props.updateStore(updateInfo);
                } else {
                    this.deleteDisposeSampleDetails(inputData);
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

    deleteDisposeSampleDetails = (inputData) => {
        this.setState({ loading: true });
        rsapi().post("disposalsamplesapproval/deleteDisposalSamplesApproval", {
            ...inputData
        })
            .then(response => {
                let lstChildBioDisposeForm = response.data?.lstChildBioDisposeForm;
                let selectedRecord = this.state.selectedRecord;
                sortData(lstChildBioDisposeForm);
                selectedRecord['addedChilddisposalsamplesapproval'] = [];
                selectedRecord['addSelectAll'] = false;
                let masterData = { ...this.props.Login.masterData, ...response.data }

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        masterData, lstChildBioDisposeForm, selectedRecord, loadEsignStateHandle: false, openModalShow: false, openChildModal: false
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
        if (this.props.Login.loadEsignStateHandle && this.props.Login.openAcceptRejectDisposeSamples) {
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
        const mandatoryFields = (this.state.openAcceptRejectDisposeSamples ? this.state.loadEsignStateHandle : this.props.Login.loadEsignStateHandle) ?
            [
                { "idsName": "IDS_PASSWORD", "dataField": "esignpassword", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_REASON", "dataField": "esignreason", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "idsName": "IDS_COMMENTS", "dataField": "esigncomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            ]
            :
            this.props.Login.openChildDisposeSample ? this.props.Login.operation === 'create' ?
                this.state.selectedChildRecord?.isEnableStoreFilter === false ?
                    [
                        { "idsName": "IDS_DISPOSALBATCHTYPE", "dataField": "ndisposalbatchtypecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                        { "idsName": "IDS_FORMTYPE", "dataField": "nformtypecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                        { "idsName": "IDS_FORMNUMBER", "dataField": "nbiomovetodisposecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                        { "idsName": "IDS_ORIGIN", "dataField": "formsiteorthirdpartyname", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "datepicker" },
                    ] : [
                        { "idsName": "IDS_DISPOSALBATCHTYPE", "dataField": "ndisposalbatchtypecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    ] : []
                : this.state.openAcceptRejectDisposeSamples ?
                    [
                        { "idsName": "IDS_SAMPLECONDITION", "dataField": "nsamplecondition", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                        { "idsName": "IDS_REASON", "dataField": "nreasoncode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
                    ] : [];

        onSaveMandatoryValidation(this.state.selectedChildRecord, mandatoryFields, (this.state.openAcceptRejectDisposeSamples ? this.state.loadEsignStateHandle : this.props.Login.loadEsignStateHandle) ? this.validateChildEsign :
            this.props.Login.openChildDisposeSample ? this.onSaveClick : this.state.openAcceptRejectDisposeSamples ?
                this.onModalSaveEsignCheck : this.props.Login.openStoreSample ? this.onStoreEsignCheck
                    : "", (this.state.openAcceptRejectDisposeSamples ?
                        this.state.loadEsignStateHandle : this.props.Login.loadEsignStateHandle), saveType);
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
        this.validateChildEsignforDisposeSamples(inputParam, modalName);
    }

    validateChildEsignforDisposeSamples = (inputParam) => {
        rsapi().post("login/validateEsignCredential", inputParam.inputData)
            .then(response => {
                if (response.data.credentials === "Success") {
                    if (inputParam["screenData"]["inputParam"]["operation"] === "accept"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_SAMPLECONDITION") {
                        this.onModalSave(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "delete") {
                        this.deleteDisposeSampleDetails(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "dispose"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_DISPOSESAMPLE") {
                        this.disposeSamples(inputParam["screenData"]["inputParam"]["inputData"]);
                    } else if (inputParam["screenData"]["inputParam"]["operation"] === "store"
                        && inputParam["screenData"]["inputParam"]["screenName"] === "IDS_STORE") {
                        this.saveStoreSamples(inputParam["screenData"]["inputParam"]["inputData"]);
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

            inputData["biodisposeform"] = {
                'ndisposalbatchtypecode': selectedChildRecord.ndisposalbatchtypecode?.value || -1,
                'nformtypecode': selectedChildRecord.nformtypecode?.value || -1,
                'nbiomovetodisposecode': selectedChildRecord.nbiomovetodisposecode?.value || -1,
            };
            inputData["nbiodisposeformcode"] = selectedChildRecord?.nbiodisposeformcode || -1;
            inputData["filterSelectedSamples"] = selectedChildRecord.addedSampleReceivingDetails && selectedChildRecord.addedSampleReceivingDetails || [];
            inputData["userinfo"] = this.props.Login.userInfo;
            inputData["ncontrolcode"] = this.props.addChildID;

            if (selectedChildRecord.addedSampleReceivingDetails && selectedChildRecord.addedSampleReceivingDetails.length > 0) {

                this.setState({ loading: true });
                rsapi().post("disposalsamplesapproval/createChildDisposalSample", { ...inputData })
                    .then(response => {

                        let masterData = { ...this.props.Login.masterData };
                        let responseData = response.data;
                        let lstBioDisposeForm = this.props.Login.masterData?.lstBioDisposeForm;
                        let searchedData = this.props.Login.masterData?.searchedData;

                        // Changed ndisposalsamplesapprovalcode to nbiodisposeformcode by Gowtham on 11 nov 2025 jira.id:BGSI-179
                        const index = lstBioDisposeForm.findIndex(item => item && item.nbiodisposeformcode === responseData.selectedBioDisposeForm.nbiodisposeformcode);
                        const searchedDataIndex = searchedData ? searchedData.findIndex(item => item && item.nbiodisposeformcode === response.data.selectedBioDisposeForm.nbiodisposeformcode) : -1;

                        if (index !== -1) {
                            lstBioDisposeForm[index] = responseData.selectedBioDisposeForm;
                        }
                        if (searchedDataIndex !== -1) {
                            searchedData[searchedDataIndex] = response.data.selectedBioDisposeForm;
                        }
                        masterData['lstBioDisposeForm'] = lstBioDisposeForm;
                        masterData['searchedData'] = searchedData;

                        masterData = { ...masterData, ...responseData };

                        let openChildModal = false;
                        let openChildDisposeSample = false;
                        if (saveType === 2) {
                            openChildModal = true;
                            selectedChildRecord['lstGetSampleReceivingDetails'] = [];
                            selectedChildRecord['addSelectAll'] = false;
                            selectedChildRecord['addedSampleReceivingDetails'] = [];
                            openChildDisposeSample = true;
                            Object.assign(selectedChildRecord, {
                                formsiteorthirdpartyname: "",
                                nformtypecode: [],
                                nbiomovetodisposecode: [],
                            });

                        } else {
                            selectedChildRecord = {};
                        }
                        selectedRecord['addSelectAll'] = false;
                        selectedRecord['addedChilddisposalsamplesapproval'] = [];
                        selectedRecord['addedSampleReceivingDetails'] = [];

                        const updateInfo = {
                            typeName: DEFAULT_RETURN,
                            data: {
                                masterData, openChildModal, openChildDisposeSample, selectedChildRecord, selectedRecord: { ...selectedChildRecord, selectedRecord }
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
        let openChildDisposeSample = this.props.Login.openChildDisposeSample;
        let viewRequestBasedTransferDetails = this.props.Login.viewRequestBasedTransferDetails;
        let loadEsignStateHandle = this.props.Login.loadEsignStateHandle;

        if (this.props.Login.loadEsignStateHandle) {
            openChildModal = false;
            selectedChildRecord = {};
            openChildDisposeSample = false;
            viewRequestBasedTransferDetails = false;
            loadEsignStateHandle = false;
        } else {
            openChildModal = false;
            selectedChildRecord = {};
            openChildDisposeSample = false;
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
                openChildDisposeSample,
                viewRequestBasedTransferDetails,
                loadEsignStateHandle,
                operation: undefined,
            }
        }
        this.props.updateStore(updateInfo);

    }

    closeModalShow = () => {
        let openAcceptRejectDisposeSamples = this.state.openAcceptRejectDisposeSamples;
        let openModalShow = this.state.openModalShow;
        let loadEsignStateHandle = this.state.loadEsignStateHandle;
        let selectedChildRecord = this.state.selectedChildRecord;
        let screenName = this.props.Login.screenName;
        let operation = this.props.Login.operation;

        if (this.props.Login.loadEsignStateHandle) {
            loadEsignStateHandle = false;
            openModalShow = (screenName === "IDS_SAMPLECONDITION" && operation === "accept") ? true : false;
            openAcceptRejectDisposeSamples = (screenName === "IDS_SAMPLECONDITION" && operation === "accept") ? true : false;
        } else {
            openAcceptRejectDisposeSamples = false;
            openModalShow = false;
            selectedChildRecord = {};
        }


        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openAcceptRejectDisposeSamples, openModalShow, selectedChildRecord, loadEsignStateHandle
            }
        }
        this.props.updateStore(updateInfo);
    }

    onModalSaveEsignCheck = () => {
        let selectedChildRecord = this.state.selectedChildRecord;
        let selectedRecord = this.state.selectedRecord;
        let dataState = this.state.dataState;
        // let addedChilddisposalsamplesapproval = selectedRecord?.addedChilddisposalsamplesapproval.slice(dataState.skip, dataState.skip + dataState.take);
        let addedChilddisposalsamplesapproval = selectedRecord?.addedChilddisposalsamplesapproval;
        let inputData = {
            'nbiodisposeformcode': addedChilddisposalsamplesapproval[0].nbiodisposeformcode,
            'nbiodisposeformdetailscode': addedChilddisposalsamplesapproval.map(x => x.nbiodisposeformdetailscode).join(',') || '-1',
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
        rsapi().post("disposalsamplesapproval/updateSampleCondition", { ...inputData })
            .then(response => {
                let lstChildBioDisposeForm = response.data?.lstChildBioDisposeForm;
                //selectedRecord['addedChilddisposalsamplesapproval'] = [];
                //selectedRecord['addSelectAll'] = false;

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        lstChildBioDisposeForm, openAcceptRejectDisposeSamples: false, openModalShow: false, selectedChildRecord: {},
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

export default connect(mapStateToProps, { updateStore })(injectIntl(OuterGridDisposeForm));