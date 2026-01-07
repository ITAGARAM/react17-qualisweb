import React, { Component } from "react";
import { Row, Col, Card, Nav, FormGroup, FormLabel } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrashAlt,faThumbsUp } from "@fortawesome/free-solid-svg-icons";

import { injectIntl } from "react-intl";
import {
  callService,
  crudMaster,
  validateEsignCredential,
  updateStore,
  getInstrumentCombo,
  getInstrumentDetail,
  getSectionUsers,
  getAvailableInstData,
  changeInstrumentCategoryFilter,
  filterColumnData,
  getTabDetails,
  getDataForAddEditValidation,
  addInstrumentFile,
  getDataForAddEditCalibration,
  getDataForAddEditMaintenance,
  OpenDate,
  CloseDate, viewAttachment,getCalibrationRequired,getInstrumentSiteSection,  updateAutoCalibration
} from "../../actions";

import ListMaster from "../../components/list-master/list-master.component";
import {
  attachmentType,
  transactionStatus,
} from "../../components/Enumeration";
import AddInstrument from "../../pages/instrumentmanagement/AddInstrument";
import AddInstrumentSection from "../../pages/instrumentmanagement/AddInstrumentSection";
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from "../../actions/LoginTypes";
import SlideOutModal from "../../components/slide-out-modal/SlideOutModal";
import CustomTab from "../../components/custom-tabs/custom-tabs.component";
import Esign from "../audittrail/Esign";
import {
  showEsign,
  getControlMap,
  constructOptionList,
  formatInputDate,
  onDropAttachFileList,
  create_UUID,
  deleteAttachmentDropZone,
  rearrangeDateFormatDateOnly,
  Lims_JSON_stringify,
  replaceBackSlash
} from "../../components/CommonScript";
import { ReadOnlyText, ContentPanel ,MediaLabel} from "../../components/App.styles";
import InstrumentSectionTab from "./InstrumentSectionTab";
import { process } from "@progress/kendo-data-query";
import ConfirmMessage from "../../components/confirm-alert/confirm-message.component";
import InstrumentCategoryFilter from "./InstrumentCategoryFilter";
import BreadcrumbComponent from "../../components/Breadcrumb.Component";
import { Affix } from "rsuite";
// import ReactTooltip from "react-tooltip";
import InstrumentValidationTab from "./InstrumentValidationTab";
import AddInstrumentValidation from "../../pages/instrumentmanagement/AddInstrumentValidation";
import AddInstrumentFile from "../../pages/instrumentmanagement/AddInstrumentFile";
import InstrumentCalibrationTab from "./InstrumentCalibrationTab";
import AddInstrumentCalibration from "./AddInstrumentCalibration";
import ModalShow from "../../components/ModalShow";
import AddOpenDate from "./AddOpenDate";
import AddCloseDate from "./AddCloseDate";
import InstrumentMaintenanceTab from "./InstrumentMaintenanceTab";
import AddInstrumentMaintenance from "./AddInstrumentMaintenance";
import rsapi from '../../rsapi';
import { ReactComponent as AutoCalibrationIcon } from '../../assets/image/gauge-solid.svg';
import { intl } from "../../components/App";

const mapStateToProps = (state) => {
  return { Login: state.Login };
};

class Instrument extends Component {
  constructor(props) {
    super(props);
    const sectionDataState = { skip: 0, take: 10 };
    this.state = {
      selectedRecord: {},
      error: "",
      userRoleControlRights: [],
      selectedInstrument: undefined,
      controlMap: new Map(),
      Instrument: [],
      sectionDataState,
      sidebarview: false
    };
    this.searchRef = React.createRef();
    this.searchFieldList = ["sinstrumentname","sinstrumentid", "smodelnumber", "spono", "sserialno", "sremarks",
    "sdefaultstatus","smanufacdate","spodate","sreceiveddate","sinstallationdate","sexpirydate", "sactivestatus"];
    this.confirmMessage = new ConfirmMessage();
  }
  sidebarExpandCollapse = () => {
      this.setState({
          sidebarview: true
      })          
  }

  handleDateChange = (dateName, dateValue) => {
    const { selectedRecord } = this.state;
    selectedRecord[dateName] = dateValue;
    this.setState({ selectedRecord });
  };

  onInputOnChange = (event, optional,name) => {
    const selectedRecord = this.state.selectedRecord || {};
     if (name === "nnextmaintenance") {          	//added by sujatha ALPDJ21-21 
      selectedRecord[name] = event;
    }
    else if(name==="nnextcalibration")
    {
      selectedRecord[name] = event;
    }
    else if(name==="npurchasecost")
    {
      selectedRecord[name] = event;
    }
    else
    {
    if (event.target.type === "checkbox") {
      selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
    }  else if (event.target.type === 'radio') {
      selectedRecord[event.target.name] = optional;
  }else {
      selectedRecord[event.target.name] = event.target.value;
    }
  }
    this.setState({ selectedRecord });
  };
  
