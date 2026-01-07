import React from 'react';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';




const AddInstitutionCategory = (props) => {
    return (
        <Row>
            <Col md={12}>
                <Row>

                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_INSTITUTIONCATEGORY" })}
                            isSearchable={true}
                            name={"ninstitutioncatcode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.institutionCategory}
                            value={props.selectedRecord["ninstitutioncatcode"] || ""}
                            defaultValue={props.selectedRecord["ninstitutioncatcode"]}
                            onChange={(event) => props.onTabComboChange(event,"ninstitutioncatcode",1)}
                            closeMenuOnSelect={true}
                        />
                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_INSTITUTION" })}
                            isSearchable={true}
                            name={"ninstitutioncode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.institution}
                            value={props.selectedRecord["ninstitutioncode"] || ""}
                            defaultValue={props.selectedRecord["ninstitutioncode"]}
                            onChange={(event) => props.onTabComboChange(event, "ninstitutioncode",2)}
                            closeMenuOnSelect={true}
                        />
                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            name={"ninstitutionsitecode"}
                            formLabel={props.intl.formatMessage({ id: "IDS_INSTITUTIONSITE" })}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            key={props.institutionSite ||[]}
                            value={props.selectedInstitutionSite}
                            options={props.institutionSite || []}
                            optionId="ninstitutionsitecode"
                            optionValue="sinstitutionsitename"
                            isMandatory={true}
                            isMulti={true}

                            isSearchable={false}
                            closeMenuOnSelect={false}
                            alphabeticalSort={true}
                            as={"select"}
                            onChange={(event) => props.onTabComboChange(event, "ninstitutionsitecode",3)}
                        >
                        </FormSelectSearch>
                    </Col>


                </Row>
            </Col>

        </Row>

    );
}

export default injectIntl(AddInstitutionCategory);