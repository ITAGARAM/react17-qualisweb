import React, { Component } from 'react';
import { connect } from 'react-redux';
import { process } from '@progress/kendo-data-query';
import {
    callService, crudMaster, updateStore, getProductComboService, validateEsignCredential, filterColumnData,getProductDetail,addProductFile,viewAttachment
} from '../../actions'
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { injectIntl,FormattedMessage } from 'react-intl';
import 'react-perfect-scrollbar/dist/css/styles.css';
import AddProduct from './AddProduct';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { getControlMap,showEsign, validateEmail, validatePhoneNumber, onDropAttachFileList, deleteAttachmentDropZone, create_UUID,Lims_JSON_stringify } from '../../components/CommonScript';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import Esign from '../audittrail/Esign';
import { transactionStatus ,attachmentType} from '../../components/Enumeration';
import { ListWrapper } from '../../components/client-group.styles';
import DataGrid from '../../components/data-grid/data-grid.component';
import './product.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faPlus} from '@fortawesome/free-solid-svg-icons';
import ListMaster from '../../components/list-master/list-master.component';
import { ReadOnlyText, ContentPanel } from '../../components/App.styles';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import CustomTabs from '../../components/custom-tabs/custom-tabs.component';
import ProductFileTab from './ProductFileTab';
import AddProductFile from './AddProductFile';

