import * as React from 'react';
import { injectIntl } from 'react-intl'
import { Row, Col, Form } from 'react-bootstrap';
import '@progress/kendo-react-animation'
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

const StorageMappingFilter = (props) => {
    return (
        <Row>

            <Col md={12}>
                <FormSelectSearch
                    name={"nstoragecategorycode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_STORAGECATEGORY" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    options={props.storageCategoryOptions}
                    value={props.selectedRecordFilter &&
                        props.selectedRecordFilter["nstoragecategorycode"] ?
                        props.selectedRecordFilter["nstoragecategorycode"] : {}}
                    isClearable={false}
                    isMulti={false}
                    isSearchable={true}
                    isDisabled={false}
                    closeMenuOnSelect={true}
                    onChange={(event) => props.onComboChange(event, 'nstoragecategorycode', 0)}
                />
            </Col>

            {/* <Col md={12}>
                <FormSelectSearch
                    name={"nsamplestoragelocationcode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_STORAGESTRUCTURE" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    options={props.storageLocationOptions}
                    value={props.selectedRecordFilter &&
                        props.selectedRecordFilter["nsamplestoragelocationcode"] ?
                        props.selectedRecordFilter["nsamplestoragelocationcode"] : {}}
                    isClearable={false}
                    isMulti={false}
                    isSearchable={true}
                    isDisabled={false}
                    closeMenuOnSelect={true}
                    onChange={(event) => props.onComboChange(event, 'nsamplestoragelocationcode')}
                />
            </Col>

            <Col md={12}>
                <FormSelectSearch
                    name={"nsamplestorageversioncode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_SAMPLESTORAGEVERSION" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    options={props.sampleStorageVersionOptions}
                    value={props.selectedRecordFilter && props.selectedRecordFilter["nsamplestorageversioncode"] ?
                        props.selectedRecordFilter["nsamplestorageversioncode"] : {}}
                    isClearable={false}
                    isMulti={false}
                    isSearchable={true}
                    isDisabled={false}
                    closeMenuOnSelect={true}
                    onChange={(event) => props.onComboChange(event, 'nsamplestorageversioncode')}
                />
            </Col> */}
        </Row>
    )
}
export default injectIntl(StorageMappingFilter);