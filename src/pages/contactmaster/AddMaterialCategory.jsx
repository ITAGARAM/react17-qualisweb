import React from 'react'
import { Row, Col } from 'react-bootstrap';
//import FormInput from '../../components/form-input/form-input.component';
//import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';

const AddMaterialCategory = (props) => {

    return (
        <Row>
            <Col md={12}>
                <FormSelectSearch
                    name={"nmaterialcatcode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_MATERIALCATEGORY" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    key={props.selectedRecord ? props.selectedRecord.smaterialcatname : ''}
                    value={props.selectedMaterialCategory}
                    options={props.materialCategory}
                    optionId="nmaterialcatcode"
                    optionValue="smaterialcatname"
                    isMandatory={true}
                    isMulti={true}
                    isSearchable={false}
                    closeMenuOnSelect={false}
                    alphabeticalSort={true}
                    as={"select"}
                    onChange={(event) => props.onComboChange(event, "nmaterialcatcode")}
                >
                </FormSelectSearch>
            </Col>

        </Row>
    )
}

export default injectIntl(AddMaterialCategory);