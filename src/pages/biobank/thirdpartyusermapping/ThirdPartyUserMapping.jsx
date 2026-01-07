import React from 'react'
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import DataGrid from '../../../components/data-grid/data-grid.component';
//import SplitterLayout from '@progress/kendo-react-layout'; //'react-splitter-layout';
import { Splitter, SplitterPane } from '@progress/kendo-react-layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import TransactionListMasterJsonView from '../../../components/TransactionListMasterJsonView';
import { Row, Col, Button, Card, Nav } from 'react-bootstrap';
import { ContentPanel, ProductList } from '../../product/product.styled';
import { getControlMap, showEsign, validateEmail, validatePhoneNumber, replaceUpdatedObject } from '../../../components/CommonScript';
import { ReactComponent as RefreshIcon } from '../../../assets/image/refresh.svg';
import { ListWrapper } from '../../userroletemplate/userroletemplate.styles';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import { callService, updateStore, crudMaster, validateEsignCredential, editEditThirdPartyUserMapping, addGetUserRole, getuserThirdParty, updateThirdPartyUserMapping, getThirdPartySelectedRecord, addGetUsers, filterTransactionList } from '../../../actions';
import { process } from '@progress/kendo-data-query';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import Esign from '../../audittrail/Esign';
import ThirdPartyConfig from './ThirdpartyConfig';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ViewInfoDetails from '../../../components/ViewInfoDetails';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';
import { designProperties } from '../../../components/Enumeration';

