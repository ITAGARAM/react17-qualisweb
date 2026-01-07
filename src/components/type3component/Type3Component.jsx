import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../components/data-grid/data-grid.component';
import Esign from '../../pages/audittrail/Esign';
import SlideOutModal from '../slide-out-modal/SlideOutModal';
import { getFieldSpecification } from './Type3FieldSpecificationList';
import AddType3Component from './AddType3Component';
import BGSITransferView from './BGSITransferView';
import { callService, crudMaster, updateStore, validateEsignCredential, fetchRecordCombo, onComboLoad, onServiceLoad, syncAction } from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { showEsign, getControlMap, extractFieldHeader, formatInputDate, validateEmail, rearrangeDateFormatDateOnly } from '../CommonScript';
import { ListWrapper } from '../client-group.styles';
import { transactionStatus, designComponents, formCode } from '../Enumeration';
import ConfirmMessage from "../../components/confirm-alert/confirm-message.component";
import Tree from 'react-tree-graph';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class Type3Component extends React.Component {

    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.extractedColumnList = [];
        this.extractedColumnList1 = [];
        this.extractedDataGridColumnList = []; // ALPD-3660 VISHAKH
        this.fieldList = [];

        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            data: [], masterStatus: "", error: "", selectedRecord: {},
            dataResult: [],
            dataViewResult: [],
            dataState: dataState,
            userRoleControlRights: [],
            controlMap: new Map(),
        };
        this.confirmMessage = new ConfirmMessage();
    }

    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data ? this.state.data : [], event.dataState),
            dataState: event.dataState
        });

        
    }

    openModal = (ncontrolCode) => {

        let comboColumnField = [];
        this.extractedColumnList.map(item => {
            if (item.ndesigncomponentcode === designComponents.COMBOBOX) {
                comboColumnField.push(item);
            }
            else if (item.ndesigncomponentcode === designComponents.CHECKBOX) {
                comboColumnField.push(item);
            }
        })
        this.props.onComboLoad("create", this.props.Login.userInfo, this.props.Login.inputParam, ncontrolCode, comboColumnField, this.props.Login.integrationSettings);
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let selectedId = this.props.Login.selectedId;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation == "sync" || this.props.Login.operation === "default") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            }
            else {

                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason'] = ""
            }
        }
        else {
            openModal = false;
            selectedRecord = {};
            selectedId = null;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                openModal, loadEsign, selectedRecord,
                //selectedId:null 
                selectedId
            }
        }
        this.props.updateStore(updateInfo);

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

    // fnextractedColumnList  =()=>
    // {
    //    // return this.extractedColumnList = this.extractedColumnList1 || [];

    //     this.extractedColumnList1 = this.extractedColumnList;
    //     if(item.child){
    //         this.extractedColumnList.map((values, index)=>{
    //             if( values.dataField == item.childdatafield )
    //                 {
    //                     //this.extractedColumnList[index]['fieldLength']= value.toString();
    //                     this.extractedColumnList[index]['fieldLength']= value;
    //                 }
    //         //console.log(value, index);
    //     })
    //         }
    // }
