import React, { Component } from 'react';
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ReadOnlyText } from '../../components/App.styles';
import { ContentPanel } from '../../pages/product/product.styled';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import ListMaster from '../../components/list-master/list-master.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { showEsign, getControlMap,Lims_JSON_stringify } from '../../components/CommonScript';
import Esign from '../audittrail/Esign';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { transactionStatus } from '../../components/Enumeration';
// import ConfirmDialog from '../../components/confirm-alert/confirm-alert.component';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import {
    callService, crudMaster, validateEsignCredential, updateStore, getManfacturerCombo, selectCheckBoxManufacturer,
    getContactInfo,
    getSiteManufacturerLoadEdit, getContactManufacturerLoadEdit, filterColumnData, addManufacturerFile, viewAttachment
} from '../../actions';
import ManufacturerSiteTab from '../../pages/contactmaster/ManufacturerSiteTab';
// import { Tooltip } from '@progress/kendo-react-tooltip';
import AddManufacturer from '../../pages/contactmaster/AddManufacturer';
// import ReactTooltip from 'react-tooltip';
import CustomTabs from '../../components/custom-tabs/custom-tabs.component';
import ManufacturerFileTab from './ManufacturerFileTab';




const mapStateToProps = state => {
    return ({ Login: state.Login })
}


