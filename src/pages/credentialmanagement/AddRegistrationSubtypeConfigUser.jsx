import React from 'react';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';



const AddRegistrationSubtypeConfigUser = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_USERS" })}
                    isSearchable={true}
                    name={"nusercode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    isClearable={false}
                    options={props.Users || []}
                    isMulti={true}
                    value={props.selectedRecord["nusercode"] || ""}
                    onChange={(event) => props.onComboChange(event, "nusercode", 1)}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                />

            </Col>
        </Row>
    );
}

export default injectIntl(AddRegistrationSubtypeConfigUser);