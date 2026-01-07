import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';

class InstrumentCategoryFilter extends React.Component {
    // constructor(props) {
    //     super(props)
    // }


    render() {
        return (
            <Row>
                <Col md={12}>
                    <FormSelectSearch
                        name={"nformcode"}
                        formLabel={this.props.intl.formatMessage({ id: "IDS_SELECTSCREEN" })}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        options={this.props.listData["nformcode"] || []}
                        value={this.props.selectedRecord["nformcode"] ? this.props.selectedRecord["nformcode"] : ""}
                        isMandatory={true}
                        required={true}
                        isMulti={false}
                        isSearchable={true}
                        isDisabled={false}
                        closeMenuOnSelect={true}
                        onChange={(event) => this.props.onComboChange(event, "nformcode")}
                    />
                </Col>
                <Col md={12}>
                    <FormSelectSearch
                        name={"ncontrolcode"}
                        formLabel={this.props.intl.formatMessage({ id: "IDS_SELECTCONTROL" })}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        options={this.props.listData["ncontrolcode"] || []}
                        value={this.props.selectedRecord["ncontrolcode"] ? this.props.selectedRecord["ncontrolcode"] : ""}
                        isMandatory={true}
                        required={true}
                        isMulti={false}
                        isSearchable={true}
                        isDisabled={false}
                        closeMenuOnSelect={true}
                        onChange={(event) => this.props.onComboChange(event, "ncontrolcode")}
                    />
                </Col>

                {this.props.ComboComponnet && this.props.ComboComponnet.map(x =>
               <>
                    <Col md={12}>
                        <FormSelectSearch
                            name={x.label}
                            formLabel={this.props.intl.formatMessage({ id: "IDS_SELECT" }) + " " + x.displayname[this.props.slanguagetypecode]}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            options={this.props.listData && this.props.listData[x.label] && (this.props.listData[x.label] || [])}
                            value={this.props.selectedRecord[x.label] ? this.props.selectedRecord[x.label] : ""}
                            isMandatory={true}
                            required={true}
                            isMulti={false}
                            isSearchable={true}
                            isDisabled={false}
                            closeMenuOnSelect={true}
                            onChange={(event) => this.props.onComboChangedynamic(event, x)}
                        />
                    </Col>
                     {/* {console.log("combo",this.props.selectedRecord[x.label])} */}
                     </>
                )

                }
            </Row>
        );
    }

};

export default injectIntl(InstrumentCategoryFilter);