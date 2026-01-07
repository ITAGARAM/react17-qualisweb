import React from 'react'
import { Button, Row, Col } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';


const AddSampleProcessType = (props) => {

    return (

        <Col md={12}>
            <FormSelectSearch
                formLabel={props.intl.formatMessage({ id: "IDS_PROJECTTYPE" })}
                isSearchable={true}
                name={"sprojecttypename"}
                isDisabled={false}
                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                isMandatory={true}
                isClearable={false}
                options={props.projecttypeList || []}
                value={props.selectedRecord["sprojecttypename"] || ""}
                defaultValue={props.selectedRecord["sprojecttypename"]}
                onChange={(event) => props.onComboChange(event, "sprojecttypename", 1)}
                closeMenuOnSelect={true}
                isMulti={false}
            />

            <FormSelectSearch
                formLabel={props.intl.formatMessage({ id: "IDS_SAMPLETYPE" })}
                isSearchable={true}
                name={"sproductname"}
                isDisabled={false}
                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                isMandatory={true}
                isClearable={false}
                options={props.sampletypeList || []}
                value={props.selectedRecord["sproductname"] || ""}
                defaultValue={props.selectedRecord["sproductname"]}
                onChange={(event) => props.onComboChange(event, "sproductname", 1)}
                closeMenuOnSelect={true}
            />

            <FormSelectSearch
                formLabel={props.intl.formatMessage({ id: "IDS_COLLECTIONTUBETYPEPROCESSTYPE" })}
                isSearchable={true}
                name={"stubename"}
                isDisabled={false}
                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                isMandatory={true}
                isClearable={false}
                options={props.collectiontubeList || []}
                value={props.selectedRecord["stubename"] || ""}
                defaultValue={props.selectedRecord["stubename"]}
                onChange={(event) => props.onComboChange(event, "stubename", 1)}
                closeMenuOnSelect={true}
            />

            <FormSelectSearch
                formLabel={props.intl.formatMessage({ id: "IDS_PROCESSTYPENAME" })}
                isSearchable={true}
                name={"sprocesstypename"}
                isDisabled={false}
                placeholder={props.intl.formatMessage({ id: "IDS_PROCESSTYPENAME" })}
                isMandatory={true}
                isClearable={false}
                options={props.processtypeList || []}
                value={props.selectedRecord["sprocesstypename"] || ""}
                defaultValue={props.selectedRecord["sprocesstypename"]}
                onChange={(event) => props.onComboChange(event, "sprocesstypename", 1)}
                closeMenuOnSelect={true}
            />

            <Row>
                <Col md={6}>
                    <FormInput
                        label={props.intl.formatMessage({ id: "IDS_PROCESSTIME" })}
                        name={"processtime"}
                        type={"text"}
                        onChange={(event) => props.onInputOnChange(event, "processtime")}
                        placeholder={props.intl.formatMessage({ id: "IDS_PROCESSTIME" })}
                        value={props.selectedRecord["processtime"] || ""}
                        isMandatory={true}
                        isClearable={false}
                        required={true}
                        maxLength={4}
                        isDisabled={false}
                        width={200}
                    />

                </Col>
                <Col md={6}>

                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_PROCESSPERIODTIME" })}
                        isSearchable={true}
                        name={"processperiodtime"}
                        isDisabled={true}
                        placeholder={props.intl.formatMessage({ id: "IDS_PROCESSPERIODTIME" })}
                        isMandatory={true}
                        isClearable={false}
                        options={props.periodList || []}
                        value={props.selectedRecord["processperiodtime"] || ""}
                        defaultValue={props.selectedRecord["processperiodtime"]}
                        onChange={(event) => props.onComboChange(event, "processperiodtime", 1)}
                        closeMenuOnSelect={true}
                    />

                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <FormInput
                        label={props.intl.formatMessage({ id: "IDS_GRACETIME" })}
                        name={"gracetime"}
                        type={"text"}
                        onChange={(event) => props.onInputOnChange(event, "gracetime")}
                        placeholder={props.intl.formatMessage({ id: "IDS_GRACETIME" })}
                        value={props.selectedRecord["gracetime"] || ""}
                        isMandatory={true}
                        isClearable={false}
                        required={true}
                        maxLength={4}
                        isDisabled={false}
                    />
                </Col>
                <Col md={6}>

                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_GRACEPERIODTIME" })}
                        isSearchable={true}
                        name={"graceperiodtime"}
                        isDisabled={true}
                        placeholder={props.intl.formatMessage({ id: "IDS_GRACEPERIODTIME" })}
                        isMandatory={true}
                        isClearable={false}
                        options={props.periodList || []}
                        value={props.selectedRecord["graceperiodtime"] || ""}
                        defaultValue={props.selectedRecord["graceperiodtime"]}
                        onChange={(event) => props.onComboChange(event, "graceperiodtime", 1)}
                        closeMenuOnSelect={true}
                    />

                </Col>
            </Row>


            <FormInput
                label={props.intl.formatMessage({ id: "IDS_EXECTIONORDER" })}
                name={"executionorder"}
                type={"text"}
                onChange={(event) => props.onInputOnChange(event, "executionorder")}
                placeholder={props.intl.formatMessage({ id: "IDS_EXECTIONORDER" })}
                value={props.selectedRecord["executionorder"] || ""}
                isMandatory={true}
                isClearable={false}
                required={true}
                maxLength={2}
                isDisabled={false}
            />

            <FormTextarea
                label={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                name={"sdescription"}
                onChange={(event) => props.onInputOnChange(event, "sdescription")}
                placeholder={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                value={props.selectedRecord["sdescription"]}
                rows="3"
                isMandatory={false}
                isClearable={false}
                required={true}
                maxLength={255}
                isDisabled={false}
            />
        </Col>
    )
}

export default injectIntl(AddSampleProcessType);