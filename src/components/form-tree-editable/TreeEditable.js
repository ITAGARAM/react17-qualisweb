import * as React from 'react';
import { injectIntl } from 'react-intl'
import { Row, Col, Form } from 'react-bootstrap';
import '@progress/kendo-react-animation'
import TreeViewEditable from '../form-tree-editable/form-tree-editable.component';

const TreeEditable = (props) => {
  return (
    <Row>
      <Col md={12}>
        <Form.Control
          id='samplestoragelocationname'
          name={"samplestoragelocationname"}
          type='text'
          label={props.intl.formatMessage({ id: "IDS_STORAGESTRUCTURENAME" })}
          placeholder={props.intl.formatMessage({ id: "IDS_ENTERSAMPLESTORAGELOCATIONNAME" })}
          autoFocus
          autoComplete="off"
          onChange={props.onInputChange}
          value={props.selectedRecord ? props.selectedRecord["samplestoragelocationname"] : ""}

        />
      </Col>
      <Col md={12}>
        <TreeViewEditable
          id="samplestoragelocation"
          name="samplestoragelocation"
          label="Sample Storage Location"
          placeholder="Enter samplestoragelocation"
          data={props.treeData}
          expandIcons={true}
          item={props.itemRender}
          onExpandChange={props.onExpandChange}
          onItemClick={props.onItemClick}
        />
      </Col>
    </Row>)
}
export default injectIntl(TreeEditable);
