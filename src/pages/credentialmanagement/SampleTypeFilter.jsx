import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';

const SampleTypeFilter = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormSelectSearch
                    name={"nsampletypecode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_SAMPLETYPE" })}
                    //menuPosition="fixed"
                    isSearchable={true}
                    placeholder="Please Select..."
                    options={props.filterSampleType}
                    optionId='nsampletypecode'
                    optionValue='ssampletypename'
                    value={props.nfilterSampleType? props.nfilterSampleType: ""}
                    onChange={value => props.onComboChange(value, "nsampletypecode",3)}
                >
                </FormSelectSearch>
            </Col>
            <Col md={12}>
                <FormSelectSearch
                    name={"nregtypecode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_REGISTRATION" })}
                    //menuPosition="fixed"
                    isSearchable={true}
                    placeholder="Please Select..."
                    options={props.filterRegtype}
                    optionId='nregtypecode'
                    optionValue='sregtypename'
                    value={props.nregtypecode? props.nregtypecode: ""}
                    onChange={value => props.onComboChange(value, "nregtypecode",5)}
                >
                </FormSelectSearch>
            </Col>
        </Row>
    );
};

export default injectIntl(SampleTypeFilter);