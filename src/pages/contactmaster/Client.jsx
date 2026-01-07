import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col, FormGroup, FormLabel, Nav, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import { MediaLabel } from '../../components/add-client.styles';
import { callService, crudMaster, updateStore, validateEsignCredential, 
    getClientComboService ,getClientDetail,getClientSiteForAddEdit,
    getClientSiteContactDetails,getClientContactForAddEdit,
    filterColumnData,changeClientCategoryFilter,addClientFile,viewAttachment } from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { constructOptionList, getControlMap, showEsign, validateEmail, validatePhoneNumber ,Lims_JSON_stringify} from '../../components/CommonScript';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import AddClient from './AddClient';
import { ContentPanel } from '../product/product.styled';
import ListMaster from '../../components/list-master/list-master.component';
// import ReactTooltip from 'react-tooltip';
import { ReadOnlyText } from '../../components/App.styles';
import ClientSiteAddressTab from '../../pages/contactmaster/ClientSiteAddressTab';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import { transactionStatus } from '../../components/Enumeration';
import ClientCategoryFilter from './ClientCategoryFilter';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import { Affix } from 'rsuite';
import CustomTabs from '../../components/custom-tabs/custom-tabs.component';
import ClientFileTab from './ClientFileTabs';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class Client extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.extractedColumnList = [];
        this.fieldList = [];
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            addScreen: false, data: [], masterStatus: "", error: "", operation: "create",
            dataResult: [],
            dataState: dataState,
            clientData: [],
            userRoleControlRights: [],
            controlMap: new Map(),
            selectedRecord: {}, 
            countryList: [],
            sidebarview: false
        };
        this.searchRef = React.createRef();

        this.confirmMessage = new ConfirmMessage();

        this.mandatoryFields = [
            { "idsName": "IDS_CLIENTNAME", "dataField": "sclientname", "mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            { "idsName": "IDS_CLIENTID", "dataField": "sclientid", "mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            { "idsName": "IDS_CLIENTSITENAME", "mandatory": true, "dataField": "sclientsitename", "width": "150px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            { "idsName": "IDS_CLIENTCONTACTNAME", "mandatory": true, "dataField": "scontactname", "width": "150px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            { "idsName": "IDS_ADDRESS1", "dataField": "saddress1", "mandatory": true, "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_COUNTRY", "dataField": "ncountrycode", "mandatory": true, "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" }
            
        ]
        this.mandatoryUpdateFields = [
            { "idsName": "IDS_CLIENTNAME", "dataField": "sclientname", "mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            { "idsName": "IDS_CLIENTID", "dataField": "sclientid", "mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"}
        ]
    }
    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })          
    }

    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data, event.dataState),
            dataState: event.dataState
        });
    }

    openFilter = () => {
        let showFilter = !this.props.Login.showFilter
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter }
        }
        this.props.updateStore(updateInfo);
    }

    closeFilter = () => {

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false }
        }
        this.props.updateStore(updateInfo);
    }

    onFilterSubmit = () => {
        if (this.state.nfilterClientCategory.value) {
            let inputParam = {
                inputData: {
                    nclientcatcode: this.state.nfilterClientCategory.value,
                    userinfo: this.props.Login.userInfo,
                    // nfilterClientCategory: this.state.nfilterClientCategory
                },
                classUrl: "client",
                methodUrl: "ClientByCategory"
            }
            this.props.changeClientCategoryFilter(inputParam, this.props.Login.masterData.filterClientCategory, this.state.nfilterClientCategory);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_CLIENTCATEGORYNOTAVAILABLE" }));
        }
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
                // selectedRecord["agree"] = 4;
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
        }
        this.props.updateStore(updateInfo);

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
    onComboChangeFilter = (comboData, fieldName) => {
                let nfilterClientCategory = this.state.nfilterClientCategory || {}
                nfilterClientCategory = comboData;
                this.searchRef.current.value = "";
                this.setState({ nfilterClientCategory })
    }

    getNestedFieldData = (nestedColumnArray, data) =>
        nestedColumnArray.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, data);

    render() {
        let userStatusCSS = "";
        let activeIconCSS = "fa fa-check";
        if (this.props.Login.masterData.selectedClient && this.props.Login.masterData.selectedClient.ntransactionstatus === transactionStatus.DEACTIVE) {
            userStatusCSS = "outline-secondary";
            activeIconCSS = "";
        }
        else if (this.props.Login.masterData.selectedClient && this.props.Login.masterData.selectedClient.ntransactionstatus === transactionStatus.ACTIVE) {
            userStatusCSS = "outline-success";
        }
        else {
            userStatusCSS = "outline-Final";
        }
        this.extractedColumnList = [
            { "idsName": "IDS_CLIENTNAME", "dataField": "sclientname", "width": "200px" },
            { "idsName": "IDS_CLIENTID", "dataField": "sclientid", "width": "200px" },
            { "idsName": "IDS_COUNTRYNAME", "dataField": "scountryname", "width": "200px" },
            // { "idsName": "IDS_EMAIL", "dataField": "semail", "width": "200px" },
            { "idsName": "IDS_STATUS", "dataField": "stransdisplaystatus", "width": "100px"},
        ]

        this.fieldList = ["sclientname", "sclientid", "saddress1", 
        // "saddress2", "saddress3",  "sphoneno", "smobileno", "sfaxno", "semail", 
        "sclientsitename", "scontactname", "ntransactionstatus", "ncountrycode"];

        const addId = this.state.controlMap.has("AddClient") && this.state.controlMap.get("AddClient").ncontrolcode;
        const editId = this.state.controlMap.has("EditClient") && this.state.controlMap.get("EditClient").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteClient") && this.state.controlMap.get("DeleteClient").ncontrolcode;

        const clientAddParam = {
            screenName: "IDS_CLIENT", operation: "create", primaryKeyField: "nclientcode",
            userInfo: this.props.Login.userInfo, ncontrolCode: addId,nfilterClientCategory:this.state.nfilterClientCategory
        };

        const clientEditParam = {
            screenName: "IDS_CLIENT", operation: "update", primaryKeyField: "nclientcode",
            userInfo: this.props.Login.userInfo, ncontrolCode: editId,masterData:this.props.Login.masterData,nfilterClientCategory:this.state.nfilterClientCategory
        };

        const clientDeleteParam = { screenName: "IDS_CLIENT", methodUrl: "Client", operation: "delete", ncontrolCode: deleteId };

        const filterParam = {
            inputListName: "Client", selectedObject: "selectedClient", primaryKeyField: "nclientcode",
            fetchUrl: "client/getSelectedClientDetail", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData,
            searchFieldList: ["sclientname", "sclientid", "address1","saddress2","saddress3","sphoneno","smobileno","sfaxno","semail" ,"stransdisplaystatus"]
        };

        const breadCrumbData = this.state.filterData || [];
        return (
            <>
            <div className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
            {breadCrumbData.length > 0 ?
                        <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        </Affix> : ""
                    }
                <Row noGutters={true}>
                    <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                        <ListMaster
                            formatMessage={this.props.intl.formatMessage}
                            screenName={"IDS_CLIENT"}
                            masterData={this.props.Login.masterData}
                            userInfo={this.props.Login.userInfo}
                            masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.Client}
                            getMasterDetail={(Client) => this.props.getClientDetail(Client, this.props.Login.userInfo, this.props.Login.masterData)}
                            selectedMaster={this.props.Login.masterData.selectedClient}
                            primaryKeyField="nclientcode"
                            mainField="sclientname"
                            firstField="sclientid"
                            secondField="stransdisplaystatus"
                            isIDSField="Yes"
                            filterColumnData={this.props.filterColumnData}
                            filterParam={filterParam}
                            userRoleControlRights={this.state.userRoleControlRights}
                            addId={addId}
                            searchRef={this.searchRef}
                            reloadData={this.reloadData}
                            hidePaging={false}
                            openModal={() => this.props.getClientComboService(clientAddParam)}
                            openFilter={this.openFilter}
                            closeFilter={this.closeFilter}
                            onFilterSubmit={this.onFilterSubmit}
                            showFilterIcon={true}
                            showFilter={this.props.Login.showFilter}
                            controlMap={this.state.controlMap}
                            settings={this.props.Login.settings||[]}
                            methodUrl={"Client"}
                            filterComponent={[
                                {
                                    "IDS_CLIENTCATEGORYFILTER":
                                        <ClientCategoryFilter
                                            filterClientCategory={this.state.filterClientCategory || []}
                                            nfilterClientCategory={this.state.nfilterClientCategory || {}}
                                            onComboChange={this.onComboChangeFilter}
                                        />
                                }
                            ]}
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
                                {this.props.Login.masterData.selectedClient && this.props.Login.masterData.Client.length > 0 && this.props.Login.masterData.selectedClient ?
                                    <Card className="border-0">
                                        <Card.Header>
                                            <Card.Title className="product-title-main">{this.props.Login.masterData.selectedClient.sclientname}</Card.Title>
                                            <Card.Subtitle>
                                                <div className="d-flex product-category">
                                                    <h2 className="product-title-sub flex-grow-1">
                                                        <span className={`btn btn-outlined ${userStatusCSS} btn-sm ml-3`}>
                                                            <i className={activeIconCSS}></i>
                                                            {this.props.Login.masterData.selectedClient.stransdisplaystatus}
                                                        </span>
                                                    </h2>
                                                    <div className="d-inline ">

                                                        {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" />  */}
                                                         {/* <ProductList className="d-inline dropdown badget_menu"> */}
                                                        <Nav.Link className="btn btn-circle outline-grey mr-2" href="#"
                                                            hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                           // data-for="tooltip_list_wrap"
                                                            onClick={(e) => this.props.getClientComboService(clientEditParam)} >
                                                            <FontAwesomeIcon icon={faPencilAlt}
                                                                title={this.props.intl.formatMessage({ id: "IDS_EDIT" })} />
                                                        </Nav.Link>
                                                        <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" href=""
                                                            hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                          //  data-for="tooltip_list_wrap"
                                                            onClick={() => this.ConfirmDelete(deleteId)}>
                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                            
                                                        </Nav.Link>
                                                    </div>
                                                </div>
                                            </Card.Subtitle>
                                        </Card.Header>
                                        <Card.Body>
                                            {/* <Row> */}
                                                
                                                {/* <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id={'IDS_ADDRESS1'} message="Address1" /></FormLabel>
                                                        <ReadOnlyText> {this.props.Login.masterData.selectedClient.saddress1 === null || this.props.Login.masterData.selectedClient.saddress1.length === 0 ? '-' :
                                                           this.props.Login.masterData.selectedClient.saddress1}</ReadOnlyText>
                                                       
                                                    </FormGroup>
                                                </Col> */}
                                                {/* <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id={'IDS_ADDRESS2'} message="Address2" /></FormLabel>
                                                        <ReadOnlyText> {this.props.Login.masterData.selectedClient.saddress2 === null || this.props.Login.masterData.selectedClient.saddress2.length === 0 ? '-' :
                                                           this.props.Login.masterData.selectedClient.saddress2}</ReadOnlyText>
                                                       
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id={'IDS_ADDRESS3'} message="Address3" /></FormLabel>
                                                        <ReadOnlyText> {this.props.Login.masterData.selectedClient.saddress3 === null || this.props.Login.masterData.selectedClient.saddress3.length === 0 ? '-' :
                                                           this.props.Login.masterData.selectedClient.saddress3}</ReadOnlyText>
                                                       
                                                    </FormGroup>
                                                </Col> */}
                                                {/* <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id={'IDS_PHONENO'} message="Phone No" /></FormLabel>
                                                        <ReadOnlyText> {this.props.Login.masterData.selectedClient.sphoneno === null || this.props.Login.masterData.selectedClient.sphoneno.length === 0 ? '-' :
                                                           this.props.Login.masterData.selectedClient.sphoneno}</ReadOnlyText>
                                                       
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id={'IDS_MOBILENO'} message="Mobile No" /></FormLabel>
                                                        <ReadOnlyText> {this.props.Login.masterData.selectedClient.smobileno === null || this.props.Login.masterData.selectedClient.smobileno.length === 0 ? '-' :
                                                           this.props.Login.masterData.selectedClient.smobileno}</ReadOnlyText>
                                                       
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id={'IDS_FAXNO'} message="Fax No" /></FormLabel>
                                                        <ReadOnlyText> {this.props.Login.masterData.selectedClient.sfaxno === null || this.props.Login.masterData.selectedClient.sfaxno.length === 0 ? '-' :
                                                           this.props.Login.masterData.selectedClient.sfaxno}</ReadOnlyText>
                                                       
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id={'IDS_EMAIL'} message="Email" /></FormLabel>
                                                        <ReadOnlyText> {this.props.Login.masterData.selectedClient.semail === null || this.props.Login.masterData.selectedClient.semail.length === 0 ? '-' :
                                                           this.props.Login.masterData.selectedClient.semail}</ReadOnlyText>
                                                       
                                                    </FormGroup>
                                                </Col> */}
                                                {/* <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id={'IDS_COUNTRY'} message="Country" /></FormLabel>
                                                        <ReadOnlyText> {this.props.Login.masterData.selectedClient.scountryname === null || this.props.Login.masterData.selectedClient.scountryname.length === 0 ? '-' :
                                                           this.props.Login.masterData.selectedClient.scountryname}</ReadOnlyText>
                                                       
                                                    </FormGroup>
                                                </Col> */}
     <Row className="no-gutters">
                    <Col md={12}>
                        <Card className="at-tabs">
                            <CustomTabs tabDetail={this.tabDetail()} onTabChange={this.onTabChange} />
                        </Card>
                    </Col>
                </Row>

                                            {/* </Row> */}
                                            {/* <ClientSiteAddressTab
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
                                                    getClientSiteContactDetails={this.props.getClientSiteContactDetails}
                                                    getClientSiteForAddEdit={this.props.getClientSiteForAddEdit}
                                                    getClientContactForAddEdit={this.props.getClientContactForAddEdit}
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
                                                    addClientFile={this.props.addClientFile}
                                                    viewAttachment={this.props.viewAttachment}
                                        

                                                />
                                        */}
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
                 mandatoryFields={this.props.Login.operation == "create" ? this.mandatoryFields || [] : this.mandatoryUpdateFields || []}
                 addComponent={this.props.Login.loadEsign ?
                     <Esign operation={this.props.Login.operation}
                         formatMessage={this.props.intl.formatMessage}
                         onInputOnChange={this.onInputOnChange}
                         inputParam={this.props.Login.inputParam}
                         selectedRecord={this.state.selectedRecord || {}}
                     />
                     : <AddClient
                         selectedRecord={this.state.selectedRecord || {}}
                         onInputOnChange={this.onInputOnChange}
                         onComboChange={this.onComboChange}
                         formatMessage={this.props.intl.formatMessage}
                         countryList={this.state.countryList || []}
                         clientCategoryList={this.props.Login.clientCategoryList || []}
                         operation={this.props.Login.operation}
                         inputParam={this.props.Login.inputParam}
                         settings={this.props.Login.settings}

                     />}
             />
            }
        </>
    );
        
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
            { datafield: "saddress1", Column: "Address1" },
            { datafield: "saddress2", Column: "Address2" },
            { datafield: "saddress3", Column: "Address3" },
            { datafield: "sphoneno", Column: "Phone No" },
            { datafield: "smobileno", Column: "Mobile No" },
            { datafield: "sfaxno", Column: "Fax No" },
            { datafield: "stransdisplaystatus", Column: "DisplayStatus" },

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
    detailedFieldList = [
        { dataField: "saddress1", idsName: "IDS_ADDRESS1" , columnSize:"4"},
        { dataField: "saddress2", idsName: "IDS_ADDRESS2" , columnSize:"4"},
        { dataField: "saddress3", idsName: "IDS_ADDRESS3", columnSize:"4" },
        { dataField: "sphoneno", idsName: "IDS_PHONENO" , columnSize:"4"},
        { dataField: "smobileno", idsName: "IDS_MOBILENO" , columnSize:"4"},
        { dataField: "sfaxno", idsName: "IDS_FAXNO" , columnSize:"4"},
    ];

    onComboChange = (comboData, fieldName) => {
        if (comboData != null) {
            const selectedRecord = this.state.selectedRecord || {};
            selectedRecord[fieldName] = comboData;


            this.setState({ selectedRecord });
        }
    }
    generateBreadCrumData() {
        const breadCrumbData = [];
        if (this.props.Login.masterData && this.props.Login.masterData.filterClientCategory) {

            breadCrumbData.push(
                {
                    "label": "IDS_CLIENTCATEGORY",
                    "value": this.props.Login.masterData.SelectedClientCat ? this.props.Login.masterData.SelectedClientCat.sclientcatname : "NA"
                }
            );
        }
        return breadCrumbData;
    }



    componentDidUpdate(previousProps) {
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                this.setState({
                    userRoleControlRights, controlMap, data: this.props.Login.masterData,
                });
            }
            else {

                let { dataState } = this.state;
                if (this.props.Login.dataState === undefined) {
                    dataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }
                }

                this.setState({
                    data: this.props.Login.masterData,
                    dataState
                });
            }

            let filterClientCategory = this.state.filterClientCategory || {};
            let nfilterClientCategory = this.state.nfilterClientCategory || {};
            if (
              this.props.Login.masterData.SelectedClientCat &&
              this.props.Login.masterData.SelectedClientCat !==
              previousProps.Login.masterData.SelectedClientCat
            ) {
                nfilterClientCategory = {
                label: this.props.Login.masterData.SelectedClientCat.sclientcatname,
                value: this.props.Login.masterData.SelectedClientCat.nclientcatcode,
                item: this.props.Login.masterData.SelectedClientCat,
              };
            }
            if (this.props.Login.masterData.filterClientCategory !== previousProps.Login.masterData.filterClientCategory) {
                const clientCategoryMap = constructOptionList(this.props.Login.masterData.filterClientCategory || [], "nclientcatcode",
                    "sclientcatname", 'nclientcatcode', 'ascending', false);
                    filterClientCategory = clientCategoryMap.get("OptionList");
                if (clientCategoryMap.get("DefaultValue")) {
                    nfilterClientCategory = clientCategoryMap.get("DefaultValue");
                } 
            } else if (this.props.Login.masterData.nfilterClientCategory !== previousProps.Login.masterData.nfilterClientCategory) {
                nfilterClientCategory = this.props.Login.masterData.nfilterClientCategory;
            }
                this.setState({ nfilterClientCategory, filterClientCategory });
            
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        if (this.props.Login.countryList !== previousProps.Login.countryList) {

            const countryList = constructOptionList(this.props.Login.countryList || [], "ncountrycode",
                "scountryname", undefined, undefined, undefined);
            const countryListClient = countryList.get("OptionList");

            this.setState({ countryList: countryListClient });
        }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            const filterData = this.generateBreadCrumData();
            this.setState({ filterData });
        }
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === "agree") {
                selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
            } else {
                selectedRecord[event.target.name] = event.target.checked === true ? 1 : 2;
            }
        } else if (event.target.type === 'select-one') {
            selectedRecord[event.target.name] = event.target.value;
        } else {
            if (event.target.name === "sphoneno" || event.target.name === "smobileno" || event.target.name === "sfaxno") {
                if (event.target.value !== "") {
                    event.target.value = validatePhoneNumber(event.target.value);
                    selectedRecord[event.target.name] = event.target.value !== "" ? event.target.value : selectedRecord[event.target.name];
                } else {
                    selectedRecord[event.target.name] = event.target.value;
                }
            } else {
                selectedRecord[event.target.name] = event.target.value;
            }
        }
        this.setState({ selectedRecord });
    }

    deleteRecord = (clientDeleteParam) => {
       
        // const inputParam = {
        //     classUrl: this.props.Login.inputParam.classUrl,
        //     methodUrl: clientDeleteParam.methodUrl,
        //     displayName: this.props.Login.inputParam.displayName,
        //     inputData: {
        //         ["client"]: clientDeleteParam.selectedRecord,
        //         "userinfo": this.props.Login.userInfo
        //     },
        //     operation: clientDeleteParam.operation,
        // }
        let inputParam = {};
            if (this.props.Login.screenName === 'IDS_CLIENTFILE') {
                inputParam = {
                    classUrl: "client",
                    methodUrl: clientDeleteParam.methodUrl,
                    inputData: {
                        [clientDeleteParam.methodUrl.toLowerCase()]: clientDeleteParam.selectedRecord,
                        "userinfo": {...this.props.Login.userInfo,
                            //ALPD-1619(while saving the file and link,audit trail is not captured the respective language)
                            slanguagename: Lims_JSON_stringify(this.props.Login.userInfo.slanguagename)}

                    },
                    operation: clientDeleteParam.operation,
                    //dataState: this.state.dataState,
                    //dataStateMaterial: this.state.dataStateMaterial
                    dataState: this.state.dataState,
                    postParam: {
                        inputListName: "Client", selectedObject: "selectedClient", primaryKeyField: "nclientcode",
                        fetchUrl: "client/getActiveClientById", fecthInputObject: { userinfo: this.props.Login.userInfo },
                    }
                }


        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, clientDeleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true,
                    screenName: clientDeleteParam.screenName, operation: clientDeleteParam.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }
    }
    DeleteClient= (operation, ncontrolCode) => {
        let inputData = [];

        inputData["client"] = this.props.Login.masterData.selectedClient;
        inputData["clientsite"] = this.props.Login.masterData.selectedClientSite;
        inputData["clientcontact"] = this.props.Login.masterData.selectedClientContact ;
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["clientfile"] = this.props.Login.masterData.clientFile[0];
        const postParam = {
            inputListName: "Client", selectedObject: "selectedClient",
            primaryKeyField: "nclientcode",
            primaryKeyValue: this.props.Login.masterData.selectedClient.nclientcode,
            fetchUrl: "client/getActiveClientById",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
        }
        const inputParam = {
            methodUrl: "Client", 
            //postParam,
            classUrl: this.props.Login.inputParam.classUrl,
            inputData: inputData,
            operation: "delete",
            postParam
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    openModal: true, screenName: "IDS_CLIENT", operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }
  
    reloadData = () => {
        //ALPD-4803 done by Dhanushya RI,To check searchref key is present or not
        if (this.searchRef && this.searchRef.current) {
            this.searchRef.current.value = "";
          }
        if(this.props.Login.masterData && this.props.Login.masterData.SelectedClientCat){

        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo, "nclientcatcode": this.props.Login.masterData.SelectedClientCat.nclientcatcode },
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl:"ClientByCategory",
            displayName:this.props.intl.formatMessage({ id: "IDS_CLIENT" })      
        };

        this.props.changeClientCategoryFilter(inputParam,this.props.Login.masterData.filterClientCategory,this.state.nfilterClientCategory);
    } else {
        toast.warn(
            this.props.intl.formatMessage({
              id: "IDS_CLIENTCATEGORYNOTAVAILABLE",
            })
          );
    }
    }
    ConfirmDelete = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.DeleteClient("delete",deleteId));
    }

    onSaveClick = (saveType, formRef) => {
        // const isValidateEmail = this.state.selectedRecord["semail"]? validateEmail(this.state.selectedRecord["semail"]): true;
        let postParam = undefined;

        // if (isValidateEmail) {
            let inputData = [];
            inputData["clientsiteaddress"] = {};
            inputData["userinfo"] = this.props.Login.userInfo;
            let dataState = undefined;
            if (this.props.Login.operation === "update") {
                const selectedRecord=this.state.selectedRecord;
                // edit
                postParam = {
                    inputListName: "Client",
                    selectedObject: "selectedClient",
                    primaryKeyField: "nclientcode",
                  };
                inputData["client"] = {};

                this.fieldList.map(item => {
                    return inputData["client"][item] = selectedRecord[item] !== null ? selectedRecord[item] : "";
               })
               inputData["client"]["nclientcode"] =selectedRecord["nclientcode"] ? selectedRecord["nclientcode"] : -1;
               inputData["client"]["ncountrycode"] = selectedRecord["ncountrycode"] ? selectedRecord["ncountrycode"].value : -1;
               inputData["client"]["nclientcatcode"] = selectedRecord["nclientcatcode"] ? selectedRecord["nclientcatcode"].value : -1;
                dataState = this.state.dataState;
            }
            else {
                //add               
                inputData["client"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };


                this.fieldList.map(item => {
                    return inputData["client"][item] = this.state.selectedRecord[item]
                })
                inputData["client"]["ncountrycode"] = this.state.selectedRecord["ncountrycode"] ? this.state.selectedRecord["ncountrycode"].value : -1;
                inputData["client"]["nclientcatcode"] = this.state.selectedRecord["nclientcatcode"] ? this.state.selectedRecord["nclientcatcode"].value : -1;
                inputData["clientsiteaddress"]["sclientsitename"] = this.state.selectedRecord["sclientsitename"] ? this.state.selectedRecord["sclientsitename"] : "";
                inputData["clientsiteaddress"]["saddress1"] = this.state.selectedRecord["saddress1"] ? this.state.selectedRecord["saddress1"] : "";
                inputData["clientsiteaddress"]["saddress2"] = this.state.selectedRecord["saddress2"] ? this.state.selectedRecord["saddress2"] : "";
                inputData["clientsiteaddress"]["saddress3"] = this.state.selectedRecord["saddress3"] ? this.state.selectedRecord["saddress3"] : "";
                inputData["clientsiteaddress"]["ncountrycode"] = this.state.selectedRecord["ncountrycode"] ? this.state.selectedRecord["ncountrycode"].value : -1;
                // inputData["clientsiteaddress"]["ntransactionstatus"] = transactionStatus.ACTIVE;
                inputData["clientsiteaddress"]["ndefaultstatus"] = transactionStatus.YES;
                inputData["clientsiteaddress"]["scontactname"] = this.state.selectedRecord["scontactname"] ? this.state.selectedRecord["scontactname"] : "";

            }
            let clearSelectedRecordField = [
                { "idsName": "IDS_CLIENTNAME", "dataField": "sclientname", "width": "200px" ,"controlType": "textbox","isClearField":true},
                { "idsName": "IDS_CLIENTID", "dataField": "sclientid", "width": "200px","controlType": "textbox","isClearField":true },
                { "idsName": "IDS_CLIENTSITENAME", "dataField": "sclientsitename", "width": "200px","controlType": "textbox","isClearField":true },
                { "idsName": "IDS_CLIENTCONTACTNAME", "dataField": "scontactname", "width": "200px","controlType": "textbox","isClearField":true },
                { "idsName": "IDS_ADDRESS1", "dataField": "saddress1", "width": "200px","controlType": "textbox","isClearField":true },
                { "idsName": "IDS_TRANSACTIONSTATUSACTIVE", "dataField": "ntransactionstatus", "width": "100px","isClearField":true,"preSetValue":1},
            ]
            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: "Client",
                displayName: this.props.Login.inputParam.displayName,
                inputData: inputData,
                selectedId: this.state.selectedRecord["nclientcode"],
                operation: this.props.Login.operation, saveType, formRef, dataState,
                searchRef: this.searchRef,
                postParam:postParam,
                filtercombochange:this.props.Login.masterData.searchedData!==undefined?
                    this.state.selectedRecord.nclientcatcode.value === this.props.Login.masterData.SelectedClientCat.nclientcatcode?false:true:false,
                    selectedRecord:{...this.state.selectedRecord}
            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                        openModal: true, screenName: this.props.intl.formatMessage({ id: "IDS_CLIENT"}),
                        //this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                        operation: this.props.Login.operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal","","",clearSelectedRecordField);
            }
        // } else {
        //     toast.info(this.props.intl.formatMessage({ id: "IDS_ENTERVALIDEMAIL" }))
        // }
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
    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
    }
    tabDetail =     () => {
        const tabMap = new Map();

        tabMap.set("IDS_CLIENTSITE&CONTACT",

        <ClientSiteAddressTab
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
            getClientSiteContactDetails={this.props.getClientSiteContactDetails}
            getClientSiteForAddEdit={this.props.getClientSiteForAddEdit}
            getClientContactForAddEdit={this.props.getClientContactForAddEdit}
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
            addClientFile={this.props.addClientFile}
            viewAttachment={this.props.viewAttachment}
            linkMaster = {this.props.Login.linkMaster}
            
        
    />)

        tabMap.set("IDS_FILE",
            <ClientFileTab
                controlMap={this.state.controlMap}
                userRoleControlRights={this.state.userRoleControlRights}
                userInfo={this.props.Login.userInfo}
                inputParam={this.props.Login.inputParam}
              // deleteRecord={this.DeleteContact}
                clientFile={this.props.Login.masterData.clientFile || []}
                getAvailableData={this.props.getAvailableData}
                addClientFile={this.props.addClientFile}
                viewClientFile={this.viewClientFile}
                defaultRecord={this.defaultRecord}
                screenName="IDS_CLIENTFILE"
                settings={this.props.Login.settings}
                ncontrolCode={this.props.Login.ncontrolCode}
                masterData={this.props.Login.masterData}
                crudMaster={this.props.crudMaster}
                deleteRecord={this.deleteRecord}

            />
             );
        return tabMap;
    }

    viewClientFile = (filedata) => {
        const inputParam = {
            inputData: {
                clientfile: filedata,
                userinfo: this.props.Login.userInfo
            },
            classUrl: "client",
            operation: "view",
            methodUrl: "AttachedClientFile",
            screenName: "Client File"
        }
        this.props.viewAttachment(inputParam);
    }


}

export default connect(mapStateToProps, {
    callService, crudMaster, updateStore, validateEsignCredential,
    getClientComboService,getClientDetail,getClientSiteForAddEdit,
    getClientSiteContactDetails,getClientContactForAddEdit,
    filterColumnData,changeClientCategoryFilter,addClientFile,  viewAttachment
})(injectIntl(Client));