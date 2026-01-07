import React from 'react';
import {Row, Col} from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component'
class UserMappingFilter extends React.Component{

    render(){
        return(
            <Row>
                <Col md={12}>
                    {this.props.Approvalsubtype ?
                        <FormSelectSearch
                            name="napprovalsubtypecode"
                            formLabel={this.props.intl.formatMessage({id:"IDS_APPROVALSUBTYPE"})}
                            placeholder={this.props.intl.formatMessage({id:"IDS_APPROVALSUBTYPE"})}
                            optionId="napprovalsubtypecode"
                            optionValue="ssubtypename"
                            options={this.props.Approvalsubtype}
                            value={this.props.approvalSubTypeValue}
                            onChange={(event) => this.props.filterComboChange(event, 'napprovalsubtypecode')}
                            isMandatory={false}
                            isMulti={false}
                            isSearchable={false}
                            isDisabled={false}
                            alphabeticalSort={false}
                        />
                    : ""}

                    {this.props.approvalSubTypeValue ? this.props.approvalSubTypeValue.value === 2 ?
                    <>
                        {this.props.RegistrationType ?
                            <FormSelectSearch
                                name="nregtypecode"
                                formLabel={this.props.intl.formatMessage({id:"IDS_REGISTRATIONTYPE"})}
                                placeholder={this.props.intl.formatMessage({id:"IDS_REGISTRATIONTYPE"})}
                                optionId="nregtypecode"
                                optionValue="sregtypename"
                                options={this.props.RegistrationType}
                                value={this.props.registrationTypeValue}
                                onChange={(event) => this.props.filterComboChange(event, 'nregtypecode')}
                                isMandatory={false}
                                isMulti={false}
                                isSearchable={false}
                                isDisabled={false}
                                alphabeticalSort={false}
                            />
                        : ""}
                        {this.props.RegistrationSubType ?
                            <FormSelectSearch
                                name="nregsubtypecode"
                                formLabel={this.props.intl.formatMessage({id:"IDS_REGISTRATIONSUBTYPE"})}
                                placeholder={this.props.intl.formatMessage({id:"IDS_REGISTRATIONSUBTYPE"})}
                                optionId="nregsubtypecode"
                                optionValue="sregsubtypename"
                                options={this.props.RegistrationSubType}
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
                    : "" : ""}
                    {this.props.templateVersionOptions ?
                        <FormSelectSearch
                            name="ntreeversiontempcode"
                            formLabel={this.props.intl.formatMessage({id:"IDS_TEMPLATEVERSION"})}
                            placeholder={this.props.intl.formatMessage({id:"IDS_TEMPLATEVERSION"})}
                            optionId="ntreeversiontempcode"
                            optionValue="sversiondescription"
                            options={this.props.templateVersionOptions}
                            value={this.props.templateVersionValue}
                            onChange={(event) => this.props.filterComboChange(event, 'ntreeversiontempcode')}
                            isMandatory={false}
                            isMulti={false}
                            isSearchable={false}
                            isDisabled={false}
                            alphabeticalSort={false}
                        />
                    : ""}
                </Col>
            </Row>
        );
    }
}
export default injectIntl(UserMappingFilter);