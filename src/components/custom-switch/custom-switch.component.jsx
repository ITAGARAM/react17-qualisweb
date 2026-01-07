import React from 'react';
import { Form } from 'react-bootstrap';
const CustomSwitch = ({
    name,
    type,
    onChange,
    className,
    value,
    parentClassName,
    labelClassName,
    // error,
    isMandatory,
    children,
    label,
    ...props
}) => (
        <React.Fragment>
            <Form.Group className={parentClassName}>
                <Form.Label className={labelClassName} htmlFor={name}>{label}{isMandatory && <sup>*</sup>}</Form.Label>

                <Form.Switch
                    type={type}
                    name={name}
                    label={""}
                    id={name}
                    // error={error}
                    required={props.required}
                    onChange={onChange}
                    defaultValue={props.defaultValue}
                    checked={props.checked}
                    className={className}
                    disabled={props.disabled}
                />
            </Form.Group>
        </React.Fragment>
    );
CustomSwitch.defaultProps = {
    type: "switch",
    className: "custom-switch-md"
}

export default CustomSwitch;