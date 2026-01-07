import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

const AddStorageInstrument = (props) => {
    return (
        <>
            <Row>
                <Col md={12}>
                    <Col md={12}>

                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_STORAGECATEGORY" })}
                            isSearchable={true}
                            name={"nstoragecategorycode"}
                            isDisabled={props.operation==="update"}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.storageCategory}
                            value={props.selectedRecord["nstoragecategorycode"] && props.selectedRecord["nstoragecategorycode"] || []}
                            //defaultValue={this.state.selectedRecord["nprojecttypecode"]}
                            onChange={(event) => props.onComboChange(event, "nstoragecategorycode")}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>

                    </Col>

                    <Col md={12}>

                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_STORAGESTRUCTURE" })}
                            isSearchable={true}
                            name={"nsamplestoragelocationcode"}
                            isDisabled={props.operation==="update"}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.selectedRecord["nstoragecategorycode"]  && props.storageStructure}
                            value={props.selectedRecord["nstoragecategorycode"]  && props.selectedRecord["nsamplestoragelocationcode"] && props.selectedRecord["nsamplestoragelocationcode"] || []}
                            //defaultValue={this.state.selectedRecord["nprojecttypecode"]}
                            onChange={(event) => props.onComboChange(event, "nsamplestoragelocationcode")}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>

                    </Col>

                    <Col md={12}>

                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_STORAGECONDITION" })}
                            isSearchable={true}
                            name={"nstorageconditioncode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.storageCondition}
                            value={props.selectedRecord["nstorageconditioncode"] && props.selectedRecord["nstorageconditioncode"] || []}
                            defaultValue={props.selectedRecord["nstorageconditioncode"]}
                            onChange={(event) => props.onComboChange(event, "nstorageconditioncode")}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>

                    </Col>

                    <Col md={12}>

                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_INSTRUMENTTYPE" })}
                            isSearchable={true}
                            name={"ninstrumenttypecode"}
                            isDisabled={props.operation==="update"}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.instrumentType}
                            value={props.selectedRecord && props.selectedRecord["ninstrumenttypecode"] && props.selectedRecord["ninstrumenttypecode"] || []}
                            defaultValue={props.selectedRecord["ninstrumenttypecode"]}
                            onChange={(event) => props.onComboChange(event, "ninstrumenttypecode")}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>

                    </Col>

                    <Col md={12}>

                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_INSTRUMENTCATNAME" })}
                            isSearchable={true}
                            name={"ninstrumentcatcode"}
                            isDisabled={props.operation==="update"}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.instruemntCategory}
                            value={props.selectedRecord && props.selectedRecord["ninstrumentcatcode"] && props.selectedRecord["ninstrumentcatcode"] || []}
                            defaultValue={props.selectedRecord["ninstrumentcatcode"]}
                            onChange={(event) => props.onComboChange(event, "ninstrumentcatcode")}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>

                    </Col>


                    <Col md={12}>

                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_INSTRUMENT" })}
                            isSearchable={true}
                            name={"ninstrumentcode"}
                            isDisabled={props.operation==="update"}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isMulti={props.operation==="create"}
                            isClearable={false}
                            options={props.selectedRecord["ninstrumentcatcode"] && props.instrument}
                            value={props.selectedRecord["ninstrumentcatcode"] ?props.selectedRecord && props.selectedRecord["ninstrumentcode"] && props.selectedRecord["ninstrumentcode"] || []:""}
                            //defaultValue={this.state.selectedRecord["nprojecttypecode"]}
                            onChange={(event) => props.onComboChange(event, "ninstrumentcode")}
                            closeMenuOnSelect={false}
                        >
                        </FormSelectSearch>

                    </Col>


                </Col>

            </Row>

        </>


    )
}
export default injectIntl(AddStorageInstrument);
