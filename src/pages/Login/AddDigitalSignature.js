import React from 'react';
import { Col, Row, FormGroup, FormLabel, Image} from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import FormInput from '../../components/form-input/form-input.component';
import DropZone from '../../components/dropzone/dropzone.component';
import { attachmentType } from '../../components/Enumeration';
import { deleteAttachmentDropZone, onDropAttachFileList } from '../../components/CommonScript';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { updateStore } from '../../actions';
import { connect } from 'react-redux';

class AddDigitalSignature extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedDigiSign: this.props.selectedDigiSign,
            loading: false
        }
    }

    onDropImage = (attachedFiles, fieldName, maxSize) => {

        let selectedDigiSign = this.state.selectedDigiSign || {};
        let mandatoryFields = true;
        selectedDigiSign[fieldName] = onDropAttachFileList(selectedDigiSign[fieldName], attachedFiles, maxSize);
        if(selectedDigiSign[fieldName].length === 0){
            selectedDigiSign["ssecuritykey"] = "";
        }
        this.setState({ selectedDigiSign, actionType: "new" });
        this.props.childDataChange(selectedDigiSign, mandatoryFields);
    }

    deleteDigitalSignFile = (event, file, fieldName) => {
        let selectedDigiSign = this.state.selectedDigiSign || {};
        let mandatoryFields = true;
        selectedDigiSign[fieldName] = deleteAttachmentDropZone(selectedDigiSign[fieldName], file)
        selectedDigiSign["ssecuritykey"] = ""
        this.props.childDataChange(selectedDigiSign, mandatoryFields);
        this.setState({
            selectedDigiSign, actionType: "delete"
        });
    }

    onInputChange(event) {
        const selectedDigiSign = this.state.selectedDigiSign || {};
        if (selectedDigiSign.sdigisignname !== "" && selectedDigiSign.sdigisignname.length > 0) {
            selectedDigiSign[event.target.name] = event.target.value;
            this.props.childDataChange(selectedDigiSign);
            this.setState({ selectedDigiSign });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.selectedDigiSign !== prevProps.selectedDigiSign) {
            this.setState({ selectedDigiSign: this.props.selectedDigiSign })
        }
    }

    componentWillUnmount() { 
        const updateInfo = {
            typeName: DEFAULT_RETURN, 
            data: { isInitialRender: false  } 
        }
        this.props.updateStore(updateInfo);
    }
    

    render() {
        // const digitalSignImgPath = this.props.login.settings && this.state.selectedDigiSign && this.state.selectedDigiSign.sdigisignftp ? this.props.login.settings[6]+this.props.login.userInfo.sloginid+"/"+this.state.selectedDigiSign.sdigisignftp : null; 
        return (
            <>
                <Row>
                    <Col md={12}>
                        <DropZone
                            name={"sdigisignname"}
                            label={this.props.intl.formatMessage({ id: "IDS_DIGITALSIGNATURE" })}
                            maxFiles={1}
                            accept=".pfx"
                            minSize={0}
                            maxSize={1}
                            onDrop={(event) => this.onDropImage(event, "sdigisignname", 1)}
                            multiple={false}
                            editFiles={this.state.selectedDigiSign ? this.state.selectedDigiSign : {}}
                            attachmentTypeCode={this.props.operation === "update" ? attachmentType.OTHERS : ""}
                            fileName="sdigisignname"
                            deleteAttachment={this.deleteDigitalSignFile}
                            actionType={this.props.actionType}
                        />
                        <FormInput
                            name="ssecuritykey"
                            label={this.props.intl.formatMessage({ id: "IDS_SECURITYKEY" })}
                            type="password"
                            required={true}
                            isMandatory={this.state.selectedDigiSign && this.state.selectedDigiSign.sdigisignname && (this.state.selectedDigiSign.sdigisignname.hasOwnProperty("length") ?
                                this.state.selectedDigiSign.sdigisignname.length > 0 : this.state.selectedDigiSign.sdigisignname !== "") ? true : false}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SECURITYKEY" })}
                            onChange={(event) => this.onInputChange(event)}
                            value={this.state.selectedDigiSign && this.state.selectedDigiSign.ssecuritykey ? this.state.selectedDigiSign.ssecuritykey : ""}
                        />
                    </Col>
                    {/* <Col md={6}>
                        <FormGroup> */}
                            {/* <FormLabel><FormattedMessage id="IDS_DIGITALSIGNIMAGE" message="Digital Signature Image" /></FormLabel> */}
                            {/* {digitalSignImgPath === null ? "-" :
                                <a href={digitalSignImgPath} download>
                                    <Image src={digitalSignImgPath}
                                        width={200} height={200}
                                        rounded
                                        title={this.state.selectedDigiSign && this.state.selectedDigiSign.sdigisignname && this.state.selectedDigiSign.sdigisignname} />
                                </a>
                            } */}
                        {/* </FormGroup>
                    </Col> */}
                </Row>
            </>
        );
    };
}

export default connect(null, {updateStore})(injectIntl(AddDigitalSignature));