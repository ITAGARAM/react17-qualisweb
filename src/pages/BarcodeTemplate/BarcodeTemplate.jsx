import React from 'react'
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import {
    callService, crudMaster, validateEsignCredential, updateStore, getBarcodeTemplateComboService,
    getBarcodeTemplateControl, getReactInputFields, getReactQuerybuilderTableRecord, getBarcodeTemplateDetail,
    getEditBarcodeTemplateComboService, filterColumnData
} from '../../actions';
import { ReadOnlyText, ContentPanel } from '../../components/App.styles';
import { constructOptionList, getControlMap, showEsign } from '../../components/CommonScript';
import ListMaster from '../../components/list-master/list-master.component'
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../../pages/audittrail/Esign';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { ListWrapper } from '../../components/client-group.styles';
import {
    SampleType, transactionStatus
} from '../../components/Enumeration';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import AddBarcodeTemplate from './AddBarcodeTemplate'
import BarcodePreRegDesign from './BarcodePreRegDesign';
import PortalModal from '../../PortalModal';
import { faUserTimes, faPencilAlt, faThumbsUp, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavHeader } from '../../components/sidebar/sidebar.styles';
import FormInput from '../../components/form-input/form-input.component';
import rsapi from '../../rsapi';


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class BarcodeTemplate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            designtemplatemappingData: [],
            masterStatus: "",
            error: "",
            operation: "",
            screenName: undefined,
            userLogged: true,
            selectedDesignTemplateMapping: undefined,
            sidebarview: false,
            userRoleControlRights: [],
            controlMap: new Map(),
            showAccordian: true,
            selectedInput: "",
            selectedRecord: { "nneedconfiguration": 4 },
            totalLevel: 0
        };
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
        this.searchFieldList = ["sformname", "scontrolname", "sdisplayname"];

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
        const data = []

        this.props.Login.masterData.SelectedBarcodeTemplate &&
            this.props.Login.masterData.SelectedBarcodeTemplate.jsondata &&
            this.props.Login.masterData.SelectedBarcodeTemplate.jsondata.screenfilter !== undefined &&

            this.props.Login.masterData.SelectedBarcodeTemplate.jsondata.screenfilter.map(row => {
                row.children.map(column => {
                    column.children.map(component => {
                        if (component.hasOwnProperty("children")) {
                            component.children.map(componentrow => {
                                if (componentrow.inputtype === "combo") {
                                    data.push({ slabelname: componentrow.label });
                                }
                            })
                        } else {
                            if (component.inputtype === "combo") {
                                data.push({ slabelname: component.label });
                            }
                        }
                    })
                })
            })

        const addId = this.state.controlMap.has("AddBarcodeTemplate") && this.state.controlMap.get("AddBarcodeTemplate").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteBarcodeTemplate") && this.state.controlMap.get("DeleteBarcodeTemplate").ncontrolcode;
        const approveId = this.state.controlMap.has("ApproveBarcodeTemplate") && this.state.controlMap.get("ApproveBarcodeTemplate").ncontrolcode;
        const editId = this.state.controlMap.has("EditBarcodeTemplate") && this.state.controlMap.get("EditBarcodeTemplate").ncontrolcode;
        const retireId = this.state.controlMap.has("RetireBarcodeTemplate") && this.state.controlMap.get("RetireBarcodeTemplate").ncontrolcode;

        const filterParam = {
            inputListName: "BarcodeTemplate", selectedObject: "SelectedBarcodeTemplate", primaryKeyField: "nbarcodetemplatecode",
            fetchUrl: "barcodetemplate/getBarcodeTemplate", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData, searchFieldList: this.searchFieldList
        };

        const addParam = {
            screenName: this.props.intl.formatMessage({ id: "IDS_BARCODETEMPLATE" }),
            operation: "create",
            userInfo: this.props.Login.userInfo,
            controlId: addId,
        }
        return (
            <>
                <ListWrapper className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
                    <Row noGutters={true}>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                            <ListMaster
                                formatMessage={this.props.intl.formatMessage}
                                screenName={this.props.intl.formatMessage({ id: "IDS_DESIGNTEMPLATEMAPPING" })}
                                masterData={this.props.Login.masterData}
                                userInfo={this.props.Login.userInfo}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.BarcodeTemplate}
                                getMasterDetail={(barcodeTemplate) => this.props.getBarcodeTemplateDetail(barcodeTemplate, this.props.Login.userInfo, this.props.Login.masterData)}
                                selectedMaster={this.props.Login.masterData.SelectedBarcodeTemplate}
                                primaryKeyField="nbarcodetemplatecode"
                                mainField="sformname"
                                firstField="scontrolname"
                                secondField="sdisplayname"
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={addId}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData}
                                hidePaging={true}
                                openModal={() => this.props.getBarcodeTemplateComboService(addParam)}
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
                                    {this.props.Login.masterData.BarcodeTemplate && this.props.Login.masterData.BarcodeTemplate.length > 0 && this.props.Login.masterData.SelectedBarcodeTemplate ?
                                        <>
                                            <Card.Header>
                                                <Card.Title>
                                                    <h1 className="product-title-main">{this.props.Login.masterData.SelectedBarcodeTemplate.scontrolname}</h1>
                                                </Card.Title>
                                                <Card.Subtitle className="text-muted font-weight-normal">
                                                    <Row>
                                                        <Col md={10} className="d-flex">
                                                            <h2 className="product-title-sub flex-grow-1">
                                                                {/* {`${this.props.intl.formatMessage({ id: "IDS_VERSION" })} : ${this.props.Login.masterData.SelectedBarcodeTemplate.sversionno}`} */}
                                                                <span className={`btn btn-outlined ${this.props.Login.masterData.SelectedBarcodeTemplate.ntransactionstatus === transactionStatus.DRAFT ? "outline-secondary" : this.props.Login.masterData.SelectedBarcodeTemplate.ntransactionstatus === transactionStatus.APPROVED ? "outline-success" : "outline-danger"} btn-sm mx-md-3 mx-sm-2`}>
                                                                    {this.props.Login.masterData.SelectedBarcodeTemplate.sdisplayname}
                                                                </span>

                                                            </h2>
                                                        </Col>
                                                        <Col md={2}>
                                                            <div className="d-flex product-category float-right icon-group-wrap">
                                                                <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                    hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                    onClick={() => this.onEditClick(editId)}
                                                                >
                                                                    <FontAwesomeIcon icon={faPencilAlt} title={this.props.intl.formatMessage({ id: "IDS_EDIT" })} />
                                                                </Nav.Link>
                                                                <Nav.Link className=" btn btn-circle outline-grey mr-2"
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                    hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                    // onClick={() => this.ConfirmDelete(this.state.approveId)}>
                                                                    onClick={() => this.ConfirmDelete(deleteId)}>
                                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                                </Nav.Link>

                                                                <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                    hidden={this.state.userRoleControlRights.indexOf(approveId) === -1}
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_APPROVE" })}
                                                                    onClick={() => this.onApproveClick(approveId)}
                                                                >
                                                                    <FontAwesomeIcon icon={faThumbsUp} title={this.props.intl.formatMessage({ id: "IDS_APPROVE" })} />
                                                                </Nav.Link>
                                                                <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                    hidden={this.state.userRoleControlRights.indexOf(retireId) === -1}
                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_RETIRE" })}
                                                                    onClick={() => this.onRetireClick(retireId)}
                                                                >
                                                                    <FontAwesomeIcon icon={faUserTimes} />
                                                                </Nav.Link>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Card.Subtitle>
                                            </Card.Header>

                                            {
                                                <ContentPanel className="panel-main-content">
                                                    <Card className="border-0">
                                                        <Card.Body className="form-static-wrap">

                                                            <Row>
                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <FormLabel><FormattedMessage id="IDS_SELECTSCREENCONTROL" message="Screen Control" /></FormLabel>
                                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedBarcodeTemplate.scontrolname}</ReadOnlyText>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <FormLabel><FormattedMessage id="IDS_ASKNUMBEROFBARCODEWANTTOPRINT" message="Number Of Barcode Needed" /></FormLabel>
                                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedBarcodeTemplate.sbarcodeprint}</ReadOnlyText>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <FormLabel><FormattedMessage id="IDS_SQLQUERYNEED" message="Need Screen Filter" /></FormLabel>
                                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedBarcodeTemplate.ssqlqueryneed}
                                                                        </ReadOnlyText>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <FormLabel><FormattedMessage id="IDS_FILTERBASEDSQLQUERYNEED" message="Need Screen Filter" /></FormLabel>
                                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedBarcodeTemplate.sfiltersqlqueryneed}
                                                                        </ReadOnlyText>
                                                                    </FormGroup>
                                                                </Col>
                                                                {
                                                                    this.props.Login.masterData.SelectedBarcodeTemplate.jsondata.nsqlqueryneed && this.props.Login.masterData.SelectedBarcodeTemplate.jsondata.nsfilterqlqueryneed !==false && <Col md={4}>
                                                                        <FormGroup>
                                                                            <FormLabel><FormattedMessage id="IDS_SQLQUERYNAME" message="Need Screen Filter" /></FormLabel>
                                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedBarcodeTemplate.ssqlqueryname}
                                                                            </ReadOnlyText>
                                                                        </FormGroup>
                                                                    </Col>
                                                                }
                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <FormLabel><FormattedMessage id="IDS_NEEDSCREENFILTER" message="Need Screen Filter" /></FormLabel>
                                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedBarcodeTemplate.sneedconfiguration}
                                                                        </ReadOnlyText>
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>


                                                        </Card.Body>
                                                    </Card>
                                                </ContentPanel>

                                            }
                                           
                                            {<ContentPanel className="panel-main-content">

                                                <ListWrapper className="card-body">
                                                    <React.Fragment>
                                                        <ListWrapper className="tree-view1 border-left tree-left ">
                                                       { data.length > 0 && <h4>{"Filter Template"}</h4>}
                                                            {data.length > 0 ?
                                                                data.map((input, i) =>
                                                                    <ListWrapper key={i} className="form-label-group tree-level list_get">
                                                                        <NavHeader className="line" style={{ width: (i + 1) * 10 }}> </NavHeader>
                                                                        {/* <NavHeader id={i} 
                                                                        //value={totalLevel}
                                                                            className="add_field_button">+</NavHeader> */}
                                                                        {/* <NavHeader className="levelcolour" md={1}>Level {i + 1}</NavHeader>  */}
                                                                        {/* <NavHeader className="levelcolour" md={1}>{this.props.intl.formatMessage({ id: "IDS_LEVEL" })} {i + 1}</NavHeader> */}
                                                                        <ListWrapper style={{ marginLeft: (i + 8) * 10 }}>
                                                                            <FormInput className="input_custom" value={input.slabelname} id="levelname" type="text" />
                                                                        </ListWrapper>
                                                                    </ListWrapper>
                                                                ) : ""
                                                            }
                                                        </ListWrapper>
                                                    </React.Fragment>
                                                </ListWrapper>
                                            </ContentPanel>}
                                        </>
                                        : ""
                                    }
                                </Card>
                            </ContentPanel>
                        </Col>
                    </Row>
                </ListWrapper>

                {this.props.Login.openPortal ?
                    <PortalModal>
                        <BarcodePreRegDesign
                            closeModal={this.closeModal}
                            saveScreenFilter={this.saveScreenFilter}
                            selectedRecord={{ ...this.state.selectedRecord }}
                        // nsampletypecode={this.state.breadCrumbData.length ? this.state.breadCrumbData[0].item.value : -1}
                        // sampleType={this.state.breadCrumbData.length ? this.state.breadCrumbData[0].item : undefined}
                        // defaultTemplate={this.state.breadCrumbData.length ? this.state.breadCrumbData[1].label === "IDS_TEMPLATETYPE" ? this.state.breadCrumbData[1].item : this.state.breadCrumbData[2].item : undefined}
                        //  ncategorybasedflowrequired={this.state.breadCrumbData.length ? this.state.breadCrumbData[0].item.item.ncategorybasedflowrequired : 4}
                        //searchRef={this.searchRef}
                        />
                    </PortalModal> : ""}

                {this.props.Login.openModal &&
                    <SlideOutModal
                        show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={[
                            { "idsName": "IDS_SCREEN", "dataField": "nformcode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "combo" },
                            { "idsName": "IDS_CONTROL", "dataField": "ncontrolcode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "combo" }
                        ]}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : <AddBarcodeTemplate
                                qualisList={this.props.Login.qualisList}
                                selectedRecord={{ ...this.state.selectedRecord }}
                                onComboChange={this.onComboChange}
                                controlList={this.props.Login.controlList}
                                onInputOnChange={this.onInputOnChange}
                                AddFilterDesign={this.AddFilterDesign}
                                // lstFilterlevel={this.props.Login.lstFilterlevel}
                                // totalLevel={this.props.Login.totalLevel}
                                SqlQuery={this.props.Login.SqlQuery}
                            ></AddBarcodeTemplate>}
                    />
                }

            </>
        );
    }

    onApproveClick = (approveId) => {

        if (this.props.Login.masterData.SelectedBarcodeTemplate.ntransactionstatus === transactionStatus.DRAFT) {

            let inputData = [];
            inputData["userinfo"] = this.props.Login.userInfo;
            //add               
            let postParam = undefined;
            inputData["barcodetemplate"] = { "nbarcodetemplatecode": this.props.Login.masterData.SelectedBarcodeTemplate["nbarcodetemplatecode"] ? this.props.Login.masterData.SelectedBarcodeTemplate["nbarcodetemplatecode"].Value : "" };
            inputData["barcodetemplate"] = this.props.Login.masterData.SelectedBarcodeTemplate;
            postParam = { inputListName: "BarcodeTemplate", selectedObject: "SelectedBarcodeTemplate", primaryKeyField: "nbarcodetemplatecode" };
            const inputParam = {
                classUrl: 'barcodetemplate',
                methodUrl: "BarcodeTemplate",
                inputData: inputData,
                operation: "approve", postParam,
                selectedRecord: { ...this.state.selectedRecord }
            }
            let saveType;

            const masterData = this.props.Login.masterData;

            const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, approveId);
            if (esignNeeded) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData }, saveType, openModal: true, operation: "approve"
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }

        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }))
        }

    }


    onRetireClick = (approveId) => {

        if (this.props.Login.masterData.SelectedBarcodeTemplate.ntransactionstatus === transactionStatus.APPROVED) {

            let inputData = [];
            inputData["userinfo"] = this.props.Login.userInfo;
            //add               
            let postParam = undefined;
            inputData["barcodetemplate"] = { "nbarcodetemplatecode": this.props.Login.masterData.SelectedBarcodeTemplate["nbarcodetemplatecode"] ? this.props.Login.masterData.SelectedBarcodeTemplate["nbarcodetemplatecode"].Value : "" };
            inputData["barcodetemplate"] = this.props.Login.masterData.SelectedBarcodeTemplate;
            postParam = { inputListName: "BarcodeTemplate", selectedObject: "SelectedBarcodeTemplate", primaryKeyField: "nbarcodetemplatecode" };
            const inputParam = {
                classUrl: 'barcodetemplate',
                methodUrl: "BarcodeTemplate",
                inputData: inputData,
                operation: "retire", postParam,
                selectedRecord: { ...this.state.selectedRecord }
            }
            let saveType;

            const masterData = this.props.Login.masterData;

            const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, approveId);
            if (esignNeeded) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData }, saveType, openModal: true, operation: "retire"
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }

        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTAPPROVERECORD" }))
        }

    }


    onEditClick = (editId) => {

        const addParam = {
            screenName: this.props.intl.formatMessage({ id: "IDS_BARCODETEMPLATE" }),
            operation: "update",
            userInfo: this.props.Login.userInfo,
            controlId: editId,
            selectedRecord: this.state.selectedRecord,
            nbarcodetemplatecode: this.props.Login.masterData.SelectedBarcodeTemplate.nbarcodetemplatecode,
            userinfo: this.props.Login.userInfo
        }
        this.props.getEditBarcodeTemplateComboService(addParam)
    }


    saveScreenFilter = (inputData, modal) => {
        const lstFilterlevel = [];
        let totalLevel = 0
        const layout = JSON.parse(inputData.registrationtemplate.jsonString);

        layout.map(row => {
            row.children.map(column => {
                column.children.map(component => {
                    if (component.hasOwnProperty("children")) {
                        component.children.map(componentrow => {
                            if (componentrow.inputtype === "combo") {
                                totalLevel = totalLevel++;
                                lstFilterlevel.push({ slabelname: componentrow.label })
                            }
                        })
                    } else {
                        if (component.inputtype === "combo") {
                            lstFilterlevel.push({ slabelname: component.label })
                            totalLevel = totalLevel++
                        }

                    }

                })
            })
        })


        const selectedRecord = { ...this.state.selectedRecord }
        selectedRecord['reactTemplate'] = inputData.registrationtemplate
        selectedRecord['lstFilterlevel'] = lstFilterlevel
        selectedRecord['totalLevel'] = totalLevel


        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                // reactTemplate: inputData.registrationtemplate,
                // lstFilterlevel, totalLevel,
                selectedRecord,
                openPortal: false, openModal: true
            }
        }
        this.props.updateStore(updateInfo);

        //        this.setState({ reactTemplate: inputData.registrationtemplate, lstFilterlevel,totalLevel })
    }

    reloadData = () => {
        this.searchRef.current.value = "";
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: "barcodetemplate",
            methodUrl: "BarcodeTemplate",
            displayName: this.props.Login.displayName,
            userInfo: this.props.Login.userInfo
        };
        this.props.callService(inputParam);
    }

    AddFilterDesign = () => {
        if (this.state.selectedRecord['nformcode']) {
            if (this.state.selectedRecord['ncontrolcode']) {

                let design = []
                if (this.state.selectedRecord.reactTemplate && this.state.selectedRecord.reactTemplate.jsonString) {
                    design = JSON.parse(this.state.selectedRecord.reactTemplate.jsonString);
                } else {
                    design = [
                        {
                            "id": "pv1OWbsMYq",
                            "type": "row",
                            "children": [
                                {
                                    "id": "2zMtRhjb2t",
                                    "type": "column",
                                    "children": []
                                }
                            ]
                        }
                    ]
                }

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        openPortal: true, openModal: false, design
                    }
                }
                this.props.updateStore(updateInfo);

            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTEDTHECONTROL" }));
            }

        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTEDTHEFORM" }));
        }
    }

    componentDidUpdate(previousProps) {
        let updateState = false;

        let { selectedRecord, userRoleControlRights, controlMap } = this.state;


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
            selectedRecord = { ...this.props.Login.selectedRecord }
        }


        if (updateState) {
            this.setState({
                selectedRecord, controlMap, userRoleControlRights

            })
        }
    }




    ConfirmDelete = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteTemplate(deleteId));
    }

    deleteTemplate = (ncontrolCode) => {
        if (this.props.Login.masterData.SelectedBarcodeTemplate.ntransactionstatus !== transactionStatus.DRAFT) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTODELETE" }));
        }
        else {

            const postParam = {
                inputListName: "BarcodeTemplate", selectedObject: "SelectedBarcodeTemplate",
                primaryKeyField: "nbarcodetemplatecode",
                primaryKeyValue: this.props.Login.masterData.SelectedBarcodeTemplate.nbarcodetemplatecode,
                fetchUrl: "barcodetemplate/getBarcodeTemplate",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }

            const operation = "delete"

            const inputParam = {
                classUrl: "barcodetemplate", //this.props.Login.inputParam.classUrl,
                methodUrl: "BarcodeTemplate", postParam,
                inputData: {
                    // "barcodetemplate": selectedRecord,
                    "userinfo": this.props.Login.userInfo,
                    "barcodetemplate": this.props.Login.masterData.SelectedBarcodeTemplate
                },
                operation,
                selectedRecord: { ...this.state.selectedRecord }
            }

            const masterData = this.props.Login.masterData;


            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },
                        openModal: true, screenName: this.props.Login.screenName, operation
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
                    nreasoncode: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,

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
        if (this.props.Login.openPortal) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { openPortal: false, openModal: true }
            }
            this.props.updateStore(updateInfo);
        } else {
            if (this.props.Login.loadEsign) {
                if (this.props.Login.operation === "approve"
                    || this.props.Login.operation === "delete") {
                    loadEsign = false;
                    openModal = false;
                    selectedRecord = {};
                }
                else {
                    loadEsign = false;
                }
            }
            else {
                openModal = false;
                selectedRecord = {};
            }

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { openModal, loadEsign, selectedRecord, selectedId: null, dataList: [], dataListCount: [], dataListSubSample: [], dataListCountSubSample: [] }
            }
            this.props.updateStore(updateInfo);
        }


    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = { ...this.state.selectedRecord } || {};
        selectedRecord[fieldName] = comboData;

        if (fieldName === 'nformcode') {
            selectedRecord['reactTemplate'] = undefined
            selectedRecord['lstFilterlevel'] = []
            selectedRecord['totalLevel'] = 0
            selectedRecord['ncontrolcode'] = undefined
            const map = {
                userInfo: this.props.Login.userInfo,
                masterData: this.props.Login.masterData,

            }
            this.props.getBarcodeTemplateControl(map, selectedRecord);

            //     // const updateInfo = {
            //     //     typeName: DEFAULT_RETURN,
            //     //     data: {
            //     //         loading: true,
            //     //     }
            //     // }
            //   //  this.props.updateStore(updateInfo);

            //     rsapi().post("barcodetemplate/getBarcodeTemplateControl", { 'userinfo': this.props.Login.userInfo, nformcode: selectedRecord.nformcode.value })
            //         .then(response => {
            //             const qualisMap = constructOptionList(response.data["controlList"] || [], "ncontrolcode",
            //                 "sdisplayname", undefined, undefined, true);
            //             const qualisList = qualisMap.get("OptionList");

            //             const updateInfo = {
            //                 typeName: DEFAULT_RETURN,
            //                 data: {
            //                     loading: false,
            //                     controlList: qualisList,
            //                     selectedRecord,
            //                 }
            //             }
            //             this.props.updateStore(updateInfo);
            //             this.setState({selectedRecord})
            //         })


        } else if (fieldName === 'ncontrolcode') {

            selectedRecord['reactTemplate'] = undefined
            selectedRecord['lstFilterlevel'] = []
            selectedRecord['totalLevel'] = 0


            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    // reactTemplate: undefined,
                    // lstFilterlevel: [], totalLevel: 0,
                    selectedRecord
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.setState({ selectedRecord });
        }
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            if (event.target.name === "nsqlqueryneed") {
                if (event.target.value === false) {
                    delete selectedRecord['nsqlquerycode']
                     selectedRecord['nfiltersqlqueryneed']=4
                }
                selectedRecord[event.target.name] = event.target.value;
            } 
            else if(event.target.name === "nfiltersqlqueryneed"){
                if (event.target.value === true) {
                    delete selectedRecord['nsqlquerycode']
                }
                selectedRecord[event.target.name] = event.target.value;
            }
            else {
                selectedRecord[event.target.name] = event.target.value;
            }

        }
        if (event.target.name === 'nneedconfiguration') {
            if (selectedRecord[event.target.name] === 4) {

                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        reactTemplate: undefined,
                        lstFilterlevel: [], totalLevel: 0,
                    }
                }
                this.props.updateStore(updateInfo);

            }


        }



        this.setState({ selectedRecord });
    }

    onSaveClick = (saveType) => {
        let check = true;
        if (this.state.selectedRecord.nneedconfiguration === 3) {
            if (this.state.selectedRecord.reactTemplate === undefined) {
                check = false
                toast.warn(this.props.intl.formatMessage({ id: "IDS_CREATEFILTERCONFIGURATION" }))
            }

        }
        if(check!==false){
            if (this.state.selectedRecord.nsqlqueryneed === 3) {
                if(this.state.selectedRecord.nfiltersqlqueryneed===3){
                    if (this.state.selectedRecord.nneedconfiguration !== 3) {
                        check = false
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_CHOOSEFILTERCONFIGURATION" }))
                }
            }
                else if (this.state.selectedRecord.nsqlquerycode === undefined) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_SELQCTSQLQUERY" }))
                    check = false
                }
    
            }
        }
       
        if (check) {
            let inputData = [];
            const selectedRecord = { ...this.state.selectedRecord }
            const reactTemplate = selectedRecord.reactTemplate && selectedRecord.reactTemplate
            const masterData = this.props.Login.masterData;
            const barcodeTemplate = {}
            let postParam = undefined;
            if (this.props.Login.operation === 'update') {
                postParam = { inputListName: "BarcodeTemplate", selectedObject: "SelectedBarcodeTemplate", primaryKeyField: "nbarcodetemplatecode" };
                barcodeTemplate['nbarcodetemplatecode'] = masterData.SelectedBarcodeTemplate.nbarcodetemplatecode
            }

            barcodeTemplate['nformcode'] = selectedRecord.nformcode.value
            barcodeTemplate['ncontrolcode'] = selectedRecord.ncontrolcode.value
            barcodeTemplate['stableprimarykeyname'] = selectedRecord.ncontrolcode.item.stableprimarykeyname
            barcodeTemplate['nquerybuildertablecode'] = selectedRecord.ncontrolcode.item.nquerybuildertablecode
            barcodeTemplate['stablename'] = selectedRecord.ncontrolcode.item.stablename
            barcodeTemplate['jsondata'] = {
                ['screenfilter']: reactTemplate ? JSON.parse(reactTemplate.jsonString) : [],
                ['nneedconfiguration']: selectedRecord.nneedconfiguration === 3 ? true : false,
                ['nbarcodeprint']: selectedRecord.nbarcodeprint === 3 ? true : false,
                ['valuemember']: reactTemplate ? reactTemplate.valuemember : "",
                ['nsqlqueryneed']: selectedRecord.nsqlqueryneed === 3 ? true : false,
                ['nfiltersqlqueryneed']: selectedRecord.nfiltersqlqueryneed === 3 ? true : false,
                ['nsqlquerycode']: selectedRecord.nsqlqueryneed === 3 ?(selectedRecord.nfiltersqlqueryneed===4||selectedRecord.nfiltersqlqueryneed===undefined)?  selectedRecord.nsqlquerycode.value:-1 : -1,
            }

            barcodeTemplate['jsondata'] = barcodeTemplate['jsondata'];
            barcodeTemplate['jsonstring'] = JSON.stringify(barcodeTemplate['jsondata']);

            inputData['barcodetemplate'] = barcodeTemplate;
            inputData["userinfo"] = this.props.Login.userInfo;
            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: this.props.Login.inputParam.methodUrl,
                displayName: this.props.Login.inputParam.displayName,
                inputData: inputData,
                operation: this.props.Login.operation, postParam, searchRef: this.searchRef,
            }

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },
                        saveType,

                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }

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


}
export default connect(mapStateToProps, {
    callService, crudMaster, validateEsignCredential,
    updateStore, getBarcodeTemplateComboService, getBarcodeTemplateControl,
    getReactInputFields, getReactQuerybuilderTableRecord, getBarcodeTemplateDetail,
    getEditBarcodeTemplateComboService, filterColumnData
})(injectIntl(BarcodeTemplate));

