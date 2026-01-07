import React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Row, Col } from 'react-bootstrap';
import { process } from '@progress/kendo-data-query';
import FormInput from '../form-input/form-input.component';
//import CustomSwitch from '../custom-switch/custom-switch.component';
import FormSelectSearch from '../form-select-search/form-select-search.component';
import DataGrid from '../data-grid/data-grid.component';
import { designComponents } from '../Enumeration';

class AddDesign extends React.Component {
    constructor(props) {
        super(props)
        const dataState = {
            skip: 0,
            take: 10
            // group: [{ field: 'schildparametername' }]
        };
        this.state = {
            dataState: dataState, dataResult: [],
            selectedRecord: {},

        }
    }
    // dataStateChange = (event) => {
    //     this.setState({
    //         dataResult: process(this.props.addDesignParam, event.dataState),
    //         dataState: event.dataState
    //     });
    // }
    render() {
        return (
            <>
                <Row>
                    <Col md={6}>
                        <FormInput
                            label={this.props.intl.formatMessage({ id: this.props.inputColumnList[0].idsName })}
                            name={this.props.inputColumnList[0].dataField}
                            type="text"
                            placeholder={this.props.intl.formatMessage({ id: this.props.inputColumnList[0].idsName })}
                            value={this.props.designName}
                            readOnly={true}
                            maxLength={this.props.inputColumnList[0].maxLength}
                            onChange={(event) => this.props.onInputOnChange(event)}

                        />
                    </Col>
                    <Col md={6}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: this.props.inputColumnList[1].idsName })}
                            name={this.props.inputColumnList[1].dataField}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            options={this.props[this.props.inputColumnList[1].listName]}
                            value={this.props.selectedRecord[this.props.inputColumnList[1].dataField] || ""}
                            closeMenuOnSelect={true}
                            isMulti={false}
                            isSearchable={true}
                            isDisabled={false}
                            isMandatory={true}
                            isClearable={false}
                            onChange={value => this.props.handleChange(value, this.props.inputColumnList[1].dataField)}

                        />
                    </Col>
                    <Col md={6}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: this.props.inputColumnList[2].idsName })}
                            name={this.props.inputColumnList[2].dataField}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            options={this.props[this.props.inputColumnList[2].listName]}
                            value={this.props.selectedRecord[this.props.inputColumnList[2].dataField] || ""}
                            closeMenuOnSelect={true}
                            isSearchable={true}
                            isMandatory={true}
                            isMulti={false}
                            isClearable={false}
                            onChange={value => this.props.handleChange(value, this.props.inputColumnList[2].dataField)}

                        />
                    </Col>
                    <Col md={6}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: this.props.inputColumnList[3].idsName })}
                            name={this.props.inputColumnList[3].dataField}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            options={this.props[this.props.inputColumnList[3].listName]}
                            value={this.props.selectedRecord ? (this.props.selectedRecord[this.props.inputColumnList[3].dataField] &&
                                this.props.selectedRecord[this.props.inputColumnList[1].dataField] &&
                                this.props.selectedRecord[this.props.inputColumnList[1].dataField].value === designComponents.COMBOBOX
                                ? this.props.selectedRecord[this.props.inputColumnList[3].dataField] : "") : ""}

                            closeMenuOnSelect={true}
                            isSearchable={true}
                            isDisabled={Object.values(this.props.selectedRecord).length > 0 ? (this.props.selectedRecord[this.props.inputColumnList[1].dataField] === undefined ? true :
                                this.props.selectedRecord[this.props.inputColumnList[1].dataField].value !== designComponents.COMBOBOX ? true : false):true}
                            isMandatory={this.props.selectedRecord[this.props.inputColumnList[1].dataField] &&
                                this.props.selectedRecord[this.props.inputColumnList[1].dataField].value === designComponents.COMBOBOX ? true : false}
                            required={this.props.selectedRecord[this.props.inputColumnList[1].dataField] &&
                                this.props.selectedRecord[this.props.inputColumnList[1].dataField].value === designComponents.COMBOBOX ? true : false}
                            isMulti={false}
                            isClearable={true}
                            onChange={value => this.props.handleChange(value, this.props.inputColumnList[3].dataField)}

                        />
                    </Col>
                    <Col md={6}>
                        <FormInput
                            label={this.props.intl.formatMessage({ id: this.props.inputColumnList[4].idsName })}
                            name={this.props.inputColumnList[4].dataField}
                            type="text"
                            placeholder={this.props.intl.formatMessage({ id: this.props.inputColumnList[4].idsName })}
                            value={this.props.selectedRecord ? this.props.selectedRecord[this.props.inputColumnList[4].dataField] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={this.props.inputColumnList[4].maxLength}
                            onChange={this.props.onInputOnChange}
                        />
                    </Col>
                    <Col md={6}>
                        <FormInput
                            label={this.props.intl.formatMessage({ id: this.props.inputColumnList[5].idsName })}
                            name={this.props.inputColumnList[5].dataField}
                            type="text"
                            placeholder={this.props.intl.formatMessage({ id: this.props.inputColumnList[5].idsName })}
                            value={this.props.selectedRecord ? (this.props.selectedRecord[this.props.inputColumnList[1].dataField] &&
                                this.props.selectedRecord[this.props.inputColumnList[1].dataField].value === designComponents.DATEPICKER
                                ? this.props.selectedRecord[this.props.inputColumnList[5].dataField] : "") : ""}
                            isMandatory={this.props.selectedRecord[this.props.inputColumnList[1].dataField] &&
                                this.props.selectedRecord[this.props.inputColumnList[1].dataField].value === designComponents.DATEPICKER ? true : false}
                            readOnly={this.props.selectedRecord[this.props.inputColumnList[1].dataField] &&
                                this.props.selectedRecord[this.props.inputColumnList[1].dataField].value !== designComponents.DATEPICKER ? true : false}
                            required={this.props.selectedRecord[this.props.inputColumnList[1].dataField] &&
                                this.props.selectedRecord[this.props.inputColumnList[1].dataField].value === designComponents.DATEPICKER ? true : false}
                            maxLength={this.props.inputColumnList[5].maxLength}
                            //onChange={(event) => this.props.onInputOnChange(event)}     
                            onChange={this.props.onInputOnChange}
                        />
                    </Col>
                    {/* <Col md={6}>
                       <CustomSwitch                          
                           name={this.props.inputColumnList[6].dataField}
                           type="switch"
                           label={ this.props.intl.formatMessage({ id: this.props.inputColumnList[6].idsName })}                          
                           placeholder={ this.props.intl.formatMessage({ id: this.props.inputColumnList[6].idsName })}
                           defaultValue ={ this.props.selectedRecord[this.props.inputColumnList[6].dataField] === transactionStatus.YES ? true :false}
                           //isMandatory={false}
                           //required={false}
                           checked={ this.props.selectedRecord[this.props.inputColumnList[6].dataField] === transactionStatus.YES ? true :false }
                           //onChange={(event)=> this.props.onInputOnChange(event)}
                           onChange={this.props.onInputOnChange} 
                          />
                   </Col> */}
                    <Col className="d-flex justify-content-end p-2" md={12}>
                        <Button className="btn-user btn-primary-blue"
                            onClick={() => this.props.addParametersInDataGrid(this.props.selectedRecord)}
                        >
                            <FontAwesomeIcon icon={faSave} /> { }
                            <FormattedMessage id='IDS_ADD' defaultMessage='Add' />
                        </Button>
                    </Col>
                </Row>
                <Row>

                    <Col md={12}>
                        <DataGrid primaryKeyField={this.props.gridPrimaryKey}
                            data={this.props.gridData || []}
                            dataResult={process(this.props.gridData || [], this.state.dataState)}
                            dataState={this.state.dataState}
                            dataStateChange={(event) => this.setState({ dataState: event.dataState })}
                            extractedColumnList={this.props.gridColumnList}
                            controlMap={this.props.controlMap}
                            userRoleControlRights={this.props.userRoleControlRights}
                            inputParam={this.props.inputParam}
                            userInfo={this.props.userInfo}
                            deleteRecordWORights={this.props.deleteRecordWORights}
                            pageable={false}
                            //ALPDJ21-143--Added by Vignesh(18-12-2025)--Scrollable was not working in the Config Report Design screen while adding records.
                            gridHeight={'580px'}
                            scrollable={"scrollable"}
                            isActionRequired={true}
                            isToolBarRequired={false}
                            selectedId={null}
                            hideColumnFilter={true}
                            hasControlWithOutRights={true}
                            showdeleteRecordWORights={true}
                        />

                    </Col>

                </Row>
            </>
        );
    }


}
export default injectIntl(AddDesign);
