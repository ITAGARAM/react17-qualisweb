import React, { useState, useCallback, useRef } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import DropArea from "./DropArea.jsx";
import SideBarItem from "./SideBarItem";
import DynamicRow from "./Row";
import {
  handleMoveWithinParent,
  handleMoveToDifferentParent,
  handleMoveSidebarComponentIntoParent,
  handleRemoveItemFromLayout,
} from "./helpers";
import {
  SIDEBAR_ITEM,
  COMPONENT,
  COLUMN,
  COMPONENTROW,
  ROW,
} from "./constants";
import "./styles.css";
import {
  useAccordionToggle,
  Badge,
  Button,
} from "react-bootstrap";
import AccordionContext from "react-bootstrap/AccordionContext";

import DynamicFieldProperties from "./DynamicFieldProperties.jsx";
import { injectIntl } from "react-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronDown,
  faChevronUp,
  faFilter,
  faWindowClose,
  faKeyboard,
  faBuilding,
  faInfoCircle,
  faAngleDoubleDown,
  faAngleDoubleUp,
} from "@fortawesome/free-solid-svg-icons";
import shortid from "shortid";
import ComboFilterProperties from "./ComboFilterProperties.jsx";
import { ReactComponents } from "../Enumeration.js";
import DateFilterProperties from "./DateFilterProperties.jsx";
import AddSynonym from "./AddSynonym.jsx";
import FilterQueryBuilder from '../FilterQueryBuilder';
import InputFilterProperties from "../form-input/InputFilterProperties.jsx";
import KendoDatatoolFilter from '../../pages/contactmaster/KendoDatatoolFilter';
import BarcodeFieldProperties from './BarcodeFiledProperties.jsx'

