import React from 'react'
import { Button, Form } from 'react-bootstrap'
const { faAd, faMagic, faUniversity, faAddressBook } = require("@fortawesome/free-solid-svg-icons")
const { FontAwesomeIcon } = require("@fortawesome/react-fontawesome")


const FormsIconForDropDown = (props) => {
    switch (props.nformcode) {

        case 33:
            return <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            
            // <Button className="btn btn-circle outline-grey ml-2" variant="link"
            //  //   onClick={() => this.props.reloadData()}
            //     // {/* title={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}  */}
            //     // data-for="tooltip_list_wrap"
            //   //  data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}
            //   >
            //     <FontAwesomeIcon icon={faAddressBook} style={{ "width": "0.6!important" }} />
            // </Button>
            //  <FontAwesomeIcon icon={faAddressBook} size={props.size}/>
            break;

        default:
            return <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
    }

}

export default FormsIconForDropDown;