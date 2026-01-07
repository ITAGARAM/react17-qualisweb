import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from '../../actions/LoginTypes';
import { toast } from 'react-toastify';
import Axios from 'axios';
import { constructOptionList } from '../../components/CommonScript';
import rsapi from '../../rsapi';
import Preloader from '../../components/preloader/preloader.component';
import { transactionStatus } from '../../components/Enumeration';
//#SECURITY-VULNERABILITY-MERGING-START
import { intl } from '../../components/App';
//#SECURITY-VULNERABILITY-MERGING-END

function RoundProgressBar(props) {
    const size = props.size;
    const radius = (props.size - props.strokeWidth) / 2;
    const viewBox = `0 0 ${size} ${size}`;
    const dashArray = radius * Math.PI * 2;
    const dashOffset = dashArray - dashArray * props.value / props.max;
    const percentage = (props.value / props.max * 100).toFixed();
    return (<></>
        // <svg
        //     width={props.size}
        //     height={props.size}
        //     viewBox={viewBox}
        // >
        // <CircularProgressbarWithChildren value={props.value} maxValue={props.max}>
        //     <text
        //         x="55%"
        //         y="50%"
        //         dy="0.4rem"
        //         textAnchor="end"
        //         fill={props.stroke}
        //         style={{
        //             fontSize: '2.5rem',
        //             fontFamily: 'Varela Round',
        //             fontWeight: 'bold',
        //         }}
        //     >
        //         {`${props.value}`}
        //     </text>
        //     <text
        //         x="55%"
        //         y="50%"
        //         dy=".4rem"
        //         textAnchor="start"
        //         fill={props.stroke}
        //         style={
        //             {
        //                 fontSize: '1.4rem',
        //                 fontFamily: 'Varela Round',
        //                 fontWeight: 'bold'
        //             }
        //         }
        //     >
        //         {`/${props.max}`}
        //     </text>
        //     <text
        //         x="50%"
        //         y="50%"
        //         dy="1.5rem"
        //         textAnchor="middle"
        //         fill={props.stroke}
        //         style={
        //             {
        //                 fontSize: '1rem',
        //                 fontFamily: 'Varela Round',
        //                 fontWeight: 'bold',
        //             }
        //         }
        //     >
        //         {props.text}
        //     </text>
        //     <text
        //         x="50%"
        //         y="50%"
        //         dy="2.7rem"
        //         textAnchor="middle"
        //         fill={props.stroke}
        //         style={
        //             {
        //                 fontSize: '1rem',
        //                 fontFamily: 'Varela Round',
        //             }
        //         }
        //     >
        //         {`${percentage}%`}
        //     </text>
        // </CircularProgressbarWithChildren>
    );
}


RoundProgressBar.defaultProps = {
    size: 200,
    value: 25,
    max: 100,
    strokeWidth: 10,
    stroke: 'red',
    text: ""
}

class MoveSampleCustomComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRecord: this.props.selectedRecord,
            loading: false
        }
    }
    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        this.props.childDataChange(selectedRecord);
        this.setState({ selectedRecord });
    }
    render() {
        let primaryKey = this.props.param.nsamplestoragemappingcode;
        return (

            <Row>
                <Col md={12}>
                    <FormSelectSearch
                        name={primaryKey}
                        as={"select"}
                        onChange={(event) => this.onComboChange(event, primaryKey)}
                        formLabel={this.props.param.scontainerpath}
                        isMandatory={true}
                        value={this.state.selectedRecord ?
                            this.state.selectedRecord[primaryKey] || [] : []}
                        options={this.state.selectedRecord.mappingcodeOptions[primaryKey]["samplestoragecontainerpathOptions"] || []}
                        optionId={"value"}
                        optionValue={"label"}
                        isMulti={false}
                        isDisabled={false}
                        isSearchable={true}
                        isClearable={false}
                    />

                </Col>
            </Row>

        )
    }
}

