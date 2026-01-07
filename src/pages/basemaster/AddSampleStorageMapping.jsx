import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import { toast } from 'react-toastify';
import Axios from 'axios';
import { constructOptionList } from '../../components/CommonScript';
import rsapi from '../../rsapi';
import Preloader from '../../components/preloader/preloader.component';
import FormInput from '../../components/form-input/form-input.component';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from '../../actions/LoginTypes';


class AddSampleStorageMapping extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedRecord: this.props.selectedRecord,
            loading: false
        }
    }
    getSampleStorageLocation(inputData, fieldName, comboData) {
        let selectedRecordFilter = this.props.selectedRecordFilter || {};
        let inputParamData = {}
        this.setState({ loading: true })
        if (fieldName === 'nsamplestoragelocationcode') {
            inputParamData = {
                nstoragecategorycode: selectedRecordFilter['nstoragecategorycode'].value,
                nsamplestoragelocationcode: comboData.value,
                userinfo: inputData.userinfo
            }
        } else {
            inputParamData = {
                nstoragecategorycode: comboData.value,
                userinfo: inputData.userinfo
            }
        }
        let urlArray = [];
        const url1 = rsapi().post("samplestoragemapping/getsamplestoragemapping", inputParamData);

        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {
                let { storageLocationOptions,
                    sampleStorageVersionOptions } = this.state

                let sampleStorageLocationList = constructOptionList(response[0].data.sampleStorageLocation || [], "nsamplestoragelocationcode",
                    "ssamplestoragelocationname", undefined, undefined, undefined);
                storageLocationOptions = sampleStorageLocationList.get("OptionList");
                let sampleStorageVersionList = constructOptionList(response[0].data.sampleStorageVersion || [], "nsamplestorageversioncode",
                    "nversionno", undefined, undefined, undefined);
                sampleStorageVersionOptions = sampleStorageVersionList.get("OptionList");
                selectedRecordFilter = {
                    ...selectedRecordFilter,
                    nsamplestoragelocationcode: storageLocationOptions.length > 0 ?
                        storageLocationOptions[0] : [],
                    nsamplestorageversioncode: sampleStorageVersionOptions.length > 0 ?
                        sampleStorageVersionOptions[0] : [],

                }
                this.setState({
                    storageLocationOptions, sampleStorageVersionOptions,
                    selectedRecordFilter: {
                        ...selectedRecordFilter,
                        [fieldName]: comboData
                    },
                    loading: false
                });
            }).catch(error => {
                if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                } else {
                    toast.warn(error.response.data);
                }
                this.setState({
                    loading: false
                });
            });
    }
    getContainerStructure(inputData, fieldName, comboData) {
        let inputParamData = {}
        this.setState({ loading: true })
        inputParamData = {
            ncontainertypecode: comboData.value,
            userinfo: inputData.userinfo
        }
        let urlArray = [];
        const url1 = rsapi().post("samplestoragemapping/getContainerStructure", inputParamData);

        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {
                let { containerStructureOptions, selectedRecord } = this.state

                let containerStructureList = constructOptionList(response[0].data.containerStructure || [], "ncontainerstructurecode",
                    "scontainerstructurename", undefined, undefined, undefined);
                containerStructureOptions = containerStructureList.get("OptionList");
                selectedRecord = {
                    ...selectedRecord,
                    nnoofcontainer: selectedRecord["nneedposition"] === true ? this.calculateRowColumn(containerStructureOptions[0].item.nrow,
                        containerStructureOptions[0].item.ncolumn) : 1,
                    nrow: containerStructureOptions.length > 0 ?
                        containerStructureOptions[0].item.nrow : 1,
                    ncolumn: containerStructureOptions.length > 0 ?
                        containerStructureOptions[0].item.ncolumn : 1,
                    ncontainerstructurecode: containerStructureOptions.length > 0 ?
                        containerStructureOptions[0] : [],
                    containerStructureOptions: containerStructureOptions.length > 0 ?
                        [...containerStructureOptions] : [],
                }

                this.props.childDataChange({
                    ...selectedRecord,
                    [fieldName]: comboData
                });

                this.setState({

                    selectedRecord: {
                        ...selectedRecord,
                        [fieldName]: comboData
                    },
                    loading: false
                });
            }).catch(error => {
                if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                } else {
                    toast.warn(error.response.data);
                }
                this.setState({
                    loading: false
                });
            });
    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (fieldName === 'nstoragecategorycode') {
            this.getSampleStorageLocation({
                userinfo: this.props.userInfo,
                nstoragecategorycode: comboData.value
            }, fieldName, comboData);
        } else if (fieldName === 'ncontainertypecode') {
            this.getContainerStructure({
                userinfo: this.props.userInfo,
                ncontainertypecode: comboData.value
            }, fieldName, comboData);

        } else if (fieldName === 'ncontainerstructurecode') {
            selectedRecord['nrow'] = comboData.item.nrow ? comboData.item.nrow : 1;
            selectedRecord['ncolumn'] = comboData.item.ncolumn ? comboData.item.ncolumn : 1;
            selectedRecord['nnoofcontainer'] = selectedRecord["nneedposition"] === true ? this.calculateRowColumn(selectedRecord['nrow'],
                selectedRecord['ncolumn']) : 1

        } else if (fieldName === 'nsamplestoragelocationcode') {
            this.getSampleStorageLocation({
                userinfo: this.props.userInfo,
                nstoragecategorycode: this.props.selectedRecordFilter['nstoragecategorycode'].value,
                nsamplestoragelocationcode: comboData.value

            }, fieldName, comboData);
        }
        selectedRecord[fieldName] = comboData;
        this.props.childDataChange(selectedRecord);
        this.setState({ selectedRecord });
    }
    calculateRowColumn = (Row, column) => {
        let nnoofcontainer = Row * column;
        return nnoofcontainer;
    }
    onInputChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === "checkbox") {
            if (event.target.checked) {
                selectedRecord['ncontainertypecode'] && delete selectedRecord['ncontainertypecode'];
                selectedRecord['ncontainerstructurecode'] && delete selectedRecord['ncontainerstructurecode'];
                selectedRecord['containerStructureOptions'] && delete selectedRecord['containerStructureOptions'];
                selectedRecord['nrow'] && delete selectedRecord['nrow'];
                selectedRecord['ncolumn'] && delete selectedRecord['ncolumn'];
                selectedRecord['ndirectionmastercode'] && delete selectedRecord['ndirectionmastercode'];

                //  selectedRecord['nquantity'] = this.calculateRowColumn(selectedRecord['nrow'], selectedRecord['ncolumn']);
            }else{
                // ALPD-5620 - Sample storage mapping screen -> No of Sample Container showing wrongly in specific scenario.
                selectedRecord["nnoofcontainer"] = 1;
                selectedRecord['nrow'] =1;
                selectedRecord['ncolumn']=1;
            }
            selectedRecord[event.target.name] = event.target.checked;
        } else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.props.childDataChange(selectedRecord);
        this.setState({ selectedRecord });
    };
    // onNumericInputChange = (value, field) => {
    //     const selectedRecord = this.state.selectedRecord || {};
    //     if (!isNaN(value)) {
    //         selectedRecord[field] = value;
    //         this.props.childDataChange(selectedRecord);
    //         this.setState({ selectedRecord });
    //     }
    // }
    onNumericInputChange = (value, field) => {
        const selectedRecord = this.state.selectedRecord || {};
        let constantvalue = value.target.value ;
        // Added by reukshana for restricting negative symbol 
        // ALPD-5172 Sample storage mapping screen -> While saving sample storage mapping 500 error is occurring in specific scenario.
        let regAllow = /^-\d+(\.\d+)?$/;
        if (!regAllow.test(constantvalue)) {
            if (field === 'nnoofcontainer') {
                if (constantvalue !== 0) {
                    selectedRecord['nrow'] = 1;
                    selectedRecord['ncolumn'] = constantvalue;
                } else {
                    selectedRecord['nrow'] && delete selectedRecord['nrow'];
                    selectedRecord['ncolumn'] && delete selectedRecord['ncolumn']
                }
            }
            
            if (!isNaN(constantvalue)) {
                selectedRecord[field] = constantvalue;
                this.setState({ selectedRecord });
               }
             
            }
    }
    render() {
        return (
            <>   <Preloader loading={this.state.loading} />
                <Row>
                    <Col md={12}>
                        {this.props.operation === 'update' ?
                            <FormSelectSearch
                                name={"nsamplestoragecontainerpathcode"}
                                as={"select"}
                                onChange={(event) => this.onComboChange(event, 'nsamplestoragecontainerpathcode')}
                                formLabel={this.props.intl.formatMessage({ id: "IDS_SAMPLESTORAGEPATH" })}
                                isMandatory={true}
                                value={this.state.selectedRecord["nsamplestoragecontainerpathcode"] ? this.state.selectedRecord["nsamplestoragecontainerpathcode"] || [] : []}
                                options={this.state.selectedRecord["storageMappingMapOptions"]}
                                optionId={"value"}
                                optionValue={"label"}
                                isMulti={false}
                                isDisabled={false}
                                isSearchable={true}
                                isClearable={false}
                            /> : <FormMultiSelect
                                name={"nsamplestoragecontainerpathcode"}
                                label={this.props.intl.formatMessage({ id: "IDS_SAMPLESTORAGEPATH" })}
                                options={this.state.selectedRecord.storageMappingMapOptions || []}
                                optionId="value"
                                optionValue="label"
                                value={this.state.selectedRecord["nsamplestoragecontainerpathcode"] ? this.state.selectedRecord["nsamplestoragecontainerpathcode"] || [] : []}
                                isMandatory={true}
                                isClearable={true}
                                disableSearch={this.props.isDisabled}
                                disabled={this.props.isDisabled}
                                closeMenuOnSelect={false}
                                alphabeticalSort={true}
                                onChange={(event) => this.onComboChange(event, "nsamplestoragecontainerpathcode")}
                            />}

                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            name={"nproductcode"}
                            as={"select"}
                            onChange={(event) => this.onComboChange(event, 'nproductcode')}
                            formLabel={this.props.intl.formatMessage({ id: "IDS_PRODUCT" })}
                            isMandatory={true}
                            value={this.state.selectedRecord["nproductcode"] ? this.state.selectedRecord["nproductcode"] || [] : []}
                            options={this.state.selectedRecord["productOptions"]}
                            optionId={"value"}
                            optionValue={"label"}
                            isMulti={false}
                            isDisabled={false}
                            isSearchable={false}
                            isClearable={false}
                        />
                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            name={"nprojecttypecode"}
                            as={"select"}
                            onChange={(event) => this.onComboChange(event, 'nprojecttypecode')}
                            formLabel={this.props.intl.formatMessage({ id: "IDS_PROJECTTYPE" })}
                            isMandatory={false}
                            value={this.state.selectedRecord["nprojecttypecode"] ? this.state.selectedRecord["nprojecttypecode"] || [] : []}
                            options={this.state.selectedRecord["projectOptions"]}
                            optionId={"value"}
                            optionValue={"label"}
                            isMulti={false}
                            isDisabled={false}
                            isSearchable={false}
                            isClearable={true}
                        />
                    </Col>
                    <Col md={6}>
                    <FormInput
                            label={this.props.intl.formatMessage({ id: "IDS_QUANTITY" })}
                            name={"nquantity"}
                            type="numeric"
                            onChange={(event) => this.onNumericInputChange(event,'nquantity')}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_QUANTITY" })}
                            value={this.state.selectedRecord["nquantity"] ? this.state.selectedRecord["nquantity"] || [] : []}
                            isMandatory={false}
                           // isDisabled={this.props.selectedRecord["nneedposition"]}
                            required={true}
                            maxLength={"5"}
                        />
                    </Col>
                    <Col md={6}>
                            <FormSelectSearch
                                name={"nunitcode"}
                                as={"select"}
                                onChange={(event) => this.onComboChange(event, 'nunitcode')}
                                formLabel={this.props.intl.formatMessage({ id: "IDS_UNITNAME" })}
                                isMandatory={false}
                                value={this.state.selectedRecord["nunitcode"] ? this.state.selectedRecord["nunitcode"] || [] : []}
                                options={this.state.selectedRecord["unitOptions"]}
                                optionId={"value"}
                                optionValue={"label"}
                                isMulti={false}
                                isDisabled={false}
                                isSearchable={false}
                                isClearable={true}
                            />
                        </Col>
                    <Col md={12}>
                        {/* <FormNumericInput
                            name={"nnoofcontainer"}
                            label={this.props.intl.formatMessage({ id: "IDS_NOOFSAMPLECONTAINER" })}
                            className="form-control"
                            type="text"
                            strict={true}
                            value={this.state.selectedRecord["nnoofcontainer"] ? this.state.selectedRecord["nnoofcontainer"] || [] : []}
                            isMandatory={true}
                            required={true}
                            min={1}
                            max={this.state.selectedRecord["nneedposition"] === true ? this.state.selectedRecord['nnoofcontainer']: 99} 
                            isDisabled={this.state.selectedRecord["nneedposition"]}
                            onChange={(event) => this.onNumericInputChange(event, "nnoofcontainer")}
                            noStyle={true}

                        /> */}
                          <FormInput
                            label={this.props.intl.formatMessage({ id: "IDS_NOOFSAMPLECONTAINER" })}
                            name={"nnoofcontainer"}
                            type="numeric"
                            onChange={(event) => this.onNumericInputChange(event,'nnoofcontainer')}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_NOOFSAMPLECONTAINER" })}
                            value={this.state.selectedRecord["nnoofcontainer"] ? this.state.selectedRecord["nnoofcontainer"] || [] : []}
                            isMandatory={false}
                            isDisabled={this.state.selectedRecord["nneedposition"]}
                            required={true}
                            maxLength={this.state.selectedRecord["nneedposition"] === true ? "":"2"}
                        />
                    </Col>
                    {this.state.selectedRecord["nneedposition"] === true ? <>
                        <Col md={12}>
                            <FormSelectSearch
                                name={"ncontainertypecode"}
                                as={"select"}
                                onChange={(event) => this.onComboChange(event, 'ncontainertypecode')}
                                formLabel={this.props.intl.formatMessage({ id: "IDS_CONTAINERTYPE" })}
                                isMandatory={true}
                                value={this.state.selectedRecord["ncontainertypecode"] ? this.state.selectedRecord["ncontainertypecode"] || [] : []}
                                options={this.state.selectedRecord["containerTypeOptions"]}
                                optionId={"value"}
                                optionValue={"label"}
                                isMulti={false}
                                isDisabled={false}
                                isSearchable={false}
                                isClearable={false}
                            />
                        </Col>

                        <Col md={12}>
                            <FormSelectSearch
                                name={"ncontainerstructurecode"}
                                as={"select"}
                                onChange={(event) => this.onComboChange(event, 'ncontainerstructurecode')}
                                formLabel={this.props.intl.formatMessage({ id: "IDS_CONTAINERSTRUCTURENAME" })}
                                isMandatory={true}
                                value={this.state.selectedRecord["ncontainerstructurecode"] ? this.state.selectedRecord["ncontainerstructurecode"] || [] : []}
                                options={this.state.selectedRecord["containerStructureOptions"]}
                                optionId={"value"}
                                optionValue={"label"}
                                isMulti={false}
                                isDisabled={false}
                                isSearchable={false}
                                isClearable={false}
                            />
                        </Col>
                        <Col md={12}>
                            <FormSelectSearch
                                name={"ndirectionmastercode"}
                                as={"select"}
                                onChange={(event) => this.onComboChange(event, 'ndirectionmastercode')}
                                formLabel={this.props.intl.formatMessage({ id: "IDS_DIRECTION" })}
                                isMandatory={true}
                                value={this.state.selectedRecord["ndirectionmastercode"] ? this.state.selectedRecord["ndirectionmastercode"] || [] : []}
                                options={this.state.selectedRecord["directionmasterOptions"]}
                                optionId={"value"}
                                optionValue={"label"}
                                isMulti={false}
                                isDisabled={false}
                                isSearchable={false}
                                isClearable={false}
                            />
                        </Col> 
                    </> : ""}
                    <Col >
                            <Row>
                                <Col md={6}>
                                    <FormNumericInput
                                        name={'nrow'}
                                        label={this.props.intl.formatMessage({ id: "IDS_ROWS" })}
                                        className="form-control"
                                        type="text"
                                        strict={true}
                                        value={this.state.selectedRecord['nrow'] ?
                                            this.state.selectedRecord['nrow'] : ""}
                                        isDisabled={true}
                                        noStyle={true}
                                    />
                                </Col>
                                <Col md={6}>
                                    <FormNumericInput
                                        name={'ncolumn'}
                                        label={this.props.intl.formatMessage({ id: "IDS_COLUMNS" })}
                                        className="form-control"
                                        type="text"
                                        strict={true}
                                        value={this.state.selectedRecord['ncolumn'] ?
                                            this.state.selectedRecord['ncolumn'] : ""}
                                        isDisabled={true}
                                        noStyle={true}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    <Col md={12}>
                        <CustomSwitch
                            id={"nneedposition"}
                            name={"nneedposition"}
                            type={"switch"}
                            label={this.props.intl.formatMessage({ id: "IDS_NEEDPREDEFINEDSTRUCURE" })}
                            className={"custom-switch-md"}
                            checked={this.state.selectedRecord === undefined ? false : this.state.selectedRecord["nneedposition"]}
                            defaultValue={this.state.selectedRecord === undefined ? false : this.state.selectedRecord["nneedposition"]}
                            onChange={this.onInputChange}

                        />
                    </Col>

                </Row>
            </>

        )
    }

}
export default injectIntl(AddSampleStorageMapping);