class Product extends Component {

    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            data: [], masterStatus: "", error: "", selectedRecord: {},
            dataResult: [],
            dataState: dataState,
            userRoleControlRights: [],
            controlMap: new Map()
        };
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
        this.extractedColumnList = [
            { "idsName": this.props.Login.genericLabel ? this.props.Login.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] : "IDS_PRODUCTCATEGORY" , "dataField": "sproductcatname", "width": "200px" },
            { "idsName": this.props.Login.genericLabel ? this.props.Login.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] : "IDS_PRODUCT" , "dataField": "sproductname", "width": "200px" },
            { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "200px" },
            { "idsName": "IDS_DISPLAYSTATUS", "dataField": "sdisplaystatus", "width": "200px" }
        ];
        this.productFileFTP = [
            { "idsName": "IDS_FILE", "dataField": "sfilename", "mandatory": true , "mandatoryLabel":"IDS_CHOOSE", "controlType": "file"}
        ];

        this.productFileLink = [
            { "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "mandatory": true, "mandatoryLabel":"IDS_CHOOSE", "controlType": "file" },
            { "idsName": "IDS_LINKNAME", "dataField": "nlinkcode", "mandatory": true, "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" }
        ];
        this.searchFieldList = ["sproductcatname","sproductname", "sdescription","sdisplaystatus"];
    }

    // dataStateChange = (event) => {
    //     this.setState({
    //         dataResult: process(this.state.data, event.dataState),
    //         dataState: event.dataState
    //     });
    // }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let openChildModal = this.props.Login.openChildModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let selectedId = this.props.Login.selectedId;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                openChildModal=false;
                selectedRecord = {};
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason']=""
            }
        }
        else {
            openModal = false;
            openChildModal=false;
            selectedRecord = {};
            selectedId=null
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal,openChildModal, loadEsign, selectedRecord, selectedId }
        }
        this.props.updateStore(updateInfo);

    }

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

    render() {
        const addId = this.props.Login.inputParam && this.state.controlMap.has("Add".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Add".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const editId = this.props.Login.inputParam && this.state.controlMap.has("Edit".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Edit".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const deleteId = this.props.Login.inputParam && this.state.controlMap.has("Delete".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Delete".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;

        const addParam = {
            screenName: this.props.Login.genericLabel ? this.props.Login.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] : "IDS_PRODUCT" , primaryeyField: "nproductcode", primaryKeyValue: undefined,
            operation: "create", inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: addId
        };

        // const editParam = {
        //     screenName: this.props.Login.inputParam && this.props.Login.inputParam.displayName && this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }), operation: "update",
        //     primaryKeyField: "nproductcode", inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: editId
        // };
        const editParam = {
            screenName: this.props.Login.inputParam && this.props.Login.inputParam.displayName && this.props.Login.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode], operation: "update", primaryKeyName: "nproductcode",
            masterData: this.props.Login.masterData,inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo,
            ncontrolcode: editId, inputListName: "Product", selectedObject: "SelectedProduct"
        };

        const deleteParam = { operation: "delete" };

        const filterParam = {
            inputListName: "Product", selectedObject: "SelectedProduct", primaryKeyField: "nproductcode",
            fetchUrl: "product/getProduct", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData, searchFieldList: this.searchFieldList
        };

        const mandatoryFileFields = [];
        if (this.props.Login.screenName === (this.props.Login.genericLabel ? this.props.Login.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode].concat(" "+this.props.intl.formatMessage({id : "IDS_FILE"})) : "IDS_PRODUCTFILE" )){
            if(this.state.selectedRecord.nattachmenttypecode === attachmentType.FTP){
                this.productFileFTP.forEach(item => item.mandatory === true ?
                    mandatoryFileFields.push(item) : ""
                );
            }
            else {
                this.productFileLink.forEach(item => item.mandatory === true ?
                    mandatoryFileFields.push(item) : ""
                );
            }

        }

        return (
            <>
                {/* <Row>
                    <Col>
                        <ListWrapper className="client-list-content">

                            {this.state.data ?
                                <DataGrid
                                    primaryKeyField={"nproductcode"}
                                    data={this.state.data}
                                    dataResult={this.state.dataResult}
                                    dataState={this.state.dataState}
                                    dataStateChange={this.dataStateChange}
                                    extractedColumnList={this.extractedColumnList}
                                    fetchRecord={this.props.getProductComboService}
                                    editParam={editParam}
                                    deleteRecord={this.deleteRecord}
                                    deleteParam={deleteParam}
                                    reloadData={this.reloadData}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    pageable={true}
                                    scrollable={'scrollable'}
                                    gridHeight={'600px'}
                                    isActionRequired={true}
                                    isToolBarRequired={true}
                                    selectedId={this.props.Login.selectedId}
                                    addRecord={() => this.props.getProductComboService(addParam)}
                                />
                                : ""}
                        </ListWrapper>
                    </Col>
                </Row> */}
                <div className="client-listing-wrap mtop-4 mtop-fixed-breadcrumb">
                <Row noGutters>
                    <Col md={4}>
                        {/* <Row noGutters>
                            <Col md={12}> */}
                            {/* <div className="list-fixed-wrap"> */}
                                <ListMaster
                                    // screenName={this.props.intl.formatMessage({ id: "IDS_SAMPLETYPE" })}
                                    screenName= {this.props.Login.genericLabel ? this.props.Login.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] : "IDS_PRODUCT" }
                                    masterData={this.props.Login.masterData}
                                    userInfo={this.props.Login.userInfo}
                                    masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.Product}
                                    getMasterDetail={(product) => this.props.getProductDetail(product, this.props.Login.userInfo, this.props.Login.masterData)}
                                    selectedMaster={this.props.Login.masterData.SelectedProduct}
                                    primaryKeyField="nproductcode"
                                    mainField="sproductname"
                                    firstField="sproductcatname"
                                    secondField="sdisplaystatus"
                                    filterColumnData={this.props.filterColumnData}
                                    filterParam={filterParam}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    addId={addId}
                                    searchRef={this.searchRef}
                                    reloadData={this.reloadData}
                                    openModal={() => this.props.getProductComboService(addParam)}
                                    isMultiSelecct={false}
                                    hidePaging={false}
                                    isClearSearch={this.props.Login.isClearSearch}
                                />
                            {/* </div>
                        </Col></Row> */}
                    </Col>
                    <Col md={8}>
                        {/* <Row>
                            <Col md={12}> */}
                            <ContentPanel className="panel-main-content">
                                <Card className="border-0">
                                    {this.props.Login.masterData.Product && this.props.Login.masterData.Product.length > 0 && this.props.Login.masterData.SelectedProduct ?
                                        <>
                                            <Card.Header>
                                                
                                                <Card.Title className="product-title-main">
                                                    {this.props.Login.masterData.SelectedProduct.sproductname}
                                                </Card.Title>
                                                <Card.Subtitle>
                                                    <div className="d-flex product-category">
                                                        <h2 className="product-title-sub flex-grow-1">

                                                            
                                                        </h2>
                                                        
                                                        <div className="d-inline">
                                                            <Nav.Link name="editProduct" hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                className="btn btn-circle outline-grey mr-2"
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                
                                                                onClick={() => this.props.getProductComboService(editParam)}
                                                            >
                                                                <FontAwesomeIcon icon={faPencilAlt} />
                                                            </Nav.Link>

                                                            <Nav.Link name="deleteProduct" className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                              
                                                                hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                onClick={() => this.confirmDelete(deleteParam,deleteId)}>
                                                                <FontAwesomeIcon icon={faTrashAlt} />
                                                               
                                                            </Nav.Link>
                                                            
                                                            
                                                        </div>
                                                        
                                                    </div>

                                                </Card.Subtitle>
                                            </Card.Header>
                                            <Card.Body className="form-static-wrap">
                                                

                                                <Row>
                                                    <Col md={12}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_DESCRIPTION" message="Description" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedProduct.sdescription}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                  
                                                </Row>
                                                
                                                <Row className="no-gutters">
                                                <Col md={12}>
                                                    <Card className="at-tabs">
                                                        <CustomTabs tabDetail={this.tabDetail()} onTabChange={this.onTabChange} />
                                                    </Card>
                                                </Col>
                                            </Row>
                                                
                                            
                                            </Card.Body>
                                        </>
                                        : ""
                                    }
                                </Card>
                            </ContentPanel>
                        </Col></Row>
                    {/* </Col>
                </Row> */}
            </div>
                {/* Below Condition Added to avoid unwanted rendering of SlideOut */}
                {this.props.Login.openModal || this.props.Login.openChildModal ?
                    <SlideOutModal
                        show={this.props.Login.screenName === this.props.Login.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode].concat(" "+this.props.intl.formatMessage({id : "IDS_FILE"})) ?
                        // show ={this.props.Login.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode].concat(" "+this.props.intl.formatMessage({id : "IDS_FILE"})) ?
                        this.props.Login.openChildModal:
                        this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        //ATE234 janakumar ALPD-5546All Master screen -> Copy & File remove the save&continue
                        showSaveContinue={ this.props.Login.screenName==="Sample Type File"?false:true}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.props.Login.screenName === this.props.Login.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode].concat(" "+this.props.intl.formatMessage({id : "IDS_FILE"}))  ? this.onSaveProductFile: this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={this.props.Login.screenName === this.props.Login.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode].concat(" "+this.props.intl.formatMessage({id : "IDS_FILE"})) ? 
                        mandatoryFileFields:
                        [
                            { "idsName": this.props.Login.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode], "dataField": "nproductcatcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                            { "idsName": this.props.Login.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode], "dataField": "sproductname", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }]}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : this.props.Login.openChildModal&&
                            this.props.Login.screenName === this.props.Login.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode].concat(" "+this.props.intl.formatMessage({id : "IDS_FILE"}))  ? 
                                
                            <AddProductFile
                            selectedRecord={this.state.selectedRecord || {}}
                            onInputOnChange={this.onInputOnChange}
                            onDrop={this.onDropProductFile}
                            onDropAccepted={this.onDropAccepted}
                            deleteAttachment={this.deleteAttachment}
                            actionType={this.state.actionType}
                            onComboChange={this.onComboChange}
                            linkMaster={this.props.Login.linkMaster}
                            editFiles={this.props.editFiles}
                            maxSize={20}
                            // maxFiles={this.props.operation === "update" ? 1 : 3}
                            // multiple={this.props.operation === "update" ? false : true}
                            maxFiles={1}
                            multiple={false}
                            // label={this.props.intl.formatMessage({ id: "IDS_SAMPLETYPEFILE" })}
                            
                            label={this.props.Login.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode].concat(" "+this.props.intl.formatMessage({ id: "IDS_FILE"}))}
                            name="productfilename"
                            settings={this.props.Login.settings}
                        />
                                    
    
                                : <AddProduct
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                productCategoryList={this.props.Login.productCategoryList || []}
                                operation={this.props.Login.operation}
                                genericLabel={this.props.Login.genericLabel}
                                userInfo={this.props.Login.userInfo}
                                inputParam={this.props.Login.inputParam}
                            />}
                    />
                    : ""}
            </>
        );
    }

    onDropProductFile = (attachedFiles, fieldName, maxSize) => {

        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles, maxSize);
        this.setState({ selectedRecord, actionType: "new" });
    }
    deleteAttachment = (event, file, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName], file)

        this.setState({
            selectedRecord, actionType: "delete" //fileToDelete:file.name 
        });
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
                this.setState({
                    userRoleControlRights, controlMap, data: this.props.Login.masterData,
                    //dataResult: process(this.props.Login.masterData, this.state.dataState),
                });
            }
            else {
                let { dataState } = this.state;
                if (this.props.Login.dataState === undefined) {
                    dataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }
                }
                this.setState({
                    data: this.props.Login.masterData, selectedRecord: this.props.Login.selectedRecord,
                    //dataResult: process(this.props.Login.masterData, dataState), dataState
                });
            }
        }
        else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
    }

    onInputOnChange = (event,optional) => {

        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else if (event.target.type === "radio"){
            selectedRecord[event.target.name] = optional;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }

        this.setState({ selectedRecord });
    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;;

        this.setState({ selectedRecord });
    }
    confirmDelete = (deleteParam,deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteRecord(deleteParam, deleteId));
    }
    deleteRecord = (deleteParam, ncontrolCode) => {
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "Product",//this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: {
                //[this.props.Login.inputParam.methodUrl.toLowerCase()]: this.props.Login.masterData.SelectedProduct,
                ["product"]: this.props.Login.masterData.SelectedProduct,
                "userinfo": this.props.Login.userInfo,
                "genericlabel" :this.props.Login.genericLabel

            },
            operation: deleteParam.operation,
            dataState: this.state.dataState,
            postParam: { inputListName: "Product", selectedObject: "SelectedProduct", primaryKeyField: "nproductcode",
            primaryKeyValue:this.props.Login.masterData.SelectedProduct.nproductcode,
            fetchUrl: "product/getProduct", fecthInputObject: { userinfo: this.props.Login.userInfo } }
        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode ? deleteParam.ncontrolCode : ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName:this.props.Login.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode],
                    operation: deleteParam.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }

    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
    }

    tabDetail = () => {
      
        const tabMap = new Map();

       tabMap.set("IDS_FILE",
        <ProductFileTab
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
            userInfo={this.props.Login.userInfo}
            genericLabel ={this.props.Login.genericLabel}
            inputParam={this.props.Login.inputParam}
            deleteRecord={this.deleteFileRecord}
            productFile={this.props.Login.masterData.productFile || []}
            getAvailableData={this.props.getAvailableData}
            addProductFile={this.props.addProductFile}
            viewProductFile={this.viewProductFile}
            defaultRecord={this.defaultRecord}
            screenName={this.props.Login.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode].concat(" "+this.props.intl.formatMessage({id : "IDS_FILE"}))}
            settings={this.props.Login.settings}
        />);
        return tabMap;
    }

    viewProductFile = (filedata) => {
        const inputParam = {
            inputData: {
                productfile: filedata,
                userinfo: this.props.Login.userInfo,
                genericlabel:this.props.Login.genericLabel
            },
            classUrl: "product",
            operation: "view",
            methodUrl: "AttachedProductFile",
            screenName: this.props.Login.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode].concat(" "+this.props.intl.formatMessage({id : "IDS_FILE"}))
        }
        this.props.viewAttachment(inputParam);
    }

    deleteFileRecord = (productparam) => {
       
        let inputParam = {};
        //if (this.props.Login.screenName === 'Product File') {
            inputParam = {
                classUrl: "product",
                methodUrl: productparam.methodUrl,
                inputData: {
                    [productparam.methodUrl.toLowerCase()]: productparam.selectedRecord,
                    "userinfo": this.props.Login.userInfo,
                    "genericlabel" : this.props.Login.genericLabel,

                },
                operation: productparam.operation,
                //dataState: this.state.dataState,
                //dataStateMaterial: this.state.dataStateMaterial
                dataState: this.state.dataState
            }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, productparam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openChildModal: true, screenName: this.props.Login.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode].concat(" "+this.props.intl.formatMessage({id : "IDS_FILE"})) , operation: productparam.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openChildModal");
        }
    //}
}

    reloadData = () => {
        this.searchRef.current.value = "";
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl, //4778 janakumar labrl name not passed in the reload
            displayName: this.props.Login.displayName,//this.props.Login.inputParam.displayName,
            userInfo: this.props.Login.userInfo
        };
        this.props.callService(inputParam);
    }
    onSaveProductFile=(saveType, formRef) =>{
        const selectedRecord = this.state.selectedRecord;
        const acceptedFiles = selectedRecord.sfilename;
        const nattachmenttypecode = selectedRecord.nattachmenttypecode;
        let isFileEdited = transactionStatus.NO;
        let productFileArray = [];
        let productFile = {
            nproductcode: this.props.Login.masterData.SelectedProduct.nproductcode,
            nproductfilecode: selectedRecord.nproductfilecode ? selectedRecord.nproductfilecode : 0,
            nstatus: transactionStatus.ACTIVE,
            nattachmenttypecode,
            ndefaultstatus: selectedRecord[nattachmenttypecode === attachmentType.LINK ? "nlinkdefaultstatus" : "ndefaultstatus"] ? selectedRecord[nattachmenttypecode === attachmentType.LINK ? "nlinkdefaultstatus" : "ndefaultstatus"] : 4
        };
        const formData = new FormData();
        if (nattachmenttypecode === attachmentType.FTP) {
            if (acceptedFiles && Array.isArray(acceptedFiles) && acceptedFiles.length > 0) {
                acceptedFiles.forEach((file, index) => {
                    const tempData = Object.assign({}, productFile);
                    const splittedFileName = file.name.split('.');
                    const fileExtension = file.name.split('.')[splittedFileName.length - 1];
                    const ssystemfilename = selectedRecord.ssystemfilename && selectedRecord.ssystemfilename !==undefined ? selectedRecord.ssystemfilename.split('.') :  create_UUID();
                    const filesystemfileext = selectedRecord.ssystemfilename && selectedRecord.ssystemfilename !==undefined  ? file.name.split('.')[ssystemfilename.length - 1] : fileExtension;
                    const uniquefilename = nattachmenttypecode === attachmentType.FTP ? selectedRecord.nproductfilecode && selectedRecord.nproductfilecode > 0
                        && selectedRecord.ssystemfilename !== "" ? ssystemfilename[0] + '.' + filesystemfileext:  create_UUID() + '.' + fileExtension : "";
                    tempData["sfilename"] =Lims_JSON_stringify(file.name.trim(),false);
                    tempData["sdescription"] =Lims_JSON_stringify( selectedRecord.sdescription ? selectedRecord.sdescription.trim() : "",false);
                    tempData["nlinkcode"] = transactionStatus.NA;
                    tempData["ssystemfilename"] = uniquefilename;
                    tempData["nfilesize"] = file.size;
                    formData.append("uploadedFile" + index, file);
                    formData.append("uniquefilename" + index, uniquefilename);
                    productFileArray.push(tempData);
                });
                formData.append("filecount", acceptedFiles.length);
                isFileEdited = transactionStatus.YES;
            } else {
                productFile["sfilename"] = Lims_JSON_stringify(selectedRecord.sfilename,false);
                productFile["sdescription"] = Lims_JSON_stringify(selectedRecord.sdescription ? selectedRecord.sdescription.trim() : "",false);
                productFile["nlinkcode"] = transactionStatus.NA;
                productFile["ssystemfilename"] = selectedRecord.ssystemfilename;
                productFile["nfilesize"] = selectedRecord.nfilesize;
                productFileArray.push(productFile);
            }
        } else {
            productFile["sfilename"] = Lims_JSON_stringify(selectedRecord.slinkfilename.trim(),false);
            productFile["sdescription"] =Lims_JSON_stringify(selectedRecord.slinkdescription ? selectedRecord.slinkdescription.trim() : "",false);
            productFile["nlinkcode"] = selectedRecord.nlinkcode.value ? selectedRecord.nlinkcode.value : -1;
            productFile["ssystemfilename"] = "";
            productFile["nfilesize"] = 0;
            productFileArray.push(productFile);
        }
        formData.append("isFileEdited", isFileEdited);
        formData.append("productfile", JSON.stringify(productFileArray));
        // formData.append("userinfo", JSON.stringify(this.props.userInfo));
        formData.append("genericlabel",JSON.stringify(this.props.Login.genericLabel));


        let selectedId = null;
        let postParam = undefined;
        if (this.props.Login.operation === "update") {
            // edit
            postParam = { inputListName: "Product", selectedObject: "SelectedProduct", primaryKeyField: "nproductcode" };
            selectedId = selectedRecord["nproductfilecode"];
        }
        let clearSelectedRecordField = [
            
            { "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
            //{ "controlType": "checkbox", "idsName": "IDS_CATEGORYBASEDFLOW", "dataField": "ncategorybasedflow", "width": "200px", "controlName": "ncategorybasedflow","isClearField":true,"preSetValue":3 },
            { "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "ndefaultstatus", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 }
        ]
        const inputParam = {
           inputData: { "userinfo": {...this.props.Login.userInfo,
            sformname: Lims_JSON_stringify(this.props.Login.userInfo.sformname),
            smodulename: Lims_JSON_stringify(this.props.Login.userInfo.smodulename),
            //ALPD-1628(while file saving,audit trail is not captured respective language)
            slanguagename: Lims_JSON_stringify(this.props.Login.userInfo.slanguagename)
        }},
            displayName:this.props.Login.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode],
            formData: formData,
            isFileupload: true,
            operation: this.props.Login.operation,
            classUrl: "product",
            saveType, formRef, methodUrl: "ProductFile", postParam,
            selectedRecord:{...this.state.selectedRecord}
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openChildModal","","",clearSelectedRecordField);
        }
        
    }
    onSaveClick = (saveType, formRef) => {

        //add / edit            
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["genericlabel"] =this.props.Login.genericLabel;
        let dataState = undefined;
        let selectedId = null;
        let postParam = undefined;
        if (this.props.Login.operation === "update") {
            postParam = { inputListName: "Product", selectedObject: "SelectedProduct", primaryKeyField: "nproductcode",
        primaryKeyValue: this.props.Login.selectedRecord.nproductcode,
         fetchUrl: "product/getActiveProductById", fecthInputObject: {userinfo: this.props.Login.userInfo },
         masterData: this.props.Login.masterData 
      }
            // edit
            dataState = this.state.dataState;
           // inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = JSON.parse(JSON.stringify(this.state.selectedRecord));
           inputData["product"] = JSON.parse(JSON.stringify(this.state.selectedRecord));
            selectedId = this.props.Login.selectedRecord.nproductcode;
        } else {
            //add               
            //inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
            inputData["product"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
        }
        if (inputData["product"].hasOwnProperty('esignpassword')) {
            if (inputData["product"]['esignpassword'] === '') {
                delete inputData["product"]['esigncomments']
                delete inputData["product"]['esignpassword']
            }
        }

        inputData["product"]["ndefaultstatus"] = this.state.selectedRecord["ndefaultstatus"] ? this.state.selectedRecord["ndefaultstatus"] : transactionStatus.NO;
        inputData["product"]["nproductcatcode"] = this.state.selectedRecord["nproductcatcode"] ? this.state.selectedRecord["nproductcatcode"].value : "";
        inputData["product"]["sproductname"] = this.state.selectedRecord["sproductname"] ? this.state.selectedRecord["sproductname"] : "";
        inputData["product"]["sdescription"] = this.state.selectedRecord["sdescription"] ? this.state.selectedRecord["sdescription"] : "";
        let clearSelectedRecordField = [
            { "controlType": "textbox", "idsName":"IDS_PRODUCTNAME", "dataField": "sproductname", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER","isClearField":true },
            { "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
            //{ "controlType": "checkbox", "idsName": "IDS_CATEGORYBASEDFLOW", "dataField": "ncategorybasedflow", "width": "200px", "controlName": "ncategorybasedflow","isClearField":true,"preSetValue":3 },
            { "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "ndefaultstatus", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 }
        ]
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "Product",//this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData, selectedId, dataState,
            operation: this.props.Login.operation, saveType,postParam, formRef, searchRef: this.searchRef,
            selectedRecord:{...this.state.selectedRecord}
        }

        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.Login.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode],
                    operation: this.props.Login.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal","","",clearSelectedRecordField);
        }

    }
    validateEsign = () => {
        let modalName = this.props.Login.screenName === this.props.Login.genericLabel["Product"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode].concat(" "+this.props.intl.formatMessage({id : "IDS_FILE"})) ? "openChildModal" : "openModal";
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
               
                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }
        this.props.validateEsignCredential(inputParam, modalName);
    }
    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, operation: null, modalName: undefined
            }
        }
        this.props.updateStore(updateInfo);
    }
}



const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}
export default connect(mapStateToProps, {
    callService, crudMaster, getProductComboService,
    updateStore, validateEsignCredential, filterColumnData,getProductDetail,addProductFile,viewAttachment
})(injectIntl(Product));