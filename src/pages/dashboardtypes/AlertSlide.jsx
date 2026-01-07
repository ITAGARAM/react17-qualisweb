import React from 'react';
import { Row, Col, Card, Media, ListGroup, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import {
     getSelectedAlert
} from '../../actions';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../components/data-grid/data-grid.component';
import { ListMasterWrapper } from '../../components/list-master/list-master.styles';
import { ListView } from '@progress/kendo-react-listview';
import { ClientList, ContentPanel, MediaHeader } from '../../components/App.styles';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { AtTableWrap } from '../../components/data-grid/data-grid.styles';
import { ProductList } from '../product/product.styled';
import './Alert.css';
import { Tooltip } from '@progress/kendo-react-tooltip';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}


class AlertSlide extends React.Component {
    constructor(props) {
        super(props)

        this.formRef = React.createRef();
        this.extractedColumnList = [];
        this.gridColumnList = [];

        const dataState = {
            skip: 0,
            take: 10
        };

        this.state = {
            data: [],
            dataResult: [],
            dataState: dataState,
            controlMap: new Map(), userRoleControlRights: [],
            currentPageNo: 0,
            openModal: false
        }
        this.searchRef = React.createRef();
    }
    // dataStateChange = (event) => {
    //     this.setState({
    //         dataResult: process(this.props.Login.selectedAlertView1, event.data),
    //         dataState: event.data
    //     });
    // }

    ListDesign = props => {
        let item = props.dataItem;
        const labelColor = ['label-orange', 'label-green', 'label-yellow', 'label-purple'];
        return (
            <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}>
                <ListGroup.Item key={`listKey_${props.index}`} as="li" onClick={() => this.listItemClick(item)}
                    className={`list-bgcolor ${this.props.Login.selectedAlertView ? this.props.Login.selectedAlertView["nsqlquerycode"] === item["nsqlquerycode"] ? "active" : "" : ""}`}>
                    <Media tilte={item.sscreenheader}>
                        {/* <Form.Check.Label className={`mr-3 label-circle ${labelColor[props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{item.sscreenheader && item.sscreenheader.substring(0, 1).toUpperCase()}</Form.Check.Label> */}

                        <Media.Body className="d-flex p-2">
                            <MediaHeader title={item.sscreenheader}>
                                {item.sscreenheader}
                            </MediaHeader>
                            {/* <h5 tilte={item.sscreenheader}>{item.sscreenheader}</h5> */}
                            {/* <div className="pl-1"> <Badge pill bsPrefix="badge_colour">{item.ncount}</Badge></div> */}
                        </Media.Body>

                        <Form.Check.Label className={`label-circle1 mr-3 label-circle ${labelColor[props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{item.ncount}</Form.Check.Label>
                        {/* <div style={{ "font-size": "70%!important" }}>
                        <Badge pill variant="danger">{item.ncount}</Badge>
                    </div> */}
                    </Media>
                </ListGroup.Item>
            </Tooltip>

        )
    }
    render() {

        const gridColumnList = [];
        if (this.props.Login.selectedAlertView1 && this.props.Login.selectedAlertView1.length > 0) {
            Object.keys(this.props.Login.selectedAlertView1[0]).forEach(key => {
                gridColumnList.push(
                    {
                        "idsName": this.props.intl.formatMessage({ id: key }),
                        "dataField": key,
                        "width": "300px",
                        // "isIdsField":key.includes("STATUS")
                    }
                );
            });
        }
        return (
            <>
                <div className="client-listing-wrap wide-grid">
                    <Row noGutters={true}>
                        <Col md={4}>
                            {/* <div className="list-fixed-wrap"> */}
                                {/* <> */}
                                    {/* <> */}
                                        <ListMasterWrapper className={"accordian-dropdown"}>
                                            <ClientList className="product-list list_rightborder">
                                                <PerfectScrollbar>
                                                    <div className = "height-xl height-xxd no-bottom-pad">
                                                        <ListGroup as="ul">
                                                            <ListView
                                                                data={this.props.Login.alert}
                                                                item={(props) => this.ListDesign(props)}
                                                            />
                                                        </ListGroup>
                                                    </div>
                                                </PerfectScrollbar>

                                            </ClientList>
                                        </ListMasterWrapper>
                                    {/* </> */}
                                {/* </> */}
                            {/* </div> */}
                        </Col>
                        <Col md={8}>
                            <ProductList className="panel-main-content">
                                {this.props.Login.alert && this.props.Login.alert.length > 0 && this.props.Login.selectedAlertView ?
                                    <ContentPanel className="panel-main-content">
                                        <Card className="border-0">
                                            <Card.Header className="p-1">
                                                <Card.Title className="product-title-main ml-2">{this.props.Login.selectedAlertView.sscreenheader}</Card.Title>
                                            </Card.Header>
                                            <Card.Body>
                                                <AtTableWrap className="at-list-table">
                                                    <DataGrid
                                                        primaryKeyField={"nsqlquerycode"}
                                                        data={this.props.Login.selectedAlertView1}
                                                        dataResult={process(this.props.Login.selectedAlertView1,this.state.dataState)}
                                                        dataState={this.state.dataState}
                                                        dataStateChange={(event) => this.setState({ dataState: event.dataState })}
                                                        extractedColumnList={gridColumnList}
                                                        controlMap={this.state.controlMap}
                                                        userRoleControlRights={this.state.userRoleControlRights}
                                                        userInfo={this.props.Login.userInfo}
                                                        pageable={true}
                                                        scrollable={"scrollable"}
                                                        isComponent={false}
                                                        isActionRequired={false}
                                                        isToolBarRequired={true}
                                                        hideColumnFilter={false}
                                                        isRefreshRequired={false}
                                                        selectedId={0}
                                                        gridHeight={'calc(100vh - 170px)'}
                                                    // name="IDS_ALERTVIEW"
                                                    />
                                                </AtTableWrap>
                                            </Card.Body>
                                        </Card> </ContentPanel> : ""}
                            </ProductList>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }

    // closeModal = () => {
    //     let openModalForHomeDashBoard = this.props.Login.openModalForHomeDashBoard;
    //     openModalForHomeDashBoard = false;
    //     const updateInfo = {
    //         typeName: DEFAULT_RETURN,
    //         data: { openModalForHomeDashBoard }
    //     }
    //     this.props.updateStore(updateInfo);
    // }

    listItemClick(item) {
        if (item !== undefined && item.nsqlquerycode > 0) {

            this.props.getSelectedAlert(item, this.props.Login.userInfo);

        }
    }
    // componentDidUpdate (previousProps){
    //     if(this.props.Login.selectedAlertView1!==previousProps.selectedAlertView1){
    //         this.setState({dataState:{skip:0, take:this.state.dataState.take}})
    //     }
    // }

        //  componentDidUpdate(previousProps) {
        //     if (this.props.Login.selectedRecordStatic !== previousProps.Login.selectedRecordStatic) {
        //          this.setState({ selectedRecordStatic: this.props.Login.selectedRecordStatic });
        //      }
        //      if (this.props.Login.openModalForHomeDashBoard !== previousProps.Login.openModalForHomeDashBoard) {
        //          this.setState({ openModal: this.props.Login.openModalForHomeDashBoard });
        //      }
        //  } 
}

export default connect(mapStateToProps, {getSelectedAlert
})(injectIntl(AlertSlide));