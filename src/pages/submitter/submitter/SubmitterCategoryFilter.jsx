import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';

const SubmitterCategoryFilter = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormSelectSearch
                    name={"ninstitutioncatcode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_INSTITUTIONCATEGORY" })}
                    isSearchable={true}
                    placeholder={props.intl.formatMessage({ id: "IDS_PLEASESELECT" })}
                    options={props.FilterInstitutionCategory}
                    optionId='ninstitutioncatcode'
                    optionValue='sinstitutioncatname'
                    //value={props.nfilterInstitutionCategory ? props.nfilterInstitutionCategory : ""}
                    value={props.nfilterInstitutionCategory? { "label": props.nfilterInstitutionCategory.sinstitutioncatname, "value": props.nfilterInstitutionCategory.ninstitutioncatcode } : ""}

                    onChange={(event)=>props.onFilterComboChange(event,"ninstitutioncatcode")}
                >
                </FormSelectSearch>
            </Col>
            <Col md={12}>
                <FormSelectSearch
                    name={"ninstitutioncode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_INSTITUTION" })}
                    isSearchable={true}
                    placeholder={props.intl.formatMessage({ id: "IDS_PLEASESELECT" })}
                    options={props.FilterInstitution}
                    optionId='ninstitutioncode'
                    optionValue='sinstitutionname'
                    //value={props.nfilterInstitution ? props.nfilterInstitution : ""}
                    value={props.nfilterInstitution? { "label": props.nfilterInstitution.sinstitutionname, "value": props.nfilterInstitution.ninstitutioncode } : ""}

                    onChange={(event)=>props.onFilterComboChange(event,"ninstitutioncode")}
                >
                </FormSelectSearch>
            </Col>
            <Col md={12}>
                <FormSelectSearch
                    name={"ninstitutionsitecode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_INSTITUTIONSITE" })}
                    isSearchable={true}
                    placeholder={props.intl.formatMessage({ id: "IDS_PLEASESELECT" })}
                    options={props.FilterInstitutionSite}
                    optionId='ninstitutionsitecode'
                    optionValue='sinstitutionsitename'
                    //value={props.nfilterInstitutionSite ? props.nfilterInstitutionSite : ""}
                    value={props.nfilterInstitutionSite? { "label": props.nfilterInstitutionSite.sinstitutionsitename, "value": props.nfilterInstitutionSite.ninstitutionsitecode } : ""}

                    onChange={(event)=>props.onFilterComboChange(event,"ninstitutionsitecode")}
                >
                </FormSelectSearch>
            </Col>
        </Row>
    );
};

export default injectIntl(SubmitterCategoryFilter);