import React, { Component } from 'react';
import ListMaster from "../../components/list-master/list-master.component";
import SampleTypeFilter from "./SampleTypeFilter";
import ConfirmMessage from "../../components/confirm-alert/confirm-message.component";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Row, Col, Card } from "react-bootstrap";
import { ContentPanel } from "../../components/App.styles";
import BreadcrumbComponent from "../../components/Breadcrumb.Component";
import SlideOutModal from "../../components/slide-out-modal/SlideOutModal";
import CustomTab from "../../components/custom-tabs/custom-tabs.component";
import { DEFAULT_RETURN } from "../../actions/LoginTypes";
import Esign from "../audittrail/Esign";
import RegistrationSubTypeConfigDepartmentTab from "./RegistrationSubTypeConfigDepartmentTab";
import RegistrationSubTypeConfigUserRoleTab from "./RegistrationSubTypeConfigUserRoleTab";
import RegistrationSubTypeConfigUserTab from "./RegistrationSubTypeConfigUserTab";
import AddRegistrationSubtypeConfigDepartment from "../../pages/credentialmanagement/AddRegistrationSubtypeConfigDepartment";
import AddRegistrationSubtypeConfigUserRole from "../../pages/credentialmanagement/AddRegistrationSubtypeConfigUserRole";
import AddRegistrationSubtypeConfigUser from "../../pages/credentialmanagement/AddRegistrationSubtypeConfigUser";
import { Affix } from "rsuite";
import {showEsign,constructOptionList,getControlMap} from "../../components/CommonScript";
import {callService,crudMaster,validateEsignCredential,updateStore,getTabdetails,getSectionUsers,getDepartmentData,SampleTypeFilterchange,
        filterColumnData,getDepartmentBasedUser,getUserroleData,getUserRoleBasedUser,getRegtypeBasedSampleType,getListofUsers} from "../../actions";
import { transactionStatus } from '../../components/Enumeration';
import { toast } from "react-toastify";
const mapStateToProps = (state) => {
  return { Login: state.Login };
};
class RegistrationSubtypeConfigration extends Component {
  constructor(props) {
    super(props);
    const sectionDataState = { skip: 0, take: 10 };
    this.state = {
      selectedRecord: {},
      error: "",
      userRoleControlRights: [],
      selectedRegSubType: undefined,
      controlMap: new Map(),
      RegSubType: [],
      sectionDataState,
      sidebarview: false
    };
    this.searchRef = React.createRef();
    this.searchFieldList = ["sregsubtypename"];
    this.confirmMessage = new ConfirmMessage();
  }

  reloadData = () => {
     //ALPD-4803 done by Dhanushya RI,To check searchref key is present or not
    if (this.searchRef && this.searchRef.current) {
      this.searchRef.current.value = "";
    }
    if (this.state.nfilterSampleType && this.state.nfilterSampleType.value) {
      let inputParam = {
        inputData: {
          nsampletypecode: this.props.Login.masterData.defaultSampleTypeValue.value,
          userinfo: this.props.Login.userInfo,
          nfilterSampleType: this.props.Login.masterData.defaultSampleTypeValue,
          nregtypecode: this.props.Login.masterData.defaultRegtypeValue.value,
        },
        classUrl: "registrationsubtypeconfigration",
        methodUrl: "BySampleType",
        masterData: {
          ...this.props.Login.masterData,
          defaultSampleTypeValue: this.props.Login.masterData.defaultSampleTypeValue, searchedData: undefined
        }

      };
      this.props.SampleTypeFilterchange(
        inputParam,
        this.props.Login.masterData.filterSampleType
      );
    } else {
//ALPD-5276--Vignesh R(27-01-2025)--Transaction Users--Error occurs without configure the transaction filter config
      toast.warn(
        this.props.intl.formatMessage({
          id: "IDS_SELECTALLVALUESINFILTER",
        })
      );
    }
  };

