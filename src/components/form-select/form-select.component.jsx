import React from 'react';
import './form-select.styles';
import { Form } from 'react-bootstrap';
const FormSelect = ({
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
            <Form.Group className="form-select">
            <Form.Label htmlFor={name}>{label}{ isMandatory && <sup>*</sup>}</Form.Label>
                <Form.Control 
                        id={name}
                        name={name}
                        as={type}
                        onChange={onChange}
                        placeholder={placeholder}
                        className={className}
                        autoComplete="off"
                        >
                    <option>Select</option>
                    <option>Option-1</option>
                </Form.Control>
               
            </Form.Group>
        </React.Fragment>
    );
    FormSelect.defaultProps = {
        type: "select",
        className: ""
    }

export default FormSelect;