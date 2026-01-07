import React from 'react'
import { Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import FormInput from '../../components/form-input/form-input.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { transactionStatus } from '../../components/Enumeration'
import { toast } from 'react-toastify';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormEmail from '../../components/form-email/form-email.component';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import DropZone from '../../components/dropzone/dropzone.component';
import ReactSelectAddEdit from '../../components/react-select-add-edit/react-select-add-edit-component'
import { faSleigh } from '@fortawesome/free-solid-svg-icons';
class DynamicSlideoutMaterial extends React.Component {
    constructor(props) {
        super(props);
        this.formElement = React.createRef();
    }
    renderSwitch = (control, selectedRecord) => {
       // console.log('-------> ', this.props, control)
        //console.log("control:", control, selectedRecord);
        //const editfield = this.props.editfield && this.props.editfield
        const index = this.props.editfield ?
            this.props.editfield.findIndex(x => x.label === control.label) : -1
        let checkReadOnly = false;
        if (index !== -1) {
            const listdata = (this.props.editfield[index] && this.props.editfield[index].editableuntill) || []
            checkReadOnly = listdata ? this.props.selectedSample && this.props.selectedSample.ntransactionstatus ?
                !listdata.includes(this.props.selectedSample.ntransactionstatus)
                : false : false
        }


        switch (control.inputtype) {
            case 'combo': {
                // console.log(control.label)
                // let comboData = control.squestiondata ? control.squestiondata.split(",") : []
                // let options = comboData ? comboData.map(option => ({ "value": option, "label": option })) : []
                //  console.log(control.label, this.props.selectedRecord[control.label])

                return (
                    control.label === 'Section'&&this.props.needsectionwise === transactionStatus.NO&&
                    this.props.isSectionneed  === transactionStatus.NO?"":
                    (control.label === 'Section' || control.label === 'Site') && this.props.ismaterialSectionneed ?
                        this.props.ismaterialSectionneed === transactionStatus.YES ?
                        !(control.label === 'Section' && this.props.operation === 'update' && this.props.screenname === 'IDS_MATERIAL' && this.props.isBreadCrumbCategory === true) ?
                        !(control.label === 'Section' && this.props.operation === 'update' && this.props.screenname === 'IDS_MATERIAL' && this.props.checkSectionNeed && this.props.checkSectionNeed === true) ? 
                            <FormSelectSearch

                                name={control.label}
                                as={"select"}
                                onChange={(event) => this.props.onComboChange(event, control)}
                                formLabel={control.displayname[this.props.userInfo.slanguagetypecode] || control.label}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={
                                    control.label === 'Section' ? this.props.ismaterialSectionneed||this.props.isSectionneed === transactionStatus.YES ? true : false : control.mandatory}
                                value={this.props.selectedRecord[control.label] ? this.props.selectedRecord[control.label] : ""}
                                options={this.props.comboData && this.props.comboData[control.label] ? this.props.comboData[control.label] : []}
                                optionId={"value"}
                                optionValue={"label"}
                                isMulti={false}
                                isClearable={control.label === 'Section' ? this.props.isSectionneed === transactionStatus.YES 
                                        ? false : true : control.mandatory ? false : true} 
                                isDisabled={control.label === 'Inventory Transaction Type'|| control.label === 'Transaction Type'
                                            ? this.props.disablefields ?true :false
                                            : control.label === 'Next Validation Period' ? this.props.enableDisableNextValidation === 4 ? true : false 
                                            : control.label === 'Section' ? this.props.operation === 'update' && this.props.screenname === 'IDS_MATERIAL' &&
                                                                            this.props.isBreadCrumbCategory === true ? true : false 
                                            : control.label === 'Open Expiry Period' ? this.props.enableDisableOpenExpiry === 4 ? true : false 
                                            : control.label === 'Expiry Policy Period' ? this.props.enableDisableExpiryPolicy !== 'Expiry policy' ? true : false 
                                            : control.readonly ? control.readonly : checkReadOnly}
                            //    isDisabled={control.label==='Expiry Policy Period'?
                            //        this.props.enableDisableExpiryPolicy===4?true:false:
                            //        control.readonly}

                            //    isDisabled={control.readonly}

                            //   isDisabled={control.readonly?
                            //        control.readonly:checkReadOnly}

                            /> : "" : ""
                            : "" :
                        <FormSelectSearch
                            name={control.label}
                            as={"select"}
                            onChange={(event) => this.props.onComboChange(event, control)}
                            formLabel={control.displayname[this.props.userInfo.slanguagetypecode] || control.label}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={control.label === 'Section' ? 
                                        this.props.ismaterialSectionneed ||this.props.isSectionneed === transactionStatus.YES ? true : false 
                                        : control.label === 'Expiry Policy Period' ? this.props.enableDisableExpiryPolicy === 'Expiry policy' ? true :false
                                        : control.label === 'Open Expiry Period' ? this.props.enableDisableOpenExpiry === 3 ? true :false
                                        : control.label === 'Next Validation Period' ? this.props.enableDisableNextValidation === 3 ? true :false
                                        : control.mandatory}
                            value={this.props.selectedRecord[control.label] ? this.props.selectedRecord[control.label] : ""}
                            options={this.props.comboData && this.props.comboData[control.label] ? this.props.comboData[control.label] : []}
                            optionId={"value"}
                            optionValue={"label"}
                            isMulti={false}
                            isClearable={control.label === 'Section' ? this.props.isSectionneed === transactionStatus.YES ? false : true : control.mandatory ? false : true
                            }
                            isDisabled={control.label === 'Inventory Transaction Type'||control.label === 'Transaction Type'
                             ? this.props.disablefields ? true : false : control.label === 'Next Validation Period' ? this.props.enableDisableNextValidation === 4 ? true : false :
                                control.label === 'Open Expiry Period' ?
                                    this.props.enableDisableOpenExpiry === 4 ? true : false :
                                    control.label === 'Expiry Policy Period' ?
                                        this.props.enableDisableExpiryPolicy !== 'Expiry policy' ? true : false :
                                        control.readonly ?
                                            control.readonly : checkReadOnly}
                        //    isDisabled={control.label==='Expiry Policy Period'?
                        //        this.props.enableDisableExpiryPolicy===4?true:false:
                        //        control.readonly}

                        //    isDisabled={control.readonly}

                        //   isDisabled={control.readonly?
                        //        control.readonly:checkReadOnly} 
                        />

                );
            }
            case 'textinput': {
                return (
                    <FormInput
                        name={control.label}
                        label={control.displayname[this.props.userInfo.slanguagetypecode] || control.label}
                        type="text"
                        value={this.props.selectedRecord[control.label] ? this.props.selectedRecord[control.label] : ""}
                        isMandatory={control.mandatory}
                        required={control.mandatory}
                        maxLength={control.sfieldlength}
                        isDisabled={control.readonly ?
                            control.readonly : checkReadOnly}
                        onChange={(event) => this.props.onInputOnChange(event, control.label)}
                    // id={control.nchecklistversionqbcode}
                    />

                );
            }
            case 'email': {
                return (
                    <FormEmail
                        name={control.label}
                        label={control.displayname[this.props.userInfo.slanguagetypecode] || control.label}
                        type="email"
                        value={this.props.selectedRecord[control.label] ? this.props.selectedRecord[control.label] : ""}
                        isMandatory={control.mandatory}
                        required={control.mandatory}
                        maxLength={control.sfieldlength}
                        isDisabled={control.readonly ?
                            control.readonly : checkReadOnly}
                        onChange={(event) => this.props.onInputOnChange(event, control.label)}
                    // id={control.nchecklistversionqbcode}
                    />
                );
            }
            case 'textarea': {
                // console.log(control.label, this.props.selectedRecord[control.label])
                return (
                    <FormTextarea
                        name={control.label}
                        label={control.displayname[this.props.userInfo.slanguagetypecode] || control.label}
                        type="text"
                        value={this.props.selectedRecord[control.label] ? this.props.selectedRecord[control.label] : ""}
                        isMandatory={control.mandatory}
                        required={control.mandatory}
                        onChange={(event) => this.props.onInputOnChange(event, control.label)}
                        rows="2"
                        maxLength={control.sfieldlength}
                        isDisabled={control.readonly ?
                            control.readonly : checkReadOnly}
                    />
                );
            }
            case 'selectaddedit': {
                // console.log(control.label, this.props.selectedRecord[control.label])
                return (
                    <ReactSelectAddEdit
                    name={control.label}
                    label={control.displayname[this.props.userInfo.slanguagetypecode] || control.label}
                    className="color-select"
                    classNamePrefix="react-select"
                     optionId={"sproductname"}
                    optionValue={"sproductname"}
                    value={this.props.selectedRecord[control.label] ? this.props.selectedRecord[control.label] : ""}
                    options={this.props.comboData && this.props.comboData[control.label] ? this.props.comboData[control.label] : []}
                    isMandatory={control.mandatory}
                    getValue={(event) => this.props.onComboChange(event, control)}
                   displayNameSearch={this.props.intl.formatMessage({ id: "IDS_SEARCH" })}
                />
                );
            }
            case 'toggle':
                return (
                    <CustomSwitch
                        label={control.displayname[this.props.userInfo.slanguagetypecode] || control.label}
                        type="switch"
                        name={control.label}
                        onChange={(event) => this.props.onInputOnChange(event)}
                        placeholder={control.label}
                        defaultValue={this.props.selectedRecord[control.label] && this.props.selectedRecord[control.label] === 3 ? true : false}
                        checked={this.props.selectedRecord[control.label] && this.props.selectedRecord[control.label] === 3 ? true : false}
                        //disabled={props.selectedRecord[props.extractedColumnList[2].controlName] === 3 ? true :false}
                        disabled={
                            control.label === 'Next Validation Need' ?
                            this.props.selectedRecord["Quarantine"] === 4 ? true : false 
                           // : control.label === 'Need Expiry' ? this.props.enableDisableNeedExpiry === 4 ? true : false 
                           :  control.readonly ? control.readonly : checkReadOnly}
                    />
                );
            case 5: {
                return (
                    <Form.Group>
                        <Form.Label>{control.displayname ?control.displayname[this.props.userInfo.slanguagetypecode] : control.squestion}{control.mandatory && <sup>*</sup>}</Form.Label>{ }
                    </Form.Group>
                );
            }
            case 6: {
                return (
                    <Form.Group>
                        <Form.Label htmlFor={control.squestion}>{control.squestion}{control.mandatory && <sup>*</sup>}</Form.Label>
                        <Button className="btn" name={control.squestion}>
                            {control.squestion}
                        </Button>
                    </Form.Group>
                );
            }
            case 'Numeric': {
                return (
                    !(control.label === 'Reorder Level' && this.props.ismaterialSectionneed &&
                     this.props.ismaterialSectionneed === transactionStatus.YES && this.props.operation === 'update' && this.props.isBreadCrumbCategory === true) ?
                     !(control.label === 'Reorder Level' && this.props.ismaterialSectionneed &&
                     this.props.ismaterialSectionneed === transactionStatus.YES && this.props.operation === 'update' && this.props.checkSectionNeed && this.props.checkSectionNeed === true) ? 
                    <FormNumericInput
                        name={control.label}
                        label={control.displayname[this.props.userInfo.slanguagetypecode] || control.label}
                        className="form-control"
                        type="text"
                        strict={true}
                       // value={this.props.selectedRecord[control.label] ? this.props.selectedRecord[control.label] : ""}
                       value={this.props.screenname === 'IDS_QUANTITYTRANSACTION' || this.props.screenname === 'IDS_MATERIALINVENTORY' ? 
                                    control.label === 'Received Quantity' ? 
                                    this.props.selectedRecord[control.label] ? this.props.selectedRecord[control.label]: "0" 
                                    : this.props.selectedRecord[control.label] ? this.props.selectedRecord[control.label] :"" 
                                    : this.props.selectedRecord[control.label] ? this.props.selectedRecord[control.label]:this.props.screenname === 'IDS_MATERIALACCOUNTING' ? 0 :""}
                        isMandatory={control.label === 'Next Validation' ? this.props.enableDisableNextValidation === 3 ? true : false 
                                  : control.label === 'Reorder Level' ? this.props.ismaterialSectionneed === transactionStatus.YES ? true : false 
                                  : control.label === 'Expiry Policy Days' ? this.props.enableDisableExpiryPolicy === 'Expiry policy' ? true : false 
                                  : control.label === 'Open Expiry' ? this.props.enableDisableOpenExpiry === 3 ? true : false 
                                  : control.mandatory}
                        required={
                            control.mandatory}
                        maxLength={control.sfieldlength}

                        isDisabled={control.label === 'Next Validation' ? this.props.enableDisableNextValidation === 4 ? true : false : control.label === 'Reorder Level' ?
                            this.props.ismaterialSectionneed &&
                                this.props.ismaterialSectionneed === transactionStatus.YES &&
                                this.props.operation === 'update' &&
                                this.props.isBreadCrumbCategory === true ? true : false :
                            control.label === 'Open Expiry' ?
                                this.props.enableDisableOpenExpiry === 4 ? true : false :
                                control.label === 'Expiry Policy Days' ?
                                    this.props.enableDisableExpiryPolicy !== 'Expiry policy' ? true : false :
                                    control.readonly ?
                                        control.readonly : checkReadOnly}

                        // isDisabled={control.readonly}

                        // isDisabled={control.readonly?
                        //     control.readonly:checkReadOnly}

                        onChange={(event) => this.props.onNumericInputChange(event, control.label)}
                        precision={this.props.screenname === 'IDS_QUANTITYTRANSACTION'
                            || this.props.screenname === 'IDS_MATERIALINVENTORY' ? control.label === 'Received Quantity' ?
                            this.props.nprecision : control.precision || 0 :
                            control.precision || 0}
                        max={this.props.screenname === 'IDS_MATERIALINVENTORY' &&
                        control.label  === 'Received Quantity' && this.props.isreusable===3?99:control.max}
                        min={control.min}
                        noStyle={true}
                    // id={control.nchecklistversionqbcode}
                    /> : "" : ""
                )
            }
            case 'date': {
                return (
                    // <DateTimePicker
                    //     name={control.squestion}
                    //     label={control.squestion}
                    //     placeholderText={"DD/MM/YYYY"}
                    //     showTimeSelect={control.dateonly==true?false:true}
                    //     selected={
                    //         selectedRecord && this.props.selectedRecord[control.label] ? new Date(this.props.selectedRecord[control.label]) : null
                    //     }
                    //     isMandatory={control.mandatory}
                    //     dateFormat="dd/MM/yyyy"
                    //     className='form-control'
                    //     onChange={(date) => this.props.handleDateChange(date, control.label)}
                    //     isClearable={true}
                    // />
                    <>
                        {this.props.userInfo.isutcenabled === transactionStatus.YES && this.props.userInfo.istimezoneshow === transactionStatus.YES ?
                            <Row>
                                <Col md={6}>
                                    <DateTimePicker
                                        name={control.label}
                                        label={control.displayname[this.props.userInfo.slanguagetypecode] || control.label}
                                        className='form-control'
                                        placeholderText={this.props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                                        selected={selectedRecord && this.props.selectedRecord[control.label] ? new Date(this.props.selectedRecord[control.label]) : control.loadcurrentdate ? new Date() : null}
                                        dateFormat={control.dateonly === true ? this.props.userInfo["ssitedate"] : control.timeonly ? 'HH:mm' : this.props.userInfo["ssitedatetime"]}
                                        timeInputLabel={this.props.intl.formatMessage({ id: "IDS_TIME" })}
                                        showTimeInput={control.dateonly === true ? false : true}
                                        showTimeSelectOnly={control.timeonly}
                                        isDisabled={control.label === 'Expiry Date & Time' ?
                                            this.props.isExpiryNeed ? this.props.isExpiryNeed === 4 ? true : false : control.readonly ?
                                                control.readonly : checkReadOnly : control.readonly ?
                                                control.readonly : checkReadOnly}
                                        // isClearable={false}
                                        isMandatory={control.mandatory}
                                        maxDate={this.props.CurrentTime}
                                        maxTime={this.props.CurrentTime}
                                        onChange={(date) => this.props.handleDateChange(date, control.label)}
                                        value={this.props.selectedRecord ? this.props.selectedRecord["dcollectiondate"] : new Date()}
                                    />
                                </Col>
                                <Col md={6}>
                                    <FormSelectSearch
                                        name={`tz${control.label}`}
                                        as={"select"}
                                        onChange={(event) => this.props.onComboChange(event, control, `tz${control.label}`)}
                                        formLabel={this.props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        isMandatory={true}
                                        // defaultValue={this.props.defaultTimeZone}
                                        value={this.props.selectedRecord[`tz${control.label}`] ? this.props.selectedRecord[`tz${control.label}`] : this.props.defaultTimeZone}
                                        options={this.props.timeZoneList}
                                        optionId={"value"}
                                        optionValue={"label"}
                                        isMulti={false}

                                        isDisabled={`tz${control.label}` === 'tzExpiry Date & Time' ?
                                            this.props.isExpiryNeed ? this.props.isExpiryNeed === 4 ? true : false : control.readonly ?
                                                control.readonly : checkReadOnly : control.readonly ?
                                                control.readonly : checkReadOnly}

                                        // isDisabled={control.readonly}

                                        // isDisabled={control.readonly?
                                        //     control.readonly:checkReadOnly}

                                        isSearchable={false}
                                        isClearable={false}
                                    />
                                </Col>
                            </Row> :
                            <DateTimePicker
                                name={control.label}
                                label={control.displayname[this.props.userInfo.slanguagetypecode] || control.label}
                                className='form-control'
                                placeholderText={this.props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                                selected={selectedRecord && this.props.selectedRecord[control.label] ? new Date(this.props.selectedRecord[control.label]) : null}
                                dateFormat={control.dateonly === true ? this.props.userInfo["ssitedate"] : control.timeonly ? 'HH:mm' : this.props.userInfo["ssitedatetime"]}
                                timeInputLabel={this.props.intl.formatMessage({ id: "IDS_TIME" })}
                                showTimeInput={control.dateonly === true ? false : true}
                                showTimeSelectOnly={control.timeonly}
                                // isClearable={false}
                                isMandatory={control.mandatory}
                                maxDate={this.props.CurrentTime}
                                maxTime={this.props.CurrentTime}
                                onChange={(date) => this.props.handleDateChange(date, control.label)}
                                value={this.props.selectedRecord ? this.props.selectedRecord["dcollectiondate"] : new Date()}
                            />
                        }

                    </>
                );
            }
            case 'checkbox': {
                let checkboxes = control.radioOptions ? control.radioOptions.tags : []
                const data = this.props.selectedRecord[control.label] ?
                    this.props.selectedRecord[control.label].split(",") : [];
                //console.log('checkbox:', checkboxes)

                return (
                    <InputGroup size={'lg'}>
                        <Form.Group>
                            <Form.Label as="legend" htmlFor={control.label}>{
                                control.displayname[this.props.userInfo.slanguagetypecode] || control.label}{control.mandatory ? <sup>*</sup> : ""}</Form.Label>
                            {checkboxes.map(checkbox =>

                                <Form.Check
                                    inline={true}
                                    type="checkbox"
                                    name={control.label}
                                    label={checkbox.displayname ? checkbox.displayname[this.props.userInfo.slanguagetypecode] : checkbox.text}
                                    // label={checkbox.text}
                                    onChange={(event) => this.props.onInputOnChange(event, checkbox.text)}
                                    id={checkbox.id}

                                    checked={this.props.selectedRecord[control.label] ?
                                        data.includes(checkbox.text.trim()) ? true : false : false}

                                    defaultChecked={this.props.selectedRecord[control.label] ?
                                        data.includes(checkbox.text.trim()) ? true : false : false}

                                    // defaultChecked={this.props.selectedRecord[control.label] === 3 ? true : false}
                                    isMandatory={control.mandatory}
                                    required={control.mandatory}
                                    size={'lg'}
                                />

                            )}
                        </Form.Group>
                    </InputGroup >

                );
            }
            case 'radio': {
                let radioButtons = control.radioOptions ? control.radioOptions.tags : []
                return (
                    <fieldset>
                        <Form.Group>
                            <Form.Label as="legend" htmlFor={control.label}>{control.displayname[this.props.userInfo.slanguagetypecode] || control.label}{control.mandatory ? <sup>*</sup> : ""}</Form.Label>
                            {radioButtons.map(radioButton =>

                                <Form.Check
                                    inline={true}
                                    type="radio"
                                    name={control.label}
                                    label={radioButton.displayname ? radioButton.displayname[this.props.userInfo.slanguagetypecode]  :  radioButton.text}
                                    onChange={(event) => this.props.onInputOnChange(event, radioButton.text)}
                                    id={radioButton.id}
                                    checked={selectedRecord[control.label] ?
                                        radioButton.text.trim() === selectedRecord[control.label].trim() ? true : false : false}
                                    defaultChecked={selectedRecord[control.label] ?
                                        radioButton.text.trim() === selectedRecord[control.label].trim() ? true : false : false}
                                    isMandatory={control.mandatory}
                                    required={control.mandatory}
                                    disabled={control.readonly ?
                                        control.readonly : checkReadOnly}
                                />

                            )}
                        </Form.Group>
                    </fieldset>
                );
            }
            case 'files': {
                return (
                    <DropZone
                        name={control.label}
                        label={control.displayname[this.props.userInfo.slanguagetypecode] || control.label}
                        maxFiles={control.maxFiles || 1}
                        accept={control.accept && control.accept.value}
                        minSize={0}
                        maxSize={1}
                        onDrop={(event) => this.props.onDropFile(event, control.label, 1)}
                        multiple={control.maxFiles > 1 ? true : false}
                        editFiles={this.props.selectedRecord ? this.props.selectedRecord : {}}
                        // attachmentTypeCode={this.props.operation === "update" ? attachmentType.PRN : ""}
                        // fileSizeName="nfilesize"
                        fileName={control.label}
                        deleteAttachment={this.props.deleteAttachment}
                        actionType={this.props.actionType}
                    />
                )
            }
            default:
                return ("");
        }
    }
    onSaveClick = () => {
        if (this.props.needValidation) {
            const failedControls = [];
            const mandatoryFields = [];
            this.props.templateData.map(control =>
                control.nmandatoryfield === transactionStatus.YES ? mandatoryFields.push(control) : ''

            )
            mandatoryFields.forEach(item => {

                if (this.props.selectedRecord && this.props.selectedRecord[item.nchecklistversionqbcode] && this.props.selectedRecord[item.nchecklistversionqbcode].sdefaultvalue) {
                    if (typeof this.props.selectedRecord[item.nchecklistversionqbcode].sdefaultvalue === "object") {
                        //to validate FormSelectSearch component
                        if (this.props.selectedRecord[item.nchecklistversionqbcode].sdefaultvalue.length === 0) {
                            const alertMessage = item.squestion
                            failedControls.push(alertMessage);
                        }
                    }
                    else if (typeof this.props.selectedRecord[item.nchecklistversionqbcode].sdefaultvalue === "string") {
                        if (this.props.selectedRecord[item.nchecklistversionqbcode].sdefaultvalue.trim().length === 0) {
                            const alertMessage = item.squestion
                            failedControls.push(alertMessage);
                        }
                    }
                    else {
                        if (this.props.selectedRecord[item.nchecklistversionqbcode].sdefaultvalue.length === 0) {
                            const alertMessage = item.squestion
                            failedControls.push(alertMessage);
                        }
                    }
                }
                else {
                    const alertMessage = item.squestion
                    failedControls.push(alertMessage);
                }
            });
            // console.log("validationPassed:", failedControls);

            if (failedControls.length === 0) {
                this.props.onSaveClick(this.props.selectedRecord, this.props.Login.userInfo, this.props.nregtypecode, this.props.nregsubtypecode)
            }
            else {

                toast.info(`${this.props.intl.formatMessage({ id: "IDS_ENTER" })} ${failedControls[0]}`);


            }
        } else {
            this.props.onSaveClick(this.props.selectedRecord, this.props.Login.userInfo, this.props.nregtypecode, this.props.nregsubtypecode)
        }
    }
    componentDidMount() {

        if (this.props.triggerCallback !== undefined && this.props.enableCallback)
            setTimeout(() => {
                this.props.triggerCallback(this.formElement.current.clientHeight + 30);
            }, 200)


    }
    render() {
        // this.props.templateData && Object.keys(this.props.templateData).map(design =>
        // )
        return (
            <div ref={this.formElement}>
                {
                    this.props.templateData ?
                        this.props.templateData.map((item) =>
                            <Row>
                                {item.children.length > 0 ?
                                    item.children.map((column) =>
                                        <Col md={12 / item.children.length}>
                                            {
                                                column.children.map((component) => {
                                                    return (
                                                        component.hasOwnProperty("children") ?
                                                            <Row>
                                                                {component.children.map(componentrow =>
                                                                    <Col md={12 / component.children.length}>
                                                                        {this.renderSwitch(componentrow, this.props.selectedRecord)}
                                                                    </Col>
                                                                )
                                                                }
                                                            </Row>
                                                            : <>
                                                                {this.renderSwitch(component, this.props.selectedRecord)}
                                                            </>
                                                    )
                                                })
                                            }

                                        </Col>
                                    )
                                    : ""}
                            </Row>
                        )
                        :
                        ""
                }
            </div>



        )
    }
}

export default injectIntl(DynamicSlideoutMaterial);