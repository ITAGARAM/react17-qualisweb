import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import { Button, ListGroup, Overlay, Popover, Nav } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import '../pages/registration/registration.css'
import { getStatusIcon } from './StatusIcon';
import { ReactComponent as ReportIcon } from '../assets/image/report-Icon.svg';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
//import ReportIcon from '../image/report-Icon.svg';

// component commented by L.Subashini 13/12/2025 while upgrading to React 17 
//import ReactTooltip from 'react-tooltip';

//component used by L.Subashini 13/12/2025 while upgrading to React 17
import { Tooltip } from 'react-tooltip';


const ActionPopOver = (props) => {
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
    const itemClick = (action) => {
        setQuickShow(!quickShow);
        props.dynamicButton(action);
    }

    return (<div className = "spacefromscroll" style={{ "display": props.Button && props.Button ? "inline" : "block" }} ref={ref}>
        {props.Button && props.Button ?

            <Nav.Link name="Report" style={{ "font-size": "11px" }} data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_REPORT" })} data-for="tooltip-common-wrap"
                className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                onClick={handleQuickClick}>

                <ReportIcon width="18" hieght="18" />

                {/* <Image src={ReportIcon} alt="report-Icon" width="18" hieght="18"
           className="ActionIconColor img-normalize" />*/}

                <FontAwesomeIcon icon={faCaretDown} />


            </Nav.Link>
            :
            <Button className={props.btnClasses} onClick={handleQuickClick}
            data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_CLICKFORMOREACTIONS" })} 
            data-for="tooltip-common-wrap"
            >
            <FontAwesomeIcon icon={props.icon}></FontAwesomeIcon>
            </Button>
        }
        <Overlay
            onHide={handleQuickClick}
            rootClose={true}
            show={quickShow}
            target={target}
            placement="bottom"
            container={ref.current}
        >
            <Popover id="popover-contained" className="list-styles-popover" class="float:left">
                <ListGroup as="ul" className="no-border w130">
                    {props.data.length > 0 && props.nav ?
                        props.data.map((action, key) =>
                            <ListGroup.Item as="li" key={key} className="btn_list" onClick={() => itemClick(action)}>
                                <Nav.Link className='add-txt-btn blue-text link_icons' hidden={props.userRoleControlRights && props.userRoleControlRights ? props.userRoleControlRights.indexOf(action.controlId) === -1 : false}
                                    style={{ color: action.scolorhexcode ? action.scolorhexcode : "" }}>
                                    {props.hideIcon && props.hideIcon ? "" :
                                        getStatusIcon(action.ntransactionstatus)}
                                    {/* <FontAwesomeIcon icon={props.icon}></FontAwesomeIcon> */}
                                    <span className='ml-1'>{action[props.textKey]}</span>
                                </Nav.Link>
                            </ListGroup.Item>
                        ): <>{props.data}</>}
                </ListGroup>
            </Popover>
        </Overlay>
      {/*	//ALPD-5332-->Added by Vignesh R(06-01-2025)*/ }
       

         {/* component commented by L.Subashini 13/12/2025 while upgrading to React 17 */}
        {/*  <ReactTooltip id="tooltip-common-wrap" place="top" effect="solid"/> */}

        {/* Tooltip component changed by L.Subashini 13/12/2025 while upgrading to React 17 */}
        <Tooltip id="tooltip-common-wrap" place="top"   globalEventOff='click' effect="solid" className='react-tooltip'/>

    </div >
    )
}
export default injectIntl(ActionPopOver);
