import React, { Component } from 'react'
import FormInput from './form-input/form-input.component';
import { Col, Row, Card } from 'react-bootstrap';
import CustomComponent from './CustomComponent';
import { MediaHeader } from '../components/App.styles';
// import { Spreadsheet } from 'react-spreadsheet';
//import { Spreadsheet } from "@progress/kendo-react-spreadsheet"; 

// import { DataSheetGrid, checkboxColumn, textColumn } from 'react-datasheet-grid';
//simport { Spreadsheet } from 'react-spreadsheet';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { toast } from 'react-toastify';
import Axios from 'axios';
import rsapi from '../rsapi';
import { intl } from './App';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from '../actions/LoginTypes';


class AvailableSpaceComponent extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (<Col md={12} className="pl-0 mt-2">
            <Card.Header>
                <Card.Title className="product-title-main">
                    Available Space :  {this.props.navailablespace
                    }
                </Card.Title>
            </Card.Header>
            <br />
        </Col>);

    }
}
class AdditionalFieldsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AdditionalFieldsComponentData: { ...this.props.AdditionalFieldsComponentData },
            nsamplestoragemappingcode: this.props.nsamplestoragemappingcode,
            nsamplestoragelocationcode: this.props.nsamplestoragelocationcode
        }
    }
    autoCRUD = (event, inputParam) => {
        event.stopPropagation();
        if (this.state.AdditionalFieldsComponentData[this.state.nsamplestoragemappingcode] !== "") {
            this.setState({ loading: true })
            let urlArray = [];
            let originalParam = {
                nsamplestoragemappingcode: this.state.nsamplestoragemappingcode,
                nsamplestoragelocationcode: this.state.nsamplestoragelocationcode,
                sboxid: this.state.AdditionalFieldsComponentData[this.state.nsamplestoragemappingcode],
                userinfo: this.props.userInfo
            }
            const url1 = rsapi().post("samplestoragetransaction/updateSampleStorageMapping", originalParam);
            urlArray = [url1];
            Axios.all(urlArray)
                .then(response => {
                    let responseData = response[0].data;
                    let AdditionalFieldsComponentData = this.state.AdditionalFieldsComponentData;
                    AdditionalFieldsComponentData[this.state.nsamplestoragemappingcode] = responseData.sboxid;
                    responseData.hasOwnProperty('existCheck') && responseData.existCheck && toast.warn(intl.formatMessage({ id: "IDS_RECORDALREADYEXISTS" }));
                    // this.props.enableDisableSheet(true)
                    //    let selectedRecord=this.state.selectedRecord;
                    //    selectedRecord['sboxid']=this.state.selectedRecord['sboxid']
                    // this.setState({
                    //     // selectedRecord,
                    //     loading: false
                    // });
                    this.setState({
                        // AdditionalFieldsComponentData: {
                            AdditionalFieldsComponentData
                        // }
                        ,
                        loading: false
                    });
                }).catch(error => {
                    if (error.response?.status === 429) {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
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
                    // this.setState({
                    //     AdditionalFieldsComponentData: {
                    //         ...this.state.AdditionalFieldsComponentData,
                    //         [this.state.nsamplestoragemappingcode]: ""
                    //     }
                    //     ,
                    //     loading: false
                    // });
                });
        } else {
            //   this.props.enableDisableSheet(false)
        }

    }
    onInputOnChange = (event) => {
        const AdditionalFieldsComponentData = this.state.AdditionalFieldsComponentData || {};
        AdditionalFieldsComponentData[this.state.nsamplestoragemappingcode] = event.target.value;
        this.setState({ AdditionalFieldsComponentData });
    }
    componentDidUpdate(previousProps, previousState) {
        if (this.props.AdditionalFieldsComponentData !== previousProps.AdditionalFieldsComponentData) {
            let AdditionalFieldsComponentData = this.props.AdditionalFieldsComponentData
            this.setState({ AdditionalFieldsComponentData })
        }
        if (this.props.nsamplestoragemappingcode !== previousProps.nsamplestoragemappingcode) {
            let nsamplestoragemappingcode = this.props.nsamplestoragemappingcode
            this.setState({ nsamplestoragemappingcode })
        }
        if (this.props.nsamplestoragelocationcode !== previousProps.nsamplestoragelocationcode) {
            let nsamplestoragelocationcode = this.props.nsamplestoragelocationcode
            this.setState({ nsamplestoragelocationcode })
        }
    }
    render() {
        return (<>
            <FormInput
                name={'sboxid'}
                onBlur={(event) => this.autoCRUD(event, this.state.AdditionalFieldsComponentData)}
                label={intl.formatMessage({ id: "IDS_CONTAINERID" })}
                placeholder={intl.formatMessage({ id: "IDS_CONTAINERID" })}
                value={this.state.AdditionalFieldsComponentData[this.state.nsamplestoragemappingcode] ? this.state.AdditionalFieldsComponentData[this.state.nsamplestoragemappingcode] : ""}
                maxLength={100}
                isDisabled={this.props.isMoveScreen?true:false}
                onChange={(event) =>
                    this.onInputOnChange(event)}
            />
        </>
        );

    }
}
class MatrixComponent extends Component {
    Rows = Array(this.props.Rows).fill(0, 0, Array(this.props.Rows).length)
    columns = Array(this.props.columns).fill(0, 0, Array(this.props.columns).length)
    alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N",
        "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            sheetData: this.props.sheetData
        }
    }
    componentDidUpdate(previousProps, previousState) {
        if (this.props.sheetData !== previousProps.sheetData) {
            let sheetData = this.props.sheetData
            this.setState({ sheetData })
        }
    }
    genId(Row//i
        , Column//j
    ) {
        let object = {}
        object = { label: this.alphabet[Column] + (Row + 1) }
        return object
    }
    createDimensions(Rows, columns) {
        //3X3
        Rows = Rows - 1
        columns = columns - 1
        let spreadsheetdata = [];
        let rowArray = [];
        for (var i = 0; i <= Rows; i++) {
            spreadsheetdata = []
            for (var j = 0; j <= columns; j++) {
                let object = this.genId(i, j)
                spreadsheetdata.push(object);
            }
            rowArray.push(spreadsheetdata);
        }
        return rowArray;
    }
    onChange = (sheetdata) => {
        // console.log(sheetdata)
        //  this.props.childDataChange(selectedRecord);
        this.setState({ data: sheetdata })
    }

    comparator = (a, b) => {
        return a.toString().localeCompare(b.toString(), 'en', { numeric: true })
    };

    handleKeyDown = (e, nrow, ncolumn, ndirectionmastercode) => {
        let orderArray = [];
        let activeElement = document.activeElement;

        // for (var i = 0; i < document.forms.length; i++) {
        //     let form = document.forms[i].elements;
        //     for (var j = 0; j < form.length; j++) {
        //         let element = form[j];
        //         if (activeElement === element) {
        //             form.elements[i].focus();
        //         };
        //     }
        // }
        if (ndirectionmastercode === 1) {
            Array(ncolumn).fill(0, 0, Array(ncolumn).length).map((component, columnIndex) => {
                Array(nrow).fill(0, 0, Array(nrow).length).map((component, rowIndex) => {
                    // ndirectionmastercode===1?
                    // orderArray.push(this.alphabet[rowIndex] + (columnIndex + 1))
                    // :
                    orderArray.push(this.alphabet[rowIndex] + (columnIndex + 1))
                })
            })
        } else {
            Array(nrow).fill(0, 0, Array(nrow).length).map((component, rowIndex) => {
                Array(ncolumn).fill(0, 0, Array(ncolumn).length).map((component, columnIndex) => {
                    // ndirectionmastercode===1?
                    // orderArray.push(this.alphabet[rowIndex] + (columnIndex + 1))
                    // :
                    orderArray.push(this.alphabet[columnIndex] + (rowIndex + 1))
                    ///  orderArray.push({id:this.alphabet[columnIndex] ,value: (rowIndex + 1)})

                })
            })
        }




        if (e.keyCode === 13// && e.target.nodeName == 'SELECT'
        ) {
            var form = e.target.closest('form');
            //var index = Array.prototype.indexOf.call(form, e.target);
            // form.elements[index + 3].focus();
            // return false;


            let index = orderArray.sort(this.comparator).findIndex(item => item === activeElement.placeholder);

            for (var i = 0; i < form.elements.length; i++) {
                let element = form.elements[i];
                if (element.placeholder === orderArray[index + 1]) {
                    // if (element.disabled) {
                    if (element.value !== "") {
                        index++;
                        i = 0;
                    } else {
                        form.elements[i].focus();
                        break;
                    }
                };
            }
            // for (var i = 0; i < document.forms.length; i++) {
            //     let form = document.forms[i].elements;
            //     for (var j = 0; j < form.length; j++) {
            //         let element = form[j];
            //         if (element.placeholder === orderArray[index + 1]) {
            //             if (element.disabled) {
            //                 index++;
            //             } else {
            //                 element.focus();
            //                 form.elements[j].focus();
            //             }
            //         };
            //     }
            // }
        }
    }
    availablepsacechange = (data) => {
        this.setState({ navailablespace: data.navailablespace })
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     if (this.state.navailablespace !== nextState.navailablespace) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }
    render() {
        return (
            <>
                {/* <AvailableSpaceComponent navailablespace={this.state.navailablespace || 0} /> */}
                <Row>
                    <Row className='mb-1 test-box-status'>
                        <Col className='d-flex text-center'>
                            <div
                                name={'ncolumn'}
                                value={""}
                                style={{ 'border': `2px solid #aaa`, 'width': `45px`, 'user-select': `none`, 'height': `32px`, 'cursor': `not-allowed` }}
                                isDisabled={true}
                                className="mb-3"
                            />
                            <MediaHeader className={`labelfont`} style={{ color: "#172b4d" }}>
                                {this.props.intl.formatMessage({ id: "IDS_FILLEDNOTEDITABLE" })}
                            </MediaHeader>
                        </Col>
                        {/* <Col className='d-flex text-center'>
                            <div
                                name={'ncolumn'}
                                value={""}
                                style={{ 'border': `2px solid #f96049`, 'width' : `45px` , 'user-select' : `none`, 'height' : `32px` }}
                                className="mb-3"
                            />
                            <MediaHeader className={`labelfont`} style={{ color: "#172b4d" }}> 
                                {  this.props.intl.formatMessage({ id: "IDS_FILLEDEDITABLE" })}
                            </MediaHeader>
                        </Col> */}
                        <Col className='d-flex text-center'>
                            <div
                                name={'ncolumn'}
                                value={""}
                                style={{ 'border': `2px solid #7ca84c`, 'width': `45px`, 'user-select': `none`, 'height': `32px` }}
                                className="mb-3"
                            />
                            <MediaHeader className={`labelfont`} style={{ color: "#172b4d" }}>
                                {this.props.intl.formatMessage({ id: "IDS_AVAILABLE" })}
                            </MediaHeader>
                        </Col>
                        <Col className='d-flex text-center'>
                            <div
                                name={'ncolumn'}
                                value={""}
                                style={{ 'border': `2px solid #fbb0a5`, 'width': `45px`, 'user-select': `none`, 'height': `32px` }}
                                className="mb-3"
                            />
                            <MediaHeader className={`labelfont`} style={{ color: "#172b4d" }}>
                                {this.props.intl.formatMessage({ id: "IDS_CURRENTLYFILLED" })}
                            </MediaHeader>
                        </Col>
                        <Col className='d-flex text-center'>
                            <div
                                name={'ncolumn'}
                                value={""}
                                style={{ 'border': `2px solid #6347FF`, 'width': `45px`, 'user-select': `none`, 'height': `32px` }}
                                className="mb-3"
                            />
                            <MediaHeader className={`labelfont`} style={{ color: "#172b4d" }}>
                                {this.props.intl.formatMessage({ id: "IDS_CURRENTLYFOCUSED" })}
                            </MediaHeader>
                        </Col>
                    </Row>
                </Row>
                {this.props.isMultiSampleAdd ?
                    this.props.multipleSheetData.map((groupedItem, index) => {
                        return <>
                            <Row>
                                {/* {index === 0 ?
                                    <Row className='mb-1 test-box-status'>
                                        <Col className='d-flex text-center'>
                                            <div
                                                name={'ncolumn'}
                                                value={""}
                                                style={{ 'border': `2px solid #aaa`, 'width' : `45px` , 'user-select' : `none`, 'height' : `32px`, 'cursor' : `not-allowed` }}
                                                isDisabled={true}
                                                className="mb-3"
                                            />
                                            <MediaHeader className={`labelfont`} style={{ color: "#172b4d" }}>
                                                {  this.props.intl.formatMessage({ id: "IDS_FILLEDNOTEDITABLE" })} 
                                            </MediaHeader>
                                        </Col>
                                        <Col className='d-flex text-center'>
                                            <div
                                                name={'ncolumn'}
                                                value={""}
                                                style={{ 'border': `2px solid #f96049`, 'width' : `45px` , 'user-select' : `none`, 'height' : `32px` }}
                                                className="mb-3"
                                            />
                                            <MediaHeader className={`labelfont`} style={{ color: "#172b4d" }}> 
                                                {  this.props.intl.formatMessage({ id: "IDS_FILLEDEDITABLE" })}
                                            </MediaHeader>
                                        </Col>
                                        <Col className='d-flex text-center'>
                                            <div
                                                name={'ncolumn'}
                                                value={""}
                                                style={{ 'border': `2px solid #7ca84c`, 'width' : `45px` , 'user-select' : `none`, 'height' : `32px` }}
                                                className="mb-3"
                                            />
                                            <MediaHeader className={`labelfont`} style={{ color: "#172b4d" }}> 
                                                {  this.props.intl.formatMessage({ id: "IDS_AVAILABLE" })}
                                            </MediaHeader>
                                        </Col>
                                        <Col className='d-flex text-center'>
                                            <div
                                                name={'ncolumn'}
                                                value={""}
                                                style={{ 'border': `2px solid #fbb0a5`, 'width' : `45px` , 'user-select' : `none`, 'height' : `32px` }}
                                                className="mb-3"
                                            />
                                            <MediaHeader className={`labelfont`} style={{ color: "#172b4d" }}> 
                                                {  this.props.intl.formatMessage({ id: "IDS_CURRENTLYFILLED" })}
                                            </MediaHeader>
                                        </Col>
                                    </Row> : ""} */}
                                <Col md={12} className="pl-0 mt-0">
                                    <Card.Header>
                                        <Card.Title className="product-title-main mb-0">
                                            {groupedItem.value ?
                                                groupedItem.value
                                                : ""}
                                        </Card.Title>
                                    </Card.Header>
                                </Col>
                            </Row>
                            {groupedItem.items.map((item, index) => {
                                return <>
                                    <Row>
                                        <Col md={12} className="pl-0 mt-3 mb-2">
                                            <MediaHeader className={`labelfont`} style={{ color: "#007bff", fontSize: "18px" }}>
                                                {item.scontainerpath ?
                                                    item.scontainerpath
                                                    : ""}
                                            </MediaHeader>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6} className="pl-0 mt-3 mb-2">
                                            <AdditionalFieldsComponent
                                                userInfo={this.props.userInfo}
                                                nsamplestoragelocationcode={item.nsamplestoragelocationcode}
                                                enableDisableSheet={this.enableDisableSheet}
                                                nsamplestoragemappingcode={item.nsamplestoragemappingcode}
                                                isMoveScreen={this.props.isMoveScreen}
                                                AdditionalFieldsComponentData={this.props.AdditionalFieldsComponentData}
                                            />
                                        </Col>
                                    </Row>
                                    <form><div className={`test-box-wrap overflow-auto ${item.nrow === 1 ? 'test-box-single-row' : ''}`}>{Array(item.nrow).fill(0, 0, Array(item.nrow).length).map((component, rowIndex) => {
                                        return <Row className='flex-nowrap m-0'>
                                            {Array(item.ncolumn).fill(0, 0, Array(item.ncolumn).length).map((component, columnIndex) => {
                                                return (

                                                    // (this.state.sheetData[item.nsamplestoragemappingcode] &&
                                                    //     (this.state.sheetData[item.nsamplestoragemappingcode]
                                                    //     [this.alphabet[columnIndex] + (rowIndex + 1)] === undefined)
                                                    //     || (this.state.sheetData[item.nsamplestoragemappingcode]
                                                    //     [this.alphabet[columnIndex] + (rowIndex + 1)] === "")) &&
                                                    <CustomComponent
                                                         //Added by jana BGSI work
                                                        nsamplestoragecontainerpathcode={item.nsamplestoragecontainerpathcode}
                                                        availablepsacechange={this.availablepsacechange}
                                                        userInfo={this.props.userInfo}
                                                        columnIndex={columnIndex}
                                                        ndirectionmastercode={item.ndirectionmastercode}
                                                        handleKeyDown={(e) => this.handleKeyDown(e, item.nrow, item.ncolumn,
                                                            item.ndirectionmastercode)}
                                                        Rows={item.nrow}
                                                        columns={item.ncolumn}
                                                        rowIndex={rowIndex}
                                                        nsamplestoragelocationcode={item.nsamplestoragelocationcode}
                                                        nsamplestoragemappingcode={item.nsamplestoragemappingcode}
                                                        nprojecttypecode={item.nprojecttypecode}
                                                        nquantity={item.nquantity}
                                                        sunitname={item.sunitname}
                                                        nbarcodedescription={this.props.nbarcodedescription}
                                                        nbarcodeLength={this.props.nbarcodeLength}
                                                        sheetData={this.props.sheetData}
                                                        childSheetDataChange={this.props.childSheetDataChange}
                                                        isMultiSampleAdd={this.props.isMultiSampleAdd}
                                                        isDisabled={this.props.isMoveScreen? true:
                                                            item.ndirectionmastercode === 1 ?
                                                                this.state.sheetData[item.nsamplestoragemappingcode] ?
                                                                    ((this.state.sheetData[item.nsamplestoragemappingcode]
                                                                    [this.alphabet[rowIndex] + (columnIndex + 1)] === undefined)
                                                                        || (this.state.sheetData[item.nsamplestoragemappingcode]
                                                                        [this.alphabet[rowIndex] + (columnIndex + 1)] === "") ?
                                                                        false : true) : false :
                                                                this.state.sheetData[item.nsamplestoragemappingcode] ?
                                                                    (((this.state.sheetData[item.nsamplestoragemappingcode]
                                                                    [this.alphabet[columnIndex] + (rowIndex + 1)] === undefined)
                                                                        || (this.state.sheetData[item.nsamplestoragemappingcode]
                                                                        [this.alphabet[columnIndex] + (rowIndex + 1)] === "")) ? false :
                                                                        true) : false
                                                        }
                                                        boxWidth={this.props.sbarcodeboxWidth}
                                                    //boxWidth ="100px"

                                                    />
                                                )

                                            })}
                                        </Row>
                                    })}
                                    </div></form></>
                            })}

                        </>
                    }) :
                    <>     <Col md={12} className="pl-0 mt-3 mb-2">
                        <AdditionalFieldsComponent
                            userInfo={this.props.userInfo}
                            nsamplestoragelocationcode={this.props.editedsheetData.nsamplestoragelocationcode}
                            enableDisableSheet={this.enableDisableSheet}
                            isMoveScreen={this.props.isMoveScreen}
                            nsamplestoragemappingcode={this.props.editedsheetData.nsamplestoragemappingcode}
                            AdditionalFieldsComponentData={this.props.AdditionalFieldsComponentData}
                        />
                        <form>
                            <div className='test-box-wrap overflow-auto'>
                                {this.Rows.map((component, rowIndex) => {
                                    return <Row className='flex-nowrap m-0'>
                                        {this.columns.map((component, columnIndex) => {
                                            return (
                                                <CustomComponent
                                                    //Added by jana BGSI work
                                                    nsamplestoragecontainerpathcode={this.props.editedsheetData?.nsamplestoragecontainerpathcode || -1}
                                                    inputs={this.columns}
                                                    availablepsacechange={this.availablepsacechange}
                                                    userInfo={this.props.userInfo}
                                                    handleKeyDown={(e) => this.handleKeyDown(e, this.props.Rows, this.props.columns,
                                                        this.props.editedsheetData.ndirectionmastercode)}
                                                    Rows={this.props.Rows}
                                                    columns={this.props.columns}
                                                    ndirectionmastercode={this.props.editedsheetData.ndirectionmastercode}
                                                    npartitioncode={this.props.editedsheetData.npartitioncode}
                                                    ninstrumentcode={this.props.editedsheetData.ninstrumentcode}
                                                    columnIndex={columnIndex}
                                                    rowIndex={rowIndex}
                                                    nsamplestoragemappingcode={this.props.editedsheetData.nsamplestoragemappingcode}
                                                    nsamplestoragelocationcode={this.props.editedsheetData.nsamplestoragelocationcode}
                                                    nprojecttypecode={this.props.editedsheetData.nprojecttypecode}
                                                    nquantity={this.props.editedsheetData.nquantity}
                                                    nbarcodedescription={this.props.nbarcodedescription}
                                                    sunitname={this.props.editedsheetData.sunitname}
                                                    nbarcodeLength={this.props.nbarcodeLength}
                                                    sheetData={this.props.sheetData}
                                                    childSheetDataChange={this.props.childSheetDataChange}
                                                    isDisabled={this.props.isMoveScreen? true:
                                                        this.props.editedsheetData.ndirectionmastercode === 1 ?
                                                            this.state.sheetData ?
                                                                ((this.state.sheetData
                                                                [this.alphabet[rowIndex] + (columnIndex + 1)] === undefined)
                                                                    || (this.state.sheetData
                                                                    [this.alphabet[rowIndex] + (columnIndex + 1)] === "") ?
                                                                    false : true) : false :
                                                            this.state.sheetData ?
                                                                (((this.state.sheetData
                                                                [this.alphabet[columnIndex] + (rowIndex + 1)] === undefined)
                                                                    || (this.state.sheetData
                                                                    [this.alphabet[columnIndex] + (rowIndex + 1)] === "")) ? false :
                                                                    true) : false
                                                    }
                                                    boxWidth={this.props.sbarcodeboxWidth}
                                                //boxWidth ="100px"
                                                />
                                            )
                                        })}
                                    </Row>
                                })}</div></form>
                    </Col></>

                }
            </>
        );
    }


}
export default MatrixComponent;

