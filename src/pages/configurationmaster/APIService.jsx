import React from 'react';
import { injectIntl } from 'react-intl';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import {
    getControlMap, constructOptionList, copyText, convertDateTimetoStringDBFormat
} from '../../components/CommonScript';
import { connect } from 'react-redux';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { ListWrapper } from '../../components/client-group.styles';
//import FormTextarea from '../../components/form-textarea/form-textarea.component';
import {
    stringOperatorData, numericOperatorData
    , dateConditionData
} from '../dashboard/SqlBuilderFilterType'

import FormInput from '../../components/form-input/form-input.component';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import ReactJson from "react-json-view";
import { sendRequest, getQualisFormsFields, getQualisForms, getCustomQuery, getCustomQueryName, updateStore } from "../../actions";
import { ContentPanel } from '../../components/App.styles';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
//import APIConsole from "./APIConsole"

const mapStateToProps = (state) => {
    return { Login: state.Login };
};
class APIService extends React.Component {
    constructor(props) {
        super(props)
        //  this.console = React.createRef();
        this.state = {
            selectedRecord: {},
            constructApiData: [],
            consoleData: [],
            controlMap: {},
            userRoleControlRights: [],
            masterStatus: "", error: ""
        }
    }

    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }

        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        return null;
    }

    onInputOnChange = (event, value, variant) => {
        if (event.target.type === "checkbox") {
            let constructApiData = this.state.constructApiData
            const selectedRecord = this.state.selectedRecord;
            // selectedRecord['check'] = label

            // constructApiData={...constructApiData,[variant.item.scolumn]:""}

            const value1 = selectedRecord[event.target.name];
            if (value1 !== '' && value1 !== undefined) {
                if (value1.toLowerCase().includes(value.toLowerCase())) {
                    const index = value1.toLowerCase().indexOf(value.toLowerCase());
                    delete constructApiData[variant.item.scolumn]
                    if (index !== -1) {
                        if (index === 0) {
                            const indexcomma = value1.indexOf(",")
                            if (indexcomma !== -1) {
                                selectedRecord[event.target.name] = value1.slice(indexcomma + 1)
                            } else {
                                selectedRecord[event.target.name] = ""
                            }
                        } else {
                            if (value1.slice(index).indexOf(",") !== -1) {
                                selectedRecord[event.target.name] = value1.slice(0, index) + value1.slice(index + value1.slice(index).indexOf(",") + 1)
                            } else {
                                selectedRecord[event.target.name] = value1.slice(0, index - 1)
                            }
                        }
                    }

                } else {
                    selectedRecord[event.target.name] = value1 + ',' + value;
                    constructApiData = [...constructApiData, { [variant.item.scolumn]: "" }]
                }
            } else {
                selectedRecord[event.target.name] = value1 + ',' + value;
                constructApiData = [...constructApiData, { [variant.item.scolumn]: "" }]
            }
            this.setState({
                selectedRecord, constructApiData,
                constructApiDataString: constructApiData.map(e => JSON.stringify(e).replace(/{|}/g, '')).join(',\n')
            })
        } else {
            // const selectedRecord = this.state.selectedRecord;
            let text = event.target.value.replaceAll('\n', '')
            text = text.replace(/\s+/g, '');
            let constructApiData1 = JSON.parse(text)
            let constructApiData = Object.keys(constructApiData1).map(x => {
                return { [x]: constructApiData1[x] }
            })
            this.setState({
                constructApiData,
                constructApiDataString: constructApiData.map(e => JSON.stringify(e).replace(/{|}/g, '')).join(',\n'),
            })
        }

    }

    onComboChange = (event, colunName) => {
        const selectedRecord = this.state.selectedRecord
       
        const oldValue = { ...selectedRecord[colunName] }
        selectedRecord[colunName] = event
        const map1 = new Map();
        map1['userinfo'] = this.props.Login.userInfo;
        map1['selectedRecord'] = selectedRecord
        map1['masterData'] = this.props.Login.masterData
        map1['constructApiData'] = this.state.constructApiData
      
        if (colunName === 'napiservicecode') {
            if (selectedRecord.napiservicecode.value === 24) {
                this.props.getCustomQuery(map1)
            } else {
                const Parameters=this.state.parameterValue||undefined;
                map1['Parameters']=Parameters;
                this.props.getQualisForms(map1)
            }
            // }
            // this.setState({ selectedRecord })
        } else if (colunName === 'nsqlquerycode') {
            this.props.getCustomQueryName(map1)
        } else {
            if (oldValue && oldValue.value !== event.value) {
                this.props.getQualisFormsFields(map1)
            }
        }
        //  this.setState({ selectedRecord })
    }
    checkFilter = (filterList) => {
        let check = [];
        filterList.map((item, index) => {
            if (item.filterColumn) {
                if (item.filterCondition) {
                    if (item.filterColumn.item.columndatatype === 'string' || item.filterColumn.item.columndatatype === 'character varying' || item.filterColumn.item.columndatatype === 'character') {
                        if (item.filterCondition.value === '='
                            || item.filterCondition.value === 'IN'
                            || item.filterCondition.value === 'NOT') {

                            if (item.filterValue && item.filterValue !== "") {
                                check.push(true)
                            }

                        }
                        else {
                            if (item.filterCondition) {
                                check.push(true)
                            }
                        }
                    }
                    else if (item.filterColumn.item.columndatatype === 'numeric' || item.filterColumn.item.columndatatype === 'integer' || item.filterColumn.item.columndatatype === 'smallint' || item.filterColumn.item.columndatatype === 'bigint') {
                        if (item.filterCondition.value === '='
                            || item.filterCondition.value === '!=' ||
                            item.filterCondition.value === '>' ||
                            item.filterCondition.value === '<' ||
                            item.filterCondition.value === '>=' ||
                            item.filterCondition.value === '<='
                        ) {
                            if (item.filterValue && item.filterValue !== "") {
                                check.push(true)
                            }

                        }
                        else {
                            if (item.filterCondition) {
                                check.push(true)
                            }
                        }
                    }
                    else if (item.filterColumn.item.columndatatype === 'date' || item.filterColumn.item.columndatatype === 'timestamp without time zone') {
                        if (item.filterCondition.value === '='
                            || item.filterCondition.value === 'NOT'
                        ) {

                            if (item.filterValue && item.filterValue !== "") {
                                check.push(true)
                            }

                        }
                        else {
                            if (item.filterCondition) {
                                check.push(true)
                            }
                        }
                    }

                }
            }

        })
        return check.length === filterList.length ? true : false;
    }


    onMoreClick = (e) => {
        const selectedRecord = this.state.selectedRecord || {}
        if (this.checkFilter(selectedRecord['filterNew'] || [])) {
            if (this.props.Login.masterData.SelectedForm) {
                if (selectedRecord['filterNew'] === undefined) {
                    selectedRecord['filterNew'] = []
                }
                selectedRecord['filterNew'][selectedRecord['filterNew'].length] = {}

                const lstQryColumn = this.removeSameRecordFromTwoDifferentArrays(this.state.lstQueryBuilder, selectedRecord['filterNew'])

                if (lstQryColumn.length > 0) {
                    this.setState({
                        selectedRecord, lstQryColumn
                    })
                } else {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_COLUMNSNOTAVALIABLE" }))
                }
            } else if (this.props.Login.masterData.Columns) {
                if (selectedRecord['filterNew'] === undefined) {
                    selectedRecord['filterNew'] = []
                }
                selectedRecord['filterNew'][selectedRecord['filterNew'].length] = {}
                const lstQryColumn = this.removeSameRecordFromTwoDifferentArrays(this.state.lstQueryBuilder, selectedRecord['filterNew'])

                if (lstQryColumn.length > 0) {
                    this.setState({
                        selectedRecord, lstQryColumn
                    })
                } else {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_COLUMNSNOTAVALIABLE" }))
                }

            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTHEFORM" }))
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASEFILLTHEVALUE" }))
        }
    }

    onFilterInputOnChange = (event, index) => {
        const selectedRecord = this.state.selectedRecord || {};
        //  const constructApiData = this.state.constructApiData

        const filterTableNewAddedList = [...selectedRecord['filterNew']]
		//ALPD-3801
        const copyfiltertableaddedlist = [...selectedRecord['filterNew']]

        const change = { ...filterTableNewAddedList[index], [event.target.name]: event.target.value }
        const changeData = [...filterTableNewAddedList.splice(0, index), { ...change }, ...copyfiltertableaddedlist.splice(index + 1)]

        // const index1 = constructApiData.findIndex(x => Object.keys(x).toString() === change.filterColumn.item.scolumn)

        // if (index1 === -1) {
        //     constructApiData.push({ [change.filterColumn.item.scolumn]: change.filterCondition.value + " " + change.filterValue })
        // } else {
        //     constructApiData[index1] = { [change.filterColumn.item.scolumn]: change.filterCondition.value + " " + change.filterValue }
        // }


        this.setState({ selectedRecord: { ...selectedRecord, filterNew: changeData } });
    }

    onFilterNumericInputChange = (value, name, index) => {
        const selectedRecord = this.state.selectedRecord || {};
        //   const constructApiData = this.state.constructApiData
        const filterTableNewAddedList = [...selectedRecord['filterNew']]
		//ALPD-3801
        const copyfilterTableNewAddedList = [...selectedRecord['filterNew']]

        const change = { ...filterTableNewAddedList[index], [name]: value }
        // constructApiData.push({ [change.filterColumn.item.scolumn]: change.filterValue })
        // const index1 = constructApiData.findIndex(x => Object.keys(x).toString() === change.filterColumn.item.scolumn)
        // if (index1 === -1) {
        //     constructApiData.push({ [change.filterColumn.item.scolumn]: change.filterCondition.value + " " + change.filterValue })
        // } else {
        //     constructApiData[index1] = { [change.filterColumn.item.scolumn]: change.filterCondition.value + " " + change.filterValue }
        // }
        const changeData = [...filterTableNewAddedList.splice(0, index), { ...change }, ...copyfilterTableNewAddedList.splice(index + 1)]
        this.setState({ selectedRecord: { ...selectedRecord, filterNew: changeData } });

    }

    handleDateChange = (columnLabel, value, index) => {
        const selectedRecord = this.state.selectedRecord || {};
        // const constructApiData = this.state.constructApiData
        const filterTableNewAddedList = [...selectedRecord['filterNew']]
        const change = { ...filterTableNewAddedList[index], [columnLabel]: value }
        // const index1 = constructApiData.findIndex(x => Object.keys(x).toString() === change.filterColumn.item.scolumn)
        // if (index1 === -1) {
        //     constructApiData.push({ [change.filterColumn.item.scolumn]: change.filterCondition.value + " " + change.filterValue })
        // } else {
        //     constructApiData[index1] = { [change.filterColumn.item.scolumn]: change.filterCondition.value + " " + change.filterValue }
        // }
        const changeData = [...filterTableNewAddedList.splice(0, index), { ...change }, ...filterTableNewAddedList.splice(index + 1)]
        this.setState({ selectedRecord: { ...selectedRecord, filterNew: changeData } });
    }

    onfilterChange = (comboValue, columnLabel, conditionType, index) => {
        const selectedRecord = this.state.selectedRecord;

        if (conditionType === 'column') {
            const filterTableNewAddedList = [...selectedRecord['filterNew']]
			//ALPD-3801
            const copyfiltertableaddedlist = [...selectedRecord['filterNew']]

            const change = {
                ...filterTableNewAddedList[index], [columnLabel]: comboValue,
                filterCondition: undefined, filterValueType: undefined, filterValue: undefined
            }
            const changeData = [...filterTableNewAddedList.splice(0, index), { ...change }, ...copyfiltertableaddedlist.splice(index + 1)]
            this.setState({ selectedRecord: { ...selectedRecord, filterNew: changeData } })
        }
        else if (conditionType === 'condition') {
            const filterTableNewAddedList = [...selectedRecord['filterNew']]
			//ALPD-3801
            const copyfiltertableaddedlist = [...selectedRecord['filterNew']]

            const change = { ...filterTableNewAddedList[index], [columnLabel]: comboValue }
            const changeData = [...filterTableNewAddedList.splice(0, index), { ...change, filterValue: undefined }, ...copyfiltertableaddedlist.splice(index + 1)]
            // let constructApiData = this.state.constructApiData
            // if (change["filterCondition"].value === 'IS NULL' ||
            //     change["filterCondition"].value === 'IS NOT NULL' ||
            //     change["filterCondition"].value === 'PRESENT' ||
            //     change["filterCondition"].value === 'BLANK' ||
            //     change["filterCondition"].value !== 'NULL' ||
            //     change["filterCondition"].value !== 'NOT NULL' ||
            //     change["filterCondition"].value === 'IN') {
            //     // constructApiData.push({ [change.filterColumn.item.scolumn]: change.filterCondition.value })

            //     const index1 = constructApiData.findIndex(x => Object.keys(x).toString() === change.filterColumn.item.scolumn)
            //     if (index1 === -1) {
            //         constructApiData.push({ [change.filterColumn.item.scolumn]: change.filterCondition.value })
            //     } else {
            //         constructApiData[index1] = { [change.filterColumn.item.scolumn]: change.filterCondition.value }
            //     }

            // }
            // else if(change["filterColumn"].item.columndatatype === 'date'&& 
            // (change.filterCondition.value === '=' || change.filterCondition.value === '<' 
            // || change.filterCondition.value === '>')){

            //     const index1 = constructApiData.findIndex(x => Object.keys(x).toString() === change.filterColumn.item.scolumn)
            //     if (index1 === -1) {
            //         constructApiData.push({ [change.filterColumn.item.scolumn]: change.filterCondition.value+" '"+convertDateTimetoStringDBFormat(new Date(),this.props.Login.userInfo)+"'" })
            //     } else {
            //         constructApiData[index1] = { [change.filterColumn.item.scolumn]: change.filterCondition.value+" '"+convertDateTimetoStringDBFormat(new Date(),this.props.Login.userInfo)+"'"  }
            //     }

            // }
            // else if(change["filterColumn"].item.columndatatype === 'date'&& 
            //  (item.filterCondition.value === 'NOT')){


            //     const index1 = constructApiData.findIndex(x => Object.keys(x).toString() === change.filterColumn.item.scolumn)
            //     if (index1 === -1) {
            //         constructApiData.push({ [change.filterColumn.item.scolumn]: change.filterCondition.value+" '"+convertDateTimetoStringDBFormat(new Date(),this.props.Login.userInfo)+"'" })
            //     } else {
            //         constructApiData[index1] = { [change.filterColumn.item.scolumn]: change.filterCondition.value+" '"+convertDateTimetoStringDBFormat(new Date(),this.props.Login.userInfo)+"'"  }
            //     }
            // }


            this.setState({ selectedRecord: { ...selectedRecord, filterNew: changeData } })
        }

    }

    onFilterModalDelete = (childIndex) => {
        // let constructApiData1 = [{ ...this.state.constructApiData[0] }, { ...this.state.constructApiData[1] }]
        // let constructApiData2 = [...this.state.constructApiData]
        // constructApiData2 = constructApiData2.splice(2)
        // constructApiData2 = constructApiData2.splice(0, childIndex)
        // let constructApiData3 = [...this.state.constructApiData]
        // constructApiData3 = constructApiData3.splice(2)
        // constructApiData3 = constructApiData3.splice(childIndex + 1)
        const selectedRecord = this.state.selectedRecord;
        selectedRecord['filterNew'] = [...selectedRecord['filterNew'].slice(0, childIndex), ...selectedRecord['filterNew'].slice(childIndex + 1)]
        // constructApiData1 = [...constructApiData1, ...constructApiData2, ...constructApiData3]
        this.setState({ selectedRecord });
    }

    filterQueryFormation = (selectedRecord) => {
        let str = "";
        let strform = "";
        selectedRecord['filterNew'] && selectedRecord['filterNew'].length > 0 && selectedRecord['filterNew'].map((item, index) => {
            if (item.filterCondition) {
                if (item.filterCondition.value === 'IN') {
                    if (item.filterColumn.item.scolumn != undefined) {
                        str = str + (item.filterColumn.item.isjsoncolumn ?
                            item.filterColumn.item.ismultilingual ?
                                item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->>'" + this.props.Login.userInfo.slanguagetypecode + "'"
                                : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                            : "\"" + item.filterColumn.item.scolumn + "\"") + " " + item.filterCondition.value + " ('" + (item.filterValue ? item.filterValue : "") + "') "
                    } else if (item.filterColumn.item.scolumndisplayname != undefined) {
                        str = str + ("\"" + item.filterColumn.item.scolumndisplayname + "\"") + " " + item.filterCondition.value + " ('" + (item.filterValue ? item.filterValue : "") + "')"
                    }
                }
                else if (item.filterCondition.value === 'PRESENT') {
                    if (item.filterColumn.item.scolumn != undefined) {
                        str = str + " NOT " + (item.filterColumn.item.isjsoncolumn ?
                            item.filterColumn.item.ismultilingual ?
                                item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->>'" + this.props.Login.userInfo.slanguagetypecode + "'"
                                : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                            : "\"" + item.filterColumn.item.scolumn + "\"") + " ='' "
                    } else if (item.filterColumn.item.scolumndisplayname != undefined) {
                        str = str + ("\"" + item.filterColumn.item.scolumndisplayname + "\"") + " ='' "
                    }

                }
                else if (item.filterCondition.value === 'BLANK') {
                    if (item.filterColumn.item.scolumn != undefined) {

                        str = str + (item.filterColumn.item.isjsoncolumn ?
                            item.filterColumn.item.ismultilingual ?
                                item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->>'" + this.props.Login.userInfo.slanguagetypecode + "'"
                                : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                            : "\"" + item.filterColumn.item.scolumn + "\"") + " ='' "
                    } else if (item.filterColumn.item.scolumndisplayname != undefined) {
                        str = str + ("\"" + item.filterColumn.item.scolumndisplayname + "\"") + " ='' "
                    }

                }
                else if (item.filterCondition.value === 'NULL'
                    || item.filterCondition.value === 'NOT NULL') {
                    if (item.filterColumn.item.scolumn != undefined) {

                        str = str + (item.filterColumn.item.isjsoncolumn ?
                            item.filterColumn.item.ismultilingual ?
                                item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->>'" + this.props.Login.userInfo.slanguagetypecode + "'"
                                : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                            : "\"" + item.filterColumn.item.scolumn + "\"") + " IS " + item.filterCondition.value + " "
                    } else if (item.filterColumn.item.scolumndisplayname != undefined) {
                        str = str + ("\"" + item.filterColumn.item.scolumndisplayname + "\"") + " IS " + item.filterCondition.value + " "
                    }

                }
                else if (item.filterCondition.value === 'IS NULL') {
                    if (item.filterColumn.item.scolumn != undefined) {

                        str = str + (item.filterColumn.item.isjsoncolumn ?
                            item.filterColumn.item.ismultilingual ?
                                item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->>'" + this.props.Login.userInfo.slanguagetypecode + "'"
                                : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                            : "\"" + item.filterColumn.item.scolumn + "\"") + " " + item.filterCondition.value + " "
                    } else if (item.filterColumn.item.scolumndisplayname != undefined) {
                        str = str + ("\"" + item.filterColumn.item.scolumndisplayname + "\"") + " " + item.filterCondition.value + " "
                    }

                }
                else if (item.filterCondition.value === 'IS NOT NULL') {
                    if (item.filterColumn.item.scolumn != undefined) {


                        str = str + (item.filterColumn.item.isjsoncolumn ?
                            item.filterColumn.item.ismultilingual ?
                                item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->>'" + this.props.Login.userInfo.slanguagetypecode + "'"
                                : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                            : "\"" + item.filterColumn.item.scolumn + "\"") + " " + item.filterCondition.value + " "
                    } else if (item.filterColumn.item.scolumndisplayname != undefined) {
                        str = str + ("\"" + item.filterColumn.item.scolumndisplayname + "\"") + " " + item.filterCondition.value + " "
                    }

                }
                else if (item.filterCondition.value === 'STARTS WITH') {
                    if (item.filterColumn.item.scolumn != undefined) {

                        str = str + (item.filterColumn.item.isjsoncolumn ?
                            item.filterColumn.item.ismultilingual ?
                                item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->>'" + this.props.Login.userInfo.slanguagetypecode + "'"
                                : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                            : "\"" + item.filterColumn.item.scolumn + "\"") + "ILIKE" + " '" + (item.filterValue ? item.filterValue : "") + "%' collate \"default\""
                    } else if (item.filterColumn.item.scolumndisplayname != undefined) {
                        str = str + ("\"" + item.filterColumn.item.scolumndisplayname + "\"") + " ILIKE " + " '" + (item.filterValue ? item.filterValue : "") + "%' collate \"default\""
                    }
                }
                else if (item.filterCondition.value === 'ENDS WITH') {
                    if (item.filterColumn.item.scolumn != undefined) {

                        str = str + (item.filterColumn.item.isjsoncolumn ?
                            item.filterColumn.item.ismultilingual ?
                                item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->>'" + this.props.Login.userInfo.slanguagetypecode + "'"
                                : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                            : "\"" + item.filterColumn.item.scolumn + "\"") + "ILIKE" + " '%" + (item.filterValue ? item.filterValue : "") + "' collate \"default\""
                    } else if (item.filterColumn.item.scolumndisplayname != undefined) {
                        str = str + ("\"" + item.filterColumn.item.scolumndisplayname + "\"") + " ILIKE" + " '%" + (item.filterValue ? item.filterValue : "") + "' collate \"default\""
                    }
                }
                else if (item.filterCondition.value === 'CONTAINS') {
                    if (item.filterColumn.item.scolumn != undefined) {

                        str = str + (item.filterColumn.item.isjsoncolumn ?
                            item.filterColumn.item.ismultilingual ?
                                item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->>'" + this.props.Login.userInfo.slanguagetypecode + "'"
                                : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                            : "\"" + item.filterColumn.item.scolumn + "\"") + "ILIKE" + " '" + (item.filterValue ? item.filterValue : "") + "%' collate \"default\""
                    } else if (item.filterColumn.item.scolumndisplayname != undefined) {
                        str = str + ("\"" + item.filterColumn.item.scolumndisplayname + "\"") + " ILIKE" + " '" + (item.filterValue ? item.filterValue : "") + "%' collate \"default\""
                    }
                }
                else if ((item.filterColumn.item.columndatatype === 'date' || item.filterColumn.item.columndatatype === 'timestamp without time zone') && (item.filterCondition.value === '=' || item.filterCondition.value === '<' || item.filterCondition.value === '>')) {
                    if (item.filterColumn.item.scolumn != undefined) {

                        str = str + (item.filterColumn.item.isjsoncolumn ?
                            item.filterColumn.item.ismultilingual ?
                                item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->>'" + this.props.Login.userInfo.slanguagetypecode + "'"
                                : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                            : "\"" + item.filterColumn.item.scolumn + "\"") + " " + item.filterCondition.value + ("'" + (item.filterValue ? convertDateTimetoStringDBFormat(item.filterValue, this.props.Login.userInfo) : convertDateTimetoStringDBFormat(new Date(), this.props.Login.userInfo)) + "' ")
                    } else if (item.filterColumn.item.scolumndisplayname != undefined) {
                        str = str + ("\"" + item.filterColumn.item.scolumndisplayname + "\"") + " " + item.filterCondition.value + ("'" + (item.filterValue ? convertDateTimetoStringDBFormat(item.filterValue, this.props.Login.userInfo) : convertDateTimetoStringDBFormat(new Date(), this.props.Login.userInfo)) + "' ")
                    }
                }

                else if ((item.filterColumn.item.columndatatype === 'date' && (item.filterCondition.value === 'NOT')) || (item.filterColumn.item.columndatatype === 'timestamp without time zone' && (item.filterCondition.value === 'NOT'))) {
                    if (item.filterColumn.item.scolumn != undefined) {

                        str = str + "(NOT " + (item.filterColumn.item.isjsoncolumn ?
                            item.filterColumn.item.ismultilingual ?
                                item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->>'" + this.props.Login.userInfo.slanguagetypecode + "'"
                                : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                            : "\"" + item.filterColumn.item.scolumn + "\"") + " = " + ("'" + (item.filterValue ? convertDateTimetoStringDBFormat(item.filterValue, this.props.Login.userInfo) : convertDateTimetoStringDBFormat(new Date(), this.props.Login.userInfo)) + "')")
                    } else if (item.filterColumn.item.scolumndisplayname != undefined) {
                        str = str + ("\"" + item.filterColumn.item.scolumndisplayname + "\"") + " = " + ("'" + (item.filterValue ? convertDateTimetoStringDBFormat(item.filterValue, this.props.Login.userInfo) : convertDateTimetoStringDBFormat(new Date(), this.props.Login.userInfo)) + "')")
                    }
                }
                else if ((item.filterColumn.item.columndatatype === 'string' || item.filterColumn.item.columndatatype === 'character varying') && (item.filterCondition.value === 'NOT')) {
                    if (item.filterColumn.item.scolumn != undefined) {

                        str = str + "(NOT " + (item.filterColumn.item.isjsoncolumn ?
                            item.filterColumn.item.ismultilingual ?
                                item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->>'" + this.props.Login.userInfo.slanguagetypecode + "'"
                                : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                            : "\"" + item.filterColumn.item.scolumn + "\"") + " = " + ("'" + item.filterValue ? item.filterValue : "" + "')")
                    } else if (item.filterColumn.item.scolumndisplayname != undefined) {
                        str = str + ("\"" + item.filterColumn.item.scolumndisplayname + "\"") + " = " + ("'" + item.filterValue ? item.filterValue : "" + "')")
                    }
                }
                else if (item.filterColumn.item.columndatatype === 'character varying' && (item.filterCondition.value === 'LIKE' || item.filterCondition.value === 'NOT LIKE')) {
                    str = str + ("\"" + item.filterColumn.item.scolumndisplayname + "\"") + " " + item.filterCondition.value + " " + " '" + (item.filterValue ? item.filterValue : "") + "%' collate \"default\""
                }
                else {
                    if (item.filterColumn.item.scolumn != undefined) {

                        str = str + " " + (item.filterColumn.item.isjsoncolumn ?
                            item.filterColumn.item.ismultilingual ?
                                item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->>'" + this.props.Login.userInfo.slanguagetypecode + "'"
                                : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                            : "\"" + item.filterColumn.item.scolumn + "\"") + " " + item.filterCondition.value + ("'" + (item.filterValue ? item.filterValue : "") + "' ")
                    } else if (item.filterColumn.item.scolumndisplayname != undefined) {
                        str = str + ("\"" + item.filterColumn.item.scolumndisplayname + "\"") + " " + item.filterCondition.value + ("'" + (item.filterValue ? item.filterValue : "") + "' ")
                    }
                }

                if (index !== selectedRecord['filterNew'].length - 1) {
                    str = str + " and ";
                }
            }
            //   })
        })
        strform = strform + "" + str
        return strform;
    }



    copyToClipboard = () => {
        copyText(this.copyParameter())
        // toast.info(this.props.intl.formatMessage({ id: "IDS_COPIEDSUCCESSFULLY" }))
    }


    sendRequest = () => {
        const selectedRecord = this.state.selectedRecord;
        if (this.props.Login.masterData.SelectedApi) {
            if (this.props.Login.masterData.SelectedApi.value > 2 && this.props.Login.masterData.SelectedApi.value < 24) {
                const url = this.props.Login.masterData.SelectedApi.item.sapiservice
                let obj = this.sendObject()
                let obj1 = { "inputData": obj, url, masterData: this.props.Login.masterData, "userinfo": this.props.Login.userInfo, selectedRecord }
                this.props.sendRequest(obj1)

            }
           //ALPD-3801--Alert thrown when parameter is emtpty.
            else if (this.props.Login.masterData.SelectedApi.value === 24 && this.props.Login.masterData.SelectedSQLQuery) {
                if (selectedRecord.nsqlquerycode != undefined) {
                    let parametersname=[];
                    let hasEmptyValue=false;
                    if(this.state.parameterValue!==undefined){
                         hasEmptyValue = this.state.parameterValue.map((item, index) => {
                            let values = [];
                             if (
                                this.state.selectedRecord &&
                                this.state.selectedRecord["ParamValue"] &&
                                this.state.selectedRecord["ParamValue"][index]
                            ) {
			//ALPD-3801-When Parameter is empty isEmpty is true 
                                const isEmpty=this.state.selectedRecord["ParamValue"][index][item]==='';

                                if(isEmpty){
                                    parametersname.push(item);
                                }
                                return isEmpty;
                                
                            }
                            parametersname.push(item);

                            return true;
                        });
                        
                        // console.log(hasEmptyValue);
                        
                    }
                    if(!hasEmptyValue.includes(true)){
                    const url = "apiservice/getSQLQueryData"
                    let sqlquery = selectedRecord.nsqlquerycode.item.ssqlquery.trim()
                    let obj = this.sendObject()
                    let obj1 = { "inputData": obj, url, masterData: this.props.Login.masterData, "userinfo": this.props.Login.userInfo, selectedRecord, sqlquery,"parameters":this.state.selectedRecord.ParamValue&&this.state.selectedRecord.ParamValue.length>0? this.state.selectedRecord.ParamValue:[]||[]}
                    this.props.sendRequest(obj1)
             }
            else{
                toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASEFILLTHEPARAM" })+" ("+parametersname.map(item=>item).join(",")+") ")

            }   } else {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTHEQUERYNAME" }))
                }
            } 
            
            else if (this.props.Login.masterData.SelectedForm) {
                const url = this.props.Login.masterData.SelectedApi.item.sapiservice
                let obj = this.sendObject()
                let obj1 = { "inputData": obj, url, masterData: this.props.Login.masterData, "userinfo": this.props.Login.userInfo, selectedRecord }
                this.props.sendRequest(obj1)
            }
            else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTHEFORM" }))
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTHEAPI" }))
        }
    }


    removeSameRecordFromTwoDifferentArrays = (firstArray, secondArray) => {
        let filterArray = []
        if (Array.isArray(secondArray) && secondArray.length > 0) {
            secondArray.map((x, index1) => {
                firstArray.map(y => {
                    if (x.filterColumn) {
                        if (x.filterColumn.item.scolumndisplayname === y.item.scolumndisplayname) {
                            const index = firstArray.findIndex(x1 => x1.item.scolumndisplayname === y.item.scolumndisplayname)
                            let firstArray1 = [...firstArray];
                            firstArray1 = [...firstArray1.splice(0, index)];

                            let firstArray2 = [...firstArray];
                            firstArray2 = [...firstArray2.splice(index + 1)];
                            filterArray = [...firstArray1, ...firstArray2]
                            firstArray = [...filterArray]
                        }
                        else if (x.filterColumn.item.scolumndisplayname === y.item.scolumndisplayname) {
                            const index = firstArray.findIndex(x1 => x1.item.scolumndisplayname === y.item.scolumndisplayname)
                            let firstArray1 = [...firstArray];
                            firstArray1 = [...firstArray1.splice(0, index)];

                            let firstArray2 = [...firstArray];
                            firstArray2 = [...firstArray2.splice(index + 1)];
                            filterArray = [...firstArray1, ...firstArray2]
                            firstArray = [...filterArray]
                        }
                    } else {
                        if (index1 === 0) {
                            filterArray = [...firstArray]
                        }

                    }
                })
            })
        } else {
            filterArray = [...firstArray];
        }
        return filterArray;

    }

           //ALPD-3801--Parameter OnInputOnChange
    onInputOnChangeParam = (event, index) => {
        const selectedRecord = this.state.selectedRecord || {}
        const filterParamList=[...this.state.parameterValue]
        let filterTableNewAddedList=[];
        if(selectedRecord['ParamValue']!==undefined){
             filterTableNewAddedList = [...selectedRecord['ParamValue']]

        }
        let change={
           [filterParamList[index]]:event.target.value
       }
       let  changeData= []
       if(selectedRecord['ParamValue']!==undefined){
        let paramerAddedList=[];
        paramerAddedList=[...selectedRecord['ParamValue']]
        changeData = [...filterTableNewAddedList.splice(0, index), { ...change }, ...paramerAddedList.splice( index+1)]
       }else{
        changeData=[{...change}]
       }
        
        this.setState({ selectedRecord: { ...selectedRecord, ParamValue: changeData } })
        // this.setState({selectedRecord});
    }

    render() {
       // console.log("ParamValue",this.state.selectedRecord.ParamValue);

        return (<>
            <ListWrapper className="client-list-content pb-0">
                <Row noGutters>
                    <Col md={5} className="pr-3">
                        <Row>
                            <Col md={9}>
                                <FormSelectSearch
                                    name={"napiservicecode"}
                                    formLabel={this.props.intl.formatMessage({ id: "IDS_API" })}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    options={this.state.apiServiceList || []}
                                    value={this.props.Login.masterData.SelectedApi && this.props.Login.masterData.SelectedApi}
                                    isMandatory={true}
                                    isClearable={false}
                                    isMulti={false}
                                    isSearchable={false}
                                    closeMenuOnSelect={true}
                                    onChange={(event) => this.onComboChange(event, 'napiservicecode')}
                                />
                            </Col>
                            <Col md={1}>
                                <Button className='btn-user btn-primary-blue' onClick={(e) => this.sendRequest()}>
                                    {this.props.intl.formatMessage({ id: "IDS_SEND" })}
                                </Button>
                            </Col>
                        </Row>
                        {this.props.Login.masterData && this.props.Login.masterData.SelectedApi && (this.props.Login.masterData.SelectedApi.value < 3 || this.props.Login.masterData.SelectedApi.value > 24) ?
                            <Row noGutters>
                                <Col md={9}>
                                    <FormSelectSearch
                                        name={"nformcode"}
                                        formLabel={this.props.intl.formatMessage({ id: "IDS_FORMS" })}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        options={this.state.qualisList || []}
                                        value={this.props.Login.masterData.SelectedForm && this.props.Login.masterData.SelectedForm}
                                        isMandatory={true}
                                        isClearable={false}
                                        isMulti={false}
                                        isSearchable={false}
                                        closeMenuOnSelect={true}
                                        onChange={(event) => this.onComboChange(event, 'nformcode')}
                                    />
                                </Col>
                            </Row> : ""}
                        {this.props.Login.masterData && this.props.Login.masterData.SelectedApi && (this.props.Login.masterData.SelectedApi.value === 24) ?
                            <Row noGutters>
                                <Col md={9}>
                                    <FormSelectSearch
                                        name={"nsqlquerycode"}
                                        formLabel={this.props.intl.formatMessage({ id: "IDS_QUERYNAME" })}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        options={this.state.queryList || []}
                                        value={this.state.selectedRecord["nsqlquerycode"] && this.state.selectedRecord["nsqlquerycode"] || ""}
                                        isMandatory={true}
                                        isClearable={false}
                                        isMulti={false}
                                        isSearchable={false}
                                        closeMenuOnSelect={true}
                                        onChange={(event) => this.onComboChange(event, 'nsqlquerycode')}
                                    />
                                </Col>
                            </Row> : ""}
                        <Card className='api-filter-condition-card'>
                            <Card.Body>
                                {this.props.Login.masterData && this.props.Login.masterData.SelectedApi && (this.props.Login.masterData.SelectedApi.value < 3 || this.props.Login.masterData.SelectedApi.value > 23) ?
                                    <form>
                                        <section>
                                            {this.props.Login.masterData && this.props.Login.masterData.SelectedApi &&
                                                (this.props.Login.masterData.SelectedApi.value < 3 || this.props.Login.masterData.SelectedApi.value > 23) &&
                                                this.props.Login.masterData.needdisplayparam ?
                                                (
                                                    this.state.parameterValue && this.state.parameterValue.map((item, index) => (
                                                        <div>
                                                            <Row>

                                                                <Col md={6}>
                                                                    <FormInput
                                                                        label={this.props.intl.formatMessage({ id: "IDS_PARAMETERS" })}
                                                                        name="filterValue"
                                                                        type="text"
                                                                        placeholder={this.props.intl.formatMessage({ id: "IDS_PARAMETERS" })}
                                                                        value={this.state.parameterValue[index]}
                                                                        isMandatory={true}
                                                                        required={true}
                                                                        isDisabled={true}
                                                                        maxLength={100}
                                                                    />
                                                                </Col>

                                                                <Col md={6}>
                                                                    <FormInput
                                                                        label={this.props.intl.formatMessage({ id: "IDS_VALUE" })}
                                                                        name="filterValue"
                                                                        type="text"
                                                                        placeholder={this.props.intl.formatMessage({ id: "IDS_VALUE" })}
                                                                        value={this.state.selectedRecord['ParamValue']&&this.state.selectedRecord['ParamValue'][index] && this.state.selectedRecord['ParamValue'][index][item]&&this.state.selectedRecord['ParamValue'][index][item]} // Check how value should be set
                                                                        isMandatory={true}
                                                                        onChange={(event) => this.onInputOnChangeParam(event, index)}

                                                                       // onInputOnChange={(e) => this.onInputOnChangeParam(e, index)}
                                                                        required={true}
                                                                        maxLength={100}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    ))
                                                )
                                                : ""
                                            }


                                        </section>

                                        <section className={'modal-card-body'}>
                                            {this.state.selectedRecord['filterNew'] && this.state.selectedRecord['filterNew'].map((item, index) => {
                                                return <div className={'field has-addons filterheight'}>
                                                    <div class="control is-expanded">
                                                        <div class="select is-fullwidth">
                                                            <FormSelectSearch
                                                                formGroupClassName="remove-floating-label-margin"
                                                                formLabel={this.props.intl.formatMessage({ id: "IDS_FIELDS" })}
                                                                isSearchable={true}
                                                                name={"filterColumn"}
                                                                placeholder={this.props.intl.formatMessage({ id: "IDS_FIELDS" })}
                                                                showOption={true}
                                                                options={this.state.lstQryColumn || []}
                                                                value={item["filterColumn"] && item["filterColumn"] || ""}
                                                                onChange={value => this.onfilterChange(value, "filterColumn", 'column', index)}
                                                            ></FormSelectSearch>
                                                        </div>
                                                    </div>
                                                    <div class="control is-expanded">
                                                        <div class="select is-fullwidth">
                                                            <FormSelectSearch
                                                                formGroupClassName="remove-floating-label-margin"
                                                                formLabel={this.props.intl.formatMessage({ id: "IDS_CONDITION" })}
                                                                isSearchable={true}
                                                                name={"sviewname"}
                                                                placeholder={this.props.intl.formatMessage({ id: "IDS_CONDITION" })}
                                                                showOption={true}
                                                                options={item["filterColumn"] && item["filterColumn"].item ?
                                                                    (item["filterColumn"].item.columndatatype === 'string' || item.filterColumn.item.columndatatype === 'character varying' || item.filterColumn.item.columndatatype === 'character') ?
                                                                        stringOperatorData :
                                                                        (item["filterColumn"].item.columndatatype === 'numeric' || item.filterColumn.item.columndatatype === 'integer' || item.filterColumn.item.columndatatype === 'smallint' || item.filterColumn.item.columndatatype === 'bigint') ?
                                                                            numericOperatorData
                                                                            : (item["filterColumn"].item.columndatatype === 'date' || item["filterColumn"].item.columndatatype === 'timestamp without time zone') ?
                                                                                dateConditionData
                                                                                : stringOperatorData : ""}

                                                                value={item["filterCondition"] !== undefined ? item["filterCondition"] : ""}
                                                                onChange={value => this.onfilterChange(value, "filterCondition", 'condition', index)}
                                                            ></FormSelectSearch>
                                                        </div>
                                                    </div>

                                                    <div className={"control "}>
                                                        {(item["filterCondition"] && item["filterCondition"].value
                                                            && item["filterColumn"]) ?
                                                            (item["filterColumn"].item.columndatatype === 'string' || item.filterColumn.item.columndatatype === 'character varying' || item.filterColumn.item.columndatatype === 'character') ?
                                                                (item["filterCondition"].value !== 'IS NULL' &&
                                                                    item["filterCondition"].value !== 'IS NOT NULL' &&
                                                                    item["filterCondition"].value !== 'PRESENT' &&
                                                                    item["filterCondition"].value !== 'BLANK') ?
                                                                    <FormInput
                                                                        label={this.props.intl.formatMessage({ id: "IDS_VALUE" })}
                                                                        name="filterValue"
                                                                        type="text"
                                                                        onChange={(event) => this.onFilterInputOnChange(event, index)}
                                                                        placeholder={this.props.intl.formatMessage({ id: "IDS_VALUE" })}
                                                                        value={item["filterValue"] ? item["filterValue"] : ""}
                                                                        isMandatory={true}
                                                                        required={true}
                                                                        maxLength={100}
                                                                    /> : ""
                                                                :
                                                                (item["filterColumn"].item.columndatatype === 'numeric' || item.filterColumn.item.columndatatype === 'integer' || item.filterColumn.item.columndatatype === 'smallint' || item.filterColumn.item.columndatatype === 'bigint') ?
                                                                    (item["filterCondition"].value !== 'NULL' &&
                                                                        item["filterCondition"].value !== 'NOT NULL') ?
                                                                        item["filterCondition"].value === 'IN' ?
                                                                            <FormInput
                                                                                label={this.props.intl.formatMessage({ id: "IDS_VALUE" })}
                                                                                name="filterValue"
                                                                                type="text"
                                                                                onChange={(event) => this.onFilterInputOnChange(event, index)}
                                                                                placeholder={this.props.intl.formatMessage({ id: "IDS_VALUE" })}
                                                                                value={item["filterValue"] ? item["filterValue"] : ""}
                                                                                isMandatory={true}
                                                                                required={true}
                                                                                maxLength={100}
                                                                            />
                                                                            :
                                                                            <FormNumericInput
                                                                                name={"filterValue"}
                                                                                label={this.props.intl.formatMessage({ id: "IDS_VALUE" })}
                                                                                type="number"
                                                                                value={item["filterValue"]}
                                                                                placeholder={this.props.intl.formatMessage({ id: "IDS_VALUE" })}
                                                                                strict={true}
                                                                                //min={0}
                                                                                //max={99999999.99}
                                                                                maxLength={10}
                                                                                onChange={(value) => this.onFilterNumericInputChange(value, "filterValue", index)}
                                                                                noStyle={true}
                                                                                //precision={2}
                                                                                //isMandatory={true}
                                                                                className="form-control"
                                                                                errors="Please provide a valid number."
                                                                            />

                                                                        : ""
                                                                    : (item["filterColumn"].item.columndatatype === 'date' || item["filterColumn"].item.columndatatype === 'timestamp without time zone') ?
                                                                        (item["filterCondition"].value === '=' ||
                                                                            item["filterCondition"].value === '<'
                                                                            || item["filterCondition"].value === '>'
                                                                            || item["filterCondition"].value === 'NOT'
                                                                        ) ?
                                                                            <DateTimePicker
                                                                                name={"filterValue"}
                                                                                label={this.props.intl.formatMessage({ id: "IDS_VALUE" })}
                                                                                className='form-control'
                                                                                placeholderText={this.props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                                                                                selected={item["filterValue"] ? item["filterValue"] : new Date()}
                                                                                dateFormat={this.props.Login.userInfo["ssitedatetime"]}
                                                                                timeInputLabel={this.props.intl.formatMessage({ id: "IDS_TIME" })}
                                                                                showTimeInput={true}
                                                                                onChange={date => this.handleDateChange("filterValue", date, index)}
                                                                                value={item["filterValue"] ? item["filterValue"] : ""}
                                                                            />
                                                                            : ""
                                                                        : ""
                                                            : ""


                                                        }
                                                    </div>
                                                    <div className={"control"}>
                                                        {this.state.selectedRecord['filterNew'].length > 0 &&
                                                            <Button className={"button is-light is-danger"}
                                                                onClick={() => this.onFilterModalDelete(index)}
                                                                type="button" tabindex="0">
                                                                <span className={"icon"}>
                                                                    <FontAwesomeIcon icon={faMinus} />
                                                                </span>
                                                            </Button>
                                                        }
                                                    </div>
                                                </div>
                                            })}
                                            {this.props.Login.masterData && this.props.Login.masterData.SelectedApi && (this.props.Login.masterData.SelectedApi.value < 3 || this.props.Login.masterData.SelectedApi.value > 23) ?
                                                <div className={'buttons is-right'}>
                                                    <Button className={'button is-light is-info is-small'}
                                                        onClick={(e) => this.onMoreClick(e)} type="button" tabindex="0">

                                                        <span className={"icon"}>
                                                            <FontAwesomeIcon icon={faPlus} />
                                                        </span>
                                                        <span>{this.props.intl.formatMessage({ id: "IDS_MORE" })}</span>
                                                    </Button>
                                                </div> : ""}

                                        </section>
                                    </form >
                                    : ""}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={7}>
                        <ContentPanel className="panel-main-content" >
                            <Card className='my-2 ' >
                                <Card.Header className="product-title-main">
                                    <Card.Title>
                                        {this.props.intl.formatMessage({ id: "IDS_QUERYPARAMS" })}
                                    </Card.Title>
                                </Card.Header>
                                <Card.Body className='api-card-body-scrollable-element'>
                                    {/* <pre style={{ "height": "200px", "overflow": "scroll" }}>{"{\n"}{this.state.constructApiData.map(e => JSON.stringify(e, null, 2).replace(/{|}/g, ''))}{"\n}"}</pre> */}
                                    <pre>{this.showQueryParameter()}</pre>
                                    <div className='buttons is-right'>
                                        <Button className='btn-user btn-primary-blue' onClick={(e) => this.copyToClipboard()}>
                                            <FontAwesomeIcon className='' icon={faCopy}></FontAwesomeIcon>{'  '}
                                            {this.props.intl.formatMessage({ id: "IDS_COPYQUERYPARAMS" })}
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </ContentPanel>
                        <ContentPanel className="panel-main-content" >
                            <Card >
                                <Card.Header className="product-title-main">
                                    <Card.Title>
                                        {this.props.intl.formatMessage({ id: "IDS_RESPONSE" })}
                                    </Card.Title>
                                </Card.Header>
                                <Card.Body className='api-card-body'>
                                    <ReactJson src={this.props.Login.masterData.consoleData && this.props.Login.masterData.consoleData} />
                                </Card.Body>
                            </Card>
                        </ContentPanel>

                    </Col>
                </Row>
            </ListWrapper>
        </>)
    }

    showQueryParameter = () => {
        //   let newObject = {}
        let returnString = "{";
        //    let param;
        if (this.state && this.state.selectedRecord && this.state.selectedRecord.napiservicecode && this.state.selectedRecord.napiservicecode.value < 3) {
            if (this.state && this.state.constructApiData.length > 0) {
                this.state.constructApiData.map((e, index) => {
                    if (index < 2) {
                        returnString = returnString + " \n \"" + Object.keys(e) + "\":\"" + Object.values(e) + "\""
                    }

                })
                let text = this.filterQueryFormation(this.state.selectedRecord)

                returnString = returnString + "\n" + " \"whereCondition\":\"" + text + "\"\n}"
            }
            else {
                returnString = returnString + "\n}"
            }
        } else if (this.state && this.state.selectedRecord && this.state.selectedRecord.napiservicecode && this.state.selectedRecord.napiservicecode.value == 24) {
            if (this.state && this.state.constructApiData.length > 0) {
                this.state.constructApiData.map((e, index) => {
                    if (index < this.state.constructApiData.length) {
                        returnString = returnString + "\n \"" + Object.keys(e) + "\":\"" + Object.values(e) + "\""
                    }
                })
                let text = this.filterQueryFormation(this.state.selectedRecord)
	    //ALPD-3801--Parameters Displaying in ShowQueryParam 
                if (this.state.parameterValue&&this.state.parameterValue.length > 0) {

                    this.state.parameterValue.map((item, index) => {
                        //  param ="\n" +this.state.parameterValue[index]+"\":\"" +this.state.selectedRecord[this.state.parameterValue[index]]!==undefined?this.state.selectedRecord[this.state.parameterValue[index]] :"";
                       // returnString = returnString + "\n \"" + this.state.parameterValue[index] +"\":\"" + Object.values(e) + "\""

                        returnString = returnString + ("\n \"" + this.state.parameterValue[index] +"\":\"") +(this.state.selectedRecord["ParamValue"]&&this.state.selectedRecord["ParamValue"][index]!==undefined?this.state.selectedRecord["ParamValue"][index] [item]!=undefined?this.state.selectedRecord["ParamValue"][index] [item]+ " \"":" \"":" \"")

                    })
                }
                returnString = returnString + "\n" + " \"whereCondition\":\"" + text + "\"\n}"

            } else {
                returnString = returnString + "\n}"
            }
        } else if (this.props.Login) {
            returnString = returnString + "\"userinfo\":"
            let userinfo = JSON.stringify(this.props.Login.userInfo);
            returnString = returnString + userinfo + "}"
        }

        return returnString;
    }

    copyParameter = () => {
        let newObject = {}
        if (this.state && this.state.selectedRecord && this.state.selectedRecord.napiservicecode && this.state.selectedRecord.napiservicecode.value < 3) {
            if (this.state && this.state.constructApiData.length > 0) {

                toast.info(this.props.intl.formatMessage({ id: "IDS_COPIEDSUCCESSFULLY" }))

                this.state.constructApiData.map((e, index) => {
                    if (index < 2) {
                        newObject = {
                            ...newObject,
                            ...e
                        }
                    }

                })
                let text = this.filterQueryFormation(this.state.selectedRecord)
                const object = {
                    ...newObject,
                    "whereCondition": text
                }
                return JSON.stringify(object);

            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_QUERYISEMPTY" }))
            }
        } else if (this.props.Login && this.props.Login.userInfo) {

            let parametersname=[];
            let hasEmptyValue=[];
            if(!this.state.parameterValue!==undefined){
                hasEmptyValue.push(false);
            }
            if(this.state.parameterValue!==undefined){
                 hasEmptyValue = this.state.parameterValue.map((item, index) => {
               
                    // let isEmpty=[];
                     if (
                        this.state.selectedRecord &&
                        this.state.selectedRecord["ParamValue"] &&
                        this.state.selectedRecord["ParamValue"][index]
                    ) {
                        //values.push(this.state.selectedRecord["ParamValue"][index][item]||'');
                        const isEmpty=this.state.selectedRecord["ParamValue"][index][item]==='';
                       
                            //const isEmpty = values.some(value => value === '');
                        if(isEmpty){
                            parametersname.push(item);
                        }
                        return isEmpty;
                        
                    }
                    parametersname.push(item);

                    return true;
                });
                
                // console.log(hasEmptyValue);
                
            }
            if(!hasEmptyValue.includes(true) ){
                toast.info(this.props.intl.formatMessage({ id: "IDS_COPIEDSUCCESSFULLY" }))

                const object = {
                    "userinfo": this.props.Login.userInfo
                }
                return JSON.stringify(object);
            }else{
                toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASEFILLTHEPARAM" })+" ("+parametersname.map(item=>item).join(",")+") ")

            }

           

        }
    }

    sendObject = () => {
        let newObject = {}
        this.state.constructApiData.map(e => {
            newObject = {
                ...newObject,
                ...e
            }
        })
        let text = this.filterQueryFormation(this.state.selectedRecord)
        const object = {
            ...newObject,
            "whereCondition": text
        }

        return object;
    }

    componentDidUpdate(previousProps) {
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            // console.log(this.props.Login.masterData !== previousProps.Login.masterData)
            let { userRoleControlRights, controlMap, apiServiceList,
                selectedRecord, constructApiData, lstQueryBuilder, qualisList, queryList, paramList, parameterValue
            } = { ...this.state }

            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            }
            if (this.props.Login && this.props.Login.masterData && this.props.Login.masterData.SelectedApi && this.props.Login.masterData.SelectedApi.value < 3) {
                selectedRecord =
                    { "napiservicecode": this.props.Login.masterData.SelectedApi, ...this.state.selectedRecord }
            }

            if (this.props.Login.masterData.lstApiService !== previousProps.Login.masterData.lstApiService) {
                const apiServiceMap = constructOptionList(this.props.Login.masterData.lstApiService || [], "napiservicecode",
                    "sapiservicename", "nsorter", "ascending", false);
                apiServiceList = apiServiceMap.get("OptionList")
            }

            if (this.props.Login.masterData.lstqueryForm !== previousProps.Login.masterData.lstqueryForm) {
                const qualisMap = constructOptionList(this.props.Login.masterData.lstqueryForm || [], "nformcode",
                    "sdisplayname", "nsorter", "ascending", false);
                qualisList = qualisMap.get("OptionList")
                // this.setState({
                //     qualisList
                // });
            }

            if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
                selectedRecord={...selectedRecord, 
                ...this.props.Login.selectedRecord };
            }
            // if (this.props.Login.parameterValue !== previousProps.Login.parameterValue) {
            //     parameterValue={...parameterValue, 
            //     ...this.props.Login.parameterValue };
            // }
            if (this.props.Login.masterData.lstSQLQuery !== previousProps.Login.masterData.lstSQLQuery) {
                const queryMap = constructOptionList(this.props.Login.masterData.lstSQLQuery || [], "nsqlquerycode",
                    "ssqlqueryname", "ssqlquery", "nsorter", "ascending", false);
                queryList = queryMap.get("OptionList")

            }
            if (this.props.Login.masterData.Parameters !== previousProps.Login.masterData.Parameters) {
                // const paramMap = constructOptionList(this.props.Login.masterData.Parameters || [] , this.props.Login.masterData.Parameters , "ascending", false);
                // paramList = paramMap.get("OptionList")

                let listParam = [];
                if(this.props.Login.masterData.Parameters!=undefined){
                    listParam = this.props.Login.masterData.Parameters;
                    parameterValue = listParam.map(item => {
                        return item;
                    }
                    );
                }else{
                    parameterValue=this.props.Login.masterData.Parameters;  
                }
               
            }
            if (this.props.Login.masterData.SelectedForm !== previousProps.Login.masterData.SelectedForm) {

                if (this.props.Login.masterData.SelectedForm && this.props.Login.masterData.SelectedForm.value) {
                    constructApiData = [
                        { "nformcode": this.props.Login.masterData.SelectedForm.value },
                        { "sformname": this.props.Login.masterData.SelectedForm.label }
                    ]
                }
                else {
                    constructApiData = []
                }

                let constructData = this.props.Login.masterData.lstquerybilderColumns.map((item, index) => {
                    return { label: item.scolumndisplayname, value: index, item: { ...item } }

                })
                lstQueryBuilder = constructData;
                selectedRecord['filterNew'] = []
            }



            if (this.props.Login.masterData.SelectedApi !== previousProps.Login.masterData.SelectedApi) {
                if (this.props.Login.masterData.SelectedApi && this.props.Login.masterData.SelectedApi.value && this.props.Login.masterData.SelectedApi.value === 24) {

                    let constructQuery = this.props.Login.masterData.lstSQLQuery.map((item, index) => {
                        return { label: item.ssqlqueryname, value: index, item: { ...item } }
                    })
                    lstQueryBuilder = constructQuery;
                }
            }
            if (this.props.Login.masterData.SelectedSQLQuery !== previousProps.Login.masterData.SelectedSQLQuery) {

                if (this.props.Login.masterData.SelectedSQLQuery && this.props.Login.masterData.SelectedSQLQuery.value && this.props.Login.masterData.SelectedApi.value === 24) {

                    constructApiData = [
                        { "nsqlquerycode": this.props.Login.masterData.SelectedSQLQuery.value },
                        { "ssqlqueryname": this.props.Login.masterData.SelectedSQLQuery.label },

                    ]
                    // if(this.props.Login.masterData.Parameters!=undefined){
                    //     th   is.props.Login.masterData.Parameters.map(item=>{
                    //         constructApiData.push({[item]:item})  

                    //     })
                    // }
                }
                else {
                    constructApiData = []
                }

                let constructData = [];
                if (this.props.Login.masterData && this.props.Login.masterData.Columns) {
                    constructData = this.props.Login.masterData.Columns.map((item, index) => {
                        return { label: item.scolumndisplayname, value: index, item: { ...item } }

                    })
                } else {
                    constructData = [];
                }
                lstQueryBuilder = constructData;
                selectedRecord['filterNew'] = []

            }
            if (this.props.Login && this.props.Login.newMap) {
                selectedRecord['filterNew'] = { "whereCondition": this.props.Login.newMap.whereCondition }
            }
           
            this.setState({
                userRoleControlRights,
                controlMap, apiServiceList,
                selectedRecord, constructApiData,
                lstQueryBuilder, qualisList, queryList, paramList, parameterValue
            });
        }
        else {

            if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
                this.setState({
                    selectedRecord: this.props.Login.selectedRecord,
                    data: this.props.Login.masterData
                });
            }
        }

    }
    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, operation: null, modalName: undefined
            }
        }
        this.props.updateStore(updateInfo);
    }
}
export default connect(mapStateToProps, {
    sendRequest,
    getQualisFormsFields, getQualisForms, getCustomQuery, getCustomQueryName, updateStore
})(injectIntl(APIService));