import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { callService, updateStore, crudMaster, formSortingService1, formModuleGetSorting, moduleSortingOrder1,saveExecutionOrder } from '../../actions';
import { getControlMap, constructOptionList } from '../../components/CommonScript';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { sortData } from '../../components/CommonScript';
import { DEFAULT_RETURN } from "../../actions/LoginTypes";
import {  LocalizationProvider } from '@progress/kendo-react-intl';
import ListBoxDraggable from '../../components/ListBoxDraggable';






const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class Sorting extends React.Component {

    constructor(props) {
        super(props)
        this.formRef = React.createRef();
        this.extractedColumnList = [];

        this.state = {
            masterStatus: "", error: "", selectedRecord: {},
            isOpen: false,
            userRoleControlRights: [],
            controlMap: new Map(),
            data : [],
            bool : 1,
            btnControl : "primary disabled",
            btnControl1 : "primary active"
        };
    };

    render() {

        // if (this.props.Login.inputParam !== undefined) {

        //     this.extractedColumnList = []
        // }

         let masterdata = {...this.props.Login.masterData};
        // delete(masterdata.MenuList);
        // delete(masterdata.SelectedMenuSorting);
        // delete(masterdata.SelectedModuleSorting);
        // delete(masterdata.moduleList);
        // delete(masterdata.nFlag); 
        // delete(masterdata.formsList); 

        // let palettes=masterdata && Object.keys(masterdata);
        // const masterdata1 = [];
        // const palettes2 = [];

        // if(this.state.bool == 1){
        //     this.props.Login.masterData.nFlag === 1 || this.props.Login.nFlag ===1 ?
        // masterdata1.push(...this.props.Login.masterData.SelectedModuleSorting && this.props.Login.masterData.SelectedModuleSorting) :
        // palettes.map(item => this.props.Login.masterData.SelectedModuleSorting && this.props.Login.masterData.SelectedModuleSorting.map(
        //     item1 =>item === item1.smodulename ? masterdata1.push(item1) : ""))

        // let m1 = Object.keys(masterdata1);

        // let m2 = 
        // m1.map((item)=>({
        //     smodulename : masterdata1[item].smodulename,
        //     nsorter : masterdata1[item].nsorter,
        //     nmodulecode : masterdata1[item].nmodulecode,
        //     sdisplayname : masterdata1[item].sdisplayname
        // })) 

        // const palettes1 = Object.values(m2.map((item)=>item));

        // palettes1 && palettes1.map((item, index)=>{
        //     let formList =masterdata[item.smodulename]
        //     sortData(masterdata[item.smodulename],'ascending','nsorter')
        //     palettes2.push({
        //       data: formList,
        //       name: item.sdisplayname,
        //       id: index,
        //       nmoduleSorter: item.nsorter,
        //       nmodulecode : item.nmodulecode
        //     })  
        //   })
        // }
        // else if(this.state.bool == 2){
        //     this.props.Login.masterData.nFlag === 1 || this.props.Login.nFlag ===1 ?
        //     masterdata1.push(...this.props.Login.masterData.SelectedMenuSorting) :
        //     palettes.map(item => this.props.Login.masterData.SelectedMenuSorting.map(
        //         item1 =>item === item1.smenuname ? masterdata1.push(item1) : ""))
    
        //     let m1 = Object.keys(masterdata1);
    
        //     let m2 = 
        //     m1.map((item)=>({
        //         smenuname : masterdata1[item].smenuname,
        //         nsorter : masterdata1[item].nsorter,
        //         nmenucode : masterdata1[item].nmenucode,
        //         sdisplayname : masterdata1[item].sdisplayname
        //     })) 
    
        //     const palettes1 = Object.values(m2.map((item)=>item));
    
        //         palettes1 && palettes1.map((item, index)=>{
        //         let formList =masterdata[item.smenuname]
        //         sortData(masterdata[item.smenuname],'ascending','nsorter')
        //         palettes2.push({
        //           data: formList,
        //           name: item.sdisplayname,
        //           id: index,
        //           nmenuSorter: item.nsorter,
        //           nmenucode : item.nmenucode
        //         })  
        //       })
        // }
        return (
            <>
                <div className="client-listing-wrap mtop-5">
                    <button className={"btn btn-"+(this.state.btnControl)+" btn-padd-custom"} style={{ float: "right", marginRight : "35px" }}
                    onClick={() => this.booleanValue('moduleSorting') }>{this.props.intl.formatMessage({ id: "IDS_MODULE" })}</button>
                    <button className={"btn btn-"+(this.state.btnControl1)+" btn-padd-custom"} style={{ float: "right", marginRight : "35px" }}
                    onClick={() => this.booleanValue('formSorting')}>{this.props.intl.formatMessage({ id: "IDS_FORM" })}</button>
                    <Row>
                    <Col md={3}>
                        <FormSelectSearch
                            name={"nmenucode"}
                            formLabel={this.props.intl.formatMessage({ id: "IDS_MENU" })}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            options={sortData(this.state.lstMenuSorting,'ascending','value') || []}
                            value={this.props.Login.masterData && this.props.Login.masterData.SelectedMenuSorting
                            && {
                            value: this.props.Login.masterData.SelectedMenuSorting? this.props.Login.masterData.SelectedMenuSorting['nmenucode'] :"",
                            label: this.props.Login.masterData.SelectedMenuSorting? this.props.Login.masterData.SelectedMenuSorting['sdisplayname'] : ""
                            }}
                            isMandatory={true}
                            isMulti={false}
                            isClearable={false}
                            isSearchable={true}
                            isDisabled={false}
                            closeMenuOnSelect={true}
                            className="mb-2"
                            onChange={(event) => this.onComboChange(event, 'nmenucode')}
                            maxMenuHeight={150}
                        /></Col>
                        {this.state.bool === 1 ?
                        <Col md={3}>
                        <FormSelectSearch
                            name={"nmodulecode"}
                            formLabel={this.props.intl.formatMessage({ id: "IDS_MODULE" })}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            options={ sortData(this.state.lstModuleSorting,'ascending','value') || []}
                            value={this.props.Login.masterData && this.props.Login.masterData.SelectedModuleSorting
                            && {
                            value: this.props.Login.masterData.SelectedModuleSorting? this.props.Login.masterData.SelectedModuleSorting['nmodulecode'] : "",
                            label: this.props.Login.masterData.SelectedModuleSorting? this.props.Login.masterData.SelectedModuleSorting['sdisplayname'] : "",
                            }}
                            isMandatory={true}
                            isMulti={false}
                            isClearable={false}
                            isSearchable={true}
                            isDisabled={false}
                            closeMenuOnSelect={true}
                            className="mb-2"
                            onChange={(event) => this.onComboChange(event, 'nmodulecode')}
                            maxMenuHeight={150}
                        /></Col>: ""}
                        </Row>
                        <Col md={10}>
                    {this.props.Login.masterData.SelectedMenuSorting || this.props.Login.masterData.SelectedModuleSorting ? 
                    <LocalizationProvider language={this.props.Login.language}>
                    {/* <Sortable
                    idField={"id"}
                    data={palettes2 || []}
                    itemUI={SortableItemUI}
                    onDragOver={this.onDragOver}
                    onNavigate={this.onNavigate}
                    masterdata={masterdata}
                  /> */}
                           <ListBoxDraggable
                        masterList={this.state.bool === 1?sortData(masterdata['QualisForms'],'ascending','nsorter')|| []: sortData(masterdata['QualisModules'],'ascending','nsorter')} 
                        mainField={ "sdisplayname"} 
                        hideSearch={true}
                        primaryKeyField="nsorter"
                        sortableField={'nsorter'} 
                        userInfo={this.props.Login.userInfo} 
                        masterData={masterdata}
                        saveExecutionOrder=    { this.state.bool === 1?(props)=>{this.props.formSortingService1({
                            inputData: {
                               userinfo: this.props.Login.userInfo,
                               primarykey:  this.props.Login.masterData.SelectedModuleSorting&&this.props.Login.masterData.SelectedModuleSorting['nmenucode'],
                               nmodulecode:  this.props.Login.masterData.SelectedModuleSorting&&this.props.Login.masterData.SelectedModuleSorting['nmodulecode'],
                               changedValues : props
                           },
                           masterData: this.props.masterData,
                           url: "sorting/updateForms"
                       })} :(props)=>{   this.props.moduleSortingOrder1({
                        inputData: {
                           userinfo: this.props.Login.userInfo,
                           primarykey: this.props.Login.masterData.SelectedMenuSorting&&this.props.Login.masterData.SelectedMenuSorting['nmenucode'],
                          changedValues : props
                       },
                       masterData: this.props.masterData,
                       url: "sorting/updateModules"
                    }) }} 
                        >
                        </ListBoxDraggable>
                  </LocalizationProvider>
                   : ""}
                    </Col>                                                                 
                </div>
            </>
        );
    }

    componentDidUpdate(previousProps) {
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)

                const menuMap = constructOptionList(this.props.Login.masterData.MenuList || [], "nmenucode",
                    "sdisplayname", undefined, undefined, true);
                const MenuList = menuMap.get("OptionList");
                const moduleMap = constructOptionList(this.props.Login.masterData.moduleList || [], "nmodulecode",
                    "sdisplayname", undefined, undefined, true);
                const moduleList = moduleMap.get("OptionList");

                this.setState({
                    userRoleControlRights, controlMap, lstMenuSorting: MenuList, lstModuleSorting: moduleList,
                });
            }
            else {
                const moduleMap = constructOptionList(this.props.Login.masterData.moduleList || [], "nmodulecode",
                    "sdisplayname", undefined, undefined, true);
                const moduleList = moduleMap.get("OptionList");

                this.setState({
                    isOpen: false,
                    selectedRecord: this.props.Login.selectedRecord,lstModuleSorting: moduleList
                });
            }
        } else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;

        if(this.state.bool === 1){
        if (fieldName === "nmenucode") {
            this.props.formSortingService1({
                inputData: {
                    nmenucode: selectedRecord.nmenucode.value,
                    userinfo: this.props.Login.userInfo,
                    primarykey: selectedRecord.nmenucode.value,
                    boolValue: 1
                },
                masterData: this.props.Login.masterData,
                url:"sorting/getFilter"
            });
        }
    }
    else if(this.state.bool === 2){
        if (fieldName === "nmenucode") {
            this.props.formSortingService1({
                inputData: {
                    nmenucode: selectedRecord.nmenucode.value,
                    userinfo: this.props.Login.userInfo,
                    primarykey: selectedRecord.nmenucode.value,
                    boolValue: 2
                },
                masterData: this.props.Login.masterData,
                url:"sorting/getFilter"
            });
        }      
    }
        if(fieldName === "nmodulecode"){
            this.props.formSortingService1({
                inputData: {
                    nmenucode: selectedRecord.nmodulecode.item.nmenucode,
                    nmodulecode: selectedRecord.nmodulecode.value,
                    userinfo: this.props.Login.userInfo,
                    primarykey: selectedRecord.nmodulecode.item.nmenucode,
                    primarykey1: selectedRecord.nmodulecode.value,
                    boolValue: 1
                },
                masterData: this.props.Login.masterData,
                url:"sorting/getFilter1"
            });
        }
        else{
            this.setState({ selectedRecord });
        } 
    }
          
    // onNavigate = (event) => {
    //     this.setState({
    //       palettes: event.newState,
    //     });
    //   };

      booleanValue = (fieldName) => {
          if(fieldName === "formSorting"){
              this.setState({
                  bool:1,
                  btnControl1:"primary active",
                  btnControl:"primary disabled"
              })

              const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    boolValue: 1,
                    displayName: this.props.intl.formatMessage({ id: "IDS_SCREENORGANISINGFORM" }),
                    }
            }
            this.props.updateStore(updateInfo);
            this.props.Login.masterData["nFlag"] = 0;

              this.props.formModuleGetSorting({
                inputData: {
                    boolValue:1,
                    userinfo: this.props.Login.userInfo,
                },
                masterData: this.props.Login.masterData,
                url:"sorting/getSorting"
            });
          }
          else if(fieldName === "moduleSorting"){
              this.setState({
                  bool:2,
                  btnControl:"primary active",
                  btnControl1:"primary disabled"
              })

              const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    boolValue: 2,
                    displayName: this.props.intl.formatMessage({ id: "IDS_SCREENORGANISINGMODULE" }),
                    }
            }
            this.props.updateStore(updateInfo);
            this.props.Login.masterData["nFlag"] = 0;

              this.props.formModuleGetSorting({
                inputData: {
                    boolValue:2,
                    userinfo: this.props.Login.userInfo,
                },
                masterData: this.props.Login.masterData,
                url:"sorting/getSorting"
            });
          }
      }
}

export default connect(mapStateToProps, { callService, updateStore, crudMaster,saveExecutionOrder, formSortingService1, formModuleGetSorting, moduleSortingOrder1 })(injectIntl(Sorting));


