import React from 'react'
import { Button, Row, Col } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';


const AddAliquotPlan = (props) => {

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
                formLabel={props.intl.formatMessage({ id: "IDS_VISITNUMBER" })}
                isSearchable={true}
                name={"svisitnumber"}
                isDisabled={false}
                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                isMandatory={true}
                isClearable={false}
                options={props.visitnameList || []}
                value={props.selectedRecord["svisitnumber"] || ""}
                defaultValue={props.selectedRecord["svisitnumber"]}
                onChange={(event) => props.onComboChange(event, "svisitnumber", 1)}
                closeMenuOnSelect={true}
            />

            {/* ALPD-5513 - added by Gowtham R on 10/3/25 - added sample donor field from sampledonor table */}
            <FormSelectSearch
                formLabel={props.intl.formatMessage({ id: "IDS_SAMPLEDONOR" })}
                isSearchable={true}
                name={"ssampledonor"}
                isDisabled={false}
                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                isMandatory={props.donarCheck}
                isClearable={false}
                options={props.sampledonarList || []}
                value={props.selectedRecord["ssampledonor"] || ""}
                defaultValue={props.selectedRecord["ssampledonor"]}
                onChange={(event) => props.onComboChange(event, "ssampledonor", 1)}
                closeMenuOnSelect={true}
            />

            <FormSelectSearch
                formLabel={props.intl.formatMessage({ id: "IDS_PATIENTCATEGORY" })}
                isSearchable={true}
                name={"spatientcatname"}
                isDisabled={false}
                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                isMandatory={props.renalCheck===true?true:false}
                isClearable={false}
                options={props.patientcatgoryList || []}
                value={props.selectedRecord["spatientcatname"] || ""}
                defaultValue={props.selectedRecord["spatientcatname"]}
                onChange={(event) => props.onComboChange(event, "spatientcatname", 1)}
                closeMenuOnSelect={true}
            />

            <FormInput
                label={props.intl.formatMessage({ id: "IDS_ALIQUOTNO" })}
                name={"saliquotno"}
                type={"text"}
                onChange={(event) => props.onInputOnChange(event, "saliquotno")}
                placeholder={props.intl.formatMessage({ id: "IDS_ALIQUOTNO" })}
                value={props.selectedRecord["saliquotno"] || ""}
                isMandatory={true}
                isClearable={false}
                required={true}
                maxLength={2}
                isDisabled={false}
            />


            <FormInput
                label={props.intl.formatMessage({ id: "IDS_QUANTITY" })}
                name={"squantity"}
                type={"text"}
                onChange={(event) => props.onInputOnChange(event, "squantity")}
                placeholder={props.intl.formatMessage({ id: "IDS_QUANTITY" })}
                value={props.selectedRecord["squantity"] || ""}
                isMandatory={true}
                isClearable={false}
                required={true}
                maxLength={6}
                isDisabled={false}
            />

            <FormSelectSearch
                formLabel={props.intl.formatMessage({ id: "IDS_UNIT" })}
                isSearchable={true}
                name={"sunitname"}
                isDisabled={false}
                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                isMandatory={true}
                isClearable={false}
                options={props.unitList || []}
                value={props.selectedRecord["sunitname"] || ""}
                defaultValue={props.selectedRecord["sunitname"]}
                onChange={(event) => props.onComboChange(event, "sunitname", 1)}
                closeMenuOnSelect={true}
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

export default injectIntl(AddAliquotPlan);