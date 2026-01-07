import React from 'react';
//import './form-input.styles';
import { Form } from 'react-bootstrap';

const FormCheckbox = ({
    name,
    type,
    placeholder,
    onChange,
    className,
    value,
    // error,
    isMandatory,
    children,
    label,
    ...props 
}) => (
        <React.Fragment>
            <Form.Group className="floating-label">
                <Form.Control 
                    inline
                    id={name}
                    label={label}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    onChange={onChange}
                    value={value}
                    className={className}
                    defaultValue={props.defaultValue}
                    required={props.required}
                    checked={props.checked}
                 />
                 <Form.Label htmlFor={name}>{label}{ isMandatory && <sup>*</sup>}</Form.Label>
            </Form.Group>
        </React.Fragment>
    );
    FormCheckbox.defaultProps = {
        type: "checkbox",
        className: ""
    }


export default FormCheckbox;