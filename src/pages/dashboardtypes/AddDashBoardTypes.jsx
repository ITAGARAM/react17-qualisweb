import React from 'react'
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';


const AddDashBoardTypes = (props) => {
   //console.log("AddDashBoardTypes props:",props);
    return (
        <>
            <Row>
                <Col md={12}>
                    <FormInput
                        label={props.intl.formatMessage({ id: "IDS_DASHBOARDTYPENAME" })}
                        name={"sdashboardtypename"}
                        type="text"
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_DASHBOARDTYPENAME" })}
                        value={props.selectedRecord ? props.selectedRecord["sdashboardtypename"] : ""}
                        isMandatory={true}
                        required={true}
                        maxLength={"50"}
                    />
                
                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_CHARTTYPE" })}
                        isSearchable={true}
                        name={"ncharttypecode"}
                        isDisabled={false}
                        placeholder={props.intl.formatMessage({ id: "IDS_PLAESESELCT" })}
                        isMandatory={true}
                        isClearable={false}
                        options={props.chartType}
                        optionId='ncharttypecode'
                        optionValue='schartname'
                        //defaultValue={props.ncharttypecode || []}
                        value={props.selectedRecord.ncharttypecode ? props.selectedRecord.ncharttypecode : ""}
                        onChange={value => props.handleChange(value, "ncharttypecode", "ChartType")}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                    >
                    </FormSelectSearch>
               
                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_QUERY" })}
                        isSearchable={true}
                        name={"nsqlquerycode"}
                        isDisabled={false}
                        placeholder={props.intl.formatMessage({ id: "IDS_PLAESESELCT" })}
                        isMandatory={true}
                        isClearable={false}
                        options={props.sqlQuery}
                        optionId='nsqlquerycode'
                        optionValue='ssqlqueryname'
                        //defaultValue={props.nsqlquerycode ? props.nsqlquerycode : ""}
                        value={props.selectedRecord.nsqlquerycode ? props.selectedRecord.nsqlquerycode : ""}
                        onChange={value => props.handleChange(value, "nsqlquerycode", "")}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                    >
                    </FormSelectSearch>
                </Col>
               
            </Row>

            <Row className="mtop-4">
                <Col md={12}>
                {props.ChartProperty && props.ChartProperty.map((Property, index) => (
                    <>
                        {Property.schartpropertyname === "field"
                            || Property.schartpropertyname === "nameField" || Property.schartpropertyname === "xFieldBubble" ?
                          
                                <FormSelectSearch
                                    formLabel={props.intl.formatMessage((Property.schartpropertyname === "xField" || Property.schartpropertyname === "xFieldBubble") ?
                                        { id: "IDS_XSERIES" } : (Property.schartpropertyname === "field" ? { id: "IDS_CATAEGORYFIELD" } : { id: "IDS_VALUEFIELD" }))}
                                    isSearchable={true}
                                    name={Property.schartpropertyname}
                                    isDisabled={false}
                                    placeholder={props.intl.formatMessage({ id: "IDS_PLAESESELCT" })}
                                    isMandatory={true}
                                    isClearable={false}
                                    options={(Property.schartpropertyname === "field" || Property.schartpropertyname === "xFieldBubble") ? props.SqlColumns ? props.SqlColumns.xSeriesColumns || [] : [] : props.SqlColumns ? props.SqlColumns.ySeriesColumns || [] : []}
                                    value={props.selectedRecord[Property.schartpropertyname] || []}
                                    onChange={value => props.handleChange(value, Property.schartpropertyname, Property.schartpropertyname)}
                                    closeMenuOnSelect={true}
                                >
                                </FormSelectSearch>                         
                            :
                            <>
                                {Property.schartpropertyname === "yField" ?
                                  
                                        <FormSelectSearch
                                            formLabel={props.intl.formatMessage({ id: "IDS_YSERIES" })}
                                            isSearchable={true}
                                            name={"yColumnName"}
                                            isDisabled={false}
                                            placeholder={props.intl.formatMessage({ id: "IDS_PLAESESELCT" })}
                                            isMandatory={true}
                                            isClearable={true}
                                            isMulti={true}
                                            // options={props.ySeriesColumnList?props.ySeriesColumnList||[]:[]}
                                            options={props.SqlColumns ? props.SqlColumns.ySeriesColumns || [] : []}
                                            // optionId='ColumnName'
                                            // optionValue='ColumnName'
                                            // value={props.operation === "update" ? props.yValue : props.Value || []}
                                            value={props.selectedRecord["yColumnName"] || []}
                                            onChange={value => props.handleChange(value, "yColumnName", Property.schartpropertyname)}
                                            closeMenuOnSelect={false}
                                        // alphabeticalSort={true}
                                        >
                                        </FormSelectSearch>
                                   
                                    :
                                    <>
                                        {Property.schartpropertyname === "xField" ?
                                            
                                                <FormSelectSearch
                                                    formLabel={props.intl.formatMessage({ id: "IDS_XSERIES" })}
                                                    isSearchable={true}
                                                    name={"xColumnName"}
                                                    isDisabled={false}
                                                    placeholder={props.intl.formatMessage({ id: "IDS_PLAESESELCT" })}
                                                    isMandatory={true}
                                                    isClearable={false}
                                                    // options={props.xSeriesColumnList?props.xSeriesColumnList||[]:[]}
                                                    options={props.SqlColumns ? props.SqlColumns.xSeriesColumns || [] : []}
                                                    // optionId='ColumnName'
                                                    // optionValue='ColumnName' // props.Value 
                                                    //   value={props.operation === "update" ? props.xValue : props.selectedRecord["xColumnName"] || []}
                                                    value={props.selectedRecord["xColumnName"] || []}
                                                    onChange={value => props.handleChange(value, "xColumnName", Property.schartpropertyname)}
                                                    closeMenuOnSelect={true}
                                                // alphabeticalSort={true}
                                                >
                                                </FormSelectSearch>
                                           
                                            :
                                            <>

                                                {Property.schartpropertyname === "yFieldBubble" ||
                                                 Property.schartpropertyname === "sizeField" || Property.schartpropertyname === "categoryField" ?
                                                  
                                                        <FormSelectSearch
                                                            formLabel={props.intl.formatMessage( Property.schartpropertyname === "yFieldBubble" ? { id: "IDS_YSERIES" } : 
                                                            Property.schartpropertyname === "sizeField" ? { id: "IDS_SIZEFIELD" } : { id: "IDS_CATAEGORYFIELD" })}
                                                            isSearchable={true}
                                                            name={Property.schartpropertyname}
                                                            isDisabled={false}
                                                            placeholder={props.intl.formatMessage({ id: "IDS_PLAESESELCT" })}
                                                            isMandatory={true}
                                                            isClearable={true}
                                                            isMulti={true}
                                                            options={props.SqlColumns ? Property.schartpropertyname === "categoryField" ? props.SqlColumns.xSeriesColumns : props.SqlColumns.ySeriesColumns || [] : []}
                                                            value={props.selectedRecord[Property.schartpropertyname] || []}
                                                            onChange={value => props.handleChange(value, Property.schartpropertyname, Property.schartpropertyname)}
                                                            closeMenuOnSelect={false}
                                                        // alphabeticalSort={true}
                                                        >
                                                        </FormSelectSearch>
                                                  
                                                    :
                                                    <></>
                                                }
                                            </>
                                        }
                                    </>
                                }
                            </>
                        }
                    </>
                ))
                }
                </Col>
            </Row>
        </>
    )
}
export default injectIntl(AddDashBoardTypes);