class ThirdPartyUserMapping extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5
        };
        this.searchFieldList = ["sthirdpartyname"]
        this.state = {
            nisngsConfirmed: "false",    // added by sujatha ATE_274 BGSI-185 flag for delete validation
            selectedRecord: {},
            selectedMasterRecord: {},
            operation: "",
            gridHeight: 'auto',
            screenName: undefined,
            userRoleControlRights: [],
            ControlRights: undefined,
            ConfirmDialogScreen: false,
            controlMap: new Map(),
            dataResult: [],
            dataState: dataState,
            skip: 0,
            error: "",
            take: this.props.Login.settings && this.props.Login.settings[3],
            kendoSkip: 0,
            kendoTake: this.props.Login.settings ? parseInt(this.props.Login.settings[16]) : 5,
            splitChangeWidthPercentage: 20,
             //Added by L.Subashini on 20/12/2025 for Splitter issue with React Version Upgrade to 17
            panes: [
                { size: '30%', min: '25%', collapsible:true }    
            ],
             //Added by L.Subashini on 20/12/2025 for Splitter issue with React Version Upgrade to 17
            // panel:[
            //     { size: '40%', min: '5%' },
            //     {},
            //     { size: '20%' }
            // ]
        };
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();;
    }

     //Added by L.Subashini on 19/12/2025 for Splitter issue with React Version Upgrade to 17
    onSplitterChange = (event) => {
        this.setState({ panes: event.newState });
    };


    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data ? this.state.data : [], event.dataState),
            dataState: event.dataState
        });
    }

    paneSizeChange = (d) => {
        this.setState({
            splitChangeWidthPercentage: d
        })
    }

    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };

    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }
        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        return null;
    }

    onReload = () => {

        if (this.searchRef && this.searchRef.current) {
            this.searchRef.current.value = "";
        }
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "ThirdPartyUserMapping",
            userInfo: this.props.Login.userInfo,
            displayName: this.props.Login.displayName,
        };

        this.props.callService(inputParam);

    }

    render() {
        const filterParam = {
            inputListName: "ThirdPartyRecord", selectedObject: "selectedThirdPartyMasterRecord", primaryKeyField: "nthirdpartycode",
            fetchUrl: "thirdpartyusermapping/getThirdPartySelectedRecord", masterData: this.props.Login.masterData || {},

            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
                nthirdpartycode: this.props.Login.masterData.selectedThirdPartyMasterRecord &&
                    this.props.Login.masterData.selectedThirdPartyMasterRecord.nthirdpartycode,

            },
            filteredListName: "selectedThirdPartyMasterRecord",
            clearFilter: "yes",
            updatedListname: "selectedThirdPartyMasterRecord",
            searchRef: this.searchRef,
            searchFieldList: this.searchFieldList,
            changeList: [], isSortable: true, sortList: 'selectedThirdPartyMasterRecord'
        };
        const addID = this.state.controlMap.has("AddThirdPartyUserMapping") && this.state.controlMap.get("AddThirdPartyUserMapping").ncontrolcode;
        const editId = this.state.controlMap.has("EditThirdPartyUserMapping") && this.state.controlMap.get("EditThirdPartyUserMapping").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteThirdPartyUserMapping") && this.state.controlMap.get("DeleteThirdPartyUserMapping").ncontrolcode;
        const deleteIdChild = this.state.controlMap.has("DeleteUserRoleAndUsers") && this.state.controlMap.get("DeleteUserRoleAndUsers").ncontrolcode;
        this.extractedColumnList = [
            { "idsName": "IDS_USERROLENAME", "dataField": "suserrolename", "width": "250px", "componentName": "date" },
            { "idsName": "IDS_USERNAME", "dataField": "susername", "width": "250px", "componentName": "date" },
        ]

        let mandatoryFields = [
            { "idsName": "IDS_THIRDPARTYNAME", "dataField": "sthirdpartyname", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
        ]

        let childmandatoryFields = [
            { "idsName": "IDS_USERROLENAME", "dataField": "nuserrolecode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" },
            { "idsName": "IDS_USERS", "dataField": "nusercode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "selectbox" }

        ]
        return (
            <>
                <ListWrapper className="client-listing-wrap mtop-4 screen-height-window">
                    <Row noGutters={"true"}>
                        <Col md={12} className='parent-port-height-nobreadcrumb1 sticky_head_parent' ref={(parentHeight) => { this.parentHeight = parentHeight }}>
                            <ListWrapper className={`vertical-tab-top ${this.state.enablePropertyPopup ? 'active-popup' : ""}`}>

                                {/* <SplitterLayout borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={this.state.splitChangeWidthPercentage} onSecondaryPaneSizeChange={this.paneSizeChange} primaryMinSize={40} secondaryMinSize={20}> */}
                                      {/* Commented SplitterLayout and added Splitter by L.Subashini on 20/12/2025 for Splitter issue with React Version Upgrade to 17 */}
                                      
                                    <Splitter className='layout-splitter' orientation="horizontal"
                                                                                    panes={this.state.panes} onChange={this.onSplitterChange}>
                                        <SplitterPane size="30%" min="25%">
                                        
                                            <TransactionListMasterJsonView
                                                splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                                needMultiSelect={false}
                                                masterList={this.props.Login.masterData.searchedData || (this.state.ThirdPartyRecord && this.state.ThirdPartyRecord !== undefined ? this.state.ThirdPartyRecord : (this.props.Login.masterData && this.props.Login.masterData.ThirdPartyRecord ? this.props.Login.masterData.ThirdPartyRecord : []))}
                                                selectedMaster={[this.props.Login.masterData.selectedThirdPartyMasterRecord] || []}
                                                primaryKeyField="nthirdpartycode"

                                                getMasterDetail={
                                                    (viewEditThirdPartyUserMapping) =>
                                                        this.props.getThirdPartySelectedRecord
                                                            (viewEditThirdPartyUserMapping, this.props.Login.userInfo, this.props.Login.masterData)
                                                }
                                                filterParam={filterParam}
                                                subFields={[
                                                    { [designProperties.VALUE]: "sisngs" }
                                                ]}
                                                subFieldsLabel={false}
                                                additionalParam={['']}
                                                mainField={'sthirdpartyname'}
                                                filterColumnData={this.props.filterTransactionList}
                                                showFilter={this.props.Login.showFilter}
                                                openFilter={this.openFilter}
                                                closeFilter={this.closeFilter}
                                                onFilterSubmit={this.onFilterSubmit}
                                                statusFieldName="sthirdpartyname"
                                                statusField="nthirdpartyusermappingcode"
                                                statusColor="#999"
                                                showStatusIcon={true}
                                                showStatusName={true}
                                                showStatusLink={false}
                                                needFilter={false}
                                                searchRef={this.searchRef}
                                                skip={this.state.skip}
                                                take={this.state.take}
                                                handlePageChange={this.handlePageChange}
                                                showStatusBlink={true}
                                                callCloseFunction={true}
                                                pageable={true}
                                                childTabsKey={[]}
                                                splitModeClass={this.state.splitChangeWidthPercentage && this.state.splitChangeWidthPercentage > 50 ? 'split-mode' : this.state.splitChangeWidthPercentage > 40 ? 'split-md' : ''}
                                                commonActions={
                                                    <>
                                                        <ProductList className="d-flex product-category float-right">
                                                            <Nav.Link
                                                                className="btn btn-icon-rounded btn-circle solid-blue" role="button"
                                                                // IDS modified by sujatha ATE_274 for BGSI-148
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADDTHIRDPARTY" })}
                                                                hidden={this.state.userRoleControlRights.indexOf(addID) === -1}
                                                                onClick={this.addModal}
                                                            >
                                                                <FontAwesomeIcon icon={faPlus} />
                                                            </Nav.Link>
                                                            <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                                onClick={() => this.onReload()}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}>
                                                                <RefreshIcon className='custom_icons' />
                                                            </Button>
                                                        </ProductList>
                                                    </>
                                                }
                                                filterComponent={false}
                                            />
                                        </SplitterPane>
                                        <SplitterPane size="70%" min="25%">
                                            {this.props.Login.masterData.ThirdPartyRecord && this.props.Login.masterData.selectedThirdPartyMasterRecord ?
                                                <ContentPanel className="panel-main-content">
                                                    <Card className="border-0">
                                                        <Card.Header>
                                                            <Card.Subtitle >
                                                                <div className="d-flex product-category">
                                                                    <h2 className="product-title-sub flex-grow-1">
                                                                    </h2>

                                                                    <ViewInfoDetails
                                                                        userInfo={this.props.Login.userInfo}
                                                                        selectedObject={this.props.Login.masterData.selectedThirdPartyMasterRecord}
                                                                        screenHiddenDetails={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                        screenName={this.props.Login.screenName}
                                                                        dataTip={this.props.intl.formatMessage({ id: "IDS_VIEW" })}
                                                                        downLoadIcon={this.props.Login.masterData.selectedThirdPartyMasterRecord && this.props.Login.masterData.selectedThirdPartyMasterRecord.sfilename && this.props.Login.masterData.selectedThirdPartyMasterRecord.sfilename != '-' ? true : false}
                                                                        rowList={[
                                                                            [
                                                                                { dataField: "sthirdpartyname", idsName: "IDS_THIRDPARTYNAME" },

                                                                            ],
                                                                            [
                                                                                { dataField: "saddress", idsName: "IDS_ADDRESS" },

                                                                            ],
                                                                            [
                                                                                { dataField: "sphonenumber", idsName: "IDS_PHONENO" },

                                                                            ],
                                                                            [
                                                                                { dataField: "semail", idsName: "IDS_EMAIL" },

                                                                            ],
                                                                            [
                                                                                { dataField: "sdescription", idsName: "IDS_DESCRIPTION" },

                                                                            ],
                                                                            [
                                                                                { dataField: "sisngs", idsName: "IDS_NGS" },

                                                                            ]
                                                                        ]} />

                                                                    <Nav.Link
                                                                        className="btn btn-circle outline-grey mr-2"
                                                                        name="mastertoedit"
                                                                        hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                        // IDS modified by sujatha ATE_274 for BGSI-148
                                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDITTHIRDPARTY" })}
                                                                        onClick={(edittherecord) =>
                                                                            this.props.editEditThirdPartyUserMapping(
                                                                                {
                                                                                    mastertoedit: this.props.Login.masterData.selectedThirdPartyMasterRecord,
                                                                                    userInfo: this.props.Login.userInfo,
                                                                                    masterData: this.props.Login.masterData,
                                                                                    editId,
                                                                                },
                                                                                this.props.Login.userInfo,
                                                                                this.props.Login.masterData
                                                                            )
                                                                        }
                                                                    >
                                                                        <FontAwesomeIcon icon={faPencilAlt} />
                                                                    </Nav.Link>

                                                                    <Nav.Link
                                                                        className="btn btn-circle outline-grey mr-2"
                                                                        name="mastertodelete"
                                                                        hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                        // IDS modified by sujatha ATE_274 for BGSI-148
                                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETETHIRDPARTY" })}
                                                                        onClick={() =>
                                                                            this.ConfirmDelete(deleteId, {
                                                                                mastertodelete: this.props.Login.masterData.selectedThirdPartyMasterRecord,
                                                                                userInfo: this.props.Login.userInfo,
                                                                                masterData: this.props.Login.masterData
                                                                            })
                                                                        }
                                                                    >
                                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                                    </Nav.Link>

                                                                    <Col md={16} >
                                                                    </Col>
                                                                </div>
                                                            </Card.Subtitle>

                                                        </Card.Header>
                                                        {this.props.Login.masterData.ThirdPartyRecord ? Object.entries(this.props.Login.masterData.ThirdPartyRecord).length > 0 ?
                                                            <>
                                                                <Row noGutters={true}>
                                                                    <Col md={12}>
                                                                        <div className="actions-stripe">
                                                                            <div className="d-flex justify-content-end">
                                                                                <Nav.Link className="add-txt-btn text-right"
                                                                                    onClick={() => this.props.addGetUsers(this.props.Login.userInfo
                                                                                        , this.props.Login.masterData.selectedThirdPartyMasterRecord, addID)}       // modified by sujatha ATE_274 BGSI-185 for an issue , instead of passing selectedThirdPartyMasterRecord passed this ThirdPartyRecord wrongly
                                                                                    hidden={this.state.userRoleControlRights.indexOf(addID) === -1}
                                                                                >
                                                                                    <FontAwesomeIcon icon={faPlus} /> { }
                                                                                    <FormattedMessage id='IDS_USERS' defaultMessage='Barcode Master' />
                                                                                </Nav.Link>
                                                                            </div>
                                                                        </div>
                                                                    </Col>
                                                                    <Col md={12}>
                                                                        <DataGrid
                                                                            primaryKeyField={"nthirdpartycode"}
                                                                            dataResult={process(this.props.Login.masterData.lstThirdPartyMapping ? this.props.Login.masterData.lstThirdPartyMapping : [], this.state.dataState)}
                                                                            dataState={this.state.dataState || []}
                                                                            data={this.props.Login.masterData.lstThirdPartyMapping || []}
                                                                            dataStateChange={this.dataStateChange}
                                                                            extractedColumnList={this.extractedColumnList}
                                                                            controlMap={this.state.controlMap}
                                                                            userRoleControlRights={this.state.userRoleControlRights}
                                                                            inputParam={this.props.Login.inputParam}
                                                                            userInfo={this.props.Login.userInfo}
                                                                            methodUrl="UserRoleAndUsers"
                                                                            deleteRecord={this.delete_Record}
                                                                            deleteParam={{ operation: "delete", screenName: "IDS_THIRDPARTYUSERMAPPING", ncontrolcode: deleteIdChild }}
                                                                            pageable={true}
                                                                            scrollable={"scrollable"}
                                                                            isToolBarRequired={false}
                                                                            selectedId={this.props.Login.selectedId}
                                                                            hideColumnFilter={false}
                                                                            groupable={false}
                                                                            isActionRequired={true}
                                                                            gridHeight={"550px"}
                                                                        />
                                                                    </Col>
                                                                </Row>

                                                            </>
                                                            : "" : ""}
                                                    </Card>
                                                </ContentPanel> : ""
                                            }
                                         </SplitterPane>
                                    </Splitter>
                                {/* </SplitterLayout> */}
                            </ListWrapper>
                            {(this.props.Login.openModal || this.props.Login.openChildModal) ?
                                <SlideOutModal
                                    show={(this.props.Login.openModal || this.props.Login.openChildModal)}
                                    closeModal={this.closeModal}
                                    operation={this.props.Login.operation}
                                    inputParam={this.props.Login.inputParam}
                                    screenName={this.props.Login.screenName}
                                    esign={this.props.Login.loadEsign}
                                    onSaveClick={this.props.Login.loadthirdpartyusermapingcombo === false ? this.onSaveClick : this.onSaveUserClick}
                                    validateEsign={this.validateEsign}
                                    masterStatus={this.props.Login.masterStatus}
                                    updateStore={this.props.updateStore}
                                    mandatoryFields={this.props.Login.loadthirdpartyusermapingcombo === false ? mandatoryFields || [] : childmandatoryFields}
                                    selectedRecord={this.props.Login.loadSiteBioBankConfig ? this.state.selectedRecord || {} :
                                        this.props.Login.loadEsign ? {
                                            ...this.state.selectedMasterRecord,
                                            'esignpassword': this.state.selectedRecord['esignpassword'],
                                            'esigncomments': this.state.selectedRecord['esigncomments'],
                                            'esignreason': this.state.selectedRecord['esignreason']
                                        } : this.state.selectedMasterRecord || {}}
                                    showSaveContinue={this.state.showSaveContinue}
                                    addComponent={this.props.Login.loadEsign ?
                                        <Esign operation={this.props.Login.operation}
                                            onInputOnChange={this.onInputOnChange}
                                            inputParam={this.props.Login.inputParam}
                                            selectedRecord={this.state.selectedRecord || {}}
                                        />
                                        : this.props.Login.loadSiteBioBankConfig ?
                                            <ThirdPartyConfig
                                                selectedRecord={this.state.selectedRecord || {}}
                                                userRoleList={this.props.Login.userRoleList || {}}
                                                userList={this.props.Login.userList}
                                                loadthirdpartyusermapingcombo={this.props.Login.loadthirdpartyusermapingcombo}
                                                onInputOnChange={this.onInputOnChange}
                                                onComboChange={this.onComboChange}
                                            /> : ""}

                                /> : ""}
                        </Col>
                    </Row>
                </ListWrapper>
            </>
        );
    }
    ConfirmDelete = (deleteId, record) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteRecord("delete", deleteId, record));
    }

    //added by sujatha ATE_274 BGSI-185 for the toggle change getting flag for delete users & alert when Edit save  
    ConfirmToggleChange = (inputParam) => {
        this.confirmMessage.confirm(
            "confirmMessage",
            this.props.intl.formatMessage({ id: "IDS_CONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_NISNGSTOGGLEWARNING" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }),
            this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.setToggleFlag("changed", inputParam),
            () => this.setToggleFlag("unchanged", inputParam)
        );
    }
    //added by sujatha ATE_274 BGSI-185 if yes means calls crudmaster with updated nisngsConfirmed flag for delete validation
    setToggleFlag = (status, inputParam) => {
        const flagValue = status === "changed";
        inputParam.inputData.nisngsConfirmed = flagValue;
        const masterData = this.props.Login.masterData;
        if (
            showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    };

    deleteRecord = (operation, deleteId, record) => {
        let inputData = {
            thirdpartyusermapping: record.mastertodelete,
            userinfo: record.userInfo,

        };

        const inputParamUserInfo = { userinfo: this.props.Login.userInfo };

        let inputParam = {
            operation: operation,
            ncontrolcode: deleteId,
            userInfo: this.props.Login.userInfo,
            masterData: this.props.Login.masterData,
            inputData: inputData,
            methodUrl: "ThirdPartyUserMapping",
            classUrl: "thirdpartyusermapping",
            postParam: {
                selectedObject: "ThirdPartyRecord", primaryKeyField: "nthirdpartycode", // Added by Gowtham on nov 20 2025 for jira.id:BGSI-226
                primaryKeyValue: this.props.Login.masterData.selectedThirdPartyMasterRecord.nthirdpartycode, fetchUrl: "thirdpartyusermapping/getThirdPartySelectedRecord",
                  fecthInputObject: inputParamUserInfo
            }
        };

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteId)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: "IDS_THIRDPARTYHOSPITALMAPPING", operation: "delete",
                    loadSiteBioBankConfig: true,openChildModal:false,
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }

    onSaveClick = (saveType, formRef) => {
        //added by sujatha ATE_247 BGSI-178
        const { nisngsConfirmed } = this.state;
        if (this.state.selectedRecord['semail'] ? validateEmail(this.state.selectedRecord['semail']) : true) {
            let inputData = [];
            let selectedRecord = this.state.selectedRecord;
            inputData["userinfo"] = this.props.Login.userInfo;
            let postParam ;
            let inputParam;
            if (selectedRecord !== undefined) {

                inputData["thirdpartyusermapping"] = {
                    "nthirdpartycode": selectedRecord.nthirdpartycode,
                    "sthirdpartyname": selectedRecord.sthirdpartyname,
                    "saddress": selectedRecord.saddress,
                    "sphonenumber": selectedRecord.sphonenumber,
                    "semail": selectedRecord.semail,
                    "sdescription": selectedRecord.sdescription,
                    "nisngs": selectedRecord.nisngs ? selectedRecord.nisngs : 4
                };
            }
                    const inputParamUserInfo = { userinfo: this.props.Login.userInfo };

                 if(this.props.Login.operation === "update") 
                    {  
             inputParam = {
                classUrl: "thirdpartyusermapping",
                methodUrl: "ThirdPartyUserMapping",
                inputData: { ...inputData, "nisngsConfirmed": nisngsConfirmed },
                operation: this.props.Login.operation,
                saveType, formRef, postParam, searchRef: this.searchRef,
                selectedRecord: { ...this.state.selectedRecord },
   
                //jira-bgsi-233 ATE Mullai Balaji 
                postParam: {
                selectedObject: "selectedThirdPartyMasterRecord", primaryKeyField: "nthirdpartycode",
                primaryKeyValue: this.props.Login.masterData.selectedThirdPartyMasterRecord.nthirdpartycode, fetchUrl: "thirdpartyusermapping/getThirdPartySelectedRecord"
                , fecthInputObject: inputParamUserInfo,inputListName: "ThirdPartyRecord"
            }
            }
        }
        else
        {
         inputParam = {
                classUrl: "thirdpartyusermapping",
                methodUrl: "ThirdPartyUserMapping",
                inputData: { ...inputData, "nisngsConfirmed": nisngsConfirmed },
                operation: this.props.Login.operation,
                saveType, formRef, postParam, searchRef: this.searchRef,
                selectedRecord: { ...this.state.selectedRecord },
         }
    
    }
            const masterData = this.props.Login.masterData;
  
            
               

            //added by sujatha ATE_274 BGSI-185 for getting alert if the users exists and try to save after updating the toggle
            if (this.props.Login.operation == "update" && this.state.selectedRecord?.nisngs !== this.props.Login.masterData.selectedThirdPartyMasterRecord?.nisngs) {
                const existingUsers = this.props.Login.masterData.lstThirdPartyMapping || [];
                if (existingUsers.length > 0) {
                    this.ConfirmToggleChange(inputParam, masterData);
                    return;
                } else {
                    this.setState({ nisngsConfirmed: false });
                }
            }

          //  if (this.props.Login.operation == "update" && 
              if(  showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode )) {
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

        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTERVALIDEMAIL" }));
        }
    }

    onSaveUserClick = (saveType, formRef) => {
        let inputData = [];
        let selectedRecord = this.state.selectedRecord;

        if (selectedRecord !== undefined) {

            inputData = {
                "userinfo": this.props.Login.userInfo,
                "nthirdpartycode": this.props.Login.masterData.selectedThirdPartyMasterRecord.nthirdpartycode,
                "nuserrolecode": selectedRecord.nuserrolecode && selectedRecord.nuserrolecode.value,
                "nusercode": selectedRecord.nusercode.map(function (el) { return el.value; }).join(",") || null,
            };
        }

        const inputParam = {
            classUrl: "thirdpartyusermapping",
            methodUrl: "UserRole",
            inputData: inputData,
            operation: 'create',
            saveType, formRef, searchRef: this.searchRef,
            selectedRecord: { ...this.state.selectedRecord }

        }
        const masterData = this.props.Login.masterData;

        this.props.crudMaster(inputParam, masterData, "openChildModal");

    }

    addModal = () => {

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal: true,
                loadthirdpartyusermapingcombo: false,
                screenName: "IDS_THIRDPARTYUSERMAPPING",
                operation: 'create',
                loadSiteBioBankConfig: true,
                selectedRecord: null,
                ncontrolcode:this.addID

            }
        }

        this.props.updateStore(updateInfo);
    }


    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let openChildModal = this.props.Login.openChildModal;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                openChildModal = false;
                selectedRecord = {};
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
            openChildModal = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, openChildModal, selectedId: null }
        }
        this.props.updateStore(updateInfo);

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

        const openModal = this.props.Login.openChildModal ? "openChildModal" : "openModal";

        this.props.validateEsignCredential(inputParam, openModal, this.confirmMessage);

        //this.props.validateEsignCredential(inputParam, "openModal", this.confirmMessage);
    }
    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};

        if (event.target.name === "sphonenumber") {
            if (event.target.value !== "") {
                event.target.value = validatePhoneNumber(event.target.value);
                selectedRecord[event.target.name] = event.target.value !== "" ? event.target.value : selectedRecord[event.target.name];
            } else {
                selectedRecord[event.target.name] = event.target.value;
            }
        } else if (event.target.name === "agree" || event.target.name === "nisngs") {
            selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }

        this.setState({ selectedRecord });
    }

    onComboChange = (comboData, fieldName, caseNo) => {
        const selectedRecord = this.state.selectedRecord || {};
        switch (caseNo) {
            case 1:
                if (comboData !== null) {
                    if (fieldName === "nuserrolecode") {
                        const oldRoleCode = selectedRecord.nuserrolecode?.value;

                        if (oldRoleCode && parseInt(comboData.value) !== parseInt(oldRoleCode)) {
                            delete selectedRecord.nusercode;
                        }

                        selectedRecord[fieldName] = comboData;

                        this.props.getuserThirdParty({
                            inputData: {
                                userinfo: this.props.Login.userInfo,
                                primarykey: comboData.value,
                                selectedThirdPartyMasterRecord: this.props.Login.masterData.selectedThirdPartyMasterRecord
                            }
                        }, selectedRecord);
                    }
                    break;
                }
            case 3:
                selectedRecord[fieldName] = comboData;
                this.setState({ selectedRecord });
                break;
            default:
                break;
        }
    }

    delete_Record = (deleteParam) => {
        let inputData = [];
        let inputParam = {};

        inputData = {
            "nuserrolecode": deleteParam.selectedRecord.nuserrolecode,
            "nusercode": deleteParam.selectedRecord.nusercode,
            "nthirdpartycode": deleteParam.selectedRecord.nthirdpartycode,
            "nthirdpartyusermappingcode": deleteParam.selectedRecord.nthirdpartyusermappingcode,
            "susername": deleteParam.selectedRecord.susername,
            "suserrolename": deleteParam.selectedRecord.suserrolename
        };
        this.setState({ selectedRecord: inputData });
        inputData["userinfo"] = this.props.Login.userInfo;
        const inputParamUserInfo = { userinfo: this.props.Login.userInfo };
        inputParam = {
            classUrl: "thirdpartyusermapping",
            methodUrl: "UserRoleAndUser",
            inputData: inputData,
            operation: "delete",
            dataState: this.state.dataState,
            isChild: "true",
    //jira-bgsi-233 ATE Mullai Balaji 
            postParam: {
                selectedObject: "selectedThirdPartyMasterRecord", primaryKeyField: "nthirdpartycode",
                primaryKeyValue: this.props.Login.masterData.selectedThirdPartyMasterRecord.nthirdpartycode, fetchUrl: "thirdpartyusermapping/getThirdPartySelectedRecord"
                , fecthInputObject: inputParamUserInfo
            }
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolcode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: false, screenName: "IDS_THIRDPARTYHOSPITALMAPPING", operation: "delete",
                    loadSiteBioBankConfig: false,openChildModal:true
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openChildModal");
        }
    }

    componentDidUpdate(previousProps) {

        let updateState = false;
        let { selectedRecord, skip, take, datastateparent, dataresultparent, nisngsConfirmed } = this.state

        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            updateState = true;
            selectedRecord = this.props.Login.selectedRecord;
        }
        //added by sujatha ATE_274 for updating the nisngsConfirmed flag for delete validation of users
        if (nisngsConfirmed !== this.props.Login.nisngsConfirmed) {
            this.setState({ nisngsConfirmed: this.props.Login.nisngsConfirmed })
        }
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            const userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }

            const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            let dataState;
            if (this.props.Login.dataState === undefined) {
                dataState = { skip: 0, take: this.state.take }
            }
            this.setState({
                userRoleControlRights, controlMap, data: this.props.Login.masterData.ControlRights, dataState
            });
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }



        if (this.props.Login.masterData.selectedThirdPartyMasterRecord !== undefined &&
            this.props.Login.masterData.selectedThirdPartyMasterRecord !== previousProps.Login.masterData.selectedThirdPartyMasterRecord
        ) {
            updateState = true;

            if (this.props.Login.masterData.selectedThirdPartyMasterRecord !== undefined && previousProps.Login.masterData.selectedThirdPartyMasterRecord !== undefined &&
                this.props.Login.masterData.selectedThirdPartyMasterRecord?.nthirdpartycode !==
                previousProps.Login.masterData.selectedThirdPartyMasterRecord?.nthirdpartycode) {

                skip = this.state.skip; take = this.state.take;
            } else {
                skip = 0; take = this.state.take;

            }

        }


        if (this.props.Login.masterData.searchedData !== undefined) {
            skip = 0; take = this.state.take;
        }
        if (this.props.Login.masterData.lstThirdPartyMapping !== undefined &&
            this.props.Login.masterData.lstThirdPartyMapping !== previousProps.Login.masterData.lstThirdPartyMapping) {
            let { dataState } = this.state;

            if (!this.props.Login.dataState) {
                dataState = { skip: 0, take: this.state.dataState.take };
            }

            if (
                this.state.dataResult.data &&
                this.state.dataResult.data.length === 1 &&
                this.props.Login.operation === 'delete'
            ) {
                const totalItems = this.props.Login.masterData.lstThirdPartyMapping?.length || 0;
                const take = this.state.dataState.take;

                const skip = this.state.dataState.skip >= take
                    ? this.state.dataState.skip - take
                    : 0;

                dataState = { skip, take };
            }

            this.setState({
                data: this.props.Login.masterData.lstThirdPartyMapping || [],
                selectedRecord: this.props.Login.selectedRecord,
                dataResult: process(this.props.Login.masterData.lstThirdPartyMapping || [], dataState),
                dataState
            });

        }

        if (updateState) {
            this.setState({
                selectedRecord, skip, take, datastateparent, dataresultparent
            })
        }

    }


}
const mapStateToProps = state => {
    return ({ Login: state.Login })
}


export default connect(mapStateToProps, {
    callService, addGetUsers,
    addGetUserRole,
    updateStore,
    crudMaster,
    editEditThirdPartyUserMapping,
    updateThirdPartyUserMapping, getuserThirdParty, getThirdPartySelectedRecord, validateEsignCredential, validatePhoneNumber, filterTransactionList
})(injectIntl(ThirdPartyUserMapping));