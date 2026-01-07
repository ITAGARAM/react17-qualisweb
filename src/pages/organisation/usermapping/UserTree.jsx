import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Col, Nav, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import OrgTree from 'react-org-tree';
import { Tooltip } from '@progress/kendo-react-tooltip';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
// import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';
// import panAndZoomHoc from 'react-pan-and-zoom-hoc';

// const InteractiveDiv = panAndZoomHoc('div');
class userTree extends React.Component {
    render() {
        // const { a, b, scale } = this.props;
        return (
            <>
                {this.props.hideFilters ?
                    <></> :
                    <Row className="pt-3">
                        <Col md={3}>
                            <FormSelectSearch
                                name="nuserrolecode"
                                formLabel={this.props.intl.formatMessage({ id: "IDS_USERROLE" })}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_USERROLE" })}
                                optionId="nuserrolecode"
                                optionValue="suserrolename"
                                options={this.props.userRoleList}
                                value={this.props.selectedRecord.filteredRole}
                                onChange={(event) => this.props.userSearchFilterChange(event, 'nuserrolecode')}
                                isMandatory={false}
                                isMulti={false}
                                isClearable={true}
                                isSearchable={false}
                                isDisabled={false}
                                alphabeticalSort={false}
                            />
                        </Col>
                        <Col md={3}>
                            <FormSelectSearch
                                name="nusermappingcode"
                                formLabel={this.props.intl.formatMessage({ id: "IDS_USER" })}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_USER" })}
                                optionId="nusermappingcode"
                                optionValue="Name"
                                options={this.props.userList}
                                value={this.props.selectedRecord.filteredUser}
                                onChange={(event) => this.props.userSearchFilterChange(event, 'nusermappingcode')}
                                isMandatory={false}
                                isMulti={false}
                                isSearchable={true}
                                isDisabled={false}
                                isClearable={true}
                            />
                        </Col>
                        <Col md={4}>
                            <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}>
                                <Nav.Link name={"search"}
                                    className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                    title={this.props.intl.formatMessage({ id: "IDS_SEARCH" })}
                                    onClick={this.props.filterTree}
                                >
                                    <FontAwesomeIcon icon={faSearch} />
                                </Nav.Link>
                                <Nav.Link name={"clear"}
                                    className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                    title={this.props.intl.formatMessage({ id: "IDS_CLEAR" })}
                                    onClick={this.props.clearFilter}
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </Nav.Link>
                                {/* <Nav.Link name={"expand"}
                                    className={`btn btn-circle ${this.props.expanded ?'outline-success':'outline-grey'} mr-2 action-icons-wrap`}
                                    // title={this.props.expanded ? this.props.intl.formatMessage({ id: "IDS_DISABLEEXPAND" }) : this.props.intl.formatMessage({ id: "IDS_ENABLEEXPAND" })}
                                    onClick={this.props.collapseAll}
                                >
                                    <FontAwesomeIcon icon={faPlusSquare} style={{color:`${this.props.expanded ?'#28a745':'#6c757d'}`}} />
                                </Nav.Link> */}
                                {/* <Nav.Link name={"expandable"}
                                    className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                    title={this.props.intl.formatMessage({ id: this.props.expanded ? "IDS_EXPANDALL" : "IDS_COLLAPSSALL" })}
                                    onClick={this.props.collapseAll}
                                >
                                    <FontAwesomeIcon
                                        icon={this.props.expanded ? faChevronCircleRight : faChevronCircleLeft}
                                       
                                    />
                                </Nav.Link> */}

                                {/* <Nav.Link name={"expandable"} onClick={this.props.collapseAll} style={{display:"inline-block"}}>
                                    {this.props.expanded ? this.props.intl.formatMessage({ id: "IDS_DISABLEEXPAND" }) : this.props.intl.formatMessage({ id: "IDS_ENABLEEXPAND" })}
                                </Nav.Link> */}
                            </Tooltip>
                        </Col>
                    </Row>
                }
                <OrgTree
                    data={this.props.data}
                    horizontal={true}
                    collapsable={this.props.expanded}
                    expandAll={!this.props.expanded}
                />
                {/* <div style={{ WebkitTransform: `scale(${scale > 1 ? 1 : scale}, ${scale > 1 ? 1 : scale}) translate(${(a * 1000)}px, ${(b * 1000)}px`, transform: `scale(${scale > 1 ? 1 : scale}, ${scale > 1 ? 1 : scale}) translate(${(a * 1000)}px, ${(b * 1000)}px` }} width={100} height={100}> */}
                                {/* </div> */}
                {/* <InteractiveDiv
                    x={a}
                    y={b}
                    scale={scale > 1 ? 1 : scale}
                    scaleFactor={Math.sqrt(2)}
                    onPanAndZoom={(x, y, scale) => this.props.handlePanAndZoom(x, y, scale)} style={{ width: "100%", height: "50%", position: 'fixed' }}
                    onPanMove={(x, y) => this.props.handlePanMove(x, y)}
                >
                    <div style={{ WebkitTransform: `scale(${scale > 1 ? 1 : scale}, ${scale > 1 ? 1 : scale}) translate(${(a * 1000)}px, ${(b * 1000)}px`, transform: `scale(${scale > 1 ? 1 : scale}, ${scale > 1 ? 1 : scale}) translate(${(a * 1000)}px, ${(b * 1000)}px` }} width={100} height={100}>
                        <OrgTree
                            data={this.props.data}
                            horizontal={true}
                            collapsable={this.props.expanded}
                            expandAll={!this.props.expanded}
                        />
                    </div>
                </InteractiveDiv> */}
            </>
        );
    }
}
export default injectIntl(userTree)