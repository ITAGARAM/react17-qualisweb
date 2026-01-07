import React, { Component } from "react";
import merge from "lodash/merge";
import {
  Query,
  Builder,
  BasicConfig, BasicFuncs,
  Utils as QbUtils,
} from "@react-awesome-query-builder/ui";
import "@react-awesome-query-builder/ui/css/styles.css";
import { FormattedMessage, injectIntl } from "react-intl";
import { Pager } from "@progress/kendo-react-data-tools";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import { LocalizationProvider } from "@progress/kendo-react-intl";
const { checkTree, loadTree, uuid } = QbUtils;

const InitialConfig = BasicConfig;

const conjunctions = {
  AND: InitialConfig.conjunctions.AND,
  OR: InitialConfig.conjunctions.OR,
};

// Object.keys(conjunctions).map(x=>{
//   conjunctions[x]['label']="IDS_"+conjunctions[x]['label'].toUpperCase()
// })

const operators1 = {
  ...InitialConfig.operators
}

Object.keys(operators1).map(x => {
  operators1[x]['label'] = "IDS_" + operators1[x]['label'].toUpperCase()
})
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
    //  antd:messages['en-US']

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
  // removeRuleConfirmOptions: {
  //   title: "Are you sure delete this rule?",
  //   okText: "Yes",
  //   okType: "danger",
  // },
  // removeGroupConfirmOptions: {
  //   title: "Are you sure delete this group?",
  //   okText: "Yes",
  //   okType: "danger",
  // },
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
  // canReorder: false,
  // canRegroup: false,
  // showNot: false,
  // showLabels: true,
  maxNesting: 5,
  canLeaveEmptyGroup: true,
  shouldCreateEmptyGroup: false,
  showErrorMessage: true,
  customFieldSelectProps: {
    showSearch: true
  }, //after deletion

  // renderField: (props) => <FieldCascader {...props} />,
  // renderOperator: (props) => <FieldDropdown {...props} />,
  // renderFunc: (props) => <FieldSelect {...props} />,
};

const funcs = {
  ...BasicFuncs
};
// delete funcs.valueSourcesInfo.field
const config = {
  ...InitialConfig, conjunctions,
  operators,
  widgets,
  types,
  settings,
  funcs,
  fields: {}

};

let functionValues = [];

Object.keys(config['funcs']).map(x => {
  functionValues.push(config['funcs'][x]['label'].toUpperCase());
  config['funcs'][x]['label'] = "IDS_" + config['funcs'][x]['label'].toUpperCase()
})

class FilterQueryBuilder extends Component {
  constructor(props) {

    super(props);
    Object.keys(config.operators).map(x => {
  
        if(x==='select_any_in'||x==='select_not_any_in'){
            delete config.operators[x];
        }else{
        config.operators[x]['label'] = this.props.intl.formatMessage({ id: "IDS_" + config.operators[x]['labelForFormat'].toUpperCase() }) 
      } 
      //  return  {[x]:config.operators[x]};
    })

    Object.keys(config['funcs']).map((x, i) => {
      config['funcs'][x]['label'] = this.props.intl.formatMessage({ id: "IDS_" + functionValues[i] })
      // config['funcs'][x]['label'] = this.props.intl.formatMessage({ id: config['funcs'][x]['label'] })
    })

    this.state = {
      config: {
        ...config, settings: {
          ...config.settings, notLabel: this.props.intl.formatMessage({ id: "IDS_NOT" }),
          valueLabel: this.props.intl.formatMessage({ id: "IDS_VALUE" }),
          valuePlaceholder: this.props.intl.formatMessage({ id: "IDS_VALUE" }),
          operatorLabel: this.props.intl.formatMessage({ id: "IDS_OPERATOR" }),
          fieldPlaceholder: this.props.intl.formatMessage({ id: "IDS_SELECTFIELD" }),
          operatorPlaceholder: this.props.intl.formatMessage({ id: "IDS_SELECTOPERATOR" }),
          // deleteLabel: this.props.intl.formatMessage({id: "" }),
          addGroupLabel: this.props.intl.formatMessage({ id: "IDS_ADDGROUP" }),
          addRuleLabel: this.props.intl.formatMessage({ id: "IDS_ADDRULE" }),
          addSubRuleLabel: this.props.intl.formatMessage({ id: "IDS_ADDSUBRULE" }),
          //delGroupLabel: this.props.intl.formatMessage({id: "" }),
          valueSourcesPopupTitle: this.props.intl.formatMessage({ id: "IDS_SELECTVALUESOURCE" }),
          funcLabel: this.props.intl.formatMessage({ id: "IDS_FUNCTION" }),
          valueSourcesInfo: {
            field: { label: this.props.intl.formatMessage({ id: "IDS_FIELD" }), widget: 'field' },
            func: { label: this.props.intl.formatMessage({ id: "IDS_FUNCTION" }), widget: 'func' },
            value: { label: this.props.intl.formatMessage({ id: "IDS_VALUE" }) }
          },

          //delete alert
          // removeRuleConfirmOptions: {
          //   title: this.props.intl.formatMessage({ id: "IDS_AREYOUSUREDELETETHISRULE" }),
          //   okText: this.props.intl.formatMessage({ id: "IDS_YES" }),
          //   okType: "danger",
          // },
          // removeGroupConfirmOptions: {
          //   title: this.props.intl.formatMessage({ id: "IDS_AREYOUSUREDELETETHISGROUP" }),
          //   okText: this.props.intl.formatMessage({ id: "IDS_YES" }),
          //   okType: "danger",
          // }


        }, conjunctions: {
          AND: { ...config['conjunctions']['AND'], label: this.props.intl.formatMessage({ id: "IDS_AND" }) },
          OR: { ...config['conjunctions']['OR'], label: this.props.intl.formatMessage({ id: "IDS_OR" }) }
        },
        //  operators: { ...Object.keys(config.operators).map(x =>) }
        fields: this.props.fields//,settings:{...config.settings,notLabel:this.props.intl.formatMessage({id: "NOT"})}
      }
    }
  }


