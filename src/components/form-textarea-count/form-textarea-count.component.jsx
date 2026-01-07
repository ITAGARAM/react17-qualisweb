import React from 'react';
// import './form-textarea.styles';
import { Form } from 'react-bootstrap';
function LimitedTextarea({ rows, value, limit, name,
    placeholder,
    className,
    isMandatory,
    label, }) {
    const [content, setContent] = React.useState(value);
  
    const setFormattedContent = text => {
      text.length > limit ? setContent(text.slice(0, limit)) : setContent(text);
    };
  
    React.useEffect(() => {
      setFormattedContent(content);
    });
  
    return (

        <React.Fragment>
            <Form.Group className="floating-label">
                <Form.Control as="textarea" 
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    rows={rows}
                    onChange={event => setFormattedContent(event.target.value)}
                    value={content}
                    className={className}
                    autoComplete="off"
                 />
                 <Form.Label htmlFor={name} className="w-100 d-flex justify-content-between"><span>{label}{ isMandatory && <sup>*</sup>}</span><span>{content.length}/{limit}</span></Form.Label>
            </Form.Group>
        </React.Fragment>
    );
}
export default LimitedTextarea;