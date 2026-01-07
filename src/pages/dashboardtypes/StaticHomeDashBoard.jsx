import React from 'react';
import { Row, Col, Button, Modal, Card, Accordion, Media, ListGroup, useAccordionToggle } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faSave } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
    callService, crudMaster, getHomeDashBoard,
    updateStore, validateEsignCredential, getStaticDashBoard, getSelectionStaticDashBoard
} from '../../actions';
import { process } from '@progress/kendo-data-query';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import DashBoardDynamicControls from './DashBoardDynamicControls';
import { ModalInner } from "../../components/App.styles";
import DataGrid from '../../components/data-grid/data-grid.component';
import PieChart from '../dashboardtypes/charts/PieChart';
import { AtAccordion } from '../../components/custom-accordion/custom-accordion.styles';
import { chartType, designComponents } from '../../components/Enumeration';
import { ListMasterWrapper } from '../../components/list-master/list-master.styles';
import AreaChart from './charts/AreaChart';
import BubbleChart from './charts/BubbleChart';
import { ListView } from '@progress/kendo-react-listview';
import { ClientList } from '../../components/App.styles';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { AtTableWrap } from '../../components/data-grid/data-grid.styles';
import AccordionContext from "react-bootstrap/AccordionContext";
import { convertDateValuetoString, formatInputDate, rearrangeDateFormat } from '../../components/CommonScript';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';

const CustomToggle = ({ children, eventKey }) => {
    const currentEventKey = React.useContext(AccordionContext);
    const isCurrentEventKey = currentEventKey === eventKey;
    const decoratedOnClick = useAccordionToggle(eventKey,
        () => isCurrentEventKey ? "" : children.props.onExpandCall()
    );


    return (
        <div
            className="d-flex justify-content-between"
            onClick={decoratedOnClick}
        >
            {children}
            {isCurrentEventKey ?
                <FontAwesomeIcon icon={faChevronUp} />
                : <FontAwesomeIcon icon={faChevronDown}
                />}
        </div>
    );
}

const mapStateToProps = state => {
    return ({ Login: state.Login })
}


