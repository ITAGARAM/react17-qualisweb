import { connect } from 'react-redux';
import * as React from 'react';
import { Sortable } from "@progress/kendo-react-sortable";
import { updateStore } from '../../actions';
import { formSortingService1, moduleSortingOrder1 } from '../../actions';

const mapStateToProps = state => {
  return ({ Login: state.Login })
}
const NestedSortableUI = (props) => {
  const { style, attributes, dataItem, forwardRef, isActive } = props;
  return (
    <div
      ref={forwardRef}
      {...attributes}
      style={{
        ...style,
        border: isActive ? "2px dashed black" : 0,
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: 1,
        paddingRight: 1,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(6, 83, 248, 0.918)",
          color: "white",
          height: 30,
          border: "1px solid black",
        }}
      >
        {dataItem.sformname}
        
      </div>
    </div>
  );
};
class SortableItemUI extends React.Component {
  constructor(props) {
    super(props)
    this.props.Login.boolValue !== 2 ?
    this.state = {
      colors: this.props.dataItem.data.map((item) => ({
        nsorter: item.nsorter,
        sformname: item.sdisplayname,
      })),
    } :
    this.state = {
      colors: this.props.dataItem.data.map((item) => ({
        nsorter: item.nsorter,
        sformname: item.sdisplayname,
      })),
    }
  }

onDragEnd = (event) => {
  let changedSorter = event.newState;
  let beforeSorter = this.state.colors;

let afterSorting = [];
beforeSorter.map((item, index)=>{
return(
  changedSorter.map((item1, index1)=>{
    if(index==index1){
      afterSorting[index]={
        nsorter: item.nsorter,
        sformname: item1.sformname
      }
    }      
    }
    ))
  })

    this.setState({colors: afterSorting,});
    this.props.Login.boolValue !== 2 ?
     this.props.formSortingService1({
       inputData: {
          userinfo: this.props.Login.userInfo,
          primarykey: this.props.dataItem.data[0].nmenucode,
          nmodulecode: this.props.dataItem.data[0].nmodulecode,
          changedValues : afterSorting
      },
      masterData: this.props.masterData,
      url: "sorting/updateForms"
  }) :
  this.props.moduleSortingOrder1({
    inputData: {
       userinfo: this.props.Login.userInfo,
       primarykey: this.props.dataItem.data[0].nmenucode,
      changedValues : afterSorting
   },
   masterData: this.props.masterData,
   url: "sorting/updateModules"
});
   }

  
  onNavigate = (event) => {
    this.setState({
      colors: event.newState,
    });
  };

  render() {
    const { style, attributes, dataItem, forwardRef } = this.props;
    return (
      <div
        ref={forwardRef}
        {...attributes}
        style={{
                ...style,
                float: "left",
                display: "inline-block",
                width: 350,
                backgroundColor: "#FFF",
                marginTop: 50,
                marginLeft:210,
                marginRight:-188,
                marginBottom:20,
                border: "1px solid black",
                textAlign: "center"
        }}
      >
        {dataItem.name}
      <Sortable
      idField={"sformname"}
      data={this.state.colors}
      itemUI={NestedSortableUI}
      onNavigate={this.onNavigate}
      onDragEnd={this.onDragEnd}
      />
      </div>
    );
  }

  componentDidUpdate(previousProps){
    if(previousProps.dataItem.name !== this.props.dataItem.name)
    {
      this.props.Login.boolValue !== 2 ?
      this.setState({
        colors: this.props.dataItem.data && this.props.dataItem.data.map((item) => ({
          nsorter: item.nsorter,
          sformname: item.sdisplayname,
        })), 
      }) :
      this.setState({
        colors: this.props.dataItem.data.map((item) => ({
          nsorter: item.nsorter,
          sformname: item.sdisplayname,
        })), 
      }) 
    }
  }
}

export default connect(mapStateToProps,{updateStore, formSortingService1, moduleSortingOrder1})(SortableItemUI);