import React from 'react';
import { Row, Col} from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import DropZone from '../../components/dropzone/dropzone.component';
import { deleteAttachmentDropZone,onDropAttachFileList } from '../../components/CommonScript';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt,  faTrashRestore } from '@fortawesome/free-solid-svg-icons';


class BulkRetrieveOrDiposeSample extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedRecord: this.props.selectedRecord,
            dynamicfields: this.props.dynamicfields
        }
    }
    onDropFile = (attachedFiles, fieldName, maxSize) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles, maxSize)
        this.props.childDataChange(selectedRecord);
        this.setState({ selectedRecord, actionType: "new" });
    }

    deleteAttachment = (event, file, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName], file)
        this.props.childDataChange(selectedRecord);
        this.setState({
            selectedRecord, actionType: "delete" //fileToDelete:file.name 
        });
    }
    componentDidUpdate(previousProps) {
        let { selectedRecord , dynamicfields
        } = this.state
        let bool = false;

        if (this.props.dynamicfields !== previousProps.dynamicfields) {
            bool = true;
            dynamicfields = this.props.dynamicfields || {};
        }
        if (this.props.selectedRecord !== previousProps.selectedRecord) {
            bool = true;
            selectedRecord = this.props.selectedRecord || {};
        }
        if (bool) {
            this.setState({
                selectedRecord , dynamicfields
            });
        }
    }

    render() {
        const retrieve = this.props.controlMap.has("Retrieve") && this.props.controlMap.get("Retrieve").ncontrolcode;
        const dispose = this.props.controlMap.has("Dispose") && this.props.controlMap.get("Dispose").ncontrolcode;

        return (
            <Col md={12}>
                <Row>
                <Col md={6}></Col>
                    <Col md={3}>
                        <button className="btn btn-primary" style={{ float: "right", marginRight: "1rem" }}
                            onClick={() => this.props.CRUDSampleStorageTransaction({
                               // sunitname: this.state.selectedRecord.nunitcode ? this.state.selectedRecord.nunitcode.label : "NA",
                               // saliquotsampleid: this.state.selectedRecord.saliquotsampleid
                                  //  && this.state.selectedRecord.saliquotsampleid !== ""
                                   // ? this.state.selectedRecord.saliquotsampleid : "",
                              //  nquantity: this.state.selectedRecord.nquantity
                                  //  && this.state.selectedRecord.nquantity !== ""
                                   // ? this.state.selectedRecord.nquantity : 0,
                                ncontrolcode: retrieve,
                                // ALPD-4484 janakumar Sample Retrieval & disposal-->Bulk & retrieve is not working. While retrieve the sample Id the Status is in Disposed status.
                                isRetrieve:true, 
                                //'nsamplestoragetransactioncode': this.state.selectedBarcodeValue && this.state.selectedBarcodeValue.nsamplestoragetransactioncode,
                                userinfo: this.props.userInfo,
                                // scomments: this.state.selectedRecord.scomments && this.state.selectedRecord.scomments !== ""
                                //     ? this.state.selectedRecord.scomments : "-",
                                importRetrieveOrDispose: true,
                               // spositionvalue: this.state.selectedRecord.spositionvalue,
                                // nneedaliquot: this.state.selectedRecord.nneedaliquot &&
                                //     this.state.selectedRecord.nneedaliquot ? true : false,
                                // nunitcode: this.state.selectedRecord.nunitcode && this.state.selectedRecord.nunitcode !== ""
                                //     ? this.state.selectedRecord.nunitcode : 0
                            }, 'create')}
                            hidden={this.props.userRoleControlRights.indexOf(retrieve) === -1}
                        >
                            <FontAwesomeIcon icon={faTrashRestore}></FontAwesomeIcon>{"  "}
                            {this.props.intl.formatMessage({ id: "IDS_RETRIEVE" })}


                        </button>
                    </Col>
                    <Col md={3}>
                        <button className="btn btn-primary" style={{ float: "right", marginRight: "1rem" }}
                            onClick={() => this.props.CRUDSampleStorageTransaction({
                                // sunitname: this.state.selectedRecord.nunitcode ? this.state.selectedRecord.nunitcode.label : "NA",
                                // saliquotsampleid: this.state.selectedRecord.saliquotsampleid
                                //     && this.state.selectedRecord.saliquotsampleid !== ""
                                //     ? this.state.selectedRecord.saliquotsampleid : "",
                                // nquantity: this.state.selectedRecord.nquantity
                                //     && this.state.selectedRecord.nquantity !== ""
                                //     ? this.state.selectedRecord.nquantity : 0,
                                ncontrolcode: dispose,
                                // 'nsamplestoragetransactioncode': this.state.selectedBarcodeValue && this.state.selectedBarcodeValue.nsamplestoragetransactioncode,
                                userinfo: this.props.userInfo,
                                // scomments: this.state.selectedRecord.scomments && this.state.selectedRecord.scomments !== ""
                                //     ? this.state.selectedRecord.scomments : "-",
                                    importRetrieveOrDispose: true,
                                // spositionvalue: this.state.selectedRecord.spositionvalue,
                                // nneedaliquot: this.state.selectedRecord.nneedaliquot &&
                                //     this.state.selectedRecord.nneedaliquot ? true : false
                            }, 'create')}
                            hidden={this.props.userRoleControlRights.indexOf(dispose) === -1}
                        >
                            <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>{"  "}
                            {this.props.intl.formatMessage({ id: "IDS_DISPOSE" })}

                        </button>
                    </Col>
                </Row>
                <Row>
            <Col md="12">
                    <DropZone
                        name={"sfilename"}
                        label={this.props.intl.formatMessage({ id: "IDS_FILENAME" })}
                        isMandatory={true}
                        maxFiles={"1"}
                        minSize={0}
                        maxSize={this.props.maxSize}
                        accept={".xlsx, .xls"}
                        onDrop={(event) => this.onDropFile(event, "sfilename", "1")}
                        actionType={this.props.actionType}
                        deleteAttachment={this.deleteAttachment}
                        multiple={this.props.multiple}
                        editFiles={this.state.selectedRecord ? this.state.selectedRecord : {}}
                        attachmentTypeCode={this.props.editFiles && this.props.editFiles.nattachmenttypecode}
                        fileSizeName="nfilesize"
                        fileName="sfilename"
                       // disabled={disabled}
                    />
            </Col>
        </Row>
            </Col>

        )
    }

}
export default injectIntl(BulkRetrieveOrDiposeSample);