import React, { Component } from 'react';
import ListMaster from '../../../components/list-master/list-master.component';
import { connect } from 'react-redux';
import { callService, crudMaster, selectProductHistoryDetail, filterColumnData, getProductMaHolderHistory } from '../../../actions'
import { Col, Row, Card, FormGroup, FormLabel } from 'react-bootstrap';

import { ProductList, ContentPanel, MediaLabel } from '../product.styled';

import { FormattedMessage, injectIntl } from 'react-intl';

import { getControlMap } from '../../../components/CommonScript';
import ProductHistoryTabs from './ProductHistoryTabs';
import { transactionStatus } from '../../../components/Enumeration';
// import ReactTooltip from 'react-tooltip';




class ProductHistory extends Component {

    constructor(props) {
        super(props);

        this.state = {
            error: "",
            ProductHistory: [],
            operation: "",
            selectedProductHistory: undefined,
            ProductManufacturerHistory: [],
            ProductMAholderHistory: [],
            userRoleControlRights: [],
            controlMap: new Map()

        };
        this.searchRef = React.createRef();
    }
    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };


    render() {
        let userStatusCSS = "";
        if (this.props.Login.masterData.selectedProductHistory && this.props.Login.masterData.selectedProductHistory.ntransactionstatus === transactionStatus.DRAFT) {
            userStatusCSS = "outline-secondary";
        }
        else if (this.props.Login.masterData.selectedProductHistory && this.props.Login.masterData.selectedProductHistory.ntransactionstatus === transactionStatus.COMPLETED) {
            userStatusCSS = "outline-success";
        }
        else if (this.props.Login.masterData.selectedProductHistory && this.props.Login.masterData.selectedProductHistory.ntransactionstatus === transactionStatus.CORRECTION) {
            userStatusCSS = "outline-correction";
        } else {
            userStatusCSS = "outline-Final";
        }
        const filterParam = {
            inputListName: "ProductHistory", selectedObject: "selectedProductHistory", primaryKeyField: "nproducthistorycode",
            fetchUrl: "producthistory/getProductManufByProductID", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData,
            searchFieldList: ["sproductname", "sproductcatname", "stransdisplaystatus",
                "sofficialproductname", "sbillto", "suserrolename", "sfirstname",
                "scontactusername", "schargebandname"]
        };
        const addProductHistory = ""
        return (
            <>
                <div className="client-listing-wrap mtop-4 mtop-fixed-breadcrumb">
                    <Row noGutters={true}>
                        <Col md={4}>
                            <ListMaster filterColumnData={this.props.filterColumnData}
                                formatMessage={this.props.intl.formatMessage}
                                screenName={this.props.intl.formatMessage({ id: "IDS_PRODUCTHISTORY" })}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.ProductHistory}
                                masterData={this.props.Login.masterData}
                                userInfo={this.props.Login.userInfo}
                                getMasterDetail={(ProductHistory) => this.props.selectProductHistoryDetail(ProductHistory, this.props.Login.masterData, this.props.Login.userInfo)}
                                selectedMaster={this.props.Login.masterData.selectedProductHistory}
                                primaryKeyField="nproducthistorycode"
                                mainField="sproductname"
                                firstField="sproductcatname"
                                secondField="stransdisplaystatus"
                                isIDSField="Yes"
                                isVisible="yes"
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={addProductHistory}
                                filterParam={filterParam}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData}
                                handlePageChange={this.handlePageChange}
                                //  openModal = {()=>this.setState({screenName:"Add Product", operation:"create", isOpen:true})}
                                openModal={""}
                                hidePaging={false}
                            />
                        </Col>
                        <Col md='8'>
                            {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                            <ProductList className="panel-main-content">
                                {this.props.Login.masterData.ProductHistory && this.props.Login.masterData.ProductHistory.length > 0 && this.props.Login.masterData.selectedProductHistory ?
                                    <Card className="border-0">
                                        <Card.Header>
                                            <Card.Title className="product-title-main" data-tooltip-id="my-tooltip" data-tooltip-content={this.props.Login.masterData.selectedProductHistory.sproductname}
                                              //  data-for="tooltip_list_wrap"
                                                >{this.props.Login.masterData.selectedProductHistory.sproductname}</Card.Title>
                                            <ContentPanel className="d-flex product-category">
                                                <h2 className="product-title-sub flex-grow-1" data-tooltip-id="my-tooltip" data-tooltip-content={this.props.Login.masterData.selectedProductHistory.sproductcatname}
                                                   // data-for="tooltip_list_wrap"
                                                    >{this.props.Login.masterData.selectedProductHistory.sproductcatname}
                                                    <MediaLabel className={`btn btn-outlined  ${userStatusCSS} btn-sm ml-3`}>
                                                        <FormattedMessage id={this.props.Login.masterData.selectedProductHistory.stransdisplaystatus} message={this.props.Login.masterData.selectedProductHistory.stransdisplaystatus} />
                                                    </MediaLabel>
                                                </h2>
                                            </ContentPanel>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_USERROLE" message="Userrole" /></FormLabel>
                                                        <MediaLabel className="readonly-text font-weight-normal">{this.props.Login.masterData.selectedProductHistory.suserrolename}</MediaLabel>
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_USERNAME" message="User Name" /></FormLabel>
                                                        <MediaLabel className="readonly-text font-weight-normal">{this.props.Login.masterData.selectedProductHistory.sfirstname}</MediaLabel>
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_CONTACTUSER" message="Contact User" /></FormLabel>
                                                        <MediaLabel className="readonly-text font-weight-normal">{this.props.Login.masterData.selectedProductHistory.scontactusername}</MediaLabel>
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_CHARGEBAND" message="Charge Band" /></FormLabel>
                                                        <MediaLabel className="readonly-text font-weight-normal">{this.props.Login.masterData.selectedProductHistory.schargebandname}</MediaLabel>
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_BILLTO" message="Bill To" /></FormLabel>
                                                        <MediaLabel className="readonly-text font-weight-normal">{this.props.Login.masterData.selectedProductHistory.sbillto}</MediaLabel>
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_EDQMPRODUCTOFFICIALNAME" message="Edqm Product Official Name" /></FormLabel>
                                                        <MediaLabel className="readonly-text font-weight-normal">{this.props.Login.masterData.selectedProductHistory.sofficialproductname}</MediaLabel>
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id="IDS_PRODUCTVERSION" message="Product Version" /></FormLabel>
                                                        <MediaLabel className="readonly-text font-weight-normal">
                                                            {this.props.Login.masterData.selectedProductHistory.nproductversioncode === 0 ? "-" :
                                                                this.props.Login.masterData.selectedProductHistory.nproductversioncode}</MediaLabel>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <ProductHistoryTabs
                                                userInfo={this.props.Login.userInfo}
                                                inputParam={this.props.Login.inputParam}
                                                controlMap={this.state.controlMap}
                                                getProductMaHolderHistory={this.props.getProductMaHolderHistory}
                                                masterData={this.props.Login.masterData}
                                                settings = {this.props.Login.settings}
                                            // masterData={{
                                            //     "ProductManufacturerHistory": this.props.Login.masterData.ProductManufacturerHistory || [],
                                            //     "ProductMAholderHistory": this.props.Login.masterData.ProductMAholderHistory || [],
                                            //     "SelectedProductManufHistory":this.props.Login.masterData.SelectedProductManufHistory
                                            // }}
                                            />
                                        </Card.Body>
                                    </Card> : ""}
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
            classUrl: "producthistory",
            methodUrl: "ProductHistory",
            displayName: "IDS_PRODUCTHISTORY",
            userInfo: this.props.Login.userInfo
        };
        this.props.callService(inputParam);
    }

    componentDidUpdate(previousProps) {
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            const userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            this.setState({ userRoleControlRights, controlMap });
        }
    }
}

const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}
export default connect(mapStateToProps, { callService, crudMaster, selectProductHistoryDetail, filterColumnData, getProductMaHolderHistory })(injectIntl(ProductHistory));