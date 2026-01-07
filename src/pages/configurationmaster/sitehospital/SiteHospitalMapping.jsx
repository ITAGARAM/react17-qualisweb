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
import { Row, Col, Button, Card, Nav } from 'react-bootstrap';//Nav, Card, Button
import { ContentPanel, ProductList } from '../../product/product.styled';
import { getControlMap, showEsign, replaceUpdatedObject } from '../../../components/CommonScript';//showEsign, getControlMap,
import { ReactComponent as RefreshIcon } from '../../../assets/image/refresh.svg';
import { ListWrapper } from '../../userroletemplate/userroletemplate.styles';
import { callService, updateStore, crudMaster, validateEsignCredential, addSiteAndBioBank, addHospitalMaster, getSiteHospitalMappingRecord, filterTransactionList } from '../../../actions';
import SiteBioBankConfig from './SiteBioBankConfig';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import Esign from '../../audittrail/Esign';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import { process } from '@progress/kendo-data-query';




class SiteHospitalMapping extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5
        };
        this.searchFieldList = ["ssitename", "ssitecode", "ssitetypename"]
        this.state = {

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
            
        };
        this.searchRef = React.createRef();
        //this.ConfirmMessage = new ConfirmMessage();
    }

      //Added by L.Subashini on 20/12/2025 for Splitter issue with React Version Upgrade to 17
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
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "SiteHospitalMapping",
            userInfo: this.props.Login.userInfo,
            displayName: this.props.Login.displayName,
            issitehospitalrecord:false,

        };
        this.searchRef.current.value = "";
        this.props.Login.issitehospitalrecord=false;

        this.props.callService(inputParam);
    }
    //Ate234 Janakuamr ALPDJ21-25 Flow Testing Bugs - Site Hospital Mapping

    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };


    // onFilterSubmit = () => {
    //     if (this.state.selectedRecord && this.state.selectedRecord["nprojecttypecode"]) {
    //         this.searchRef.current.value = "";
    //         let masterData = { ...this.props.Login.masterData }

    //         let inputData = {
    //             nprojecttypecode: this.state.selectedRecord["nprojecttypecode"] ? this.state.selectedRecord["nprojecttypecode"].value : -1,
    //             userinfo: this.props.Login.userInfo,
    //             //postParamList: this.filterParam,
    //         }
    //         let inputParam = {
    //             masterData, inputData, searchRef: this.searchRef
    //         }
    //         this.props.getFilterProjectType(inputParam)
    //     } else {
    //         toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTFILTER" }));
    //     }
    // }

    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, operation: null, modalName: undefined
            }
        }
        this.props.updateStore(updateInfo);
    }

    render() {
        const addID = this.state.controlMap.has("AddSiteHospitalMapping") && this.state.controlMap.get("AddSiteHospitalMapping").ncontrolcode;
        const editId = this.state.controlMap.has("EditSiteHospitalMapping") && this.state.controlMap.get("EditSiteHospitalMapping").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteSiteHospitalMapping") && this.state.controlMap.get("DeleteSiteHospitalMapping").ncontrolcode;

        this.extractedColumnList = [
            { "idsName": "IDS_HOSPITALNAME", "dataField": "shospitalname", "width": "250px", "componentName": "date" },
        ]

        //Ate234 Janakuamr ALPDJ21-25 Flow Testing Bugs - Site Hospital Mapping
        const filterParam = {
            inputListName: "siteMasterRecord", selectedObject: "selectedsiteMasterRecord", primaryKeyField: "nmappingsitecode",
            fetchUrl: "sitehospitalmapping/getSiteHospitalMappingRecord", masterData: this.props.Login.masterData || {},

            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
                nmappingsitecode: this.props.Login.masterData.siteMasterRecord &&
                    this.props.Login.masterData.siteMasterRecord.nmappingsitecode,

            },
            filteredListName: "selectedsiteMasterRecord",
            clearFilter: "no",
            updatedListname: "selectedsiteMasterRecord",
            searchRef: this.searchRef,
            searchFieldList: this.searchFieldList,
            changeList: [], isSortable: true, sortList: 'selectedsiteMasterRecord'
        };


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
                                                masterList={this.props.Login.masterData.searchedData || (this.state.siteMasterRecord && this.state.siteMasterRecord !== undefined ? this.state.siteMasterRecord : (this.props.Login.masterData && this.props.Login.masterData.siteMasterRecord ? this.props.Login.masterData.siteMasterRecord : []))}
                                                selectedMaster={[this.props.Login.masterData.selectedsiteMasterRecord === undefined ? this.state.selectedsiteMasterRecord : this.props.Login.masterData.selectedsiteMasterRecord] || []}
                                                primaryKeyField="nmappingsitecode"
                                                getMasterDetail={
                                                    (vieweditSiteSample) => this.props.getSiteHospitalMappingRecord(vieweditSiteSample, this.props.Login.userInfo, this.props.Login.masterData)
                                                }
                                                // actionIcons={
                                                //     [
                                                //         {
                                                //             title: this.props.intl.formatMessage({ id: "IDS_EDIT" }),
                                                //             controlname: "mapping",
                                                //             objectName: "mastertoedit",
                                                //             hidden: this.state.userRoleControlRights.indexOf(editId) === -1,
                                                //             onClick: (vieweditSiteHospitals) => this.editSiteHospital(vieweditSiteHospitals),
                                                //             inputData: {
                                                //                 primaryKeyName: "nsitehospitalmappingcode",
                                                //                 operation: "update",
                                                //                 ncontrolCode: editId,
                                                //                 masterData: this.props.Login.masterData.siteMasterRecord,
                                                //                 userInfo: this.props.Login.userInfo,
                                                //             },
                                                //         }
                                                //     ]
                                                // }
                                                filterParam={filterParam}
                                                subFieldsLabel={false}
                                                additionalParam={['']}
                                                mainField={'ssitename'}
                                                filterColumnData={this.props.filterTransactionList}
                                                showFilter={this.props.Login.showFilter}
                                                openFilter={this.openFilter}
                                                closeFilter={this.closeFilter}
                                                onFilterSubmit={this.onFilterSubmit}
                                                statusField="nmappingsitecode"
                                                statusColor="#999"
                                                // statusFieldName="ssitecode"
                                                // secondaryField="ssitetypename"
                                                // showStatusName={true}
                                                // Commented and Added subFields prop by Gowtham
                                                subFields={[{
                                                    2: "ssitecode"
                                                },{
                                                    2: "ssitetypename"
                                                }]}
                                                showStatusIcon={false}
                                                showStatusLink={true}
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
                                            <ContentPanel className="panel-main-content">
                                                <Card>
                                                    <Card.Header style={{ marginBottom: '30px' }}>
                                                        <Row>
                                                            <Card.Title>
                                                                <Card.Subtitle >
                                                                    <Col md={16} >
                                                                    </Col>
                                                                </Card.Subtitle>
                                                            </Card.Title>
                                                        </Row>
                                                    </Card.Header>

                                                    {this.props.Login.masterData.selectedsiteMasterRecord ? Object.entries(this.props.Login.masterData.selectedsiteMasterRecord).length > 0 ?
                                                        <>


                                                            <Row noGutters={true}>
                                                                <Col md={8}></Col>
                                                                <Col md={4}>
                                                                    <div className="actions-stripe">
                                                                        <div className="d-flex justify-content-end">
                                                                            <Nav.Link className="add-txt-btn text-right"

                                                                                onClick={() => this.props.addHospitalMaster(this.props.Login.userInfo
                                                                                    , this.props.Login.masterData.selectedsiteMasterRecord, addID)}
                                                                                hidden={this.state.userRoleControlRights.indexOf(addID) === -1} >
                                                                                <FontAwesomeIcon icon={faPlus} /> { }
                                                                                <FormattedMessage id='IDS_HOSPITAL' defaultMessage='Hospital' />
                                                                            </Nav.Link>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                                <Col md={12}>
                                                                    <DataGrid
                                                                        primaryKeyField={"nhospitalcode"}
                                                                        dataResult={this.state.dataResult === undefined ? process(this.props.Login.masterData.lsthospitalQuery ? this.props.Login.masterData.lsthospitalQuery : [], this.state.dataState) || [] : this.state.dataResult}
                                                                        dataState={this.state.dataState === undefined ? this.state.dataState : this.state.dataState || []}
                                                                        data={this.state.data === undefined ? this.props.Login.masterData.lsthospitalQuery || [] : this.state.data}
                                                                        dataStateChange={this.dataStateChange}
                                                                        extractedColumnList={this.extractedColumnList}
                                                                        controlMap={this.state.controlMap}
                                                                        userRoleControlRights={this.state.userRoleControlRights}
                                                                        inputParam={this.props.Login.inputParam}
                                                                        userInfo={this.props.Login.userInfo}
                                                                        methodUrl="Hospital"
                                                                        deleteRecord={this.deleteRecord}
                                                                        deleteParam={{ operation: "delete", screenName: "IDS_SITEHOSPITALMAPPING", ncontrolCode: deleteId }}
                                                                        pageable={true}
                                                                        scrollable={"scrollable"}
                                                                        isToolBarRequired={false}
                                                                        selectedId={this.props.Login.selectedId}
                                                                        hideColumnFilter={false}
                                                                        groupable={false}
                                                                        isActionRequired={true}
                                                                        gridHeight={'550px'}
                                                                    />
                                                                </Col>
                                                            </Row>



                                                        </>
                                                        : "" : ""}
                                                </Card>
                                            </ContentPanel>
                                        </SplitterPane>
                                    </Splitter>

                                {/* </SplitterLayout> */}

                            </ListWrapper>
                        </Col>
                    </Row>
                </ListWrapper>

                {(this.props.Login.openModal || this.props.Login.openChildModal) ?
                    <SlideOutModal
                        show={(this.props.Login.openModal || this.props.Login.openChildModal)}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.loadhospitalcombo === false ? "IDS_ADDSITEDETAILS" : "IDS_ADDHOSPITAL"}
                        esign={this.props.Login.loadEsign}
                        onSaveClick={this.props.Login.loadhospitalcombo === false ? this.onSaveClick : this.onSaveHospitalClick}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        //mandatoryFields={this.props.Login.loadBulkBarcodeConfig ? mandatoryFields : mandatoryBarcodeMasterFields}
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
                                <SiteBioBankConfig
                                    selectedRecord={this.state.selectedRecord || {}}
                                    bioBankList={this.props.Login.bioBankList || {}}
                                    loadhospitalcombo={this.props.Login.loadhospitalcombo}
                                    hospitalList={this.props.Login.hospitalList || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onComboChange={this.onComboChange}
                                />
                                : ""}
                    /> : ""}

            </>

        );

    }



    deleteRecord = (deleteParam) => {
        let inputData = [];
        let inputParam = {};
		//added by sujatha BGSI-232
        let postParam = undefined;
        postParam = {
            // inputListName: "siteMasterRecord",
            selectedObject: "selectedsiteMasterRecord",
            primaryKeyField: "nmappingsitecode",
            primaryKeyValue: this.props.Login.selectedRecord.nmappingsitecode,
            fetchUrl: "sitehospitalmapping/getSiteHospitalMappingRecord",
            fecthInputObject: {
                userinfo: this.props.Login.userInfo
            }
        };

        inputData = {
            "nhospitalcode": deleteParam.selectedRecord.nhospitalcode,
            "nmappingsitecode": deleteParam.selectedRecord.nmappingsitecode,
            "nsitehospitalmappingcode": deleteParam.selectedRecord.nsitehospitalmappingcode,
            "shospitalname": deleteParam.selectedRecord.shospitalname,
        };
        this.setState({ selectedRecord: inputData });
        inputData["userinfo"] = this.props.Login.userInfo;
        inputParam = {
            classUrl: "sitehospitalmapping",
            methodUrl: "HospitalMaster",
            inputData: inputData,
            operation: "delete",
            dataState: this.state.dataState,
		  //added by sujatha BGSI-232
            postParam,
            isChild: true,
        }


        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                // data: {
                //     loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                //     loadBarcodeMaster: true, screenName: "SiteHospitalMapping", operation: "delete"
                // }
			// modified by sujatha BGSI-232
                data: {
                    loadEsign: true, openModal: false, openChildModal: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    loadBarcodeMaster: true, screenName: "SiteHospitalMapping", operation: "delete", saveType: 3
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openChildModal");
        }

    }

    onSaveClick = (saveType, formRef) => {
        let inputData = [];
        let selectedRecord = this.state.selectedRecord;
        inputData["userinfo"] = this.props.Login.userInfo;
        let postParam = undefined;
        if (selectedRecord !== undefined) {

            inputData["SiteHospitalMapping"] = {
                "nmappingsitecode": selectedRecord.nmappingsitecode,
                "ssitecode": selectedRecord.ssitecode,
                "sdescription": selectedRecord.sdescription,
                "ssitetypename": selectedRecord.sbiobanktypename.label,
                "nsitetypecode": selectedRecord.sbiobanktypename.value,
                "ssitename": selectedRecord.ssitename

            };

        }

        const inputParam = {
            classUrl: "sitehospitalmapping",
            methodUrl: "SiteAndBioBank",
            inputData: inputData,
            operation: 'create',
            issitehospitalrecord:false,
            saveType, formRef, postParam, searchRef: this.searchRef,
            selectedRecord: { ...this.state.selectedRecord }

        }
        const masterData = this.props.Login.masterData;

        if (
            showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
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

    onSaveHospitalClick = (saveType, formRef) => {
        let inputData = [];
        let selectedRecord = this.state.selectedRecord;
        let postParam = undefined;

        if (selectedRecord.shospitalname !== undefined && selectedRecord.shospitalname.length > 0) {
            if (selectedRecord !== undefined) {

                inputData = {
                    "userinfo": this.props.Login.userInfo,
                    "nmappingsitecode": this.props.Login.masterData.selectedsiteMasterRecord.nmappingsitecode,
                    "nhospitalcode": selectedRecord.shospitalname.map(function (el) { return el.value; }).join(",") || null,
                };
            }
            postParam = {
                inputListName: "siteMasterRecord",
                selectedObject: "selectedsiteMasterRecord",
                primaryKeyField: "nmappingsitecode"
            };

            const inputParam = {
                classUrl: "sitehospitalmapping",
                methodUrl: "HospitalMaster",
                inputData: inputData,
                operation: 'create',
                issitehospitalrecord: true,
                saveType, formRef, searchRef: this.searchRef, postParam,
                selectedRecord: { ...this.state.selectedRecord }

            }
            const masterData = this.props.Login.masterData;

            if (
                showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData }, saveType
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openChildModal");
            }
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTHOSPITALNAME" }));

        }
    }




    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let openChildModal = this.props.Login.openChildModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let loadSiteBioBankConfig = this.props.Login.loadSiteBioBankConfig;
        let loadhospitalcombo = this.props.Login.loadhospitalcombo;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                openChildModal = false;
                loadSiteBioBankConfig = false;
                loadhospitalcombo = false;
                selectedRecord = {};

            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = undefined;
                selectedRecord['esigncomments'] = undefined;
                selectedRecord['esignreason'] = undefined;

            }
        }
        else {
            openModal = false;
            openChildModal = false;
            loadSiteBioBankConfig = false;
            loadhospitalcombo = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal, loadEsign, selectedRecord: selectedRecord,
                selectedId: null, loadSiteBioBankConfig, openChildModal, loadhospitalcombo
            }
        }
        this.props.updateStore(updateInfo);

    }

    editSiteHospital(inputParam) {
        this.props.addSiteAndBioBank(
            inputParam.mastertoedit,
            inputParam.userInfo,
            inputParam.ncontrolCode
        )
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
            // screenStateData: {selected:{...this.state.selectedRecord}, masterData:{ ...this.props.Login.masterData}},
        }
		//added & modified by sujatha BGSI-232
        const openModal=this.props.Login.operation  ==='delete'? "openChildModal" : "openModal"
        this.props.validateEsignCredential(inputParam, openModal, this.confirmMessage);
    }

    onInputOnChange = (event, item, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        let value = event.target.value;

        if (value !== "") {
            if (fieldName === "ssitecode") {
                const isAlphabet = /^[A-Z]{1,2}$/.test(value);
                if (isAlphabet === true) {
                    selectedRecord[event.target.name] = event.target.value;
                } else {
                    selectedRecord[event.target.name] = "";
                }
            } else {
                selectedRecord[event.target.name] = event.target.value;
            }

        } else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        //Ate234 Janakuamr ALPDJ21-25 Flow Testing Bugs - Site Hospital Mapping

        if (comboData !== null) {
            selectedRecord[fieldName] = comboData;
        } else {
            selectedRecord[fieldName] = [];
        }
        this.setState({ selectedRecord });


    }

    componentDidUpdate(previousProps) {
        //Ate234 Janakuamr ALPDJ21-25 Flow Testing Bugs - Site Hospital Mapping

        let updateState = false;
        let { selectedRecord, dataStateAll, skip, take, siteList } = this.state

        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            updateState = true;
            selectedRecord = this.props.Login.selectedRecord;
        }
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            const userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }

            const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            let dataState;
            if (this.props.Login.dataState === undefined) {//Gtm
                dataState = { skip: 0, take: this.state.take }
            }
            this.setState({
                userRoleControlRights, controlMap, data: this.props.Login.masterData.ControlRights, dataState
            });
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }

        //Ate234 Janakuamr ALPDJ21-25 Flow Testing Bugs - Site Hospital Mapping
        if (this.props.Login.masterData.selectedsiteMasterRecord !== undefined && this.props.Login.masterData.selectedsiteMasterRecord !== previousProps.Login.masterData.selectedsiteMasterRecord) {
            let selectedsiteMasterRecord = this.props.Login.masterData.selectedsiteMasterRecord;
            if (this.props.Login.masterData.selectedsiteMasterRecord !== undefined && previousProps.Login.masterData.selectedsiteMasterRecord !== undefined &&
                this.props.Login.masterData.selectedsiteMasterRecord.nmappingsitecode !== previousProps.Login.masterData.selectedsiteMasterRecord.nmappingsitecode) {

                skip = this.state.skip; take = this.state.take;
            } else {
                if (this.props.Login.issitehospitalrecord === true) {
                    skip = this.state.skip; take = this.state.take;
                } else {
                    skip = 0; take = this.state.take;
                }

            }
            updateState = true;
            this.setState({ selectedsiteMasterRecord: selectedsiteMasterRecord, siteMasterRecord: replaceUpdatedObject([this.props.Login.masterData.selectedsiteMasterRecord], this.props.Login.masterData.siteMasterRecord, "nmappingsitecode") });
        }
        if (this.props.Login.masterData.searchedData !== undefined) {
            skip = 0; take = this.state.take;
        }

        if (this.props.Login.masterData.lsthospitalQuery !== undefined && this.props.Login.masterData.lsthospitalQuery !== previousProps.Login.masterData.lsthospitalQuery) {
            let { dataState } = this.state;

            // Initialize dataState if undefined
            if (!this.props.Login.dataState) {
                dataState = { skip: 0, take: this.state.dataState.take };
            }

            // Handle case where last item on the current page is deleted
            if (
                this.state.dataResult.data &&
                this.state.dataResult.data.length === 1 &&
                this.props.Login.operation === 'delete'
            ) {
                const totalItems = this.props.Login.masterData.lsthospitalQuery?.length || 0;
                const take = this.state.dataState.take;

                // Go to previous page if we're now past the end
                const skip = this.state.dataState.skip >= take
                    ? this.state.dataState.skip - take
                    : 0;

                dataState = { skip, take };
            }

            // Set state with updated data and pagination
            this.setState({
                data: this.props.Login.masterData.lsthospitalQuery || [],
                selectedRecord: this.props.Login.selectedRecord,
                dataResult: process(this.props.Login.masterData.lsthospitalQuery || [], dataState),
                dataState
            });

        }



        if (updateState) {
            this.setState({
                selectedRecord, dataStateAll, skip, take, siteList
            })
        }

    }
    //Ate234 Janakuamr ALPDJ21-25 Flow Testing Bugs - Site Hospital Mapping

}

const mapStateToProps = state => {
    return ({ Login: state.Login })
}
export default connect(mapStateToProps, {
    updateStore, callService, crudMaster, validateEsignCredential, addSiteAndBioBank, addHospitalMaster, getSiteHospitalMappingRecord, filterTransactionList
})(injectIntl(SiteHospitalMapping));