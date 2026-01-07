import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Card, Modal ,Row} from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { DEFAULT_RETURN } from '../actions/LoginTypes';
import { ModalInner } from './App.styles';
import { transactionStatus } from './Enumeration';

class ModalShow extends React.Component {
    constructor(props) {
        super(props)
        this.myRef = React.createRef()
    }
    formRef = React.createRef();
    state = { masterStatus: "", failedControls: [] }

    handleSaveClick = (saveType) => {
        const failedControls = [];
        const startLabel = [];
        let label = "IDS_ENTER";
        let mandatoryFields = this.props.mandatoryFields || [];
        if (this.props.esign) {
            mandatoryFields = [
                { "idsName": "IDS_PASSWORD", "dataField": "esignpassword", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_COMMENTS", "dataField": "esigncomments", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_REASON", "dataField": "esignreason", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
           
            ]
        }
        mandatoryFields.forEach(item => {
            if (this.props.selectedRecord[item.dataField] === undefined || this.props.selectedRecord[item.dataField] === null) {
                const alertMessage = (item.alertPreFix ? item.alertPreFix + " " : '') + this.props.intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? " " + item.alertSuffix : '')
                failedControls.push(alertMessage);
                startLabel.push(item.mandatoryLabel)//"IDS_PROVIDE";
            }
            else {
                if (item.validateFunction) {
                    const validateData = item.validateFunction;
                    if (validateData(this.props.selectedRecord[item.dataField]) === false) {
                        const alertMessage = (item.alertPreFix ? item.alertPreFix + " " : '') + this.props.intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? " " + item.alertSuffix : '')
                        failedControls.push(alertMessage);
                        startLabel.push(item.mandatoryLabel)
                    }
                }
                else {
                    if (typeof this.props.selectedRecord[item.dataField] === "object") {
                        //to validate FormSelectSearch component
                        if (this.props.selectedRecord[item.dataField].length === 0) {
                            const alertMessage = (item.alertPreFix ? item.alertPreFix + " " : '') + this.props.intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? " " + item.alertSuffix : '')
                            failedControls.push(alertMessage);
                            startLabel.push(item.mandatoryLabel)//"IDS_SELECT";
                        }
                    }
                    else if (typeof this.props.selectedRecord[item.dataField] === "string") {
                        //to handle string field -- added trim function
                        if (this.props.selectedRecord[item.dataField].trim().length === 0) {
                            const alertMessage = (item.alertPreFix ? item.alertPreFix + " " : '') + this.props.intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? " " + item.alertSuffix : '')
                            failedControls.push(alertMessage);
                            startLabel.push(item.mandatoryLabel)
                        }
                    }
                    else {
                        //number field
                        if (this.props.selectedRecord[item.dataField].length === 0) {
                            const alertMessage = (item.alertPreFix ? item.alertPreFix + " " : '') + this.props.intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? " " + item.alertSuffix : '')
                            failedControls.push(alertMessage);
                            startLabel.push(item.mandatoryLabel)
                        }
                    }
                }
            }
            // else{
            //     const alertMessage=(item.alertPreFix?item.alertPreFix:'')+this.props.intl.formatMessage({id:item.idsName})+(item.alertSuffix?item.alertSuffix:'')
            //     failedControls.push(alertMessage);
            // }
        });
        // console.log("validationPassed:", failedControls);

        if (failedControls.length === 0) {
            if (saveType === 4) {
                this.props.onExecuteClick(this.formRef);
            }
            else if (saveType === 3) {
                if (this.props.selectedRecord.agree && this.props.selectedRecord.agree === transactionStatus.NO) {

                    toast.info(this.props.intl.formatMessage({ id: "IDS_CHECKAGREE" }));

                } else {

                    this.props.validateEsign();
                }
            }
            else {
                this.props.onSaveClick();
            }
        }
        else {
            //toast.info(`${this.props.intl.formatMessage({id:"IDS_ENTER"})} ${failedControls.join(",")}`);
            label = startLabel[0] === undefined ? label : startLabel[0];
            toast.info(`${this.props.intl.formatMessage({ id: label })} ${failedControls[0]}`);
        }

    }
    componentDidUpdate() {
        let masterStatus = this.props.masterStatus;
        if (masterStatus !== "" && masterStatus !== undefined) {
            toast.warn(masterStatus);
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { masterStatus: "" }
            }
            this.props.updateStore(updateInfo);
            masterStatus = "";
        }
        if (this.props.innerPopup !== this.state.innerTop) {
            setTimeout(() => {
                let scrollDoc = this.props.modalEvent && this.props.modalEvent.id ? document.getElementById(this.props.modalEvent.id) : null;
                if (this.myRef && this.myRef.current) {
                    this.myRef.current.scrollIntoView({ behavior: 'smooth' })
                }
                if (scrollDoc) {
                    scrollDoc.scrollIntoView({ behavior: 'smooth' })
                }
            }, 100)
            this.setState({
                innerTop: this.props.innerPopup
            })
        }
        return null;

    }
    render() {
        let saveType = 1;
        if (this.props.ignoreFormValidation) {
            saveType = 5;
        }
        let buttonLabel = "Save";
        let idsLabel = "IDS_SAVE";
        if (this.props.buttonLabel) {
            buttonLabel = this.props.buttonLabel;
            idsLabel = 'IDS_'.concat(buttonLabel.toUpperCase());
        }
        return (
            <Modal show={this.props.modalShow} size={this.props.size?this.props.size:''}
                onHide={this.closeModal} backdrop="static" className="dashboard-parameter" dialogClassName="freakerstop" enforceFocus={this.props?.enforceFocus === false ? false : true}>
                <Modal.Header className="d-flex align-items-center">
                    <Modal.Title id="password" className="header-primary flex-grow-1">
                        {this.props.esign === true ?
                            <FormattedMessage id={"IDS_ESIGN"} defaultMessage="Esign" /> :
                            <FormattedMessage id={this.props.modalTitle} />

                        }
                    </Modal.Title>
                    {this.props.removeCancel?"" : 
                     <Button className="btn-user btn-cancel" variant="" onClick={this.props.closeModal}>
                        {this.props.rulesenginealret ?<FormattedMessage id='IDS_NO' defaultMessage='No' /> : <FormattedMessage id='IDS_CANCEL' defaultMessage='Cancel' />}
                        
                    </Button> }
                    {this.props.esign === true ||this.props.needSubmit ?
                        <Button className="btn-user btn-primary-blue" onClick={() =>this.props.needSubmit? this.handleSaveClick(1) :this.handleSaveClick(3)}>
                            <FontAwesomeIcon icon={faSave} /> { }
                            {this.props.rulesenginealret ?<FormattedMessage id='IDS_YES' defaultMessage='Yes' /> : <FormattedMessage id='IDS_SUBMIT' defaultMessage='Submit' />}
                            {/* <FormattedMessage id='IDS_SUBMIT' defaultMessage='Submit' /> */}
                        </Button>
                        :
                        // (this.props.operation === "create" || this.props.operation === "update")
                        //   && this.props.esign !== true && this.props.showExecute === true && this.props.showSave ?
                        this.props.needSave===true?"":this.props.modalTitle==="IDS_RELEASEANDREPORTGENERATION"?
                        <Button className="btn-user btn-primary-blue" onClick={() => this.handleSaveClick(1)}>
                        <FormattedMessage id='IDS_OK' defaultMessage='Ok' />
                    </Button>:
                    <Button className="btn-user btn-primary-blue" onClick={() => this.handleSaveClick(1)}>
                    <FontAwesomeIcon icon={faSave} /> { }
                    <FormattedMessage id='IDS_SAVE' defaultMessage='Save' />
                </Button>

                      
                        
                    }
                </Modal.Header>
                <Modal.Body>
                    <ModalInner>
                    <Card className="border-0">
                        <Card.Body>
                           
                                {this.props.modalBody}
                            
                        </Card.Body>
                        </Card>
                    </ModalInner>
                </Modal.Body>
            </Modal>
        );

    }
}
export default injectIntl(ModalShow);
