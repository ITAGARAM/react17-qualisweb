import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import DataGridWithSelection from '../../components/data-grid/DataGridWithSelection';
import { process } from '@progress/kendo-data-query';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import FormInput from '../../components/form-input/form-input.component';
import { Button } from 'react-bootstrap';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';

// this component was added by sujatha v SWSM-37 Dispose - Sample Disposal, existing can able to both retrieve/dispose sample
//  whereas new component used to only dispose the expired samples 12-09-2025
class DisposeSample extends React.Component {

        constructor(props) {
                super(props);
                const dataState = { skip: 0, take: 10 };
                this.state = {
                        addComponentSortedList: [], dataState, siteSampleExpiry: [],
                        selectedRecord: this.props.selectedRecord,
                        addComponentDataList: this.props.addComponentDataLists,
                        addedComponentList: this.props.addedComponentList || []
                };
                this.formRef = React.createRef();
        }


        reload = () => {
                let addComponentDataList = this.state.addComponentDataList;
                const updatedList = addComponentDataList.map(item => ({
                        ...item,
                        selected: false
                }));

                // let addComponentDataListCopy = this.state.addComponentDataListCopy;
                // const updatedList1 = addComponentDataListCopy.map(item => ({
                //         ...item,
                //         selected: false
                // }));
                //  let addComponentDataList = this.state.addComponentDataList;
                //  const updatedList = addComponentDataList.map(({ selected, ...rest }) => rest);
                //  this.setState({ addComponentDataList: updatedList });

                this.setState({
                        addedComponentList: [],
                        addComponentDataList: updatedList,
                        addSelectAll: false,
                        // addComponentDataListCopy:updatedList1
                        dataState: {
                                ...this.state.dataState,
                                filter: null,
                        }
                })

                this.props.reloadData()
        }



