import React from 'react';
import { AtTableWrap } from '../client-group.styles';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, GridColumn as Column, GridNoRecords } from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';
// import ReactTooltip from 'react-tooltip';
import { Card, Col, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { FormControlStatic } from './data-grid.styles';
import { parse } from '@fortawesome/fontawesome-svg-core';
import SingleSelectionDataGrid from './SingleSelectionDataGrid';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import {
    updateStore
 } from '../../actions';
import { connect } from 'react-redux';
 
class SimpleGridWithSelection extends React.Component {
    constructor(props) {
        super(props);
        // console.log('--->---1')

        this.subChildColumnList = [{ "idsName": "IDS_TESTNAME", "dataField": "ssamplearno", "width": "150px", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            // { "idsName": "IDS_SAMPLENAME", "dataField": "Sample Name", "width": "100px" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
            //  { "idsName": "IDS_CONTAINERTYPE", "dataField": "Container Type", "width": "100px" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"}
        ];
        this.state = {
            status: false
        }
            
        this.setState({status:false})
    }
    // expandChange = (event) => {
    //      const isExpanded =true
    //     //     event.dataItem.expanded === undefined ?
    //     //         event.dataItem.aggregates : event.dataItem.expanded;

    //     // if (this.props.hasSubChild && event.value === true) {
    //         event.dataItem.expanded = true;
    //         this.props.childHandleExpandChange(event, this.props.dataState)
    //     // }
    //     // else {
    //     //     event.dataItem.expanded = !isExpanded;
    //          this.setState({ isExpanded });
    //     // }
    // }
    // componentDidMount() {
    //     // this.expandData1.bind(this);
    //     this.expandData1=() => {
    //         console.log("dash-->>", this.foo12._data[0].expanded)
    //         //this.foo.onExpandChange();
    //         let expanded = this.foo12._data[0].dataItem.expanded
    //         this.setState({ expanded: true })
    //         this.foo12._data.map((item, i) => {
    //             this.foo12._data[i].dataItem['expanded'] = {}
    //             this.foo12._data[i].dataItem['expanded'] = true
    //             this.detailBand(this.foo12._data[i]);
             
         
    //         })
    //     }
 
    //  }      
    componentDidMount() {
        // this.expandData1.bind(this);
        //console.log('--->---2')
       // this.expandData1();
 
     }   
    expandChange = (event) => {
        let change=[]

        let childfalsearray=this.props.Login.childfalsearray||[]

        const isExpanded =
            event.dataItem.expanded === undefined ?
                event.dataItem.aggregates : event.dataItem.expanded;

        if (this.props.hasSubChild && event.value === true) {
            event.dataItem.expanded = !isExpanded;
            this.setState({showChild: false})

            this.detailBand(event);


        }
        else {
            event.dataItem.expanded = !isExpanded;
            childfalsearray.push(event.dataItem)
            change = false

            this.setState({ isExpanded });
        }
        // let childfalsearray=this.props.Login.childfalsearray||[]
        //  childfalsearray.push(event.dataItem)
         let parentData =
         this.props.childList ? this.props.childList.every(item => {
             return item.expanded === true
         }) : this.props.dataResult.every(item => {
             return item.expanded === true
         })
     if (parentData === true) {
          change = true
     }
     else {
          change = false
     }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                change: change,
                childfalsearray: childfalsearray,
                checkFlag:"2"
                
            }
        }
        this.props.updateStore(updateInfo);
    }
    expandData1() {
       
        this.setState({ expanded: true })
            this.foo12._data.map((item, i) => {
        
                if ((this.foo12._data[i].dataItem['expanded'] === undefined) || (this.foo12._data[i].dataItem['expanded'] !== true)) {
                    this.foo12._data[i].dataItem['expanded'] = true

                }
                else {
                    this.foo12._data[i].dataItem['expanded'] = false

                }
                this.detailBand(this.foo12._data[i]);
            
                
            
        
            })
        
            if (this.props.Login.childfalsearray&&this.props.Login.childfalsearray.length!==0) {
                
            this.props.Login.childfalsearray.map(item =>{
                item['expanded'] = true 
                this.detailBand(item)})

    }

    }
    detailBand = (props) => {
        return (
            <Row bsPrefix="margin_class">
                <Col md={12}>
                    { this.props.hasSubChild ?
                        <SingleSelectionDataGrid 
                                hasSubChild={this.props.hasSubChild}
                                subChildDataResult={this.props.subChildDataResult && this.props.subChildDataResult || []}
                                extractedColumnList={this.props.subChildColumnList}
                                subChildSelectionChange={this.props.subChildSelectionChange}
                            subChildList={props.dataItem ? this.props.subChildList[(props.dataItem[this.props.subChildMappingField])] || []
                                : this.props.subChildList[(props[this.props.subChildMappingField])] || []}
                                subChildHeaderSelectionChange={this.props.subChildHeaderSelectionChange}
                            subChildSelectAll={this.props.subChildSelectAll}
                            selectedsubcild={this.props.selectedsubcild}

                            />
                            
                           :"" }
                </Col> </Row>
        )
    }
    render() {
       // console.log("detailband","14")
        return (

            <AtTableWrap className="at-list-table">
                {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip-samplegrid-wrap" /> */}
                {/* <Tooltip openDelay={100} position="auto" tooltipClassName="ad-tooltip" anchorElement="element" parentTitle={true}> */}
                <Grid
                //    data={this.props.childDataResult}
                    // ref={this.props.foo1}
                    ref={foo12 => this.foo12 = foo12}
                    data={process(this.props.childList, { skip: 0, take: this.props.childList.length })}
                    sortable
                    resizable
                    reorderable={false}
                    selectedField="selected"
                    expandField={this.props.expandField ? this.props.expandField : false}
                    detail={this.props.hideDetailBand ? false : this.detailBand}
                    onExpandChange={this.expandChange}
                    onSelectionChange={this.props.childSelectionChange}
                    onHeaderSelectionChange={this.props.headerSelectionChange}
                    scrollable={this.props.scrollable}
                    selectable={{
                        enabled: true,
                        drag: false,
                        cell: false,
                        mode: 'multiple'
                      }} 
                     onRowClick={this.props.rowClick}>
                    {/* <Column
                        field="selected"
                        width="50px"
                        title={this.props.title}
                        //   headerSelectionValue={this.props.selectAll}
                        headerSelectionValue={Object.values(this.props.childList).every((dd) => {
                            return dd.selected === true
                        }) ? true : false
                        }
                    /> */}
                    {/* <Column type='checkbox' width='50'></Column> */}

                    {
                    this.props.extractedColumnList.map((item, index) =>
                        <Column key={index}
                            title={this.props.intl.formatMessage({ id: item.idsName })}
                            cell={(row) => (
                                <td 
                                //data-for="tooltip-samplegrid-wrap"
                                    data-tooltip-id="my-tooltip" data-tooltip-content={row["dataItem"][item.dataField]}>
                                    {/* title={row["dataItem"][item.dataField]}> */}
                                    {item.isIdsField ? <FormattedMessage id={row["dataItem"][item.dataField]} defaultMessage={row["dataItem"][item.dataField]} />
                                        : row["dataItem"][item.dataField]}
                                </td>)}
                        />
                    )
                    }
                    
                </Grid>
                {/* </Tooltip>           */}
            </AtTableWrap>
        );
    }
}
const mapStateToProps = state => {
    return ({ Login: state.Login })
}



export default connect(mapStateToProps,{updateStore})(injectIntl(SimpleGridWithSelection));
