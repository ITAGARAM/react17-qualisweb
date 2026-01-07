import React from 'react'
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faThumbsUp,faCheckCircle } from '@fortawesome/free-solid-svg-icons';//,faUserTimes, faTrash
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import {
    callService, crudMaster, validateEsignCredential, updateStore, filterColumnData ,getRetrievalCertificateForFilter, getRetrievalCertificateComboService,
    getProjectBasedUsers,getRetrievalCertificateDetail,reloadRetrievalCertificate,reportRetrievalCetificate,generateControlBasedReport,
    getProjectBasedOnProjectType
} from '../../actions';
import { ReactComponent as CheckCertificate} from '../../assets/image/Check Certificate.svg';
//import { ReactComponent as Reject } from '../../assets/image/reject.svg'
import { ReadOnlyText, ContentPanel } from '../../components/App.styles';
import { getControlMap, showEsign, validateEmail, validatePhoneNumber, validateTwoDigitDate, convertDateValuetoString, formatInputDate } from '../../components/CommonScript';//searchData, sortData,
import ListMaster from '../../components/list-master/list-master.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';

import Esign from '../../pages/audittrail/Esign';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import { ListWrapper } from '../../components/client-group.styles';
import { transactionStatus,REPORTTYPE,designComponents } from '../../components/Enumeration';
import { Affix } from 'rsuite';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import RetrievalCertificateFilter from './RetrievalCertificateFilter';
import AddRetrievalCertificate from './AddRetrievalCertificate';
import { ReactComponent as DownloadReportbutton } from '../../assets/image/downloadreportbutton.svg'