  onComboChange = (comboData, fieldName, caseNo) => {
    const selectedRecord = this.state.selectedRecord || {};
    let masterData = this.props.Login.masterData;
    if (comboData !== null) {
      switch (caseNo) {
        case 1:
          if (fieldName === "nsampletypecode") {
            selectedRecord[fieldName] = comboData;

          } 
          // else if (fieldName === "nregionalsitecode") {
          //   selectedRecord[fieldName] = comboData;
          //   this.props.getInstrumentSiteSection(
          //     comboData.item.nsitecode,
          //     this.props.Login.userInfo,
          //     selectedRecord
          //   );
          // }
          else {
            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord });
          }
          break;
        case 2:
          selectedRecord[fieldName] = comboData;
          selectedRecord["ndeptusercode"] = comboData.value;
          this.props.getDepartmentBasedUser(
            this.state.selectedRecord.ndeptusercode,
            this.props.Login.userInfo,
            selectedRecord,
            masterData,
            this.props.Login.screenName
          );
          break;

        case 3:
          masterData = {
            ...this.props.Login.masterData,
            nfilterSampleType: comboData,
            SelectedSampleType: comboData.item
          }


          selectedRecord[fieldName] = comboData;
          selectedRecord["ndeptusercode"] = comboData.value;
          this.props.getRegtypeBasedSampleType(
            this.state.selectedRecord.ndeptusercode,
            this.props.Login.userInfo,
            selectedRecord,
            masterData,
            this.props.Login.screenName
          );
          break;

        case 4:
          selectedRecord[fieldName] = comboData;
          selectedRecord["userrolecode"] = comboData.value;
          this.props.getUserRoleBasedUser(
            this.state.selectedRecord.userrolecode,
            this.props.Login.userInfo,
            selectedRecord,
            masterData,
            this.props.Login.screenName
          );
          break;

        case 5:
          let nregtypecode =
            this.state.nregtypecode || {};
          nregtypecode = comboData;
          this.searchRef.current.value = "";
          this.setState({ nregtypecode });
          break;
        default:
          break;
      }
    }
    else {
        //Janakumar Ate234 ->ALPD-5185 Transaction user - Unable to delete the first user ( Both Product & French)
            const selectedRecord=[];
      const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: { selectedRecord:selectedRecord }
      }
      this.props.updateStore(updateInfo);
    }
  };


  DeleteTabRecords = (operation, ncontrolCode) => {
    let inputData = [];
    const dataState = this.state.sectionDataState;
    inputData["tabdetails"] = {
      nsitecode: this.props.Login.userInfo.nmastersitecode,
    };
    inputData["tabdetails"]["ntransfiltertypeconfigcode"] = operation.selectedRecord.ntransfiltertypeconfigcode;
    inputData["tabdetails"]["nneedalluser"] = operation.selectedRecord.nneedalluser;
    inputData["tabdetails"]["ntransusercode"] = operation.selectedRecord.ntransusercode || -1;
    inputData["tabdetails"]["nregsubtypecode"] = operation.selectedRecord.nregsubtypecode;


    inputData["userinfo"] = this.props.Login.userInfo;
    const inputParam = {
      methodUrl: "DepartmentAndUserRole",
      classUrl: this.props.Login.inputParam.classUrl,
      inputData: inputData,
      operation: "delete",
      dataState: dataState,
      selectedRecord: { ...this.state.selectedRecord },
      // postParam: {
      //   inputListName: "Instrument", selectedObject: "selectedRegSubType", primaryKeyField: "ninstrumentcode",
      //   fetchUrl: "instrument/getActiveInstrumentById", fecthInputObject: { userinfo: this.props.Login.userInfo },
      // }
    };
    const masterData = this.props.Login.masterData;
    if (
      showEsign(
        this.props.Login.userRoleControlRights,
        this.props.Login.userInfo.nformcode,
        operation.ncontrolCode
      )
    ) {
      const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: {
          loadEsign: true,
          screenData: { inputParam, masterData },
          openChildModal: true,
          screenName: operation.screenName,
          operation: operation.operation,
        },
      };
      this.props.updateStore(updateInfo);
    } else {
      this.props.crudMaster(inputParam, masterData, "openChildModal");
    }

    // }
  }



  onInputOnChange = (event, caseNo, optional) => {
    const selectedRecord = this.state.selectedRecord || {};
    switch (caseNo) {
      case 1:
        if (event.target.type === 'checkbox') {
          selectedRecord[event.target.name] = event.target.checked === true ? optional[0] : optional[1];
          if (selectedRecord['ndeltacheck'] === transactionStatus.YES) {
            selectedRecord['ndeltaunitcode'] = this.props.Login.parameterData && this.props.Login.parameterData.deltaperiod.filter(x =>
              x.item.ndefaultstatus === transactionStatus.YES)[0];
          }
          else {
            delete selectedRecord['ndeltaunitcode'];
          }
        } else {
          selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
        break;


      default:
        break;
    }
  }
  closeModal = () => {
    let loadEsign = this.props.Login.loadEsign;
    let openModal = this.props.Login.openModal;
    let openChildModal = this.props.Login.openChildModal;
    let modalShow = this.props.Login.modalShow;
    let selectedRecord = this.props.Login.selectedRecord;

    if (this.props.Login.loadEsign) {
      if ((this.props.Login.operation.operation ?
        this.props.Login.operation.operation : this.props.Login.operation) === "delete") {
        loadEsign = false;
        openModal = false;
        openChildModal = false;
        selectedRecord = {};
      }
      else {
        loadEsign = false;
        modalShow = true;
        openModal = false;
        openChildModal = false;

      }
      selectedRecord['esignpassword'] = ""
      selectedRecord['esigncomments'] = ""
      selectedRecord['esignreason'] = ""
    }
    else {
      openModal = false;
      openChildModal = false;
      modalShow = false;
      selectedRecord = {};
    }

    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: {
        openModal, openChildModal, modalShow, loadEsign,
        selectedRecord, selectedId: null
      },
    };
    this.props.updateStore(updateInfo);
  };

  onFilterSubmit = () => {
    this.searchRef.current.value = "";

    if ((this.state.nfilterSampleType && this.state.nfilterSampleType.value) && (this.props.Login.masterData.defaultRegtypeValue && this.props.Login.masterData.defaultRegtypeValue.value)) {
      let inputParam = {
        inputData: {
          nsampletypecode: this.state.nfilterSampleType.value,
          nregtypecode: this.state.nregtypecode.value,
          userinfo: this.props.Login.userInfo,
          nfilterSampleType: this.state.nfilterSampleType,
        },
        masterData: {
          ...this.props.Login.masterData,
          defaultSampleTypeValue: this.state.nfilterSampleType,
          defaultRegtypeValue: this.state.nregtypecode,
          SelectedRegType: this.state.nregtypecode.item,
          searchedData: undefined
        },
        classUrl: "registrationsubtypeconfigration",
        methodUrl: "BySampleType",
      };
      this.props.SampleTypeFilterchange(
        inputParam,
        this.props.Login.masterData.filterSampleType
      );
    } else {
        toast.warn(
          this.props.intl.formatMessage({
            id: "IDS_SELECTALLVALUESINFILTER",
          })
        );
    }
  };

  onSaveClick = (saveType, formRef) => {
    let inputData = [];
    let UsersArray = []
    inputData["userinfo"] = this.props.Login.userInfo;
    let postParam = {
      inputListName: "RegSubType",
      selectedObject: "selectedRegSubType",
      primaryKeyField: "nregsubtypecode",
      isSingleGet: true
    }

    inputData["nmappingfieldcode"] = this.props.Login.screenName === "IDS_DEPARTMENT" ? this.state.selectedRecord["ndeptcode"].value : this.props.Login.screenName === "IDS_USERROLE" ? this.state.selectedRecord["nuserrolecode"].value : -1;
    inputData["nallusers"] = this.state.selectedRecord["ndeltacheck"] || 4;
    UsersArray = this.state.selectedRecord && this.state.selectedRecord.nusercode && this.state.selectedRecord.nusercode.map(item => {
      let users = {}
      users["nusercode"] = item.value;
      return users
    });
    inputData['usermapping'] = UsersArray;
    inputData["selectedregsubtype"] = this.props.Login.masterData.selectedRegSubType;
    const inputParam = {
      classUrl: this.props.Login.inputParam.classUrl,
      methodUrl: "Department",
      inputData: inputData,
      operation: this.props.Login.operation,
      saveType,
      formRef,
      searchRef: this.searchRef,
      postParam: postParam,
      selectedRecord: { ...this.state.selectedRecord }
    };

    const masterData = this.props.Login.masterData;
    if (
      showEsign(
        this.props.Login.userRoleControlRights,
        this.props.Login.userInfo.nformcode,
        this.props.Login.ncontrolCode
      )
    ) {
      const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: {
          loadEsign: true,
          screenData: { inputParam, masterData },
          saveType,
          openChildModal: true
        },
      };
      this.props.updateStore(updateInfo);
    } else {
      this.props.crudMaster(inputParam, masterData, "openChildModal");
    }
  };



  validateEsign = () => {
    let modalName;
    const inputParam = {
      inputData: {
        userinfo: {
          ...this.props.Login.userInfo,
          sreason: this.state.selectedRecord["esigncomments"],
          nreasoncode: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
          spredefinedreason: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,

        },
        password: this.state.selectedRecord["esignpassword"],
      },
      screenData: this.props.Login.screenData,
    };

    this.props.validateEsignCredential(inputParam, modalName);

  };





  tabDetail = () => {
    const tabMap = new Map();
    const deleteSecId =
      this.state.controlMap.has("DeleteDepartment") &&
      this.state.controlMap.get("DeleteDepartment").ncontrolcode;

    if (this.props.Login.masterData.defaultSampleTypeValue.item.ntransfiltertypecode === 1)
      tabMap.set(
        "IDS_DEPARTMENT",
        <RegistrationSubTypeConfigDepartmentTab
          controlMap={this.state.controlMap}
          userRoleControlRights={this.state.userRoleControlRights}
          dataState={this.props.Login.dataState}
          masterData={this.props.Login.masterData["selectedSection"] || []}
          selectedRegSubType={this.props.Login.masterData.selectedRegSubType}
          userInfo={this.props.Login.userInfo}
          inputParam={this.props.Login.inputParam}
          deleteRecord={this.DeleteTabRecords}
          deleteSecId={deleteSecId}
          getDepartmentData={this.props.getDepartmentData}
          DepartmentAndUser={this.props.Login.masterData.DepartmentAndUser || []}
          screenName="IDS_DEPARTMENT"
          selectedRecord={this.state.selectedRecord}
          settings={this.props.Login.settings}
        />
      );


    if (this.props.Login.masterData.defaultSampleTypeValue.item.ntransfiltertypecode === 2)
      tabMap.set(
        "IDS_USERROLE",
        <RegistrationSubTypeConfigUserRoleTab
          controlMap={this.state.controlMap}
          userRoleControlRights={this.state.userRoleControlRights}
          dataState={this.props.Login.dataState}
          masterData={this.props.Login.masterData["selectedSection"] || []}
          selectedRegSubType={this.props.Login.masterData.selectedRegSubType}
          userInfo={this.props.Login.userInfo}
          inputParam={this.props.Login.inputParam}
          deleteRecord={this.DeleteTabRecords}
          deleteSecId={deleteSecId}
          getUserroleData={this.props.getUserroleData}
          DepartmentAndUser={this.props.Login.masterData.DepartmentAndUser || []}
          screenName="IDS_USERROLE"
          selectedRecord={this.state.selectedRecord}
          settings={this.props.Login.settings}
        />
      );

    if (this.props.Login.masterData.defaultSampleTypeValue.item.ntransfiltertypecode === 3)
      tabMap.set(
        "IDS_USERS",
        <RegistrationSubTypeConfigUserTab
          controlMap={this.state.controlMap}
          userRoleControlRights={this.state.userRoleControlRights}
          dataState={this.props.Login.dataState}
          masterData={this.props.Login.masterData["selectedSection"] || []}
          //masterData={this.props.Login.masterData || []}
          selectedRegSubType={this.props.Login.masterData.selectedRegSubType}
          userInfo={this.props.Login.userInfo}
          inputParam={this.props.Login.inputParam}
          deleteRecord={this.DeleteTabRecords}
          deleteSecId={deleteSecId}
          getListofUsers={this.props.getListofUsers}
          DepartmentAndUser={this.props.Login.masterData.DepartmentAndUser || []}
          screenName="IDS_USERS"
          selectedRecord={this.state.selectedRecord}
          settings={this.props.Login.settings}
        />
      );
    return tabMap;
  };

  componentDidUpdate(previousProps) {
    let updateState = false;
    let {
      selectedRecord,
      userRoleControlRights,
      controlMap,
      //filterData,
      nfilterSampleType,
      filterSampleType,
      filterRegtype, nregtypecode
    } = this.state;
    if (
      this.props.Login.selectedRecord !== previousProps.Login.selectedRecord
    ) {
      selectedRecord = this.props.Login.selectedRecord;
      updateState = true;
    }
    if (
      this.props.Login.userInfo.nformcode !==
      previousProps.Login.userInfo.nformcode
    ) {
      userRoleControlRights = [];
      if (this.props.Login.userRoleControlRights) {
        this.props.Login.userRoleControlRights[
          this.props.Login.userInfo.nformcode
        ] &&
          Object.values(
            this.props.Login.userRoleControlRights[
            this.props.Login.userInfo.nformcode
            ]
          ).map((item) => userRoleControlRights.push(item.ncontrolcode));
      }
      controlMap = getControlMap(
        this.props.Login.userRoleControlRights,
        this.props.Login.userInfo.nformcode
      );
      updateState = true;
    }
    if (this.props.Login.masterData !== previousProps.Login.masterData) {
      nfilterSampleType = this.state.nfilterSampleType || {};
      if (
        this.props.Login.masterData.SelectedSampleType &&
        this.props.Login.masterData.SelectedSampleType !==
        previousProps.Login.masterData.SelectedSampleType
      ) {
        nfilterSampleType = {
          label: this.props.Login.masterData.SelectedSampleType.ssampletypename,
          value: this.props.Login.masterData.SelectedSampleType.nsampletypecode,
          item: this.props.Login.masterData.SelectedSampleType,
        };
      }
      //filterData = this.generateBreadCrumData();
      updateState = true;
    }

    if (
      this.props.Login.masterData.filterSampleType !== previousProps.Login.masterData.filterSampleType
    ) {
      const SampleTypeMap = constructOptionList(
        this.props.Login.masterData.filterSampleType || [],
        "nsampletypecode",
        "ssampletypename",
        "ascending",
        false
      );
      filterSampleType = SampleTypeMap.get("OptionList");
      if (SampleTypeMap.get("DefaultValue")) {
        nfilterSampleType = SampleTypeMap.get("DefaultValue");
       } //else if (
      //   filterInstrumentCategory &&
      //   filterInstrumentCategory.length > 0
      // ) {
      //   nfilterInstrumentCategory = filterInstrumentCategory[0];
      // }
      updateState = true;
    }


    if (
      this.props.Login.masterData.filterRegtype !== previousProps.Login.masterData.filterRegtype
    ) {
      const SampleTypeMap = constructOptionList(
        this.props.Login.masterData.filterRegtype || [],
        "nregtypecode",
        "sregtypename",
        "ascending",
        false
      );
      filterRegtype = SampleTypeMap.get("OptionList");
      if (SampleTypeMap.get("DefaultValue")) {
        nregtypecode = SampleTypeMap.get("DefaultValue");
      } else if (
        filterRegtype &&
        filterRegtype.length > 0
      ) {
        nregtypecode = filterRegtype[0];
      }
      updateState = true;
    }

    if (updateState) {
      this.setState({
        selectedRecord,
        userRoleControlRights,
        controlMap,
        //filterData,
        nfilterSampleType,
        filterSampleType, nregtypecode, filterRegtype
      });
    }
  }
  render() {

    let mandatoryFields = [];

    if (this.props.Login.screenName === "IDS_DEPARTMENT") {

      this.state.selectedRecord && this.state.selectedRecord["ndeltacheck"] === 4 ? mandatoryFields.push({
        mandatory: true,
        idsName: "IDS_DEPARTMENT",
        dataField: "ndeptcode",
        mandatoryLabel: "IDS_SELECT",
        controlType: "selectbox",
      }, {
        mandatory: true,
        idsName: "IDS_USERS",
        dataField: "nusercode",
        mandatoryLabel: "IDS_SELECT",
        controlType: "selectbox",
      }
      ) : mandatoryFields.push({
        mandatory: true,
        idsName: "IDS_DEPARTMENT",
        dataField: "ndeptcode",
        mandatoryLabel: "IDS_SELECT",
        controlType: "selectbox",
      });

    }
    else if (this.props.Login.screenName === "IDS_USERROLE") {

      this.state.selectedRecord && this.state.selectedRecord["ndeltacheck"] === 4 ? mandatoryFields.push({
        mandatory: true,
        idsName: "IDS_USERROLE",
        dataField: "nuserrolecode",
        mandatoryLabel: "IDS_SELECT",
        controlType: "selectbox",
      }, {
        mandatory: true,
        idsName: "IDS_USERS",
        dataField: "nusercode",
        mandatoryLabel: "IDS_SELECT",
        controlType: "selectbox",
      }
      ) : mandatoryFields.push({
        mandatory: true,
        idsName: "IDS_USERROLE",
        dataField: "nuserrolecode",
        mandatoryLabel: "IDS_SELECT",
        controlType: "selectbox",
      });

    }
    else {
      mandatoryFields.push({
        mandatory: true,
        idsName: "IDS_USERS",
        dataField: "nusercode",
        mandatoryLabel: "IDS_SELECT",
        controlType: "selectbox",
      });
    }
    const { selectedRegSubType } = this.props.Login.masterData;
    const filterParam = {
      inputListName: "RegSubType",
      selectedObject: "selectedRegSubType",
      primaryKeyField: "nregsubtypecode",
      fetchUrl: "registrationsubtypeconfigration/getTabdetails",
      fecthInputObject: { userinfo: this.props.Login.userInfo },
      masterData: this.props.Login.masterData,
      searchFieldList: this.searchFieldList,
    };
    let breadCrumbData = []; //this.props.Login.masterData.defaultInstrumentCatValue || [];

    breadCrumbData = [
      {
        "label": "IDS_SAMPLETYPE",
        //"value": this.props.Login.masterData.defaultInstrumentCatValue ? this.props.Login.masterData.defaultInstrumentCatValue.label : "-"
        // ALPD-5287  Changed defaultSampleTypeValue and defaultRegtypeValue to SelectedSampleType and SelectedRegType by Vishakh
        "value": this.props.Login.masterData.SelectedSampleType ? this.props.Login.masterData.SelectedSampleType.ssampletypename : "NA"
      }, {
        "label": "IDS_REGTYPE",
        "value": this.props.Login.masterData.SelectedRegType ? this.props.Login.masterData.SelectedRegType.sregtypename : "NA"
      }
    ];
    return (
      <>
        <div className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
          {breadCrumbData.length > 0 ? (
            <Affix top={53}>
              <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
            </Affix>
          ) : (
            ""
          )}
          <Row noGutters={true}>
            <Col md={`${!this.state.sidebarview ? '4' : "2"}`}>
              <span onClick={() => this.setState({ sidebarview: !this.state.sidebarview })} className='sidebar-view-btn'>
                {!this.state.sidebarview ?
                  <i class="fa fa-less-than"></i> :
                  <i class="fa fa-greater-than"></i>
                }
              </span>
              <ListMaster
                formatMessage={this.props.intl.formatMessage}
                screenName={"RegSubType"}
                masterData={this.props.Login.masterData}
                userInfo={this.props.Login.userInfo}
                masterList={
                  this.props.Login.masterData.searchedData ||
                  this.props.Login.masterData.RegSubType
                }
                getMasterDetail={(RegSubType) =>
                  this.props.getTabdetails(
                    RegSubType,
                    this.props.Login.userInfo,
                    this.props.Login.masterData
                  )
                }
                selectedMaster={this.props.Login.masterData.selectedRegSubType}
                primaryKeyField="nregsubtypecode"
                mainField="sregsubtypename"
                isIDSField="Yes"
                filterColumnData={this.props.filterColumnData}
                filterParam={filterParam}
                userRoleControlRights={this.state.userRoleControlRights}
                searchRef={this.searchRef}
                //addId={addId}
                hidePaging={false}
                reloadData={this.reloadData}
                // openModal={() =>
                //   this.props.getInstrumentCombo(
                //     "IDS_INSTRUMENT",
                //     "create",
                //     "ninstrumentcode",
                //     this.props.Login.masterData,
                //     this.props.Login.userInfo,
                //     //addId
                //   )
                // }
                openFilter={this.openFilter}
                closeFilter={this.closeFilter}
                onFilterSubmit={this.onFilterSubmit}
                showFilterIcon={true}
                showFilter={this.props.Login.showFilter}
                filterComponent={[
                  {
                    IDS_INSTRUMENTCATEGORYFILTER: (
                      <SampleTypeFilter
                      filterSampleType={
                          this.state.filterSampleType || []
                        }
                        nfilterSampleType={
                          this.state.nfilterSampleType || {}
                        }
                        filterRegtype={this.state.filterRegtype || []}
                        onComboChange={this.onComboChange}
                        nregtypecode={
                          this.state.nregtypecode || {}
                        }
                      />
                    ),
                  },
                ]}
              />
            </Col>
            <Col md={`${!this.state.sidebarview ? '8' : "10"}`}>
              <Row>
                <Col md={12}>
                  <ContentPanel className="panel-main-content">
                    <Card className="border-0">
                      {this.props.Login.masterData.selectedRegSubType ? (
                        <>
                          <Card.Header>
                            <Card.Title className="product-title-main">
                              {
                                this.props.Login.masterData.selectedRegSubType
                                  .sregsubtypename
                              }
                            </Card.Title>
                          </Card.Header>
                          <Card.Body>
                            {selectedRegSubType && (
                              <CustomTab
                                tabDetail={this.tabDetail()}
                                onTabChange={this.onTabChange}
                              />
                            )}
                          </Card.Body>
                        </>
                      ) : (
                        ""
                      )}
                    </Card>
                  </ContentPanel>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        {(this.props.Login.openModal || this.props.Login.openChildModal) && (
          <SlideOutModal
            show={(this.props.Login.openModal || this.props.Login.openChildModal)}
            closeModal={this.closeModal}
            operation={this.props.Login.operation}
            size={this.props.Login.loadEsign ? "lg" : this.props.Login.openModal ? "xl" : this.props.Login.openChildModal ? "lg" : "lg"}
            inputParam={this.props.Login.inputParam}
            screenName={this.props.Login.screenName}
            onSaveClick={this.onSaveClick}
            esign={this.props.Login.loadEsign}
            validateEsign={this.validateEsign}
            masterStatus={this.props.Login.masterStatus}
            mandatoryFields={mandatoryFields}
            updateStore={this.props.updateStore}
            selectedRecord={this.state.selectedRecord || {}}
            addComponent={
              this.props.Login.loadEsign ? (
                <Esign
                  operation={this.props.Login.operation}
                  onInputOnChange={this.onInputOnChange}
                  inputParam={this.props.Login.inputParam}
                  selectedRecord={this.state.selectedRecord || {}}
                />
              ) : this.props.Login.screenName === "IDS_DEPARTMENT" ? (
                <AddRegistrationSubtypeConfigDepartment
                  selectedRecord={this.state.selectedRecord || {}}
                  Lab={this.props.Login.Lab}
                  Users={this.props.Login.Users}
                  onComboChange={this.onComboChange}
                  onSwitchChange={this.onSwitchChange}
                  onInputOnChange={this.onInputOnChange}
                  isdisable={this.props.Login.masterData.isdisable || false}

                />
              ) :
                this.props.Login.screenName === "IDS_USERROLE" ? (
                  <AddRegistrationSubtypeConfigUserRole
                    selectedRecord={this.state.selectedRecord || {}}
                    Lab={this.props.Login.Lab}
                    Users={this.props.Login.Users}
                    onComboChange={this.onComboChange}
                    onSwitchChange={this.onSwitchChange}
                    onInputOnChange={this.onInputOnChange}
                    isdisable={this.props.Login.masterData.isdisable || false}
                  />
                ) :
                  this.props.Login.screenName === "IDS_USERS" ? (
                    <AddRegistrationSubtypeConfigUser
                      selectedRecord={this.state.selectedRecord || {}}
                      Users={this.props.Login.Users}
                      onComboChange={this.onComboChange}
                      onSwitchChange={this.onSwitchChange}
                      onInputOnChange={this.onInputOnChange}
                    />
                  ) :
                    ""
            }
          />
        )}


      </>
    );

  }
}

export default connect(mapStateToProps, {
  callService,
  crudMaster,
  getTabdetails,
  filterColumnData,
  updateStore,
  validateEsignCredential,
  getSectionUsers,
  getDepartmentData,
  SampleTypeFilterchange,
  getDepartmentBasedUser, getUserroleData, getUserRoleBasedUser, getRegtypeBasedSampleType, getListofUsers
})(injectIntl(RegistrationSubtypeConfigration));