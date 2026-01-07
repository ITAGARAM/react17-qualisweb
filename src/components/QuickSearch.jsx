import React from 'react'
import {
    faCaretDown, //faCheckCircle, faCheck, faMinusCircle 
} from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
//import MinusCircle from '../assets/image/circle-neutral.svg';           
import { ReactComponent as MinusCircle} from '../assets/image/circle-neutral.svg';     
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import { Button, ListGroup, Overlay, Popover, Image } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { transactionStatus } from './Enumeration';
import { faCircle as farFaCircle } from '@fortawesome/free-regular-svg-icons'
import '../pages/registration/registration.css';
//import { Tooltip } from '@progress/kendo-react-tooltip';
// import ReactTooltip from 'react-tooltip';

const QuickSearch = (props) => {
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
    const itemClick = (ntransactionStatus, props) => {
        setQuickShow(!quickShow);
        props.selectMultiple(ntransactionStatus, { ...props.inputParam });
    }
    let { checkStatus } = props;
    return (

        <div ref={ref}>
            {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
            {/* <ReactTooltip place="bottom" /> */}
            <Button className="no-btn-style groupedIcons-custom" onClick={handleQuickClick}
                data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_QUICKFILTER" })} data-place="right">
                {checkStatus === 'partial' ? <MinusCircle width="20" height="20" className="custom-fa" />   :
                    checkStatus === 'all' ? <FontAwesomeIcon className="custom-fa" icon={farCheckCircle} /> : <FontAwesomeIcon className="check-circle" icon={farFaCircle} />}
                <FontAwesomeIcon icon={faCaretDown} />
            </Button>
            {/* </Tooltip> */}
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
                        <ListGroup.Item as="li" onClick={() => itemClick(transactionStatus.ALL, props)}>
                            {`${props.intl.formatMessage({ id: "IDS_ALL" })}`}
                        </ListGroup.Item>
                        <ListGroup.Item as="li" onClick={() => itemClick(transactionStatus.NA, props)}>
                            {`${props.intl.formatMessage({ id: "IDS_NONE" })}`}
                        </ListGroup.Item>
                        {props.selectionList && props.selectionList.map(item => {
                            return (
                                item[props.selectionField] > transactionStatus.ALL &&
                                <ListGroup.Item as="li" onClick={() => itemClick(item[props.selectionField], props)}>
                                    <span className="square-indicator" style={{ backgroundColor: item.scolorhexcode !==undefined? item.scolorhexcode : item[props.selectionColorField] }}></span>{`${item[props.selectionFieldName]}`}
                                </ListGroup.Item>
                            )
                        }
                        )}
                    </ListGroup>
                </Popover>
            </Overlay>
        </div >
    )
}
export default injectIntl(QuickSearch);
