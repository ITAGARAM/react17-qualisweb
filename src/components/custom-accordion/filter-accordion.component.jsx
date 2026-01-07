import React from 'react';
import { injectIntl } from 'react-intl';
import { Accordion, Card, useAccordionToggle } from "react-bootstrap";
import AccordionContext from "react-bootstrap/AccordionContext";
import { AtAccordion } from '../custom-accordion/custom-accordion.styles';
// import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const CustomToggle = ({ children, eventKey, callback }) => {
  const currentEventKey = React.useContext(AccordionContext);

  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey)
  );

  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <div
      className="d-flex justify-content-between"
      // style={{ backgroundColor: isCurrentEventKey ? "orange" : "pink" }}
      // className={classNames('myDefaultStyling', {'myCollapsedStyling': isCurrentEventKey})}
      onClick={decoratedOnClick}>
      {children}
      {isCurrentEventKey ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />}
    </div>
  );
}

const FilterAccordion = (props) => {

  return (
    <AtAccordion>
      <Accordion defaultActiveKey="0" className={props.className}>
        <Card>
          {props.filterComponent.map((filterComponent, index) => {
            return (<>
              <Card.Header>
                <CustomToggle eventKey={String(index)}>
                  <Card.Title >
                    {props.intl.formatMessage({ id: Object.keys(filterComponent)[0] })}
                  </Card.Title>
                </CustomToggle>
              </Card.Header>
              <Accordion.Collapse eventKey={String(index)}>
                <Card.Body className='filter-wrap'>
                  {Object.values(filterComponent)[0]}
                </Card.Body>
              </Accordion.Collapse>
            </>)
          })}
        </Card>

      </Accordion>
    </AtAccordion>
  )
}

export default injectIntl(FilterAccordion);