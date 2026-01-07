import React from 'react'
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import { Button, ListGroup, Overlay, Popover } from 'react-bootstrap';
import { injectIntl ,FormattedMessage} from 'react-intl';
import '../registration/registration.css'
import { getStatusIcon } from '../../components/StatusIcon';
import { Tooltip } from '@progress/kendo-react-tooltip';

const ActionPopOver = (props) =>{
                const [quickShow, setQuickShow] = useState(false);
                //const [show, setShow] = useState(false);
                const [target, setTarget] = useState(null);
                const ref = useRef(null);

                // const handleClick = (event) => {
                //     setShow(!show);
                //     setTarget(event.target);
                // };
                const handleQuickClick = (event) => {
                    setQuickShow(!quickShow);
                    setTarget(event.target);
                };
                const itemClick = (paramstatus , sign) => {
                    setQuickShow(!quickShow);
                    props.dynamicButton({paramstatus:paramstatus, sign:sign});
                }

                return ( <div ref={ref}>
                            <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}>
                            <Button className="btn-circle btn-primary-blue" 
                                    title={props.intl.formatMessage({id:"IDS_CLICKFORMOREACTIONS"})}
                                    style={{ display: Object.keys(props.actionDetails).length > 0 ? "flex" : "none" }}  
                                    onClick={handleQuickClick}>
                                <FontAwesomeIcon icon={faBolt}></FontAwesomeIcon>                                                    
                            </Button>
                            </Tooltip>
                            <Overlay
                                onHide={handleQuickClick}
                                rootClose={true}
                                show={quickShow}
                                target={target}
                                placement="bottom"
                                container={ref.current}
                            >
                                <Popover id="popover-contained" class="float:left">
                                    <ListGroup as="ul" className="no-border w130">
                                        {props.roleActionDetails.length > 0 &&
                                        props.roleActionDetails.map((Action) =>
                                            <ListGroup.Item as="li" onClick={() => itemClick(Action.ntransactionstatus, Action.nesignneed)}>
                                                 {getStatusIcon(Action.ntransactionstatus)}
                                                 <span className='ml-1 text-nowrap'>
                                                 <FormattedMessage id={Action.sactiondisplaystatus} defaultMessage={Action.sactiondisplaystatus} /> 
                                                 </span>
                                             {/* <FormattedMessage id={Action.sactiondisplaystatus} defaultMessage={Action.sactiondisplaystatus} />  */}
                                            </ListGroup.Item>
                                       )}
                                    </ListGroup>
                                </Popover>
                            </Overlay>
                        </div >
           ) }
export default injectIntl(ActionPopOver);
