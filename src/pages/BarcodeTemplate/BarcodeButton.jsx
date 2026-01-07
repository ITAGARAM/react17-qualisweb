import React from "react";
import { faBarcode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
//import { openBarcodeModal } from '../../actions'
import { injectIntl } from "react-intl";
//import { connect } from "react-redux";
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal'
import Esign from "../audittrail/Esign";
import { constructOptionList } from "../../components/CommonScript";
import rsapi from "../../rsapi";
import Axios from "axios";
import { toast } from "react-toastify";
import AddBarcode from "./AddBarcode";
import { FontIconWrap } from '../../components/data-grid/data-grid.styles';
import Preloader from '../../components/preloader/preloader.component'
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from '../../actions/LoginTypes';

class BarcodeButton extends React.Component {
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


    barcodeGeneration = () => {
        //dispatch(initRequest(true));
        this.setState({ loading: true })
        let list = []
        const selectedMaster = this.props.selectedMaster
        if (Array.isArray(selectedMaster)) {
            list = selectedMaster
        } else {
            list.push(selectedMaster)
        }
        rsapi().post("barcodeconfiguration/barcodeGeneration", {
            selectedMaster: list, ncontrolCode: this.state.ncontrolCode,
            userinfo: this.props.userInfo, nbarcode: this.state.selectedRecord.nbarcode.item.nbarcode, sprintername: this.state.selectedRecord.sprintername.value,
            nbarcodeprintcount: this.state.selectedRecord.nbarcodeprintcount ? this.state.selectedRecord.nbarcodeprintcount : 1
        })
            .then(response => {
                toast.info(response.data)
                this.setState({ openBarcodeModal: false, loadEsign: false, selectedRecord: {}, Printer: [], BarcodeList: [], loading: false })
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

                } else {

                    toast.warn(this.props.intl.formatMessage({

                        id: error.response.data

                    }));

                }

            })

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
        let loadEsign = this.state.loadEsign;
        let openBarcodeModal = this.state.openBarcodeModal;
        let selectedRecord = this.state.selectedRecord;

        if (loadEsign) {
            this.setState({ loadEsign: false,loading:false })
        }
        else {
            this.setState({ loadEsign: false, openBarcodeModal: false, selectedRecord: {} ,loading:false})
        }

    }


    mandatoryFields = () => {

        const mandatory = [
            { "mandatory": true, "idsName": "IDS_BARCODENAME", "dataField": "nbarcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_PRINTER", "dataField": "sprintername", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        ]

        return mandatory;
    }


    render() {
        const barcodeControl = this.props.controlMap && this.props.controlMap.has(this.props.methodUrl) && this.props.controlMap.get(this.props.methodUrl).ncontrolcode;
        return (
            <>

                <Preloader loading={this.state.loading} />

                {this.props.isDataGrid ?

                    <FontIconWrap className="d-font-icon action-icons-wrap"
                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_BARCODEGENERATE" })}
                        data-place="left"
                        hidden={this.props.
                            userRoleControlRights && this.props.userRoleControlRights.indexOf(barcodeControl) === -1}
                        onClick={() => this.openBarcodeModal(this.props.selectedMaster, barcodeControl, this.props.userInfo)}
                    >
                        <FontAwesomeIcon icon={faBarcode} />
                    </FontIconWrap>
                    :
                    <Button className="btn btn-icon-rounded btn-circle solid-blue" role="button"
                        hidden={this.props.userRoleControlRights.indexOf(barcodeControl) === -1}
                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_BARCODEGENERATE" })}
                        onClick={() => this.openBarcodeModal(this.props.selectedMaster, barcodeControl, this.props.userInfo)}>
                        <FontAwesomeIcon icon={faBarcode} />
                    </Button>
                }

                {this.state.openBarcodeModal &&
                    <SlideOutModal
                        show={this.state.openBarcodeModal}
                        closeModal={this.closeModal}
                        operation={this.state.operation}
                        inputParam={{ methodUrl: this.props.methodUrl }}
                        screenName={this.props.screenName}
                        onSaveClick={this.barcodeGeneration}
                        esign={this.state.loadEsign}
                        validateEsign={this.validateEsign}
                        // masterStatus={this.props.Login.masterStatus}
                        // updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={this.mandatoryFields()}
                        addComponent={this.state.loadEsign ?
                            <Esign operation={this.state.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                //inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            /> : <AddBarcode
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onNumericInputChange={this.onNumericInputChange}
                                onComboChange={this.onComboChange}
                                BarcodeList={this.state.BarcodeList}
                                Printer={this.state.Printer}
                                nbarcodeprint={this.state.nbarcodeprint}
                            >
                            </AddBarcode>
                        }
                    ></SlideOutModal>

                }
            </>

        )
    }

}


export default (injectIntl(BarcodeButton));