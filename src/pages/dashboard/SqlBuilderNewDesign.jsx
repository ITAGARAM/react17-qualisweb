import { faAd, faCopy, faDownload, faEdit, faMinus, faPen, faPenAlt, faPencilAlt, faPlus, faTable, faTimes, faTrash, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Card, Col, Form, InputGroup, Nav, Row } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import FilterCondition from './FilterCondition';
import ListComponent from './ListComponent';
import './SqlBuilderDesign.css'
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { ListWrapper } from '../../components/client-group.styles';
import { constructOptionList, convertDateTimetoStringDBFormat, copyText } from '../../components/CommonScript';
import {
    stringOperatorData, numericOperatorData, joinCondition,
    joinConditionData, orderByList, aggregateFunction, summarizeOperatorData, dateConditionData
} from './SqlBuilderFilterType'
import FormInput from '../../components/form-input/form-input.component';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import { toast } from 'react-toastify';
import ButtonMultiSelectDropDown from './ButtonDropdown';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import PerfectScrollbar from 'react-perfect-scrollbar';

class SqlBuilderNewDesign extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            listTables: [],
            listColumnForMultiSelect: [],
            dataStateTable: { skip: 0 },

        });
        this.searchRef = React.createRef();
    }
    tableDataStateChange = (event) => {
        this.setState({
            dataStateTable: event.dataState
        });
    }
    onClickTable = (item) => {

        // let selectedRecord = this.state.selectedRecord;
        //let avaliableColumns = [];

        const { selectedRecord, avaliableColumns, avaliableColumnsForMultiSelect } = this.queryFormation({ selectedRecord: {}, item }, 1);
        selectedRecord['selectedTable'] = item;

        selectedRecord['stablename'] = [{ label: item.stabledisplayname, value: 0, item: item }];
        // selectedRecord['stablename'+0]= 
        this.setState({ selectedRecord, avaliableColumns, avaliableColumnsForMultiSelect })
    }

    queryFormation = (Param, type) => {
        const selectedRecord = Param.selectedRecord || {};
        let avaliableColumns = []
        let avaliableColumnsForMultiSelect = []
        if (type === 1) {
            const tableName = Param.item.tableName
            const tabledisplayName = Param.item.stabledisplayname
            if (selectedRecord.sql === undefined || selectedRecord.sql === '') {

                selectedRecord['sql'] = "SELECT * FROM " + tableName + " \"" + tabledisplayName + "\"";
                avaliableColumns = this.props.tableList.filter(p => p.stable === tableName);

                let constructData1 = this.state.listColumnForMultiSelect && this.state.listColumnForMultiSelect.filter(item => item.value === tableName);
                let constructData2 = constructData1 && constructData1.map((item, index) => {
                    return {
                        label: item.label, value: 0, item: { ...item.item, parentTableIndex: 0 }
                        , options: item.options.map((i, index1) => {
                            return { label: i.label, value: index1, item: { ...i.item, parentTableIndex: 0 } }
                        })
                    }

                })

                let constructData = avaliableColumns.map((item, index) => {
                    return { label: item.stable +"_"+item.scolumndisplayname, value: index, item: { ...item, parentTableIndex: 0 } }

                })
                selectedRecord['scolumnname'] = constructData;
                avaliableColumns = constructData;
                avaliableColumnsForMultiSelect = constructData2
            }
        }
        else if (type === 2) {
            let str = "";
            str = "SELECT ";
            if (selectedRecord.scolumnname.length !== this.state.avaliableColumns.length) {
                selectedRecord.scolumnname.map((item, index) => {
                    if (selectedRecord.scolumnname.length - 1 !== index) {
                        str = str + "\"" + item.item.stabledisplayname + "\".\"" + item.value + "\" \"" + item.label + "\", "
                    } else {
                        str = str + "\"" + item.item.stabledisplayname + "\".\"" + item.value + "\" \"" + item.label + "\" "
                    }


                })
            } else {
                str = str + " * ";
            }

            str = str + " FROM "
            selectedRecord['stablename'].map(item => {
                str = str + item.value + " \"" + item.label + "\""
            })
            selectedRecord['sql'] = str;
        }

        return { selectedRecord, avaliableColumns, avaliableColumnsForMultiSelect };

    }

    onClose = event => {
        this.setState({ selectedRecord: {} })
    }

    onfilterChange = (comboValue, columnLabel, conditionType, index) => {
        const selectedRecord = this.state.selectedRecord;
        let summarizeCombo = []
        if (conditionType === 'table') {
            if (comboValue.item.summarize) {
                selectedRecord['summarize'].map((item, index) => {
                    if (item.summarizeCondition.value === "COUNT") {
                        summarizeCombo.push({ label: (item.summarizeTable.label + item.summarizeColumn.item.scolumndisplayname + "Count"), value: index, item: { ...item, summarize: true } })
                    } else if (item.summarizeCondition.value === "DISTINCT") {
                        summarizeCombo.push({ label: (item.summarizeTable.label + item.summarizeColumn.item.scolumndisplayname + "CountDistinct"), value: index, item: { ...item, summarize: true } })
                    }
                })
            }

            const filterTableNewAddedList = [...selectedRecord['filterNew']]
            const change = { ...filterTableNewAddedList[index], [columnLabel]: comboValue, filterColumn: undefined, filterCondition: undefined, filterValueType: undefined, filterValue: undefined }
            const changeData = [...filterTableNewAddedList.splice(0, index), { ...change }, ...filterTableNewAddedList.splice(index + 1)]
            this.setState({ selectedRecord: { ...selectedRecord, filterNew: changeData }, summarizeCombo })
        }
        else if (conditionType === 'column') {
            const filterTableNewAddedList = [...selectedRecord['filterNew']]
            const change = {
                ...filterTableNewAddedList[index], [columnLabel]: comboValue,
                filterCondition: undefined, filterValueType: undefined, filterValue: undefined
            }
            const changeData = [...filterTableNewAddedList.splice(0, index), { ...change }, ...filterTableNewAddedList.splice(index + 1)]
            this.setState({ selectedRecord: { ...selectedRecord, filterNew: changeData }, summarizeCombo })
        }
        else if (conditionType === 'condition') {
            const filterTableNewAddedList = [...selectedRecord['filterNew']]
            const change = { ...filterTableNewAddedList[index], [columnLabel]: comboValue }

            let filterValueType = undefined
            if (comboValue.value !== 'IN' &&
                comboValue.value !== '=' &&
                comboValue.value !== '!=' &&
                comboValue.value !== '<' &&
                comboValue.value !== '>' &&
                comboValue.value !== '>=' &&
                comboValue.value !== '<=' &&
                ((change.filterColumn.item.columndatatype === 'string'
                    && comboValue.value !== 'NOT') ||
                    (change.filterColumn.item.columndatatype === 'date'
                        && (comboValue.value !== 'NOT' || comboValue.value !== 'ON')))

            ) {
                filterValueType = { label: "Pre-Defined Values", value: 2 }
                change['filterValueType'] = filterValueType
            } else {
                change['filterValueType'] = undefined;
            }
            const changeData = [...filterTableNewAddedList.splice(0, index), { ...change, filterValue: undefined }, ...filterTableNewAddedList.splice(index + 1)]
            this.setState({ selectedRecord: { ...selectedRecord, filterNew: changeData }, summarizeCombo })
        }
        else if (conditionType === 'valueType') {
            const filterTableNewAddedList = [...selectedRecord['filterNew']]
            const change = { ...filterTableNewAddedList[index], [columnLabel]: comboValue, filterValue: undefined }
            const changeData = [...filterTableNewAddedList.splice(0, index), { ...change }, ...filterTableNewAddedList.splice(index + 1)]
            this.setState({ selectedRecord: { ...selectedRecord, filterNew: changeData }, summarizeCombo })
        }
        else if (conditionType === 'joinCondition') {
            //const filterTableNewAddedList = { ...selectedRecord[columnLabel] }
            this.setState({ selectedRecord: { ...selectedRecord, [columnLabel]: comboValue }, summarizeCombo })

        }



    }

    onSortChange = (comboValue, columnLabel, conditionType, index) => {
        const selectedRecord = this.state.selectedRecord;

        const filterTableNewAddedList = [...selectedRecord['sortNew']]
        const change = { ...filterTableNewAddedList[index], [columnLabel]: comboValue }

        switch (conditionType) {
            case 'table':
                change['sortColumn'] = undefined
                // selectedRecord['sortNew'][index][columnLabel] = comboValue;
                break;
        }
        const changeData = [...filterTableNewAddedList.splice(0, index), { ...change }, ...filterTableNewAddedList.splice(index + 1)]
        this.setState({ selectedRecord: { ...selectedRecord, sortNew: changeData } })

    }

    onSummarizeChange = (comboValue, columnLabel, conditionType, index) => {
        const selectedRecord = this.state.selectedRecord;


        const filterTableNewAddedList = [...selectedRecord['summarizeNew']]
        const change = { ...filterTableNewAddedList[index], [columnLabel]: comboValue }
        switch (conditionType) {
            case 'table':
                change['summarizeColumn'] = undefined
                change['summarizeCondition'] = undefined
                // selectedRecord['summarizeNew'][index][columnLabel] = comboValue;
                break;
            case 'column':
                change['summarizeCondition'] = undefined
                // selectedRecord['summarizeNew'][index][columnLabel] = comboValue;
                break;
            // case 'condition':
            //     selectedRecord['summarizeNew'][index][columnLabel] = comboValue;
            //     break;

        }
        const changeData = [...filterTableNewAddedList.splice(0, index), { ...change }, ...filterTableNewAddedList.splice(index + 1)]
        this.setState({ selectedRecord: { ...selectedRecord, summarizeNew: changeData } })

    }

    onGroupChange = (comboValue, columnLabel, conditionType, index) => {
        const selectedRecord = this.state.selectedRecord;

        const filterTableNewAddedList = [...selectedRecord['groupNew']]
        const change = { ...filterTableNewAddedList[index], [columnLabel]: comboValue }
        switch (conditionType) {
            case 'table':
                change['groupColumn'] = undefined
                // selectedRecord['groupNew'][index][columnLabel] = comboValue;
                break;
            // case 'column':
            //     selectedRecord['groupNew'][index][columnLabel] = comboValue;
            //     break;
        }
        const changeData = [...filterTableNewAddedList.splice(0, index), { ...change }, ...filterTableNewAddedList.splice(index + 1)]
        this.setState({ selectedRecord: { ...selectedRecord, groupNew: changeData } })

    }


    closeAlertModal = event => {
        const selectedRecord = this.state.selectedRecord || {}
        if (this.state.filterType === 1) {

            this.setState({
                showFilter: false,
                selectedRecord: {
                    ...selectedRecord, filterNew: [],
                    filterNewCondition: []
                },
                listOldTableColumn: [], listNewTableColumn: []
            })

        }
        else if (this.state.filterType === 2) {
            this.setState({
                showFilter: false,
                selectedRecord: {
                    ...selectedRecord, filterTableJoin: {},
                    filterTableNewAdded: [], filterTableNewAddButton: false
                    , filterTableOld: {}, filterTableOldColumn: {},
                    filterTableNew: {}, filterTableNewColumn: {}
                },
                listOldTableColumn: [], listNewTableColumn: []
            })

        }
        else if (this.state.filterType === 3) {

            this.setState({
                showFilter: false, selectedRecord: { ...selectedRecord, sortNew: [] },
                listOldTableColumn: [], listNewTableColumn: []
            })

        }
        else if (this.state.filterType === 4) {

            this.setState({
                showFilter: false, selectedRecord: { ...selectedRecord, summarizeNew: [] },
                listOldTableColumn: [], listNewTableColumn: []
            })

        }

        else if (this.state.filterType === 5) {

            this.setState({
                showFilter: false, selectedRecord: { ...selectedRecord, groupNew: [] },
                listOldTableColumn: [], listNewTableColumn: []
            })

        }

        else if (this.state.filterType === 6) {
            this.setState({
                showFilter: false, selectedRecord: { ...selectedRecord, LimitNew: 0 },
                listOldTableColumn: [], listNewTableColumn: []
            })

        }

        else if (this.state.filterType === 8) {
            this.setState({
                showFilter: true,
                selectedRecord: { ...selectedRecord, joinAliasName: "" },
                filterTitle: this.props.intl.formatMessage({ id: "IDS_ADDJOIN" }),
                filterType: 2
                // listOldTableColumn: [], listNewTableColumn: []
            })

        }

        // this.setState({ showFilter: false,selectedRecord,
        //      listOldTableColumn: [], listNewTableColumn: [] })
    }

    onFilterInputOnChange = (event, index) => {
        const selectedRecord = this.state.selectedRecord || {};

        const filterTableNewAddedList = [...selectedRecord['filterNew']]
        const change = { ...filterTableNewAddedList[index], [event.target.name]: event.target.value }
        const changeData = [...filterTableNewAddedList.splice(0, index), { ...change }, ...filterTableNewAddedList.splice(index + 1)]

        this.setState({ selectedRecord: { ...selectedRecord, filterNew: changeData } });


    }

    onjoinAliasName = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        this.setState({ selectedRecord: { ...selectedRecord, [event.target.name]: event.target.value } });

    }

    onFilterNumericInputChange = (value, name, index) => {
        const selectedRecord = this.state.selectedRecord || {};

        const filterTableNewAddedList = [...selectedRecord['filterNew']]
        const change = { ...filterTableNewAddedList[index], [name]: value }
        const changeData = [...filterTableNewAddedList.splice(0, index), { ...change }, ...filterTableNewAddedList.splice(index + 1)]
        this.setState({ selectedRecord: { ...selectedRecord, filterNew: changeData } });

    }

    handleDateChange = (columnLabel, value, index) => {
        const selectedRecord = this.state.selectedRecord || {};
        const filterTableNewAddedList = [...selectedRecord['filterNew']]
        const change = { ...filterTableNewAddedList[index], [columnLabel]: value }
        const changeData = [...filterTableNewAddedList.splice(0, index), { ...change }, ...filterTableNewAddedList.splice(index + 1)]
        this.setState({ selectedRecord: { ...selectedRecord, filterNew: changeData } });
    }


    onNumericLimitChange = (value, name) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[name] = value;
        this.setState({ selectedRecord });
    }



    onCondition = (e, conditionType) => {
        const selectedRecord = this.state.selectedRecord;
        switch (conditionType) {
            case 1:
                let summarizeLoad = true;
                let summarizeLoadOnly = false;
                selectedRecord['filterNew'] = [{}]
                selectedRecord['filterNewCondition'] = { label: "And", value: 'And', items: { label: "And", value: 1 } };

                if (selectedRecord['summarize'] && selectedRecord['summarize'].length > 0) {
                    if (selectedRecord['filterSummarize'] && selectedRecord['filterSummarize'].length > 0) {
                        summarizeLoad = false
                        // selectedRecord['filter'].map((item, index) => {
                        //     if (item.filterTable.item.summarize) {
                        //         summarizeLoad = false
                        //     }
                        // })
                    } else {
                        summarizeLoad = true
                    }

                } else {
                    summarizeLoad = false
                }


                this.setState({
                    summarizeLoadOnly,
                    summarizeLoad,
                    showFilter: true,
                    filterTitle: this.props.intl.formatMessage({ id: "IDS_ADDFILTER" }),
                    filterType: conditionType,
                    selectedRecord
                });
                break;
            case 2:
                selectedRecord['filterTableNewAdded'] = [{}]
                selectedRecord['filterTableNewAddButton'] = true
                selectedRecord['filterNewTableCondition'] = { label: "Inner Join", value: "INNER JOIN", items: { label: "Inner join", value: "INNER JOIN", symbol: "inner" } };
                this.setState({
                    showFilter: true,
                    filterTitle: this.props.intl.formatMessage({ id: "IDS_ADDJOIN" }),
                    filterType: conditionType,
                    selectedRecord
                });
                break;
            case 3:
                //selectedRecord['sortNew'] = [{ 'sortCondition': { label: "Ascending", value: "asc", items: { label: "Ascending", value: "asc" } } }]
                this.setState({
                    showFilter: true,
                    filterTitle: this.props.intl.formatMessage({ id: "IDS_SORT" }),
                    filterType: conditionType,
                    selectedRecord: { ...selectedRecord, sortNew: [{ 'sortCondition': { label: "Ascending", value: "asc", items: { label: "Ascending", value: "asc" } } }] }
                });
                break;
            case 4:
                // selectedRecord['summarizeNew'] = [{}]
                this.setState({
                    showFilter: true,
                    filterTitle: this.props.intl.formatMessage({ id: "IDS_SUMMARIZE" }),
                    filterType: conditionType,
                    selectedRecord: { ...selectedRecord, summarizeNew: [{}] }
                });
                break;
            case 5:
                //selectedRecord['groupNew'] = [{}]
                this.setState({
                    showFilter: true,
                    filterTitle: this.props.intl.formatMessage({ id: "IDS_ADDGROUP" }),
                    filterType: conditionType,
                    selectedRecord: { ...selectedRecord, groupNew: [{}] }
                });
                break;
            case 6:
                this.setState({
                    showFilter: true,
                    filterTitle: this.props.intl.formatMessage({ id: "IDS_ADDLIMIT" }),
                    filterType: conditionType,
                    selectedRecord
                });
                break;

        }

    }

    onComboFieldChange = (event, filed) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[filed] = event;
        this.setState({ selectedRecord });

    }

    onJoinChange = (value, columnName, type, index) => {
        const selectedRecord = this.state.selectedRecord;
        if (type !== 'joinTableCondition') {
            const filterTableNewAddedList = [...selectedRecord['filterTableNewAdded']]
            const change = { ...filterTableNewAddedList[index], [columnName]: value }

            let listNewTableColumn = this.state.listNewTableColumn || [];
            let listOldTableColumn = this.state.listOldTableColumn || []
            if (type === 'oldtable') {
                change['filterTableOldColumn'] = undefined
                listOldTableColumn = constructOptionList(this.props.tableList.filter(p => p.stable === value.item.tableName), 'scolumn', 'scolumndisplayname').get("OptionList")
            }
            else if (type === 'newtable') {
                change['filterTableNewColumn'] = undefined
                listNewTableColumn = constructOptionList(this.props.tableList.filter(p => p.stable === value.item.tableName), 'scolumn', 'scolumndisplayname').get("OptionList")
            }
            const changeData = [...filterTableNewAddedList.splice(0, index), { ...change }, ...filterTableNewAddedList.splice(index + 1)]
            this.setState({ selectedRecord: { ...selectedRecord, 'filterTableNewAdded': changeData }, listNewTableColumn, listOldTableColumn })

        } else {
            this.setState({ selectedRecord: { ...selectedRecord, [columnName]: value } })
        }
    }

    checkFilter = (filterList) => {
        let check = [];
        filterList.map((item, index) => {
            if (item.filterTable && item.filterTable.item.summarize) {
                if (item.filterColumn) {
                    if (item.filterCondition) {
                        if (item.filterValueType &&
                            item.filterValueType.value === 1) {
                            check.push(true)
                        } else {
                            if (item.filterValueType &&
                                item.filterValueType.value === 2) {
                                if (item.filterValue
                                    && item.filterValue !== undefined && item.filterValue !== "") {
                                    check.push(true)
                                }
                            }

                        }
                    }
                }

            } else if (item.filterTable) {
                if (item.filterColumn) {
                    if (item.filterCondition) {
                        if (item.filterColumn.item.columndatatype === 'string') {
                            if (item.filterCondition.value === '='
                                || item.filterCondition.value === 'IN'
                                || item.filterCondition.value === 'NOT') {
                                if (item.filterValueType &&
                                    item.filterValueType.value === 2) {
                                    if (item.filterValue && item.filterValue !== "") {
                                        check.push(true)
                                    }
                                } else {
                                    if (item.filterValueType &&
                                        item.filterValueType.value === 1) {
                                        check.push(true)
                                    }
                                }
                            }
                            else {
                                if (item.filterCondition) {
                                    check.push(true)
                                }
                            }
                        }
                        else if (item.filterColumn.item.columndatatype === 'numeric') {
                            if (item.filterCondition.value === '='
                                || item.filterCondition.value === '!=' ||
                                item.filterCondition.value === '>' ||
                                item.filterCondition.value === '<' ||
                                item.filterCondition.value === '>=' ||
                                item.filterCondition.value === '<='
                            ) {
                                if (item.filterValueType &&
                                    item.filterValueType.value === 2) {
                                    if (item.filterValue && item.filterValue !== "" || item.filterValue===0) {
                                        check.push(true)
                                    }
                                } else {
                                    if (item.filterValueType
                                        && item.filterValueType.value === 1) {
                                        check.push(true)
                                    }
                                }
                            }
                            else {
                                if (item.filterCondition) {
                                    check.push(true)
                                }
                            }
                        }
                        else if (item.filterColumn.item.columndatatype === 'date') {
                            if (item.filterCondition.value === '='
                                || item.filterCondition.value === 'NOT'
                            ) {
                                if (item.filterValueType &&
                                    item.filterValueType.value === 2) {
                                    if (item.filterValue && item.filterValue !== "") {
                                        check.push(true)
                                    }
                                } else {
                                    if (item.filterValueType &&
                                        item.filterValueType.value === 1) {
                                        check.push(true)
                                    }
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
            }
        })
        return check.length === filterList.length ? true : false;
    }


    checkJoin = (joinList) => {
        let check = [];
        joinList.map((item, index) => {
            if (item.filterTableOld) {
                if (item.filterTableOldColumn) {
                    if (item.filterTableNew) {
                        if (item.filterTableNewColumn) {
                            check.push(true)
                        }
                    }
                }
            }
        })
        return check.length === joinList.length ? true : false;
    }

    checkssg = (List, type) => {
        let check = [];
        List.map((item, index) => {
            if (type === 1) {
                if (item.sortTable) {
                    if (item.sortColumn) {
                        if (item.sortCondition) {
                            check.push(true)

                        }
                    }
                }
            } else if (type === 2) {
                if (item.summarizeTable) {
                    if (item.summarizeColumn) {
                        if (item.summarizeCondition) {
                            check.push(true)
                        }
                    }
                }
            } else {
                if (item.groupTable) {
                    if (item.groupColumn) {
                        check.push(true)
                    }
                }
            }
        })
        return check.length === List.length ? true : false;
    }

    onMoreClick = (e, filterType) => {
        const selectedRecord = this.state.selectedRecord || {}
        switch (filterType) {

            case 1:
                let summarizeLoadOnly = this.state.summarizeLoadOnly
                let summarizeLoad = this.state.summarizeLoad

                if (this.checkFilter(selectedRecord['filterNew'])) {
                    selectedRecord['filterNew'][selectedRecord['filterNew'].length] = {}
                    if (selectedRecord['filterNew'][0]['filterTable'].item.summarize) {
                        summarizeLoadOnly = true
                    } else {
                        summarizeLoad = false
                        summarizeLoadOnly = false
                    }

                    this.setState({
                        selectedRecord, summarizeLoadOnly, summarizeLoad
                    })
                } else {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASEFILLTHEVALUE" }))
                }
                break;
            case 2:
                if (this.checkJoin(selectedRecord['filterTableNewAdded'])) {
                    // selectedRecord['filterTableNewAddButton'] = true
                    selectedRecord['filterTableNewAdded'] = [...selectedRecord['filterTableNewAdded'], {}]
                    this.setState({
                        selectedRecord
                    })
                } else {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASEFILLTHEVALUE" }))
                }

                break;
            case 3:
                if (this.checkssg(selectedRecord['sortNew'], 1)) {
                    selectedRecord['sortNew'][selectedRecord['sortNew'].length] = { 'sortCondition': { label: "Ascending", value: "asc", items: { label: "Ascending", value: "asc" } } }
                    this.setState({
                        selectedRecord
                    })
                } else {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASEFILLTHEVALUE" }))
                }

                break;
            case 4:
                if (this.checkssg(selectedRecord['summarizeNew'], 2)) {
                    selectedRecord['summarizeNew'][selectedRecord['summarizeNew'].length] = {}
                    this.setState({
                        selectedRecord
                    })
                } else {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASEFILLTHEVALUE" }))
                }
                break;
            case 5:
                if (this.checkssg(selectedRecord['groupNew'], 3)) {
                    selectedRecord['groupNew'][selectedRecord['groupNew'].length] = {}
                    this.setState({
                        selectedRecord
                    })
                } else {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASEFILLTHEVALUE" }))
                }
                break;
        }

    }

    joinTableCheck(selectedRecord) {
        let newTable1 = ''
        let oldTable = ''
        let check = true;
        selectedRecord['filterTableNewAdded'].map((item, index) => {
            if (index === 0) {
                newTable1 = item.filterTableNew.label
                oldTable = item.filterTableOld.label
            }

            if (index !== 0 && (newTable1 !== item.filterTableNew.label
                || oldTable !== item.filterTableOld.label)) {
                check = false
            }

        })

        return check;

    }


    onJoinAddClick = (e, columnName, type, value) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (type === 'add') {
            selectedRecord['filterTableNewAdded'] = selectedRecord['filterTableNewAdded'] || []

            selectedRecord['filterTableNewAdded'][selectedRecord['filterTableNewAdded'].length] = {
                'oldTable': selectedRecord['filterTableOld'],
                'oldTableColumn': selectedRecord['filterTableOldColumn'],
                'newTable': selectedRecord['filterTableNew'],
                'newTableColumn': selectedRecord['filterTableNewColumn'],
                'index': selectedRecord['filterTableNewAdded'][selectedRecord['filterTableNewAdded'].length]
            }
            selectedRecord['filterTableJoin'] = selectedRecord['filterTableNewAdded'][selectedRecord['filterTableNewAdded'].length - 1]

        }
        selectedRecord[columnName] = value;
        selectedRecord['filterTableOld'] = {};
        selectedRecord['filterTableOldColumn'] = {};
        selectedRecord['filterTableNew'] = {};
        selectedRecord['filterTableNewColumn'] = {};


        this.setState({ selectedRecord, listOldTableColumn: [], listNewTableColumn: [] })
    }



    checkTableName(selectedRecord) {
        let check = true;

        const tableAlias = selectedRecord['joinTableAlias']
        const index = selectedRecord['stablename'].findIndex(x => x.label === tableAlias)
        if (index !== -1) {
            check = false
        }
        return check;
    }

    updateOldAliasToNewAlis(selectedRecord, value) {
        selectedRecord['filterTableNewAdded'].map((item) => {
            item.filterTableNew.label = value
            item.filterTableNew['item'].stabledisplayname = value
            item.filterTableNewColumn['item'].stabledisplayname = value
        })

        // selectedRecord['filterTableNewAdded'].map((item) => {
        //     item.filterTableNewColumn['item'].stabledisplayname = value
        // })

        return selectedRecord;
    }

    executeClick = (e) => {
        const selectedRecord = this.state.selectedRecord;
        if (this.state.filterType === 1) {
            if (this.checkFilter(selectedRecord['filterNew'])) {
                if (this.state.filterEdit) {
                    selectedRecord['filter'] = selectedRecord['filter'] || []
                    if (selectedRecord['filterNew'][0].filterTable.item.summarize) {
                        selectedRecord['filterSummarize'] = selectedRecord['filterNew']
                        selectedRecord['filterSummarizeJoinCondition'] = selectedRecord['filterSummarizeJoinCondition'] || {}
                        selectedRecord['filterSummarizeJoinCondition'] = selectedRecord['filterNewCondition'] || {}
                    } else {
                        selectedRecord['filter'][this.state.parentIndex] = selectedRecord['filterNew']
                        selectedRecord['filterJoinCondition'] = selectedRecord['filterJoinCondition'] || []
                        selectedRecord['filterJoinCondition'][this.state.parentIndex] = selectedRecord['filterNewCondition'] || {}
                    }

                    selectedRecord['filterNew'] = [];
                    selectedRecord['filterNewCondition'] = {};
                } else {
                    selectedRecord['filter'] = selectedRecord['filter'] || []
                    selectedRecord['filterSummarize'] = selectedRecord['filterSummarize'] || []
                    if (selectedRecord['filterNew'][0].filterTable.item.summarize) {
                        selectedRecord['filterSummarize'] = selectedRecord['filterNew']
                        selectedRecord['filterSummarizeJoinCondition'] = selectedRecord['filterSummarizeJoinCondition'] || {}
                        selectedRecord['filterSummarizeJoinCondition'] = selectedRecord['filterNewCondition'] || {}

                    } else {
                        selectedRecord['filter'][selectedRecord['filter'].length] = selectedRecord['filterNew']
                        selectedRecord['filterJoinCondition'] = selectedRecord['filterJoinCondition'] || []
                        selectedRecord['filterJoinCondition'][selectedRecord['filterJoinCondition'].length] = selectedRecord['filterNewCondition'] || {}
                    }


                    selectedRecord['filterNew'] = [];
                    selectedRecord['filterNewCondition'] = {};
                }
                this.setState({ selectedRecord, showFilter: false, filterEdit: false });
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASEFILLTHEVALUE" }))
            }
        }
        else if (this.state.filterType === 2) {

            if (this.checkJoin(selectedRecord['filterTableNewAdded'])) {
                if (this.joinTableCheck(selectedRecord)) {

                    // let avaliableColumns = this.state.avaliableColumns || []
                    // let avaliableColumnsForMultiSelect = this.state.avaliableColumnsForMultiSelect || []

                    // let constructData1 = this.state.listColumnForMultiSelect.filter(item => item.value === selectedRecord['filterTableNewAdded'][0].filterTableNew.value);
                    // constructData1.map((item, index) => {
                    //     avaliableColumnsForMultiSelect.push({
                    //         label: item.label, value: avaliableColumnsForMultiSelect.length, item: { ...item.item, parentTableIndex: 0 }
                    //         , options: item.options.map((i, index1) => {
                    //             return { label: i.label, value: index1, item: { ...i.item, parentTableIndex: selectedRecord['stablename'].length } }
                    //         })
                    //     })

                    // })


                    // if (selectedRecord['stablename'].findIndex(x => x.value === selectedRecord['filterTableJoin'].newTable.value) === -1) {

                    // this.props.tableList.filter(p => p.stable === selectedRecord['filterTableNewAdded'][0].filterTableNew.value).map((item, index) => {
                    //     avaliableColumns.push({ label: item.scolumndisplayname, value: avaliableColumns.length, item: { ...item, parentTableIndex: selectedRecord['stablename'].length } });

                    // })

                    // const newTable = selectedRecord['filterTableJoin'].newTable;
                    // newTable.value = selectedRecord['stablename'].length
                    //selectedRecord['stablename'][selectedRecord['stablename'].length] = { ...selectedRecord['filterTableNewAdded'][0].filterTableNew, value: selectedRecord['stablename'].length }
                    //selectedRecord['stablename'].push(newTable) 
                    //}

                    // let newList = selectedRecord['filterTableNewAdded'].map((item, index) => {
                    //     return {
                    //         newTable: item.filterTableNew,
                    //         oldTable: item.filterTableOld,
                    //         newTableColumn: item.filterTableNewColumn,
                    //         oldTableColumn: item.filterTableOldColumn,
                    //     }
                    // })
                    // const newTable =
                    //     selectedRecord['TableJoin'] = selectedRecord['TableJoin'] || [];
                    // selectedRecord['TableJoin'][selectedRecord['TableJoin'].length] = {
                    //     'Table': newList,
                    //     'TableJoining': selectedRecord["filterNewTableCondition"]
                    // };

                    // selectedRecord['filterTableJoin'] = {}
                    // selectedRecord['filterTableNewAdded'] = []
                    // selectedRecord['filterTableNewAddButton'] = false


                    // this.filterQueryFormation(selectedRecord, avaliableColumns);
                    // this.setState({ selectedRecord, showFilter: false,
                    //      avaliableColumns, avaliableColumnsForMultiSelect ,filterType:8});

                    this.setState({
                        selectedRecord,
                        filterType: 8
                    });

                } else {
                    toast.warn('Joining Table In All Condition Must Be Same Table')
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASEFILLTHEVALUE" }))
            }
        }
        else if (this.state.filterType === 3) {
            if (this.checkssg(selectedRecord['sortNew'], 1)) {
                selectedRecord['sort'] = selectedRecord['sort'] || []
                selectedRecord['sort'] = selectedRecord['sortNew']
                selectedRecord['sortNew'] = [];
                //  this.filterQueryFormation(selectedRecord, this.state.avaliableColumns);
                this.setState({ selectedRecord, showFilter: false });
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASEFILLTHEVALUE" }))
            }
        }
        else if (this.state.filterType === 4) {
            if (this.checkssg(selectedRecord['summarizeNew'], 2)) {
                selectedRecord['summarize'] = selectedRecord['summarize'] || []
                selectedRecord['summarize'] = selectedRecord['summarizeNew']
                selectedRecord['summarizeNew'] = [];
                //  this.filterQueryFormation(selectedRecord, this.state.avaliableColumns);
                this.setState({ selectedRecord, showFilter: false });
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASEFILLTHEVALUE" }))
            }
        }
        else if (this.state.filterType === 5) {
            if (this.checkssg(selectedRecord['groupNew'], 3)) {
                selectedRecord['group'] = selectedRecord['group'] || []
                selectedRecord['group'] = selectedRecord['groupNew']
                selectedRecord['groupNew'] = [];
                // this.filterQueryFormation(selectedRecord, this.state.avaliableColumns);
                this.setState({ selectedRecord, showFilter: false, filterTitle: "Add AliasName", });
            }
            else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_PLEASEFILLTHEVALUE" }))
            }
        } else if (this.state.filterType === 6) {
            if (selectedRecord['LimitNew']) {
                selectedRecord['Limit'] = selectedRecord['LimitNew']
                //  this.filterQueryFormation(selectedRecord, this.state.avaliableColumns);
                this.setState({
                    selectedRecord, showFilter: false
                });
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTERTHELIMIT" }))
            }
        }
        else if (this.state.filterType === 8) {

            if (selectedRecord['joinTableAlias'] && selectedRecord['joinTableAlias'] !== '') {

                if (this.checkTableName(selectedRecord)) {

                    const aliasTableName = selectedRecord['joinTableAlias']
                    // this.updateOldAliasToNewAlis(selectedRecord, selectedRecord['joinTableAlias'])
                    const val = []
                    const filterTableNewAdded = [...selectedRecord['filterTableNewAdded']];

                    filterTableNewAdded.map((item4) => {
                        const data = {
                            ...item4, filterTableNew: { ...item4.filterTableNew, label: aliasTableName, item: { ...item4.filterTableNew.item, stabledisplayname: aliasTableName } },
                            filterTableNewColumn: { ...item4.filterTableNewColumn, item: { ...item4.filterTableNewColumn.item, stabledisplayname: aliasTableName } }
                        }
                        // data.filterTableNew['label'] = selectedRecord['joinTableAlias']
                        // data.filterTableNew['item']['stabledisplayname'] = selectedRecord['joinTableAlias']
                        // data.filterTableNewColumn['item']['stabledisplayname'] = selectedRecord['joinTableAlias']

                        val.push({ ...data })
                    })

                    const avaliableColumns = this.state.avaliableColumns || []

                    const data1 = this.props.tableList.filter(p => p.stable === val[0].filterTableNew.value);
                    const selectedColumn = [...selectedRecord['scolumnname']]
                    data1 && data1.map((item, index) => {
                        const data = { label: item.stable +"_"+item.scolumndisplayname, value: avaliableColumns.length, item: { ...item, stabledisplayname: aliasTableName, parentTableIndex: selectedRecord['stablename'].length } }
                        avaliableColumns.push(data);
                        selectedColumn.push(data)
                    })
                    selectedRecord['scolumnname'] = [...selectedColumn]
                    const stablenameList = [...selectedRecord['stablename']]

                    stablenameList.push({ ...val[0].filterTableNew, value: stablenameList.length })
                    selectedRecord['stablename'] = stablenameList

                    const newList = val.map((item, index) => {
                        return {
                            newTable: { ...item.filterTableNew },
                            oldTable: { ...item.filterTableOld },
                            newTableColumn: { ...item.filterTableNewColumn },
                            oldTableColumn: { ...item.filterTableOldColumn },
                        }
                    })
                    const TableJoin = selectedRecord['TableJoin'] || [];
                    TableJoin.push({
                        'Table': newList,
                        'TableJoining': { ...selectedRecord["filterNewTableCondition"] }
                    })

                    selectedRecord['TableJoin'] = TableJoin

                    selectedRecord['filterTableJoin'] = {}
                    selectedRecord['filterTableNewAdded'] = []
                    selectedRecord['filterTableNewAddButton'] = false
                    selectedRecord['joinTableAlias'] = undefined
                    // this.filterQueryFormation(selectedRecord, avaliableColumns);
                    this.setState({
                        selectedRecord, showFilter: false,
                        avaliableColumns
                    });
                } else {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_ALIASNAMEALREADYEXISTS" }));
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTERTHEALIASNAME" }));
            }
        }
    }


    onInputJoinSelect = (e, index) => {
        const selectedRecord = this.state.selectedRecord || {}
        selectedRecord['filterTableJoin'] = selectedRecord['filterTableNewAdded'][index]
        this.setState({ selectedRecord })
    }

    modalDesign = () => {
        const selectedRecord = this.state.selectedRecord || {}
        switch (this.state.filterType) {
            case 1:
                return (
                    <form>
                        <section className={'modal-card-body'}>
                            {selectedRecord['filterNew'] && selectedRecord['filterNew'].map((item, index) => {
                                return <div className={'field has-addons filterheight'}>
                                    <div class="control is-expanded ">
                                        <div class="select is-fullwidth">
                                            <FormSelectSearch
                                                formGroupClassName="remove-floating-label-margin"
                                                formLabel={this.props.intl.formatMessage({ id: "IDS_TABLES" })}
                                                isSearchable={true}
                                                name={"tableName"}
                                                placeholder={this.props.intl.formatMessage({ id: "IDS_TABLES" })}
                                                showOption={true}
                                                options={
                                                    this.state.summarizeLoadOnly ?
                                                        [{
                                                            label: "summarization",
                                                            value: selectedRecord['stablename'].length, item: { summarize: "true" }
                                                        }] : this.state.summarizeLoad ?
                                                            [...selectedRecord['stablename'], {
                                                                label: "summarization",
                                                                value: selectedRecord['stablename'].length, item: { summarize: "true" }
                                                            }]
                                                            :
                                                            selectedRecord['stablename']
                                                }
                                                value={item["filterTable"] && item["filterTable"] || ""}
                                                onChange={value => this.onfilterChange(value, "filterTable", 'table', index)}
                                            ></FormSelectSearch>
                                        </div>
                                    </div>
                                    <div class="control is-expanded">
                                        <div class="select is-fullwidth">
                                            <FormSelectSearch
                                                formGroupClassName="remove-floating-label-margin"
                                                formLabel={this.props.intl.formatMessage({ id: "IDS_FIELDS" })}
                                                isSearchable={true}
                                                name={"filterColumn"}
                                                placeholder={this.props.intl.formatMessage({ id: "IDS_FIELDS" })}
                                                showOption={true}
                                                options={item["filterTable"] && item["filterTable"].item ? item["filterTable"].item.summarize ? this.state.summarizeCombo :
                                                    this.state.avaliableColumns.filter(x => x.item.parentTableIndex === item["filterTable"].value)
                                                    : []}
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
                                                    item["filterColumn"].item.summarize ? summarizeOperatorData :
                                                        item["filterColumn"].item.columndatatype === 'string' ?
                                                            stringOperatorData :
                                                            item["filterColumn"].item.columndatatype === 'numeric' ?
                                                                numericOperatorData
                                                                : item["filterColumn"].item.columndatatype === 'date' ?
                                                                    dateConditionData
                                                                    : stringOperatorData : ""}

                                                value={item["filterCondition"] !== undefined ? item["filterCondition"] : ""}
                                                onChange={value => this.onfilterChange(value, "filterCondition", 'condition', index)}
                                            ></FormSelectSearch>
                                        </div>
                                    </div>
                                    {(item["filterCondition"] && item["filterCondition"].value) ?
                                        (item["filterCondition"].value === 'IN' ||
                                            item["filterCondition"].value === '=' ||
                                            item["filterCondition"].value === '!=' ||
                                            item["filterCondition"].value === '<' ||
                                            item["filterCondition"].value === '>' ||
                                            item["filterCondition"].value === '>=' ||
                                            item["filterCondition"].value === '<=' ||
                                            (item.filterColumn.item.columndatatype === 'date'
                                                && item["filterCondition"].value === 'NOT')

                                        ) ?
                                            <div class="control is-expanded">
                                                <div class="select is-fullwidth">
                                                    <FormSelectSearch
                                                        formGroupClassName="remove-floating-label-margin"
                                                        formLabel={this.props.intl.formatMessage({ id: "IDS_PARAMETERTYPE" })}
                                                        isSearchable={true}
                                                        name={"sviewname"}
                                                        placeholder={this.props.intl.formatMessage({ id: "IDS_PARAMETERTYPE" })}
                                                        showOption={true}
                                                        options={[{ label: 'Pre-Defined Values', value: 2 },
                                                        { label: 'Runtime Parameter', value: 1 }
                                                        ]}
                                                        value={item["filterValueType"] !== undefined ? item["filterValueType"] : ""}
                                                        onChange={value => this.onfilterChange(value, "filterValueType", 'valueType', index)}
                                                    />
                                                </div>
                                            </div>
                                            : ""
                                        : ""}

                                    <div className={"control "}>
                                        {(item["filterCondition"] && item["filterCondition"].value
                                            && item["filterColumn"]) ?
                                            (item["filterValueType"] && item["filterValueType"].value
                                                && item["filterValueType"].value === 2) ?
                                                item["filterColumn"].item.summarize ?
                                                    <FormNumericInput
                                                        name={"filterValue"}
                                                        label={this.props.intl.formatMessage({ id: "IDS_VALUE" })}
                                                        type="number"
                                                        value={item["filterValue"]}
                                                        placeholder={this.props.intl.formatMessage({ id: "IDS_VALUE" })}
                                                        strict={true}
                                                        // min={0}
                                                        //max={99999999.99}
                                                        maxLength={10}
                                                        onChange={(value) => this.onFilterNumericInputChange(value, "filterValue", index)}
                                                        noStyle={true}
                                                        //precision={2}
                                                        //isMandatory={true}
                                                        className="form-control"
                                                        errors="Please provide a valid number."
                                                    />
                                                    :
                                                    item["filterColumn"].item.columndatatype === 'string' ?
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
                                                        item["filterColumn"].item.columndatatype === 'numeric' ?
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
                                                            : item["filterColumn"].item.columndatatype === 'date' ?
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
                                            : ""

                                        }
                                    </div>
                                    <div className={"control"}>
                                        {selectedRecord['filterNew'].length > 1 &&
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
                            <div className={'buttons is-right'}>
                                <Button className={'button is-light is-info is-small'}
                                    onClick={(e) => this.onMoreClick(e, this.state.filterType)} type="button" tabindex="0">

                                    <span className={"icon"}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </span>
                                    <span>{this.props.intl.formatMessage({ id: "IDS_ADDMORE" })}</span>
                                </Button>
                            </div>
                            {selectedRecord['filterNew'].length > 1 || (selectedRecord['filter'] && selectedRecord['filter'].length > 0) ?
                                <div className={'field has-text-centered'}>
                                    {/* <div className={'select is-fullwidth'}> */}
                                    <Row style={{ "justify-content": "space-around" }}>
                                        <Col md={4}>
                                            <FormSelectSearch
                                                formGroupClassName="remove-floating-label-margin"
                                                formLabel={this.props.intl.formatMessage({ id: "IDS_JOINCONDITION" })}
                                                isSearchable={true}
                                                name={"tableName"}
                                                placeholder={this.props.intl.formatMessage({ id: "IDS_JOINCONDITION" })}
                                                showOption={true}
                                                options={joinCondition}
                                                value={selectedRecord["filterNewCondition"] && selectedRecord["filterNewCondition"] || ""}
                                                onChange={value => this.onfilterChange(value, "filterNewCondition", 'joinCondition')}
                                            ></FormSelectSearch>
                                        </Col>

                                    </Row>
                                    {/* </div> */}
                                </div>
                                : ""}
                        </section>
                    </form >

                )
                break;
            case 2:
                return (
                    <form>
                        <section className={'modal-card-body'}>
                            {selectedRecord['filterTableNewAdded']
                                && selectedRecord['filterTableNewAdded'].map((item, index) => {
                                    return <div className={'field has-addons my-6'}>
                                        <div class="control is-expanded">
                                            <div class="select is-fullwidth">
                                                <FormSelectSearch
                                                    formGroupClassName="remove-floating-label-margin"
                                                    formLabel={this.props.intl.formatMessage({ id: "IDS_TABLES" })}
                                                    isSearchable={true}
                                                    name={"tableName"}
                                                    placeholder={this.props.intl.formatMessage({ id: "IDS_TABLES" })}
                                                    showOption={true}
                                                    options={index === 0 ? selectedRecord['stablename']
                                                        && selectedRecord['stablename'] : [{ ...selectedRecord['filterTableNewAdded'][0]["filterTableOld"] }]}
                                                    value={item["filterTableOld"] && item["filterTableOld"] || ""}
                                                    onChange={value => this.onJoinChange(value, "filterTableOld", 'oldtable', index)}
                                                ></FormSelectSearch>
                                            </div>
                                        </div>
                                        <div class="control is-expanded">
                                            <div class="select is-fullwidth">
                                                <FormSelectSearch
                                                    formGroupClassName="remove-floating-label-margin"
                                                    formLabel={this.props.intl.formatMessage({ id: "IDS_FIELDS" })}
                                                    isSearchable={true}
                                                    name={"filterColumn"}
                                                    placeholder={this.props.intl.formatMessage({ id: "IDS_FIELDS" })}
                                                    showOption={true}
                                                    options={this.state.listOldTableColumn || []}
                                                    value={item["filterTableOldColumn"] && item["filterTableOldColumn"] || ""}
                                                    onChange={value => this.onJoinChange(value, "filterTableOldColumn", 'oldcolumn', index)}
                                                ></FormSelectSearch>
                                            </div>
                                        </div>
                                        <strong className={'mx-3 is-flex is-align-items-center'}>
                                            {"&"}
                                        </strong>
                                        <div class="control is-expanded">
                                            <div class="select is-fullwidth">
                                                <FormSelectSearch
                                                    formGroupClassName="remove-floating-label-margin"
                                                    formLabel={this.props.intl.formatMessage({ id: "IDS_JOINSTABLE" })}
                                                    isSearchable={true}
                                                    name={"filterColumn"}
                                                    placeholder={this.props.intl.formatMessage({ id: "IDS_JOINSTABLE" })}
                                                    showOption={true}
                                                    options={index === 0 ? this.state.listTables || [] : [{ ...selectedRecord['filterTableNewAdded'][0]["filterTableNew"] }]}
                                                    value={item["filterTableNew"] && item["filterTableNew"] || ""}
                                                    onChange={value => this.onJoinChange(value, "filterTableNew", 'newtable', index)}
                                                ></FormSelectSearch>
                                            </div>
                                        </div>
                                        <div class="control is-expanded">
                                            <div class="select is-fullwidth">
                                                <FormSelectSearch
                                                    formGroupClassName="remove-floating-label-margin"
                                                    formLabel={this.props.intl.formatMessage({ id: "IDS_JOINTABLEFIELDS" })}
                                                    isSearchable={true}
                                                    name={"filterColumn"}
                                                    placeholder={this.props.intl.formatMessage({ id: "IDS_JOINTABLEFIELDS" })}
                                                    showOption={true}
                                                    options={this.state.listNewTableColumn || []}
                                                    value={item["filterTableNewColumn"] && item["filterTableNewColumn"] || ""}
                                                    onChange={value => this.onJoinChange(value, "filterTableNewColumn", 'newcolumn', index)}
                                                ></FormSelectSearch>
                                            </div>
                                        </div>
                                        <div className={"control"}>
                                            {selectedRecord['filterTableNewAdded'].length > 1 &&
                                                <Button className={"button is-light is-danger"}
                                                    onClick={(e) => this.onJoinChildDelete(e, index)}
                                                    type="button" tabindex="0">
                                                    <span className={"icon"}>
                                                        <FontAwesomeIcon icon={faMinus} />
                                                    </span>
                                                </Button>
                                            }
                                        </div>
                                    </div>
                                })
                            }
                            <div className={'buttons is-right'}>
                                <Button className={'button is-light is-info is-small'}
                                    onClick={(e) => this.onMoreClick(e, this.state.filterType)} type="button" tabindex="0">

                                    <span className={"icon"}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </span>
                                    <span>{this.props.intl.formatMessage({ id: "IDS_ADDMORE" })}</span>
                                </Button>
                            </div>
                            < div className={'field has-text-centered'} >
                                <Row style={{ "justify-content": "space-around" }}>
                                    <Col md={4}>
                                        <FormSelectSearch
                                            formGroupClassName="remove-floating-label-margin"
                                            // formLabel={this.props.intl.formatMessage({ id: "IDS_JOINCONDITION" })}
                                            isSearchable={true}
                                            name={"tableName"}
                                            placeholder={this.props.intl.formatMessage({ id: "IDS_JOINCONDITION" })}
                                            showOption={true}
                                            options={joinConditionData}
                                            value={selectedRecord["filterNewTableCondition"] && selectedRecord["filterNewTableCondition"] || ""}
                                            onChange={value => this.onJoinChange(value, "filterNewTableCondition", 'joinTableCondition')}
                                        ></FormSelectSearch>
                                    </Col>

                                </Row>
                            </div>
                        </section>
                    </form >

                )
                break;
            case 3:
                return (
                    <form>
                        <section className={'modal-card-body'}>

                            {selectedRecord['sortNew'] && selectedRecord['sortNew'].map((item, index) => {
                                return <div className={'field has-addons'}>
                                    <div class="control is-expanded">
                                        <div class="select is-fullwidth">
                                            <FormSelectSearch
                                                formGroupClassName="remove-floating-label-margin"
                                                formLabel={this.props.intl.formatMessage({ id: "IDS_TABLES" })}
                                                isSearchable={true}
                                                name={"tableName"}
                                                placeholder={this.props.intl.formatMessage({ id: "IDS_TABLES" })}
                                                showOption={true}
                                                options={selectedRecord['stablename'] && selectedRecord['stablename']}
                                                // options={constructOptionList(this.state.selectedRecord['stablename']
                                                //     && this.state.selectedRecord['stablename'], 'tableName', 'stabledisplayname').get("OptionList") || []}
                                                value={item["sortTable"] && item["sortTable"] || ""}
                                                onChange={value => this.onSortChange(value, "sortTable", 'table', index)}
                                            ></FormSelectSearch>
                                        </div>
                                    </div>
                                    <div class="control is-expanded">
                                        <div class="select is-fullwidth">
                                            <FormSelectSearch
                                                formGroupClassName="remove-floating-label-margin"
                                                formLabel={this.props.intl.formatMessage({ id: "IDS_FIELDS" })}
                                                isSearchable={true}
                                                name={"sortColumn"}
                                                placeholder={this.props.intl.formatMessage({ id: "IDS_FIELDS" })}
                                                showOption={true}
                                                options={item["sortTable"] &&
                                                    this.state.avaliableColumns.filter(x => x.item.parentTableIndex === item["sortTable"].value)
                                                    || []}
                                                value={item["sortColumn"] !== undefined ? item["sortColumn"] : ""}
                                                onChange={value => this.onSortChange(value, "sortColumn", 'column', index)}
                                            ></FormSelectSearch>
                                        </div>
                                    </div>
                                    <div class="control is-expanded">
                                        <div class="select is-fullwidth">
                                            <FormSelectSearch
                                                formGroupClassName="remove-floating-label-margin"
                                                formLabel={this.props.intl.formatMessage({ id: "IDS_CONDITION" })}
                                                isSearchable={true}
                                                name={"sortCondition"}
                                                placeholder={this.props.intl.formatMessage({ id: "IDS_CONDITION" })}
                                                showOption={true}
                                                options={orderByList}
                                                value={item["sortCondition"] !== undefined ? item["sortCondition"] : ""}
                                                onChange={value => this.onSortChange(value, "sortCondition", 'condition', index)}
                                            ></FormSelectSearch>
                                        </div>
                                    </div>
                                    {selectedRecord['sortNew'].length > 1 &&
                                        <div className={"control"}>
                                            <button className={"button is-light is-danger"} onClick={(e) => this.onSortModalDelete(e, index)} type="button" tabindex="0">
                                                <span className={"icon"}>
                                                    {/* <i className={"fas fa-minus"} aria-hidden="true">
                                                    </i> */}
                                                    <FontAwesomeIcon icon={faMinus} />
                                                </span>
                                            </button>
                                        </div>

                                    }
                                </div>
                            })}
                            <div className={'buttons is-right'}>
                                <button className={'button is-light is-info is-small'} onClick={(e) => this.onMoreClick(e, this.state.filterType)} type="button" tabindex="0">

                                    <span className={"icon"}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </span>
                                    <span>{this.props.intl.formatMessage({ id: "IDS_ADDMORE" })}</span>
                                </button>
                            </div>
                        </section>
                    </form>
                )
                break;
            case 4:
                return (<form>
                    <section className={'modal-card-body'}>

                        {selectedRecord['summarizeNew'] && selectedRecord['summarizeNew'].map((item, index) => {
                            return <div className={'field has-addons'}>
                                <div class="control is-expanded">
                                    <div class="select is-fullwidth">
                                        <FormSelectSearch
                                            formGroupClassName="remove-floating-label-margin"
                                            formLabel={this.props.intl.formatMessage({ id: "IDS_TABLES" })}
                                            isSearchable={true}
                                            name={"tableName"}
                                            placeholder={this.props.intl.formatMessage({ id: "IDS_TABLES" })}
                                            showOption={true}
                                            options={selectedRecord['stablename'] && selectedRecord['stablename']}
                                            // options={constructOptionList(this.state.selectedRecord['stablename']
                                            //     && this.state.selectedRecord['stablename'], 'tableName', 'stabledisplayname').get("OptionList") || []}
                                            value={item["summarizeTable"] && item["summarizeTable"] || ""}
                                            onChange={value => this.onSummarizeChange(value, "summarizeTable", 'table', index)}
                                        ></FormSelectSearch>
                                    </div>
                                </div>
                                <div class="control is-expanded">
                                    <div class="select is-fullwidth">
                                        <FormSelectSearch
                                            formGroupClassName="remove-floating-label-margin"
                                            formLabel={this.props.intl.formatMessage({ id: "IDS_FIELDS" })}
                                            isSearchable={true}
                                            name={"summarizeColumn"}
                                            placeholder={this.props.intl.formatMessage({ id: "IDS_FIELDS" })}
                                            showOption={true}
                                            options={item["summarizeTable"] &&
                                                this.state.avaliableColumns.filter(x => x.item.parentTableIndex === item["summarizeTable"].value)
                                                || []}
                                            value={item["summarizeColumn"] !== undefined ? item["summarizeColumn"] : ""}
                                            onChange={value => this.onSummarizeChange(value, "summarizeColumn", 'column', index)}
                                        ></FormSelectSearch>
                                    </div>
                                </div>
                                <div class="control is-expanded">
                                    <div class="select is-fullwidth">
                                        <FormSelectSearch
                                            formGroupClassName="remove-floating-label-margin"
                                            formLabel={this.props.intl.formatMessage({ id: "IDS_CONDITION" })}
                                            isSearchable={true}
                                            name={"summarizeCondition"}
                                            placeholder={this.props.intl.formatMessage({ id: "IDS_CONDITION" })}
                                            showOption={true}
                                            options={aggregateFunction}
                                            value={item["summarizeCondition"] !== undefined ? item["summarizeCondition"] : ""}
                                            onChange={value => this.onSummarizeChange(value, "summarizeCondition", 'condition', index)}
                                        ></FormSelectSearch>
                                    </div>
                                </div>
                                {selectedRecord['summarizeNew'].length > 1 &&
                                    <div className={"control"}>
                                        <button className={"button is-light is-danger"} onClick={(e) => this.onSummarizeModalDelete(e, index)} type="button" tabindex="0">
                                            <span className={"icon"}>
                                                {/* <i className={"fas fa-minus"} aria-hidden="true">
                                                </i> */}
                                                <FontAwesomeIcon icon={faMinus} />
                                            </span>
                                        </button>
                                    </div>

                                }
                            </div>
                        })}


                        <div className={'buttons is-right'}>
                            <Button className={'button is-light is-info is-small'} onClick={(e) => this.onMoreClick(e, this.state.filterType)} type="button" tabindex="0">

                                <span className={"icon"}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </span>
                                <span>{this.props.intl.formatMessage({ id: "IDS_ADDMORE" })}</span>
                            </Button>
                        </div>
                    </section>
                </form>
                )
                break;
            case 5:
                return (<form>
                    <section className={'modal-card-body'}>

                        {selectedRecord['groupNew'] && selectedRecord['groupNew'].map((item, index) => {
                            return <div className={'field has-addons'}>
                                <div class="control is-expanded">
                                    <div class="select is-fullwidth">
                                        <FormSelectSearch
                                            formGroupClassName="remove-floating-label-margin"
                                            formLabel={this.props.intl.formatMessage({ id: "IDS_TABLES" })}
                                            isSearchable={true}
                                            name={"tableName"}
                                            placeholder={this.props.intl.formatMessage({ id: "IDS_TABLES" })}
                                            showOption={true}
                                            options={selectedRecord['stablename'] && selectedRecord['stablename']}
                                            // options={constructOptionList(this.state.selectedRecord['stablename']
                                            //     && this.state.selectedRecord['stablename'], 'tableName', 'stabledisplayname').get("OptionList") || []}
                                            value={item["groupTable"] && item["groupTable"] || ""}
                                            onChange={value => this.onGroupChange(value, "groupTable", 'table', index)}
                                        ></FormSelectSearch>
                                    </div>
                                </div>
                                <div class="control is-expanded">
                                    <div class="select is-fullwidth">
                                        <FormSelectSearch
                                            formGroupClassName="remove-floating-label-margin"
                                            formLabel={this.props.intl.formatMessage({ id: "IDS_FIELDS" })}
                                            isSearchable={true}
                                            name={"groupColumn"}
                                            placeholder={this.props.intl.formatMessage({ id: "IDS_FIELDS" })}
                                            showOption={true}
                                            options={item["groupTable"] &&
                                                this.state.avaliableColumns.filter(x => x.item.parentTableIndex === item["groupTable"].value)
                                                || []}
                                            value={item["groupColumn"] !== undefined ? item["groupColumn"] : ""}
                                            onChange={value => this.onGroupChange(value, "groupColumn", 'column', index)}
                                        ></FormSelectSearch>
                                    </div>
                                </div>
                                {selectedRecord['groupNew'].length > 1 &&
                                    <div className={"control"}>
                                        <button className={"button is-light is-danger"} onClick={(e) => this.onGroupModalDelete(e, index)} type="button" tabindex="0">
                                            <span className={"icon"}>
                                                <FontAwesomeIcon icon={faMinus} />
                                            </span>
                                        </button>
                                    </div>

                                }
                            </div>
                        })}


                        <div className={'buttons is-right'}>
                            <button className={'button is-light is-info is-small'} onClick={(e) => this.onMoreClick(e, this.state.filterType)} type="button" tabindex="0">

                                <span className={"icon"}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </span>
                                <span>{this.props.intl.formatMessage({ id: "IDS_ADDMORE" })}</span>
                            </button>
                        </div>
                    </section>
                </form>
                )
                break;
            case 6:
                return <Row>
                    <Col md={3}>
                        {"Enter the Limit"}
                    </Col>
                    <Col md={6}>
                        <FormNumericInput
                            name={"LimitNew"}
                            label={this.props.intl.formatMessage({ id: "IDS_LIMIT" })}
                            type="number"
                            value={selectedRecord["LimitNew"] && selectedRecord["LimitNew"]}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_LIMIT" })}
                            strict={true}
                            min={0}
                            maxLength={10}
                            onChange={(value) => this.onNumericLimitChange(value, "LimitNew")}
                            noStyle={true}
                            //precision={2}
                            isMandatory={true}
                            className="form-control"
                            errors="Please provide a valid number."
                        />
                    </Col>
                </Row>
                break;
            case 8:
                return <Row>
                    <Col md={3}>
                        {/* <FormInput
                            //label={this.props.intl.formatMessage({ id: "IDS_VALUE" })}
                            name="filterValue"
                            type="text"
                          //  onChange={(event) => this.onFilterInputOnChange(event, index)}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_VALUE" })}
                            value={"Alias Name For " + this.state.selectedRecord['filterTableNewAdded'][0].filterTableNew.label}
                            isMandatory={true}
                            required={true}
                            maxLength={100}
                            disabled={true}
                        /> */}
                        {"Alias Name For \"" + selectedRecord['filterTableNewAdded'][0].filterTableNew.label + "\""}
                    </Col>
                    <Col md={6}>
                        <FormInput
                            label={this.props.intl.formatMessage({ id: "IDS_VALUE" })}
                            name="joinTableAlias"
                            type="text"
                            onChange={(event) => this.onjoinAliasName(event)}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_VALUE" })}
                            value={selectedRecord["joinTableAlias"] ? selectedRecord["joinTableAlias"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={100}
                        />
                    </Col>
                </Row>
        }

    }

    filterQueryFormation = (selectedRecord, avaliableColumns) => {
        let str = "";
        str = "SELECT \n";
        if ((selectedRecord.summarize &&
            selectedRecord.summarize.length > 0)
            || (selectedRecord.group && selectedRecord.group.length > 0)) {
            if (selectedRecord.group && selectedRecord.group.length > 0) {
                selectedRecord.group.map((item, index) => {
                    if (selectedRecord.group.length - 1 !== index) {
                        str = str + (item.groupColumn.item.isjsoncolumn ?
                            item.groupColumn.item.ismultilingual ?
                                " \"" + item.groupTable.label + "\"." + item.groupColumn.item.jsoncolumnname + "->'" + item.groupColumn.item.scolumn + "'->><@" + item.groupColumn.item.parametername + "@> " + "\"" + item.groupColumn.item.scolumndisplayname + "\","
                                : " \"" + item.groupTable.label + "\"." + item.groupColumn.item.jsoncolumnname + "->>'" + item.groupColumn.item.scolumn + "' \"" + item.groupColumn.item.scolumndisplayname + "\","
                            : " \"" + item.groupTable.label + "\".\"" + item.groupColumn.item.scolumn + "\" \"" + item.groupColumn.item.scolumndisplayname + "\",\n")

                    } else {
                        str = str + (item.groupColumn.item.isjsoncolumn ?
                            item.groupColumn.item.ismultilingual ?
                                " \"" + item.groupTable.label + "\"." + item.groupColumn.item.jsoncolumnname + "->'" + item.groupColumn.item.scolumn + "'->><@" + item.groupColumn.item.parametername + "@> " + "\"" + item.groupColumn.item.scolumndisplayname + "\""
                                : " \"" + item.groupTable.label + "\"." + item.groupColumn.item.jsoncolumnname + "->>'" + item.groupColumn.item.scolumn + "' \"" + item.groupColumn.item.scolumndisplayname + "\""
                            : " \"" + item.groupTable.label + "\".\"" + item.groupColumn.item.scolumn + "\" \"" + item.groupColumn.item.scolumndisplayname + "\"")

                        //  str = str + " \"" + item.groupTable.label + "\".\"" + item.groupColumn.item.scolumn + "\""
                    }
                })

            }

            if (selectedRecord.summarize && selectedRecord.summarize.length > 0) {
                if (selectedRecord.group && selectedRecord.group.length > 0)
                    str = str + ',\n';

                selectedRecord.summarize.map((item, index) => {
                    if (selectedRecord.summarize.length - 1 !== index) {
                        if (item.summarizeCondition.value === "COUNT") {

                            str = str + item.summarizeCondition.value + "( " + (item.summarizeColumn.item.isjsoncolumn ?
                                item.summarizeColumn.item.ismultilingual ?
                                    " \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.jsoncolumnname + "->'" + item.summarizeColumn.item.scolumn + "'->><@" + item.summarizeColumn.item.parametername + "@> "
                                    : " \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.jsoncolumnname + "->>'" + item.summarizeColumn.item.scolumn + "' \""
                                : " \"" + item.summarizeTable.label + "\".\"" + item.summarizeColumn.item.scolumn + "\"") + " ) AS \"" + item.summarizeTable.label + item.summarizeColumn.item.scolumndisplayname + "Count\",\n";

                        } else if (item.summarizeCondition.value === "DISTINCT") {
                            str = str + " COUNT( " + item.summarizeCondition.value + " " + (item.summarizeColumn.item.isjsoncolumn ?
                                item.summarizeColumn.item.ismultilingual ?
                                    " \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.jsoncolumnname + "->'" + item.summarizeColumn.item.scolumn + "'->><@" + item.summarizeColumn.item.parametername + "@> "
                                    : " \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.jsoncolumnname + "->>'" + item.summarizeColumn.item.scolumn + "' \""
                                : " \"" + item.summarizeTable.label + "\".\"" + item.summarizeColumn.item.scolumn + "\"") + " ) AS \"" + item.summarizeTable.label + item.summarizeColumn.item.scolumndisplayname + "CountDistinct\",\n";
                        }
                    } else {
                        if (item.summarizeCondition.value === "COUNT") {
                            str = str + item.summarizeCondition.value + "( " + (item.summarizeColumn.item.isjsoncolumn ?
                                item.summarizeColumn.item.ismultilingual ?
                                    " \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.jsoncolumnname + "->'" + item.summarizeColumn.item.scolumn + "'->><@" + item.summarizeColumn.item.parametername + "@> "
                                    : " \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.jsoncolumnname + "->>'" + item.summarizeColumn.item.scolumn + "' \""
                                : " \"" + item.summarizeTable.label + "\".\"" + item.summarizeColumn.item.scolumn + "\"") + " ) AS \"" + item.summarizeTable.label + item.summarizeColumn.item.scolumndisplayname + "Count\"";
                        } else if (item.summarizeCondition.value === "DISTINCT") {
                            str = str + " COUNT( " + item.summarizeCondition.value + " " + (item.summarizeColumn.item.isjsoncolumn ?
                                item.summarizeColumn.item.ismultilingual ?
                                    " \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.jsoncolumnname + "->'" + item.summarizeColumn.item.scolumn + "'->><@" + item.summarizeColumn.item.parametername + "@> "
                                    : " \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.jsoncolumnname + "->>'" + item.summarizeColumn.item.scolumn + "' \""
                                : " \"" + item.summarizeTable.label + "\".\"" + item.summarizeColumn.item.scolumn + "\"") + " ) AS \"" + item.summarizeTable.label + item.summarizeColumn.item.scolumndisplayname + "CountDistinct\"";
                        }
                    }

                })
            }
        }
        else {
            // if (selectedRecord.scolumnname.length !== avaliableColumns.length) {
            selectedRecord.scolumnname.map((item, index) => {
                if (selectedRecord.scolumnname.length - 1 !== index) {
                    str = str + (item.item.isjsoncolumn ?
                        item.item.ismultilingual ?
                            " \"" + item.item.stabledisplayname + "\"." + item.item.jsoncolumnname + "->'" + item.item.scolumn + "'->><@" + item.item.parametername + "@> " + "\"" + item.label + "\","
                            : " \"" + item.item.stabledisplayname + "\"." + item.item.jsoncolumnname + "->>'" + item.item.scolumn + "' \"" + item.label + "\","
                        : " \"" + item.item.stabledisplayname + "\".\"" + item.item.scolumn + "\" \"" + item.label + "\",\n")
                } else {
                    str = str + (item.item.isjsoncolumn ?
                        item.item.ismultilingual ?
                            " \"" + item.item.stabledisplayname + "\"." + item.item.jsoncolumnname + "->'" + item.item.scolumn + "'->><@" + item.item.parametername + "@> " + "\"" + item.label + "\""
                            : " \"" + item.item.stabledisplayname + "\"." + item.item.jsoncolumnname + "->>'" + item.item.scolumn + "' \"" + item.label + "\""
                        : " \"" + item.item.stabledisplayname + "\".\"" + item.item.scolumn + "\" \"" + item.label + "\"")
                }
            })
            // } else {
            //     str = str + " * ";
            // }
        }
        str = str + "\nFROM\n"

        if (selectedRecord['stablename'].length === 1) {
            selectedRecord['stablename'].map(item => {
                str = str + " " + item.item.tableName + " \"" + item.label + "\"\n"
            })
        } else {

            selectedRecord['TableJoin'].map((item, index) => {
                if (index === 0) {
                    str = str + selectedRecord['stablename'][index].item.tableName + " \"" + selectedRecord['stablename'][index].label + "\"\n " + item.TableJoining.value + " "
                    item.Table.map((item1, index1) => {

                        if (index1 === 0) {
                            str = str + item1.newTable.item.tableName + " \"" + item1.newTable.label + "\" ON " +
                                "\"" + item1.oldTable.label + "\"." + (item1.oldTableColumn.item.isjsoncolumn ?
                                    item1.oldTableColumn.item.ismultilingual ?
                                        item1.oldTableColumn.item.jsoncolumnname + "->'" + item1.oldTableColumn.item.scolumn + "'->><@" + item1.oldTableColumn.item.parametername + "@> "
                                        : item1.oldTableColumn.item.jsoncolumnname + "->>'" + item1.oldTableColumn.item.scolumn + "'"
                                    : "\"" + item1.oldTableColumn.item.scolumn + "\"") + "=\"" + item1.newTable.label + "\"." + (item1.newTableColumn.item.isjsoncolumn ?
                                        item1.newTableColumn.item.ismultilingual ?
                                            item1.newTableColumn.item.jsoncolumnname + "->'" + item1.newTableColumn.item.scolumn + "'->><@" + item1.newTableColumn.item.parametername + "@> "
                                            : item1.newTableColumn.item.jsoncolumnname + "->>'" + item1.newTableColumn.item.scolumn + "'"
                                        : "\"" + item1.newTableColumn.item.scolumn + "\"") + " \n"
                        } else {
                            str = str + " AND \"" + item1.oldTable.label + "\"." + (item1.oldTableColumn.item.isjsoncolumn ?
                                item1.oldTableColumn.item.ismultilingual ?
                                    item1.oldTableColumn.item.jsoncolumnname + "->'" + item1.oldTableColumn.item.scolumn + "'->><@" + item1.oldTableColumn.item.parametername + "@> "
                                    : item1.oldTableColumn.item.jsoncolumnname + "->>'" + item1.oldTableColumn.item.scolumn + "'"
                                : "\"" + item1.oldTableColumn.item.scolumn + "\"") + "=\"" + item1.newTable.label + "\"." + (item1.newTableColumn.item.isjsoncolumn ?
                                    item1.newTableColumn.item.ismultilingual ?
                                        item1.newTableColumn.item.jsoncolumnname + "->'" + item1.newTableColumn.item.scolumn + "'->><@" + item1.newTableColumn.item.parametername + "@> "
                                        : item1.newTableColumn.item.jsoncolumnname + "->>'" + item1.newTableColumn.item.scolumn + "'"
                                    : "\"" + item1.newTableColumn.item.scolumn + "\"") + " \n"
                        }
                    })
                } else {

                    str = str + item.TableJoining.value + " "

                    item.Table.map((item1, index1) => {
                        if (index1 === 0) {
                            str = str + item1.newTable.item.tableName + " \"" + item1.newTable.label + "\" ON " +
                                "\"" + item1.oldTable.label + "\"." + (item1.oldTableColumn.item.isjsoncolumn ?
                                    item1.oldTableColumn.item.ismultilingual ?
                                        item1.oldTableColumn.item.jsoncolumnname + "->'" + item1.oldTableColumn.item.scolumn + "'->><@" + item1.oldTableColumn.item.parametername + "@> "
                                        : item1.oldTableColumn.item.jsoncolumnname + "->>'" + item1.oldTableColumn.item.scolumn + "'"
                                    : "\"" + item1.oldTableColumn.item.scolumn + "\"") + "=\"" + item1.newTable.label + "\"." + (item1.newTableColumn.item.isjsoncolumn ?
                                        item1.newTableColumn.item.ismultilingual ?
                                            item1.newTableColumn.item.jsoncolumnname + "->'" + item1.newTableColumn.item.scolumn + "'->><@" + item1.newTableColumn.item.parametername + "@> "
                                            : item1.newTableColumn.item.jsoncolumnname + "->>'" + item1.newTableColumn.item.scolumn + "'"
                                        : "\"" + item1.newTableColumn.item.scolumn + "\"") + " \n"
                        } else {
                            str = str + " AND \"" + item1.oldTable.label + "\"." + (item1.oldTableColumn.item.isjsoncolumn ?
                                item1.oldTableColumn.item.ismultilingual ?
                                    item1.oldTableColumn.item.jsoncolumnname + "->'" + item1.oldTableColumn.item.scolumn + "'->><@" + item1.oldTableColumn.item.parametername + "@> "
                                    : item1.oldTableColumn.item.jsoncolumnname + "->>'" + item1.oldTableColumn.item.scolumn + "'"
                                : "\"" + item1.oldTableColumn.item.scolumn + "\"") + "=\"" + item1.newTable.label + "\"." + (item1.newTableColumn.item.isjsoncolumn ?
                                    item1.newTableColumn.item.ismultilingual ?
                                        item1.newTableColumn.item.jsoncolumnname + "->'" + item1.newTableColumn.item.scolumn + "'->><@" + item1.newTableColumn.item.parametername + "@> "
                                        : item1.newTableColumn.item.jsoncolumnname + "->>'" + item1.newTableColumn.item.scolumn + "'"
                                    : "\"" + item1.newTableColumn.item.scolumn + "\"") + " \n"
                        }
                    })
                }

            })
        }

        if (selectedRecord['filter'] && selectedRecord['filter'].length > 0)
            str = str + "\nWHERE\n"

        selectedRecord['filter'] && selectedRecord['filter'].map((item1, index1) => {
            str = str + " (\n ";

            item1.map((item, index) => {

                if (item.filterCondition.value === 'IN') {

                    str = str + "  \"" + item.filterTable.label + "\"." + (item.filterColumn.item.isjsoncolumn ?
                        item.filterColumn.item.ismultilingual ?
                            item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->><@" + item.filterColumn.item.parametername + "@> "
                            : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                        : "\"" + item.filterColumn.item.scolumn + "\"") + " " + item.filterCondition.value + " ('" + item.filterValue + "') "

                }
                else if (item.filterCondition.value === 'PRESENT') {

                    str = str + " NOT \"" + item.filterTable.label + "\"." + (item.filterColumn.item.isjsoncolumn ?
                        item.filterColumn.item.ismultilingual ?
                            item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->><@" + item.filterColumn.item.parametername + "@> "
                            : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                        : "\"" + item.filterColumn.item.scolumn + "\"") + " ='' "

                }
                else if (item.filterCondition.value === 'BLANK') {

                    str = str + "  \"" + item.filterTable.label + "\"." + (item.filterColumn.item.isjsoncolumn ?
                        item.filterColumn.item.ismultilingual ?
                            item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->><@" + item.filterColumn.item.parametername + "@> "
                            : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                        : "\"" + item.filterColumn.item.scolumn + "\"") + " ='' "

                }
                else if (item.filterCondition.value === 'NULL'
                    || item.filterCondition.value === 'NOT NULL') {

                    str = str + "  \"" + item.filterTable.label + "\"." + (item.filterColumn.item.isjsoncolumn ?
                        item.filterColumn.item.ismultilingual ?
                            item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->><@" + item.filterColumn.item.parametername + "@> "
                            : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                        : "\"" + item.filterColumn.item.scolumn + "\"") + " IS '" + item.filterCondition.value + "' "

                }
                else if (item.filterCondition.value === 'IS NULL') {

                    str = str + "  \"" + item.filterTable.label + "\"." + (item.filterColumn.item.isjsoncolumn ?
                        item.filterColumn.item.ismultilingual ?
                            item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->><@" + item.filterColumn.item.parametername + "@> "
                            : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                        : "\"" + item.filterColumn.item.scolumn + "\"") + " " + item.filterCondition.value + "' "

                }
                else if (item.filterCondition.value === 'STARTS WITH') {
                    str = str + "  \"" + item.filterTable.label + "\"." + (item.filterColumn.item.isjsoncolumn ?
                        item.filterColumn.item.ismultilingual ?
                            item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->><@" + item.filterColumn.item.parametername + "@> "
                            : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                        : "\"" + item.filterColumn.item.scolumn + "\"") + "ILIKE" + " '" + item.filterValue + "%' collate \"default\""
                }
                else if (item.filterCondition.value === 'ENDS WITH') {
                    str = str + "  \"" + item.filterTable.label + "\"." + (item.filterColumn.item.isjsoncolumn ?
                        item.filterColumn.item.ismultilingual ?
                            item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->><@" + item.filterColumn.item.parametername + "@> "
                            : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                        : "\"" + item.filterColumn.item.scolumn + "\"") + "ILIKE" + " '%" + item.filterValue + "' collate \"default\""
                }
                else if (item.filterCondition.value === 'CONTAINS') {
                    str = str + "  \"" + item.filterTable.label + "\"." + (item.filterColumn.item.isjsoncolumn ?
                        item.filterColumn.item.ismultilingual ?
                            item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->><@" + item.filterColumn.item.parametername + "@> "
                            : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                        : "\"" + item.filterColumn.item.scolumn + "\"") + "ILIKE" + " '" + item.filterValue + "%' collate \"default\""
                }
                else if (item.filterColumn.item.columndatatype === 'date' && (item.filterCondition.value === '=' || item.filterCondition.value === '<' || item.filterCondition.value === '>')) {
                    str = str + "  \"" + item.filterTable.label + "\"." + (item.filterColumn.item.isjsoncolumn ?
                        item.filterColumn.item.ismultilingual ?
                            item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->><@" + item.filterColumn.item.parametername + "@> "
                            : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                        : "\"" + item.filterColumn.item.scolumn + "\"") + " " + item.filterCondition.value + (item.filterValueType.value === 1 ? ("<#" + item.filterColumn.item.scolumn + "#>") : ("'" + convertDateTimetoStringDBFormat(item.filterValue, this.props.Login.userInfo) + "' "))
                }

                else if (item.filterColumn.item.columndatatype === 'date' && (item.filterCondition.value === 'NOT')) {
                    str = str + "(NOT \"" + item.filterTable.label + "\"." + (item.filterColumn.item.isjsoncolumn ?
                        item.filterColumn.item.ismultilingual ?
                            item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->><@" + item.filterColumn.item.parametername + "@> "
                            : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                        : "\"" + item.filterColumn.item.scolumn + "\"") + " = " + (item.filterValueType.value === 1 ? ("<#" + item.filterColumn.item.scolumn + "#>)") : ("'" + convertDateTimetoStringDBFormat(item.filterValue, this.props.Login.userInfo) + "')"))
                }
                else if (item.filterColumn.item.columndatatype === 'string' && (item.filterCondition.value === 'NOT')) {
                    str = str + "(NOT \"" + item.filterTable.label + "\"." + (item.filterColumn.item.isjsoncolumn ?
                        item.filterColumn.item.ismultilingual ?
                            item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->><@" + item.filterColumn.item.parametername + "@> "
                            : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                        : "\"" + item.filterColumn.item.scolumn + "\"") + " = " + (item.filterValueType.value === 1 ? ("<@" + item.filterColumn.item.scolumn + "@>)") : ("'" + item.filterValue + "')"))
                }
                else {
                    str = str + "  \"" + item.filterTable.label + "\"." + (item.filterColumn.item.isjsoncolumn ?
                        item.filterColumn.item.ismultilingual ?
                            item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->><@" + item.filterColumn.item.parametername + "@> "
                            : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                        : "\"" + item.filterColumn.item.scolumn + "\"") + " " + item.filterCondition.value + (item.filterValueType.value === 1 ?
                            ((item.filterColumn.item.columndatatype === 'date' ? "<#" : "<@") +
                                item.filterColumn.item.scolumn + (item.filterColumn.item.columndatatype === 'date' ? "#>" : "@>"))
                            : item.filterColumn.item.columndatatype==='string'?'':("'" + item.filterValue + "' "))
                }

                if (index !== selectedRecord['filter'][index1].length - 1) {
                    str = str + "\n   " + selectedRecord['filterJoinCondition'][index1].value + " ";
                }
            })

            str = str + "\n ) ";

            if (index1 !== selectedRecord['filter'].length - 1) {
                str = selectedRecord['filterJoinCondition'][index1 + 1] &&
                    str + "\n" + selectedRecord['filterJoinCondition'][index1 + 1].value + "\n ";
            }
        })

        if (selectedRecord.group && selectedRecord.group.length > 0) {
            str = str + "\nGROUP BY\n"
        }
        else if (selectedRecord.summarize && selectedRecord.summarize.length > 0 &&
            selectedRecord['sort'] && selectedRecord['sort'].length > 0) {
            str = str + "\nGROUP BY\n"
        }

        if ((selectedRecord.summarize && selectedRecord.summarize.length > 0
            || selectedRecord.group && selectedRecord.group.length > 0)
            && selectedRecord['sort'] && selectedRecord['sort'].length > 0) {


            let sortIndex = [];
            if (selectedRecord.group && selectedRecord.group.length > 0) {
                selectedRecord['group'] && selectedRecord['group'].map((item, index1) => {

                    if (selectedRecord['sort'].findIndex(x =>
                        (x.sortTable.label + x.sortColumn.item.scolumn)
                        === (item.groupTable.label + item.groupColumn.item.scolumn)) !== -1) {

                        sortIndex[index1] = selectedRecord['sort'].findIndex(x =>
                            (x.sortTable.label + x.sortColumn.item.scolumn)
                            === (item.groupTable.label + item.groupColumn.item.scolumn))
                    }

                    if (selectedRecord['group'].length - 1 !== index1) {
                        str = str + (item.groupColumn.item.isjsoncolumn ?
                            item.groupColumn.item.ismultilingual ?
                                " \"" + item.groupTable.label + "\"." + item.groupColumn.item.jsoncolumnname + "->'" + item.groupColumn.item.scolumn + "'->><@" + item.groupColumn.item.parametername + "@> ,"
                                : " \"" + item.groupTable.label + "\"." + item.groupColumn.item.jsoncolumnname + "->>'" + item.groupColumn.item.scolumn + "' ,"
                            : " \"" + item.groupTable.label + "\".\"" + item.groupColumn.item.scolumn + "\" ,\n")

                    } else {

                        str = str + (item.groupColumn.item.isjsoncolumn ?
                            item.groupColumn.item.ismultilingual ?
                                " \"" + item.groupTable.label + "\"." + item.groupColumn.item.jsoncolumnname + "->'" + item.groupColumn.item.scolumn + "'->><@" + item.groupColumn.item.parametername + "@> "
                                : " \"" + item.groupTable.label + "\"." + item.groupColumn.item.jsoncolumnname + "->>'" + item.groupColumn.item.scolumn + "' "
                            : " \"" + item.groupTable.label + "\".\"" + item.groupColumn.item.scolumn + "\" ")

                    }

                    // if (selectedRecord['group'].length - 1 !== index1) {
                    //     str = str + "  \"" + item.groupTable.label + "\"." + item.groupColumn.item.scolumn + ","
                    // } else {
                    //     str = str + "  \"" + item.groupTable.label + "\"." + item.groupColumn.item.scolumn
                    // }
                    // }
                })

                if (selectedRecord['sort'].length !== sortIndex.length)
                    str = str + " , \n"

                selectedRecord['sort'] && selectedRecord['sort'].map((item, index1) => {
                    if (sortIndex.findIndex(x => x === index1) === -1) {

                        if (selectedRecord['sort'].length - 1 !== index1) {

                            str = str + (item.sortColumn.item.isjsoncolumn ?
                                item.sortColumn.item.ismultilingual ?
                                    " \"" + item.sortTable.label + "\"." + item.sortColumn.item.jsoncolumnname + "->'" + item.sortColumn.item.scolumn + "'->><@" + item.sortColumn.item.parametername + "@> ,"
                                    : " \"" + item.sortTable.label + "\"." + item.sortColumn.item.jsoncolumnname + "->>'" + item.sortColumn.item.scolumn + "' ,"
                                : " \"" + item.sortTable.label + "\".\"" + item.sortColumn.item.scolumn + "\" ,\n")

                        } else {

                            str = str + (item.sortColumn.item.isjsoncolumn ?
                                item.sortColumn.item.ismultilingual ?
                                    " \"" + item.sortTable.label + "\"." + item.sortColumn.item.jsoncolumnname + "->'" + item.sortColumn.item.scolumn + "'->><@" + item.sortColumn.item.parametername + "@> "
                                    : " \"" + item.sortTable.label + "\"." + item.sortColumn.item.jsoncolumnname + "->>'" + item.sortColumn.item.scolumn + "' "
                                : " \"" + item.sortTable.label + "\".\"" + item.sortColumn.item.scolumn + "\" ")

                            //  str = str + " \"" + item.groupTable.label + "\".\"" + item.groupColumn.item.scolumn + "\""
                        }

                        // if (selectedRecord['sort'].length - 1 !== index1) {
                        //     str = str + "  \"" + item.sortTable.label + "\"." + item.sortColumn.item.scolumn + ","
                        // } else {
                        //     str = str + "  \"" + item.sortTable.label + "\"." + item.sortColumn.item.scolumn
                        // }
                    }
                })

            } else if (selectedRecord.summarize && selectedRecord.summarize.length > 0) {

                //summariesort
                // selectedRecord['summarize'] && selectedRecord['summarize'].map((item, index1) => {

                //     if (selectedRecord['sort'].findIndex(x =>
                //         (x.sortTable.label + x.sortColumn.item.scolumn)
                //         === (item.summarizeTable.label + item.summarizeColumn.item.scolumn)) !== -1) {

                //         sortIndex[index1] = selectedRecord['sort'].findIndex(x =>
                //             (x.sortTable.label + x.sortColumn.item.scolumn)
                //             === (item.summarizeTable.label + item.summarizeColumn.item.scolumn))
                //     }

                //     if (selectedRecord['summarize'].length - 1 !== index1) {
                //         str =  str + (item.summarizeColumn.item.isjsoncolumn?
                //         item.summarizeColumn.item.ismultilingual?
                //        " \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.jsoncolumnname+"->'"+item.summarizeColumn.item.scolumn+"'->><@"+item.summarizeColumn.item.parametername+"@> ,"
                //         :  " \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.jsoncolumnname+"->>'"+item.summarizeColumn.item.scolumn+"' ,"
                //         : " \"" + item.summarizeTable.label + "\".\"" + item.summarizeColumn.item.scolumn + "\" ,")

                //     } else {

                //         str =  str + (item.summarizeColumn.item.isjsoncolumn?
                //         item.summarizeColumn.item.ismultilingual?
                //        " \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.jsoncolumnname+"->'"+item.summarizeColumn.item.scolumn+"'->><@"+item.summarizeColumn.item.parametername+"@> "
                //         :  " \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.jsoncolumnname+"->>'"+item.summarizeColumn.item.scolumn+"' "
                //         : " \"" + item.summarizeTable.label + "\".\"" + item.summarizeColumn.item.scolumn + "\" ")

                //     }
                // })

                // if (selectedRecord['summarize'].length - 1 !== index1) {
                //     str = str + "  \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.scolumn + ","
                // } else {
                //     str = str + "  \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.scolumn
                // }
                // }


                if (selectedRecord['sort'].length !== sortIndex.length)
                    str = str + " , \n"

                selectedRecord['sort'] && selectedRecord['sort'].map((item, index1) => {
                    if (sortIndex.findIndex(x => x === index1) === -1) {

                        if (selectedRecord['sort'].length - 1 !== index1) {
                            str = str + (item.sortColumn.item.isjsoncolumn ?
                                item.sortColumn.item.ismultilingual ?
                                    " \"" + item.sortTable.label + "\"." + item.sortColumn.item.jsoncolumnname + "->'" + item.sortColumn.item.scolumn + "'->><@" + item.sortColumn.item.parametername + "@> ,"
                                    : " \"" + item.sortTable.label + "\"." + item.sortColumn.item.jsoncolumnname + "->>'" + item.sortColumn.item.scolumn + "' ,"
                                : " \"" + item.sortTable.label + "\".\"" + item.sortColumn.item.scolumn + "\" ,\n")

                        } else {

                            str = str + (item.sortColumn.item.isjsoncolumn ?
                                item.sortColumn.item.ismultilingual ?
                                    " \"" + item.sortTable.label + "\"." + item.sortColumn.item.jsoncolumnname + "->'" + item.sortColumn.item.scolumn + "'->><@" + item.sortColumn.item.parametername + "@> "
                                    : " \"" + item.sortTable.label + "\"." + item.sortColumn.item.jsoncolumnname + "->>'" + item.sortColumn.item.scolumn + "' "
                                : " \"" + item.sortTable.label + "\".\"" + item.sortColumn.item.scolumn + "\" ")
                        }
                    }
                })

            }

        }
        else if (selectedRecord.group && selectedRecord.group.length > 0) {

            selectedRecord['group'] && selectedRecord['group'].map((item, index1) => {
                if (selectedRecord['group'].length - 1 !== index1) {
                    str = str + (item.groupColumn.item.isjsoncolumn ?
                        item.groupColumn.item.ismultilingual ?
                            " \"" + item.groupTable.label + "\"." + item.groupColumn.item.jsoncolumnname + "->'" + item.groupColumn.item.scolumn + "'->><@" + item.groupColumn.item.parametername + "@> ,"
                            : " \"" + item.groupTable.label + "\"." + item.groupColumn.item.jsoncolumnname + "->>'" + item.groupColumn.item.scolumn + "' ,"
                        : " \"" + item.groupTable.label + "\".\"" + item.groupColumn.item.scolumn + "\" ,\n")

                } else {

                    str = str + (item.groupColumn.item.isjsoncolumn ?
                        item.groupColumn.item.ismultilingual ?
                            " \"" + item.groupTable.label + "\"." + item.groupColumn.item.jsoncolumnname + "->'" + item.groupColumn.item.scolumn + "'->><@" + item.groupColumn.item.parametername + "@> "
                            : " \"" + item.groupTable.label + "\"." + item.groupColumn.item.jsoncolumnname + "->>'" + item.groupColumn.item.scolumn + "' "
                        : " \"" + item.groupTable.label + "\".\"" + item.groupColumn.item.scolumn + "\" ")

                }
            })
        }

        if (selectedRecord['filterSummarize'] && selectedRecord['filterSummarize'].length > 0) {
            str = str + "\nHAVING\n"
        }

        selectedRecord['filterSummarize'] && selectedRecord['filterSummarize'].map((item, index) => {

            if (item.filterColumn.item.summarizeCondition.value === "COUNT") {

                str = str + item.filterColumn.item.summarizeCondition.value + "( " + (item.filterColumn.item.summarizeColumn.item.isjsoncolumn ?
                    item.filterColumn.item.summarizeColumn.item.ismultilingual ?
                        " \"" + item.filterColumn.item.summarizeTable.label + "\"." + item.filterColumn.item.filterColumn.item.summarizeColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.summarizeColumn.item.scolumn + "'->><@" + item.filterColumn.item.summarizeColumn.item.parametername + "@> "
                        : " \"" + item.filterColumn.item.summarizeTable.label + "\"." + item.filterColumn.item.summarizeColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.summarizeColumn.item.scolumn + "' \""
                    : " \"" + item.filterColumn.item.summarizeTable.label + "\".\"" + item.filterColumn.item.summarizeColumn.item.scolumn + "\"") + " ) " + item.filterCondition.value + " " + (item.filterValueType.value === 1 ? ("<@" + item.filterColumn.item.summarizeColumn.item.scolumn + "@>") : ("'" + item.filterValue + "' "));

            } else if (item.filterColumn.item.summarizeCondition.value === "DISTINCT") {
                str = str + " COUNT( " + item.filterColumn.item.summarizeCondition.value + " " + (item.filterColumn.item.summarizeColumn.item.isjsoncolumn ?
                    item.filterColumn.item.summarizeColumn.item.ismultilingual ?
                        " \"" + item.filterColumn.item.summarizeTable.label + "\"." + item.filterColumn.item.summarizeColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.summarizeColumn.item.scolumn + "'->><@" + item.filterColumn.item.summarizeColumn.item.parametername + "@> "
                        : " \"" + item.filterColumn.item.summarizeTable.label + "\"." + item.filterColumn.item.summarizeColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.summarizeColumn.item.scolumn + "' \""
                    : " \"" + item.filterColumn.item.summarizeTable.label + "\".\"" + item.filterColumn.item.summarizeColumn.item.scolumn + "\"") + " ) " + item.filterCondition.value + " " + (item.filterValueType.value === 1 ? ("<@" + item.filterColumn.item.summarizeColumn.item.scolumn + "@>") : ("'" + item.filterValue + "' "));
            }



            // if (item.filterColumn.item.summarizeCondition.value === "COUNT") {
            //     str = str + item.filterColumn.item.summarizeCondition.value + "( " + "\"" + item.filterColumn.item.summarizeTable.label + "\".\"" + item.filterColumn.item.summarizeColumn.item.scolumn + "\" ) " + item.filterCondition.value + " " + item.filterValue;
            // } else {
            //     str = str + "COUNT( " + item.filterColumn.item.summarizeCondition.value + " \"" + item.filterColumn.item.summarizeTable.label + "\".\"" + item.filterColumn.item.summarizeColumn.item.scolumn + "\" ) " + item.filterCondition.value + " " + item.filterValue;
            // }


            if (index !== selectedRecord['filterSummarize'].length - 1) {
                str = str + "\n " + selectedRecord['filterSummarizeJoinCondition'].value + "\n ";
            }
        })

        if (selectedRecord['sort'] && selectedRecord['sort'].length > 0)
            str = str + "\nORDER BY\n"

        selectedRecord['sort'] && selectedRecord['sort'].map((item, index1) => {

            if (selectedRecord['sort'].length - 1 !== index1) {

                str = str + (item.sortColumn.item.isjsoncolumn ?
                    item.sortColumn.item.ismultilingual ?
                        " \"" + item.sortTable.label + "\"." + item.sortColumn.item.jsoncolumnname + "->'" + item.sortColumn.item.scolumn + "'->><@" + item.sortColumn.item.parametername + "@> " + item.sortCondition.value + ","
                        : " \"" + item.sortTable.label + "\"." + item.sortColumn.item.jsoncolumnname + "->>'" + item.sortColumn.item.scolumn + "' " + item.sortCondition.value + ","
                    : " \"" + item.sortTable.label + "\".\"" + item.sortColumn.item.scolumn + "\" " + item.sortCondition.value + ",\n")

            } else {

                str = str + (item.sortColumn.item.isjsoncolumn ?
                    item.sortColumn.item.ismultilingual ?
                        " \"" + item.sortTable.label + "\"." + item.sortColumn.item.jsoncolumnname + "->'" + item.sortColumn.item.scolumn + "'->><@" + item.sortColumn.item.parametername + "@> " + item.sortCondition.value
                        : " \"" + item.sortTable.label + "\"." + item.sortColumn.item.jsoncolumnname + "->>'" + item.sortColumn.item.scolumn + "' " + item.sortCondition.value
                    : " \"" + item.sortTable.label + "\".\"" + item.sortColumn.item.scolumn + "\" " + item.sortCondition.value)

                //  str = str + " \"" + item.groupTable.label + "\".\"" + item.groupColumn.item.scolumn + "\""
            }

            // if (selectedRecord['sort'].length - 1 !== index1) {
            //     str = str + "  \"" + item.sortTable.label + "\"." + item.sortColumn.item.scolumn + ' ' + item.sortCondition.value + ","
            // } else {
            //     str = str + "  \"" + item.sortTable.label + "\"." + item.sortColumn.item.scolumn + ' ' + item.sortCondition.value
            // }
        })

        if (((selectedRecord.summarize === undefined)
            || (selectedRecord.summarize && selectedRecord.summarize.length === 0))
            && ((selectedRecord.group === undefined) || (selectedRecord.group
                && selectedRecord.group.length === 0))) {
            if (selectedRecord['Limit'] && selectedRecord['Limit'] !== 0) {
                str = str + "\nLIMIT " + selectedRecord['Limit']
            }

        }
        return str;
    }

    componentDidMount() {
        let listTables = this.state.listTables || []
        const TableList = this.props.tableName
        //console.log("component", listTables)
        listTables = constructOptionList(TableList, 'tableName', 'stabledisplayname').get("OptionList")
        // listTables = this.props.tableName.map(item => {
        //     return { label: item.stabledisplayname, value: item.tableName, item: { ...item } };
        // })
        // const list1 = []

        // let tableName = ''
        // let index1 = -1
        // this.props.tableList.map((item, index) => {

        //     if (item.stable !== tableName) {
        //         tableName = item.stable
        //         index1 = index1 + 1
        //         list1.push({
        //             label: item.stabledisplayname, value: item.stable,
        //             item: { ...item }, options: [{
        //                 label: item.scolumndisplayname, value: item.scolumn,
        //                 item: { ...item }
        //             }]
        //         });
        //     } else {
        //         const l = list1[index1].options
        //         l.push({
        //             label: item.scolumndisplayname, value: item.scolumn,
        //             item: { ...item }
        //         })
        //         list1[index1] = { ...list1[index1], options: l }
        //     }

        // })

        this.setState({ listTables, listColumnForMultiSelect: [] })
    }

    onFilterSummarizeEdit = (e) => {
        let summarizeCombo = this.state.summarizeCombo || []
        const selectedRecord = this.state.selectedRecord;
        selectedRecord['filterNew'] = [...selectedRecord['filterSummarize']]
        selectedRecord['filterNewCondition'] = selectedRecord['filterSummarizeJoinCondition']

        selectedRecord['summarize'] && selectedRecord['summarize'].map((item, index) => {
            if (item.summarizeCondition.value === "COUNT") {
                summarizeCombo.push({ label: (item.summarizeTable.label + item.summarizeColumn.item.scolumndisplayname + "Count"), value: index, item: { ...item, summarize: true } })
            } else if (item.summarizeCondition.value === "DISTINCT") {
                summarizeCombo.push({ label: (item.summarizeTable.label + item.summarizeColumn.item.scolumndisplayname + "CountDistinct"), value: index, item: { ...item, summarize: true } })
            }
        })
        this.setState({
            selectedRecord, filterType: 1,
            filterEdit: true, showFilter: true,
            filterTitle: "Edit Summarization Filter",
            summarizeLoadOnly: true, summarize: true
        });
    }

    onFilterSummarizeDelete = (e) => {
        const selectedRecord = this.state.selectedRecord;
        selectedRecord['filterSummarize'] = []
        selectedRecord['filterSummarizeJoinCondition'] = {}
        this.setState({ selectedRecord });
    }

    onFilterSummarizeChildDelete = (e, childIndex) => {
        const selectedRecord = this.state.selectedRecord;
        selectedRecord['filterSummarize'] = [...selectedRecord['filterSummarize'].slice(0, childIndex), ...selectedRecord['filterSummarize'].slice(childIndex + 1)]
        this.setState({ selectedRecord });
    }


    onFilterEdit = (e, parentIndex) => {
        const selectedRecord = this.state.selectedRecord;
        // selectedRecord['filterNew'] = [...selectedRecord['filter'][parentIndex]]
        //  selectedRecord['filterNewCondition'] = { ...selectedRecord['filterJoinCondition'][parentIndex] }

        const filterNew = [...selectedRecord['filter'][parentIndex]]
        const filterNewCondition = { ...selectedRecord['filterJoinCondition'][parentIndex] }
        this.setState({
            selectedRecord: { ...selectedRecord, filterNew: filterNew, filterNewCondition: filterNewCondition }, filterType: 1,
            filterEdit: true,
            showFilter: true,
            parentIndex: parentIndex,
            filterTitle: this.props.intl.formatMessage({ id: "IDS_EDITFILTER" })
        });
    }

    onFilterDelete = (e, parentIndex) => {
        const selectedRecord = this.state.selectedRecord;
        selectedRecord['filter'] = [...selectedRecord['filter'].slice(0, parentIndex), ...selectedRecord['filter'].slice(parentIndex + 1)]
        selectedRecord['filterJoinCondition'] = [...selectedRecord['filterJoinCondition'].slice(0, parentIndex), ...selectedRecord['filterJoinCondition'].slice(parentIndex + 1)]
        this.setState({ selectedRecord });
    }

    onFilterChildDelete = (e, parentIndex, childIndex) => {
        const selectedRecord = this.state.selectedRecord;
        selectedRecord['filter'][parentIndex] = [...selectedRecord['filter'][parentIndex].slice(0, childIndex), ...selectedRecord['filter'][parentIndex].slice(childIndex + 1)]

        const index = selectedRecord['filter'].findIndex(x => x.length === 0);
        if (index !== -1) {
            selectedRecord['filter'] = [...selectedRecord['filter'].slice(0, index), ...selectedRecord['filter'].slice(index + 1)]
            selectedRecord['filterJoinCondition'] = [...selectedRecord['filterJoinCondition'].slice(0, parentIndex), ...selectedRecord['filterJoinCondition'].slice(parentIndex + 1)]
        }
        this.setState({ selectedRecord });
    }

    onFilterModalDelete = (childIndex) => {
        let summarizeLoad = this.state.summarizeLoad
        let summarizeLoadOnly = this.state.summarizeLoadOnly
        const selectedRecord = this.state.selectedRecord;
        selectedRecord['filterNew'] = [...selectedRecord['filterNew'].slice(0, childIndex), ...selectedRecord['filterNew'].slice(childIndex + 1)]

        if (selectedRecord['filterNew'].length > 0 && selectedRecord['filterNew'].length === 1) {
            summarizeLoadOnly = false
            if (selectedRecord['summarize'] && selectedRecord['summarize'].length > 0) {
                summarizeLoad = true
            }
        }

        this.setState({ selectedRecord, summarizeLoadOnly, summarizeLoad });
    }

    onSortModalDelete = (e, childIndex) => {
        const selectedRecord = this.state.selectedRecord;
        selectedRecord['sortNew'] = [...selectedRecord['sortNew'].slice(0, childIndex), ...selectedRecord['sortNew'].slice(childIndex + 1)]
        this.setState({ selectedRecord });
    }

    onSummarizeModalDelete = (e, childIndex) => {
        const selectedRecord = this.state.selectedRecord;
        selectedRecord['summarizeNew'] = [...selectedRecord['summarizeNew'].slice(0, childIndex), ...selectedRecord['summarizeNew'].slice(childIndex + 1)]
        this.setState({ selectedRecord });
    }

    onJoinChildDelete = (e, childIndex) => {
        const selectedRecord = this.state.selectedRecord;
        selectedRecord['filterTableNewAdded'] = [...selectedRecord['filterTableNewAdded'].slice(0, childIndex), ...selectedRecord['filterTableNewAdded'].slice(childIndex + 1)]
        this.setState({ selectedRecord });
    }

    onGroupModalDelete = (e, childIndex) => {
        const selectedRecord = this.state.selectedRecord;
        selectedRecord['groupNew'] = [...selectedRecord['groupNew'].slice(0, childIndex), ...selectedRecord['groupNew'].slice(childIndex + 1)]
        this.setState({ selectedRecord });
    }


    onLimitDelete = (e) => {
        const selectedRecord = this.state.selectedRecord;
        selectedRecord['Limit'] = undefined
        this.setState({ selectedRecord });
    }

    onLimitEdit = (e) => {
        const selectedRecord = this.state.selectedRecord;
        selectedRecord['LimitNew'] = selectedRecord['Limit']
        this.setState({ selectedRecord, filterType: 6, showFilter: true });
    }


    onJoinTableDelete = (e, index) => {
        const selectedRecord = this.state.selectedRecord;
        selectedRecord['TableJoin'] = [...selectedRecord['TableJoin'].splice(0, index), ...selectedRecord['TableJoin'].splice(index + 1)]
        selectedRecord['stablename'] = [...selectedRecord['stablename'].splice(0, index + 1), ...selectedRecord['stablename'].splice(index + 2)]
        const avaliableColumns = this.state.avaliableColumns.filter(x => x.item.parentTableIndex !== index + 1)
        selectedRecord['scolumnname'] = selectedRecord['scolumnname'].filter(x => x.item.parentTableIndex !== index + 1)
        this.setState({ selectedRecord, avaliableColumns });
    }


    onSortDelete = (e) => {
        const selectedRecord = this.state.selectedRecord;
        selectedRecord['sort'] = []
        this.setState({ selectedRecord });
    }

    onSortChildDelete = (e, index) => {
        e.preventDefault();
        e.stopPropagation();
        const selectedRecord = this.state.selectedRecord;
        selectedRecord['sort'] = [...selectedRecord['sort'].splice(0, index), ...selectedRecord['sort'].splice(index + 1)]
        this.setState({ selectedRecord });
    }

    onSortEdit = (e) => {
        const selectedRecord = this.state.selectedRecord;
        selectedRecord['sortNew'] = [...selectedRecord['sort']]
        this.setState({ selectedRecord, filterType: 3, showFilter: true });
    }


    onSummarizeDelete = (e) => {
        const selectedRecord = this.state.selectedRecord;
        selectedRecord['summarize'] = []
        selectedRecord['filterSummarize'] = []
        this.setState({ selectedRecord });
    }

    onSummarizeChildDelete = (e, index) => {
        const selectedRecord = this.state.selectedRecord;
        const filterSummarize = selectedRecord['filterSummarize'] ? [...selectedRecord['filterSummarize']] : []
        const data = selectedRecord['summarize'][index]
        const newfilterSummarize = []
        filterSummarize.map((item, index) => {
            if (item.filterColumn.item.summarizeCondition.value === "COUNT") {
                if (item.filterColumn.label !== (data.summarizeTable.label + data.summarizeColumn.item.scolumndisplayname + "Count")) {

                    newfilterSummarize.push(item);
                }
            } else {
                if (item.filterColumn.label !== (data.summarizeTable.label + data.summarizeColumn.item.scolumndisplayname + "CountDistinct")) {

                    newfilterSummarize.push(item);
                }
            }

        })
        selectedRecord['filterSummarize'] = newfilterSummarize;
        selectedRecord['summarize'] = [...selectedRecord['summarize'].splice(0, index), ...selectedRecord['summarize'].splice(index + 1)]
        //this.filterQueryFormation(selectedRecord, this.state.avaliableColumns)
        this.setState({ selectedRecord });
    }

    onSummarizeEdit = (e) => {
        const selectedRecord = this.state.selectedRecord;
        selectedRecord['summarizeNew'] = [...selectedRecord['summarize']]
        this.setState({ selectedRecord, filterType: 4, showFilter: true });
    }


    onGroupDelete = (e) => {
        const selectedRecord = this.state.selectedRecord;
        selectedRecord['group'] = []
        //  this.filterQueryFormation(selectedRecord, this.state.avaliableColumns)
        this.setState({ selectedRecord });
    }

    onGroupChildDelete = (e, index) => {
        const selectedRecord = this.state.selectedRecord;
        selectedRecord['group'] = [...selectedRecord['group'].splice(0, index), ...selectedRecord['group'].splice(index + 1)]
        // this.filterQueryFormation(selectedRecord, this.state.avaliableColumns)
        this.setState({ selectedRecord });
    }

    onDownloadClick = (selectedRecord, avaliableColumns) => {
        const query = this.filterQueryFormation(selectedRecord, avaliableColumns)
        //const fileData = JSON.stringify(query);
        const blob = new Blob([query], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = "query.txt";
        link.href = url;
        link.click();
    }

    onGroupEdit = (e) => {
        const selectedRecord = this.state.selectedRecord;
        selectedRecord['groupNew'] = [...selectedRecord['group']]
        this.setState({ selectedRecord, filterType: 5, showFilter: true });
    }


    copyToClipboard = () => {

        copyText(this.filterQueryFormation(this.state.selectedRecord, this.state.avaliableColumns))
        toast.info(this.props.intl.formatMessage({ id: "IDS_COPIEDSUCCESSFULLY" }))
    }


    queryDesignFormation = (selectedRecord, avaliableColumns) => {
        let str = "";
        str = '<span class=\"token keyword\">SELECT</span>\n';
        if ((selectedRecord.summarize &&
            selectedRecord.summarize.length > 0)
            || (selectedRecord.group && selectedRecord.group.length > 0)) {
            if (selectedRecord.group && selectedRecord.group.length > 0) {
                selectedRecord.group.map((item, index) => {
                    if (selectedRecord.group.length - 1 !== index) {
                        str = str + `<span>${" " + (item.groupColumn.item.isjsoncolumn ?
                            item.groupColumn.item.ismultilingual ?
                                " \"" + item.groupTable.label + "\"." + item.groupColumn.item.jsoncolumnname + "->'" + item.groupColumn.item.scolumn + "'->><@" + item.groupColumn.item.parametername + "@> " + "\"" + item.groupColumn.item.scolumndisplayname + "\""
                                : " \"" + item.groupTable.label + "\"." + item.groupColumn.item.jsoncolumnname + "->>'" + item.groupColumn.item.scolumn + "' \"" + item.groupColumn.item.scolumndisplayname + "\""
                            : " \"" + item.groupTable.label + "\".\"" + item.groupColumn.item.scolumn + "\" \"" + item.groupColumn.item.scolumndisplayname + "\"") + ","}</span>\n`
                        //str = str + " \"" + item.groupTable.label + "\".\"" + item.groupColumn.item.scolumn + "\","
                    } else {
                        str = str + `<span>${" " + (item.groupColumn.item.isjsoncolumn ?
                            item.groupColumn.item.ismultilingual ?
                                " \"" + item.groupTable.label + "\"." + item.groupColumn.item.jsoncolumnname + "->'" + item.groupColumn.item.scolumn + "'->><@" + item.groupColumn.item.parametername + "@> " + "\"" + item.groupColumn.item.scolumndisplayname + "\""
                                : " \"" + item.groupTable.label + "\"." + item.groupColumn.item.jsoncolumnname + "->>'" + item.groupColumn.item.scolumn + "' \"" + item.groupColumn.item.scolumndisplayname + "\""
                            : " \"" + item.groupTable.label + "\".\"" + item.groupColumn.item.scolumn + "\" \"" + item.groupColumn.item.scolumndisplayname + "\"")}</span>`
                        //str = str + " \"" + item.groupTable.label + "\".\"" + item.groupColumn.item.scolumn + "\""
                    }
                })

            }

            if (selectedRecord.summarize && selectedRecord.summarize.length > 0) {
                if (selectedRecord.group && selectedRecord.group.length > 0)
                    str = str + '<span>,</span>\n';

                selectedRecord.summarize.map((item, index) => {
                    if (selectedRecord.summarize.length - 1 !== index) {
                        if (item.summarizeCondition.value === "COUNT") {

                            str = str + `<span class=\"token keyword\">${" " + item.summarizeCondition.value}</span>` +
                                `<span>${"( " + (item.summarizeColumn.item.isjsoncolumn ?
                                    item.summarizeColumn.item.ismultilingual ?
                                        " \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.jsoncolumnname + "->'" + item.summarizeColumn.item.scolumn + "'->><@" + item.summarizeColumn.item.parametername + "@> "
                                        : " \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.jsoncolumnname + "->>'" + item.summarizeColumn.item.scolumn + "' \""
                                    : " \"" + item.summarizeTable.label + "\".\"" + item.summarizeColumn.item.scolumn + "\"") + " ) AS \"" + item.summarizeTable.label + item.summarizeColumn.item.scolumndisplayname + "Count\","}</span>\n`

                            //str = str + item.summarizeCondition.value + "( " + "\"" + item.summarizeTable.label + "\".\"" + item.summarizeColumn.item.scolumn + "\" ) AS \"" + item.summarizeTable.label + item.summarizeColumn.item.scolumndisplayname + "Count\",";
                        } else if (item.summarizeCondition.value === "DISTINCT") {

                            str = str + `<span class=\"token keyword\"> COUNT</span>` +
                                `<span>${"( " + item.summarizeCondition.value + " " + (item.summarizeColumn.item.isjsoncolumn ?
                                    item.summarizeColumn.item.ismultilingual ?
                                        " \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.jsoncolumnname + "->'" + item.summarizeColumn.item.scolumn + "'->><@" + item.summarizeColumn.item.parametername + "@> "
                                        : " \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.jsoncolumnname + "->>'" + item.summarizeColumn.item.scolumn + "' \""
                                    : " \"" + item.summarizeTable.label + "\".\"" + item.summarizeColumn.item.scolumn + "\"") + " ) AS \"" + item.summarizeTable.label + item.summarizeColumn.item.scolumndisplayname + "CountDistinct\","}</span>\n`

                            //str = str + " COUNT( " + item.summarizeCondition.value + " \"" + item.summarizeTable.label + "\".\"" + item.summarizeColumn.item.scolumn + "\" ) AS \"" + item.summarizeTable.label + item.summarizeColumn.item.scolumndisplayname + "CountDistinct\",";
                        }
                    } else {
                        if (item.summarizeCondition.value === "COUNT") {

                            str = str + `<span class=\"token keyword\">${" " + item.summarizeCondition.value}</span>` +
                                `<span>${"( " + (item.summarizeColumn.item.isjsoncolumn ?
                                    item.summarizeColumn.item.ismultilingual ?
                                        " \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.jsoncolumnname + "->'" + item.summarizeColumn.item.scolumn + "'->><@" + item.summarizeColumn.item.parametername + "@> "
                                        : " \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.jsoncolumnname + "->>'" + item.summarizeColumn.item.scolumn + "' \""
                                    : " \"" + item.summarizeTable.label + "\".\"" + item.summarizeColumn.item.scolumn + "\"") + " ) AS \"" + item.summarizeTable.label + item.summarizeColumn.item.scolumndisplayname + "Count\""}</span>`

                            //  str = str + item.summarizeCondition.value + "( " + "\"" + item.summarizeTable.label + "\".\"" + item.summarizeColumn.item.scolumn + "\" ) AS \"" + item.summarizeTable.label + item.summarizeColumn.item.scolumndisplayname + "Count\"";
                        } else if (item.summarizeCondition.value === "DISTINCT") {

                            str = str + `<span class=\"token keyword\"> COUNT</span>` +
                                `<span>( </span>` +
                                `<span class=\"token keyword\">${item.summarizeCondition.value}</span>` +
                                `<span>${" " + (item.summarizeColumn.item.isjsoncolumn ?
                                    item.summarizeColumn.item.ismultilingual ?
                                        " \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.jsoncolumnname + "->'" + item.summarizeColumn.item.scolumn + "'->><@" + item.summarizeColumn.item.parametername + "@> "
                                        : " \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.jsoncolumnname + "->>'" + item.summarizeColumn.item.scolumn + "' \""
                                    : " \"" + item.summarizeTable.label + "\".\"" + item.summarizeColumn.item.scolumn + "\"") + " ) AS \"" + item.summarizeTable.label + item.summarizeColumn.item.scolumndisplayname + "CountDistinct\""}</span>`

                            // str = str + " COUNT( " + item.summarizeCondition.value + " \"" + item.summarizeTable.label + "\".\"" + item.summarizeColumn.item.scolumn + "\" ) AS \"" + item.summarizeTable.label + item.summarizeColumn.item.scolumndisplayname + "CountDistinct\"";
                        }
                    }

                })
            }
        }
        else {
            // if (selectedRecord.scolumnname.length !== avaliableColumns.length) {
            selectedRecord.scolumnname.map((item, index) => {
                if (selectedRecord.scolumnname.length - 1 !== index) {

                    str = str + `<span>${"  " + (item.item.isjsoncolumn ?
                        item.item.ismultilingual ?
                            " \"" + item.item.stabledisplayname + "\"." + item.item.jsoncolumnname + "->'" + item.item.scolumn + "'->><@" + item.item.parametername + "@> " + "\"" + item.label + "\""
                            : " \"" + item.item.stabledisplayname + "\"." + item.item.jsoncolumnname + "->>'" + item.item.scolumn + "' \"" + item.label + "\""
                        : " \"" + item.item.stabledisplayname + "\".\"" + item.item.scolumn + "\" \"" + item.label + "\"") + ","}</span>\n`
                    //  str = str + "\"" + item.item.stabledisplayname + "\".\"" + item.item.scolumn + "\" \"" + item.label + "\", "
                } else {
                    str = str + `<span>${"  " + (item.item.isjsoncolumn ?
                        item.item.ismultilingual ?
                            " \"" + item.item.stabledisplayname + "\"." + item.item.jsoncolumnname + "->'" + item.item.scolumn + "'->><@" + item.item.parametername + "@> " + "\"" + item.label + "\""
                            : " \"" + item.item.stabledisplayname + "\"." + item.item.jsoncolumnname + "->>'" + item.item.scolumn + "' \"" + item.label + "\""
                        : " \"" + item.item.stabledisplayname + "\".\"" + item.item.scolumn + "\" \"" + item.label + "\" ")}</span>`
                    // str = str + "\"" + item.item.stabledisplayname + "\".\"" + item.item.scolumn + "\" \"" + item.label + "\" "
                }
            })
            // } else {
            //     str = str + '<span class=\"token keyword\"> * </span>';
            // }
        }
        str = str + '\n<span class=\"token keyword\">FROM</span>\n'

        if (selectedRecord['stablename'].length === 1) {
            selectedRecord['stablename'].map(item => {
                str = str + `<span class=\"token identifier\" >${"  " + item.item.tableName + " \"" + item.label + "\""}</span>\n`
            })
        } else {

            selectedRecord['TableJoin'].map((item, index) => {
                if (index === 0) {

                    //  str = str + selectedRecord['stablename'][index].item.tableName + " \"" + selectedRecord['stablename'][index].label + "\" " + item.TableJoining.value + " "

                    str = str + `<span>${"  " + selectedRecord['stablename'][index].item.tableName + " \"" + selectedRecord['stablename'][index].label + "\" "}</span>\n` +
                        `<span class=\"token keyword\">${"  " + item.TableJoining.value + " "}</span>`

                    item.Table.map((item1, index1) => {
                        if (index1 === 0) {

                            str = str + `<span>${item1.newTable.item.tableName + " \"" + item1.newTable.label + "\""}</span>` +
                                '<span class=\"token keyword\"> ON </span>' +
                                `<span>${"\"" + item1.oldTable.label + "\"." + (item1.oldTableColumn.item.isjsoncolumn ?
                                    item1.oldTableColumn.item.ismultilingual ?
                                        item1.oldTableColumn.item.jsoncolumnname + "->'" + item1.oldTableColumn.item.scolumn + "'->><@" + item1.oldTableColumn.item.parametername + "@> "
                                        : item1.oldTableColumn.item.jsoncolumnname + "->>'" + item1.oldTableColumn.item.scolumn + "'"
                                    : "\"" + item1.oldTableColumn.item.scolumn + "\"") + "=\"" + item1.newTable.label + "\"." + (item1.newTableColumn.item.isjsoncolumn ?
                                        item1.newTableColumn.item.ismultilingual ?
                                            item1.newTableColumn.item.jsoncolumnname + "->'" + item1.newTableColumn.item.scolumn + "'->><@" + item1.newTableColumn.item.parametername + "@> "
                                            : item1.newTableColumn.item.jsoncolumnname + "->>'" + item1.newTableColumn.item.scolumn + "'"
                                        : "\"" + item1.newTableColumn.item.scolumn + "\"") + " "}</span>\n`

                            // str = str + item1.newTable.item.tableName + " \"" + item1.newTable.label + "\" ON " +
                            //     "\"" + item1.oldTable.label + "\"." + item1.oldTableColumn.item.scolumn + "=\"" + item1.newTable.label + "\"." + item1.newTableColumn.item.scolumn + " "
                        } else {

                            str = str + ` <span class=\"token keyword\"> AND </span>` +
                                `<span>${"\"" + item1.oldTable.label + "\"." + (item1.oldTableColumn.item.isjsoncolumn ?
                                    item1.oldTableColumn.item.ismultilingual ?
                                        item1.oldTableColumn.item.jsoncolumnname + "->'" + item1.oldTableColumn.item.scolumn + "'->><@" + item1.oldTableColumn.item.parametername + "@> "
                                        : item1.oldTableColumn.item.jsoncolumnname + "->>'" + item1.oldTableColumn.item.scolumn + "'"
                                    : "\"" + item1.oldTableColumn.item.scolumn + "\"") + "=\"" + item1.newTable.label + "\"." + (item1.newTableColumn.item.isjsoncolumn ?
                                        item1.newTableColumn.item.ismultilingual ?
                                            item1.newTableColumn.item.jsoncolumnname + "->'" + item1.newTableColumn.item.scolumn + "'->><@" + item1.newTableColumn.item.parametername + "@> "
                                            : item1.newTableColumn.item.jsoncolumnname + "->>'" + item1.newTableColumn.item.scolumn + "'"
                                        : "\"" + item1.newTableColumn.item.scolumn + "\"") + " "}</span>\n`
                            // str = str + " AND \"" + item1.oldTable.label + "\"." + item1.oldTableColumn.item.scolumn + "=\"" + item1.newTable.label + "\"." + item1.newTableColumn.item.scolumn + " "
                        }
                    })
                } else {

                    str = str + `<span class=\"token keyword\">${item.TableJoining.value}</span>`

                    item.Table.map((item1, index1) => {
                        if (index1 === 0) {

                            str = str + `<span>${" " + item1.newTable.item.tableName + " \"" + item1.newTable.label + "\ "}</span>` +
                                `<span class=\"token keyword\"> ON </span>` +
                                `<span>${"\"" + item1.oldTable.label + "\"." + (item1.oldTableColumn.item.isjsoncolumn ?
                                    item1.oldTableColumn.item.ismultilingual ?
                                        item1.oldTableColumn.item.jsoncolumnname + "->'" + item1.oldTableColumn.item.scolumn + "'->><@" + item1.oldTableColumn.item.parametername + "@> "
                                        : item1.oldTableColumn.item.jsoncolumnname + "->>'" + item1.oldTableColumn.item.scolumn + "'"
                                    : "\"" + item1.oldTableColumn.item.scolumn + "\"") + "=\"" + item1.newTable.label + "\"." + (item1.newTableColumn.item.isjsoncolumn ?
                                        item1.newTableColumn.item.ismultilingual ?
                                            item1.newTableColumn.item.jsoncolumnname + "->'" + item1.newTableColumn.item.scolumn + "'->><@" + item1.newTableColumn.item.parametername + "@> "
                                            : item1.newTableColumn.item.jsoncolumnname + "->>'" + item1.newTableColumn.item.scolumn + "'"
                                        : "\"" + item1.newTableColumn.item.scolumn + "\"") + " "}</span>\n`

                            // str = str + item1.newTable.item.tableName + " \"" + item1.newTable.label + "\" ON " +
                            //     "\"" + item1.oldTable.label + "\"." + item1.oldTableColumn.item.scolumn + "=\"" + item1.newTable.label + "\"." + item1.newTableColumn.item.scolumn + " "
                        } else {

                            str = str + `<span class=\"token keyword\"> AND </span>` +
                                `<span>${"\"" + item1.oldTable.label + "\"." + (item1.oldTableColumn.item.isjsoncolumn ?
                                    item1.oldTableColumn.item.ismultilingual ?
                                        item1.oldTableColumn.item.jsoncolumnname + "->'" + item1.oldTableColumn.item.scolumn + "'->><@" + item1.oldTableColumn.item.parametername + "@> "
                                        : item1.oldTableColumn.item.jsoncolumnname + "->>'" + item1.oldTableColumn.item.scolumn + "'"
                                    : "\"" + item1.oldTableColumn.item.scolumn + "\"") + "=\"" + item1.newTable.label + "\"." + (item1.newTableColumn.item.isjsoncolumn ?
                                        item1.newTableColumn.item.ismultilingual ?
                                            item1.newTableColumn.item.jsoncolumnname + "->'" + item1.newTableColumn.item.scolumn + "'->><@" + item1.newTableColumn.item.parametername + "@> "
                                            : item1.newTableColumn.item.jsoncolumnname + "->>'" + item1.newTableColumn.item.scolumn + "'"
                                        : "\"" + item1.newTableColumn.item.scolumn + "\"") + " "}</span>\n`

                            // str = str + " AND \"" + item1.oldTable.label + "\"." + item1.oldTableColumn.item.scolumn + "=\"" + item1.newTable.label + "\"." + item1.newTableColumn.item.scolumn + " "
                        }
                    })
                }

            })
        }

        if (selectedRecord['filter'] && selectedRecord['filter'].length > 0)
            str = str + `<span class=\"token keyword\">WHERE</span>\n`



        selectedRecord['filter'] && selectedRecord['filter'].map((item1, index1) => {
            // str = str + " ( ";

            str = str + `<span class=\"token punctuation\">  (</span>\n`

            item1.map((item, index) => {

                // if (item.filterCondition.value !== 'NULL'
                //     && item.filterCondition.value !== 'NOT NULL' &&
                //     item.filterCondition.value !== 'IN' &&
                //     item.filterCondition.value !== 'PRESENT' &&
                //     item.filterCondition.value !== 'BLANK') {



                // str = str + "  \"" + item.filterTable.label + "\"." + item.filterColumn.item.scolumn + " " + item.filterCondition.value + "'" + item.filterValue + "' "
                // }
                if (item.filterCondition.value === 'IN') {

                    str = str + `<span> ${"  \"" + item.filterTable.label + "\"." + (item.filterColumn.item.isjsoncolumn ?
                        item.filterColumn.item.ismultilingual ?
                            item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->><@" + item.filterColumn.item.parametername + "@> "
                            : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                        : "\"" + item.filterColumn.item.scolumn + "\"") + " "}</span>` +
                        `<span class=\"token operator\">${item.filterCondition.value}</span>` +
                        `<span class=\"token punctuation\"> ('</span>` +
                        `<span class=\"token string\">${item.filterValue + "') "}</span>`

                    //str = str + "  \"" + item.filterTable.label + "\"." + item.filterColumn.item.scolumn + " " + item.filterCondition.value + " ('" + item.filterValue + "') "
                }
                else if (item.filterCondition.value === 'PRESENT') {

                    str = str + `<span class=\"token operator\"> NOT</span>` +
                        `<span>${" \"" + item.filterTable.label + "\"." + (item.filterColumn.item.isjsoncolumn ?
                            item.filterColumn.item.ismultilingual ?
                                item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->><@" + item.filterColumn.item.parametername + "@> "
                                : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                            : "\"" + item.filterColumn.item.scolumn + "\"") + " ="}</span>` +
                        `<span class=\"token string\">''</span>`

                    //str = str + " NOT \"" + item.filterTable.label + "\"." + item.filterColumn.item.scolumn + " ='' "
                }
                else if (item.filterCondition.value === 'BLANK') {

                    str = str + `<span>${"  \"" + item.filterTable.label + "\"." + (item.filterColumn.item.isjsoncolumn ?
                        item.filterColumn.item.ismultilingual ?
                            item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->><@" + item.filterColumn.item.parametername + "@> "
                            : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                        : "\"" + item.filterColumn.item.scolumn + "\"") + " = "}</span>` +
                        `<span class=\"token string\">''</span>`

                    // str = str + "  \"" + item.filterTable.label + "\"." + item.filterColumn.item.scolumn + " ='' "
                }
                else if (item.filterCondition.value === 'NULL'
                    || item.filterCondition.value === 'NOT NULL') {

                    str = str + `<span>${"  \"" + item.filterTable.label + "\"." + (item.filterColumn.item.isjsoncolumn ?
                        item.filterColumn.item.ismultilingual ?
                            item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->><@" + item.filterColumn.item.parametername + "@> "
                            : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                        : "\"" + item.filterColumn.item.scolumn + "\"")}</span>` +
                        `<span class=\"token operator\"> IS </span>` +
                        `<span class=\"token boolean\">${item.filterCondition.value + " "}</span>`

                    // str = str + "  \"" + item.filterTable.label + "\"." + item.filterColumn.item.scolumn + " IS " + item.filterCondition.value + " "
                }
                else if (item.filterCondition.value === 'IS NULL') {

                    str = str + `<span>${"  \"" + item.filterTable.label + "\"." + (item.filterColumn.item.isjsoncolumn ?
                        item.filterColumn.item.ismultilingual ?
                            item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->><@" + item.filterColumn.item.parametername + "@> "
                            : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                        : "\"" + item.filterColumn.item.scolumn + "\"")}</span>` +
                        // `<span class=\"token operator\"> IS </span>` +
                        `<span class=\"token boolean\">${item.filterCondition.value + " "}</span>`

                    // str = str + "  \"" + item.filterTable.label + "\"." + item.filterColumn.item.scolumn + " IS " + item.filterCondition.value + " "
                }
                else if (item.filterCondition.value === 'STARTS WITH') {
                    str = str + `<span> ${"  \"" + item.filterTable.label + "\"." + (item.filterColumn.item.isjsoncolumn ?
                        item.filterColumn.item.ismultilingual ?
                            item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->><@" + item.filterColumn.item.parametername + "@> "
                            : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                        : "\"" + item.filterColumn.item.scolumn + "\"") + " "}</span>` +
                        `<span class=\"token operator\"> ILIKE </span>` +
                        `<span class=\"token string\">${"'" + item.filterValue + "%' collate \"default\" "}</span>`
                }
                else if (item.filterCondition.value === 'ENDS WITH') {
                    str = str + `<span> ${"  \"" + item.filterTable.label + "\"." + (item.filterColumn.item.isjsoncolumn ?
                        item.filterColumn.item.ismultilingual ?
                            item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->><@" + item.filterColumn.item.parametername + "@> "
                            : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                        : "\"" + item.filterColumn.item.scolumn + "\"") + " "}</span>` +
                        `<span class=\"token operator\"> ILIKE </span>` +
                        `<span class=\"token string\">${"'%" + item.filterValue + "' collate \"default\" "}</span>`
                }
                else if (item.filterCondition.value === 'CONTAINS') {
                    str = str + `<span> ${"  \"" + item.filterTable.label + "\"." + (item.filterColumn.item.isjsoncolumn ?
                        item.filterColumn.item.ismultilingual ?
                            item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->><@" + item.filterColumn.item.parametername + "@> "
                            : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                        : "\"" + item.filterColumn.item.scolumn + "\"") + " "}</span>` +
                        `<span class=\"token operator\"> ILIKE </span>` +
                        `<span class=\"token string\">${"'" + item.filterValue + "%' collate \"default\""}</span>`
                }
                else if (item.filterColumn.item.columndatatype === 'date' && (item.filterCondition.value === '=' || item.filterCondition.value === '<' || item.filterCondition.value === '>')) {
                    str = str + `<span> ${"  \"" + item.filterTable.label + "\"." + (item.filterColumn.item.isjsoncolumn ?
                        item.filterColumn.item.ismultilingual ?
                            item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->><@" + item.filterColumn.item.parametername + "@> "
                            : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                        : "\"" + item.filterColumn.item.scolumn + "\"") + " " + item.filterCondition.value}</span>` +
                        `<span class=\"token string\">${(item.filterValueType.value === 1 ? ("<#" + item.filterColumn.item.scolumn + "#>") : ("'" + convertDateTimetoStringDBFormat(item.filterValue, this.props.Login.userInfo) + "' "))}</span>`
                }
                else if (item.filterColumn.item.columndatatype === 'date' && (item.filterCondition.value === 'NOT')) {
                    str = str + `<span>(</span><span class=\"token string\">NOT</span><span> ${" \"" + item.filterTable.label + "\"." + (item.filterColumn.item.isjsoncolumn ?
                        item.filterColumn.item.ismultilingual ?
                            item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->><@" + item.filterColumn.item.parametername + "@> "
                            : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                        : "\"" + item.filterColumn.item.scolumn + "\"") + " = "}</span>` +
                        `<span class=\"token string\">${(item.filterValueType.value === 1 ? ("<#" + item.filterColumn.item.scolumn + "#>)") : ("'" + convertDateTimetoStringDBFormat(item.filterValue, this.props.Login.userInfo) + "' )"))}</span>`
                }

                else if (item.filterColumn.item.columndatatype === 'string' && (item.filterCondition.value === 'NOT')) {
                    str = str + `<span>(</span><span class=\"token string\">NOT</span><span> ${" \"" + item.filterTable.label + "\"." + (item.filterColumn.item.isjsoncolumn ?
                        item.filterColumn.item.ismultilingual ?
                            item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->><@" + item.filterColumn.item.parametername + "@> "
                            : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                        : "\"" + item.filterColumn.item.scolumn + "\"") + " = "}</span>` +
                        `<span class=\"token string\">${(item.filterValueType.value === 1 ? ("<@" + item.filterColumn.item.scolumn + "@>)") : ("'" + item.filterValue + "' )"))}</span>`
                }
                else {
                    str = str + `<span> ${"  \"" + item.filterTable.label + "\"." + (item.filterColumn.item.isjsoncolumn ?
                        item.filterColumn.item.ismultilingual ?
                            item.filterColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.scolumn + "'->><@" + item.filterColumn.item.parametername + "@> "
                            : item.filterColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.scolumn + "'"
                        : "\"" + item.filterColumn.item.scolumn + "\"") + " " + (item.filterCondition.value==='IS NOT NULL'?'':item.filterCondition.value)}</span>` +
                        `<span class=\"token string\">${(item.filterValueType.value === 1 ?
                            ((item.filterColumn.item.columndatatype === 'date' ? "<#" : "<@") + item.filterColumn.item.scolumn +
                                (item.filterColumn.item.columndatatype === 'date' ? "#>" : "@>")) :
                            item.filterColumn.item.columndatatype === 'string' ? item.filterCondition.value : ("'" + item.filterValue + "' "))}</span>`
                }

                if (index !== selectedRecord['filter'][index1].length - 1) {

                    str = str + `\n<span class=\"token operator\">${"    " + selectedRecord['filterJoinCondition'][index1].value}</span>\n`

                    // str = str + selectedRecord['filterJoinCondition'][index1].value + " ";
                }
            })

            str = str + `\n<span class=\"token punctuation\">  )</span>\n`

            if (index1 !== selectedRecord['filter'].length - 1) {

                str = str + `<span class=\"token operator\">${"  " + selectedRecord['filterJoinCondition'][index1 + 1] &&
                    selectedRecord['filterJoinCondition'][index1 + 1].value}</span>\n`


            }
        })

        if (selectedRecord.group && selectedRecord.group.length > 0) {
            //str = str + " GROUP BY "

            str = str + `<span class=\"token keyword\">GROUP BY</span>\n`
        }
        else if (selectedRecord.summarize && selectedRecord.summarize.length > 0 &&
            selectedRecord['sort'] && selectedRecord['sort'].length > 0) {
            str = str + `<span class=\"token keyword\">GROUP BY</span>\n`
        }

        if ((selectedRecord.summarize && selectedRecord.summarize.length > 0
            || selectedRecord.group && selectedRecord.group.length > 0)
            && selectedRecord['sort'] && selectedRecord['sort'].length > 0) {
            let sortIndex = [];

            if (selectedRecord.group && selectedRecord.group.length > 0) {
                selectedRecord['group'] && selectedRecord['group'].map((item, index1) => {

                    if (selectedRecord['sort'].findIndex(x =>
                        (x.sortTable.label + x.sortColumn.item.scolumn)
                        === (item.groupTable.label + item.groupColumn.item.scolumn)) !== -1) {

                        sortIndex[index1] = selectedRecord['sort'].findIndex(x =>
                            (x.sortTable.label + x.sortColumn.item.scolumn)
                            === (item.groupTable.label + item.groupColumn.item.scolumn))
                    }

                    if (selectedRecord['group'].length - 1 !== index1) {

                        str = str + `<span>${" " + (item.groupColumn.item.isjsoncolumn ?
                            item.groupColumn.item.ismultilingual ?
                                " \"" + item.groupTable.label + "\"." + item.groupColumn.item.jsoncolumnname + "->'" + item.groupColumn.item.scolumn + "'->><@" + item.groupColumn.item.parametername + "@> "
                                : " \"" + item.groupTable.label + "\"." + item.groupColumn.item.jsoncolumnname + "->>'" + item.groupColumn.item.scolumn + "' "
                            : " \"" + item.groupTable.label + "\".\"" + item.groupColumn.item.scolumn + "\" ") + ","}</span>\n`
                        //   str = str + "  \"" + item.groupTable.label + "\"." + item.groupColumn.item.scolumn + ","
                    } else {

                        str = str + `<span>${" " + (item.groupColumn.item.isjsoncolumn ?
                            item.groupColumn.item.ismultilingual ?
                                " \"" + item.groupTable.label + "\"." + item.groupColumn.item.jsoncolumnname + "->'" + item.groupColumn.item.scolumn + "'->><@" + item.groupColumn.item.parametername + "@> "
                                : " \"" + item.groupTable.label + "\"." + item.groupColumn.item.jsoncolumnname + "->>'" + item.groupColumn.item.scolumn + "' "
                            : " \"" + item.groupTable.label + "\".\"" + item.groupColumn.item.scolumn + "\" ")}</span>`
                        //  str = str + "  \"" + item.groupTable.label + "\"." + item.groupColumn.item.scolumn
                    }
                    // }
                })

                if (selectedRecord['sort'].length !== sortIndex.length)
                    str = str + `<span>,</span>\n`
                //str = str + " , "

                selectedRecord['sort'] && selectedRecord['sort'].map((item, index1) => {
                    if (sortIndex.findIndex(x => x === index1) === -1) {
                        if (selectedRecord['sort'].length - 1 !== index1) {
                            str = str + `<span>${" " + (item.sortColumn.item.isjsoncolumn ?
                                item.sortColumn.item.ismultilingual ?
                                    " \"" + item.sortTable.label + "\"." + item.sortColumn.item.jsoncolumnname + "->'" + item.sortColumn.item.scolumn + "'->><@" + item.sortColumn.item.parametername + "@>,"
                                    : " \"" + item.sortTable.label + "\"." + item.sortColumn.item.jsoncolumnname + "->>'" + item.sortColumn.item.scolumn + "',"
                                : " \"" + item.sortTable.label + "\".\"" + item.sortColumn.item.scolumn + "\"") + ","}</span>\n`
                        } else {
                            str = str + `<span>${" " + (item.sortColumn.item.isjsoncolumn ?
                                item.sortColumn.item.ismultilingual ?
                                    " \"" + item.sortTable.label + "\"." + item.sortColumn.item.jsoncolumnname + "->'" + item.sortColumn.item.scolumn + "'->><@" + item.sortColumn.item.parametername + "@>,"
                                    : " \"" + item.sortTable.label + "\"." + item.sortColumn.item.jsoncolumnname + "->>'" + item.sortColumn.item.scolumn + "',"
                                : " \"" + item.sortTable.label + "\".\"" + item.sortColumn.item.scolumn + "\"")}</span>\n`
                        }
                    }
                })

            } else if (selectedRecord.summarize && selectedRecord.summarize.length > 0) {

                //selectedRecord['summarize'] && selectedRecord['summarize'].map((item, index1) => {

                // if (selectedRecord['sort'].findIndex(x =>
                //     (x.sortTable.label + x.sortColumn.item.scolumn)
                //     === (item.summarizeTable.label + item.summarizeColumn.item.scolumn)) !== -1) {

                //     sortIndex[index1] = selectedRecord['sort'].findIndex(x =>
                //         (x.sortTable.label + x.sortColumn.item.scolumn)
                //         === (item.summarizeTable.label + item.summarizeColumn.item.scolumn))
                // }

                //     if (selectedRecord['summarize'].length - 1 !== index1) {
                //         str = str + `<span>${" \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.scolumn + ","}</span>\n`
                //         //str = str + "  \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.scolumn + ","
                //     } else {
                //         str = str + `<span>${" \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.scolumn}</span>`
                //         // str = str + "  \"" + item.summarizeTable.label + "\"." + item.summarizeColumn.item.scolumn
                //     }
                //     // }
                // })

                // if (selectedRecord['sort'].length !== sortIndex.length)
                //     str = str + `<span>,</span>\n`

                selectedRecord['sort'] && selectedRecord['sort'].map((item, index1) => {
                    if (sortIndex.findIndex(x => x === index1) === -1) {
                        if (selectedRecord['sort'].length - 1 !== index1) {
                            str = str + `<span>${" " + (item.sortColumn.item.isjsoncolumn ?
                                item.sortColumn.item.ismultilingual ?
                                    " \"" + item.sortTable.label + "\"." + item.sortColumn.item.jsoncolumnname + "->'" + item.sortColumn.item.scolumn + "'->><@" + item.sortColumn.item.parametername + "@>,"
                                    : " \"" + item.sortTable.label + "\"." + item.sortColumn.item.jsoncolumnname + "->>'" + item.sortColumn.item.scolumn + "',"
                                : " \"" + item.sortTable.label + "\".\"" + item.sortColumn.item.scolumn + "\"") + ","}</span>\n`
                            //str = str + "  \"" + item.sortTable.label + "\"." + item.sortColumn.item.scolumn + ","
                        } else {
                            str = str + `<span>${" " + (item.sortColumn.item.isjsoncolumn ?
                                item.sortColumn.item.ismultilingual ?
                                    " \"" + item.sortTable.label + "\"." + item.sortColumn.item.jsoncolumnname + "->'" + item.sortColumn.item.scolumn + "'->><@" + item.sortColumn.item.parametername + "@>,"
                                    : " \"" + item.sortTable.label + "\"." + item.sortColumn.item.jsoncolumnname + "->>'" + item.sortColumn.item.scolumn + "',"
                                : " \"" + item.sortTable.label + "\".\"" + item.sortColumn.item.scolumn + "\"")}</span>\n`
                            // str = str + "  \"" + item.sortTable.label + "\"." + item.sortColumn.item.scolumn
                        }
                    }
                })

            }

        }
        else if (selectedRecord.group && selectedRecord.group.length > 0) {

            selectedRecord['group'] && selectedRecord['group'].map((item, index1) => {
                if (selectedRecord['group'].length - 1 !== index1) {
                    str = str + `<span>${" " + (item.groupColumn.item.isjsoncolumn ?
                        item.groupColumn.item.ismultilingual ?
                            " \"" + item.groupTable.label + "\"." + item.groupColumn.item.jsoncolumnname + "->'" + item.groupColumn.item.scolumn + "'->><@" + item.groupColumn.item.parametername + "@>,"
                            : " \"" + item.groupTable.label + "\"." + item.groupColumn.item.jsoncolumnname + "->>'" + item.groupColumn.item.scolumn + "',"
                        : " \"" + item.groupTable.label + "\".\"" + item.groupColumn.item.scolumn + "\"") + ","}</span>\n`
                    //str = str + "  \"" + item.groupTable.label + "\"." + item.groupColumn.item.scolumn + ","
                } else {
                    str = str + `<span>${" " + (item.groupColumn.item.isjsoncolumn ?
                        item.groupColumn.item.ismultilingual ?
                            " \"" + item.groupTable.label + "\"." + item.groupColumn.item.jsoncolumnname + "->'" + item.groupColumn.item.scolumn + "'->><@" + item.groupColumn.item.parametername + "@>,"
                            : " \"" + item.groupTable.label + "\"." + item.groupColumn.item.jsoncolumnname + "->>'" + item.groupColumn.item.scolumn + "',"
                        : " \"" + item.groupTable.label + "\".\"" + item.groupColumn.item.scolumn + "\"")}</span>\n`
                    //str = str + "  \"" + item.groupTable.label + "\"." + item.groupColumn.item.scolumn
                }
            })
        }

        if (selectedRecord['filterSummarize'] && selectedRecord['filterSummarize'].length > 0) {
            str = str + `\n<span class=\"token keyword\">HAVING</span>\n`
            // str = str + " HAVING "
        }

        selectedRecord['filterSummarize'] && selectedRecord['filterSummarize'].map((item, index) => {

            if (item.filterColumn.item.summarizeCondition.value === "COUNT") {

                str = str + `<span class=\"token keyword\">${item.filterColumn.item.summarizeCondition.value}</span>` +
                    `<span>${"( " + (item.filterColumn.item.summarizeColumn.item.isjsoncolumn ?
                        item.filterColumn.item.summarizeColumn.item.ismultilingual ?
                            " \"" + item.filterColumn.item.summarizeTable.label + "\"." + item.filterColumn.item.summarizeColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.summarizeColumn.item.scolumn + "'->><@" + item.filterColumn.item.summarizeColumn.item.parametername + "@> "
                            : " \"" + item.filterColumn.item.summarizeTable.label + "\"." + item.filterColumn.item.summarizeColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.summarizeColumn.item.scolumn + "' \""
                        : " \"" + item.filterColumn.item.summarizeTable.label + "\".\"" + item.filterColumn.item.summarizeColumn.item.scolumn + "\"") + "\" ) " + item.filterCondition.value + "</span><span class=\"token string\">" + (item.filterValueType.value === 1 ? ("<@" + item.filterColumn.item.summarizeColumn.item.scolumn + "@>") : ("'" + item.filterValue + "' "))}</span>\n`

                //str = str + item.filterColumn.item.summarizeCondition.value + "( " + "\"" + item.filterColumn.item.summarizeTable.label + "\".\"" + item.filterColumn.item.summarizeColumn.item.scolumn + "\" ) " + item.filterCondition.value + " " + item.filterValue;
            } else {

                str = str + `<span class=\"token keyword\">COUNT</span>` +
                    `<span>( </span>` +
                    `<span class=\"token keyword\">${item.filterColumn.item.summarizeCondition.value}</span>` +
                    `<span>${(item.filterColumn.item.summarizeColumn.item.isjsoncolumn ?
                        item.filterColumn.item.summarizeColumn.item.ismultilingual ?
                            " \"" + item.filterColumn.item.summarizeTable.label + "\"." + item.filterColumn.item.summarizeColumn.item.jsoncolumnname + "->'" + item.filterColumn.item.summarizeColumn.item.scolumn + "'->><@" + item.filterColumn.item.summarizeColumn.item.parametername + "@> "
                            : " \"" + item.filterColumn.item.summarizeTable.label + "\"." + item.filterColumn.item.summarizeColumn.item.jsoncolumnname + "->>'" + item.filterColumn.item.summarizeColumn.item.scolumn + "' \""
                        : " \"" + item.filterColumn.item.summarizeTable.label + "\".\"" + item.filterColumn.item.summarizeColumn.item.scolumn + "\"") + " ) " + item.filterCondition.value + "</span><span class=\"token string\"> " + (item.filterValueType.value === 1 ? ("<@" + item.filterColumn.item.summarizeColumn.item.scolumn + "@>") : ("'" + item.filterValue + "' "))}</span>\n`

                // str = str + "COUNT( " + item.filterColumn.item.summarizeCondition.value + " \"" + item.filterColumn.item.summarizeTable.label + "\".\"" + item.filterColumn.item.summarizeColumn.item.scolumn + "\" ) " + item.filterCondition.value + " " + item.filterValue;
            }
            if (index !== selectedRecord['filterSummarize'].length - 1) {
                str = str + `<span class=\"token keyword\">${" " + selectedRecord['filterSummarizeJoinCondition'].value + " "}</span>`
                // str = str + " " + selectedRecord['filterSummarizeJoinCondition'].value + " ";
            }
        })

        if (selectedRecord['sort'] && selectedRecord['sort'].length > 0)
            str = str + `\n<span class=\"token keyword\">ORDER BY</span>\n`

        selectedRecord['sort'] && selectedRecord['sort'].map((item, index1) => {
            if (selectedRecord['sort'].length - 1 !== index1) {

                str = str + `<span>${(item.sortColumn.item.isjsoncolumn ?
                    item.sortColumn.item.ismultilingual ?
                        " \"" + item.sortTable.label + "\"." + item.sortColumn.item.jsoncolumnname + "->'" + item.sortColumn.item.scolumn + "'->><@" + item.sortColumn.item.parametername + "@> "
                        : " \"" + item.sortTable.label + "\"." + item.sortColumn.item.jsoncolumnname + "->>'" + item.sortColumn.item.scolumn + "' "
                    : " \"" + item.sortTable.label + "\".\"" + item.sortColumn.item.scolumn + "\"") + ' '}</span>` +
                    `<span class=\"token keyword\">${item.sortCondition.value}</span>` +
                    `<span>,</span>\n`
            } else {

                str = str + `<span>${(item.sortColumn.item.isjsoncolumn ?
                    item.sortColumn.item.ismultilingual ?
                        " \"" + item.sortTable.label + "\"." + item.sortColumn.item.jsoncolumnname + "->'" + item.sortColumn.item.scolumn + "'->><@" + item.sortColumn.item.parametername + "@> "
                        : " \"" + item.sortTable.label + "\"." + item.sortColumn.item.jsoncolumnname + "->>'" + item.sortColumn.item.scolumn + "' "
                    : " \"" + item.sortTable.label + "\".\"" + item.sortColumn.item.scolumn + "\"") + ' '}</span>` +
                    `<span class=\"token keyword\">${item.sortCondition.value}</span>\n`

            }
        })

        if (((selectedRecord.summarize === undefined)
            || (selectedRecord.summarize && selectedRecord.summarize.length === 0))
            && ((selectedRecord.group === undefined) || (selectedRecord.group
                && selectedRecord.group.length === 0))) {
            if (selectedRecord['Limit'] && selectedRecord['Limit'] !== 0) {

                str = str + `<span class=\"token keyword\">LIMIT ` +
                    `</span><span class=\"token number\">${selectedRecord['Limit']}</span>`

            }

        }
        return str;

    }

    render() {
        //{console.log('sql',this.props.filtersearchRef)}
        const selectedRecord1 = this.state.selectedRecord || {}
        let sortIndex = [];
        const filterParam = {}
        return (
            <div className="client-listing-wrap sql-query-builder-popup ">
                {selectedRecord1 && selectedRecord1.selectedTable ?
                    <>
                        <div className={'columns1 is-marginless is-gapless'}>
                            <aside className={'column1 is-3 is-hidden-touch'}>
                                <section className={'hero has-background-white'}>
                                    <div className={'hero-head'} >
                                        <div className={'container p-0'}>
                                            <div className='media-body p-2'>
                                                <h6 className='border-bottom pb-2 mb-0'>{"Table : "} {selectedRecord1.selectedTable.stabledisplayname}</h6>
                                            </div>
                                            <div className={`card-content py-0 ${(selectedRecord1['group'] &&
                                                selectedRecord1['group'].length > 0) || (selectedRecord1['summarize'] &&
                                                    selectedRecord1['summarize'].length > 0) ? 'is-disabled' : ''}`}>
                                                <div className={'columns1 mb-0'}>
                                                    <div className={'column1 d-flex align-items-center pt-3'}>
                                                        <span className='pr-2 '>
                                                            {'Show'}
                                                        </span>
                                                        {/* <div className={'dropdown1 is-left has-text-weight-light'}> */}
                                                        {/* <FormGroupingComponent
                                                                        name={"scolumnname"}
                                                                        // label={ this.props.intl.formatMessage({ id:"IDS_SCREENRIGHTS" })}                              
                                                                        options={this.state.avaliableColumns || []}
                                                                        optionId="scolumn"
                                                                        optionValue="scolumndisplayname"
                                                                        value={selectedRecord1["scolumnname"] ? selectedRecord1["scolumnname"] || [] : []}
                                                                        isMandatory={false}
                                                                        isClearable={false}
                                                                        disableSearch={false}
                                                                        disabled={false}
                                                                        closeMenuOnSelect={false}
                                                                        alphabeticalSort={true}
                                                                        allItemSelectedLabel={this.props.intl.formatMessage({ id: "IDS_ALLCOLUMNSELECTED" })}
                                                                        noOptionsLabel={this.props.intl.formatMessage({ id: "IDS_NOOPTION" })}
                                                                        searchLabel={this.props.intl.formatMessage({ id: "IDS_SEARCH" })}
                                                                        selectAllLabel={this.props.intl.formatMessage({ id: "IDS_SELECTALL" })}
                                                                        onChange={(event) => this.onComboFieldChange(event, "scolumnname")}

                                                                    /> */}

                                                        <ButtonMultiSelectDropDown
                                                            options={this.state.avaliableColumns || []}
                                                            groupingKey="parentTableIndex"
                                                            groupingDisplayname="stabledisplayname"
                                                            value={selectedRecord1["scolumnname"] ? selectedRecord1["scolumnname"] : []}
                                                            label={"Column Selected"}
                                                            onClick={(event) => this.onComboFieldChange(event, "scolumnname")}
                                                        />


                                                        {/* <FormMultiLevelSelection
                                                                    name={"scolumnname"}
                                                                    // label={ this.props.intl.formatMessage({ id:"IDS_SCREENRIGHTS" })}                              
                                                                    options={this.state.avaliableColumnsForMultiSelect || []}
                                                                    optionId="scolumn"
                                                                    optionValue="scolumndisplayname"
                                                                    value={this.state.selectedRecord["scolumnname0"] ?
                                                                        this.state.selectedRecord["scolumnname0"] || [] : []}
                                                                    isMandatory={true}
                                                                    isClearable={true}
                                                                    disableSearch={false}
                                                                    disabled={false}
                                                                    closeMenuOnSelect={false}
                                                                    alphabeticalSort={true}
                                                                    allItemSelectedLabel={this.props.intl.formatMessage({ id: "IDS_ALLCOLUMNSELECTED" })}
                                                                    noOptionsLabel={this.props.intl.formatMessage({ id: "IDS_NOOPTION" })}
                                                                    searchLabel={this.props.intl.formatMessage({ id: "IDS_SEARCH" })}
                                                                    selectAllLabel={this.props.intl.formatMessage({ id: "IDS_SELECTALL" })}
                                                                    onChange={(event) => this.onComboFieldChange(event, "scolumnname")}

                                                                /> */}
                                                        {/* </div> */}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='card1 height-normal height-xl height-xxd'>
                                                <PerfectScrollbar>
                                                    <div className='card-content pt-3 pb-0'>
                                                        <div className={'columns1 mb-0'}>
                                                            <div className={'column1 pt-3'}>
                                                                <span className='has-text-weight-bold'>{this.props.intl.formatMessage({ id: "IDS_FILTER" })}</span>
                                                                <Button className={'button is-light is-small ml-3'} onClick={(e) => this.onCondition(e, 1)}>
                                                                    <FontAwesomeIcon icon={faPlus} className={'icon'} />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {selectedRecord1['filterSummarize'] && selectedRecord1['filterSummarize'].length > 0 &&
                                                        // this.state.selectedRecord['filterSummarize'].map((item, index) => {
                                                        <div className='card-content pt-3 pb-0 '>
                                                            <div className={'has-text-right-tablet has-text-centered'}>
                                                                <div className={'buttons is-right'}>

                                                                    <span className={"button is-small is-light is-success has-text-weight-bold is-uppercase mr-auto mb-2 ml-0"}>
                                                                        {this.props.intl.formatMessage({ id: "IDS_SUMMARIZATION" })}
                                                                    </span>
                                                                    {/* } */}
                                                                    <Button className="button is-small is-light is-info" onClick={(e) => this.onFilterSummarizeEdit(e)} type="button" tabindex="0">
                                                                        <span className="icon" >
                                                                            {/* <i className="fas fa-pen" aria-hidden="true"></i> */}
                                                                            <FontAwesomeIcon icon={faPen} />
                                                                        </span>
                                                                    </Button>
                                                                    <Button className="button is-small is-light is-danger" onClick={(e) => this.onFilterSummarizeDelete(e)} type="button" tabindex="0">
                                                                        <span className="icon" >
                                                                            {/* <i className="fas fa-times" aria-hidden="true"></i> */}
                                                                            <FontAwesomeIcon icon={faTimes} />
                                                                        </span>
                                                                    </Button>
                                                                    {/* <button className={'button is-light is-small ml-3'} onClick={(e) => this.onFilterEdit(e, index)}>
                                                                        <FontAwesomeIcon icon={faPencilAlt} className={'icon'} />
                                                                    </button> */}
                                                                    {/* <button className={'button is-light is-small ml-3'} onClick={(e) => this.onFilterDelete(e, index)}>
                                                                        <FontAwesomeIcon icon={faTrash} className={'icon'} />
                                                                    </button> */}
                                                                </div>
                                                            </div>
                                                            <div className={'columns1 mb-0'}>
                                                                <div className={'column1 is-10'}>
                                                                    <div className={'field is-grouped is-grouped-multiline is-scrollable'}>
                                                                        {selectedRecord1['filterSummarize'] && selectedRecord1['filterSummarize'].map((item1, index1) => {
                                                                            return <div className={'control'}>
                                                                                <div className={'tags has-addons'}>
                                                                                    <span className={'tag is-light is-success'}>
                                                                                        {item1.filterColumn.item.summarizeCondition.value}
                                                                                    </span>
                                                                                    <span className={'tag is-light is-info'}>
                                                                                        {item1.filterColumn.label}
                                                                                    </span>
                                                                                    <span className={'tag is-light has-text-weight-bold'}>
                                                                                        {item1.filterCondition.value}
                                                                                    </span>
                                                                                    <span className={'tag is-light is-info'}>
                                                                                        {item1.filterValue}
                                                                                    </span>
                                                                                    <span onClick={e => this.onFilterSummarizeChildDelete(e, index1)} className={'tag is-light is-danger is-clickable'}>
                                                                                        <span className={'delete is-small is-marginless'}>
                                                                                            {/* <FontAwesomeIcon icon={faWindowClose} /> */}
                                                                                            <i className="fas fa-times" />
                                                                                        </span>
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        })}

                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                        // })
                                                    }
                                                    {/* filter */}
                                                    {selectedRecord1['filter'] && selectedRecord1['filter'].length > 0 &&
                                                        selectedRecord1['filter'].map((item, index) => {
                                                            return <div className='card-content sql-query-card py-3'>
                                                                <div className={'has-text-right-tablet has-text-centered'}>
                                                                    <div className={'buttons is-right'}>
                                                                        {index > 0 && index !== selectedRecord1['filter'].length &&
                                                                            selectedRecord1['filterJoinCondition'][index] &&

                                                                            <span className={"button is-small is-light is-success has-text-weight-bold is-uppercase mr-auto mb-2 ml-0"}>
                                                                                {selectedRecord1['filterJoinCondition'][index].value}
                                                                            </span>}
                                                                        <Button className="button is-small is-light is-info" onClick={(e) => this.onFilterEdit(e, index)} type="button" tabindex="0">
                                                                            <span className="icon" >
                                                                                {/* <i className="fas fa-pen" aria-hidden="true"></i> */}
                                                                                <FontAwesomeIcon icon={faPen} />
                                                                            </span>
                                                                        </Button>
                                                                        <Button className="button is-small is-light is-danger" onClick={(e) => this.onFilterDelete(e, index)} type="button" tabindex="0">
                                                                            <span className="icon" >
                                                                                {/* <i className="fas fa-times" aria-hidden="true"></i> */}
                                                                                <FontAwesomeIcon icon={faTimes} />
                                                                            </span>
                                                                        </Button>
                                                                        {/* <button className={'button is-light is-small ml-3'} onClick={(e) => this.onFilterEdit(e, index)}>
                                                                        <FontAwesomeIcon icon={faPencilAlt} className={'icon'} />
                                                                    </button> */}
                                                                        {/* <button className={'button is-light is-small ml-3'} onClick={(e) => this.onFilterDelete(e, index)}>
                                                                        <FontAwesomeIcon icon={faTrash} className={'icon'} />
                                                                    </button> */}
                                                                    </div>
                                                                </div>
                                                                <div className={'columns1 mb-0'}>
                                                                    <div className={'column1 is-12'}>
                                                                        <div className={'field is-grouped is-grouped-multiline is-scrollable'}>
                                                                            {item.map((item1, index1) => {
                                                                                return <div className={'control'}>
                                                                                    <div className={'tags has-addons'}>
                                                                                        <span className={'tag is-light is-success'}>
                                                                                            {item1.filterTable.label}
                                                                                        </span>
                                                                                        <span className={'tag is-light is-info'}>
                                                                                            {item1.filterColumn.label}
                                                                                        </span>
                                                                                        <span className={'tag is-light has-text-weight-bold'}>
                                                                                            {item1.filterCondition.value}
                                                                                        </span>
                                                                                        <span className={'tag is-light is-info'}>
                                                                                            {item1.filterValueType.value === 2 ?
                                                                                                item1.filterColumn.item.columndatatype === 'date' ?
                                                                                                    (item1.filterCondition.value === '=' ||
                                                                                                        item1.filterCondition.value === '<' ||
                                                                                                        item1.filterCondition.value === '>'
                                                                                                        || item1.filterCondition.value === 'NOT') ?
                                                                                                        convertDateTimetoStringDBFormat(item1.filterValue, this.props.Login.userInfo)
                                                                                                        : item1.filterValue
                                                                                                    : item1.filterValue :
                                                                                                item1.filterColumn.item.columndatatype === 'date' ?
                                                                                                    "<#" + item1.filterColumn.item.scolumn + "#>" :
                                                                                                    "<@" + item1.filterColumn.item.scolumn + "@>"}
                                                                                        </span>
                                                                                        <span onClick={e => this.onFilterChildDelete(e, index, index1)} className={'tag is-light is-danger is-clickable'}>
                                                                                            <span className={'delete is-small is-marginless'}>
                                                                                                {/* <FontAwesomeIcon icon={faWindowClose} /> */}
                                                                                                <i className="fas fa-times" />
                                                                                            </span>
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            })}

                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        })
                                                    }
                                                    <div className='card-content pt-3 pb-0'>
                                                        <div className={'columns1 mb-0'}>
                                                            <div className={'column1 pt-3'}>
                                                                <span className='has-text-weight-bold'>{this.props.intl.formatMessage({ id: "IDS_JOIN" })}</span>
                                                                <Button className={'button is-light is-small ml-3'} onClick={(e) => this.onCondition(e, 2)}>
                                                                    <FontAwesomeIcon icon={faPlus} className={'icon'} />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* join */}
                                                    {selectedRecord1['TableJoin'] && selectedRecord1['TableJoin'].length > 0 &&
                                                        selectedRecord1['TableJoin'].map((item, index) => {
                                                            return <div className='card-content sql-query-card py-3 '>
                                                                {/* <div className={'has-text-right-tablet has-text-centered'}>
                                                                        <div className={'buttons is-right'}> */}

                                                                {/* {index > 0 && index !== this.state.selectedRecord['filter'].length &&
                                                                                this.state.selectedRecord['filterJoinCondition'][index] && */}

                                                                {/* <span className={"button is-small is-light is-success has-text-weight-bold is-uppercase mr-auto mb-2 ml-0"}>
                                                                                {item['TableJoining'].label}
                                                                            </span> */}
                                                                {/* }*/}
                                                                {/* <button className={'button is-light is-small ml-3'} onClick={(e) => this.onJoinDelete(e, index)}>
                                                                                <FontAwesomeIcon icon={faTrash} className={'icon'} />
                                                                            </button>
                                                                        </div>
                                                                    </div> */}
                                                                <div className={'columns1 mb-0'}>
                                                                    <div className={'column1 is-10 has-text-right-tablet has-text-centered'}>
                                                                        <div className={'field is-grouped is-grouped-multiline is-scrollable'}>
                                                                            <div className={'control'}>
                                                                                <div className={'tags has-addons mb-0'}>
                                                                                    <span className={'tag is-light has-text-weight-bold'}>
                                                                                        {item['TableJoining'].label}
                                                                                    </span>
                                                                                </div>
                                                                                <div className={'column1 is-12'}>
                                                                                    {item.Table.map((item2, index1) => {
                                                                                        return Object.keys(item2).map((item1, index2) => {
                                                                                            if (item1 === 'oldTable') {
                                                                                                return <div className={'tags has-addons mb-0'}>
                                                                                                    <span className={'tag is-light is-success'}>
                                                                                                        {item2[item1].label}
                                                                                                    </span>
                                                                                                    <span className={'tag is-light is-info'}>
                                                                                                        {item2['oldTableColumn'].value}
                                                                                                    </span>
                                                                                                </div>
                                                                                            } else if (item1 === 'newTable') {
                                                                                                return <div className={'tags has-addons mb-0'}>
                                                                                                    <span className={'tag is-light is-success'}>
                                                                                                        {item2[item1].label}
                                                                                                    </span>
                                                                                                    <span className={'tag is-light is-info'}>
                                                                                                        {item2['newTableColumn'].value}
                                                                                                    </span>
                                                                                                </div>
                                                                                            }
                                                                                        })
                                                                                    })
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                            {/* {item.map((item1, index1) => {
                                                                                    return <div className={'control'}>
                                                                                        <div className={'tags has-addons'}>
                                                                                        </div>
                                                                                        <div className={'tags has-addons'}>
                                                                                            <span className={'tag is-light is-success'}>
                                                                                                {item1.filterTable.label}
                                                                                            </span>
                                                                                            <span className={'tag is-light is-info'}>
                                                                                                {item1.filterColumn.value}
                                                                                            </span>
                                                                                            <span className={'tag is-light has-text-weight-bold'}>
                                                                                                {item1.filterCondition.value}
                                                                                            </span>
                                                                                            <span className={'tag is-light is-info'}>
                                                                                                {item1.filterValue}
                                                                                            </span>
                                                                                            <span onClick={e => this.onFilterChildDelete(e, index, index1)} className={'tag is-light is-danger is-clickable'}>
                                                                                                <span className={'delete is-small is-marginless'}>
                                                                                                    <FontAwesomeIcon icon={faWindowClose} />
                                                                                                </span>
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                })} */}

                                                                        </div>
                                                                    </div>
                                                                    <div className={'column1 is-2 has-text-weight-bold pt-3'}>
                                                                        <div className={'buttons is-right'}>
                                                                            <Button className={'button is-small is-light is-danger'} onClick={(e) => this.onJoinTableDelete(e, index)}>
                                                                                <span className='icon'>
                                                                                    {/* <i className="fas fa-times" /> */}
                                                                                    <FontAwesomeIcon icon={faTimes} />
                                                                                </span>
                                                                            </Button>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        })
                                                    }
                                                    {/* Sort */}
                                                    <div className='card-content pt-3 pb-0'>

                                                        {selectedRecord1['sort'] && selectedRecord1['sort'].length > 0 ?
                                                            <div className={'columns1 mb-0'}>
                                                                <div className="column1 is-6 pt-3 has-text-weight-bold">{"Sort"}</div>
                                                                <div className="column1 is-6 has-text-right-tablet has-text-centered">
                                                                    <div className="buttons is-right">
                                                                        <Button className="button is-small is-light is-info" onClick={(e) => { this.onSortEdit(e) }} type="button" tabindex="0">
                                                                            <span className="icon" >
                                                                                {/* <i className="fas fa-pen" aria-hidden="true"></i> */}
                                                                                <FontAwesomeIcon icon={faPen} />
                                                                            </span>
                                                                        </Button>
                                                                        <Button className="button is-small is-light is-danger" onClick={(e) => this.onSortDelete(e)} type="button" tabindex="0">
                                                                            <span className="icon" >
                                                                                {/* <i className="fas fa-times" aria-hidden="true"></i> */}
                                                                                <FontAwesomeIcon icon={faTimes} />
                                                                            </span>
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            :
                                                            <div className={'columns1 mb-0'}>
                                                                <div className={'column1  pt-3'}>
                                                                    <span className='has-text-weight-bold'>{this.props.intl.formatMessage({ id: "IDS_SORT" })}</span>
                                                                    <Button className={'button is-light is-small ml-3'} onClick={(e) => this.onCondition(e, 3)}>
                                                                        <FontAwesomeIcon icon={faPlus} className={'icon'} />
                                                                    </Button>
                                                                </div>
                                                            </div>


                                                        }
                                                    </div>

                                                    {selectedRecord1['sort'] && selectedRecord1['sort'].length > 0 &&

                                                        <div className='card-content sql-query-card py-3'>
                                                            <div className="field is-grouped is-grouped-multiline is-scrollable ">
                                                                {selectedRecord1['sort'] && selectedRecord1['sort'].map((item, index) => {
                                                                    return <div className="control">
                                                                        <div className="tags has-addons">
                                                                            <span className="tag is-light is-info">{item.sortTable && item.sortTable.label}</span>
                                                                            <span className="tag is-light is-success">{item.sortColumn && item.sortColumn.label}</span>
                                                                            <span className="tag is-light">{item.sortCondition && item.sortCondition.value}</span>
                                                                            <span className="tag is-light is-danger is-clickable" tabindex="0" onClick={(e) => { this.onSortChildDelete(e, index) }}>
                                                                                <span className="delete is-small is-marginless"></span>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                })
                                                                }
                                                            </div>
                                                        </div>
                                                    }

                                                    {/* Summarize */}
                                                    <div className='card-content pt-3 pb-0 '>
                                                        {selectedRecord1['summarize'] && selectedRecord1['summarize'].length > 0 ?
                                                            <div className={'columns1 mb-0'}>
                                                                <div className="column1 is-6 has-text-weight-bold pt-3">{"Summarize"}</div>
                                                                <div className="column1 is-6 has-text-right-tablet has-text-centered">
                                                                    <div className="buttons is-right">
                                                                        <Button className="button is-small is-light is-info" onClick={(e) => this.onSummarizeEdit(e)} type="button" tabindex="0">
                                                                            <span className="icon" >
                                                                                {/* <i className="fas fa-pen" aria-hidden="true"></i> */}
                                                                                <FontAwesomeIcon icon={faPen} />
                                                                            </span>
                                                                        </Button>
                                                                        <Button className="button is-small is-light is-danger" onClick={(e) => this.onSummarizeDelete(e)} type="button" tabindex="0">
                                                                            <span className="icon" >
                                                                                <FontAwesomeIcon icon={faTimes} />
                                                                                {/* <i className="fas fa-times" aria-hidden="true"></i> */}
                                                                            </span>
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            :
                                                            <div className={'columns1 mb-0'}>
                                                                <div className={'column1 pt-3'}>
                                                                    <span className='has-text-weight-bold'>{this.props.intl.formatMessage({ id: "IDS_SUMMARIZE" })}</span>
                                                                    <Button className={'button is-light is-small ml-3'} onClick={(e) => this.onCondition(e, 4)}>
                                                                        <FontAwesomeIcon icon={faPlus} className={'icon'} />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                    {selectedRecord1['summarize'] && selectedRecord1['summarize'].length > 0 &&
                                                        <div className='card-content sql-query-card py-3'>
                                                            <div className="field is-grouped is-grouped-multiline is-scrollable">
                                                                {selectedRecord1['summarize'] && selectedRecord1['summarize'].map((item, index) => {
                                                                    return <div className="control">
                                                                        <div className="tags has-addons">
                                                                            <span className="tag is-light is-info">{item.summarizeTable && item.summarizeTable.label}</span>
                                                                            <span className="tag is-light is-success">{item.summarizeColumn && item.summarizeColumn.label}</span>
                                                                            <span className="tag is-light">{item.summarizeCondition && item.summarizeCondition.value}</span>
                                                                            <span className="tag is-light is-danger is-clickable" tabindex="0" onClick={(e) => this.onSummarizeChildDelete(e, index)}>
                                                                                <span className="delete is-small is-marginless"></span>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                })
                                                                }
                                                            </div>
                                                        </div>
                                                    }


                                                    {/* Groupby */}
                                                    <div className='card-content pt-3 pb-0 '>

                                                        {selectedRecord1['group'] && selectedRecord1['group'].length > 0 ?
                                                            <div className={'columns1 mb-0'}>
                                                                <div className="column1 is-6 pt-3 has-text-weight-bold">{"Group By"}</div>
                                                                <div className="column1 is-6 has-text-right-tablet has-text-centered">
                                                                    <div className="buttons is-right">
                                                                        <Button className="button is-small is-light is-info" onClick={(e) => this.onGroupEdit(e)} type="button" tabindex="0">
                                                                            <span className="icon" >
                                                                                {/* <i className="fas fa-pen" aria-hidden="true"></i> */}
                                                                                <FontAwesomeIcon icon={faPen} />
                                                                            </span>
                                                                        </Button>
                                                                        <Button className="button is-small is-light is-danger" onClick={(e) => this.onGroupDelete(e)} type="button" tabindex="0">
                                                                            <span className="icon" >
                                                                                <FontAwesomeIcon icon={faTimes} />
                                                                                {/* <i className="fas fa-times" aria-hidden="true"></i> */}
                                                                            </span>
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            :
                                                            <div className={'columns1 mb-0'}>
                                                                <div className={'column1 pt-3'}>
                                                                    <span className='has-text-weight-bold'>{this.props.intl.formatMessage({ id: "IDS_GROUPBY" })}</span>
                                                                    <Button className={'button is-light is-small ml-3'} onClick={(e) => this.onCondition(e, 5)}>
                                                                        <FontAwesomeIcon icon={faPlus} className={'icon'} />
                                                                    </Button>
                                                                </div>
                                                            </div>


                                                        }
                                                    </div>
                                                    {selectedRecord1['group'] && selectedRecord1['group'].length > 0 &&
                                                        <div className="field is-grouped is-grouped-multiline is-scrollable">
                                                            {selectedRecord1['group'] && selectedRecord1['group'].map((item, index) => {
                                                                return <div className='card-content sql-query-card py-3'>
                                                                    <div className="control">
                                                                        <div className="tags has-addons">
                                                                            <span className="tag is-light is-info">{item.groupTable && item.groupTable.label}</span>
                                                                            <span className="tag is-light is-success">{item.groupColumn && item.groupColumn.label}</span>
                                                                            {/* <span className="tag is-light has-text-weight-bold">{item.sortCondition && item.sortCondition.value}</span> */}
                                                                            <span className="tag is-light is-danger is-clickable" tabindex="0" onClick={(e) => { this.onGroupChildDelete(e, index) }}>
                                                                                <span className="delete is-small is-marginless"></span>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            })
                                                            }
                                                        </div>
                                                    }

                                                    <div className={`card-content pt-3 pb-0 ${(selectedRecord1['group'] &&
                                                        selectedRecord1['group'].length > 0) || (selectedRecord1['summarize'] &&
                                                            selectedRecord1['summarize'].length > 0) ? 'is-disabled' : ''}`}>
                                                        {selectedRecord1['Limit'] && selectedRecord1['Limit'] !== 0 ?
                                                            <div className={'columns1 mb-0'}>
                                                                <div className="column1 is-6 pt-3">{"Limit"}</div>
                                                                <div className="column1 is-6 has-text-right-tablet has-text-centered">
                                                                    <div className="buttons is-right">
                                                                        <Button className="button is-small is-light is-info" onClick={(e) => this.onLimitEdit(e)} type="button" tabindex="0">
                                                                            <span className="icon" >
                                                                                {/* <i className="fas fa-pen" aria-hidden="true"></i> */}
                                                                                <FontAwesomeIcon icon={faPen} />
                                                                            </span>
                                                                        </Button>
                                                                        <Button className="button is-small is-light is-danger" onClick={(e) => this.onLimitDelete(e)} type="button" tabindex="0">
                                                                            <span className="icon" >
                                                                                <FontAwesomeIcon icon={faTimes} />
                                                                                {/* <i className="fas fa-times" aria-hidden="true"></i> */}
                                                                            </span>
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            :
                                                            <div className={'columns1 mb-0'}>
                                                                <div className={'column1 pt-3'}>
                                                                    <span className='has-text-weight-bold'>{this.props.intl.formatMessage({ id: "IDS_LIMIT" })}</span>
                                                                    <Button className={'button is-light is-small ml-3'} onClick={(e) => this.onCondition(e, 6)}>
                                                                        <FontAwesomeIcon icon={faPlus} className={'icon'} />
                                                                    </Button>
                                                                </div>
                                                            </div>


                                                        }
                                                    </div>
                                                    {selectedRecord1['Limit'] && selectedRecord1['Limit'] !== 0 &&
                                                        <div className='card-content sql-query-card py-3'>
                                                            <div className="field is-grouped is-grouped-multiline is-scrollable">
                                                                <div className="control">
                                                                    <div className="tags has-addons">
                                                                        <span className="tag is-light is-info">{"Limit"}</span>
                                                                        <span className="tag is-light is-success">{selectedRecord1['Limit']}</span>
                                                                        {/* <span className="tag is-light has-text-weight-bold">{item.sortCondition && item.sortCondition.value}</span> */}
                                                                        {/* <span className="tag is-light is-danger is-clickable" tabindex="0" onClick={(e) => { this.onSortChildDelete(e, index) }}>
                                                                            <span className="delete is-small is-marginless"></span>
                                                                        </span> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }

                                                </PerfectScrollbar>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </aside>
                            {/* has-overflow-vertical-auto */}
                            <div className={'column1 is-hidden-touch sql-query-block'}>
                                <div className={'column1 is-narrow'}>
                                    <div className={'hero-body'}>
                                        {/* <Card className={'h-100'} style={{ 'height': '100px' }}> */}
                                        <div className={'box has-background-dark p-2 mb-3'} id="code-display">
                                            <span className={'icon delete closetable is-marginless'} onClick={(e) => this.onClose(e)}>
                                                <i className="fas fa-times" />
                                            </span>
                                            <pre className="language-sql overflow-vertical">
                                                <PerfectScrollbar>
                                                    <code className="language-sql" dangerouslySetInnerHTML={{ __html: this.queryDesignFormation(selectedRecord1, this.state.avaliableColumns) }} />

                                                </PerfectScrollbar>
                                            </pre>
                                        </div>
                                        <div className='buttons is-right'>
                                            <Button className='btn-user btn-primary-blue' onClick={() => this.onDownloadClick(selectedRecord1, this.state.avaliableColumns)}>
                                                <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>
                                                {'  '}
                                                {this.props.intl.formatMessage({ id: "IDS_DOWNLOADSQL" })}
                                            </Button>
                                            <Button className='btn-user btn-primary-blue' onClick={(e) => this.copyToClipboard()}>
                                                <FontAwesomeIcon className='' icon={faCopy}></FontAwesomeIcon>{'  '}
                                                {this.props.intl.formatMessage({ id: "IDS_COPYSQL" })}
                                            </Button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div >
                        {
                            this.state.showFilter ?
                                <FilterCondition
                                    modalBody={this.modalDesign()}
                                    openAlertModal={this.state.showFilter}
                                    modalTitle={this.state.filterTitle}
                                    closeModal={this.closeAlertModal}
                                    onSaveClick={(e) => this.executeClick(e)}
                                    executeCenter={true}
                                />
                                : ""
                        }
                    </>
                    :

                    <ListWrapper className="client-listing-wrap ">
                        <Row noGutters={true}>
                            <Col md={3}>

                                <ListComponent
                                    onClick={this.onClickTable}
                                    data={this.props.tableName || []}
                                    searchRef={this.props.filtersearchRef}
                                    // titleHead={true}
                                    titleHead={this.props.intl.formatMessage({ id: "IDS_TABLES" })}
                                    headerName={this.props.intl.formatMessage({ id: "IDS_TABLES" })}
                                />

                            </Col>
                            <Col md={9}>
                                <div className={'tableright d-flex align-items-center justify-content-center'}>
                                    <div>
                                        <span>
                                            <FontAwesomeIcon icon={faTable} size='lg' className={'fa-7x tableColor'} />
                                        </span>
                                        <h3 className='font-weight-bold ' style={{ 'padding': '20px' }}>
                                            {this.props.intl.formatMessage({ id: "IDS_PLEASESELECTATABLE" })}
                                        </h3>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </ListWrapper>
                }
            </div>

        )
    }





}
const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}
export default connect(mapStateToProps, {})(injectIntl(SqlBuilderNewDesign));