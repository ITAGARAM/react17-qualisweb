import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { ApprovalSubType } from '../../../components/Enumeration'
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component'
class SampleFilter extends React.Component {

    render() {
        return (
            <Row>
                <Col md={12}>
                    {this.props.approvalSubTypeOptions ?
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_APPROVALSUBTYPE" })}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            // menuPosition="fixed"
                            name="napprovalsubtypecode"
                            optionId="napprovalsubtypecode"
                            optionValue="ssubtypename"
                            options={this.props.approvalSubTypeOptions}
                            value={this.props.approvalSubTypeValue}
                            onChange={(event) => this.props.filterComboChange(event, 'napprovalsubtypecode')}
                            isMandatory={false}
                            isMulti={false}
                            isSearchable={false}
                            isDisabled={false}
                            alphabeticalSort={false}
                        />
                        : ""}

                    {this.props.approvalSubTypeValue && this.props.approvalSubTypeValue.value === ApprovalSubType.TESTRESULTAPPROVAL ?
                        <>
                            {this.props.registrationTypeOptions ?

                                <FormSelectSearch
                                    formLabel={this.props.intl.formatMessage({ id: "IDS_REGISTRATIONTYPE" })}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    name="nregtypecode"
                                    optionId="nregtypecode"
                                    optionValue="sregtypename"
                                    // menuPosition="fixed"
                                    options={this.props.registrationTypeOptions}
                                    value={this.props.registrationTypeValue}
                                    onChange={(event) => this.props.filterComboChange(event, 'nregtypecode')}
                                    isMandatory={false}
                                    isMulti={false}
                                    isSearchable={false}
                                    isDisabled={false}
                                    alphabeticalSort={false}
                                />

                                : ""}
                            {this.props.registrationSubTypeOptions ?

                                <FormSelectSearch
                                    formLabel={this.props.intl.formatMessage({ id: "IDS_REGISTRATIONSUBTYPE" })}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    name="nregsubtypecode"
                                    optionId="nregsubtypecode"
                                    optionValue="sregsubtypename"
                                    // menuPosition="fixed"
                                    options={this.props.registrationSubTypeOptions}
                                    value={this.props.registrationSubTypeValue}
                                    isMandatory={false}
                                    isMulti={false}
                                    isSearchable={false}
                                    isDisabled={false}
                                    alphabeticalSort={false}
                                    onChange={(event) => this.props.filterComboChange(event, 'nregsubtypecode')}
                                />

                                : ""}
                        </>
                        : ""}
                    {this.props.userroleTemplateOptions ?

                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_USERROLETEMPLATE" })}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            name="nregsubtypecode"
                            optionId="nregsubtypecode"
                            optionValue="sregsubtypename"
                            // menuPosition="fixed"
                            options={this.props.userroleTemplateOptions}
                            value={this.props.userroleTemplateValue}
                            isMandatory={false}
                            isMulti={false}
                            isSearchable={false}
                            isDisabled={false}
                            alphabeticalSort={false}
                            onChange={(event) => this.props.filterComboChange(event, 'ntreeversiontempcode')}
                        />

                        : ""}
                </Col>
            </Row>

        );
    }
}
export default injectIntl(SampleFilter);