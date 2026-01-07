import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { injectIntl } from "react-intl";
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormInput from '../../components/form-input/form-input.component';

class AddBarcodeConfiguration extends React.Component {
    // constructor() {
    //     super()
    // }
    render() {
        return (
            <>
                <Row>
                    <Col md={12}>
                        <FormSelectSearch
                            name={"nbarcode"}
                            formLabel={this.props.intl.formatMessage({ id: "IDS_SELECTBARCODE" })}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            options={this.props.masterData.Barcode || []}
                            value={this.props.selectedRecord ? this.props.selectedRecord["nbarcode"] : ""}
                            isMandatory={true}
                            required={true}
                            isMulti={false}
                            isSearchable={true}
                            isDisabled={this.props.operation === 'update' ? true : false}
                            closeMenuOnSelect={true}
                            onChange={(event) => this.props.onComboBarcodeChange(event, "nbarcode")}
                        />
                    </Col>

                    <Col md={12} >

                        {this.props.masterData.BarcodeParameter && this.props.masterData.BarcodeParameter.length > 0 &&
                            <Card>
                                <Card.Header>
                                    {this.props.intl.formatMessage({ id: "IDS_BARCODEPARAMETERMAPPING" })}
                                </Card.Header>
                                <Card.Body>
                                    {this.props.masterData.BarcodeParameter && this.props.masterData.BarcodeParameter.map((x, i) => {
                                        return <Row>
                                            <Col md={6}>
                                                <FormInput
                                                    label={this.props.intl.formatMessage({ id: "IDS_PARAMETER" })}
                                                    name="sparametername"
                                                    type="text"
                                                    //onChange={(event) => this.props.onInputOnChange(event)}
                                                    placeholder={this.props.intl.formatMessage({ id: "IDS_PARAMETER" })}
                                                    value={x}
                                                    isMandatory={true}
                                                    required={true}
                                                    isDisabled={true}
                                                    maxLength={100}
                                                />
                                            </Col>
                                            <Col md={6}>
                                                <FormSelectSearch
                                                    name={"columnname"}
                                                    formLabel={this.props.intl.formatMessage({ id: "IDS_SELECTMATERIALCOLUMN" })}
                                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                    options={this.props.masterData.MappingFileds || []}
                                                    value={this.props.selectedRecord && this.props.selectedRecord[x] ? this.props.selectedRecord[x] : ""}
                                                    isMandatory={true}
                                                    required={true}
                                                    isMulti={false}
                                                    isSearchable={true}
                                                    isDisabled={false}
                                                    closeMenuOnSelect={true}
                                                    onChange={(event) => this.props.onComboChangeModal(event, "columnname", x, i)}
                                                />
                                            </Col>
                                        </Row>
                                    })}
                                </Card.Body>
                            </Card>
                        }
                    </Col>


                    {
                        this.props.masterData.SelecetedControl && this.props.masterData.SelecetedControl.nfiltersqlqueryneed &&

                        <Col md={12} className='mt-4'>
                            <FormSelectSearch
                                name={"nsqlquerycode"}
                                formLabel={this.props.intl.formatMessage({ id: "IDS_SELECTQUERY" })}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                options={this.props.masterData.SqlQuery || []}
                                value={this.props.selectedRecord ? this.props.selectedRecord["nsqlquerycode"] : ""}
                                isMandatory={true}
                                required={true}
                                isMulti={false}
                                isSearchable={true}
                                isDisabled={false}
                                closeMenuOnSelect={true}
                                onChange={(event) => this.props.onComboBarcodeChange(event, "nsqlquerycode")}
                            />
                        </Col>
                    }


                    <Col md={12} className={'mt-4'}>

                        {this.props.masterData.SelecetedControl && this.props.masterData.SelecetedControl.nsqlqueryneed &&
                            this.props.masterData.SqlQueryParam.length > 0 &&
                            <Card> <Card.Header>
                                {this.props.intl.formatMessage({ id: "IDS_SQLQUERYPARAMPARAMETERMAPPING" })}
                            </Card.Header>

                                <Card.Body>
                                    {this.props.masterData.SelecetedControl &&
                                        this.props.masterData.SelecetedControl.nsqlqueryneed &&
                                        this.props.masterData.SqlQueryParam.map(x => {
                                            return <Row>
                                                {/* <Col md={6}> */}
                                                {/* <FormSelectSearch
                                            name={"ssqlqueryparam"}
                                            formLabel={this.props.intl.formatMessage({ id: "IDS_SQLQUERYPARAM" })}
                                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                            options={this.props.masterData.SqlQueryParam || []}
                                            value={x ? x : ""}
                                            isMandatory={true}
                                            required={true}
                                            isMulti={false}
                                            isSearchable={true}
                                            isDisabled={true}
                                            closeMenuOnSelect={true}
                                            onChange={(event) => this.props.onComboBarcodeChange(event, "ssqlqueryparam")}
                                        />
                                    </Col> */}
                                                <Col md={6}>

                                                    <FormInput
                                                        label={this.props.intl.formatMessage({ id: "IDS_SQLQUERYPARAM" })}
                                                        name="sparametername"
                                                        type="text"
                                                        //onChange={(event) => this.props.onInputOnChange(event)}
                                                        placeholder={this.props.intl.formatMessage({ id: "IDS_PARAMETER" })}
                                                        value={x}
                                                        isMandatory={true}
                                                        required={true}
                                                        isDisabled={true}
                                                        maxLength={100}
                                                    />
                                                </Col>
                                                <Col md={6}>
                                                    <FormSelectSearch
                                                        name={"ssqlqueryparammapping"}
                                                        formLabel={this.props.intl.formatMessage({ id: "IDS_SQLQUERYPARAMMAPPINGFIELDS" })}
                                                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                        options={this.props.masterData.SqlQueryParamMappingFileds || []}
                                                        value={this.props.selectedRecord[x]  ? this.props.selectedRecord[x] : ""}
                                                        isMandatory={true}
                                                        required={true}
                                                        isMulti={false}
                                                        isSearchable={true}
                                                        isDisabled={false}
                                                        closeMenuOnSelect={true}
                                                        onChange={(event) => this.props.onComboBarcodeChange(event, x)}
                                                    />
                                                </Col>
                                            </Row>


                                        })


                                    }
                                </Card.Body>
                            </Card>
                        }
                    </Col>
                </Row >
            </>
        )
    }
}
export default injectIntl(AddBarcodeConfiguration);