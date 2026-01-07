import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { useRef, useState } from 'react';
import { Button, Overlay, Popover, ListGroup } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
// import '../pages/registration/registration.css'

const TestPopOver = (props) => {
    const [quickShow, setQuickShow] = useState(false);
    const [target, setTarget] = useState(null);
    const ref = useRef(null);
    const handleQuickClick = (event, show) => {
        // quickShow=show
        setQuickShow(show);
        setTarget(event.target);
    };
    return (

        <div className='d-inline-block' ref={ref}>
            <Button
                className="no-btn-style classHover" onClick={(event) => handleQuickClick(event, !quickShow)}
                onMouseOver={(event) => handleQuickClick(event, true)}
                onMouseOut={(event) => handleQuickClick(event, false)}
                onTouchStart={(event) => handleQuickClick(event, true)}
                onTouchEnd={(event) => handleQuickClick(event, false)}
            >
                {props.needIcon ? <FontAwesomeIcon className="custom_icons"  icon={faInfoCircle} /> : props.message}
            </Button>
            <Overlay
                onHide={(event) => handleQuickClick(event, true)}
                rootClose={true}
                show={quickShow}
                target={target}
                placement={props.placement?props.placement :"right"} 
                container={ref.current}
            >
                <Popover
                    id="popover-contained"
                    className="float:left "
                    onMouseOver={(event) => handleQuickClick(event, true)}
                    onMouseOut={(event) => handleQuickClick(event, false)}
                >
                    {props.needPopoverTitleContent?
                    props.selectedObject ?
                    <><Popover.Title className="p-2" as="h3">{props.intl.formatMessage({ id: "IDS_ADDITIONALINFO" })}</Popover.Title>
                    <Popover.Content className="float:left ">
                        <ListGroup as="ul" className="no-border" >
                            {
                                 Object.keys(props.selectedObject).map(key =>
                                    <ListGroup.Item as="li" className="p-2" style={{ backgroundColor: '#172b4d', color: 'white' }}>
                                        { (key.includes('IDS_')?props.intl.formatMessage({ id: key }): key) +' : '+ props.selectedObject[key]}
                                    </ListGroup.Item>
                                )
                            }
                        </ListGroup>
                    </Popover.Content></> 
                    :
                     <><Popover.Title className="p-2" as="h3">{props.intl.formatMessage({ id: "IDS_ADDITIONALINFO" })}</Popover.Title>
                    <Popover.Content className="float:left ">
                        <ListGroup as="ul" className="no-border" >
                            {
                                props.stringList && props.stringList.map(item =>
                                    <ListGroup.Item as="li" className="p-2" style={{ backgroundColor: '#172b4d', color: 'white' }}>
                                        {item}
                                    </ListGroup.Item>
                                )
                            }
                        </ListGroup>
                    </Popover.Content></>  :
                        <ListGroup as="ul" className="no-border" >
                            {
                                props.stringList && props.stringList.map(item =>
                                    <ListGroup.Item as="li" className="p-2" style={{ backgroundColor: '#172b4d', color: 'white' }}>
                                        {item}
                                    </ListGroup.Item>
                                )
                            }
                        </ListGroup>}  
                </Popover>
            </Overlay>
        </div >
    )
}
export default injectIntl(TestPopOver);
