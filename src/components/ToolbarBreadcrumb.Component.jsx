import React from 'react'
import { Breadcrumb, InputGroup, FormControl } from 'react-bootstrap';
import { injectIntl } from 'react-intl'
import ScrollContainer from 'react-indiana-drag-scroll'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomSwitch from '../components/custom-switch/custom-switch.component';
import { transactionStatus } from '../components/Enumeration';
import { SearchIcon } from '../components/App.styles';
import AdvFilter from './AdvFilter';

class BreadcrumbComponentToolbar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showSearch: false,
            selectedSwitch: false,
            // GroupByStatusFunction: "Group"
        }
    }


    toggleSearch = () => {
        this.setState({
            showSearch: !this.state.showSearch
        })
    }

    closeFilter = () => {
        this.props.closeFilter();

    }

    filterColumn = (event) => {
        let filterValue = event.target.value;
        if (event.keyCode === 13) {
            this.props.filterColumnData(filterValue, this.props.filterParam, this.props.searchListName);
        }
    }
    render() {
        return (

            <div className={`tool-top-wrap ${this.state.showModalBg ? 'show_modal_bg' : ''}`}>
                <div>
                    <div className={`list-group-search tool-search ${this.state.showSearch ? 'activesearch' : ""}`}>
                        {this.props.showSearch ?
                            <SearchIcon className="search-icon" onClick={this.toggleSearch}>
                                <FontAwesomeIcon icon={faSearch} />
                            </SearchIcon>
                            : ""}
                        <FormControl ref={this.props.searchRef} autoComplete="off" placeholder={`${this.props.intl.formatMessage({ id: "IDS_SEARCH" })}`} name={"search"} onKeyUp={(e) => this.filterColumn(e)} />
                        {this.state.showSearch ?
                            <SearchIcon className="close-right-icon" onClick={this.toggleSearch}>
                                <FontAwesomeIcon icon={faTimes} />
                            </SearchIcon>
                            : ""}
                    </div>
                    <InputGroup.Append>
                        <AdvFilter
                            filterComponent={this.props.filterComponent}
                            dataFor="tooltip-common-wrap"
                            onFilterSubmit={this.props.onFilterSubmit}
                            showFilter={this.props.showFilter}
                            openFilter={this.props.openFilter}
                            closeFilter={this.closeFilter}
                            callCloseFunction={this.props.callCloseFunction}
                            showModalBg={(e) => this.setState({ showModalBg: e })}

                        />
                    </InputGroup.Append>
                </div>

                <ScrollContainer className="breadcrumbs-scroll-container" >
                    <Breadcrumb className="filter-breadcrumbs" >
                        {this.props.breadCrumbItem.map((item, index) => (
                            <Breadcrumb.Item key={index}>
                                <span>{item.label && this.props.intl.formatMessage({ id: item.label ? item.label : "" })}</span>
                                <span>{item.value}</span>
                            </Breadcrumb.Item>
                        ))}


                    </Breadcrumb>
                </ScrollContainer>
                {
                    this.props.showSwitch ?
                        <div style={{
                            "flex-grow": "1",
                            "justify-content": "flex-end",
                            "height": "0px"
                        }}>

                            <span data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ENABLEDISABLEGROUPINGBYSTATUSFUNCTION" })}>
                                <CustomSwitch type="switch"
                                    id={"groupbyswitch"}
                                    onChange={(event) => this.props.switchGroupBy(event)}
                                    checked={this.props.selectedSwitch === transactionStatus.YES ? true : false}
                                    name={"groupbyswitch"}
                                    parentClassName={"paddingclass"}
                                />
                            </span>
                        </div> : ""
                }


            </div>

        )
    }
}
export default injectIntl(BreadcrumbComponentToolbar);