// import ReactTooltip from 'react-tooltip';


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class RetrievalCertificate extends React.Component {
    constructor(props) {
        super(props);

        // const dataState = {
        //     skip: 0,
        //     take: 10,
        // };

        this.state = {
            isOpen: false,
            masterStatus: "",
            error: "",
            selectedRecord: {},
            operation: "",
            sidebarview: false,
            screenName: undefined,
            userLogged: true,
            selectedRetrievalCertificate: undefined,
            userRoleControlRights: [],
            controlMap: new Map(),
            showAccordian: true,
        };
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
        this.retrievalcertificateFieldList = ['sretrievalcertificateno','sbiomaterialtype', 'nprojectmastercode', 'srequestid',
            'stestingmethod', 'spreparationmethod', 'nstorageconditioncode', 'sinvestigatorname', 'sorganizationaddress', 'sphoneno','semail','dretrievalcertificatedate','scomment','stransdisplaystatus'];//'nmahcode',
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
                        //console.log('screen name:',this.props.Login.screenName,'operation ;',this.props.Login.operation)
                        //console.log('selected r :', this.props.Login.inputParam)
        
                        let userStatusCSS = "outline-secondary";

                        if (this.props.Login.masterData.SelectedRetrievalCertificate&&this.props.Login.masterData.SelectedRetrievalCertificate.ntransactionstatus === transactionStatus.APPROVED) {

                            userStatusCSS = "outline-success";
                
                        }
                
                        else if (this.props.Login.masterData.SelectedRetrievalCertificate && this.props.Login.masterData.SelectedRetrievalCertificate.ntransactionstatus === transactionStatus.COMPLETED) {
                
                            userStatusCSS = "outline-correction";
                
                        }
                        else if (this.props.Login.masterData.SelectedRetrievalCertificate && this.props.Login.masterData.SelectedRetrievalCertificate.ntransactionstatus === transactionStatus.CHECKED) {
                
                            userStatusCSS = "outline-danger";

                        }

        const addId = this.state.controlMap.has("AddRetrievalCertificate") && this.state.controlMap.get("AddRetrievalCertificate").ncontrolcode;
        const editId = this.state.controlMap.has("EditRetrievalCertificate") && this.state.controlMap.get("EditRetrievalCertificate").ncontrolcode;
        const completeId = this.state.controlMap.has("CompleteRetrievalCertificate") && this.state.controlMap.get("CompleteRetrievalCertificate").ncontrolcode
        const checkId = this.state.controlMap.has("CheckRetrievalCertificate") && this.state.controlMap.get("CheckRetrievalCertificate").ncontrolcode
        const approveId = this.state.controlMap.has("ApproveRetrievalCertificate") && this.state.controlMap.get("ApproveRetrievalCertificate").ncontrolcode
        const downloadId = this.state.controlMap.has("DownloadRetrievalCertificate") && this.state.controlMap.get("DownloadRetrievalCertificate").ncontrolcode

        const deleteId = this.state.controlMap.has("DeleteRetrievalCertificate") && this.state.controlMap.get("DeleteRetrievalCertificate").ncontrolcode;
        const deleteParam = { operation: "delete" };
        let obj = convertDateValuetoString(this.state.selectedRecord["fromdate"] || (this.props.Login.masterData && this.props.Login.masterData.FromDate),
            this.state.selectedRecord["todate"] || (this.props.Login.masterData && this.props.Login.masterData.ToDate),
            this.props.Login.userInfo)

        let fromDate = obj.fromDate;
        let toDate = obj.toDate;
        const filterParam = {
            inputListName: "RetrievalCertificate",
            selectedObject: "SelectedRetrievalCertificate",
            primaryKeyField: "nretrievalcertificatecode",
            fetchUrl: "retrievalcertificate/getRetrievalCertificate",
            fecthInputObject: { userinfo: this.props.Login.userInfo, fromDate, toDate },
            masterData: this.props.Login.masterData,
            unchangeList: ["FromDate", "ToDate"],
            //ALPD-4487 added the stransdisplaystatus in the filter param 
            searchFieldList: ['sretrievalcertificateno','sbiomaterialtype', 'sprojectname', 'srequestid',
            'stestingmethod', 'spreparationmethod', 'sstorageconditionname', 'sinvestigatorname', 'sorganizationaddress', 'sphoneno','semail','dretrievalcertificatedate','scomment','stransdisplaystatus']


        };
        this.validationColumnList = [
            { "idsName": "IDS_BIOLOGICALMATERIALTYPE", "dataField": "sbiomaterialtype", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_REQUESTID", "dataField": "srequestid", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_PROJECTTYPE", "dataField": "nprojecttypecode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "idsName": "IDS_PROJECTNAME", "dataField": "nprojectmastercode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "idsName": "IDS_INVESTIGATORNAME", "dataField": "sinvestigatorname", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_PREPARATIONMETHOD", "dataField": "spreparationmethod", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_TESTINGMETHOD", "dataField": "stestingmethod", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_STORAGECONDITION", "dataField": "nstorageconditioncode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
          //  { "idsName": "IDS_PHONE", "dataField": "sphoneno", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
          //  { "idsName": "IDS_EMAILID", "dataField": "semail", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_RETRIEVALCERTIFICATEDATE", "dataField": "dretrievalcertificatedate", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
           // { "idsName": "IDS_ORGANIZATIONADDRESS", "dataField": "sorganizationaddress", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
          //  { "idsName": "IDS_COMMENT", "dataField": "scomment", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }
        ]
        const mandatoryFields = [];
        this.validationColumnList.forEach(item => item.mandatory === true ?
            mandatoryFields.push(item) : ""
        );
        let breadCrumbDataDate = convertDateValuetoString(this.props.Login.masterData && this.props.Login.masterData.FromDate,
            this.props.Login.masterData && this.props.Login.masterData.ToDate,
            this.props.Login.userInfo)

        const breadCrumbData = [
            {
                "label": "IDS_FROM",
                "value": breadCrumbDataDate.breadCrumbFrom
            },
            {
                "label": "IDS_TO",
                "value": breadCrumbDataDate.breadCrumbto
            }
        ];
        return (
            <>
                <ListWrapper className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
                    {breadCrumbData.length > 0 ?
                        <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        </Affix> : ""
                    }
                   
                    <Row noGutters={true}>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                            <ListMaster
                                formatMessage={this.props.intl.formatMessage}
                                screenName={"IDS_RETRIEVALCERTIFICATE"}
                                masterData={this.props.Login.masterData}
                                userInfo={this.props.Login.userInfo}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.RetrievalCertificate}
                                getMasterDetail={(retrievalcertificate) => this.props.getRetrievalCertificateDetail(retrievalcertificate, fromDate, toDate, this.props.Login.userInfo, this.props.Login.masterData)}
                                selectedMaster={this.props.Login.masterData.SelectedRetrievalCertificate}
                                primaryKeyField="nretrievalcertificatecode"
                                mainField="sretrievalcertificateno"
                                firstField="sprojectname"
                                secondField="stransdisplaystatus"
                                isIDSField="Yes"
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={addId}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData}
                                hidePaging={false}
                                openModal={() => this.props.getRetrievalCertificateComboService("IDS_RETRIEVALCERTIFICATE", "create", "nretrievalcertificatecode", null, this.props.Login.masterData, this.props.Login.userInfo, addId)}
                                showFilterIcon={true}
                                showFilter={this.props.Login.showFilter}
                                openFilter={this.openFilter}
                                closeFilter={this.closeFilter}
                                onFilterSubmit={this.onFilterSubmit}


                                filterComponent={[
                                    {
                                        "IDS_RETRIEVALCERTIFICATE":
                                            <RetrievalCertificateFilter
                                                selectedRecord={this.state.selectedRecord || {}}
                                                handleDateChange={this.handleDateChange}
                                                fromDate={fromDate}
                                                toDate={toDate}
                                                userInfo={this.props.Login.userInfo}
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
                            <ContentPanel className="panel-main-content">
                                <Card className="border-0">
                                    {this.props.Login.masterData.RetrievalCertificate && this.props.Login.masterData.RetrievalCertificate.length > 0 && this.props.Login.masterData.SelectedRetrievalCertificate ?
                                        <>
                                            <Card.Header>
                                                <Card.Title>
                                                    <h1 className="product-title-main">{this.props.Login.masterData.SelectedRetrievalCertificate.sretrievalcertificateno}</h1>
                                                </Card.Title>
                                                <Card.Subtitle className="text-muted font-weight-normal">
                                                    <Row>
                                                        <Col md={10} className="d-flex no-padding">
                                                        <h2 className="product-title-sub flex-grow-1">
                                                       
                                                    <span className={`btn btn-outlined ${userStatusCSS} btn-sm ml-3`}>
                                                        <FormattedMessage id={this.props.Login.masterData ?
                                                        this.props.Login.masterData.SelectedRetrievalCertificate ? 
                                                        this.props.Login.masterData.SelectedRetrievalCertificate.stransdisplaystatus:"":""} />
                                                   </span>

                                                   </h2>
                                                        </Col>
                                                        <Col md={2}>
                                                            <div className="d-flex product-category float-right icon-group-wrap">

                                                                <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                    hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                    onClick={() => this.props.getRetrievalCertificateComboService("IDS_RETRIEVALCERTIFICATE", "update", "nretrievalcertificatecode", this.props.Login.masterData.SelectedRetrievalCertificate.nretrievalcertificatecode, this.props.Login.masterData, this.props.Login.userInfo, editId)}
                                                                >
                                                                    <FontAwesomeIcon icon={faPencilAlt} title={this.props.intl.formatMessage({ id: "IDS_EDIT" })} />
                                                                </Nav.Link>
                                                                <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" name="deletemethodname"
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                            
                                                            hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                            onClick={() => this.ConfirmDelete(deleteParam,deleteId)}
                                                        >
                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                            
                                                        </Nav.Link>
                                                                <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                    hidden={this.state.userRoleControlRights.indexOf(completeId) === -1}
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_COMPLETE" })}
                                                                    onClick={() => this.onCompleteClick(completeId)}
                                                                >
                                                               <FontAwesomeIcon icon={faCheckCircle}/>
                                                                </Nav.Link> 
                                                                <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                    hidden={this.state.userRoleControlRights.indexOf(checkId) === -1}
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_CHECK" })}
                                                                    onClick={() => this.onCheckClick(checkId)}
                                                                >
                                                                {/* <FontAwesomeIcon icon={faCheck} /> */}
                                                                <CheckCertificate width='20px' height='20px' className='custom_icons' />
                                                                </Nav.Link> 
                                                                <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                    hidden={this.state.userRoleControlRights.indexOf(approveId) === -1}
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_APPROVE" })}
                                                                    onClick={() => this.onApproveClick(approveId)}
                                                                >
                                                                <FontAwesomeIcon icon={faThumbsUp} />
                                                                </Nav.Link> 
                                                                <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                    hidden={this.state.userRoleControlRights.indexOf(downloadId) === -1}
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DOWNLOADFILE" })}
                                                                    onClick={() =>this.props.generateControlBasedReport(downloadId,this.props.Login.masterData.SelectedRetrievalCertificate,this.props.Login,"nretrievalcertificatecode",this.props.Login.masterData.SelectedRetrievalCertificate.nretrievalcertificatecode)}
                                                                >
                                                                    <DownloadReportbutton width='20px' height='20px' className='custom_icons' />
                                                                {/* <FontAwesomeIcon icon={faCloudDownloadAlt} /> */}
                                                                </Nav.Link> 
                                                            </div>

                                                        </Col>
                                                    </Row>
                                                </Card.Subtitle>
                                            </Card.Header>
                                            <Card.Body>
                                                <Row>
                                                <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_BIOLOGICALMATERIALTYPE" message="Biological Material Type" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedRetrievalCertificate.sbiomaterialtype}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_REQUESTID" message="Request Id" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedRetrievalCertificate.srequestid}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_PROJECTTYPE" message="Project Name" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedRetrievalCertificate.sprojecttypename}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_PROJECTNAME" message="Project Name" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedRetrievalCertificate.sprojectname}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_INVESTIGATORNAME" message="Principal Investigator" /></FormLabel>
                                                            <ReadOnlyText> {this.props.Login.masterData.SelectedRetrievalCertificate.sinvestigatorname}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_EMAILID" message="Email Id" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedRetrievalCertificate.semail}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_PHONENO" message="Phone no" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedRetrievalCertificate.sphoneno}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_ORGANIZATIONADDRESS" message="Organization Address" /></FormLabel>
                                                            <ReadOnlyText> {this.props.Login.masterData.SelectedRetrievalCertificate.sorganizationaddress}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_PREPARATIONMETHOD" message="Method used for preparation" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedRetrievalCertificate.spreparationmethod}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_TESTINGMETHOD" message="Method used for testing" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedRetrievalCertificate.stestingmethod}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_STORAGECONDITION" message="Storage Condition" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedRetrievalCertificate.sstorageconditionname}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_RETRIEVALCERTIFICATEDATE" message="Material Certificate Date" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedRetrievalCertificate.sretrievalcertificatedate && 
                                                            this.props.Login.masterData.SelectedRetrievalCertificate.sretrievalcertificatedate.length > 1 ? 
                                                            this.props.Login.masterData.SelectedRetrievalCertificate.sretrievalcertificatedate.substring(0,10)
                                                        :"-"}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_COMMENTS" message="Comment" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedRetrievalCertificate.scomment}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>

                                                </Row>
                                             
                                            </Card.Body>
                                        </>
                                        : ""
                                    }
                                </Card>
                            </ContentPanel>
                        </Col>
                    </Row>
                </ListWrapper>


                {this.props.Login.openModal &&
                    <SlideOutModal show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam || []}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={mandatoryFields}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            :
                            <AddRetrievalCertificate
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                handleDateChange={this.handleDateChange}
                                formatMessage={this.props.intl.formatMessage}
                                projectList={this.props.Login.projectList || []}
                                projectTypeList={this.props.Login.projectTypeList || []}
                                storageconditionList={this.props.Login.storageconditionList || []}
                                currentTime={this.props.Login.currentTime || []}
                                selectedRetrievalCertificate={this.props.Login.masterData.SelectedRetrievalCertificate || {}}
                                operation={this.props.Login.operation}
                                inputParam={this.props.Login.inputParam}
                                userInfo={this.props.Login.userInfo}
                            />
                        }
                    />
                }
            </>
        );
    }

    ConfirmDelete = (deleteParam,deleteID) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteRecord(deleteParam,deleteID));
    }

    deleteRecord = (deleteParam, nControlcode) => {

        let objdate = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);

        let fromDate = objdate.fromDate;
        let toDate = objdate.toDate;

        const postParam = {
            inputListName: "RetrievalCertificate", selectedObject: "SelectedRetrievalCertificate",
            primaryKeyField: "nretrievalcertificatecode",
            primaryKeyValue: this.props.Login.masterData.SelectedRetrievalCertificate.nretrievalcertificatecode,
            fetchUrl: "retrievalcertificate/getRetrievalCertificate",
            fecthInputObject: { userinfo: this.props.Login.userInfo,"fromDate":fromDate,"toDate":toDate },
        }
        

        const inputParam = {
                                classUrl: this.props.Login.inputParam.classUrl,
                                methodUrl: "RetrievalCertificate",
                                displayName:this.props.Login.screenName,
                                inputData: {["retrievalcertificate"] :this.props.Login.masterData.SelectedRetrievalCertificate,   
                                "fromDate":fromDate,"toDate":toDate,"userinfo": this.props.Login.userInfo},
                                operation:deleteParam.operation,
            dataState: this.state.dataState ,
            postParam
                            }       
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, nControlcode)){
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign:true, screenData:{inputParam, masterData:this.props.Login.masterData}, 
                    openModal:true, screenName: this.props.Login.screenName && this.props.intl.formatMessage({ id:this.props.Login.screenName}),
                    operation:deleteParam.operation
                    }
                }
            this.props.updateStore(updateInfo);
        }
        else{
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }

    componentDidUpdate(previousProps) {
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

    generateBreadCrumData() {
        const breadCrumbData = [];

        if (this.props.Login.masterData && this.props.Login.masterData.FromDate) {

            let obj = convertDateValuetoString(this.props.Login.masterData.FromDate,
                this.props.Login.masterData.ToDate,
                this.props.Login.userInfo);

            breadCrumbData.push(
                {
                    "label": "IDS_FROM",
                    "value": obj.breadCrumbFrom
                },
                {
                    "label": "IDS_TO",
                    "value": obj.breadCrumbto
                },
            );
        }
        return breadCrumbData;
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

        let inputData = [];
        this.searchRef.current.value = "";
        inputData["userinfo"] = this.props.Login.userInfo;
        let fromDate = this.props.Login.masterData.FromDate;
        let toDate = this.props.Login.masterData.ToDate;
       // if (isFilterSubmit) {
            let selectedRecord = this.state.selectedRecord || {};
            if (selectedRecord && selectedRecord["fromdate"] !== undefined) {
                fromDate = selectedRecord["fromdate"];
            }
            if (selectedRecord && selectedRecord["todate"] !== undefined) {
                toDate = selectedRecord["todate"];
            }
      //  }
        let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo);
        const inputParam = {
            inputData: {
                "userinfo": this.props.Login.userInfo,
                fromDate: obj.fromDate,
                toDate: obj.toDate,
                currentDate: null
            },
            classUrl: "retrievalcertificate",
            methodUrl: "RetrievalCertificate",
            displayName: "IDS_RETRIEVALCERTIFICATE",

            userInfo: this.props.Login.userInfo
        };
        this.props.getRetrievalCertificateForFilter(inputParam);
        // }
      }
    reloadData = () => {

        this.searchRef.current.value = "";
        let fromDate = this.props.Login.masterData.FromDate;
        let toDate = this.props.Login.masterData.ToDate;
        let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo);
        const inputParam = {
            inputData: {
                "userinfo": this.props.Login.userInfo,
                fromDate: obj.fromDate,
                toDate: obj.toDate,
                currentDate: null
            },
            classUrl: "retrievalcertificate",
            methodUrl: "RetrievalCertificate",
            displayName: "IDS_RETRIEVALCERTIFICATE",

            userInfo: this.props.Login.userInfo
        };
        this.props.reloadRetrievalCertificate(inputParam);
    }

    onCompleteClick = (completeId) => {
       // if(this.props.Login.masterData.SelectedRetrievalCertificate.ntransactionstatus !== transactionStatus.COMPLETED){
       // const ncontrolCode = this.state.controlMap.has("CompleteRetrievalCertificate") && this.state.controlMap.get("CompleteRetrievalCertificate").ncontrolcode
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        //add               
        let postParam = undefined;
        inputData["retrievalcertificate"] = { "nretrievalcertificatecode": this.props.Login.masterData.SelectedRetrievalCertificate["nretrievalcertificatecode"] ? this.props.Login.masterData.SelectedRetrievalCertificate["nretrievalcertificatecode"].Value : "" };
        inputData["retrievalcertificate"] = this.props.Login.masterData.SelectedRetrievalCertificate;

        postParam = { inputListName: "RetrievalCertificate", selectedObject: "SelectedRetrievalCertificate", primaryKeyField: "nretrievalcertificatecode" };

        let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);

        let fromDate = obj.fromDate;
        let toDate = obj.toDate;
        inputData["fromDate"] = fromDate;
        inputData["toDate"] = toDate;

        const inputParam = {
            inputData: {
                "userinfo": this.props.Login.userInfo,
                fromDate, toDate,
            },
            classUrl: 'retrievalcertificate',
            methodUrl: "RetrievalCertificate",
            inputData: inputData,
            operation: "complete", postParam
        }
        let saveType;

        const masterData = this.props.Login.masterData;

        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, completeId);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },openModal:true, saveType, operation: "complete"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    // }
    // else{
    //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD"}));
    // }

    }
    onCheckClick = (checkId) => {
      //  if(this.props.Login.masterData.SelectedRetrievalCertificate.ntransactionstatus !== transactionStatus.COMPLETED){
       // const ncontrolCode = this.state.controlMap.has("CompleteRetrievalCertificate") && this.state.controlMap.get("CompleteRetrievalCertificate").ncontrolcode
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        //add               
        let postParam = undefined;
        inputData["retrievalcertificate"] = { "nretrievalcertificatecode": this.props.Login.masterData.SelectedRetrievalCertificate["nretrievalcertificatecode"] ? this.props.Login.masterData.SelectedRetrievalCertificate["nretrievalcertificatecode"].Value : "" };
        inputData["retrievalcertificate"] = this.props.Login.masterData.SelectedRetrievalCertificate;

        postParam = { inputListName: "RetrievalCertificate", selectedObject: "SelectedRetrievalCertificate", primaryKeyField: "nretrievalcertificatecode" };

        let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);

        let fromDate = obj.fromDate;
        let toDate = obj.toDate;
        inputData["fromDate"] = fromDate;
        inputData["toDate"] = toDate;

        const inputParam = {
            inputData: {
                "userinfo": this.props.Login.userInfo,
                fromDate, toDate,
            },
            classUrl: 'retrievalcertificate',
            methodUrl: "RetrievalCertificate",
            inputData: inputData,
            operation: "check", postParam
        }
        let saveType;

        const masterData = this.props.Login.masterData;

        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, checkId);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, openModal:true,saveType, operation: "check"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    // }
    // else{
    //     toast.warn(this.props.intl.formatMessage({ id: this.props.Login.masterData.SelectedRetrievalCertificate.ntransactionstatus === transactionStatus.CONDUCTED ? "IDS_TESTTRAININGALREADYCONDUCTED" : "IDS_TESTTRAININGALREADYCOMPLETED"}));
    // }

    }
    onApproveClick = (approveId) => {
        //if(this.props.Login.masterData.SelectedRetrievalCertificate.ntransactionstatus !== transactionStatus.COMPLETED){
       // const ncontrolCode = this.state.controlMap.has("CompleteRetrievalCertificate") && this.state.controlMap.get("CompleteRetrievalCertificate").ncontrolcode
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        //add               
        let postParam = undefined;
        inputData["retrievalcertificate"] = { "nretrievalcertificatecode": this.props.Login.masterData.SelectedRetrievalCertificate["nretrievalcertificatecode"] ? this.props.Login.masterData.SelectedRetrievalCertificate["nretrievalcertificatecode"].Value : "" };
        inputData["retrievalcertificate"] = this.props.Login.masterData.SelectedRetrievalCertificate;

        postParam = { inputListName: "RetrievalCertificate", selectedObject: "SelectedRetrievalCertificate", primaryKeyField: "nretrievalcertificatecode" };

        let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);

        let fromDate = obj.fromDate;
        let toDate = obj.toDate;
        inputData["fromDate"] = fromDate;
        inputData["toDate"] = toDate;

        const inputParam = {
            inputData: {
                "userinfo": this.props.Login.userInfo,
                fromDate, toDate,
            },
            classUrl: 'retrievalcertificate',
            methodUrl: "RetrievalCertificate",
            inputData: inputData,
            operation: "approve", postParam
        }
        let saveType;

        const masterData = this.props.Login.masterData;

        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, approveId);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },openModal:true, saveType, operation: "approve"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    // }
    // else{
    //     toast.warn(this.props.intl.formatMessage({ id: this.props.Login.masterData.SelectedRetrievalCertificate.ntransactionstatus === transactionStatus.CONDUCTED ? "IDS_TESTTRAININGALREADYCONDUCTED" : "IDS_TESTTRAININGALREADYCOMPLETED"}));
    // }

    }

    

    onDownloadClick = (ncontrolCode) => {
            const inputParam = {
                    //classUrl: 'retrievalcertificate',
                    //methodUrl: "RetrievalReportCertificate",
                    nretrievalcertificatecode:this.props.Login.masterData.SelectedRetrievalCertificate.nretrievalcertificatecode,
                    nretrievalcertificatecode_componentcode: REPORTTYPE.CONTROLBASED,
                    nretrievalcertificatecode_componentname: designComponents.NUMBER,
                    primaryKeyField: "nretrievalcertificatecode", //parametermapping 
                    stablename:"retrievalcertificate",
                    sreportlink:this.props.Login.reportSettings[15],
                    smrttemplatelink:this.props.Login.reportSettings[16],
                    nreporttypecode: REPORTTYPE.MISREPORT,
                    ncontrolcode: ncontrolCode,
                    userinfo: this.props.Login.userInfo,
                    ntranscode:this.props.Login.masterData.SelectedRetrievalCertificate.ntransactionstatus,
                    primaryKeyValue:this.props.Login.masterData.SelectedRetrievalCertificate.nretrievalcertificatecode
            }
            this.props.generateControlBasedReport(inputParam);
       
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



    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete"
                || this.props.Login.operation === "complete" || this.props.Login.operation === "check"
                  || this.props.Login.operation === "approve") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = "";
                selectedRecord['esigncomments'] = "";
                selectedRecord['esignreason']="";
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

    onComboChange = (comboData, fieldName,caseNo) => {
        const selectedRecord = this.state.selectedRecord || {};
        //selectedRecord[fieldName] = comboData;
        if (comboData !== null) {
            if (fieldName === "nprojectmastercode") {
              //  if (selectedRecord&&selectedRecord["nprojectmastercode"]&&selectedRecord["nprojectmastercode"].value!==comboData.value) {
                    selectedRecord[fieldName] = comboData;
                    this.props.getProjectBasedUsers(
                        comboData.item.nprojectmastercode,
                        this.props.Login.userInfo,
                        selectedRecord,
                        this.props.Login.screenName
                    );
               // }
            } else if (fieldName === "nprojecttypecode") {
                selectedRecord[fieldName] = comboData;
                this.props.getProjectBasedOnProjectType(comboData.item.nprojecttypecode, this.props.Login.userInfo, selectedRecord);
            }
            else {
                selectedRecord[fieldName] = comboData;
                this.setState({ selectedRecord });
            }

                 
            
        }
    }

    
    onInputOnChange = (event, optional,name) => {
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
            if (event.target.name === "sphoneno") {
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
    handleDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }

    onSaveClick = (saveType, formRef) => {


        let inputData = [];
        if (this.state.selectedRecord['semail'] && this.state.selectedRecord['semail'] !== "" && this.state.selectedRecord['semail'] !== "null" ? validateEmail(this.state.selectedRecord["semail"]) : true) {

            inputData["ncontrolcode"] = this.props.Login.ncontrolCode;
            inputData["userinfo"] = this.props.Login.userInfo;
            let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);

            let fromDate = obj.fromDate;
            let toDate = obj.toDate;
            inputData["fromDate"] = fromDate;
            inputData["toDate"] = toDate;

            let postParam = undefined;
        
            if (this.props.Login.operation === "update") {
                // edit
                postParam = { inputListName: "RetrievalCertificate", selectedObject: "SelectedRetrievalCertificate", primaryKeyField: "nretrievalcertificatecode" };
                inputData["retrievalcertificate"] = JSON.parse(JSON.stringify(this.props.Login.selectedRecord));

                this.retrievalcertificateFieldList.map(item => {
                    return inputData["retrievalcertificate"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
                })
            }
            else {
                //add               
                inputData["retrievalcertificate"] = { "nsitecode": this.props.Login.userInfo.ntranssitecode };


                this.retrievalcertificateFieldList.map(item => {
                    return inputData["retrievalcertificate"][item] = this.state.selectedRecord[item]
                });

            }
            if (this.state.selectedRecord["dretrievalcertificatedate"]) {
                inputData["retrievalcertificate"]["dretrievalcertificatedate"] = formatInputDate(
                    this.state.selectedRecord["dretrievalcertificatedate"],
                    false
                );
            }

            inputData["retrievalcertificate"]["nstorageconditioncode"] = this.state.selectedRecord["nstorageconditioncode"] ? this.state.selectedRecord["nstorageconditioncode"].value : "-1";
            inputData["retrievalcertificate"]["nprojectmastercode"] = this.state.selectedRecord["nprojectmastercode"] ? this.state.selectedRecord["nprojectmastercode"].value : "-1";
            inputData["retrievalcertificate"]["nprojecttypecode"] = this.state.selectedRecord["nprojecttypecode"] ? this.state.selectedRecord["nprojecttypecode"].value : "-1";

            const inputParam = {
                inputData: {
                    "userinfo": this.props.Login.userInfo,
                    fromDate, toDate,
                },
                classUrl: "retrievalcertificate", //this.props.Login.inputParam.classUrl,
                methodUrl: "RetrievalCertificate",
                inputData: inputData,
                operation: this.props.Login.operation,
                saveType, formRef, postParam, searchRef: this.searchRef
            }
            const masterData = this.props.Login.masterData;

            if (
                showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData }, saveType
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal")
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTERVALIDEMAIL" }));
        }
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
    
    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
    }
}
export default connect(mapStateToProps, {
    callService, crudMaster, validateEsignCredential,filterColumnData ,
    updateStore, getRetrievalCertificateForFilter, getRetrievalCertificateComboService, getProjectBasedUsers, getRetrievalCertificateDetail,
    reloadRetrievalCertificate,reportRetrievalCetificate,generateControlBasedReport,
    reloadRetrievalCertificate,reportRetrievalCetificate, getProjectBasedOnProjectType
})(injectIntl(RetrievalCertificate));

