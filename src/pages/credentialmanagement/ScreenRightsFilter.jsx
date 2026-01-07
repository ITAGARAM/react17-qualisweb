import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';
const ScreenRightsFilter = (props) => {




    return (
        <Row>
                <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_USERROLE" })}
                    isSearchable={true}
                    name={"nuserrolecode"}
                    isDisabled={false}
                    placeholder="Please Select..."
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
            </Col>
      </Row>
  );

    // return (
    //     <Row>
    //         <Col md={12}>
               
    //         </Col>
    //     </Row>
    // );
};

export default injectIntl(ScreenRightsFilter);