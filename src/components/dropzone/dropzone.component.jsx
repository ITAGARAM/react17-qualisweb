import React from 'react';
import { Form } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { ListGroup, Media, Image } from 'react-bootstrap';
import './dropzone.styles.jsx';
import { Dzwrap, DzMessage, Attachments } from './dropzone.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { getAttachedFileIcon } from '../FileIcon';
import { injectIntl } from 'react-intl';
import { bytesToSize } from '../CommonScript.js';
import { Nav } from 'react-bootstrap';

function DropZone({
   name,
   label,
   isMandatory,
   errors,
   deleteAttachment,
   onDrop,
   accept,
   minSize,
   maxSize,
   // maxFiles,
   // multiple,
   editFiles,
   attachmentTypeCode,
   fileSizeName,
   fileName,
   disabled,
   onDropAccepted,
   index,
   ...props
}) {
   // const { onDrop, accept, minSize, maxSize, maxFiles, multiple, editFiles, attachmentTypeCode, fileSizeName, fileName, disabled, label } = props;
   const { maxFiles, multiple } = props;
   let maxfileSize = maxSize * 1000000;
   const { fileRejections, getRootProps, getInputProps } = useDropzone({
      onDrop, accept, minSize, maxSize: maxfileSize,
      maxFiles: maxFiles, multiple: multiple, disabled, onDropAccepted,validator:nameLengthValidator
   });
   const fileRejectionItems = [...new Set(fileRejections.map(({ file, errors }) => {
      switch (errors[0].code) {
         case "file-invalid-type":
            return `${file.path}: ${props.intl.formatMessage({ id: "IDS_FILETYPENOTPERMITTED" })}`;

         case "too-many-files":
            return `${props.intl.formatMessage({ id: "IDS_MAXIMUMALLOWSONLY" })} ${maxFiles} ${props.intl.formatMessage({ id: "IDS_FILES" })}`;

         case "file-too-large":
            return `${file.path} ${props.intl.formatMessage({ id: "IDS_IS" })} ${bytesToSize(file.size)}`;
           
            case "name-too-large":
               return errors[0].message;
   
         default:
            return "";
      }
   })
   )]

   let files = [];
   if (props.actionType === "delete") {
      if (typeof editFiles[fileName] !== "string") {
         let list = editFiles[fileName]
         files = list && list.length > 0 ?
            list.map(file => (
               attachmentData(file, file.path, "name", "size"))) :
            editFiles && Object.values(editFiles).length > 0 ?
               attachmentData(editFiles, "filekeyname", fileName, fileSizeName) : ""
      } else {
         files = editFiles && Object.values(editFiles).length > 0 ?
            attachmentData(editFiles, "filekeyname", fileName, fileSizeName) : ""
      }

   }
   else {
      if (typeof editFiles[fileName] !== "string") {
         let list = editFiles[fileName]
         files = list && list.length > 0 ? list.map(file => (
            attachmentData(file, file.path, "name", "size")
         )) : editFiles && Object.values(editFiles).length > 0 ?
            attachmentData(editFiles, "filekeyname", fileName, fileSizeName) : ""
      } else {
         files = editFiles && Object.values(editFiles).length > 0 ?
            attachmentData(editFiles, "filekeyname", fileName, fileSizeName) : ""
      }
   }

   function nameLengthValidator(file) {
      const fileNameLength = 100;
      if (file.name.length > fileNameLength) {
        return {
          code: "name-too-large",
          message: `${file.name} ${props.intl.formatMessage({ id: "IDS_NAMEGREATERTHAN" })} ${fileNameLength} ${props.intl.formatMessage({ id: "IDS_CHARACTERS" })}`
        };
      }
    
      return null
    }

   function attachmentData(file, keyname, filename, size) {
      let fileExtension = "";
      if (filename !== "" && file[filename] !== undefined && file[filename] !== "") {
         if (typeof file[filename] === "object") {
            if (file[filename].length > 0) {
               const splittedFileName = file[filename][0]["name"].split('.');
               fileExtension = file[filename][0]["name"].split('.')[splittedFileName.length - 1];
            }
         } else {
            const splittedFileName = file[filename].split('.');
            fileExtension = file[filename].split('.')[splittedFileName.length - 1];
         }
      }
      if (fileExtension !== "") {
         return (
            <ListGroup.Item key={keyname}>
               <Attachments>
                  <Media className="align-items-center">
                     <Image
                        width={40}
                        height={40}
                        className="ml-2 mr-2 attachment-img-icon "
                        src={getAttachedFileIcon(fileExtension)}
                     />
                     <Media.Body>
                        <h5 className="mt-0 attachment-title">{typeof file[filename] === "object" ? file[filename][0]["name"] : file[filename]}</h5>
                        {size !== "" ? <div className="attachment-details">{typeof file[filename] === "object" ? bytesToSize(file[filename][0]["size"]) : bytesToSize(file[size])}</div> : ""}
                     </Media.Body>
                     { 
                        props.needdelete?"":
                     //multiple ?
                        <Nav.Link name="deleteAttachment"
                           className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                           data-tooltip-id="my-tooltip" data-tooltip-content={props.intl.formatMessage({ id: "IDS_DELETE" })}   //ALPD-1111 Fix
                           //onClick = {deleteAttachment}
                           onClick={(event) => deleteAttachment(event, file, fileName,index)}
                        >
                           <FontAwesomeIcon icon={faTrashAlt} />
                        </Nav.Link>

                    // :""
                     }
                  </Media>
               </Attachments>
            </ListGroup.Item>
         );
      }
   }

   return (
      <Dzwrap>
         <Form.Group>
            <Form.Label htmlFor={name}>{label}{isMandatory && <sup>*</sup>}</Form.Label>
            <div {...getRootProps({ className: 'dropzone' })}>
               <input {...getInputProps()} />
               <DzMessage className="text-center">
                  <FontAwesomeIcon icon={faFileUpload} size="2x" /> <br />
                   {/**ALPDJ21-118 - Suriaprahash - Grid Based Result Entry -30/09/2025**/}
                  {props.hideMsg ? "":
                     <div>
                     
                        <span className="text-uppercase font-weight-bold">{`${props.intl.formatMessage({ id: "IDS_DRAGANDDROP" })}`}</span>
                     <br /> {`${props.intl.formatMessage({ id: "IDS_OR" })}`} <span className="drop-link">
                        {`${props.intl.formatMessage({ id: "IDS_CLICKHERE" })}`}</span> {`${props.intl.formatMessage({ id: "IDS_TOUPLOAD" })}`}
                     <br />{`(${props.intl.formatMessage({ id: "IDS_MAXALLOWS" })} 
                     ${maxFiles} ${props.intl.formatMessage({ id: "IDS_FILESIZEOF" })} 
                     ${maxSize} ${props.intl.formatMessage({ id: "IDS_MB" })})`}
                     <br />{`(${props.intl.formatMessage({ id: "IDS_MAXALLOWSFILENAMEOF" })} 
                     ${100} ${props.intl.formatMessage({ id: "IDS_CHARACTERS" })})`}
                     
                     </div>
                  }

               </DzMessage>
            </div>
            <Form.Control.Feedback type="invalid" className="d-block">
               {fileRejectionItems.join(",")}
            </Form.Control.Feedback>
            <ListGroup variant="flush">
               {files}
            </ListGroup>
         </Form.Group>
      </Dzwrap>
   );
}

export default injectIntl(DropZone);