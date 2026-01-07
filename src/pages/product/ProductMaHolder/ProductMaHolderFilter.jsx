import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import MultiColumnComboSearch from '../../../components/multi-column-combo-search/multi-column-combo-search';

const ProductMaHolderFilter = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.formatMessage({ id: "IDS_PRODUCTNAME" })}
                    isSearchable={true}
                    name={"nproductcode"}
                    isDisabled={false}
                    placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    options={props.Product}
                    optionId="nproductcode"
                    optionValue="sproductname"
                    value={props.selectedRecord ? props.selectedRecord["nproductcode"] : ""}
                    showOption={true}
                    onChange={(event) => props.onProductChange(event, 'nproductcode')}
                   // menuPosition="fixed"
                    >
                </FormSelectSearch>
            </Col>
            <Col md={12}>
                <MultiColumnComboSearch
                    data={props.ProductManufacturer}
                    visibility='show-all'
                    alphabeticalSort="true"
                    selectedId={props.selectedRecord["nproductmanufcode"]}
                    labelledBy="IDS_PRODUCTMANUFACTURER"
                    // selectedId={props.selectedRecord["smanufname"] || ""}
                    fieldToShow={["smanufname", "smanufsitename", "seprotocolname"]}
                    idslabelfield={["IDS_PRODUCTMANUFACTURER", "IDS_MANUFACTURERSITE", "IDS_EPROTOCOL"]}
                    showInputkey="smanufname"
                    value={[props.selectedRecord]}
                    isMandatory={true}
                   // menuPosition="fixed"
                    getValue={(value) => props.onProductManufChange(value, ["nproductmanufcode","smanufname"])}
                />
            </Col>
        </Row>
    );
}

export default ProductMaHolderFilter;