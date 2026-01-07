import React from "react";
import { Col, Nav, Row } from "react-bootstrap";
import { FormattedMessage, injectIntl } from "react-intl";
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { NavHeader } from '../../components/sidebar/sidebar.styles';
import { ContentPanel, ListWrapper } from './../userroletemplate/userroletemplate.styles';
import FormInput from '../../components/form-input/form-input.component';

class AddBarcodeTemplate extends React.Component {
    constructor() {
        super()
    }

    render() {
        return (
            <>
                <Row>
                    <Col md={12}>
                        <FormSelectSearch
                            name={"nformcode"}
                            formLabel={this.props.intl.formatMessage({ id: "IDS_SELECTSCREEN" })}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            options={this.props.qualisList || []}
                            value={this.props.selectedRecord ? this.props.selectedRecord["nformcode"] : ""}
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
                            formLabel={this.props.intl.formatMessage({ id: "IDS_SELECTSCREENCONTROL" })}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            options={this.props.controlList || []}
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
                    <Col md={12}>
                        <Row>
                            <Col md={6}>   <CustomSwitch
                                label={this.props.intl.formatMessage({ id: "IDS_ASKNUMBEROFBARCODEWANTTOPRINT" })}
                                type="switch"
                                name={"nbarcodeprint"}
                                onChange={(event) => this.props.onInputOnChange(event)}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECT" })}
                                defaultValue={this.props.selectedRecord ? this.props.selectedRecord["nbarcodeprint"] === 3 ? true : false : false}
                                // isMandatory={this.props.extractedColumnList[2].mandatory}
                                //  required={this.props.extractedColumnList[2].mandatory}
                                checked={this.props.selectedRecord ? this.props.selectedRecord["nbarcodeprint"] === 3 ? true : false : false}
                            /></Col>
                            <Col md={6}>   <CustomSwitch
                                label={this.props.intl.formatMessage({ id: "IDS_QUERYBASEDPRINTBARCODE" })}
                                type="switch"
                                name={"nsqlqueryneed"}
                                onChange={(event) => this.props.onInputOnChange(event)}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECT" })}
                                defaultValue={this.props.selectedRecord ? this.props.selectedRecord["nsqlqueryneed"] === 3 ? true : false : false}
                                // isMandatory={this.props.extractedColumnList[2].mandatory}
                                //  required={this.props.extractedColumnList[2].mandatory}
                                checked={this.props.selectedRecord ? this.props.selectedRecord["nsqlqueryneed"] === 3 ? true : false : false}
                            /></Col>

                        </Row>

                    </Col>
                    {/* <Col md={12}>
                     
                    </Col> */}


                    {this.props.selectedRecord["nsqlqueryneed"] === 3 ?
                        <>
                            <Col md={12}>
                                <CustomSwitch
                                    label={this.props.intl.formatMessage({ id: "IDS_FILTERBASEDSQLQUERY" })}
                                    type="switch"
                                    name={"nfiltersqlqueryneed"}
                                    onChange={(event) => this.props.onInputOnChange(event)}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECT" })}
                                    defaultValue={this.props.selectedRecord ? this.props.selectedRecord["nfiltersqlqueryneed"] === 3 ? true : false : false}
                                    // isMandatory={this.props.extractedColumnList[2].mandatory}
                                    //  required={this.props.extractedColumnList[2].mandatory}
                                    checked={this.props.selectedRecord ? this.props.selectedRecord["nfiltersqlqueryneed"] === 3 ? true : false : false}
                                />
                            </Col>
                            {this.props.selectedRecord["nfiltersqlqueryneed"] !== 3 &&
                                <Col md={12}>
                                    <FormSelectSearch
                                        name={"nsqlquerycode"}
                                        formLabel={this.props.intl.formatMessage({ id: "IDS_SELECTQUERY" })}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        options={this.props.SqlQuery || []}
                                        value={this.props.selectedRecord ? this.props.selectedRecord["nsqlquerycode"] : ""}
                                        isMandatory={true}
                                        required={true}
                                        isMulti={false}
                                        isSearchable={true}
                                        isDisabled={false}
                                        closeMenuOnSelect={true}
                                        onChange={(event) => this.props.onComboChange(event, "nsqlquerycode")}
                                    />
                                </Col>
                            }


                        </>
                        : ""}
                    <Col md={12}>
                        <CustomSwitch
                            label={this.props.intl.formatMessage({ id: "IDS_NEEDSCREENFILTER" })}
                            type="switch"
                            name={"nneedconfiguration"}
                            onChange={(event) => this.props.onInputOnChange(event)}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECT" })}
                            defaultValue={this.props.selectedRecord ? this.props.selectedRecord["nneedconfiguration"] === 3 ? true : false : false}
                            // isMandatory={this.props.extractedColumnList[2].mandatory}
                            //  required={this.props.extractedColumnList[2].mandatory}
                            checked={this.props.selectedRecord ? this.props.selectedRecord["nneedconfiguration"] === 3 ? true : false : false}
                        />
                    </Col>
                    {this.props.selectedRecord && this.props.selectedRecord["nneedconfiguration"] === 3 ?
                        <Col md={12}>
                            <div className="actions-stripe">
                                <div className="d-flex justify-content-end">
                                    <Nav.Link name="addMaterial" className="add-txt-btn" //hidden={props.userRoleControlRights.indexOf(addMaterialId) === -1}
                                        onClick={() => this.props.AddFilterDesign()}
                                    >
                                        <FontAwesomeIcon icon={faPlus} /> { }
                                        <FormattedMessage id="IDS_ADDSCREENFILTERDESIGN" defaultMessage={this.props.intl.formatMessage({ id: "IDS_ADDSCREENFILTERDESIGN" })} />
                                    </Nav.Link>
                                </div>
                            </div>
                        </Col> : <></>}
                    {<ContentPanel className="panel-main-content">
                        <ListWrapper className="card-body">
                            <React.Fragment>
                                <ListWrapper className="tree-view1 border-left tree-left ">
                                    {this.props.selectedRecord.lstFilterlevel ? this.props.selectedRecord.lstFilterlevel.map((input, i) =>
                                        <ListWrapper key={i} className="form-label-group tree-level list_get">
                                            <NavHeader className="line" style={{ width: (i + 1) * 10 }}> </NavHeader>
                                            <NavHeader id={i} value={this.props.selectedRecord.totalLevel}
                                                className="add_field_button">+</NavHeader>
                                            {/* <NavHeader className="levelcolour" md={1}>Level {i + 1}</NavHeader>  */}
                                            <NavHeader className="levelcolour" md={1}>{this.props.intl.formatMessage({ id: "IDS_LEVEL" })} {i + 1}</NavHeader>
                                            <ListWrapper style={{ marginLeft: (i + 8) * 10 }}>
                                                <FormInput className="input_custom" value={input.slabelname} id="levelname" type="text" />
                                            </ListWrapper>
                                        </ListWrapper>
                                    ) : ""
                                    }
                                </ListWrapper>
                            </React.Fragment>
                        </ListWrapper>
                    </ContentPanel>}
                </Row>

            </>
        )
    }
}
export default injectIntl(AddBarcodeTemplate);