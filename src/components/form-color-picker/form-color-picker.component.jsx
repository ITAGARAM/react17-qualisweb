import React from 'react';
import { Form } from 'react-bootstrap';
import InputColor from 'react-input-color';
import { AtColorPickerWrap } from './form-color-picker.styles';

function FormColorPicker({ 
  name,
  label,
  isMandatory,
  initialValue,
  handleChange,
  errors,
  }) {
  return (
      <React.Fragment>
        <AtColorPickerWrap>
          <Form.Group className="at-color-wrap">
              <Form.Label htmlFor={name}>{label}{ isMandatory && <sup>*</sup>}</Form.Label>
              <InputColor
                name = {name}
                initialValue={initialValue} 
                onChange={handleChange}
                label={label}
                className="form-color-picker"
              />
              <Form.Control.Feedback type="invalid">
                { errors }
              </Form.Control.Feedback>
          </Form.Group>
        </AtColorPickerWrap>
      </React.Fragment>
  );
}
export default FormColorPicker;
