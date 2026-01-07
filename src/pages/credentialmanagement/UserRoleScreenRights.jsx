import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

const UserRoleScreenRights = (props) => {
    return (
        <Row>
            <Col md={12}>
                <Col md={12}>
                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_USERROLE" })}
                        isSearchable={false}
                        name={"nuserrole"}
                        isDisabled={false}
                        isMulti={false}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={true}
                        showOption={true}
                        options={props.UserRole}
                        value={props.selectedRecord ? props.selectedRecord["nuserrole"]:""}
                        optionId='nuserrole'
                        optionValue='suserrolename'
                        onChange={value => props.onComboChange(value, "nuserrole", 4)}
                        alphabeticalSort={true}
                    >
                    </FormSelectSearch>
                </Col>
            </Col>

        </Row>



    )
}
export default injectIntl(UserRoleScreenRights);
