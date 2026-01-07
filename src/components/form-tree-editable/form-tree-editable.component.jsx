import * as React from 'react';
import { Form } from 'react-bootstrap'
import { TreeView } from '@progress/kendo-react-treeview'
import ScrollBar from 'react-perfect-scrollbar'
import '@progress/kendo-react-animation'
import { EditableTree } from '../form-tree-editable/form-tree-editable.styles';

const TreeViewEditable = ({
  id,
  name,
  label,
  placeholder,
  required,
  data,
  selectField,
  item,
  onExpandChange,
  onItemClick,
  expandIcons,
  ...props
}) => {

    return (
      <div className='treeview-editable p-0'>
          <EditableTree className='grid-master'>
                <Form.Group>
                    {/* <h3><strong>{label}</strong></h3> */}
                    <Form.Label htmlFor={name}>{label}{required && <sup>*</sup>}</Form.Label>
                        <TreeView
                          id = {id}
                          name = {name}
                          data = {data}
                          selectField= {selectField}
                          expandIcons = {expandIcons}
                          item = {item}
                          onExpandChange = {onExpandChange}
                          onItemClick = {onItemClick}
                          focusIdField='text'
                        />
                  </Form.Group>
            </EditableTree>
        </div>);
}
export default TreeViewEditable;
