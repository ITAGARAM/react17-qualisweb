import React from 'react'
const { faAd, faMagic, faUniversity, faAddressBook } = require("@fortawesome/free-solid-svg-icons")
const { FontAwesomeIcon } = require("@fortawesome/react-fontawesome")


const MenuIcon = (props) => {
    switch (props.nformcode) {

        case 33:
            return <FontAwesomeIcon icon={faAddressBook} size={props.size}/>
            break;

        default:
            return <FontAwesomeIcon icon={faUniversity} size={props.size}/>
            break;
    }

}

export default MenuIcon;