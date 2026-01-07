import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import FormTextarea from '../../../components/form-textarea/form-textarea.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import { MediaHeader } from '../../../components/App.styles';
import TestPopOver from '../../ResultEntryBySample/TestPopOver';
import CustomSwitch from '../../../components/custom-switch/custom-switch.component';
import { transactionStatus } from '../../../components/Enumeration';

const AddComment = props => {
    //let nameString = props.operation === 'update' ? props.selectedRecord.jsondata && [props.selectedRecord.jsondata[props.displayName]] || [] : props.masterList ? props.masterList.map(obj => obj[props.displayName] || obj[props.jsonField][props.displayName]) : []
    let nameString = props.operation === 'update' ? props.selectedRecord && [props.selectedRecord[props.displayName]] || [] : props.masterList ? props.masterList.map(obj => obj[props.displayName] || obj[props.jsonField][props.displayName]) : []
    let message = `${nameString.length} ${props.intl.formatMessage({ id: props.selectedListName || "IDS_TESTS" })} ${props.intl.formatMessage({ id: "IDS_SELECTED" })}`
    return (
        <>
            <Row>
                {props.masterList && Object.values(props.masterList).length > 0 ?
                    <div>
                        <Row className="mb-4">
                            <Col md={12}>
                                <MediaHeader className={`labelfont`}>
                                    {nameString.length === 1 ?
                                        `${props.intl.formatMessage({ id: props.selectedListName || "IDS_TESTS" })}: ${nameString[0]}` :
                                        <TestPopOver stringList={nameString} message={message}></TestPopOver>

                                    }
                                </MediaHeader>
                            </Col>
                        </Row>
                    </div>
                    : ""}
            </Row>
            <Row>
                <Col md="12">
                    {props.isTestComment ?
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_SAMPLETESTCOMMENTS" })}
                            isSearchable={true}
                            name={"nsamplecommentscode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_PLEASESELECT" })}
                            isMandatory={true}
                            showOption={true}
                            isClearable={false}
                            options={props.SampleTestComments || []}
                            optionId='nsampletestcommentcode'
                            optionValue='ssampletestcommentname'
                            value={props.selectedRecord["nsamplecommentscode"]}
                            onChange={value => props.onComboChange(value, "nsamplecommentscode")}
                            alphabeticalSort={true}
                        />
                        : ""}
                    {props.isSampleTestComment && props.isSampleTestComment === true ?
                        <>   <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_COMMENTNAME" })}
                            isSearchable={true}
                            name={"ncommentsubtypecode"}
                            showOption={true}
                            options={props.CommentSubType || []}
                            optionId='ncommentsubtypecode'
                            optionValue='scommentsubtype'
                            value={props.selectedRecord["ncommentsubtypecode"] && props.selectedRecord["ncommentsubtypecode"] || ""}
                            onChange={value => props.onComboChange(value, 'ncommentsubtypecode')}
                            isMandatory={true}
                        ></FormSelectSearch>
                            {props.selectedRecord["ncommentsubtypecode"]&&
                            props.selectedRecord["ncommentsubtypecode"].value === 3   ?
                                <FormSelectSearch
                                    formLabel={props.intl.formatMessage({ id: "IDS_ABBREVIATIONNAME" })}
                                    isSearchable={true}
                                    name={"nsampletestcommentscode"}
                                    showOption={true}
                                    options={props.predefcomments || []}
                                    optionId='nsampletestcommentscode'
                                    optionValue='spredefinedname'
                                    value={props.selectedRecord["nsampletestcommentscode"] && props.selectedRecord["nsampletestcommentscode"] || ""}
                                    onChange={value => props.onComboChange(value, 'nsampletestcommentscode')}
                                    isMandatory={true}
                                ></FormSelectSearch> : ""}

                            <FormTextarea
                                formGroupClassName="remove-floating-label-margin"
                                label={props.intl.formatMessage({ id: "IDS_COMMENT" })}
                                name={`scomments`}
                                type="text"
                                required={false}
                                isMandatory={true}
                                value={props.selectedRecord["scomments"] && props.selectedRecord["scomments"] || ""}
                                onChange={(event) => props.onInputOnChange(event)}
                            /></> : <FormTextarea
                            name={"scomments"}
                            label={props.intl.formatMessage({ id: "IDS_COMMENT" })}
                            onChange={(event) => props.onInputOnChange(event, 1)}
                            placeholder={props.intl.formatMessage({ id: "IDS_COMMENT" })}
                            value={props.selectedRecord ? props.selectedRecord["scomments"] : ""}
                            rows="2"
                            required={true}
                            isMandatory={true}
                            maxLength={1500}
                        />
                    }

                </Col>
                {props.isneedReport ? 
                 <Col md="12">
                          <CustomSwitch
                                  label={props.intl.formatMessage({ id: "IDS_INCULDEINREPORT" })}
                                  type="switch"
                                  name={"nneedreport"}
                                  onChange={(event) => props.onInputOnChange(event,1)}
                                  defaultValue={false}
                                  isMandatory={false}
                                  required={true}
                                  checked={props.selectedRecord ? props.selectedRecord.nneedreport == transactionStatus.YES ? true : false : false}
                              />
                </Col>
                          :""}
            </Row>
        </>
    );
};

export default injectIntl(AddComment);