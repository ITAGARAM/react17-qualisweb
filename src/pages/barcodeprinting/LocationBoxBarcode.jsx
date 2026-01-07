import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col, Card, Nav, Button } from 'react-bootstrap';
import { process } from '@progress/kendo-data-query';
import { toast } from 'react-toastify';
import DataGrid from '../../components/data-grid/data-grid.component';
import { ListWrapper, PrimaryHeader } from '../../components/client-group.styles';
import { callService, updateStore, crudMaster, getBarcodePrinter, getLocationBoxBarcodedata,printBarcodes } from '../../actions';
import { constructOptionList, getControlMap, showEsign } from '../../components/CommonScript';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { getStartOfDay, getEndOfDay, convertDateValuetoString, rearrangeDateFormat } from '../../components/CommonScript';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import DataGridWithSelection from '../../components/data-grid/DataGridWithSelection';
import { faAddressBook } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormInput from '../../components/form-input/form-input.component';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';
import AlertModal from '../dynamicpreregdesign/AlertModal';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { transactionStatus } from '../../components/Enumeration';



const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class LocationBoxBarcode extends React.Component {

    constructor(props) {
        super(props)
        this.formRef = React.createRef();
        this.extractedColumnList = [];


        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };

        this.state = {
            data: [], masterStatus: "", error: "", selectedRecord: {},
            dataResult: [],
            dataState: dataState,
            isOpen: false,
            userRoleControlRights: [],
            controlMap: new Map()
        };
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

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let dataState = {...this.state.dataState};
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            } else {
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
            }
        } else {
            openModal = false;
            selectedRecord = {};
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord,dataState }
        }
        this.props.updateStore(updateInfo);
    }

    render() {

        const printLocationBoxBarcode = this.state.controlMap.has("PrintLocationBoxBarcode") && this.state.controlMap.get("PrintLocationBoxBarcode").ncontrolcode;
      let extractedColumnList = []
        extractedColumnList.push({ "idsName": "IDS_PARENTSAMPLECODE", "dataField": "sparentsamplecode", "width": "150px" })
         if (this.state?.selectedBarcodeFilterType?.nbarcodefiltertypecode?.item?.nneedformnumber === transactionStatus.YES) {
            extractedColumnList.push({ idsName: "IDS_FORMNUMBER", dataField: "sformnumber", width: "200px" })
        }
        extractedColumnList.push({ idsName: "IDS_BIOREPOSITORYID", dataField: "srepositoryid", width: "200px" })
        extractedColumnList.push({ "idsName": "IDS_BIOSAMPLETYPE", "dataField": "sproductname", "width": "200px" })
        extractedColumnList.push({ "idsName": "IDS_LOCATIONCODE", "dataField": "slocationcode", "width": "200px" })
        return (
            <>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">
                            <PrimaryHeader className="d-flex justify-content-between mb-3">
                            </PrimaryHeader>

                            <Row>
                                <Col md={3}>
                                    <FormSelectSearch
                                        formLabel={this.props.intl.formatMessage({ id: "Filter" })}
                                        placeholder={this.props.intl.formatMessage({ id: "Filter" })}
                                        name="nbarcodefiltertypecode"
                                        optionId="nbarcodefiltertypecode"
                                        optionValue="sdisplaystatus"
                                        className='form-control'
                                        options={this.state.barcodeFilterTypeList}
                                        value={this.state?.selectedBarcodeFilterType?.nbarcodefiltertypecode || []}
                                        isMandatory={true}
                                        isMulti={false}
                                        isSearchable={false}
                                        isDisabled={false}
                                        alphabeticalSort={false}
                                        isClearable={false}
                                        onChange={(event) => this.onFilterComboChange(event, 1)}
                                    />
                                </Col>
                                <Col>
                                 
                               <div  style={{ float: "right", marginRight: "1rem" }}>
                                    <Nav.Link className="btn btn-circle outline-grey mr-2"
                                            hidden={this.state.userRoleControlRights.indexOf(printLocationBoxBarcode) === -1}
                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_PRINTBARCODE" })}
                                             data-for="tooltip_list_wrap"   
                                             onClick={() => this.props.getBarcodePrinter({
                                                masterData: this.props.Login.masterData,
                                                ncontrolcode: printLocationBoxBarcode,
                                                userInfo: this.props.Login.userInfo,
                                                control: "locationBoxBarcode",
                                                dataState: this.state.dataState
                                            })}
                                        >
                                            <FontAwesomeIcon icon={faPrint} title={this.props.intl.formatMessage({ id: "IDS_PRINTBARCODE" })} />
                                        </Nav.Link>
                              
                                    <Button className="btn btn-circle outline-grey p-0" variant="link"
                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}
                                        onClick={() => this.reloadData()}>
                                        <RefreshIcon className="custom_icons" />
                                    </Button>
                                </div>
                                </Col>
                                </Row>
                                 
                            {this.state.data ?
                                <DataGridWithSelection
                                    primaryKeyField={"npkid"}
                                    userInfo={this.props.Login.userInfo}
                                    data={this.state.LocationBoxBarcodeData || []}
                                    selectAll={this.state.addSelectAll}
                                    title={this.props.intl.formatMessage({ id: "IDS_SELECTTODELETE" })}
                                    selectionChange={this.selectionChange}
                                    headerSelectionChange={this.headerSelectionChange}
                                    extractedColumnList={extractedColumnList}
                                    dataState={this.state.dataState
                                        ? this.state.dataState : { skip: 0, take: 10 }}
                                    dataResult={process(this.state.LocationBoxBarcodeData || [], this.state.dataState
                                        ? this.state.dataState : { skip: 0, take: 10 })}
                                    dataStateChange={this.dataStateChangeWorklistSample}
                                    scrollable={'scrollable'}
                                    pageable={true}
                                     gridHeight={'600px'}
                                />
                                : ""}
                            {
                                this.props.Login.openModal &&
                                <AlertModal
                                                    openAlertModal={this.props.Login.openModal}
                                                    modalTitle={"IDS_PRINTBARCODE"}
                                                    closeModal={this.closeModal}
                                                    onSaveClick={this.onSavePrinterClick}
                                                    modalBody={
                                                                <>
                                            <Row>
                                                <Col md={12}>
                                                    <FormSelectSearch
                                                        formLabel={this.props.intl.formatMessage({ id: "IDS_BARCODENAME" })}
                                                        name={"sbarcodename"}
                                                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                        value={this.state?.selectedRecord?.["sbarcodename"] || ""}
                                                        options={this.props.Login.barcode}
                                                        optionId="sbarcodename"
                                                        optionValue="sbarcodename"
                                                        isMandatory={true}
                                                        isMulti={false}
                                                        isSearchable={true}
                                                        closeMenuOnSelect={true}
                                                        alphabeticalSort={false}
                                                        as={"select"}
                                                        onChange={(event) => this.PrinterChange(event, "sbarcodename")}
                                                    />
                                                </Col>
                                                <Col md={12}>
                                                    <FormSelectSearch
                                                        formLabel={this.props.intl.formatMessage({ id: "IDS_PRINTERNAME" })}
                                                        name={"sprintername"}
                                                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                        value={this.state?.selectedRecord?.["sprintername"] || ""}
                                                        options={this.props.Login.printer}
                                                        optionId="sprintername"
                                                        optionValue="sprintername"
                                                        isMandatory={true}
                                                        isMulti={false}
                                                        isSearchable={true}
                                                        closeMenuOnSelect={true}
                                                        alphabeticalSort={false}
                                                        as={"select"}
                                                        onChange={(event) => this.PrinterChange(event, "sprintername")}
                                                    />
                                                </Col>
                                                <Col>
                                                    <FormInput
                                                        name={"ncount"}
                                                        type="text"
                                                        label={this.props.intl.formatMessage({ id: "IDS_ASKNUMBEROFBARCODEWANTTOPRINT" })}
                                                        placeholder={this.props.intl.formatMessage({ id: "IDS_ASKNUMBEROFBARCODEWANTTOPRINT" })}
                                                        value={this.state.selectedRecord["ncount"]}
                                                        isMandatory={true}
                                                        required={true}
                                                        maxLength={2}
                                                        onChange={(event) => this.onInputOnChange(event)}
                                                        isDisabled={false}

                                                    />
                                                </Col>
                                            </Row>
                                        </>
                                                    }
                                                />
                                // <SlideOutModal show={this.props.Login.openModal}
                                //     closeModal={this.closeModal}
                                //     inputParam={this.props.Login.inputParam}
                                //     screenName={'IDS_PRINTBARCODE'}
                                //     onSaveClick={this.onSavePrinterClick}
                                //     addComponent={
                                //         <>
                                //             <Row>
                                //                 <Col md={12}>
                                //                     <FormSelectSearch
                                //                         formLabel={this.props.intl.formatMessage({ id: "IDS_BARCODENAME" })}
                                //                         name={"sbarcodename"}
                                //                         placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                //                         value={this.state?.selectedRecord?.["sbarcodename"] || ""}
                                //                         options={this.props.Login.barcode}
                                //                         optionId="sbarcodename"
                                //                         optionValue="sbarcodename"
                                //                         isMandatory={true}
                                //                         isMulti={false}
                                //                         isSearchable={true}
                                //                         closeMenuOnSelect={true}
                                //                         alphabeticalSort={false}
                                //                         as={"select"}
                                //                         onChange={(event) => this.PrinterChange(event, "sbarcodename")}
                                //                     />
                                //                 </Col>
                                //                 <Col md={12}>
                                //                     <FormSelectSearch
                                //                         formLabel={this.props.intl.formatMessage({ id: "IDS_PRINTERNAME" })}
                                //                         name={"sprintername"}
                                //                         placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                //                         value={this.state?.selectedRecord?.["sprintername"] || ""}
                                //                         options={this.props.Login.printer}
                                //                         optionId="sprintername"
                                //                         optionValue="sprintername"
                                //                         isMandatory={true}
                                //                         isMulti={false}
                                //                         isSearchable={true}
                                //                         closeMenuOnSelect={true}
                                //                         alphabeticalSort={false}
                                //                         as={"select"}
                                //                         onChange={(event) => this.PrinterChange(event, "sprintername")}
                                //                     />
                                //                 </Col>
                                //                 <Col>
                                //                     <FormInput
                                //                         name={"ncount"}
                                //                         type="text"
                                //                         label={this.props.intl.formatMessage({ id: "IDS_ASKNUMBEROFBARCODEWANTTOPRINT" })}
                                //                         placeholder={this.props.intl.formatMessage({ id: "IDS_ASKNUMBEROFBARCODEWANTTOPRINT" })}
                                //                         value={this.state.selectedRecord["ncount"]}
                                //                         isMandatory={true}
                                //                         required={true}
                                //                         maxLength={2}
                                //                         onChange={(event) => this.onInputOnChange(event)}
                                //                         isDisabled={false}

                                //                     />
                                //                 </Col>
                                //             </Row>
                                //         </>
                                //     }
                                // />
                            }

                        </ListWrapper>
                    </Col>
                </Row>
            </>
        );
    }

    reloadData = () => {
        this.props.getLocationBoxBarcodedata({
            nbarcodefiltertypecode: this.state.selectedBarcodeFilterType?.nbarcodefiltertypecode?.value,
            userinfo: this.props.Login.userInfo,
            masterData: { ...this.props.Login.masterData },
            dataState : { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }
        })
         this.setState({addSelectAll:false });
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        const { name, value, } = event.target;
        const numericValue = value.replace(/[^1-9]/g, '');
        selectedRecord[name] = numericValue;
        this.setState({ selectedRecord });
    };

    PrinterChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        this.setState({ selectedRecord });
    }

    onSavePrinterClick = () => {
        const matchingCodes = this.state?.dataResult?.data
            ?.filter(x =>
                this.state?.selectedSampleData?.some(
                    item => item.npkid === x.npkid
                )
            )
            ?.map(x => x.npkid) || [];
        if (matchingCodes.length > 0) {
            if( this.state?.selectedRecord?.sbarcodename!==undefined &&
                this.state?.selectedRecord?.sbarcodename!==null &&
                this.state?.selectedRecord?.sbarcodename!==''){
            if( this.state?.selectedRecord?.sprintername!==undefined &&
                this.state?.selectedRecord?.sprintername!==null &&
                this.state?.selectedRecord?.sprintername!==''){
                 if( this.state?.selectedRecord?.ncount!==undefined &&
                this.state?.selectedRecord?.ncount!==null &&
                this.state?.selectedRecord?.ncount!==''){
                
            const inputParam = {
                classUrl: 'parentsample',
                methodUrl: 'Barcode',
                displayName: this.props.Login.inputParam.displayName,
                inputData: {
                    selectAll: false,
                    sprintername: this.state.selectedRecord.sprintername ? this.state.selectedRecord.sprintername.value : '',
                    sbarcodename: this.state.selectedRecord.sbarcodename ? this.state.selectedRecord.sbarcodename.value : '',
                    slocationcode: this.state?.dataResult?.data
                        ?.filter(x => this.state?.selectedSampleData?.some(item => item.npkid === x.npkid))
                        ?.map(x => `'${x.slocationcode}'`)
                        ?.join(",") || " ",
                    userinfo: this.props.Login.userInfo,
                    ncontrolcode: this.props.Login.ncontrolcode,
                    ncount: this.state?.selectedRecord?.ncount || 1
                },
                operation: 'print',
                action: 'printer',
                dataState:this.state.dataState
            }

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: { ...this.props.Login.masterData, searchedData: undefined } },
                        openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                        operation: 'printer'
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.printBarcodes(inputParam, { ...this.props.Login.masterData}, "openModal");
            }
        }else{
          toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTER" } )+this.props.intl.formatMessage({ id: "IDS_ASKNUMBEROFBARCODEWANTTOPRINT" } ));  
        }
        }else{
             toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECT"})+this.props.intl.formatMessage({ id:"IDS_PRINTERNAME" }));
        }
        } else {
             toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECT"})+this.props.intl.formatMessage({ id:"IDS_BARCODENAME" }));
        }
    }else{
             toast.warn(this.props.intl.formatMessage({ id: "IDS_NORECORDSAVAILABLE" }));
        }
        

    }
    dataStateChangeWorklistSample = (event) => {
        let updatedList = [];
        let LocationBoxBarcodeData = this.state.LocationBoxBarcodeData || [];
        this.setState({
            dataResult: process(this.state.LocationBoxBarcodeData || [], event.dataState),
            dataState: event.dataState, LocationBoxBarcodeData, addSelectAll: event.dataState && event.dataState.filter === null ?
                this.valiateCheckAll(LocationBoxBarcodeData) :
                this.valiateCheckAll(process(LocationBoxBarcodeData || [], event.dataState).data)
        });
    }

    headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        const eventData = event.target.props.data.hasOwnProperty('data') ? event.target.props.data.data || [] : event.target.props.data || [];
        let selectedSampleData = this.state.selectedSampleData || [];
        let LocationBoxBarcodeData = this.state.LocationBoxBarcodeData || [];
        if (checked) {
            LocationBoxBarcodeData = LocationBoxBarcodeData.map(item => {
                const matchingData = eventData.find(dataItem => dataItem.npkid === item.npkid);
                if (matchingData) {
                    const newItem = {
                        ...item,
                        selected: true,
                    };
                    selectedSampleData.push(newItem);
                    // }
                    return { ...item, selected: true };
                } else {
                    return { ...item, selected: item.selected ? true : false };
                }
            });
            this.setState({
                LocationBoxBarcodeData, selectedSampleData,
                addSelectAll: this.valiateCheckAll(process(LocationBoxBarcodeData || [], this.state.dataState).data),
                //  addSelectAll: checked,
                deleteSelectAll: false
            });
        } else {
            // let addedComponentData = this.state.addedComponentList || [];
            let LocationBoxBarcodeData = this.state.LocationBoxBarcodeData || [];
            let deletedListdData = this.state.deletedList || [];
            LocationBoxBarcodeData = LocationBoxBarcodeData.map(x => {
                const matchedItem = eventData.find(item => x.npkid === item.npkid);
                if (matchedItem) {
                    LocationBoxBarcodeData = LocationBoxBarcodeData.filter(item1 => item1.npkid !== matchedItem.npkid);
                    selectedSampleData=selectedSampleData.filter(item1 => item1.npkid !== matchedItem.npkid)
                    deletedListdData = deletedListdData.filter(item1 => item1.npkid !== matchedItem.npkid);
                    matchedItem.selected = false;
                    return matchedItem;
                }
                return x;
            });

            this.setState({
                LocationBoxBarcodeData, selectedSampleData, deletedList: deletedListdData,
                // addSelectAll: this.valiateCheckAll(addedComponentList),
                //deleteSelectAll: this.valiateCheckAll(addedComponentList),
                addSelectAll: checked, deleteSelectAll: false,
                // addComponentDataListCopy: this.valiateCopy(this.state.addComponentSortedList || [], data || [], addedComponentData || []),
            });
        }
    }

    selectionChange = (event) => {
        let LocationBoxBarcodeData = this.state.LocationBoxBarcodeData || [];
        let selectedSampleData = this.state.selectedSampleData || [];
        LocationBoxBarcodeData = LocationBoxBarcodeData.map(item => {
            if (item.npkid === event.dataItem.npkid) {
                item.selected = !event.dataItem.selected;
                if (item.selected) {
                    const newItem = JSON.parse(JSON.stringify(item));
                    delete newItem['selected']
                    newItem.selected = true;
                    selectedSampleData.push(newItem);
                }
                else {
                    LocationBoxBarcodeData = LocationBoxBarcodeData.filter(item1 => item1.npkid !== item.npkid)
                    selectedSampleData=selectedSampleData.filter(item1 => item1.npkid !== item.npkid)
                }
            }
            return item;
        });
        this.setState({
            addSelectAll: this.valiateCheckAll(process(LocationBoxBarcodeData || [], this.state.dataState).data), LocationBoxBarcodeData, selectedSampleData,
            deleteSelectAll: this.valiateCheckAll(LocationBoxBarcodeData)
        });
    }

    valiateCheckAll(data) {
        let selectAll = true;
        if (data && data.length > 0) {
            data.forEach(dataItem => {
                if (dataItem.selected) {
                    if (dataItem.selected === false) {
                        selectAll = false;
                    }
                } else {
                    selectAll = false;
                }
            })
        } else {
            selectAll = false;
        }
        return selectAll;
    }

    openPrinter = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal: true,
                screenData: {},
                operation: "barcode"
            }
        }
        this.props.updateStore(updateInfo);
    }

    onFilterComboChange = (e) => {
        this.props.getLocationBoxBarcodedata({
            nbarcodefiltertypecode: e.value,
            userinfo: this.props.Login.userInfo,
            masterData: { ...this.props.Login.masterData },
            dataState:{skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5}
        })
        this.setState({ selectedBarcodeFilterType: { nbarcodefiltertypecode: e },addSelectAll:false });
    }


    componentDidUpdate(previousProps) {
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            let { barcodeFilterTypeList, selectedBarcodeFilterType } = this.state;
            if (this.props.Login.masterData.BarcodeFilterType !== previousProps.Login.masterData.BarcodeFilterType) {
                const districtMap = constructOptionList(this.props.Login.masterData.BarcodeFilterType || [], "nbarcodefiltertypecode",
                    "sdisplaystatus", undefined, undefined, undefined);
                barcodeFilterTypeList = districtMap.get("OptionList");
                selectedBarcodeFilterType = {
                    nbarcodefiltertypecode: {
                        label: this.props.Login.masterData.selectedBarcodeFilterType.sdisplaystatus,
                        value: this.props.Login.masterData.selectedBarcodeFilterType.nbarcodefiltertypecode,
                        item: this.props.Login.masterData.selectedBarcodeFilterType,
                    }
                };
            }

            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                this.setState({
                    userRoleControlRights, controlMap, data: this.props.Login.masterData,
                    //ALPD-2252
                    dataResult: process(this.props.Login.masterData.LocationBoxBarcodeData || [], this.state.dataState),
                    selectedBarcodeFilterType, barcodeFilterTypeList
                });
            }
            else {
                let { dataState } = this.state;
                if (this.props.Login.dataState === undefined) {
                    dataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }
                }

                this.setState({
                    data: this.props.Login.masterData,
                    isOpen: false,
                    selectedRecord: this.props.Login.selectedRecord,
                    dataResult: process(this.props.Login.masterData.LocationBoxBarcodeData ? this.props.Login.masterData.LocationBoxBarcodeData : [], dataState),
                    //dataResult: barcodeFilterTypeList(this.props.Login.masterData, dataState),
                    dataState, barcodeFilterTypeList, selectedBarcodeFilterType
                });
            }
        }
        if (this.props.Login.dataState !== previousProps.Login.dataState) {
            this.setState({ dataState: this.props.Login.dataState ||this.state.dataState});
        }
        // if (this.props.Login.addSelectAll !== previousProps.Login.addSelectAll) {
        //     this.setState({ addSelectAll: this.props.Login.addSelectAll });
        // }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        if (this.props.Login.masterData.LocationBoxBarcodeData !== previousProps.Login.masterData.LocationBoxBarcodeData) {
            this.setState({
                LocationBoxBarcodeData: this.props.Login.masterData.LocationBoxBarcodeData
            });
        }
        if (this.props.Login.selectedSampleData !== previousProps.Login.selectedSampleData) {
            this.setState({
                selectedSampleData: this.props.Login.selectedSampleData
            });
        }
    }
}

export default connect(mapStateToProps, { callService, updateStore, crudMaster, getBarcodePrinter, getLocationBoxBarcodedata ,printBarcodes})(injectIntl(LocationBoxBarcode));