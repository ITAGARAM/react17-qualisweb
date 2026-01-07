import React from 'react'
import { Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { FormattedMessage, injectIntl } from 'react-intl';
import { MediaHeader, MediaLabel, MediaSubHeader, ModalInner } from '../../../components/App.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormTextarea from '../../../components/form-textarea/form-textarea.component';
import FormInput from '../../../components/form-input/form-input.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import DateTimePicker from '../../../components/date-time-picker/date-time-picker.component';
import { transactionStatus } from '../../../components/Enumeration'
import { toast } from 'react-toastify';
class TemplateForm extends React.Component {

    renderSwitch = (control, selectedRecord) => {
        switch (control.nchecklistcomponentcode) {
            case 1: {
                let comboData = control.squestiondata ? control.squestiondata.split(",") : []
                let options = comboData ? comboData.map(option => ({ "value": option, "label": option })) : []
                return (
                    <Col md={12}>
                        <FormSelectSearch
                            name={control.squestion}
                            as={"select"}
                            onChange={(event) => this.props.onTemplateComboChange(event, control)}
                            formLabel={control.squestion}
                            placeholder={this.props.intl.formatMessage({id:"IDS_SELECTRECORD"})}
                            isMandatory={control.nmandatoryfield === transactionStatus.YES ? true : false}
                            defaultValue={control.sdefaultvalue ? { "value": control.sdefaultvalue, "label": control.sdefaultvalue } : ""}
                            options={options}
                            optionId={"value"}
                            optionValue={"label"}
                            isMulti={false}
                            isDisabled={false}
                            isSearchable={false}
                            isClearable={true}
                        />
                    </Col>
                );
            }
            case 2: {
                return (
                    <Col md={12}>
                        <FormInput
                            name={control.squestion}
                            label={control.squestion}
                            type="text"
                            defaultValue={control.sdefaultvalue ? control.sdefaultvalue : ""}
                            isMandatory={control.nmandatoryfield === transactionStatus.YES ? true : false}
                            required={control.nmandatoryfield === transactionStatus.YES ? true : false}
                            maxLength={100}
                            onChange={(event) => this.props.onTemplateInputChange(event, control)}
                        // id={control.nchecklistversionqbcode}
                        />
                    </Col>
                );
            }
            case 3: {
                return (
                    <Col md={12}>
                        <FormTextarea
                            label={control.squestion}
                            name={control.squestion}
                            onChange={(event) => this.props.onTemplateInputChange(event, control)}
                            defaultValue={control.sdefaultvalue ? control.sdefaultvalue : ""}
                            isMandatory={control.nmandatoryfield === transactionStatus.YES ? true : false}
                            required={control.nmandatoryfield === transactionStatus.YES ? true : false}
                            rows="2"
                            maxLength={255}
                        />
                    </Col>
                );
            }
            case 4: {
                let checkboxes = control.squestiondata ? control.squestiondata.split(",") : []
                let defaultCheckboxes = control.sdefaultvalue ? control.sdefaultvalue.split(",") : []

                return (
                    <Col md={12}>
                        <fieldset>
                            <Form.Group>
                                <Form.Label as="legend" htmlFor={control.squestion}>{control.squestion}{control.nmandatoryfield === transactionStatus.YES && <sup>*</sup>}</Form.Label>
                                {checkboxes.map(checkbox =>

                                    <Form.Check
                                        inline={true}
                                        type="checkbox"
                                        name={control.squestion}
                                        label={checkbox}
                                        onChange={(event) => this.props.onTemplateInputChange(event, control)}
                                        id={checkbox}
                                        defaultChecked={defaultCheckboxes ? defaultCheckboxes.includes(checkbox.trim()) ? true : false : false}
                                        isMandatory={control.nmandatoryfield === transactionStatus.YES ? true : false}
                                        required={control.nmandatoryfield === transactionStatus.YES ? true : false}
                                    />

                                )}
                            </Form.Group>
                        </fieldset>
                    </Col>

                );
            }
            case 5: {
                return (
                    <Col md={12}>
                        <Form.Group>
                            <Form.Label>{control.squestion}{control.nmandatoryfield === transactionStatus.YES && <sup>*</sup>}</Form.Label>{ }
                        </Form.Group>
                    </Col>
                );
            }
            case 6: {
                return (
                    <Col md={12}>
                        <Form.Group>
                            <Form.Label htmlFor={control.squestion}>{control.squestion}{control.nmandatoryfield === transactionStatus.YES && <sup>*</sup>}</Form.Label>
                            <Button className="btn" name={control.squestion}>
                                {control.squestion}
                            </Button>
                        </Form.Group>
                    </Col>
                );
            }
            case 7: {
                return (
                    <Col md={12}>
                        <DateTimePicker
                            name={control.squestion}
                            label={control.squestion}
                            placeholderText={"DD/MM/YYYY"}
                            // selected={
                            //     selectedRecord ?
                            //         selectedRecord[control.nchecklistversionqbcode] ? selectedRecord[control.nchecklistversionqbcode].sdefaultvalue :
                            //             control.sdefaultvalue ? new Date(control.sdefaultvalue) : null :
                            //         control.sdefaultvalue ? new Date(control.sdefaultvalue) : null
                            // }

                            selected={selectedRecord && selectedRecord[control.nchecklistversionqbcode] ? selectedRecord[control.nchecklistversionqbcode].sdefaultvalue 
                                : new Date()}

                            isMandatory={control.nmandatoryfield === transactionStatus.YES ? true : false}
                            dateFormat="dd/MM/yyyy"
                            className='form-control'
                            onChange={(date) => this.props.onTemplateDateChange(date, control)}
                            isClearable={true}
                        />
                    </Col>
                );
            }
            case 8: {
                let radioButtons = control.squestiondata ? control.squestiondata.split(",") : []
                return (

                    <Col md={12}>
                        <fieldset>
                            <Form.Group>
                                <Form.Label as="legend" htmlFor={control.squestion}>{control.squestion}{control.nmandatoryfield === transactionStatus.YES && <sup>*</sup>}</Form.Label>
                                {radioButtons.map(radioButton =>

                                    <Form.Check
                                        inline={true}
                                        type="radio"
                                        name={control.squestion}
                                        label={radioButton}
                                        onChange={(event) => this.props.onTemplateInputChange(event, control)}
                                        id={radioButton}
                                        defaultChecked={control.sdefaultvalue ? control.sdefaultvalue.trim() === radioButton.trim() ? true : false : false}
                                        isMandatory={control.nmandatoryfield === transactionStatus.YES ? true : false}
                                        required={control.nmandatoryfield === transactionStatus.YES ? true : false}
                                    />

                                )}
                            </Form.Group>
                        </fieldset>
                    </Col>

                );
            }
            default:
                return ("");


        }

    }
    onSaveClick = () => {
        if(this.props.needValidation){
            const failedControls = [];
            const mandatoryFields=[];
      this.props.templateData.map(control =>
          control.nmandatoryfield===transactionStatus.YES?mandatoryFields.push(control):''
        
        )
        mandatoryFields.forEach(item=>{ 
            if (this.props.selectedRecord&&this.props.selectedRecord[item.nchecklistversionqbcode]&&this.props.selectedRecord[item.nchecklistversionqbcode].sdefaultvalue)
            {
                if(typeof this.props.selectedRecord[item.nchecklistversionqbcode].sdefaultvalue === "object"){
                    //to validate FormSelectSearch component
                    if (this.props.selectedRecord[item.nchecklistversionqbcode].sdefaultvalue.length === 0){
                        const alertMessage=item.squestion
                        failedControls.push(alertMessage);
                    }
                }
                else if(typeof this.props.selectedRecord[item.nchecklistversionqbcode].sdefaultvalue === "string")
                {
                    if (this.props.selectedRecord[item.nchecklistversionqbcode].sdefaultvalue.trim().length === 0 ){
                        const alertMessage=item.squestion
                        failedControls.push(alertMessage);
                    }
                }
                else 
                {
                    if (this.props.selectedRecord[item.nchecklistversionqbcode].sdefaultvalue.length === 0 ){
                        const alertMessage=item.squestion
                        failedControls.push(alertMessage);
                    }
                }
            }
            else{
                const alertMessage=item.squestion
                failedControls.push(alertMessage);
            }
        });
       // console.log("validationPassed:", failedControls);
       
        if (failedControls.length === 0){
            this.props.onSaveClick(this.props.selectedRecord, this.props.Login.userInfo, this.props.nregtypecode,this.props.nregsubtypecode)
        }
        else{
            
            toast.info(`${this.props.intl.formatMessage({id:"IDS_ENTER"})} ${failedControls[0]}`);
           
          
        }
        }else{
            this.props.onSaveClick(this.props.selectedRecord, this.props.Login.userInfo, this.props.nregtypecode,this.props.nregsubtypecode)
        }
    }
    render() {
        return (
            <Modal
                size="lg"
                backdrop="static"
                show={this.props.viewScreen}
                dialogClassName="modal-dialog-slideout"
                aria-labelledby={"add-"}>
                <Modal.Header className="d-flex align-items-center">
                    {this.props.screenName?
                    <Modal.Title id={"add"} className="header-primary flex-grow-1">
                        <FormattedMessage id={this.props.screenName} defaultMessage={this.props.screenName} />
                    </Modal.Title>
                    : <Modal.Title id={"add"} className="header-primary flex-grow-1">
                        {this.props.templateData[0].schecklistname} # {this.props.templateData[0].schecklistversionname}
                    </Modal.Title>}
                    <Button className="btn-user btn-cancel" variant="" onClick={this.props.handleClose}>
                        <FormattedMessage id='IDS_CANCEL' defaultMessage='Cancel' />
                    </Button>
                    {this.props.needSaveButton?
                    <Button className="btn-user btn-primary-blue" onClick={() => this.onSaveClick(this.props.selectedRecord, this.props.Login.userInfo, this.props.nregtypecode,this.props.nregsubtypecode)}>
                        <FontAwesomeIcon icon={faSave} /> { }
                        <FormattedMessage id='IDS_SAVE' defaultMessage='Save' />
                    </Button>
                    : ""}
                </Modal.Header>
                <Modal.Body>
                    <ModalInner>
                        <Card.Body>
                            <Form ref={this.props.formRef}>
                                <Row>
                                    {this.props.screenName === "IDS_CHECKLISTRESULT" && Object.values(this.props.selectedRecord).length > 0 ?
                                        // <Row className="mb-4">
                                        <Col md={12} className="mb-4">
                                            <MediaHeader className={`labelfont`}>Test:{" " + this.props.selectedRecord.stestsynonym}</MediaHeader>
                                            <MediaSubHeader>
                                                <MediaLabel className={`labelfont`}>Parameter: {this.props.selectedRecord.sparametersynonym}</MediaLabel>
                                            </MediaSubHeader>
                                        </Col>
                                        // </Row>
                                        : ""}
                                    {this.props.templateData.map(control =>
                                        this.renderSwitch(control, this.props.selectedRecord)
                                    )}
                                </Row>
                            </Form>
                        </Card.Body>
                    </ModalInner>
                </Modal.Body>
            </Modal>
        )
    }
}

export default injectIntl(TemplateForm);