import React from 'react';
import { Card, Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { toast } from 'react-toastify';
import {
    callService, crudMaster, getHomeDashBoard,
    updateStore, validateEsignCredential, filterColumnData, checkParametersAvailableForHomeDashBoard,
    getReportViewChildDataListForDashBoard, selectCheckBoxDashBoardView,
    getAllSelectionDashBoardView
} from '../../actions';

import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { formatInputDate, rearrangeDateFormat } from '../../components/CommonScript';
import { transactionStatus } from '../../components/Enumeration';
import HomeDashBoardRowColTemplate from '../dashboardtypes/HomeDashBoardRowColTemplate';
import DashBoardDynamicControls from './DashBoardDynamicControls';
import { ModalInner } from "../../components/App.styles";

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class HomeDashBoard extends React.Component {
    constructor(props) {
        super(props)

        this.formRef = React.createRef();
        this.extractedColumnList = [];
        this.gridColumnList = [];

        this.state = {
            selectedRecord: {},
            controlMap: new Map(), userRoleControlRights: [],
            currentPageNo: 0,
            openModal: false
        }
        this.searchRef = React.createRef();
    }

    openModal = () => {
        this.setState({
            openModal: !this.state.openModal
        })
    }

    closeModal = () => {
        // this.setState({
        //     openModal: false
        // })
        let openModalForHomeDashBoard = this.props.Login.openModalForHomeDashBoard;
        openModalForHomeDashBoard = false;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModalForHomeDashBoard }
        }
        this.props.updateStore(updateInfo);
    }

    render() {

        //console.log("home dashbaord screen:", this.props.Login);
        return (
            <>
                <div className="client-listing-wrap">
                    <HomeDashBoardRowColTemplate
                        userInfo={this.props.Login.userInfo}
                        masterData={this.props.Login.masterData}
                        homeDashBoard={this.props.Login.homeDashBoard && this.props.Login.homeDashBoard[this.props.Login.currentPageNo]}
                        checkParametersAvailable={this.props.checkParametersAvailableForHomeDashBoard}
                        selectedRecord={this.props.Login.selectedRecordRealValue || {}}
                    />
                </div>
                {this.props.Login.openModalForHomeDashBoard &&
                    // 
                    <Modal show={this.props.Login.openModalForHomeDashBoard}
                        onHide={this.closeModal} backdrop="static" className="dashboard-parameter" dialogClassName="freakerstop">
                        <Modal.Header className="d-flex align-items-center">
                            <Modal.Title id="create-password" className="header-primary flex-grow-1">
                                <FormattedMessage id={"IDS_PARAMETERS"} defaultMessage="Parameter" />
                            </Modal.Title>
                            <Button className="btn-user btn-cancel" variant="" onClick={this.closeModal}>
                                <FormattedMessage id='IDS_CANCEL' defaultMessage='Cancel' />
                            </Button>
                            <Button className="btn-user btn-primary-blue" onClick={this.onSaveClick}>
                                <FontAwesomeIcon icon={faSave} /> { }
                                <FormattedMessage id='IDS_SUBMIT' defaultMessage='Submit' />
                            </Button>
                        </Modal.Header>
                        <Modal.Body>
                            <ModalInner>
                                <Card.Body>
                                    <DashBoardDynamicControls
                                        selectedRecord={this.props.Login.selectedRecord || {}}
                                        onInputOnChange={this.onInputOnChange}
                                        onNumericInputOnChange={this.onNumericInputOnChange}
                                        onComboChange={this.onComboChange}
                                        handleDateChange={this.handleDateChange}
                                        viewDashBoardDesignConfigList={this.props.Login.masterData.viewDashBoardDesignConfigList || []}
                                       // operation={this.props.Login.operation}
                                        operation={"filter"}
                                        inputParam={this.props.Login.inputParam}
                                        userInfo={this.props.Login.userInfo}
                                    />
                                </Card.Body>
                            </ModalInner>
                        </Modal.Body>
                    </Modal>
                }
            </>
        );

    }

    onNumericInputOnChange = (value, name, item) => {
        const selectedRecord = this.state.selectedRecord || {};

        selectedRecord[name] = value;

        const inputData = {
            dashboarddesignconfig: item,
            inputfielddata: {
                ...this.props.Login.inputFieldData,
                [name]: value,
                [name.concat("_componentcode")]: item.ndesigncomponentcode,
                [name.concat("_componentname")]: item.sdesigncomponentname,

            },
            parentcode: value.toString(),
            parentid: item.ndashboarddesigncode,
            userinfo: this.props.Login.userInfo,
            ndashboardtypecode: this.props.Login.masterData.selectedDashBoardTypes.ndashboardtypecode,

        }
        const inputParam = {
            viewDashBoardDesignConfigList: this.props.Login.masterData.viewDashBoardDesignConfigList,
            selectedRecord,
            inputData
        }

        this.props.getReportViewChildDataListForDashBoard(inputParam);
    }

    onInputOnChange = (event, item) => {
        const selectedRecord = this.state.selectedRecord || {};

        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }

        const inputData = {
            dashboarddesignconfig: item,
            inputfielddata: {
                ...this.props.Login.inputFieldData,
                [event.target.name]: selectedRecord[event.target.name],
                [event.target.name.concat("_componentcode")]: item.ndesigncomponentcode,
                [event.target.name.concat("_componentname")]: item.sdesigncomponentname,

            },
            parentcode: selectedRecord[event.target.name].toString(),
            parentid: item.ndashboarddesigncode,
            userinfo: this.props.Login.userInfo,
            ndashboardtypecode: this.props.Login.masterData.selectedDashBoardTypes.ndashboardtypecode,

        }
        const inputParam = {
            viewDashBoardDesignConfigList: this.props.Login.masterData.viewDashBoardDesignConfigList,
            selectedRecord,
            inputData
        }

        this.props.getReportViewChildDataListForDashBoard(inputParam);
    }

    // onComboChange = (comboData, fieldName, item) => {
    //     const selectedRecord = this.state.selectedRecord || {};

    //     selectedRecord[fieldName] = comboData;

    //     if (comboData != null){

    //         const inputData = {
    //             dashboarddesignconfig: item,
    //             inputfielddata: {
    //                 ...this.props.Login.inputFieldData,
    //                 [fieldName]: comboData.value,
    //                 [fieldName.concat("_componentcode")]: item.ndesigncomponentcode,
    //                 [fieldName.concat("_componentname")]: item.sdesigncomponentname,

    //             },
    //             parentcode: comboData.value.toString(),
    //             parentid: item.ndashboarddesigncode,
    //             userinfo: this.props.Login.userInfo,
    //             ndashboardtypecode: this.props.Login.masterData.selectedDashBoardTypes.ndashboardtypecode,

    //         }
    //         const inputParam = {
    //             viewDashBoardDesignConfigList: this.props.Login.masterData.viewDashBoardDesignConfigList,
    //             selectedRecord,
    //             inputData
    //         }

    //         this.props.getReportViewChildDataListForDashBoard(inputParam);
    //     }
    // }

    onComboChange = (comboData, fieldName, item) => {
        //console.log("combo data:", comboData, fieldName, item);
        const selectedRecord = this.state.selectedRecord || {};
        const selectedRecord2 = this.state.selectedRecord2 || {};
        selectedRecord[fieldName] = comboData;
        selectedRecord2[fieldName] = comboData === null ? -1 : comboData.value;
        const inputData = {
            dashboarddesignconfig: item,
            inputfielddata: {
                ...this.props.Login.inputFieldData,
                [fieldName]: comboData === null ? -1 : comboData.value,
                [fieldName.concat("_componentcode")]: item.ndesigncomponentcode,
                [fieldName.concat("_componentname")]: item.sdesigncomponentname,

            },
            parentcode: comboData === null ? "-1" : comboData.value.toString(),
            parentid: item.ndashboarddesigncode,
            userinfo: this.props.Login.userInfo,
            ndashboardtypecode: this.props.Login.masterData.selectedDashBoardTypes.ndashboardtypecode,

        }
        const inputParam = {
            viewDashBoardDesignConfigList: this.props.Login.masterData.viewDashBoardDesignConfigList,
            selectedRecord,
            inputData
        }

        this.props.getReportViewChildDataListForDashBoard(inputParam);
    }

    // handleDateChange = (dateName, dateValue, item) => {
    //     const { selectedRecord } = this.state;
       
    //     if (dateValue === null){
    //         dateValue = new Date(item.dataList[0]);
    //     }

    //     selectedRecord[dateName] = dateValue;      
     
    //     const inputData = {
    //         dashboarddesignconfig: item,
    //         inputfielddata: {
    //             ...this.props.Login.inputFieldData,
    //             [dateName]: formatInputDate(dateValue, true),
    //             [dateName.concat("_componentcode")]: item.ndesigncomponentcode,
    //             [dateName.concat("_componentname")]: item.sdesigncomponentname,

    //         },
    //         parentcode: formatInputDate(dateValue, true),
    //         parentid: item.ndashboarddesigncode,
    //         userinfo: this.props.Login.userInfo,
    //         ndashboardtypecode: this.props.Login.masterData.selectedDashBoardTypes.ndashboardtypecode,

    //     }
    //     const inputParam = {
    //         viewDashBoardDesignConfigList: this.props.Login.masterData.viewDashBoardDesignConfigList,
    //         selectedRecord,
    //         inputData
    //     }

    //     this.props.getReportViewChildDataListForDashBoard(inputParam);
        
    // }

    handleDateChange = (dateName, dateValue, item) => {
        const { selectedRecord } = this.state;
        const selectedRecord2 = this.state.selectedRecord2 || {};

        if (dateValue === null){
            // dateValue = new Date(item.dataList[0]);
            dateValue = rearrangeDateFormat(this.props.Login.userInfo,item.dataList[0]);
        }

        selectedRecord[dateName] = dateValue;
        selectedRecord2[dateName] = dateValue;
        
        const inputData = {
            dashboarddesignconfig: item,
            inputfielddata: {
                ...this.props.Login.inputFieldData,
                [dateName]: formatInputDate(dateValue, true),
                [dateName.concat("_componentcode")]: item.ndesigncomponentcode,
                [dateName.concat("_componentname")]: item.sdesigncomponentname,

            },
            parentcode: formatInputDate(dateValue, true),
            parentid: item.ndashboarddesigncode,
            userinfo: this.props.Login.userInfo,
            ndashboardtypecode: this.props.Login.masterData.selectedDashBoardTypes.ndashboardtypecode,

        }
        const inputParam = {
            viewDashBoardDesignConfigList: this.props.Login.masterData.viewDashBoardDesignConfigList,
            selectedRecord,
            inputData
        }

        this.props.getReportViewChildDataListForDashBoard(inputParam);
    }

    onSaveClick = (saveType, formRef) => {
        const inputFieldData = this.props.Login.inputFieldData;

        const failedControls = [];
        const startLabel = [];
        let label = "IDS_ENTER";
        let mandatoryFields = [];

       // console.log("this.state.selectedRecord:", this.state.selectedRecord);

        const fieldList = this.props.Login.masterData.viewDashBoardDesignConfigList || [];
        fieldList.forEach(item => {
            if (item.nmandatory === transactionStatus.YES){
            //if (item.ndesigncomponentcode !== designComponents.PATH ){
                mandatoryFields.push({ "idsName": item.sdisplayname, "dataField": item.sfieldname  , "mandatoryLabel":"IDS_PROVIDE", "controlType": "textbox"})
            }
        });

        mandatoryFields.forEach(item => {
            if (this.state.selectedRecord[item.dataField] === undefined || this.state.selectedRecord[item.dataField] === null)
            {
                const alertMessage = (item.alertPreFix ? item.alertPreFix : '') + this.props.intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? item.alertSuffix : '')
                failedControls.push(alertMessage);
                startLabel.push(item.mandatoryLabel)//"IDS_PROVIDE";
            }
            else {
                if (item.validateFunction) {
                    const validateData = item.validateFunction;
                    if (validateData(this.state.selectedRecord[item.dataField]) === false) {
                        const alertMessage = (item.alertPreFix ? item.alertPreFix + " " : '') + this.props.intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? " " + item.alertSuffix : '')
                        failedControls.push(alertMessage);
                        startLabel.push(item.mandatoryLabel)
                    }
                }
                else {
                    if (typeof this.state.selectedRecord[item.dataField] === "object") {
                        //to validate FormSelectSearch component
                        if (this.state.selectedRecord[item.dataField].length === 0) {
                            const alertMessage = (item.alertPreFix ? item.alertPreFix : '') + this.props.intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? item.alertSuffix : '')
                            failedControls.push(alertMessage);
                            startLabel.push(item.mandatoryLabel)//"IDS_SELECT";
                        }
                    }
                    else if (typeof this.state.selectedRecord[item.dataField] === "string") {
                        //to handle string field -- added trim function
                        if (this.state.selectedRecord[item.dataField].trim().length === 0) {
                            const alertMessage = (item.alertPreFix ? item.alertPreFix : '') + this.props.intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? item.alertSuffix : '')
                            failedControls.push(alertMessage);
                            startLabel.push(item.mandatoryLabel)
                        }
                    }
                    else {
                        //number field
                        if (this.state.selectedRecord[item.dataField].length === 0) {
                            const alertMessage = (item.alertPreFix ? item.alertPreFix : '') + this.props.intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? item.alertSuffix : '')
                            failedControls.push(alertMessage);
                            startLabel.push(item.mandatoryLabel)
                        }
                    }
                }
            }
        });

        if (failedControls.length === 0) {
            const inputParam = {
                dashboardtypes: this.props.Login.masterData.selectedDashBoardTypes,
                inputfielddata: inputFieldData,
                userinfo: this.props.Login.userInfo
            }
            //console.log("inputParam:", inputParam);
            this.props.selectCheckBoxDashBoardView("HomeDashBoard", this.state.selectedRecord, this.props.Login.masterData, inputParam, this.props.Login.dashBoardTemplateNo,
                this.props.Login.templateCode, this.props.Login.homeDashBoard, this.props.Login.currentPageNo);
        }
        else {
            //toast.info(`${this.props.intl.formatMessage({id:"IDS_ENTER"})} ${failedControls.join(",")}`);
            label = startLabel[0] === undefined ? label :startLabel[0];
            toast.info(`${this.props.intl.formatMessage({ id: label })} ${failedControls[0]}`);          
        }
    }

    componentDidUpdate(previousProps) {
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        if (this.props.Login.openModalForHomeDashBoard !== previousProps.Login.openModalForHomeDashBoard) {
            this.setState({ openModal: this.props.Login.openModalForHomeDashBoard });
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

}

export default connect(mapStateToProps, {
    callService, crudMaster, getHomeDashBoard, updateStore,
    validateEsignCredential, filterColumnData, checkParametersAvailableForHomeDashBoard,
    getReportViewChildDataListForDashBoard, selectCheckBoxDashBoardView,
    getAllSelectionDashBoardView
})(injectIntl(HomeDashBoard));