countNodes = (node) => {
        if (!node) return 0;
        return 1 + (node.children ? node.children.reduce((sum, child) => sum + this.countNodes(child), 0) : 0);
        };


    render() {
        let primaryKeyField = "";
        let fieldList = {};
        let inputData = {
            settings: this.props.Login.settings,
            userInfo: this.props.Login.userInfo
        };
        
        let totalNodes = this.state.formattedTree ? this.countNodes(this.state.formattedTree) : 0;
        let dynamicHeight = totalNodes * 25;

        const addId = this.props.Login.inputParam && this.state.controlMap.has("Add".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Add".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        {/* Ate234 janakumar -> BGSI-7 Screen Name -> Project And Site Hierarchy Mapping -> View tree was site hierarchy screen deisgn */}
        const treeViewId = this.props.Login.inputParam && this.state.controlMap.has("TreeView".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("TreeView".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

            
        if (this.props.Login.inputParam !== undefined) {

            if (this.props.Login.inputParam.classUrl === "limselnusermapping") {
                fieldList = getFieldSpecification(inputData).get(this.props.Login.inputParam.methodUrl) || [];
                // fieldList.forEach(item=>item.dataField === "username" ? 
                //     fieldList.push("methodUrl:"+this.props.Login.integrationSettings[0].smethodname) :""
                // );  
                for (let index = 0; index < fieldList.length; index++) {
                    if (fieldList[index].elnget) {
                        let smethodname = "methodUrl";
                        let fieldListNew = { ...fieldList[index], methodUrl: this.props.Login.integrationSettings[0].smethodname, classUrl: this.props.Login.integrationSettings[0].sclassurlname };
                        // fieldList.slice(index)
                        //fieldList.push((fieldList[index]).toString())
                        //this.state.selectedRole.push((selectedRecord[index]).toString());
                        fieldList.splice(index, 1, fieldListNew)
                    }
                }
                this.extractedColumnList = extractFieldHeader(Object.values(fieldList));
                primaryKeyField = Object.keys(fieldList).length > 0 ? fieldList[0].dataField : "";
            }

            else if (this.props.Login.inputParam.classUrl === "limselnsitemapping") {
                fieldList = getFieldSpecification(inputData).get(this.props.Login.inputParam.methodUrl) || [];
                // fieldList.forEach(item=>item.dataField === "username" ? 
                //     fieldList.push("methodUrl:"+this.props.Login.integrationSettings[0].smethodname) :""
                // );  
                for (let index = 0; index < fieldList.length; index++) {
                    if (fieldList[index].elnget) {
                        let smethodname = "methodUrl";
                        let fieldListNew = { ...fieldList[index], methodUrl: this.props.Login.integrationSettings[1].smethodname, classUrl: this.props.Login.integrationSettings[1].sclassurlname };
                        // fieldList.slice(index)
                        //fieldList.push((fieldList[index]).toString())
                        //this.state.selectedRole.push((selectedRecord[index]).toString());
                        fieldList.splice(index, 1, fieldListNew)
                    }
                }
                this.extractedColumnList = extractFieldHeader(Object.values(fieldList));
                primaryKeyField = Object.keys(fieldList).length > 0 ? fieldList[0].dataField : "";
            }
            else {
                fieldList = getFieldSpecification(inputData).get(this.props.Login.inputParam.methodUrl) || [];
                this.extractedColumnList = extractFieldHeader(Object.values(fieldList));
                //this.expandedField= expandedField(Object.values(fieldList));
                primaryKeyField = Object.keys(fieldList).length > 0 ? fieldList[0].dataField : "";
            }
            // START ALPD-3660 VISHAKH
            let dataGridList = [...this.extractedColumnList];
            this.extractedDataGridColumnList = dataGridList.filter(item =>
                !("dataGridColumnHide" in item && item["dataGridColumnHide"] === true)
            );
            // END ALPD-3660 VISHAKH
        }

        const editId = this.props.Login.inputParam && this.state.controlMap.has("Edit".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Edit".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

    const viewId = this.props.Login.inputParam && this.state.controlMap.has("View".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("View".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const editParam = {
            screenName: this.props.Login.inputParam && this.props.Login.inputParam.displayName && this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
            operation: "update", primaryKeyField,
            inputParam: this.props.Login.inputParam,
            integrationSettings: this.props.Login.integrationSettings,
            userInfo: this.props.Login.userInfo,
            ncontrolCode: editId,
            masterData: this.props.Login.masterData,
            extractedColumnList: this.extractedColumnList
        };
        {/* Ate234 janakumar -> BGSI-7 Screen Name -> Project And Site Hierarchy Mapping -> View tree was site hierarchy screen deisgn */}

        const treeViewParam = {
            screenName: this.props.Login.inputParam && this.props.Login.inputParam.displayName &&
                this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
            operation: "treeView", primaryKeyField,
            inputParam: this.props.Login.inputParam,
            integrationSettings: this.props.Login.integrationSettings,
            userInfo: this.props.Login.userInfo,
            ncontrolCode: treeViewId,
            masterData: this.props.Login.masterData,
            extractedColumnList: this.extractedColumnList
        };

        const viewParam = {
             screenName: this.props.Login.inputParam && this.props.Login.inputParam.displayName &&
                 this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
            // screenName: this.props.Login.inputParam && this.props.Login.inputParam.displayName &&
            //     this.props.intl.formatMessage({ id: "IDS_SAMPLEDETAILS" }),
            operation: "view", primaryKeyField,
            inputParam: this.props.Login.inputParam,
            integrationSettings: this.props.Login.integrationSettings,
            userInfo: this.props.Login.userInfo,
            ncontrolCode: viewId,
            masterData: this.props.Login.masterData,
            extractedColumnList: this.extractedColumnList
        };
        const deleteParam = { operation: "delete" };
        const switchParam = { operation: "default", masterData: this.props.Login.masterData };
        const mandatoryFields = [];
        this.extractedColumnList.forEach(item => item.mandatory === true ?
            mandatoryFields.push(item) : ""
        );

        return (<>
            <Row>
                <Col>
                    <ListWrapper className="client-list-content">


                        {this.state.data ?
                            <DataGrid
                                primaryKeyField={primaryKeyField}
                                data={this.state.data}
                                dataResult={this.state.dataResult}
                                dataState={this.state.dataState}
                                dataStateChange={this.dataStateChange}
                                extractedColumnList={this.extractedDataGridColumnList} // ALPD-3660 VISHAKH
                                detailedFieldList={this.expandedField || []}
                                expandField="expanded"
                                controlMap={this.state.controlMap}
                                userRoleControlRights={this.state.userRoleControlRights}
                                inputParam={this.props.Login.inputParam}
                                userInfo={this.props.Login.userInfo}
                                fetchRecord={this.props.fetchRecordCombo }
                                viewRecord={this.props.viewParam}
                                editParam={editParam}
                                treeView={treeViewParam}
                                viewParam={viewParam}
                                deleteRecord={this.deleteRecord}
                                deleteParam={deleteParam}
                                reloadData={this.reloadData}
                                syncData={this.syncData}
                                addRecord={() => this.openModal(addId)}
                                pageable={true}
                                scrollable={'scrollable'}
                                // isComponent={true}
                                gridHeight={'580px'}
                                isActionRequired={true}
                                isToolBarRequired={true}
                                selectedId={this.props.Login.selectedId}
                                onToggleChange={this.toggleSwitch}
                                switchParam={switchParam}
                                groupable={this.props.Login.displayName === 'Material Accounting Plant Group' ? true : false}
                                settings={this.props.Login.settings}

                            />
                            : ""}
                    </ListWrapper>
                </Col>
            </Row>

            {/* Below Condition Added to avoid unwanted rendering of SlideOut */}
            {/* Ate234 janakumar -> BGSI-7 Screen Name -> Project And Site Hierarchy Mapping -> View tree was site hierarchy screen deisgn */}
            {this.props.Login.openModal ?
                <SlideOutModal
                    size={this.props.Login.operation === "treeView" ? 'xl' : 'lg'}
                    show={this.props.Login.openModal}
                    closeModal={this.closeModal}
                    hideSave={this.props.Login.operation === "treeView" || this.props.Login.operation === "view" ? true : false}
                    showSaveContinue={this.props.Login.operation === "treeView" || this.props.Login.operation === "view" ? false : true} //ALPD-5063 added by Dhanushya RI,Enable save and continue option in Type3 component based screen
                    operation={this.props.Login.operation === "treeView" || this.props.Login.operation === "view" ? "" : this.props.Login.operation}
                    inputParam={this.props.Login.inputParam}
                    screenName={this.props.Login.screenName}
                    onSaveClick={this.onSaveClick}
                    esign={this.props.Login.loadEsign}
                    validateEsign={this.validateEsign}
                    masterStatus={this.props.Login.masterStatus}
                    updateStore={this.props.updateStore}
                    selectedRecord={this.state.selectedRecord || {}}
                    mandatoryFields={mandatoryFields}
                    // addComponentParam={{}}                   
                    // addComponent={this.addComponent}
                    addComponent={this.props.Login.loadEsign ?
                        <Esign operation={this.props.Login.operation}
                            onInputOnChange={this.onInputOnChange}
                            inputParam={this.props.Login.inputParam}
                            selectedRecord={this.state.selectedRecord || {}}
                        />
                        : this.props.Login.operation !== "treeView" && this.props.Login.operation !== "view"?
                            <AddType3Component
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                extractedColumnList={this.extractedColumnList}
                                onNumericInputOnChange={this.onNumericInputOnChange}
                                onComboChange={this.onComboChange}
                                handleDateChange={this.handleDateChange}
                                userInfo={this.props.Login.userInfo}
                                dataList={this.props.Login.dataList}
                                operation={this.props.Login.operation}

                            /> : this.props.Login.operation === "view" ?
                            <BGSITransferView
                                selectedRecord={this.props.Login.selectedRecord || {}}
                                userInfo={this.props.Login.userInfo}
                                bgsiTransferData={this.props.Login.bgsiTransferRecord}
                                dataResult={this.state.dataViewResult}
                                dataState={this.state.dataState}
                                dataStateChange={this.dataStateChange}
                                operation={this.props.Login.operation}
                                controlMap={this.state.controlMap}
                                userRoleControlRights={this.state.userRoleControlRights}
                                inputParam={this.props.Login.inputParam}
                                reloadData={this.reloadData}
                            />:
                            //Ate234 janakumar -> BGSI-7 Screen Name -> Project And Site Hierarchy Mapping -> View tree was site hierarchy screen deisgn 
                            this.state.formattedTree ? (
                                <Tree
                                    key={this.state.formattedTree.name}
                                    data={this.state.formattedTree}
                                    renderCustomNodeElement={this.renderWrappedText}
                                    orientation="horizontal"
                                    height={dynamicHeight}
                                    width={1000}
                                    duration={800}
                                    animated
                                    svgProps={{
                                        className: 'custom',
                                        onClick: this.handleClick,
                                    }}
                                />
                            ) : (
                                <p>Loading tree...</p>
                            )

                    }
                />
                : ""}

        </>
        );
    }

    renderWrappedText = ({ nodeDatum }) => (
        <g>
            <circle r={15} fill="pink" />
            <text fill="black" x={20}>
                {nodeDatum.name.split(" ").map((word, i) => (
                    <tspan key={i} x="20" dy={i === 0 ? "0" : "1.2em"}>
                        {word}
                    </tspan>
                ))}
            </text>
        </g>
    );

    //Ate234 janakumar -> BGSI-7 Screen Name -> Project And Site Hierarchy Mapping -> View tree was site hierarchy screen deisgn 
    handleClick = (e) => {
        const nodeName = e.target.textContent;
        const cloned = JSON.parse(JSON.stringify([this.props.Login.treeViewRecord.jsondata])); // deep copy
        // updateNode(cloned, nodeName);
        //setTreeData(cloned);
    };

    convertToTreeGraphFormat = (node) => {
        return {
            name: node.key,
            children: node.nodes?.map(this.convertToTreeGraphFormat) || [],
            textProps: { x: 0, y: 10 },
        };
    };

    componentDidUpdate(previousProps) {
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                if (this.props.Login.inputParam.methodUrl === 'Purge' || this.props.Login.inputParam.methodUrl === 'RestoreMaster') {
                    for (let i = 0; i < this.props.Login.masterData.length; i++) {
                        //data.push(this.props.UserData[i].jsonuidata);
                        this.props.Login.masterData[i].stodate = rearrangeDateFormatDateOnly(this.props.Login.userInfo,
                            this.props.Login.masterData[i].stodate);
                        this.props.Login.masterData[i].smodifieddate = rearrangeDateFormatDateOnly(this.props.Login.userInfo,
                            this.props.Login.masterData[i].smodifieddate);
                    }
                }
                this.setState({
                    userRoleControlRights, controlMap, data: this.props.Login.masterData,
                    dataResult: process(this.props.Login.masterData ? this.props.Login.masterData : [], this.state.dataState),
                });
            } else {
                let { dataState } = this.state;
                if (this.props.Login.dataState === undefined) {
                    dataState = { skip: 0, take: this.state.dataState.take }
                }
                if (this.state.dataResult.data) {
                    if (this.state.dataResult.data.length === 1) {
                        let skipcount = this.state.dataState.skip > 0 ? (this.state.dataState.skip - this.state.dataState.take) :
                            this.state.dataState.skip
                        dataState = { skip: skipcount, take: this.state.dataState.take }
                    }
                }
                if (this.props.Login.masterData.length > 0) {
                    if (this.props.Login.inputParam.methodUrl === 'Purge' || this.props.Login.inputParam.methodUrl === 'RestoreMaster') {
                        for (let i = 0; i < this.props.Login.masterData.length; i++) {
                            //data.push(this.props.UserData[i].jsonuidata);
                            this.props.Login.masterData[i].stodate = rearrangeDateFormatDateOnly(this.props.Login.userInfo,
                                this.props.Login.masterData[i].stodate);
                            this.props.Login.masterData[i].smodifieddate = rearrangeDateFormatDateOnly(this.props.Login.userInfo,
                                this.props.Login.masterData[i].smodifieddate);
                        }
                    }
                }
                this.setState({
                    data: this.props.Login.masterData, selectedRecord: this.props.Login.selectedRecord,
                    dataResult: process(this.props.Login.masterData ? this.props.Login.masterData : [], dataState),
                    dataState
                              

                });
            }
        }

        //Ate234 janakumar -> BGSI-7 Screen Name -> Project And Site Hierarchy Mapping -> View tree was site hierarchy screen deisgn 

        if (this.props.Login.treeViewRecord !== undefined && this.props.Login.treeViewRecord !== previousProps.Login.treeViewRecord) {
            let treeData = this.props.Login.treeViewRecord && this.props.Login.treeViewRecord && this.props.Login.treeViewRecord.jsondata;
            if (treeData !== undefined) {
                const formattedTree = treeData && this.convertToTreeGraphFormat(treeData) || {};
                this.setState({ formattedTree: formattedTree })
            }
        }

        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            let { dataState } = this.state;

              if (this.props.Login.dataState === undefined) {
                    dataState = { skip: 0, take: this.state.dataState.take }
                }
                if (this.state.dataResult.data) {
                    if (this.state.dataResult.data.length === 1) {
                        let skipcount = this.state.dataState.skip > 0 ? (this.state.dataState.skip - this.state.dataState.take) :
                            this.state.dataState.skip
                        dataState = { skip: skipcount, take: this.state.dataState.take }
                    }
                }
        //   if (this.props.Login.selectedRecord.length>0) {
        //           this.setState({                     
        //             dataViewResult: process(this.props.Login.selectedRecord ? this.props.Login.selectedRecord : [], dataState),
        //     dataState
        //          });
        //   }
            //Get selected value when clicking edit button
            if (this.props.Login.selectedRecord) {
                this.setState({ selectedRecord: this.props.Login.selectedRecord
                    
                    
                 });
            }

             
        }
    }

    custombuttonclick = (event, component) => {
        event.preventDefault();
        event.stopPropagation();
        const inputparam = {
            component, userinfo: this.props.Login.userInfo,
            selectedRecord: this.state.selectedRecord
        }
        this.props.getDynamicFilter(inputparam)
    }

    onInputOnChange = (event, item) => {
        const selectedRecord = this.state.selectedRecord || {};
        let value = event.target.value;
        if (item && item.zeroNotAllowed && item.zeroNotAllowed && value === '0') {
            value = "";
        }

        //Added By Sujatha for SWSM-8 on 02/8/2025
         if (item && item.noAlphabets === true) {   
            value = value.replace(/[^0-9+\-()]/g, '');
         }

        if (item && item.isaplhabet && item.isaplhabet === true) {
            // const isalphabet = /^[A-Z]+$/.test(value);
            // BGSI-77 Modifed regex code to avoid value clear when given wrong value by Vishakh (19/09/2025)
            value = value.replace(/[^A-Z_]/g, '')
            // if (isalphabet === false) {
            //     value = "";
            // }
        }
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
        }
        else {

            if (item && item.isSynonymNeed) {
                // selectedRecord[event.target.name] = selectedRecord[item.ssynonymname] = event.target.value;
                selectedRecord[event.target.name] = selectedRecord[item.ssynonymname] = value;
            }
            else {
                // selectedRecord[event.target.name] = event.target.value;
                selectedRecord[event.target.name] = value;
            }
        }
        if (event.target.type === 'textbox') {
            selectedRecord[item.existinglength] = true
        }
        if (item && item.readOnlyChild) {
            // selectedRecord[item.readOnlyChild] = event.target.value;
            selectedRecord[item.readOnlyChild] = value;
        }

        this.setState({ selectedRecord });
    }

    onComboChange = (comboData, fieldName, comboItem) => {
        const selectedRecord = this.state.selectedRecord || {};

        if (comboData !== null) {
            if (comboItem.foreignDataField) {
                selectedRecord[comboItem.foreignDataField] = comboData.value;
            }

        }
        selectedRecord[fieldName] = comboData;
        if (comboItem.readOnlyChild) {
            selectedRecord[comboItem.readOnlyChild] = comboData.item[comboItem.readOnlyParentData];
        }
        if (comboItem.onChangeUrl != undefined) {
            const dataList = {
                ...this.props.Login.dataList
            }
            // let inputData={
            //     primarykeyvalue: parseInt(comboData.value),
            // }

            let inputData = { dataList, selectedRecord };

            let comboColumnField = [];
            let primarykeyvalue = {};
            primarykeyvalue[comboItem.tableDataField] = comboData.value;
            this.extractedColumnList.map(item => {
                if (item.onChangeUrl != undefined) {
                    if (item.ndesigncomponentcode === designComponents.COMBOBOX) {
                        if (item.tableDataField === comboItem.tableDataField) {
                            comboColumnField.push(item);
                        }
                    }
                }
            })
            this.props.onServiceLoad(this.props.Login.userInfo, this.props.Login.inputParam, this.props.Login.ncontrolCode, comboColumnField, primarykeyvalue, inputData);
        } else {
            this.setState({ selectedRecord });
        }
    }



    handleDateChange = (dateName, dateValue, item) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });

    }


    onNumericInputOnChange = (value, name, item) => {

        const selectedRecord = this.state.selectedRecord || {};
        if (item.zeroNotAllowed && item.zeroNotAllowed && value === 0) {
            value = "";
        }
        if (item.child) {
            if (item.min >= value && value !== 0 || item.max >= value && value !== 0) {
                selectedRecord.ncodelength = value;
            }
            selectedRecord[item.childdatafield] && delete selectedRecord[item.childdatafield];
        }
        // Start - Added by Abdul for BGSI-5 on 01/07/2025
        if (item.min) {
            if (item.min > value) {
                value = ""
            }
            selectedRecord[name] = value;
        }
        if (item.max) {
            if (value > item.max) {
                value = ""
            }
            selectedRecord[name] = value;
        }
        // End - BGSI-5 
        else if (item && item.maxValue) {
            //added by vignesh for Sample Storage Structure row column max value
            if (this.props.Login.settings[39] && parseInt(this.props.Login.settings[39]) >= value) {
                selectedRecord[name] = value;
            }
        }
        else {
            selectedRecord[name] = value;

        }
        this.setState({ selectedRecord });

    }

    toggleSwitch = (switchParam, item, event) => {

        let dataItem = { ...switchParam.selectedRecord };
        let selectedId = this.props.Login.selectedId;
        if (event.target.type === 'checkbox') {
            dataItem[item.switchFieldName] = event.target.checked === true ? 3 : 4;
        }
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: {
                [this.props.Login.inputParam.methodUrl.toLowerCase()]: dataItem,
                "userinfo": this.props.Login.userInfo
            },
            operation: switchParam.operation,
            dataState: this.state.dataState, selectedId,
            selectedRecord: { ...this.state.selectedRecord }
        }
        const masterData = switchParam.masterData;
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, switchParam.ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, dataItem },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: switchParam.operation, masterData
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }


    deleteRecord = (deleteParam) => {
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: {
                [this.props.Login.inputParam.methodUrl.toLowerCase()]: deleteParam.selectedRecord,
                "userinfo": this.props.Login.userInfo
            },
            operation: deleteParam.operation,
            dataState: this.state.dataState,
            selectedRecord: { ...this.state.selectedRecord }
        }


        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: deleteParam.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }

    reloadData = () => {
        
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            userInfo: this.props.Login.userInfo
        };
    
        this.props.callService(inputParam);
    }
    syncData = (syncId) => {

        let classUrl;
        let methodUrl;

        if (this.props.Login.inputParam.displayName === "Fusion Site") {
            classUrl = "fusionsite";
            methodUrl = "FusionSite";
        } else if (this.props.Login.inputParam.displayName === "Fusion Plant") {
            classUrl = "fusionplant";
            methodUrl = "FusionPlant";
        } else if (this.props.Login.inputParam.displayName === "Fusion Users") {
            classUrl = "fusionusers";
            methodUrl = "FusionUsers";
        } else if (this.props.Login.inputParam.displayName === "Fusion Plant User") {
            classUrl = "fusionplantuser";
            methodUrl = "FusionPlantUser";
        }

        let inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: classUrl,
            methodUrl: methodUrl,
            operation: "sync",
            displayName: this.props.Login.inputParam.displayName,
            userInfo: this.props.Login.userInfo
        };

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, syncId)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: { ...this.props.Login.masterData } },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: "sync"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.syncAction(inputParam);
        }
    }

    onSaveClick = (saveType, formRef) => {

        let result = true;
        let emailFieldName = [];
        let validateCodeLength = true;
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        let dataState = undefined;
        let selectedId = null;
        let fieldList = getFieldSpecification().get(this.props.Login.inputParam.methodUrl) || [];
        let selectedRecordPrimarykey = fieldList[0].dataField;
        let clearSelectedRecordField = [];

        inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };

        this.extractedColumnList.map(item => {
            let fieldName = item.dataField;
            //ALPD-5063 added by Dhanushya RI,Enable save and continue option in Type3 component based screen
            if (saveType === transactionStatus.DEACTIVE && item.controlType !== "NA" && item.isClearField === true) {
                clearSelectedRecordField.push(item);
            }
            if (item.isEmail === true) {
                let validateEmailValue = this.state.selectedRecord[item.dataField] ? validateEmail(this.state.selectedRecord[item.dataField]) : true;
                if (validateEmailValue === false) {
                    result = false;
                    emailFieldName.push(item.idsName);
                }
            }

            if (item.validateCodeLength === true) { //Janakumar Added the visit code legth validation 
                if (this.state.selectedRecord[item.codelength] === this.state.selectedRecord[fieldName].length) {
                    inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][fieldName] = this.state.selectedRecord[fieldName] ? this.state.selectedRecord[fieldName] : "";

                } else {
                    validateCodeLength = false;
                }
            }
            if (item.isJsonField === true) {
                return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item.jsonObjectName] = { ...inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item.jsonObjectName], [fieldName]: this.state.selectedRecord[fieldName] ? this.state.selectedRecord[fieldName] : "" }
            }
            else {

                if (item.controlType === "selectbox") {
                    inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][fieldName] = this.state.selectedRecord[fieldName] ? this.state.selectedRecord[fieldName].label ? this.state.selectedRecord[fieldName].label : "" : -1;
                    inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item.foreignDataField] = this.state.selectedRecord[fieldName] ? this.state.selectedRecord[fieldName].value ? this.state.selectedRecord[fieldName].value : -1 : -1;
                    if (this.props.Login.inputParam.methodUrl === "LimsElnUsermapping" && this.state.selectedRecord.username && this.state.selectedRecord.username.item && this.state.selectedRecord.username.item.multiusergroupcode) {
                        this.state.selectedRecord.username.item.multiusergroupcode.forEach(dataItem => {
                            if (dataItem.defaultusergroup !== "undefined") {
                                inputData[this.props.Login.inputParam.methodUrl.toLowerCase()]["nelnusergroupcode"] = dataItem.lsusergroup.usergroupcode;
                            }
                        })
                    }
                    //return inputData;
                }
                else if (item.controlType === "datepicker") {
                         //Added by Sujatha for SWSM-8 on 01/08/2025 added validation using ternary operator for form input function while using date field
                    inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item.dateField] = this.state.selectedRecord[fieldName] && this.state.selectedRecord[fieldName] ? formatInputDate(this.state.selectedRecord[fieldName] ? this.state.selectedRecord[fieldName]:"" , false): null;
                }
                //Dhivyabharathi InvoiceTaxType -Start
                else if (item.controlType === "datetimepicker") {
                    inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item.dateField] = this.state.selectedRecord[fieldName] ? this.state.selectedRecord[fieldName] : ""
                }
                //Dhivyabharathi InvoiceTaxType -End
                else if (item.controlType === "checkbox") {
                    inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item.controlName] = this.state.selectedRecord[item.controlName] ? this.state.selectedRecord[item.controlName] : transactionStatus.NO;
                }
                else if (item.controlType === "numericinput") {
                    inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][fieldName] = this.state.selectedRecord[fieldName] ? this.state.selectedRecord[fieldName] : 0;
                }
                else if (item.controlType === "multiselect") {
                    inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item.valueKey] = this.state.selectedRecord[fieldName].map(item => item.value).join(", ");
                    inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item.valueName] = this.state.selectedRecord[fieldName].map(item => item.label).join(", ");
                }
                else {
                    inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][fieldName] = this.state.selectedRecord[fieldName] ? this.state.selectedRecord[fieldName] : "";
                }
                inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][selectedRecordPrimarykey] = this.props.Login.selectedId;
                return inputData;
            }

        })
        if (this.props.Login.operation == "update") {
            dataState = this.state.dataState;
            selectedId = this.props.Login.selectedId;
        }

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData, selectedId,
            selectedRecord: { ...this.state.selectedRecord },
            operation: this.props.Login.operation, saveType, formRef, dataState
        }
        if (result && validateCodeLength) {
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: { ...this.props.Login.masterData } },
                        openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                        operation: this.props.Login.operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                // this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
                this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal", '', this.confirmMessage, clearSelectedRecordField);
            }

        } else {
            if (validateCodeLength === false) { //janakumar r
                toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTERCODEOFLENGTH" }));
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTERVALIDEMAILOF" }) + this.props.intl.formatMessage({ id: emailFieldName[0] }));
            }
        }



    }

    ConfirmDelete = (operation, deleteId) => {
        this.confirmMessage.confirm(
            "deleteMessage",
            this.props.intl.formatMessage({ id: "IDS_DELETE" }),
            this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }),
            this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () =>
                this.DeleteWorklist(
                    operation,
                    deleteId,
                    operation.screenName ? operation.screenName : "IDS_WORKLIST"
                )
        );
    };
    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,

                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
            // screenStateData: {selected:{...this.state.selectedRecord}, masterData:{ ...this.props.Login.masterData}},
        }
        this.props.validateEsignCredential(inputParam, "openModal", this.confirmMessage);
    }

}
export default connect(mapStateToProps, {
    callService, crudMaster, updateStore, validateEsignCredential, syncAction,
    fetchRecordCombo, onComboLoad, onServiceLoad
})(injectIntl(Type3Component));