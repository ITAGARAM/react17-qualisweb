import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

const UserRoleFilter = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.formatMessage({ id: "IDS_USERROLEPOLICY" })}
                    isSearchable={true}
                   // menuPosition="fixed"
                    name={"nuserrolepolicycode"}
                    isDisabled={false}
                    placeholder="Please Select..."
                    isMandatory={false}
                   // showOption={true}
                    className='form-control'
                    options={props.filterUserRole}
                    optionId='nuserrolecode'
                    optionValue='suserrolename'
                    value={props.selectedCombo["nuserrolecode"] ? props.selectedCombo["nuserrolecode"] : ""}
                    onChange={value => props.onComboChange(value, "nuserrolecode", 4)}
                //alphabeticalSort={true}
                >
                </FormSelectSearch>
            </Col>
        </Row>
    );
};

export default UserRoleFilter;