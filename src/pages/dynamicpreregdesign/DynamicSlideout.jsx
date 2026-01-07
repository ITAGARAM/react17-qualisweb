import React from 'react'
import { Row, Col, Button, Form, InputGroup, Nav } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import FormInput from '../../components/form-input/form-input.component';
import LabelComponent from '../../components/label/label.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { orderType, transactionStatus, SampleType,formCode } from '../../components/Enumeration'
import { toast } from 'react-toastify';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormEmail from '../../components/form-email/form-email.component';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import DropZone from '../../components/dropzone/dropzone.component';
import { faPlus, faSearch,  faFilter, faEye,  faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormSelectSearchComponent from '../../components/form-select-search/Form-select-search-componnet';

// import CollapseTransition from './collapseTransition'

class DynamicSlideout extends React.Component {
    constructor(props) {
        super(props);
        this.formElement = React.createRef();
        this.select = [];
        let count = 0;
        this.focusCount = -1;

        this.props.templateData && this.props.templateData.map((item) =>
            item.children.map((column) =>
                column.children.map((componnet) => {
                    if (componnet.hasOwnProperty('children')) {
                        componnet.children.map((componnetrow) => {
                            if (componnetrow.inputtype === 'combo' || componnetrow.inputtype === 'textinput') {
                                if (componnetrow.autoFocus) {
                                    this.focusCount = count;
                                }
                            }
                            count++;
                        }
                        )
                    } else {
                        if (componnet.inputtype === 'combo' || componnet.inputtype === 'textinput') {
                            if (componnet.autoFocus) {
                                this.focusCount = count;
                            }
                        }
                        count++;
                    }
                }
                )
            ))
        if (this.focusCount !== -1)
            this.select[this.focusCount] = React.createRef();
    }
    renderSwitch = (control, selectedRecord, componentLength, componentRowLength, count1) => {

        
        const index = this.props.editfield ?
            this.props.editfield.findIndex(x => x.label === control.label) : -1
        let checkReadOnly = false;
        if (index !== -1 ) {
            if(this.props.userInfo.nformcode===formCode.SCHEDULERCONFIGURATION && this.props.operation==='update'
                 && this.props.selectedSample && this.props.selectedSample.ntransactionstatus===transactionStatus.DRAFT){
                checkReadOnly=false;  
              }else if (this.props.userInfo.nformcode===formCode.STUDYALLOCATION){
                checkReadOnly=false;  
              }else{
            const listdata = (this.props.editfield[index] && this.props.editfield[index].editableuntill) || []
            checkReadOnly = listdata ? this.props.selectedSample && this.props.selectedSample.ntransactionstatus ?
                !listdata.includes(this.props.selectedSample.ntransactionstatus)
                : false : false
              }
        }


        // if(control.name  && control.name === 'manualordertype')
        // {
        //     manualOrderTypeData = this.props.selectedRecord[control.label];
        // }

        // if(control.name  && control.name === 'manualordertype')
        // {
        //     if(this.props.templateData)
        //     {
        //         for (var i = 0; i < this.props.templateData.length; i++) {

        //             if (this.props.templateData[i].children)
        //             {
        //                 for (var j = 0; j < this.props.templateData[i].children.length; j++) {

        //                     if (this.props.templateData[i].children[j].children)
        //                     {
        //                         for (var k = 0; k < this.props.templateData[i].children[j].children.length; k++) {
        //                             if(this.props.templateData[i].children[j].children[k].name === 'manualordertype')
        //                             {
        //                                 manualOrderTypeData = this.props.selectedRecord[this.props.templateData[i].children[j].children[k].label];
        //                                 break;
        //                             }
        //                         }
        //                     }  
        //                     else{
        //                         if(this.props.templateData[i].children[j].name === 'manualordertype')
        //                         {
        //                             manualOrderTypeData = this.props.selectedRecord[this.props.templateData[i].children[j].label];
        //                             break;
        //                         }
        //                     }                      

        //                 }
        //             }            


        //         }

        //     }
        // }
        // console.log("control.name, manualOrderTypeData:", control.name, manualOrderTypeData);
        // if (control.name  && control.name === 'manualorderid'){
        //     if(this.props.sampleType.value === 5 ){
        //         if(this.props.sampleType.item.nportalrequired === 3){
        //             if(manualOrderTypeData.value === 1){
        //                 //manual order
        //                 showAddMaster = true;                        
        //             }
        //         }
        //         else{
        //             showAddMaster = true;
        //         }
        //     }  
        //     else{
        //         showAddMaster = true;
        //     }                     
        // }
        // else{
        //     showAddMaster = true;
        // }
        //console.log("showAddMaster:", showAddMaster);




        switch (control.inputtype) {
            case 'frontendsearchfilter': {
                return (
                    <Row style={{ height: '50px' }}>
                        <Col md={12}>

                            <button className="btn btn-primary btn-padd-custom"
                                disabled={control.recordbasedreadonly ?
                                    this.props.selectedRecord[control.radioparentLabel] === control.recordbasedhide : false}
                                // style={{ "float": "right", "margin-right": "6px" }}
                                onClick={(e) => this.props.custombuttonclick(e, control)}
                            >
                                <FontAwesomeIcon icon={faFilter}></FontAwesomeIcon> { }
                                {this.props.intl.formatMessage({ id: control.label })}
                            </button>
                        </Col>
                    </Row>
                );
            }
            case 'backendsearchfilter': {
                return (
                    <>
                        {
                            control.table.item.masterAdd && control.isAddMaster
                                && this.props.userRoleControlRights && this.props.userRoleControlRights[control.table.item.nformcode] &&
                                (this.props.userRoleControlRights[control.table.item.nformcode].findIndex(x => x.ncontrolcode === control.table.item.addControlCode) !== -1) ?
                                <Row style={{ height: '50px' }}>
                                    <Col md={componentLength === 1 ? componentRowLength > 1 ? 10 : 11 : componentRowLength > 1 ? 8 : 10}>
                                        <button className="btn btn-primary btn-padd-custom"
                                            disabled={control.recordbasedreadonly ?
                                                this.props.selectedRecord[control.radioparentLabel] === control.recordbasedhide : false}
                                            // style={{ "float": "right", "margin-right": "6px" }}
                                            onClick={(e) => this.props.custombuttonclick(e, control)}
                                        >
                                            <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon> { }
                                            {this.props.intl.formatMessage({ id: control.label })}
                                        </button>
                                    </Col>
                                    <Col md={1}>
                                        <Nav.Link
                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                            className="btn btn-circle outline-grey mr-2"
                                            onClick={(e) => this.props.addMasterRecord(control)}
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                        </Nav.Link>
                                    </Col>
                                </Row> : <Row style={{ height: '50px' }}>
                                    <Col md={12}>
                                        <button className="btn btn-primary btn-padd-custom"
                                            disabled={control.recordbasedreadonly ?
                                                this.props.selectedRecord[control.radioparentLabel] === control.recordbasedhide : false}
                                            // style={{ "float": "right", "margin-right": "6px" }}
                                            onClick={(e) => this.props.custombuttonclick(e, control)}
                                        >
                                            <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon> { }
                                            {this.props.intl.formatMessage({ id: control.label })}
                                        </button>
                                    </Col></Row>}
                    </>
                );
            }
            case 'combo': {
                // console.log(this.props.sampleType)
                // console.log('check',(control.table.item.masterAdd && control.isAddMaster
                //     && this.props.userRoleControlRights && this.props.userRoleControlRights[control.table.item.nformcode] &&
                //     (this.props.userRoleControlRights[control.table.item.nformcode].findIndex(x => x.ncontrolcode === control.table.item.addControlCode) !== -1) 
                //     &&(this.props.sampleType&&this.props.sampleType.value === 5))
                //    );
                return (
                    <>  
                    
                    
                    
                    <Row>

                        
                        {control.name && control.name === 'manualsampleid' ? (this.props.sampleType && this.props.sampleType.value === SampleType.CLINICALTYPE
                            && this.props.sampleType.item.nportalrequired === transactionStatus.YES
                            && this.props.comboComponents
                            && this.props.comboComponents[this.props.comboComponents.findIndex(x => x.name === 'manualordertype')] &&
                            this.props.selectedRecord[this.props.comboComponents[this.props.comboComponents.findIndex(x => x.name === 'manualordertype')].label] &&
                            this.props.selectedRecord[this.props.comboComponents[this.props.comboComponents.findIndex(x => x.name === 'manualordertype')].label].value === orderType.MANUAL) ? "" :
                            <Col md={12}
                            //md={componentLength === 1 ? componentRowLength > 1 ? 10 : 11 : componentRowLength > 1 ? 8 : 10}
                            >
                                <FormSelectSearchComponent
                                    name={control.label}
                                    as={"select"}
                                    onChange={(event) => this.props.onComboChange(event, control)}
                                    formLabel={control.displayname[this.props.userInfo.slanguagetypecode] || control.label}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isMandatory={control.mandatory}
                                    value={this.props.selectedRecord[control.label] ? this.props.selectedRecord[control.label] : ""}
                                    options={this.props.comboData && this.props.comboData[control.label] ? this.props.comboData[control.label] : []}
                                    optionId={"value"}
                                    optionValue={"label"}
                                    isMulti={false}
                                    isClearable={control.mandatory ? false : true}
                                    isDisabled={((this.props.operation && this.props.operation === "update") && (control.iseditablereadonly && control.iseditablereadonly === true) && !checkReadOnly)? false : (control.recordbasedreadonly ?
                                        this.props.selectedRecord[control.radioparentLabel] === control.recordbasedhide : control.readonly ?
                                            control.readonly : checkReadOnly)}
                                    isSearchable={true}
                                    select={ this.select[count1]&&this.select[count1]}

                                />
                            </Col> :
                            <Col md={(control.isAddMaster && control.isEditMaster) ? 8 : (control.isAddMaster || control.isEditMaster || control.isView) ? 10 : 12}
                            //md={componentLength === 1 ? componentRowLength > 1 ? 10 : 11 : componentRowLength > 1 ? 8 : 10}
                            >
                                <FormSelectSearchComponent
                                    name={control.label}
                                    as={"select"}
                                    onChange={(event) => this.props.onComboChange(event, control)}
                                    formLabel={control.displayname[this.props.userInfo.slanguagetypecode] || control.label}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isMandatory={control.mandatory}
                                    value={this.props.selectedRecord[control.label] ? this.props.selectedRecord[control.label] : ""}
                                    options={this.props.comboData && this.props.comboData[control.label] ? this.props.comboData[control.label] : []}
                                    optionId={"value"}
                                    optionValue={"label"}
                                    isMulti={false}
                                    isClearable={control.mandatory ? false : true}
                                    isDisabled={((this.props.operation && this.props.operation === "update") && (control.iseditablereadonly && control.iseditablereadonly === true) && !checkReadOnly)? false : (control.recordbasedreadonly ?
                                        this.props.selectedRecord[control.radioparentLabel] === control.recordbasedhide : control.readonly ?
                                            control.readonly : checkReadOnly)}
                                    isSearchable={true}
                                    select={this.focusCount === count1 ? this.select[count1] : undefined}

                                />
                            </Col>}

                        {control.table.item.masterAdd && (control.isAddMaster || control.isEditMaster)
                            ?
                            control.name && control.name === 'manualorderid'
                                ? (this.props.sampleType && this.props.sampleType.value === SampleType.CLINICALTYPE
                                    && this.props.sampleType.item.nportalrequired === transactionStatus.YES
                                    && this.props.comboComponents
                                    && this.props.comboComponents[this.props.comboComponents.findIndex(x => x.name === 'manualordertype')] &&
                                    this.props.selectedRecord[this.props.comboComponents[this.props.comboComponents.findIndex(x => x.name === 'manualordertype')].label] &&
                                    this.props.selectedRecord[this.props.comboComponents[this.props.comboComponents.findIndex(x => x.name === 'manualordertype')].label].value === orderType.MANUAL)
                                    ? (<>
                                        {control.isAddMaster && this.props.userRoleControlRights && this.props.userRoleControlRights[control.table.item.nformcode] &&
                                            (this.props.userRoleControlRights[control.table.item.nformcode].findIndex(x => x.ncontrolcode === control.table.item.addControlCode) !== -1) &&
                                            <Col md={1}>

                                                <Nav.Link
                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                    className="btn btn-circle outline-grey mr-2"
                                                    disabled={this.props.operation === "update"}
                                                    onClick={(e) => this.props.addMasterRecord(control)}
                                                >
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </Nav.Link>
                                            </Col>}
                                        {control.isEditMaster && this.props.userRoleControlRights && this.props.userRoleControlRights[control.table.item.nformcode] &&
                                            (this.props.userRoleControlRights[control.table.item.nformcode].findIndex(x => x.ncontrolcode === control.table.item.editControlCode) !== -1)
                                            &&
                                            <Col md={1}>
                                                <Nav.Link
                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                    className="btn btn-circle outline-grey mr-2"
                                                    disabled={this.props.operation === "update"}
                                                    onClick={(e) => this.props.editMasterRecord(control, this.props.selectedRecord[control.label])}
                                                >
                                                    <FontAwesomeIcon icon={faPencilAlt} />
                                                </Nav.Link>
                                            </Col>
                                        }
                                    </>)

                                    : ""
                                : (<>
                                    {control.isAddMaster && this.props.userRoleControlRights && this.props.userRoleControlRights[control.table.item.nformcode] &&
                                        (this.props.userRoleControlRights[control.table.item.nformcode].findIndex(x => x.ncontrolcode === control.table.item.addControlCode) !== -1) &&
                                        <Col md={1}>
                                            <Nav.Link
                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                className="btn btn-circle outline-grey mr-2"
                                                disabled={this.props.operation === "update"}
                                                onClick={(e) => this.props.addMasterRecord(control)}
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </Nav.Link>
                                        </Col>
                                    }
                                    {control.isEditMaster && this.props.userRoleControlRights && this.props.userRoleControlRights[control.table.item.nformcode] &&
                                        (this.props.userRoleControlRights[control.table.item.nformcode].findIndex(x => x.ncontrolcode === control.table.item.editControlCode) !== -1)
                                        && (
                                            <Col md={1}>
                                                <Nav.Link
                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                    className="btn btn-circle outline-grey mr-2"
                                                    disabled={this.props.operation === "update"}
                                                    onClick={(e) => this.props.editMasterRecord(control, this.props.selectedRecord[control.label])}
                                                >
                                                    <FontAwesomeIcon icon={faPencilAlt} />
                                                </Nav.Link>
                                            </Col>
                                        )
                                    }
                                </>)

                            : ""
                        }

                        {control.isView && (this.props.sampleType && this.props.sampleType.value === SampleType.CLINICALTYPE
                            && this.props.sampleType.item.nportalrequired === transactionStatus.YES
                            && this.props.comboComponents
                            && this.props.comboComponents[this.props.comboComponents.findIndex(x => x.name === 'manualordertype')] &&
                            this.props.selectedRecord[this.props.comboComponents[this.props.comboComponents.findIndex(x => x.name === 'manualordertype')].label] &&
                            this.props.selectedRecord[this.props.comboComponents[this.props.comboComponents.findIndex(x => x.name === 'manualordertype')].label].value === orderType.EXTERNAL) ?

                            <Col md={1}>
                                <Nav.Link
                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_VIEW" })}
                                    className="btn btn-circle outline-grey mr-2"
                                    disabled={this.props.operation === "update"}
                                    onClick={(e) => this.props.onClickView(control)}
                                >
                                    <FontAwesomeIcon icon={faEye} />
                                </Nav.Link>
                            </Col> : ""}
                            {/* { 
                                (<>
                                         {control.isAddMaster && this.props.userRoleControlRights && this.props.userRoleControlRights[control.table.item.nformcode] &&
                                            (this.props.userRoleControlRights[control.table.item.nformcode].findIndex(x => x.ncontrolcode === control.table.item.addControlCode) !== -1) &&
                                            <Col md={1}>

                                                <Nav.Link
                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                    className="btn btn-circle outline-grey mr-2"
                                                    disabled={this.props.operation === "update"}
                                                    onClick={(e) => this.props.addMasterRecord(control)}
                                                >
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </Nav.Link>
                                            </Col>}
                                            {control.isEditMaster && this.props.userRoleControlRights && this.props.userRoleControlRights[control.table.item.nformcode] &&
                                            (this.props.userRoleControlRights[control.table.item.nformcode].findIndex(x => x.ncontrolcode === control.table.item.editControlCode) !== -1)
                                            &&   <Col md={1}>
                                                <Nav.Link
                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                    className="btn btn-circle outline-grey mr-2"
                                                    disabled={this.props.operation === "update"}
                                                    onClick={(e) => this.props.editMasterRecord(control, this.props.selectedRecord[control.label])}
                                                >
                                                    <FontAwesomeIcon icon={faPencilAlt} />
                                                </Nav.Link>
                                            </Col>
                                        }
                                    </>)      
                            } */}

                    </Row>
                    </>
                );

            }
            case 'textinput': {
                return (
                    <FormInput
                        name={control.label}
                        label={control.displayname[this.props.userInfo.slanguagetypecode] || control.label}
                        type="text"
                        placeholder={control.displayname[this.props.userInfo.slanguagetypecode] || control.label}
                        value={this.props.selectedRecord[control.label] ? this.props.selectedRecord[control.label] : ""}
                        isMandatory={control.mandatory}
                        required={control.mandatory}
                        maxLength={ control.sfieldlength}
                      isDisabled={((this.props.operation && this.props.operation === "update") && (control.iseditablereadonly && control.iseditablereadonly === true) && !checkReadOnly)? false  : (control.recordbasedreadonly ?
                            this.props.selectedRecord[control.radioparentLabel] === control.recordbasedhide : control.readonly ?
                                control.readonly : checkReadOnly)}
                        onChange={(event) => this.props.onInputOnChange(event,control, control.label)}
                        inputRef={this.focusCount === count1 ? this.select[count1] : undefined}
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
                        placeholder={control.displayname[this.props.userInfo.slanguagetypecode] || control.label}
                        isMandatory={control.mandatory}
                        required={control.mandatory}
                        maxLength={control.sfieldlength}
                        isDisabled={((this.props.operation && this.props.operation === "update") && (control.iseditablereadonly && control.iseditablereadonly === true) && !checkReadOnly)? false :(control.recordbasedreadonly ?
                            this.props.selectedRecord[control.radioparentLabel] === control.recordbasedhide : control.readonly ?
                                control.readonly : checkReadOnly)}
                        onChange={(event) => this.props.onInputOnChange(event, control.label)}
                    // ref={this.select}
                    />
                );
            }
            case 'textarea': {
                return (
                    <FormTextarea
                        name={control.label}
                        label={control.displayname[this.props.userInfo.slanguagetypecode] || control.label}
                        type="text"
                        value={this.props.selectedRecord[control.label] ? this.props.selectedRecord[control.label] : ""}
                        placeholder={control.displayname[this.props.userInfo.slanguagetypecode] || control.label}
                        isMandatory={control.mandatory}
                        required={control.mandatory}
                        onChange={(event) => this.props.onInputOnChange(event, control.label)}
                        rows="2"
                        maxLength={control.sfieldlength}
                        isDisabled={((this.props.operation && this.props.operation === "update") && (control.iseditablereadonly && control.iseditablereadonly === true) && !checkReadOnly)? false :control.recordbasedreadonly ?
                            this.props.selectedRecord[control.radioparentLabel] === control.recordbasedhide : control.readonly ?
                                control.readonly : checkReadOnly}
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
                        disabled={((this.props.operation && this.props.operation === "update") && (control.iseditablereadonly && control.iseditablereadonly === true) && !checkReadOnly)? false : (control.readonly ?
                            control.readonly : checkReadOnly)}
                    />
                );
            case 5: {
                return (
                    <Form.Group>
                        <Form.Label>{control.isMultiLingualLabel ? this.props.intl.formatMessage({
                            id: control.squestion
                        }) : control.squestion}{control.mandatory && <sup>*</sup>}</Form.Label>{ }
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
                    <FormNumericInput
                        name={control.label}
                        label={control.displayname[this.props.userInfo.slanguagetypecode] || control.label}
                        className="form-control"
                        type="text"
                        strict={true}
                        value={control.precision && control.precision.length > 0 ? this.props.selectedRecord[control.label]  :this.props.selectedRecord[control.label]? this.props.selectedRecord[control.label] : ""}
                        isMandatory={control.mandatory}
                        required={
                            control.mandatory}
                        maxLength={control.sfieldlength}
                        isDisabled={((this.props.operation && this.props.operation === "update") && (control.iseditablereadonly && control.iseditablereadonly === true) && !checkReadOnly)? false : (control.recordbasedreadonly ?
                            this.props.selectedRecord[control.radioparentLabel] === control.recordbasedhide : control.readonly ?
                                control.readonly : checkReadOnly)}
                        onChange={(event) => this.props.onNumericInputChange(event, control.label)}
                        precision={control.precision || 0}
                        onBlur={(event) => this.props.onNumericBlur(event, control)}
                        // max={control.max}
                        //min={control.min}
                        noStyle={true}
                       
                    />
                )
            }
            case 'date': {
                return (
                    <>
                        {control.timezone ?
                            <Row>
                                <Col md={6}>
                                    <DateTimePicker
                                        name={control.label}
                                        label={control.displayname[this.props.userInfo.slanguagetypecode] || control.label}
                                        className='form-control'
                                        placeholderText={this.props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                                        selected={selectedRecord && this.props.selectedRecord[control.label] ?
                                            new Date(this.props.selectedRecord[control.label]) : control.loadcurrentdate ? new Date() : null}
                                        dateFormat={control.dateonly === true ? this.props.userInfo["ssitedate"] : control.timeonly ? 'HH:mm' : this.props.userInfo["ssitedatetime"]}
                                        timeInputLabel={this.props.intl.formatMessage({ id: "IDS_TIME" })}
                                        showTimeInput={control.dateonly === true ? false : true}
                                        showTimeSelectOnly={control.timeonly}
                                        isDisabled={((this.props.operation && this.props.operation === "update") && (control.iseditablereadonly && control.iseditablereadonly === true) && !checkReadOnly)? false : (control.recordbasedreadonly ?
                                            this.props.selectedRecord[control.parentLabel] === control.recordbasedhide : control.readonly ?
                                                control.readonly : checkReadOnly)}
                                        // isClearable={false}
                                        isMandatory={control.mandatory}
                                        maxDate={control.maxdate ? new Date(control.maxdate) : this.props.CurrentTime}
                                        maxTime={control.maxdate ? new Date(control.maxdate) : this.props.CurrentTime}
                                        minDate={control.mindate ? new Date(control.mindate) : this.props.CurrentTime}
                                        minTime={control.mindate ? new Date(control.mindate) : this.props.CurrentTime}
                                        onChange={(date) => this.props.handleDateChange(date, control.label)}
                                        value={this.props.selectedRecord[control.label + "value"] ?
                                            new Date(this.props.selectedRecord[control.label + "value"]) : new Date()}
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

                                        isDisabled={((this.props.operation && this.props.operation === "update") && (control.iseditablereadonly && control.iseditablereadonly === true) && !checkReadOnly)? false : (control.readonly ?
                                            control.readonly : checkReadOnly)}
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
                                selected={selectedRecord && this.props.selectedRecord[control.label] ?
                                    new Date(this.props.selectedRecord[control.label]) : null}
                                dateFormat={control.dateonly === true ? this.props.userInfo["ssitedate"] : control.timeonly ? 'HH:mm' : this.props.userInfo["ssitedatetime"]}
                                timeInputLabel={this.props.intl.formatMessage({ id: "IDS_TIME" })}
                                showTimeInput={control.dateonly === true ? false : true}
                                showTimeSelectOnly={control.timeonly}
                                // isClearable={false}
                                isDisabled={((this.props.operation && this.props.operation === "update") && (control.iseditablereadonly && control.iseditablereadonly === true) && !checkReadOnly)? false : (control.recordbasedreadonly ?
                                    this.props.selectedRecord[control.parentLabel] === control.recordbasedhide : control.readonly ?
                                        control.readonly : checkReadOnly)}
                                isMandatory={control.mandatory}
                                maxDate={control.hideafterdate ? this.props.selectedRecord[control.label + "max"] ?
                                    this.props.selectedRecord[control.label + "max"] : this.props.CurrentTime : this.props.CurrentTime}
                                maxTime={control.hideafterdate ? this.props.selectedRecord[control.label + "max"] ?
                                    this.props.selectedRecord[control.label + "max"] : this.props.CurrentTime : this.props.CurrentTime}
                                minDate={control.hidebeforedate ? this.props.selectedRecord[control.label + "min"] ?
                                    this.props.selectedRecord[control.label + "min"] : this.props.CurrentTime : this.props.CurrentTime}
                                minTime={control.hidebeforedate ? this.props.selectedRecord[control.label + "min"] ?
                                    this.props.selectedRecord[control.label + "min"] : this.props.CurrentTime : this.props.CurrentTime}
                                onChange={(date) => this.props.handleDateChange(date, control.label)}
                                value={this.props.selectedRecord[control.label + "value"] ?
                                    this.props.selectedRecord[control.label + "value"] : new Date()}
                                openToDate={this.props.selectedRecord[control.label + "value"] ?
                                    this.props.selectedRecord[control.label + "value"] : new Date()}
                               // showTimeInput={true}

                            />
                        }

                    </>
                );
            }
            case 'checkbox': {
                let checkboxes = control.radioOptions ? control.radioOptions.tags : []
                const data = this.props.selectedRecord[control.label] ?
                    this.props.selectedRecord[control.label].toLowerCase().split(",") : [];

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
                                    label={control.isMultiLingualLabel ? this.props.intl.formatMessage({ id: checkbox.text }) : checkbox.text}
                                    // label={checkbox.text}
                                    onChange={(event) => this.props.onInputOnChange(event,control, checkbox.text)}
                                    id={checkbox.id}

                                    checked={this.props.selectedRecord[control.label] ?
                                        data.includes(checkbox.text.toLowerCase().trim()) ? true : false : false}

                                    defaultChecked={this.props.selectedRecord[control.label] ?
                                        data.includes(checkbox.text.toLowerCase().trim()) ? true : false : false}
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
                                    label={radioButton.text}
                                    onChange={(event) => this.props.onInputOnChange(event,control, radioButton.text)}
                                    id={radioButton.id}
                                    checked={selectedRecord[control.label] ?
                                        radioButton.text.toLowerCase().trim() === selectedRecord[control.label].toLowerCase().trim() ? true : false : false}
                                    defaultChecked={selectedRecord[control.label] ?
                                        radioButton.text.toLowerCase().trim() === selectedRecord[control.label].toLowerCase().trim() ? true : false : false}
                                    isMandatory={control.mandatory}
                                    required={control.mandatory}
                                    disabled={((this.props.operation && this.props.operation === "update") && (control.iseditablereadonly && control.iseditablereadonly === true) && !checkReadOnly)? false : (control.readonly ?
                                        control.readonly : checkReadOnly)}
                                />

                            )}
                        </Form.Group>
                    </fieldset>
                );
            }
            case 'predefineddropdown': {
                let radioButtons = control.radioOptions && control.radioOptions.tags.map(x => {
                    return { label: x.text, value: x.text }
                })
                return (
                    <FormSelectSearch
                        name={control.label}
                        as={"select"}
                        onChange={(event) => this.props.onComboChange(event, control)}
                        formLabel={control.displayname[this.props.userInfo.slanguagetypecode] || control.label}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={control.mandatory}
                        value={this.props.selectedRecord[control.label] ? this.props.selectedRecord[control.label] : ""}
                        options={radioButtons || []}
                        isMulti={false}
                        isClearable={control.mandatory ? false : true}
                        isDisabled={((this.props.operation && this.props.operation === "update") && (control.iseditablereadonly && control.iseditablereadonly === true) && !checkReadOnly)? false :(control.recordbasedreadonly ?
                            this.props.selectedRecord[control.radioparentLabel] === control.recordbasedhide : control.readonly ?
                                control.readonly : checkReadOnly)}
                        isSearchable={true}
                    />
                );
            }
            case 'files': {
                return (
                    <DropZone
                        name={control.label}
                        label={control.displayname[this.props.userInfo.slanguagetypecode] || control.label}
                        //maxFiles={control.maxFiles || 1}
                        maxFiles={1}
                        accept={control.accept && control.accept.value ==='*.*' ? undefined : control.accept && control.accept.value}
                        minSize={0}
                        maxSize={1}
                        onDrop={(event) => this.props.onDropFile(event, control.label, control.maxFiles)}
                       // multiple={control.maxFiles > 1 ? true : false}
                        multiple ={false}
                        editFiles={this.props.selectedRecord ? this.props.selectedRecord : {}}
                        // attachmentTypeCode={this.props.operation === "update" ? attachmentType.PRN : ""}
                        // fileSizeName="nfilesize"
                        fileName={control.label}
                        deleteAttachment={this.props.deleteAttachment}
                        actionType={this.props.actionType}
                        isMandatory={control.mandatory}
                    />
                )
            }
            case 'label': {
                /**ALPD-4466 - Label Component - L.Subashini**/
                 const labelClass = `${control.bold === true ? 'font-weight-bold' :''}
                                   ${control.italic === true ? 'font-italic' :''}`;
                ////                   ${control.lowercase === true ? 'text-lowercase' :''}
                //                   ${control.uppercase === true ? 'text-uppercase' :''}
                //                   ${control.capitalize === true ? 'text-capitalize' :''}
                 
                const underLine = control.underline === true ? 'underline' :'none';
               // console.log("control.sfontsize:", control);
              
                const labelStyle ={'font-size':`${control.sfontsize}px`,'text-decoration':`${underLine}`};
               // console.log("labelStyle:", labelStyle);
              
                return (
                    <LabelComponent
                        name={control.label}
                        label={control.displayname[this.props.userInfo.slanguagetypecode] || control.label}
                        value={this.props.selectedRecord[control.label] ? this.props.selectedRecord[control.label] : ""}
                        className={labelClass}
                        style={labelStyle}
                    />

                );
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
            }, 200);

        if (this.focusCount !== -1) {
            if(this.select[this.focusCount]&&this.select[this.focusCount].current)
            {
                setTimeout(() => {
                    this.select[this.focusCount].current&&this.select[this.focusCount].current.focus();
                }, 400);
            }
        }

    }

    render() {
        let count1 = 0;
        return (

            <div ref={this.formElement}>
                {//console.log('sdd', this.select)
                }
                {
                    this.props.templateData ?
                        this.props.templateData.map((item) =>
                            <Row>
                                {/* <CollapseTransition> */}
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
                                                                        {componentrow.recordbasedshowhide ?
                                                                            this.props.selectedRecord[componentrow.radioparentLabel] === componentrow.recordbasedhide ?
                                                                                "" : this.renderSwitch(componentrow, this.props.selectedRecord, item.children.length, component.children.length, count1++) :
                                                                            this.renderSwitch(componentrow, this.props.selectedRecord, item.children.length, component.children.length, count1++)}
                                                                    </Col>
                                                                )
                                                                }
                                                            </Row>
                                                            : <>
                                                                {component.recordbasedshowhide ?
                                                                    this.props.selectedRecord[component.radioparentLabel] === component.recordbasedhide ?
                                                                        "" : this.renderSwitch(component, this.props.selectedRecord, item.children.length, undefined, count1++) :
                                                                    this.renderSwitch(component, this.props.selectedRecord, item.children.length, undefined, count1++)}
                                                            </>
                                                    )
                                                })
                                            }

                                        </Col>
                                    )
                                    : ""}

                                {/* </CollapseTransition> */}
                            </Row>
                        )
                        :
                        ""
                }
            </div>



        )
    }
}

export default injectIntl(DynamicSlideout);