class Manufacturer extends Component {
    constructor(props) {
        super(props);
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            selectedRecord: {}, dataResult: [],
            dataState: dataState,
            masterStatus: "",
            error: "",
            Manufacturer: [],
            operation: "",
            selectedManufacturer: undefined,
            screenName: "Manufacturer",
            EDQMManufacturer: [],
            SiteCode: 0,
            userRoleControlRights: [],
            controlMap: new Map(),
            sidebarview: false

        };
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
    }
    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })          
    }

    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }

        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        if (props.Login.selectedRecord === undefined) {
            return { selectedRecord: {} }
        }
        return null;
    }


    render() {
        let userStatusCSS = "";
        let activeIconCSS = "fa fa-check";

        this.extractedColumnList = [
            { "idsName": "IDS_MANUFACTURERNAME", "mandatory": true, "dataField": "smanufname", "width": "200px", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_MANUFSITENAME", "mandatory": true, "dataField": "smanufsitename", "width": "150px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            { "idsName": "IDS_MANUFCONTACTNAME", "mandatory": true, "dataField": "scontactname", "width": "150px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            { "idsName": "IDS_ADDRESS1", "mandatory": true, "dataField": "saddress1", "width": "150px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            { "idsName": "IDS_COUNTRY", "dataField": "ncountrycode", "mandatory": true, "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
            // { "idsName": "IDS_EDQMOFFICIALNAME", "mandatory": true, "dataField": "nofficialmanufcode", "width": "200px" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"}
        ];

        this.extractedUpdateColumnList = [
            { "idsName": "IDS_MANUFACTURERNAME", "mandatory": true, "dataField": "smanufname", "width": "200px", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
        ];

        if (this.props.Login.masterData.selectedManufacturer && this.props.Login.masterData.selectedManufacturer.ntransactionstatus === transactionStatus.DEACTIVE) {
            userStatusCSS = "outline-secondary";
            activeIconCSS = "";
        }
        else if (this.props.Login.masterData.selectedManufacturer && this.props.Login.masterData.selectedManufacturer.ntransactionstatus === transactionStatus.ACTIVE) {
            userStatusCSS = "outline-success";
        }
        else {
            userStatusCSS = "outline-Final";
        }
        const addId = this.state.controlMap.has("AddManufacturer") && this.state.controlMap.get("AddManufacturer").ncontrolcode;
        const editId = this.state.controlMap.has("EditManufacturer") && this.state.controlMap.get("EditManufacturer").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteManufacturer") && this.state.controlMap.get("DeleteManufacturer").ncontrolcode

        const filterParam = {
            inputListName: "Manufacturer", selectedObject: "selectedManufacturer", primaryKeyField: "nmanufcode",
            fetchUrl: "manufacturer/getManufacturerWithSiteAndContactDetails", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData,
            searchFieldList: ["smanufname", "sdescription", "stransdisplaystatus"]
        };
        const mandatoryFields = [];
        this.props.Login.operation == "create" ?
        this.extractedColumnList.forEach(item => item.mandatory === true ?
            mandatoryFields.push(item) : ""
        ):
        this.extractedUpdateColumnList.forEach(item => item.mandatory === true ?
            mandatoryFields.push(item) : ""
        )
        ;
        return (
            <>
                <div className="client-listing-wrap mtop-4">
                    <Row noGutters={true}>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                            <ListMaster //filterColumnData ={(e)=>this.filterColumnData(e)}
                                formatMessage={this.props.intl.formatMessage}
                                screenName={"Manufacturer"}
                                masterData={this.props.Login.masterData}
                                userInfo={this.props.Login.userInfo}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.Manufacturer}
                                getMasterDetail={(Manufacturer) => this.props.selectCheckBoxManufacturer(Manufacturer, this.props.Login.userInfo, this.props.Login.masterData)}
                                selectedMaster={this.props.Login.masterData.selectedManufacturer}
                                primaryKeyField="nmanufcode"
                                mainField="smanufname"
                                firstField="stransdisplaystatus"
                                //secondField="stransdisplaystatus"
                                isIDSField="Yes"
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={addId}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData}
                                hidePaging={false}
                                openModal={() => this.props.getManfacturerCombo("IDS_MANUFACTURER", "create", "nmanufcode", this.props.Login.masterData, this.props.Login.userInfo, 75)}
                            />
                        </Col>
                        <Col md={`${!this.props.sidebarview ? '8' : "10"}`} className="position-relative">
                            <div className="sidebar-view-btn-block">
                                <div className="sidebar-view-btn " onClick={this.props.parentFunction}>
                                    {!this.props.sidebarview ?                    
                                        <i class="fa fa-less-than"></i> :
                                        <i class="fa fa-greater-than"></i> 
                                    }
                                </div>
                            </div>
                            <Row><Col md={12}>
                                <ContentPanel className="panel-main-content">
                                    {this.props.Login.masterData.Manufacturer && this.props.Login.masterData.Manufacturer.length > 0 && this.props.Login.masterData.selectedManufacturer ?
                                        <Card className="border-0">
                                            <Card.Header>
                                                <Card.Title className="product-title-main">{this.props.Login.masterData.selectedManufacturer.smanufname}</Card.Title>
                                                <Card.Subtitle>
                                                    <div className="d-flex product-category">
                                                        <h2 className="product-title-sub flex-grow-1">
                                                            <span className={`btn btn-outlined ${userStatusCSS} btn-sm ml-3`}>
                                                                <i className={activeIconCSS}></i>
                                                                {this.props.Login.masterData.selectedManufacturer.stransdisplaystatus}
                                                            </span>
                                                        </h2>
                                                        <div className="d-inline ">
                                                            {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}

                                                            {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" />  <ProductList className="d-inline dropdown badget_menu"> */}
                                                            <Nav.Link className="btn btn-circle outline-grey mr-2" href="#"
                                                                hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                             //   data-for="tooltip_list_wrap"  //ALPD-898 Fix
                                                                onClick={(e) => this.props.getManfacturerCombo("IDS_MANUFACTURER", "update", "nmanufcode", this.props.Login.masterData, this.props.Login.userInfo, editId)} >
                                                                <FontAwesomeIcon icon={faPencilAlt}
                                                                    title={this.props.intl.formatMessage({ id: "IDS_EDIT" })} />
                                                            </Nav.Link>
                                                            <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" href=""
                                                                hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                             //   data-for="tooltip_list_wrap"
                                                                onClick={() => this.ConfirmDelete(deleteId)}>
                                                                <FontAwesomeIcon icon={faTrashAlt} />
                                                                {/* <FontAwesomeIcon icon={faTrashAlt} className="ActionIconColor" onClick={(e) => this.DeleteManufacturer("delete", deleteId)} /> */}
                                                                {/* <ConfirmDialog
                                                                        name="deleteMessage"
                                                                        message={this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                                                                        doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}
                                                                        doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                                        icon={faTrashAlt}
                                                                        title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                        hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                        handleClickDelete={() => this.DeleteManufacturer("delete", deleteId)}
                                                                    /> */}
                                                            </Nav.Link>
                                                            {/* </Tooltip> */}
                                                        </div>
                                                    </div>
                                                </Card.Subtitle>
                                            </Card.Header>
                                            <Card.Body>
                                                <Row>
                                                    {/* <Col md='4'>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id={'IDS_EDQMOFFICIALNAME'} message="EDQM Official Name" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.selectedManufacturer.sofficialmanufname}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col> */}
                                                    <Col md='4'>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id={'IDS_DESCRIPTION'} message="Description" /></FormLabel>
                                                            <ReadOnlyText> {this.props.Login.masterData.selectedManufacturer.sdescription === null || this.props.Login.masterData.selectedManufacturer.sdescription.length === 0 ? '-' :
                                                               this.props.Login.masterData.selectedManufacturer.sdescription}</ReadOnlyText>
                                                           
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                {/* </Card.Body>
                                            <Card.Body> */}

                                            <Row className="no-gutters">
                                                <Col md={12}>
                                                    <Card className="at-tabs">
                                                        <CustomTabs tabDetail={this.tabDetail()} onTabChange={this.onTabChange} />
                                                    </Card>
                                                </Col>
                                            </Row>
                                            </Card.Body>
                                        </Card> : ""}
                                </ContentPanel>
                            </Col></Row>
                        </Col>
                    </Row>
                </div>
                {this.props.Login.openModal &&
                    <SlideOutModal show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        showSaveContinue={true}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={mandatoryFields}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                // formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            :
                            <AddManufacturer
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                // formatMessage={this.props.intl.formatMessage}
                                edqmManufacturerList={this.props.Login.edqmManufacturerList || []}
                                operation={this.props.Login.operation}
                                inputParam={this.props.inputParam}
                                Country = {this.props.Login.Country}
                            // defaultValue={this.props.Login.edqmManufacturer}
                            /> 
                            
                        }
                    />
                }
            </>
        );
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason']=""
            }
        }
        else {
            openModal = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId: null }
            // data: {openModal, loadEsign, selectedRecord}
        }
        this.props.updateStore(updateInfo);

    }
    ConfirmDelete = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.DeleteManufacturer("delete", deleteId));
    }
    onSaveClick = (saveType, formRef) => {

        let inputData = [];
        inputData["manufacturersiteaddress"] = {};
        inputData["userinfo"] = this.props.Login.userInfo;

        let postParam = undefined;

        let fieldList = ["nmanufcode", "smanufname", "sdescription","nmanufsitecode","smanufsitename","nmanufcontactcode","scontactname","ntransactionstatus"];
            
        let fieldUpdateList = ["nmanufcode", "smanufname", "sdescription","ntransactionstatus"];

        if (this.props.Login.operation === "update") {

            postParam = { inputListName: "Manufacturer", selectedObject: "selectedManufacturer", primaryKeyField: "nmanufcode" };
           
           // inputData["manufacturer"] = JSON.parse(JSON.stringify(this.state.selectedRecord));
            inputData["manufacturer"] = {};
            fieldUpdateList.map(item => {
                if (item === "nofficialmanufcode") {
                    return inputData["manufacturer"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item].value : "";
                }
                else {
                    return inputData["manufacturer"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
                }

            })
            if (inputData["manufacturer"].hasOwnProperty('nofficialmanufcode')) {
                    delete inputData["manufacturer"]['nofficialmanufcode']
            }
        }
        else {
            inputData["manufacturer"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };

            fieldList.map(item => {
                if (item === "nofficialmanufcode") {
                    return inputData["manufacturer"][item] = this.state.selectedRecord[item].value
                }
                else {
                    return inputData["manufacturer"][item] = this.state.selectedRecord[item]
                }
            })
            inputData["manufacturer"]["ncountrycode"]=this.state.selectedRecord["ncountrycode"] ? this.state.selectedRecord["ncountrycode"].value:-1;
            inputData["manufacturersiteaddress"]["smanufsitename"]=this.state.selectedRecord["smanufsitename"] ? this.state.selectedRecord["smanufsitename"]:"";
            inputData["manufacturersiteaddress"]["scontactname"]=this.state.selectedRecord["scontactname"] ? this.state.selectedRecord["scontactname"]:"";
            inputData["manufacturersiteaddress"]["ncountrycode"]=this.state.selectedRecord["ncountrycode"] ? this.state.selectedRecord["ncountrycode"].value:-1;
            inputData["manufacturersiteaddress"]["saddress1"]=this.state.selectedRecord["saddress1"] ? this.state.selectedRecord["saddress1"]:"";
            inputData["manufacturersiteaddress"]["saddress2"]=this.state.selectedRecord["saddress2"] ? this.state.selectedRecord["saddress2"]:"";
            inputData["manufacturersiteaddress"]["saddress3"]=this.state.selectedRecord["saddress3"] ? this.state.selectedRecord["saddress3"]:"";
            inputData["manufacturersiteaddress"]["ndefaultstatus"]=transactionStatus.YES;

        }
        let clearSelectedRecordField =[
            { "idsName": "IDS_MANUFACTURERNAME", "dataField": "smanufname", "width": "200px" ,"controlType": "textbox","isClearField":true},
            { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "200px","controlType": "textbox","isClearField":true },
            { "idsName": "IDS_SITENAME", "dataField": "smanufsitename", "width": "200px","controlType": "textbox","isClearField":true },
            { "idsName": "IDS_CONTACTNAME", "dataField": "scontactname", "width": "200px","controlType": "textbox","isClearField":true },
            { "idsName": "IDS_ADDRESS1", "dataField": "saddress1", "width": "200px","controlType": "textbox","isClearField":true },
            { "idsName": "IDS_TRANSACTIONSTATUSACTIVE", "dataField": "ntransactionstatus", "width": "100px","isClearField":true,"preSetValue":1},
            
        ]
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "Manufacturer",
            inputData: inputData,
            selectedRecord:{...this.state.selectedRecord},
            operation: this.props.Login.operation, saveType, formRef, postParam, searchRef: this.searchRef
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal","","",clearSelectedRecordField);
        }

        // this.props.crudMaster(inputParam);
    }
    DeleteManufacturer = (operation, ncontrolCode) => {
        let inputData = [];

        inputData["manufacturer"] = this.props.Login.masterData.selectedManufacturer;
        inputData["userinfo"] = this.props.Login.userInfo;

        const postParam = {
            inputListName: "Manufacturer", selectedObject: "selectedManufacturer",
            primaryKeyField: "nmanufcode",
            primaryKeyValue: this.props.Login.masterData.selectedManufacturer.nmanufcode,
            fetchUrl: "manufacturer/getManufacturerWithSiteAndContactDetails",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
        }

        const inputParam = {
            methodUrl: "Manufacturer", postParam,
            classUrl: this.props.Login.inputParam.classUrl,
            inputData: inputData,
            operation: "delete"
        }
        const masterData = this.props.Login.masterData;
        // this.props.crudMaster(inputParam, this.props.Login.masterData);
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    openModal: true, screenName: "Manufacturer", operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }
    onInputOnChange = (event) => {

        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === "agree") {
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
            }
            else {
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
            }
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }
    onComboChange = (comboData, fieldName) => {
        if (comboData !== null) {
            const selectedRecord = this.state.selectedRecord || {};
            selectedRecord[fieldName] = comboData;//comboData.value;

            this.setState({ selectedRecord });
        }

    }

    componentDidUpdate(previousProps) {
        // if (this.props.Login.masterData !== previousProps.Login.masterData) {
        //     this.setState(
        //         {
        //             Manufacturer: this.props.Login.masterData.Manufacturer ?
        //                 this.props.Login.masterData.Manufacturer : this.state.Manufacturer,
        //             selectedManufacturer: this.props.Login.masterData.selectedManufacturer ?
        //                 this.props.Login.masterData.selectedManufacturer : this.state.selectedManufacturer,
        //             ManufacturerSiteAddress: this.props.Login.masterData.ManufacturerSiteAddress ?
        //                 this.props.Login.masterData.ManufacturerSiteAddress : {},
        //             ManufacturerContactInfo: this.props.Login.masterData.ManufacturerContactInfo ?
        //                 this.props.Login.masterData.ManufacturerContactInfo : {},
        //             SiteCode: this.props.Login.masterData.SiteCode ? this.props.Login.masterData.SiteCode : 0,
        //             isOpen: false
        //         });


        // }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            const userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            this.setState({ userRoleControlRights, controlMap });
        }
    }

    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
               
                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }
        this.props.validateEsignCredential(inputParam, "openModal");
    }

    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, operation: null, modalName: undefined
            }
        }
        this.props.updateStore(updateInfo);
    }

    reloadData = () => {
        //ALPD-4803 done by Dhanushya RI,To check searchref key is present or not
        if (this.searchRef && this.searchRef.current) {
            this.searchRef.current.value = "";
          }
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: "manufacturer",
            methodUrl: "Manufacturer",
            userInfo: this.props.Login.userInfo,
            displayName: "Manufacturer"
        };

        this.props.callService(inputParam);
    }

    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
    }

    tabDetail = () => {
      
        const tabMap = new Map();

        tabMap.set("IDS_SITECONTACT",  <ManufacturerSiteTab
        operation={this.props.Login.operation}
        inputParam={this.props.Login.inputParam}
        screenName={this.props.Login.screenName}
        userInfo={this.props.Login.userInfo}
        masterData={this.props.Login.masterData}
        crudMaster={this.props.crudMaster}
        errorCode={this.props.Login.errorCode}
        masterStatus={this.props.Login.masterStatus}
        openChildModal={this.props.Login.openChildModal}
        updateStore={this.props.updateStore}
        selectedRecord={this.props.Login.selectedRecord}
        getContactInfo={this.props.getContactInfo}
        getSiteManufacturerLoadEdit={this.props.getSiteManufacturerLoadEdit}
        getContactManufacturerLoadEdit={this.props.getContactManufacturerLoadEdit}
        ncontrolCode={this.props.Login.ncontrolCode}
        userRoleControlRights={this.state.userRoleControlRights}
        esignRights={this.props.Login.userRoleControlRights}
        screenData={this.props.Login.screenData}
        validateEsignCredential={this.props.validateEsignCredential}
        loadEsign={this.props.Login.loadEsign}
        controlMap={this.state.controlMap}
        Country={this.props.Login.Country}
        countryCode={this.props.Login.countryCode}
        SiteCode={this.props.Login.SiteCode}
        selectedId={this.props.Login.selectedId}
        dataState={this.props.Login.dataState}
        settings = {this.props.Login.settings}
        linkMaster = {this.props.Login.linkMaster}

    />)

        tabMap.set("IDS_FILE",
        <ManufacturerFileTab
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
            userInfo={this.props.Login.userInfo}
            inputParam={this.props.Login.inputParam}
            deleteRecord={this.deleteRecord}
            manufacturerFile={this.props.Login.masterData.manufacturerFile || []}
            getAvailableData={this.props.getAvailableData}
            addManufacturerFile={this.props.addManufacturerFile}
            viewManufacturerFile={this.viewManufacturerFile}
            defaultRecord={this.defaultRecord}
            screenName="IDS_MANUFACTURERFILE"       //ALPD-898 Fix
            settings={this.props.Login.settings}
        />);
        return tabMap;
    }

    viewManufacturerFile = (filedata) => {
        const inputParam = {
            inputData: {
                manufacturerfile: filedata,
                userinfo: {...this.props.Login.userInfo,
                    //ALPD-1621(while saving the file and link,audit trail is not captured respective language)
                    slanguagename: Lims_JSON_stringify(this.props.Login.userInfo.slanguagename)}
            },
            classUrl: "manufacturer",
            operation: "view",
            methodUrl: "AttachedManufacturerFile",
            screenName: "Manufacturer File"
        }
        this.props.viewAttachment(inputParam);
    }

    deleteRecord = (manufacturerparam) => {
       
            let inputParam = {};
            if (this.props.Login.screenName === 'IDS_MANUFACTURERFILE') {       //ALPD-898 Fix
                inputParam = {
                    classUrl: "manufacturer",
                    methodUrl: manufacturerparam.methodUrl,
                    inputData: {
                        [manufacturerparam.methodUrl.toLowerCase()]: manufacturerparam.selectedRecord,
                        "userinfo": {...this.props.Login.userInfo,
                            //ALPD-1621(while saving the file and link,audit trail is not captured respective language)
                            slanguagename: Lims_JSON_stringify(this.props.Login.userInfo.slanguagename)
                        }
                    },
                    operation: manufacturerparam.operation,
                    //dataState: this.state.dataState,
                    //dataStateMaterial: this.state.dataStateMaterial
                    dataState: this.state.dataState
                }

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, manufacturerparam.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                        openChildModal: true, screenName: this.props.Login.screenName, operation: manufacturerparam.operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, this.props.Login.masterData, "openChildModal");
            }
        }
    }
}

export default connect(mapStateToProps,
    {
        callService, crudMaster, validateEsignCredential, updateStore,
        getManfacturerCombo, selectCheckBoxManufacturer, getContactInfo,
        getSiteManufacturerLoadEdit, getContactManufacturerLoadEdit, filterColumnData, addManufacturerFile, viewAttachment
    })(injectIntl(Manufacturer));