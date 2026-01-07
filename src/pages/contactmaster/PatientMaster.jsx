import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { injectIntl, FormattedMessage } from "react-intl";
import { Row, Col, Card, Nav, FormGroup, FormLabel } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrashAlt, faHistory, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import DataGrid from '../../components/data-grid/data-grid.component';
//import DataGrid from "../../components/data-grid/data-grid.component";
//import Fields from "../../components/PatientMasterFields.json";
import {
  BasicConfig, BasicFuncs,
  Utils as QbUtils,
} from "@react-awesome-query-builder/ui";
import {
  callService,
  crudMaster,
  validateEsignCredential,
  updateStore,
  getPatientDetail,
  getPatientComboService,
  filterColumnData,
  getTestParameter,
  getPatientReport, getPatientDetailsByFilterQuery, getDistrictComboServices, getCityComboServices, filtercomboService, getFilterStatusCombo, getPatientHistory, getpatientReportHistoryInfo, viewAttachment
} from "../../actions";
import { DEFAULT_RETURN } from "../../actions/LoginTypes";
import {
  showEsign,
  getControlMap,
  validatePhoneNumber,
  ageCalculate,
  formatInputDate,
  validateEmail,
  formatDate, constructOptionList, rearrangeDateFormat, formatInputDateWithoutT, convertDateValuetoString, sortData, removeSpaceFromFirst, checkFilterIsEmptyQueryBuilder
} from "../../components/CommonScript";
import { transactionStatus } from "../../components/Enumeration";
import ListMaster from "../../components/list-master/list-master.component";
import SlideOutModal from "../../components/slide-out-modal/SlideOutModal";
import { ReactComponent as Reports } from "../../assets/image/report-Icon.svg";
import { ReadOnlyText, ContentPanel } from "../../components/App.styles";
import AddPatient from "./AddPatient";
import Esign from "../audittrail/Esign";
import ConfirmMessage from "../../components/confirm-alert/confirm-message.component";
// import ReactTooltip from "react-tooltip";
//import { process } from "@progress/kendo-data-query";
import FilterQueryBuilder from "../../components/FilterQueryBuilder";
//import AddFilteredPatient from "./AddFilteredPatient";
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import { Affix } from 'rsuite';
import PatientMasterFilter from './PatientMasterFilter';
import AlertModal from '../dynamicpreregdesign/AlertModal';
import FormInput from '../../components/form-input/form-input.component';
import merge from "lodash/merge";
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { process } from "@progress/kendo-data-query";
//import Filtercomponent from '../../components/Filtercomponent';
// import FilterDemo from "./FilterDemo";
// import "antd/dist/antd.css";
// import 'react-awesome-query-builder/css/styles.scss';

const mapStateToProps = (state) => {
  return { Login: state.Login };
};
const { queryBuilderFormat, queryString, mongodbFormat, sqlFormat, getTree, checkTree, loadTree, uuid } = QbUtils;


const InitialConfig = BasicConfig;
const conjunctions = {
  AND: InitialConfig.conjunctions.AND,
  OR: InitialConfig.conjunctions.OR,
};
const operators1 = {
  ...InitialConfig.operators
}
delete operators1.proximity
const operators = {
  ...operators1,
  between: {
    ...operators1.between,
    textSeparators: [
      "from",
      "to"
    ],
  }
};
const widgets = {
  ...InitialConfig.widgets,
  date: {
    ...InitialConfig.widgets.date,
    dateFormat: "DD.MM.YYYY",
    valueFormat: "YYYY-MM-DD",
  }
};
const types = {
  ...InitialConfig.types,
  boolean: merge(InitialConfig.types.boolean, {
    widgets: {
      boolean: {
        widgetProps: {
          hideOperator: true,
          operatorInlineLabel: "is",
        }
      },
    },
  }),
};
const localeSettings = {
  locale: {
    moment: "ru",
  },
  valueLabel: "Values",
  valuePlaceholder: "Values",
  operatorLabel: "Operator",
  fieldPlaceholder: "Select field",
  operatorPlaceholder: "Select operator",
  deleteLabel: null,
  addGroupLabel: "Add group",
  addRuleLabel: "Add rule",
  addSubRuleLabel: "Add sub rule",
  delGroupLabel: null,
  notLabel: "Not",
  funcLabel: "Function",
  valueSourcesPopupTitle: "Select value source",
  removeRuleConfirmOptions: {
    title: "Are you sure delete this rule?",
    okText: "Yes",
    okType: "danger",
  },
  removeGroupConfirmOptions: {
    title: "Are you sure delete this group?",
    okText: "Yes",
    okType: "danger",
  },
};
const settings1 = { ...InitialConfig.settings }
delete settings1.field
const settings = {
  ...settings1,
  ...localeSettings,

  valueSourcesInfo: {
    value: {
      label: "Value"
    }
    ,
    field: {
      label: "Field",
      widget: "field",
    },
    func: {
      label: "Function",
      widget: "func",
    }
  },
  maxNesting: 5,
  canLeaveEmptyGroup: true,
  shouldCreateEmptyGroup: false,
  showErrorMessage: true,
  customFieldSelectProps: {
    showSearch: true
  },
};
const funcs = {
  ...BasicFuncs
};
const config = {
  ...InitialConfig, conjunctions,
  operators,
  widgets,
  types,
  settings,
  funcs,
  fields: {}

};
const fields1 = {
  "patientmaster.sfirstname": {
    "label": "IDS_FIRSTNAME",
    "type": "text",
    "valueSources": ["value", "func"],

    "mainWidgetProps": {
      "valueLabel": "Name",
      "valuePlaceholder": "Enter First Name"
    }

  },
  "patientmaster.slastname": {
    "label": "IDS_LASTNAME",
    "type": "text",
    "valueSources": ["value", "func"],
    "mainWidgetProps": {
      "valueLabel": "Name",
      "valuePlaceholder": "Enter Last Name"

    }
  },

  "patientmaster.sfathername": {
    "label": "IDS_FATHERNAME",
    "type": "text",
    "valueSources": ["value", "func"],
    "mainWidgetProps": {
      "valueLabel": "Name",
      "valuePlaceholder": "Enter Father Name"

    }
  },

  "patientmaster.ngendercode": {
    "label": "IDS_GENDER",
    "type": "select",
    "valueSources": ["value"],
    "fieldSettings": {
      "listValues": [
        { "value": "1", "title": "Male" },
        { "value": "2", "title": "Female" },
        { "value": "3", "title": "Others" }
      ]
    }
  },
  "patientmaster.ddob": {
    "label": "IDS_DATEOFBIRTH",
    "type": "date",
    "valueSources": ["value"]
  },

  "patientmaster.sage": {
    "label": "IDS_AGE",
    "type": "text",
    "valueSources": ["value", "func"],
    "mainWidgetProps": {
      "valueLabel": "Age",
      "valuePlaceholder": "Enter the Age"

    }
  },

  "patientmaster.spatientid": {
    "label": "IDS_PATIENTID",
    "type": "text",
    "valueSources": ["value", "func"],
    "mainWidgetProps": {
      "valueLabel": "Name",
      "valuePlaceholder": "Enter Patient Id"

    }
  },

  "patientmaster.sphoneno": {
    "label": "IDS_PHONENO",
    "type": "text",
    "valueSources": ["value"],
    "fieldSettings": {
      "min": 0,
      "valuePlaceholder": "Enter Phoneno"

    }
  },

  "patientmaster.smobileno": {
    "label": "IDS_MOBILENO",
    "type": "text",
    "valueSources": ["value"],
    "fieldSettings": {
      "min": 0,
      "valuePlaceholder": "Enter Mobileno"

    }
  },

  "patientmaster.semail": {
    "label": "IDS_EMAIL",
    "type": "text",
    "valueSources": ["value"],
    "fieldSettings": {
      "min": 0,
      "valuePlaceholder": "Enter Email"

    }
  },

  "patientmaster.srefid": {
    "label": "IDS_REFERENCEID",
    "type": "text",
    "valueSources": ["value"],
    "fieldSettings": {
      "min": 0,
      "valuePlaceholder": "Enter ReferenceId"

    }
  },

  "patientmaster.spassportno": {
    "label": "IDS_PASSPORTNO",
    "type": "text",
    "valueSources": ["value"],
    "fieldSettings": {
      "min": 0,
      "valuePlaceholder": "Enter Passportno"

    }
  },

  "patientmaster.sexternalid": {
    "label": "IDS_EXTERNALID",
    "type": "text",
    "valueSources": ["value"],
    "fieldSettings": {
      "min": 0,
      "valuePlaceholder": "Enter ExternalID"

    }
  }
}