  onSaveModalClick = () => {
    let inputData = [];
    let inputParam = [];
    inputData["userinfo"] = this.props.Login.userInfo;
    if (this.props.Login.screenName === "IDS_INSTRUMENTCALIBRATION") {
      if(this.props.Login.modalTitle === "IDS_OPENDATE"){
      inputData["instrumentcalibration"] = {
        ninstrumentcode:
          this.props.Login.masterData.selectedInstrument.ninstrumentcode,
        ntzopendate: this.state.selectedRecord["ntzopendate"]
          ? this.state.selectedRecord["ntzopendate"].value
          : "-1",
          
        ninstrumentcalibrationcode:
          this.props.Login.masterData.selectedInstrumentCalibration
            .ninstrumentcalibrationcode,
        ncalibrationstatus:
          this.state.selectedRecord.ntranscode["item"].ntranscode,
        sopenreason:
          this.state.selectedRecord.sopenreason !== null
            ? this.state.selectedRecord.sopenreason
            : "",
        
        nopenusercode: this.props.Login.userInfo.nusercode
      };
      if (this.state.selectedRecord["dopendate"]) {
        inputData["instrumentcalibration"]["dopendate"] = formatInputDate(
          this.state.selectedRecord["dopendate"],
          false
        );
      }
      }
      else{
        inputData["instrumentcalibration"] = {
          ninstrumentcode:
            this.props.Login.masterData.selectedInstrument.ninstrumentcode,
          
            ntzclosedate: this.state.selectedRecord["ntzclosedate"]
            ? this.state.selectedRecord["ntzclosedate"].value
            : "-1",
          ninstrumentcalibrationcode:
            this.props.Login.masterData.selectedInstrumentCalibration
              .ninstrumentcalibrationcode,
          ncalibrationstatus:
            this.state.selectedRecord.ntranscode["item"].ntranscode,
          
          sclosereason:
            this.state.selectedRecord.sclosereason !== null
              ? this.state.selectedRecord.sclosereason
              : "",
          ncloseusercode: this.props.Login.userInfo.nusercode,
        };
        if (this.state.selectedRecord["dclosedate"]) {
          inputData["instrumentcalibration"]["dclosedate"] = formatInputDate(
            this.state.selectedRecord["dclosedate"],
            false
          );
        }
          	//added by sujatha ALPDJ21-21 
        inputData["instrumentcalibration"]["ntzduedate"] = this.state.selectedRecord["ntzduedate"] //sujatha
          ? this.state.selectedRecord["ntzduedate"].value
          : -1;
      }
      
      inputParam = {
        classUrl: this.props.Login.inputParam.classUrl,
        methodUrl: "InstrumentCalibration",
        inputData: inputData,
        operation: this.props.Login.operation,
        searchRef: this.searchRef,
       // modalShow: false,
       // openModal:true,
      };
    } else {
      if(this.props.Login.modalTitle === "IDS_OPENDATE"){

      inputData["instrumentmaintenance"] = {
        ninstrumentcode:
          this.props.Login.masterData.selectedInstrument.ninstrumentcode,
        ntzopendate: this.state.selectedRecord["ntzopendate"]
          ? this.state.selectedRecord["ntzopendate"].value
          : "-1",
        
        ninstrumentmaintenancecode:
          this.props.Login.masterData.selectedInstrumentMaintenance
            .ninstrumentmaintenancecode,
        nmaintenancestatus:
          this.state.selectedRecord.ntranscode["item"].ntranscode,
        sopenreason:
          this.state.selectedRecord.sopenreason !== null
            ? this.state.selectedRecord.sopenreason
            : "",
        nopenusercode: this.props.Login.userInfo.nusercode
      };

      if (this.state.selectedRecord["dopendate"]) {
        inputData["instrumentmaintenance"]["dopendate"] = formatInputDate(
          this.state.selectedRecord["dopendate"],
          false
        );
      }
    }
      else{
        inputData["instrumentmaintenance"] = {
          ninstrumentcode:
            this.props.Login.masterData.selectedInstrument.ninstrumentcode,
            ntzclosedate: this.state.selectedRecord["ntzclosedate"]
            ? this.state.selectedRecord["ntzclosedate"].value
            : "-1",
          
          ninstrumentmaintenancecode:
            this.props.Login.masterData.selectedInstrumentMaintenance
              .ninstrumentmaintenancecode,
          nmaintenancestatus:
            this.state.selectedRecord.ntranscode["item"].ntranscode,
            sclosereason:
            this.state.selectedRecord.sclosereason !== null
              ? this.state.selectedRecord.sclosereason
              : "",
          ncloseusercode: this.props.Login.userInfo.nusercode
        };
  
        if (this.state.selectedRecord["dclosedate"]) {
          inputData["instrumentmaintenance"]["dclosedate"] = formatInputDate(
            this.state.selectedRecord["dclosedate"],
            false
          );
        }
         	//added by sujatha ALPDJ21-21 
        inputData["instrumentmaintenance"]["ntzduedate"] = this.state.selectedRecord["ntzduedate"] //sujatha
          ? this.state.selectedRecord["ntzduedate"].value
          : -1;
      }
      inputParam = {
        classUrl: this.props.Login.inputParam.classUrl,
        methodUrl: "InstrumentMaintenance",
        inputData: inputData,
        operation: this.props.Login.operation,
        searchRef: this.searchRef,
      //  modalShow: false,
      //  openModal:true,
      };
    }

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
          openModal:true,
          modalShow: false,
          //openChildModal:false,
          //openModal:false,
          loadEsign: true,
          screenData: { inputParam, masterData },
        },
      };
      this.props.updateStore(updateInfo);
    } else {
      this.props.crudMaster(inputParam, masterData, "modalShow");
    }
  };

  onSaveClick = (saveType, formRef) => {
    let inputData = [];
    let instSection = [];
    inputData["userinfo"] = this.props.Login.userInfo;
    if (this.props.Login.screenName === "IDS_INSTRUMENT") {
      let postParam = undefined;
      let fieldList = [
        "ninstrumentcode",
        "ninstrumentcatcode",
        "ninstrumentlocationcode",
        "nsuppliercode",
        "nservicecode",
        "nmanufcode",
        "nusercode",
        "sinstrumentid",
        "sinstrumentname",
        "smodelnumber",
        "spono",
        "sdescription",
        "sassociateddocument",
        "smovement",
        "nwindowsperiodminus",
        "nwindowsperiodplus",
        "nwindowsperiodminusunit",
        "nwindowsperiodplusunit",
        "sserialno",
        "sremarks",
        "npurchasecost",
        "ssoftwareinformation",
        "sperformancecapabilities",
        "sacceptancecriteria",
        "nnextcalibration",
        "nnextcalibrationperiod",
        "nnextmaintenance",          	//added by sujatha ALPDJ21-21 
        "nnextmaintenanceperiod",           	//added by sujatha ALPDJ21-21 
        "nregionalsitecode",
        "ndefaultstatus",
        "nsitecode",
        "nstatus",
      ];

      inputData["instrument"] = {
        nsitecode: this.props.Login.userInfo.nmastersitecode,
      };

      if (this.props.Login.operation === "update") {
        postParam = {
          inputListName: "Instrument",
          selectedObject: "selectedInstrument",
          primaryKeyField: "ninstrumentcode",
        };

        inputData["instrument"]["smanufacdate"] = this.state.selectedRecord[
          "dmanufacdate"
        ]
          ? this.state.selectedRecord["dmanufacdate"]
          : transactionStatus.NA;
        inputData["instrument"]["spodate"] = this.state.selectedRecord[
          "dpodate"
        ]
          ? this.state.selectedRecord["dpodate"]
          : transactionStatus.NA;
        inputData["instrument"]["sreceiveddate"] = this.state.selectedRecord[
          "dreceiveddate"
        ]
          ? this.state.selectedRecord["dreceiveddate"]
          : transactionStatus.NA;
        inputData["instrument"]["sinstallationdate"] = this.state
          .selectedRecord["dinstallationdate"]
          ? this.state.selectedRecord["dinstallationdate"]
          : transactionStatus.NA;
        inputData["instrument"]["sexpirydate"] = this.state.selectedRecord[
          "dexpirydate"
        ]
          ? this.state.selectedRecord["dexpirydate"]
          : transactionStatus.NA;

          inputData["instrument"]["sservicedate"] = this.state.selectedRecord[
            "dservicedate"
          ]
            ? this.state.selectedRecord["dservicedate"]
            : transactionStatus.NA;

        fieldList.map((item) => {
          return (inputData["instrument"][item] = this.state.selectedRecord[
            item
          ]
            ? this.state.selectedRecord[item]
            : "");
        });
      } else {
        inputData["instrument"]["ninstrumentstatus"] =
          this.state.selectedRecord["ntransactionstatus"];
        inputData["instrument"]["nsectioncode"] = this.state.selectedRecord[
          "nsectioncode"
        ]
          ? this.state.selectedRecord["nsectioncode"].value
          : transactionStatus.NA;
        fieldList.map((item) => {
          return (inputData["instrument"][item] =
            this.state.selectedRecord[item]);
        });
        inputData["instrumentvalidation"] = {
          sremark: this.state.selectedRecord.sremark
  
            ? this.state.selectedRecord.sremark
            :
            "",
  
          nusercode: this.props.Login.userInfo.nusercode,
          ntzvalidationdate: this.state.selectedRecord[
            "ntzvalidationdate"
          ]
            ? this.state.selectedRecord["ntzvalidationdate"].value
            : transactionStatus.NA,
  
          nvalidationstatus: this.state.selectedRecord[
            "validation"
          ]
            ? this.state.selectedRecord["validation"].value
            : transactionStatus.VALIDATION,
  
          dvalidationdate: formatInputDate(
            this.state.selectedRecord["dvalidationdate"],
            false
          )
        };
        inputData["instrumentcalibration"] = {
          sopenreason: this.state.selectedRecord[
            "sopenreason"
          ]
            ? this.state.selectedRecord["sopenreason"]
            : "",
          sclosereason: this.state.selectedRecord[
            "sclosereason"
          ]
            ? this.state.selectedRecord["sclosereason"]
            : "",
          nopenusercode:
            this.props.Login.userInfo.nusercode,
          ncloseusercode:
            this.props.Login.userInfo.nusercode,
  
          dlastcalibrationdate: formatInputDate(
            this.state.selectedRecord["dlastcalibrationdate"],
            false
          ),
          ncalibrationstatus: this.state.selectedRecord[
            "calibration"
          ]
            ? this.state.selectedRecord["calibration"].value
            : transactionStatus.CALIBRATION,
          ntzopendate: this.state.selectedRecord[
            "ntzopendate"
          ]
            ? this.state.selectedRecord["ntzopendate"].value
            : transactionStatus.NA,
          dopendate: this.state.selectedRecord["calibration"] && this.state.selectedRecord["calibration"].value===transactionStatus.UNDERCALIBIRATION?"": formatInputDate(
            this.state.selectedRecord["dopendate"],
            false
          ),
          dclosedate: this.state.selectedRecord["calibration"] && this.state.selectedRecord["calibration"].value===transactionStatus.UNDERCALIBIRATION?"":formatInputDate(
            this.state.selectedRecord["dclosedate"],
            false
          ),
          dduedate: formatInputDate(
            this.state.selectedRecord["dduedate"],
            false
          ),
          ntzlastcalibrationdate: this.state.selectedRecord[
            "ntzlastcalibrationdate"
          ]
            ? this.state.selectedRecord["ntzlastcalibrationdate"].value
            : transactionStatus.NA,
          ntzclosedate: this.state.selectedRecord[
            "ntzclosedate"
          ]
            ? this.state.selectedRecord["ntzclosedate"].value
            : transactionStatus.NA,
          ntzduedate: this.state.selectedRecord[
            "ntzduedate"
          ]
            ? this.state.selectedRecord["ntzduedate"].value
            : transactionStatus.NA,
  
          npreregno: transactionStatus.NA,
  
          sarno: this.state.selectedRecord[
            "sarno"
          ]
            ? this.state.selectedRecord["sarno"]
            : ""
        }
        inputData["instrumentmaintenance"] = {
          sopenreason: this.state.selectedRecord[
            "sopenreason"
          ]
            ? this.state.selectedRecord["sopenreason"]
            : "",
          sclosereason: this.state.selectedRecord[
            "sclosereason"
          ]
            ? this.state.selectedRecord["sclosereason"]
            : "",
          nopenusercode:
            this.props.Login.userInfo.nusercode,
          ncloseusercode:
            this.props.Login.userInfo.nusercode,
          ntzlastmaintenancedate: this.state.selectedRecord[
            "ntzlastmaintenancedate"
          ]
            ? this.state.selectedRecord["ntzlastmaintenancedate"].value
            : transactionStatus.NA,
          nmaintenancestatus: this.state.selectedRecord[
            "maintenance"
          ]
            ? this.state.selectedRecord["maintenance"].value
            : transactionStatus.NA,
          ntzopendate: this.state.selectedRecord[
            "ntzopendate"
          ]
            ? this.state.selectedRecord["ntzopendate"].value
            : transactionStatus.NA,
          ntzclosedate: this.state.selectedRecord[
            "ntzclosedate"
          ]
            ? this.state.selectedRecord["ntzclosedate"].value
            : transactionStatus.NA,
          ntzduedate: this.state.selectedRecord[
            "ntzduedate"
          ]
            ? this.state.selectedRecord["ntzduedate"].value
            : transactionStatus.NA,
          dopendate:this.state.selectedRecord["maintenance"] && this.state.selectedRecord["maintenance"].value===transactionStatus.UNDERMAINTANENCE?"": formatInputDate(
            this.state.selectedRecord["dopendate"],
            false
          ),
          dclosedate:this.state.selectedRecord["maintenance"] && this.state.selectedRecord["maintenance"].value===transactionStatus.UNDERMAINTANENCE?"":formatInputDate(
            this.state.selectedRecord["dclosedate"],
            false
          ),
          dduedate: formatInputDate(
            this.state.selectedRecord["dduedate"],
            false
          ),
          dlastmaintenancedate: formatInputDate(
            this.state.selectedRecord["dlastmaintenancedate"],
            false
          )
  
        }
  
      }
      inputData["instrument"]["ninstrumentcatcode"] = this.state.selectedRecord[
        "ninstrumentcatcode"
      ]
        ? this.state.selectedRecord["ninstrumentcatcode"].value
        : transactionStatus.NA;
        
        //ALPD-4941-->Added by Vignesh R(11-02-2025)--Scheduler Configuration Icon changed
        inputData["instrument"]["ncalibrationreq"] =this.props.Login.masterData.defaultInstrumentCatValue ? this.props.Login.masterData.SelectedInsCat.ncalibrationreq:transactionStatus.NO;
      inputData["instrument"]["nmanufcode"] = this.state.selectedRecord[
        "nmanufcode"
      ]
        ? this.state.selectedRecord["nmanufcode"].value || transactionStatus.NA
        : transactionStatus.NA;
      inputData["instrument"]["nsuppliercode"] = this.state.selectedRecord[
        "nsuppliercode"
      ]
        ? this.state.selectedRecord["nsuppliercode"].value ||
        transactionStatus.NA
        : transactionStatus.NA;

        inputData["instrument"]["ninstrumentlocationcode"] = this.state.selectedRecord[
          "ninstrumentlocationcode"
        ]
          ? this.state.selectedRecord["ninstrumentlocationcode"].value ||
          transactionStatus.NA
          : transactionStatus.NA;

        inputData["instrument"]["nsitecode"] = this.props.Login.userInfo.nmastersitecode;

        inputData["instrument"]["nregionalsitecode"] = this.state.selectedRecord[
          "nregionalsitecode"
        ]
          ? this.state.selectedRecord["nregionalsitecode"].value ||
          transactionStatus.NA
          : transactionStatus.NA;

      inputData["instrument"]["nservicecode"] = this.state.selectedRecord[
        "nservicecode"
      ]
        ? this.state.selectedRecord["nservicecode"].value ||
        transactionStatus.NA
        : transactionStatus.NA;
      inputData["instrument"]["ninstrumentstatus"] = this.state.selectedRecord[
        "ntranscode"
      ]
        ? this.state.selectedRecord["ntranscode"].value || transactionStatus.NA
        : transactionStatus.NA;
      inputData["instrument"]["nwindowsperiodplus"] = this.state.selectedRecord[
        "nwindowsperiodplus"
      ]
        ? this.state.selectedRecord["nwindowsperiodplus"]
        : 0;
      inputData["instrument"]["nwindowsperiodminus"] = this.state
        .selectedRecord["nwindowsperiodminus"]
        ? this.state.selectedRecord["nwindowsperiodminus"]
        : 0;
      inputData["instrument"]["nwindowsperiodminusunit"] = this.state
        .selectedRecord["nwindowsperiodminusunit"]
        ? this.state.selectedRecord["nwindowsperiodminusunit"].value ||
        transactionStatus.NA
        : transactionStatus.NA;
      inputData["instrument"]["nwindowsperiodplusunit"] = this.state
        .selectedRecord["nwindowsperiodplusunit"]
        ? this.state.selectedRecord["nwindowsperiodplusunit"].value ||
        transactionStatus.NA
        : transactionStatus.NA;
        inputData["instrument"]["nnextcalibrationperiod"] = this.state
        .selectedRecord["nnextcalibrationperiod"]
        ? this.state.selectedRecord["nnextcalibrationperiod"].value ||
        transactionStatus.NA
        : transactionStatus.NA;
         	//added by sujatha ALPDJ21-21 
        inputData["instrument"]["nnextmaintenanceperiod"] = this.state
        .selectedRecord["nnextmaintenanceperiod"]
        ? this.state.selectedRecord["nnextmaintenanceperiod"].value ||
        transactionStatus.NA
        : transactionStatus.NA;
      inputData["instrument"]["ntzmanufdate"] = this.state.selectedRecord[
        "ntzmanufdate"
      ]
        ? this.state.selectedRecord["ntzmanufdate"].value ||
        transactionStatus.NA
        : transactionStatus.NA;
      inputData["instrument"]["stzmanufdate"] = this.state.selectedRecord[
        "ntzmanufdate"
      ]
        ? this.state.selectedRecord["ntzexpirydate"].label
        : transactionStatus.NA;
      inputData["instrument"]["ntzpodate"] = this.state.selectedRecord[
        "ntzpodate"
      ]
        ? this.state.selectedRecord["ntzpodate"].value || transactionStatus.NA
        : transactionStatus.NA;
      inputData["instrument"]["stzpodate"] = this.state.selectedRecord[
        "ntzpodate"
      ]
        ? this.state.selectedRecord["ntzpodate"].label
        : transactionStatus.NA;
      inputData["instrument"]["ntzreceivedate"] = this.state.selectedRecord[
        "ntzreceivedate"
      ]
        ? this.state.selectedRecord["ntzreceivedate"].value ||
        transactionStatus.NA
        : transactionStatus.NA;
      inputData["instrument"]["stzreceivedate"] = this.state.selectedRecord[
        "ntzreceivedate"
      ]
        ? this.state.selectedRecord["ntzreceivedate"].label
        : transactionStatus.NA;

      inputData["instrument"]["ntzinstallationdate"] = this.state
        .selectedRecord["ntzinstallationdate"]
        ? this.state.selectedRecord["ntzinstallationdate"].value ||
        transactionStatus.NA
        : transactionStatus.NA;

      inputData["instrument"]["stzinstallationdate"] = this.state
        .selectedRecord["ntzinstallationdate"]
        ? this.state.selectedRecord["ntzinstallationdate"].label
        : transactionStatus.NA;

      inputData["instrument"]["ntzexpirydate"] = this.state.selectedRecord[
        "ntzexpirydate"
      ]
        ? this.state.selectedRecord["ntzexpirydate"].value ||
        transactionStatus.NA
        : transactionStatus.NA;
      inputData["instrument"]["stzexpirydate"] = this.state.selectedRecord[
        "ntzexpirydate"
      ]
        ? this.state.selectedRecord["ntzexpirydate"].label
        : transactionStatus.NA;


        inputData["instrument"]["ntzservicedate"] = this.state.selectedRecord[
          "ntzservicedate"
        ]
          ? this.state.selectedRecord["ntzservicedate"].value ||
          transactionStatus.NA
          : transactionStatus.NA;
        inputData["instrument"]["stzservicedate"] = this.state.selectedRecord[
          "ntzservicedate"
        ]
          ? this.state.selectedRecord["ntzservicedate"].label
          : transactionStatus.NA;
        

      if (this.state.selectedRecord["dpodate"]) {
        inputData["instrument"]["dpodate"] = formatInputDate(
          this.state.selectedRecord["dpodate"],
          false
        );
      }
      if (this.state.selectedRecord["dreceiveddate"]) {
        inputData["instrument"]["dreceiveddate"] = formatInputDate(
          this.state.selectedRecord["dreceiveddate"],
          false
        );
      }
      if (this.state.selectedRecord["dinstallationdate"]) {
        inputData["instrument"]["dinstallationdate"] = formatInputDate(
          this.state.selectedRecord["dinstallationdate"],
          false
        );
      }
      if (this.state.selectedRecord["dexpirydate"]) {
        inputData["instrument"]["dexpirydate"] = formatInputDate(
          this.state.selectedRecord["dexpirydate"],
          false
        );
      }
      if (this.state.selectedRecord["dmanufacdate"]) {
        inputData["instrument"]["dmanufacdate"] = formatInputDate(
          this.state.selectedRecord["dmanufacdate"],
          false
        );
      }


      if (this.state.selectedRecord["dservicedate"]) {
        inputData["instrument"]["dservicedate"] = formatInputDate(
          this.state.selectedRecord["dservicedate"],
          false
        );
      }

      inputData["instrument"]["nusercode"] =
        this.props.Login.userInfo.nusercode;
        inputData["instrument"]["sinstrumentname"] =
        this.state.selectedRecord.ninstrumentnamecode &&  this.state.selectedRecord.ninstrumentnamecode.label;
      
      //Added by sonia on 04th Mar 2025 for  jira id:ALPD-5504 
      inputData["nautogenerationid"] =parseInt(this.props.Login.settings && this.props.Login.settings['78']) ;

      if (this.state.selectedRecord["nsectionusercode"] !== undefined) {
        if (this.state.selectedRecord["nusercode"] !== undefined) {
          this.state.selectedRecord["nusercode"].map((item) => {
            return instSection.push({
              nusercode: item.value,
            });
          });
          inputData["instrumentsection"] = instSection;
        }
      }
     let clearSelectedRecordField =[   
        //Commented by sonia on 04th Mar 2025 for  jira id:ALPD-5504
       // { "idsName": "IDS_INSTRUMENTID","dataField": "sinstrumentid", "width": "200px", "controlType": "textbox", "isClearField": true },   
        { "idsName": "IDS_SERIALNO", "dataField": "sserialno", "width": "200px","controlType": "textbox","isClearField":true },
        { "idsName": "IDS_PONO", "dataField": "spono", "width": "200px","controlType": "textbox","isClearField":true },
        { "idsName": "IDS_CALIBRATIONINTERVAL", "dataField": "nnextcalibration", "width": "200px","controlType": "textbox","isClearField":true },
        { "idsName": "IDS_MAINTENANCEINTERVAL", "dataField": "nnextmaintenance", "width": "200px","controlType": "textbox","isClearField":true },       	//added by sujatha ALPDJ21-21 
        { "idsName": "IDS_MODELNO", "dataField": "smodelnumber", "width": "200px","controlType": "textbox","isClearField":true },
        { "idsName": "IDS_REMARKS", "dataField": "sremarks", "width": "200px","controlType": "textbox","isClearField":true },
        { "idsName": "IDS_MOVEMENT", "dataField": "smovement", "width": "200px","controlType": "textbox","isClearField":true },
        { "idsName": "IDS_ASSOCIATEDDOCUMENT", "dataField": "sassociateddocument", "width": "200px","controlType": "textbox","isClearField":true },
        { "idsName": "IDS_PURCHASECOST", "dataField": "npurchasecost", "width": "200px","controlType": "textbox","isClearField":true },
        { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "200px","controlType": "textbox","isClearField":true },
        { "idsName": "IDS_SOFTWAREINFORMATION", "dataField": "ssoftwareinformation", "width": "200px","controlType": "textbox","isClearField":true },
        { "idsName": "IDS_PERFORMNACECAPABILITIES", "dataField": "sperformancecapabilities", "width": "200px","controlType": "textbox","isClearField":true },
        { "idsName": "IDS_ACCEPTANCECRETERIA", "dataField": "sacceptancecriteria", "width": "200px","controlType": "textbox","isClearField":true },
        { "idsName": "IDS_DEFAULT", "dataField": "ndefaultstatus", "width": "100px","isClearField":true,"preSetValue":4},
        
    ];

    //Added by sonia on 04th Mar 2025 for  jira id:ALPD-5504
    if (parseInt(this.props.Login.settings[78]) !== transactionStatus.YES) {
      clearSelectedRecordField.unshift({ 
          "idsName": "IDS_INSTRUMENTID","dataField": "sinstrumentid", "width": "200px", "controlType": "textbox", "isClearField": true 
      });
    }
      const inputParam = {
        classUrl: this.props.Login.inputParam.classUrl,
        methodUrl: "Instrument",
        inputData: inputData,
        filtercombochange:this.props.Login.masterData.searchedData!==undefined?
                     this.state.selectedRecord['ninstrumentcatcode'].value===
                    this.props.Login.masterData.SelectedInsCat.ninstrumentcatcode?false:true:false,
        operation: this.props.Login.operation,
        saveType,
        formRef,
        postParam,
        searchRef: this.searchRef,
        selectedRecord: {...this.state.selectedRecord}
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
          },
        };
        this.props.updateStore(updateInfo);
      } else {
        this.props.crudMaster(inputParam, masterData, "openModal","","",clearSelectedRecordField);
      }
    } else if (this.props.Login.screenName === "IDS_SECTION") {
      let postParam = {
        inputListName: "Instrument",
        selectedObject: "selectedInstrument",
        primaryKeyField: "ninstrumentcode",
        isSingleGet: true
      }
      inputData["instrumentsection"] = {
        nsitecode: this.props.Login.userInfo.nmastersitecode,
      };
      inputData["instrumentsection"]["nsectioncode"] = this.state
        .selectedRecord["nsectioncode"]
        ? this.state.selectedRecord["nsectioncode"].value
        : transactionStatus.NA;
      inputData["instrumentsection"]["nusercode"] = this.state.selectedRecord[
        "nusercode"
      ]
        ? this.state.selectedRecord["nusercode"].value
        : transactionStatus.NA;
      inputData["instrumentsection"]["ninstrumentcode"] =
        this.props.Login.instItem["ninstrumentcode"];

      const inputParam = {
        classUrl: this.props.Login.inputParam.classUrl,
        methodUrl: "Section",
        inputData: inputData,
        operation: this.props.Login.operation,
        saveType,
        formRef,
        searchRef: this.searchRef,
        postParam: postParam,
        selectedRecord: {...this.state.selectedRecord}
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
    } else if (this.props.Login.screenName === "IDS_INSTRUMENTVALIDATION") {
      let postParam = undefined;
      if (this.props.Login.operation === "update") {
        inputData["instrumentvalidation"] = {
          ninstrumentcode:
            this.props.Login.masterData.selectedInstrument.ninstrumentcode,
          ninstrumentvalidationcode:
            this.props.Login.masterData.selectedInstrumentValidation
              .ninstrumentvalidationcode,
          nusercode: this.props.Login.masterData.selectedInstrument.nusercode,
          nvalidationstatus: this.state.selectedRecord.ntranscode.value,
          dvalidationdate: formatInputDate(
            this.state.selectedRecord["dvalidationdate"],
            false
          ),
          sremark:
            this.state.selectedRecord.sremark !== null
              ? this.state.selectedRecord.sremark
              : "",
          ntzvalidationdate: this.state.selectedRecord["ntzvalidationdate"]
            ? this.state.selectedRecord["ntzvalidationdate"].value
            : "-1",
        };

          postParam = {
            inputListName: "Instrument",
            selectedObject: "selectedInstrument",
            primaryKeyField: "ninstrumentcode",
            isSingleGet: true
          };
      } else {
        inputData["instrumentvalidation"] = {
          ninstrumentcode:
            this.props.Login.masterData.selectedInstrument.ninstrumentcode,
          nusercode: this.props.Login.masterData.selectedInstrument.nusercode,
          nvalidationstatus:
            this.state.selectedRecord.ntranscode.item.ntranscode,
          ntzvalidationdate: this.state.selectedRecord["ntzvalidationdate"]
            ? this.state.selectedRecord["ntzvalidationdate"].value
            : "-1",

          sremark:
            this.state.selectedRecord.sremark !== null
              ? this.state.selectedRecord.sremark
              : "",
        };
      }
      if (this.state.selectedRecord["dvalidationdate"]) {
        inputData["instrumentvalidation"]["dvalidationdate"] = formatInputDate(
          this.state.selectedRecord["dvalidationdate"],
          false
        );
      }
      let clearSelectedRecordField =[
        { "idsName": "IDS_REMARKS", "dataField": "sremark", "width": "200px","controlType": "textbox","isClearField":true },
        
        
    ]
      const inputParam = {
        classUrl: this.props.Login.inputParam.classUrl,
        methodUrl: "InstrumentValidation",
        inputData: inputData,
        operation: this.props.Login.operation,
        saveType,
        formRef,
        searchRef: this.searchRef,
        postParam: postParam ? postParam : undefined,
        selectedRecord: {...this.state.selectedRecord}
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
            openChildModal: true,
          },
        };
        this.props.updateStore(updateInfo);
      } else {
        this.props.crudMaster(inputParam, masterData, "openChildModal","","",clearSelectedRecordField);
      }
    } else if (this.props.Login.screenName === "IDS_INSTRUMENTVALIDATIONFILE") {
      const inputParam = this.onSaveInstrumentFile(saveType, formRef);
      if(this.props.Login.operation === "update"){
        let postParam = {
          inputListName: "Instrument",
          selectedObject: "selectedInstrumentValidation",
          primaryKeyField: "ninstrumentvalidationcode",
        };
        inputParam["postParam"] = postParam;
      }
      let clearSelectedRecordField =[
        { "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "width": "200px","controlType": "textbox","isClearField":true },
        { "idsName": "IDS_DESCRIPTION", "dataField": "sfiledesc", "width": "200px","controlType": "textbox","isClearField":true },
        { "idsName": "IDS_DESCRIPTION", "dataField": "slinkdescription", "width": "200px","controlType": "textbox","isClearField":true },
        
        
    ]
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
            // openChildModal: true,
          },
        };
        this.props.updateStore(updateInfo);
      } else {
        this.props.crudMaster(inputParam, masterData, "openChildModal","","",clearSelectedRecordField);
      }
    } else if (this.props.Login.screenName === "IDS_INSTRUMENTCALIBRATION") {
      let postParam = undefined;
      if (this.props.Login.operation === "create")
        inputData["instrumentcalibration"] = {
          ninstrumentcode:
            this.props.Login.masterData.selectedInstrument.ninstrumentcode,
          nopenusercode: this.props.Login.userInfo.nusercode,
          ncloseusercode: this.props.Login.userInfo.nusercode,
          ncalibrationstatus:
            this.state.selectedRecord.ntranscode.item.ntranscode,
          dlastcalibrationdate: formatInputDate(
            this.state.selectedRecord["dlastcalibrationdate"],
            false
          ),

          dduedate: formatInputDate(
            this.state.selectedRecord["dduedate"],
            false
          ),
          ntzopendate: this.state.selectedRecord["ntzopendate"]
            ? this.state.selectedRecord["ntzopendate"].value
            : "-1",
          ntzclosedate: this.state.selectedRecord["ntzclosedate"]
            ? this.state.selectedRecord["ntzclosedate"].value
            : "-1",
          ntzlastcalibrationdate: this.state.selectedRecord[
            "ntzlastcalibrationdate"
          ]
            ? this.state.selectedRecord["ntzlastcalibrationdate"].value
            : "-1",
          ntzduedate: this.state.selectedRecord["ntzduedate"]
            ? this.state.selectedRecord["ntzduedate"].value
            : "-1",
            sarno:this.state.selectedRecord["sarno"]
            ? this.state.selectedRecord["sarno"]:"",
          npreregno: transactionStatus.NA
        };
      else {
        inputData["instrumentcalibration"] = {
          ninstrumentcode:
            this.props.Login.masterData.selectedInstrument.ninstrumentcode,
          ninstrumentcalibrationcode:
            this.props.Login.masterData.selectedInstrumentCalibration
              .ninstrumentcalibrationcode,
          ncalibrationstatus: this.state.selectedRecord.ntranscode.value,
          dlastcalibrationdate: formatInputDate(
            this.state.selectedRecord["dlastcalibrationdate"],
            false
          ),
          dduedate: formatInputDate(
            this.state.selectedRecord["dduedate"],
            false
          ),
          ntzlastcalibrationdate: this.state.selectedRecord[
            "ntzlastcalibrationdate"
          ]
            ? this.state.selectedRecord["ntzlastcalibrationdate"].value
            : "-1",
          ntzduedate: this.state.selectedRecord["ntzduedate"]
            ? this.state.selectedRecord["ntzduedate"].value
            : "-1",
            sarno:this.state.selectedRecord["sarno"]
            ? this.state.selectedRecord["sarno"]:""
        };

          postParam = {
            inputListName: "Instrument",
            selectedObject: "selectedInstrument",
            primaryKeyField: "ninstrumentcode",
            isSingleGet: true
          };
      }
      const inputParam = {
        classUrl: this.props.Login.inputParam.classUrl,
        methodUrl: "InstrumentCalibration",
        inputData: inputData,
        operation: this.props.Login.operation,
        saveType,
        formRef,
        searchRef: this.searchRef,
        postParam: postParam ? postParam : undefined
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
            // openChildModal: true,
          },
        };
        this.props.updateStore(updateInfo);
      } else {
        this.props.crudMaster(inputParam, masterData, "openChildModal");
      }
    } else if (
      this.props.Login.screenName === "IDS_INSTRUMENTCALIBRATIONFILE"
    ) {
      const inputParam = this.onSaveInstrumentCalibrationFile(
        saveType,
        formRef
      );
      if(this.props.Login.operation === "update"){
        let postParam = {
          inputListName: "Instrument",
          selectedObject: "selectedInstrumentCalibration",
          primaryKeyField: "ninstrumentcalibrationcode",
        };
        inputParam["postParam"] = postParam;
      }
      let clearSelectedRecordField =[
        { "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "width": "200px","controlType": "textbox","isClearField":true },
        { "idsName": "IDS_DESCRIPTION", "dataField": "sfiledesc", "width": "200px","controlType": "textbox","isClearField":true },
        { "idsName": "IDS_DESCRIPTION", "dataField": "slinkdescription", "width": "200px","controlType": "textbox","isClearField":true },
        
        
    ]
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
            popUp: undefined,
            // openChildModal: true,
          },
        };
        this.props.updateStore(updateInfo);
      } else {
        this.props.crudMaster(inputParam, masterData, "openChildModal","","",clearSelectedRecordField);
      }
    } else if (this.props.Login.screenName === "IDS_INSTRUMENTMAINTENANCE") {
      let postParam = undefined;
      if (this.props.Login.operation === "create")
        inputData["instrumentmaintenance"] = {
          ninstrumentcode:
            this.props.Login.masterData.selectedInstrument.ninstrumentcode,
            nopenusercode: this.props.Login.userInfo.nusercode,
            ncloseusercode: this.props.Login.userInfo.nusercode,
          nmaintenancestatus:
            this.state.selectedRecord.ntranscode.item.ntranscode,
          dlastmaintenancedate: formatInputDate(
            this.state.selectedRecord["dlastmaintenancedate"],
            false
          ),
          dduedate: formatInputDate(
            this.state.selectedRecord["dduedate"],
            false
          ),
          ntzopendate: this.state.selectedRecord["ntzopendate"]
            ? this.state.selectedRecord["ntzopendate"].value
            : "-1",
          ntzclosedate: this.state.selectedRecord["ntzclosedate"]
            ? this.state.selectedRecord["ntzclosedate"].value
            : "-1",
          ntzlastmaintenancedate: this.state.selectedRecord[
            "ntzlastmaintenancedate"
          ]
            ? this.state.selectedRecord["ntzlastmaintenancedate"].value
            : "-1",
          ntzduedate: this.state.selectedRecord["ntzduedate"]
            ? this.state.selectedRecord["ntzduedate"].value
            : "-1",
        };
      else {
        inputData["instrumentmaintenance"] = {
          ninstrumentcode:
            this.props.Login.masterData.selectedInstrument.ninstrumentcode,
          ninstrumentmaintenancecode:
            this.props.Login.masterData.selectedInstrumentMaintenance
              .ninstrumentmaintenancecode,
          nmaintenancestatus: this.state.selectedRecord.ntranscode.value,
          dlastmaintenancedate: formatInputDate(
            this.state.selectedRecord["dlastmaintenancedate"] && 
             this.state.selectedRecord["dlastmaintenancedate"] ,
            false
          ),
          dduedate: formatInputDate(
            this.state.selectedRecord["dduedate"],
            false
          ),
          ntzduedate: this.state.selectedRecord["ntzduedate"]
            ? this.state.selectedRecord["ntzduedate"].value
            : "-1",
          ntzlastmaintenancedate: this.state.selectedRecord[
            "ntzlastmaintenancedate"
          ]
            ? this.state.selectedRecord["ntzlastmaintenancedate"].value
            : "-1",
        };

        postParam = {
          inputListName: "Instrument",
          selectedObject: "selectedInstrument",
          primaryKeyField: "ninstrumentcode",
          isSingleGet: true
        };
      }
      const inputParam = {
        classUrl: this.props.Login.inputParam.classUrl,
        methodUrl: "InstrumentMaintenance",
        inputData: inputData,
        operation: this.props.Login.operation,
        saveType,
        formRef,
        searchRef: this.searchRef,
        postParam: postParam ? postParam : undefined
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
            // openChildModal: true,
          },
        };
        this.props.updateStore(updateInfo);
      } else {
        this.props.crudMaster(inputParam, masterData, "openChildModal");
      }
    } else if (
      this.props.Login.screenName === "IDS_INSTRUMENTMAINTENANCEFILE"
    ) {
      const inputParam = this.onSaveInstrumentMaintenanceFile(
        saveType,
        formRef
      );
      if(this.props.Login.operation === "update"){
        let postParam = {
          inputListName: "Instrument",
          selectedObject: "selectedInstrumentMaintenance",
          primaryKeyField: "ninstrumentmaintenancecode",
        };
        inputParam["postParam"] = postParam;
      }
      let clearSelectedRecordField =[
        { "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "width": "200px","controlType": "textbox","isClearField":true },
        { "idsName": "IDS_DESCRIPTION", "dataField": "sfiledesc", "width": "200px","controlType": "textbox","isClearField":true },
        { "idsName": "IDS_DESCRIPTION", "dataField": "slinkdescription", "width": "200px","controlType": "textbox","isClearField":true },
        
        
    ]
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
            popUp: undefined,
            // openChildModal: true,
          },
        };
        this.props.updateStore(updateInfo);
      } else {
        this.props.crudMaster(inputParam, masterData, "openChildModal","","",clearSelectedRecordField);
      }
    }
  };

  onNumericInputOnChange = (value, name) => {
    const selectedRecord = this.state.selectedRecord || {};
    selectedRecord[name] = value;
    this.setState({ selectedRecord });
  };

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

  // static getDerivedStateFromProps(props, state) {
  //   if (props.Login.masterStatus !== "") {
  //     if (props.Login.errorCode === 417 || props.Login.errorCode === 409) {
  //       toast.warn(props.Login.masterStatus);
  //       props.Login.masterStatus = "";
  //     }
  //   }
  //   if (props.Login.error !== state.error) {
  //     toast.error(props.Login.error);
  //     props.Login.error = "";
  //   }
  //   if (props.Login.selectedRecord === undefined) {
  //     return { selectedRecord: {} };
  //   }
  //   return null;
  // }

  validateEsign = () => {
    let modalName;
    const inputParam = {
      inputData: {
        userinfo: {
          ...this.props.Login.userInfo,
          sreason: this.state.selectedRecord["esigncomments"],
          nreasoncode:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
          spredefinedreason:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
     
        },
        password: this.state.selectedRecord["esignpassword"],
      },
      screenData: this.props.Login.screenData,
    };
   // if (this.props.Login.Action === "OPENDATE") {
    if(this.props.Login.screenName === "IDS_INSTRUMENT" || this.props.Login.screenName === "Instrument"){
      modalName="openModal";
    }
    else{
      if(this.props.Login.popUp === "IDS_INSTRUMENTMAINTENANCEOPENDATE" || this.props.Login.popUp === "IDS_INSTRUMENTMAINTENANCECLOSEDATE"
      || this.props.Login.popUp === "IDS_INSTRUMENTCALIBRATIONOPENDATE" || this.props.Login.popUp === "IDS_INSTRUMENTCALIBRATIONCLOSEDATE")
      {
        modalName = "openModal";
      }
      else
      {
        modalName="openChildModal";
      }
     
    }
    this.props.validateEsignCredential(inputParam, modalName);
  //  } else if (this.props.Login.Action === "Edit") {
    //  this.props.validateEsignCredential(inputParam, "openModal");
  //  } else if (this.props.Login.Action === "Delete") {
    //  this.props.validateEsignCredential(inputParam, "openModal");
   // } else if (this.props.Login.Action === "Add") {
   //   this.props.validateEsignCredential(inputParam, "openModal");
   // } else if (this.props.Login.Action === "Closedate") {
   //   this.props.validateEsignCredential(inputParam, "modalShow");
   // } else {
    //  this.props.validateEsignCredential(inputParam, "openModal");
  //  }
  };

  defaultRecord = (defaultParam) => {
    const methodUrl = defaultParam.methodUrl;
    let dataItem = defaultParam.selectedRecord;
    dataItem["ndefaultstatus"] = transactionStatus.YES;
    let dataState = undefined;
    if (defaultParam.screenName === "IDS_SECTION") {
      dataState = this.state.sectionDataState;
    }
    const inputParam = {
      inputData: {
        [methodUrl]: dataItem,
        userinfo: this.props.Login.userInfo,
      },
      classUrl: "instrument",
      operation: "setDefault",
      methodUrl: methodUrl,
      dataState,
    };
    const masterData = this.props.Login.masterData;

    if (
      showEsign(
        this.props.Login.userRoleControlRights,
        this.props.Login.userInfo.nformcode,
        defaultParam.ncontrolCode
      )
    ) {
      const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: {
          loadEsign: true,
          screenData: { inputParam, masterData },
          openChildModal: true,
          screenName: "Test",
          operation: defaultParam.operation,
          selectedRecord: {},
        },
      };
      this.props.updateStore(updateInfo);
    } else {
      this.props.crudMaster(inputParam, masterData, "openChildModal", {});
    }
  };

  onSwitchChange = (item, key, methodUrl) => {
    let dataItem = item;
    dataItem["ndefaultstatus"] = 3;
    const inputParam = {
      inputData: {
        [key]: dataItem,
        userinfo: this.props.userInfo,
      },
      classUrl: "testmaster",
      operation: "setDefault",
      methodUrl: methodUrl,
    };
    this.props.crudMaster(
      inputParam,
      this.props.masterData,
      "openChildModal",
      {}
    );
  };

  deleteTabFileRecord = (deleteParam) => {
        let inputData = [];
        const screenName = deleteParam.screenName;
        if (screenName === "IDS_INSTRUMENTVALIDATIONFILE") {
          if(this.props.Login.masterData.selectedInstrument.ninstrumentstatus!==transactionStatus.Disposed){
            const dataState = this.state.sectionDataState;
            inputData["InstrumentFile"] = {
                                          ninstrumentcode:this.props.Login.masterData.selectedInstrument.ninstrumentcode,
                                          ninstrumentfilecode: deleteParam.selectedRecord.ninstrumentfilecode,
                                          ninstrumentlogcode: this.props.Login.masterData.selectedInstrumentValidation.ninstrumentvalidationcode,
                                          sfilename: deleteParam.selectedRecord.sfilename,
                                          sfiledesc: deleteParam.selectedRecord.sfiledesc,
                                          nattachmenttypecode: deleteParam.selectedRecord.nattachmenttypecode,
                                          nlinkcode: deleteParam.selectedRecord.nlinkcode,
                                          ninstrumentlogtypecode: deleteParam.selectedRecord.ninstrumentlogtypecode,
                                          slinkname: deleteParam.selectedRecord.slinkname,
                                          screateddate: deleteParam.selectedRecord.screateddate,
                                          ninstrumentcatcode: this.props.Login.masterData.SelectedInsCat.ninstrumentcatcode,
                                          sinstrumentcatname: this.props.Login.masterData.SelectedInsCat.sinstrumentcatname

                                        };
            inputData["userinfo"] = this.props.Login.userInfo;
            const inputParam = {
                    methodUrl: "InstrumentValidationFile",
                    classUrl: this.props.Login.inputParam.classUrl,
                    inputData: inputData,
                    operation: deleteParam.operation,
                    dataState: dataState,
                    selectedRecord: {...this.state.selectedRecord},
                    postParam: {
                      inputListName: "Instrument", selectedObject: "selectedInstrument", primaryKeyField: "ninstrumentcode",
                      fetchUrl: "instrument/getActiveInstrumentById", fecthInputObject: { userinfo: this.props.Login.userInfo },
                  }
                };
            const masterData = this.props.Login.masterData;
            if (showEsign(this.props.Login.userRoleControlRights,this.props.Login.userInfo.nformcode,deleteParam.ncontrolCode)) 
            {
                const updateInfo = {
                                    typeName: DEFAULT_RETURN,
                                    data: {
                                      loadEsign: true,
                                      screenData: { inputParam, masterData },
                                      openChildModal: true,
                                      screenName: screenName,
                                      operation: deleteParam.operation,
                                    },
                                  };
                  this.props.updateStore(updateInfo);
            } else {
              this.props.crudMaster(inputParam, masterData, "openChildModal");
            }
          }
          else{
 toast.warn(
        this.props.intl.formatMessage({
          id: "IDS_DISPOSEDINSTRUMENT",
        })
      );

          }
        } 
        else if (screenName === "IDS_INSTRUMENTCALIBRATIONFILE") {
          if(this.props.Login.masterData.selectedInstrument.ninstrumentstatus!==transactionStatus.Disposed){
                const dataState = this.state.sectionDataState;
                inputData["InstrumentFile"] = {
                                                ninstrumentcode:this.props.Login.masterData.selectedInstrument.ninstrumentcode,

                                                ninstrumentfilecode: deleteParam.selectedRecord.ninstrumentfilecode,
                                                ninstrumentlogcode:this.props.Login.masterData.selectedInstrumentCalibration.ninstrumentcalibrationcode,
                                                sfilename: deleteParam.selectedRecord.sfilename,
                                                sfiledesc: deleteParam.selectedRecord.sfiledesc,
                                                nattachmenttypecode: deleteParam.selectedRecord.nattachmenttypecode,
                                                nlinkcode: deleteParam.selectedRecord.nlinkcode,
                                                ninstrumentlogtypecode: deleteParam.selectedRecord.ninstrumentlogtypecode,
                                                slinkname: deleteParam.selectedRecord.slinkname,
                                                screateddate: deleteParam.selectedRecord.screateddate,
                                                ninstrumentcatcode: this.props.Login.masterData.SelectedInsCat.ninstrumentcatcode,
                                                sinstrumentcatname: this.props.Login.masterData.SelectedInsCat.sinstrumentcatname
                                              };
                inputData["userinfo"] = this.props.Login.userInfo;
                const inputParam = {
                                  methodUrl: "InstrumentCalibrationFile",
                                  classUrl: this.props.Login.inputParam.classUrl,
                                  inputData: inputData,
                                  operation: deleteParam.operation,
                                  dataState: dataState,
                                  selectedRecord: {...this.state.selectedRecord},
                                  postParam: {
                                    inputListName: "Instrument", selectedObject: "selectedInstrument", primaryKeyField: "ninstrumentcode",
                                    fetchUrl: "instrument/getActiveInstrumentById", fecthInputObject: { userinfo: this.props.Login.userInfo },
                                }
                              };
                const masterData = this.props.Login.masterData;
              if (showEsign( this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode,deleteParam.ncontrolCode)  ) 
              {
                    const updateInfo = {
                                      typeName: DEFAULT_RETURN,
                                      data: {
                                        loadEsign: true,
                                        screenData: { inputParam, masterData },
                                        openChildModal: true,
                                        screenName: screenName,
                                        operation: deleteParam.operation,
                                        popUp: undefined,
                                      },
                                    };
                    this.props.updateStore(updateInfo);
              } 
              else {
                this.props.crudMaster(inputParam, masterData, "openChildModal");
              }
            }
            else{
              toast.warn(
                this.props.intl.formatMessage({
                  id: "IDS_DISPOSEDINSTRUMENT",
                })
              );
          
            }
    } else if (screenName === "IDS_INSTRUMENTMAINTENANCEFILE") {
      if(this.props.Login.masterData.selectedInstrument.ninstrumentstatus!==transactionStatus.Disposed){
      const dataState = this.state.sectionDataState;
      inputData["InstrumentFile"] = {

        ninstrumentfilecode: deleteParam.selectedRecord.ninstrumentfilecode,
        ninstrumentlogcode:
          this.props.Login.masterData.selectedInstrumentMaintenance
            .ninstrumentmaintenancecode,
            ninstrumentcode:this.props.Login.masterData.selectedInstrument.ninstrumentcode,

        sfilename: deleteParam.selectedRecord.sfilename,
        sfiledesc: deleteParam.selectedRecord.sfiledesc,
        nattachmenttypecode: deleteParam.selectedRecord.nattachmenttypecode,
        nlinkcode: deleteParam.selectedRecord.nlinkcode,
        ninstrumentlogtypecode: deleteParam.selectedRecord.ninstrumentlogtypecode,
        slinkname: deleteParam.selectedRecord.slinkname,
        screateddate: deleteParam.selectedRecord.screateddate,
        ninstrumentcatcode: this.props.Login.masterData.SelectedInsCat.ninstrumentcatcode,
        sinstrumentcatname: this.props.Login.masterData.SelectedInsCat.sinstrumentcatname
      };
      inputData["userinfo"] = this.props.Login.userInfo;
      const inputParam = {
        methodUrl: "InstrumentMaintenanceFile",
        classUrl: this.props.Login.inputParam.classUrl,
        inputData: inputData,
        operation: deleteParam.operation,
        dataState: dataState,
        selectedRecord: {...this.state.selectedRecord},
        postParam: {
          inputListName: "Instrument", selectedObject: "selectedInstrument", primaryKeyField: "ninstrumentcode",
          fetchUrl: "instrument/getActiveInstrumentById", fecthInputObject: { userinfo: this.props.Login.userInfo },
      }
      };
      const masterData = this.props.Login.masterData;
      if (
        showEsign(
          this.props.Login.userRoleControlRights,
          this.props.Login.userInfo.nformcode,
          deleteParam.ncontrolCode
        )
      ) {
        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: {
            loadEsign: true,
            screenData: { inputParam, masterData },
            openChildModal: true,
            screenName: screenName,
            operation: deleteParam.operation,
            popUp: undefined,
          },
        };
        this.props.updateStore(updateInfo);
      } else {
        this.props.crudMaster(inputParam, masterData, "openChildModal");
      }
    
  }
  else{
    toast.warn(
      this.props.intl.formatMessage({
        id: "IDS_DISPOSEDINSTRUMENT",
      })
    );

  }
}
 
  
  };


  DeleteInstrument = (operation, ncontrolCode) => {
    let inputData = [];
    if (operation.screenName === "IDS_SECTION") {
      if(this.props.Login.masterData.selectedInstrument.ninstrumentstatus!==transactionStatus.Disposed){
      const dataState = this.state.sectionDataState;
      inputData["instrumentsection"] = {
        nsitecode: this.props.Login.userInfo.nmastersitecode,
      };
      inputData["instrumentsection"]["ninstrumentsectioncode"] =
        operation.selectedRecord.ninstrumentsectioncode;
      inputData["instrumentsection"]["ninstrumentcode"] =
        operation.selectedRecord.ninstrumentcode;
      inputData["instrumentsection"]["ndefaultstatus"] =
        operation.selectedRecord.ndefaultstatus;
        inputData["instrumentsection"]["ssectionname"] =
        operation.selectedRecord.ssectionname;
        inputData["instrumentsection"]["susername"] =
        operation.selectedRecord.susername;
        inputData["instrumentsection"]["nusercode"] =
        operation.selectedRecord.nusercode;
        inputData["instrumentsection"]["nsectioncode"] =
        operation.selectedRecord.nsectioncode;

      inputData["userinfo"] = this.props.Login.userInfo;
      const inputParam = {
        methodUrl: "Section",
        classUrl: this.props.Login.inputParam.classUrl,
        inputData: inputData,
        operation: "delete",
        dataState: dataState,
        selectedRecord: {...this.state.selectedRecord},
        postParam: {
          inputListName: "Instrument", selectedObject: "selectedInstrument", primaryKeyField: "ninstrumentcode",
          fetchUrl: "instrument/getActiveInstrumentById", fecthInputObject: { userinfo: this.props.Login.userInfo },
      }
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
    }
    else{
      toast.warn(
        this.props.intl.formatMessage({
          id: "IDS_DISPOSEDINSTRUMENT",
        })
      );

    }
    }
    else if (operation.screenName === "IDS_INSTRUMENTVALIDATION") {
      if(this.props.Login.masterData.selectedInstrument.ninstrumentstatus!==transactionStatus.Disposed){
      const dataState = this.state.sectionDataState;
      inputData["InstrumentValidation"] = {
        ninstrumentvalidationcode:
          this.props.Login.masterData.selectedInstrumentValidation
            .ninstrumentvalidationcode,
      };
      inputData["InstrumentValidation"]["ninstrumentcode"] =
        this.props.Login.masterData.selectedInstrumentValidation.ninstrumentcode;

      inputData["userinfo"] = this.props.Login.userInfo;
      const inputParam = {
        methodUrl: "InstrumentValidation",
        classUrl: this.props.Login.inputParam.classUrl,
        inputData: inputData,
		//ALPD-5536--Vignesh(07-03-2025)-->Instrument screen -> Blank page occurs, when delete the instrument calibration tab.
        operation: operation.operation,
         dataState: dataState,
        selectedRecord: {...this.state.selectedRecord},
        postParam: {
          inputListName: "Instrument", selectedObject: "selectedInstrument", primaryKeyField: "ninstrumentcode",
          fetchUrl: "instrument/getActiveInstrumentById", fecthInputObject: { userinfo: this.props.Login.userInfo },
      }
      };
      const masterData = this.props.Login.masterData;
      if (
        showEsign(
          this.props.Login.userRoleControlRights,
          this.props.Login.userInfo.nformcode,
          ncontrolCode
        )
      ) {
        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: {
            loadEsign: true,
            screenData: { inputParam, masterData },
            openChildModal: true,
            popUp:undefined,
            operation: operation.operation,
		//ALPD-5536--Vignesh(07-03-2025)-->Instrument screen -> Blank page occurs, when delete the instrument calibration tab.
            screenName: operation.screenName
          },
        };
        this.props.updateStore(updateInfo);
      } else {
        this.props.crudMaster(inputParam, masterData, "openChildModal");
      }
    }
    else{
      toast.warn(
        this.props.intl.formatMessage({
          id: "IDS_DISPOSEDINSTRUMENT",
        })
      );
    }
    } else if (operation.screenName === "IDS_INSTRUMENTCALIBRATION") {
      if(this.props.Login.masterData.selectedInstrument.ninstrumentstatus!==transactionStatus.Disposed){
      inputData["InstrumentCalibration"] = {
        ninstrumentcalibrationcode:
          this.props.Login.masterData.selectedInstrumentCalibration
            .ninstrumentcalibrationcode,
            ncalibrationstatus:
          this.props.Login.masterData.selectedInstrumentCalibration
            .ncalibrationstatus,
      };
      inputData["InstrumentCalibration"]["ninstrumentcode"] =
        this.props.Login.masterData.selectedInstrumentCalibration.ninstrumentcode;
      inputData["nFlag"] = operation.nFlag;

      inputData["userinfo"] = this.props.Login.userInfo;
      const inputParam = {
        methodUrl: "InstrumentCalibration",
        classUrl: this.props.Login.inputParam.classUrl,
        inputData: inputData,
		//ALPD-5536--Vignesh(07-03-2025)-->Instrument screen -> Blank page occurs, when delete the instrument calibration tab.
        operation: operation.operation,
        selectedRecord: {...this.state.selectedRecord},
        postParam: {
          inputListName: "Instrument", selectedObject: "selectedInstrument", primaryKeyField: "ninstrumentcode",
          fetchUrl: "instrument/getActiveInstrumentById", fecthInputObject: { userinfo: this.props.Login.userInfo },
      }
      };
      const masterData = this.props.Login.masterData;
      if (
        showEsign(
          this.props.Login.userRoleControlRights,
          this.props.Login.userInfo.nformcode,
          ncontrolCode
        )
      ) {
        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: {
            loadEsign: true,
            screenData: { inputParam, masterData },
            openChildModal: true,
            operation: operation.operation,
			//ALPD-5536--Vignesh(07-03-2025)-->Instrument screen -> Blank page occurs, when delete the instrument calibration tab.
           screenName: operation.screenName,
           popUp: undefined     
          },
        };
        this.props.updateStore(updateInfo);
      } else {
        this.props.crudMaster(inputParam, masterData, "openChildModal");
      }
    }
    else{
      toast.warn(
        this.props.intl.formatMessage({
          id: "IDS_DISPOSEDINSTRUMENT",
        })
      );
    }
    } else if (operation.screenName === "IDS_INSTRUMENTMAINTENANCE") {
      if(this.props.Login.masterData.selectedInstrument.ninstrumentstatus!==transactionStatus.Disposed){
      const dataState = this.state.sectionDataState;
      inputData["InstrumentMaintenance"] = {
        ninstrumentmaintenancecode:
          this.props.Login.masterData.selectedInstrumentMaintenance
            .ninstrumentmaintenancecode,
      };
      inputData["InstrumentMaintenance"]["ninstrumentcode"] =
        this.props.Login.masterData.selectedInstrumentMaintenance.ninstrumentcode;

      inputData["userinfo"] = this.props.Login.userInfo;
      const inputParam = {
        methodUrl: "InstrumentMaintenance",
        classUrl: this.props.Login.inputParam.classUrl,
        inputData: inputData,
		//ALPD-5536--Vignesh(07-03-2025)-->Instrument screen -> Blank page occurs, when delete the instrument calibration tab.
        operation: operation.operation,
        dataState: dataState,
        selectedRecord: {...this.state.selectedRecord},
        postParam: {
          inputListName: "Instrument", selectedObject: "selectedInstrument", primaryKeyField: "ninstrumentcode",
          fetchUrl: "instrument/getActiveInstrumentById", fecthInputObject: { userinfo: this.props.Login.userInfo },
      }
      };
      const masterData = this.props.Login.masterData;
      if (
        showEsign(
          this.props.Login.userRoleControlRights,
          this.props.Login.userInfo.nformcode,
          ncontrolCode
        )
      ) {
        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: {
            loadEsign: true,
            screenData: { inputParam, masterData },
            openChildModal: true,
			//ALPD-5536--Vignesh(07-03-2025)-->Instrument screen -> Blank page occurs, when delete the instrument calibration tab.
            screenName: operation.screenName,
            operation: operation.operation,
            popUp: undefined
            //popUp: 'IDS_INSTRUMENTMAINTENANCE'
          },
        };
        this.props.updateStore(updateInfo);
      } else {
        this.props.crudMaster(inputParam, masterData, "openChildModal");
      }
    }
    else{
      toast.warn(
        this.props.intl.formatMessage({
          id: "IDS_DISPOSEDINSTRUMENT",
        })
      );
    }

    } else {
      inputData["instrument"] = this.props.Login.masterData.selectedInstrument;
      inputData["userinfo"] = this.props.Login.userInfo;

      const postParam = {
        inputListName: "Instrument",
        selectedObject: "selectedInstrument",
        primaryKeyField: "ninstrumentcode",
        primaryKeyValue:
          this.props.Login.masterData.selectedInstrument.ninstrumentcode,
        fetchUrl: "instrument/getInstrument",
        fecthInputObject: { userinfo: this.props.Login.userInfo },
      };

      const inputParam = {
        methodUrl: "Instrument",
        postParam,
        classUrl: this.props.Login.inputParam.classUrl,
        inputData: inputData,
        operation: operation.operation,
        selectedRecord: {...this.state.selectedRecord}
      };
      const masterData = this.props.Login.masterData;
      if (
        showEsign(
          this.props.Login.userRoleControlRights,
          this.props.Login.userInfo.nformcode,
          ncontrolCode
        )
      ) {
        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: {
            loadEsign: true,
            screenData: { inputParam, masterData },
            openModal: true,
            screenName: "Instrument",
            operation: operation.operation,
            popUp: undefined
          },
        };
        this.props.updateStore(updateInfo);
      } else {
        this.props.crudMaster(inputParam, masterData, "openModal");
      }
    }
  
 
  };

  deleteAttachment = (event, file, fieldName) => {
    if(this.props.Login.masterData.selectedInstrument.ninstrumentstatus!==transactionStatus.Disposed){
    let selectedRecord = this.state.selectedRecord || {};
    selectedRecord[fieldName] = deleteAttachmentDropZone(
      selectedRecord[fieldName],
      file
    );

    this.setState({
      selectedRecord,
      actionType: "delete",
    });
  }
  else{
    toast.warn(
      this.props.intl.formatMessage({
        id: "IDS_DISPOSEDINSTRUMENT",
      })
    );
  }
  };

  render() {
    //console.log("master main", this.props.Login);
    let mandatoryFields = [];
    if (this.props.Login.screenName === "IDS_INSTRUMENT") {
      mandatoryFields.push(
        {
          mandatory: true,
          idsName: "IDS_INSTRUMENTCATEGORY",
          dataField: "ninstrumentcatcode",
          mandatoryLabel: "IDS_SELECT",
          controlType: "selectbox",
        },
        //Commented by sonia on 04th Mar 2025 for  jira id:ALPD-5504
        // {
        //   mandatory: true,
        //   idsName: "IDS_INSTRUMENTID",
        //   dataField: "sinstrumentid",
        //   mandatoryLabel: "IDS_ENTER",
        //   controlType: "textbox",
        // },
        {
          mandatory: true,
          idsName: "IDS_INSTRUMENTNAME",
          dataField: "ninstrumentnamecode",
          mandatoryLabel: "IDS_SELECT",
          controlType: "selectbox",
        },
        // {
        //   mandatory: true,
        //   idsName: "IDS_MANUFACTURERDATE",
        //   dataField: "dmanufacdate",
        //   mandatoryLabel: "IDS_CHOOSE",
        //   controlType: "selectbox",
        // },
       
        {
          mandatory: true,
          idsName: "IDS_SERVICEBY",
          dataField: "nservicecode",
          mandatoryLabel: "IDS_SELECT",
          controlType: "selectbox",
        },
        {
          mandatory: true,
          idsName: "IDS_INSTRUMENTAVAILABLESITE",
          dataField: "nregionalsitecode",
          mandatoryLabel: "IDS_SELECT",
          controlType: "selectbox",
        },
       
      //   {
         
      //         mandatory: true,

      //         idsName: "IDS_VALIDATIONSTATUS",
      //         dataField: "validation",
      //         mandatoryLabel: "IDS_SELECT",
      //         controlType: "selectbox",
      //   },
      //   {
      //         mandatory: true,
      //         idsName: "IDS_CALIBRATIONSTATUS",
      //         dataField: "calibration",
      //         mandatoryLabel: "IDS_SELECT",
      //         controlType: "selectbox",
      //   },
      //  {
      //     mandatory: true,
      //     idsName: "IDS_MAINTENANCESTATUS",
      //     dataField: "maintenance",
      //     mandatoryLabel: "IDS_SELECT",
      //     controlType: "selectbox",
      //   }, 
        {
          mandatory: true,
          idsName: "IDS_INSTRUMENTSTATUS",
          dataField: "ntranscode",
          mandatoryLabel: "IDS_SELECT",
          controlType: "selectbox",
        },
        	//added by sujatha ALPDJ21-21 
        {
          mandatory: true,
          idsName: "IDS_MAINTENANCEINTERVAL",
          dataField: "nnextmaintenance",
          mandatoryLabel: "IDS_SELECT",
          controlType: "textbox",
        },
        {
          mandatory: true,
          idsName: "IDS_PERIOD",
          dataField: "nnextmaintenanceperiod",
          mandatoryLabel: "IDS_SELECT",
          controlType: "selectbox",
        },
      );

      //Added by sonia on 04th Mar 2025 for  jira id:ALPD-5504
      if(parseInt(this.props.Login.settings[78]) !== transactionStatus.YES){
        mandatoryFields.push(
          {
            mandatory: true,
            idsName: "IDS_INSTRUMENTID",
            dataField: "sinstrumentid",
            mandatoryLabel: "IDS_ENTER",
            controlType: "textbox",
          },
        );  
      }

      if (this.state.selectedRecord["nsectioncode"]) {
        mandatoryFields.push({
          mandatory: true,
          idsName: "IDS_INCHARGE",
          dataField: "nusercode",
          mandatoryLabel: "IDS_SELECT",
          controlType: "selectbox",
        });
      }
      if (this.props.Login.operation === "create") {
        mandatoryFields.push({
         
          mandatory: true,
          idsName: "IDS_VALIDATIONSTATUS",
          dataField: "validation",
          mandatoryLabel: "IDS_SELECT",
          controlType: "selectbox",
        },
      );
      }
      	//added by sujatha ALPDJ21-21 
       if (this.props.Login.operation === "create" && this.props.Login.CalibrationRequired ===transactionStatus.YES) {
         mandatoryFields.push({
          mandatory: true,
          idsName: "IDS_CALIBRATIONSTATUS",
          dataField: "calibration",
          mandatoryLabel: "IDS_SELECT",
          controlType: "selectbox",
         })
       }
       	//added by sujatha ALPDJ21-21 
      if (/*this.props.Login.operation === "create" && */this.props.Login.CalibrationRequired ===transactionStatus.YES) {
        mandatoryFields.push(/*{
          mandatory: true,
          idsName: "IDS_CALIBRATIONSTATUS",
          dataField: "calibration",
          mandatoryLabel: "IDS_SELECT",
          controlType: "selectbox",
        }, */ 
         {
          mandatory: true,
          idsName: "IDS_CALIBRATIONINTERVAL",
          dataField: "nnextcalibration",
          mandatoryLabel: "IDS_ENTER",
          controlType: "textbox",
        },
        {
          mandatory: true,
          idsName: "IDS_PERIOD",
          dataField: "nnextcalibrationperiod",
          mandatoryLabel: "IDS_SELECT",
          controlType: "selectbox",
        }
        );

      }
      if (this.props.Login.operation === "create") {
        mandatoryFields.push({
          mandatory: true,
          idsName: "IDS_MAINTENANCESTATUS",
          dataField: "maintenance",
          mandatoryLabel: "IDS_SELECT",
          controlType: "selectbox",
        });
      }
    } else if (this.props.Login.screenName === "IDS_SECTION")
      mandatoryFields.push(
        {
          mandatory: true,
          idsName: "IDS_SECTION",
          dataField: "nsectioncode",
          mandatoryLabel: "IDS_SELECT",
          controlType: "selectbox",
        },
        {
          mandatory: true,
          idsName: "IDS_INCHARGE",
          dataField: "nusercode",
          mandatoryLabel: "IDS_SELECT",
          controlType: "selectbox",
        }
      );
    else if (this.props.Login.screenName === "IDS_INSTRUMENTVALIDATION") {
      mandatoryFields.push({
        mandatory: true,
        idsName: "IDS_STATUS",
        dataField: "ntranscode",
        mandatoryLabel: "IDS_SELECT",
        controlType: "selectbox",
      });
    } else if (
      this.props.Login.screenName === "IDS_INSTRUMENTVALIDATIONFILE" ||
      this.props.Login.screenName === "IDS_INSTRUMENTCALIBRATIONFILE" ||
      this.props.Login.screenName === "IDS_INSTRUMENTMAINTENANCEFILE"
    ) {
      if (this.state.selectedRecord && this.state.selectedRecord.nattachmenttypecode === attachmentType.LINK) {
        mandatoryFields.push(
          { "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "mandatory": true, "mandatoryLabel":"IDS_CHOOSE", "controlType": "file" },
          { "idsName": "IDS_LINKNAME", "dataField": "nlinkcode", "mandatory": true, "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" }
          );
            } else {
              mandatoryFields.push(
                { "idsName": "IDS_FILE", "dataField": "sfilename", "mandatory": true , "mandatoryLabel":"IDS_CHOOSE", "controlType": "file"}
                );
            }
      // mandatoryFields.push({
      //   idsName: "IDS_FILE",
      //   dataField: "sfilename",
      //   mandatory: true,
      //   mandatoryLabel: "IDS_CHOOSE",
      //   controlType: "file",
      // });
    } else if (this.props.Login.screenName === "IDS_INSTRUMENTCALIBRATION") {
      mandatoryFields.push({
        mandatory: true,
        idsName: "IDS_STATUS",
        dataField: "ntranscode",
        mandatoryLabel: "IDS_SELECT",
        controlType: "selectbox",
      });
    } else if (this.props.Login.screenName === "IDS_INSTRUMENTMAINTENANCE") {
      mandatoryFields.push({
        mandatory: true,
        idsName: "IDS_STATUS",
        dataField: "ntranscode",
        mandatoryLabel: "IDS_SELECT",
        controlType: "selectbox",
      });
    } else if (this.props.Login.modalTitle === "IDS_OPENDATE") {
      mandatoryFields.push({
        mandatory: true,
        idsName: "IDS_STATUS",
        dataField: "ntranscode",
        mandatoryLabel: "IDS_SELECT",
        controlType: "selectbox",
      });
    }

    const addId =
      this.state.controlMap.has("AddInstrument") &&
      this.state.controlMap.get("AddInstrument").ncontrolcode;
    const editId =
      this.state.controlMap.has("EditInstrument") &&
      this.state.controlMap.get("EditInstrument").ncontrolcode;
    const deleteId =
      this.state.controlMap.has("DeleteInstrument") &&
      this.state.controlMap.get("DeleteInstrument").ncontrolcode;
    //Added by sonia on 30th Sept 2024 for Jira idL:ALPD-4940  
    const autoCalibrationId =
      this.state.controlMap.has("AutoCalibration") &&
      this.state.controlMap.get("AutoCalibration").ncontrolcode;

    const { selectedInstrument } = this.props.Login.masterData;
    const filterParam = {
      inputListName: "Instrument",
      selectedObject: "selectedInstrument",
      primaryKeyField: "ninstrumentcode",
      fetchUrl: "instrument/getInstrument",
      fecthInputObject: { userinfo: this.props.Login.userInfo },
      masterData: this.props.Login.masterData,
      searchFieldList: this.searchFieldList,
    };
   // const breadCrumbData = this.state.filterData || [];
    let breadCrumbData = []; //this.props.Login.masterData.defaultInstrumentCatValue || [];
  
    breadCrumbData = [
      {
          "label": "IDS_INSTRUMENTCATEGORY",
          //"value": this.props.Login.masterData.defaultInstrumentCatValue ? this.props.Login.masterData.defaultInstrumentCatValue.label : "-"
           "value": this.props.Login.masterData.defaultInstrumentCatValue ? this.props.Login.masterData.SelectedInsCat.sinstrumentcatname : "-"
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
            <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
              <ListMaster
                formatMessage={this.props.intl.formatMessage}
                screenName={"Instrument"}
                masterData={this.props.Login.masterData}
                userInfo={this.props.Login.userInfo}
                masterList={
                  this.props.Login.masterData.searchedData ||
                  this.props.Login.masterData.Instrument
                }
                getMasterDetail={(Instrument) =>
                  this.props.getInstrumentDetail(
                    Instrument,
                    this.props.Login.userInfo,
                    this.props.Login.masterData
                  )
                }
                selectedMaster={this.props.Login.masterData.selectedInstrument}
                primaryKeyField="ninstrumentcode"
                mainField="sinstrumentid"
                firstField="sinstrumentname"
                secondField="sinstrumentcatname"
                isIDSField="Yes"
                filterColumnData={this.props.filterColumnData}
                filterParam={filterParam}
                userRoleControlRights={this.state.userRoleControlRights}
                searchRef={this.searchRef}
                addId={addId}
                hidePaging={false}
                reloadData={this.reloadData}
                openModal={() =>
                  this.props.getInstrumentCombo(
                    "IDS_INSTRUMENT",
                    "create",
                    "ninstrumentcode",
                    this.props.Login.masterData,
                    this.props.Login.userInfo,
                    addId
                  )
                }
                openFilter={this.openFilter}
                closeFilter={this.closeFilter}
                onFilterSubmit={this.onFilterSubmit}
                showFilterIcon={true}
                showFilter={this.props.Login.showFilter}
                filterComponent={[
                  {
                    IDS_INSTRUMENTCATEGORYFILTER: (
                      <InstrumentCategoryFilter
                        filterInstrumentCategory={
                          this.state.filterInstrumentCategory || []
                        }
                        nfilterInstrumentCategory={
                          this.state.nfilterInstrumentCategory || {}
                        }
                        onComboChange={this.onComboChange}
                      />
                    ),
                  },
                ]}
              />
            </Col>
            <Col md={`${!this.props.sidebarview ? '8' : "10"}`} className="position-relative">
                <div className="sidebar-view-btn-block">
                    <div className="sidebar-view-btn " onClick={this.props.parentFunction}>
                        {!this.props.sidebarview ?                    
                            <i class="fa fa-less-than"></i> :
                            <i class="fa fa-greater-than"></i> 
                        }
                    </div>
                </div>
              <Row>
                <Col md={12}>
                  <ContentPanel className="panel-main-content">
                    <Card className="border-0">
                      {this.props.Login.masterData.selectedInstrument ? (
                        <>
                          <Card.Header>
                            {/* <ReactTooltip
                              place="bottom"
                              globalEventOff="click"
                              id="tooltip_list_wrap"
                            /> */}
                            <Card.Title className="product-title-main">
                              {
                                this.props.Login.masterData.selectedInstrument
                                  .sinstrumentid
                              }
                            </Card.Title>
                            <Card.Subtitle>
                              <div className="d-flex product-category">
                                <h2 className="product-title-sub flex-grow-1">
                                <MediaLabel >
                                  {this.props.intl.formatMessage({ id: "IDS_STATUS" })} :
                                                                </MediaLabel>
                                                                <MediaLabel
                                                                    className={`btn btn-outlined ${this.props.Login.masterData
                                                                      .selectedInstrument.ninstrumentstatus===transactionStatus.ACTIVE?"outline-success":this.props.Login.masterData
                                                                      .selectedInstrument.ninstrumentstatus===transactionStatus.DEACTIVE?
                                                                        "outline-danger":this.props.Login.masterData
                                                                        .selectedInstrument.ninstrumentstatus===transactionStatus.Offsite ?"outline-secondary":this.props.Login.masterData
                                                                        .selectedInstrument.ninstrumentstatus ===transactionStatus.Disposed ?"outline-danger":"" } btn-sm ml-3`}>
                                                                    {this.props.Login.masterData
                                                                      .selectedInstrument.sactivestatus &&
                                                                      this.props.Login.masterData
                                                                      .selectedInstrument.sactivestatus }
                                                                </MediaLabel>

                                </h2>
                                <div className="d-inline">
                                {/* Added by sonia on 30th Sept 2024 for Jira idL:ALPD-4940  */}
                                {
                                (this.props.Login.masterData.selectedInstrument.ncalibrationreq ===transactionStatus.YES &&
                                  this.props.Login.masterData.selectedInstrument.nregionalsitecode === this.props.Login.userInfo.ntranssitecode)? 
                                  
                                  <Nav.Link
                                  name="autocalibrationInstrument"
                                  data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({id: "IDS_ENABLEDISABLEAUTOCALIBRATION",})}
                                  hidden={this.state.userRoleControlRights.indexOf(autoCalibrationId ) === -1}
                                  className="btn btn-circle outline-grey mr-2" onClick={(e) =>
                                  this.getAutoCalibration(this.props.Login.masterData,this.props.Login.userInfo, autoCalibrationId)}
                                >
           						        <AutoCalibrationIcon className="custom_icons" width="17" height="17" />
                                </Nav.Link>
  :""}
                                  <Nav.Link
                                    name="editInstrument"
                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({
                                      id: "IDS_EDIT",
                                    })}
                                 //   data-for="tooltip_list_wrap"
                                    hidden={
                                      this.state.userRoleControlRights.indexOf(
                                        editId
                                      ) === -1
                                    }
                                    className="btn btn-circle outline-grey mr-2"
                                    onClick={(e) =>
                                      this.props.getInstrumentCombo(
                                        "IDS_INSTRUMENT",
                                        "update",
                                        "ninstrumentcode",
                                        this.props.Login.masterData,
                                        this.props.Login.userInfo,
                                        editId
                                      )
                                    }
                                  >
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                  </Nav.Link>
                                  <Nav.Link
                                    name="deleteInstrument"
                                    className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({
                                      id: "IDS_DELETE",
                                    })}
                                 //   data-for="tooltip_list_wrap"
                                    hidden={
                                      this.state.userRoleControlRights.indexOf(
                                        deleteId
                                      ) === -1
                                    }
                                    onClick={() =>
                                      this.ConfirmDelete(
                                        {
                                          operation: "delete",
                                          screenName: "IDS_INSTRUMENT",
                                        },
                                        deleteId
                                      )
                                    }
                                  >
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                  </Nav.Link>
                                </div>
                              </div>
                            </Card.Subtitle>
                          </Card.Header>
                          <Card.Body>
                            <Row>
                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_INSTRUMENTNAME"
                                      message="Instrumentname"
                                    />
                                  </FormLabel>
                                  <ReadOnlyText>
                                    {
                                      this.props.Login.masterData
                                        .selectedInstrument.sinstrumentname
                                    }
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_INSTRUMENTID"
                                      message="Instrument Id"
                                    />
                                  </FormLabel>
                                  <ReadOnlyText>
                                    {
                                      this.props.Login.masterData
                                        .selectedInstrument.sinstrumentid
                                    }
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>


                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_MODELNO"
                                      message="Modelno"
                                    />
                                  </FormLabel>
                                  <ReadOnlyText>
                                    {this.props.Login.masterData
                                      .selectedInstrument.smodelnumber ===
                                      null ||
                                      this.props.Login.masterData
                                        .selectedInstrument.smodelnumber
                                        .length === 0
                                      ? "-"
                                      : this.props.Login.masterData
                                        .selectedInstrument.smodelnumber}
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>

                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_SERVICEBY"
                                      message="Service By"
                                    />
                                  </FormLabel>

                                  <ReadOnlyText>
                                    {this.props.Login.masterData
                                      .selectedInstrument.nservicecode ===-1?'-'
                                      : this.props.Login.masterData
                                        .selectedInstrument.sserviceby}
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>



                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_PONO"
                                      message="PO No."
                                    />
                                  </FormLabel>
                                  <ReadOnlyText>
                                    {this.props.Login.masterData
                                      .selectedInstrument.spono === null ||
                                      this.props.Login.masterData
                                        .selectedInstrument.spono.length === 0
                                      ? "-"
                                      : this.props.Login.masterData
                                        .selectedInstrument.spono}
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_PODATE"
                                      message="PoDate"
                                    />
                                  </FormLabel>
                                  <ReadOnlyText>
                                    {this.props.Login.masterData
                                      .selectedInstrument.dpodate === null ||
                                      this.props.Login.masterData
                                        .selectedInstrument.dpodate === 0
                                      ? "-"
                                      : this.props.Login.masterData
                                        .selectedInstrument.spodate ?
                                        rearrangeDateFormatDateOnly(this.props.Login.userInfo,
                                          this.props.Login.masterData
                                            .selectedInstrument.spodate) : this.props.Login.spodate
                                              .selectedInstrument.spodate}
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_MANUFACTURERDATE"
                                      message="ManufactureDate"
                                    />
                                  </FormLabel>
                                  <ReadOnlyText>
                                    {this.props.Login.masterData
                                      .selectedInstrument.smanufacdate ===
                                      null ||
                                      this.props.Login.masterData
                                        .selectedInstrument.smanufacdate
                                        .length === 0
                                      ? "-"
                                      : this.props.Login.masterData
                                        .selectedInstrument.smanufacdate ?
                                        rearrangeDateFormatDateOnly(this.props.Login.userInfo,
                                          this.props.Login.masterData
                                            .selectedInstrument.smanufacdate) : this.props.Login.masterData
                                              .selectedInstrument.smanufacdate}
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_MANUFACTURENAME"
                                      message="Manufacturename"
                                    />
                                  </FormLabel>

                                  <ReadOnlyText>
                                    {this.props.Login.masterData
                                      .selectedInstrument.nmanufcode ===-1?'-'
                                      : this.props.Login.masterData
                                        .selectedInstrument.smanufname}
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>
                             
                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_INSTRUMENTAVAILABLESITE"
                                      message="Instrument Location Site"
                                    />
                                  </FormLabel>
                                  <ReadOnlyText>
                                    {this.props.Login.masterData
                                      .selectedInstrument.sregionalsitename === null ||
                                      this.props.Login.masterData
                                        .selectedInstrument.sregionalsitename.length === 0
                                      ? "-"
                                      : this.props.Login.masterData
                                        .selectedInstrument.sregionalsitename}
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_INSTRUMENTLOCATION"
                                      message="Instrument Location"
                                    />
                                  </FormLabel>

                                  <ReadOnlyText>
                                    {this.props.Login.masterData
                                      .selectedInstrument.ninstrumentlocationcode ===-1?'-'
                                      : this.props.Login.masterData
                                        .selectedInstrument.sinstrumentlocationname}
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_RECEIVEDDATE"
                                      message="ReceiveDate"
                                    />
                                  </FormLabel>
                                  <ReadOnlyText>
                                    {this.props.Login.masterData
                                      .selectedInstrument.sreceiveddate ===
                                      null ||
                                      this.props.Login.masterData
                                        .selectedInstrument.sreceiveddate
                                        .length === 0
                                      ? "-"
                                      : this.props.Login.masterData
                                        .selectedInstrument.sreceiveddate ?
                                        rearrangeDateFormatDateOnly(this.props.Login.userInfo,
                                          this.props.Login.masterData
                                            .selectedInstrument.sreceiveddate) : this.props.Login.sreceiveddate
                                              .selectedInstrument.sreceiveddate}
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>

                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_INSTALLATIONDATE"
                                      message="InstallationDate"
                                    />
                                  </FormLabel>
                                  <ReadOnlyText>
                                    {this.props.Login.masterData
                                      .selectedInstrument.sinstallationdate ===
                                      null ||
                                      this.props.Login.masterData
                                        .selectedInstrument.sinstallationdate
                                        .length === 0
                                      ? "-"
                                      : this.props.Login.masterData
                                        .selectedInstrument.sinstallationdate ?
                                        rearrangeDateFormatDateOnly(this.props.Login.userInfo,
                                          this.props.Login.masterData
                                            .selectedInstrument.sinstallationdate) : this.props.Login.sinstallationdate
                                              .selectedInstrument.sinstallationdate}
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>

                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_WARRANTYEXPIRY"
                                      message="Warranty Expiry Date"
                                    />
                                  </FormLabel>
                                  <ReadOnlyText>
                                    {this.props.Login.masterData
                                      .selectedInstrument.sexpirydate ===
                                      null ||
                                      this.props.Login.masterData
                                        .selectedInstrument.sexpirydate.length ===
                                      0
                                      ? "-"
                                      : this.props.Login.masterData
                                        .selectedInstrument.sexpirydate ?
                                        rearrangeDateFormatDateOnly(this.props.Login.userInfo,
                                          this.props.Login.masterData
                                            .selectedInstrument.sexpirydate) : this.props.Login.sexpirydate
                                              .selectedInstrument.sexpirydate}
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>

                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_SERVICEDATE"
                                      message="Service in Date"
                                    />
                                  </FormLabel>
                                  <ReadOnlyText>
                                    {this.props.Login.masterData
                                      .selectedInstrument.sservicedate ===
                                      null ||
                                      this.props.Login.masterData
                                        .selectedInstrument.sservicedate.length ===
                                      0
                                      ? "-"
                                      : this.props.Login.masterData
                                        .selectedInstrument.sservicedate ?
                                        rearrangeDateFormatDateOnly(this.props.Login.userInfo,
                                          this.props.Login.masterData
                                            .selectedInstrument.sservicedate) : this.props.Login.sservicedate
                                              .selectedInstrument.sservicedate}
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>

                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_SERIALNO"
                                      message="Serialno"
                                    />
                                  </FormLabel>
                                  <ReadOnlyText>
                                    {
                                      this.props.Login.masterData
                                        .selectedInstrument.sserialno===null||
                                        this.props.Login.masterData.selectedInstrument.sserialno.length===0?"-":
                                        this.props.Login.masterData.selectedInstrument.sserialno
                                    }
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>


                            {this.props.Login.masterData.SelectedInsCat && this.props.Login.masterData.SelectedInsCat.ncalibrationreq !== undefined && this.props.Login.masterData.SelectedInsCat.ncalibrationreq === transactionStatus.YES?

                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_CALIBRATIONINTERVALPERIOD"
                                      message="Calibration Interval Period"
                                    />
                                  </FormLabel>
                                  <ReadOnlyText>
                                    {this.props.Login.masterData.selectedInstrument.nnextcalibration !== null
                                     && this.props.Login.masterData.selectedInstrument.nnextcalibration !== 0 ? 
                                       this.props.Login.masterData.selectedInstrument.nnextcalibration : "-"} { }
                                    {this.props.Login.masterData.selectedInstrument.snextcalibrationperiod === null ||
                                      this.props.Login.masterData.selectedInstrument.nnextcalibrationperiod === -1
                                      ? ""
                                      : this.props.Login.masterData.selectedInstrument.snextcalibrationperiod}
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col> :""}

                              {/* <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_PERIOD"
                                      message="Period"
                                    />
                                  </FormLabel>
                                  <ReadOnlyText>
                                    {this.props.Login.masterData
                                      .selectedInstrument.snextcalibrationperiod === null ||
                                      this.props.Login.masterData
                                        .selectedInstrument.snextcalibrationperiod.length === 0
                                      ? "-"
                                      : this.props.Login.masterData
                                        .selectedInstrument.snextcalibrationperiod}
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col> */}
                     	{/* /added by sujatha ALPDJ21-21  */}
                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_MAINTENANCEINTERVALPERIOD"
                                      message="Maintenance Interval Period"
                                    />
                                  </FormLabel>
                                  <ReadOnlyText>
                                    {this.props.Login.masterData.selectedInstrument.nnextmaintenance !== null
                                      && this.props.Login.masterData.selectedInstrument.nnextmaintenance !== 0 ?
                                      this.props.Login.masterData.selectedInstrument.nnextmaintenance : "-"} { }
                                    {this.props.Login.masterData.selectedInstrument.snextmaintenanceperiod === null ||
                                      this.props.Login.masterData.selectedInstrument.nnextmaintenanceperiod === -1
                                      ? ""
                                      : this.props.Login.masterData.selectedInstrument.snextmaintenanceperiod}
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>

                              
                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_SUPPLIER"
                                      message="Supplier"
                                    />
                                  </FormLabel>

                                  <ReadOnlyText>
                                    {this.props.Login.masterData
                                      .selectedInstrument.nsuppliercode ===-1?'-'
                                      : this.props.Login.masterData
                                        .selectedInstrument.ssuppliername}
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>

                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_PURCHASECOST"
                                      message="Purchase Cost"
                                    />
                                  </FormLabel>
                                  <ReadOnlyText>
                                    {this.props.Login.masterData
                                      .selectedInstrument.npurchasecost === null ||this.props.Login.masterData
                                      .selectedInstrument.npurchasecost===0.00
                                      ? "-"
                                      : this.props.Login.masterData
                                        .selectedInstrument.npurchasecost}
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>
                              
                            

                             
                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_SOFTWAREINFORMATION"
                                      message="Software Information"
                                    />
                                  </FormLabel>
                                  <ReadOnlyText>
                                    {this.props.Login.masterData
                                      .selectedInstrument.ssoftwareinformation === null ||
                                      this.props.Login.masterData
                                        .selectedInstrument.ssoftwareinformation.length === 0
                                      ? "-"
                                      : this.props.Login.masterData
                                        .selectedInstrument.ssoftwareinformation}
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>

                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_PERFORMNACECAPABILITIES"
                                      message="Performance Capabilities"
                                    />
                                  </FormLabel>
                                  <ReadOnlyText>
                                    {this.props.Login.masterData
                                      .selectedInstrument.sperformancecapabilities === null ||
                                      this.props.Login.masterData
                                        .selectedInstrument.sperformancecapabilities.length === 0
                                      ? "-"
                                      : this.props.Login.masterData
                                        .selectedInstrument.sperformancecapabilities}
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>

                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_ACCEPTANCECRETERIA"
                                      message="Acceptance Creteria"
                                    />
                                  </FormLabel>
                                  <ReadOnlyText>
                                    {this.props.Login.masterData
                                      .selectedInstrument.sacceptancecriteria === null ||
                                      this.props.Login.masterData
                                        .selectedInstrument.sacceptancecriteria.length === 0
                                      ? "-"
                                      : this.props.Login.masterData
                                        .selectedInstrument.sacceptancecriteria}
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>

                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_REMARKS"
                                      message="Remarks"
                                    />
                                  </FormLabel>
                                  <ReadOnlyText>
                                    {this.props.Login.masterData
                                      .selectedInstrument.sremarks === null ||
                                      this.props.Login.masterData
                                        .selectedInstrument.sremarks.length === 0
                                      ? "-"
                                      : this.props.Login.masterData
                                        .selectedInstrument.sremarks}
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_DESCRIPTION"
                                      message="Description"
                                    />
                                  </FormLabel>
                                  <ReadOnlyText>
                                    {this.props.Login.masterData
                                      .selectedInstrument.sdescription === null ||
                                      this.props.Login.masterData
                                        .selectedInstrument.sdescription.length === 0
                                      ? "-"
                                      : this.props.Login.masterData
                                        .selectedInstrument.sdescription}
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>
                             
                             
                            
                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_DEFAULTSTATUS"
                                      message="Default Status"
                                    />
                                  </FormLabel>
                                  <ReadOnlyText>
                                    {
                                      this.props.Login.masterData
                                        .selectedInstrument.sdefaultstatus
                                    }
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_MOVEMENT"
                                      message="Movement"
                                    />
                                  </FormLabel>
                                  <ReadOnlyText>
                                    {this.props.Login.masterData && this.props.Login.masterData
                                      .selectedInstrument.smovement === null ||
                                      this.props.Login.masterData
                                        .selectedInstrument.smovement.length === 0
                                      ? "-"
                                      : this.props.Login.masterData
                                        .selectedInstrument.smovement}
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_ASSOCIATEDDOCUMENT"
                                      message="Associated Document"
                                    />
                                  </FormLabel>
                                  <ReadOnlyText>
                                    {this.props.Login.masterData && this.props.Login.masterData
                                      .selectedInstrument.sassociateddocument === null ||
                                      this.props.Login.masterData
                                        .selectedInstrument.sassociateddocument.length === 0
                                      ? "-"
                                      : this.props.Login.masterData
                                        .selectedInstrument.sassociateddocument}
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>
                              {/* Added by sonia on 30th Sept 2024 for Jira idL:ALPD-4940        */}
                              <Col md={4}>   
                                <FormGroup>
                                  <FormLabel>
                                    <FormattedMessage
                                      id="IDS_ENABLEDISABLEAUTOCALIBRATION"
                                      message="Enable/Disable Auto Calibration"
                                    />
                                  </FormLabel>
                                  <ReadOnlyText>
                                    {
                                      this.props.Login.masterData
                                        .selectedInstrument.sautocalibration
                                    }
                                  </ReadOnlyText>
                                </FormGroup>
                              </Col>        
                              
                              
                            </Row>
                            {selectedInstrument && (
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
            showSaveContinue={this.props.Login.screenName === "IDS_INSTRUMENT" || this.props.Login.screenName === "IDS_INSTRUMENTVALIDATION" ? true:false}
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
              ) : this.props.Login.screenName === "IDS_INSTRUMENT" ? (
                <AddInstrument
                  onNumericInputOnChange={this.onNumericInputOnChange}
                  selectedRecord={this.props.Login.selectedRecord || {}}
                  onInputOnChange={this.onInputOnChange}
                  onComboChange={this.onComboChange}
                  InstrumentCategory={this.props.Login.InstrumentCategory}
                  Supplier={this.props.Login.Supplier}
                  InstrumentLocation={this.props.Login.InstrumentLocation}
                  Manufacturer={this.props.Login.Manufacturer}
                  InstrumentStatus={this.props.Login.InstrumentStatus}
                  handleDateChange={this.handleDateChange}
                  Lab={this.props.Login.Lab}
                  Period={this.props.Login.Period}
                  Site={this.props.Login.siteList}
                  validateOpenDate={this.props.Login.validateOpenDate}
                  TimeZoneList={this.props.Login.TimeZoneList}
                  ValidationStatus={this.props.Login.ValidationStatus}
                  CalibrationStatus={this.props.Login.CalibrationStatus}
                  MaintenanceStatus={this.props.Login.MaintenanceStatus}
                  SectionUsers={this.props.Login.Users}
                  operation={this.props.Login.operation}
                  inputParam={this.props.inputParam}
                  defaultValue={this.props.Login.edqmManufacturer}
                  userInfo={this.props.Login.userInfo}
                  currentTime={this.props.Login.currentTime}
                  expiryDate={this.props.Login.expiryDate}
                  CalibrationRequired ={this.props.Login.CalibrationRequired}
                  InstrumentName={this.props.Login.instName}
                  settings={this.props.Login.settings}

                />
              ) : this.props.Login.screenName === "IDS_SECTION" ? (
                <AddInstrumentSection
                  selectedRecord={this.state.selectedRecord || {}}
                  Lab={this.props.Login.Lab}
                  Users={this.props.Login.Users}
                  onComboChange={this.onComboChange}
                  onSwitchChange={this.onSwitchChange}
                  onInputOnChange={this.onInputOnChange}

                />
              ) : this.props.Login.screenName === "IDS_INSTRUMENTVALIDATION" ? (
                <AddInstrumentValidation
                  selectedRecord={this.state.selectedRecord || {}}
                  ValidationStatus={this.props.Login.ValidationStatus}
                  TimeZoneList={this.props.Login.TimeZoneList}
                  instrumentid={
                    this.props.Login.masterData.selectedInstrument.sinstrumentid
                  }
                  onInputOnChange={this.onInputOnChange}
                  currentTime={this.props.Login.currentTime}
                  userInfo={this.props.Login.userInfo}
                  handleDateChange={this.handleDateChange}
                  onComboChange={this.onComboChange}
                />
              ) : this.props.Login.screenName ===
                "IDS_INSTRUMENTVALIDATIONFILE" ? (
                <AddInstrumentFile
                  selectedRecord={this.props.Login.selectedRecord || {}}
                  onInputOnChange={this.onInputOnChange}
                  onDrop={this.onDropTestFile}
                  label={this.props.intl.formatMessage({ id: "IDS_FILENAME" })}
                  deleteAttachment={this.deleteAttachment}
                  maxSize={20}
                  maxFiles={1}
                  linkMaster={this.props.Login.linkMaster}
                  // addInstrumentFile={this.props.addInstrumentFile}
                  onComboChange={this.onComboChange}
                  editFiles={this.props.Login.editFiles}
                  settings={this.props.Login.settings}
                />
              ) : this.props.Login.screenName ===
                "IDS_INSTRUMENTCALIBRATION" ? (
                <AddInstrumentCalibration
                  selectedRecord={this.props.Login.selectedRecord || {}}
                  CalibrationStatus={this.props.Login.CalibrationStatus}
                  TimeZoneList={this.props.Login.TimeZoneList}
                  instrumentid={
                    this.props.Login.masterData.selectedInstrument.sinstrumentid
                  }
                  nextcalibrationperiod={
                    this.props.Login.masterData.selectedInstrument.nnextcalibration + "-"+this.props.Login.masterData.selectedInstrument.snextcalibrationperiod
                  }
                  onInputOnChange={this.onInputOnChange}
                  currentTime={this.props.Login.currentTime}
                  userInfo={this.props.Login.userInfo}
                  handleDateChange={this.handleDateChange}
                  onComboChange={this.onComboChange}
                />
              ) : this.props.Login.screenName ===
                "IDS_INSTRUMENTCALIBRATIONFILE" ? (
                <AddInstrumentFile
                  selectedRecord={this.props.Login.selectedRecord || {}}
                  onInputOnChange={this.onInputOnChange}
                  onDrop={this.onDropTestFile}
                  label={this.props.intl.formatMessage({ id: "IDS_FILENAME" })}
                  deleteAttachment={this.deleteAttachment}
                  maxSize={20}
                  maxFiles={1}
                  onComboChange={this.onComboChange}
                  linkMaster={this.props.Login.linkMaster}
                  // addInstrumentFile={this.props.addInstrumentFile}
                  settings={this.props.Login.settings}
                />
              ) : this.props.Login.screenName ===
                "IDS_INSTRUMENTMAINTENANCE" ? (
                <AddInstrumentMaintenance
                  selectedRecord={this.props.Login.selectedRecord || {}}
                  MaintenanceStatus={this.props.Login.MaintenanceStatus}
                  TimeZoneList={this.props.Login.TimeZoneList}
                  instrumentid={
                    this.props.Login.masterData.selectedInstrument.sinstrumentid
                  }
                  	//added by sujatha ALPDJ21-21 
                  nextmaintenanceperiod={
                    this.props.Login.masterData.selectedInstrument.nnextmaintenance + "-" + this.props.Login.masterData.selectedInstrument.snextmaintenanceperiod
                  }
                  onInputOnChange={this.onInputOnChange}
                  currentTime={this.props.Login.currentTime}
                  userInfo={this.props.Login.userInfo}
                  handleDateChange={this.handleDateChange}
                  onComboChange={this.onComboChange}
                />
              ) : this.props.Login.screenName ===
                "IDS_INSTRUMENTMAINTENANCEFILE" ? (
                <AddInstrumentFile
                  selectedRecord={this.props.Login.selectedRecord || {}}
                  onInputOnChange={this.onInputOnChange}
                  onDrop={this.onDropTestFile}
                  label={this.props.intl.formatMessage({ id: "IDS_FILENAME" })}
                  deleteAttachment={this.deleteAttachment}
                  maxSize={20}
                  maxFiles={1}
                  onComboChange={this.onComboChange}
                  linkMaster={this.props.Login.linkMaster}
                  // addInstrumentFile={this.props.addInstrumentFile}
                  settings={this.props.Login.settings}
                />
              ) : (
                ""
              )
            }
          />
        )}

        {this.props.Login.modalShow ? (
          <ModalShow
            modalShow={this.props.Login.modalShow}
            closeModal={this.closeModalShow}
            onSaveClick={this.onSaveModalClick}
            validateEsign={this.validateEsign}
            masterStatus={this.props.Login.masterStatus}
            mandatoryFields={mandatoryFields}
            updateStore={this.props.updateStore}
            selectedRecord={this.state.selectedRecord || {}}
            modalTitle={this.props.Login.modalTitle}
            modalBody={
                this.props.Login.modalTitle === "IDS_OPENDATE" ? (
                <AddOpenDate
                  selectedRecord={this.props.Login.selectedRecord || {}}
                  Status={
                    this.props.Login.screenName === "IDS_INSTRUMENTCALIBRATION"
                      ? this.props.Login.CalibrationStatus
                      : this.props.Login.MaintenanceStatus
                  }
                  TimeZoneList={this.props.Login.TimeZoneList}
                  onInputOnChange={this.onInputOnChange}
                  handleDateChange={this.handleDateChange}
                  onComboChange={this.onComboChange}
                  userInfo={this.props.Login.userInfo}
                  esign={this.props.Login.loadEsign}
                  currentTime={this.props.Login.currentTime}
                />
              ) : (
                <AddCloseDate
                  selectedRecord={this.props.Login.selectedRecord || {}}
                  Status={
                    this.props.Login.screenName === "IDS_INSTRUMENTCALIBRATION"
                      ? this.props.Login.CalibrationStatus
                      : this.props.Login.MaintenanceStatus
                  }
                  TimeZoneList={this.props.Login.TimeZoneList}
                  onInputOnChange={this.onInputOnChange}
                  handleDateChange={this.handleDateChange}
                  onComboChange={this.onComboChange}
                  userInfo={this.props.Login.userInfo}
                  currentTime={this.props.Login.currentTime}
                />
              )
            }
          />
        ) : (
          ""
        )}
      </>
    );
  }

  onSaveInstrumentFile = (saveType, formRef) => {
    const selectedRecord = this.state.selectedRecord;
    const acceptedFiles = selectedRecord.sfilename;
    const nattachmenttypecode = selectedRecord.nattachmenttypecode;

    let isFileEdited = transactionStatus.NO;
    let instrumentFileArray = [];
    let instrumentFile = {
      ninstrumentfilecode: selectedRecord.ninstrumentfilecode
        ? selectedRecord.ninstrumentfilecode
        : 0,
      nstatus: transactionStatus.ACTIVE,
    };
    const formData = new FormData();
    if (nattachmenttypecode === attachmentType.FTP) {
    if (
      acceptedFiles &&
      Array.isArray(acceptedFiles) &&
      acceptedFiles.length > 0
    ) {
      acceptedFiles.forEach((file, index) => {
        const tempData = Object.assign({}, instrumentFile);
        const splittedFileName = file.name.split(".");
        const fileExtension = file.name.split(".")[splittedFileName.length - 1];
        const ssystemfilename = selectedRecord.ssystemfilename
          ? selectedRecord.ssystemfilename.split(".")
          : "";
        const filesystemfileext = selectedRecord.ssystemfilename
          ? file.name.split(".")[ssystemfilename.length - 1]
          : "";
        const uniquefilename =
          nattachmenttypecode === attachmentType.FTP
            ? selectedRecord.ninstrumentfilecode &&
              selectedRecord.ninstrumentfilecode > 0 &&
              selectedRecord.ssystemfilename !== "" && selectedRecord.ssystemfilename !== undefined
              ? ssystemfilename[0] + "." + filesystemfileext
              : create_UUID() + "." + fileExtension
            : "";
        tempData["sfilename"] =Lims_JSON_stringify(file.name,false) ;
        tempData["sfiledesc"] =Lims_JSON_stringify(replaceBackSlash(selectedRecord.sfiledesc
          ? selectedRecord.sfiledesc.trim()
          : ""),false) ;
        tempData["nlinkcode"] = transactionStatus.NA;
        tempData["ssystemfilename"] = uniquefilename;
        tempData["nfilesize"] = file.size;
        tempData["ninstrumentcode"] =
          this.props.Login.masterData.selectedInstrumentValidation.ninstrumentcode;
          tempData["ninstrumentcatcode"]=this.props.Login.masterData.selectedInstrument.ninstrumentcatcode;
        tempData["nattachmenttypecode"] = 1;
        tempData["ninstrumentlogtypecode"] = transactionStatus.ACTIVE;
        tempData["ninstrumentlogcode"] =
          this.props.Login.masterData.selectedInstrumentValidation.ninstrumentvalidationcode;

        formData.append("uploadedFile" + index, file);
        formData.append("uniquefilename" + index, uniquefilename);
        instrumentFileArray.push(tempData);
      });
      formData.append("filecount", acceptedFiles.length);
      isFileEdited = transactionStatus.YES;
    } else {
      instrumentFile["sfilename"] =Lims_JSON_stringify( selectedRecord.sfilename,false) ;
      instrumentFile["sfiledesc"] =Lims_JSON_stringify(replaceBackSlash(selectedRecord.sfiledesc
        ? selectedRecord.sfiledesc.trim()
        : ""),false)  ;
      instrumentFile["nlinkcode"] = transactionStatus.NA;
      instrumentFile["ssystemfilename"] = selectedRecord.ssystemfilename;
      instrumentFile["nfilesize"] = selectedRecord.nfilesize;
      instrumentFile["ninstrumentcode"] =
        this.props.Login.masterData.selectedInstrumentValidation.ninstrumentcode;
      instrumentFile["nattachmenttypecode"] = 1;
      instrumentFile["ninstrumentlogtypecode"] = transactionStatus.ACTIVE;
      instrumentFile["ninstrumentlogcode"] =
        this.props.Login.masterData.selectedInstrumentValidation.ninstrumentvalidationcode;

      instrumentFileArray.push(instrumentFile);
    }
  }else {
    // const tempData = Object.assign({}, instrumentFile);
    instrumentFile["ninstrumentlogcode"]=this.props.Login.masterData.selectedInstrumentValidation.ninstrumentvalidationcode;
    instrumentFile["ninstrumentlogtypecode"] = transactionStatus.ACTIVE;
    instrumentFile["ssystemfilename"] = "";
    instrumentFile["nattachmenttypecode"] =2;
    // instrumentFileArray.push(tempData);
    instrumentFile["sfilename"] =Lims_JSON_stringify(replaceBackSlash(selectedRecord.slinkfilename?selectedRecord.slinkfilename.trim():""),false) ;
    instrumentFile["sfiledesc"] =Lims_JSON_stringify(replaceBackSlash(selectedRecord.slinkdescription ? selectedRecord.slinkdescription : ""),false) ;
    instrumentFile["nlinkcode"] = selectedRecord.nlinkcode.value ? selectedRecord.nlinkcode.value : -1;
    // instrumentFile["ssystemfilename"] = "";
    instrumentFile["nfilesize"] = 0;
    instrumentFile["ninstrumentcode"] = this.props.Login.masterData.selectedInstrumentValidation.ninstrumentcode;
    instrumentFile["ninstrumentcatcode"] = this.props.Login.masterData.selectedInstrument.ninstrumentcatcode;
    instrumentFileArray.push(instrumentFile);
}

    formData.append("isFileEdited", isFileEdited);
    formData.append("instrumentFile", JSON.stringify(instrumentFileArray));
    const inputParam = {
      
      inputData: {
        userinfo: {
          ...this.props.Login.userInfo,
          sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
          smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
           //ALPD-1628(while saving the file and link,audit trail is not captured the respective language)
          slanguagename: Lims_JSON_stringify(this.props.Login.userInfo.slanguagename)
        },
      },
      formData: formData,
      isFileupload: true,
      operation: this.props.Login.operation,

      classUrl: "instrument",
      saveType,
      formRef,
      methodUrl: "InstrumentFile",
      searchRef: this.searchRef,
      selectedRecord: {...this.state.selectedRecord}
    };
    return inputParam;
  };
  onSaveInstrumentCalibrationFile = (saveType, formRef) => {
    const selectedRecord = this.state.selectedRecord;
    const acceptedFiles = selectedRecord.sfilename;
    const nattachmenttypecode = selectedRecord.nattachmenttypecode;

    let isFileEdited = transactionStatus.NO;
    let instrumentFileArray = [];
    let instrumentFile = {
      ninstrumentfilecode: selectedRecord.ninstrumentfilecode
        ? selectedRecord.ninstrumentfilecode
        : 0,
      nstatus: transactionStatus.ACTIVE,
    };
    const formData = new FormData();
    if (nattachmenttypecode === attachmentType.FTP) {
    if (
      acceptedFiles &&
      Array.isArray(acceptedFiles) &&
      acceptedFiles.length > 0
    ) {
      acceptedFiles.forEach((file, index) => {
        const tempData = Object.assign({}, instrumentFile);
        const splittedFileName = file.name.split(".");
        const fileExtension = file.name.split(".")[splittedFileName.length - 1];
        const ssystemfilename = selectedRecord.ssystemfilename
          ? selectedRecord.ssystemfilename.split(".")
          : "";
        const filesystemfileext = selectedRecord.ssystemfilename
          ? file.name.split(".")[ssystemfilename.length - 1]
          : "";
        const uniquefilename =
          nattachmenttypecode === attachmentType.FTP
            ? selectedRecord.ninstrumentfilecode &&
              selectedRecord.ninstrumentfilecode > 0 &&
              selectedRecord.ssystemfilename !== "" && selectedRecord.ssystemfilename !== undefined
              ? ssystemfilename[0] + "." + filesystemfileext
              : create_UUID() + "." + fileExtension
            : "";
        tempData["sfilename"] =Lims_JSON_stringify(file.name,false) ;
        tempData["sfiledesc"] =Lims_JSON_stringify(replaceBackSlash( selectedRecord.sfiledesc
          ? selectedRecord.sfiledesc.trim()
          : ""),false);
        tempData["nlinkcode"] = transactionStatus.NA;
        tempData["ssystemfilename"] = uniquefilename;
        tempData["nfilesize"] = file.size;
        tempData["ninstrumentcode"] =
          this.props.Login.masterData.selectedInstrumentCalibration.ninstrumentcode;
        tempData["nattachmenttypecode"] = 1;
        tempData["ninstrumentlogtypecode"] = 2;
        tempData["ninstrumentlogcode"] =
          this.props.Login.masterData.selectedInstrumentCalibration.ninstrumentcalibrationcode;
        tempData["ninstrumentcatcode"]=this.props.Login.masterData.selectedInstrument.ninstrumentcatcode;

        formData.append("uploadedFile" + index, file);
        formData.append("uniquefilename" + index, uniquefilename);
        instrumentFileArray.push(tempData);
      });
      formData.append("filecount", acceptedFiles.length);
      isFileEdited = transactionStatus.YES;
    } else {
      instrumentFile["sfilename"] =Lims_JSON_stringify(selectedRecord.sfilename,false) ;
      instrumentFile["sfiledesc"] =Lims_JSON_stringify(replaceBackSlash(selectedRecord.sfiledesc
        ? selectedRecord.sfiledesc.trim()
        : ""),false) ;
      instrumentFile["nlinkcode"] = transactionStatus.NA;
      instrumentFile["ssystemfilename"] = selectedRecord.ssystemfilename;
      instrumentFile["nfilesize"] = selectedRecord.nfilesize;
      instrumentFile["ninstrumentcode"] =
        this.props.Login.masterData.selectedInstrumentCalibration.ninstrumentcode;
      instrumentFile["nattachmenttypecode"] = 1;
      instrumentFile["ninstrumentlogtypecode"] = 2;
      instrumentFile["ninstrumentlogcode"] =
        this.props.Login.masterData.selectedInstrumentCalibration.ninstrumentcalibrationcode;

      instrumentFileArray.push(instrumentFile);
    }
  }else {
    // const tempData = Object.assign({}, instrumentFile);
    instrumentFile["ninstrumentlogcode"]=this.props.Login.masterData.selectedInstrumentCalibration.ninstrumentcalibrationcode;
    instrumentFile["ninstrumentlogtypecode"] = 2;
    instrumentFile["ssystemfilename"] = "";
    instrumentFile["nattachmenttypecode"] = 2;
    // instrumentFileArray.push(tempData);
    instrumentFile["sfilename"] =Lims_JSON_stringify(replaceBackSlash(selectedRecord.slinkfilename.trim()),false) ;
    instrumentFile["sfiledesc"] =Lims_JSON_stringify(replaceBackSlash(selectedRecord.slinkdescription ? selectedRecord.slinkdescription : ""),false) ;
    instrumentFile["nlinkcode"] = selectedRecord.nlinkcode.value ? selectedRecord.nlinkcode.value : -1;
    // instrumentFile["ssystemfilename"] = "";
    instrumentFile["nfilesize"] = 0;
    instrumentFile["ninstrumentlogcode"] =
    this.props.Login.masterData.selectedInstrumentCalibration.ninstrumentcalibrationcode;
    instrumentFile["ninstrumentcatcode"]=this.props.Login.masterData.selectedInstrument.ninstrumentcatcode;
    instrumentFile["ninstrumentcode"]=this.props.Login.masterData.selectedInstrumentCalibration.ninstrumentcode;
    instrumentFileArray.push(instrumentFile);
}

    formData.append("isFileEdited", isFileEdited);
    formData.append("instrumentFile", JSON.stringify(instrumentFileArray));
    const inputParam = {

      // inputData: { userinfo: this.props.Login.userInfo },

      inputData: {
        userinfo: {
          ...this.props.Login.userInfo,
          sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
          smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
          //ALPD-1628(while saving the file and link,audit trail is not captured the respective language)
          slanguagename: Lims_JSON_stringify(this.props.Login.userInfo.slanguagename)
        },
      },

      formData: formData,
      isFileupload: true,
      operation: this.props.Login.operation,
      classUrl: "instrument",
      saveType,
      formRef,
      methodUrl: "InstrumentCalibrationFile",
      searchRef: this.searchRef,
      selectedRecord: {...this.state.selectedRecord}
    };
    return inputParam;
  };
  onSaveInstrumentMaintenanceFile = (saveType, formRef) => {
    const selectedRecord = this.state.selectedRecord;
    const acceptedFiles = selectedRecord.sfilename;
    const nattachmenttypecode = selectedRecord.nattachmenttypecode;

    let isFileEdited = transactionStatus.NO;
    let instrumentFileArray = [];
    let instrumentFile = {
      ninstrumentfilecode: selectedRecord.ninstrumentfilecode
        ? selectedRecord.ninstrumentfilecode
        : 0,
      nstatus: transactionStatus.ACTIVE,
    };
    const formData = new FormData();
    if (nattachmenttypecode === attachmentType.FTP) {
    if (
      acceptedFiles &&
      Array.isArray(acceptedFiles) &&
      acceptedFiles.length > 0
    ) {
      acceptedFiles.forEach((file, index) => {
        const tempData = Object.assign({}, instrumentFile);
        const splittedFileName = file.name.split(".");
        const fileExtension = file.name.split(".")[splittedFileName.length - 1];
        const ssystemfilename = selectedRecord.ssystemfilename
          ? selectedRecord.ssystemfilename.split(".")
          : "";
        const filesystemfileext = selectedRecord.ssystemfilename
          ? file.name.split(".")[ssystemfilename.length - 1]
          : "";
        const uniquefilename =
          nattachmenttypecode === attachmentType.FTP
            ? selectedRecord.ninstrumentfilecode &&
              selectedRecord.ninstrumentfilecode > 0 &&
              selectedRecord.ssystemfilename !== "" && selectedRecord.ssystemfilename !== undefined
              ? ssystemfilename[0] + "." + filesystemfileext
              : create_UUID() + "." + fileExtension
            : "";
        tempData["sfilename"] =Lims_JSON_stringify(file.name,false) ;
        tempData["sfiledesc"] =Lims_JSON_stringify(replaceBackSlash(selectedRecord.sfiledesc
          ? selectedRecord.sfiledesc.trim()
          : ""),false) ;
        tempData["nlinkcode"] = transactionStatus.NA;
        tempData["ssystemfilename"] = uniquefilename;
        tempData["nfilesize"] = file.size;
        tempData["ninstrumentcode"] =
          this.props.Login.masterData.selectedInstrumentMaintenance.ninstrumentcode;
        tempData["nattachmenttypecode"] = 1;
        tempData["ninstrumentlogtypecode"] = 3;
        tempData["ninstrumentlogcode"] =
          this.props.Login.masterData.selectedInstrumentMaintenance.ninstrumentmaintenancecode;
          tempData["ninstrumentcatcode"]=this.props.Login.masterData.selectedInstrument.ninstrumentcatcode;

        formData.append("uploadedFile" + index, file);
        formData.append("uniquefilename" + index, uniquefilename);
        instrumentFileArray.push(tempData);
      });
      formData.append("filecount", acceptedFiles.length);
      isFileEdited = transactionStatus.YES;
    } else {
      instrumentFile["sfilename"] =Lims_JSON_stringify(selectedRecord.sfilename,false) ;
      instrumentFile["sfiledesc"] =Lims_JSON_stringify(replaceBackSlash (selectedRecord.sfiledesc
        ? selectedRecord.sfiledesc.trim()
        : ""),false) ;
      instrumentFile["nlinkcode"] = transactionStatus.NA;
      instrumentFile["ssystemfilename"] = selectedRecord.ssystemfilename;
      instrumentFile["nfilesize"] = selectedRecord.nfilesize;
      instrumentFile["ninstrumentcode"] =
        this.props.Login.masterData.selectedInstrumentMaintenance.ninstrumentcode;
      instrumentFile["nattachmenttypecode"] = 1;
      instrumentFile["ninstrumentlogtypecode"] = 3;
      instrumentFile["ninstrumentlogcode"] =
        this.props.Login.masterData.selectedInstrumentMaintenance.ninstrumentmaintenancecode;

      instrumentFileArray.push(instrumentFile);
    }
  } else {
    // const tempData = Object.assign({}, instrumentFile);
    instrumentFile["ninstrumentlogcode"]=this.props.Login.masterData.selectedInstrumentMaintenance.ninstrumentmaintenancecode;
    instrumentFile["ninstrumentlogtypecode"] = 3;
    instrumentFile["ssystemfilename"] = "";
    instrumentFile["nattachmenttypecode"] = 2;
    // instrumentFileArray.push(tempData);
    instrumentFile["sfilename"] =Lims_JSON_stringify(replaceBackSlash(selectedRecord.slinkfilename.trim()),false) ;
    instrumentFile["sfiledesc"] =Lims_JSON_stringify(replaceBackSlash(selectedRecord.slinkdescription ? selectedRecord.slinkdescription : ""),false) ;
    instrumentFile["nlinkcode"] = selectedRecord.nlinkcode.value ? selectedRecord.nlinkcode.value : -1;
    // instrumentFile["ssystemfilename"] = "";
    instrumentFile["nfilesize"] = 0;
    instrumentFile["ninstrumentlogcode"] =
    this.props.Login.masterData.selectedInstrumentMaintenance.ninstrumentmaintenancecode;
    instrumentFile["ninstrumentcatcode"]=this.props.Login.masterData.selectedInstrument.ninstrumentcatcode;
    instrumentFile["ninstrumentcode"]=this.props.Login.masterData.selectedInstrumentMaintenance.ninstrumentcode;
    instrumentFileArray.push(instrumentFile);
}

    formData.append("isFileEdited", isFileEdited);
    formData.append("instrumentFile", JSON.stringify(instrumentFileArray));
    const inputParam = {

      // inputData: { userinfo: this.props.Login.userInfo },

      inputData: {
        userinfo: {
          ...this.props.Login.userInfo,
          sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
          smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
          //ALPD-1628(while saving the file and link,audit trail is not captured the respective language)
          slanguagename: Lims_JSON_stringify(this.props.Login.userInfo.slanguagename)
        },
      },
      
      formData: formData,
      isFileupload: true,
      operation: this.props.Login.operation,
      classUrl: "instrument",
      saveType,
      formRef,
      methodUrl: "InstrumentMaintenanceFile",
      searchRef: this.searchRef,
      selectedRecord: {...this.state.selectedRecord}
    };
    return inputParam;
  };
  onTabChange = (tabProps) => {
    const screenName = tabProps.screenName;
    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { screenName },
    };
    this.props.updateStore(updateInfo);
  };

  onDropTestFile = (attachedFiles, fieldName, maxSize) => {
    let selectedRecord = this.state.selectedRecord || {};
    selectedRecord[fieldName] = onDropAttachFileList(
      selectedRecord[fieldName],
      attachedFiles,
      maxSize
    );
    this.setState({ selectedRecord, actionType: "new" });
  };
  dataStateChange = (event) => {
    this.setState({
      dataResult: process(
        this.props.Login.masterData["selectedSection"],
        event.dataState
      ),  
      sectionDataState: event.dataState,
    });
  };
  viewInstrumentFile = (filedata) => {
    const inputParam = {
      inputData: {
        instrumentfile: filedata,
        userinfo: this.props.Login.userInfo
      },
      classUrl: "instrument",
      operation: "view",
      methodUrl: "AttachedInstrumentFile",
      screenName: "IDS_INSTRUMENTVALIDATIONFILE"
    }
    this.props.viewAttachment(inputParam);
  }

  // commonGetInsrumentCombo(screenName,addId){
  //   if(screenName==="IDS_SECTION")
  //   this.props.getAvailableInstData(this.props.Login.masterData.selectedInstrument,"getInstrumentSection","section",screenName,this.props.Login.userInfo,addId,this.state.selectedRecord)
  //   if(screenName==="IDS_ADDINSTRUMENTMAINTENANCE")
  //   this.props.getDataForAddEditMaintenance(screenName,"create", this.props.Login.userInfo, addId,this.state.selectedRecord,this.props.Login.masterData)
  //   if(screenName==="IDS_INSTRUMENTCALIBRATION")
  //   this.props.getDataForAddEditCalibration(screenName,"create","section",this.props.Login.userInfo,addId,this.state.selectedRecord,this.props.Login.masterData)
  //   if(screenName==="IDS_ADDINSTRUMENTMAINTENANCE")

  // }
  
  tabDetail = () => {
    const tabMap = new Map();
    const deleteSecId =
      this.state.controlMap.has("DeleteSection") &&
      this.state.controlMap.get("DeleteSection").ncontrolcode;
    const defaultSecId =
      this.state.controlMap.has("DefaultSection") &&
      this.state.controlMap.get("DefaultSection").ncontrolcode;
      if(this.props.Login.masterData.selectedInstrument.nregionalsitecode === this.props.Login.userInfo.ntranssitecode)
    tabMap.set(
      "IDS_SECTION",
      <InstrumentSectionTab
        controlMap={this.state.controlMap}
        userRoleControlRights={this.state.userRoleControlRights}
        dataState={this.props.Login.dataState}
        masterData={this.props.Login.masterData["selectedSection"] || []}
        selectedInstrument={this.props.Login.masterData.selectedInstrument}
        userInfo={this.props.Login.userInfo}
        inputParam={this.props.Login.inputParam}
        deleteRecord={this.DeleteInstrument}
        deleteSecId={deleteSecId}
        defaultSecId={defaultSecId}
        defaultRecord={this.defaultRecord}
        getAvailableInstData={this.props.getAvailableInstData}
        InstrumentSection={this.props.Login.masterData.selectedSection || []}
        screenName="IDS_SECTION"
        selectedRecord={this.state.selectedRecord}
        settings={this.props.Login.settings}
      />
    );
    if(this.props.Login.masterData.selectedInstrument.nregionalsitecode === this.props.Login.userInfo.ntranssitecode)
    tabMap.set(
      "IDS_INSTRUMENTVALIDATION",
      <InstrumentValidationTab
        controlMap={this.state.controlMap}
        userRoleControlRights={this.state.userRoleControlRights}
        selectedInstrument={this.props.Login.masterData.selectedInstrument}
        FileData={this.props.Login.masterData.ValidationFileData}
        InstrumentValidation={this.props.Login.masterData.InstrumentValidation}
        masterData={this.props.Login.masterData}
        userInfo={this.props.Login.userInfo}
        getDataForAddEditValidation={this.props.getDataForAddEditValidation}
        inputParam={this.props.inputParam}
        selectedRecord={this.state.selectedRecord}
        deleteRecord={this.DeleteInstrument}
        deleteTabFileRecord={this.deleteTabFileRecord}
        getTabDetails={this.props.getTabDetails}
        addInstrumentFile={this.props.addInstrumentFile}
        deleteAction={this.props.deleteAction}
        ConfirmDelete={this.ConfirmDelete}
        getDataForEdit={this.props.getDataForEdit}
        addfilecllick={this.addInstrumentFile}
        viewInstrumentFile={this.viewInstrumentFile}
        screenName="IDS_INSTRUMENTVALIDATION"
        formatMessage={this.props.intl.formatMessage}
      />
    );
    if(this.props.Login.masterData.selectedInstrument.ncalibrationreq ===transactionStatus.YES &&
      this.props.Login.masterData.selectedInstrument.nregionalsitecode === this.props.Login.userInfo.ntranssitecode)
    tabMap.set(
      "IDS_INSTRUMENTCALIBRATION",
      <InstrumentCalibrationTab
        controlMap={this.state.controlMap}
        userRoleControlRights={this.state.userRoleControlRights}
        selectedInstrument={this.props.Login.masterData.selectedInstrument}
        FileData={this.props.Login.masterData.CalibrationFileData}
        InstrumentCalibration={
          this.props.Login.masterData.InstrumentCalibration
        }
        masterData={this.props.Login.masterData}
        userInfo={this.props.Login.userInfo}
        getDataForAddEditCalibration={this.props.getDataForAddEditCalibration}
        inputParam={this.props.inputParam}
        selectedRecord={this.state.selectedRecord}
        deleteRecord={this.DeleteInstrument}
        deleteTabFileRecord={this.deleteTabFileRecord}
        getTabDetails={this.props.getTabDetails}
        viewInstrumentFile={this.viewInstrumentFile}
        addInstrumentFile={this.props.addInstrumentFile}
        addfilecllick={this.addInstrumentCalibrationFile}
        deleteAction={this.props.deleteAction}
        ConfirmDelete={this.ConfirmDelete}
        addOpenDate={this.props.addOpenDate}
        OpenDate={this.props.OpenDate}
        CloseDate={this.props.CloseDate}
        screenName="IDS_INSTRUMENTCALIBRATION"
        formatMessage={this.props.intl.formatMessage}
      />
    );
    if(this.props.Login.masterData.selectedInstrument.nregionalsitecode === this.props.Login.userInfo.ntranssitecode)
    tabMap.set(
      "IDS_INSTRUMENTMAINTENANCE",
      <InstrumentMaintenanceTab
        controlMap={this.state.controlMap}
        userRoleControlRights={this.state.userRoleControlRights}
        selectedInstrument={this.props.Login.masterData.selectedInstrument}
        FileData={this.props.Login.masterData.MaintenanceFileData}
        InstrumentMaintenance={
          this.props.Login.masterData.InstrumentMaintenance
        }
        masterData={this.props.Login.masterData}
        userInfo={this.props.Login.userInfo}
        getDataForAddEditMaintenance={this.props.getDataForAddEditMaintenance}
        inputParam={this.props.inputParam}
        selectedRecord={this.state.selectedRecord}
        viewInstrumentFile={this.viewInstrumentFile}
        deleteRecord={this.DeleteInstrument}
        deleteTabFileRecord={this.deleteTabFileRecord}
        getTabDetails={this.props.getTabDetails}
        addInstrumentFile={this.props.addInstrumentFile}
        addfilecllick={this.addInstrumentMaintenanceFile}
        deleteAction={this.props.deleteAction}
        ConfirmDelete={this.ConfirmDelete}
        addOpenDate={this.props.addOpenDate}
        OpenDate={this.props.OpenDate}
        CloseDate={this.props.CloseDate}
        screenName="IDS_INSTRUMENTMAINTENANCE"
        formatMessage={this.props.intl.formatMessage}
      />
    );

    return tabMap;
  };

  ConfirmDelete = (operation, deleteId) => {
    this.confirmMessage.confirm(
      "deleteMessage",
      this.props.intl.formatMessage({ id: "IDS_DELETE" }),
      this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
      this.props.intl.formatMessage({ id: "IDS_OK" }),
      this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
      () =>
        this.DeleteInstrument(
          operation,
          deleteId,
          operation.screenName ? operation.screenName : "IDS_INSTRUMENT"
        )
    );
  };

  addInstrumentFile = (ncontrolCode, screenName) => {
    if(this.props.Login.masterData.selectedInstrument.ninstrumentstatus!==transactionStatus.Disposed){
    let inputData = [];
    let openChildModal = this.props.Login.openChildModal;
    let operation = "create";
    screenName = this.props.Login.screenName;
    screenName = "IDS_INSTRUMENTVALIDATIONFILE";
    openChildModal = true;
    const selectedRecord = this.state.selectedRecord
    const updateInfo = {
     userInfo: this.props.Login.userInfo, operation, selectedRecord, ncontrolCode, screenName
    };
    this.props.addInstrumentFile(updateInfo);
  }
  else{
    toast.warn(
      this.props.intl.formatMessage({
        id: "IDS_DISPOSEDINSTRUMENT",
      })
    );
  }
  };

  addInstrumentCalibrationFile = (ncontrolCode, screenName) => {
    if(this.props.Login.masterData.selectedInstrument.ninstrumentstatus!==transactionStatus.Disposed){
    let inputData = [];
    let openModal = this.props.Login.openModal;
    let operation = "create";
    screenName = this.props.Login.screenName;
    screenName = "IDS_INSTRUMENTCALIBRATIONFILE";
    openModal = true;
    const selectedRecord = this.state.selectedRecord
    const updateInfo = {
      userInfo: this.props.Login.userInfo, operation, selectedRecord, ncontrolCode, screenName
    };
    this.props.addInstrumentFile(updateInfo);
  }
  else{
    toast.warn(
      this.props.intl.formatMessage({
        id: "IDS_DISPOSEDINSTRUMENT",
      })
    );
  }
  };

  addInstrumentMaintenanceFile = (ncontrolCode, screenName) => {
    if(this.props.Login.masterData.selectedInstrument.ninstrumentstatus!==transactionStatus.Disposed){
    let inputData = [];
    let openModal = this.props.Login.openModal;
    let operation = "create";
    screenName = this.props.Login.screenName;
    screenName = "IDS_INSTRUMENTMAINTENANCEFILE";
    openModal = true;
    const selectedRecord = this.state.selectedRecord
    const updateInfo = {
      userInfo: this.props.Login.userInfo, operation, selectedRecord, ncontrolCode, screenName
    };
    this.props.addInstrumentFile(updateInfo);
  }
  else{
    toast.warn(
      this.props.intl.formatMessage({
        id: "IDS_DISPOSEDINSTRUMENT",
      })
    );
  }
  };

  reloadData = () => {
    //ALPD-4803 done by Dhanushya RI,To check searchref key is present or not
    if (this.searchRef && this.searchRef.current) {
      this.searchRef.current.value = "";
    }    
    if (this.state.nfilterInstrumentCategory && this.state.nfilterInstrumentCategory.value) {
      let inputParam = {
          //janakumar Ate234 -> ALPD-5197 Instrument-records are disappeared when refresh the screen
        inputData: {
          ninstrumentcatcode: this.props.Login.masterData.SelectedInsCat.ninstrumentcatcode,
          userinfo: this.props.Login.userInfo,
          nfilterInstrumentCategory: this.props.Login.masterData.SelectedInsCat,
        },
        classUrl: "instrument",
        methodUrl: "InsByInstrumentCat",
        masterData: { ...this.props.Login.masterData,
          defaultInstrumentCatValue:this.props.Login.masterData.defaultInstrumentCatValue,  searchedData:undefined }
        
      };
      this.props.changeInstrumentCategoryFilter(
        inputParam,
        this.props.Login.masterData.filterInstrumentCategory
      );
    } else {
      toast.warn(
        this.props.intl.formatMessage({
          id: "IDS_INSTRUMENTCATEGORYNOTAVAILABLE",
        })
      );
    }
  };

  onComboChange = (comboData, fieldName, caseNo) => {
    const selectedRecord = this.state.selectedRecord || {};
    const masterData = this.props.Login.masterData;
    if (comboData !== null) {
      switch (caseNo) {
        case 1:
          if(fieldName==="ninstrumentcatcode"){
            selectedRecord[fieldName] =comboData;
            this.props.getCalibrationRequired(
              this.state.selectedRecord.ninstrumentcatcode.value,
              this.props.Login.userInfo,
              selectedRecord,
              this.props.Login.screenName
          );
          }else if(fieldName==="nregionalsitecode"){
            selectedRecord[fieldName] =comboData;
            this.props.getInstrumentSiteSection(
              comboData.item.nsitecode, 
              this.props.Login.userInfo,
              selectedRecord
              ); 
          }
          else{
            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord });
          }          
          break;
        case 2:
          selectedRecord[fieldName] = comboData;
          selectedRecord["nsectionusercode"] = comboData.value;
          this.props.getSectionUsers(
            this.state.selectedRecord.nsectionusercode,
            this.props.Login.userInfo,
            selectedRecord,
            // ALPD-3514
            masterData,
            this.props.Login.screenName
          );
          break;
        case 3:
          let nfilterInstrumentCategory =
            this.state.nfilterInstrumentCategory || {};
          nfilterInstrumentCategory = comboData;
          this.searchRef.current.value = "";
          this.setState({ nfilterInstrumentCategory });
          break;
        default:
          break;
      }
    }
    else {
      //ALPD-5145 Instrument screen-->while edit the page in supplier field unable to clear the data
      if (fieldName === "nsectioncode" && selectedRecord["nsectioncode"]) {
        delete selectedRecord["nsectioncode"];
        delete selectedRecord["nusercode"];
      }
      else if(fieldName === "ninstrumentlocationcode" && selectedRecord["ninstrumentlocationcode"]){
        delete selectedRecord["ninstrumentlocationcode"];
      }
      else if(fieldName === "nsuppliercode" && selectedRecord["nsuppliercode"]){
        delete selectedRecord["nsuppliercode"];
      }
      else if(fieldName === "nmanufcode" && selectedRecord["nmanufcode"]){
        delete selectedRecord["nmanufcode"];
      }
      //ALPD-5383 - Gowtham R - 20/02/2025 Instrument-->can't be able to clear the instrument period fields
      else if(fieldName === "nnextcalibrationperiod" && selectedRecord["nnextcalibrationperiod"]){
        delete selectedRecord["nnextcalibrationperiod"];
      }
        	//added by sujatha ALPDJ21-21 
      else if (fieldName === "nnextmaintenanceperiod" && selectedRecord["nnextmaintenanceperiod"]) {
        delete selectedRecord["nnextmaintenanceperiod"];
      }
      const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: { selectedRecord }
      }
      this.props.updateStore(updateInfo);
    }
  };

  closeModal = () => {
      let loadEsign = this.props.Login.loadEsign;
      let openModal = this.props.Login.openModal;
      let openChildModal = this.props.Login.openChildModal;
      let modalShow = this.props.Login.modalShow;
      let selectedRecord = this.props.Login.selectedRecord;

      if (this.props.Login.loadEsign) {
		//ALPD-5536--Vignesh(07-03-2025)-->Instrument screen -> Blank page occurs, when delete the instrument calibration tab.
          if (this.props.Login.operation && this.props.Login.operation  === "delete") {
              loadEsign = false;
              openModal = false;
              openChildModal = false;
              selectedRecord = {};
          } 
          else 
          {
              loadEsign = false;
              if (this.props.Login.popUp === "IDS_INSTRUMENTCALIBRATIONOPENDATE" ||
                    this.props.Login.popUp === "IDS_INSTRUMENTMAINTENANCEOPENDATE" ||
                    this.props.Login.popUp === "IDS_INSTRUMENTCALIBRATIONCLOSEDATE" ||
                    this.props.Login.popUp==="IDS_INSTRUMENTMAINTENANCECLOSEDATE") 
              {
                    modalShow = true;
                    openModal = false;
                    openChildModal = false;
              }
          }
          selectedRecord['esignpassword'] = ""
          selectedRecord['esigncomments'] = ""
          selectedRecord['esignreason']=""
      } 
      else {
            openModal = false;
            openChildModal = false;
            modalShow = false;
            selectedRecord = {};
      }

      const updateInfo = {typeName: DEFAULT_RETURN,
                            data: { openModal, openChildModal, modalShow, loadEsign, 
                                    selectedRecord, selectedId: null },
                          };
      this.props.updateStore(updateInfo);
  };

  closeModalShow = () => {
    let loadEsign = this.props.Login.loadEsign;

    let modalShow = this.props.Login.modalShow;
    let popUp = this.props.Login.popUp;
    let selectedRecord = this.props.Login.selectedRecord;
    if (this.props.Login.loadEsign) {
      loadEsign = false;
    } else {
      modalShow = false;
      selectedRecord = {};
      popUp = undefined;
    }

    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { modalShow, selectedRecord, selectedId: null, loadEsign, popUp },
    };
    this.props.updateStore(updateInfo);
  };

  componentDidUpdate(previousProps) {
    let updateState = false;
    let {
      selectedRecord,
      userRoleControlRights,
      controlMap,
      //filterData,
      nfilterInstrumentCategory,
      filterInstrumentCategory,
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
      if(this.props.Login.operation==='update'){
        this.props.Login.masterData["InstrumentValidation"] =  this.props.Login.masterData["InstrumentValidation"] ?  
         this.props.Login.masterData.InstrumentValidation.map(item=>{
         if(item.ninstrumentvalidationcode=== this.props.Login.masterData.selectedInstrumentValidation.ninstrumentvalidationcode){
         item= this.props.Login.masterData.selectedInstrumentValidation
        }
        return item  
       }) : [] 
       this.props.Login.masterData["InstrumentCalibration"] =  this.props.Login.masterData["InstrumentCalibration"] ? 
        this.props.Login.masterData.InstrumentCalibration.map(item=>{
        if(item.ninstrumentcalibrationcode=== this.props.Login.masterData.selectedInstrumentCalibration.ninstrumentcalibrationcode){
        item= this.props.Login.masterData.selectedInstrumentCalibration
       }
       return item
      }) : []
      this.props.Login.masterData["InstrumentMaintenance"] = this.props.Login.masterData["InstrumentMaintenance"] ? 
       this.props.Login.masterData.InstrumentMaintenance.map(item=>{
        if(item.ninstrumentmaintenancecode=== this.props.Login.masterData.selectedInstrumentMaintenance.ninstrumentmaintenancecode){
        item= this.props.Login.masterData.selectedInstrumentMaintenance
       }
       return item
      }) : []
         }
      nfilterInstrumentCategory = this.state.nfilterInstrumentCategory || {};
      if (
        this.props.Login.masterData.SelectedInsCat &&
        this.props.Login.masterData.SelectedInsCat !==
        previousProps.Login.masterData.SelectedInsCat
      ) {
        nfilterInstrumentCategory = {
          label: this.props.Login.masterData.SelectedInsCat.sinstrumentcatname,
          value: this.props.Login.masterData.SelectedInsCat.ninstrumentcatcode,
          item: this.props.Login.masterData.SelectedInsCat,
        };
      }
      //filterData = this.generateBreadCrumData();
      updateState = true;
    }
    if (
      this.props.Login.masterData.filterInstrumentCategory !==
      previousProps.Login.masterData.filterInstrumentCategory
    ) {
      const insCategoryMap = constructOptionList(
        this.props.Login.masterData.filterInstrumentCategory || [],
        "ninstrumentcatcode",
        "sinstrumentcatname",
        "ntestcategorycode",
        "ascending",
        false
      );
      filterInstrumentCategory = insCategoryMap.get("OptionList");
      if (insCategoryMap.get("DefaultValue")) {
        nfilterInstrumentCategory = insCategoryMap.get("DefaultValue");
      } else if (
        filterInstrumentCategory &&
        filterInstrumentCategory.length > 0
      ) {
        nfilterInstrumentCategory = filterInstrumentCategory[0];
      }
      updateState = true;
    }
    if (updateState) {
      this.setState({
        selectedRecord,
        userRoleControlRights,
        controlMap,
        //filterData,
        nfilterInstrumentCategory,
        filterInstrumentCategory,
      });
    }
  }
  // generateBreadCrumData() {
  //   const breadCrumbData = [];
  //   if (
  //     this.props.Login.masterData &&
  //     this.props.Login.masterData.filterInstrumentCategory
  //   ) {
  //     breadCrumbData.push({
  //       label: "IDS_INSTRUMENTCATEGORY",
  //       value: this.props.Login.masterData.SelectedInsCat
  //         ? this.props.Login.masterData.SelectedInsCat.sinstrumentcatname
  //         : "NA",
  //     });
  //   }
  //   return breadCrumbData;
  // }

  openFilter = () => {
    let showFilter = !this.props.Login.showFilter;
    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { showFilter },
    };
    this.props.updateStore(updateInfo);
  };

  closeFilter = () => {
    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { showFilter: false },
    };
    this.props.updateStore(updateInfo);
  };

  onFilterSubmit = () => {
    this.searchRef.current.value = "";

    if (this.state.nfilterInstrumentCategory && this.state.nfilterInstrumentCategory.value) {
      let inputParam = {
        inputData: {
          ninstrumentcatcode: this.state.nfilterInstrumentCategory.value,
          userinfo: this.props.Login.userInfo,
          nfilterInstrumentCategory: this.state.nfilterInstrumentCategory,
        },
         masterData : {
          ...this.props.Login.masterData,
          defaultInstrumentCatValue :this.state.nfilterInstrumentCategory,
          searchedData:undefined
        },
        classUrl: "instrument",
        methodUrl: "InsByInstrumentCat",
      };
      this.props.changeInstrumentCategoryFilter(
        inputParam,
        this.props.Login.masterData.filterInstrumentCategory
      );
    } else {
      toast.warn(
        this.props.intl.formatMessage({
          id: "IDS_INSTRUMENTCATEGORYNOTAVALIABLE",
        })
      );
    }
  };

  //Added by sonia on 30th Sept 2024 for Jira idL:ALPD-4940
  getAutoCalibration =(masterData, userInfo,controlCode) => {
    const url = "instrument/getInstrumentBySchedulerDetail";
    rsapi().post(url, {"ninstrumentcode":masterData.selectedInstrument.ninstrumentcode,"userinfo": userInfo })
    .then(response => {
      if(response.data.InstrumentScheduled){
            this.autoCalibrationConfirmationAlert(masterData,userInfo);
      }else {
        this.props.updateAutoCalibration(masterData,userInfo,controlCode)
}
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
//Added by sonia on 30th Sept 2024 for Jira idL:ALPD-4940
  autoCalibrationConfirmationAlert = (masterData,userInfo) => {
    this.confirmMessage.confirm(
      "autoCalibrationMessage",
      this.props.intl.formatMessage({ id: "IDS_ENABLEDISABLEAUTOCALIBRATION" }),
      this.props.intl.formatMessage({ id: "IDS_AUTOCALIBRATIONCONFIRMMSG" }),
      this.props.intl.formatMessage({ id: "IDS_OK" }),
      this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
      () =>
        this.props.updateAutoCalibration(masterData,userInfo)
    );
  }
  

}

export default connect(mapStateToProps, {
  callService,
  crudMaster,
  getInstrumentDetail,
  filterColumnData,
  getInstrumentCombo,
  updateStore,
  validateEsignCredential,
  getSectionUsers,
  getAvailableInstData,
  changeInstrumentCategoryFilter,
  getTabDetails,
  getDataForAddEditValidation,
  addInstrumentFile,
  getDataForAddEditCalibration,
  getDataForAddEditMaintenance,
  OpenDate,
  CloseDate, viewAttachment,getCalibrationRequired,getInstrumentSiteSection,updateAutoCalibration
})(injectIntl(Instrument));
