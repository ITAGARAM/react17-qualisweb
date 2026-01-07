import React from 'react';
import { injectIntl } from 'react-intl';
import {Accordion, Card, useAccordionToggle} from "react-bootstrap";
import AccordionContext from "react-bootstrap/AccordionContext";
import {AtAccordion} from '../custom-accordion/custom-accordion.styles';
// import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontIconWrap } from '../data-grid/data-grid.styles';

const CustomToggle = ({ children, eventKey}) => {
  const currentEventKey = React.useContext(AccordionContext);
  const isCurrentEventKey = currentEventKey === eventKey;
  const decoratedOnClick = useAccordionToggle( eventKey,
      () => isCurrentEventKey ? "" : children.props.onExpandCall()
    );

 
  return (
      <div
        className="d-flex justify-content-between"
        // style={{ backgroundColor: isCurrentEventKey ? "orange" : "pink" }}
        // className={classNames('myDefaultStyling', {'myCollapsedStyling': isCurrentEventKey})}
        onClick={decoratedOnClick}>
        {children}
        {isCurrentEventKey ? 
            <FontAwesomeIcon icon={faChevronUp}/>
          : <FontAwesomeIcon icon={faChevronDown} //onClick={children.props.onExpandCall}
                                              />}
      </div>
    );
}

const CustomAccordion = (props) => { 
  const keys = [...props.accordionComponent.keys()];

    return (
      <AtAccordion>
        <Accordion activeKey={String(props.selectedKey)}>
          <Card className='border-0'>
            { keys.map((item, index) =>{
              const accordionObject = props.accordionComponent.get(item)["props"][props.accordionObjectName];
                return(<> 
                  <Card.Header>
                    <CustomToggle eventKey={String(accordionObject[props.accordionPrimaryKey])}>
                      <Card.Title className='flex-grow-1'  onExpandCall={()=> props.accordionClick({...props.inputParam, [props.accordionObjectName]:accordionObject})}> 
                   
                        { accordionObject[props.accordionTitle]}
                        {props.clickIconGroup ? 
                          // onClick={() => props.deleteModalTest()
                          <FontIconWrap className="d-font-icon action-icons-wrap" data-tooltip-id="my-tooltip" data-tooltip-content={props.intl&&props.intl.formatMessage({ id: "IDS_DELETE" })}
                          ><a onClick={()=>props.deleteAccordion({[props.accordionObjectName]:accordionObject})} class="float-right mr-3">
                          <FontAwesomeIcon icon={faTrashAlt} />
                       </a></FontIconWrap>
                                 : ""}
                      </Card.Title>
                    </CustomToggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey={String(accordionObject[props.accordionPrimaryKey])}>
                    <Card.Body>
                    {props.accordionComponent.get(item)} 
                    </Card.Body>
                  </Accordion.Collapse>
               </>)})}  
          </Card>
          
      </Accordion>
    </AtAccordion>
    )}

export default injectIntl(CustomAccordion);