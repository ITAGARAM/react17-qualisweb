import FormInput from '../../components/form-input/form-input.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { Row, Col, Card, Nav, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { sortData, getControlMap, showEsign, constructOptionList } from '../../components/CommonScript';
import '../../assets/./styles/tree.css';
import React, { Component } from 'react';
import { NavHeader } from '../../components/sidebar/sidebar.styles';
import { ContentPanel, ListWrapper } from './userroletemplate.styles';
import {
    callService, crudMaster, updateStore, addScreenModel, validateEsignCredential,
    getURTFilterRegType, getURTFilterRegSubType, getURTFilterSubmit,
    fetchRecordById, getTreetemplate, filterColumnData, postCRUDOrganiseSearch
} from '../../actions';
import { injectIntl } from 'react-intl';
// import rsapi from '../../rsapi';
import { toast } from 'react-toastify';
import ListMaster from '../../components/list-master/list-master.component';
import UserRoleTemplateFilter from './UserRoleTemplateFilter';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import Esign from '../audittrail/Esign';
// import ConfirmDialog from '../../components/confirm-alert/confirm-alert.component';
import { ApprovalSubType, transactionStatus } from '../../components/Enumeration';
// import { Tooltip } from '@progress/kendo-react-tooltip';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import { Affix } from 'rsuite';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
// import ReactTooltip from 'react-tooltip';


