import React from 'react'
import { Row, Col } from 'react-bootstrap';
//import FormInput from '../../components/form-input/form-input.component';
//import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';

const AddSupplierCategory = (props) => {

    return (
        <Row>
            <Col md={12}>
                <FormSelectSearch
                    name={"nsuppliercatcode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_SUPPLIERCATEGORY" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    key={props.selectedRecord ? props.selectedRecord.ssuppliercatname : ''}
                    value={props.selectedSupplierCategory}
                    options={props.supplierCategory || []}
                    optionId="nsuppliercatcode"
                    optionValue="ssuppliercatname"
                    isMandatory={true}
                    isMulti={true}

                    isSearchable={false}
                    closeMenuOnSelect={false}
                    alphabeticalSort={true}
                    as={"select"}
                    onChange={(event) => props.onComboChange(event, "nsuppliercatcode")}
                >
                </FormSelectSearch>
            </Col>

        </Row>
    )
}

export default injectIntl(AddSupplierCategory);