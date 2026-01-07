import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';
const UserRoleScreenHideFilter = (props) => {
    
    return (
        <Row>
                <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_USERROLE" })}
                    isSearchable={true}
                    name={"nuserrolecode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={false}
                    showOption={true}
                    //menuPosition="fixed"
                    options={props.filterUserRole}
                    optionId='nuserrolecode'
                    optionValue='suserrolename'
                    value={props.selectedRecord["nuserrolecode"] ? props.selectedRecord["nuserrolecode"] : ""}
                    onChange={value => props.onComboChange(value, "nuserrolecode", 4)}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_USER" })}
                    isSearchable={true}
                    name={"nusercode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={false}
                    showOption={true}
                    //menuPosition="fixed"
                    options={props.userrnameList}
                    optionId='nusercode'
                    optionValue='susername'
                    value={props.selectedcombouser["nusercode"] ? props.selectedcombouser["nusercode"] : ""}
                    onChange={value => props.onComboChange(value, "nusercode", 4)}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
            </Col>
      </Row>
  );

};

export default injectIntl(UserRoleScreenHideFilter);