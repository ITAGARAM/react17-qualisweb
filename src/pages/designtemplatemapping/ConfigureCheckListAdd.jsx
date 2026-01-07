import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
//import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import DropZone from '../../components/dropzone/dropzone.component';
import { injectIntl } from 'react-intl';
import { attachmentType } from '../../components/Enumeration';
//import { Row, Col, Form } from 'react-bootstrap';

const ConfigureCheckListAdd = (props) => {
    return (
        <Row>

            <Col md={12}>
                <FormSelectSearch
                    name={"nchecklistversioncode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_CHECKLIST" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    options={props.checkList || []}
                    value={props.selectedRecord ? props.selectedRecord["nchecklistversioncode"] : ""}
                    isMandatory={true}
                    required={true}
                    isMulti={false}
                    isSearchable={true}
                    isDisabled={false}
                    closeMenuOnSelect={true}
                    onChange={(event) => props.onComboChange(event, "nchecklistversioncode")}
                />
            </Col>

        </Row>
    );
};
export default injectIntl(ConfigureCheckListAdd);