class StaticHomeDashBoard extends React.Component {
    constructor(props) {
        super(props);this.state = ({
            sidebarview:false
        });

        this.formRef = React.createRef();
        this.extractedColumnList = [];
        this.gridColumnList = [];

        const dataState = {
            skip: 0,
            take: 10,
        };

        this.state = {
            data: [],
            dataResult: [],
            dataState: dataState,
            selectedRecordStatic: {},
            controlMap: new Map(), userRoleControlRights: [],
            currentPageNo: 0,
            openModal: false,
            selectedStaticDashBoardMaster: 0,
            breadCrumbData: []
        }
        this.searchRef = React.createRef();
    }
    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.props.Login.masterDataStatic.gridData, event.data),
            dataState: event.data
        });
    }

    ListDesign = props => {
        let item = props.dataItem;
        return (
            <ListGroup.Item key={`listKey_${props.index}`} as="li" onClick={() => this.listItemClick(item)}
                className={`list-bgcolor ${this.props.Login.masterDataStatic.selectedDashBoardDetail ? this.props.Login.masterDataStatic.selectedDashBoardDetail["nstaticdashboardcode"] === item["nstaticdashboardcode"] ? "active" : "" : ""}`}>
                <Media>
                    <Media.Body>
                        <h5>{item.sstaticdashboardname}</h5>
                        {/* <p>
                            {item.sdescription}
                        </p> */}
                    </Media.Body>
                </Media>
            </ListGroup.Item>
        )
    }
    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })          
    }
    render() {
       

        const startDate =  this.props.Login.masterDataStatic && this.props.Login.masterDataStatic.fromdate && new Date(this.props.Login.masterDataStatic.fromdate) || "";
        const endDate =  this.props.Login.masterDataStatic && this.props.Login.masterDataStatic.todate && new Date(this.props.Login.masterDataStatic.todate) || "";
        
        let obj = convertDateValuetoString(startDate, endDate, this.props.Login.userInfo);
       

        this.breadCrumbData = [
            {
                "label": "IDS_FROM",
                "value": obj.breadCrumbFrom //startDate.split("T")[0]
            }, {
                "label": "IDS_TO",
                "value": obj.breadCrumbto //endDate.split("T")[0]
            }]

        //console.log("static dashbaord screen:", this.props.Login.masterDataStatic);
        const gridColumnList = [];
        if (this.props.Login.masterDataStatic && this.props.Login.masterDataStatic.gridData && this.props.Login.masterDataStatic.gridData.length>0) {

            Object.keys(this.props.Login.masterDataStatic.gridData[0]).forEach(key => {
                gridColumnList.push({ "idsName": this.props.intl.formatMessage({ id: key }), 
                                      "dataField": key, 
                                      "width": "200px" });
            });
        }
        return (
            <>
                <div className="client-listing-wrap">
                <BreadcrumbComponent breadCrumbItem={this.breadCrumbData} />
                    <Row noGutters={false} className='d-flex mr-2'>
                        
                    <Col md={3} className={`${this.state.sidebarview ? 'd-none' : ""}`} >
                            <AtAccordion class="at-accordion">
                                <Accordion defaultActiveKey={"0"} >
                                  
                                    <Card>
                                        {this.props.Login.masterDataStatic && this.props.Login.masterDataStatic.staticDashBoardMaster 
                                                && this.props.Login.masterDataStatic.staticDashBoardMaster !== undefined ?
                                            this.props.Login.masterDataStatic.staticDashBoardMaster.map((item, index) => {
                                                return (<>
                                                    <Card.Header>
                                                        <CustomToggle eventKey={String(index)}>
                                                            <Card.Title onExpandCall={() => false}>
                                                                {item.sstaticdashboardmastername}
                                                            </Card.Title>
                                                        </CustomToggle>
                                                    </Card.Header>

                                                    <>
                                                        <Accordion.Collapse eventKey={String(index)}>

                                                            <Card.Body className="p-0">
                                                                <ListMasterWrapper>

                                                                    <ClientList className="product-list">
                                                                        <PerfectScrollbar>
                                                                            <div>
                                                                                <ListGroup as="ul">
                                                                                    {item.staticDBDetailsList ?
                                                                                        <ListView
                                                                                            data={item.staticDBDetailsList}
                                                                                            item={(props) => this.ListDesign(props)}
                                                                                        /> : ""}
                                                                                </ListGroup>
                                                                            </div>
                                                                        </PerfectScrollbar>

                                                                    </ClientList>
                                                                </ListMasterWrapper>
                                                            </Card.Body>
                                                        </Accordion.Collapse>
                                                    </>
                                                </>
                                                )
                                            })
                                            :
                                            <></>
                                        }
                                    </Card>
                                </Accordion>
                            </AtAccordion>
                        </Col>
                        {this.props.Login.masterDataStatic && this.props.Login.masterDataStatic.pieChartData &&
                            
                        <Col md={`${!this.state.sidebarview ? '9' : "12"}`} className={`${this.state.sidebarview ? 'dashboard-sidebar-closed' : ""}`}>
                            <span onClick= {()=>this.setState({sidebarview:!this.state.sidebarview})} className='dashboard-sidebar-view-btn'>
                                {!this.state.sidebarview ?
                                    <i class="fa fa-less-than"></i> :
                                    <i class="fa fa-greater-than"></i> 
                                }
                            </span>
                                <Row className='d-flex'>
                               
                                    <Col md={6} className="border border-right-0 height-dash">
                                        <PieChart
                                            // chartData={this.props.Login.masterData && this.props.Login.masterData.donutChartData || []}
                                            chartItemClick={event => this.chartItemClick(event)}
                                            series={(this.props.Login.masterDataStatic && this.props.Login.masterDataStatic.pieChartData) || []}
                                            masterData={this.props.Login.masterDataStatic}
                                            dashBoardType={this.props.Login.masterDataStatic}
                                            userInfo={this.props.Login.userInfo}
                                            checkParametersAvailable={this.checkParametersAvailable}
                                            chartTypeName={this.props.Login.masterDataStatic.chartTypeCode === chartType.PIECHART ? "pie" : "donut"}
                                            valueField={"valueField"}
                                            categoryField={"categoryField"}
                                            hiddenParam={false}
                                            hiddenExport={true}
                                            filterParam={this.props.Login.masterDataStatic.filterParams || []}
                                            selectedRecord={this.props.Login.selectedRecordStatic || this.props.Login.masterDataStatic}
                                            isStaticDashBoard={true}
                                            staticTitle={this.props.Login.masterDataStatic.selectedDashBoardDetail ? this.props.Login.masterDataStatic.selectedDashBoardDetail.sstaticdashboardname : ""}
                                        />
                                    </Col>

                                    <Col md={6} className="border height-dash">

                                        {this.props.Login.masterDataStatic && this.props.Login.masterDataStatic.gridData ?
                                            <>
                                                <Row className="pl-3 mt-1">
                                                    <Card className="d-flex border-0 justify-content-between" style={{ flexDirection: "row" }}>
                                                        <Card.Title>
                                                            {this.props.Login.masterDataStatic.selectedCategoryField ?
                                                                this.props.Login.masterDataStatic.selectedCategoryField
                                                                : ""}{" "}
                                                            {this.props.Login.masterDataStatic.selectedValueField ?
                                                                `: ${this.props.Login.masterDataStatic.selectedValueField}`
                                                                : this.props.Login.masterDataStatic.gridData ? `: ${this.props.Login.masterDataStatic.gridData.length}` : ""}
                                                        </Card.Title>
                                                    </Card>
                                                </Row>
                                                <AtTableWrap className="at-list-table">
                                                    <DataGrid
                                                        primaryKeyField={"npreregno"}
                                                        data={this.props.Login.masterDataStatic.gridData}
                                                        dataResult={this.props.Login.masterDataStatic.gridData}
                                                        dataState={this.state.dataState}
                                                        dataStateChange={(event) => this.setState({ dataState: event.dataState })}
                                                        extractedColumnList={gridColumnList}
                                                        controlMap={this.state.controlMap}
                                                        userRoleControlRights={this.state.userRoleControlRights}
                                                        userInfo={this.props.Login.userInfo}
                                                        pageable={false}
                                                        scrollable={"scrollable"}
                                                        isComponent={false}
                                                        isActionRequired={false}
                                                        isToolBarRequired={false}
                                                        hideColumnFilter={true}
                                                        selectedId={this.props.Login.selectedId}
                                                        gridHeight={"450px"}

                                                    // name="IDS_ALERTVIEW"
                                                    />
                                                </AtTableWrap>
                                            </>
                                            : ""
                                        }

                                    </Col>
                                    </Row>
                                    <Row>
                                    <Col md={12} className="border height-dash">

                                        
                                            <>
                                                {this.props.Login.masterDataStatic.selectionChartType !== chartType.BUBBLE?
                                                    <AreaChart
                                                        xSeries={this.props.Login.masterDataStatic.xSeries}
                                                        ySeries={this.props.Login.masterDataStatic.ySeries}
                                                        masterData={this.props.Login.masterDataStatic}
                                                        userInfo={this.props.Login.userInfo}
                                                        checkParametersAvailable={this.props.checkParametersAvailable}
                                                        //chartTypeName={"column"}
                                                        dashBoardType={this.props.Login.masterDataStatic}

                                                        chartTypeName={this.props.Login.masterDataStatic.selectionChartType === chartType.AREACHART ? "area" :
                                                            this.props.Login.masterDataStatic.selectionChartType === chartType.COLUMNCHART ? "column" :
                                                                this.props.Login.masterDataStatic.selectionChartType === chartType.BARCHART ? "bar" : "area"}
                                                        hiddenParam={true}
                                                        hiddenExport={true}
                                                    />
                                                    :
                                                    <BubbleChart
                                                        bubbleSeries={this.props.Login.masterDataStatic.bubbleSeries}
                                                        chartData={this.props.Login.masterDataStatic.chartData}
                                                        masterData={this.props.Login.masterDataStatic}
                                                        userInfo={this.props.Login.userInfo}
                                                        checkParametersAvailable={this.props.checkParametersAvailable}
                                                        hiddenParam={true}
                                                        hiddenExport={true}

                                                    />
                                                }
                                            </>


                                    </Col>
                                </Row>

                            </Col>
                        }
                    </Row>
                </div>
                {
                    this.props.Login.openModalForHomeDashBoard &&

                    <Modal show={this.props.Login.openModalForHomeDashBoard}
                        onHide={this.closeModal} backdrop="static" className="dashboard-parameter" dialogClassName="freakerstop">
                        <Modal.Header className="d-flex align-items-center">
                            <Modal.Title id="create-password" className="header-primary flex-grow-1">
                                <FormattedMessage id={"IDS_PARAMETER"} defaultMessage="Parameter" />
                            </Modal.Title>
                            <Button className="btn-user btn-cancel" variant="" onClick={this.closeModal}>
                                <FormattedMessage id='IDS_CANCEL' defaultMessage='Cancel' />
                            </Button>
                            <Button className="btn-user btn-primary-blue" onClick={this.onSaveClick}>
                                <FontAwesomeIcon icon={faSave} /> { }
                                <FormattedMessage id='IDS_SUBMIT' defaultMessage='Submit' />
                            </Button>
                        </Modal.Header>
                        <Modal.Body>
                            <ModalInner>
                                <Card.Body>
                                    <DashBoardDynamicControls
                                        selectedRecord={this.state.selectedRecordStatic || this.props.Login.selectedRecordStatic || {}}
                                        onInputOnChange={this.onInputOnChange}
                                        onNumericInputOnChange={this.onNumericInputOnChange}
                                        onComboChange={this.onComboChange}
                                        handleDateChange={this.handleDateChange}
                                        viewDashBoardDesignConfigList={this.props.Login.masterDataStatic.filterParams || []}
                                        operation={this.props.Login.operation}
                                        inputParam={this.props.Login.inputParam}
                                        userInfo={this.props.Login.userInfo}
                                    />
                                </Card.Body>
                            </ModalInner>
                        </Modal.Body>
                    </Modal>
                }

            </>
        );

    }

    closeModal = () => {
        let openModalForHomeDashBoard = this.props.Login.openModalForHomeDashBoard;
        openModalForHomeDashBoard = false;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModalForHomeDashBoard }
        }
        this.props.updateStore(updateInfo);
    }
    checkParametersAvailable = () => {
        if (this.props.Login.masterDataStatic && this.props.Login.masterDataStatic.filterParams && this.props.Login.masterDataStatic.filterParams.length > 0) {

            const { selectedRecordStatic } = this.state;
            this.props.Login.masterDataStatic.filterParams.forEach(item => {

                if (item.ndesigncomponentcode === designComponents.DATEPICKER) {
                    if (this.props.Login.masterDataStatic[item.sfieldname] !== undefined) {
                       const datelist =  rearrangeDateFormat(this.props.Login.userInfo,new Date(this.props.Login.masterDataStatic[item.sfieldname]))
                        
                       if(datelist == "Invalid Date")
                       {
                       selectedRecordStatic[item.sfieldname] = this.props.Login.masterDataStatic[item.sfieldname].replace("T"," ");
                       }
                       else{
                       selectedRecordStatic[item.sfieldname] = rearrangeDateFormat(this.props.Login.userInfo,new Date(this.props.Login.masterDataStatic[item.sfieldname]));
                    }
                }

                }
            });
            let openModalForHomeDashBoard = this.props.Login.openModalForHomeDashBoard;
            openModalForHomeDashBoard = true;
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { openModalForHomeDashBoard, selectedRecordStatic }
            }
            this.props.updateStore(updateInfo);
        }
    }
    listItemClick = (item) => {
        if (item !== undefined && item.nstaticdashboardcode > 0) {

            this.props.getStaticDashBoard(this.props.Login.userInfo, item, this.props.Login.masterDataStatic);

        }
    }
    chartItemClick(item) {
        this.props.getSelectionStaticDashBoard(this.props.Login.userInfo, this.props.Login.masterDataStatic.selectedDashBoardDetail.nstaticdashboardcode,
            item.dataItem.rowItem, this.props.Login.masterDataStatic, item.dataItem)
    }
    handleDateChange = (dateName, dateValue, item) => {
        const { selectedRecordStatic } = this.state;

        selectedRecordStatic[dateName] = dateValue
        this.setState({ selectedRecordStatic });
    }
    onSaveClick = (saveType, formRef) => {
         let obj = convertDateValuetoString(this.state.selectedRecordStatic.fromdate,this.state.selectedRecordStatic.todate,this.props.Login.userInfo);
         let selectedRecordParameter = {}
         selectedRecordParameter['fromdate'] = obj.fromDate;
         selectedRecordParameter['todate'] = obj.toDate;
        this.props.getStaticDashBoard(this.props.Login.userInfo, this.props.Login.masterDataStatic.selectedDashBoardDetail, this.props.Login.masterDataStatic,selectedRecordParameter, false);
    }

    componentDidUpdate(previousProps) {
        
        if (this.props.Login.selectedRecordStatic !== previousProps.Login.selectedRecordStatic) {
            this.setState({ selectedRecordStatic: this.props.Login.selectedRecordStatic });
        }
        if (this.props.Login.openModalForHomeDashBoard !== previousProps.Login.openModalForHomeDashBoard) {
            this.setState({ openModal: this.props.Login.openModalForHomeDashBoard });
        }
        if (this.props.Login.masterDataStatic
            && this.props.Login.masterDataStatic.selectedStaticDashBoardMaster !== previousProps.Login.masterDataStatic.selectedStaticDashBoardMaster) {
            this.setState({ selectedStaticDashBoardMaster: this.props.Login.masterDataStatic.selectedStaticDashBoardMaster });
        }
    }
    onInputOnChange = (event, item) => { }
    onNumericInputOnChange = (event, item) => { }
    onComboChange = (event, item) => { }
}

export default connect(mapStateToProps, {
    callService, crudMaster, getHomeDashBoard, updateStore,
    validateEsignCredential, getStaticDashBoard, getSelectionStaticDashBoard
})(injectIntl(StaticHomeDashBoard));