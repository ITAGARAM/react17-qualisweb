import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import { Affix } from 'rsuite';

import { Row, Col, Card, Nav, FormGroup, FormLabel, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faUserTimes } from '@fortawesome/free-solid-svg-icons';

import PerfectScrollbar from 'react-perfect-scrollbar';

import 'react-perfect-scrollbar/dist/css/styles.css';
import { ReadOnlyText, ContentPanel } from '../../../components/App.styles';

import {
    callService, getReportMasterComboService, updateStore,
    crudMaster, validateEsignCredential, getUserDetail, viewUserFile,
    getUserComboService, getUserMultiRoleComboDataService, getUserMultiDeputyComboDataService,
    getUserSiteDetail, getUserSiteComboService, filterColumnData
} from '../../../actions';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';

import { showEsign, getControlMap, validatePhoneNumber, create_UUID } from '../../../components/CommonScript';
import ListMaster from '../../../components/list-master/list-master.component';
import SlideOutModal from '../../../components/SlideOutModal';
import ConfirmDialog from '../../../components/confirm-alert/confirm-alert.component';
import { reportTypeEnum, transactionStatus } from '../../../components/Enumeration';

import Esign from '../../audittrail/Esign';
import AddReportMaster from './AddReportMaster';




const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class ReportDesigner extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            masterStatus: "",
            error: "",
            selectedRecord: {},
            operation: "",
            selectedReport: undefined,
            screenName: undefined,
            userRoleControlRights: [],
            controlMap: new Map()

        };
        this.searchRef = React.createRef();

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

        let statusCss = "outline-secondary";
        let activeIconCSS = "fa fa-check"
        if (this.props.Login.masterData.SelectedReport && this.props.Login.masterData.SelectedReport.ntransactionstatus === transactionStatus.ACTIVE) {
            statusCss = "outline-success";
        }
        else if (this.props.Login.masterData.SelectedReport && this.props.Login.masterData.SelectedReport.ntransactionstatus === transactionStatus.DEACTIVE) {
            activeIconCSS = "";
        }

        const addId = this.state.controlMap.has("AddReportDesigner") && this.state.controlMap.get("AddReportDesigner").ncontrolcode;
        const editId = this.state.controlMap.has("EditReportDesigner") && this.state.controlMap.get("EditReportDesigner").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteReportDesigner") && this.state.controlMap.get("DeleteReportDesigner").ncontrolcode

        const filterParam = {
            selectedRecord:undefined,inputListName: "ReportMaster", selectedObject: "SelectedReportMaster", primaryKeyField: "nreportcode",
            fetchUrl: "reportconfig/getReportMaster", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData
        };

        const addParam = {
            screenName: "Report", operation: "create", primaryKeyName: "nreportcode",
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
            ncontrolcode: addId
        }

        const editParam = {
            screenName: "Report", operation: "update", primaryKeyName: "nreportcode",
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
            ncontrolcode: editId, inputListName: "ReportMaster", selectedObject: "SelectedReportMaster"
        };

        return (

            <>
                {/* Start of get display*/}
                <div className="client-listing-wrap mtop-4">
                    <Row noGutters={true}>
                        <Col md={4}>
                            <Row noGutters={true}><Col md={12}>
                                <PerfectScrollbar>asdasdasdsad
                                    <div className="list-fixed-wrap">
                                        <Affix top={65}>
                                            <ListMaster
                                                screenName={"Report"}
                                                masterData={this.props.Login.masterData}
                                                userInfo={this.props.Login.userInfo}
                                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.ReportMaster}
                                                getMasterDetail={(report) => this.props.getReportMasterDetail(report, this.props.Login.userInfo, this.props.Login.masterData)}
                                                selectedMaster={this.props.Login.masterData.SelectedReportMaster}
                                                primaryKeyField="nreportcode"
                                                mainField="sreportname"
                                                firstField="sreporttypename"
                                                secondField="sactivestatus"
                                                //isIDSField = "Yes"
                                                filterColumnData={this.props.filterColumnData}
                                                filterParam={filterParam}
                                                userRoleControlRights={this.state.userRoleControlRights}
                                                addId={addId}
                                                searchRef={this.searchRef}
                                                reloadData={this.reloadData}
                                                openModal={() => this.props.getReportMasterComboService(addParam)}
                                                isMultiSelecct={false}
                                            />
                                        </Affix>
                                        {/* _mount_  */}

                                    </div>
                                </PerfectScrollbar>


                            </Col></Row>
                        </Col>
                        <Col md={8}>
                            <Row><Col md={12}>
                                <ContentPanel className="panel-main-content">
                                    <Card className="border-0">
                                        {this.props.Login.masterData.ReportMaster && this.props.Login.masterData.ReportMaster.length > 0
                                            && this.props.Login.masterData.SelectedReportMaster ?
                                            <>
                                                <Card.Header>
                                                    <Card.Title className="product-title-main">
                                                        {this.props.Login.masterData.SelectedReportMaster.sreportname}
                                                    </Card.Title>
                                                    <Card.Subtitle>
                                                        <div className="d-flex product-category">
                                                            <h2 className="product-title-sub flex-grow-1">

                                                                <span className={`btn btn-outlined ${statusCss} btn-sm ml-3`}>
                                                                    {activeIconCSS !== "" ? <i class={activeIconCSS}></i> : ""}
                                                                    {this.props.Login.masterData.SelectedReportMaster.sactivestatus}
                                                                </span>
                                                            </h2>
                                                            <div className="d-inline">
                                                                <Nav.Link name="editReportMaster" hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                    className="btn btn-circle outline-grey mr-2"
                                                                    onClick={() => this.props.getReportMasterComboService(editParam)}
                                                                >
                                                                    <FontAwesomeIcon icon={faPencilAlt} />
                                                                </Nav.Link>
                                                                <Nav.Link name="deleteReportMaster" className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                    hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}>
                                                                    <ConfirmDialog
                                                                        name="deleteMessage"
                                                                        message={this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                                                                        doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}
                                                                        doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                                        icon={faTrashAlt}
                                                                        title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                        handleClickDelete={() => this.deleteReportMaster("ReportMaster", this.props.Login.masterData.SelectedReportMaster,
                                                                            "delete", deleteId)}
                                                                    />
                                                                </Nav.Link>

                                                            </div>
                                                        </div>

                                                    </Card.Subtitle>
                                                </Card.Header>
                                                <Card.Body>
                                                    <Card.Text>
                                                        <Row>

                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_REPORTTYPE" message="Report Type" /></FormLabel>
                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedReportMaster.sreporttypename}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_REGISTRATIONTYPE" message="Registration Type" /></FormLabel>
                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedReportMaster.sregtypename}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>

                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_REGISTRATIONSUBTYPE" message="Registration Sub Type" /></FormLabel>
                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedReportMaster.sregsubtypename}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>

                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_MENUNAME" message="Menu Name" /></FormLabel>
                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedReportMaster.smenuname}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>

                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_DESCRIPTION" message="Description" /></FormLabel>
                                                                    <ReadOnlyText>
                                                                        {this.props.Login.masterData.SelectedReportMaster.sdescription === null || this.props.Login.masterData.SelectedReportMaster.sdescription.length === 0 ? '-' :
                                                                            this.props.Login.masterData.SelectedReportMaster.sdescription}
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>

                                                        </Row>
                                                    </Card.Text>
                                                    {/* <UserTabs   
                                                operation={this.props.Login.operation}
                                                inputParam={this.props.Login.inputParam}  
                                                screenName={this.props.Login.screenName}  
                                                userInfo ={this.props.Login.userInfo}  
                                                masterData =  {this.props.Login.masterData}           
                                                crudMaster={this.props.crudMaster} 
                                                errorCode ={this.props.Login.errorCode}
                                                masterStatus={this.props.Login.masterStatus}
                                                openChildModal={this.props.Login.openChildModal}
                                                roleList={this.props.Login.roleListUserMultiRole}
                                                userRoleList={this.props.Login.userRoleList || []}
                                                deputyUserList={this.props.Login.deputyUserList || []}                                                       
                                                updateStore={this.props.updateStore}
                                                selectedRecord ={this.props.Login.selectedRecord}
                                                getUserMultiRoleComboDataService={this.props.getUserMultiRoleComboDataService}  
                                                getUserMultiDeputyComboDataService={this.props.getUserMultiDeputyComboDataService}
                                                getUserSiteDetail={this.props.getUserSiteDetail}
                                                getUserSiteComboService={this.props.getUserSiteComboService}
                                                siteList={this.props.Login.siteList || []}
                                                ncontrolCode={this.props.Login.ncontrolCode}
                                                userRoleControlRights={this.state.userRoleControlRights}
                                                esignRights={this.props.Login.userRoleControlRights}
                                                screenData={this.props.Login.screenData}
                                                validateEsignCredential={this.props.validateEsignCredential}
                                                loadEsign={this.props.Login.loadEsign}
                                                controlMap = {this.state.controlMap}
                                                selectedId={this.props.Login.selectedId}
                                                dataState={this.props.Login.dataState}
                                        /> */}
                                                </Card.Body>


                                            </>
                                            : ""
                                        }
                                    </Card>
                                </ContentPanel>
                            </Col></Row>
                        </Col>
                    </Row>
                </div>

                {/* End of get display*/}

                {/* Start of Modal Sideout for Creation */}
                {/* Below Condition Added to avoid unwanted rendering of SlideOut */}
                {this.props.Login.openModal ?
                    <SlideOutModal show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                //formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : <AddReportMaster
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                onNumericInputOnChange={this.onNumericInputOnChange}
                                //formatMessage={this.props.intl.formatMessage}
                                reportTypeList={this.props.Login.reportTypeList || []}
                                coaReportTypeList={this.props.Login.coaReportTypeList || []}
                                regTypeList={this.props.Login.regTypeList || []}
                                sampleTypeList={this.props.Login.sampleTypeList || []}
                                regSubTypeList={this.props.Login.regSubTypeList || []}
                                sectionList={this.props.Login.sectionList || []}
                                reportModuleList={this.props.Login.reportModuleList || []}
                                selectedUser={this.props.Login.masterData.SelectedUser || {}}
                                operation={this.props.Login.operation}
                                inputParam={this.props.Login.inputParam}
                                onDropImage={this.onDropImage}
                                deleteFile={this.deleteAttachment}
                                actionType={this.state.actionType}
                            />
                        }
                    /> : ""}
                {/* End of Modal Sideout for User Creation */}
            </>
        );
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

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        //let operation = this.props.Login.operation;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "retire") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            }
            else {
                loadEsign = false;
                // let signImageFile = selectedRecord["ssignimgname"];
                // if(signImageFile && Array.isArray(signImageFile) && signImageFile.length > 0) {
                //     selectedRecord["ssignimgname"] = signImageFile[0].name
                // }
                // let userImageFile = selectedRecord["suserimgname"];
                // if(userImageFile && Array.isArray(userImageFile) && userImageFile.length > 0) {
                //     selectedRecord["suserimgname"] = userImageFile[0].name
                // }                
            }
        }
        else {
            openModal = false;
            selectedRecord = {};
            //operation=undefined;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal, loadEsign, selectedRecord, selectedId: null, //operation:operation
            }
        }
        this.props.updateStore(updateInfo);

    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};

        if (fieldName === "nreporttypecode") {
            selectedRecord[fieldName] = comboData;
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { selectedRecord }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord });
        }
    }

    onNumericInputOnChange = (value, name) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[name] = value;
        this.setState({ selectedRecord });
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};

        if (event.target.type === 'checkbox') {
            if (event.target.name === "ntransactionstatus")
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
            else
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;

        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }


    onDropImage = (attachedFiles, fieldName, maxSize) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles, maxSize)
        this.setState({ selectedRecord, actionType: "new" });
    }



    onSaveClick = (saveType, formRef) => {

        const reportFile = this.state.selectedRecord.sfilename;

        let isFileEdited = transactionStatus.NO;
        const formData = new FormData();

        let postParam = undefined;
        let reportmaster = { "nsitecode": this.props.Login.userInfo.nmastersitecode };

        if (this.props.Login.operation === "update") {
            // edit
            // postParam =  { inputListName : "Users", selectedObject : "SelectedUser", primaryKeyField : "nusercode" };
            // userData["users"] = JSON.parse(JSON.stringify(this.props.Login.selectedRecord));

            // this.userFieldList.map(item=>{
            //     return userData["users"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] :"";
            // })   
            // console.log("users data:", userData);
        }
        else {
            //add               
            reportmaster["nreporttypecode"] = this.state.selectedRecord["nreporttypecode"].value;

            if (this.state.selectedRecord["nreporttypecode"].value === reportTypeEnum.COA) {
                reportmaster["nsampletypecode"] = this.state.selectedRecord["nsampletypecode"].value;
                reportmaster["nregtypecode"] = this.state.selectedRecord["nregtypecode"].value;
                reportmaster["nregsubtypecode"] = this.state.selectedRecord["nregsubtypecode"].value;
            }
            else {
                reportmaster["nsampletypecode"] = -1;
                reportmaster["nregtypecode"] = -1;
                reportmaster["nregsubtypecode"] = -1;

            }
            reportmaster["sreportname"] = this.state.selectedRecord["sreportname"];
            reportmaster["sdecription"] = this.state.selectedRecord["sdecription"];
            reportmaster["ntransactionstatus"] = transactionStatus.ACTIVE;
            reportmaster["nreportmodulecode"] = this.state.selectedRecord["nreportmodulecode"].value;

        }
        let reportdetails = {
            ncoareporttypecode: this.state.selectedRecord["nreporttypecode"].value === reportTypeEnum.COA ?
                this.state.selectedRecord["ncoareporttypecode"].value : -1,
            nsectioncode: this.state.selectedRecord["nreporttypecode"].value === reportTypeEnum.COA ?
                this.state.selectedRecord["nsectioncode"].value : -1,
            nversionno: -1,
            ntransactionstatus: transactionStatus.DRAFT,
            nisplsqlquery: this.state.selectedRecord["nisplsqlquery"]
        };
        if (reportFile && Array.isArray(reportFile) && reportFile.length > 0) {

            const splittedFileName = reportFile[0].name.split('.');
            const fileExtension = reportFile[0].name.split('.')[splittedFileName.length - 1];
            const uniquefilename = this.state.selectedRecord.sfilename == "" ?
                this.state.selectedRecord.sfilename : create_UUID() + '.' + fileExtension;

            reportdetails["sfilename"] = reportFile[0].name;
            reportdetails["ssystemfilename"] = uniquefilename;

            formData.append("uploadedFile0", reportFile[0]);
            formData.append("uniquefilename0", uniquefilename);
            isFileEdited = transactionStatus.YES;
            //reportmaster["sfilename"] = "";
        }
        else {
            if (this.props.Login.operation === "update") {
                // if (signImageFile === ""){
                //     isFileEdited = transactionStatus.YES;
                //     userfile["ssignimgname"] =  null;
                //     userfile["ssignimgftp"]  = null;
                // }
                // else{
                //     userfile["ssignimgname"] =  userData["users"]["ssignimgname"];
                //     userfile["ssignimgftp"]  = userData["users"]["ssignimgftp"];
                // }
            }
        }

        formData.append("isFileEdited", isFileEdited);
        formData.append("filecount", 1);
        formData.append("reportdetails", JSON.stringify(reportdetails));
        formData.append("userinfo", JSON.stringify(this.props.Login.userInfo));
        formData.append("reportmaster", JSON.stringify(reportmaster));
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "ReportDesigner",
            //  inputData: inputData,
            inputData: { userinfo: this.props.Login.userInfo },
            formData: formData,
            isFileupload: true,
            operation: this.props.Login.operation,
            saveType, formRef, postParam, searchRef: this.searchRef
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
            this.props.crudMaster(inputParam, masterData, "openModal");
        }

    }

    deleteAttachment = (event, file, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName], file)

        this.setState({
            selectedRecord, actionType: "delete" //fileToDelete:file.name 
        });
    }



    deleteOrRetireUser = (methodUrl, selectedUser, operation, ncontrolCode) => {
        if (selectedUser.ntransactionstatus === transactionStatus.RETIRED) {
            let message = "IDS_CANNOTDELETERETIREDUSER";
            if (operation === "retire") {
                message = "IDS_USERALREADYRETIRED";
            }
            toast.warn(this.props.intl.formatMessage({ id: message }));
        }
        else {

            const postParam = {
                inputListName: "Users", selectedObject: "SelectedUser",
                primaryKeyField: "nusercode",
                primaryKeyValue: selectedUser.nusercode,
                fetchUrl: "users/getUsers",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }

            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl, postParam,
                inputData: {
                    "userinfo": this.props.Login.userInfo,
                    "users": selectedUser
                },
                operation
            }

            const masterData = this.props.Login.masterData;

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },
                        openModal: true, screenName: "User", operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
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
        this.searchRef.current.value = "";
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: "users",
            methodUrl: "Users",
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
    }
}
export default connect(mapStateToProps, { callService, getReportMasterComboService, updateStore, crudMaster })(injectIntl(ReportDesigner));

