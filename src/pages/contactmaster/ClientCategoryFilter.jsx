import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';

const ClientCategoryFilter = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormSelectSearch
                    name={"nclientcatcode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_CLIENTCATEGORY" })}
                    //menuPosition="fixed"
                    isSearchable={true}
                    placeholder="Please Select..."
                    options={props.filterClientCategory}
                    optionId='nclientcatcode'
                    optionValue='sclinetcatname'
                    value={props.nfilterClientCategory? props.nfilterClientCategory: ""}
                    onChange={value => props.onComboChange(value, "nclientcatcode")}
                >
                </FormSelectSearch>
            </Col>
        </Row>
    );
};

export default injectIntl(ClientCategoryFilter);