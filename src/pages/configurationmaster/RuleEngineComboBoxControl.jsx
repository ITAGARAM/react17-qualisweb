
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { Row, Col } from 'react-bootstrap';
import {
    callService, crudMaster, validateEsignCredential, updateStore, getSQLQueryDetail,
    getSQLQueryComboService, filterColumnData, comboChangeQueryType, executeUserQuery, comboColumnValues
} from '../../actions';
import rsapi from '../../rsapi';
import { toast } from 'react-toastify';
import { constructOptionList } from '../../components/CommonScript';

class ComboBoxControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //data: items.slice(),
            ComboVal: '', dataarr: [], Fieldarr: [], FieldColValue: [],
            ChartTempType: 0, DBType: [], SqlQuery: [], QueryCode: 0

        }
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        const url = "sqlquery/getColumnValues";
        rsapi().post(url, { "tablename": this.props.tableName, 
                            "fieldname": this.props.fieldName, 
                            "displayparam": this.props.displayParam })
        .then(response => {
                    this.setState({ FieldColValue: constructOptionList(response.data[1], this.props.fieldName,
                        this.props.displayParam, undefined, undefined, undefined).get("OptionList") });         
        })
        .catch(error => {

            if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          dispatch({
            type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                toast.error(error.message);
            }
            else {
                toast.warn(error.response.data);
            }
        })
    }

    onChange(event) {
        if (event.label != null) {
            this.setState({ComboVal: event.label});
            this.props.onvaluechange(event.value)   //event.target.value);

        }
    }



    render() {
        return (
            <Row>
                <Col lg={12}>
                    <FormSelectSearch
                        formLabel={this.props.intl.formatMessage({ id: this.props.labelName })}
                        isSearchable={true}
                        name={this.props.fieldName}
                        placeholder="Please Select..."
                        isMandatory={true}
                        options={this.state.FieldColValue || []}
                        optionId={this.props.fieldName}
                        optionValue={this.props.displayParam.length > 0 ? this.props.displayParam : this.props.fieldName}

                        showOption={true}
                        onChange={this.onChange.bind(this)}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}

                    />
                </Col>
            </Row>



        );
    }
}
const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}
export default connect(mapStateToProps, {
    callService, crudMaster, updateStore, filterColumnData, validateEsignCredential, getSQLQueryDetail, getSQLQueryComboService, comboChangeQueryType, executeUserQuery, comboColumnValues
})(injectIntl(ComboBoxControl));