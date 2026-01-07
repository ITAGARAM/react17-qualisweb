import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';

const InstitutionCategoryFilter = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormSelectSearch
                    name={"ninstitutioncatcode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_INSTITUTIONCATEGORY" })}
                    isSearchable={true}
                    placeholder={props.intl.formatMessage({ id: "IDS_PLEASESELECT" })}
                    options={props.FilterInstitutionCategory}
                    optionId='ninstitutioncatcode'
                    optionValue='sinstitutioncatname'
                    value={props.selectedFilterRecord['ninstitutioncatcode']?props.selectedFilterRecord['ninstitutioncatcode']: ""}
                    onChange={(event)=>props.onFilterComboChange(event,"ninstitutioncatcode")}
                >
                </FormSelectSearch>
            </Col>
        </Row>
    );
};

export default injectIntl(InstitutionCategoryFilter);