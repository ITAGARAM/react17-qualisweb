import React, {  useContext } from 'react';
import { Nav, useAccordionToggle } from 'react-bootstrap';
import AccordionContext from 'react-bootstrap/AccordionContext';

const ContextAwareToggle = ({ children, eventKey, callback }) => {
    const currentEventKey = useContext(AccordionContext);

    const decoratedOnClick = useAccordionToggle(eventKey, () => callback && callback(eventKey),);

    const isCurrentEventKey = currentEventKey === eventKey;

    return (
        <Nav.Link
            key={children.key}
            className={isCurrentEventKey ? 'active' : ''}
            onClick={decoratedOnClick}>
            {children}
        </Nav.Link>
    );
}
export default ContextAwareToggle;