import React from 'react';
import { Form } from 'react-bootstrap';

const FormEmail = ({
    name,
    type,
    placeholder,
    onChange,
    className,
    value,
    error,
    isMandatory,
    isDisabled,
    children,
    label,
    defaultValue,
    required,
    onBlur,
    onKeyUp,
    errors,
    isInvalid,
    onKeyPress,
    ...props
}) => {
    let pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    if (value !== undefined && value !== "" && !pattern.test(value)) {
        isInvalid = true;
        errors = "Please enter valid email address.";
    }
    return (
        <React.Fragment>
            <Form.Group className="floating-label react-select-wrap" controlId={name}>
                <Form.Control
                    id={name}
                    label={label}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    onChange={onChange}
                    value={value}
                    isInvalid={isInvalid}
                    className={className}
                    defaultValue={defaultValue}
                    required={required}
                    maxLength={props.maxLength}
                    readOnly={props.readOnly}
                    disabled={isDisabled}
                    onBlur={onBlur}
                    onKeyUp={onKeyUp}
                    onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                    autoComplete="off"
                    ref={props.ref}
                />
                <Form.Label htmlFor={name}>{label}{isMandatory && <sup>*</sup>}</Form.Label>
                <Form.Control.Feedback type="invalid">
                    {errors}
                </Form.Control.Feedback>
            </Form.Group>
        </React.Fragment>
    );
    // FormInput.defaultProps = {
    //     type: "text",
    //     className: ""
    // }
}
export default FormEmail;