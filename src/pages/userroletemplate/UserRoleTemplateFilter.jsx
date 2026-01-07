import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { transactionStatus } from '../../components/Enumeration';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
const UserRoleTemplateFilter = (props) => {
    return (

        <Row>
            <Col md={12}>
                {props.filterApprovalSubtype.length > 0 ?
                    <FormSelectSearch
                        formLabel={props.formatMessage({ id: "IDS_APPROVALSUBTYPE" })}
                        isSearchable={true}
                        name={"nsubtypecode"}
                        isDisabled={false}
                        value={props.defaultapprovalsubtype}
                        isMandatory={false}
                        showOption={true}
                        options={props.filterApprovalSubtype}
                        optionId='nsubtypecode'
                        optionValue='ssubtypename'
                        // menuPosition="fixed"
                        placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                        onChange={event => props.filterComboChange(event, "approvalSubType")}>
                    </FormSelectSearch>
                    : ""}
                {props.isRegNeed === transactionStatus.YES ?
                    <>
                        {props.filterRegistrationType ?
                            <FormSelectSearch
                                name="nregtypecode"
                                formLabel={props.formatMessage({ id: "IDS_REGISTRATIONTYPE" })}
                                optionId="nregtypecode"
                                optionValue="sregtypename"
                                options={props.filterRegistrationType}
                                value={props.defaultregtype}
                                isMandatory={false}
                                isMulti={false}
                                isSearchable={false}
                                isDisabled={false}
                                // menuPosition="fixed"
                                placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                                onChange={(event) => props.filterComboChange(event, 'registrationType')}>
                            </FormSelectSearch>
                            : ""}
                        {props.filterRegistrationSubType ?
                            <FormSelectSearch

                                name="nregsubtypecode"
                                isMandatory={false}
                                formLabel={props.formatMessage({ id: "IDS_REGISTRATIONSUBTYPE" })}
                                optionId="nregsubtypecode"
                                optionValue="sregsubtypename"
                                options={props.filterRegistrationSubType}
                                value={props.defaultregsubtype}
                                isMulti={false}
                                isSearchable={false}
                                isDisabled={false}
                                // menuPosition="fixed"
                                placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                                onChange={(event) => props.filterComboChange(event, 'registrationSubType')}>
                            </FormSelectSearch>
                            : ""}
                    </>
                    : ""}
            </Col>
        </Row>


    );
};

export default UserRoleTemplateFilter;