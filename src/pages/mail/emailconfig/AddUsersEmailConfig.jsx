import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import FormMultiSelect from '../../../components/form-multi-select/form-multi-select.component';


const AddUsersEmailConfig = (props) => {
    return (
        <Row>
            {/* Added condition by Gowtham on 29th Oct 2025 */}
            {props.screenName === "IDS_ROLE" &&
                <Col md={12}>
                    <FormMultiSelect
                        name={"nuserrolecode"}
                        label={props.intl.formatMessage({ id: "IDS_USERROLE" })}
                        options={props.userRole || []}
                        optionId="nuserrolecode"
                        optionValue="suserrolename"
                        value={props.selectedRecord["nuserrolecode"] ? props.selectedRecord["nuserrolecode"] || [] :[]}
                        isMandatory={true}
                        isClearable={true}
                        disableSearch={false}
                        disabled={false}
                        closeMenuOnSelect={false}
                        alphabeticalSort={true}
                        onChange = {(event)=> props.onComboChange(event, "nuserrolecode")}
                    />
                </Col>
            }
            
            {props.screenName !== "IDS_ROLE" &&
                <Col md={12}>
                    <FormMultiSelect
                        name={"nusercode"}
                        label={props.intl.formatMessage({ id:"IDS_USERS" })}
                        options={props.users || []}
                        optionId="nusercode"
                        optionValue="semail"
                        value={props.selectedRecord["nusercode"] && props.selectedRecord["nusercode"] !== -1 ? props.selectedRecord["nusercode"] :[]}
                        isMandatory={true}
                        isClearable={true}
                        disableSearch={false}
                        disabled={false}
                        closeMenuOnSelect={false}
                        alphabeticalSort={true}
                        onChange = {(event)=> props.onComboChange(event, "nusercode")}
                    />
                </Col>
            }
        </Row>
    );
};

export default injectIntl(AddUsersEmailConfig);