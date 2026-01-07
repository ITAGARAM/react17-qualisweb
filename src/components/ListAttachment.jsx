import React, { Component } from 'react';
import { ListGroup, Media, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudDownloadAlt, faTrashAlt, faPencilAlt, faExternalLinkAlt, faThumbtack, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { injectIntl } from 'react-intl';
import { attachmentType, designProperties } from './Enumeration';
import ConfirmDialog from './confirm-alert/confirm-alert.component';
import { Attachments } from './dropzone/dropzone.styles';
import { getAttachedFileIcon } from './FileIcon';
import { MediaLabel, MediaSubHeader } from './App.styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Nav } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import '../pages/registration/registration.css'
import { bytesToSize } from './CommonScript';
// import ReactTooltip from 'react-tooltip';
import CustomPager from './CustomPager';
import { FontIconWrap } from './data-grid/data-grid.styles';
class ListAttachment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showMore: {},
            buttonCount: 2,
            info: true,
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5,
        }
    }
    render() {

        const { fileName, deleteId, editId, defaultId, viewId, isjsonfield, jsonfield } = this.props;
        let data = this.props.hidePaging ? this.props.attachmentList : this.props.attachmentList.slice(this.state.skip, ((this.state.skip) + (this.state.take)))

        return (
            <>
             <div className='spec-list'>
            <PerfectScrollbar>
            <ListGroup variant="flush">
                {data.length > 0 ?
                    data.map((file, index) => {
                        let fileExtension = "";
                        let attachmentTypeCode = file.nattachmenttypecode || file[this.props.jsonfield].nattachmenttypecode

                        if (this.props.isjsonfield) {
                            if (attachmentTypeCode === attachmentType.FTP) {
                                const splittedFileName = file[this.props.jsonfield][fileName].split('.');
                                fileExtension = file[this.props.jsonfield][fileName].split('.')[splittedFileName.length - 1];
                            }
                        }
                        else {
                            if (attachmentTypeCode === attachmentType.FTP) {
                                const splittedFileName = file[fileName].split('.');
                                fileExtension = file[fileName].split('.')[splittedFileName.length - 1];
                            }
                        }
                        return (
                            <>
                                {/* <ReactTooltip place="bottom" globalEventOff="true" id="tooltip_attachment_wrap" /> */}
                                <ListGroup.Item key={`file_${index}`}>
                                    <Attachments>
                                        <Media className='block-view'>
                                            <Media.Body>
                                                <div className="left-icon-header">
                                                    <h5 className="mt-0 attatchment-title"
                                                        // data-for="tooltip_attachment_wrap"
                                                        data-tip-disable={this.props.isjsonfield
                                                            ? file[this.props.jsonfield][fileName].length < 50
                                                            : file[fileName].length < 50}
                                                        data-tooltip-id="my-tooltip" data-tooltip-content={this.props.isjsonfield
                                                            ? file[this.props.jsonfield][fileName]
                                                            : file[fileName]}>
                                                        <Image
                                                            width={25}
                                                            height={25}
                                                            className="attachment-img-icon mr-2"
                                                            src={getAttachedFileIcon(fileExtension)}
                                                        />
                                                        {this.props.isjsonfield
                                                            ? file[this.props.jsonfield][fileName]
                                                            : file[fileName]}</h5>
                                                    <Nav.Link style={{display:"inherit"}}>

                                                        {attachmentTypeCode === attachmentType.FTP ?


                                                            <FontIconWrap icon={faCloudDownloadAlt} className="mr-3 className action-icons-wrap" size="lg" hidden={this.props.userRoleControlRights.indexOf(viewId) === -1}
                                                                data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DOWNLOAD" })}
                                                                //data-for="tooltip_attachment_wrap"
                                                                onClick={() => this.props.viewFile(file)}
                                                            >
                                                                <FontAwesomeIcon icon={faCloudDownloadAlt} />
                                                            </FontIconWrap>
                                                            //Added by sonia on 18-04-2022 
                                                            : <FontIconWrap icon={faExternalLinkAlt} className="mr-3 action-icons-wrap" size="lg" hidden={this.props.userRoleControlRights.indexOf(viewId) === -1}
                                                                 data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_LINK" })}
                                                                 //data-for="tooltip_attachment_wrap"
                                                                 onClick={() => this.props.viewFile(file)}
                                                              >
                                                                <FontAwesomeIcon icon={faExternalLinkAlt} />
                                                              </FontIconWrap>

                                                            //Commented by sonia on 18-04-2022 
                                                            // : <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-3" size="lg" hidden={this.props.userRoleControlRights.indexOf(viewId) === -1}
                                                            //     data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_LINK" })}
                                                            //     data-for="tooltip_attachment_wrap"
                                                            //     onClick={() => this.props.viewFile(file)} />
                                                        }
                                                        <FontAwesomeIcon icon={faThumbtack} className="mr-3 action-icons-wrap" size="lg" hidden={this.props.userRoleControlRights.indexOf(defaultId) === -1}
                                                            onClick={() => this.props.defaultRecord({ ...this.props.defaultParam, selectedRecord: file })} />
                    

                                                        <FontIconWrap className="mr-3 action-icons-wrap d-font-icon" size="lg" hidden={this.props.userRoleControlRights.indexOf(editId) === -1}
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                            //data-for="tooltip_attachment_wrap"
                                                            onClick={() => this.props.fetchRecord({ ...this.props.editParam, selectedRecord: file, operation: "update" })}
                                                        >
                                                            <FontAwesomeIcon icon={faPencilAlt} />
                                                        </FontIconWrap>
                                                       
{/* 
                                                        <FontIconWrap className="mr-3 action-icons-wrap d-font-icon" size="lg" hidden={this.props.userRoleControlRights.indexOf(editId) === -1}
                                                            data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                            //data-for="tooltip_attachment_wrap"
                                                            onClick={this.ConfirmDelete(this.props.deleteParam, file, deleteId, data, this.props.skip ? this.props.skip : this.state.skip, this.props.take ? this.props.take : this.state.take)}
                                                        >
                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                        </FontIconWrap> */}

                                                        <ConfirmDialog
                                                            name="deleteMessage"
                                                            className = "action-icons-wrap"
                                                            message={this.props.intl.formatMessage({ id: "IDS_DELETECONFIRMMSG" })}
                                                            cardTitle={this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" })}
                                                            doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}
                                                            doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                            //dataforprops="tooltip_attachment_wrap"
                                                            icon={faTrashAlt}
                                                            size="lg"
                                                            title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                            hidden={this.props.userRoleControlRights.indexOf(deleteId) === -1}
                                                            handleClickDelete={() => this.props.deleteRecord({ ...this.props.deleteParam, selectedRecord: file, ncontrolCode: deleteId, data, skip: this.props.skip ? this.props.skip : this.state.skip, take: this.props.take ? this.props.take : this.state.take })}
                                                        />
                                                    </Nav.Link>
                                                </div>
                                                <div className="attatchment-details pad-5">
                                                    {/* {file[this.props.mainField]?<>{file[this.props.mainField]}<span className="seperator">|</span></>:""}{file.screateddate} 
                                        {
                                            file.nattachmenttypecode === attachmentType.FTP?
                                                <>
                                                    {file[filesize]?<><span className="seperator">|</span>{file[filesize]} bytes</>:""}
                                                    {file[defaultStatusName]?<><span className="seperator">|</span>{file[defaultStatusName]} </>:""}
                                                </>
                                            :
                                                <>
                                                    {file[linkname]?<><span className="seperator">|</span>{file[linkname]}</>:""}
                                                    {file[defaultStatusName]?<><span className="seperator">|</span>{file[defaultStatusName]}</>:""}
                                                </>
                                        } */}
                                                    {
                                                        this.props.subFields && this.props.subFields.map((field, i) =>
                                                            <>
                                                             <MediaLabel style={{ fontWeight: "normal" }}>{field[1] ?
                                                                        this.props.intl.formatMessage({ id: field[designProperties.LABEL] })
                                                                        + ": " : ""}
                                                            </MediaLabel>
                                                                {   
                                                                    this.props.isjsonfield ?
                                                                        field['fieldType'] === 'size' ?
                                                                            <MediaLabel>{bytesToSize(file[this.props.jsonfield][field[designProperties.VALUE]])}</MediaLabel>
                                                                            : <MediaLabel>{file[this.props.jsonfield][field[designProperties.VALUE]] || file[field[designProperties.VALUE]]}</MediaLabel>
                                                                        :
                                                                        field['fieldType'] === 'size' ?
                                                                            <MediaLabel>{bytesToSize(file[field[designProperties.VALUE]])}</MediaLabel>
                                                                            : <MediaLabel>{file[field[designProperties.VALUE]]}</MediaLabel>}
                                                                {/* {this.props.subFields.length > 1 && i % 2 === 0 ?<MediaLabel className="seperator">|</MediaLabel>: ""} */}
                                                                {field[2] && i !== this.props.subFields.length - 1 ? <MediaLabel className="seperator">|</MediaLabel> : ""}
                                                            </>
                                                        )
                                                    }
                                                    {
                                                        this.props.moreField && this.props.moreField.length > 0 ?
                                                            <>
                                                                <MediaLabel className="show-more-action-wrap">
                                                                    <Nav.Link name={`show-wrap_${index}`} className={`show-more-action showmore primarycolor`} onClick={(event) => this.showHideDetails(event, index)} style={{ display: "inline" }}
                                                                    >
                                                                        {/* <Form.Label className={`show-more-link showmore`} for={`show-wrap_${index}`}>
                                                                            {` ...${this.props.intl.formatMessage({ id: this.state.showMore[index] ? "IDS_SHOWLESS" : "IDS_SHOWMORE" })}`}
                                                                            </Form.Label> */}
                                                                    <FontAwesomeIcon size="sm" htmlFor={`show-wrap_${index}`} icon={this.state.showMore[index] ? faChevronUp : faChevronDown} />
                                                                    </Nav.Link>
                                                                </MediaLabel>
                                                                <Media.Body className={`show-more-wrap ${this.state.showMore[index] ? "showmore" : ""}`}>
                                                                    <MediaSubHeader>


                                                                        {this.props.moreField.map((field, i) =>
                                                                            <div className="media-label-split blocked-flex">
                                                                                <MediaLabel style={{ fontWeight: "bold" }}>{field[1] ?
                                                                                    this.props.intl.formatMessage({ id: field[designProperties.LABEL] })
                                                                                    + ": " : ""}
                                                                                </MediaLabel>
                                                                                <MediaLabel
                                                                                    data-tip-disable={false}
                                                                                    //ALPD-5615--Comment by Vignesh for Tool tip need for more fields
                                                                                   // data-for="tooltip_attachment_wrap"
                                                                                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.isjsonfield ? file[this.props.jsonfield][field[designProperties.VALUE]] || file[field[designProperties.VALUE]] : file[field[designProperties.VALUE]]} className='media-value' >
                                                                                    {this.props.isjsonfield ?
                                                                                        file[this.props.jsonfield][field[designProperties.VALUE]] || file[field[designProperties.VALUE]]
                                                                                        : file[field[designProperties.VALUE]]}</MediaLabel>
                                                                                {field['fieldType'] === 'size' ? <>{" "} bytes</> : ""}
                                                                                {/* {i % 2 === 0 && i !== this.props.moreField.length - 1 ?
                                                                                        <MediaLabel className="seperator">|</MediaLabel> : ""}
                                                                                    {(i + 1) % 2 === 0 ? <br></br> : ""} */}

                                                                            </div>
                                                                        )}
                                                                    </MediaSubHeader>
                                                                </Media.Body>
                                                            </>
                                                            : ""
                                                    }
                                                </div>
                                            </Media.Body>
                                        </Media>
                                    </Attachments>
                                </ListGroup.Item>
                            </>
                        );
                    }) : <ListGroup.Item>
                        <Attachments className="norecordtxt">
                            {this.props.intl.formatMessage({ id: "IDS_NORECORDSAVAILABLE" })}
                        </Attachments>
                    </ListGroup.Item>
                }
            </ListGroup>
            </PerfectScrollbar>
            </div>
            {this.props.hidePaging ? "" :
                    <CustomPager
                        skip={this.state.skip}
                        take={this.state.take}
                        userInfo={this.props.userInfo}
                        // width={20}
                        pagershowwidth={33}
                        handlePageChange={this.handlePageChange}
                        total={this.props.attachmentList ? this.props.attachmentList.length : 0}
                        buttonCount={this.state.buttonCount}
                        info={this.state.info}
                        pageSize={this.props.settings ? this.props.settings[15].split(",").map(setting => parseInt(setting)) : [5, 10, 15]}

                    >
                    </CustomPager>
                }
            </>
        );
    }



    // ConfirmDelete = (deleteParam,file,deleteId,data,skip,take) => {
    //     this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
    //         this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
    //         //() => this.DeleteManufacturer("delete", deleteId)
    //         () => this.props.deleteRecord({ ...deleteParam, selectedRecord: file, ncontrolCode: deleteId, data, skip: skip,  take: take })
    //         );
    // }
    showHideDetails = (event, index) => {

        event.stopPropagation();
        let showMore = { ...this.state.showMore, [index]: !this.state.showMore[index] }
        this.setState({ showMore })

    }
    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };

    componentDidUpdate(previousProps) {
        if (this.props.attachmentList !== previousProps.attachmentList) {
            if (this.props.skip === undefined && this.props.attachmentList && this.props.attachmentList.length <= this.state.skip) {
                this.setState({ skip: 0 });
            }
        }
        if (this.props.skip !== undefined && this.props.skip !== previousProps.skip) {
            this.setState({ skip: this.props.skip, take: this.props.take });
        }
    }
}
export default injectIntl(ListAttachment);