const Dynamicinput = (props) => {
  const handleDropToTrashBin = useCallback(
    (event, dropZone, item, mandatoryComponents) => {
      event.preventDefault();
      event.stopPropagation();
      //const ACCEPTS = [ROW, COLUMN, COMPONENT, COMPONENTROW];
      const layout = props.layout;
      const itemPath = item.path;
      const splitItemPath = itemPath.split("-");
      const itemPathRowIndex = splitItemPath[0];
      const itemRowChildrenLength =
        layout[itemPathRowIndex] && layout[itemPathRowIndex].children.length;

      let mandatoryComponent = mandatoryComponents || [];

      // prevent removing a col when row has only one col
      if (
        item.type === COLUMN &&
        itemRowChildrenLength &&
        itemRowChildrenLength < 2
      ) {
        return false;
      }


      if (item.type === COLUMN) {
        let statusflag = false;

        item.data.children.map((item1) => {
          if (item1.templatemandatory) {
            statusflag = true;
            return false;
          };
          if (item1.type === COMPONENTROW) {
            item1.children && item1.children.map((item2) => {
              if (item2.templatemandatory) {
                statusflag = true;
                return false;
              }
            })
          } else {
            if (item1.templatemandatory) {
              //   mandatoryComponent.push(1);
              statusflag = true;
              return false;
            }
          }
        });

        if (statusflag != true) {
          props.validateDelete(
            handleRemoveItemFromLayout(props.layout, splitItemPath),
            item.path,
            true
          );
          changeActiveTabIndex(false);
          return true;
        } else {
          alert('This column has a mandatory Field. So you can not delete it!');
        }

        return validateDrop(item.data, props.layout, splitItemPath);
      } else if (item.type === COMPONENTROW) {

        let statusflag = false;
        item.data.children.map((item1) => {

          if (item1.templatemandatory) {
            mandatoryComponent.push(1);
            alert('This column has a mandatory Field. So you can not delete it!');
            statusflag = true;
            return false;
          }

        });

        if (statusflag != true) {
          props.validateDelete(
            handleRemoveItemFromLayout(props.layout, splitItemPath),
            item.path,
            true
          );
          changeActiveTabIndex(false);
          return true;
        }

        return validateDrop(item.data, props.layout, splitItemPath);

      } else {
        props.validateDelete(
          handleRemoveItemFromLayout(props.layout, splitItemPath),
          item.path,
          true
        );
        changeActiveTabIndex(false);
      }
    },
    [props.layout]
  );

  const _scrollBarRef = useRef();
  const _scrollBarChildRef = useRef();

  const height =
    _scrollBarChildRef &&
    _scrollBarChildRef.current &&
    _scrollBarChildRef.current.clientHeight;

  const validateDrop = (data, item1, splitItemPath, mandatoryComponents) => {
    let mandatoryComponent = mandatoryComponents || [];
    let statusflag = false;
    // const data = props.layout;
    if (data.children) {
      data.children.length > 0 &&
        data.children.map((item) => {
          if (item.templatemandatory) {
            mandatoryComponent.push(1);
            statusflag = true;
            return false;
          }
        });
      if (statusflag != true) {
        props.validateDelete(
          handleRemoveItemFromLayout(props.layout, splitItemPath),
          item1.path,
          true
        );
        changeActiveTabIndex(false);
        return true;
      }
    } else {
      if (data.templatemandatory) {
        mandatoryComponent.push(1);
        return false;
      }
    }
    if (mandatoryComponent.length > 0) {
      return false;
    } else {
      props.validateDelete(
        handleRemoveItemFromLayout(props.layout, splitItemPath),
        item1.path,
        true
      );
      changeActiveTabIndex(false);
      return true;
    }
  };

  // let _scrollBarRef;
  const handleDrop = useCallback(
    (dropZone, item) => {
      const splitDropZonePath = dropZone.path.split("-");
      const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");

      let newItem = { id: item.id, type: item.type };
      if (item.type === COLUMN) {
        newItem.children = item.children;
      }
      if (item.type === COMPONENTROW) {
        newItem = { ...item.data, ...newItem };
      }
      if (item.type === COMPONENT) {
        newItem = { ...item.data, type: item.type };
      }
      // sidebar into
      if (item.type === SIDEBAR_ITEM) {
        // 1. Move sidebar item into page
        const newComponent = {
          id: shortid.generate(),
          ...item.component,
        };
        const newItem = {
          id: newComponent.id,
          ...item,
          type: COMPONENT,
        };
        props.setLayout(
          handleMoveSidebarComponentIntoParent(
            props.layout,
            splitDropZonePath,
            newItem
          ),
          dropZone.path
        );
        return;
      }

      // move down here since sidebar items dont have path
      const splitItemPath = item.path.split("-");
      const pathToItem = splitItemPath.slice(0, -1).join("-");

      // 2. Pure move (no create)
      if (splitItemPath.length === splitDropZonePath.length) {
        // 2.a. move within parent
        if (pathToItem === pathToDropZone) {
          props.setLayout(
            handleMoveWithinParent(
              props.layout,
              splitDropZonePath,
              splitItemPath
            ),
            dropZone.path
          );
          return;
        }

        // 2.b. OR move different parent
        // TODO FIX columns. item includes children
        props.setLayout(
          handleMoveToDifferentParent(
            props.layout,
            splitDropZonePath,
            splitItemPath,
            newItem
          ),
          dropZone.path
        );
        return;
      }

      // 3. Move + Create
      props.setLayout(
        handleMoveToDifferentParent(
          props.layout,
          splitDropZonePath,
          splitItemPath,
          newItem
        ),
        dropZone.path
      );
    },
    [
      props.layout, // components
    ]
  );
  const renderRow = (row, currentPath, index) => {
    return (
      <DynamicRow
        key={row.id}
        data={row}
        handleDrop={handleDrop}
        deleteInput={handleDropToTrashBin}
        validateDropInput={validateDrop}
        // components={components}
        baselength={
          row.children && row.children.length ? row.children.length : 1
        }
        path={currentPath}
        index={index}
        onclickcomponent={(event, data, path) => {
          onclickcomponent(event, data, path);
          changeActiveTabIndex(3);
        }}
        selectedFieldRecord={props.selectedFieldRecord}
        slanguagetypecode={props.userinfo.slanguagetypecode}
      />
    );
  };

  const onclickcomponent = (event, data, path) => {
    props.onclickcomponent(event, data, path);
  }

  const CustomToggle = ({ children, eventKey }) => {
    const currentEventKey = React.useContext(AccordionContext);
    const isCurrentEventKey = currentEventKey === eventKey;
    const decoratedOnClick = useAccordionToggle(eventKey, "");

    return (
      <div
        className="d-flex justify-content-between accordion-button"
        onClick={decoratedOnClick}
      >
        {children}
        {isCurrentEventKey ? (
          <span className="pr-2">
            <FontAwesomeIcon icon={faChevronUp} />
          </span>
        ) : (
          <span className="pr-2">
            <FontAwesomeIcon
              icon={faChevronDown} //onClick={children.props.onExpandCall}
            />
          </span>
        )}
      </div>
    );
  };

  const [enablePin, setEnablePin] = useState(false);

  //const [splitChangeWidthPercentage, setpaneSizeChange] = useState(87);
  const changePin = () => {
    setEnablePin(!enablePin);
  };
  const [activeTabIndex, setactiveTabIndex] = useState(false);
  const changeActiveTabIndex = (val) => {
    if (val != 3) {
      props.hidePropFilter();
      setactiveTabIndex(val);
    } else if (
      props.selectedFieldRecord &&
      Object.keys(props.selectedFieldRecord).length !== 0
    ) {
      props.hidePropFilter();
      setactiveTabIndex(val);
    }
  };
  const [activeScrollTop, setactiveScrollTop] = useState(0);
  const [activeScrollview, setactiveScrollview] = useState(1);

  const activeScroll = (container) => {
    if (container) {
      //console.log("container.scrollTop", container.scrollTop);
      setactiveScrollTop(container.scrollTop);
      setactiveScrollview(
        container.scrollHeight - container.scrollTop - container.clientHeight
      );
    }
  };

  //   const paneSizeChange = (d) => {
  //     setpaneSizeChange(d)
  // }
  return (
    <div className="vertical-tab-top popup">
      {/* <div className="sideBar height-auto">
          <PerfectScrollbar>
            <div className="popup-fixed-full-width">
              <AtAccordion>
                <Accordion defaultActiveKey="InputFields">
                  <CustomToggle eventKey={"InputFields"}>
                    <MediaHeader className="pl-2">{props.intl.formatMessage({ id: "IDS_INPUTFIELDS" })}</MediaHeader>
                  </CustomToggle>
                  <AccordionCollapse eventKey={"InputFields"}>
                    <>
                      {
                        Object.values(props.reactComponents).map((sideBarItem, index) => (
                          <SideBarItem key={sideBarItem.id} data={sideBarItem} displayField={"componentname"} />
                        ))
                      }
                    </>
                  </AccordionCollapse>
                  <CustomToggle eventKey={"PredefinedComponents"}>
                    <MediaHeader className="pl-2">{props.intl.formatMessage({ id: "IDS_COMPONENTS" })}</MediaHeader>
                  </CustomToggle>
                  <AccordionCollapse eventKey={"PredefinedComponents"}>
                    <>
                      {
                        Object.values(props.reactInputFields).map((sideBarItem, index) => (
                          <SideBarItem key={sideBarItem.id} data={sideBarItem} displayField={"label"} />
                        ))
                      }
                    </>
                  </AccordionCollapse>
                </Accordion>
              </AtAccordion>
            </div>
          </PerfectScrollbar>
        </div> */}
      {/* <div> */}
      {/* <SplitterLayout borderColor="#999"
          primaryIndex={1} percentage={true}
          secondaryInitialSize={splitChangeWidthPercentage}
          onSecondaryPaneSizeChange={paneSizeChange}
        // primaryMinSize={40}
        // secondaryMinSize={20}
        > */}
      <div className="center-area flex-grow-1">
        {/* <div className="trash">
            <TrashDropZone data={props.layout} onDrop={handleDropToTrashBin} />
          </div> */}
        <div className="">
          {/* <PerfectScrollbar> */}
          <div className="popup-fixed-center-headed-full-width dropzone-popup">
            <div className="page">
              {props.layout && props.layout.map((row, index) => {
                const currentPath = `${index}`;

                return (
                  <React.Fragment key={row.id}>
                    <DropArea
                      data={{
                        path: currentPath,
                        childrenCount: props.layout.length,
                      }}
                      onDrop={handleDrop}
                      path={currentPath}
                    />
                    {renderRow(row, currentPath, index)}
                  </React.Fragment>
                );
              })}
              <DropArea
                data={{
                  path: `${props.layout.length}`,
                  childrenCount: props.layout.length,
                }}
                onDrop={handleDrop}
                isLast
                isEmpty={props.layout.length ? false : true}
              />
            </div>
          </div>
          {/* </PerfectScrollbar> */}
        </div>
      </div>
      {/* <div> */}
      {/* <div className="rightBar height-auto"> */}
      {/* <span className="pinned-image" onClick={changePin}> */}
      {/* <Image src={!enablePin ? toggleExpand : toggleCollapse} alt="sidebar" width="24" height="24" /> */}
      {/* {intl.formatMessage({ id: "IDS_PROPERTIES" })} */}
      {/* </span> */}

      {/* </div> */}
      {/* </div> */}
      {/* </SplitterLayout> */}
      {/* </div> */}
      {console.log('tabindex', activeTabIndex)}
      <div className={`vertical-tab ${activeTabIndex ? "active" : ""}${(props.showFilter && (props.selectedFieldRecord.componentcode === ReactComponents.BACKENDSEARCHFILTER || props.selectedFieldRecord.componentcode ===
        ReactComponents.FRONTENDSEARCHFILTER)) ? " propertysizemax" : ""}`}>
        <div
          className={`vertical-tab-content full-height-pager pager_wrap wrap-class ${activeTabIndex ? "active" : ""
            }`}
        >
          {/* <PerfectScrollbar containerRef = {(ref) => { _scrollBarRef.current = ref; }}> */}
          {/* <div className="sm-view-v-t "> */}
          <span
            className={` vertical-tab-close ${activeTabIndex ? "active" : ""}`}
            onClick={() => changeActiveTabIndex(false)}
          >
            <FontAwesomeIcon icon={faChevronRight} />{" "}
          </span>
          {_scrollBarRef &&
            _scrollBarRef.current &&
            _scrollBarChildRef &&
            _scrollBarChildRef.current &&
            _scrollBarChildRef.current.clientHeight >
            _scrollBarRef.current.clientHeight &&
            activeScrollTop ? (
            <span
              className="scroll-up-arrow"
              onClick={() => {
                debugger;
                _scrollBarRef.current.scrollTop = 0;
              }}
            >
              <FontAwesomeIcon icon={faAngleDoubleUp} />
            </span>
          ) : (
            ""
          )}
          {activeTabIndex && activeTabIndex == 1 ? (
            <div
              className={` vertical-tab-content-Inputs sm-view-v-t  ${activeTabIndex && activeTabIndex == 1 ? "active" : ""
                }`}
            >
              <h4 className="inner_h4">{props.intl.formatMessage({ id: "IDS_INPUTFIELDS" })}</h4>
              {/* Input Fields */}
              <PerfectScrollbar
                className="xs-view-v-t"
                onScrollY={(container) => activeScroll(container)}
                containerRef={(ref) => {
                  _scrollBarRef.current = ref;
                }}
              >
                <div className="flex-wrap dynamic-input-fields" ref={_scrollBarChildRef}>
                  {Object.values(props.reactComponents).map(
                    (sideBarItem, index) => (
                      props.BarcodeConfig ? sideBarItem.jsondata.inputtype === "combo" ? <SideBarItem
                        key={sideBarItem.id}
                        data={sideBarItem}
                        displayField={"componentname"}
                      /> : <></> : <SideBarItem
                        key={sideBarItem.id}
                        data={sideBarItem}
                        displayField={"componentname"}
                      />
                    )
                  )}
                </div>
              </PerfectScrollbar>
            </div>
          ) : (
            ""
          )}
          {activeTabIndex && activeTabIndex == 2 ? (
            <div
              className={` vertical-tab-content-components sm-view-v-t   ${activeTabIndex && activeTabIndex == 2 ? "active" : ""
                }`}
            >
              <h4 className="inner_h4"> {props.intl.formatMessage({ id: "IDS_COMPONENTS" })}</h4>
              {/* Components */}
              <PerfectScrollbar
                className="xs-view-v-t"
                onScrollY={(container) => activeScroll(container)}
                containerRef={(ref) => {
                  _scrollBarRef.current = ref;
                }}
              >
                <div className="flex-wrap dynamic-input-fields" ref={_scrollBarChildRef}>
                  {Object.values(props.reactInputFields).map(
                    (sideBarItem, index) => (
                      <SideBarItem
                        key={sideBarItem.id}
                        data={sideBarItem}
                        //'label' value change by 'sdisplayname by neeraj ALPD-5202
                        displayField={"sdisplayname"}
                      />
                    )
                  )}
                </div>
              </PerfectScrollbar>
            </div>
          ) : (
            ""
          )}

          {activeTabIndex && activeTabIndex == 3 ? (
            <div
              className={` vertical-tab-content-properties sm-view-v-t  ${activeTabIndex && activeTabIndex == 3 ? "active" : ""
                }`}
            >
              <h4 className="inner_h4">{props.intl.formatMessage({ id: "IDS_PROPERTIES" })}</h4>
              {/* Properties */}
              <PerfectScrollbar
                className="xs-view-v-t"
                onScrollY={(container) => {
                  activeScroll(container);
                }}
                containerRef={(ref) => {
                  _scrollBarRef.current = ref;
                }}
              >
                <div className="flex-wrap" ref={_scrollBarChildRef}>
                  <h5 className="d-flex text-icon-align">
                    <Badge bg="secondary">
                      {props.selectedFieldRecord.label
                        ? props.selectedFieldRecord.label
                        : props.selectedFieldRecord.componentname
                          ? props.selectedFieldRecord.componentname
                          : ""}
                    </Badge>
                    {props.showsynonym ? (
                      <Button
                        className="btn-light nobg"
                        onClick={(e) => props.addSynonym()}
                      >
                        <FontAwesomeIcon icon={faWindowClose} />
                      </Button>
                    ) : (props.selectedFieldRecord.label ||
                      props.selectedFieldRecord.componentname) &&
                      (props.selectedFieldRecord.componentcode ===
                        ReactComponents.COMBO || ReactComponents.TEXTINPUT ||
                        props.selectedFieldRecord.componentcode ===
                        ReactComponents.DATE || props.selectedFieldRecord.componentcode ===
                        ReactComponents.BACKENDSEARCHFILTER || props.selectedFieldRecord.componentcode ===
                        ReactComponents.FRONTENDSEARCHFILTER) ? (
                      <Button
                        className="btn-light nobg remover-hover"
                        onClick={() => props.showFilter ? props.hidePropFilter() : props.showPropFilter()}
                      >
                        {props.showFilter ? (
                          <FontAwesomeIcon icon={faWindowClose} /> // style={{ fontSize: "13px" }} />
                        ) : (
                          <FontAwesomeIcon
                            icon={faFilter}
                            style={{
                              fontSize: "13px",
                              color: `${(props.selectedFieldRecord.conditionArrayUI &&
                                props.selectedFieldRecord.conditionArrayUI
                                  .length > 0) ||
                                (props.selectedFieldRecord
                                  .dateConstraintArraySQL &&
                                  props.selectedFieldRecord
                                    .dateConstraintArraySQL.length > 0)
                                ? "#0470fbb6"
                                : "#212529"
                                }`,
                            }}
                          />
                        )}
                      </Button>
                    ) : (
                      ""
                    )}
                  </h5>
                  <div className="secondary-warp">
                    {props.showsynonym ? (
                      <AddSynonym
                        selectedFieldRecord={props.selectedFieldRecord}
                        onInputOnChange={props.onInputOnChange}
                        languages={props.languages}
                        addSynonym={props.addSynonym}
                        language={props.language}
                      />
                    ) : props.showFilter ? (
                      props.selectedFieldRecord.componentcode ===
                        ReactComponents.COMBO ? (
                        <ComboFilterProperties
                          onInputOnChange={props.onInputOnChange}
                          onNumericInputChange={props.onNumericInputChange}
                          selectedFieldRecord={props.selectedFieldRecord}
                          tables={props.ReactTables}
                          numericConditions={props.numericConditions}
                          stringConditions={props.stringConditions}
                          onComboChange={props.onComboChange}
                          tableColumn={props.filterColumns}
                          filterData={props.filterData || []}
                          inputFields={props.inputFields}
                          addChildMapping={props.addChildMapping}
                          valueMembers={props.valueMembers}
                          addTag={props.addTag}
                          addCondition={props.addCondition}
                          deleteCondition={props.deleteCondition}
                          staticfiltertables={props.staticfiltertables}
                          staticfiltercolumn={props.staticfiltercolumn}
                          BarcodeConfig={props.BarcodeConfig}
                        />
                      ) : props.selectedFieldRecord.componentcode === ReactComponents.TEXTINPUT
                        ? (<InputFilterProperties
                          onInputOnChange={props.onInputOnChange}
                          onNumericInputChange={props.onNumericInputChange}
                          selectedFieldRecord={props.selectedFieldRecord}
                          tables={props.ReactTables}
                          numericConditions={props.numericConditions}
                          stringConditions={props.stringConditions}
                          onComboChange={props.onComboChange}
                          tableColumn={props.filterColumns}
                          filterData={props.filterData || []}
                          inputFields={props.inputFields}
                          addChildMapping={props.addChildMapping}
                          valueMembers={props.valueMembers}
                          addTag={props.addTag}
                          addCondition={props.addCondition}
                          deleteCondition={props.deleteCondition}
                          staticfiltertables={props.staticfiltertables}
                          staticfiltercolumn={props.staticfiltercolumn}
                        />) :
                        props.selectedFieldRecord.componentcode === ReactComponents.BACKENDSEARCHFILTER ?
                          <FilterQueryBuilder
                            fields={props.fields || {}}
                            onChange={props.onChangeAwesomeQueryBuilder}
                            tree={props.awesomeTree}
                            //config={props.awesomeConfig}
                            skip={props.kendoSkip}
                            take={props.kendoTake}
                            handlePageChange={props.handlePageChange}
                            gridColumns={props.gridColumns || []}
                            filterData={props.filterDataRecord}
                            onRowClick={props.handleKendoRowClick}
                            handleExecuteClick={props.handleExecuteClick}
                            userInfo={props.userInfo}

                            static={true}
                          // controlMap={this.state.controlMap}
                          // dataState={this.state.dataState}
                          // dataStateChange={this.dataStateChange}
                          />
                          : props.selectedFieldRecord.componentcode === ReactComponents.FRONTENDSEARCHFILTER ?
                            <KendoDatatoolFilter
                              filter={props.kendoFilter}
                              handleFilterChange={props.handleFilterChange}
                              filterData={props.filterDataRecord || []}
                              skip={props.kendoSkip}
                              take={props.kendoTake}
                              handlePageChange={props.handlePageChange}
                              fields={props.fields || []}
                              gridColumns={props.gridColumns || []}
                              //onRowClick={this.handleKendoRowClick}
                              userInfo={props.userInfo}
                              static={true}

                            /> :
                            props.selectedFieldRecord.componentcode === ReactComponents.DATE? (
                              <DateFilterProperties
                                onInputOnChange={props.onInputOnChange}
                                onNumericInputChange={props.onNumericInputChange}
                                selectedFieldRecord={props.selectedFieldRecord}
                                tables={props.ReactTables}
                                dateConditions={props.dateConditions}
                                onComboChange={props.onComboChange}
                                dateComponents={props.dateComponents}
                                filterData={props.filterData || []}
                                inputFields={props.inputFields}
                                addChildMapping={props.addChildMapping}
                                valueMembers={props.valueMembers}
                                addTag={props.addTag}
                                addDateConstraints={props.addDateConstraints}
                                deleteCondition={props.deleteDateCondition}
                                userinfo={props.userinfo}
                                CurrentTime={new Date()}
                                handleDateChange={props.handleDateChange}
                                period={props.period}
                              />
                            ):""
                    ) :  props.BarcodeConfig? 
                    (
                      <BarcodeFieldProperties
                        onInputOnChange={props.onInputOnChange}
                        onNumericInputChange={props.onNumericInputChange}
                        selectedFieldRecord={props.selectedFieldRecord}
                        tables={props.ReactTables}
                        onComboChange={props.onComboChange}
                        tableColumn={props.tableColumn}
                        inputFields={props.inputFields}
                        addChildMapping={props.addChildMapping}
                        valueMembers={props.valueMembers}
                        addTag={props.addTag}
                        addSynonym={props.addSynonym}
                        BarcodeConfig={props.BarcodeConfig}
                      />
                    ): (
                      <DynamicFieldProperties
                        onInputOnChange={props.onInputOnChange}
                        onNumericInputChange={props.onNumericInputChange}
                        selectedFieldRecord={props.selectedFieldRecord}
                        tables={props.ReactTables}
                        onComboChange={props.onComboChange}
                        tableColumn={props.tableColumn}
                        inputFields={props.inputFields}
                        addChildMapping={props.addChildMapping}
                        valueMembers={props.valueMembers}
                        addTag={props.addTag}
                        addSynonym={props.addSynonym}
                        parentRadioValue={props.parentRadioValue}
                        BarcodeConfig={props.BarcodeConfig}
                        onChangeNumericInput={props.onChangeNumericInput}
                      />
                    )}
                  </div>
                </div>
              </PerfectScrollbar>
            </div>
          ) : (
            ""
          )}

          {/* </div> */}
          {/* </PerfectScrollbar> */}

          {_scrollBarRef &&
            _scrollBarRef.current &&
            _scrollBarChildRef &&
            _scrollBarChildRef.current &&
            _scrollBarChildRef.current.clientHeight >
            _scrollBarRef.current.clientHeight &&
            activeScrollview > 0 ? (
            <span
              className={`scroll-down-arrow  ${height >= _scrollBarRef.current.scrollHeight
                ? ""
                : "cursor-notallowed"
                }`}
              onClick={() => {
                _scrollBarRef.current.scrollTop = 400;
              }}
            >
              <FontAwesomeIcon icon={faAngleDoubleDown} />
            </span>
          ) : (
            ""
          )}
        </div>

        <div className="tab-head">
          <ul>
            <li
              className={`${activeTabIndex && activeTabIndex == 1 ? "active" : ""
                }`}
              onClick={() => changeActiveTabIndex(1)}
            >
              <FontAwesomeIcon icon={faKeyboard} />
              <span>{props.intl.formatMessage({ id: "IDS_INPUTFIELDS" })}</span>
              {/* Input Fields */}
            </li>
            <li
              className={`${activeTabIndex && activeTabIndex == 2 ? "active" : ""
                }`}
              onClick={() => changeActiveTabIndex(2)}
            >
              <FontAwesomeIcon icon={faBuilding} />
              <span>{props.intl.formatMessage({ id: "IDS_COMPONENTS" })}</span>
              {/* Components */}
            </li>
            <li
              className={`${props.selectedFieldRecord &&
                Object.keys(props.selectedFieldRecord).length === 0
                ? "disabled"
                : activeTabIndex && activeTabIndex == 3
                  ? "active"
                  : ""
                }`}
              onClick={() => changeActiveTabIndex(3)}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              <span>{props.intl.formatMessage({ id: "IDS_PROPERTIES" })}  </span>
              {/* Properties */}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default injectIntl(Dynamicinput);
