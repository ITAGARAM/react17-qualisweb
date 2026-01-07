import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';

const InstrumentCategoryFilter = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormSelectSearch
                    name={"ninstrumentcatcode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_INSTRUMENTCATEGORY" })}
                    //menuPosition="fixed"
                    isSearchable={true}
                    placeholder="Please Select..."
                    options={props.filterInstrumentCategory}
                    optionId='ninstrumentcatcode'
                    optionValue='sinstrumentcatname'
                    value={props.nfilterInstrumentCategory? props.nfilterInstrumentCategory: ""}
                    onChange={value => props.onComboChange(value, "ninstrumentcatcode",3)}
                >
                </FormSelectSearch>
            </Col>
        </Row>
    );
};

export default injectIntl(InstrumentCategoryFilter);