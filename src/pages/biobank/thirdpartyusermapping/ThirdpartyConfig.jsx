import React from 'react';
import { Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormInput from '../../../components/form-input/form-input.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import CustomSwitch from '../../../components/custom-switch/custom-switch.component';

const ThirdPartyConfig = (props) => {
    const { selectedRecord = {}, onInputOnChange, loadthirdpartyusermapingcombo, intl } = props;

    return (
        <>
            {loadthirdpartyusermapingcombo === false ? (
                <div>
                    <Col md={12}>
                        <FormInput
                            label={intl.formatMessage({ id: "IDS_THIRDPARTYNAME" })}
                            name="sthirdpartyname"
                            type="text"
                            onChange={onInputOnChange}
                            placeholder={intl.formatMessage({ id: "IDS_THIRDPARTYNAME" })}
                            value={selectedRecord.sthirdpartyname || ""}
                            isMandatory={true}
                            required={true}
                            maxLength={100}
                        />

                        <FormInput
                            label={intl.formatMessage({ id: "IDS_ADDRESS" })}
                            name="saddress"
                            type="text"
                            onChange={onInputOnChange}
                            placeholder={intl.formatMessage({ id: "IDS_ADDRESS" })}
                            value={selectedRecord.saddress || ""}
                            required={true}
                            maxLength={250}
                        />

                        <FormInput
                            label={intl.formatMessage({ id: "IDS_PHONENO" })}
                            name="sphonenumber"
                            type="text"
                            onChange={onInputOnChange}
                            placeholder={intl.formatMessage({ id: "IDS_PHONENO" })}
                            value={selectedRecord.sphonenumber || ""}
                            required={true}
                            maxLength={20}
                        />

                        <FormInput
                            label={intl.formatMessage({ id: "IDS_EMAIL" })}
                            name="semail"
                            type="email"
                            onChange={onInputOnChange}
                            placeholder={intl.formatMessage({ id: "IDS_EMAIL" })}
                            value={selectedRecord.semail || ""}
                            required={true}
                            maxLength={50}
                        />

                        <FormInput
                            label={intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                            name="sdescription"
                            type="text"
                            onChange={onInputOnChange}
                            placeholder={intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                            value={selectedRecord.sdescription || ""}
                            maxLength={100}
                        />

                        <CustomSwitch
                            label={props.intl.formatMessage({ id: "IDS_NGS" })}
                            type="switch"
                            name={"nisngs"}
                            onChange={onInputOnChange}
                            placeholder={props.intl.formatMessage({ id: "IDS_NGS" })}
                            defaultValue={props.selectedRecord["nisngs"] === 3 ? true : false}
                            isMandatory={false}
                            required={false}
                            checked={props.selectedRecord ? props.selectedRecord["nisngs"] === 3 ? true : false : false}
                        />
                    </Col>

                </div>
            ):(
                            <div>
                                <FormSelectSearch
                                    formLabel={props.intl.formatMessage({ id: "IDS_USERROLENAME" })}
                                    isSearchable={true}
                                    name={"nuserrolecode"}
                                    isDisabled={false}
                                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isMandatory={true}
                                    isClearable={false}
                                    options={props.userRoleList || []}
                                    value={props.selectedRecord["nuserrolecode"] || ""}
                                    onChange={(event) => props.onComboChange(event, "nuserrolecode", 1)}
                                    closeMenuOnSelect={true}
                                    isMulti={false}
                                />

                              <FormSelectSearch
                                    formLabel={props.intl.formatMessage({ id: "IDS_USERS" })}
                                    isSearchable={true}
                                    name={"susername"}
                                    isDisabled={false} 
                                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isMandatory={true}
                                    isClearable={false} 
                                    options={props.userList || []}
                                     value={props.selectedRecord["nusercode"] || ""}
                                    onChange={(event) => props.onComboChange(event, "nusercode", 3)}
                                    closeMenuOnSelect={false}
                                    isMulti={true}
                                />

                            </div>
                        )}
        </>
    );
};

export default injectIntl(ThirdPartyConfig);