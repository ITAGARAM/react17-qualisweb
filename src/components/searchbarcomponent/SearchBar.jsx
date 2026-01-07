import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useRef, useEffect } from 'react';
import { Form, InputGroup, ListGroup, Media } from 'react-bootstrap';
import './SearchBar.css'
//import { ClientList, SearchAdd, MediaHeader, MediaSubHeader, MediaLabel, SearchIcon } from '../App.styles';

import { SearchIcon, MediaHeader, MediaSubHeader } from '../App.styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ListMasterWrapper } from '../list-master/list-master.styles';
import FormIconForDropDown from '../../pages/home/FormIconForDropDown';


const SearchBar = (props) => {
  const { options, onInputChange,onInputChange1, optionDisplayMember, onClickButton } = props;
  const ulRef = useRef();
  const inputRef = props.inputRef;
 // const searchValue = props.searchValue;
  const [focus, setFocus] = useState(false)
  useEffect(() => {    
    inputRef.current.focus();
    inputRef.current.value = props.searchText;
    // inputRef.current.addEventListener('keydown', (event) => { 
    //   onInputChange(event);
    //   //console.log(event)
    // });
    inputRef.current.addEventListener('keydown', (event) => {    
        if(event.key === 'Escape'){            
          onInputChange1(event);
        }
    });
    inputRef.current.addEventListener('keypress', (event) => {      
      event.stopPropagation();
      if (event.key !== '' && ulRef.current) {
        ulRef.current.style.display = 'flex';
      }
      onInputChange(event);
      //console.log(event)
    });
    inputRef.current.addEventListener('click', (event) => {
      event.stopPropagation();
      if (event.target.value !== '' && ulRef.current) {
        ulRef.current.style.display = 'flex';
        onInputChange(event, inputRef);
      }
    });
    document.addEventListener('click', (event) => {
      if (ulRef !== undefined && ulRef.current) {
        ulRef.current.style.display = 'none';
      }
    });
  }, []);

  const onClick = (inputRef, option) => {
    inputRef.current.value = "";
    onClickButton(option)
  }


  const onFocusInput = () => {
    setFocus(true)
  }

  return (
    <div className="search-bar-dropdown">
      <InputGroup className={`list-group-search ${focus ? 'searchMinFocus' : 'searchMin'}`}>


        <Form.Control
          id="search-bar"
          type="text"
          className="form-control"
          placeholder={props.intl.formatMessage({ id: "IDS_SEARCHFROMS" })}
          //"Search Forms"
          ref={inputRef}
          onChange={onInputChange}
          // onFocus={(e)=>{onFocusInput(e)}}
          // onBlur={(e)=>{setFocus(false)}}
          autoComplete="off"
          required={false}
          //value={searchValue}
        />
      </InputGroup>
      {props.pathname && props.pathname !== '/home' &&
        <ul id="results" className= {`list-group ${options.length > 0 ? 'border-bottom' : "border-bottom-0"}`} ref={ulRef}>
        <PerfectScrollbar>
          <ListMasterWrapper >
            <ListGroup as="ul"  >
              {options && options.map((option, index) => {
                return (
                  <ListGroup.Item className={`list-bgcolor`} onClick={(e) => {
                    onClick(inputRef, option);
                  }}>
                    <Media>
                      <FormIconForDropDown nformcode={option['nformcode']} index={index} option={option} />

                      <Media.Body>
                        <MediaHeader data-tooltip-id="my-tooltip" data-tooltip-content={option[optionDisplayMember]}
                        >{option[optionDisplayMember]}</MediaHeader>
                      </Media.Body>
                    </Media>
                  </ListGroup.Item>
                  // <button
                  //   type="button"
                  //   key={index}
                  //   onClick={(e) => {
                  //     onClick(inputRef, option);
                  //   }}
                  //   className="list-group-item list-group-item-action"
                  // >
                  //   {option[optionDisplayMember]}
                  // </button>
                );
              })}
              {/* </ul> */}
            </ListGroup>
          </ListMasterWrapper>
          
          </PerfectScrollbar>
        </ul>
      }
    </div>
  );
};

export default SearchBar;