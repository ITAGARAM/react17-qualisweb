import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../../components/form-input/form-input.component';
import {injectIntl } from 'react-intl';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';

const AddCity = (props) => {
    return(
          <Row>    
             <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_DISTRICTNAME" })}
                    isSearchable={true}
                    name={"ndistrictcode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    options={props.districtList}
                    optionId='ndistrictcode'
                    optionValue='sdistrictname'
                    value={props.selectedRecord["ndistrictcode"]}
                    onChange={(event) => props.onComboChange(event, 'ndistrictcode')}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                />
            </Col>                   
            <Col md={12}>
            <FormInput
                    label={props.intl.formatMessage({ id: "IDS_CITY" })}
                    name= "scityname"
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_CITY" })}
                    value={ props.selectedRecord["scityname"] ? props.selectedRecord["scityname"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={100}
                />
            </Col>

            <Col md={12}>
            <FormInput
                    label={props.intl.formatMessage({ id: "IDS_CITYCODE" })}
                    name= "scitycode"
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_CITYCODE" })}
                    value={ props.selectedRecord["scitycode"] ? props.selectedRecord["scitycode"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={5}
                />
            </Col>
         </Row>
    );
};
export default injectIntl(AddCity);