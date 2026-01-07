import { faLanguage, faPencilAlt, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Card, Col, FormGroup, FormLabel, Nav, Row } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Affix } from 'rsuite';
import {
    updateStore, crudMaster, filterColumnData, selectRegistrationSubType, getVersionById,
    getRegistrationSubTypeMaster, getRegSubTypeDetails, getSeqNoFormats, getEditRegSubType,
    getRegistrationTypeBySampleType, getRegistrationSubTypeOnReload, validateEsignCredential,getVersionByReleaseNo
} from '../../../actions';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import { ContentPanel, ReadOnlyText } from '../../../components/App.styles';
import BreadcrumbComponent from '../../../components/Breadcrumb.Component';
import { constructOptionList, getControlMap, showEsign } from '../../../components/CommonScript';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';
import CustomAccordion from '../../../components/custom-accordion/custom-accordion.component';
import AddSynonym from '../../../components/droparea/AddSynonym';
import { transactionStatus } from '../../../components/Enumeration';
import FormInput from '../../../components/form-input/form-input.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import FormTextarea from '../../../components/form-textarea/form-textarea.component';
import ListMaster from '../../../components/list-master/list-master.component';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import Esign from '../../audittrail/Esign';
import AddSeqNoFormatPopup from './AddSeqNoFormatPopup';
import RegistrationSubTypeAccordion from './RegistrationSubTypeAccordion';
import FlowRenderer from '../../../components/flow-renderer/flow-renderer.component';
import AddSeqNoFormatRelease from './AddSeqNoFormatRelease';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}
class RegistrationSubType extends React.Component {
    constructor(props) {
        super(props)
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
        this.state = {
            userRoleControlRights: [],
            controlMap: new Map(),
            addVersionId: -1,
            editVersionId: -1,
            deleteVersionId: -1,
            approveVersionId: -1,
            addRegistrationSubTypeId: -1,
            editRegistrationSubTypeId: -1,
            deleteRegistrationSubTypeId: -1,
            selectedRecord: {},
            sampleTypeOptions: [],
            selectedSampleType: {},
            breadCrumbSampleType: {},
            selectedRegType: {},
            breadCrumbRegType: {},
            breadCrumbData: [],
            design: [],
            comboComponents: [],
            withoutCombocomponent: [],
            sidebarview:false
        };
        this.regSubTypeMandatoryFields = [
            { "idsName": "IDS_REGISTRATIONSUBTYPE", "dataField": "sregsubtypename", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox", "ismultilingual": "true" }
        ]
    }
    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })          
    }

    static getDerivedStateFromProps(props, state) {
        if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.intl.formatMessage({ id: props.Login.masterStatus }));
            props.Login.masterStatus = "";
        }

        if (props.Login.error !== "" && props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        return null;
    }

    render() {
        const filterParam = {
            inputListName: "RegistrationSubType",
            selectedObject: "selectedRegistrationSubType",
            primaryKeyField: "nregsubtypecode",
            fetchUrl: "registrationsubtype/getRegistrationSubTypeMaster",
            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
                nregtypecode: this.state.breadCrumbData[1] ? this.state.breadCrumbData[1].item.value : -1
            },
            masterData: this.props.Login.masterData,
            unchangeList: ["realSampleType", "SampleTypes", "realRegtype", "RegistrationTypes"],
            searchFieldList: ["sregsubtypename", "sdescription"]
        };
        this.versionMandatoryFields = [
            { "idsName": "IDS_FORMAT", "dataField": "ssampleformat", "mandatoryLabel": "IDS_SELECT" }
            //{ "idsName": "IDS_SEQUENCENOLENGTH", "dataField":"seqnolength", "mandatoryLabel": "IDS_ENTER" }
            // { "idsName": "IDS_SEQUENCENOLENGTH", "dataField": "seqnolength", "mandatoryLabel": "IDS_ENTER" },
        ]
        const deleteParam = this.props.Login.masterData.selectedRegistrationSubType ? {
            nregsubtypecode: this.props.Login.masterData.selectedRegistrationSubType.nregsubtypecode,
            nregtypecode: this.props.Login.masterData.selectedRegistrationSubType.nregtypecode
        } : {}
        if (this.state.selectedRecord && this.state.selectedRecord.nisnewformat) {
            // this.versionMandatoryFields.push({ "idsName": "IDS_RESETDURATION", "dataField": "nresetduration", "mandatoryLabel": "IDS_ENTER" })
            this.versionMandatoryFields.push({ "idsName": "IDS_RESETDURATION", "dataField": "nperiodcode", "mandatoryLabel": "IDS_SELECT" })
            this.versionMandatoryFields.push({ "idsName": "IDS_SEQUENCENOLENGTH", "dataField": "seqnolength", "mandatoryLabel": "IDS_ENTER" })
        }
        this.versionReleaseArNoManFields = [
            { "idsName": "IDS_FORMAT", "dataField": "sreleaseformat", "mandatoryLabel": "IDS_SELECT" }
        
        ]
       // console.log("this.props.Login:", this.props.Login);
        return (
            <>
                <div className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
                    {this.state.breadCrumbData.length > 0 ?
                        <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={this.state.breadCrumbData} />
                        </Affix> : ""
                    }
                    <Row noGutters={true}>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                            <ListMaster
                                filterColumnData={this.props.filterColumnData}
                                screenName={this.props.intl.formatMessage({ id: "IDS_REGISTRATIONSUBTYPE" })}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.RegistrationSubType || []}
                                masterData={this.props.Login.masterData}
                                userInfo={this.props.Login.userInfo}
                                getMasterDetail={(regType) => this.props.selectRegistrationSubType(regType, this.props.Login.masterData, this.props.Login.userInfo)}
                                selectedMaster={this.props.Login.masterData.selectedRegistrationSubType}
                                primaryKeyField="nregsubtypecode"
                                mainField="sregsubtypename"
                                // firstField="stransdisplaystatus"
                                // secondField="stransdisplaystatus"
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={this.state.addRegistrationSubTypeId}
                                filterParam={filterParam}
                                hidePaging={false}
                                searchRef={this.searchRef}
                                //ALPD-5195--Vignesh R(21-01-2025)-->reg sub type and approval config-- filter issue, check description
                                reloadData={() => this.reloadData(this.state.breadCrumbSampleType, this.state.breadCrumbRegType)}
                                //reloadData={() => this.reloadData(this.state.selectedSampleType, this.state.selectedRegType)}
                                openModal={() => this.openModal("IDS_REGISTRATIONSUBTYPE", this.state.addRegistrationSubTypeId)}
                                openFilter={this.openFilter}
                                closeFilter={this.closeFilter}
                                onFilterSubmit={this.onFilterSubmit}
                                showFilterIcon={true}
                                showFilter={this.props.Login.showFilter}
                                filterComponent={[
                                    {
                                        "IDS_SAMPLETYPEFILTER":
                                            <Row>
                                                <Col md={12}>
                                                    <FormSelectSearch
                                                        name={"nsampletypecode"}
                                                        formLabel={this.props.intl.formatMessage({ id: "IDS_SAMPLETYPE" })}
                                                        isSearchable={false}
                                                        placeholder="Please Select..."
                                                        options={this.state.sampleTypeOptions}
                                                        value={this.state.selectedSampleType ? this.state.selectedSampleType : ""}
                                                        onChange={value => this.filterComboChange(value, 'nsampletypecode')}
                                                    />
                                                    <FormSelectSearch
                                                        name={"nregtypecode"}
                                                        formLabel={this.props.intl.formatMessage({ id: "IDS_REGTYPE" })}
                                                        isSearchable={false}
                                                        placeholder="Please Select..."
                                                        options={this.state.regTypeOptions}
                                                        value={this.state.selectedRegType || ""}
                                                        onChange={value => this.filterComboChange(value, 'nregtypecode')}
                                                    />
                                                </Col>
                                            </Row>
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
                            {this.props.Login.masterData.selectedRegistrationSubType ?
                                <ContentPanel className="panel-main-content">
                                    <Card className="border-0">
                                        <Card.Header>
                                            <Card.Title className="product-title-main">
                                                {this.props.Login.masterData.selectedRegistrationSubType.sregsubtypename}
                                            </Card.Title>
                                            <Card.Subtitle>
                                                <div className="d-flex product-category">
                                                    <h2 className="product-title-sub flex-grow-1">

                                                    </h2>
                                                    <div className="d-inline">
                                                        <Nav.Link name="editInstrument"
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                            //   data-for="tooltip_list_wrap"
                                                            hidden={this.state.userRoleControlRights.indexOf(this.state.editRegistrationSubTypeId) === -1}
                                                            className="btn btn-circle outline-grey mr-2"
                                                            onClick={(e) => this.props.getEditRegSubType(this.props.Login.masterData.selectedRegistrationSubType.nregsubtypecode,
                                                                this.props.Login.userInfo, this.state.editRegistrationSubTypeId
                                                            )}
                                                        >
                                                            <FontAwesomeIcon icon={faPencilAlt} />
                                                        </Nav.Link>
                                                        <Nav.Link name="deleteInstrument" className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                            //  data-for="tooltip_list_wrap"
                                                            hidden={this.state.userRoleControlRights.indexOf(this.state.deleteRegistrationSubTypeId) === -1}
                                                            onClick={() => this.confirmDelete(this.state.deleteRegistrationSubTypeId, 'RegistrationSubType', deleteParam)}>
                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                        </Nav.Link>
                                                    </div>
                                                </div>
                                            </Card.Subtitle>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col md={12}>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id={"IDS_DESCRIPTION"} message={"Description"} /></FormLabel>
                                                        <ReadOnlyText>{this.props.Login.masterData.selectedRegistrationSubType.jsondata.sdescription || '-'}</ReadOnlyText>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row noGutters={true} >
                                                <Col md={12}>
                                                    <div className="d-flex justify-content-end">
                                                        <Nav.Link className="add-txt-btn"
                                                            hidden={this.state.userRoleControlRights.indexOf(this.state.addVersionId) === -1}
                                                            onClick={() => this.props.getSeqNoFormats({ userInfo: this.props.Login.userInfo, ncontrolcode: this.state.addVersionId })}
                                                        >
                                                            <FontAwesomeIcon icon={faPlus} /> { }
                                                            <FormattedMessage id='IDS_VERSION' defaultMessage='Version' />
                                                        </Nav.Link>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row noGutters={true}>
                                                <Col md={12}>
                                                    {this.props.Login.masterData.versions && this.props.Login.masterData.versions.length > 0 ?
                                                        <CustomAccordion
                                                            key="FormatVersion"
                                                            titlePrefix={this.props.intl.formatMessage({ id: "IDS_VERSION" }) + " : "}
                                                            isJSONdata={true}
                                                            jsonFieldName={'jsondata'}
                                                            accordionTitle={'sversiondesc'}
                                                            accordionComponent={this.registrationSubTypeAccordion(this.props.Login.masterData.versions)}
                                                            inputParam={{ masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo }}
                                                            accordionClick={this.props.getRegSubTypeDetails}
                                                            accordionPrimaryKey={"nregsubtypeversioncode"}
                                                            accordionObjectName={"version"}
                                                            selectedKey={this.props.Login.masterData.selectedVersion.nregsubtypeversioncode}
                                                        />
                                                        : ""}
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </ContentPanel>
                                : ""}
                        </Col>
                    </Row>
                </div>
                {(this.props.Login.openModal || this.props.Login.openChildModal) ?
                    <SlideOutModal
                        //size={this.props.Login.screenName === "Version" ? "xl" : "lg"}
                        size={this.props.Login.screenName  === "Version"&&!this.props.Login.loadEsign ||this.props.Login.screenName === "IDS_RELEASEARNO"&&!this.props.Login.loadEsign ? "xl" : "lg"}
                        //ALPD-5256 Registration Sub Type - Add - Multilingual language Slideout - Save & Continue to be removed.
                        showSaveContinue={this.props.Login.screenName === "IDS_REGISTRATIONSUBTYPE" && (this.state.showSynonym === undefined || this.state.showSynonym === false) ? true : false}
                        //showSaveContinue={true}
                        onSaveClick={this.onSaveClick}
                        operation={this.props.Login.operation}
                        screenName={this.props.Login.screenName === "IDS_REGISTRATIONSUBTYPE" ? this.props.intl.formatMessage({ id: "IDS_REGISTRATIONSUBTYPE" }) 
                                    : this.props.Login.screenName === "IDS_REGISTRATIONFLOW" ? this.props.intl.formatMessage({ id: "IDS_REGISTRATIONFLOW" }) 
                                    : this.props.Login.screenName === "IDS_RELEASEARNO" ? this.props.intl.formatMessage({ id: "IDS_RELEASEARNO" }) 
                                    : this.props.intl.formatMessage({ id: "IDS_VERSION" })}
                        closeModal={this.closeModal}
                        show={this.props.Login.openModal || this.props.Login.openChildModal}
                        inputParam={this.props.Login.inputParam}
                        noSave={this.props.Login.screenName === "IDS_REGISTRATIONFLOW" ? true : false}
                        esign={this.props.Login.loadEsign}
                        hideSave={this.state.showSynonym}
                        closeLabel={this.state.showSynonym ? "IDS_CLOSE" : undefined}
                        validateEsign={this.validateEsign}
                        mandatoryFields={this.props.Login.screenName === "IDS_REGISTRATIONSUBTYPE" ? this.regSubTypeMandatoryFields : this.props.Login.screenName === "IDS_RELEASEARNO" ?this.versionReleaseArNoManFields  : this.versionMandatoryFields}
                        selectedRecord={this.state.selectedRecord || {}}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign
                                operation={this.props.Login.operation}
                                onInputOnChange={(event) => this.onInputOnChange(event)}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            :
                            this.state.showSynonym ?
                                <AddSynonym
                                    selectedFieldRecord={this.state.selectedRecord}
                                    onInputOnChange={this.onInputOnChange}
                                    languages={this.props.Login.languageList || []}
                                    fieldName="sregsubtypename"
                                    maxLength={100}

                                />
                                :
                                this.props.Login.screenName === "IDS_REGISTRATIONSUBTYPE" ?
                                    <Row>
                                        <Col md={11}>
                                            <FormInput
                                                name={this.props.Login.language}
                                                label={this.props.intl.formatMessage({ id: "IDS_REGISTRATIONSUBTYPE" })}
                                                type="text"
                                                value={this.state.selectedRecord.sregsubtypename ? this.state.selectedRecord.sregsubtypename[this.props.Login.language] : ""}
                                                isMandatory={true}
                                                required={true}
                                                maxLength={100}
                                                onChange={(event) => this.onInputOnChange(event, 'sregsubtypename')}
                                            />
                                        </Col>
                                        <Col md={1} className="p-0">
                                            <Nav.Link name="addsynonym"
                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADDSYNONYMN" })}
                                                // data-for="tooltip_list_wrap"
                                                // hidden={this.state.userRoleControlRights.indexOf(this.state.previewId) === -1}
                                                className="btn btn-circle outline-grey mr-2"
                                                onClick={(e) => this.setState({ showSynonym: true })}
                                            >
                                                <FontAwesomeIcon icon={faLanguage} />
                                            </Nav.Link>
                                        </Col>
                                        <Col md={12}>
                                            <FormTextarea
                                                name={"sdescription"}
                                                label={this.props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                                                type="text"
                                                value={this.state.selectedRecord.sdescription || ""}
                                                isMandatory={false}
                                                required={true}
                                                maxLength={255}
                                                onChange={(event) => this.onInputOnChange(event)}
                                            />
                                        </Col>
                                    </Row>
                                    :
                                    this.props.Login.screenName === "IDS_REGISTRATIONFLOW" ?
                                        <Row>                                          
                                            <Col>
                                             {this.props.Login.regSubTypeVersionFlow &&
                                                <FlowRenderer initialNodes={this.props.Login.regSubTypeVersionFlow.nodes || []}
                                                    initialEdges={this.props.Login.regSubTypeVersionFlow.edges || []} />
                                             }
                                            </Col> 
                                        </Row>
                                        : this.props.Login.screenName === "IDS_RELEASEARNO"?
                                        <AddSeqNoFormatRelease
                                            selectedRecord={this.state.selectedRecord}
                                            sreleaseexistingFormats={this.props.Login.sreleaseexistingFormats}
                                            sitewiseexistingFormatsRelease={this.props.Login.sitewiseexistingFormatsRelease}
                                            periodList={this.props.Login.periodList}
                                            onComboChange={this.onComboChange}
                                            onDrop={this.onDrop.bind(this)}
                                            onClickBackspace={this.onClickBackspace}
                                            onClickClear={this.onClickClear}
                                            userInfo={this.props.Login.userInfo}
                                            settings={this.props.Login.settings}
                                            onInputOnChange={this.onInputOnChange}
                                            onNumericInputChange={this.onNumericInputChange}
                                        />
                                        :<AddSeqNoFormatPopup 
                                        selectedRecord={this.state.selectedRecord}
                                        existingFormats={this.props.Login.existingFormats}
                                        sitewiseexistingFormats={this.props.Login.sitewiseexistingFormats}
                                        periodList={this.props.Login.periodList}
                                        onComboChange={this.onComboChange}
                                        onDrop={this.onDrop.bind(this)}
                                        onClickBackspace={this.onClickBackspace}
                                        onClickClear={this.onClickClear}
                                        userInfo={this.props.Login.userInfo}    
                                        settings={this.props.Login.settings}
                                        onInputOnChange={this.onInputOnChange}
                                        onNumericInputChange={this.onNumericInputChange}
                                    />
                        } />
                    : ""}
            </>
        )
    }

    componentDidUpdate(previousProps) {
        let updateState = false;
        let { userRoleControlRights, controlMap, addVersionId, editVersionId, deleteVersionId, approveVersionId,
            addRegistrationSubTypeId, editRegistrationSubTypeId, deleteRegistrationSubTypeId, breadCrumbSampleType, breadCrumbRegType,
            sampleTypeOptions, regTypeOptions, breadCrumbData, selectedSampleType, selectedRegType,
            selectedRecord, comboComponents, withoutCombocomponent,editReleaseReferenceNo
        } = this.state;
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            updateState = true;
            addVersionId = controlMap.has("AddSeqNoFormatVersion") && controlMap.get("AddSeqNoFormatVersion").ncontrolcode;
            editVersionId = controlMap.has("EditSeqNoFormatVersion") && controlMap.get("EditSeqNoFormatVersion").ncontrolcode;
            deleteVersionId = controlMap.has("DeleteSeqNoFormatVersion") && controlMap.get("DeleteSeqNoFormatVersion").ncontrolcode;
            approveVersionId = controlMap.has("ApproveSeqNoFormatVersion") && controlMap.get("ApproveSeqNoFormatVersion").ncontrolcode
            addRegistrationSubTypeId = controlMap.has("AddRegistrationSubType") && controlMap.get("AddRegistrationSubType").ncontrolcode;
            editRegistrationSubTypeId = controlMap.has("EditRegistrationSubType") && controlMap.get("EditRegistrationSubType").ncontrolcode;
            deleteRegistrationSubTypeId = controlMap.has("DeleteRegistrationSubType") && controlMap.get("DeleteRegistrationSubType").ncontrolcode;
            editReleaseReferenceNo = controlMap.has("EditReleaseReferenceNo") && controlMap.get("EditReleaseReferenceNo").ncontrolcode;
            //ALPDJ21-55--Added by Vignesh(12-08-2025)-->committed for Sample type and Reg Type mismatch value.
            sampleTypeOptions = constructOptionList(this.props.Login.masterData.SampleTypes || [], 'nsampletypecode', 'ssampletypename', 'nsorter', "ascending").get("OptionList")
            selectedSampleType = sampleTypeOptions.length > 0 ? sampleTypeOptions[0] : {};
            regTypeOptions = constructOptionList(this.props.Login.masterData.RegistrationTypes || [], 'nregtypecode', 'sregtypename', 'nregtypecode', "ascending").get("OptionList")
            selectedRegType = regTypeOptions.length > 0 ? regTypeOptions[0] : {};
            breadCrumbData = [];
            breadCrumbSampleType = sampleTypeOptions[0] || {};
            breadCrumbRegType = regTypeOptions[0] || {};
            sampleTypeOptions.length > 0 && breadCrumbData.push(
                {
                    "label": "IDS_SAMPLETYPE",
                    "value": breadCrumbSampleType.label,
                    "item": sampleTypeOptions
                }
            );
            regTypeOptions.length > 0 && breadCrumbData.push(
                {
                    "label": "IDS_REGTYPE",
                    "value": breadCrumbRegType.label,
                    "item": breadCrumbRegType
                }
            );
            updateState = true;
        }
        if (this.props.Login.realSampleType !== previousProps.Login.realSampleType) {
            //ALPD-5195--Vignesh R(20-01-2025)-->reg sub type and approval config-- filter issue, check description
            breadCrumbSampleType = this.props.Login.realSampleType || breadCrumbSampleType;
            breadCrumbRegType = this.props.Login.realRegtype || breadCrumbRegType;

            breadCrumbData = [
                {
                    "label": "IDS_SAMPLETYPE",
                    "value": breadCrumbSampleType.label,
                    "item": breadCrumbSampleType
                },
                {
                    "label": "IDS_REGTYPE",
                    "value": breadCrumbRegType.label,
                    "item": breadCrumbRegType
                }
            ];
          
            updateState = true;
        } if (this.props.Login.realRegtype !== previousProps.Login.realRegtype) {
           //ALPD-5195--Vignesh R(21-01-2025)-->reg sub type and approval config-- filter issue, check description
           breadCrumbSampleType = this.props.Login.realSampleType || breadCrumbSampleType;
           breadCrumbRegType = this.props.Login.realRegtype || breadCrumbRegType;
            breadCrumbData = [
                {
                    "label": "IDS_SAMPLETYPE",
                    "value": breadCrumbSampleType.label,
                    "item": breadCrumbSampleType
                },
                {
                    "label": "IDS_REGTYPE",
                    "value": breadCrumbRegType.label,
                    "item": breadCrumbRegType
                }
            ];
            updateState = true;
        }
        if (this.props.Login.selectedSampleType !== previousProps.Login.selectedSampleType) {
            selectedSampleType = this.props.Login.selectedSampleType;
            regTypeOptions = constructOptionList(this.props.Login.masterData.RegistrationTypes || [], 'nregtypecode', 'sregtypename', 'nregtypecode', "ascending").get("OptionList")
            selectedRegType = regTypeOptions[0];
            updateState = true;
        }
        if (this.props.Login.reloadData && this.props.Login.reloadData !== previousProps.Login.reloadData) {
            sampleTypeOptions = constructOptionList(this.props.Login.masterData.SampleTypes || [], 'nsampletypecode', 'ssampletypename', 'nsampletypecode', "ascending").get("OptionList")
            selectedSampleType = sampleTypeOptions.length > 0 ? sampleTypeOptions[0] : {};
            regTypeOptions = constructOptionList(this.props.Login.masterData.RegistrationTypes || [], 'nregtypecode', 'sregtypename', 'nregtypecode', "ascending").get("OptionList")
            selectedRegType = regTypeOptions.length > 0 ? regTypeOptions[0] : {};
            breadCrumbData = [];
            breadCrumbSampleType = sampleTypeOptions[0] || {};
            breadCrumbRegType = regTypeOptions[0] || {};
            sampleTypeOptions.length > 0 && breadCrumbData.push(
                {
                    "label": "IDS_SAMPLETYPE",
                    "value": breadCrumbSampleType.label,
                    "item": sampleTypeOptions
                }
            );
            regTypeOptions.length > 0 && breadCrumbData.push(
                {
                    "label": "IDS_REGTYPE",
                    "value": breadCrumbRegType.label,
                    "item": breadCrumbRegType
                }
            );
            updateState = true;
        }
        if (this.props.Login.selectedRegType !== previousProps.Login.selectedRegType) {
            selectedRegType = this.props.Login.selectedRegType;
            updateState = true;
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            updateState = true;
            selectedRecord = this.props.Login.selectedRecord;
            if(selectedRecord !==undefined && this.props.Login.selectedRecord!==undefined)
            {
            selectedRecord["nisnewformat"]=this.props.Login.selectedRecord && this.props.Login.selectedRecord["nisnewformat"]===3?true:this.props.Login.selectedRecord["nisnewformat"]===4?false:this.props.Login.selectedRecord["nisnewformat"];
            selectedRecord["nneedbatch"]=this.props.Login.selectedRecord && this.props.Login.selectedRecord["nneedbatch"]===3?true:this.props.Login.selectedRecord["nneedbatch"]===4?false:this.props.Login.selectedRecord["nneedbatch"];
            selectedRecord["nneedjoballocation"]=this.props.Login.selectedRecord && this.props.Login.selectedRecord["nneedjoballocation"]===3?true:this.props.Login.selectedRecord["nneedjoballocation"]===4?false:this.props.Login.selectedRecord["nneedjoballocation"];
            selectedRecord["nneedmyjob"]=this.props.Login.selectedRecord && this.props.Login.selectedRecord["nneedmyjob"]===3?true:this.props.Login.selectedRecord["nneedmyjob"]===4?false:this.props.Login.selectedRecord["nneedmyjob"];
            selectedRecord["nneedsitewisearno"]=this.props.Login.selectedRecord && this.props.Login.selectedRecord["nneedsitewisearno"]===3?true:this.props.Login.selectedRecord["nneedsitewisearno"]===4?false:this.props.Login.selectedRecord["nneedsitewisearno"];
            selectedRecord["nneedsubsample"]=this.props.Login.selectedRecord && this.props.Login.selectedRecord["nneedsubsample"]===3?true:this.props.Login.selectedRecord["nneedsubsample"]===4?false:this.props.Login.selectedRecord["nneedsubsample"];
            selectedRecord["nneedtestinitiate"]=this.props.Login.selectedRecord && this.props.Login.selectedRecord["nneedtestinitiate"]===3?true:this.props.Login.selectedRecord["nneedtestinitiate"]===4?false:this.props.Login.selectedRecord["nneedtestinitiate"];
            selectedRecord["nneedworklist"]=this.props.Login.selectedRecord && this.props.Login.selectedRecord["nneedworklist"]===3?true:this.props.Login.selectedRecord["nneedworklist"]===4?false:this.props.Login.selectedRecord["nneedworklist"];
            
            }
        }
        if (updateState) {
            this.setState({
                userRoleControlRights, controlMap, addVersionId, editVersionId, deleteVersionId, approveVersionId,
                addRegistrationSubTypeId, editRegistrationSubTypeId, deleteRegistrationSubTypeId,
                sampleTypeOptions, regTypeOptions, breadCrumbData, selectedSampleType, selectedRegType,
                selectedRecord, comboComponents, withoutCombocomponent, breadCrumbSampleType, breadCrumbRegType,editReleaseReferenceNo
            });
        }
    }

    registrationSubTypeAccordion = (verisonList) => {
        const actionParam = {
            // nregsubtypecode: this.props.Login.masterData.selectedRegistrationSubType.nregsubtypecode,
            // nregtypecode: this.props.Login.masterData.selectedRegistrationSubType.nregtypecode,
            nregsubtypeversioncode: this.props.Login.masterData.selectedVersion ? this.props.Login.masterData.selectedVersion.nregsubtypeversioncode : -1,
            napprovalconfigcode: this.props.Login.masterData.selectedVersion ? this.props.Login.masterData.selectedVersion.napprovalconfigcode : -1
        }
        const accordionMap = new Map();
        verisonList.map(version =>
            accordionMap.set(version.nregsubtypeversioncode, <RegistrationSubTypeAccordion
                version={version}
                editVersionId={this.state.editVersionId}
                deleteVersionId={this.state.deleteVersionId}
                approveVersionId={this.state.approveVersionId}
                editReleaseReferenceNo={this.state.editReleaseReferenceNo}
                userRoleControlRights={this.state.userRoleControlRights}
                actionParam={actionParam}
                getVersionById={this.getVersionById}
                getVersionByReleaseNo={this.getVersionByReleaseNo}

                approvrVersion={this.doAction}
                confirmDelete={this.confirmDelete}
                viewFlow={this.showTransactionFlow}
                settings={this.props.Login.settings}

            // approvalConfig={this.props.Login.masterData.ApprovalConfig}
            />)
        )
        return accordionMap;
    }

    filterComboChange = (comboData, name) => {
        if (name === 'nsampletypecode')
            this.props.getRegistrationTypeBySampleType(comboData, this.props.Login.masterData, this.props.Login.userInfo, this.state.breadCrumbRegType)
        else {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    showFilter: false,
                    selectedRegType: comboData,
                    reloadData: false
                }
            }
            this.props.updateStore(updateInfo);
        }
        // this.setState({ selectedRegType: comboData })
    }

    closeFilter = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false }
        }
        this.props.updateStore(updateInfo);
    }

    onFilterSubmit = () => {
        if (this.state.selectedSampleType) {
            this.reloadData(this.state.selectedSampleType, this.state.selectedRegType,"isFilterSubmit");
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SAMPLETYPENOTAVALIABLE" }));
        }
    }

    reloadData = (selectedSampleType, selectedRegType,isFilterSubmit) => {
        // this.searchRef.current.value = "";
        this.props.Login.masterData.searchedData = undefined;
        if (selectedSampleType !== undefined) {
            if(selectedSampleType !== undefined && selectedRegType!==undefined){
                this.props.getRegistrationSubTypeMaster(selectedSampleType, selectedRegType,
                    this.props.Login.masterData, this.props.Login.userInfo, this.searchRef,isFilterSubmit);
            }else{
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUESINFILTER" }));

            }
        
        } else {
            this.props.getRegistrationSubTypeOnReload(this.props.Login.userInfo, this.searchRef);
        }

    }

    confirmDelete = (deleteId, methodURL, selectedRecord) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.doAction('delete', deleteId, methodURL, selectedRecord));
    }

    showTransactionFlow = (version) => {
        const edges = [];
        const nodes = [];
        //const version = this.props.Login.regSubTypeVersionFlow;

        if (version) {

            const activeStyle = {
                background: '#49f29d',
                color: '#000000',
                border: '1px solid #222138',
                width: 180
            };

            const inActiveStyle = {
                background: '#D6D5E6',
                color: '#333',
                border: '1px solid #222138',
                width: 180
            };

            nodes.push(
                {
                    id: '1',
                    type: 'input',
                    data: { label: (<>{this.props.intl.formatMessage({ id: "IDS_REGISTRATION" })}</>), },
                    position: { x: 250, y: 0 },
                    style: activeStyle
                },
                {
                    id: '2',
                    data: { label: (<>{this.props.intl.formatMessage({ id: "IDS_JOBALLOCATION" })}</>), },
                    position: { x: 50, y: 100 },
                    style: version.jsondata["nneedjoballocation"] ? activeStyle : inActiveStyle
                },
                {
                    id: '3',
                    data: { label: (<> {this.props.intl.formatMessage({ id: "IDS_MYJOBS" })} </>), },
                    position: { x: 350, y: 100 },
                    style: version.jsondata["nneedmyjob"] ? activeStyle : inActiveStyle
                },
                {
                    id: '4',
                    data: { label: (<> {this.props.intl.formatMessage({ id: "IDS_WORKLIST" })} </>), },
                    position: { x: 550, y: 100 },
                    style: version.jsondata["nneedworklist"] ? activeStyle : inActiveStyle
                },
                {
                    id: '5a',
                    position: { x: 250, y: 200 },
                    data: { label: this.props.intl.formatMessage({ id: "IDS_BATCHRUN" }), },
                    style: version.jsondata["nneedbatch"] ? activeStyle : inActiveStyle
                },
                {
                    id: '5',
                    position: { x: 250, y: 300 },
                    data: { label: this.props.intl.formatMessage({ id: "IDS_RESULTENTRY" }), },
                    style: activeStyle
                },
                {
                    id: '6',
                    data: { label: this.props.intl.formatMessage({ id: "IDS_APPROVAL" }), },
                    position: { x: 250, y: 400 },
                    style: activeStyle
                },
                {
                    id: '7',
                    type: 'output',
                    data: { label: (<> {this.props.intl.formatMessage({ id: "IDS_RELEASE" })}</>), },
                    position: { x: 250, y: 500 },
                    style: activeStyle
                },
            );

            if (version.jsondata["nneedjoballocation"]) {
                edges.push({ id: 'e1-2', source: '1', target: '2', label: this.props.intl.formatMessage({ id: "IDS_ALLOT" }), animated: true, },)
                if (version.jsondata["nneedmyjob"]) {
                    edges.push({ id: 'e2-3', source: '2', target: '3', label: this.props.intl.formatMessage({ id: "IDS_ACCEPT" }), animated: true, },);
                    if (version.jsondata["nneedbatch"]) {
                        edges.push({ id: 'e3-5a', source: '3', target: '5a', label: this.props.intl.formatMessage({ id: "IDS_RUNBATCH" }), animated: true, },);
                        edges.push({ id: 'e5a-5', source: '5a', target: '5', label: this.props.intl.formatMessage({ id: "IDS_COMPLETE" }), animated: true, },);
                    }
                    else{
                        edges.push({ id: 'e3-5', source: '3', target: '5', label: this.props.intl.formatMessage({ id: "IDS_COMPLETE" }), animated: true, type:'step'},);
                    }
                }
                else {
                    if (version.jsondata["nneedworklist"]) {
                        edges.push({ id: 'e2-4', source: '2', target: '4', label: this.props.intl.formatMessage({ id: "IDS_DATAENTRY" }), animated: true, },);
                        if (version.jsondata["nneedbatch"]) {
                            edges.push({ id: 'e4-5a', source: '4', target: '5a', label: this.props.intl.formatMessage({ id: "IDS_RUNBATCH" }), animated: true, },);
                            edges.push({ id: 'e5a-5', source: '5a', target: '5', label: this.props.intl.formatMessage({ id: "IDS_COMPLETE" }), animated: true, },);
                        }
                        else{
                            edges.push({ id: 'e4-5', source: '4', target: '5', label: this.props.intl.formatMessage({ id: "IDS_COMPLETE" }), animated: true},);
                        }
                    } 
                    else
                    {
                        if (version.jsondata["nneedbatch"]) {
                            edges.push({ id: 'e2-5a', source: '2', target: '5a', label: this.props.intl.formatMessage({ id: "IDS_RUNBATCH" }), animated: true, },);
                            edges.push({ id: 'e5a-5', source: '5a', target: '5', label: this.props.intl.formatMessage({ id: "IDS_COMPLETE" }), animated: true, },);
                        }
                        else{
                            edges.push({ id: 'e2-5', source: '2', target: '5', label: this.props.intl.formatMessage({ id: "IDS_COMPLETE" }), animated: true},);
                        }
                    }
                }
            }
            else {
                if (version.jsondata["nneedmyjob"]) {
                    edges.push({ id: 'e1-3', source: '1', target: '3', label: this.props.intl.formatMessage({ id: "IDS_ACCEPT" }), animated: true, },);
                    if (version.jsondata["nneedbatch"]) {
                        edges.push({ id: 'e3-5a', source: '3', target: '5a', label: this.props.intl.formatMessage({ id: "IDS_RUNBATCH" }), animated: true, },);
                        edges.push({ id: 'e5a-5', source: '5a', target: '5', label: this.props.intl.formatMessage({ id: "IDS_COMPLETE" }), animated: true, },);
                    }
                    else{
                        edges.push({ id: 'e3-5', source: '3', target: '5', label: this.props.intl.formatMessage({ id: "IDS_COMPLETE" }), animated: true, },);
                    }
                   
                }
                else {
                    if (version.jsondata["nneedworklist"]) {
                        edges.push({ id: 'e1-4', source: '1', target: '4', //label: this.props.intl.formatMessage({ id: "IDS_DATAENTRY" }), 
                                    label: "",
                                    animated: true, },);
                        if (version.jsondata["nneedbatch"]) {
                            edges.push({ id: 'e4-5a', source: '4', target: '5a', label: this.props.intl.formatMessage({ id: "IDS_RUNBATCH" }), animated: true, },);
                            edges.push({ id: 'e5a-5', source: '5a', target: '5', label: this.props.intl.formatMessage({ id: "IDS_COMPLETE" }), animated: true, },);
                        }
                        else{
                            edges.push({ id: 'e4-5', source: '4', target: '5', label: this.props.intl.formatMessage({ id: "IDS_COMPLETE" }), animated: true, },);
                        }
                        
                    }
                    else {
                        if (version.jsondata["nneedbatch"]) {
                            edges.push({ id: 'e1-5a', source: '1', target: '5a', label: this.props.intl.formatMessage({ id: "IDS_RUNBATCH" }), animated: true, },);
                            edges.push({ id: 'e5a-5', source: '5a', target: '5', label: this.props.intl.formatMessage({ id: "IDS_COMPLETE" }), animated: true, },);
                        }
                        else{
                            edges.push({ id: 'e1-5', source: '1', target: '5', label: this.props.intl.formatMessage({ id: "IDS_COMPLETE" }), animated: true, },);
                    
                        }
                    }
                }
            }


            edges.push({ id: 'e5-6', source: '5', target: '6', label: this.props.intl.formatMessage({ id: "IDS_APPROVALFLOW" }), animated: true, },
                        { id: 'e6-7', source: '6', target: '7', label: this.props.intl.formatMessage({ id: "IDS_RELEASE" }), animated: true, })
            //console.log("seq:", this.props.Login.screenName);
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal: true, screenName: "IDS_REGISTRATIONFLOW",
                regSubTypeVersionFlow: { nodes, edges }, operation: "view"
            }
        }
        this.props.updateStore(updateInfo);

    }

    openModal = (screenName, ncontrolcode) => {
        if (this.state.breadCrumbData[1] && this.state.breadCrumbData[1].item && this.state.breadCrumbData[1].item.value) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { openModal: true, operation: "create", screenName, ncontrolcode }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTREGTYPE" }));
        }

    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let openChildModal = this.props.Login.openChildModal;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.state.showSynonym) {
            this.setState({ showSynonym: false })
            return null;
        }
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "approve") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
                openChildModal = false;

            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason'] = ""
            }
        }
        else {
            openModal = false;
            selectedRecord = {};
            openChildModal = false;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, openChildModal, loadEsign, selectedRecord, selectedId: null, selectedFieldRecord: {}, showConfirmAlert: false }
        }
        this.props.updateStore(updateInfo);
    }

    onSaveClick = (saveType, formRef) => {
        if (this.props.Login.screenName === "IDS_REGISTRATIONSUBTYPE") {
            this.saveRegSubType(saveType, formRef)
        }else if(this.props.Login.screenName ==="IDS_RELEASEARNO"){
            this.saveReleaseArNoversion(saveType, formRef)
        }
        
        else {
            this.saveVersion(saveType, formRef)
        }
    }

    saveRegSubType = (saveType, formRef) => {
        //add 
        let registrationSubType = {
            nregtypecode: this.state.breadCrumbData[1].item.value,
            jsondata: {
                "sregsubtypename": this.state.selectedRecord.sregsubtypename,
                // "sregsubtypename(en-US)": this.state.selectedRecord.sregsubtypename['en-US'],
                // "sregsubtypename(ru-RU)": this.state.selectedRecord.sregsubtypename['ru-RU'],
                // "sregsubtypename(tg-TG)": this.state.selectedRecord.sregsubtypename['tg-TG'],

                "sdescription": this.state.selectedRecord.sdescription
            }
        }
        const postParam = {
            inputListName: "RegistrationSubType",
            selectedObject: "selectedRegistrationSubType",
            primaryKeyField: "nregsubtypecode",
            fetchUrl: "registrationsubtype/getRegistrationSubTypeMaster",
            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
                nregtypecode: this.state.breadCrumbData[1] ? this.state.breadCrumbData[1].item.value : -1
            },
            masterData: this.props.Login.masterData
        }
        let selectedId = null;
        if (this.props.Login.operation === "update") {
            // edit
            selectedId = this.state.selectedRecord.nregsubtypecode
            registrationSubType = {
                ...registrationSubType,
                nregsubtypecode: selectedId
            }
        }
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: 'RegistrationSubType',
            postParam,
            searchRef: this.searchRef,
            displayName: this.props.Login.inputParam.displayName,
            inputData: {
                userinfo: this.props.Login.userInfo,
                registrationsubtype: registrationSubType
            },
            operation: this.props.Login.operation,
            saveType, formRef,
            selectedRecord:{...this.state.selectedRecord}
        }
        let clearSelectedRecordField = [
            { "idsName": "IDS_REGSUBTYPE", "dataField": "sregsubtypename", "width": "200px","mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox","isClearField":true},
            { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "250px" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox","isClearField":true},
            
            
        ];
        const masterData = this.props.Login.masterData;
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType,
                    operation: this.props.Login.operation, openModal: true,
                    screenName: "IDS_REGISTRATIONSUBTYPE"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal","","",clearSelectedRecordField);
        }


    }

    saveVersion = (saveType, formRef) => {
        let version = {
            napprovalconfigcode: this.props.Login.masterData.selectedRegistrationSubType.napprovalconfigcode,
            nregsubtypecode: this.props.Login.masterData.selectedRegistrationSubType.nregsubtypecode,
            jsondata: {
                ...this.state.selectedRecord,
                nresetduration: 1,
                /*ALPD-4135-Vignesh R--The system will allow the authorized 
             user to enter results for the selected tests without initiate action.*/
              nneedtestinitiate:this.state.selectedRecord["nneedtestinitiate"] ? true :false,
              //ALPD-5323 added by Dhanushya RI,to add spec in registration screen based on settings value
              ntestgroupspecrequired:
              this.props.Login.settings[71]===String(transactionStatus.YES)?true:
              this.state.selectedRecord["ntestgroupspecrequired"] ? true : false,    //ALPD-4973, Vishakh, When insert in jsondata needed test group spec enabled or disabled value
               //  nneedtestinitiate:true,
 // nneedscheduler:false,
                sversiondesc: '-',
                nversionno: -1
            },
            jsonuidata: {
                exampleformat: this.state.selectedRecord["exampleformat"] ? this.state.selectedRecord["exampleformat"] : "-",
                nisnewformat: this.state.selectedRecord["nisnewformat"] ? this.props.intl.formatMessage({ id: "IDS_YES" }) : this.props.intl.formatMessage({ id: "IDS_NO" }),
                nneedjoballocation: this.state.selectedRecord["nneedjoballocation"] ? this.props.intl.formatMessage({ id: "IDS_YES" }) : this.props.intl.formatMessage({ id: "IDS_NO" }),
                nneedmyjob: this.state.selectedRecord["nneedmyjob"] ? this.props.intl.formatMessage({ id: "IDS_YES" }) : this.props.intl.formatMessage({ id: "IDS_NO" }),
                nneedsampledby: this.state.selectedRecord["nneedsampledby"] ? this.props.intl.formatMessage({ id: "IDS_YES" }) : this.props.intl.formatMessage({ id: "IDS_NO" }),
                nneedscheduler: this.state.selectedRecord["nneedscheduler"] ? this.props.intl.formatMessage({ id: "IDS_YES" }) : this.props.intl.formatMessage({ id: "IDS_NO" }),
                nneedsubsample: this.state.selectedRecord["nneedsubsample"] ? this.props.intl.formatMessage({ id: "IDS_YES" }) : this.props.intl.formatMessage({ id: "IDS_NO" }),
                nneedtestinitiate: this.state.selectedRecord["nneedtestinitiate"] ? this.props.intl.formatMessage({ id: "IDS_YES" }) : this.props.intl.formatMessage({ id: "IDS_NO" }),
                ntestgroupspecrequired: this.state.selectedRecord["ntestgroupspecrequired"] ? this.props.intl.formatMessage({ id: "IDS_YES" }) : this.props.intl.formatMessage({ id: "IDS_NO" }),   //ALPD-4973, Vishakh, When insert in jsonuidata needed test group spec enabled or disabled value
               // nneedtestinitiate:  this.props.intl.formatMessage({ id: "IDS_YES" }) ,
                nneedworklist: this.state.selectedRecord["nneedworklist"] ? this.props.intl.formatMessage({ id: "IDS_YES" }) : this.props.intl.formatMessage({ id: "IDS_NO" }),
                nneedbatch: this.state.selectedRecord["nneedbatch"] ? this.props.intl.formatMessage({ id: "IDS_YES" }) : this.props.intl.formatMessage({ id: "IDS_NO" }),
                seqnolength: this.state.selectedRecord["seqnolength"] ? this.state.selectedRecord["seqnolength"] : "-",
                splaintext: this.state.selectedRecord["splaintext"] ? this.state.selectedRecord["splaintext"] : "-",
                ssampleformat: this.state.selectedRecord["ssampleformat"] ? this.state.selectedRecord["ssampleformat"] : "-",
                nresetduration: this.state.selectedRecord["nperiodcode"] ? this.state.selectedRecord["nperiodcode"].label : "-",
                ntransactionstatus: transactionStatus.DRAFT,
                stransdisplaystatus: this.props.intl.formatMessage({ id: "IDS_DRAFT" }),
                sversiondesc: '-',
                nversionno: -1,
                sregsubtypename: this.props.Login.masterData.selectedRegistrationSubType.sregsubtypename,
                nneedsitewisearno: this.state.selectedRecord["nneedsitewisearno"] ? this.props.intl.formatMessage({ id: "IDS_YES" }) : this.props.intl.formatMessage({ id: "IDS_NO" }),
            },


            nperiodcode: this.state.selectedRecord.nperiodcode ? this.state.selectedRecord.nperiodcode.value : 4,
            ntransactionstatus: transactionStatus.DRAFT,
            nsitecode: this.props.Login.userInfo.nmastersitecode,
            nstatus: transactionStatus.ACTIVE
        }
        let selectedId = null;
        let operation = 'create';
        if (this.props.Login.operation === "update") {
            // edit
            operation = 'update'
            selectedId = this.state.selectedRecord.nregsubtypeversioncode
            version = {
                ...version,
                nregsubtypeversioncode: selectedId
            }
        }
        const postParam = {
            inputListName: "RegistrationSubType",
            selectedObject: "selectedRegistrationSubType",
            primaryKeyField: "nregsubtypecode",
            fetchUrl: "registrationsubtype/getRegistrationSubTypeMaster",
            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
                nregtypecode: this.state.breadCrumbData[1] ? this.state.breadCrumbData[1].item.value : -1
            },
            masterData: this.props.Login.masterData
        }
        let clearSelectedRecordField=[
            {"idsName":"IDS_NEEDSUBSAMPLE","dataField":"nneedsubsample","width":"200px","isClearField":true,"preSetValue":4},
            {"idsName":"IDS_NEEDJOBALLOCATION","dataField":"nneedjoballocation","width":"200px","isClearField":true,"preSetValue":4},
            {"idsName":"IDS_NEEDMYJOB","dataField":"nneedmyjob","width":"200px","isClearField":true,"preSetValue":4},
            {"idsName":"IDS_NEEDWORKLIST","dataField":"nneedworklist","width":"200px","isClearField":true,"preSetValue":4},
            {"idsName":"IDS_NEEDBATCH","dataField":"nneedbatch","width":"200px","isClearField":true,"preSetValue":4},
            {"idsName":"IDS_NEEDTESTINITIATE","dataField":"nneedtestinitiate","width":"200px","isClearField":true,"preSetValue":4},
            {"idsName":"IDS_USENEWFORMAT","dataField":"nisnewformat","width":"200px","isClearField":true,"preSetValue":4},      
            {"idsName":"IDS_NEEDSITEWISEARNO","dataField":"nneedsitewisearno","width":"200px","isClearField":true,"preSetValue":4},
            {"idsName":"IDS_TEXTVALUE","dataField":"splaintext","width":"200px","isClearField":true},
            {"idsName":"IDS_SEQUENCENOLENGTH","dataField":"seqnolength","width":"200px","isClearField":true},
            {"idsName":"IDS_INPUTFORMATWITHINFO","dataField":"ssampleformat","width":"200px","isClearField":true},
            {"idsName":"IDS_OUTPUTFORMAT","dataField":"exampleformat","width":"200px","isClearField":true},
            
            
        ];

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: 'Version',
            postParam,
            searchRef: this.searchRef,
            displayName: this.props.Login.inputParam.displayName,
            inputData: {
                userinfo: this.props.Login.userInfo,
                version: version, isChild: true
            },
            operation,
            saveType, formRef,
            selectedRecord:{...this.state.selectedRecord}
        }
        const masterData = this.props.Login.masterData;
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true,
                    screenData: { inputParam, masterData },
                    saveType,
                    operation,
                    openChildModal: true,
                    //screenName: "IDS_REGISTRATIONFLOW"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openChildModal","","",clearSelectedRecordField);
        }
    }
    
    saveReleaseArNoversion = (saveType, formRef) => {
        let version = {
            napprovalconfigcode: this.props.Login.masterData.selectedRegistrationSubType.napprovalconfigcode,
            nregsubtypecode: this.props.Login.masterData.selectedRegistrationSubType.nregsubtypecode,
            jsondata: {
                ...this.state.selectedRecord,
                nresetduration: 1,
 /*ALPD-4135-Vignesh R--The system will allow the authorized 
             user to enter results for the selected tests without initiate action.*/
              nneedtestinitiate:this.state.selectedRecord["nneedtestinitiate"] ? true :false,
              //  nneedtestinitiate:true,
                // nneedscheduler:false,
                sversiondesc: '-',
                nversionno: -1
            },
            jsonuidata: {
                sreleaseexampleformat: this.state.selectedRecord["sreleaseexampleformat"] ? this.state.selectedRecord["sreleaseexampleformat"] : "-",
                seqnolength: this.state.selectedRecord["seqnolength"] ? this.state.selectedRecord["seqnolength"] : "-",
                splaintext: this.state.selectedRecord["splaintext"] ? this.state.selectedRecord["splaintext"] : "-",
                sreleaseformat: this.state.selectedRecord["sreleaseformat"] ? this.state.selectedRecord["sreleaseformat"] : "-",
                nresetduration: this.state.selectedRecord["nperiodcode"] ? this.state.selectedRecord["nperiodcode"].label : "-",
                ntransactionstatus: transactionStatus.DRAFT,
                stransdisplaystatus: this.props.intl.formatMessage({ id: "IDS_DRAFT" }),
                sversiondesc: '-',
                nversionno: -1,
                sregsubtypename: this.props.Login.masterData.selectedRegistrationSubType.sregsubtypename,
                nneedsitewisearnorelease: this.state.selectedRecord["nneedsitewisearnorelease"] ? this.props.intl.formatMessage({ id: "IDS_YES" }) : this.props.intl.formatMessage({ id: "IDS_NO" }),
            },


            nperiodcode: this.state.selectedRecord.nperiodcode ? this.state.selectedRecord.nperiodcode.value : 4,
            ntransactionstatus: transactionStatus.DRAFT,
            nsitecode: this.props.Login.userInfo.nmastersitecode,
            nstatus: transactionStatus.ACTIVE
        }
        let selectedId = null;
        let operation = 'create';
        if (this.props.Login.operation === "update") {
            // edit
             operation = 'update'
            selectedId = this.state.selectedRecord.nregsubtypeversionreleasecode
            version = {
                ...version,
                nregsubtypeversionreleasecode: selectedId
            }
        }
        const postParam = {
            inputListName: "RegistrationSubType",
            selectedObject: "selectedRegistrationSubType",
            primaryKeyField: "nregsubtypecode",
            fetchUrl: "registrationsubtype/getRegistrationSubTypeMaster",
            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
                nregtypecode: this.state.breadCrumbData[1] ? this.state.breadCrumbData[1].item.value : -1
            },
            masterData: this.props.Login.masterData
        }
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: 'ReleaseArNoVersion',
            postParam,
            searchRef: this.searchRef,
            displayName: this.props.Login.inputParam.displayName,
            inputData: {
                userinfo: this.props.Login.userInfo,
                version: version, isChild: true
            },
            operation,
            saveType, formRef,
            selectedRecord:{...this.state.selectedRecord}
        }
        const masterData = this.props.Login.masterData;
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true,
                    screenData: { inputParam, masterData },
                    saveType,
                    operation,
                    openChildModal: true,
                    //screenName: "IDS_REGISTRATIONFLOW"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openChildModal");
        }
    }



    getVersionById = (ncontrolcode) => {
        this.props.getVersionById(this.props.Login.masterData.selectedVersion.nregsubtypeversioncode, this.props.Login.userInfo, ncontrolcode)
    }
    getVersionByReleaseNo = (ncontrolcode) => {
        this.props.getVersionByReleaseNo(this.props.Login.masterData.selectedVersion.nregsubtypeversionreleasecode!==undefined?this.props.Login.masterData.selectedVersion.nregsubtypeversionreleasecode: this.props.Login.masterData.selectedVersion.nregsubtypeversioncode, this.props.Login.userInfo, ncontrolcode)
    }
    doAction = (operation, controlCode, methodURL, selectedRecord) => {

        let arrayObject = {};
       let  selectedValue={...selectedRecord, nregsubtypecode :this.props.Login.masterData.selectedRegistrationSubType.nregsubtypecode}
        let modal = methodURL != "Version" ? "openModal" : "openChildModal";
        if (operation === "approve") {
            const nregtypecode = this.props.Login.masterData.selectedRegistrationSubType.nregtypecode;
            const nregsubtypecode = this.props.Login.masterData.selectedRegistrationSubType.nregsubtypecode;
            arrayObject = { "nregtypecode": nregtypecode, "nregsubtypecode": nregsubtypecode };
        }
        const postParam = {
            inputListName: "RegistrationSubType",
            selectedObject: "selectedRegistrationSubType",
            primaryKeyField: "nregsubtypecode",
            fetchUrl: "registrationsubtype/getRegistrationSubTypeMaster",
            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
                nregtypecode: this.state.breadCrumbData[1] ? this.state.breadCrumbData[1].item.value : -1
            },
            primaryKeyValue: this.props.Login.masterData.selectedRegistrationSubType.nregsubtypecode,
            masterData: this.props.Login.masterData
        }
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: methodURL,
            postParam: ((methodURL != "Version") || (methodURL == "Version" && operation == "approve")) ? postParam : undefined,
            searchRef: this.searchRef,
            inputData: {
                [methodURL.toLowerCase()]: { ...selectedValue, ...arrayObject },
                "userinfo": this.props.Login.userInfo
            },
            operation,
            displayName: this.props.Login.inputParam.displayName, isChild: methodURL != "Version" ? undefined : true,
            selectedRecord:{...this.state.selectedRecord}
        }
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, controlCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true,
                    screenData: { inputParam, masterData: this.props.Login.masterData },
                    [modal] : true,
                    screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, modal);
        }
    }
    onInputOnChange = (event, name) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked;
            if(this.props.Login.screenName==="IDS_RELEASEARNO"){
                selectedRecord["formatArray"] = [];
                selectedRecord["sreleaseexampleformat"] = "";
                selectedRecord["sreleaseformat"] = "";
                selectedRecord["seqnolength"] = 4;
            }
            if (event.target.name === 'nisnewformat') {

                selectedRecord["formatArray"] = [];
                selectedRecord["ssampleformat"] = "";
                selectedRecord["exampleformat"] = "";
                selectedRecord["seqnolength"] = 4;
            }
            if (event.target.name === 'nneedsitewisearno') {

                selectedRecord["formatArray"] = [];
                selectedRecord["ssampleformat"] = "";
                selectedRecord["exampleformat"] = "";
            }

            // ALPD-5336 - line no (1234 - 1244) Gowtham R - Registration Sub Type: Either Worklist or My job toggle should be enabled.
            if (event.target.name === "nneedworklist") {
                if (selectedRecord["nneedmyjob"] === true) {
                    delete selectedRecord["nneedmyjob"]
                    //delete selectedRecord["nneedjoballocation"]
                }
            }
            if (event.target.name === "nneedmyjob") {
                if (selectedRecord["nneedworklist"] === true) {
                    delete selectedRecord["nneedworklist"]
                }
            }
        }
        else {
            if (name === 'synonym') {
                selectedRecord['sregsubtypename'] = {
                    ...selectedRecord['sregsubtypename'],
                    [event.target.name]: event.target.value
                }
            }
            else if (name === 'sregsubtypename') {
                const langArray = this.props.Login.languageList;
                const langDataObject = {};
                langArray.map(item =>
                    langDataObject[item.value] = event.target.value);

                selectedRecord['sregsubtypename'] = {
                    ...selectedRecord['sregsubtypename'],
                    ...langDataObject
                }
            }
            //ALPD-5070 added by Dhanushya RI,Special characters are not allowed except hyphen to add in release reference number popup
            else if(name === 'splaintext'){
                selectedRecord[event.target.name]= event.target.value.replace(/[^a-zA-Z0-9]/g, '');
            }
            else {
                selectedRecord[event.target.name] = event.target.value;
            }
        }
        this.setState({ selectedRecord });
    }

    validateEsign = () => {
        let modal="openChildModal";
        if(this.props.Login.screenData.inputParam.methodUrl!=="ReleaseArNoVersion"){
             modal = this.props.Login.screenData.inputParam.methodUrl != "Version" ? "openModal" : "openChildModal";

        }
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
        this.props.validateEsignCredential(inputParam, modal);
    }

    onNumericInputChange = (value, name) => {
        let selectedRecord = this.state.selectedRecord
        if (value === 0 || value === 0.0) {
            selectedRecord[name] = "";
            this.setState({ selectedRecord });
        } else {
            if (name === 'seqnolength') {
                let str = '{9999}'
                str = str.substring(1, str.length - 4)
                str = str.padStart(value, 9)
                selectedRecord.sseqno = '{' + str + '}'
            }
            selectedRecord[name] = value;
            this.setState({ selectedRecord });

        }
    }
    onComboChange = (comboData, name) => {
        this.setState({ selectedRecord: { ...this.state.selectedRecord, [name]: comboData } })
    }
    onDrop(data) {
        // if (data.formatcomponents === "") {

        // } else {
        let selectedRecord={};
        if(this.state.selectedRecord !== undefined){
             selectedRecord = JSON.parse(JSON.stringify(this.state.selectedRecord));
            // let formatArray = selectedRecord.formatArray || []
            // formatArray.push(data.formatcomponents)
            // let formatString = '';
            // formatArray.map(comp => formatString += comp)
            // selectedRecord.formatArray = formatArray
            // selectedRecord.ssampleformat = formatString;
            // selectedRecord.exampleformat = this.replaceFormat(formatString)
            // if (selectedRecord.ssampleformat.length < 30) {
            //     this.setState({ selectedRecord });
            // } else {
            //     toast.info(this.props.intl.formatMessage({ id: "IDS_EXCEEDSMAXCHARS" }));
            // }
        // }
      }
            let formatArray = selectedRecord && selectedRecord.formatArray !== undefined ? selectedRecord.formatArray : []
            formatArray.push(data.formatcomponents)
            let formatString = '';
            formatArray.map(comp => formatString += comp)
            selectedRecord.formatArray = formatArray
            if(this.props.Login.screenName==="IDS_RELEASEARNO"){
                selectedRecord.sreleaseformat = formatString;
                selectedRecord.sreleaseexampleformat = this.replaceFormat(formatString)
                 //ALPD-534
            if (selectedRecord.sreleaseformat.replaceAll("{","").replaceAll("}","").length <= 40) {
                this.setState({ selectedRecord });
            } else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_EXCEEDSMAXCHARS" }));
            }

            }else{
                selectedRecord.ssampleformat = formatString;
                selectedRecord.exampleformat = this.replaceFormat(formatString)
                 //ALPD-534
                 //ALPD-5254--added by  neeraj
            if (selectedRecord.ssampleformat.replaceAll("{","").replaceAll("}","").length <= 30) {
                this.setState({ selectedRecord });
            } else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_EXCEEDSMAXCHARS" }));
            }

            }
          
           
    }
    onClickBackspace = () => {
        let { selectedRecord } = this.state;
        let formatArray = selectedRecord.formatArray || []
        formatArray.pop()
        let formatString = '';

        formatArray.map(comp => formatString += comp)
        
        selectedRecord.formatArray = formatArray
        if(this.props.Login.screenName==="IDS_RELEASEARNO"){
            selectedRecord.sreleaseformat = formatString;
            selectedRecord.sreleaseexampleformat = this.replaceFormat(formatString)
            
        }else{
            selectedRecord.ssampleformat = formatString;
            selectedRecord.exampleformat = this.replaceFormat(formatString)
        }

        this.setState({ selectedRecord });
    }
    onClickClear = () => {
        let { selectedRecord } = this.state;
        if(this.props.Login.screenName==="IDS_RELEASEARNO"){
            selectedRecord.formatArray = [];
            selectedRecord.sreleaseformat = "";
            selectedRecord.sreleaseexampleformat = ""
        }else{
			//ALPD-3835
            if(selectedRecord){
                selectedRecord.formatArray = [];
                selectedRecord.ssampleformat = "";
                selectedRecord.exampleformat = ""
            }
           
        }
      
        this.setState({ selectedRecord });
    }
    replaceFormat = (formatString) => {
        const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const date = new Date();
        let replacedString = formatString;
        let seqno = "1"

        while (replacedString.includes('}')) {
            let comp = replacedString.substring(replacedString.indexOf('{'), replacedString.indexOf('}') + 1)
            switch (comp) {
                case '{yyyy}':
                    replacedString = replacedString.replace('{yyyy}', date.getFullYear())
                    break;
                case '{yy}':
                    replacedString = replacedString.replace('{yy}', date.getFullYear().toString().substring(2, 4))
                    break;
                case '{MM}':
                    replacedString = replacedString.replace('{MM}', (date.getMonth() + 1).toString().padStart(2, "0"))
                    break;
                case '{MMM}':
                    replacedString = replacedString.replace('{MMM}', month[date.getMonth()])
                    break;
                case '{DD}':
                    replacedString = replacedString.replace('{DD}', date.getDate().toString().padStart(2, "0"))
                    break;
                case '{XXXXX}':
                        replacedString = replacedString.replace('{XXXXX}', this.props.Login.userInfo.ssitecode);
                        break;
                case this.state.selectedRecord && this.state.selectedRecord.sseqno || '{9999}':
                    seqno = seqno.padStart(this.state.selectedRecord  && this.state.selectedRecord.seqnolength || 4, "0")
                    replacedString = replacedString.replace(this.state.selectedRecord &&  this.state.selectedRecord.sseqno || '{9999}', seqno)
                    break;
                default:
                    if (comp.includes('9')) {
                        seqno = seqno.padStart(comp.length - 2, "0")
                        replacedString = replacedString.replace(comp, seqno)
                    }
                    break;
            }
        }
        return replacedString;
    }

}
export default connect(mapStateToProps, {
    updateStore, crudMaster, getRegistrationSubTypeMaster,
    filterColumnData, getRegSubTypeDetails, getSeqNoFormats, selectRegistrationSubType, getEditRegSubType,
    getVersionById, getRegistrationTypeBySampleType, getRegistrationSubTypeOnReload, validateEsignCredential,getVersionByReleaseNo
})(injectIntl(RegistrationSubType))