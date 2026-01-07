import { ListView, ListViewHeader } from '@progress/kendo-react-listview';
import React from 'react';
import { Button, InputGroup, FormControl, Media, ListGroup, Form } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Affix, Alert } from 'rsuite';
import { ListMasterWrapper } from '../../components/list-master/list-master.styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
    ClientList, SearchAdd, MediaHeader,
    MediaSubHeader, MediaLabel, SearchIcon
} from '../../components/App.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSync, faTable } from '@fortawesome/free-solid-svg-icons';
import './SqlBuilderDesign.css'
import CustomPager from '../../components/CustomPager';
import { connect } from 'react-redux';
import { ListWrapper } from '../../components/client-group.styles';


class ListComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModalBg: false,
            buttonCount: 4,
            info: true,
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[3]) : 5
        }

        this.searchRef = React.createRef();
    }

    MyHeader = () => {
        return (
            <ListViewHeader
                style={{
                    color: "rgb(160, 160, 160)",
                    fontSize: 20,
                    fontweight: 'bold'
                }}
                className="pl-3 pb-2 pt-2 headercolor"
            >
                {this.props.headerName}
            </ListViewHeader>
        );
    };

    ListDesign = props => {
        let item = props.dataItem;
        return (

            <ListGroup.Item key={`listKey_${props.index}`} as="li" onClick={() => this.props.onClick(item)}
                className={`list-bgcolor`}>
                <Media>
                    <Media.Body>
                        <span>
                            <FontAwesomeIcon icon={faTable} size='lg' />
                        </span>
                        <span className={'px-3'}>
                            {item.stabledisplayname}
                        </span>

                    </Media.Body>
                </Media>
            </ListGroup.Item>
        )

    }

    search = (filterValue, data) => {
        let searchedData = [];

        if (data.length > 0) {
            let temp = data.filter(item => {
                const itemArray = [];
                ['stabledisplayname'].map(itemKey =>
                    item[itemKey] && item[itemKey] !== null ?
                        itemArray.push(typeof item[itemKey] === "string" ? item[itemKey].toLowerCase()
                            : item[itemKey].toString().toLowerCase())
                        : "")
                return itemArray.findIndex(element => element.includes(filterValue.toLowerCase())) > -1
            }
            )
            searchedData = temp;
        }
        return searchedData;
    }

    filterColumn = (event) => {
        event.preventDefault();
        event.stopPropagation();
        let filterValue = event.target.value;
        let searchData = this.state.searchData
        //if (event.keyCode === 13) {
            //  this.props.filterColumnData(filterValue, this.props.filterParam);
            if (filterValue === '') {
                searchData = undefined
            } else {
                searchData = this.search(filterValue, this.props.data)
            }
            this.setState({ searchData })
        //}
    }

    onInputChange = (e) => {
        this.setState({ filterValue: e.target.value })
    }

    render() {
        const data1 = this.state.searchData ?
            this.state.searchData : this.props.data
        return (<>
            <Affix top={53}>
                <ListMasterWrapper className={`${this.state.showModalBg ? 'show_modal_bg' : ''} `}>
                    {/* 
                    <SearchAdd className={`d-flex filter-wrap-group justify-content-between pad-15 tableHeader ${this.props.titleClasses ? this.props.titleClasses : ''}`} >

                        {this.props.headerName}
                    </SearchAdd> */}


                    <SearchAdd className={`d-flex ${this.props.hideSearch ? "justify-content-end" : "justify-content-between"}  pad-15 ${this.props.titleClasses ? this.props.titleClasses : ''}`} >
                        {this.props.hideSearch ? "" :
                            <InputGroup className="list-group-search">
                                <SearchIcon className="search-icon">
                                    {/* <FontAwesomeIcon icon={faFilter} style={{ color: "#c1c7d0" }} /> */}
                                    <FontAwesomeIcon icon={faSearch} style={{ color: "#c1c7d0" }} />
                                    {/* <SolidFilterIcon className="custom_icons" width="18" height="18" fill='#FFF' stroke='#000000' stroke-width="15"/> */}
                                </SearchIcon>

                                {/* <input type="text"
                                    onChange={(e)=>this.onInputChange(e)}
                                    value={this.state.filterValue && this.state.filterValue}
                                    onKeyUp={(e)=>this.filterColumn(e)}
                                ></input> */}

                                <FormControl
                                    ref={this.props.searchRef}// onEnterKeyPress={this.filterColumn}
                                   // onChange={this.onInputChange}
                                   // value={this.state.filterValue && this.state.filterValue}
                                    autoComplete="off"
                                    className={'nomaxwidth'}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_FILTER" })} //.concat(this.props.screenName)
                                    name={"search"}
                                    onKeyUp={(e) => this.filterColumn(e)}
                                   // onEnterKeyPress={this.filterColumn}
                                //  onEnterKeyPress={this.filterColumn}
                                />
                            </InputGroup>
                        }


                        <ListWrapper className="d-flex ml-2">
                            {this.props.titleHead ? <h3>{this.props.titleHead}</h3> : ''}
                        </ListWrapper>
                    </SearchAdd>

                    <ClientList className="product-list list_rightborder">
                        <div className={'height-normal height-xl height-xxd'}>
                            <PerfectScrollbar>
                                <ListGroup as="ul">
                                    <ListView
                                        data={this.props.hidePaging ?
                                            data1 :
                                            data1.slice(this.props.skip ?
                                                this.props.skip : this.state.skip,
                                                ((this.props.skip ? this.props.skip : this.state.skip) + (this.props.take ? this.props.take : this.state.take)))}
                                        //  data={this.props.data}
                                        item={(props) => this.ListDesign(props)}
                                    // header={this.MyHeader}
                                    // style={{
                                    //     width: "100%",
                                    //     height:"100%"
                                    // }}
                                    />
                                </ListGroup>
                            </PerfectScrollbar>
                        </div>
                    </ClientList>
                    {this.props.hidePaging ? "" :
                        <CustomPager
                            skip={this.props.skip ? this.props.skip : this.state.skip}
                            take={this.props.take ? this.props.take : this.state.take}
                            width={20}
                            pagershowwidth={18}
                            handlePageChange={this.handlePageChange}
                            total={data1 ? data1.length : 0}
                            buttonCount={this.state.buttonCount}
                            info={this.state.info}
                            userInfo={this.props.Login.userInfo}
                            pageSize={this.props.pageSize ? this.props.pageSize : this.props.Login.settings && this.props.Login.settings[4].split(",").map(setting => parseInt(setting))}
                        >
                        </CustomPager>
                    }
                </ListMasterWrapper>
            </Affix>
        </>

        )
    };

    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };

}

const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

export default connect(mapStateToProps, {})(injectIntl(ListComponent));