class PatientMaster extends React.Component {
  constructor(props) {
    super(props);
    Object.keys(config.operators).map(x => {
      config.operators[x]['label'] = this.props.intl.formatMessage({ id: config.operators[x]['label'] })
    })

    Object.keys(config['funcs']).map(x => {
      config['funcs'][x]['label'] = this.props.intl.formatMessage({ id: config['funcs'][x]['label'] })
    })

    Object.keys(fields1).map(x => {
      fields1[x]['label'] = this.props.intl.formatMessage({ id: fields1[x]['label'] })
    })

    this.state = {
      masterStatus: "",
      error: "",
      selectedRecord: {},
      operation: "",
      selectedPatient: undefined,
      screenName: undefined,
      userRoleControlRights: [],
      patientCaseTypeList: [],
      controlMap: new Map(),
      isClearSearch: false,
      dataState: { skip: 0, take: 5 },
      tree: undefined,
      config: undefined,
      kendoSkip: 0,
      kendoTake: 5,
      childListMap3: [],
      sidebarview: false,
      fields: {
        "patientmaster.sfirstname": {
          "label": this.props.intl.formatMessage({
            id: "IDS_FIRSTNAME",
          }),
          "type": "text",
          "valueSources": ["value", "func"],

          "mainWidgetProps": {
            "valueLabel": "Name",
            "valuePlaceholder": this.props.intl.formatMessage({
              id: "IDS_FIRSTNAME"
            })
          }

        },
        "patientmaster.slastname": {
          "label": this.props.intl.formatMessage({
            id: "IDS_LASTNAME",
          }),
          "type": "text",
          "valueSources": ["value", "func"],
          "mainWidgetProps": {
            "valueLabel": "Name",
            "valuePlaceholder": this.props.intl.formatMessage({
              id: "IDS_LASTNAME"
            })

          }
        },

        "patientmaster.sfathername": {
          "label": this.props.intl.formatMessage({
            id: "IDS_FATHERNAME",
          }),
          "type": "text",
          "valueSources": ["value", "func"],
          "mainWidgetProps": {
            "valueLabel": "Name",
            "valuePlaceholder": this.props.intl.formatMessage({
              id: "IDS_FATHERNAME"
            })

          }
        },

        "patientmaster.ngendercode": {
          "label": this.props.intl.formatMessage({
            id: "IDS_GENDER",
          }),
          "type": "select",
          "valueSources": ["value"],
          "fieldSettings": {
            "listValues": [
              {
                "value": "1", "title": this.props.intl.formatMessage({
                  id: "IDS_MALE",
                })
              },
              {
                "value": "2", "title": this.props.intl.formatMessage({
                  id: "IDS_FEMALE",
                })
              },
              {
                "value": "3", "title": this.props.intl.formatMessage({
                  id: "IDS_OTHERS",
                })
              }
            ]
          }
        },

        "patientmaster.ddob": {
          "label": this.props.intl.formatMessage({
            id: "IDS_DATEOFBIRTH",
          }),
          "type": "date",
          "valueSources": ["value"]
        },

        "patientmaster.sage": {
          "label": this.props.intl.formatMessage({
            id: "IDS_AGE",
          }),
          "type": "text",
          "valueSources": ["value", "func"],
          "mainWidgetProps": {
            "valueLabel": "Age",
            "valuePlaceholder": this.props.intl.formatMessage({
              id: "IDS_AGE",
            })

          }
        },

        "patientmaster.spatientid": {
          "label": this.props.intl.formatMessage({
            id: "IDS_PATIENTID",
          }),
          "type": "text",
          "valueSources": ["value", "func"],
          "mainWidgetProps": {
            "valueLabel": "Name",
            "valuePlaceholder": this.props.intl.formatMessage({
              id: "IDS_PATIENTID",
            })
          }
        },
         "patientmaster.spatientcode": {
          "label": this.props.intl.formatMessage({
            id: "IDS_PATIENTCODE",
          }),
          "type": "text",
          "valueSources": ["value", "func"],
          "mainWidgetProps": {
            "valueLabel": "Name",
            "valuePlaceholder": this.props.intl.formatMessage({
              id: "IDS_PATIENTCODE",
            })
          }
        },
        "patientmaster.sphoneno": {
          "label": this.props.intl.formatMessage({
            id: "IDS_PHONENO",
          }),
          "type": "text",
          "valueSources": ["value"],
          "fieldSettings": {
            "min": 0,
            "valuePlaceholder": this.props.intl.formatMessage({
              id: "IDS_PHONENO",
            })

          }
        },

        "patientmaster.smobileno": {
          "label": this.props.intl.formatMessage({
            id: "IDS_MOBILENO",
          }),
          "type": "text",
          "valueSources": ["value"],
          "fieldSettings": {
            "min": 0,
            "valuePlaceholder": this.props.intl.formatMessage({
              id: "IDS_MOBILENO"
            })

          }
        },

        "patientmaster.semail": {
          "label": this.props.intl.formatMessage({
            id: "IDS_EMAIL",
          }),
          "type": "text",
          "valueSources": ["value"],
          "fieldSettings": {
            "min": 0,
            "valuePlaceholder": this.props.intl.formatMessage({
              id: "IDS_EMAIL"
            })

          }
        },

        "patientmaster.srefid": {
          "label": this.props.intl.formatMessage({
            id: "IDS_REFERENCEID",
          }),
          "type": "text",
          "valueSources": ["value"],
          "fieldSettings": {
            "min": 0,
            "valuePlaceholder": this.props.intl.formatMessage({
              id: "IDS_REFERENCEID"
            })

          }
        },

        "patientmaster.spassportno": {
          "label": this.props.intl.formatMessage({
            id: "IDS_PASSPORTNO",
          }),
          "type": "text",
          "valueSources": ["value"],
          "fieldSettings": {
            "min": 0,
            "valuePlaceholder": this.props.intl.formatMessage({
              id: "IDS_PASSPORTNO"
            })

          }
        },

        "patientmaster.sexternalid": {
          "label": this.props.intl.formatMessage({
            id: "IDS_EXTERNALID",
          }),
          "type": "text",
          "valueSources": ["value"],
          "fieldSettings": {
            "min": 0,
            "valuePlaceholder": this.props.intl.formatMessage({
              id: "IDS_EXTERNALID"
            })

          }
        }
      },
      Patconfigs: {
        ...config,
        settings: {
          ...config.settings, notLabel: this.props.intl.formatMessage({ id: "IDS_NOT" }),
          valueLabel: this.props.intl.formatMessage({ id: "IDS_VALUE" }),
          valuePlaceholder: this.props.intl.formatMessage({ id: "IDS_VALUE" }),
          operatorLabel: this.props.intl.formatMessage({ id: "IDS_OPERATOR" }),
          fieldPlaceholder: this.props.intl.formatMessage({ id: "IDS_SELECTFIELD" }),
          operatorPlaceholder: this.props.intl.formatMessage({ id: "IDS_SELECTOPERATOR" }),
          addGroupLabel: this.props.intl.formatMessage({ id: "IDS_ADDGROUP" }),
          addRuleLabel: this.props.intl.formatMessage({ id: "IDS_ADDRULE" }),
          addSubRuleLabel: this.props.intl.formatMessage({ id: "IDS_ADDSUBRULE" }),
          valueSourcesPopupTitle: this.props.intl.formatMessage({ id: "IDS_SELECTVALUESOURCE" }),
          funcLabel: this.props.intl.formatMessage({ id: "IDS_FUNCTION" }),
          valueSourcesInfo: {
            field: { label: this.props.intl.formatMessage({ id: "IDS_FIELD" }), widget: 'field' },
            func: { label: this.props.intl.formatMessage({ id: "IDS_FUNCTION" }), widget: 'func' },
            value: { label: this.props.intl.formatMessage({ id: "IDS_VALUE" }) }
          },
          removeRuleConfirmOptions: {
            title: this.props.intl.formatMessage({ id: "IDS_AREYOUSUREDELETETHISRULE" }),
            okText: this.props.intl.formatMessage({ id: "IDS_YES" }),
            okType: "danger",
          },
          removeGroupConfirmOptions: {
            title: this.props.intl.formatMessage({ id: "IDS_AREYOUSUREDELETETHISGROUP" }),
            okText: this.props.intl.formatMessage({ id: "IDS_YES" }),
            okType: "danger",
          }
        }, conjunctions: {
          AND: { ...config['conjunctions']['AND'], label: this.props.intl.formatMessage({ id: "IDS_AND" }) },
          OR: { ...config['conjunctions']['OR'], label: this.props.intl.formatMessage({ id: "IDS_OR" }) }
        },
        fields: fields1//,settings:{...config.settings,notLabel:this.props.intl.formatMessage({id: "NOT"})}
      },


    };
    this.searchRef = React.createRef();
    this.emailRef = React.createRef();
    this.confirmMessage = new ConfirmMessage();

    this.patientFieldList = [
      "sfirstname",
      "slastname",
      "sfathername",
      "ddob",
      "sage",
      "saddress",
      "sdistrict",
      "spostalcode",
      "sphoneno",
      "smobileno",
      "semail",
      "srefid",
      "spassportno",
      "sexternalid",
      "sstreet", "sstreettemp", "shouseno", "shousenotemp", "sflatno", "sflatnotemp", "nneedmigrant", "nneedcurrentaddress", "spostalcodetemp", "sregionnametemp", "sregionname", "scitynametemp", "scityname"
    ];

    this.searchFieldList = [
      "saddress",
      "sage",
      "sdob",
      "sgendername",
      "sfathername",
      "spatientname",
      "spatientid",
      "sphoneno",
      "smobileno",
      "semail",
      "scityname",
      "sdistrict",
      "scountryname",
      "spostalcode",
      "srefid",
      "spassportno",
      "sexternalid",
      "sstreet", "sstreettemp", "shouseno", "shousenotemp", "sflatno", "sflatnotemp", "sdisplaystatus", 
      "nneedcurrentaddress", "spostalcodetemp", 
      "sregionnametemp", "sregionname", "scitynametemp",
      "spatientcode"
    ];

    this.columnList = [
      { idsName: "IDS_ARNO", dataField: "sarno", width: "150px" },
      { idsName: "IDS_PRODUCT", dataField: "sproductname", width: "250px" },
      { idsName: "IDS_SPECIFICATION", dataField: "sspecname", width: "150px" },
      {
        idsName: "IDS_SPECIMENCOLLECTIONTIME",
        dataField: "scolleciondate",
        width: "150px",
      },
      {
        idsName: "IDS_RECEIVEDDATE",
        dataField: "sreceiveddate",
        width: "150px",
      },
      {
        idsName: "IDS_STATUS",
        dataField: "stransdisplaystatus",
        width: "100px",
      },
    ];

    this.childColumnList = [
      { idsName: "IDS_TESTNAME", dataField: "stestsynonym", width: "250px" },
      {
        idsName: "IDS_PARAMETERNAME",
        dataField: "sparametersynonym",
        width: "250px",
      },
      { idsName: "IDS_RESULT", dataField: "sresult", width: "150px" },
      { idsName: "IDS_RESULTFLAG", dataField: "sgradename", width: "100px" },
      { idsName: "IDS_RESULTDATE", dataField: "sentereddate", width: "150px" },
      {
        idsName: "IDS_STATUS",
        dataField: "stransdisplaystatus",
        width: "100px",
      },
    ];
    this.slideList = [
      { title: this.props.intl.formatMessage({ id: "IDS_PATIENTID" }), filed: "spatientid", width: "250px" },
      { title: this.props.intl.formatMessage({ id: "IDS_PATIENTCODE" }), filed: "spatientcode", width: "250px" },
      { title: this.props.intl.formatMessage({ id: "IDS_FIRSTNAME" }), filed: "sfirstname", width: "150px" },
      { title: this.props.intl.formatMessage({ id: "IDS_LASTNAME" }), filed: "slastname", width: "150px" },
      { title: this.props.intl.formatMessage({ id: "IDS_FATHERNAME" }), filed: "sfathername", width: "150px" },
      { title: this.props.intl.formatMessage({ id: "IDS_GENDER" }), filed: "sgendername", width: "150px" },
      { title: this.props.intl.formatMessage({ id: "IDS_COUNTRY" }), filed: "scountryname", width: "150px" },
      { title: this.props.intl.formatMessage({ id: "IDS_DATEOFBIRTH" }), filed: "sdob", width: "150px" },
      { title: this.props.intl.formatMessage({ id: "IDS_DISTRICT" }), filed: "sdistrict", width: "100px" },
      { title: this.props.intl.formatMessage({ id: "IDS_POSTALCODE" }), filed: "spostalcode", width: "100px" },
      { title: this.props.intl.formatMessage({ id: "IDS_PHONENO" }), filed: "sphoneno", width: "150px" },
      { title: this.props.intl.formatMessage({ id: "IDS_MOBILENO" }), filed: "smobileno", width: "150px" },
      { title: this.props.intl.formatMessage({ id: "IDS_EMAIL" }), filed: "semail", width: "150px" },
      { title: this.props.intl.formatMessage({ id: "IDS_REFID" }), filed: "srefid", width: "150px" },
      { title: this.props.intl.formatMessage({ id: "IDS_PASSPORTNO" }), filed: "spassportno", width: "150px" },
      { title: this.props.intl.formatMessage({ id: "IDS_EXTERNALID" }), filed: "sexternalid", width: "150px" },
    ];



  }
  sidebarExpandCollapse = () => {
    this.setState({
      sidebarview: true
    })
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.Login.masterStatus !== "" &&
      props.Login.masterStatus !== state.masterStatus
    ) {
      toast.warn(props.Login.masterStatus);
      props.Login.masterStatus = "";
    }
    if (props.Login.error !== state.error) {
      toast.error(props.Login.error);
      props.Login.error = "";
    }
    if (props.Login.selectedRecord === undefined) {
      return { selectedRecord: {} };
    }
    return null;
  }
  handleClick = () => {
    this.props.getFilterStatusCombo({
      inputData: {
        userinfo: this.props.Login.userInfo,
        primarykey: transactionStatus.YES

      },
      masterData: { ...this.props.Login.masterData },
      Patconfigs: this.state.Patconfigs
    });
  }

  dataStateChange = (event) => {
    this.setState({ dataState: event.dataState })
  }

  handlePageChange = (event) => {
    this.setState({ kendoSkip: event.skip, kendoTake: event.take });
  };
  render() {
    const addId =
      this.state.controlMap.has("AddPatient") &&
      this.state.controlMap.get("AddPatient").ncontrolcode;
    const editId =
      this.state.controlMap.has("EditPatient") &&
      this.state.controlMap.get("EditPatient").ncontrolcode;
    const deleteId =
      this.state.controlMap.has("DeletePatient") &&
      this.state.controlMap.get("DeletePatient").ncontrolcode;
    const patientReportId =
      this.state.controlMap.has("PatientReport") &&
      this.state.controlMap.get("PatientReport").ncontrolcode;
    const patientReportHistoryId =
      this.state.controlMap.has("PatientReportHistory") &&
      this.state.controlMap.get("PatientReportHistory").ncontrolcode;


    const patientFilter = this.state.controlMap.has("PatientFilter") && this.state.controlMap.get("PatientFilter").ncontrolcode;

    const filterParam = {
      inputListName: "PatientList",
      selectedObject: "SelectedPatient",
      primaryKeyField: "spatientid",
      fetchUrl: "patient/getPatient",
      fecthInputObject: { userinfo: this.props.Login.userInfo, currentdate: formatInputDate(new Date(), true) },
      masterData: this.props.Login.masterData,
      searchFieldList: this.searchFieldList,
    };

    const addParam = {
      screenName: "IDS_PATIENTMASTER",
      operation: "create",
      primaryKeyName: "npatientcode",
      masterData: this.props.Login.masterData,
      userInfo: this.props.Login.userInfo,
      ncontrolcode: addId,
    };
    const editParam = {
      screenName: "IDS_PATIENTMASTER",
      operation: "update",
      primaryKeyName: "spatientid",
      masterData: this.props.Login.masterData,
      userInfo: this.props.Login.userInfo,
      ncontrolcode: editId,
      inputListName: "PatientList",
      selectedObject: "SelectedPatient",
    };
    const mandatoryFields = [
      {
        mandatory: true,
        idsName: "IDS_FIRSTNAME",
        dataField: "sfirstname",
        mandatoryLabel: "IDS_ENTER",
        controlType: "textbox",
      },
      {
        mandatory: true,
        idsName: "IDS_LASTNAME",
        dataField: "slastname",
        mandatoryLabel: "IDS_ENTER",
        controlType: "textbox",
      },
      {
        mandatory: true,
        idsName: "IDS_GENDER",
        dataField: "ngendercode",
        mandatoryLabel: "IDS_SELECT",
        controlType: "selectbox",
      },
      {

        mandatory: true,
        idsName: "IDS_DATEOFBIRTH",
        dataField: "ddob",
        mandatoryLabel: "IDS_SELECT",
        controlType: "selectbox",
      },
      // {
      //   mandatory: true,
      //   idsName: "IDS_AGE",
      //   dataField: "sage",
      //   mandatoryLabel: "IDS_ENTER",
      //   controlType: "textbox",
      // },
      // {
      //   mandatory: true,
      //   idsName: "IDS_ADDRESS",
      //   dataField: "saddress",
      //   mandatoryLabel: "IDS_ENTER",
      //   controlType: "textbox",
      // },
      // {
      //   mandatory: true,
      //   idsName: "IDS_PHONENO",
      //   dataField: "sphoneno",
      //   mandatoryLabel: "IDS_ENTER",
      //   controlType: "textbox",
      // },
      {
        mandatory: true,
        idsName: "IDS_COUNTRY",
        dataField: "ncountrycode",
        mandatoryLabel: "IDS_SELECT",
        controlType: "selectbox",
      },
      // {
      //   mandatory: true,
      //   idsName: "IDS_REGIONNAME",
      //   dataField: "nregioncode",
      //   mandatoryLabel: "IDS_SELECT",
      //   controlType: "selectbox",
      // },
      // {
      //   mandatory: true,
      //   idsName: "IDS_DISTRICTNAME",
      //   dataField: "ndistrictcode",
      //   mandatoryLabel: "IDS_SELECT",
      //   controlType: "selectbox",
      // },
      // {
      //   mandatory: true,
      //   idsName: "IDS_CITY",
      //   dataField: "ncitycode",
      //   mandatoryLabel: "IDS_SELECT",
      //   controlType: "selectbox",
      // },
      // {
      //   mandatory: true,
      //   idsName: "IDS_REGIONCITY",
      //   dataField: "scityname",
      //   mandatoryLabel: "IDS_ENTER",
      //   controlType: "textbox",
      // },
      // {
      //   mandatory: true,
      //   idsName: "IDS_STREET",
      //   dataField: "sstreet",
      //   mandatoryLabel: "IDS_ENTER",
      //   controlType: "textbox",
      // },
      // {
      //   mandatory: true,
      //   idsName: "IDS_HOUSENO",
      //   dataField: "shouseno",
      //   mandatoryLabel: "IDS_ENTER",
      //   controlType: "textbox",
      // },
      // {
      //   mandatory: true,
      //   idsName: "IDS_FLATNO",
      //   dataField: "sflatno",
      //   mandatoryLabel: "IDS_ENTER",
      //   controlType: "textbox",
      // },
      // {
      //   mandatory: true,
      //   idsName: "IDS_CURENTREGION",
      //   dataField: "nregioncodetemp",
      //   mandatoryLabel: "IDS_SELECT",
      //   controlType: "selectbox",
      // },
      // {
      //   mandatory: true,
      //   idsName: "IDS_CURRENTDISTRICT",
      //   dataField: "ndistrictcodetemp",
      //   mandatoryLabel: "IDS_SELECT",
      //   controlType: "selectbox",
      // },
      // {
      //   mandatory: true,
      //   idsName: "IDS_CURRENTCITY",
      //   dataField: "ncitycodetemp",
      //   mandatoryLabel: "IDS_SELECT",
      //   controlType: "selectbox",
      // },

      // {
      //   mandatory: true,
      //   idsName: "IDS_CURRENTCITY",
      //   dataField: "scitynametemp",
      //   mandatoryLabel: "IDS_ENTER",
      //   controlType: "textbox",
      // },
      // {
      //   mandatory: true,
      //   idsName: "IDS_CURRENTSTREET",
      //   dataField: "sstreettemp",
      //   mandatoryLabel: "IDS_ENTER",
      //   controlType: "textbox",
      // },
      // {
      //   mandatory: true,
      //   idsName: "IDS_CURRENTHOUSENO",
      //   dataField: "shousenotemp",
      //   mandatoryLabel: "IDS_ENTER",
      //   controlType: "textbox",
      // },
      // {
      //   mandatory: true,
      //   idsName: "IDS_CURRENTFLATNO",
      //   dataField: "sflatnotemp",
      //   mandatoryLabel: "IDS_ENTER",
      //   controlType: "textbox",
      // },
    ];
    this.extractedColumnList = [
      { "idsName": this.props.Login.genericLabel && this.props.Login.genericLabel["ARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode], "dataField": "sarno", "width": "200px" },
      { "idsName": this.props.Login.genericLabel && this.props.Login.genericLabel["SubARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode], "dataField": "ssamplearno", "width": "200px" },
      { "idsName": "IDS_REPORTREFNO", "dataField": "sreportno", "width": "200px" },
      { "idsName": "IDS_REGISTEREDDATE", "dataField": "stransactiondate", "width": "250px" },
    ]
    let fromDate = "";
    let toDate = "";
    let breadCrumbData = [];
    if (this.props.Login.masterData && this.props.Login.masterData.FromDate) {
      fromDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate);
      toDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.ToDate)

      breadCrumbData.push(
        {
          "label": "IDS_FROM",
          "value": this.props.Login.masterData.filterFromdate !== undefined ? convertDateValuetoString(this.props.Login.masterData.filterFromdate, this.props.Login.masterData.filterToDay, this.props.Login.userInfo).breadCrumbFrom : convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo).breadCrumbFrom
        },
        {
          "label": "IDS_TO",
          "value": this.props.Login.masterData.filterToDay !== undefined ? convertDateValuetoString(this.props.Login.masterData.filterFromdate, this.props.Login.masterData.filterToDay, this.props.Login.userInfo).breadCrumbto : convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo).breadCrumbto
        },
      );
    }
    if (this.props.Login.masterData && this.props.Login.masterData.SelectedPatientCaseType) {
      breadCrumbData.push(
        {
          "label": "IDS_PATIENTCASETYPE",
          "value": this.props.Login.masterData.SelectedPatientCaseType ? this.props.Login.masterData.SelectedPatientCaseType.spatientcasetypename : '-'
        }
      );
    }
    return (
      <>
        <div className="client-listing-wrap  mtop-4 mtop-fixed-breadcrumb">
          <Affix top={53}>
            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
          </Affix>
          <Row noGutters>
            <Col md={`${!this.props.sidebarview ? '4' : "2"}`}>
              <ListMaster
                screenName={this.props.intl.formatMessage({
                  id: "IDS_PATIENTMASTER",
                })}
                masterData={this.props.Login.masterData}
                userInfo={this.props.Login.userInfo}
                masterList={
                  this.props.Login.masterData.searchedData ||
                  this.props.Login.masterData.PatientList
                }
                getMasterDetail={(user) =>
                  this.props.getPatientDetail(
                    user,
                    this.props.Login.userInfo,
                    this.props.Login.masterData
                  )
                }
                selectedMaster={this.props.Login.masterData.SelectedPatient}
                primaryKeyField="spatientid"
                mainField="spatientname"
                SecondaryField={true}
                firstField="sage"
                secondField="sgendername"
                filterColumnData={this.props.filterColumnData}
                filterParam={filterParam}
                userRoleControlRights={this.state.userRoleControlRights}
                addId={addId}
                searchRef={this.searchRef}
                reloadData={this.reloadData}
                openModal={() => this.props.getPatientComboService(addParam)}
                isMultiSelecct={false}
                hidePaging={false}
                isClearSearch={this.props.Login.isClearSearch}
                showMicIcon={true}
                showFilterIcon={true}
                methodUrl={"Patient"}
                controlMap={this.state.controlMap}
                showSolidFilterIcon={this.state.userRoleControlRights.indexOf(patientFilter) !== -1}
                handleClick={this.handleClick}
                openFilter={this.openFilter}
                closeFilter={this.closeFilter}
                onFilterSubmit={this.onFilterSubmit}
                showFilter={this.props.Login.showFilter}
                settings={this.props.Login.settings || []}
                filterComponent={[
                  {
                    "IDS_DATEFILTER": <PatientMasterFilter
                      fromDate={this.props.Login.masterData && this.props.Login.masterData.FromDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate) : ""}
                      toDate={this.props.Login.masterData && this.props.Login.masterData.ToDate ? rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.ToDate) : ""}
                      selectedRecord={this.state.selectedRecord || {}}
                      userInfo={this.props.Login.userInfo}
                      handleDateChange={this.handleDateChange}
                      onComboChange={this.onComboChange}
                      patientcasetypeList={this.state.patientCaseTypeList || []}
                      selectedProjectcasetype={this.props.Login.masterData.SelectedPatientCaseType}
                    />
                  }
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
              <ContentPanel className="panel-main-content">
                <Card className="border-0">
                  {this.props.Login.masterData.PatientList &&
                    this.props.Login.masterData.PatientList.length > 0 &&
                    this.props.Login.masterData.SelectedPatient ? (
                    <>
                      <Card.Header>
                        {/* <ReactTooltip
                          place="bottom"
                          globalEventOff="click"
                          id="tooltip_list_wrap"
                        /> */}
                        <Card.Title className="product-title-main">
                          {
                            this.props.Login.masterData.SelectedPatient.spatientname
                          }
                        </Card.Title>
                        <Card.Subtitle>
                          <div className="d-flex product-category">
                            <h2 className="product-title-sub flex-grow-1"></h2>
                            <div className="d-inline">
                              <Nav.Link
                                name="editPatient"
                                hidden={
                                  this.state.userRoleControlRights.indexOf(editId) === -1
                                }
                                className="btn btn-circle outline-grey mr-2"
                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({
                                  id: "IDS_EDIT",
                                })}
                                //   data-for="tooltip_list_wrap"
                                onClick={() =>
                                  this.props.getPatientComboService(editParam)
                                }
                              >
                                <FontAwesomeIcon icon={faPencilAlt} />
                              </Nav.Link>

                              <Nav.Link
                                name="deletePatient"
                                className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({
                                  id: "IDS_DELETE",
                                })}
                                //   data-for="tooltip_list_wrap"
                                hidden={
                                  this.state.userRoleControlRights.indexOf(deleteId) === -1
                                }
                                onClick={() => this.ConfirmDelete(deleteId)}
                              >
                                <FontAwesomeIcon icon={faTrashAlt} />
                              </Nav.Link>
                              <Nav.Link
                                name="PatientHistory"
                                className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({
                                  id: "IDS_PATIENTHISTORY",
                                })}
                                //   data-for="tooltip_list_wrap"
                                hidden={
                                  this.state.userRoleControlRights.indexOf(deleteId) === -1
                                }
                                onClick={() => this.props.getPatientHistory(
                                  this.props.Login.masterData.SelectedPatient,
                                  this.props.Login.userInfo,
                                  this.props.Login.masterData
                                )}
                              >
                                <FontAwesomeIcon icon={faHistory} />
                              </Nav.Link>
                              <Nav.Link
                                className="btn btn-circle outline-grey ml-2"
                                //   data-for="tooltip_list_wrap"
                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_PATIENTREPORT" })} data-place="left"
                                hidden={this.state.userRoleControlRights.indexOf(patientReportHistoryId) === -1}
                                onClick={() => this.props.getpatientReportHistoryInfo(
                                  this.props.Login.masterData.SelectedPatient,
                                  this.props.Login.userInfo,
                                  this.props.Login.masterData)}>
                                <FontAwesomeIcon icon={faFilePdf} />
                              </Nav.Link>

                              <Nav.Link
                                className="btn btn-circle outline-grey mr-2"
                                name="patientReport"
                                hidden={
                                  this.state.userRoleControlRights.indexOf(
                                    patientReportId
                                  ) === -1
                                }
                                onClick={() =>
                                  this.props.getPatientReport(
                                    this.props.Login.masterData.SelectedPatient,
                                    this.props.Login.userInfo,
                                    patientReportId
                                  )
                                }
                                //  data-for="tooltip_list_wrap"
                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({
                                  id: "IDS_PATIENTREPORT",
                                })}
                              >
                                <Reports
                                  className="custom_icons"
                                  width="20"
                                  height="20"
                                />
                              </Nav.Link>
                            </div>
                          </div>
                        </Card.Subtitle>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                           <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_PATIENTCODE"
                                  message="Patient Format"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {
                                  this.props.Login.masterData.SelectedPatient.spatientcode === null ||
                                    this.props.Login.masterData.SelectedPatient.spatientcode === "" ? "-" :
                                    this.props.Login.masterData.SelectedPatient.spatientcode
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>

                          <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_FATHERNAME"
                                  message="Father Name"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {
                                  this.props.Login.masterData.SelectedPatient.sfathername === null ||
                                    this.props.Login.masterData.SelectedPatient.sfathername === "" ? "-" :
                                    this.props.Login.masterData.SelectedPatient.sfathername
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_DATEOFBIRTH"
                                  message="Date Of Birth"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {this.props.Login.masterData.SelectedPatient.sdob === "null" ||
                                  this.props.Login.masterData.SelectedPatient.sdob.length === 0
                                  ? "-"
                                  : this.props.Login.masterData.SelectedPatient.sdob
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>

                          <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage id="IDS_AGE" message="Age" />
                              </FormLabel>
                              <ReadOnlyText>
                                {this.props.Login.masterData.SelectedPatient.sage === "null" ||
                                  this.props.Login.masterData.SelectedPatient.sage.length === 0
                                  ? "-"
                                  : this.props.Login.masterData.SelectedPatient.sage
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>

                          <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage id="IDS_GENDER" message="Gender" />
                              </FormLabel>
                              <ReadOnlyText>
                                {this.props.Login.masterData.SelectedPatient.sgendername === null ||
                                  this.props.Login.masterData.SelectedPatient.sgendername.length === 0
                                  ? "-"
                                  : this.props.Login.masterData.SelectedPatient.sgendername
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>

                          <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_MOBILENO"
                                  message="Mobile No"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {this.props.Login.masterData.SelectedPatient.smobileno === null ||
                                  this.props.Login.masterData.SelectedPatient.smobileno === "" ? "-"
                                  : this.props.Login.masterData.SelectedPatient.smobileno}
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>

                          <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_PHONENO"
                                  message="Phone No"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {
                                  this.props.Login.masterData.SelectedPatient.sphoneno === null ||
                                    this.props.Login.masterData.SelectedPatient.sphoneno === "" ? "-" :
                                    this.props.Login.masterData.SelectedPatient.sphoneno
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_EMAILID"
                                  message="Email ID"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {
                                  this.props.Login.masterData.SelectedPatient.semail === null ||
                                    this.props.Login.masterData.SelectedPatient.semail === "" ? "-" :
                                    this.props.Login.masterData.SelectedPatient.semail
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_MIGRANT"
                                  message="Migrant"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {
                                  this.props.Login.masterData.SelectedPatient.sdisplaystatus == "null" ||
                                    this.props.Login.masterData.SelectedPatient.sdisplaystatus.length === 0 ? "-" :
                                    this.props.Login.masterData.SelectedPatient.sdisplaystatus
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_COUNTRY"
                                  message="COUNTRY"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {
                                  this.props.Login.masterData.SelectedPatient.scountryname == "null" ||
                                    this.props.Login.masterData.SelectedPatient.scountryname.length === 0 ? "-" :
                                    this.props.Login.masterData.SelectedPatient.scountryname
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>


                          <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_REFERENCEID"
                                  message="Reference ID"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {
                                  this.props.Login.masterData.SelectedPatient.srefid === null ||
                                    this.props.Login.masterData.SelectedPatient.srefid === "" ? "-" :
                                    this.props.Login.masterData.SelectedPatient.srefid
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>

                          <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_PASSPORTNO"
                                  message="Passport No"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {
                                  this.props.Login.masterData.SelectedPatient.spassportno === null ||
                                    this.props.Login.masterData.SelectedPatient.spassportno === "" ? "-" :
                                    this.props.Login.masterData.SelectedPatient.spassportno
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>

                          <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_EXTERNALID"
                                  message="External ID"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {
                                  this.props.Login.masterData.SelectedPatient.sexternalid === null ||
                                    this.props.Login.masterData.SelectedPatient.sexternalid === "" ? "-" :
                                    this.props.Login.masterData.SelectedPatient.sexternalid
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>
                          <Col md={12}>
                            <div className="horizontal-line"></div>
                          </Col>
                          <Col md={12}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_PERMANENTADDRESS"
                                  message="Permanent Address:"
                                />
                              </FormLabel>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_REGIONNAME"
                                  message="Region"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {
                                  this.props.Login.masterData.SelectedPatient.sregionname === "NA" ||
                                    this.props.Login.masterData.SelectedPatient.sregionname.length === 0 ? "-"
                                    : this.props.Login.masterData.SelectedPatient.sregionname
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_DISTRICTNAME"
                                  message="District"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {
                                  this.props.Login.masterData.SelectedPatient.sdistrictname === "NA" ||
                                    this.props.Login.masterData.SelectedPatient.sdistrictname.length === 0 ? "-"
                                    : this.props.Login.masterData.SelectedPatient.sdistrictname
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>

                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_REGIONCITY"
                                  message="City"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {
                                  this.props.Login.masterData.SelectedPatient.scityname === "null" ||
                                    this.props.Login.masterData.SelectedPatient.scityname.length === 0 ? "-"
                                    : this.props.Login.masterData.SelectedPatient.scityname
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_POSTALCODE"
                                  message="PostalCode"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {
                                  this.props.Login.masterData.SelectedPatient.spostalcode === null ||
                                    this.props.Login.masterData.SelectedPatient.spostalcode === "" ? "-" :
                                    this.props.Login.masterData.SelectedPatient.spostalcode
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>

                          <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_STREET"
                                  message="Street"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {
                                  this.props.Login.masterData.SelectedPatient.sstreet === "null" ||
                                    this.props.Login.masterData.SelectedPatient.sstreet.length === 0 ? "-"
                                    : this.props.Login.masterData.SelectedPatient.sstreet
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_HOUSENO"
                                  message="House No"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {
                                  this.props.Login.masterData.SelectedPatient.shouseno === "null" ||
                                    this.props.Login.masterData.SelectedPatient.shouseno.length === 0 ? "-"
                                    : this.props.Login.masterData.SelectedPatient.shouseno
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_FLATNO"
                                  message="Flat No"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {
                                  this.props.Login.masterData.SelectedPatient.sflatno === "null" ||
                                    this.props.Login.masterData.SelectedPatient.sflatno.length === 0 ? "-"
                                    : this.props.Login.masterData.SelectedPatient.sflatno
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>
                          <Col md={12}>
                            <div className="horizontal-line"></div>
                          </Col>
                          <Col md={12}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_CURRENTADDRESS"
                                  message="Current Address:"
                                />
                              </FormLabel>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_REGIONNAME"
                                  message="Region"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {
                                  this.props.Login.masterData.SelectedPatient.sregionnametemp === "NA" ||
                                    this.props.Login.masterData.SelectedPatient.sregionnametemp.length === 0 ? "-"
                                    : this.props.Login.masterData.SelectedPatient.sregionnametemp
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_DISTRICTNAME"
                                  message="District"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {
                                  this.props.Login.masterData.SelectedPatient.sdistrictnametemp === "NA" ||
                                    this.props.Login.masterData.SelectedPatient.sdistrictnametemp.length === 0 ? "-"
                                    : this.props.Login.masterData.SelectedPatient.sdistrictnametemp
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_REGIONCITY"
                                  message="City"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {
                                  this.props.Login.masterData.SelectedPatient.scitynametemp === "null" ||
                                    this.props.Login.masterData.SelectedPatient.scitynametemp.length === 0 ? "-"
                                    : this.props.Login.masterData.SelectedPatient.scitynametemp
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_POSTALCODE"
                                  message="PostalCode"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {
                                  this.props.Login.masterData.SelectedPatient.spostalcodetemp === null ||
                                    this.props.Login.masterData.SelectedPatient.spostalcodetemp === "" ? "-" :
                                    this.props.Login.masterData.SelectedPatient.spostalcodetemp
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>

                          <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_STREET"
                                  message="Street"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {
                                  this.props.Login.masterData.SelectedPatient.sstreettemp === "null" ||
                                    this.props.Login.masterData.SelectedPatient.sstreettemp.length === 0 ? "-"
                                    : this.props.Login.masterData.SelectedPatient.sstreettemp
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_HOUSENO"
                                  message="HouseNo"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {
                                  this.props.Login.masterData.SelectedPatient.shousenotemp === "null" ||
                                    this.props.Login.masterData.SelectedPatient.shousenotemp.length === 0 ? "-"
                                    : this.props.Login.masterData.SelectedPatient.shousenotemp
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_FLATNO"
                                  message="FlatNo"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {
                                  this.props.Login.masterData.SelectedPatient.sflatnotemp === "null" ||
                                    this.props.Login.masterData.SelectedPatient.sflatnotemp.length === 0 ? "-"
                                    : this.props.Login.masterData.SelectedPatient.sflatnotemp
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col>


                          {/* <Col md={4}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_CITY"
                                  message="City"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {
                                  this.props.Login.masterData.SelectedPatient.scityname == "null" ||
                                  this.props.Login.masterData.SelectedPatient.scityname.length === 0 ? "-":
                                  this.props.Login.masterData.SelectedPatient.scityname                                 
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col> */}

                          {/* <Col md={4}>
                            <FormGroup>
                              <FormLabel>
                                <FormattedMessage
                                  id="IDS_DISTRICT"
                                  message="District"
                                />
                              </FormLabel>
                              <ReadOnlyText>
                                {
                                  this.props.Login.masterData.SelectedPatient.sdistrict == "null" ||
                                  this.props.Login.masterData.SelectedPatient.sdistrict === 0 ?"-":
                                  this.props.Login.masterData.SelectedPatient.sdistrict                                 
                                }
                              </ReadOnlyText>
                            </FormGroup>
                          </Col> */}

                          {/* <Col md={4}>
                            <FormGroup> */}
                        </Row>
                        {/* <Row>
                          <Col> */}
                        {/* <DataGrid
                              userRoleControlRights={
                                this.state.userRoleControlRights
                              }
                              controlMap={this.state.controlMap}
                              primaryKeyField={"npreregno"}
                              data={
                                this.props.Login.masterData &&
                                this.props.Login.masterData["PatientHistory"]
                              }
                              dataResult={process(
                                this.props.Login.masterData &&
                                (this.props.Login.masterData[
                                  "PatientHistory"
                                ] ||
                                  []),
                                this.state.dataState
                              )}
                              dataState={this.state.dataState}
                              dataStateChange={this.dataStateChange}
                              extractedColumnList={this.columnList}
                              inputParam={this.props.Login.inputParam}
                              userInfo={this.props.Login.userInfo}
                              methodUrl={this.props.Login.inputParam.methodUrl}
                              pageable={true}
                              scrollable={"scrollable"}
                              isActionRequired={false}
                              isToolBarRequired={false}
                              selectedId={null}
                              hideColumnFilter={false}
                              expandField={"expanded"}
                              handleExpandChange={this.handleExpandChange}
                              hasChild={true}
                              childColumnList={this.childColumnList}
                              childMappingField={"npreregno"}
                              childList={this.props.Login.testMap || new Map()}
                            />
                          </Col>
                        </Row> */}
                      </Card.Body>
                    </>
                  ) : (
                    ""
                  )}
                </Card>
              </ContentPanel>
            </Col>
          </Row>
        </div>

        {this.props.Login.openModal ? (
          <SlideOutModal
            show={this.props.Login.openModal}
            closeModal={this.closeModal}
            className={this.props.Login.openSolidAdvFilter ? "wide-popup" : ""}
            // operation={this.props.Login.operation}
            size={this.props.Login.loadEsign ? "lg" : this.props.Login.openSolidAdvFilter ? "xl" : (this.props.Login.patientHistory || this.props.Login.patientReportHistory) ? "xl" : "lg"}
            operation={this.props.Login.openSolidAdvFilter ? "" : this.props.Login.operation}
            inputParam={this.props.Login.inputParam}
            showSaveContinue={true}
            screenName={this.props.Login.patientHistory ? this.props.intl.formatMessage({ id: "IDS_PATIENTHISTORY" }) : this.props.Login.patientReportHistory ? this.props.intl.formatMessage({ id: "IDS_PATIENTREPORT" }) : this.props.Login.screenName}
            onSaveClick={this.props.Login.openSolidAdvFilter ? this.onSaveGetClick : this.onSaveClick}
            esign={this.props.Login.loadEsign}
            validateEsign={this.validateEsign}
            showSubmit={this.props.Login.openSolidAdvFilter ? true : false}
            showSaveAs={this.props.Login.openSolidAdvFilter ? true : false}
            hideSave={(this.props.Login.patientHistory || this.props.Login.patientReportHistory) ? true : this.props.Login.openSolidAdvFilter ? true : false}
            masterStatus={this.props.Login.masterStatus}
            updateStore={this.props.updateStore}
            selectedRecord={this.state.selectedRecord || {}}
            mandatoryFields={this.props.Login.openSolidAdvFilter ? "" : this.props.Login.openModal ? mandatoryFields : ""}

            addComponent={
              this.props.Login.loadEsign && this.props.Login.openSolidAdvFilter===false  ? (  
                <Esign
                  operation={this.props.Login.operation}
                  onInputOnChange={this.onInputOnChange}
                  inputParam={this.props.Login.inputParam}
                  selectedRecord={this.state.selectedRecord || {}}
                />
              ) : this.props.Login.openSolidAdvFilter ?
                <Row>
                  <Col md={3} style={{ "margin-top": "14px" }}>
                    <FormSelectSearch
                      name={"npatientfiltercode"}
                      formLabel={this.props.intl.formatMessage({ id: "IDS_PATIENTFILTER" })}
                      placeholder={this.props.intl.formatMessage({ id: "IDS_PATIENTFILTER" })}
                      options={this.props.Login.masterData.patientFilerList}
                      value={this.state.selectedRecord.npatientfiltercode !== undefined ? this.state.selectedRecord.npatientfiltercode : this.props.Login.masterData.SelectedPatientFilterType && { "label": this.props.Login.masterData.SelectedPatientFilterType.spatientfiltername, "value": this.props.Login.masterData.SelectedPatientFilterType.npatientfiltercode }}
                      isMandatory={false}
                      required={true}
                      isClearable={false}
                      isMulti={false}
                      isSearchable={false}
                      isDisabled={false}
                      closeMenuOnSelect={true}
                      onChange={(event) => this.onComboChange(event, 'npatientfiltercode')}
                    />

                  </Col>
                  <Col md={3}>
                    <CustomSwitch
                      label={this.props.intl.formatMessage({ id: "IDS_" + (this.props.Login.masterData.SelectedPatientFilterType.sfilterstatus).toUpperCase() })}
                      type="switch"
                      name={"nfilterstatus"}
                      onChange={(event) => this.onInputOnChange(event, 'nfilterstatus')}
                      placeholder={this.props.intl.formatMessage({ id: "IDS_TRANSACTIONSTATUSACTIVE" })}
                      defaultValue={this.props.Login.masterData.SelectedPatientFilterType["nfilterstatus"] === transactionStatus.YES ? true : false}
                      isMandatory={false}
                      required={false}
                      checked={this.props.Login.masterData.SelectedPatientFilterType["nfilterstatus"] === transactionStatus.YES ? true : false}
                    />
                  </Col>
                  <Col md="12">
                    <FilterQueryBuilder
                      //fields={Fields}
                      fields={this.state.fields}
                      queryArray={this.state.queryArray}
                      skip={this.state.kendoSkip}
                      take={this.state.kendoTake}
                      onChange={this.onChange}
                      tree={this.props.Login.tree !== undefined ? this.props.Login.tree : this.state.selectedRecord.tree}
                      // config={this.state.Patconfigs}
                      gridColumns={this.slideList}
                      filterData={this.props.Login.slideResult || []}
                      handlePageChange={this.handlePageChange}
                      static={true}
                      userInfo={this.props.Login.userInfo}
                      updateStore={this.props.updateStore}
                    // controlMap={this.state.controlMap}
                    // dataState={this.state.dataState}
                    // dataStateChange={this.dataStateChange}
                    />
                  </Col>


                  {this.props.Login.openAlertModal &&
                    <AlertModal
                      openAlertModal={this.props.Login.openAlertModal}
                      modalTitle={"IDS_ENTERQUERYNAME"}
                      closeModal={() => {
                        let selectedRecord = this.state.selectedRecord;
                        selectedRecord["QueryName"] = undefined;
                        const updateInfo = {
                          typeName: DEFAULT_RETURN,
                          data: {
                            openAlertModal: false,
                            selectedRecord
                          },
                        };
                        this.props.updateStore(updateInfo);
                      }
                      }
                      onSaveClick={this.handleSaveFilterClick}
                      modalBody={
                        <Row>
                          <Col>
                            <FormInput
                              label={this.props.intl.formatMessage({ id: "IDS_QUERYNAME" })}
                              name={"QueryName"}
                              type="text"
                              onChange={(event) => this.onInputOnChange(event)}
                              placeholder={this.props.intl.formatMessage({ id: "IDS_QUERYNAME" })}
                              //  value={this.state.selectedRecord.QueryName ? this.state.selectedRecord.QueryName : this.props.Login.QueryName ? this.props.Login.QueryName : ""}
                              value={(this.state.selectedRecord.QueryName === '' || this.state.selectedRecord.QueryName) ? this.state.selectedRecord.QueryName : this.props.Login.QueryName ? this.props.Login.QueryName : ""}

                              //value={this.state.selectedRecord.QueryName? this.state.selectedRecord.QueryName :""}

                              //  value={this.state.selectedRecord.QueryName ? this.state.selectedRecord.QueryName : this.state.selectedRecord.npatientfiltercode ? this.state.selectedRecord.npatientfiltercode.label : ""}
                              // value={this.props.Login.masterData.SelectedPatientFilterType.spatientfiltername ==="Create New Query"?this.state.selectedRecord.QueryName :this.state.selectedRecord.npatientfiltercode.label}
                              isMandatory={true}
                              required={true}
                              maxLength={"30"}
                            />
                          </Col>
                        </Row>
                      }
                    />}
                </Row>
                : this.props.Login.patientHistory ?
                  <Row>
                    <Col md='12'>
                      <Card.Title >
                        <FormattedMessage
                          id="IDS_PATIENT" />
                        {
                          this.props.Login.masterData.SelectedPatient.spatientname
                        }
                      </Card.Title>
                    </Col>
                    <Col md='12'>
                      <DataGrid
                        data={this.props.Login.masterData && this.props.Login.masterData.patientHistory}
                        //   key="testsectionkey"
                        //   primaryKeyField="npreregno"
                        expandField="expanded"
                        handleExpandChange={this.handleExpandChange}
                        // dataResult={this.props.Login.masterData.patientHistorydetails &&
                        //     this.props.Login.masterData.patientHistory && process(
                        //          this.props.Login['patienthist'] 
                        //         || [],
                        //         this.state.dataState
                        //             ? this.state.dataState : { skip: 0, take: 10 })} 
                        dataResult={this.props.Login.masterData.patientHistory && process(
                          this.props.Login.masterData.patientHistory || [],
                          this.state.dataState ? this.state.dataState : { skip: 0, take: 10 }
                        )}
                        dataState={this.state.dataState
                          ? this.state.dataState : { skip: 0, take: 10 }}
                        dataStateChange={this.dataStateChange}
                        extractedColumnList={this.extractedColumnList}
                        controlMap={this.state.controlMap}
                        userRoleControlRights={this.state.userRoleControlRights}
                        pageable={true}
                        scrollable={'scrollable'}
                        hideColumnFilter={false}
                        selectedId={0}
                        hasChild={true}
                        childMappingField={'ncoaparentcode'}
                        childColumnList={[

                          { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "200px" },
                          { "idsName": "IDS_PARAMETERNAME", "dataField": "sparametersynonym", "width": "200px" },
                          { "idsName": "IDS_RESULT", "dataField": "sfinal", "width": "200px" },
                          { "idsName": "IDS_PASSFLAG", "dataField": "sgradename", "width": "200px" }
                        ]}
                        childList={this.state.childListMap3}
                      //  activeTabName={"IDS_NEEDTESTINITIATE"}
                      ></DataGrid>
                    </Col>
                  </Row>
                  : this.props.Login.patientReportHistory ?
                    <Row>
                      <Col md='12'>
                        <Card.Title >
                          <FormattedMessage
                            id="IDS_PATIENT" />
                          {
                            this.props.Login.masterData.SelectedPatient.spatientname
                          }
                        </Card.Title>
                      </Col>
                      <Col md='12'>
                        <DataGrid
                          data={this.props.Login.masterData && this.props.Login.masterData.PatientReports}
                          //   key="testsectionkey"
                          //   primaryKeyField="npreregno"
                          dataResult={this.props.Login.masterData.PatientReports && process(
                            this.props.Login.masterData.PatientReports || [],
                            this.state.dataState ? this.state.dataState : { skip: 0, take: 10 }
                          )}
                          dataState={this.state.dataState
                            ? this.state.dataState : { skip: 0, take: 10 }}
                          dataStateChange={this.dataStateChange}
                          extractedColumnList={[
                            { "idsName": "IDS_RELEASENO", "dataField": "sreportno", "width": "200px" },
                            { "idsName": "IDS_REPORTEDDATETIME", "dataField": "sreleasedate", "width": "200px" },
                            { "idsName": this.props.Login.genericLabel && this.props.Login.genericLabel["ARNo"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode], "dataField": "sarno", "width": "200px" },
                          ]}

                          isExportExcelRequired={false}
                          controlMap={this.state.controlMap}
                          userRoleControlRights={this.state.userRoleControlRights}
                          pageable={true}
                          scrollable={'scrollable'}
                          hideColumnFilter={false}
                          selectedId={0}
                          isActionRequired={true}
                          methodUrl={'PatientReports'}
                          viewDownloadFile={this.viewSelectedReport}
                        ></DataGrid>
                      </Col>
                    </Row>
                    :
                    <AddPatient
                      selectedRecord={this.state.selectedRecord || {}}
                      onInputOnChange={this.onInputOnChange}
                      onComboChange={this.onComboChange}
                      onNumericInputOnChange={this.onNumericInputOnChange}
                      handleDateChange={this.handleDateChange}
                      genderList={this.props.Login.genderList || []}
                      cityList={this.props.Login.cityList || []}
                      countryList={this.props.Login.countryList || []}
                      selectedPatient={
                        this.props.Login.masterData.SelectedPatient || {}
                      }
                      operation={this.props.Login.operation}
                      inputParam={this.props.Login.inputParam}
                      userInfo={this.props.Login.userInfo}
                      currentTime={this.props.Login.currentTime}
                      regionList={this.props.Login.regionList || []}
                      districtList={this.props.Login.districtList || []}
                      districtListTemp={this.props.Login.districtListTemp || []}
                      cityListTemp={this.props.Login.cityListTemp || []}
                    />

            }
          />
        ) : (
          ""
        )}


      </>
    );
  }
  // handleExpandChange=()=>{

  // }

  openFilter = () => {
    let showFilter = !this.props.Login.showFilter
    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { showFilter }
    }
    this.props.updateStore(updateInfo);
  }

  closeFilter = () => {

    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { showFilter: false }
    }
    this.props.updateStore(updateInfo);
  }

  viewSelectedReport = (filedata) => {
    delete (filedata.inputData.userinfo);
    const inputParam = {
      inputData: {
        ssystemfilename: filedata.inputData.ssystemfilename,
        releasedcoareport: filedata.inputData,
        userinfo: this.props.Login.userInfo,
        ncontrolCode: filedata.ncontrolCode,
        sreportno: filedata.inputData.sreportno
      },
      classUrl: "patient",
      operation: "view",
      methodUrl: "PatientReportHistory",
    }
    this.props.viewAttachment(inputParam);
  }

  onFilterSubmit = () => {

    let inputData = [];
    //if(this.state.selectedRecord.npatientcasetypecode !== undefined && this.props.Login.masterData.SelectedPatientCaseType !== undefined)
    //{
    inputData["userinfo"] = this.props.Login.userInfo;
    //  inputData["formdate"] = this.state.selectedRecord['fromdate'] !== undefined ? convertDateValuetoString(this.state.selectedRecord["fromdate"],this.state.selectedRecord["ToDay"],this.props.Login.userInfo,true) : formatInputDateWithoutT(rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate));
    inputData["date"] = this.state.selectedRecord['fromdate'] !== undefined ? convertDateValuetoString(this.state.selectedRecord["fromdate"], this.state.selectedRecord["ToDay"], this.props.Login.userInfo, true) :
      convertDateValuetoString(rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate), rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.ToDate), this.props.Login.userInfo, true);
    //   inputData["todate"] = this.state.selectedRecord['ToDay'] !== undefined ? convertDateValuetoString(undefined,this.state.selectedRecord["ToDay"],this.props.Login.userInfo,undefined) : formatInputDateWithoutT(rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.ToDate));
    inputData["casetype"] = this.state.selectedRecord.npatientcasetypecode !== undefined ? this.state.selectedRecord.npatientcasetypecode && this.state.selectedRecord.npatientcasetypecode.item.displayname : this.props.Login.masterData.SelectedPatientCaseType.spatientcasetypename;
    // "Follow up";
    // this.state.selectedRecord.npatientcasetypecode !== undefined ? this.state.selectedRecord.npatientcasetypecode.label : this.props.Login.masterData.SelectedPatientCaseType.spatientcasetypename;
    this.searchRef.current.value = "";
    const inputParam = {
      classUrl: "patient",
      methodUrl: "Patient",
      inputData: inputData,
      searchRef: this.searchRef,
      isClearSearch: this.props.Login.isClearSearch,
      displayname: "Filter"
    };
    const masterData = this.props.Login.masterData;
    const SelectedPatientCaseType = this.state.selectedRecord.npatientcasetypecode !== undefined ? this.state.selectedRecord.npatientcasetypecode.item : this.props.Login.masterData.SelectedPatientCaseType;

    this.props.getPatientDetailsByFilterQuery(inputParam, masterData, SelectedPatientCaseType);
    // }
  }

  componentDidUpdate(previousProps) {

    // let { fields,selectedRecord,userRoleControlRights, controlMap, patientCaseTypeList} = this.state;
    // let bool = false;
    if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
      // bool=true;
      this.setState({ selectedRecord: this.props.Login.selectedRecord, });
      // selectedRecord = this.props.Login.selectedRecord;
    }
    if (this.props.Login.masterData !== previousProps.Login.masterData) {
      let fields = this.state.fields;
      let queryBuilderGender = [];
      let queryBuilderCity = [];
      let queryBuilderCountry = [];
      let queryBuilderRegion = [];
      // let queryBuilderDistrict=[];




      this.props.Login.masterData.genderList && this.props.Login.masterData.genderList.map(
        (item) => queryBuilderGender.push({ "value": item.ngendercode, "title": item.sgendername })
      )

      this.props.Login.masterData.cityList && this.props.Login.masterData.cityList.map(
        (item) => queryBuilderCity.push({ "value": item.ncitycode, "title": item.scityname })
      )

      this.props.Login.masterData.countryList && this.props.Login.masterData.countryList.map(
        (item) => queryBuilderCountry.push({ "value": item.ncountrycode, "title": item.scountryname })
      )

      this.props.Login.masterData.regionList && this.props.Login.masterData.regionList.map(
        (item) => queryBuilderRegion.push({ "value": item.nregioncode, "title": item.sregionname })
      )

      // this.props.Login.masterData.districtList && this.props.Login.masterData.districtList.map(
      //   (item)=>queryBuilderDistrict.push({"value":item.ndistrictcode ,"title":item.sdistrictname})
      // )

      //this.setState({ queryArray: queryArray });
      fields = {
        ...fields,
        // "patientmaster.ngendercode": {
        //   "label": this.props.intl.formatMessage({
        //     id: "IDS_GENDER",
        //   }),
        //   "type": "select",
        //   "valueSources": ["value"],
        //   "fieldSettings": {
        //     "listValues": queryBuilderGender
        //   }
        // },

        // "patientmaster.ncitycode": {
        //   "label": this.props.intl.formatMessage({
        //     id: "IDS_CITY",
        //   }),
        //   "type": "select",
        //   "valueSources": ["value"],
        //   "fieldSettings": {
        //     "listValues": queryBuilderCity
        //   }
        // },

        "patientmaster.ncountrycode": {
          "label": this.props.intl.formatMessage({
            id: "IDS_COUNTRY",
          }),
          "type": "select",
          "valueSources": ["value"],
          "fieldSettings": {
            "listValues": queryBuilderCountry
          }
        },
        "patientmaster.nregioncode": {
          "label": this.props.intl.formatMessage({
            id: "IDS_REGIONNAME",
          }),
          "type": "select",
          "valueSources": ["value"],
          "fieldSettings": {
            "listValues": queryBuilderRegion
          }
        },
        // "patientmaster.ndistrictcode": {
        //   "label": this.props.intl.formatMessage({
        //     id: "IDS_DISTRICTNAME",
        //   }),
        //   "type": "select",
        //   "valueSources": ["value"],
        //   "fieldSettings": {
        //     "listValues": queryBuilderDistrict
        //   }
        // }
      }
      // bool=true;
      this.setState({ fields: fields });
    }
    if (
      this.props.Login.userInfo.nformcode !==
      previousProps.Login.userInfo.nformcode
    ) {
      const userRoleControlRights = [];
      const patcasetypeMap = constructOptionList(this.props.Login.masterData.PatientCaseType || [], "npatientcasetypecode",
        "spatientcasetypename", undefined, undefined, false);
      const patientCaseTypeList = patcasetypeMap.get("OptionList");
      const patcaseFiltertypeMap = constructOptionList(this.props.Login.masterData.patientFilterType || [], "npatientfiltercode",
        "spatientfiltername", undefined, undefined, false);
      const patientFilerList = patcaseFiltertypeMap.get("OptionList");
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
      const controlMap = getControlMap(
        this.props.Login.userRoleControlRights,
        this.props.Login.userInfo.nformcode
      );
      // bool=true;
      this.setState({ userRoleControlRights, controlMap, patientCaseTypeList, patientFilerList });
    }
    // if(bool){
    //   this.setState({ 
    //     fields,selectedRecord,userRoleControlRights, controlMap, patientCaseTypeList 
    //   });
    // }
  }

  ConfirmDelete = (deleteId) => {
    this.confirmMessage.confirm(
      "deleteMessage",
      this.props.intl.formatMessage({ id: "IDS_DELETE" }),
      this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
      this.props.intl.formatMessage({ id: "IDS_OK" }),
      this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
      () =>
        this.deletePatient(
          "Patient",
          this.props.Login.masterData.SelectedPatient,
          "delete",
          deleteId
        )
    );
  };

  closeModal = () => {
    let loadEsign = this.props.Login.loadEsign;
    let openModal = this.props.Login.openModal;
    let selectedRecord = this.props.Login.selectedRecord;
    let openSolidAdvFilter = this.props.Login.openSolidAdvFilter;
    let patientHistory = this.props.Login.patientHistory;
    let patientReportHistory = this.props.Login.patientReportHistory;
    let slideResult = this.props.Login.slideResult;
    let tree = this.state.tree;
    let openAlertModal;


    let config = this.state.config;

    if (this.props.Login.loadEsign) {
      if (this.props.Login.operation === "delete") {
        loadEsign = false;
        openModal = false;
        selectedRecord = {};
      } else {
        loadEsign = false;
        selectedRecord['esignpassword'] = "";
        selectedRecord['esigncomments'] = "";
        selectedRecord['esignreason'] = "";
      }
    } else {
      openSolidAdvFilter = false;
      openModal = false;
      patientHistory = false;
      patientReportHistory = false;
      selectedRecord = {};
      slideResult = {};
      config = undefined;
      tree = undefined;
      this.props.Login.districtList = [];
      this.props.Login.districtListTemp = [];
      this.props.Login.cityListTemp = [];
      this.props.Login.cityList = [];
      this.setState({ config: config, tree: tree })
      openAlertModal = false;
    }

    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: {
        openAlertModal, openModal, loadEsign, selectedRecord, selectedId: null, openSolidAdvFilter, slideResult, config, tree,
        patientHistory, patientReportHistory
      },
    };
    this.props.updateStore(updateInfo);
  };

  onComboChange = (comboData, fieldName, optionlistname) => {
    const selectedRecord = this.state.selectedRecord || {};
    selectedRecord[fieldName] = comboData;
    if (fieldName === "nregioncode") {
      this.props.getDistrictComboServices({
        inputData: {
          dispalyname: "District",
          userinfo: this.props.Login.userInfo,
          sdisplayname: selectedRecord.nregioncode.label,
          primarykey: selectedRecord.nregioncode.value,
          optionlistname
        }
      });
      selectedRecord["ndistrictcode"] = "";
      selectedRecord["ncitycode"] = "";
    }
    else if (fieldName === "nregioncodetemp") {
      this.props.getDistrictComboServices({
        inputData: {
          dispalyname: "DistrictTemp",
          userinfo: this.props.Login.userInfo,
          sdisplayname: selectedRecord.nregioncodetemp.label,
          primarykey: selectedRecord.nregioncodetemp.value,
          optionlistname
        }
      });
      selectedRecord["ndistrictcodetemp"] = "";
      selectedRecord["ncitycodetemp"] = "";
    }
    else if (fieldName === "ndistrictcode") {
      this.props.getCityComboServices({
        inputData: {
          dispalyname: "City",
          userinfo: this.props.Login.userInfo,
          sdisplayname: selectedRecord.ndistrictcode.label,
          primarykey: selectedRecord.ndistrictcode.value,
          optionlistname
        }
      });
      selectedRecord["ncitycode"] = "";
    }
    else if (fieldName === "ndistrictcodetemp") {
      this.props.getCityComboServices({
        inputData: {
          dispalyname: "CityTemp",
          userinfo: this.props.Login.userInfo,
          sdisplayname: selectedRecord.ndistrictcodetemp.label,
          primarykey: selectedRecord.ndistrictcodetemp.value,
          optionlistname
        }
      });
      selectedRecord["ncitycodetemp"] = "";
    }
    else if (fieldName === "npatientcasetypecode") {
      selectedRecord[fieldName] = comboData;
    } else if (fieldName === "npatientfiltercode") {
      this.props.filtercomboService({
        inputData: {
          userinfo: this.props.Login.userInfo,
          sdisplayname: selectedRecord.npatientfiltercode.label,
          primarykey: selectedRecord.npatientfiltercode.value
        },
        masterData: { ...this.props.Login.masterData, selectedRecord },
        Patconfigs: this.state.Patconfigs
      });
    }
    this.setState({ selectedRecord });
  };

  onNumericInputOnChange = (value, name) => {
    const selectedRecord = this.state.selectedRecord || {};
    selectedRecord[name] = value;
    this.setState({ selectedRecord });
  };
  // onFilterInputChange(immutableTree,){

  //  let QbUtilss=JSON.stringify(QbUtils.sqlFormat(immutableTree, config));
  //   console.log('QbUtils',QbUtilss)
  // return QbUtilss

  // };
  onChange = (immutableTree, config) => {
    let selectedRecord = this.state.selectedRecord || {};
    selectedRecord["tree"] = immutableTree;
    selectedRecord["config"] = config;
    // this.setState({ tree: immutableTree, config: config });
    selectedRecord['filterquery'] = QbUtils.sqlFormat(immutableTree, config);
    selectedRecord['jsonTree'] = QbUtils.getTree(immutableTree);
    // <div>SQL where: <pre>{selectedRecord['filterquery']}</pre></div>
    this.setState({ tree: immutableTree, config: config, selectedRecord: selectedRecord });

  };
  onInputOnChange = (event, fieldName) => {
    const selectedRecord = this.state.selectedRecord || {};

    if (event.target.type === "checkbox") {
      if (fieldName === "nfilterstatus") {
        selectedRecord["npatientfiltercode"] = undefined;
        selectedRecord[fieldName] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        this.props.getFilterStatusCombo({
          inputData: {
            userinfo: this.props.Login.userInfo,
            primarykey: selectedRecord.nfilterstatus
          },
          masterData: { ...this.props.Login.masterData, selectedRecord },
          Patconfigs: this.state.Patconfigs
        });
      } else {
        selectedRecord[event.target.name] =
          event.target.checked === true
            ? transactionStatus.YES
            : transactionStatus.NO;
        if (selectedRecord.nneedcurrentaddress === 3) {
          selectedRecord.sflatnotemp = selectedRecord.sflatno;
          selectedRecord.shousenotemp = selectedRecord.shouseno;
          selectedRecord.spostalcodetemp = selectedRecord.spostalcode;
          selectedRecord.sstreettemp = selectedRecord.sstreet;
          //selectedRecord.ncitycodetemp = selectedRecord.ncitycode;
          selectedRecord.scitynametemp = selectedRecord.scityname;
          selectedRecord.ndistrictcodetemp = selectedRecord.ndistrictcode;
          selectedRecord.nregioncodetemp = selectedRecord.nregioncode;
        }
        else {
          selectedRecord.sflatnotemp = "";
          selectedRecord.shousenotemp = "";
          selectedRecord.spostalcodetemp = "";
          selectedRecord.sstreettemp = "";
          // selectedRecord.ncitycodetemp = "";
          selectedRecord.scitynametemp = "";
          selectedRecord.ndistrictcodetemp = "";
          selectedRecord.nregioncodetemp = "";
        }
      }
    } else {
      if (event.target.name === "sphoneno" || event.target.name === "smobileno") {
        if (event.target.value !== "") {
          event.target.value = validatePhoneNumber(event.target.value);
          selectedRecord[event.target.name] =
            event.target.value !== ""
              ? event.target.value
              : selectedRecord[event.target.name];
        } else {
          selectedRecord[event.target.name] = event.target.value;
        }
      } else {
        selectedRecord[event.target.name] = event.target.value;
        if (selectedRecord.nneedcurrentaddress === 3) {
          selectedRecord.sflatnotemp = selectedRecord.sflatno;
          selectedRecord.shousenotemp = selectedRecord.shouseno;
          selectedRecord.spostalcodetemp = selectedRecord.spostalcode;
          selectedRecord.sstreettemp = selectedRecord.sstreet;
          //  selectedRecord.ncitycodetemp = selectedRecord.ncitycode;
          selectedRecord.scitynametemp = selectedRecord.scityname;
          selectedRecord.ndistrictcodetemp = selectedRecord.ndistrictcode;
          selectedRecord.nregioncodetemp = selectedRecord.nregioncode;
        }
      }
    }
    this.setState({ selectedRecord });
  };

  handleDateChange = (dateName, dateValue) => {
    const { selectedRecord } = this.state;
    selectedRecord[dateName] = dateValue;
    const age = ageCalculate(dateValue);
    selectedRecord["sage"] = age;
    //   if(dateName==="ToDay"){
    //     this.props.getDateChangeServices({
    //       userinfo: this.props.Login.userInfo,
    //       date: rearrangeDateFormat(this.props.Login.userInfo,selectedRecord["ToDay"])
    // })
    //}
    this.setState({ selectedRecord });
  };


  onSaveGetClick = (saveType) => {
    if (saveType === 7) {
      let inputData = [];
      inputData["userinfo"] = this.props.Login.userInfo;
      const inputParam = {
        classUrl: "patient",
        methodUrl: "ByPatient",
        inputData: inputData,
        openAlertModal: true,
        loadEsign: false,

      };
      const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: {
          openAlertModal: true,
          openSolidAdvFilter: true,
          openModal: true,
          inputData,
          operation: "create",
          screenData: { inputParam }
        },
      };
      this.props.updateStore(updateInfo);
    }
    else {
      let selectedRecord = [];
      let inputData = [];
      inputData["userinfo"] = this.props.Login.userInfo;
      let isFilterEmpty = checkFilterIsEmptyQueryBuilder(this.state.selectedRecord['jsonTree']);
      if (isFilterEmpty) {
        inputData["filterquery"] = this.state.selectedRecord['filterquery'] !== undefined ? removeSpaceFromFirst(this.state.selectedRecord['filterquery'], '') : removeSpaceFromFirst(this.props.Login.filterquery, '');
        //inputData["formdate"] = this.state.selectedRecord['fromdate']!==undefined ?  formatInputDateWithoutT(this.state.selectedRecord["fromdate"]) :formatInputDateWithoutT( rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate));
        // inputData["todate"] = this.state.selectedRecord['ToDay']!==undefined ?  formatInputDateWithoutT(this.state.selectedRecord["ToDay"]):formatInputDateWithoutT(rearrangeDateFormat(this.props.Login.userInfo,this.props.Login.masterData.ToDate));
        inputData["patientfilter"] = { patientfilter: this.state.selectedRecord, nfilterstatus: 4, patient: "Filter", sfilterstatus: "Recent" }
        if (inputData["filterquery"] !== undefined && !inputData["filterquery"].includes('Invalid date')) {
          this.searchRef.current.value = "";
          let paramFlag = true;
          const inputParam = {
            classUrl: "patient",
            methodUrl: "ByPatient",
            inputData: inputData,
            searchRef: this.searchRef,
            isClearSearch: this.props.Login.isClearSearch,
            displayname: "AdvanceFilter",
          };
          const QueryName = this.props.Login.QueryName !== undefined ? this.props.Login.QueryName : this.props.Login.masterData.SelectedPatientFilterType.spatientfiltername;
          const masterData = { ...this.props.Login.masterData, QueryName: QueryName };
          const SelectedPatientCaseType = this.state.selectedRecord.npatientcasetypecode !== undefined ? this.state.selectedRecord.npatientcasetypecode.item : this.props.Login.masterData.SelectedPatientCaseType;
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
                screenData: { inputParam, masterData }
              },
            };
            this.props.updateStore(updateInfo);
          }

          this.props.getPatientDetailsByFilterQuery(inputParam, masterData, SelectedPatientCaseType);
        } else {
          toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUES" }));
        }
      } else {
        toast.warn(this.props.intl.formatMessage({ id: "IDS_PROVIDEVALUESFORINPUTS" }));
      }
    }

  };

  handleSaveFilterClick = () => {
    let inputData = {};
    let methodUrl = "";
    const selectedRecord = this.state.selectedRecord;
    let isFilterEmpty = checkFilterIsEmptyQueryBuilder(this.state.selectedRecord['jsonTree']);
    if (isFilterEmpty) {
      if (this.state.selectedRecord.filterquery !== undefined) {

        if (this.state.selectedRecord.QueryName === undefined) {
          this.state.selectedRecord = { ...this.state.selectedRecord, "QueryName": this.props.Login.QueryName };
        }
        if (this.state.selectedRecord.QueryName !== "") {
          inputData["userinfo"] = this.props.Login.userInfo;
          inputData["patientfilter"] = {
            "tree": QbUtils.getTree(this.state.selectedRecord.tree),
            "filterquery": this.state.selectedRecord.filterquery
          }
          //  inputData["patient"]=this.state.selectedRecord.QueryName;
          inputData["patient"] = this.state.selectedRecord.QueryName !== undefined ? this.state.selectedRecord.QueryName : this.state.selectedRecord.npatientfiltercode.label;
          inputData["nfilterstatus"] = 3
          inputData["sfilterstatus"] = "Saved"
          methodUrl = "FilterQuery"
          const inputParam = {
            methodUrl: methodUrl,
            classUrl: this.props.Login.inputParam.classUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData,
            operation: this.props.Login.operation,
          }
          const masterData = { ...this.state.selectedRecord, ...this.props.Login.masterData }
          this.props.filtercomboService({
            displayname: "onSubmit",
            inputParam, masterData
          });
        }
        else {
          toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTERQUERYNAME" }));
        }
      } else {
        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTALLVALUES" }));
      }
    } else {
      toast.warn(this.props.intl.formatMessage({ id: "IDS_PROVIDEVALUESFORINPUTS" }));

    }
  }

  onSaveClick = (saveType, formRef) => {
    if (this.state.selectedRecord['semail'] && this.state.selectedRecord['semail'] !== "" && this.state.selectedRecord['semail'] !== "null" ? validateEmail(this.state.selectedRecord["semail"]) : true) {
      let patientData = [];
      patientData["userinfo"] = this.props.Login.userInfo;

      let postParam = {
        inputListName: "PatientList",
        selectedObject: "SelectedPatient",
        primaryKeyField: "spatientid",
      };



      if (this.props.Login.operation === "update") {
        postParam["primaryKeyValue"] =
          this.props.Login.masterData.SelectedPatient.spatientid;
        patientData["patient"] = {
          spatientid: this.props.Login.masterData.SelectedPatient.spatientid,
          sfirstname: this.state.selectedRecord.sfirstname,
          slastname: this.state.selectedRecord.slastname,
          sfathername: this.state.selectedRecord.sfathername,
          ddob: formatInputDate(this.state.selectedRecord["ddob"], false),
          sage: this.state.selectedRecord.sage,
          ngendercode: this.state.selectedRecord.ngendercode.value,
          ncitycode: this.state.selectedRecord.ncitycode.value,
          ncountrycode: this.state.selectedRecord.ncountrycode.value,
          saddress: this.state.selectedRecord.saddress,
          sdistrict: this.state.selectedRecord.sdistrict,
          spostalcode: this.state.selectedRecord.spostalcode,
          sphoneno: this.state.selectedRecord.sphoneno,
          smobileno: this.state.selectedRecord.smobileno,
          scityname: this.state.selectedRecord.scityname,
          scitynametemp: this.state.selectedRecord.scitynametemp,
          semail: this.state.selectedRecord.semail,
          spassportno: this.state.selectedRecord.spassportno,
          srefid: this.state.selectedRecord.srefid,
          sexternalid: this.state.selectedRecord.sexternalid,
          sstreet: this.state.selectedRecord.sstreet,
          sstreettemp: this.state.selectedRecord.nneedcurrentaddress === 3 ? this.state.selectedRecord.sstreet : this.state.selectedRecord.sstreettemp,
          shouseno: this.state.selectedRecord.shouseno,
          shousenotemp: this.state.selectedRecord.nneedcurrentaddress === 3 ? this.state.selectedRecord.shouseno : this.state.selectedRecord.shousenotemp,
          sflatno: this.state.selectedRecord.sflatno,
          sflatnotemp: this.state.selectedRecord.nneedcurrentaddress === 3 ? this.state.selectedRecord.sflatno : this.state.selectedRecord.sflatnotemp,
          nneedcurrentaddress: this.state.selectedRecord.nneedcurrentaddress,
          nneedmigrant: this.state.selectedRecord.nneedmigrant,
          spostalcodetemp: this.state.selectedRecord.nneedcurrentaddress === 3 ? this.state.selectedRecord.spostalcode : this.state.selectedRecord.spostalcodetemp,
          sgendername: this.state.selectedRecord.ngendercode.label,
          spatientcode: this.state.selectedRecord.spatientcode,
        };

      } else {
        patientData["patient"] = {
          nsitecode: this.props.Login.userInfo.nmastersitecode,
        };

        this.patientFieldList.map((item) => {
          return (patientData["patient"][item] = this.state.selectedRecord[item] == "" || this.state.selectedRecord[item] == undefined ?
            undefined : this.state.selectedRecord[item]);
        });
      }

      patientData["patient"]["ngendercode"] = this.state.selectedRecord["ngendercode"] ? this.state.selectedRecord["ngendercode"].value
        : transactionStatus.NA;

      patientData["patient"]["ncitycode"] = this.state.selectedRecord["ncitycode"] ? this.state.selectedRecord["ncitycode"].value
        : transactionStatus.NA;

      patientData["patient"]["ncitycodetemp"] = this.state.selectedRecord.nneedcurrentaddress === 3 ? this.state.selectedRecord["ncitycode"] ? this.state.selectedRecord["ncitycode"].value
        : transactionStatus.NA : this.state.selectedRecord["ncitycodetemp"] ? this.state.selectedRecord["ncitycodetemp"].value
        : transactionStatus.NA;

      patientData["patient"]["ncountrycode"] = this.state.selectedRecord["ncountrycode"] ? this.state.selectedRecord["ncountrycode"].value
        : transactionStatus.NA;

      patientData["patient"]["ndistrictcode"] = this.state.selectedRecord["ndistrictcode"] ? this.state.selectedRecord["ndistrictcode"].value
        : transactionStatus.NA;

      patientData["patient"]["ndistrictcodetemp"] = this.state.selectedRecord.nneedcurrentaddress === 3 ? this.state.selectedRecord["ndistrictcode"] ? this.state.selectedRecord["ndistrictcode"].value
        : transactionStatus.NA : this.state.selectedRecord["ndistrictcodetemp"] ? this.state.selectedRecord["ndistrictcodetemp"].value
        : transactionStatus.NA;

      patientData["patient"]["nregioncode"] = this.state.selectedRecord["nregioncode"] ? this.state.selectedRecord["nregioncode"].value
        : transactionStatus.NA;

      patientData["patient"]["nregioncodetemp"] = this.state.selectedRecord.nneedcurrentaddress === 3 ? this.state.selectedRecord["nregioncode"] ? this.state.selectedRecord["nregioncode"].value
        : transactionStatus.NA : this.state.selectedRecord["nregioncodetemp"] ? this.state.selectedRecord["nregioncodetemp"].value
        : transactionStatus.NA;

      // if (patientData["patient"]["ddob"] !== undefined
      //     && patientData["patient"]["ddob"] !== null && patientData["patient"]["ddob"] !== "") {
      //     patientData["patient"]["ddob"] = formatInputDate(patientData["patient"]["ddob"],false);

      // }
      if (this.state.selectedRecord["ddob"]) {
        if (this.props.Login.operation === "create") {
          patientData["patient"]["sdob"] = formatInputDate(this.state.selectedRecord["ddob"], false);
        }
        else {
          patientData["patient"]["sdob"] = this.state.selectedRecord["sdob"];
        }
      }
      patientData["patient"]["currentdate"] = formatInputDate(new Date(), true);

      let clearSelectedRecordField = [
        { "idsName": "IDS_FIRSTNAME", "dataField": "sfirstname", "width": "200px", "controlType": "textbox", "isClearField": true },
        { "idsName": "IDS_LASTNAME", "dataField": "slastname", "width": "200px", "controlType": "textbox", "isClearField": true },
        //ATE234 Janakumar ALPDJ21-55 Flow Validation Issues
        { "idsName": "IDS_DATEOFBIRTH", "dataField": "ddob", "width": "200px", "controlType": "selectbox", "isClearField": true },
        { "idsName": "IDS_FATHERNAME", "dataField": "sfathername", "width": "200px", "controlType": "textbox", "isClearField": true },
        { "idsName": "IDS_AGE", "dataField": "sage", "width": "200px", "controlType": "textbox", "isClearField": true },
        { "idsName": "IDS_CITY", "dataField": "scityname", "width": "200px", "controlType": "textbox", "isClearField": true },
        { "idsName": "IDS_POSTALCODE", "dataField": "spostalcode", "width": "200px", "controlType": "textbox", "isClearField": true },
        { "idsName": "IDS_STREET", "dataField": "sstreet", "width": "200px", "controlType": "textbox", "isClearField": true },
        { "idsName": "IDS_HOUSENO", "dataField": "shouseno", "width": "200px", "controlType": "textbox", "isClearField": true },
        { "idsName": "IDS_FLATNO", "dataField": "sflatno", "width": "200px", "controlType": "textbox", "isClearField": true },
        { "idsName": "IDS_CITY", "dataField": "scitynametemp", "width": "200px", "controlType": "textbox", "isClearField": true },
        { "idsName": "IDS_POSTALCODE", "dataField": "spostalcodetemp", "width": "200px", "controlType": "textbox", "isClearField": true },
        { "idsName": "IDS_STREET", "dataField": "sstreettemp", "width": "200px", "controlType": "textbox", "isClearField": true },
        { "idsName": "IDS_HOUSENO", "dataField": "shousenotemp", "width": "200px", "controlType": "textbox", "isClearField": true },
        { "idsName": "IDS_FLATNO", "dataField": "sflatnotemp", "width": "200px", "controlType": "textbox", "isClearField": true },
        { "idsName": "IDS_MIGRANT", "dataField": "nneedmigrant", "width": "100px", "isClearField": true, "preSetValue": 4 },
        //ALPD-5249 Patient Master - Save&Continue-->region & district names are not cleared
        //{ "idsName": "IDS_ADDRESSSTATUS", "dataField": "nneedcurrentaddress", "width": "100px","isClearField":true,"preSetValue":4},
        { "idsName": "IDS_PHONENO", "dataField": "sphoneno", "width": "200px", "controlType": "textbox", "isClearField": true },
        { "idsName": "IDS_MOBILENO", "dataField": "smobileno", "width": "200px", "controlType": "textbox", "isClearField": true },
        { "idsName": "IDS_EMAIL", "dataField": "semail", "width": "200px", "controlType": "textbox", "isClearField": true },
        { "idsName": "IDS_PASSPORTNO", "dataField": "spassportno", "width": "200px", "controlType": "textbox", "isClearField": true },
        { "idsName": "IDS_REFERENCEID", "dataField": "srefid", "width": "200px", "controlType": "textbox", "isClearField": true },
        { "idsName": "IDS_EXTERNALID", "dataField": "sexternalid", "width": "200px", "controlType": "textbox", "isClearField": true },
      ]

      const inputParam = {
        classUrl: "patient",
        methodUrl: "Patient",
        inputData: patientData,
        operation: this.props.Login.operation,
        saveType,
        formRef,
        postParam,
        searchRef: this.searchRef,
        isClearSearch: this.props.Login.isClearSearch,
        selectedRecord: { ...this.state.selectedRecord }
      };
      const masterData = this.props.Login.masterData;
      // if (this.props.Login.operation === "update") {
      // this.updatePatient(inputParam, this.props.Login.masterData, this.props.Login.ncontrolCode);
      // return;
      // }
      if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
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
        this.props.crudMaster(inputParam, masterData, "openModal", "", "", clearSelectedRecordField);
      }
    } else {
      toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTERVALIDEMAIL" }));
    }
  };

  deletePatient = (methodUrl, selectedPatient, operation, ncontrolCode) => {
    let inputData = [];
    const postParam = {
      inputListName: "PatientList",
      selectedObject: "SelectedPatient",
      primaryKeyField: "spatientid",
      primaryKeyValue: selectedPatient.spatientid,
      fetchUrl: "patient/getPatient",
      fecthInputObject: { userinfo: this.props.Login.userInfo, currentdate: formatInputDate(new Date(), true) },
    };
    inputData["userinfo"] = this.props.Login.userInfo;
    inputData["patient"] = selectedPatient;
    inputData["patient"]["currentdate"] = formatInputDate(new Date(), true)
    const inputParam = {
      classUrl: this.props.Login.inputParam.classUrl,
      methodUrl,
      postParam,
      inputData,
      operation,
      isClearSearch: this.props.Login.isClearSearch,
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
          screenName: "IDS_PATIENTMASTER",
          operation,
        },
      };
      this.props.updateStore(updateInfo);
    } else {
      this.props.crudMaster(inputParam, masterData, "openModal");
    }
  };

  validateEsign = () => {
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
    this.props.validateEsignCredential(inputParam, "openModal");
  };

  handleExpandChange = (row, dataState) => {

    //Old
    // let childListMap3 = new Map();
    // let keylst = this.props.Login.masterData.patientHistorydetails.map(key => key.npreregno);
    // // let keylst1=[]  ;
    // keylst.map((key, i) => {
    //   childListMap3.set(parseInt(key),
    //     this.props.Login.masterData.patientHistorydetails);
    // })

    // this.setState({ childListMap3 })

    let childListMap3 = new Map();
    let keylst = Object.keys(this.props.Login.masterData.patientHistorydetails);
    let valueLst = Object.values(this.props.Login.masterData.patientHistorydetails);
    // let keylst1=[]  ;
    keylst.map((key, i) => {
      childListMap3.set(parseInt(key),
        valueLst[i]);
    })

    this.setState({ childListMap3 })

    // this.props.getTestParameter({
    //   ...viewParam,
    //   dataState,
    //   primaryKeyValue: row["dataItem"][viewParam.primaryKeyField],
    //   viewRow: row["dataItem"],
    // });

  };

  reloadData = () => {
    //ALPD-4803 done by Dhanushya RI,To check searchref key is present or not
    if (this.searchRef && this.searchRef.current) {
      this.searchRef.current.value = "";
    }
    let inputData = [];
    inputData["userinfo"] = this.props.Login.userInfo;
    inputData["date"] = this.state.selectedRecord['fromdate'] !== undefined ? convertDateValuetoString(this.state.selectedRecord["fromdate"], this.state.selectedRecord["ToDay"], this.props.Login.userInfo, true) :
      convertDateValuetoString(rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate), rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.ToDate), this.props.Login.userInfo, true);
    //   inputData["formdate"] = this.state.selectedRecord['fromdate'] !== undefined ? formatInputDateWithoutT(this.state.selectedRecord["fromdate"]) : formatInputDateWithoutT(rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate));
    // inputData["todate"] = this.state.selectedRecord['ToDay'] !== undefined ? formatInputDateWithoutT(this.state.selectedRecord["ToDay"]) : formatInputDateWithoutT(rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.ToDate));
    inputData["casetype"] = this.state.selectedRecord.npatientcasetypecode !== undefined ? this.state.selectedRecord.npatientcasetypecode.label : this.props.Login.masterData.SelectedPatientCaseType.spatientcasetypename;
    const inputParam = {
      inputData: inputData,
      classUrl: "patient",
      methodUrl: "Patient",
      displayname: "Filter",
      userInfo: this.props.Login.userInfo,
      isClearSearch: this.props.Login.isClearSearch,
    };

    const masterData = this.props.Login.masterData;
    const SelectedPatientCaseType = this.state.selectedRecord.npatientcasetypecode !== undefined ? this.state.selectedRecord.npatientcasetypecode.item : this.props.Login.masterData.SelectedPatientCaseType;

    this.props.getPatientDetailsByFilterQuery(inputParam, masterData, SelectedPatientCaseType);
  };
}
export default connect(mapStateToProps, {
  callService,
  crudMaster,
  validateEsignCredential,
  updateStore,
  getPatientDetail,
  getPatientComboService,
  filterColumnData,
  getTestParameter,
  getPatientReport, getPatientDetailsByFilterQuery, getDistrictComboServices, getCityComboServices, filtercomboService, getFilterStatusCombo, getPatientHistory, getpatientReportHistoryInfo, viewAttachment
})(injectIntl(PatientMaster));
