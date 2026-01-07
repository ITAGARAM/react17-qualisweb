import React from 'react'
import { Button, Row, Col } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import FormInput from '../../../components/form-input/form-input.component';


const SiteBioBankConfig = (props) => {
    return (
        <>
            {props.loadhospitalcombo === false ? (
                <div>
                    <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_SITENAME" })}
                            name="ssitename"
                            type="text"
                            //onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_SITENAME" })}
                            value={props.selectedRecord["ssitename"] ? props.selectedRecord["ssitename"] : ""}
                            isMandatory={true}
                            required={true}
                            readOnly={true}
                            maxLength={100}
                        />

                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_SITECODE" })}
                            name="ssitecode"
                            type="text"
                            onChange={(event) => props.onInputOnChange(event,"","ssitecode")}
                            placeholder={props.intl.formatMessage({ id: "IDS_SITECODE" })}
                            value={props.selectedRecord["ssitecode"] ? props.selectedRecord["ssitecode"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={100}
                        />

                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_SITETYPE" })}
                            isSearchable={true}
                            name={"sbiobanktypename"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.bioBankList || []}
                            value={props.selectedRecord["sbiobanktypename"] || ""}
                            onChange={(event) => props.onComboChange(event, "sbiobanktypename", 1)}
                            closeMenuOnSelect={true}
                        />

                    </Col>

                </div>
            ) : (
                <div>
                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_HOSPITALNAME" })}
                        isSearchable={true}
                        name={"shospitalname"}
                        isDisabled={false}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={true}
                        isClearable={true}
                        options={props.hospitalList || []}
                        value={props.selectedRecord["shospitalname"] || ""}
                        onChange={(event) => props.onComboChange(event, "shospitalname", 1)}
                        closeMenuOnSelect={false}
                        isMulti={true}
                        defaultValue={props.selectedRecord["shospitalname"]}
                    />
                </div>
            )}
        </>
    );
};

export default injectIntl(SiteBioBankConfig);