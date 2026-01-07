import * as React from 'react';
import { Form, Button } from 'react-bootstrap'
import { toast } from 'react-toastify';
import { TreeView } from '@progress/kendo-react-treeview'
import { mapTree, removeItems } from '@progress/kendo-react-treelist';
import '@progress/kendo-react-animation'
import { EditableTree } from '../form-tree-editable/form-tree-editable.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  saveLocationStructure, getLocationData
} from '../../redux/actions/index';
import { connect } from 'react-redux';
//import { uuid } from 'uuidv4';
import { v4 as uuidv4 } from 'uuid';

const mapStateToProps = state => {
  return ({ Forms: state.Forms, Data: state.Data });
}

class TreeViewEditable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      toggleAction: false, treeData: [{
        text: 'root', expanded: true,
        editable: true, root: true, id: uuid()
      }]
      // , 
      // items:[{text:'Building Name', expanded: true, edit: false, 
      // items:[{text:'Floor Name', expanded: true,  edit: false, 
      // items: [{text:'Room Name', edit: false}]}]}] }]
    }
    this.txtRef = React.createRef();
  }
  // saveTree = () => {
  //   this.setEditableFalse();
  //   this.props.saveLocationStructure(this.state.treeData)
  // }

  // addChildNode = (e, clickedItem) => {
  //   let newData = mapTree(this.state.treeData, 'items', item => {
  //     if (item.id === clickedItem.id) {
  //       item.items = item.items || []
  //       item.items.push({ text: uuid(), id: uuid() })
  //       item.expanded = true
  //     }
  //     return item;
  //   });
  //   this.setState({ treeData: newData })
  // };

  // deleteNode = (clickedItem) => {
  //   if (clickedItem.root) {
  //     toast.warning('Could not delete root node!')
  //   } else {
  //     const treeData = removeItems(this.state.treeData, 'items', (item) => {
  //       return item.id === clickedItem.id;
  //     });
  //     this.setState({ treeData });
  //   }
  // };

  // duplicateNode = (e, clickedItem) => {
  //   let parentItem = {};
  //   let parentFound = false;
  //   let newData = [...this.state.treeData]
  //   mapTree(this.state.treeData, 'items', item => {
  //     if (item.items) {
  //       if (parentFound) {
  //         parentItem = item;
  //         parentFound = false;
  //       }
  //     }

  //     if (item.id === clickedItem.id) {
  //       parentFound = true;
  //     }

  //     return item;
  //   });
  //   if (parentItem.id === undefined) {

  //     newData.push({ text: uuid(), id: uuid() });
  //     this.setState({ treeData: newData })
  //   } else {
  //     newData = mapTree(this.state.treeData, 'items', item => {
  //       if (item.id === parentItem.id) {
  //         item.items.push({ text: uuid(), id: uuid() })
  //       }
  //       return item;
  //     });
  //     this.setState({ treeData: newData })
  //   }
  // };

  render() {
    // const { treeData } = this.props;

    return (
      <Form.Group >
        {/* <Button className=" btn-user btn-primary-blue" type='submit' onClick={this.saveTree} >
          <FontAwesomeIcon icon={faSave} /> { }
          <FormattedMessage id="IDS_SAVE" defaultMessage="Save" />
        </Button> */}
        <EditableTree>
          <Form.Group className="floating-label">
            {/* <Form.Control
              id='search_100'
              name='search'
              type='text'
              placeholder={'Enter Sample Storage Location Name'}
              autoFocus
              autoComplete="off"
              onChange={(e) => this.handleSearch(e)}
            /> */}
            <TreeView
              data={this.props.treeData}
              expandIcons={true}
              item={this.props.itemRender}
              onExpandChange={this.props.onExpandChange}
              onItemClick={(e) => this.props.onItemClick(e)}
              onBlur={() => this.props.handleBlur}
            />
          </Form.Group>
        </EditableTree>
      </Form.Group>);
  }

  // handleChange = (e, item) => {
  //   item.text = e.target.value;
  //   this.forceUpdate();
  // }

  // handleBlur = (e, item) => {
  //   item.editable = false;
  //   this.setState(prevState => ({
  //     toggleAction: !prevState.toggleAction
  //   }));

  // }

  // editRecord = (e, clickedItem) => {
  //   this.setState(prevState => ({
  //     toggleAction: !prevState.toggleAction
  //   }));
  // }

  // revertEntry = (e, clickedItem) => {
  //   toast.info(clickedItem);
  // }

  // itemRender = props => {
  //   if (this.state.toggleAction) {
  //     return (<>
  //       {props.item.editable ?
  //         <Form.Group className="k-editable-text-wrap">
  //           <Form.Control
  //             id={'treenode'}
  //             name={'treenode'}
  //             ref={this.txtRef}
  //             type="text"
  //             onKeyDown={e => e.stopPropagation()}
  //             value={props.item.text}
  //             autoFocus
  //             autoComplete="off"
  //             onChange={(e) => this.handleChange(e, props.item)}
  //             onBlur={(e) => this.handleBlur(e, props.item)}
  //           />
  //           {/* <span className="k-icon k-i-check k-i-checkmark" onClick={() => this.editRecord()}></span> */}
  //           {/* <span className="k-icon k-i-close k-i-x" onClick={(e) => this.revertEntry(e, props.item.text)}></span> */}
  //         </Form.Group>
  //         : <span>{props.item.text}</span>}
  //     </>)
  //   } else {

  //     return (
  //       <>
  //         {props.item ?
  //           <ul className="list-inline mb-0">
  //             <li className="list-inline-item mr-3">{props.item.text}</li>
  //             {props.item.editable ?
  //               <>
  //                 <li className="list-inline-item">
  //                   <span className="action-icon tree-level1" onClick={e => { e.stopPropagation(); this.duplicateNode(e, props.item) }}></span>
  //                 </li>
  //                 <li className="list-inline-item">
  //                   <span className="action-icon tree-level2" onClick={e => { e.stopPropagation(); this.addChildNode(e, props.item) }}></span>
  //                 </li>
  //                 <li className="list-inline-item">
  //                   <span className="k-icon k-i-edit k-i-pencil" onClick={e => { e.stopPropagation(); this.editRecord(e, props.item) }}></span>
  //                 </li>
  //                 <li className="list-inline-item">
  //                   <span className="action-icon tree-toggle" onClick={() => this.editRecord()}></span>
  //                 </li>
  //                 {/* <li className="list-inline-item">
  //                 <span className="k-icon k-i-preview k-i-eye"></span>
  //               </li>   */}
  //                 <li className="list-inline-item">
  //                   <span className="k-icon k-i-delete" onClick={e => { e.stopPropagation(); this.deleteNode(props.item) }}></span>
  //                 </li>
  //               </> : null}
  //           </ul> : ''}

  //       </>
  //     );
  //   }
  // }

  // onItemClick = (event) => {
  //   let { treeData } = this.state;
  //   let newData = mapTree(treeData, 'items', item => {
  //     if (item.editable === true) {
  //       item.editable = false;
  //     } else if (item.id === event.item.id) {
  //       item.editable = true;
  //     }
  //     return item;
  //   });
  //   this.setState({ treeData: newData });
  // }


  // setEditableFalse = () => {
  //   let { treeData } = this.state;
  //   let newData = mapTree(treeData, 'items', item => {
  //     if (item.editable === true) {
  //       item.editable = false;
  //     }
  //     return item;
  //   });
  //   this.setState({ treeData: newData });
  // }
  // onExpandChange = (event) => {
  //   event.item.expanded = !event.item.expanded;
  //   this.forceUpdate();
  // }
  // componentDidUpdate(previousProps) {
  //   if (this.props.Data.treeData !== previousProps.Data.treeData) {
  //     this.setState({
  //       treeData: this.props.Data.treeData[0],
  //     });
  //   }
  // }
  // componentDidMount() {
  //   this.props.getLocationData();
  // }
}

export default connect(mapStateToProps, { saveLocationStructure, getLocationData })(injectIntl(TreeViewEditable));
