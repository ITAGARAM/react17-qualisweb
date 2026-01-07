import React from 'react';
import { injectIntl } from 'react-intl';
import { Button, Image, InputGroup, FormControl, Media, ListGroup, Form } from 'react-bootstrap';
import { ClientList, SearchAdd, MediaHeader, MediaSubHeader, MediaLabel } from './App.styles';
import { ListMasterWrapper } from './list-master/list-master.styles';
import filterIcon from './../assets/image/filer-icon.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSync } from '@fortawesome/free-solid-svg-icons';
import FilterAccordion from './custom-accordion/filter-accordion.component';
import 'react-perfect-scrollbar/dist/css/styles.css';

class ListMaster1 extends React.Component {

    filterColumn = (event) => {
        let filterValue = event.target.value;
        if (event.keyCode === 13 || filterValue === "") {
            this.props.filterColumnData(filterValue, this.props.filterParam);
        }

        // clearInterval(this.interval);

        // if (filterValue === "") {
        //     this.props.filterColumnData(filterValue, this.props.filterParam);

        // } else {
        //     // (filterValue.length > 2) {
        //     this.interval = setInterval(() => {
        //         this.props.filterColumnData(filterValue, this.props.filterParam);
        //         clearInterval(this.interval);
        //     }, 3000);
        //     // }
        // }
    }

    getSelectedDetail = (master)=> {
      
        const data=[];
  
    
        const selectedList =this.props.selectedMaster ? Object.values(this.props.selectedMaster) : [];
        const indexValue =selectedList.findIndex(x => x[this.props.primaryKeyField] === master[this.props.primaryKeyField]);
        const indexSelectedList=indexValue===-1?0:indexValue;
        if (this.props.selectedMaster[indexSelectedList][this.props.primaryKeyField]  !== master[this.props.primaryKeyField]){
        this.props.selectedMaster.map((item,index)=>
         data.push(item)
        )
        data.push(master);
       // this.setState({
       //   data:data
      //  })
              this.props.getMasterDetail(data);
      }
      else{
          this.props.selectedMaster.forEach((item,index)=>
          {if(index!==indexSelectedList){
          data.push(item)
        }}
         )
       //  delete data[index1];
         //this.setState({
          // data:data
        // })
         if(data.length>0){
               this.props.getMasterDetail(data);
   
         }
      }
      }
  

    render() {
        const labelColor = ['label-orange', 'label-green', 'label-yellow', 'label-purple'];
        
        return (
            <React.Fragment>
                {/* <div className="client-listing-wrap">
                    
                </div> */}
                <ListMasterWrapper className="">
                    <SearchAdd className="d-flex justify-content-between" >
                        <InputGroup>
                            <FormControl ref={this.props.searchRef}// onEnterKeyPress={this.filterColumn}
                                autoComplete="off" placeholder={"Search ".concat(this.props.screenName)}
                                name={"search".concat(this.props.screenName.toLowerCase())}
                                onKeyUp={(e) => this.filterColumn(e)}
                            />
                            <InputGroup.Append>
                                <InputGroup.Text>
                                    <Image src={filterIcon} alt="filer-icon" width="24" height="24" />
                                </InputGroup.Text>
                            </InputGroup.Append>
                        </InputGroup>

                        <Button className="btn btn-icon-rounded btn-circle solid-blue" role="button" 
                            hidden={this.props.userRoleControlRights.indexOf(this.props.addId) === -1}
                            onClick={() => this.props.openModal()}>
                            <FontAwesomeIcon icon={faPlus} title={this.props.intl.formatMessage({ id: "IDS_ADD" })} />
                        </Button>
                        {/* <Button //className="btn btn-icon-rounded btn-primary-blue ml-2" */}
                        {/* <Button className="btn btn-circle outline-grey  ml-2" variant="link"                         
                            onClick={() => this.props.reloadData()}>
                            <FontAwesomeIcon icon={faSync}  style={{ "width": "0.6!important" }} />
                        </Button> */}

                        <Button className="btn btn-circle outline-grey ml-2" variant="link"
                            onClick={() => this.props.reloadData()} > 
                            <FontAwesomeIcon icon={faSync} style={{ "width": "0.6!important" }}/>
                        </Button>

                    </SearchAdd>
                    {this.props.needAccordianFilter ?
                    <FilterAccordion key="filter"
                        // formatMessage={this.props.formatMessage}
                        filterComponent={this.props.filterComponent}
                    />
                    : ""}

                    <ClientList className="product-list">
                        {/* <PerfectScrollbar className ="client-list-scroll"> */}
                        <ListGroup as="ul">
                            {this.props.masterList ?

                                this.props.masterList.map((master, index) =>
                                    <ListGroup.Item key={`listKey_${index}`} as="li" onClick={() => this.getSelectedDetail(master)}
                                    className={`list-bgcolor ${this.props.selectedMaster ? this.props.selectedMaster[this.props.selectedMaster.findIndex(x => x[this.props.primaryKeyField]=== master[this.props.primaryKeyField])===-1?0:this.props.selectedMaster.findIndex(x => x[this.props.primaryKeyField] === master[this.props.primaryKeyField])][this.props.primaryKeyField] === master[this.props.primaryKeyField] ?"active" : "" : ""}`}>
                                        <Media>
                                            {this.props.isMultiSelecct ? 
                                                <Form.Check custom type="checkbox" id="customControl"  >
                                                    <Form.Check.Input type="checkbox" id={`tm_customCheck_${index}`}
                                                      checked={this.props.selectedMaster ? this.props.selectedMaster[this.props.selectedMaster.findIndex(x => x[this.props.primaryKeyField]=== master[this.props.primaryKeyField])===-1?0:this.props.selectedMaster.findIndex(x => x[this.props.primaryKeyField] === master[this.props.primaryKeyField])][this.props.primaryKeyField] === master[this.props.primaryKeyField] ? true : false : false }
                                                      readOnly
                                                  />
  
                                                  <Form.Check.Label className= {`mr-3 label-circle ${labelColor[index % 4]}`} htmlFor={`tm_customCheck_${index}`}> {master[this.props.mainField] && master[this.props.mainField].substring(0, 1).toUpperCase()}</Form.Check.Label>
                                              </Form.Check> :
  
                                              <Form.Check.Label className= {`mr-3 label-circle ${labelColor[index % 4]}`} htmlFor={`tm_customCheck_${index}`}>{master[this.props.mainField] && master[this.props.mainField].substring(0, 1).toUpperCase()}</Form.Check.Label>
                                          }
                                            <Media.Body>
                                                <MediaHeader>{master[this.props.mainField]}</MediaHeader>
                                                <MediaSubHeader>
                                                    <MediaLabel>{master[this.props.firstField]}</MediaLabel>
                                                    {this.props.secondField ? <>
                                                        <MediaLabel className="seperator">|</MediaLabel>
                                                        <MediaLabel>
                                                            {master[this.props.secondField]}
                                                        </MediaLabel>
                                                    </> : ""}
                                                </MediaSubHeader>
                                            </Media.Body>
                                        </Media>
                                    </ListGroup.Item>
                                )
                                : ""}
                        </ListGroup>
                        {/* </PerfectScrollbar> */}

                    </ClientList>
                </ListMasterWrapper>
            </React.Fragment>
        )
    }
}
export default injectIntl(ListMaster1);