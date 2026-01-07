import React from 'react'
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faThumbsUp, faCopy } from '@fortawesome/free-solid-svg-icons';//, faUserTimes,faTrash,
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import {
    callService, crudMaster, validateEsignCredential, updateStore, getPasswordPolicyDetail,
    getPasswordPolicyComboService, getCopyUseRolePolicy, comboChangeUserRolePolicy, filterColumnData
} from '../../actions';
import rsapi from '../../rsapi';
//import { callService, crudMaster } from '../../actions';
import { ContentPanel } from '../../components/App.styles';
import { constructOptionList, searchData, sortData, showEsign, getControlMap } from '../../components/CommonScript';
import ListMaster from '../../components/list-master/list-master.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Axios from 'axios';
import UserRoleFilter from './UserRoleFilter';
import AddPasswordPolicy from './AddPasswordPolicy';
import UserRolePolicy from './UserRolePolicy';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from '../../actions/LoginTypes';
import Esign from '../audittrail/Esign';
import { transactionStatus } from '../../components/Enumeration';
// import ConfirmDialog from '../../components/confirm-alert/confirm-alert.component';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
// import { Tooltip } from '@progress/kendo-react-tooltip';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import { Affix } from 'rsuite';
// import ReactTooltip from 'react-tooltip';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class PasswordPolicy extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            isOpen: false,
            passwordPolicyData: [], userRolePolicyData: [],

            masterStatus: "",
            error: "",
            selectedRecord: {},
            operation: "",

            screenName: undefined,
            userLogged: true,
            selectedPasswordPolicy: undefined,
            selectedcombo: undefined, selectedcomboUserRole: undefined,
            userRoleControlRights: [],
            controlMap: new Map(),
            sidebarview: false,
            showAccordian: true, userRole: []
        };
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();

        this.policyFieldList = ['spolicyname', 'nminnoofnumberchar', 'nminnooflowerchar', 'nminnoofupperchar', 'nminnoofspecialchar',
            'nminpasslength', 'nmaxpasslength', 'nnooffailedattempt', 'nideallocktime', 'nexpirypolicyrequired', 'nexpirypolicy',
            'nremainderdays', 'scomments'];//'nmahcode',

        this.searchFieldList = ["nexpirypolicy", "nideallocktime", "nmaxpasslength", "nminnooflowerchar", "nminnoofnumberchar",
            "nminnoofspecialchar", "nminnoofupperchar", "nminpasslength", "nnooffailedattempt", "scomments",
            "sexpirystatus", "spolicyname", "stransstatus"];

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
        // if (props.Login.selectedRecord === undefined) {
        //     return { selectedRecord: {} }
        // }
        return null;
    }

    render() {

        let userStatusCSS = "outline-secondary";
        if ((this.props.Login.masterData.SelectedPasswordPolicy && this.props.Login.masterData.SelectedPasswordPolicy.ntransactionstatus === transactionStatus.ACTIVE)
            || (this.props.Login.masterData.SelectedPasswordPolicy && this.props.Login.masterData.SelectedPasswordPolicy.ntransactionstatus === transactionStatus.APPROVED)) {
            userStatusCSS = "outline-success";
        }
        else if (this.props.Login.masterData.SelectedPasswordPolicy && this.props.Login.masterData.SelectedPasswordPolicy.ntransactionstatus === transactionStatus.RETIRED) {
            userStatusCSS = "outline-danger";
        }

        const addId = this.state.controlMap.has("AddPasswordPolicy") && this.state.controlMap.get("AddPasswordPolicy").ncontrolcode;
        const editId = this.state.controlMap.has("EditPasswordPolicy") && this.state.controlMap.get("EditPasswordPolicy").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeletePasswordPolicy") && this.state.controlMap.get("DeletePasswordPolicy").ncontrolcode
        const approveId = this.state.controlMap.has("ApprovePasswordPolicy") && this.state.controlMap.get("ApprovePasswordPolicy").ncontrolcode
        const copyId = this.state.controlMap.has("CopyPasswordPolicy") && this.state.controlMap.get("CopyPasswordPolicy").ncontrolcode
        const filterParam = {
            inputListName: "PasswordPolicy", selectedObject: "SelectedPasswordPolicy", primaryKeyField: "npolicycode",
            fetchUrl: "passwordpolicy/getPasswordPolicy", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData, searchFieldList: this.searchFieldList
        };
        this.validationColumnList = [
            { "idsName": "IDS_POLICYNAME", "dataField": "spolicyname", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_MINNUMBERCHAR", "dataField": "nminnoofnumberchar", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_MINLOWERCHAR", "dataField": "nminnooflowerchar", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_MINUPPERCHAR", "dataField": "nminnoofupperchar", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_MINSPECIALCHAR", "dataField": "nminnoofspecialchar", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_MINPASSWORDLENGTH", "dataField": "nminpasslength", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_MAXPASSWORDLENGTH", "dataField": "nmaxpasslength", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_NOOFFAILEDATTEPT", "dataField": "nnooffailedattempt", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            //{ "idsName": "IDS_EXPIRYPOLICY", "dataField": "nexpirypolicy", "width": "200px","mandatory": true },
            //{ "idsName": "IDS_REMAINDERDAYS", "dataField": "nremainderdays", "width": "200px","mandatory": true },
        ]
        if (this.state.selectedRecord["nexpirypolicyrequired"] === 3) {
            this.validationColumnList = [
                { "idsName": "IDS_POLICYNAME", "dataField": "spolicyname", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_MINNUMBERCHAR", "dataField": "nminnoofnumberchar", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_MINLOWERCHAR", "dataField": "nminnooflowerchar", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_MINUPPERCHAR", "dataField": "nminnoofupperchar", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_MINSPECIALCHAR", "dataField": "nminnoofspecialchar", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_MINPASSWORDLENGTH", "dataField": "nminpasslength", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_MAXPASSWORDLENGTH", "dataField": "nmaxpasslength", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_NOOFFAILEDATTEPT", "dataField": "nnooffailedattempt", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_EXPIRYPOLICY", "dataField": "nexpirypolicy", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_REMINDERDAYS", "dataField": "nremainderdays", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            ]
        }
        else {
            this.validationColumnList = [
                { "idsName": "IDS_POLICYNAME", "dataField": "spolicyname", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_MINNUMBERCHAR", "dataField": "nminnoofnumberchar", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_MINLOWERCHAR", "dataField": "nminnooflowerchar", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_MINUPPERCHAR", "dataField": "nminnoofupperchar", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_MINSPECIALCHAR", "dataField": "nminnoofspecialchar", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_MINPASSWORDLENGTH", "dataField": "nminpasslength", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_MAXPASSWORDLENGTH", "dataField": "nmaxpasslength", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_NOOFFAILEDATTEPT", "dataField": "nnooffailedattempt", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },

            ]
        }
        this.copyValidationColumnList = [
            { "idsName": "IDS_POLICYNAME", "dataField": "spolicyname", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_USERROLEPOLICY", "dataField": "nuserrolecode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },

        ]
        const mandatoryFields = [];
        this.validationColumnList.forEach(item => item.mandatory === true ?
            mandatoryFields.push(item) : ""
        );
        const copyMandatoryFields = [];
        this.copyValidationColumnList.forEach(item => item.mandatory === true ?
            copyMandatoryFields.push(item) : ""
        );
        const breadCrumbData = this.state.filterData || [];
        return (
            <>
                {/* Start of get display*/}
                <div className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
                    {breadCrumbData.length > 0 ?
                        <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        </Affix>
                        : ""
                    }
                    <Row noGutters={true}>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                            <ListMaster
                                formatMessage={this.props.intl.formatMessage}
                                screenName={"Password Policy"}
                                masterData={this.props.Login.masterData}
                                userInfo={this.props.Login.userInfo}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.PasswordPolicy}
                                getMasterDetail={(passwordPolicy) => this.props.getPasswordPolicyDetail(passwordPolicy, this.props.Login.userInfo, this.props.Login.masterData, this.state.selectedcombo)}
                                selectedMaster={this.props.Login.masterData.SelectedPasswordPolicy}
                                primaryKeyField="npolicycode"
                                mainField="spolicyname"
                                firstField="stransstatus"
                                // secondField="stransstatus"
                                // isIDSField="Yes"
                                //filterColumnData={this.props.filterColumnDataPasswordPolicy}
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={addId}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData}
                                openModal={() => this.props.getPasswordPolicyComboService("IDS_PASSWORDPOLICY", "create", "npolicycode", null, this.props.Login.masterData, this.props.Login.userInfo, addId)}
                                hidePaging={true}
                                needAccordianFilter={false}
                                showFilterIcon={true}
                                showFilter={this.props.Login.showFilter}
                                openFilter={this.openFilter}
                                closeFilter={this.closeFilter}
                                onFilterSubmit={this.onFilterSubmit}

                                filterComponent={[
                                    {
                                        "IDS_USERROLEPOLICYS":
                                            <UserRoleFilter
                                                formatMessage={this.props.intl.formatMessage}
                                                filterUserRole={this.state.userRole || []}//{this.props.Login.masterData.UserRole || []}
                                                selectedCombo={this.state.selectedcombo || {}}//
                                                onComboChange={this.onComboChange}
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
                                    {this.props.Login.masterData.PasswordPolicy && this.props.Login.masterData.PasswordPolicy.length > 0 && this.props.Login.masterData.SelectedPasswordPolicy ?
                                        <>
                                            <Card.Header>
                                                {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                                <Card.Title>
                                                    <h1 className="product-title-main">{this.props.Login.masterData.SelectedPasswordPolicy.spolicyname}</h1>
                                                </Card.Title>
                                                <Card.Subtitle className="text-muted font-weight-normal d-flex justify-content-between">
                                                    {/* <Row>
                                                        <Col md={8} className="d-flex"> */}
                                                    <h2 className="product-title-sub flex-grow-1">

                                                        <span className={`btn btn-outlined ${userStatusCSS} btn-sm ml-3`}>
                                                            {/* {((this.props.Login.masterData.SelectedPasswordPolicy && this.props.Login.masterData.SelectedPasswordPolicy.ntransactionstatus === transactionStatus.ACTIVE)
                                                                || (this.props.Login.masterData.SelectedPasswordPolicy && this.props.Login.masterData.SelectedPasswordPolicy.ntransactionstatus === transactionStatus.APPROVED)) ? <i class="fas fa-check "></i> : ""} */}
                                                            <FormattedMessage id={this.props.Login.masterData.SelectedPasswordPolicy.stransstatus} />
                                                        </span>

                                                    </h2>
                                                    {/* </Col>
                                                        <Col md={4}> */}
                                                    <div className="d-flex product-category" >
                                                        {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                        <div className="d-inline ">
                                                            <Nav.Link className="btn btn-circle outline-grey mr-2" hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                onClick={() => this.getPasswordPolicyComboService("IDS_PASSWORDPOLICY", "update", "npolicycode", this.props.Login.masterData.SelectedPasswordPolicy.npolicycode,
                                                                    this.props.Login.masterData, this.props.Login.userInfo, editId)}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                            //  data-for="tooltip_list_wrap"
                                                            >
                                                                <FontAwesomeIcon icon={faPencilAlt} />
                                                            </Nav.Link>
                                                            {/* <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                    onClick={() => this.deleteRecord("PasswordPolicy", this.props.Login.masterData.SelectedPasswordPolicy, "delete", deleteId)}>
                                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                                </Nav.Link> */}
                                                            <Nav.Link name="deletePassword Policy" className="btn btn-circle outline-grey mr-2 action-icons-wrap" hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                onClick={() => this.ConfirmDelete(deleteId)}
                                                            // data-for="tooltip_list_wrap"
                                                            >
                                                                <FontAwesomeIcon icon={faTrashAlt} />
                                                                {/* <ConfirmDialog
                                                                        name="deleteMessage"
                                                                        message={this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                                                                        doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}
                                                                        doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                                        icon={faTrashAlt}
                                                                        //title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                        handleClickDelete={() => this.deleteRecord("PasswordPolicy", this.props.Login.masterData.SelectedPasswordPolicy,
                                                                            "delete", deleteId)}
                                                                    /> */}
                                                            </Nav.Link>
                                                            <Nav.Link className="btn btn-circle outline-grey mr-2" hidden={this.state.userRoleControlRights.indexOf(approveId) === -1}
                                                                onClick={() => this.onApproveClick("PasswordPolicy", "approve", "npolicycode", this.props.Login.masterData.SelectedPasswordPolicy.npolicycode, approveId)}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_APPROVE" })}
                                                            // data-for="tooltip_list_wrap"
                                                            >
                                                                <FontAwesomeIcon icon={faThumbsUp} />
                                                            </Nav.Link>
                                                            <Nav.Link className="btn btn-circle outline-grey mr-2" hidden={this.state.userRoleControlRights.indexOf(copyId) === -1}
                                                                onClick={() => this.props.getCopyUseRolePolicy("IDS_USERROLEPOLICYS", "copy", "nuserrolecode", undefined)}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_COPY" })}
                                                            //  data-for="tooltip_list_wrap"
                                                            >
                                                                <FontAwesomeIcon icon={faCopy} />
                                                            </Nav.Link>
                                                        </div>
                                                        {/* </Tooltip> */}
                                                    </div>
                                                    {/* </Col>
                                                    </Row> */}
                                                </Card.Subtitle>
                                            </Card.Header>
                                            <Card.Body>
                                                <Card.Text>
                                                    <Row>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_MINNUMBERCHAR" message="Division" /></FormLabel>
                                                                <span className="readonly-text font-weight-normal">{this.props.Login.masterData.SelectedPasswordPolicy.nminnoofnumberchar}</span>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_MINLOWERCHAR" message="nminnooflowerchar" /></FormLabel>
                                                                <span className="readonly-text font-weight-normal">{this.props.Login.masterData.SelectedPasswordPolicy.nminnooflowerchar}</span>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_MINUPPERCHAR" message="nminnoofupperchar" /></FormLabel>
                                                                <span className="readonly-text font-weight-normal">{this.props.Login.masterData.SelectedPasswordPolicy.nminnoofupperchar}</span>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_MINSPECIALCHAR" message="nminnoofspecialchar" /></FormLabel>
                                                                <span className="readonly-text font-weight-normal">{this.props.Login.masterData.SelectedPasswordPolicy.nminnoofspecialchar}</span>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_MINPASSWORDLENGTH" message="nminpasslength" /></FormLabel>
                                                                <span className="readonly-text font-weight-normal">{this.props.Login.masterData.SelectedPasswordPolicy.nminpasslength}</span>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_MAXPASSWORDLENGTH" message="nmaxpasslength" /></FormLabel>
                                                                <span className="readonly-text font-weight-normal">{this.props.Login.masterData.SelectedPasswordPolicy.nmaxpasslength}</span>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_NOOFFAILEDATTEPT" message="nnooffailedattempt" /></FormLabel>
                                                                <span className="readonly-text font-weight-normal">{this.props.Login.masterData.SelectedPasswordPolicy.nnooffailedattempt}</span>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_EXPIRYREQUIRED" message="nexpirypolicyrequired" /></FormLabel>
                                                                <span className="readonly-text font-weight-normal">{this.props.Login.masterData.SelectedPasswordPolicy.sexpirystatus}</span>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_EXPIRYPOLICY" message="nexpirypolicy" /></FormLabel>
                                                                <span className="readonly-text font-weight-normal">{this.props.Login.masterData.SelectedPasswordPolicy.nexpirypolicy}</span>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_REMINDERDAYS" message="nremainderdays" /></FormLabel>
                                                                <span className="readonly-text font-weight-normal">{this.props.Login.masterData.SelectedPasswordPolicy.nremainderdays}</span>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={8}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_COMMENTS" message="scomments" /></FormLabel>
                                                                <span className="readonly-text font-weight-normal">{this.props.Login.masterData.SelectedPasswordPolicy.scomments}</span>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </Card.Text>


                                            </Card.Body>
                                        </>
                                        : ""
                                    }
                                </Card>
                            </ContentPanel>
                        </Col>
                    </Row>
                </div>

                {/* End of get display*/}

                {/* Start of Modal Sideout for User Creation */}

                {this.props.Login.openModal &&
                    <SlideOutModal show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        showSaveContinue={this.props.Login.screenName === "IDS_PASSWORDPOLICY" || this.props.Login.screenName === "IDS_USERROLEPOLICYS"?true:false}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={this.props.Login.screenName === "IDS_PASSWORDPOLICY" ? mandatoryFields : copyMandatoryFields}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            :
                            this.props.Login.screenName === "IDS_PASSWORDPOLICY" ?
                                <AddPasswordPolicy selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onNumericInputOnChange={this.onNumericInputOnChange}
                                    onComboChange={this.onComboChange}
                                    formatMessage={this.props.intl.formatMessage}
                                    selectedPasswordPolicy={this.props.Login.masterData.SelectedPasswordPolicy}
                                    operation={this.props.operation}

                                />
                                : <UserRolePolicy selectedRecord={this.state.selectedRecord || this.props.Login.masterData.selectedcomboUserRole || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onComboChange={this.onComboChangeUserRole}
                                    formatMessage={this.props.intl.formatMessage}
                                    operation={this.props.operation}
                                    filterUserRole={this.state.userRole || []}//{this.props.Login.masterData.UserRole || []}
                                    selectedPasswordPolicy={this.props.Login.masterData.SelectedPasswordPolicy}
                                />


                        }
                    />
                }
                {/* End of Modal Sideout for User Creation */}
            </>
        );
    }
    ConfirmDelete = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteRecord("PasswordPolicy", this.props.Login.masterData.SelectedPasswordPolicy, "delete", deleteId));
    }
    generateBreadCrumData() {
        const breadCrumbData = [];
        if (this.props.Login.masterData && this.props.Login.masterData.UserRole) {

            breadCrumbData.push(
                {
                    "label": "IDS_USERROLE",
                    "value": this.props.Login.masterData.SelectedUserRole ? this.props.Login.masterData.SelectedUserRole.suserrolename : "NA"

                },
            );
        }
        return breadCrumbData;
    }

    getPasswordPolicyComboService = (screenName, operation, primaryKeyName, primaryKeyValue, masterData, userInfo, ncontrolCode) => {
        if (masterData.UserRole.length > 0) {
            if (operation === "create" || (operation === "update" && masterData.SelectedPasswordPolicy.ntransactionstatus !==
             transactionStatus.RETIRED && masterData.SelectedPasswordPolicy.ntransactionstatus !== transactionStatus.APPROVED)) {
                this.props.getPasswordPolicyComboService(screenName, operation, primaryKeyName, primaryKeyValue, masterData, userInfo, ncontrolCode)
             }else{
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTOEDIT" }));
             }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTUSERROLEFROMFILTER" }));
        }

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
        this.searchRef.current.value = "";
        if (this.state.selectedcombo["nuserrolecode"]) {
            this.props.comboChangeUserRolePolicy(this.state.selectedcombo["nuserrolecode"].value, this.props.Login.masterData, this.props.Login.userInfo);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTUSERROLE" }));
        }
    }

    componentDidUpdate(previousProps) {

        const masterData = this.props.Login.masterData;
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        if (this.props.Login.masterData.UserRole !== previousProps.Login.masterData.UserRole) {

            const selectedcombo = {
                nuserrolecode: masterData.UserRole && masterData.UserRole.length > 0 ? {
                    "value": masterData.UserRole[0].nuserrolecode,
                    "label": masterData.UserRole[0].suserrolename
                } : this.state.selectedRecord["nuserrolecode"]

            }
            this.setState({ selectedcombo: selectedcombo });
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
        if (this.props.Login.masterData.UserRole !== previousProps.Login.masterData.UserRole) {

            const userRole = constructOptionList(this.props.Login.masterData.UserRole || [], "nuserrolecode",
                "suserrolename", undefined, undefined, undefined);
            const UserRoleList = userRole.get("OptionList");


            this.setState({ userRole: UserRoleList });
        }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            const filterData = this.generateBreadCrumData();
            this.setState({ filterData });
        }
    }
    getPasswordPolicyDetail = (passwordPolicy) => {
        return rsapi().post("passwordpolicy/getPasswordPolicy", {
            npolicycode: passwordPolicy.npolicycode,
            "userinfo": this.props.Login.userInfo
        })
            .then(response => {
                const masterData = response.data;
                sortData(masterData);
                const selectedcombo = {
                    nuserrolecode: masterData.UserRole && masterData.UserRole.length > 0 ? {
                        "value": this.state.selectedcombo["nuserrolecode"].value,
                        "label": this.state.selectedcombo["nuserrolecode"].label
                    } : this.state.selectedcombo["nuserrolecode"]
                }
                this.setState({
                    userRolePolicyDataData: masterData["UserRole"],

                    selectedPasswordPolicy: masterData["SelectedPasswordPolicy"],
                    selectedcombo
                });
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
                } else if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(this.props.intl.formatMessage({ id: error.response.data }));
                }

            })
    }

    filterColumnData(event) {
        let filterValue = event.target.value;
        if (filterValue === "") {
            this.setState({
                passwordPolicyData: this.props.Login.masterData["PasswordPolicy"],//this.props.Login.masterData["Users"],
                userRolePolicyData: this.props.Login.masterData["UserRole"],

                selectedPasswordPolicy: this.props.Login.masterData["SelectedPasswordPolicy"],

            });
        }
        else {
            if (filterValue.length > 2) {
                const searchedData = searchData(filterValue, this.props.Login.masterData["PasswordPolicy"], "spolicyname");

                if (searchedData && searchedData.length > 0) {
                    return rsapi().post("passwordpolicy/getPasswordPolicy", {
                        nmahcode: searchedData[0].nmahcode,
                        userinfo: this.props.Login.userInfo
                    })
                        .then(response => {

                            this.setState({
                                passwordPolicyData: searchedData, userRolePolicyData: response.data["UserRole"],

                                selectedPasswordPolicy: response.data["SelectedPasswordPolicy"]

                            });
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
                } else if (error.response.status === 500) {
                                toast.error(error.message);
                            }
                            else {
                                toast.warn(this.props.intl.formatMessage({ id: error.response.data }));
                            }
                        })
                }
                else {
                    this.setState({

                        passwordPolicyData: [], userRolePolicyData: [], selectedPasswordPolicy: {}

                    });
                }
            }
        }

    }


    deleteRecord = (methodUrl, selectedRecord, operation, ncontrolCode) => {
        if (this.props.Login.masterData.SelectedPasswordPolicy.ntransactionstatus === transactionStatus.RETIRED ||
            this.props.Login.masterData.SelectedPasswordPolicy.ntransactionstatus === transactionStatus.APPROVED) {
            let message = "IDS_SELECTDRAFTRECORDTODELETE";
            // if (this.props.Login.masterData.SelectedPasswordPolicy.ntransactionstatus === transactionStatus.APPROVED) {
            //     message = "IDS_SELECTDRAFTRECORDTOAPPROVE";
            // }
            toast.warn(this.props.intl.formatMessage({ id: message }));
            //toast.warn(this.props.intl.formatMessage({ id: this.props.Login.masterData.SelectedPasswordPolicy.stransstatus }));
        }
        else {

            const postParam = {
                inputListName: "PasswordPolicy", selectedObject: "SelectedPasswordPolicy",
                primaryKeyField: "npolicycode",
                primaryKeyValue: this.props.Login.masterData.SelectedPasswordPolicy.npolicycode,
                fetchUrl: "passwordpolicy/getPasswordPolicy",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }

            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl, postParam,
                inputData: {
                    [methodUrl.toLowerCase()]: selectedRecord,
                    "userinfo": this.props.Login.userInfo,
                    "passwordpolicy": this.props.Login.masterData.SelectedPasswordPolicy
                },
                operation,
                selectedRecord:{...this.state.selectedRecord}

            }

            const masterData = this.props.Login.masterData;


            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },
                        openModal: true, screenName: "PasswordPolicy", operation
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

    getCopyUseRolePolicy(screenName, operation, primaryKeyName, primaryKeyValue, ncontrolCode) {

        this.setState({

            operation, screenName,
            isOpen: true
        });

    }


    getPasswwordPolicyComboService(screenName, operation, primaryKeyName, primaryKeyValue) {

        if (operation === "create" || (operation === "update" && this.state.selectedPasswordPolicy.ntransactionstatus !== transactionStatus.RETIRED)) {       //ntransactionstatus = 7 -- User Retired           


            let userLogged = this.state.userLogged;

            let selectedRecord = {};

            let urlArray = [];

            if (operation === "update") {
                const policyById = rsapi().post("passwordpolicy/getActivePasswordPolicyById", { [primaryKeyName]: primaryKeyValue, "userinfo": this.props.Login.userInfo });

                urlArray = [policyById];
                Axios.all(urlArray)
                    .then(response => {



                        selectedRecord = response[0].data;

                        this.setState({
                            operation, screenName, selectedRecord, userLogged,
                            isOpen: true
                        });
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
                } else if (error.response.status === 500) {
                            toast.error(error.message);
                        }
                        else {
                            toast.warn(this.props.intl.formatMessage({ id: error.response.data }));
                        }
                    })
            }
            else {
                this.setState({
                    operation, screenName, selectedRecord, isOpen: true
                });
            }


        }
        else {

            toast.warn(this.props.intl.formatMessage({ id: this.state.selectedPasswordPolicy.stransstatus }));
        }
    }


    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "approve") {
                loadEsign = false;
                openModal = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason']=""
                //selectedRecord = {};
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
            data: {
                openModal, loadEsign, selectedRecord, selectedId: null,
                // operation: undefined
            }
        }
        this.props.updateStore(updateInfo);

    }

    onComboChange = (comboData, fieldName) => {
        if (comboData != null) {

            const selectedcombo = this.state.selectedcombo || {};
           // const selectedRecord = this.state.selectedRecord || {};
            selectedcombo[fieldName] = comboData;
           // selectedRecord[fieldName] = comboData;

            this.setState({ selectedcombo});
            // if (fieldName === "nuserrolecode") {
            //   this.searchRef.current.value = "";
            //   this.props.comboChangeUserRolePolicy(comboData.value, this.props.Login.masterData, this.props.Login.userInfo);


            // }
        }

    }

    onComboChangeUserRole = (comboData, fieldName) => {
        //if (comboData != null) {
            const selectedcomboUserRole = this.state.selectedcomboUserRole || {}; //this.state.selectedRecord || {};
            selectedcomboUserRole[fieldName] = comboData;
            const selectedRecord = this.state.selectedRecord || {};
            selectedRecord[fieldName] = comboData;
            this.setState({ selectedcomboUserRole, selectedRecord });

        //}

    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === "ntransactionstatus")
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
            // else if (event.target.name === "nlockmode")
            //     selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.UNLOCK : transactionStatus.LOCK;
            else
            {
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
                //ALPD-4463 If expiry required false click save button alert message displayed.
                //Issue fixed by Saravanan 13-11-2024
                if(event.target.name==="nexpirypolicyrequired" && event.target.checked===false)
                {
                    selectedRecord["nexpirypolicy"]="";
                    selectedRecord["nremainderdays"]="";
                }
            }
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }
    onNumericInputOnChange = (value, name) => {
        const selectedRecord = this.state.selectedRecord || {};
        // if (value === 0 || value === 0.0) {
        //     selectedRecord[name] = '';
        //     this.setState({ selectedRecord });
        // } else {
        selectedRecord[name] = value;
        this.setState({ selectedRecord });
        //}
    }
    onApproveClick = (screenName, operation, primaryKeyName, primaryKeyValue, ncontrolCode) => {
        if (this.props.Login.masterData.SelectedPasswordPolicy.ntransactionstatus === transactionStatus.DRAFT) {
            const approveId = this.state.controlMap.has("ApprovePasswordPolicy") && this.state.controlMap.get("ApprovePasswordPolicy").ncontrolcode
            let inputData = [];
            inputData["userinfo"] = this.props.Login.userInfo;
            //add               
            let postParam = undefined;
            inputData["passwordpolicy"] = { "nuserrolecode": this.props.Login.masterData.SelectedPasswordPolicy["nuserrolecode"] ? this.props.Login.masterData.SelectedPasswordPolicy["nuserrolecode"].Value : "" };
            inputData["passwordpolicy"] = this.props.Login.masterData.SelectedPasswordPolicy;
            postParam = { inputListName: "PasswordPolicy", selectedObject: "SelectedPasswordPolicy", primaryKeyField: "npolicycode" };
            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: "UserRolePolicy",
                inputData: inputData,
                operation: "approve", postParam,
                selectedRecord:{...this.state.selectedRecord}

            }
            let saveType;

            const masterData = this.props.Login.masterData;

            const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, approveId);
            if (esignNeeded) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData }, saveType, openModal: true, operation: operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
            //toast.info(this.props.intl.formatMessage({ id: "IDS_APPROVEPOLICY" }));
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTOAPPROVE" }));
        }
    }
    validation = () => {
        let ntotal = 0;
        let nminpswlen = 0;
        let nmaxpaslen = 0;
        let nexpairyDays = 0;
        let nremainderdays = 0;
        ntotal = parseInt(this.state.selectedRecord.nminnoofnumberchar) + parseInt(this.state.selectedRecord.nminnooflowerchar) + parseInt(this.state.selectedRecord.nminnoofupperchar) + parseInt(this.state.selectedRecord.nminnoofspecialchar);
        nminpswlen = parseInt(this.state.selectedRecord.nminpasslength);
        nmaxpaslen = parseInt(this.state.selectedRecord.nmaxpasslength);
        nexpairyDays = parseInt(this.state.selectedRecord.nexpirypolicy);
        nremainderdays = parseInt(this.state.selectedRecord.nremainderdays);
        if (ntotal === 0) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_CANNOTTOTALPSWZERO" }));
            return false;
        }
        if (nminpswlen === 0) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_CANNOTMINPSWZERO" }));
            return false;
        }
        if (nminpswlen < ntotal) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_MINPSWCANTLESSTOTALLEN" }));
            return false;
        }
        if (nmaxpaslen < nminpswlen) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_MAXPSWCANTLESSMINPSWLEN" }));
            return false;
        }
        if (nremainderdays > nexpairyDays) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_REMAINDERSDAYSLESSTHANEXPIRYDAYS" }));
            return false;
        }
        return true;
    }

    onSaveClick = (saveType, formRef) => {

        let inputData = [];
        let inputParam = {};
        inputData["userinfo"] = this.props.Login.userInfo;

        if (this.props.Login.screenName === "IDS_PASSWORDPOLICY") {

            if (this.validation()) {
                inputParam = this.savePasswordPolicy(saveType, formRef);

                const masterData = this.props.Login.masterData;

                let clearSelectedRecordField =[
                    { "idsName": "IDS_POLICYNAME", "dataField": "spolicyname", "width": "200px" ,"controlType": "textbox","isClearField":true},
                    { "idsName": "IDS_MINNUMBERCHAR", "dataField": "nminnoofnumberchar", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_MINLOWERCHAR", "dataField": "nminnooflowerchar", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_MINUPPERCHAR", "dataField": "nminnoofupperchar", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_MINSPECIALCHAR", "dataField": "nminnoofspecialchar", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_MINPASSWORDLENGTH", "dataField": "nminpasslength", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_MAXPASSWORDLENGTH", "dataField": "nmaxpasslength", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_NOOFFAILEDATTEPT", "dataField": "nnooffailedattempt", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_EXPIRYPOLICY", "dataField": "nexpirypolicy", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_REMINDERDAYS", "dataField": "nremainderdays", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "200px","controlType": "textbox","isClearField":true },
                    { "idsName": "IDS_EXPIRYREQUIRED", "dataField": "nexpirypolicyrequired", "width": "100px","isClearField":true,"preSetValue":4},
                    
                ]

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
                    this.props.crudMaster(inputParam, masterData, "openModal","","",clearSelectedRecordField);
                }
            }

        }
        else if (this.props.Login.screenName === "IDS_USERROLEPOLICYS") {
            const copyId = this.state.controlMap.has("CopyPasswordPolicy") && this.state.controlMap.get("CopyPasswordPolicy").ncontrolcode
            inputParam = this.copyUserRolePolicy(saveType, formRef);
            const masterData = this.props.Login.masterData;
            let clearSelectedRecordField =[
                { "idsName": "IDS_POLICYNAME", "dataField": "spolicyname", "width": "200px" ,"controlType": "textbox","isClearField":true},
            ]
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, copyId)) {
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
                // toast.info(this.props.intl.formatMessage({ id: "IDS_COPYPOLICY" }));
            }
        }
    }

    savePasswordPolicy(saveType, formRef) {
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        let postParam = undefined;
        if (this.props.Login.operation === "update") {
            // edit
            postParam = { inputListName: "PasswordPolicy", selectedObject: "SelectedPasswordPolicy", primaryKeyField: "npolicycode" };
            inputData["passwordpolicy"] = this.state.selectedRecord;
            inputData["passwordpolicy"]["scomments"] = this.state.selectedRecord["scomments"] !== null ? this.state.selectedRecord["scomments"] : "";

            // this.policyFieldList.map(item => {
            //     return inputData["passwordpolicy"][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : 0;
            // })

            // inputData["passwordpolicy"]["scomments"] = this.state.selectedRecord["scomments"] ;
        }
        else {
            //add               
            inputData["passwordpolicy"] = { "nideallocktime": 6000 };//this.props.Login.userInfo.nmastersitecode };

            this.policyFieldList.map(item => {
                return inputData["passwordpolicy"][item] = this.state.selectedRecord[item]
            });
            inputData["nuserrolecode"] = this.props.Login.masterData.SelectedUserRole  ? this.props.Login.masterData.SelectedUserRole.nuserrolecode : "";
            //inputData["nuserrolecode"] = this.state.selectedcombo["nuserrolecode"] ? this.state.selectedcombo["nuserrolecode"].value : "";

        }
        inputData["passwordpolicy"]["nexpirypolicy"] = this.state.selectedRecord["nexpirypolicyrequired"] === 3 ? this.state.selectedRecord["nexpirypolicy"] : 0;
        inputData["passwordpolicy"]["nremainderdays"] = this.state.selectedRecord["nexpirypolicyrequired"] === 3 ? this.state.selectedRecord["nremainderdays"] : 0;

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "PasswordPolicy",
            inputData: inputData,
            operation: this.props.Login.operation,
            saveType, formRef, postParam, searchRef: this.searchRef,
            selectedRecord:{...this.state.selectedRecord}
        }

        return inputParam;
    }

    copyUserRolePolicy(saveType, formRef) {
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["userrole"] = {};
        let postParam = undefined;

        let userroleArray = []
        userroleArray = this.state.selectedcomboUserRole.nuserrolecode.map(item => {
            let userrolelist = {}
            userrolelist["nuserrolecode"] = item.value;
            userrolelist["suserrolename"] = item.label;
            userrolelist["sdescription"] = "a";
            userrolelist["nsitecode"] = -1;
            //userroleArray.push(userrolelist);
            return userrolelist;
        });
        inputData['userrole'] = userroleArray;
        inputData['npolicycode'] = this.props.Login.masterData.SelectedPasswordPolicy.npolicycode;
        inputData['spolicyname'] = this.state.selectedRecord.spolicyname;
        postParam = { inputListName: "PasswordPolicy", selectedObject: "SelectedPasswordPolicy", primaryKeyField: "npolicycode" };

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "PasswordPolicyToSelectedRole",
            inputData: inputData,
            operation: this.props.Login.operation,
            saveType, formRef, postParam, searchRef: this.searchRef,
            selectedRecord: {...this.state.selectedRecord}
        }
        return inputParam;
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

        if (this.state.selectedcombo["nuserrolecode"].value) {
            let inputParam = {
                inputData: {
                    nuserrolecode: this.props.Login.masterData.SelectedUserRole.nuserrolecode,
                    userinfo: this.props.Login.userInfo,
                },
                classUrl: "passwordpolicy",
                methodUrl: "PasswordPolicyByUserRoleCode"
            }
            this.props.comboChangeUserRolePolicy(inputParam.inputData.nuserrolecode, this.props.Login.masterData, inputParam.inputData.userinfo);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_USERROLENOTAVAILABLE" }));
        }
    }
}
export default connect(mapStateToProps, {
    callService, crudMaster, validateEsignCredential,
    updateStore, getPasswordPolicyDetail, getPasswordPolicyComboService, getCopyUseRolePolicy, comboChangeUserRolePolicy, filterColumnData
})(injectIntl(PasswordPolicy));

