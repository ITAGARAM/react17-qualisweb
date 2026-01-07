import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, FormGroup, FormLabel } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { toast } from 'react-toastify';
import Axios from 'axios';
import rsapi from '../../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from '../../actions/LoginTypes';
import FormInput from '../../components/form-input/form-input.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faTrashRestore } from '@fortawesome/free-solid-svg-icons';
import { intl } from '../../components/App';
import { ReadOnlyText } from '../../components/App.styles';
import TestPopOver from '../ResultEntryBySample/TestPopOver';
import { transactionStatus } from '../../components/Enumeration';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class RetrieveOrDiposeSample extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedRecord: this.props.selectedRecord,
            dynamicfields: this.props.dynamicfields
        }
    }


    onInputOnChange = (event) => {

        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (!event.target.checked) {
                selectedRecord['nunitcode'] && delete selectedRecord['nunitcode']
                selectedRecord['nquantity'] && delete selectedRecord['nquantity']
                selectedRecord['saliquotsampleid'] && delete selectedRecord['saliquotsampleid']
            }
            selectedRecord[event.target.name] = event.target.checked
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.props.childDataChange(selectedRecord);
        this.setState({ selectedRecord });
    }
    onNumericInputChange = (value, field) => {
        const selectedRecord = this.state.selectedRecord || {};
        let constantvalue = value.target.value;
        if (!isNaN(constantvalue)) {
            selectedRecord[field] = constantvalue;
            this.props.childDataChange(selectedRecord);
            this.setState({ selectedRecord });
        }
    }
    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        this.props.childDataChange(selectedRecord);
        this.setState({ selectedRecord });
    }
    getSelectedBarcodeData(e, inputParam) {
        if (e.keyCode === 13) {
            this.setState({ loading: true })
            let selectedRecord = this.state.selectedRecord || {};
            let urlArray = [];
            const url1 = rsapi().post("/samplestorageretrieval/getSelectedBarcodeData", {
                nprojecttypecode: this.props.breadcrumbprojecttype.value,
                spositionvalue: inputParam.spositionvalue,
                userinfo: this.props.userInfo
            });
            urlArray = [url1];
            Axios.all(urlArray)
                .then(response => {
                    let dynamicfields = [];
                    //ALPD-4717--Vignesh R(23-08-2024)
                    let selectedBarcodeValue = [];
                    let temparray2 = [];
                    //Added by ATE234 JK based on settings table change the dynamic fields
                    if (this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.YES) {

                        dynamicfields = [{ "idsName": "IDS_SAMPLEID", "dataField": "spositionvalue", "width": "200px", "staticField": true },
                        { "idsName": "IDS_POSITION", "dataField": "sposition", "width": "200px", "staticField": true }];

                    } else {
                        dynamicfields = [{ "idsName": "IDS_SAMPLEID", "dataField": "spositionvalue", "width": "200px", "staticField": true },
                        { "idsName": "IDS_POSITION", "dataField": "sposition", "width": "200px", "staticField": true },
                        { "idsName": "IDS_QUANTITY", "dataField": "nquantity", "width": "200px", "staticField": true },
                        { "idsName": "IDS_UNIT", "dataField": "sunitname", "width": "200px", "staticField": true }];
                    }

                    temparray2 = response[0].data['selectedProjectTypeList'] && response[0].data['selectedProjectTypeList'].map((option) => {
                        return { "idsName": option.sfieldname, "dataField": option.sfieldname, "width": "200px" };
                    });

                    dynamicfields = [...dynamicfields, ...temparray2]
                    //ALPD-4717--Vignesh R(23-08-2024)
                    selectedBarcodeValue = { ...response[0].data['selectedBarcodeValue'] }
                    if (response[0].data['selectedBarcodeValue'].jsondata !== undefined) {
                        selectedBarcodeValue = { ...selectedBarcodeValue, ...JSON.parse(response[0].data['selectedBarcodeValue'].jsondata.value) }
                    }
                    this.setState({
                        dynamicfields,
                        selectedBarcodeValue: { ...selectedBarcodeValue },
                        loading: false
                    })
                })
                .catch(error => {

                    if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    this.props.updateStore({ typeName: DEFAULT_RETURN, data: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                        const UnAuthorizedAccess = {
                            typeName: UN_AUTHORIZED_ACCESS,
                            data: {
                                navigation: 'forbiddenaccess',
                                loading: false,
                                responseStatus: error.response.status
                            }

                        }
                        this.props.updateStore(UnAuthorizedAccess);
                    } else if (error.response.status === 500) {
                        toast.error(error.message);
                        this.setState({
                            loading: false
                        });
                    }
                    else {
                        this.setState({
                            dynamicfields: [],
                            selectedBarcodeValue: {},
                            loading: false,
                        })
                        toast.info(error.response.data);
                    }

                })
        }
    }
    componentDidUpdate(previousProps) {
        let { selectedRecord, dynamicfields
        } = this.state
        let bool = false;

        if (this.props.dynamicfields !== previousProps.dynamicfields) {
            bool = true;
            dynamicfields = this.props.dynamicfields || {};
        }
        if (this.props.selectedRecord !== previousProps.selectedRecord) {
            bool = true;
            selectedRecord = this.props.selectedRecord || {};
        }
        if (bool) {
            this.setState({
                selectedRecord, dynamicfields
            });
        }
    }

    render() {
        const retrieve = this.props.controlMap.has("Retrieve") && this.props.controlMap.get("Retrieve").ncontrolcode;
        const dispose = this.props.controlMap.has("Dispose") && this.props.controlMap.get("Dispose").ncontrolcode;

        return (
            <Col md={12}>
                <Row>
                    <Col md={6}>
                        <FormInput
                            name={'spositionvalue'}
                            label={this.props.intl.formatMessage({ id: "IDS_SAMPLEID" })}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SAMPLEID" })}
                            value={this.state.selectedRecord['spositionvalue']
                                ? this.state.selectedRecord['spositionvalue'] : ""}
                            maxLength={20}
                            isMandatory={true}
                            onKeyDown={(event) => this.getSelectedBarcodeData(event, this.state.selectedRecord)}
                            onChange={(event) => this.onInputOnChange(event)}
                        />
                    </Col>
                    <Col md={3}>
                        <button className="btn btn-primary" style={{ float: "right", marginRight: "1rem" }}
                            onClick={() => this.props.CRUDSampleStorageTransaction({
                                sunitname: this.state.selectedRecord.nunitcode ? this.state.selectedRecord.nunitcode.label : "NA",
                                saliquotsampleid: this.state.selectedRecord.saliquotsampleid
                                    && this.state.selectedRecord.saliquotsampleid !== ""
                                    ? this.state.selectedRecord.saliquotsampleid : "",
                                nquantity: this.state.selectedRecord.nquantity
                                    && this.state.selectedRecord.nquantity !== ""
                                    ? this.state.selectedRecord.nquantity : 0,
                                ncontrolcode: retrieve,
                                'nsamplestoragetransactioncode': this.state.selectedBarcodeValue && this.state.selectedBarcodeValue.nsamplestoragetransactioncode,
                                userinfo: this.props.userInfo,
                                scomments: this.state.selectedRecord.scomments && this.state.selectedRecord.scomments !== ""
                                    ? this.state.selectedRecord.scomments : "-",
                                isRetrieve: true,
                                spositionvalue: this.state.selectedRecord.spositionvalue,
                                nneedaliquot: this.state.selectedRecord.nneedaliquot &&
                                    this.state.selectedRecord.nneedaliquot ? true : false,
                                nunitcode: this.state.selectedRecord.nunitcode && this.state.selectedRecord.nunitcode !== ""
                                    ? this.state.selectedRecord.nunitcode : 0
                            }, 'create')}
                            hidden={this.props.userRoleControlRights.indexOf(retrieve) === -1}
                        >
                            <FontAwesomeIcon icon={faTrashRestore}></FontAwesomeIcon>{"  "}
                            {this.props.intl.formatMessage({ id: "IDS_RETRIEVE" })}


                        </button>
                    </Col>
                    <Col md={3}>
                        <button className="btn btn-primary" style={{ float: "right", marginRight: "1rem" }}
                            onClick={() => this.props.CRUDSampleStorageTransaction({
                                sunitname: this.state.selectedRecord.nunitcode ? this.state.selectedRecord.nunitcode.label : "NA",
                                saliquotsampleid: this.state.selectedRecord.saliquotsampleid
                                    && this.state.selectedRecord.saliquotsampleid !== ""
                                    ? this.state.selectedRecord.saliquotsampleid : "",
                                nquantity: this.state.selectedRecord.nquantity
                                    && this.state.selectedRecord.nquantity !== ""
                                    ? this.state.selectedRecord.nquantity : 0,
                                ncontrolcode: dispose,
                                'nsamplestoragetransactioncode': this.state.selectedBarcodeValue && this.state.selectedBarcodeValue.nsamplestoragetransactioncode,
                                userinfo: this.props.userInfo,
                                scomments: this.state.selectedRecord.scomments && this.state.selectedRecord.scomments !== ""
                                    ? this.state.selectedRecord.scomments : "-",
                                isRetrieve: false,
                                spositionvalue: this.state.selectedRecord.spositionvalue,
                                nneedaliquot: this.state.selectedRecord.nneedaliquot &&
                                    this.state.selectedRecord.nneedaliquot ? true : false
                            }, 'create')}
                            hidden={this.props.userRoleControlRights.indexOf(dispose) === -1}
                        >
                            <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>{"  "}
                            {this.props.intl.formatMessage({ id: "IDS_DISPOSE" })}

                        </button>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <FormInput
                            name={'scomments'}
                            label={this.props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                            value={this.state.selectedRecord['scomments']
                                ? this.state.selectedRecord['scomments'] : ""}
                            maxLength={255}
                            onChange={(event) => this.onInputOnChange(event)}
                        />
                    </Col>
                </Row>

                {this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.NO ?
                    <Row>
                        <Col md={12}>
                            <CustomSwitch
                                id={"nneedaliquot"}
                                name={"nneedaliquot"}
                                type={"switch"}
                                label={this.props.intl.formatMessage({ id: "IDS_INPUTFORALIQUOTSAMPLE" })}
                                className={"custom-switch-md"}
                                checked={this.state.selectedRecord && this.state.selectedRecord["nneedaliquot"] ? true : false}
                                onChange={this.onInputOnChange}
                            />
                        </Col>
                    </Row>
                    : ""
                }
                {this.state.selectedRecord["nneedaliquot"] && this.props.Login.settings && parseInt(this.props.Login.settings[84]) === transactionStatus.NO ?
                    <>
                        <Row>
                            <Col md={6}>
                                <FormInput
                                    name={'saliquotsampleid'}
                                    label={this.props.intl.formatMessage({ id: "IDS_NEWSAMPLEID" })}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_NEWSAMPLEID" })}
                                    value={this.state.selectedRecord['saliquotsampleid']
                                        ? this.state.selectedRecord['saliquotsampleid'] : ""}
                                    maxLength={20}
                                    isMandatory={true}
                                    onChange={(event) => this.onInputOnChange(event)}
                                />
                            </Col>
                            <Col md={6}> <TestPopOver intl={this.props.intl} needIcon={true} needPopoverTitleContent={true}
                                placement="right" stringList={['The Sample will be Restored to the Same Position']}
                            ></TestPopOver></Col>

                        </Row>

                        <Row>
                            <Col md={6}>
                                <FormInput
                                    label={this.props.intl.formatMessage({ id: "IDS_QUANTITY" })}
                                    name={"nquantity"}
                                    type="numeric"
                                    onChange={(event) => this.onNumericInputChange(event, 'nquantity')}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_QUANTITY" })}
                                    value={this.state.selectedRecord["nquantity"] ? this.state.selectedRecord["nquantity"] || [] : []}
                                    isMandatory={true}
                                    required={true}
                                    maxLength={"5"}
                                />
                            </Col >
                            <Col md={6}>
                                <FormSelectSearch
                                    name={"nunitcode"}
                                    as={"select"}
                                    onChange={(event) => this.onComboChange(event, 'nunitcode')}
                                    formLabel={this.props.intl.formatMessage({ id: "IDS_UNITNAME" })}
                                    isMandatory={true}
                                    value={this.state.selectedRecord["nunitcode"] ? this.state.selectedRecord["nunitcode"] || [] : []}
                                    options={this.props.unitMapList ? this.props.unitMapList : []}
                                    optionId={"value"}
                                    optionValue={"label"}
                                    isMulti={false}
                                    isDisabled={false}
                                    isSearchable={false}
                                    isClearable={false} />
                            </Col>
                        </Row>

                    </>
                    : ""
                }

                <Row>
                    {this.state.dynamicfields && this.state.dynamicfields.length > 0 &&
                        <div className=' mb-2'>
                            <Card>
                                <Card.Header>
                                    <span style={{ display: "inline-block", marginTop: "1%" }} >
                                        <h4>{this.props.intl.formatMessage({ id: "IDS_SAMPLEINFO" })}</h4>
                                    </span>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        {
                                            this.state.dynamicfields && this.state.dynamicfields.map((item, index) => {
                                                return (
                                                    <>
                                                        <Col md={6} key={`specInfo_${index}`}>
                                                            <FormGroup>
                                                                <FormLabel>{
                                                                    item.hasOwnProperty('staticField') ?
                                                                        this.props.intl.formatMessage({ id: item.idsName }) : item.idsName}  </FormLabel>
                                                                <ReadOnlyText>{this.state.selectedBarcodeValue[item.dataField] === "" ||
                                                                    this.state.selectedBarcodeValue[item.dataField] === undefined ||
                                                                    this.state.selectedBarcodeValue[item.dataField] === null ?
                                                                    "-" : this.state.selectedBarcodeValue[item.dataField]}</ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>
                                                    </>
                                                )
                                            })
                                        }
                                    </Row>
                                </Card.Body>
                            </Card>
                        </div>}
                </Row>
            </Col>

        )
    }

}
//export default injectIntl(RetrieveOrDiposeSample);
export default connect(mapStateToProps)(injectIntl(RetrieveOrDiposeSample));