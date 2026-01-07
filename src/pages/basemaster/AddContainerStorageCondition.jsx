import * as React from 'react';
import { injectIntl } from 'react-intl'
import { Row, Col, Form } from 'react-bootstrap';
import '@progress/kendo-react-animation'
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

const AddContainerStorageCondition = (props) => {
    return (
      <Row>
  
        <Col md={12}>
          <FormSelectSearch
            name={"nstorageconditioncode"}
            formLabel={props.intl.formatMessage({ id: "IDS_STORAGECONDITIONNAME" })}
            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
            options={props.storageCondition}
            value={props.selectedRecord["nstorageconditioncode"]}
            isMandatory={true}
            isClearable={false}
            isMulti={false}
            isSearchable={true}
            isDisabled={false}
            closeMenuOnSelect={true}
            onChange={(event) => props.onComboChange(event, 'nstorageconditioncode',0)}
          />
        </Col>
        </Row>
    )
}
export default injectIntl(AddContainerStorageCondition);