class MoveSample extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedRecord: this.props.selectedRecord,
            loading: false,
            availableContainers: this.props.availableContainers,
            totalContainers: this.props.totalContainers
        }
    }
    getSampleStorageLocation(inputData, fieldName, comboData) {
        let inputParamData = {}
        this.setState({ loading: true })
        inputParamData = {
            isMultiContainermove: this.props.isMultiContainermove,
            nsamplestoragelocationcode: fieldName === 'nsamplestoragelocationcode' ? comboData ? comboData.value : 0 : this.state.selectedRecord.nsamplestoragelocationcode ?
                this.state.selectedRecord.nsamplestoragelocationcode.value : 0,
            ncontainertypecode: this.props.sourcencontainertypecode,
            ncontainerstructurecode: this.props.sourcencontainerstructurecode,
            nprojecttypecode: fieldName === 'nprojecttypecode' ? comboData ? comboData.value : 0 : this.state.selectedRecord.nprojecttypecode ?
                this.state.selectedRecord.nprojecttypecode.value : 0,
            nproductcode: fieldName === 'nproductcode' ? comboData ? comboData.value : 0 : this.state.selectedRecord.nproductcode ?
                this.state.selectedRecord.nproductcode.value : 0,
            ninstrumentcode: fieldName === 'ninstrumentcode' ? comboData ? comboData.value : 0 : this.state.selectedRecord.ninstrumentcode ?
                this.state.selectedRecord.ninstrumentcode.value : 0,
            userinfo: inputData.userinfo
        }
        let urlArray = [];
        const url1 = rsapi().post("samplestoragemove/getsamplemovedata", inputParamData);

        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {
                let selectedRecord = this.state.selectedRecord;
                const storageStructureMap = constructOptionList(response[0].data['sampleStorageLocation'] || [],
                    "nsamplestoragelocationcode",
                    "ssamplestoragelocationname", undefined, undefined, true);
                const storageStructureList = storageStructureMap.get("OptionList");

                const samplestoragecontainerpathMap = constructOptionList(response[0].data['samplestoragecontainerpath'] || [],
                    "nsamplestoragemappingcode",
                    "scontainerpath", undefined, undefined, true);
                const samplestoragecontainerpathList = samplestoragecontainerpathMap.get("OptionList");
                selectedRecord = {
                    ...selectedRecord,
                    [fieldName]: {
                        ...comboData
                    },
                    nsamplestoragemappingcode: samplestoragecontainerpathList.length > 0 ? {
                        label: samplestoragecontainerpathList[0].label,
                        value: samplestoragecontainerpathList[0].value,
                        item: samplestoragecontainerpathList[0].item
                    } : "",
                    nsamplestoragelocationcode: storageStructureList.length > 0 ? {
                        label: storageStructureList[0].label,
                        value: storageStructureList[0].value,
                        item: storageStructureList[0].item
                    } : "",
                    storageStructureOptions: storageStructureList,
                    samplestoragecontainerpathOptions: samplestoragecontainerpathList,
                }
                if (comboData === null) {
                    delete selectedRecord[fieldName];
                }

                this.props.childDataChange(selectedRecord, response[0].data['availableContainers']);

                this.setState({
                    availableContainers: response[0].data['availableContainers'],
                    totalContainers: response[0].data['totalContainers'],
                    selectedRecord,
                    loading: false
                })
            }).catch(error => {
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
        if (fieldName === 'nproductcode' || fieldName === 'nprojecttypecode') {
            this.getSampleStorageLocation({
                userinfo: this.props.userInfo,
                [fieldName]: comboData ? comboData.value : 0
            }, fieldName, comboData);
        } else if (fieldName === 'ncontainertypecode') {
            this.getContainerStructure({
                userinfo: this.props.userInfo,
                ncontainertypecode: comboData ? comboData.value : 0
            }, fieldName, comboData);

        } else if (fieldName === 'nproductcode') {
            this.getContainerStructure({
                userinfo: this.props.userInfo,
                ncontainertypecode: comboData ? comboData.value : 0
            }, fieldName, comboData);

        } else if (fieldName === 'ncontainerstructurecode') {
            selectedRecord['nrow'] = comboData.item.nrow ? comboData.item.nrow : 1;
            selectedRecord['ncolumn'] = comboData.item.ncolumn ? comboData.item.ncolumn : 1;
            selectedRecord['nnoofcontainer'] = selectedRecord["nneedposition"] === true ? this.calculateRowColumn(selectedRecord['nrow'],
                selectedRecord['ncolumn']) : 1

        } else if (fieldName === 'nsamplestoragelocationcode') {
            this.getSampleStorageLocation({
                userinfo: this.props.userInfo,
                nsamplestoragelocationcode: comboData.value

            }, fieldName, comboData);
        } else if (fieldName === 'ninstrumentcode') {
            delete selectedRecord['nsamplestoragelocationcode'];
            delete selectedRecord['nsamplestoragemappingcode'];
            delete selectedRecord['samplestoragecontainerpath'];


            this.getSampleStorageLocation({
                userinfo: this.props.userInfo,
                //nsamplestoragelocationcode: selectedRecord["nsamplestoragelocationcode"].value,
                ninstrumentcode: comboData.value

            }, fieldName, comboData);

            selectedRecord[fieldName] = comboData;

        }
        selectedRecord[fieldName] = comboData;
        if (comboData === null) {
            delete selectedRecord[fieldName];
        }
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
            } else {
                selectedRecord['nrow'] = 1;
                selectedRecord['ncolumn'] = 1;
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
        let constantvalue = value.target.value;
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
            this.props.childDataChange(selectedRecord);
            this.setState({ selectedRecord });
        }
    }
    componentDidUpdate(previousProps, previousState) {
        let { availableContainers,
            totalContainers, selectedRecord, selectedInstrument } = this.state
        let bool = false;
        if (this.props.availableContainers !== previousProps.availableContainers) {
            bool = true;
            availableContainers = this.props.availableContainers
        }
        if (this.props.totalContainers !== previousProps.totalContainers) {
            bool = true;
            totalContainers = this.props.totalContainers
        }
        if (this.props.selectedRecord !== previousProps.selectedRecord) {
            bool = true;
            selectedRecord = this.props.selectedRecord
        }

        if (bool) {
            this.setState({ totalContainers, availableContainers, selectedRecord, selectedInstrument })
        }

        if (this.props.selectedInstrument !== previousProps.selectedInstrument) {

            let selectedRecord = this.state.selectedRecord;
            selectedRecord["ninstrumentcode"] = this.props.selectedInstrument;
            this.setState({ selectedRecord })

        }

    }
    render() {
        const extractedColumnList = [
            { "idsName": "IDS_FROMPATH", "dataField": "scontainerpath", "width": "200px", "componentName": "combobox" },
            { "idsName": "IDS_TOPATH", "dataField": "scontainerpath", "width": "450px", "componentName": "combobox" }
        ]
        return (
            <>   <Preloader loading={this.state.loading} />
                {/* <DragAndDropComponent/> */}
                <>

                    {this.props.isMultiContainermove ?
                        <> </>
                        : <> <Row>
                            <Col md={12}>
                                <FormSelectSearch
                                    name={"nfromsamplestoragelocationcode"}
                                    as={"select"}
                                    onChange={(event) => this.onComboChange(event, 'nfromsamplestoragelocationcode')}
                                    formLabel={this.props.intl.formatMessage({ id: "IDS_STORAGESTRUCTURENAME" })}
                                    //isMandatory={true}
                                    value={this.state.selectedRecord["nfromsamplestoragelocationcode"] ? this.state.selectedRecord["nfromsamplestoragelocationcode"] || [] : []}
                                    options={this.state.selectedRecord["storageStructureOptions"]}
                                    optionId={"value"}
                                    optionValue={"label"}
                                    isMulti={false}
                                    isDisabled={true}
                                    isSearchable={true}
                                    isClearable={false}
                                />
                            </Col>
                        </Row>

                            <Row>
                                <Col md={12}>
                                    <FormSelectSearch
                                        name={"nfromsamplestoragemappingcode"}
                                        as={"select"}
                                        onChange={(event) => this.onComboChange(event, 'nfromsamplestoragemappingcode')}
                                        formLabel={this.props.intl.formatMessage({ id: "IDS_SAMPLESTORAGEPATH" })}
                                        //   isMandatory={true}
                                        value={this.state.selectedRecord["nfromsamplestoragemappingcode"] ? this.state.selectedRecord["nfromsamplestoragemappingcode"] || [] : []}
                                        options={this.state.selectedRecord["samplestoragecontainerpathOptions"]}
                                        optionId={"value"}
                                        optionValue={"label"}
                                        isMulti={false}
                                        isDisabled={true}
                                        isSearchable={true}
                                        isClearable={false}
                                    />

                                </Col>
                            </Row></>}

                    {(this.props.isMultiContainermove || parseInt(this.props.settings[84]) == transactionStatus.YES) ?
                        <>
                            <Row>
                                <Col md={12}>
                                    <FormSelectSearch
                                        name={"ninstrumentcode"}
                                        as={"select"}
                                        onChange={(event) => this.onComboChange(event, 'ninstrumentcode')}
                                        formLabel={this.props.intl.formatMessage({ id: "IDS_STROAGENAMEORID" })}
                                        isMandatory={true}
                                        value={this.state.selectedRecord ? this.state.selectedRecord["ninstrumentcode"] || [] : []}
                                        options={this.props && this.props?.instrumentTypeOptions || []}
                                        optionId={"value"}
                                        optionValue={"label"}
                                        isMulti={false}
                                        isDisabled={false}
                                        isSearchable={true}
                                        isClearable={false}
                                    />
                                </Col>
                            </Row>
                        </> : <></>}

                    <Row>
                        <Col md={12}>
                            <FormSelectSearch
                                name={"nsamplestoragelocationcode"}
                                as={"select"}
                                onChange={(event) => this.onComboChange(event, 'nsamplestoragelocationcode')}
                                formLabel={this.props.intl.formatMessage({ id: "IDS_TOSTORAGESTRUCTURENAME" })}
                                isMandatory={true}
                                value={this.state.selectedRecord["nsamplestoragelocationcode"] ? this.state.selectedRecord["nsamplestoragelocationcode"] || [] : []}
                                options={this.state.selectedRecord["storageStructureOptions"]}
                                optionId={"value"}
                                optionValue={"label"}
                                isMulti={false}
                                isDisabled={false}
                                isSearchable={true}
                                isClearable={false}
                            />
                        </Col>
                    </Row>
                    {(this.props.isMultiContainermove || parseInt(this.props.settings[84]) == transactionStatus.YES) ?
                        <> </>
                        : <>
                            <Row>
                                <Col md={12}>
                                    <FormSelectSearch
                                        formLabel={this.props.intl.formatMessage({ id: "IDS_PROJECTTYPE" })}
                                        isSearchable={true}
                                        name={"nprojecttypecode"}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_PROJECTTYPE" })}
                                        isMandatory={false}
                                        isClearable={true}
                                        options={this.props.ProjectTypeOptions || []}
                                        onChange={(event) => this.onComboChange(event, "nprojecttypecode")}
                                        value={this.state.selectedRecord["nprojecttypecode"] || ""}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <FormSelectSearch
                                        formLabel={this.props.intl.formatMessage({ id: "IDS_PRODUCT" })}
                                        isSearchable={true}
                                        name={"nproductcode"}
                                        isDisabled={false}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        isMandatory={false}
                                        isClearable={true}
                                        options={this.props.sampleTypeList}
                                        value={this.state.selectedRecord["nproductcode"] || ""}
                                        defaultValue={this.state.selectedRecord["nproductcode"]}
                                        onChange={(event) => this.onComboChange(event, "nproductcode")}
                                        closeMenuOnSelect={true}
                                    />
                                </Col>
                            </Row> </>}
                    {this.props.isMultiContainermove ?
                        // <div style={{ width: 200, height: 200 }}>
                        //     <RoundProgressBar
                        //         value={this.state.availableContainers}
                        //         stroke={'#73bc8d'}
                        //         max={this.state.totalContainers}
                        //         text="AVAILABLE"
                        //     />
                        // </div>
                        <> </>
                        :
                        <Row>
                            <Col md={12}>
                                <FormSelectSearch
                                    name={"nsamplestoragemappingcode"}
                                    as={"select"}
                                    onChange={(event) => this.onComboChange(event, 'nsamplestoragemappingcode')}
                                    formLabel={this.props.intl.formatMessage({ id: "IDS_TOSAMPLESTORAGEPATH" })}
                                    isMandatory={true}
                                    value={this.state.selectedRecord["nsamplestoragemappingcode"] ? this.state.selectedRecord["nsamplestoragemappingcode"] || [] : []}
                                    options={this.state.selectedRecord["samplestoragecontainerpathOptions"]}
                                    optionId={"value"}
                                    optionValue={"label"}
                                    isMulti={false}
                                    isDisabled={false}
                                    isSearchable={true}
                                    isClearable={false}
                                />

                            </Col>
                        </Row>}

                </>

            </>

        )
    }

}
export default injectIntl(MoveSample);