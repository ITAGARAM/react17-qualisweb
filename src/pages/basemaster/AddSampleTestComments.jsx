import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';

const AddSampleTestComments = (props) => {
    return (

        <Row>

            <Col md={12}>
            {props.selectedRecord["ncommenttypevisible"] && 
                 props.selectedRecord["ncommenttypevisible"].value === 1 ?
            <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_COMMENTTYPE" })}
                    name={"ncommenttypecode"} 
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    value={props.selectedRecord ? props.selectedRecord["ncommenttypecode"] : ""}
                    options={props.CommentType}
                    optionId="ncommenttypecode"
                    optionValue="scommenttype"
                    isMandatory={true}
                    isMulti={false}
                    isSearchable={false}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    as={"select"}
                    onChange={(event) => props.onComboChange(event, "ncommenttypecode")}
                    
                />
                :""}
            </Col>
            <Col md={12}>
            <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_COMMENTNAME" })}
                    name={"ncommentsubtypecode"} 
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    value={props.selectedRecord ? props.selectedRecord["ncommentsubtypecode"] : ""}
                    options={props.CommentSubType}
                    optionId="ncommentsubtypecode"
                    optionValue="scommentsubtype"
                    isMandatory={true}
                    isMulti={false}
                    isSearchable={false}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    as={"select"}
                    onChange={(event) => props.onComboChange(event, "ncommentsubtypecode")}
                    
                />
            </Col>
            <Col md={12}>
            {props.selectedRecord["ncommentsubtypecode"] && 
                 props.selectedRecord["ncommentsubtypecode"].value === 3 && props.selectedRecord["spredefinedenable"]==="true"?
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_ABBREVIATIONNAME" })}
                    name={"spredefinedname"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_ABBREVIATIONNAME" })}
                    value={props.selectedRecord ? props.selectedRecord["spredefinedname"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={100}
                /> : ""}
            </Col>
            <Col md={12}>
                <FormTextarea
                    label={props.intl.formatMessage({ id:"IDS_DESCRIPTION" })}
                    name="sdescription"
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                    value={props.selectedRecord["sdescription"] ? props.selectedRecord["sdescription"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={2000}
                />
            </Col>
        </Row>
    )
}
export default injectIntl(AddSampleTestComments) ;
