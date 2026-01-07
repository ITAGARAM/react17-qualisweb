import { Component } from 'react'
import FormInput from './form-input/form-input.component';
import { Col } from 'react-bootstrap';
//import TestPopOver from '../pages/ResultEntryBySample/TestPopOver';
import { intl } from './App';
import Axios from 'axios';
import { toast } from 'react-toastify';
import rsapi from '../rsapi';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";
import { faCompress } from "@fortawesome/free-solid-svg-icons";
import ReactDOM from 'react-dom'; // this is recommended 
import { samplestoragedireaction } from '../components/Enumeration'; 
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from '../actions/LoginTypes';

class CustomComponent extends Component {
    alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

    constructor(props) {
        super(props);
        this.toggleIsActive = this.toggleIsActive.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.state = {
            sheetData: this.props.sheetData,
            isActive: false,
            multiUserCheck: false
        }
    }
    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }
    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }
    handleClickOutside(event) {
        const domNode = ReactDOM.findDOMNode(this).firstChild;             
        if (!domNode || !domNode.contains(event.target)) {
            domNode.classList.remove("test-box-active");  
        } else {            
            const heightDiff = ReactDOM.findDOMNode(this).parentNode.parentNode.offsetHeight - ((this.props.rowIndex + 1) * (domNode.offsetHeight) );
            const widthDiff = ReactDOM.findDOMNode(this).parentNode.parentNode.offsetWidth - ((this.props.columnIndex + 1) * (domNode.offsetWidth) );
            domNode.classList.add("test-box-active");
            domNode.parentNode.classList.add("test-box-active-parent");
            if(this.props.rowIndex > 0){
                if(domNode.offsetHeight > heightDiff ){                
                    domNode.classList.add("test-box-active-bottom");
                }
            }            
            if(domNode.offsetWidth > widthDiff ){                
                domNode.classList.add("test-box-active-right");
            }
        }
    }
    toggleIsActive = (event) => {       
       if (event.currentTarget.classList.value.includes('test-box-expand-btn')) {
            ReactDOM.findDOMNode(this).firstChild.classList.remove("test-box-active");
        }
    };
    infoFields = [
        { "fieldName": "spositionvalue", "label": "IDS_BARCODE" },
        { "fieldName": "svisitnumbershortcode", "label": "IDS_VISITNUMBERCODE" },
        { "fieldName": "sparticipantid", "label": "IDS_PARTICIPANTID" },
        { "fieldName": "sprojectshortcode", "label": "IDS_PROJECTTYPECODE" },
        { "fieldName": "sproductshortcode", "label": "IDS_PRODUCTCODE" },
        { "fieldName": "ssampledonorshortcode", "label": "IDS_SAMPLEDONORCODE" },
        { "fieldName": "scollectiontubetypeshortcode", "label": "IDS_COLLECTIONTUBETYPECODE" }
    ];

    isDisabled = this.props.isDisabled;
    isReadOnly = this.props.isDisabled;
    style={ 
        'border-bottom': `3px solid #7ca84c`, 
        'color' : `#000000`
    };
    isDbSaved= false;

    handleEnter(event) {
        if (event.keyCode === 13) {
            const form = event.target.form;
            const index = Array.prototype.indexOf.call(form, event.target);
            form.elements[index + 1].focus();
            event.preventDefault();
        }
    }

    onInputOnChange = (event, fieldName) => {
        let sheetData = this.state.sheetData;
        let nsamplestoragemappingcode = this.props.nsamplestoragemappingcode;
        if (this.props.isMultiSampleAdd) {
            if (sheetData[nsamplestoragemappingcode] === undefined) {
                sheetData[nsamplestoragemappingcode] = {}
            }
            if (sheetData[nsamplestoragemappingcode][fieldName] === undefined) {
                sheetData[nsamplestoragemappingcode][fieldName] = {}
            }
            sheetData[nsamplestoragemappingcode][fieldName]['spositionvalue'] = event.target.value.replaceAll(' ','');
        } else {
            if (sheetData[fieldName] === undefined) {
                sheetData[fieldName] = {}
            }
            sheetData[fieldName]['spositionvalue'] = event.target.value.replaceAll(' ','');
        }
        this.props.childSheetDataChange({
            ...sheetData
        });
        this.setState({ sheetData })
    }
    autoCRUD = (inputParam, fieldName, operation, nsamplestoragemappingcode, event) => {
        this.setState({ loading: true })
        let urlArray = [];
        const url1 = rsapi().post("samplestoragetransaction/" + operation + "SampleStorageTransaction", inputParam);
        urlArray = [url1];
        Axios.all(urlArray)
            .then(response => {
                let sheetData = this.state.sheetData;
                if (this.props.isMultiSampleAdd) {
                    if (sheetData[nsamplestoragemappingcode] === undefined) {
                        sheetData[nsamplestoragemappingcode] = {}
                    }
                    if (sheetData[nsamplestoragemappingcode][fieldName] === undefined) {
                        sheetData[nsamplestoragemappingcode][fieldName] = {}
                    }
                    sheetData[nsamplestoragemappingcode][fieldName]['spositionvalue'] = response[0].data.cellData['spositionvalue'] ?
                        response[0].data.cellData['spositionvalue'] : "";
                    if (response[0].data.cellData['spositionvalue']) {
                        sheetData[nsamplestoragemappingcode][fieldName]['additionalInfo'] = response[0].data.cellData['additionalInfo'] ?
                            JSON.parse(response[0].data.cellData['additionalInfo'].value) : []
                    } else {
                        sheetData[nsamplestoragemappingcode][fieldName]['additionalInfo'] = []
                    }
                    //inputParam['spositionvalue'];
                } else {
                    if (sheetData[fieldName]) {
                        sheetData[fieldName] = {}
                    }
                    sheetData[fieldName]['spositionvalue'] = response[0].data.cellData['spositionvalue'] ?
                        response[0].data.cellData['spositionvalue'] : "";
                    if (response[0].data.cellData['spositionvalue']) {
                        sheetData[fieldName]['additionalInfo'] = response[0].data.cellData['additionalInfo'] ?
                            JSON.parse(response[0].data.cellData['additionalInfo'].value) : []
                    } else {
                        sheetData[fieldName]['additionalInfo'] = []
                    }


                    // inputParam['spositionvalue'];
                }
                // this.props.availablepsacechange(response[0].data.navailablespace);
                // this.isReadOnly = true;
                this.style={ 'border-bottom': `3px solid #ff6347` };
                let multiUserCheck = true;
                if (response[0].data.isAlreadyExists && response[0].data.isAlreadyExists === true) {
                    toast.warn(intl.formatMessage({ id: "IDS_THISPOSITIONISALREADYOCCUPIED" }));
                    this.isDisabled = true;
                }
                this.isDbSaved = true;
                this.setState({
                    sheetData,
                    loading: false,
                    multiUserCheck
                });
                this.handleKeyDown(event, this.props.Rows, this.props.columns, this.props.ndirectionmastercode);
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
                event.target.value= "";
            });

    }
    componentDidUpdate(previousProps, previousState) {
        if (this.props.sheetData !== previousProps.sheetData) {
            let sheetData = this.props.sheetData
            this.setState({ sheetData })
        }
    }

    autoSaveGetData = (sposition, spositionvalue, event) => {
        // event.stopPropagation();
        if(event.keyCode === 13){
        if (spositionvalue !== "" && this.isReadOnly === false) {
            let  jsondata={
                IDS_SAMPLEID:spositionvalue.toString().trim(),
                IDS_POSITION:sposition,
                IDS_QUANTITY:this.props.nquantity?this.props.nquantity:0,
                IDS_UNITNAME:this.props.sunitname?this.props.sunitname:""
            }
            let inputParam = {
                nsamplestoragelocationcode: this.props.nsamplestoragelocationcode,
                nsamplestoragemappingcode: this.props.nsamplestoragemappingcode,
                nprojecttypecode: this.props.nprojecttypecode,
                //Added by jana BGSI work
                nsamplestoragecontainerpathcode:this.props.nsamplestoragecontainerpathcode,
                // ncollectiontubetypecode: -1,
                // nproductcode: -1,
                // nsampledonorcode: -1,
                // nvisitnumbercode: 5,
                // sprojectshortcode:  'NA',
                // scollectiontubetypeshortcode:  'NA',
                // sproductshortcode: 'NA',
                // ssampledonorshortcode:  'NA',
                // svisitnumbershortcode: 5,
                // sparticipantid: '00026',
                sposition: sposition,
                spositionvalue: spositionvalue.toString().trim(),
                userinfo: this.props.userInfo,
                nbarcodedescription:parseInt(this.props.nbarcodedescription),
                nbarcodeLength:parseInt(this.props.nbarcodeLength),
                jsondata:JSON.stringify(jsondata),
                multiUserCheck: this.state.multiUserCheck,

				//ALPDJ21-71--Added by Vignesh(06-09-2025)--new fields added the for the partition of sample storage mapping
                npartitioncode:this.props.npartitioncode,
                ninstrumentcode:this.props.ninstrumentcode

            }
            this.autoCRUD(inputParam, sposition, 'create', this.props.nsamplestoragemappingcode, event);
        } else {
            this.handleKeyDown(event, this.props.Rows, this.props.columns, this.props.ndirectionmastercode);
        }
    }
    }
    additionalInfo = () => {
        //  console.log('--------------------->') 
        let additionalInfo = []
        let nsamplestoragemappingcode = this.props.nsamplestoragemappingcode;
        if (this.props.isMultiSampleAdd) {
            if (this.props.ndirectionmastercode === 1) {
                additionalInfo = this.state.sheetData[nsamplestoragemappingcode] ?
                    ((this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)]
                        && this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)]['additionalInfo'] ?
                        this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)]['additionalInfo'] : [])) : [];
            } else {
                additionalInfo = this.state.sheetData[nsamplestoragemappingcode] ?
                    ((this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)]
                        && this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.columnIndex]
                        + (this.props.rowIndex + 1)]['additionalInfo'] ?
                        this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.columnIndex]
                        + (this.props.rowIndex + 1)]['additionalInfo'] : [])) : [];
            }
        } else {
            if (this.props.ndirectionmastercode === 1) {
                additionalInfo = this.state.sheetData[this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)] ?
                    ((this.state.sheetData[this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)]['additionalInfo']) ?
                        this.state.sheetData[this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)]['additionalInfo'] : []) : []
            } else {
                additionalInfo = this.state.sheetData[this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)] ?
                    ((this.state.sheetData[this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)]['additionalInfo']) ?
                        this.state.sheetData[this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)]['additionalInfo'] : []) : []
            }
        }
        return additionalInfo;
    }

       //janakumar ALPD-4937 Sample Storage -> In the cell color changes.
       isActiveInfo = () => {
        let isActive;
        let nsamplestoragemappingcode = this.props.nsamplestoragemappingcode;
        if (this.props.isMultiSampleAdd) {
            if (this.props.ndirectionmastercode === samplestoragedireaction.LEFTTORIGHT) {
                isActive = this.state.sheetData[nsamplestoragemappingcode] === undefined ? true :this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)] === undefined?true:this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)]['spositionvalue'] ===''?true:false;
            } else {
                isActive = this.state.sheetData[nsamplestoragemappingcode] === undefined ? true :this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)] === undefined?true:this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)]['spositionvalue'] ===''?true:false;
            }
        } else {
            if (this.props.ndirectionmastercode === samplestoragedireaction.LEFTTORIGHT) {
                isActive = this.state.sheetData[this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)] === undefined ? true : this.state.sheetData[this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)] ['spositionvalue'] === '' ?true : false;
            } else {
                isActive = this.state.sheetData[this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)] === undefined ? true : this.state.sheetData[this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)] ['spositionvalue'] === '' ?true : false;
            }
        }

        return isActive;
    }

    boxOpen = (props) => {
        //console.log(this.props.buttonRef && this.props.buttonRef.current);

        const buttonRef=this.props.buttonRef



        this.props.buttonRef.map((x, row) => {

            x.map((y, column) => {

                const val = this.props.buttonRef[row][column].className

                if (val.includes('test-box-active')) {
                    this.props.buttonRef[row][column].classList.remove("test-box-active")
                }


            })


        })


        this.props.buttonRef[this.props.rowIndex][this.props.columnIndex].classList.add("test-box-active")
        // if (this.props.isMultiSampleAdd) {
        //     buttonRef.map((k, groupParent) => {
        //     k.map((z, group) => {

        //         z.map((x, row) => {

        //             x.map((y, column) => {

        //                 const val = buttonRef[group][row][column].current.className

        //                 if (val.includes('test-box-active')) {
        //                     buttonRef[groupParent][group][row][column].classList.remove("test-box-active")
        //                 }


        //             })


        //         })

        //     })
        // })
        //     buttonRef[this.props.parentIndex][this.props.groupIndex][this.props.rowIndex][this.props.columnIndex].current.classList.add("test-box-active")
        // } else {
        //     this.props.buttonRef.map((x, row) => {

        //         x.map((y, column) => {

        //             const val = this.props.buttonRef[row][column].className

        //             if (val.includes('test-box-active')) {
        //                 this.props.buttonRef[row][column].classList.remove("test-box-active")
        //             }


        //         })


        //     })


        //     this.props.buttonRef[this.props.rowIndex][this.props.columnIndex].classList.add("test-box-active")


        // }


        // this.buttonRef.current;
        //this.buttonRef.current.classList.add("test-box-active");
    }

    handleKeyDown = (e, nrow, ncolumn, ndirectionmastercode) => {
        let orderArray = [];
        // let activeElement = document.activeElement;
        if (ndirectionmastercode === 1) {
            Array(ncolumn).fill(0, 0, Array(ncolumn).length).map((component, columnIndex) => {
                Array(nrow).fill(0, 0, Array(nrow).length).map((component, rowIndex) => {
                    orderArray.push(this.alphabet[rowIndex] + (columnIndex + 1))
                })
            })
        } else {
            Array(nrow).fill(0, 0, Array(nrow).length).map((component, rowIndex) => {
                Array(ncolumn).fill(0, 0, Array(ncolumn).length).map((component, columnIndex) => {
                    orderArray.push(this.alphabet[columnIndex] + (rowIndex + 1))

                })
            })
        }
        if (e.keyCode === 13// && e.target.nodeName == 'SELECT'
        ) {
            var form = e.target.closest('form');
            // let duplicateOrderArray=JSON.parse(JSON.stringify(orderArray))
            let index = orderArray.sort(this.comparator).findIndex(item => item === e.target.placeholder);
            for (var i = 0; i < form.elements.length; i++) {
                let element = form.elements[i];
                if (element.placeholder === orderArray[index + 1]) {
                    // if (element.disabled) {
                    if (element.readOnly) {
                        index++;
                        i = 0;
                    } else {
                        form.elements[i].focus();
                        break;
                    }
                };
            }
        }
    }

    comparator = (a, b) => {
        return a.toString().localeCompare(b.toString(), 'en', { numeric: true })
    };

    handleFocus = (event, style) => {
        if(!event.target.readOnly && !event.target.disabled){
        event.target.classList.add('focused');
        if(event.target.classList.contains('focused')){
            if(!style["border-bottom"] === `3px solid #7ca84c`){
                this.isDbSaved = true;
            }
            event.target.style.borderBottom =`3px solid #6347FF`
        } 
    }
    }
    handleBlur = (event, style) => {
        if(!event.target.readOnly && !event.target.disabled){
        event.target.classList.remove('focused');
        if(!event.target.classList.contains('focused')){
            if(this.isDbSaved === true){
                event.target.style.borderBottom = style["border-bottom"];
            } else {
            event.target.style.borderBottom = `3px solid #7ca84c`;
            }
        }
    }
    }

    render() {
        let count = 0;
        let nsamplestoragemappingcode = this.props.nsamplestoragemappingcode;
        const groupIndex=this.props.groupIndex
        const rowIndex=this.props.rowIndex
        const columnIndex=this.props.columnIndex
        const parentIndex=this.props.parentIndex
        const isMultiSampleAdd=this.props.isMultiSampleAdd
        let buttonRef= this.props.buttonRef
        return (
            <>
                        {/* janakumar ALPD-4937 Sample Storage -> In the cell color changes.  */}
                <div className='position-relative' style={{ 'width' : this.props.boxWidth , 'min-width' : this.props.boxWidth}}>
                <div className={`p-0 test-box ${this.isActiveInfo() === true ? 'inactive-test-box' : ''} 
                    ${!Object.keys(this.additionalInfo()).length > 0 ? "test-box-available" : ''}
                     `}                        // ref={el=> 

                            
                        //     {
                        //     if (isMultiSampleAdd===true) {
                        //        // console.log('check '+this.props.groupIndex+" "+this.props.rowIndex+" "+this.props.columnIndex)
                        //        // console.log("array "+ buttonRef[this.props.parentIndex][this.props.groupIndex][this.props.rowIndex][this.props.columnIndex])
                        //         this.props.buttonRef[this.props.rowIndex][this.props.columnIndex] = el
                        //     } else {
                        //         this.props.buttonRef[rowIndex][columnIndex] = el

                        //     }
                        // }
                        // }
                        ref={el => {
                            // el can be null - see https://reactjs.org/docs/refs-and-the-dom.html#caveats-with-callback-refs
                            if (!el) return;
                    
                            console.log(el.getBoundingClientRect().width); // prints 200px
                          }}
                        // onClick={() => this.boxOpen(this.props)}
                    >
                        {Object.keys(this.additionalInfo()).length > 0
                            &&
                            <>
                                <a className='test-box-expand-btn' key={this.props.columnIndex} onClick={this.toggleIsActive}><FontAwesomeIcon icon={faExpand} /></a>
                                <a className='test-box-expand-btn test-box-collapse' key={this.props.columnIndex} onClick={this.toggleIsActive}><FontAwesomeIcon icon={faCompress} /></a>
                            </>
                        }  
                        {this.props.isMultiSampleAdd ?
                            this.props.ndirectionmastercode === 1 ?
                                <>

                                    <FormInput
                                        className={'alphabetcss'}
                                        name={'ncolumn'}
                                        // onKeyDown={this.props.handleKeyDown}
                                        onKeyDown={(event) => this.autoSaveGetData(
                                            this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1),
                                            this.state.sheetData[nsamplestoragemappingcode] &&
                                            (this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)] &&
                                                this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)]['spositionvalue'] ?
                                                this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)]['spositionvalue'] : ""), {...event})}
                                        // onBlur={(event) => this.autoSaveGetData(
                                        //     this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1),
                                        //     this.state.sheetData[nsamplestoragemappingcode] &&
                                        //     (this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)] &&
                                        //         this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)]['spositionvalue'] ?
                                        //         this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)]['spositionvalue'] : ""), event)}

                                        //label={this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)}
                                        label={<span className='d-block' style={{ width: this.props.boxWidth }}>
                                            {this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)}
                                            {/* {
                                        Object.values(this.additionalInfo()).length > 0
                                        &&  <span className="ml-2">
                                                <TestPopOver intl={intl} needIcon={true} needPopoverTitleContent={true}
                                                    infoFields={this.infoFields}
                                                    selectedObject={this.additionalInfo()}
                                                    placement={this.props.rowIndex === 0 ? 'bottom':'top'}  >
                                                </TestPopOver>
                                                </span>
                                    } */}
                                        </span>}
                                        placeholder={this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)}
                                        value={this.state.sheetData[nsamplestoragemappingcode] &&
                                            (this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)]
                                                && this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)]['spositionvalue'] ?
                                                this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)]['spositionvalue'] : "")}
                                        // style={this.state.sheetData[nsamplestoragemappingcode] && this.state.sheetData[nsamplestoragemappingcode]
                                        // [this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)] && this.state.sheetData[nsamplestoragemappingcode]
                                        // [this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)]['spositionvalue'] ?
                                        //     { 'border-bottom': `3px solid #ff6347` } : { 'border-bottom': `3px solid #7ca84c` }}
                                        style={this.style}
                                        maxLength={20}
                                        isDisabled={this.isDisabled}
                                        readOnly={this.isReadOnly}
                                        onChange={(event) => this.onInputOnChange(event, this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1))}
                                        onFocus={(event) => this.handleFocus(event, this.style)}
                                        onBlur={(event) => this.handleBlur(event, this.style)}
                                    /></>
                                :
                                <FormInput
                                    name={'ncolumn'}
                                    className={'alphabetcss'}
                                    // onBlur={(event) => this.autoSaveGetData(
                                    //     this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1),
                                    //     this.state.sheetData[nsamplestoragemappingcode] &&
                                    //     (this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)] &&
                                    //         this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)]['spositionvalue'] ?
                                    //         this.state.sheetData[nsamplestoragemappingcode]
                                    //         [this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)]['spositionvalue'] : ""), event)}
                                    // onKeyDown={this.props.handleKeyDown}
                                    onKeyDown={(event) => this.autoSaveGetData(
                                        this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1),
                                        this.state.sheetData[nsamplestoragemappingcode] &&
                                        (this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)] &&
                                            this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)]['spositionvalue'] ?
                                            this.state.sheetData[nsamplestoragemappingcode]
                                            [this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)]['spositionvalue'] : ""), {...event})}
                                    //label={this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)}
                                    label={<span className='d-block' style={{ width: this.props.boxWidth }}>
                                        {this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)}
                                        {/* {
                                        Object.values(this.additionalInfo()).length > 0
                                        &&  <span className="ml-2">
                                                  <TestPopOver intl={intl} needIcon={true} needPopoverTitleContent={true}
                                                    infoFields={this.infoFields}
                                                    selectedObject={this.additionalInfo()}
                                                    placement={this.props.rowIndex === 0 ? 'bottom':'top'}  >
                                                </TestPopOver>
                                                </span>
                                    } */}
                                    </span>}
                                    placeholder={this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)}
                                    value={this.state.sheetData[nsamplestoragemappingcode] &&
                                        (this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)]
                                            && this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)]['spositionvalue'] ?
                                            this.state.sheetData[nsamplestoragemappingcode][this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)]['spositionvalue'] : "")}
                                    // style={this.state.sheetData[nsamplestoragemappingcode]
                                    //     && this.state.sheetData[nsamplestoragemappingcode]
                                    //     [this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)] &&
                                    //     this.state.sheetData[nsamplestoragemappingcode]
                                    //     [this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)]['spositionvalue']
                                    //     ?
                                    //     { 'border-bottom': `3px solid #ff6347` } : { 'border-bottom': `3px solid #7ca84c` }}
                                    style={this.style}
                                    maxLength={20}
                                    isDisabled={this.isDisabled}
                                    readOnly={this.isReadOnly}
                                    onChange={(event) => this.onInputOnChange(event, this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1))}
                                    onFocus={(event) => this.handleFocus(event, this.style)}
                                    onBlur={(event) => this.handleBlur(event, this.style)}
                                />
                            :
                            this.props.ndirectionmastercode === 1 ?
                                <>
                                    <FormInput
                                        name={'ncolumn'}
                                        className={'alphabetcss'}
                                        // onBlur={(event) => this.autoSaveGetData(
                                        //     this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1),
                                        //     this.state.sheetData[this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)] &&
                                        //         this.state.sheetData[this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)]['spositionvalue'] ?
                                        //         this.state.sheetData[this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)]['spositionvalue'] : "", event)}
                                        // onKeyDown={this.props.handleKeyDown}
                                        onKeyDown={(event) => this.autoSaveGetData(
                                            this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1),
                                            this.state.sheetData[this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)] &&
                                                this.state.sheetData[this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)]['spositionvalue'] ?
                                                this.state.sheetData[this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)]['spositionvalue'] : "", {...event})}
                                        // label={this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)}
                                        label={<span className='d-block' style={{ width: this.props.boxWidth }}>
                                            {this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)}
                                            {/* {
                                    Object.values(this.additionalInfo()).length > 0
                                    &&  <span className="ml-2">
                                             <TestPopOver intl={intl} needIcon={true} needPopoverTitleContent={true}
                                                    infoFields={this.infoFields}
                                                    selectedObject={this.additionalInfo()}
                                                    placement={this.props.rowIndex === 0 ? 'bottom':'top'}  >
                                                </TestPopOver>
                                            </span>
                                } */}
                                        </span>}
                                        placeholder={this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)}
                                        value={(this.state.sheetData[this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)] &&
                                            this.state.sheetData[this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)]['spositionvalue']) ?
                                            this.state.sheetData[this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)]['spositionvalue'] : ""}
                                        maxLength={20}
                                        isDisabled={this.isDisabled}
                                        // style={this.state.sheetData[this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)] &&
                                        //     this.state.sheetData[this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1)]['spositionvalue'] ?
                                        //     { 'border-bottom': `3px solid #ff6347` } : { 'border-bottom': `3px solid #7ca84c` }}
                                        style={this.style}
                                        onChange={(event) => this.onInputOnChange(event, this.alphabet[this.props.rowIndex] + (this.props.columnIndex + 1))}
                                        readOnly={this.isReadOnly}
                                        onFocus={(event) => this.handleFocus(event, this.style)}
                                        onBlur={(event) => this.handleBlur(event, this.style)}
                                    /> </> :
                                <>
                                    <FormInput
                                        className={'alphabetcss'}
                                        name={'ncolumn'}
                                        // onKeyDown={this.props.handleKeyDown}
                                        onKeyDown={(event) => this.autoSaveGetData(
                                            this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1),
                                            this.state.sheetData[this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)] &&
                                                this.state.sheetData[this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)]['spositionvalue'] ?
                                                this.state.sheetData[this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)]['spositionvalue'] : "", {...event})}
                                        // onBlur={(event) => this.autoSaveGetData(
                                        //     this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1),
                                        //     this.state.sheetData[this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)] &&
                                        //         this.state.sheetData[this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)]['spositionvalue'] ?
                                        //         this.state.sheetData[this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)]['spositionvalue'] : "", event)}
                                        // style={this.state.sheetData[this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)] &&
                                        //     this.state.sheetData[this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)]['spositionvalue'] ?
                                        //     { 'border-bottom': `3px solid #ff6347` } : { 'border-bottom': `3px solid #7ca84c` }}
                                        style={this.style}
                                        // label={this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)}
                                        label={<span className='d-block' style={{ width: this.props.boxWidth }}>
                                            {this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)}
                                            {/* {
                                        Object.values(this.additionalInfo()).length > 0
                                        &&  <span className="ml-2">
                                                 <TestPopOver intl={intl} needIcon={true} needPopoverTitleContent={true}
                                                    infoFields={this.infoFields}
                                                    selectedObject={this.additionalInfo()}
                                                    placement={this.props.rowIndex === 0 ? 'bottom':'top'}  >
                                                </TestPopOver>
                                                </span>
                                    } */}
                                        </span>}
                                        placeholder={this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)}
                                        value={(this.state.sheetData[this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)] &&
                                            this.state.sheetData[this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)]['spositionvalue']) ?
                                            this.state.sheetData[this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1)]['spositionvalue'] : ""}
                                        maxLength={20}
                                        isDisabled={this.isDisabled}
                                        onChange={(event) => this.onInputOnChange(event, this.alphabet[this.props.columnIndex] + (this.props.rowIndex + 1))}
                                        readOnly={this.isReadOnly}
                                        onFocus={(event) => this.handleFocus(event, this.style)}
                                        onBlur={(event) => this.handleBlur(event, this.style)}
                                    />
                                </>
                        }
                         {Object.keys(this.additionalInfo()).length > 0
                        &&
                        <>
                            
                            <Col className="test-box-info">
                                {
                                    this.additionalInfo() && Object.keys(this.additionalInfo()).map(key =>
                                      //  item
                                       <div><span className='font-weight-bold'> { (key.includes('IDS_')? intl.formatMessage({ id: key }): key)}</span> :
                                       {this.additionalInfo()[key] }</div>
                                    )
                                }
                            </Col>
                        </>
                    }  
                        
                    </div>
                </div>
            </>
        );
    }
}
export default CustomComponent;