class userroletempalate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openModal: false,
            userRoleTreeData: [],
            userRoleControlRights: [],
            URTvalues: [{ URTvalue: "" }],
            selectedApprovalType: 0,
            error: "",
            controlMap: new Map(),
            selectedInput: "",
            selectedRole:[],
            sidebarview:false
        }
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
        this.searchFieldList = ["stransdisplaystatus", "sversionstatus", "sversiondescription"];
    }
    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })          
    }

    closeModel = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord=this.props.Login.selectedRecord;
               
        
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "approve") {
                loadEsign = false;
                openModal = false;
                // selectedRecord["agree"] = 4;
                selectedRecord['esignpassword'] = "";
                selectedRecord['esigncomments'] = "";
                selectedRecord['esignreason']="";
            }
            else {
                loadEsign = false;
                // selectedRecord["agree"] = 4;
                selectedRecord['esignpassword'] = "";
                selectedRecord['esigncomments'] = "";
                selectedRecord['esignreason']="";
            }
        }
        else {
            openModal = false;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign ,selectedRecord}
        }
        this.props.updateStore(updateInfo);
    }

    appendInputtree(e) {
        const totalLevel = this.props.Login.totalLevel ? this.props.Login.totalLevel : 1;
        if (this.props.Login.selectedRecord[this.props.Login.id] !== undefined) {
            let id = parseInt(this.props.Login.id) + 1;

            if (id < 9) {
                if (totalLevel < (this.props.Login.userRoleActualData.length)) {
                    //let id = parseInt(e.currentTarget.id) + 1;
                    let totalid = totalLevel;
                    if (totalid === id) {
                        if (this.props.Login.userRoleData.length <= 0) {
                            toast.info(this.props.intl.formatMessage({ id: "IDS_NOUSERROLETOADDTONEXTLEVEL" }));
                        }
                        else {
                            var newInput = `input-${totalLevel}`;
                            var userRoleTreeData = this.props.Login.userRoleTreeData.concat([newInput])
                            const updateInfo = {
                                typeName: DEFAULT_RETURN,
                                data: { userRoleTreeData, totalLevel: totalLevel + 1, id }
                            }

                            this.props.updateStore(updateInfo)
                        }
                    }
                }
                else {
                    toast.info(this.props.intl.formatMessage({ id: "IDS_NOUSERROLETOADDTONEXTLEVEL" }));
                }
            }
        }
        else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_PLSSELECTUSERROLE" }));
        }
    }

    removeTree(event, i) {
        let userRoleTreeData = this.props.Login.userRoleTreeData;
        userRoleTreeData.splice(i, 10);
        const totalLevel = this.props.Login.totalLevel ? this.props.Login.totalLevel : 1;
        const selectedRecord = this.props.Login.selectedRecord ? this.props.Login.selectedRecord : "";
        let listUserRole = this.props.Login.userRoleData || [];
        if (selectedRecord[i]) {
            for (let j = i; j < totalLevel; j++) {
                let index = (this.props.Login.userRoleActualData).findIndex(data => data.nuserrolecode === parseInt(selectedRecord[j]));
                listUserRole.push(this.props.Login.userRoleActualData[index]);
                delete selectedRecord[j];
            };
        }

        // const  TagUserroleData  = constructOptionList(listUserRole ||[], "nuserrolecode",
        // "suserrolename" , undefined, undefined, undefined);
        // const  TagListUserroleData = TagUserroleData.get("OptionList");

        let userRoleData = listUserRole;

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { userRoleTreeData, userRoleData, selectedRecord, totalLevel: i, id: i - 1 }
        }

        this.props.updateStore(updateInfo);
    }


    filterComboChange = (event, fieldname) => {
        if (event !== null) {
            // let uRL = "";
            let inputData = [];
            if (fieldname === "approvalSubType") {
                // uRL = 'userroletemplate/getApprovalRegSubType';
                inputData = {
                    userinfo: this.props.Login.userInfo,
                    nflag: 1,
                    napprovalsubtypecode: parseInt(event.value),
                    ntemplatecode: parseInt(event.item.ntemplatecode),
                    isregneed: parseInt(event.item.nisregsubtypeconfigneed),
                }
                let masterData = { ...this.props.Login.masterData, defaultapprovalsubtype: event }
                let inputParam = { masterData, inputData }
                this.props.getURTFilterRegType(inputParam)
            }
            else if (fieldname === "registrationType") {
                // uRL = 'userroletemplate/getApprovalRegSubType';
                inputData = {
                    userinfo: this.props.Login.userInfo,
                    nflag: 2,
                    nregtypecode: parseInt(event.value),
                    napprovalsubtypecode: this.props.Login.masterData.defaultapprovalsubtype.value,
                    ntemplatecode: this.props.Login.masterData.defaultapprovalsubtype.item.ntemplatecode,
                    isregneed: this.props.Login.masterData.defaultapprovalsubtype.item.nisregsubtypeconfigneed,
                }
                let masterData = { ...this.props.Login.masterData, defaultregtype: event }
                let inputParam = { masterData, inputData }
                this.props.getURTFilterRegSubType(inputParam)
            } else {

                let masterData = { ...this.props.Login.masterData, defaultregsubtype: event }
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { masterData }
                }

                this.props.updateStore(updateInfo);
            }
        }
    }

    render() {

        const { masterData, userInfo, openModal, userRoleTreeData, userRoleData, selectedRecord } = this.props.Login;
        const { listuserroletemplate, levelsuserroletemplate } = this.props.Login.masterData;
        const { selectedInput } = this.state;
        const selected = this.props.Login.masterData.selectedURTVersion;
        const addId = this.state.controlMap.has("AddUserRoleTempalate") && this.state.controlMap.get("AddUserRoleTempalate").ncontrolcode;
        const editId = this.state.controlMap.has("EditUserRoleTempalate") && this.state.controlMap.get("EditUserRoleTempalate").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteUserRoleTempalate") && this.state.controlMap.get("DeleteUserRoleTempalate").ncontrolcode;
        const approveId = this.state.controlMap.has("ApproveUserRoleTempalate") && this.state.controlMap.get("ApproveUserRoleTempalate").ncontrolcode;

        const filterParam = {
            inputListName: "listuserroletemplate",
            selectedObject: "selectedURTVersion",
            primaryKeyField: "ntreeversiontempcode",
            fetchUrl: "userroletemplate/getUserroletemplatebyId",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData,
            searchFieldList: this.searchFieldList
        };

        const mandatoryFields = [
            { "mandatory": true, "idsName": "IDS_TEMPLATENAME", "dataField": "sversiondescription", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" }

        ];
        let breadCrumbData = []
        if (this.props.Login.masterData.realApprovalSubTypeValue && this.props.Login.masterData.realApprovalSubTypeValue.value === ApprovalSubType.TESTRESULTAPPROVAL) {
            breadCrumbData = [
                {
                    "label": "IDS_APPROVALSUBTYPE",
                    "value": this.props.Login.masterData.realApprovalSubTypeValue ? this.props.Login.masterData.realApprovalSubTypeValue.label : "-"
                }, {
                    "label": "IDS_REGTYPE",
                    "value": this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.label : "-"
                }, {
                    "label": "IDS_REGSUBTYPE",
                    "value": this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.label : "-"
                }
            ];
        } else {
            breadCrumbData = [
                {
                    "label": "IDS_APPROVALSUBTYPE",
                    "value": this.props.Login.masterData.realApprovalSubTypeValue ? this.props.Login.masterData.realApprovalSubTypeValue.label : "-"
                }
            ]
        }
        return (
            <>
                {/* <Preloader loading={loading} /> */}
                <div className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
                    {breadCrumbData.length > 0 ?
                        <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        </Affix> : ""

                    }
                    <Row noGutters={true}>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                            <ListMaster
                                masterData={masterData}
                                formatMessage={this.props.intl.formatMessage}
                                screenName={this.props.intl.formatMessage({ id: "IDS_USERROLETEMPLATE" })}
                                masterList={this.props.Login.masterData.searchedData || listuserroletemplate}
                                userInfo={this.props.Login.userInfo}
                                getMasterDetail={(URTvalue) => this.props.getTreetemplate(URTvalue, masterData, userInfo)}
                                selectedMaster={this.props.Login.masterData.selectedURTVersion || {}}//this.props.Login.masterData.selected}
                                primaryKeyField="ntreeversiontempcode"
                                mainField="sversiondescription"
                                //firstField="sversiondescription"
                                firstField="stransdisplaystatus"
                                //secondField="stransdisplaystatus"
                                isIDSField="No"
                                openModal={() => this.props.addScreenModel("create", masterData, userInfo, addId, selectedInput)}

                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={addId}
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData}
                                hidePaging={true}
                                needAccordianFilter={false}
                                showFilterIcon={true}
                                onFilterSubmit={this.onFilterSubmit}
                                filterComponent={[
                                    {
                                        "IDS_USERROLETEMPLATEFILTER":
                                            <UserRoleTemplateFilter
                                                formatMessage={this.props.intl.formatMessage}
                                                filterApprovalSubtype={this.state.listApprovalsubtype || []}
                                                filterRegistrationType={this.state.listRegistrationType || []}
                                                filterRegistrationSubType={this.state.listRegistrationSubType || []}
                                                defaultapprovalsubtype={this.props.Login.masterData["defaultapprovalsubtype"] || {}}
                                                defaultregsubtype={this.props.Login.masterData["defaultregsubtype"] || []}
                                                defaultregtype={this.props.Login.masterData["defaultregtype"] || []}
                                                selectedApprovalType={this.props.Login.masterData.defaultapprovalsubtype || []}
                                                selectedInput={selectedInput || []}
                                                isRegNeed={this.props.Login.masterData.defaultapprovalsubtype ? this.props.Login.masterData.defaultapprovalsubtype.item.nisregsubtypeconfigneed : transactionStatus.NO}
                                                filterComboChange={this.filterComboChange}
                                            />
                                    }
                                ]}
                            />
                        </Col>

                        {this.props.Login.masterData.selectedURTVersion && listuserroletemplate && listuserroletemplate.length > 0 ?
                        <Col md={`${!this.props.sidebarview ? '8' : "10"}`} className="position-relative">
                            <div className="sidebar-view-btn-block">
                                <div className="sidebar-view-btn " onClick={this.props.parentFunction}>
                                    {!this.props.sidebarview ?                    
                                        <i class="fa fa-less-than"></i> :
                                        <i class="fa fa-greater-than"></i> 
                                    }
                                </div>
                            </div> 
                                <ListWrapper className="panel-main-content">
                                    <Card className="border-0">
                                        {(selected) &&
                                            <Card.Header>
                                                {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                                <Card.Title>
                                                    <>
                                                        <h1 className="product-title-main">{selected.sversiondescription}</h1>
                                                    </>
                                                </Card.Title>
                                                <Card.Subtitle className="readonly-text font-weight-normal">
                                                    <Row>
                                                        <Col md={8} className="d-flex">
                                                            <h3 className="product-title-sub">{this.props.intl.formatMessage({ id: "IDS_VERSION" })} : {selected.nversionno === -1 ? "-" : selected.nversionno}</h3>
                                                            <span className={`btn btn-outlined ${selected.ntransactionstatus === transactionStatus.DRAFT ? "outline-secondary" : selected.ntransactionstatus === transactionStatus.APPROVED ? "outline-success" : "outline-danger"} btn-sm mx-md-3 mx-sm-2`}>
                                                                {selected.stransdisplaystatus}</span>
                                                        </Col>
                                                        <Col md={4}>
                                                            {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                            <Nav style={{ float: "right" }}>
                                                                <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                  //  data-for="tooltip_list_wrap"
                                                                    hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                    onClick={() => this.props.fetchRecordById("ntreeversiontempcode", selected.ntreeversiontempcode, masterData, "update", this.props.Login.selectedRecord, selectedInput, userInfo, editId)}>
                                                                    <FontAwesomeIcon icon={faPencilAlt} />
                                                                </Nav.Link>
                                                                <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                  //  data-for="tooltip_list_wrap"
                                                                    hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                    onClick={() => this.ConfirmDelete(deleteId)}>
                                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                                    {/* <ConfirmDialog
                                                                            name="deleteMessage"
                                                                            message="Are you sure?"
                                                                            doLabel="Ok"
                                                                            doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                                            icon={faTrashAlt}
                                                                            //title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                            hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(deleteId) === -1}
                                                                            handleClickDelete={() => this.deleteRecord("delete", deleteId)}
                                                                        /> */}
                                                                </Nav.Link>
                                                                <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_APPROVE" })}
                                                                 //   data-for="tooltip_list_wrap"
                                                                    hidden={this.state.userRoleControlRights.indexOf(approveId) === -1}
                                                                    onClick={() => this.approveRecord("approve", approveId)}>
                                                                    <FontAwesomeIcon name="URTapprove" icon={faThumbsUp} />
                                                                </Nav.Link>
                                                            </Nav>
                                                            {/* </Tooltip> */}
                                                        </Col>
                                                    </Row>
                                                </Card.Subtitle>
                                            </Card.Header>
                                        }
                                    </Card>
                                </ListWrapper>

                                <ContentPanel className="panel-main-content">
                                    <ListWrapper className="card-body">
                                        <React.Fragment>
                                            <ListWrapper className="tree-view1 border-left tree-left">
                                                {levelsuserroletemplate ? levelsuserroletemplate.map((input, i) =>
                                                    <ListWrapper key={i} className="form-label-group tree-level list_get">
                                                        <NavHeader className="line" style={{ width: (i + 1) * 10 }}> </NavHeader>
                                                        <NavHeader id={i} value={this.props.Login.totalLevel}
                                                            className="add_field_button">+</NavHeader>
                                                        <NavHeader className="levelcolour" ml={1}>{this.props.intl.formatMessage({ id: "IDS_LEVEL" })} {i + 1}</NavHeader>
                                                        <ListWrapper style={{ marginLeft: (i + 8) * 10 }}>
                                                            <FormInput className="input_custom" value={input.sleveluserrole} id="levelname" type="text" />
                                                        </ListWrapper>
                                                    </ListWrapper>
                                                ) : ""
                                                }
                                            </ListWrapper>
                                        </React.Fragment>
                                    </ListWrapper>
                                </ContentPanel>
                            </Col>
                            : ""}
                    </Row >
                </div>


                {this.props.Login.openModal ?
                    < SlideOutModal
                        operation={this.props.Login.operation}
                        onSaveClick={this.saveTreetemplate}
                        validateEsign={this.validateEsign}
                        esign={this.props.Login.loadEsign}
                        screenName="IDS_USERROLETEMPLATE"
                        mandatoryFields={mandatoryFields}
                        selectedRecord={this.props.Login.loadEsign ? this.props.Login.selectedRecord : selectedInput}
                        closeModal={this.closeModel}
                        show={openModal}
                        inputParam={1}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign
                                operation={this.props.Login.operation}
                                // formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onEsignInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                //selectedRecord={this.state.selectedRecord || {}}
                                selectedRecord={this.props.Login.selectedRecord || {}}
                            />

                            : <Row>
                                <Col md={12}>
                                    <FormInput
                                        label={this.props.intl.formatMessage({ id: "IDS_TEMPLATENAME" })}
                                        name={"sversiondescription"}
                                        as="text"
                                        onChange={(event) => this.onInputOnChange(event)}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_TEMPLATENAME" })}
                                        defaultValue={selectedInput ? selectedInput["sversiondescription"] : ""}
                                        isMandatory={true}
                                        required={true}
                                        maxLength={100}
                                    />
                                </Col>
                                <Col md={12}>
                                    <ListWrapper className="tree-view border-left">
                                        {userRoleTreeData ?
                                            userRoleTreeData.map((input, i) =>
                                                <ListWrapper className="form-label-group tree-level">
                                                    <NavHeader className="line" style={{ width: (i + 1) * 10 }}> </NavHeader>
                                                    <NavHeader id={i} value={this.props.Login.totalLevel}
                                                        className="add_field_button">+</NavHeader>
                                                    <NavHeader md={1}>{this.props.intl.formatMessage({ id: "IDS_LEVEL" })} <NavHeader className="tree-value">{i + 1}</NavHeader>
                                                    </NavHeader>
                                                    <Nav className="btn mr-2 action-icons-wrap" style={{ float: "right", visibility: i === 0 ? 'hidden' : 'visible' }} 
                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({id: "IDS_DELETE"})} onClick={(event) => this.removeTree(event, i)}>
                                                        <FontAwesomeIcon name="URTMDelete" icon={faTrashAlt} className="ActionIconColor" />
                                                    </Nav>
                                                    <Row>
                                                        <Col md={12} style={{ marginLeft: (i + 3) * 10 }}>
                                                            <FormSelectSearch
                                                                name={"nuserrolecode"}
                                                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                                isMandatory={false}
                                                                optionId="nuserrolecode"
                                                                optionValue="suserrolename"
                                                                defaultValue={{ "value": input["nuserrolecode"], "label": input["sleveluserrole"] }}
                                                                options={userRoleData ? constructOptionList(userRoleData || [], "nuserrolecode",
                                                                    "suserrolename", undefined, undefined, undefined).get("OptionList") : []}
                                                                onChange={(event) => this.onChangeCombo(event, i, this.props.Login.operation)}
                                                                isMulti={false}
                                                                isSearchable={false}
                                                                isDisabled={false}
                                                                // placeholder="Select User Role"
                                                                isClearable={true}>

                                                            </FormSelectSearch>
                                                        </Col>
                                                    </Row>
                                                </ListWrapper>
                                            )
                                            : ""}
                                    </ListWrapper>

                                    <NavHeader>
                                        <Button name="URTMAdd" onClick={(e) => this.appendInputtree(e)}  
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                        className="btn btn-circle solid-blue" role="button">+</Button>
                                    </NavHeader>

                                </Col>
                            </Row>
                        } />
                    : ""}
            </>
        );
    }

    ConfirmDelete = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteRecord("delete", deleteId));
    }

    //approve the record
    approveRecord = (operation, ncontrolCode) => {
        const selectedRecord = this.props.Login.selectedRecord ? this.props.Login.selectedRecord : "";
        // const selectedInput = this.state.selectedInput ? this.state.selectedInput : "";
        const selected = this.props.Login.masterData.selectedURTVersion;
        if (selected["ntransactionstatus"] === transactionStatus.APPROVED || selected["ntransactionstatus"] === transactionStatus.RETIRED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTOAPPROVE" }));
        }
        else {
            let inputData = [];
            inputData = {
                "ntreetemplatecode": this.props.Login.masterData.realApprovalSubTypeValue.item.ntemplatecode,
                "napprovalsubtypecode": this.props.Login.masterData.realApprovalSubTypeValue.value,
                "nregtypecode": this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.value : -1,
                "nregsubtypecode": this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.value : -1,
                "ntreeversiontempcode": selected.ntreeversiontempcode,
                "napprovalconfigcode": selectedRecord["napprovalconfigcode"],
                "userinfo": this.props.Login.userInfo,
                "isregneed": this.props.Login.masterData.realApprovalSubTypeValue.item.nisregsubtypeconfigneed
            }


            const postParam = {
                inputListName: "listuserroletemplate", selectedObject: "selectedURTVersion",
                primaryKeyField: "ntreeversiontempcode",
                primaryKeyValue: selected.ntreeversiontempcode,
                fetchUrl: "userroletemplate/getUserroletemplatebyId",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }

            const inputParam = {
                methodUrl: "UserroleTemplatemaster",
                classUrl: this.props.Login.inputParam.classUrl,
                inputData: inputData,
                operation: operation,
                postParam,
                selectedRecord : {...this.state.selectedRecord}
            }

            const masterData = this.props.Login.masterData;
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, openModal: true, screenData: { inputParam, masterData },
                        operation: operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
        }

    }

    //to delete a recored
    deleteRecord = (operation, ncontrolCode) => {
        const selectedRecord = this.props.Login.selectedRecord ? this.props.Login.selectedRecord : "";
        // const selectedInput = this.state.selectedInput ? this.state.selectedInput : "";
        const selected = this.props.Login.masterData.selectedURTVersion;
        if (selectedRecord["ntransactionstatus"] === transactionStatus.APPROVED || selectedRecord["ntransactionstatus"] === transactionStatus.RETIRED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTODELETE" }));
        }
        else {
            let inputData = [];
            inputData = {
                "userinfo": this.props.Login.userInfo,
                "ntreetemplatecode": this.props.Login.masterData.realApprovalSubTypeValue.item.ntemplatecode,
                "napprovalsubtypecode": this.props.Login.masterData.realApprovalSubTypeValue.value,
                "nregtypecode": this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.value : -1,
                "nregsubtypecode": this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.value : -1,
                "ntreeversiontempcode": selected.ntreeversiontempcode,
                "isregneed": this.props.Login.masterData.realApprovalSubTypeValue.item.nisregsubtypeconfigneed
            }

            const postParam = {
                inputListName: "listuserroletemplate", selectedObject: "selectedURTVersion",
                primaryKeyField: "ntreeversiontempcode",
                primaryKeyValue: selected.ntreeversiontempcode,
                fetchUrl: "userroletemplate/getUserroletemplatebyId",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }


            const inputParam = {
                methodUrl: "UserroleTemplatemaster",
                classUrl: this.props.Login.inputParam.classUrl,
                inputData: inputData,
                operation: operation,
                postParam,
                selectedRecord: {...this.state.selectedRecord}
            }
            const masterData = this.props.Login.masterData;
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, openModal: true, screenData: { inputParam, masterData },
                        operation: operation
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
        }

    }

    saveTreetemplate = (saveType, formRef) => {

        let listUserRoleTree = [];
        let levelno = 0;
        let selectedRecord = this.props.Login.selectedRecord ? this.props.Login.selectedRecord : "";
        //const selectedLevel = this.state.selectedRole.length>0 ? this.state.selectedRole : this.props.Login.selectedRecord?this.props.Login.selectedRecord:"";
        //this.state.selectedRole=this.props.Login.selectedRecord ? this.props.Login.selectedRecord : "";
        const selectedInput = this.state.selectedInput ? this.state.selectedInput : "";
        const selected = this.props.Login.masterData.selectedURTVersion;

        this.state.selectedRole=[];
        for (let index = 0; index < this.props.Login.totalLevel; index++) {
            levelno = index + 1;
            if (selectedRecord[index]) {
                listUserRoleTree.push((selectedRecord[index]).toString())
                //this.state.selectedRole.push((selectedRecord[index]).toString());
            }
            else {
                return toast.info(this.props.intl.formatMessage({ id: "IDS_PLESESELECTTHELEVEL" }) + levelno);
            }
           
            // if (selectedLevel[index]) {
            //     listUserRoleTree.push((selectedLevel[index]).toString())
            //     this.state.selectedRole.push((listUserRoleTree[index]).toString());
            // }
            // else {
            //     return toast.info(this.props.intl.formatMessage({ id: "IDS_PLESESELECTTHELEVEL" }) + levelno);
            // }
        }
        let inputData = [];
        let methodUrl = "";
        inputData = {
            "userinfo": this.props.Login.userInfo,
            "treetemptranstestgroup": listUserRoleTree,
            "specname": selectedInput.sversiondescription,
            "ntemplatecode": this.props.Login.masterData.realApprovalSubTypeValue.item.ntemplatecode,
            "napprovalsubtypecode": this.props.Login.masterData.realApprovalSubTypeValue.value,
            "nregtypecode": this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.value : -1,
            "nregsubtypecode": this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.value : -1,
            "ntreeversiontempcode": selected === undefined ? -1 : selected.ntreeversiontempcode ? selected.ntreeversiontempcode : -1,
            "napprovalconfigcode": selectedRecord["napprovalconfigcode"] ? selectedRecord["napprovalconfigcode"] : undefined,
            "isregneed": this.props.Login.masterData.realApprovalSubTypeValue.item.nisregsubtypeconfigneed,
        }


        let postParam = undefined;

        if (this.props.Login.operation === "create") {
            methodUrl = "UserRoleTemplatemaster";
        }
        else {
            methodUrl = "EditUserRoleTemplatemaster";
            postParam = { inputListName: "listuserroletemplate", selectedObject: "selectedURTVersion", primaryKeyField: "ntreeversiontempcode" };
        }
        const inputParam = {
            methodUrl: methodUrl,
            classUrl: this.props.Login.inputParam.classUrl,
            inputData: inputData,
            operation: this.props.Login.operation,
            searchRef: this.searchRef,
            formRef, postParam, selectedRecord:{...this.state.selectedRecord}
        }

        const masterData = this.props.Login.masterData;
        
        //selectedRecord['esignreason']="";
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, selectedRecord,saveType
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }


    onChangeCombo = (event, levelno, operation) => {
        const selectedRecord = this.props.Login.selectedRecord ? this.props.Login.selectedRecord : {} || {};
        let index = (this.props.Login.userRoleActualData).findIndex(data => data.nuserrolecode === parseInt(selectedRecord[levelno]));
        if (event !== null) {
            if (selectedRecord[levelno]) {
                this.props.Login.userRoleData.push(this.props.Login.userRoleActualData[index]);
            }
            index = (this.props.Login.userRoleData).findIndex(data => data.nuserrolecode === parseInt(event.value));
            (this.props.Login.userRoleData).splice(index, 1);
            index = (this.props.Login.userRoleActualData).findIndex(data => data.nuserrolecode === parseInt(event.value));
            (this.props.Login.userRoleTreeData[levelno]) = (this.props.Login.userRoleActualData[index]);

            selectedRecord[levelno] = event.value;

            // const  TaguserRoleData  = constructOptionList(this.props.Login.userRoleData ||[], "nuserrolecode",
            // "suserrolename" , undefined, undefined, undefined);
            // const  TagListuserRoleData  = TaguserRoleData.get("OptionList")

            let userRoleData = this.props.Login.userRoleData || [];
            let userRoleTreeData = this.props.Login.userRoleTreeData;

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { userRoleData, selectedRecord, userRoleTreeData }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            if (selectedRecord[levelno]) {
                this.props.Login.userRoleData.push(this.props.Login.userRoleActualData[index]);
                delete selectedRecord[levelno];
            }
            // const  TaguserRoleData  = constructOptionList(this.props.Login.userRoleData ||[], "nuserrolecode",
            // "suserrolename" , undefined, undefined, undefined);
            // const  TagListuserRoleData  = TaguserRoleData.get("OptionList")

            let userRoleData = this.props.Login.userRoleData || [];

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { userRoleData }
            }
            this.props.updateStore(updateInfo, selectedRecord);
        }
    }

    onEsignInputOnChange = (event) => {
        // const selectedRecord = {...this.props.Login.selectedRecord,
        //     ...this.state.selectedRecord} || {};
        const selectedRecord = this.props.Login.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === "agree") {
                selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
            }
        } else {
            selectedRecord[event.target.name] = event.target.value;
        }
        //this.setState({ selectedRecord });
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { selectedRecord}
        }
        this.props.updateStore(updateInfo);
    }

    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    // sreason: this.state.selectedRecord["esigncomments"],
                    // nreasoncode:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    // spredefinedreason:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
                    sreason: this.props.Login.selectedRecord["esigncomments"],
                    nreasoncode:this.props.Login.selectedRecord["esignreason"] && this.props.Login.selectedRecord["esignreason"].value,
                    spredefinedreason:this.props.Login.selectedRecord["esignreason"] && this.props.Login.selectedRecord["esignreason"].label,
               
                },
                //password: this.state.selectedRecord["esignpassword"]
                password: this.props.Login.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }
        this.props.validateEsignCredential(inputParam, "openModal");
    }

    onInputOnChange = (event) => {
        const selectedInput = this.state.selectedInput || {};
        selectedInput[event.target.name] = event.target.value;
        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: { selectedInput }
        // }
        // this.props.updateStore(updateInfo);
        this.setState({ selectedInput })
    }

    reloadData = () => {
        //ALPD-4803 done by Dhanushya RI,To check searchref key is present or not
        if (this.searchRef && this.searchRef.current) {
            this.searchRef.current.value = "";
          }
        let inputData = {
            userinfo: this.props.Login.userInfo,
            nflag: this.props.Login.masterData.realApprovalSubTypeValue.item.nisregsubtypeconfigneed === transactionStatus.YES ? 2 : 1,
            nregtypecode: parseInt(this.props.Login.masterData.realRegTypeValue ? this.props.Login.masterData.realRegTypeValue.value || -1 : -1),
            nregsubtypecode: parseInt(this.props.Login.masterData.realRegSubTypeValue ? this.props.Login.masterData.realRegSubTypeValue.value || -1 : -1),
            napprovalsubtypecode: this.props.Login.masterData.realApprovalSubTypeValue.value,
            ntreetemplatecode: this.props.Login.masterData.realApprovalSubTypeValue.item.ntemplatecode,
            ntreeversiontempcode: -1,
            nmodulecode: 1,
            isregneed: this.props.Login.masterData.realApprovalSubTypeValue.item.nisregsubtypeconfigneed,
        };    

        let inputParam = { masterData:{...this.props.Login.masterData, searchedData:undefined}, inputData };
        this.props.getURTFilterSubmit(inputParam);

        // const inputParam = {
        //     inputData: { "userinfo": this.props.Login.userInfo },
        //     classUrl: "userroletemplate",
        //     methodUrl: "Userroletemplate",
        //     userInfo: this.props.Login.userInfo,
        //     displayName: "IDS_USERROLETEMPLATE"
        //     //screenName:"IDS_USERROLETEMPLATE"
        // };

        // this.props.callService(inputParam);
    }

    componentDidUpdate(previousProps) {
        let updateState = false

        let { selectedRecord, userRoleControlRights, controlMap,
            listApprovalsubtype, listRegistrationType, listRegistrationSubType } = this.state;

        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]
                    && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                updateState = true;
            }

        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            updateState = true;
            selectedRecord = this.props.Login.selectedRecord
        }
        // if (this.props.Login.selectedInput !== previousProps.Login.selectedInput) {
        //     updateState = true;
        //     selectedInput = this.props.Login.selectedInput
        // }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            
            updateState = true;
            // const selectedRecord = {}
            const selectedInput = {}
            let Taglstapprovalsubtype;
            let TaglistRegistrationType;
            let TaglistRegistrationSubType;

            if (this.props.Login.masterData.levelsuserroletemplate  &&
                this.props.Login.masterData.levelsuserroletemplate.length > 0){

                    selectedRecord["napprovalconfigcode"] = this.props.Login.masterData.levelsuserroletemplate[0]["napprovalconfigcode"];
                    selectedRecord["ntransactionstatus"] = this.props.Login.masterData.levelsuserroletemplate[0]["ntransactionstatus"] ;
            }
            else{
                if (selectedRecord){
                    selectedRecord["napprovalconfigcode"] = -1;
                 }
                else{
                    selectedRecord = {napprovalconfigcode: -1};
                }
                selectedRecord["ntransactionstatus"] = this.props.Login.selectedRecord ? this.props.Login.selectedRecord["ntransactionstatus"] : [];
                
            }
            // selectedRecord["napprovalconfigcode"] = this.props.Login.masterData.levelsuserroletemplate ? this.props.Login.masterData.levelsuserroletemplate.length > 0 ?
            //     this.props.Login.masterData.levelsuserroletemplate[0]["napprovalconfigcode"] : -1 : -1

            // selectedRecord["ntransactionstatus"] = this.props.Login.masterData.levelsuserroletemplate ? this.props.Login.masterData.levelsuserroletemplate.length > 0 ?
            //     this.props.Login.masterData.levelsuserroletemplate[0]["ntransactionstatus"] :
            //     this.props.Login.selectedRecord ? this.props.Login.selectedRecord["ntransactionstatus"] : [] : [];

            if (this.props.Login.masterData.lstapprovalsubtype) {
                Taglstapprovalsubtype = constructOptionList(this.props.Login.masterData.lstapprovalsubtype || [], "napprovalsubtypecode", "ssubtypename", "ntemplatecode", "ascending", undefined);
                listApprovalsubtype = Taglstapprovalsubtype.get("OptionList");
            }
            if (this.props.Login.masterData.listRegistrationType) {
                TaglistRegistrationType = constructOptionList(this.props.Login.masterData.listRegistrationType || [], "nregtypecode", "sregtypename", undefined, undefined, undefined);
                listRegistrationType = TaglistRegistrationType.get("OptionList");
            }
            if (this.props.Login.masterData.listRegistrationSubType) {
                TaglistRegistrationSubType = constructOptionList(this.props.Login.masterData.listRegistrationSubType || [], "nregsubtypecode", "sregsubtypename", "nsorter", "ascending", undefined);
                listRegistrationSubType = TaglistRegistrationSubType.get("OptionList");
            }
            if (this.props.Login.masterData.levelsuserroletemplate) {
                sortData(this.props.Login.masterData.levelsuserroletemplate, "ascending", "nlevelno");
            }

            selectedInput["isRegNeed"] = this.props.Login.masterData.selectedInput ? this.props.Login.masterData.selectedInput["isRegNeed"]
                : this.props.Login.masterData.lstapprovalsubtype ? this.props.Login.masterData.lstapprovalsubtype.length > 0 ?
                    this.props.Login.masterData.lstapprovalsubtype[0]["nisregsubtypeconfigneed"] :
                    "" ? "" : "" : "";
            if (updateState) {
                this.setState({
                    selectedRecord, controlMap, userRoleControlRights,
                    listApprovalsubtype, listRegistrationType, listRegistrationSubType,
                    selectedInput
                })
            }
        }
    }

    onFilterSubmit = () => {

        let inputData = {
            userinfo: this.props.Login.userInfo,
            nflag: this.props.Login.masterData.defaultapprovalsubtype.item.nisregsubtypeconfigneed === transactionStatus.YES ? ApprovalSubType.TESTRESULTAPPROVAL : ApprovalSubType.TESTGROUPAPPROVAL,
            nregtypecode: parseInt(this.props.Login.masterData.defaultregtype ? this.props.Login.masterData.defaultregtype.value || transactionStatus.NA : transactionStatus.NA),
            nregsubtypecode: parseInt(this.props.Login.masterData.defaultregsubtype ? this.props.Login.masterData.defaultregsubtype.value || transactionStatus.NA : transactionStatus.NA),
            napprovalsubtypecode: this.props.Login.masterData.defaultapprovalsubtype.value,
            ntreetemplatecode: this.props.Login.masterData.defaultapprovalsubtype.item.ntemplatecode,
            ntreeversiontempcode: -1,
            nmodulecode: 1,
            isregneed: this.props.Login.masterData.defaultapprovalsubtype.item.nisregsubtypeconfigneed,
        };
        let masterData = {
            ...this.props.Login.masterData,
            realApprovalSubTypeValue: this.props.Login.masterData.defaultapprovalsubtype,
            realRegTypeValue: this.props.Login.masterData.defaultregtype,
            realRegSubTypeValue: this.props.Login.masterData.defaultregsubtype
        }
        let inputParam = { masterData, inputData,searchRef:this.searchRef };
        if(inputData.napprovalsubtypecode === ApprovalSubType.TESTRESULTAPPROVAL){
           if(inputData.nregsubtypecode !== transactionStatus.NA && inputData.nregtypecode !== transactionStatus.NA)
           {
              this.props.getURTFilterSubmit(inputParam);
           }else{
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }))
           }
        }
        else{
            this.props.getURTFilterSubmit(inputParam);
        }
       
    }

    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined
            }
        }
        this.props.updateStore(updateInfo);
    }


    static getDerivedStateFromProps(props, state) {
        if (props.Login.masterStatus !== "") {
            if (props.Login.errorCode === 417 || props.Login.errorCode === 409) {
                toast.warn(props.Login.masterStatus);
                props.Login.masterStatus = "";
            }
        }
        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        if (!props.Login.loadEsign) {
            return { selectedRecord: { ...state.selectedRecord , esigncomments: '', esignpassword: '' } }
        }
        return null;
    }
}


const mapStatetoProps = (state) => {
    return {
        Login: state.Login
    }

}
export default connect(mapStatetoProps, {
    callService, crudMaster, addScreenModel, updateStore,
    validateEsignCredential, getURTFilterRegType, getURTFilterRegSubType, getURTFilterSubmit,
    fetchRecordById, getTreetemplate, filterColumnData, postCRUDOrganiseSearch
})(injectIntl(userroletempalate));



