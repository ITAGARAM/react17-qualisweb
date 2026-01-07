import React from 'react';
import { Form } from 'react-bootstrap';
import { ColorPicker } from '@progress/kendo-react-inputs';
import {AtPickerWrap} from '../form-color-picker/form-kendo-color-picker.styles';

const FormKendoColorPicker = ({
  name,
  id,
  type,
  onChange,
  className,
  value,
  view,
  defaultValue,
  label,
  disabled,
  isMandatory,
  errors,
  
  ...props 
}) => (
  <React.Fragment>
    <AtPickerWrap className="fkc-picker-wrap">
      <Form.Group className="floating-label">
        <Form.Label htmlFor={name}>{label}{ isMandatory && <sup>*</sup>}</Form.Label>
        <ColorPicker 
        //View Options: combo | gradient | palette
        name={name}
        id={name}
        view={view}
        defaultValue={'green'}
        disabled={disabled}
        onChange={onChange}
        open={true}
        />

        <Form.Control.Feedback type="invalid">
            { errors }
        </Form.Control.Feedback>
      </Form.Group>
    </AtPickerWrap>
  </React.Fragment>
  );

export default FormKendoColorPicker;
