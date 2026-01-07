import React from "react";
import { faBarcode,faFileExcel,faFileImport } from "@fortawesome/free-solid-svg-icons";
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button ,Nav} from "react-bootstrap";
//import { openBarcodeModal } from '../../actions'
//import { connect } from "react-redux";
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal'
import Esign from "../audittrail/Esign";
import { constructOptionList, deleteAttachmentDropZone, onDropAttachFileList, showEsign } from "../../components/CommonScript";
import rsapi from "../../rsapi";
import Axios from "axios";
import { toast } from "react-toastify";
import { FontIconWrap } from '../../components/data-grid/data-grid.styles';
import Preloader from '../../components/preloader/preloader.component'
import {  dynamicExportTemplate,updateStore ,crudMaster,dynamicImportTemplate} from '../../actions';
import AddFile from "../goodsin/AddFile";
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from "../../actions/LoginTypes";


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class ExportButton extends React.Component {
    constructor(props) {
        super(props)


        this.state = {
            selectedRecord: "",
            ncontrolCode: -1,
            nbarcodeprint: 1,
            BarcodeList: [],
            operation: "Printbarcode",
            Printer: [],
            openBarcodeModal: false,
            loadEsign: false,
            loadBarcode: false,
            loading: false,
        }
    }

    openBarcodeModal = (selectedMaster, ncontrolCode, userinfo) => {
        this.setState({ loading: true })
        let urlArray = [];
        const getPrinter = rsapi().post("barcode/getPrinter", userinfo);
        const getControlBasedBarcode = rsapi().post("barcodeconfiguration/checkConfiguration", { selectedMaster, ncontrolCode, userinfo, Multiselect: Array.isArray(selectedMaster) });
        urlArray = [getPrinter, getControlBasedBarcode]

        Axios.all(urlArray).then(response => {

            const printer = constructOptionList(response[0].data || [], "sprintername",
                "sprintername", undefined, undefined, true).get("OptionList");

            const barcode = constructOptionList(response[1].data.Barcode || [], "sbarcodename",
                "sbarcodename", undefined, undefined, true).get("OptionList");

            const selectedRecord = {}

            if (printer.length > 0)
                selectedRecord['sprintername'] = printer[0];

            if (barcode.length > 0) selectedRecord['nbarcode'] = barcode[0];
            selectedRecord['nbarcodeprint'] = 1


            this.setState({
                openBarcodeModal: true, ncontrolCode, Printer: printer,
                BarcodeList: barcode, operation: "Printbarcode",
                nbarcodeprint: response[1].data.nbarcodeprint, selectedRecord, loadBarcode: true, loading: false
            })
        }).catch(error => {

            // dispatch(initRequest(false));

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

            } else {

                toast.warn(this.props.intl.formatMessage({

                    id: error.response.data

                }));
            }
        })
    }

    onSaveImportClick=(saveType, formRef)=>{
        let inputParam = {};
        let selectedRecord = this.state.selectedRecord;
        let isFileupload =true;
        const formData = new FormData();
        formData.append("ImportFile", selectedRecord['stemplatefilename'][0])
        formData.append( "nformcode",this.props.Login.userInfo && this.props.Login.userInfo.nformcode);
        inputParam = {
            formData: formData,
            isFileupload,
            methodUrl:"Template",
            operation: "import",
            classUrl: "exportimport",
            inputData:{"userinfo":this.props.Login.userInfo},
            displayName:this.props.Login.displayName
            
        }
        var saveType = this.statesaveType;
        const masterData = this.props.Login.masterData;
     
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, dynamicfields: [], screenData: {  masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.dynamicImportTemplate(inputParam,masterData, "openExcelModal");

        }
    }


    onNumericInputChange = (value, name) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[name] = value;
        this.setState({ selectedRecord });
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};

        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
            if (event.target.name === 'nclientprinter' && event.target.checked === true) {
                //const printers =   window.navigator.printer.getPrinters();
                /////const names = printers.map(printer => printer.name);

                //selectedPrinterDatas {printername: { = names;
                // this.setState({ selectedPrinterData });
            }
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }


    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        this.setState({ selectedRecord });
    }


    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openExcel = this.props.Login.openExcel;
        let openExcelModal = this.props.Login.openExcelModal;
        let selectedRecord = this.state.selectedRecord;
        let inputData;
        if (loadEsign) {
            inputData= { loadEsign: false,openExcel:true,openExcelModal:true }
        }
        else {
            inputData={ loadEsign: false, openExcel:false,openExcelModal:false, selectedRecord: {}}
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { ...inputData }
        }
        this.props.updateStore(updateInfo);

    }


    mandatoryFields = () => {

        const mandatory = [
            { "idsName": "IDS_FILE", "dataField": "stemplatefilename", "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
        ]

        return mandatory;
    }
    dynamicExportTemplate=(ExportControl)=>{
        let headerName=[];
        if(this.props.isDataGrid){
        this.props.extractedColumnList.map(item=>{
            if((item.tablecolumnname!=="ndefaultstatus" && item.controlType!=='NA')){
            headerName.push({'headerName':this.props.intl.formatMessage({ id:item.idsName})+" ("+item.tablecolumnname+")",
            'controlType':item.controlType,
            'tablecolumnname':item.tablecolumnname})
            }
        })
        this.props.detailedFieldList && this.props.detailedFieldList.map(item=>{
            if((item.tablecolumnname!=="ndefaultstatus" && item.controlType!=='NA')){
            headerName.push({'headerName':this.props.intl.formatMessage({ id:item.idsName})+" ("+item.tablecolumnname+")",'controlType':item.controlType,'tablecolumnname':item.tablecolumnname})
            }
        })
        this.props.dynamicExportTemplate({selectedHeader:headerName, ncontrolCode:ExportControl, userinfo:this.props.userInfo,formName:this.props.screenName,
            nformcode:this.props.userInfo.nformcode,rowCount:this.props.settings && parseInt(this.props.settings['76'])})
        }else{
            this.props.dynamicExportTemplate({selectedHeader:headerName, ncontrolCode:ExportControl, userinfo:this.props.userInfo,formName:this.props.screenName,
                nformcode:this.props.userInfo.nformcode,rowCount:this.props.settings && parseInt(this.props.settings['76'])})
        }
    }


    render() {
        const ExportControl = this.props.controlMap && this.props.controlMap.has(this.props.exportUrl) && this.props.controlMap.get(this.props.exportUrl).ncontrolcode;
        const ImportControl = this.props.controlMap && this.props.controlMap.has(this.props.importUrl) && this.props.controlMap.get(this.props.importUrl).ncontrolcode;
        return (
            <>

                <Preloader loading={this.state.loading} />

                {/* {this.props.isDataGrid ? */}
                        <>
                        <Nav.Link name="export"
                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EXPORTTEMPLATE" })}
                        //  data-for="tooltip_list_wrap"
                        hidden={ExportControl ? this.props.
                          userRoleControlRights && this.props.userRoleControlRights.indexOf(ExportControl) === -1:true}
                        onClick={() => this.dynamicExportTemplate(ExportControl)}
                        className="btn btn-circle outline-grey mr-2"
                        >
                        <FontAwesomeIcon icon={faFileExcel} />
                        </Nav.Link>       
                        
                        <Nav.Link name="export"
                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_IMPORTTEMPLATE" })}
                        //  data-for="tooltip_list_wrap"
                        hidden={ImportControl ? this.props.
                          userRoleControlRights && this.props.userRoleControlRights.indexOf(ImportControl) === -1:true}
                        onClick={() => this.excelModal(ImportControl,'import')}
                        className="btn btn-circle outline-grey mr-2"
                        >
                        <FontAwesomeIcon icon={faFileImport} />
                        </Nav.Link>     
                        </>  
                            {/* :
                    <Button className="btn btn-icon-rounded btn-circle solid-blue" role="button"
                        hidden={this.props.userRoleControlRights.indexOf(ExportControl) === -1}
                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_BARCODEGENERATE" })}
                        onClick={() => this.excelModal(this.props.selectedMaster, ExportControl, this.props.userInfo)}>
                        <FontAwesomeIcon icon={faBarcode} />
                    </Button>
                } */}

                {this.props.Login.openExcelModal &&
                    <SlideOutModal
                        show={this.props.Login.openExcelModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={{ methodUrl: this.props.methodUrl }}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.onSaveImportClick}
                        esign={this.state.loadEsign}
                        validateEsign={this.validateEsign}
                        // masterStatus={this.props.Login.masterStatus}
                        // updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={this.mandatoryFields()}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.state.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                //inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}/>:
                                <AddFile
                                selectedRecord={this.state.selectedRecord}
                                onDrop={this.onDropFile}
                                deleteAttachment={this.deleteAttachment}
                                />
                        }
                    ></SlideOutModal>

                }
            </>

        )
    }

    excelModal = (ncontrolcode,operation) => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                selectedRecord: {}, operation:operation, ncontrolcode, selectedId: null,
                openExcel: true, openExcelModal: true,
            }
        }
        this.props.updateStore(updateInfo);
    }

    onDropFile = (attachedFiles, fieldName, maxSize) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles, maxSize)
        this.setState({ selectedRecord, actionType: "new" });
    }

    deleteAttachment = (event, file, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName], file)
        this.setState({
            selectedRecord, actionType: "delete" //fileToDelete:file.name 
        });
    }

}


export default connect(mapStateToProps, { updateStore, dynamicExportTemplate,crudMaster,dynamicImportTemplate})(injectIntl(ExportButton));