  componentDidUpdate(prevops) {
    if(this.props.isRender){
    if (this.props.fields !== this.state.config.fields) {      
      let config = this.state.config;
      config['fields'] = this.props.fields
      this.setState({ config: config })
    }
  }
  }

  render() {
    const emptyInitValue = { "id": uuid(), "type": "group" };
    let conf = this.props.config ? this.props.config : this.state.config
    let tree = checkTree(loadTree(emptyInitValue), conf)
    return (
      <React.Fragment>

        <div >
          <Query
            {...this.state.config}
            value={this.props.tree || tree}
            // value={checkTree(loadTree(tree),conf)}
            onChange={this.props.onChange}
            renderBuilder={this.renderBuilder}

          />
          {!this.props.static  ?
            <div className="d-flex justify-content-end mt-3">
              <Button className="btn-user btn-primary-blue" onClick={() => this.props.handleExecuteClick()}>
                <FontAwesomeIcon icon={faCalculator} /> { }
                <FormattedMessage id='IDS_EXECUTE' defaultMessage='Execute' />
              </Button>
            </div>
            : ""}
          {!this.props.static ?
            <hr /> : ""}
          {!this.props.static ?
            <LocalizationProvider language={this.props.userInfo.slanguagetypecode}>
              <Grid
                style={{
                  maxHeight: "400px",
                }}
                onRowClick={this.props.onRowClick}
                data={this.props.filterData.slice(this.props.skip, this.props.skip + this.props.take)}
              >
                {this.props.gridColumns.map(x => {

                  return <GridColumn field={x.field} title={x.title} width={x.width} />

                })}

                {/* <GridColumn field="UnitPrice" title="Price" />
              <GridColumn field="Discontinued" title="Discontinued" /> */}
              </Grid>
            </LocalizationProvider>
            : ""}
          {!this.props.static ?
            <hr />
            : ""}
          {!this.props.static ?
            <LocalizationProvider language={this.props.userInfo.slanguagetypecode}>
              <Pager
                skip={this.props.skip}
                take={this.props.take}
                type="input"
                previousNext={true}
                total={this.props.filterData.length}
                onPageChange={this.props.handlePageChange}
              />
            </LocalizationProvider>
            : ""}
          {/* {this.props.slideResult && this.props.slideResult.length > 0 ?
          <AddFilteredPatient
            slideList={this.props.slideList}
            slideResult={this.props.slideResult}
            controlMap={this.props.controlMap}
            dataState={this.props.dataState}
            dataStateChange={this.props.dataStateChange}
          />

          : ""} */}
        </div>
      </React.Fragment>

    );
  }

  renderBuilder = (props) => (
    <div className="query-builder-wrap kendo-theme">
      <Builder {...props}
      />
    </div>

  );
  // onChange = (immutableTree, config) => {
  //   this.setState({ tree: immutableTree, config: config });

  //   const jsonTree = QbUtils.getTree(immutableTree);
  //   console.log(jsonTree);
  // };

}
export default injectIntl(FilterQueryBuilder);
