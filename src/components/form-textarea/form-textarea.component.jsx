import React from 'react';
import './form-textarea.styles';
import { Form } from 'react-bootstrap';
import { whitespaceTrim,isValidClosedTag} from '../CommonScript';
const FormTextarea = ({
    name,
    type,
    placeholder,
    onChange,
    className,
    value,
    // error,
    errors,
    isMandatory,
    children,
    rows,
    label,
    defaultValue,
    readOnly,
    isDisabled,
    isInvalid,
    charLength,
    onBlur,
    ...props
}) => 
//SWSM-121 committed by rukshana behalf od Neeraj
{

     const handleChange = (e) => {
                const sanitized = isValidClosedTag(e.target.value);
                if (sanitized) {
                   onChange(e);
                } else {
                    e.preventDefault();
                    return;
                }
            };


return (
    <React.Fragment>
        <Form.Group className="floating-label">
            <Form.Label htmlFor={name}>{label}{isMandatory && <sup>*</sup>}</Form.Label>
            <Form.Control as="textarea"
                id={name}
                name={name}
                placeholder={placeholder}
                rows={rows}
                onChange={handleChange}//added by rukshana
                value={  value }
                className={className}
                defaultValue={defaultValue}
                maxLength={props.maxLength}
                required={false}
                readOnly={readOnly}
                disabled={isDisabled}
                autoComplete="off"
                isInvalid={isInvalid}
                style={props.style} 
               // onBlur={onBlur? (e)=>{ onChange(whitespaceTrim(e)) ;onBlur(e)}:(e)=>{  onChange(whitespaceTrim(e))}}
               onBlur={onBlur}
              // onBlurCapture={onBlur?(e)=>{onChange(whitespaceTrim(e));onBlur(e)}:(e)=>{onChange&& onChange(whitespaceTrim(e))} }
              onBlurCapture={ onBlur?(e)=>{onChange(whitespaceTrim(e));onBlur(e)}:
                (e)=>{onChange&& onChange(whitespaceTrim(e))} }
               />
            {props.showCharCount &&
                <aside style={{ fontSize: "small", float: "right" }}>
                    <span class="length">{charLength ? charLength : value ? value.length : 0}</span>
                    <span>/</span>
                    <span class="limit">{props.maxLength}</span>
                </aside>
            }
            <Form.Control.Feedback type="invalid">
                {errors}
            </Form.Control.Feedback>
        </Form.Group>
    </React.Fragment>
)};

FormTextarea.defaultProps = {
    rows: "2",
    className: ""
}
export default FormTextarea;