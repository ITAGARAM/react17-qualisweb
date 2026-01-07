import React from 'react'
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import {
    callService, crudMaster, validateEsignCredential, updateStore, getBarcodeTemplateComboService,
    getBarcodeTemplateControlBC, getReactInputFields, getReactQuerybuilderTableRecord,
    getBarcodeTemplateDetail, getBarcodeDynamicChange, getBarcodeTemplateControlCombo, getOpenModalForBarcodeConfig,
    getBarcodeFileParameter, getBarcodeConfigFilterSubmit, getEditBarcodeConfigurationComboService, getBarcodeConfigurationDetail,
    filterColumnData
} from '../../actions';
import { comboChild, constructOptionList, constructjsonOptionList, getControlMap, getSameRecordFromTwoArrays, showEsign } from '../../components/CommonScript';
import ListMaster from '../../components/list-master/list-master.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../../pages/audittrail/Esign';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { ListWrapper } from '../../components/client-group.styles';
import {
    SampleType, transactionStatus
} from '../../components/Enumeration';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import AddBarcodeConfiguration from './AddBarcodeConfiguration'
import BarcodeDynamicFilter from './BarcodeDynamicFilter'
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import { Affix } from 'rsuite';
import { ReadOnlyText, ContentPanel } from '../../components/App.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faThumbsUp, faTrashAlt, faUserTimes } from '@fortawesome/free-solid-svg-icons';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class BarcodeConfiguration extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            masterStatus: "",
            error: "",
            operation: "",
            screenName: undefined,
            sidebarview: false,
            userRoleControlRights: [],
            controlMap: new Map(),
            selectedRecord: {},
            selectedRecordFilter: {},
            listData: {}
        };
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
        this.searchFieldList = ["sbarcodename", "stransactionstatus", "sbarcodeprint", "sneedconfiguration", "ssqlqueryname", "ssqlqueryneed"];

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


    deleteTemplate = (ncontrolCode) => {
        if (this.props.Login.masterData.SelectedBarcodeConfiguration.ntransactionstatus !== transactionStatus.DRAFT) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTODELETE" }));
        }
        else {

            const postParam = {
                inputListName: "BarcodeConfiguration", selectedObject: "SelectedBarcodeConfiguration",
                primaryKeyField: "nbarcodeconfigurationcode",
                primaryKeyValue: this.props.Login.masterData.SelectedBarcodeConfiguration.nbarcodeconfigurationcode,
                fetchUrl: "barcodeconfiguration/getBarcodeConfiguration",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }

            const operation = "delete"
            // const selectedRecordFilter = this.state.selectedRecordFilter
            let filter = {}
            if (this.props.Login.masterData.SelecetedControl.nneedconfiguration) {
                this.props.Login.masterData.ComboComponnet
                    .map(x => {
                        filter = { ...filter, [x.label]: this.props.Login.masterData["Selected" + x.label] }
                    })
                filter = {
                    ...filter,
                    ComboComponnet: this.props.Login.masterData.ComboComponnet,
                    nformcode: this.props.Login.masterData.SelecetedScreen.nformcode,
                    ncontrolcode: this.props.Login.masterData.SelecetedControl.ncontrolcode,
                    nbarcodetemplatecode: this.props.Login.masterData.SelecetedControl.nbarcodetemplatecode,
                }
            } else {
                filter = {
                    ComboComponnet: null,
                    nformcode: this.props.Login.masterData.SelecetedScreen.nformcode,
                    ncontrolcode: this.props.Login.masterData.SelecetedControl.ncontrolcode,
                    nbarcodetemplatecode: this.props.Login.masterData.SelecetedControl.nbarcodetemplatecode,
                }
            }

            const inputParam = {
                classUrl: "barcodeconfiguration", //this.props.Login.inputParam.classUrl,
                methodUrl: "BarcodeConfiguration", postParam,
                inputData: {
                    // "barcodetemplate": selectedRecord,
                    "userinfo": this.props.Login.userInfo,
                    "BarcodeConfiguration": this.props.Login.masterData.SelectedBarcodeConfiguration, ...filter
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

    onApproveClick = (approveId) => {

        if (this.props.Login.masterData.SelectedBarcodeConfiguration.ntransactionstatus === transactionStatus.DRAFT) {

            let inputData = [];
            inputData["userinfo"] = this.props.Login.userInfo;
            //add               
            let postParam = undefined;
            inputData["barcodeconfiguration"] = { "nbarcodeconfigurationcode": this.props.Login.masterData.SelectedBarcodeConfiguration["nbarcodeconfigurationcode"] ? this.props.Login.masterData.SelectedBarcodeConfiguration["nbarcodeconfigurationcode"].Value : "" };
            inputData["barcodeconfiguration"] = this.props.Login.masterData.SelectedBarcodeConfiguration;
            postParam = { inputListName: "BarcodeConfiguration", selectedObject: "SelectedBarcodeConfiguration", primaryKeyField: "nbarcodeconfigurationcode" };
            const inputParam = {
                classUrl: 'barcodeconfiguration',
                methodUrl: "BarcodeConfiguration",
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

    ConfirmDelete = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteTemplate(deleteId));
    }


    reloadData = () => {
        this.searchRef.current.value = "";
        if (this.props.Login.masterData && this.props.Login.masterData.SelecetedScreen && this.props.Login.masterData.SelecetedControl) {


            let filter = {}
            if (this.props.Login.masterData.SelecetedScreen.nneedconfiguration) {
                this.props.Login.masterData.ComboComponnet
                    .map(x => {
                        filter = { ...filter, [x.label]: this.props.Login.masterData["Selected" + x.label] }
                    })
                filter = {
                    ...filter,
                    ComboComponnet: this.props.Login.masterData.ComboComponnet,
                    nformcode: this.props.Login.masterData.SelecetedScreen.nformcode,
                    ncontrolcode: this.props.Login.masterData.SelecetedControl.ncontrolcode,
                    nbarcodetemplatecode: this.props.Login.masterData.SelecetedScreen.nbarcodetemplatecode,
                }
            }

            let inputParam = {
                userinfo: this.props.Login.userInfo,
                masterData: {
                    ...this.props.Login.masterData,
                    searchedData: undefined
                },
                //selectedRecordFilter: this.state.selectedRecordFilter,
                ...filter
            };
            this.props.getBarcodeConfigFilterSubmit(inputParam
            );

        } else {
            toast.warn(
                this.props.intl.formatMessage({
                    id: "IDS_CHOOSEALLFILTER",
                })
            );
        }
    }

    onRetireClick = (approveId) => {

        if (this.props.Login.masterData.SelectedBarcodeConfiguration.ntransactionstatus === transactionStatus.APPROVED) {

            let inputData = [];
            inputData["userinfo"] = this.props.Login.userInfo;
            //add               
            let postParam = undefined;
            inputData["barcodeconfiguration"] = { "nbarcodeconfigurationcode": this.props.Login.masterData.SelectedBarcodeConfiguration["nbarcodeconfigurationcode"] ? this.props.Login.masterData.SelectedBarcodeConfiguration["nbarcodeconfigurationcode"].Value : "" };
            inputData["barcodeconfiguration"] = this.props.Login.masterData.SelectedBarcodeConfiguration;
            postParam = { inputListName: "BarcodeConfiguration", selectedObject: "SelectedBarcodeConfiguration", primaryKeyField: "nbarcodeconfigurationcode" };
            const inputParam = {
                classUrl: 'barcodeconfiguration',
                methodUrl: "BarcodeConfiguration",
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
            screenName: this.props.intl.formatMessage({ id: "IDS_BARCODECONFIGURATION" }),
            operation: "update",
            userInfo: this.props.Login.userInfo,
            controlId: editId,
            selectedRecord: this.state.selectedRecord,
            nbarcodeconfigurationcode: this.props.Login.masterData.SelectedBarcodeConfiguration.nbarcodeconfigurationcode,
            userinfo: this.props.Login.userInfo,
            masterData: this.props.Login.masterData,
            nsqlqueryneed: this.props.Login.masterData.SelecetedControl.nsqlqueryneed,
            nsqlquerycode: this.props.Login.masterData.SelecetedControl.nsqlquerycode

        }
        this.props.getEditBarcodeConfigurationComboService(addParam)
    }

    generateBreadcrumb = () => {
        let obj = []


        obj = [
            {
                "label": "IDS_SCREEN",
                "value": this.props.Login.masterData.SelecetedScreen && this.props.Login.masterData.SelecetedScreen.sformname,
                "item": this.props.Login.masterData.SelecetedScreen
            },
            {
                "label": "IDS_CONTROL",
                "value": this.props.Login.masterData.SelecetedControl && this.props.Login.masterData.SelecetedControl.scontrolname,
                "item": this.props.Login.masterData.SelecetedControl
            }
        ]
        this.props.Login.masterData.ComboComponnet && this.props.Login.masterData.ComboComponnet.map(x => {

            obj.push({
                "label": x.label,
                "value": this.props.Login.masterData['Selected' + x.label] ? x.isMultiLingual ? this.props.Login.masterData['Selected' + x.label][x.displaymember][this.props.Login.userInfo.slanguagetypecode] : this.props.Login.masterData['Selected' + x.label][x.displaymember] : "",
                "item": this.props.Login.masterData['Selected' + x.label]
            },)

        })


        return obj;
    }


    render() {

        const addId = this.state.controlMap.has("AddBarcodeConfiguration") && this.state.controlMap.get("AddBarcodeConfiguration").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteBarcodeConfiguration") && this.state.controlMap.get("DeleteBarcodeConfiguration").ncontrolcode;
        const approveId = this.state.controlMap.has("ApproveBarcodeConfiguration") && this.state.controlMap.get("ApproveBarcodeConfiguration").ncontrolcode;
        const editId = this.state.controlMap.has("EditBarcodeConfiguration") && this.state.controlMap.get("EditBarcodeConfiguration").ncontrolcode;
        const retireId = this.state.controlMap.has("RetireBarcodeConfiguration") && this.state.controlMap.get("RetireBarcodeConfiguration").ncontrolcode;


        const filterParam = {
            inputListName: "BarcodeConfiguration", selectedObject: "SelectedBarcodeConfiguration", primaryKeyField: "nbarcodeconfigurationcode",
            fetchUrl: "barcodeconfiguration/getBarcodeConfiguration", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData, searchFieldList: this.searchFieldList
        };

        const AddParam = {
            screenName: this.props.intl.formatMessage({ id: "IDS_BARCODECONFIGURATION" }),
            operation: "create",
            userInfo: this.props.Login.userInfo,
            controlId: addId,
        }

        let userStatusCSS = "outline-secondary";
        let activeIconCSS = "fa fa-check"
        if (this.props.Login.masterData.SelectedBarcodeConfiguration && this.props.Login.masterData.SelectedBarcodeConfiguration.ntransactionstatus === transactionStatus.APPROVED) {
            userStatusCSS = "outline-success";
        }
        else if (this.props.Login.masterData.SelectedBarcodeConfiguration && this.props.Login.masterData.SelectedBarcodeConfiguration.ntransactionstatus === transactionStatus.RETIRED) {
            userStatusCSS = "outline-danger";
            activeIconCSS = "";
        }
        else if (this.props.Login.masterData.SelectedBarcodeConfiguration && this.props.Login.masterData.SelectedBarcodeConfiguration.ntransactionstatus === transactionStatus.DRAFT) {
            activeIconCSS = "";
        }

        //   const breadCrumbData = this.state.filterData || [];
        return (
            <>
                <div className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
                    <Affix top={53}>
                        <BreadcrumbComponent breadCrumbItem={this.generateBreadcrumb()} />
                    </Affix>
                    <Row noGutters={true}>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                            <ListMaster
                                // formatMessage={this.props.intl.formatMessage}
                                screenName={"IDS_BARCODECONGIGURATION"}
                                masterData={this.props.Login.masterData}
                                userInfo={this.props.Login.userInfo}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.BarcodeConfiguration}
                                getMasterDetail={(BarcodeConfiguration) => this.props.getBarcodeConfigurationDetail(BarcodeConfiguration, this.props.Login.userInfo, this.props.Login.masterData)}
                                selectedMaster={this.props.Login.masterData.SelectedBarcodeConfiguration}
                                primaryKeyField="nbarcodeconfigurationcode"
                                mainField="sbarcodename"
                                firstField="scontrolname"
                                secondField="stransdisplaystatus"
                                // isIDSField="Yes"
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={addId}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData}
                                hidePaging={false}
                                openModal={() => this.getOpenModalForBarcodeConfig(AddParam)}
                                openFilter={this.openFilter}
                                closeFilter={this.closeFilter}
                                onFilterSubmit={this.onFilterSubmit}
                                showFilterIcon={true}
                                showFilter={this.props.Login.showFilter}
                                filterComponent={[
                                    {
                                        "IDS_BARCODECONFIGURATIONFILTER":
                                            <BarcodeDynamicFilter
                                                onComboChange={this.onComboChangeFilter}
                                                selectedRecord={this.state.selectedRecordFilter}
                                                listData={this.state.listData}
                                                ComboComponnet={this.props.Login.masterData.ComboComponnet && this.props.Login.masterData.ComboComponnet}
                                                onComboChangedynamic={this.onComboChangedynamic}
                                                slanguagetypecode={this.props.Login.userInfo.slanguagetypecode}
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
                                    {this.props.Login.masterData.BarcodeConfiguration && this.props.Login.masterData.BarcodeConfiguration.length > 0 && this.props.Login.masterData.SelectedBarcodeConfiguration ?
                                        <>
                                            <Card.Header>
                                                <Card.Title className="product-title-main">
                                                    {this.props.Login.masterData.SelectedBarcodeConfiguration.sbarcodename}
                                                </Card.Title>
                                                <Card.Subtitle>
                                                    <div className="d-flex product-category">
                                                        <h2 className="product-title-sub flex-grow-1">
                                                            <span className={`btn btn-outlined ${userStatusCSS} btn-sm ml-3`}>
                                                                {activeIconCSS !== "" ? <i class={activeIconCSS}></i> : ""}
                                                                {this.props.Login.masterData.SelectedBarcodeConfiguration.stransdisplaystatus}
                                                            </span>
                                                        </h2>
                                                        <div className="d-inline">
                                                            <Nav.Link name="editUser"
                                                                hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                className="btn btn-circle outline-grey mr-2"
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                onClick={() => this.onEditClick(editId)}
                                                            >
                                                                <FontAwesomeIcon icon={faPencilAlt} />
                                                            </Nav.Link>
                                                            <Nav.Link name="deleteUser" className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                onClick={() => this.ConfirmDelete(deleteId)}
                                                            >
                                                                <FontAwesomeIcon icon={faTrashAlt} />

                                                            </Nav.Link>
                                                            <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                hidden={this.state.userRoleControlRights.indexOf(approveId) === -1}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_APPROVE" })}
                                                                onClick={() => this.onApproveClick(approveId)}
                                                            >
                                                                <FontAwesomeIcon icon={faThumbsUp} title={this.props.intl.formatMessage({ id: "IDS_APPROVE" })} />
                                                            </Nav.Link>
                                                            <Nav.Link name="retireUser" className="btn btn-circle outline-grey mr-2"
                                                                hidden={this.state.userRoleControlRights.indexOf(retireId) === -1}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_RETIRE" })}
                                                                onClick={() => this.onRetireClick(retireId)}
                                                            >
                                                                <FontAwesomeIcon icon={faUserTimes} />
                                                            </Nav.Link>
                                                        </div>
                                                    </div>
                                                </Card.Subtitle>
                                            </Card.Header>
                                            {
                                                <ContentPanel className="panel-main-content">
                                                    <Card className="border-0">
                                                        <Card.Body className="form-static-wrap">
                                                            <Row>
                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <FormLabel><FormattedMessage id="IDS_ASKNUMBEROFBARCODEWANTTOPRINT" message="Number Of Barcode Needed" /></FormLabel>
                                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedBarcodeConfiguration.sbarcodeprint}</ReadOnlyText>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <FormLabel><FormattedMessage id="IDS_SQLQUERYNEED" message="Need Screen Filter" /></FormLabel>
                                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedBarcodeConfiguration.ssqlqueryneed}
                                                                        </ReadOnlyText>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <FormLabel><FormattedMessage id="IDS_SQLQUERYNAME" message="Need Screen Filter" /></FormLabel>
                                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedBarcodeConfiguration.ssqlqueryname}
                                                                        </ReadOnlyText>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md={4}>
                                                                    <FormGroup>
                                                                        <FormLabel><FormattedMessage id="IDS_NEEDSCREENFILTER" message="Need Screen Filter" /></FormLabel>
                                                                        <ReadOnlyText>{this.props.Login.masterData.SelectedBarcodeConfiguration.sneedconfiguration}
                                                                        </ReadOnlyText>
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>


                                                        </Card.Body>
                                                    </Card>
                                                </ContentPanel>

                                            }
                                            <Card.Body className="form-static-wrap">
                                                <Row>
                                                    {this.props.Login.masterData.SelectedBarcodeConfiguration.jsondata &&
                                                        Object.keys(this.props.Login.masterData.SelectedBarcodeConfiguration.jsondata.parameterMapping).map(x =>
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id={x} message={x} /></FormLabel>
                                                                    <ReadOnlyText>
                                                                        {this.props.Login.masterData.SelectedBarcodeConfiguration.jsondata.parameterMapping[x]}
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                        )}
                                                </Row>
                                            </Card.Body>
                                        </>
                                        : ""
                                    }
                                </Card>
                            </ContentPanel>
                        </Col>
                    </Row>
                </div>

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
                        mandatoryFields={this.mandatoryFields()}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : <AddBarcodeConfiguration
                                // Barcode={this.props.Login.masterData.Barcode}
                                // SqlQuery={this.props.Login.masterData.SqlQuery || []}
                                selectedRecord={this.state.selectedRecord}
                                onComboChangeModal={this.onComboChangeModal}
                                onComboBarcodeChange={this.onComboBarcodeChange}
                                onInputOnChange={this.onInputOnChange}
                                // BarcodeParameter={this.props.Login.masterData.BarcodeParameter}
                                // MappingFileds={this.props.Login.masterData.MappingFileds}
                                operation={this.props.Login.operation}
                                masterData={this.props.Login.masterData}
                            ></AddBarcodeConfiguration>}
                    />
                }

            </>
        );
    }

    mandatoryFields = () => {

        const mandatoryList = [{ "idsName": "IDS_BARCODE", "dataField": "nbarcode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "combo" }]

        if (this.props.Login.masterData && this.props.Login.masterData.SelecetedControl && this.props.Login.masterData.SelecetedControl.nfiltersqlqueryneed) {
            mandatoryList.push({ "idsName": "IDS_SQLQUERY", "dataField": "nsqlquerycode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "combo" })

        }

        this.props.Login.masterData.BarcodeParameter && this.props.Login.masterData.BarcodeParameter.map(x => {
            mandatoryList.push({ "idsName": x, "dataField": x, "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "combo" })
        })

        if (this.props.Login.masterData.SelecetedControl && this.props.Login.masterData.SelecetedControl.nsqlqueryneed && this.props.Login.masterData.SqlQueryParam.length > 0)

            this.props.Login.masterData.SqlQueryParam && this.props.Login.masterData.SqlQueryParam.map(x => {
                mandatoryList.push({ "idsName": x, "dataField": x, "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "combo" })
            })


        return mandatoryList;
    }


    onSaveClick = () => {
        if (this.props.Login.masterData.SelecetedControl.nfiltersqlqueryneed && this.state.selectedRecord.nsqlquerycode === undefined) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSQLQUERY" }))
        } else {
            const selectedRecord = this.state.selectedRecord;
            let inputData = {}
            inputData['userinfo'] = this.props.Login.userInfo;
            inputData['BarcodeConfiguration'] = {}
            inputData['BarcodeConfiguration']['nbarcode'] = selectedRecord.nbarcode ? selectedRecord.nbarcode.value : -1;
            inputData['BarcodeConfiguration']['nbarcodetemplatecode'] = this.props.Login.masterData.SelecetedControl ? this.props.Login.masterData.SelecetedControl.nbarcodetemplatecode : -1;
            inputData['BarcodeConfiguration']['nformcode'] = this.props.Login.masterData.SelecetedScreen ? this.props.Login.masterData.SelecetedScreen.nformcode : -1;
            inputData['BarcodeConfiguration']['ncontrolcode'] = this.props.Login.masterData.SelecetedControl ? this.props.Login.masterData.SelecetedControl.ncontrolcode : -1;
            inputData['BarcodeConfiguration']['ndesigntemplatemappingcode'] = this.props.Login.ndesigntemplatemappingcode;


            if (this.props.Login.operation === 'update') {
                inputData['BarcodeConfiguration']['nbarcodeconfigurationcode'] = this.props.Login.masterData.SelectedBarcodeConfiguration.nbarcodeconfigurationcode;
            }

            let data = {}
            let filter = {}
            if (this.props.Login.masterData.SelecetedControl.nneedconfiguration) {
                this.props.Login.masterData.ComboComponnet
                    .map(x => {
                        filter = { ...filter, [x.label]: this.props.Login.masterData["Selected" + x.label] }
                    })
                filter = {
                    ...filter,
                    ComboComponnet: this.props.Login.masterData.ComboComponnet,
                    nformcode: this.props.Login.masterData.SelecetedScreen.nformcode,
                    ncontrolcode: this.props.Login.masterData.SelecetedControl.ncontrolcode,
                    nbarcodetemplatecode: this.props.Login.masterData.SelecetedControl.nbarcodetemplatecode,
                }
            } else {
                filter = {
                    ComboComponnet: null,
                    nformcode: this.props.Login.masterData.SelecetedScreen.nformcode,
                    ncontrolcode: this.props.Login.masterData.SelecetedControl.ncontrolcode,
                    nbarcodetemplatecode: this.props.Login.masterData.SelecetedControl.nbarcodetemplatecode,
                }
            }

            data = {
                primarykeyName: this.props.Login.masterData.ComboComponnet && this.props.Login.masterData.ComboComponnet.length > 0 &&
                    this.props.Login.masterData.ComboComponnet[this.props.Login.masterData.ComboComponnet.length - 1]['valuemember'],
                value: this.props.Login.masterData.ComboComponnet && this.props.Login.masterData.ComboComponnet.length > 0 &&
                    this.state.selectedRecordFilter[this.props.Login.masterData.ComboComponnet &&
                        this.props.Login.masterData.ComboComponnet[this.props.Login.masterData.ComboComponnet.length - 1]['label']].value,
                nfiltersqlquerycode: this.props.Login.masterData.SelecetedControl.nfiltersqlqueryneed ? this.state.selectedRecord.nsqlquerycode.value : -1

            }


            if (this.props.Login.masterData.SelecetedControl.nsqlqueryneed) {

                let param = {}
                this.props.Login.masterData.SqlQueryParam && this.props.Login.masterData.SqlQueryParam.map(x => {
                    param = { ...param, [x]: this.state.selectedRecord[x].value }
                })
                data = {
                    ...data, SqlQueryParamMapping: param
                }

            }

            const jsondata = {
                parameterMapping: { ...selectedRecord.columnname },
                ...data
            }
            inputData['BarcodeConfiguration']['jsondata'] = jsondata;
            inputData['BarcodeConfiguration']['jsonstring'] = JSON.stringify(jsondata);

            inputData = { ...inputData, ...filter }
            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: "BarcodeConfiguration",
                displayName: this.props.Login.inputParam.displayName,
                inputData: inputData,
                operation: this.props.Login.operation,
                searchRef: this.searchRef,
                //  postParam:postParam,
                // filtercombochange:this.props.Login.masterData.searchedData!==undefined?
                //     this.state.selectedRecord.nclientcatcode.value === this.props.Login.masterData.SelectedClientCat.nclientcatcode?false:true:false
            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                        openModal: true, screenName: this.props.intl.formatMessage({ id: "IDS_BARCODECONFIGURATION" }),
                        //this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                        operation: this.props.Login.operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
            }
        }

    }

    getOpenModalForBarcodeConfig = (map) => {
        const inputParam = { ...map, masterData: this.props.Login.masterData };
        let lastLevelCode = -1

        if (this.props.Login.masterData.SelecetedScreen['nformcode'] && this.props.Login.masterData.SelecetedControl) {
            inputParam['nformcode'] = this.props.Login.masterData.SelecetedScreen['nformcode']
            inputParam['nbarcodetemplatecode'] = this.props.Login.masterData.SelecetedControl.nbarcodetemplatecode
            inputParam['ncontrolcode'] = this.props.Login.masterData.SelecetedControl.ncontrolcode
            inputParam['nquerybuildertablecode'] = this.props.Login.masterData.SelecetedControl.nquerybuildertablecode
            inputParam['lastLevelCode'] = lastLevelCode
            inputParam['nsqlqueryneed'] = this.props.Login.masterData.SelecetedControl.nsqlqueryneed
            inputParam['nfiltersqlqueryneed'] = this.props.Login.masterData.SelecetedControl.nfiltersqlqueryneed
            inputParam['nsqlquerycode'] = this.props.Login.masterData.SelecetedControl.nsqlquerycode

            if (this.props.Login.masterData && this.props.Login.masterData.ComboComponnet && this.props.Login.masterData.ComboComponnet.length > 0) {
                lastLevelCode = this.state.selectedRecordFilter[this.props.Login.masterData.ComboComponnet[this.props.Login.masterData.ComboComponnet.length - 1].label].value

            }
            inputParam['lastLevelCode'] = lastLevelCode

            if (this.props.Login.masterData.SelecetedControl.nneedconfiguration) {
                if (lastLevelCode !== -1) this.props.getOpenModalForBarcodeConfig(inputParam);
                else toast.info(this.props.formatMessage({ ids: "IDS_SELECTALLFILTERVALUES" }));
            } else {
                this.props.getOpenModalForBarcodeConfig(inputParam);
            }


        } else {
            toast.info("IDS_SELECTALLFILTERVALUES");
        }
    }

    onComboChangeModal = (comboData, columnname, sparametername) => {
        const selectedRecord = this.state.selectedRecord;
        selectedRecord[columnname] = { ...selectedRecord[columnname], [sparametername]: comboData.value }
        selectedRecord[sparametername] = comboData
        this.setState({ selectedRecord });
    }


    onComboBarcodeChange = (comboData, columnname) => {
        const selectedRecord = this.state.selectedRecord;
        if (columnname === 'nbarcode') {
            selectedRecord['nbarcode'] = comboData

            if (this.props.Login.masterData.SelecetedControl.nfiltersqlqueryneed === false) {
                const objMap = {
                    selectedRecord, masterData: this.props.Login.masterData,
                    userinfo: this.props.Login.userInfo, nfiltersqlqueryneed: this.props.Login.masterData.SelecetedControl.nfiltersqlqueryneed
                }
                this.props.getBarcodeFileParameter(objMap)
            } else {
                this.setState({ selectedRecord })
            }
        }
        else if (columnname === 'nsqlquerycode') {
            selectedRecord['nsqlquerycode'] = comboData
            delete selectedRecord["columnname"]

            this.props.Login.masterData && this.props.Login.masterData.BarcodeParameter.map(x => {
                delete selectedRecord[x]
            })

            const objMap = {
                selectedRecord, masterData: this.props.Login.masterData, userinfo: this.props.Login.userInfo,
                nfiltersqlqueryneed: this.props.Login.masterData.SelecetedControl.nfiltersqlqueryneed
            }
            this.props.getBarcodeFileParameter(objMap)
        } else {
            selectedRecord[columnname] = comboData
            this.setState({ selectedRecord })
        }
    }

    openFilter = () => {
        let showFilter = !this.props.Login.showFilter;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter },
        };
        this.props.updateStore(updateInfo);
    };

    closeFilter = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false },
        };
        this.props.updateStore(updateInfo);
    };

    checkValidation = (ComboComponnet, selectedRecord) => {
        const list = []
        ComboComponnet
            && ComboComponnet
                .map(x => {
                    list.push(selectedRecord[x.label] ? false : true)
                })
        return !list.includes(true)
    }

    onFilterSubmit = () => {
        this.searchRef.current.value = "";
        const selectedRecordFilter = this.state.selectedRecordFilter;
        if (selectedRecordFilter["nformcode"] && selectedRecordFilter["ncontrolcode"]) {
            if (selectedRecordFilter["ncontrolcode"].item.nneedconfiguration) {
                if (this.checkValidation(this.props.Login.masterData.ComboComponnet, selectedRecordFilter)) {
                    let obj = {}
                    this.props.Login.masterData.ComboComponnet
                        .map(x => {
                            obj = { ...obj, [x.label]: selectedRecordFilter[x.label] }
                        })


                    let inputParam = {
                        userinfo: this.props.Login.userInfo,
                        masterData: {
                            ...this.props.Login.masterData,
                            searchedData: undefined
                        }, selectedRecordFilter: this.state.selectedRecordFilter,
                        ComboComponnet: this.props.Login.masterData.ComboComponnet,
                        nformcode: selectedRecordFilter["nformcode"].value,
                        nbarcodetemplatecode: selectedRecordFilter["ncontrolcode"].item.nbarcodetemplatecode,
                        ncontrolcode: selectedRecordFilter["ncontrolcode"].value,
                        ...obj
                    };
                    this.props.getBarcodeConfigFilterSubmit(inputParam
                    );
                } else {
                    toast.info("IDS_SELECTALLFILTER")
                }
            } else {
                let inputParam = {
                    userinfo: this.props.Login.userInfo,
                    masterData: {
                        ...this.props.Login.masterData,
                        searchedData: undefined
                    }, selectedRecordFilter: this.state.selectedRecordFilter,
                    ComboComponnet: this.props.Login.masterData.ComboComponnet,
                    nformcode: selectedRecordFilter["nformcode"].value,
                    nbarcodetemplatecode: selectedRecordFilter["ncontrolcode"].item.nbarcodetemplatecode,
                    ncontrolcode: selectedRecordFilter["ncontrolcode"].value,
                };
                this.props.getBarcodeConfigFilterSubmit(inputParam);
            }
        } else {
            toast.warn(
                this.props.intl.formatMessage({
                    id: "IDS_INSTRUMENTCATEGORYNOTAVALIABLE",
                })
            );
        }
    };


    componentDidUpdate(previousProps) {
        let updateState = false;

        let { selectedRecord, userRoleControlRights, controlMap, listData, selectedRecordFilter } = this.state;

        if (this.props.Login.selectedRecordFilter !== previousProps.Login.selectedRecordFilter) {
            updateState = true;
            selectedRecordFilter = this.props.Login.selectedRecordFilter
        }

        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            updateState = true;
            selectedRecord = this.props.Login.selectedRecord
        }

        if (this.props.Login.listData !== previousProps.Login.listData) {
            updateState = true;
            listData = this.props.Login.listData
        }

        if (this.props.Login.masterData !== previousProps.Login.masterData) {

            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]
                        && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                            userRoleControlRights.push(item.ncontrolcode))
                    controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)

                    updateState = true;
                }

            }

            if (this.props.Login.masterData.Screen !== previousProps.Login.masterData.Screen) {
                listData['nformcode'] = constructOptionList(this.props.Login.masterData.Screen, 'nformcode', 'sformname').get("OptionList");
                listData['ncontrolcode'] = constructOptionList(this.props.Login.masterData.Control, 'ncontrolcode', 'scontrolname').get("OptionList");
                selectedRecordFilter['nformcode'] = this.props.Login.masterData.SelecetedScreen && { label: this.props.Login.masterData.SelecetedScreen.sformname, value: this.props.Login.masterData.SelecetedScreen.nformcode, item: { ...this.props.Login.masterData.SelecetedScreen } }
                selectedRecordFilter['ncontrolcode'] = this.props.Login.masterData.SelecetedControl && { label: this.props.Login.masterData.SelecetedControl.scontrolname, value: this.props.Login.masterData.SelecetedControl.ncontrolcode, item: { ...this.props.Login.masterData.SelecetedControl } }
                updateState = true;
                this.props.Login.masterData.ComboComponnet
                    && this.props.Login.masterData.ComboComponnet
                        .map(x => {

                            const data = constructjsonOptionList(this.props.Login.masterData[x.label], x.valuemember, x.displaymember, false, false, true, undefined, x.source, x.isMultiLingual, this.props.Login.userInfo.slanguagetypecode, x).get("OptionList");
                            if (data.length !== 0) {

                                selectedRecordFilter[x.label] = { ...data.filter(y => y.value === this.props.Login.masterData["Selected" + x.label][x.valuemember])[0] }
                            }
                            listData[x.label] = data
                        })

            }



        }
        if (updateState) {
            this.setState({
                selectedRecord, controlMap, userRoleControlRights, listData, selectedRecordFilter

            })
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
                data: { openPortal: false }
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
                data: {
                    openModal, loadEsign, selectedRecord, selectedId: null, dataList: [],
                    dataListCount: [], dataListSubSample: [], dataListCountSubSample: []
                }
            }
            this.props.updateStore(updateInfo);
        }


    }

    onComboChangeFilter = (comboData, fieldName) => {
        const selectedRecordFilter = this.state.selectedRecordFilter || {};
        selectedRecordFilter[fieldName] = comboData;

        if (fieldName === 'nformcode') {
            const map = {
                userInfo: this.props.Login.userInfo,
                masterData: this.props.Login.masterData,
                selectedRecordFilter: selectedRecordFilter,
                nbarcodetemplatecode: selectedRecordFilter['nformcode'].item.nbarcodetemplatecode,
                listData: this.state.listData
            }
            this.props.getBarcodeTemplateControlBC(map);
        } else if (fieldName === 'ncontrolcode') {
            if (comboData.item.nneedconfiguration) {
                const map = {
                    userInfo: this.props.Login.userInfo,
                    masterData: this.props.Login.masterData,
                    selectedRecordFilter: selectedRecordFilter,
                    nbarcodetemplatecode: selectedRecordFilter['ncontrolcode'].item.nbarcodetemplatecode,
                    listData: this.state.listData
                }
                this.props.getBarcodeTemplateControlCombo(map);
            } else {


                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        selectedRecordFilter, masterData: { ...this.props.Login.masterData, ComboComponnet: [] }
                    }
                }
                this.props.updateStore(updateInfo);
                //   /  this.setState({ selectedRecordFilter });
            }
        }
        else {
            this.setState({ selectedRecordFilter });
        }

    }


    onComboChangedynamic = (comboData, control) => {
        let childComboList = []
        let childColumnList = {}
        let parentList = {}
        const selectedRecordFilter = { ...this.state.selectedRecordFilter }
        selectedRecordFilter[control.label] = comboData;
        if (control.child && control.child.length > 0) {
            childComboList = getSameRecordFromTwoArrays(this.props.Login.masterData.ComboComponnet, control.child, "label")
            childColumnList = {};
            childComboList.map(columnList => {
                const val = comboChild(this.props.Login.masterData.ComboComponnet, columnList, childColumnList, false);
                childColumnList = val.childColumnList
                return null;
            })
            //  parentList =[]
            // getSameRecordFromTwoArrays(this.props.withoutCombocomponent, control.child, "label")

            const inputParem = {
                child: control.child,
                source: control.source,
                primarykeyField: control.valuemember,
                value: comboData ? comboData.value : -1,
                item: comboData ? comboData.item : "",
                label: comboData ? control.label : ""
            }

            this.props.getBarcodeDynamicChange(inputParem, selectedRecordFilter, control,
                this.props.Login.masterData, childComboList, childColumnList, this.props.Login.userInfo, this.state.listData);

        } else {

            this.setState({ selectedRecordFilter });
        }


    }



    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            if (event.target.name === "sviewname") {
                selectedRecord[event.target.name] = event.target.value.replace(/[^a-z]/gi, '');
            } else {
                selectedRecord[event.target.name] = event.target.value;
            }
        }
        this.setState({ selectedRecord });
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
    updateStore, getBarcodeTemplateComboService, getBarcodeTemplateControlBC,
    getReactInputFields, getReactQuerybuilderTableRecord, getBarcodeTemplateDetail,
    getBarcodeDynamicChange, getBarcodeTemplateControlCombo, getOpenModalForBarcodeConfig,
    getBarcodeFileParameter, getBarcodeConfigFilterSubmit, getEditBarcodeConfigurationComboService,
    getBarcodeConfigurationDetail, filterColumnData
})(injectIntl(BarcodeConfiguration));

