import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

const QueryTypeFilter = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormSelectSearch
                    name={"nquerytypecode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_QUERYTYPE" })}
                    isSearchable={true}
                   // menuPosition="fixed"
                    placeholder={props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}  
                    isMandatory={false}
                    isDisabled={false}
                    showOption={true}                  
                    options={props.queryType || []}
                    value={props.selectedRecord.nquerytypecode ? props.selectedRecord.nquerytypecode
                        :props.filterQueryType ? { "label": props.filterQueryType.squerytypename, "value": props.filterQueryType.nquerytypecode } : ""}
      
                    //value={props.selectedRecord["nquerytypecode"] ? props.selectedRecord["nquerytypecode"] : ""}
                    onChange={value => props.onComboChange(value, "nquerytypecode")}
                   
                >
                </FormSelectSearch>
            </Col>
        </Row>
    );
};

export default (injectIntl(QueryTypeFilter));