        render() {

                const expirydispose = this.props.controlMap.has("ExpiryDispose") && this.props.controlMap.get("ExpiryDispose").ncontrolcode;

                const extractedColumnList = [];
                let count = (this.state.addComponentSortedList || []).length;
                extractedColumnList.push({ idsName: "IDS_SAMPLEID", dataField: "ssampleid", "width": "155px" });
                extractedColumnList.push({ idsName: "IDS_SAMPLELOCATIONNAME", dataField: "ssamplestoragelocationname", "width": "155px" },
                        // { idsName: "IDS_SAMPLENAME", dataField: "ssamplename", "width": "155px" },
                );

                return (

                        <>
                                <Row>
                                        <Col md={2}>
                                                <FormInput
                                                        label={this.props.intl.formatMessage({ id: "IDS_PROJECTTYPE" })}
                                                        name={"nprojecttypecode"}
                                                        type="text"
                                                        placeholder={this.props.intl.formatMessage({ id: "IDS_SITE" })}
                                                        onChange={(event) => this.props.onInputOnChange(event)}
                                                        isDisabled={true}
                                                        value={this.props.breadcrumbprojecttype ?
                                                                this.props.breadcrumbprojecttype.label : ""}
                                                        // isMandatory={true}      //modified by sujatha v ATE_274 to make this non mandatory
                                                        required={true}
                                                        maxLength={50}
                                                />
                                        </Col>
                                        <Col md={3}>
                                                <FormInput
                                                        label={this.props.intl.formatMessage({ id: "IDS_SITE" })}
                                                        name={"nsitemastercode"}
                                                        type="text"
                                                        placeholder={this.props.intl.formatMessage({ id: "IDS_SITE" })}
                                                        onChange={(event) => this.props.onInputOnChange(event)}
                                                        isDisabled={true}
                                                        value={this.props.siteSampleExpiry.loginSite ?
                                                                this.props.siteSampleExpiry.loginSite["ssitename"] : ""}
                                                        // isMandatory={true}     //modified by sujatha v ATE_274 to make this non mandatory
                                                        required={true}
                                                        maxLength={50}
                                                />
                                        </Col>
                                        <Col md={3}>

                                                <FormNumericInput
                                                        name="sexpirydays"
                                                        label={this.props.intl.formatMessage({ id: "IDS_EXPIRYDAYS" })}
                                                        placeholder={this.props.intl.formatMessage({ id: "IDS_EXPIRYDAYS" })}
                                                        type="number"
                                                        value={
                                                                this.props.siteSampleExpiry.siteSampleExpiryMap &&
                                                                this.props.siteSampleExpiry.siteSampleExpiryMap.sexpirydays
                                                        }
                                                        max={999}
                                                        min={1}
                                                        strict={true}
                                                        maxLength={3}
                                                        onChange={(value) => this.props.onNumericInputChange(value, 'sexpirydays', 'dispose')}
                                                        noStyle={true}
                                                        precision={0}
                                                        className="form-control"
                                                        isMandatory={true}
                                                />
                                        </Col>
                                        {/* sujatha added */}
                                        <Col md={4}>
                                                <Button
                                                        className="btn btn-circle outline-grey p-2"
                                                        style={{ float: "left", marginRight: "1rem" }}
                                                        variant="link"
                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}
                                                        data-for="tooltip-grid-wrap"
                                                        onClick={() => {
                                                                this.reload();
                                                        }}
                                                >
                                                        <RefreshIcon className="custom_icons" />
                                                </Button>

                                                {/* <Button className="btn btn-primary"
                                                        style={{ float: "left", marginRight: "1rem" }}
                                                        onClick={this.props.closeModal}>
                                                        <FormattedMessage id={this.props.closeLabel || "IDS_CANCEL"}
                                                                defaultMessage={this.props.closeLabel || 'Cancel'} />
                                                </Button> */}
                                                <button className="btn btn-primary"
                                                        style={{ float: "right", marginRight: "1rem" }}
                                                        onClick={() => this.handlerSampleExpiryDispose({
                                                                ssitename: this.props.siteSampleExpiry.loginSite
                                                                        ? this.props.siteSampleExpiry.loginSite.ssitename : "NA",
                                                                sexpirydays: this.props.siteSampleExpiry.siteSampleExpiryMap
                                                                        && this.props.siteSampleExpiry.siteSampleExpiryMap.sexpirydays !== ""
                                                                        ? this.props.siteSampleExpiry.siteSampleExpiryMap.sexpirydays : 1,
                                                                ncontrolcode: expirydispose,
                                                                'nsamplestoragetransactioncode': this.state.addedComponentList && this.state.addedComponentList.map(sample => sample.nsamplestoragetransactioncode).join(","),
                                                                'nsamplestoragelocationcode': this.state.addedComponentList && this.state.addedComponentList.map(sample => sample.nsamplestoragelocationcode).join(","),
                                                                userinfo: this.props.userInfo,
                                                                isRetrieve: false,
                                                                ssampleid: this.state.addedComponentList && this.state.addedComponentList.map(sample => sample.ssampleid).join(","),
                                                                addComponentDataList: this.state.addComponentDataList,
                                                                addedComponentList: this.state.addedComponentList && this.state.addedComponentList != undefined ? this.state.addedComponentList : this.props.addedComponentList,
                                                                masterData: this.state.masterData,
                                                                // nprojecttypecode: this.props.selectedProjectType.nprojecttypecode.value,
                                                                userRoleControlRights: this.props.userRoleControlRights,
                                                                nformcode: this.props.userInfo.nformcode,
                                                        }, 'create')}
                                                        hidden={this.props.userRoleControlRights.indexOf(expirydispose) === -1}
                                                >
                                                        <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>{"  "}
                                                        {this.props.intl.formatMessage({ id: "IDS_DISPOSE" })}

                                                </button>
                                        </Col>
                                </Row >

                                <Row>
                                        <Row style={{ marginTop: '10px' }}>
                                                <Col>
                                                        <DataGridWithSelection
                                                                primaryKeyField={"nsamplestoragetransactioncode"}
                                                                userInfo={this.props.userInfo}
                                                                data={this.state.addComponentDataList || []}
                                                                selectAll={this.state.addSelectAll}
                                                                // title={this.props.intl.formatMessage({ id: "IDS_SELECTTODELETE" })}
                                                                selectionChange={this.selectionChange}
                                                                headerSelectionChange={this.headerSelectionChange}
                                                                extractedColumnList={extractedColumnList}
                                                                dataState={this.state.dataState
                                                                        ? this.state.dataState : { skip: 0, take: 10 }}
                                                                dataResult={this.state.dataResult ? this.state.dataResult :
                                                                        process(this.state.addComponentDataList || [], this.state.dataState
                                                                                ? this.state.dataState : { skip: 0, take: 10 })}
                                                                dataStateChange={this.dataStateChangeDisposeSample}
                                                                scrollable={'scrollable'}
                                                                pageable={true}
                                                                isRefreshRequired={true}
                                                        />
                                                </Col>
                                        </Row>
                                </Row>
                        </>
                );
        }

        componentDidUpdate(previousProps, previousState) {

                if (this.props.addComponentDataLists !== previousProps.addComponentDataLists) {
                        this.setState({
                                addComponentDataList: this.props.addComponentDataLists || [],
                                dataResult: process(this.props.addComponentDataLists || [], this.props.dataState)
                        });
                }
                if (this.state.addComponentDataList !== previousState.addComponentDataList) {
                        this.setState({
                                addComponentDataList: this.state.addComponentDataList || [],
                                dataResult: process(this.state.addComponentDataList || [], this.state.dataState)
                        });
                }
        }

        headerSelectionChange = (event) => {
                const checked = event.syntheticEvent.target.checked;
                const eventData = event.target.props.data.hasOwnProperty('data') ? event.target.props.data.data || [] : event.target.props.data || [];
                let addComponentDataList = //event.target.props.data
                        this.state.addComponentDataList || [];
                let addedComponentList = this.state.addedComponentList || [];
                if (checked) {
                        const data = addComponentDataList.map(item => {
                                const matchingData = eventData.find(dataItem => dataItem.nsamplestoragetransactioncode === item.nsamplestoragetransactioncode);
                                if (matchingData) {
                                        const existingIndex = addedComponentList.findIndex(
                                                x => x.nsamplestoragetransactioncode === item.nsamplestoragetransactioncode
                                        );

                                        if (existingIndex === -1) {
                                                const newItem = {
                                                        ...item,
                                                        selected: true,
                                                };
                                                addedComponentList.push(newItem);
                                        }
                                        return { ...item, selected: true };
                                } else {
                                        return { ...item, selected: item.selected ? true : false };
                                }
                        });
                        this.setState({
                                addComponentDataList: data, addedComponentList,
                                addComponentDataListCopy: this.validateCopy(this.state.addComponentSortedList || [], data || [], addedComponentList || []),
                                addSelectAll: this.validateCheckAll(process(data || [], this.state.dataState)),
                                addSelectAll: checked, deleteSelectAll: false
                        });
                } else {
                        let addedComponentData = this.state.addedComponentList || [];
                        let deletedListdData = this.state.deletedList || [];
                        const data = addComponentDataList.map(x => {
                                const matchedItem = eventData.find(item => x.nsamplestoragetransactioncode === item.nsamplestoragetransactioncode);
                                if (matchedItem) {
                                        addedComponentData = addedComponentData.filter(item1 => item1.nsamplestoragetransactioncode !== matchedItem.nsamplestoragetransactioncode);
                                        deletedListdData = deletedListdData.filter(item1 => item1.nsamplestoragetransactioncode !== matchedItem.nsamplestoragetransactioncode);
                                        matchedItem.selected = false;
                                        return matchedItem;
                                }
                                return x;
                        });

                        this.setState({
                                addComponentDataList: data, addedComponentList: addedComponentData, deletedList: deletedListdData,
                                addSelectAll: this.validateCheckAll(addedComponentList),
                                deleteSelectAll: this.validateCheckAll(addedComponentList),
                                addSelectAll: checked, deleteSelectAll: false,
                                addComponentDataListCopy: this.validateCopy(this.state.addComponentSortedList || [], data || [], addedComponentData || []),
                        });
                }
        }

        validateCopy(sortedList, addComponentDataList, addedComponentList) {
                let addedComponentLists = addedComponentList || this.state.addedComponentList || [];
                let listData = this.props.addComponentDataLists || [];
                let copyingList = listData.filter(item1 =>
                        !sortedList.some(item2 => item1.nsamplestoragetransactioncode === item2.nsamplestoragetransactioncode)
                ) || [];
                let copyingListData = copyingList.map(item => {
                        const existsInAddComponentDataList = addedComponentLists.some(
                                item1 => item1.nsamplestoragetransactioncode === item.nsamplestoragetransactioncode

                        );
                        if (existsInAddComponentDataList) {
                                return { ...item, selected: true };
                        } else {
                                return { ...item, selected: false };
                        }
                });
                return copyingListData;
        }

        validateCheckAll(data) {
                let selectAll = true;
                if (data && data.length > 0) {
                        data.forEach(dataItem => {
                                if (dataItem.selected) {
                                        if (dataItem.selected === false) {
                                                selectAll = false;
                                        }
                                } else {
                                        selectAll = false;
                                }
                        })
                } else {
                        selectAll = false;
                }
                return selectAll;
        }

        selectionChange = (event) => {
                let addedComponentList = this.state.addedComponentList || [];
                const addComponentDataList = this.state.addComponentDataList.map(item => {
                        if (item.nsamplestoragetransactioncode === event.dataItem.nsamplestoragetransactioncode) {
                                item.selected = !event.dataItem.selected;
                                if (item.selected) {
                                        const newItem = JSON.parse(JSON.stringify(item));
                                        delete newItem['selected']
                                        newItem.selected = true;
                                        addedComponentList.push(newItem);
                                }
                                else {
                                        addedComponentList = addedComponentList.filter(item1 => item1.nsamplestoragetransactioncode !== item.nsamplestoragetransactioncode)
                                }
                        }
                        return item;
                });
                this.setState({
                        addSelectAll: this.validateCheckAll(process(addComponentDataList || [], this.state.dataState).data),
                        addComponentDataList, addedComponentList,
                        deleteSelectAll: this.validateCheckAll(addedComponentList),
                        addComponentDataListCopy: this.validateCopy(this.state.addComponentSortedList || [], addComponentDataList || [], addedComponentList || [])
                });
        }

        dataStateChangeDisposeSample = (event) => {
                let updatedList = [];
                if (event.dataState && event.dataState.filter === null) {
                        let addComponentDataListCopy = this.state.addComponentDataListCopy || this.state.addComponentDataList || [];
                        addComponentDataListCopy.forEach(x => {
                                const exists = this.state.addComponentSortedList.some(
                                        item => item.nsamplestoragetransactioncode === x.nsamplestoragetransactioncode

                                );
                                if (!exists) {
                                        updatedList.push(x);
                                }
                        });
                } else {
                        // updatedList = this.state.addComponentDataList || []
                        const processed = process(this.state.addComponentDataList || [], event.dataState);
                        updatedList = processed.data || [];

                        let filteredAddedComponentList = (this.state.addedComponentList || []).filter(selectedItem =>
                                updatedList.some(visibleItem =>
                                        visibleItem.nsamplestoragetransactioncode === selectedItem.nsamplestoragetransactioncode
                                )
                        );

                        updatedList = updatedList.map(item => {
                                const isSelected = filteredAddedComponentList.some(selectedItem => selectedItem.nsamplestoragetransactioncode === item.nsamplestoragetransactioncode);
                                return {
                                        ...item,
                                        selected: isSelected
                                };
                        });
                        // Update addedComponentList with filtered list
                        this.setState({
                                addedComponentList: filteredAddedComponentList
                        });
                }
                this.setState({
                        //commented for filter get of selected is not working good
                        // dataResult: process(this.state.addComponentDataList || [], event.dataState),
                        // dataState: event.dataState, addComponentDataList: updatedList, addSelectAll: event.dataState && event.dataState.filter === null ?
                        //         this.validateCheckAll(updatedList) :
                        //         this.validateCheckAll(process(updatedList || [], event.dataState).data)

                        dataResult: process(this.state.addComponentDataList || [], event.dataState),
                        dataState: event.dataState,
                        // addComponentDataList: updatedList,
                        addSelectAll: this.validateCheckAll(updatedList),
                        deleteSelectAll: this.validateCheckAll(this.state.addedComponentList),
                });
        }


        handlerSampleExpiryDispose = (param) => {
                if (!param.sexpirydays || param.sexpirydays == "") {
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTERRETENTIONINDAYS" }));
                        return;
                }
                if (!param.addedComponentList || param.addedComponentList.length === 0) {
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLETODISPOSE" }));
                        return;
                }

                let inputParam =
                {
                        addedComponentList: param.addedComponentList,
                        nsamplestoragetransactioncode: param.nsamplestoragetransactioncode ? param.nsamplestoragetransactioncode : 0,
                        nsamplestoragelocationcode: param.nsamplestoragelocationcode ? param.nsamplestoragelocationcode : 0,
                        userinfo: param.userinfo,
                        ssitename: param.ssitename,
                        sexpirydays: String(param.sexpirydays),
                        ssampleid: param.ssampleid,
                        ncontrolcode: param.ncontrolcode,
                        userRoleControlRights: param.userRoleControlRights,
                        isRetrieve: param.isRetrieve,
                }

                this.props.validateEsignforDispose(inputParam, this.state.operation);
        }

        //     CRUDExpirySampleDispose = (inputParam, operation) => {

        //         const masterData = this.state.masterData;
        //         this.setState({ loading: true, dynamicfields: [] })
        //         let requestUrl = '';
        //         let urlArray = [];
        //         requestUrl = rsapi().post(inputParam.classUrl + "/" + inputParam.operation + inputParam.methodUrl, { ...inputParam.inputData });
        //         urlArray = [requestUrl]
        //         Axios.all(urlArray)
        //             .then(response => {
        //                 this.setState({
        //                     selectedProjectTypeList: sortData(response[0].data.selectedProjectTypeList),
        //                     masterData: {
        //                         ...this.props.masterData,
        //                         fromDate: rearrangeDateFormat(inputParam.userinfo, this.props.masterData.fromDate),
        //                         toDate: rearrangeDateFormat(inputParam.userinfo, this.props.masterData.toDate),
        //                         samplestorageretrieval: response[0].data.samplestorageretrieval,
        //                         loadEsign: false,
        //                     },
        //                     openModal: false, isFilterPopup: false,
        //                     isRetrieveOrDispose: false, importRetrieveOrDispose: false, isDispose: false, loadEsign: false,
        //                     loading: false,
        //                     addComponentDataList: []
        //                 })
        //             }).catch(error => {
        //                 if (error.response?.status === 429) {
        //            toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
        //            dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
        //        } else if (error.response?.status === 401 || error.response?.status === 403) {
        //                     const UnAuthorizedAccess = {
        //                         typeName: UN_AUTHORIZED_ACCESS,
        //                         data: {
        //                             navigation: 'forbiddenaccess',
        //                             loading: false,
        //                             responseStatus: error.response
        //                         }

        //                     }
        //                     this.props.updateStore(UnAuthorizedAccess);
        //                 } else if (error.response.status === 500) {
        //                     toast.error(error.message);
        //                 } else {
        //                     toast.warn(error.response.data);
        //                 }
        //                 this.setState({
        //                     loadEsign: false, loading: false
        //                 });
        //             });

        //     }
}
export default injectIntl(DisposeSample);