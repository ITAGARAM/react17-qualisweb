import React from 'react';
import { forwardRef, useRef, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import withClickOutside from './withClickOutside';
import './ButtonDropdownCss.css'
import { Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faArrowRight, faGreaterThan } from '@fortawesome/free-solid-svg-icons';
import { createRef } from 'react';




const ButtonMultiSelectDropDown = forwardRef(({
    show, setShow, options, groupingKey,
    groupingDisplayname, value, label, onClick }, ref) => {

    let listData = []
    let count = 0;

    const onClick1 = (e, item, type, check, prevent) => {
     
        if (prevent) {
            e.preventDefault();
        } else {
            e.stopPropagation();
        }

        let list = value;
        if (type === 1) {
            if (check) {
                list = list.filter(x => x.value !== item.value)
            } else {
                list.push(item)
            }
        } else if (type === 2) {
            if (check) {
                list = list.filter(x => x.item[groupingKey] !== item.item[groupingKey])
            } else {
                list = list.filter(x => x.item[groupingKey] !== item.item[groupingKey])
                const list1 = options.filter(x => x.item[groupingKey] === item.item[groupingKey])
                list = [...list, ...list1]
            }

        }
        onClick(list);
    }
    return (
        <div className="sqlbuilder-dropdown dropdown" ref={ref}>
            <button className={`btn btn-primary dropdown-toggle ${show ? "show" : ""}`} onClick={e => setShow(!show)} type="button" id="dropdownMenuButton"
                data-mdb-toggle="dropdown" aria-expanded="false">
                {value.length === options.length ? "All " + label : value.length + " " + label}
            </button>
            <ul className={`dropdown-menu ${show ? "show" : ""}`} aria-labelledby="dropdownMenuButton">

                {options.map((item, index) => {
                    if (listData.findIndex(x => item.item[groupingKey] === x.item[groupingKey]) === -1) {
                        listData = options.filter(x => item.item[groupingKey] === x.item[groupingKey])
                        count = 1;
                    } else if (listData.length > 1
                        && listData.length !== options.length) {
                        count = 2;
                    }
                    if (listData.length > 1
                        && listData.length !== options.length && count === 1) {
                        return <li>
                            <div className='is-flex mb-1 is-justify-content-space-between has-text-weight-bold'>
                                <span className={' has-text-black '}>
                                    <a className="dropdown-item" >
                                        {item.item[groupingDisplayname]}
                                    </a>
                                </span>
                                <span className={'icon mr-3'}>
                                    <FontAwesomeIcon className='mt-2' icon={faAngleRight} />
                                </span>
                            </div>
                            <ul className="dropdown-menu dropdown-submenu">
                                <li >
                                    <div className={'mb-1 py-0 dropdown-item'}>
                                        <div className='control'>
                                            <label className={'checkbox has-text-weight-light is-size-6'}>
                                                <input type="checkbox" className={'mr-3'}
                                                    style={{ "transform": "scale(1.25)" }}
                                                    onClick={(e) => {
                                                        onClick1(e, item, 2,
                                                            (listData.length === value.filter(x => x.item[groupingKey] === item.item[groupingKey]).length ? true : false))
                                                    }}
                                                    checked={listData.length === value.filter(x => x.item[groupingKey] === item.item[groupingKey]).length ? true : false} />

                                                <span onClick={(e) => {
                                                    onClick1(e, item, 2,
                                                        (listData.length === value.filter(x => x.item[groupingKey] === item.item[groupingKey]).length ? true : false), true)
                                                }}>
                                                    {"Select All"}
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="mx-3 my-2" data-v-671a1db2="" style={{ "border-bottom": "1px solid rgb(244, 244, 244)" }} />
                                </li>

                                {listData.map((item1, index1) => {

                                    return <li >
                                        <div className={'mb-1 py-0 dropdown-item'}>
                                            <div className='control'>
                                                <label className={'checkbox has-text-weight-light is-size-6'}>
                                                    <input type="checkbox" className={'mr-3'}
                                                        style={{ "transform": "scale(1.25)" }}
                                                        onClick={(e) => { onClick1(e, item1, 1, value.findIndex(x => x.value === item1.value) !== -1 ? true : false) }}
                                                        checked={value.findIndex(x => x.value === item1.value) !== -1 ? true : false} />

                                                    <span onClick={(e) => { onClick1(e, item1, 1, value.findIndex(x => x.value === item1.value) !== -1 ? true : false, true )}}>
                                                        {item1.label}
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </li>

                                })
                                }
                            </ul>
                        </li>
                    } else if (count === 1) {
                        // console.log(value)
                        return <>
                            {index === 0 ?
                                <li >
                                    <div className={'mb-1 py-0 dropdown-item'}>
                                        <div className='control'>
                                            <label className={'checkbox has-text-weight-light is-size-6'}>
                                                <input type="checkbox" className={'mr-3'}
                                                    style={{ "transform": "scale(1.25)" }}
                                                    onClick={(e) => { onClick1(e, item, 2, value.length === options.length ? true : false) }}
                                                    checked={value.length === options.length ? true : false} />

                                                <span onClick={(e) => { onClick1(e, item, 2, value.length === options.length ? true : false, true) }}>
                                                    {"Select All"}
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="mx-3 my-4" data-v-671a1db2="" style={{ "border-bottom": "1px solid rgb(244, 244, 244)" }} />
                                </li> : ""
                            }
                            <li >
                                <div className={'mb-1 py-0 dropdown-item'}>
                                    <div className='control'>
                                        <label className={'checkbox has-text-weight-light is-size-6'}>
                                            <input type="checkbox" className={'mr-3'}
                                                style={{ "transform": "scale(1.25)" }}
                                                onClick={(e) => { onClick1(e, item, 1, value.findIndex(x => x.value === item.value) !== -1 ? true : false) }}
                                                checked={value.findIndex(x => x.value === item.value) !== -1 ? true : false} />

                                            <span onClick={(e) =>  onClick1(e, item, 1, value.findIndex(x => x.value === item.value) !== -1 ? true : false, true) }
                                            >
                                                {item.label}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </li>
                        </>
                    }
                })

                }
            </ul>
        </div>






        // <Dropdown>
        //     <Dropdown.Toggle variant="success" id="dropdown-basic">
        //         {"column selected"}
        //     </Dropdown.Toggle>
        //     <Dropdown.Menu>
        //         <Dropdown.Item href="#/action-1">
        //             <Dropdown.Toggle  id="dropdown-basic1">
        //                 {"column selected"}
        //             </Dropdown.Toggle>
        //             <Dropdown.Menu>
        //                 <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
        //                 <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
        //                 <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
        //             </Dropdown.Menu>
        //         </Dropdown.Item>
        //         <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
        //         <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
        //         <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
        //     </Dropdown.Menu>
        // </Dropdown>
    );
}
)

export default withClickOutside(ButtonMultiSelectDropDown);