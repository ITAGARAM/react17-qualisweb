import React from 'react';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';




const AddInstrumentSection = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_SECTION" })}
                    isSearchable={true}
                    name={"nsectioncode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    isClearable={false}
                    options={props.Lab}
                    optionId='nsectioncode'
                    optionValue='ssectionname'
                    disableSearch={false}
                    value={props.selectedRecord["nsectioncode"]}
                    defaultValue={props.selectedRecord["nsectioncode"]}
                    onChange={(event) => props.onComboChange(event, "nsectioncode", 2)}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}

                />

                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_INCHARGE" })}
                    isSearchable={true}
                    name={"nusercode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    isClearable={false}
                    options={props.Users || []}
                    // optionId='nusercode'
                    // optionValue='susername'
                    //disableSearch={false}
                    value={props.selectedRecord["nusercode"] || ""}
                   // defaultValue={props.selectedRecord["SectionUsers"]}
                    onChange={(event) => props.onComboChange(event, "nusercode", 1)}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                />
            </Col>
        </Row>
    );
}

export default injectIntl(AddInstrumentSection);