import { Button,Modal } from "react-bootstrap"
import React, { useEffect, useRef, useState } from "react"
import { FormattedMessage, injectIntl } from "react-intl"
import { toast } from 'react-toastify';
import {intl} from '../../components/App'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPaperclip, faSave} from "@fortawesome/free-solid-svg-icons";
import { faWindowClose } from "@fortawesome/free-regular-svg-icons";

const AddorUpdateProfileImage =(props)=>{

    const[uploadedImage,setUploadedImage]=useState();
    const[imageRef,setImageRef]=useState();
    const hiddenFileInput = useRef(null);
    const imageFormat=['image/gif','image/jpeg', 'image/png']
    const [isBase64Image,setIsBase64Image]=useState(false);

    let imageSource = props.srcImage;

  const imageStyle={
    border:"0.5px solid #538cc6",
    borderRadius:"100%",
    width:props.width,
    height:props.height
  }
    
    useEffect(()=>{
        if(uploadedImage!=='' && uploadedImage!==undefined){
            setImageRef(URL.createObjectURL(uploadedImage))
        }
    },[uploadedImage])

    useEffect( () => {
              if(imageSource!=="" && imageSource!==null && imageSource!==undefined){
                if(imageSource.includes('data:image')){
                  setIsBase64Image(true)
                }               
              }
    },[imageSource])

   const handleImageAsFile=(e)=>{    
          if(e.target.files && e.target.files.length===1){  
            if(e.target.files[0].type=== 'image/gif' || e.target.files[0].type === 'image/jpeg' || e.target.files[0].type === 'image/png'){   

              if(e.target.files[0].size/1024 <= 500){ 
                      setUploadedImage(e.target.files[0])
                  }
              else{
                toast.warn(intl.formatMessage({id:"IDS_UPLOADIMAGE_SIZE_ALERT"}))
              }
          }else{
             toast.warn(intl.formatMessage({id:"IDS_INVALIDFILEFORMAT"}))
          }
        }
   };


   const handleHiddenInputClick=()=>{
    hiddenFileInput.current.click();
   }
    return( 
        <>
          <Modal show={props.isOpen} onHide={()=>props.onhandleClosedDialog()} size="md" centered backdrop="static" keyboard={false}>
            <Modal.Header closeButton className="border-0">
              {/* <Modal.Title><FormattedMessage id={props.dialogTitle}/></Modal.Title> */}
            </Modal.Header>
            <Modal.Body>
            {!imageRef ?
               (
                 <>
                    <div id='uploadImage' style={{display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}} onClick={handleHiddenInputClick}>    
                              <div>
                                 {!isBase64Image &&<img src={props.srcImage} alt="" style={imageStyle}/>}
                                {isBase64Image && <img src={props.srcImage} alt="" className="rounded-circle" style={imageStyle}/> }
                                <br/>
                              </div>
                            <input type="file" accept={imageFormat} style={{display:'none'}} ref={hiddenFileInput} onChange={e=>handleImageAsFile(e)}/>
                            <br/>
                            <br/>                      
                      </div>               
                 </>
                 ):(
                        <>
                            <div id='previewImage' style={{display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}} onClick={handleHiddenInputClick}>     
                                    <div>
                                    <img src={imageRef} alt='' onLoad={(event)=>props.onUploadingImage(event,uploadedImage)} id="previewImage" style={imageStyle}/>
                                          <br/>
                                    </div>
                                    <input type="file" accept={imageFormat} style={{display:'none'}} ref={hiddenFileInput} onChange={e=>handleImageAsFile(e)}/>
                                    <br/>
                                    <br/>                   
                            </div>                          
                         </>
                         )}
                         <div className="px-3 pt-3" style={{alignItems:'center',justifyContent:'center',textAlign:'justify'}}>{props.children}</div>
                         
            <div style={{display:'flex',alignItems:'center',justifyContent:'right'}} className="mt-4"> 
              <Button variant="" className="btn-user btn-cancel"  onClick={()=>props.onhandleClosedDialog()}><FormattedMessage id="IDS_CANCEL"/></Button>
              <Button variant="primary" className="btn-user btn-primary-blue" onClick={handleHiddenInputClick}>
                <FormattedMessage id="IDS_CHOOSEFILE"/>
              </Button>
              <Button variant="primary" className={`btn-user btn-primary-blue ${!imageRef ? 'btn-secondary' : ''}`} disabled={!imageRef ? "true" : ""} onClick={()=>props.onSubmitDialog()}> <FormattedMessage id="IDS_SAVE"/></Button>
              {/* {imageRef && <Button variant="primary" className={`btn-user btn-primary-blue ${imageRef ? 'dasdsd' : ''}`} onClick={()=>props.onSubmitDialog()}> <FormattedMessage id="IDS_SAVE"/></Button>} */}
              
              </div>
            </Modal.Body>
          </Modal>    
          </>
      )
}
export default injectIntl(AddorUpdateProfileImage)