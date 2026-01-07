import React from 'react'
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { MediaLabel } from '../../components/add-client.styles';
import { FormattedMessage, injectIntl } from 'react-intl';
import { process } from '@progress/kendo-data-query';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { toast } from 'react-toastify';
import AddMAHContact from './AddMAHContact';
import Esign from '../audittrail/Esign';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { showEsign, validateEmail, validatePhoneNumber } from '../../components/CommonScript';
import DataGrid from '../../components/data-grid/data-grid.component';
import { transactionStatus } from '../../components/Enumeration';
//import ReactTooltip from 'react-tooltip';

class MAHContact extends React.Component {

    constructor(props) {
        super(props);
        const dataState = {
            skip: 0,
            take : this.props.settings ? parseInt(this.props.settings[14]) : 5
        };
        this.state = {
            isOpen: false, selectedRecord: {}, dataResult: [],
            activeTab: 'MAHContact-tab',
            dataState: dataState
        };
        this.holderFieldList = ['nmahcode', 'smahcontactname', 'sphoneno', 'smobileno',
            'sfaxno', 'semail', 'ndefaultstatus'];//'nmahcode',
        this.mahContactColumnList =
                     [{ "idsName": "IDS_MAHCONTACTNAME", "dataField": "smahcontactname", "width": "200px", "mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
                      { "idsName": "IDS_EMAIL", "dataField": "semail", "width": "200px", "mandatory": true, "alertPreFix": this.props.intl.formatMessage({ id: "IDS_VALID" }), "validateFunction": validateEmail , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
                      { "idsName": "IDS_DEFAULT", "dataField": "sdisplaystatus", "width": "150px", "isIdsField": true, "controlName": "ndefaultstatus" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"}
                       ];
    }

    mahDataStateChange = (event) => {
        this.setState({
            dataResult: process(this.props.masterData["MAHContact"], event.dataState),
            dataState: event.dataState
        });
    }

    render() {
        const addMAHContactId = this.props.controlMap.has("AddMAHContact") && this.props.controlMap.get("AddMAHContact").ncontrolcode
        const editMAHContactId = this.props.controlMap.has("EditMAHContact") && this.props.controlMap.get("EditMAHContact").ncontrolcode;
        const deleteMAHContactId = this.props.controlMap.has("DeleteMAHContact") && this.props.controlMap.get("DeleteMAHContact").ncontrolcode


        const mahAddParam = {
            screenName: "MAH Contact", operation: "create", primaryKeyField: "nmahcontactcode",
            masterData: this.props.masterData, userInfo: this.props.userInfo, ncontrolCode: addMAHContactId
        };

        const mahEditParam = {
            screenName: "MAH Contact", operation: "update", primaryKeyField: "nmahcontactcode",
            masterData: this.props.masterData, userInfo: this.props.userInfo, ncontrolCode: editMAHContactId
        };

        const mahDeleteParam = { screenName: "MAHolder", methodUrl: "MarketAuthorisationHolderContact", operation: "delete", ncontrolCode: deleteMAHContactId };
        const mandatoryFields = [];
        this.mahContactColumnList.forEach(item => item.mandatory === true ?
            mandatoryFields.push(item) : ""
        );
        return (
            <>
                <Row className="no-gutters">
                    <Col md={12}>
                        <Card //className="at-tabs border-0"
                        >
                            <Card.Header className="add-txt-btn">
                                <strong> <FormattedMessage id="IDS_MAHCONTACT" defaultMessage="MAH Contact" /></strong>
                            </Card.Header>
                            <Card.Body style={{ paddingTop: 'unset' }}>
                                <Row className="no-gutters text-right border-bottom pt-2 pb-2" >
                                    <Col md={12}>
                                        <div className="d-flex justify-content-end">
                                            {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                            <Nav.Link className="add-txt-btn" hidden={this.props.userRoleControlRights.indexOf(addMAHContactId) === -1}
                                                // data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADDMAHCONTACT" })}
                                                onClick={() => this.props.getMAHContactComboDataService(mahAddParam)}>
                                                <FontAwesomeIcon icon={faPlus} /> { }
                                                <FormattedMessage id='IDS_MAHCONTACT' defaultMessage='MAHContact' />
                                            </Nav.Link>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="no-gutters">
                                    <Col md={12}>
                                        <DataGrid
                                            primaryKeyField={"nmahcontactcode"}
                                            expandField="expanded"
                                            detailedFieldList={this.detailedFieldList}
                                            data={this.props.masterData["MAHContact"]}
                                            dataResult={process(this.props.masterData["MAHContact"], this.state.dataState)}
                                            dataState={this.state.dataState}
                                            dataStateChange={this.mahDataStateChange}
                                            extractedColumnList={this.mahContactColumnList}
                                            controlMap={this.props.controlMap}
                                            userRoleControlRights={this.props.userRoleControlRights}
                                            inputParam={this.props.inputParam}
                                            userInfo={this.props.userInfo}
                                            methodUrl="MAHContact"
                                            // methodUrl="MarketAuthorisationHolderContact"
                                            fetchRecord={this.props.getMAHContactComboDataService}
                                            editParam={mahEditParam}
                                            deleteRecord={this.deleteRecord}
                                            deleteParam={mahDeleteParam}
                                            pageable={true}
                                            scrollable={"scrollable"}
                                            //gridHeight={"600px"}
                                            //isComponent={false}
                                            isActionRequired={true}
                                            isToolBarRequired={false}
                                            selectedId={this.props.selectedId}
                                            hasDynamicColSize={true}
                                        />

                                    </Col>
                                </Row>
                            </Card.Body>
                            {/* <Card className="at-tabs">
                            <Tab.Container defaultActiveKey={this.state.activeTab}>
                                <Card.Header className="d-flex tab-card-header">
                                    <Nav className="nav nav-tabs card-header-tabs flex-grow-1" as="ul">
                                        <Nav.Item as='li'>
                                            <Nav.Link eventKey="MAHContact-tab">
                                                <FormattedMessage id="IDS_MAHCONTACT" defaultMessage="MAH Contact" />
                                            </Nav.Link>

                                        </Nav.Item>

                                    </Nav>
                                </Card.Header>
                                <Tab.Content>
                                    <Tab.Pane className="fade p-0 " eventKey="MAHContact-tab">
                                        <Row className="no-gutters text-right border-bottom pt-2 pb-2" >

                                            <Col md={12}>

                                                <Nav.Link className="add-txt-btn" hidden={this.props.userRoleControlRights.indexOf(addMAHContactId) === -1}
                                                    onClick={() => this.props.getMAHContactComboDataService(mahAddParam)}>
                                                    <FontAwesomeIcon icon={faPlus} /> {}
                                                    <FormattedMessage id='IDS_ADDMAHCONTACT' defaultMessage='Add MAHContact' />
                                                </Nav.Link>
                                            </Col>
                                        </Row>
                                        <Row className="no-gutters">
                                            <Col md={12}>
                                                <DataGrid
                                                    primaryKeyField={"nmahcontactcode"}
                                                    expandField="expanded"
                                                    detailedFieldList={this.detailedFieldList}
                                                    data={this.props.masterData["MAHContact"]}
                                                    dataResult={process(this.props.masterData["MAHContact"], this.state.dataState)}
                                                    dataState={this.state.dataState}
                                                    dataStateChange={this.mahDataStateChange}
                                                    extractedColumnList={this.mahContactColumnList}
                                                    controlMap={this.props.controlMap}
                                                    userRoleControlRights={this.props.userRoleControlRights}
                                                    inputParam={this.props.inputParam}
                                                    userInfo={this.props.userInfo}
                                                    methodUrl="MarketAuthorisationHolderContact"
                                                    fetchRecord={this.props.getMAHContactComboDataService}
                                                    editParam={mahEditParam}
                                                    deleteRecord={this.deleteRecord}
                                                    deleteParam={mahDeleteParam}
                                                    pageable={false}
                                                    scrollable={"auto"}
                                                    isComponent={false}
                                                    isActionRequired={true}
                                                    isToolBarRequired={false}
                                                    selectedId={this.props.selectedId}
                                                />

                                            </Col>
                                        </Row>
                                    </Tab.Pane>

                                </Tab.Content>
                            </Tab.Container> */}
                        </Card>
                    </Col>
                </Row>
                {this.props.openChildModal &&
                    <SlideOutModal show={this.props.openChildModal}
                        closeModal={this.closeModal}
                        operation={this.props.operation}
                        inputParam={this.props.inputParam}
                        screenName={this.props.screenName}
                        onSaveClick={this.onSaveClick}
                        updateStore={this.props.updateStore}
                        esign={this.props.loadEsign}
                        validateEsign={this.validateEsign}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={mandatoryFields}
                        addComponent={this.props.loadEsign ?
                            <Esign operation={this.props.operation}
                                formatMessage={this.props.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            /> :
                            <AddMAHContact selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                formatMessage={this.props.formatMessage}

                                selectedMAHolder={this.props.masterData.SelectedMAHolder || {}}
                            />

                        }

                    />
                }
            </>
        )

    }

    expandChange = (event) => {
        const isExpanded =
            event.dataItem.expanded === undefined ?
                event.dataItem.aggregates : event.dataItem.expanded;
        event.dataItem.expanded = !isExpanded;
        this.setState({ ...this.props });
    }
    detailBand = (props) => {

        const Dataitem = props.dataItem
        const OptionalFieldList = [
            { datafield: "sphoneno", Column: "Phone No" },
            { datafield: "smobileno", Column: "Mobile No" },
            { datafield: "sfaxno", Column: "Fax No" },

        ];
        return (<Row>
            {OptionalFieldList.map((fields) => {
                return (
                    <Col md='6'>
                        <FormGroup>
                            <FormLabel><FormattedMessage id={fields.Column} message={fields.Column} /></FormLabel>
                            <MediaLabel className="readonly-text font-weight-normal">{Dataitem[fields.datafield]}</MediaLabel>
                        </FormGroup>
                    </Col>
                )
            })
            }
        </Row>)
    }

    closeModal = () => {
        let loadEsign = this.props.loadEsign;
        let openChildModal = this.props.openChildModal;
        let selectedRecord = this.props.selectedRecord;
        if (this.props.loadEsign) {
            if (this.props.operation === "delete") {
                loadEsign = false;
                openChildModal = false;
                selectedRecord = {};
            }
            else {
                loadEsign = false;
            }
        }
        else {
            openChildModal = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openChildModal, loadEsign, selectedRecord, selectedId: null }
        }
        this.props.updateStore(updateInfo);

    }

    getTabContent = (event) => {
        this.setState({ activeTab: event.currentTarget.name });
    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;;

        if (fieldName === "ndeputyusersitecode") {
            this.state.deputyUserList.map(item => {
                if (item.nusersitecode === comboData.value) {
                    selectedRecord["sdeputyname"] = item.sfirstname + " " + item.slastname
                }
                return null;
            })
        }
        this.setState({ selectedRecord });

    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === "ntransactionstatus")
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
            // else if (event.target.name === "nlockmode")
            //     selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.UNLOCK : transactionStatus.LOCK;
            else
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            // if (event.target.name === "sphoneno" || event.target.name === "smobileno" || event.target.name === "sfaxno") {
            //     event.target.value = validatePhoneNumber(event.target.value);
            //     if (event.target.value !== "") {
            //         selectedRecord[event.target.name] = event.target.value;
            //     }
            // }
            // else {
            //     selectedRecord[event.target.name] = event.target.value;
            // }
            if (event.target.name === "sphoneno" || event.target.name === "smobileno" || event.target.name === "sfaxno") {
                if (event.target.value !== "") {
                    event.target.value = validatePhoneNumber(event.target.value);
                    selectedRecord[event.target.name] = event.target.value !== "" ? event.target.value : selectedRecord[event.target.name];
                } else {
                    selectedRecord[event.target.name] = event.target.value
                }
            }
            else {
                selectedRecord[event.target.name] = event.target.value;
            }
        }
        this.setState({ selectedRecord });
    }



    componentDidUpdate(previousProps) {
        if (this.props.masterData !== previousProps.masterData) {

            let { dataState } = this.state;
            if (this.props.dataState === undefined) {
                dataState = { skip: 0, take : this.props.settings ? parseInt(this.props.settings[14]) : 5 }
            }

            let isOpen = false;
            if (this.props.errorCode !== undefined && (this.state.operation === "create" || this.state.operation === "update")) {
                isOpen = true;
            }
            this.setState({ isOpen, activeTab: 'MAHContact-tab', dataState });
        }

        if (this.props.selectedRecord !== previousProps.selectedRecord) {
            this.setState({ selectedRecord: this.props.selectedRecord });
        }

    }

    // getMAHContactComboDataService(screenName, operation, primaryKeyName, primaryKeyValue) {
    //     if (this.props.masterData.SelectedMAHolder.ntransactionstatus !== transactionStatus.RETIRED) {

    //         const contactData = {
    //             "nmahcontactcode": primaryKeyValue, nmahcode: this.props.masterData.SelectedMAHolder.nmahcode, //nmastersitecode: maHolder.nsitecode,
    //             "userinfo": this.props.userInfo

    //         };
    //         const contactService = rsapi().post("marketauthorisationholdercontact/getMarketAuthorisationHolderContact", contactData);

    //         let urlArray = [];
    //         if (operation === "create") {
    //             urlArray = [contactService];
    //         }
    //         else {
    //             const contactById = rsapi().post("marketauthorisationholdercontact/getActiveMarketAuthorisationHolderContactById", { [primaryKeyName]: primaryKeyValue, "userinfo": this.props.userInfo });
    //             urlArray = [contactService, contactById];
    //         }

    //         Axios.all(urlArray)
    //             .then(response => {


    //                 let selectedRecord = undefined;
    //                 if (operation === "update") {
    //                     selectedRecord = response[1].data;


    //                     selectedRecord["nmahcontactcode"] = response[1].data["nmahcontactcode"];
    //                 }
    //                 this.setState({

    //                     isOpen: true,
    //                     operation, screenName,
    //                     selectedRecord
    //                 });
    //             })
    //             .catch(error => {
    //                 if (error.response?.status === 429) {
    //                toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
    //                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
    //            } else if (error.response?.status === 401 || error.response?.status === 403) {
    //      dispatch({
    //        type: UN_AUTHORIZED_ACCESS,
    //                    payload: {
    //                        navigation: 'forbiddenaccess',
    //                        loading: false,
    //                        responseStatus: error.response.status
    //                    }
    //        payload: {
    //          navigation: 'forbiddenaccess',
    //          loading: false,
    //        }
    //      });
    //    } else if (error.response.status === 500) {
    //                     toast.error(error.message);
    //                 }
    //                 else {
    //                     toast.warn(this.props.formatMessage({ id: error.response.data }));
    //                 }
    //             })
    //     }
    //     else {
    //         toast.warn(this.props.formatMessage({ id: this.props.masterData.SelectedUser.sactivestatus }));
    //     }
    // }



    onSaveClick = (saveType, formRef) => {
        if (this.state.selectedRecord['semail'] ? validateEmail(this.state.selectedRecord['semail']) : true) {
            //add / edit  
            let inputParam = {};

            if (this.props.screenName === "MAH Contact") {
                inputParam = this.saveMAHContact(saveType, formRef);
            }


            if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, this.props.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.masterData }, saveType
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTERVALIDEMAIL" }));
        }
    }

    saveMAHContact(saveType, formRef) {
        let inputData = [];
        let dataState = undefined;
        inputData["userinfo"] = this.props.userInfo;
        inputData["marketauthorisationholder"] = this.props.masterData.SelectedMAHolder;
        inputData["marketauthorisationholdercontact"] = {};
        let selectedId = null;
        if (this.props.operation === "update") {
            // edit
            inputData["marketauthorisationholdercontact"] = this.state.selectedRecord;
            selectedId = this.state.selectedRecord.nmahcontactcode;
            dataState = this.state.dataState;
        }



        this.holderFieldList.map(item => {
            return inputData["marketauthorisationholdercontact"][item] = this.state.selectedRecord[item]
        });
        inputData["marketauthorisationholdercontact"]["nmahcode"] = this.props.masterData.SelectedMAHolder.nmahcode; //this.state.selectedRecord["nmahcode"] ? this.state.selectedRecord["nmahcode"].value : "";

        const inputParam = {
            classUrl: "marketauthorisationholdercontact",
            methodUrl: "MarketAuthorisationHolderContact",
            inputData: inputData, selectedId,
            operation: this.props.operation, saveType, formRef, dataState
        }
        return inputParam;
    }


    deleteRecord = (deleteparam) => {
        if (deleteparam.selectedRecord.expanded !== undefined) {
            delete deleteparam.selectedRecord.expanded
        }
        if (this.props.masterData.SelectedMAHolder.ntransactionstatus === transactionStatus.RETIRED) {
            toast.warn(this.props.intl.formatMessage({ id: this.props.masterData.SelectedMAHolder.stranstatus }));
        }
        else {
            const inputParam = {
                classUrl: "marketauthorisationholdercontact",
                methodUrl: deleteparam.methodUrl,
                inputData: {
                    [deleteparam.methodUrl.toLowerCase()]: deleteparam.selectedRecord,
                    "userinfo": this.props.userInfo

                },
                operation: deleteparam.operation,
                dataState: this.state.dataState
            }

            if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, deleteparam.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.masterData },
                        openChildModal: true, screenName: deleteparam.screenName, operation: deleteparam.operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
            }
        }
    }

    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
               
                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.screenData
        }
        this.props.validateEsignCredential(inputParam, "openChildModal");
    }

    detailedFieldList = [
        { dataField: "sphoneno", idsName: "IDS_PHONENO" , columnSize:"4"},
        { dataField: "smobileno", idsName: "IDS_MOBILENO" , columnSize:"4"},
        { dataField: "sfaxno", idsName: "IDS_FAXNO", columnSize:"4" },
        //{ dataField: "sdisplaystatus", idsName: "IDS_DISPLAYSTATUS" },
        //{ "idsName": "IDS_DISPLAYSTATUS", "dataField": "sdisplaystatus", "width": "20%", "isIdsField": true, "controlName": "ndefaultstatus" }

    ];
}

export default injectIntl(MAHContact);