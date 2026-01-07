import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';

const StorageCategoryFilter = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormSelectSearch
                    name={"nstoragecategorycode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_STORAGECATEGORY" })}
                    //menuPosition="fixed"
                    isSearchable={true}
                    placeholder="Please Select..."
                    options={props.filterStorageCategory}
                    optionId='nstoragecategorycode'
                    optionValue='stestcategoryname'
                    value={props.nfilterStorageCategory? props.nfilterStorageCategory: ""}
                    onChange={value => props.onComboChange(value, "nstoragecategorycode", 3)}
                >
                </FormSelectSearch>
            </Col>
        </Row>
    );
};

export default injectIntl(StorageCategoryFilter);