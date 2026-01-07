import { faLanguage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Row, Col, FormLabel, InputGroup, Form, Nav } from 'react-bootstrap';
//import FormInput from '../../components/form-input/form-input.component';
//import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { injectIntl } from 'react-intl';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { ReactComponents, FontSizeProperty} from '../../components/Enumeration';
import FormInput from '../../components/form-input/form-input.component';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import FormMultiSelect from '../form-multi-select/form-multi-select.component';
// import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';
import FormSelectSearch from '../form-select-search/form-select-search.component';
import TagInput from '../react-tag-input/react-tag-input.component';

const DynamicFieldProperties = (props) => {
    const acceptOptions = [{ label: "All Files", value: "*.*" }, { label: "PDF", value: ".pdf" }, { label: "Images", value: "image/*" }, { label: "Excel/CSV", value: ".xlsx, .xls, .csv" }]
    
  
    //ALPD-4466 - Label Component - L.Subashini
    let minFontSize = props.selectedFieldRecord && props.selectedFieldRecord.properties ?
                       props.selectedFieldRecord.properties.minfontsize :FontSizeProperty.FONTSIZE_10;

    let maxFontSize = props.selectedFieldRecord && props.selectedFieldRecord.properties ?
                       props.selectedFieldRecord.properties.maxfontsize :FontSizeProperty.FONTSIZE_25;
    
    // Below code will be used if the label component uses FormSelectSearch component instead
    // of NumericInputComponent for defining font size
    // const fontSizeArray = [];
    // for (let i = minFontSize; i <= maxFontSize; i++) {    
    //     fontSizeArray.push({label:i, value:i});
    // }

    return (
        Object.keys(props.selectedFieldRecord).length > 0 ?
            <Row className='j-s-b--flex'>
                <Col md={9} className="floating-margin">

                    <FormLabel className="mb-3">{props.intl.formatMessage({ id: "IDS_INPUTTYPE" })} : <strong>{props.selectedFieldRecord.componentname}</strong></FormLabel>

                    <FormInput
                        label={props.intl.formatMessage({ id: "IDS_LABELID" })}
                        name={"label"}
                        type="text"
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_LABELID" })}
                        value={props.selectedFieldRecord["label"] ? props.selectedFieldRecord["label"] : ""}
                        isMandatory={true}
                        required={true}
                        maxLength={"30"}
                    />
                </Col>
                <Col md={3} className="p-0 icon-wrap">
                    <Nav.Link name="addsynonym"
                        data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_ADDSYNONYMN" })}
                        // data-for="tooltip_list_wrap"
                        // hidden={this.state.userRoleControlRights.indexOf(this.state.previewId) === -1}
                        className="btn btn-circle mg-t-1 outline-grey mr-2"
                        onClick={(e) => props.addSynonym()}
                    >
                        <FontAwesomeIcon icon={faLanguage} />
                    </Nav.Link>
                </Col>
                <Col md={12}>
                    {props.selectedFieldRecord.componentcode !== ReactComponents.FRONTENDSEARCHFILTER &&
                        props.selectedFieldRecord.componentcode !== ReactComponents.BACKENDSEARCHFILTER
                        && props.selectedFieldRecord.componentcode !== ReactComponents.LABEL ?
                        <CustomSwitch
                            label={props.intl.formatMessage({ id: "IDS_MANDATORY" })}
                            type="switch"
                            name={"mandatory"}
                            parentClassName={"d-flex align-items-center inline-custom-switch"}
                            onChange={(event) => props.onInputOnChange(event)}
                            defaultValue={props.selectedFieldRecord["mandatory"]}
                            isMandatory={false}
                            required={true}
                            checked={props.selectedFieldRecord["mandatory"]}
                            disabled={props.selectedFieldRecord["templatemandatory"]}
                        /> : ""}
                </Col>
                <Col md={12}>
                    { !props.selectedFieldRecord.templatemandatory &&
                     props.selectedFieldRecord.componentcode !== ReactComponents.FRONTENDSEARCHFILTER &&
                        props.selectedFieldRecord.componentcode !== ReactComponents.BACKENDSEARCHFILTER
                        && props.selectedFieldRecord.componentcode !== ReactComponents.LABEL
                        && props.selectedFieldRecord.componentcode !== ReactComponents.FILE ?
                        <CustomSwitch
                            label={props.intl.formatMessage({ id: "IDS_EXPORT" })}
                            type="switch"
                            name={"isExportField"}
                            parentClassName={"d-flex align-items-center inline-custom-switch"}
                            onChange={(event) => props.onInputOnChange(event)}
                            defaultValue={props.selectedFieldRecord["isExportField"]}
                            isMandatory={false}
                            required={true}
                            checked={props.selectedFieldRecord["isExportField"]}
                            disabled={props.selectedFieldRecord["templatemandatory"]}
                        /> : ""}
                </Col>
                <Col md={12}>
                    {props.selectedFieldRecord.componentcode !== ReactComponents.FRONTENDSEARCHFILTER &&
                        props.selectedFieldRecord.componentcode !== ReactComponents.BACKENDSEARCHFILTER
                        && props.selectedFieldRecord.componentcode !== ReactComponents.LABEL
                        && props.selectedFieldRecord.componentcode !== ReactComponents.FILE
                        ?
                        <CustomSwitch
                            label={props.intl.formatMessage({ id: "IDS_UNIQUE" })}
                            type="switch"
                            name={"unique"}
                            parentClassName={"d-flex align-items-center inline-custom-switch"}
                            onChange={(event) => props.onInputOnChange(event)}
                            //defaultValue={props.selectedFieldRecord["unique"]}
                            defaultValue={(props.selectedFieldRecord["mandatory"] === false||props.selectedFieldRecord["mandatory"] === undefined ) ? false :props.selectedFieldRecord["unique"]}
                            isMandatory={false}
                            required={true}
                            checked={(props.selectedFieldRecord["mandatory"] === false||props.selectedFieldRecord["mandatory"] === undefined ) ? false : props.selectedFieldRecord["unique"]}
                         //   isMandatory={false}
                       //     required={true}
                        //    checked={props.selectedFieldRecord["mandatory"] === false ? false : props.selectedFieldRecord["unique"]}
                        //disabled={props.selectedFieldRecord["mandatory"] === true ? false : true}
                        /> : ""}
                </Col>
                <Col md={12}>
                    {((props.selectedFieldRecord.componentcode === ReactComponents.TEXTINPUT 
                    // ||props.selectedFieldRecord.componentcode === ReactComponents.TEXTAREA
                    )
                    && (!props.selectedFieldRecord["readonly"] 
                        || (props.selectedFieldRecord["readonly"] && props.selectedFieldRecord["iseditablereadonly"]))  
                    && !props.selectedFieldRecord['isnumeric'])
                    ?
                    <CustomSwitch
                            label={props.intl.formatMessage({ id: "IDS_STARTNOSPLCHAR" })}
                            type="switch"
                            name={"startnospecialcharacter"}
                            parentClassName={"d-flex align-items-center inline-custom-switch"}
                            onChange={(event) => props.onInputOnChange(event)}
                            //defaultValue={props.selectedFieldRecord["unique"]}
                            defaultValue={ props.selectedFieldRecord["startnospecialcharacter"] || false }
                            isMandatory={false}
                            required={true}
                            checked={ props.selectedFieldRecord["startnospecialcharacter"] || false}
                         //   isMandatory={false}
                       //     required={true}
                        //    checked={props.selectedFieldRecord["mandatory"] === false ? false : props.selectedFieldRecord["unique"]}
                        //disabled={props.selectedFieldRecord["mandatory"] === true ? false : true}
                        />: ""
                    }
                </Col>
                <Col md={12}>
                    {props.selectedFieldRecord.componentcode !== ReactComponents.FRONTENDSEARCHFILTER &&
                        props.selectedFieldRecord.componentcode !== ReactComponents.BACKENDSEARCHFILTER
                        && props.selectedFieldRecord.componentcode !== ReactComponents.LABEL 
                        && props.selectedFieldRecord.componentcode !== ReactComponents.FILE?
                        <CustomSwitch
                            label={props.intl.formatMessage({ id: "IDS_READONLY" })}
                            type="switch"
                            name={"readonly"}
                            parentClassName={"d-flex align-items-center inline-custom-switch"}
                            onChange={(event) => props.onInputOnChange(event)}
                            // defaultValue={props.selectedFieldRecord["readonly"]}
                            isMandatory={false}
                            required={true}
                            checked={props.selectedFieldRecord["readonly"] === undefined ? false : props.selectedFieldRecord["readonly"]}
                        /> : ""}
                </Col>
                <Col md={12}>
                    { props.selectedFieldRecord["readonly"]  
                    ?
                    <CustomSwitch
                            label={props.intl.formatMessage({ id: "IDS_ISEDITABLE" })}
                            type="switch"
                            name={"iseditablereadonly"}
                            parentClassName={"d-flex align-items-center inline-custom-switch"}
                            onChange={(event) => props.onInputOnChange(event)}
                            //defaultValue={props.selectedFieldRecord["unique"]}
                            defaultValue={ props.selectedFieldRecord["iseditablereadonly"] || false }
                            isMandatory={false}
                            required={true}
                            checked={ props.selectedFieldRecord["iseditablereadonly"] || false}
                         //   isMandatory={false}
                       //     required={true}
                        //    checked={props.selectedFieldRecord["mandatory"] === false ? false : props.selectedFieldRecord["unique"]}
                        //disabled={props.selectedFieldRecord["mandatory"] === true ? false : true}
                        />: ""
                    }
                </Col>
                {/* <Col md={12}>
                    {props.selectedFieldRecord.inputtype ==="textinput" &&
                    props.selectedFieldRecord.componentcode !== ReactComponents.FRONTENDSEARCHFILTER &&
                        props.selectedFieldRecord.componentcode !== ReactComponents.BACKENDSEARCHFILTER ?
                        <CustomSwitch
                            label={props.intl.formatMessage({ id: "IDS_NUMERICONLY" })}
                            type="switch"
                            name={"isnumeric"}
                            parentClassName= {"d-flex align-items-center inline-custom-switch"}
                            onChange={(event) => props.onInputOnChange(event)}
                           // defaultValue={props.selectedFieldRecord["mandatory"]}
                            isMandatory={false}
                            required={true}
                            checked={props.selectedFieldRecord["isnumeric"]}
                           // disabled={props.selectedFieldRecord["templatemandatory"]}
                        /> : ""}
                </Col> */}
                <Col md={12}>
                    {props.selectedFieldRecord.componentcode !== ReactComponents.FRONTENDSEARCHFILTER &&
                        props.selectedFieldRecord.componentcode !== ReactComponents.BACKENDSEARCHFILTER 
                        && props.selectedFieldRecord.componentcode !== ReactComponents.LABEL 
                        && props.selectedFieldRecord.componentcode !== ReactComponents.FILE ?
                        <CustomSwitch
                            label={props.intl.formatMessage({ id: "IDS_RECORDBASEDREADONLY" })}
                            type="switch"
                            name={"recordbasedreadonly"}
                            parentClassName={"d-flex align-items-center inline-custom-switch"}
                            onChange={(event) => props.onInputOnChange(event, "recordbasedreadonly")}
                            isMandatory={false}
                            required={true}
                            checked={props.selectedFieldRecord["recordbasedreadonly"] === undefined ? false : props.selectedFieldRecord["recordbasedreadonly"]}
                        />

                        : ""}
                </Col>

                <Col md={12}>
                    {props.selectedFieldRecord.componentcode !== ReactComponents.FRONTENDSEARCHFILTER &&
                        props.selectedFieldRecord.componentcode !== ReactComponents.BACKENDSEARCHFILTER
                        && props.selectedFieldRecord.componentcode !== ReactComponents.LABEL 
                        && props.selectedFieldRecord.componentcode !== ReactComponents.FILE ?
                        <CustomSwitch
                            label={props.intl.formatMessage({ id: "IDS_RECORDBASEDSHOWHIDE" })}
                            type="switch"
                            name={"recordbasedshowhide"}
                            parentClassName={"d-flex align-items-center inline-custom-switch"}
                            onChange={(event) => props.onInputOnChange(event, "recordbasedshowhide")}
                            isMandatory={false}
                            required={true}
                            checked={props.selectedFieldRecord["recordbasedshowhide"] === undefined ? false : props.selectedFieldRecord["recordbasedshowhide"]}
                        />

                        : ""}
                </Col>

                {props.selectedFieldRecord.componentcode !== ReactComponents.FRONTENDSEARCHFILTER &&
                    props.selectedFieldRecord.componentcode !== ReactComponents.BACKENDSEARCHFILTER
                    && props.selectedFieldRecord.componentcode !== ReactComponents.LABEL
                    && props.selectedFieldRecord.componentcode !== ReactComponents.FILE
                    && props.selectedFieldRecord.table &&
                    props.selectedFieldRecord.table.item.masterAdd
                    ? <>
                        <Col md={12}>
                            <CustomSwitch
                                label={props.intl.formatMessage({ id: "IDS_ADDMASTER" })}
                                type="switch"
                                name={"isAddMaster"}
                                parentClassName={"d-flex align-items-center inline-custom-switch"}
                                onChange={(event) => props.onInputOnChange(event)}
                                isMandatory={false}
                                required={true}
                                checked={props.selectedFieldRecord["isAddMaster"] === undefined ? false : props.selectedFieldRecord["isAddMaster"]}
                            />
                        </Col>
                        <Col md={12}>
                            <CustomSwitch
                                label={props.intl.formatMessage({ id: "IDS_EDITMASTER" })}
                                type="switch"
                                name={"isEditMaster"}
                                parentClassName={"d-flex align-items-center inline-custom-switch"}
                                onChange={(event) => props.onInputOnChange(event)}
                                isMandatory={false}
                                required={true}
                                checked={props.selectedFieldRecord["isEditMaster"] === undefined ? false : props.selectedFieldRecord["isEditMaster"]}
                            />
                        </Col>
                    </>
                    : ""}

                {(props.selectedFieldRecord.componentcode === ReactComponents.COMBO || 
                props.selectedFieldRecord.componentcode === ReactComponents.TEXTINPUT)
                    &&
                    <Col md={12}>
                        <CustomSwitch
                            label={props.intl.formatMessage({ id: "IDS_AUTOFOCUS" })}
                            type="switch"
                            name={"autoFocus"}
                            parentClassName={"d-flex align-items-center inline-custom-switch"}
                            onChange={(event) => props.onInputOnChange(event)}
                            isMandatory={false}
                            required={true}
                            checked={props.selectedFieldRecord["autoFocus"] === undefined ? false : props.selectedFieldRecord["autoFocus"]}
                        />
                    </Col>
                }
                

                {props.selectedFieldRecord.componentcode === ReactComponents.COMBO &&
                    props.selectedFieldRecord.table &&
                    props.selectedFieldRecord.table.item.nquerybuildertablecode === 222
                    ?
                    <Col md={12}>
                        <CustomSwitch
                            label={props.intl.formatMessage({ id: "IDS_VIEW" })}
                            type="switch"
                            name={"isView"}
                            parentClassName={"d-flex align-items-center inline-custom-switch"}
                            onChange={(event) => props.onInputOnChange(event)}
                            isMandatory={false}
                            required={true}
                            checked={props.selectedFieldRecord["isView"] === undefined ? false : props.selectedFieldRecord["isView"]}
                        />
                    </Col>
                    : ""}

                {(props.selectedFieldRecord.componentcode === ReactComponents.TEXTINPUT ||
                    props.selectedFieldRecord.componentcode === ReactComponents.TEXTAREA)
                    && ((!props.selectedFieldRecord["readonly"]) 
                        || (props.selectedFieldRecord["readonly"] && props.selectedFieldRecord["iseditablereadonly"])) 
                    && !props.selectedFieldRecord['isnumeric'] ?
                    <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_MAXLENGTH" })}
                            name={"sfieldlength"}
                            type="numeric"
                            onChange={(event) => props.onNumericInputChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_MAXLENGTH" })}
                            value={props.selectedFieldRecord["sfieldlength"] ? props.selectedFieldRecord["sfieldlength"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={3}
                        /> </Col> : ""}

                    
                {/* <Col md={12}> */}
                {/* {props.selectedFieldRecord.componentcode === ReactComponents.FRONTENDSEARCHFILTER &&
                        props.selectedFieldRecord.componentcode === ReactComponents.BACKENDSEARCHFILTER ?
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_FILTERCOMPONENT" })}
                            isSearchable={true}
                            name={"filtercomponent"}
                            isDisabled={props.selectedFieldRecord.templatemandatory || props.selectedFieldRecord.predefined}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={[{ label: "Query Builder", value: "querybuilder" }, { label: "Data Tool", value: "datatool" }]}
                            value={props.selectedFieldRecord && props.selectedFieldRecord["filtercomponent"] ? props.selectedFieldRecord["filtercomponent"] : ""}
                            onChange={value => props.onComboChange(value, "filtercomponent")}
                            closeMenuOnSelect={true}
                            alphabeticalSort={true}
                        />

                        : ""

                    } */}
                <Col md={12} className='mt-2'>
                    {props.selectedFieldRecord.componentcode === ReactComponents.COMBO
                        || props.selectedFieldRecord.componentcode === ReactComponents.FRONTENDSEARCHFILTER ||
                        props.selectedFieldRecord.componentcode === ReactComponents.BACKENDSEARCHFILTER ?
                        <>
                            <FormSelectSearch
                                formLabel={props.intl.formatMessage({ id: "IDS_SOURCE" })}
                                isSearchable={true}
                                name={"source"}
                                isDisabled={props.selectedFieldRecord.templatemandatory || props.selectedFieldRecord.predefined}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={true}
                                isClearable={false}
                                options={props.tables}
                                value={props.selectedFieldRecord && props.selectedFieldRecord["table"] ? props.selectedFieldRecord["table"] : ""}
                                onChange={value => props.onComboChange(value, "table")}
                                closeMenuOnSelect={true}
                                alphabeticalSort={true}
                            />
                            {props.selectedFieldRecord.componentcode === ReactComponents.FRONTENDSEARCHFILTER ||
                                props.selectedFieldRecord.componentcode === ReactComponents.BACKENDSEARCHFILTER ?
                                <>
                                    <FormMultiSelect
                                        label={props.intl.formatMessage({ id: "IDS_FILTERFIELDS" })}
                                        isSearchable={true}
                                        name={"filterfields"}
                                        isDisabled={props.selectedFieldRecord.templatemandatory || props.selectedFieldRecord.predefined}
                                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        optionId="value"
                                        optionValue="label"
                                        isMandatory={true}
                                        isClearable={true}
                                        disableSearch={false}
                                        disabled={false}
                                        closeMenuOnSelect={false}
                                        options={props.tableColumn || []}
                                        value={props.selectedFieldRecord && props.selectedFieldRecord["customsearchfilter"] ? props.selectedFieldRecord["customsearchfilter"] : []}
                                        onChange={value => props.onComboChange(value, "customsearchfilter")}
                                        alphabeticalSort={true}
                                    />

                                    {props.selectedFieldRecord.componentcode === ReactComponents.FRONTENDSEARCHFILTER ||
                                        props.selectedFieldRecord.componentcode === ReactComponents.BACKENDSEARCHFILTER ?
                                        <Row>
                                            <Col md={12}>
                                                <CustomSwitch
                                                    label={props.intl.formatMessage({ id: "IDS_RECORDBASEDREADONLY" })}
                                                    type="switch"
                                                    name={"recordbasedreadonly"}
                                                    parentClassName={"d-flex align-items-center inline-custom-switch"}
                                                    onChange={(event) => props.onInputOnChange(event, 'recordbasedreadonly')}
                                                    isMandatory={false}
                                                    required={true}
                                                    checked={props.selectedFieldRecord["recordbasedreadonly"] === undefined ? false : props.selectedFieldRecord["recordbasedreadonly"]}
                                                />
                                            </Col>
                                            <Col md={12}>
                                                <CustomSwitch
                                                    label={props.intl.formatMessage({ id: "IDS_RECORDBASEDSHOWHIDE" })}
                                                    type="switch"
                                                    name={"recordbasedshowhide"}
                                                    parentClassName={"d-flex align-items-center inline-custom-switch"}
                                                    onChange={(event) => props.onInputOnChange(event, "recordbasedshowhide")}
                                                    isMandatory={false}
                                                    required={true}
                                                    checked={props.selectedFieldRecord["recordbasedshowhide"] === undefined ? false : props.selectedFieldRecord["recordbasedshowhide"]}
                                                />
                                            </Col>
                                            {props.selectedFieldRecord.componentcode !== ReactComponents.FRONTENDSEARCHFILTER// &&
                                                //  props.selectedFieldRecord.componentcode !== ReactComponents.BACKENDSEARCHFILTER
                                                && props.selectedFieldRecord.table &&
                                                props.selectedFieldRecord.table.item.masterAdd
                                                ?
                                                <Col md={12}>
                                                    <CustomSwitch
                                                        label={props.intl.formatMessage({ id: "IDS_ADDMASTER" })}
                                                        type="switch"
                                                        name={"isAddMaster"}
                                                        parentClassName={"d-flex align-items-center inline-custom-switch"}
                                                        onChange={(event) => props.onInputOnChange(event, "isAddMaster")}
                                                        isMandatory={false}
                                                        required={true}
                                                        checked={props.selectedFieldRecord["isAddMaster"] === undefined ? false : props.selectedFieldRecord["isAddMaster"]}
                                                    />
                                                </Col>
                                                : ""}
                                        </Row>
                                        : ""}
                                </>
                                : <FormSelectSearch
                                    formLabel={props.intl.formatMessage({ id: "IDS_DISPLAYMEMBER" })}
                                    isSearchable={true}
                                    name={"displaymember"}
                                    isDisabled={props.selectedFieldRecord.templatemandatory || props.selectedFieldRecord.predefined}
                                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isMandatory={true}
                                    isClearable={false}
                                    options={props.tableColumn}
                                    value={props.selectedFieldRecord && props.selectedFieldRecord["column"] ? props.selectedFieldRecord["column"] : ""}
                                    onChange={value => props.onComboChange(value, "column")}
                                    closeMenuOnSelect={true}
                                    alphabeticalSort={true}
                                />}
                        </>
                        : ""}
                    {props.selectedFieldRecord.componentcode === ReactComponents.NUMERIC||
                    (props.selectedFieldRecord.componentcode === ReactComponents.TEXTINPUT && 
                          props.selectedFieldRecord.isnumeric) ?
                        <>
                            <FormInput
                                label={props.intl.formatMessage({ id: "IDS_PRECISION" })}
                                name={"precision"}
                                type="numeric"
                                onChange={(event) => props.onNumericInputChange(event)}
                                placeholder={props.intl.formatMessage({ id: "IDS_PRECISION" })}
                                value={props.selectedFieldRecord["precision"] ? props.selectedFieldRecord["precision"] : ""}
                                isMandatory={false}
                                required={true}
                                maxLength={"1"}
                            />
                               <FormInput
                                label={props.intl.formatMessage({ id: "IDS_MINVALUE" })}
                                name={"min"}
                                type="numeric"
                                onChange={(event) => props.onNumericInputChange(event)}
                                placeholder={props.intl.formatMessage({ id: "IDS_MINVALUE" })}
                                value={props.selectedFieldRecord["min"] ? props.selectedFieldRecord["min"] : ""}
                                isMandatory={props.selectedFieldRecord.isnumeric?true:false}
                                required={true}
                                maxLength={"7"}
                            />
                            <FormInput
                                label={props.intl.formatMessage({ id: "IDS_MAXVALUE" })}
                                name={"max"}
                                type="numeric"
                                onChange={(event) => props.onNumericInputChange(event)}
                                placeholder={props.intl.formatMessage({ id: "IDS_MAXVALUE" })}
                                value={props.selectedFieldRecord["max"] ? props.selectedFieldRecord["max"] : ""}
                                isMandatory={props.selectedFieldRecord.isnumeric?true:false}
                                required={true}
                                maxLength={"7"}
                            />
                         
                        </>
                        : ""}
                    {
                        props.selectedFieldRecord.componentcode === ReactComponents.COMBO &&
                        <>
                            <FormSelectSearch
                                name={"child"}
                                as={"select"}
                                onChange={(event) => props.onComboChange(event, 'childValue')}
                                formLabel={props.intl.formatMessage({ id: "IDS_PARENTCOMPONENT" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={false}
                                options={props.inputFields.filter(x => x.inputtype !== 'radio')}
                                value={props.selectedFieldRecord.childValue ? props.selectedFieldRecord.childValue : []}
                                isMulti={false}
                                isDisabled={false}
                                isSearchable={true}
                                isClearable={true}
                            />
                            {props.selectedFieldRecord.childValue && props.valueMembers.length > 1 &&
                                <FormSelectSearch
                                    formLabel={props.intl.formatMessage({ id: "IDS_VALUEMEMBER" })}
                                    isSearchable={true}
                                    name={"valuemember"}
                                    // isDisabled={props.selectedFieldRecord.templatemandatory}
                                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isMandatory={true}
                                    isClearable={false}
                                    options={props.valueMembers}
                                    value={props.selectedFieldRecord && props.selectedFieldRecord["valuecolumn"] ? props.selectedFieldRecord["valuecolumn"] : ""}
                                    onChange={value => props.onComboChange(value, "valuecolumn")}
                                    closeMenuOnSelect={true}
                                    alphabeticalSort={true}
                                />
                            }
                        </>
                    }

                    {
                        props.selectedFieldRecord["recordbasedreadonly"]
                            || props.selectedFieldRecord["recordbasedshowhide"] ?
                            <>
                                <FormSelectSearch
                                    name={"radioparent"}
                                    as={"select"}
                                    onChange={(event) => props.onComboChange(event, 'radioparent')}
                                    formLabel={props.intl.formatMessage({ id: "IDS_PARENTMULTIPLECHOICECONTROL" })}
                                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isMandatory={true}
                                    options={props.selectedFieldRecord["recordbasedreadonly"] || props.selectedFieldRecord["recordbasedshowhide"] ? props.inputFields.filter(x => x.inputtype === 'radio') : props.inputFields}
                                    value={props.selectedFieldRecord.radioparent ? props.selectedFieldRecord.radioparent : []}
                                    isMulti={false}
                                    isDisabled={false}
                                    isSearchable={true}
                                    isClearable={true}
                                />
                                <FormSelectSearch
                                    formLabel={props.intl.formatMessage({ id: "IDS_MULTIPLECHOICEVALUE" })}
                                    isSearchable={true}
                                    name={"displaymember"}
                                    isDisabled={false}
                                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isMandatory={true}
                                    isClearable={false}
                                    options={props.parentRadioValue}
                                    value={props.selectedFieldRecord && props.selectedFieldRecord["selectedrecordbasedhide"] ? props.selectedFieldRecord["selectedrecordbasedhide"] : ""}
                                    onChange={value => props.onComboChange(value, "selectedrecordbasedhide")}
                                    closeMenuOnSelect={true}
                                    alphabeticalSort={true}
                                />
                            </>
                            : props.selectedFieldRecord["recordbasedreadonly"] ?
                                <>
                                    <FormSelectSearch
                                        name={"child"}
                                        as={"select"}
                                        onChange={(event) => props.onComboChange(event, 'childValue')}
                                        formLabel={props.intl.formatMessage({ id: "IDS_PARENTMULTIPLECHOICECONTROL" })}
                                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        isMandatory={true}
                                        options={(props.selectedFieldRecord.componentcode !== ReactComponents.FRONTENDSEARCHFILTER &&
                                            props.selectedFieldRecord.componentcode !== ReactComponents.BACKENDSEARCHFILTER) ? props.inputFields :
                                            props.selectedFieldRecord["recordbasedreadonly"] ?
                                                props.inputFields.filter(x => x.inputtype === 'radio') : props.inputFields}
                                        value={props.selectedFieldRecord.childValue ? props.selectedFieldRecord.childValue : []}
                                        isMulti={false}
                                        isDisabled={false}
                                        isSearchable={true}
                                        isClearable={true}
                                    />
                                    <FormSelectSearch
                                        formLabel={props.intl.formatMessage({ id: "IDS_MULTIPLECHOICEVALUE" })}
                                        isSearchable={true}
                                        name={"displaymember"}
                                        isDisabled={false}
                                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        isMandatory={true}
                                        isClearable={false}
                                        options={props.parentRadioValue}
                                        value={props.selectedFieldRecord && props.selectedFieldRecord["selectedrecordbasedhide"] ? props.selectedFieldRecord["selectedrecordbasedhide"] : ""}
                                        onChange={value => props.onComboChange(value, "selectedrecordbasedhide")}
                                        closeMenuOnSelect={true}
                                        alphabeticalSort={true}
                                    />
                                </>
                                : ""
                    }

                </Col>
                {
                    (props.selectedFieldRecord.componentcode === ReactComponents.TEXTAREA ||
                        props.selectedFieldRecord.componentcode === ReactComponents.TEXTINPUT ||
                        props.selectedFieldRecord.componentcode === ReactComponents.NUMERIC ||
                        props.selectedFieldRecord.componentcode === ReactComponents.EMAIL ||
                        props.selectedFieldRecord.componentcode === ReactComponents.DATE
                    ) && props.selectedFieldRecord["readonly"] ?

                        <Col md={12}>
                            <FormSelectSearch
                                name={"child"}
                                as={"select"}
                                onChange={(event) => props.onComboChange(event, 'childValue')}
                                formLabel={props.intl.formatMessage({ id: "IDS_PARENTCOMPONENT" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={true}
                                options={props.inputFields.filter(x => x.inputtype !== 'radio')}
                                value={props.selectedFieldRecord.childValue ? props.selectedFieldRecord.childValue : []}
                                isMulti={false}
                                isDisabled={false}
                                isSearchable={true}
                                isClearable={true}
                            />
                            <FormSelectSearch
                                formLabel={props.intl.formatMessage({ id: "IDS_DISPLAYMEMBER" })}
                                isSearchable={true}
                                name={"displaymember"}
                                isDisabled={false}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={true}
                                isClearable={false}
                                options={props.tableColumn}
                                value={props.selectedFieldRecord && props.selectedFieldRecord["column"] ? props.selectedFieldRecord["column"] : ""}
                                onChange={value => props.onComboChange(value, "column")}
                                closeMenuOnSelect={true}
                                alphabeticalSort={true}
                            />
                        </Col>
                        : ""
                }
                {
                    props.selectedFieldRecord.componentcode === ReactComponents.DATE &&
                    <>
                        <Col md={12}>
                            <CustomSwitch
                                label={props.intl.formatMessage({ id: "IDS_DATEONLY" })}
                                type="switch"
                                name={"dateonly"}
                                parentClassName={"d-flex align-items-center inline-custom-switch"}
                                onChange={(event) => props.onInputOnChange(event)}
                                defaultValue={props.selectedFieldRecord["dateonly"]}
                                isMandatory={false}
                                required={true}
                                checked={props.selectedFieldRecord["dateonly"]}
                            />
                        </Col>
                        <Col md={12}>
                            <CustomSwitch
                                label={props.intl.formatMessage({ id: "IDS_TIMEONLY" })}
                                type="switch"
                                name={"timeonly"}
                                parentClassName={"d-flex align-items-center inline-custom-switch"}
                                onChange={(event) => props.onInputOnChange(event)}
                                // defaultValue={props.selectedFieldRecord["readonly"]}
                                isMandatory={false}
                                required={true}
                                checked={props.selectedFieldRecord["timeonly"]}
                            />
                        </Col>
                        <Col md={12}>
                            <CustomSwitch
                                label={props.intl.formatMessage({ id: "IDS_NEEDTIMEZONE" })}
                                type="switch"
                                name={"timezone"}
                                parentClassName={"d-flex align-items-center inline-custom-switch"}
                                onChange={(event) => props.onInputOnChange(event)}
                                // defaultValue={props.selectedFieldRecord["readonly"]}
                                isMandatory={false}
                                required={true}
                                checked={props.selectedFieldRecord["timezone"]}
                            />
                        </Col>
                        <Col md={12}>
                            <InputGroup>
                                <Form.Group>
                                    {/* <Form.Label as="legend" htmlFor={control.squestion}>{control.squestion}{control.nmandatoryfield === transactionStatus.YES && <sup>*</sup>}</Form.Label> */}
                                    <Form.Check
                                        inline={true}
                                        type="checkbox"
                                        name={'loadcurrentdate'}
                                        label={props.intl.formatMessage({ id: "IDS_LOADCURRENTDATE" })}
                                        onChange={(event) => props.onInputOnChange(event)}
                                        id={"loadcurrentdate"}
                                        checked={props.selectedFieldRecord["loadcurrentdate"]}
                                    // isMandatory={control.mandatory}
                                    // required={control.mandatory}
                                    />
                                </Form.Group>
                            </InputGroup >
                        </Col>

                    </>
                }
                <Col md={12}>
                    {props.selectedFieldRecord.componentcode === ReactComponents.RADIO ||
                        props.selectedFieldRecord.componentcode === ReactComponents.CHECKBOX ||
                        props.selectedFieldRecord.componentcode === ReactComponents.PREDEFINEDDROPDOWN ?
                        <TagInput
                            tags={props.selectedFieldRecord.radioOptions ? props.selectedFieldRecord.radioOptions.tags : []}
                            // tags={tags}
                            addTag={props.addTag}
                        />
                        : ""

                    }
                </Col>

                <Col md={12}>
                    {props.selectedFieldRecord.componentcode === ReactComponents.RADIO ||

                        props.selectedFieldRecord.componentcode === ReactComponents.PREDEFINEDDROPDOWN ?
                        <FormSelectSearch
                            //formLabel={props.intl.formatMessage({ id: "IDS_SELECTDEFAULTVALUES" })}
                            isSearchable={true}
                            name={"radiodefaultvalue"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTDEFAULTVALUES" })}
                            // isMandatory={true}
                            isClearable={false}
                            isMulti={false}
                            options={props.selectedFieldRecord.radioOptions ? props.selectedFieldRecord.radioOptions.tags.map(x => { return { label: x.text, value: x.text } }) : []}
                            value={props.selectedFieldRecord && props.selectedFieldRecord["radiodefaultvalue"] ? props.selectedFieldRecord["radiodefaultvalue"] : ""}
                            onChange={value => props.onComboChange(value, "radiodefaultvalue")}
                            closeMenuOnSelect={true}
                            alphabeticalSort={true}
                        />
                        : props.selectedFieldRecord.componentcode === ReactComponents.CHECKBOX ?

                            <FormMultiSelect
                                name={"radiodefaultvalue"}
                                optionId="label"
                                optionValue="value"
                                // label={ props.intl.formatMessage({ id:"IDS_SCREENRIGHTS" })}                              
                                options={props.selectedFieldRecord.radioOptions ? props.selectedFieldRecord.radioOptions.tags.map(x => { return { label: x.text, value: x.text } }) : []}
                                value={props.selectedFieldRecord["radiodefaultvalue"] ? props.selectedFieldRecord["radiodefaultvalue"] : []}
                                //isMandatory={true}
                                isClearable={true}
                                disableSearch={false}
                                disabled={false}
                                closeMenuOnSelect={false}
                                alphabeticalSort={true}
                                allItemSelectedLabel={props.intl.formatMessage({ id: "IDS_ALLITEMSAREMSELECTED" })}
                                noOptionsLabel={props.intl.formatMessage({ id: "IDS_NOOPTION" })}
                                searchLabel={props.intl.formatMessage({ id: "IDS_SEARCH" })}
                                selectAllLabel={props.intl.formatMessage({ id: "IDS_SELECTALL" })}
                                onChange={(event) => props.onComboChange(event, "radiodefaultvaluemulti")}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTDEFAULTVALUES" })}
                            />

                            : ""

                    }
                </Col>
                {
                    props.selectedFieldRecord.componentcode === ReactComponents.FILE &&
                    <Col md={12}>
                        {/* <FormInput
                            label={props.intl.formatMessage({ id: "IDS_MAXFILES" })}
                            name={"maxFiles"}
                            type="numeric"
                            onChange={(event) => props.onNumericInputChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_MAXFILES" })}
                            value={props.selectedFieldRecord["maxFiles"] ? props.selectedFieldRecord["maxFiles"] : ""}
                            isMandatory={false}
                            required={true}
                            maxLength={"1"}
                        /> */}
                        <FormSelectSearch
                            name={"accept"}
                            as={"select"}
                            onChange={(event) => props.onComboChange(event, 'accept')}
                            formLabel={props.intl.formatMessage({ id: "IDS_FILETYPE" })}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            options={acceptOptions}
                            defaultValue={acceptOptions[0]}
                            value={props.selectedFieldRecord.accept ? props.selectedFieldRecord.accept : []}
                            isMulti={false}
                            isDisabled={false}
                            isSearchable={true}
                        />
                    </Col>                 

                }               
                 
                    {props.selectedFieldRecord.componentcode === ReactComponents.LABEL ?
                     /**ALPD-4466 - Label Component Start - L.Subashini**/
                    <>
                       
                        <Col md={12}>
                            <FormNumericInput
                                label={props.intl.formatMessage({ id: "IDS_FONTSIZE" })}
                                name={"sfontsize"}
                                type="number"
                                onChange={(event) => props.onChangeNumericInput(event, 'sfontsize')}
                                precision={0}
                                placeholder={props.intl.formatMessage({ id: "IDS_FONTSIZE" })}
                                value={props.selectedFieldRecord["sfontsize"] ? props.selectedFieldRecord["sfontsize"] : ""}
                                isMandatory={true}
                                required={true}
                                strict={true}
                                min={minFontSize}
                                max={maxFontSize}
                                addPadding={true}
                            /> 
                        </Col>                                            
                        <Col md={12}>
                       
                            <CustomSwitch
                                label={props.intl.formatMessage({ id: "IDS_BOLD" })}
                                type="switch"
                                name={"bold"}
                                parentClassName={"d-flex align-items-center inline-custom-switch"}
                                onChange={(event) => props.onInputOnChange(event)}
                                defaultValue={props.selectedFieldRecord["bold"]}
                                isMandatory={false}
                                required={false}
                                checked={props.selectedFieldRecord["bold"]}
                                disabled={props.selectedFieldRecord["templatemandatory"]}
                            /> 
                        </Col>
                        <Col md={12}>
                       
                            <CustomSwitch
                                label={props.intl.formatMessage({ id: "IDS_ITALIC" })}
                                type="switch"
                                name={"italic"}
                                parentClassName={"d-flex align-items-center inline-custom-switch"}
                                onChange={(event) => props.onInputOnChange(event)}
                                defaultValue={props.selectedFieldRecord["italic"]}
                                isMandatory={false}
                                required={false}
                                checked={props.selectedFieldRecord["italic"]}
                                disabled={props.selectedFieldRecord["templatemandatory"]}
                            /> 
                        </Col>
                         <Col md={12}>
                       
                            <CustomSwitch
                                label={props.intl.formatMessage({ id: "IDS_UNDERLINE" })}
                                type="switch"
                                name={"underline"}
                                parentClassName={"d-flex align-items-center inline-custom-switch"}
                                onChange={(event) => props.onInputOnChange(event)}
                                defaultValue={props.selectedFieldRecord["underline"]}
                                isMandatory={false}
                                required={false}
                                checked={props.selectedFieldRecord["underline"]}
                            /> 
                        </Col>
                        </>
                        
                    : ""  /**ALPD-4466 - Label Component End - L.Subashini**/}
                     
                
                    
                    {/* ALPD-4466 - Label Component - L.Subashini
                       <FormSelectSearch
                        //     formLabel={props.intl.formatMessage({ id: "IDS_FONTSIZE" })}
                        //     isSearchable={true}
                        //     name={"sfontsize"}
                        //     isDisabled={false}
                        //     placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        //     isMandatory={true}
                        //     isClearable={false}
                        //     options={fontSizeArray}    
                        //     value={props.selectedFieldRecord && props.selectedFieldRecord["sfontsize"] ? props.selectedFieldRecord["sfontsize"] : ""}
                        //     onChange={value => props.onComboChange(value, "sfontsize")}
                        //     closeMenuOnSelect={true}
                        //     alphabeticalSort={true}
                        // />
                        // <FormInput
                        //     label={props.intl.formatMessage({ id: "IDS_FONTSIZE" })}
                        //     name={""}
                        //     type="number"
                        //     onBlur={(event) => props.onInputOnChange(event, "sfontsize", {label:'sfontsize',
                        //                                                             min:8, max:20})}
                        //     placeholder={props.intl.formatMessage({ id: "IDS_FONTSIZE" })}
                        //     value={props.selectedFieldRecord["sfontsize"] ? props.selectedFieldRecord["sfontsize"] : ""}
                        //     isMandatory={true}
                        //     required={true}
                        //     maxLength={2}
                        //     minValue={8}
                        //     maxValue={20}
                        // /> 
                  
                    Commented by L.Subashini as this formatting is not required. 
                        If needed, uncomment below lines
                        <Col md={12}>
                        {props.selectedFieldRecord.componentcode == ReactComponents.LABEL ?
                            <FormSelectSearch
                                    formLabel={props.intl.formatMessage({ id: "IDS_TEXTCASEFORMAT" })}
                                    isSearchable={true}
                                    name={"textcaseformat"}
                                    isDisabled={false}
                                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isMandatory={true}
                                    isClearable={false}
                                    options={[{label:"Lowercase", value:"text-lowercase"},
                                                {label: "Uppercase", value:"text-uppercase"},
                                                {label: "Capitalize", value:"text-capitalize"}]}
                                    value={props.selectedFieldRecord && props.selectedFieldRecord["textcaseformat"] ? props.selectedFieldRecord["textcaseformat"] : ""}
                                    onChange={value => props.onComboChange(value, "textcaseformat")}
                                    closeMenuOnSelect={true}
                                    alphabeticalSort={true}
                                />
                                :""}
                    </Col> */}
                  
               
            </Row >
            : ""
    )
}

export default injectIntl(DynamicFieldProperties);