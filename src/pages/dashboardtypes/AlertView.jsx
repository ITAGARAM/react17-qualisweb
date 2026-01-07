import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import {
    callService, crudMaster, updateStore, validateEsignCredential, filterColumnData,
    selectedAlertView
} from '../../actions';
import { sortData } from '../../components/CommonScript';
import { process } from '@progress/kendo-data-query';
import ListMaster from '../../components/list-master/list-master.component';
import DataGrid from '../../components/data-grid/data-grid.component';
import { ProductList } from '../../pages/product/product.styled';
import { Attachments } from '../../components/dropzone/dropzone.styles';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class AlertView extends React.Component {
    constructor(props) {
        super(props)

        this.formRef = React.createRef();
        this.extractedColumnList = [];


        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5
        };
        this.state = {
            data: [],
            dataResult: [],
            dataState: dataState,
            userRoleControlRights: [], controlMap: new Map(),
            sidebarview: false
        }
        this.searchRef = React.createRef();
    }
    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })          
    }

    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.props.Login.masterData.selectedAlertView, event.data),
            dataState: event.data
        });
    }

    render() {
        
        const filterParam = {
            inputListName: "AlertView", selectedObject: "selectedAlertView", primaryKeyField: "nsqlquerycode",
            fetchUrl: "alertview/getSelectedAlertView", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData,
            searchFieldList: ["ssqlqueryname"]
        };

        const gridColumnList = [];
        if (this.props.Login.masterData && this.props.Login.masterData.selectedAlertView !== undefined
             && this.props.Login.masterData.selectedAlertView.length > 0) 
        {
            Object.keys(this.props.Login.masterData.selectedAlertView[0]).forEach(key => {
                gridColumnList.push(
                    {
                     "idsName": this.props.intl.formatMessage({id: key}), 
                     "dataField": key, 
                     "width": "200px",
                    //  "isIdsField":key.includes("STATUS")
                    }
                );
            });
        }
        return (
            <>
                <div className="client-listing-wrap mtop-4">
                    <Row noGutters={true}>
                    <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                        <ListMaster
                                screenName={this.props.intl.formatMessage({ id: "IDS_ALERTVIEW" })}
                                masterData={this.props.Login.masterData || []}
                                userInfo={this.props.Login.userInfo}
                                masterList={sortData((this.props.Login.masterData.searchedData || this.props.Login.masterData.AlertView ) || [], 'descending', 'nalertrightscode')}
                                getMasterDetail={(AlertView) => this.props.selectedAlertView(AlertView, this.props.Login.userInfo, this.props.Login.masterData, this.state.dataState)}
                                selectedMaster={this.props.Login.masterData.SelectedAlert}
                                primaryKeyField="nsqlquerycode"
                                mainField="ssqlqueryname"
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                userRoleControlRights={this.state.userRoleControlRights}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData}
                                hidePaging={false}
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
                            <ProductList className="panel-main-content">
                                {/* {this.props.Login.masterData.AlertView && this.props.Login.masterData.AlertView.length > 0 && this.props.Login.masterData.selectedAlertView ? */}
                                    <Card className="border-0">
                                        <Card.Header>
                                            <Card.Title className="product-title-main">{this.props.Login.masterData.sqlQueryName}</Card.Title>
                                        </Card.Header>
                                        <Card.Body>

                                            {this.props.Login.masterData.selectedAlertView  && this.props.Login.masterData.selectedAlertView.length > 0 ?
                                            <DataGrid primaryKeyField={"nsqlquerycode"}
                                                data={this.props.Login.masterData.selectedAlertView}
                                                dataResult={this.state.dataResult}
                                                dataState={this.state.dataState}
                                                dataStateChange={this.dataStateChange}
                                                extractedColumnList={gridColumnList}
                                                controlMap={this.state.controlMap}
                                                userRoleControlRights={this.state.userRoleControlRights}
                                                userInfo={this.props.Login.userInfo}
                                                pageable={true}
                                                scrollable={"auto"}
                                                isComponent={false}
                                                isActionRequired={false}
                                                isToolBarRequired={false}
                                                selectedId={this.props.Login.selectedId}
                                                name="IDS_ALERTVIEW"
                                            /> : 
                                            <Attachments className = "norecordtxt">
                                                {this.props.intl.formatMessage({id:"IDS_NORECORDSAVAILABLE"})}
                                            </Attachments>
                                            }
                                        </Card.Body>
                                    </Card> 
                                    {/* : ""} */}
                            </ProductList>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }

    reloadData = () => {
        this.searchRef.current.value = "";
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: "alertview",
            methodUrl: "AlertView",
            displayName: "IDS_ALERTVIEW",
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
    }

    componentDidUpdate(previousProps) {
        let isStateChanged =false;
        let dataState = this.state.dataState;
        let dataResult = this.state.dataResult;
        if (this.props.Login.dataState && this.props.Login.dataState !== previousProps.Login.dataState) {
            dataState = this.props.Login.dataState;
            isStateChanged = true;
        }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {   
             dataResult =  process(this.props.Login.masterData.selectedAlertView || [], dataState);
             isStateChanged = true;
        }
      
        if (isStateChanged){
            this.setState({dataResult,  dataState});
        }
    }
}
export default connect(mapStateToProps,
    {
        callService, crudMaster, selectedAlertView, updateStore,
        validateEsignCredential, filterColumnData
    })(injectIntl(AlertView));