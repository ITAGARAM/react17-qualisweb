import * as React from 'react';
import { injectIntl } from 'react-intl'
import { Row, Col, Form, } from 'react-bootstrap';
import '@progress/kendo-react-animation'
import FormInput from '../../components/form-input/form-input.component';
import TreeViewEditable from '../../components/form-tree-editable/form-tree-editable.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { faBox, faBoxOpen, faFolder, faFolderOpen, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { uuid } from 'uuidv4';
import { v4 as uuid } from 'uuid';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { transactionStatus } from '../../components/Enumeration';

let selectedItem = undefined;
class AddTreeview extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      treeData: [...this.props.treeData]
    }

  }
  componentDidUpdate(previousProps) {
    if (this.props.treeData !== previousProps.treeData) {
      this.setState({ treeData: this.props.treeData });
    }
  }


  //   onItemClick = (event) => {
  //     let newData = mapTree(this.state.treeData, "items", (item) => {
  //         if (item.editable === true) {
  //             item.editable = false;
  //         } else if (item.id === event.item.id) {
  //             item.editable = true;
  //         }
  //         return item;
  //     });
  //     this.setState({ treeData: [...newData] });
  // };
  itemRender = (props) => {
    if (this.state.toggleAction) {
      return (
        <>
          {props.item.editable ? (
            <Form.Group className="k-editable-text-wrap">
              <Form.Control
                id={"nodename"}
                name={"nodename"}
                type="text"
                onKeyDown={(e) => e.stopPropagation()}
                value={props.item.text}
                autoFocus
                autoComplete="off"
                onChange={(e) => this.handleChange(e, props.item)}
                onBlur={(e) => this.handleBlur(e, props.item)}
                maxLength="50"
              />
            </Form.Group>
          ) : (
            <span>{props.item.text}</span>
          )}
        </>
      );
    } else {
      return (
        <>
          {props.item ? (
            <>
              <span className='d-flex align-items-center'>
                <span className={`normal-node text-truncate
                      ${props.item.editable ? "active-node" : ""}
                      ${props.item.expanded ? "expand-node" : "collapse-node"}
                      `} data-tooltip-id="my-tooltip" data-tooltip-content={props.item.text}>
                  {props.item.containerfirstnode ? <FontAwesomeIcon icon={faBoxOpen} /> :
                    props.item.locationlastnode ? <FontAwesomeIcon icon={faLocationArrow} /> :
                      props.item.containerlastnode ? <FontAwesomeIcon icon={faBox} /> :
                        props.item.expanded ? <FontAwesomeIcon icon={faFolderOpen} /> : <FontAwesomeIcon icon={faFolder} />}
                  {props.item.text}
                </span>
                {props.item.editable ? (
                  <>
                    <span
                      className="action-icon tree-level1"
                      data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_CLONENODE" })}
                      onClick={(e) => {
                        e.stopPropagation();
                        this.cloneNode(e, props.item);
                      }}
                    ></span>
                    <span
                      className="action-icon tree-level1"
                      data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EQUALNODE" })}
                      onClick={(e) => {
                        e.stopPropagation();
                        this.equalNode(e, props.item);
                      }}
                    ></span>
                    <span
                      className="action-icon tree-level2"
                      data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_CHILDNODE" })}
                      onClick={(e) => {
                        e.stopPropagation();
                        this.addChildNode(e, props.item);
                      }}
                    ></span>
                    <span
                      className="k-icon k-i-edit k-i-pencil ml-2"
                      data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                      onClick={(e) => {
                        e.stopPropagation();
                        this.editRecord(e, props.item);
                      }}
                    ></span>
                    {!props.item.isRoot ? (
                      <span
                        className="k-icon k-i-delete ml-2"
                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                        onClick={(e) => {
                          e.stopPropagation();
                          this.deleteNode(props.item);
                        }}
                      ></span>
                    ) : null}
                  </>
                ) : null}
              </span>
            </>
          ) : (
            ""
          )}
        </>
      );
    }
  };


  componentWillUnmount() {
    this.props.clearSearchedState();
  }

  addChildNode = (e, clickedItem) => {
    // let newData = mapTree(this.state.treeData, "items", (item) => {
    //     if (item.id === clickedItem.id) {
    //         item.items = item.items || [];
    //         item.items.push({
    //             id: uuid(),
    //             text: this.props.intl.formatMessage({ id: "IDS_LABEL" }),
    //             expanded: true,
    //             editable: false,
    //             locationlastnode: false,
    //             containerfirstnode: false,
    //             containerlastnode: false,
    //             itemhierarchy: ""
    //         });
    //     }
    //     return item;
    // });
    // this.setState({ treeData: newData });
    if (!clickedItem.items) {
      clickedItem.items = []
    }
    clickedItem.items.push({
      id: uuid(),
      text: this.props.intl.formatMessage({ id: "IDS_LABEL" }),
      expanded: true,
      editable: false,
      locationlastnode: false,
      containerfirstnode: false,
      containerlastnode: false,
      itemhierarchy: ""
    });
  };

  onItemClick = (event) => {

    if (selectedItem) {
      selectedItem.editable = false;
    }
    event.item.editable = true;
    selectedItem = event.item;
  };
  onExpandChange = (event) => {
    event.item.expanded = !event.item.expanded;
    // this.forceUpdate();
  };
  render() {
    //console.log("this.props.selectedRecord:", this.props.selectedRecord);
    return (
      <Row>
        {this.props.operation !=="addinfo" ?
        
        <Col md={12}>
          <FormSelectSearch
            name={"nstoragecategorycode"}
            formLabel={this.props.intl.formatMessage({ id: "IDS_STORAGECATEGORY" })}
            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
            options={this.props.storageCategoryList}
            value={this.props.selectedRecord["nstoragecategorycode"]}
            isMandatory={true}
            isClearable={false}
            isMulti={false}
            isSearchable={true}
            isDisabled={this.props.isOnlyDraft}
            closeMenuOnSelect={true}
            onChange={(event) => this.props.onComboChange(event, 'nstoragecategorycode', 1)}
          />
        </Col> :""}
          {this.props.operation !=="addinfo" &&
        <Col md={12}>
          <FormInput
            label={this.props.intl.formatMessage({ id: "IDS_STORAGESTRUCTURENAME" })}
            name={"ssamplestoragelocationname"}
            type="text"
            onChange={(event) => this.props.onInputChange(event)}
            placeholder={this.props.intl.formatMessage({ id: "IDS_STORAGESTRUCTURENAME" })}
            value={this.props.selectedRecord ? this.props.selectedRecord["ssamplestoragelocationname"] : ""}
            isMandatory={true}
            required={true}
            maxLength={"30"}
            isDisabled={this.props.isOnlyDraft}
          />
        </Col>
  }

        {/*this.props.operation !=="addinfo" && this.props.settings && parseInt(this.props.settings[84])!==3 ?
        <Col md={12}>
          <FormInput
            label={this.props.intl.formatMessage({ id: "IDS_STORAGESTRUCTURENAME" })}
            name={"ssamplestoragelocationname"}
            type="text"
            onChange={(event) => this.props.onInputChange(event)}
            placeholder={this.props.intl.formatMessage({ id: "IDS_STORAGESTRUCTURENAME" })}
            value={this.props.selectedRecord ? this.props.selectedRecord["ssamplestoragelocationname"] : ""}
            isMandatory={true}
            required={true}
            maxLength={"30"}
            isDisabled={this.props.isOnlyDraft}
          />
        </Col>:""*/}
        
        {/*
        //ALPDJ21-32-comment by Vignesh(23-07-2025)-->There is no need to fetch the Site ID and Instrument ID.
        {/* //ATE234 Janakumar BGSI-10->Storage Structure → Instrument id & Site combo load based on Setting table. }
        {this.props.operation !=="addinfo" && this.props.settings && parseInt(this.props.settings[84])===3 ?
        <Col md={12}>
          <FormSelectSearch
            formLabel={this.props.intl.formatMessage({ id: "IDS_INSTRUMENTID" })}
            isSearchable={true}
            name={"sinstrumentid"}
            isDisabled={false}
            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
            isMandatory={true}
            isClearable={false}
            options={this.props.InstrumentList}
            value={this.props.selectedRecord["sinstrumentid"] || ""}
            defaultValue={this.props.selectedRecord["sinstrumentid"]}
            onChange={(event) => this.props.onComboChange(event, "sinstrumentid" )}
            closeMenuOnSelect={true}
          >
          </FormSelectSearch>
        </Col>:""}*/}
        {/* Site combo load based on Setting table */}
        {this.props.operation !=="addinfo" && this.props.settings && parseInt(this.props.settings[84]) === transactionStatus.NO ?
        <Col md={12}>
         <FormSelectSearch
            formLabel={this.props.intl.formatMessage({ id: "IDS_SITENAME" })}
            isSearchable={true}
            name={"ssitename"}
            isDisabled={false}
            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
            isMandatory={true}
            isClearable={false}
            options={this.props.SiteList}
            value={this.props.selectedRecord["ssitename"] || ""}
            defaultValue={this.props.selectedRecord["ssitename"]}
            onChange={(event) => this.props.onComboChange(event, "ssitename" )}
            closeMenuOnSelect={true}
          >
          </FormSelectSearch>
        </Col>:""}
       
        {this.props.operation ==="addinfo" ?
         <Col md={12}>
          <FormSelectSearch
            formLabel={this.props.intl.formatMessage({ id: "IDS_PRODUCT" })}
            isSearchable={true}
            name={"nproductcode"}
            isDisabled={false}
            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
            isMandatory={false}
            isClearable={true}
            options={this.props.sampleTypeList}
            value={this.props.selectedRecord["nproductcode"] || ""}
            defaultValue={this.props.selectedRecord["nproductcode"]}
            onChange={(event) => this.props.onComboChange(event, "nproductcode" )}
            closeMenuOnSelect={true}
          >
          </FormSelectSearch>
        </Col> :""}
        {this.props.operation ==="addinfo" ?
        <><Col md={12}>
            <FormSelectSearch
              formLabel={this.props.intl.formatMessage({ id: "IDS_PROJECTTYPE" })}
              isSearchable={true}
              name={"nprojecttypecode"}
              isDisabled={false}
              placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
              isMandatory={false}
              isClearable={true}
              options={this.props.projectTypeMapList}
              value={this.props.selectedRecord["nprojecttypecode"] || ""}
              defaultValue={this.props.selectedRecord["nprojecttypecode"]}
              onChange={(event) => this.props.onComboChange(event, "nprojecttypecode")}
              closeMenuOnSelect={true}
            >
            </FormSelectSearch>
          </Col>
              <Col md={6}>
                <FormInput
                  label={this.props.intl.formatMessage({ id: "IDS_QUANTITY" })}
                  name={"nquantity"}
                  type="numeric"
                  onChange={(event) => this.props.onNumericInputChange(event, 'nquantity')}
                  placeholder={this.props.intl.formatMessage({ id: "IDS_QUANTITY" })}
                  value={this.props.selectedRecord["nquantity"] ? this.props.selectedRecord["nquantity"] || [] : []}
                  isMandatory={false}
                  // isDisabled={this.props.selectedRecord["nneedposition"]}
                  required={true}
                  maxLength={"5"} />
              </Col>
              <Col md={6}>
                <FormSelectSearch
                  name={"nunitcode"}
                  as={"select"}
                  onChange={(event) => this.props.onComboChange(event, 'nunitcode')}
                  formLabel={this.props.intl.formatMessage({ id: "IDS_UNITNAME" })}
                  isMandatory={false}
                  value={this.props.selectedRecord["nunitcode"] ? this.props.selectedRecord["nunitcode"] || [] : []}
                  options={this.props.unitMapList}
                  optionId={"value"}
                  optionValue={"label"}
                  isMulti={false}
                  isDisabled={false}
                  isSearchable={false}
                  isClearable={true} />
              </Col>
            </>
         :""}
        {this.props.operation ==="addinfo" ?
                    <Col md={12}>
                        <CustomSwitch
                            id={"nneedposition"}
                            name={"nneedposition"}
                            type={"switch"}
                            label={this.props.intl.formatMessage({ id: "IDS_NEEDPREDEFINEDSTRUCURE" })}
                            className={"custom-switch-md"}
                            checked={this.props.selectedRecord === undefined ? false : this.props.selectedRecord["nneedposition"]}
                            defaultValue={this.props.selectedRecord === undefined ? false : this.props.selectedRecord["nneedposition"]}
                            onChange={this.props.onInputChange}

                        />
                    </Col>:""}

                    {this.props.operation ==="addinfo" && this.props.selectedRecord["nneedposition"] === true ? <>
                        <Col md={12}>
                            <FormSelectSearch
                                name={"ncontainertypecode"}
                                as={"select"}
                                onChange={(event) => this.props.onComboChange(event, 'ncontainertypecode')}
                                formLabel={this.props.intl.formatMessage({ id: "IDS_CONTAINERTYPE" })}
                                isMandatory={this.props.selectedRecord["nneedposition"]}
                                value={this.props.selectedRecord["ncontainertypecode"] ? this.props.selectedRecord["ncontainertypecode"] || [] : []}
                                options={this.props.selectedRecord["containerTypeOptions"]}
                                optionId={"value"}
                                optionValue={"label"}
                                isMulti={false}
                                isDisabled={false}
                                isSearchable={false}
                                isClearable={false}
                            />
                        </Col>

                        <Col md={12}>
                            <FormSelectSearch
                                name={"ncontainerstructurecode"}
                                as={"select"}
                                onChange={(event) => this.props.onComboChange(event, 'ncontainerstructurecode')}
                                formLabel={this.props.intl.formatMessage({ id: "IDS_CONTAINERSTRUCTURENAME" })}
                                isMandatory={this.props.selectedRecord["nneedposition"]}
                                value={this.props.selectedRecord["ncontainerstructurecode"] ? this.props.selectedRecord["ncontainerstructurecode"] || [] : []}
                                options={this.props.selectedRecord["containerStructureOptions"]}
                                optionId={"value"}
                                optionValue={"label"}
                                isMulti={false}
                                isDisabled={false}
                                isSearchable={false}
                                isClearable={false}
                            />
                        </Col>
                        <Col md={12}>
                            <FormSelectSearch
                                name={"ndirectionmastercode"}
                                as={"select"}
                                onChange={(event) =>this.props.onComboChange(event, 'ndirectionmastercode')}
                                formLabel={this.props.intl.formatMessage({ id: "IDS_DIRECTION" })}
                                isMandatory={this.props.selectedRecord["nneedposition"]}
                                value={this.props.selectedRecord["ndirectionmastercode"] ? this.props.selectedRecord["ndirectionmastercode"] || [] : []}
                                options={this.props.selectedRecord["directionmasterOptions"]}
                                optionId={"value"}
                                optionValue={"label"}
                                isMulti={false}
                                isDisabled={false}
                                isSearchable={false}
                                isClearable={false}
                            />
                        </Col> 
                    </> : ""}

        {this.props.operation ==="addinfo" ?
        <Col md={12}>
                         {/* <FormNumericInput
                            name={"nquantity"}
                            label={this.props.intl.formatMessage({ id: "IDS_NOOFSAMPLECONTAINER" })}
                            className="form-control"
                            type="text"
                            strict={true}
                            value={this.props.selectedRecord["nquantity"] ? this.props.selectedRecord["nquantity"] || [] : []}
                            isMandatory={false}
                            required={true}
                            maxLength={99}
                            min={1}
                            max={this.props.selectedRecord["nneedposition"] === true ? this.props.selectedRecord['nquantity']: 99}
                            isDisabled={this.props.selectedRecord["nneedposition"]}
                            onChange={(event) => this.props.onNumericInputChange(event, "nquantity")}
                            noStyle={true}

                        /> */}

                          <FormInput
                            label={this.props.intl.formatMessage({ id: "IDS_NOOFSAMPLECONTAINER" })}
                            name={"nnoofcontainer"}
                            type="numeric"
                            onChange={(event) => this.props.onNumericInputChange(event,'nnoofcontainer')}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_NOOFSAMPLECONTAINER" })}
                            value={this.props.selectedRecord["nnoofcontainer"] ? this.props.selectedRecord["nnoofcontainer"] || [] : []}
                            isMandatory={false}
                            isDisabled={this.props.selectedRecord["nneedposition"]}
                            required={true}
                            maxLength={"2"}
                        />

                    </Col> :""}
                    
                    <Col >
                            <Row>
                              {this.props.operation ==="addinfo" ?
                                <Col md={6}>
                                    <FormNumericInput
                                        name={'nrow'}
                                        label={this.props.intl.formatMessage({ id: "IDS_ROWS" })}
                                        className="form-control"
                                        type="text"
                                        strict={true}
                                        value={this.props.selectedRecord['nrow'] ?
                                            this.props.selectedRecord['nrow'] : ""}
                                        isDisabled={true}
                                        noStyle={true}
                                    />
                                </Col>:""}
                                {this.props.operation ==="addinfo" ?
                                <Col md={6}>
                                    <FormNumericInput
                                        name={'ncolumn'}
                                        label={this.props.intl.formatMessage({ id: "IDS_COLUMNS" })}
                                        className="form-control"
                                        type="text"
                                        strict={true}
                                        value={this.props.selectedRecord['ncolumn'] ?
                                            this.props.selectedRecord['ncolumn'] : ""}
                                        isDisabled={true}
                                        noStyle={true}
                                    />
                                </Col>:""}
                            </Row>
                        </Col>
                       
                    {this.props.operation ==="addinfo" ?
                    <Col md={12}>
                        <CustomSwitch
                            id={"nneedautomapping"}
                            name={"nneedautomapping"}
                            type={"switch"}
                            label={this.props.intl.formatMessage({ id: "IDS_AUTOMAPPING" })}
                            className={"custom-switch-md"}
                            checked={this.props.selectedRecord === undefined ? false : this.props.selectedRecord["nneedautomapping"]}
                            defaultValue={this.props.selectedRecord === undefined ? false : this.props.selectedRecord["nneedautomapping"]}
                            onChange={this.props.onInputChange}

                        />
                    </Col>:""}
        {/* <Col md={12}>
        <Col md={6}>
        <div className={`list-group-search tool-search ${this.props.showSearch ? 'activesearch' : ""}`}>
            <SearchIcon className="search-icon" onClick={this.props.toggleSearch}>
              <FontAwesomeIcon icon={faSearch} />
            </SearchIcon>
            <FormControl ref={this.props.searchRef} autoComplete="off"
              className='k-textbox' onChange={this.props.handleSearch}
              placeholder={`${this.props.intl.formatMessage({ id: "IDS_SEARCH" })}`}
              name={"search"}  onKeyUp={this.props.handlenavigation}
            />
            {this.props.showSearch ?
              <SearchIcon className="close-right-icon" onClick={this.props.toggleSearch}>
                <FontAwesomeIcon icon={faTimes} />
              </SearchIcon>
              : ""} 
          </div>
        </Col>
        <Col md={6}>
             
        <Button className="btn btn-icon-rounded btn-circle solid-blue" role="button"
              data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_NAVIGATEDOWN" })}  
              onClick={this.props.handlenavigation}>
              <FontAwesomeIcon icon={faArrowDown} title={this.props.intl.formatMessage({ id: "IDS_NAVIGATEDOWN" })} />
            </Button>
        </Col>
      
        </Col> */}
        {this.props.operation !== "addinfo" ?
        <Col md={12}>
          <TreeViewEditable
            setProperties={this.props.setProperties}
            id="samplestoragelocation"
            name="samplestoragelocation"
            childStateChange={this.props.childStateChange}
            // label="Sample Storage Location"
            dragClue={this.props.dragClue}
            getHierarchicalIndexById={this.props.getHierarchicalIndexById}
            placeholder="Enter samplestoragelocation"
            data={this.props.treeData}
            onItemDragOver={this.props.onItemDragOver}
            onItemDragEnd={this.props.onItemDragEnd}
            expandIcons={true}
            item={this.props.itemRender}
            onExpandChange={this.props.onExpandChange}
            onItemClick={this.props.onItemClick}
          />
        </Col>:""}
      </Row>)
  }

}
//export default injectIntl(AddTreeview);
export default
  // connect(null, {
  //   updateStore 

  // })
  (injectIntl(AddTreeview));