import { create_UUID, Lims_JSON_stringify } from "../../../components/CommonScript";
import { attachmentType, transactionStatus } from "../../../components/Enumeration";

export function onSaveSampleAttachment(saveParam, selectedMaster) {

    const formData = new FormData();
    const selectedRecord = saveParam.selectedRecord;
    const acceptedFiles = selectedRecord.sfilename;
    const nattachmenttypecode = selectedRecord.nattachmenttypecode;
    let isFileEdited = transactionStatus.NO;
    let fileArray = [];
    let samindex = {
        index: 0
    };
    if (nattachmenttypecode === attachmentType.FTP) {
        if (acceptedFiles && Array.isArray(acceptedFiles) && acceptedFiles.length > 0) {
            acceptedFiles.forEach((file, index) => {

                const splittedFileName = file.name.split('.');
                const fileExtension = file.name.split('.')[splittedFileName.length - 1];
                // const uniquefilename = nattachmenttypecode === attachmentType.FTP? selectedRecord.nregattachmentcode && selectedRecord.nregattachmentcode>0 
                //         ? selectedRecord.ssystemfilename: create_UUID()+'.'+fileExtension: "";


                selectedMaster.forEach((sample, sampleindex) => {
                    const fileName = selectedRecord.nregattachmentcode && selectedRecord.nregattachmentcode > 0 && selectedRecord.ssystemfilename && selectedRecord.ssystemfilename !== "" ? selectedRecord.ssystemfilename.split('.')[0] : create_UUID()
                    const uniquefilename = fileName + '.' + fileExtension;
                    const tempData = {};
                    tempData['nregattachmentcode'] = selectedRecord.nregattachmentcode ? selectedRecord.nregattachmentcode : 0;
                    tempData["npreregno"] = sample.npreregno;
                    tempData['nformcode'] = saveParam.userInfo.nformcode
                    tempData['nusercode'] = saveParam.userInfo.nusercode
                    tempData['nuserrolecode'] = saveParam.userInfo.nuserrole
                    tempData["nlinkcode"] = transactionStatus.NA;
                    // tempData["nfilesize"] = file.size;
                    tempData['jsondata'] = {
                       // susername:saveParam.userInfo.susername,
                        susername:Lims_JSON_stringify(saveParam.userInfo.susername ? saveParam.userInfo.susername.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false) ,
                       // suserrolename: saveParam.userInfo.suserrolename,
                        suserrolename:Lims_JSON_stringify(saveParam.userInfo.suserrolename ? saveParam.userInfo.suserrolename.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false) ,
                        ssystemfilename: uniquefilename,
                        sfilename:Lims_JSON_stringify(file.name.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim(),false) ,
                        nfilesize: file.size,
                        sdescription:Lims_JSON_stringify(selectedRecord.sdescription ? selectedRecord.sdescription.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false) ,
                        slinkname: "",
                        sheader:Lims_JSON_stringify(selectedRecord.sheader ? selectedRecord.sheader.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false) ,
                    }
                    tempData['nattachmenttypecode'] = nattachmenttypecode
                    // tempData["ssystemfilename"] = uniquefilename;
                    // tempData["sfilename"] = file.name.trim();
                    // tempData["sdescription"] = selectedRecord.sdescription? selectedRecord.sdescription.trim(): "";
                    tempData['nstatus'] = transactionStatus.ACTIVE;



                    formData.append("uploadedFile" + samindex["index"], file);
                    formData.append("uniquefilename" + samindex["index"], uniquefilename);
                    fileArray.push(tempData);
                    samindex["index"] = samindex["index"] + 1;
                })
            });
            formData.append("filecount", (acceptedFiles.length * selectedMaster.length));

            isFileEdited = transactionStatus.YES;
        } else {
            selectedMaster.forEach(sample => {
                let sampleFile = {};
                sampleFile['nregattachmentcode'] = selectedRecord.nregattachmentcode ? selectedRecord.nregattachmentcode : 0;
                sampleFile["npreregno"] = sample.npreregno;
                sampleFile['nformcode'] = saveParam.userInfo.nformcode
                sampleFile['nusercode'] = saveParam.userInfo.nusercode
                sampleFile['nuserrolecode'] = saveParam.userInfo.nuserrole
                sampleFile["nlinkcode"] = transactionStatus.NA;
                // sampleFile["nfilesize"] = selectedRecord.nfilesize;
                sampleFile['nattachmenttypecode'] = nattachmenttypecode
                sampleFile['jsondata'] = {
                   // susername: saveParam.userInfo.susername,
                    susername : Lims_JSON_stringify( saveParam.userInfo.susername ? saveParam.userInfo.susername.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false),
                   // suserrolename: saveParam.userInfo.suserrolename,
                    suserrolename : Lims_JSON_stringify( saveParam.userInfo.suserrolename ? saveParam.userInfo.suserrolename.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false),
                    ssystemfilename: selectedRecord.ssystemfilename,
                    sfilename:Lims_JSON_stringify(selectedRecord.sfilename.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim(),false)  ,
                    nfilesize: selectedRecord.nfilesize,
                    sdescription:Lims_JSON_stringify( selectedRecord.sdescription ? selectedRecord.sdescription.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false),
                    slinkname: "",
                    sheader:Lims_JSON_stringify(selectedRecord.sheader ? selectedRecord.sheader.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false) ,

                }
                sampleFile["ssystemfilename"] = selectedRecord.ssystemfilename;
                sampleFile["sfilename"] = Lims_JSON_stringify(selectedRecord.sfilename.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim(),false) ;
                // sampleFile["sdescription"] = selectedRecord.sdescription? selectedRecord.sdescription.trim(): "";
                sampleFile['nstatus'] = transactionStatus.ACTIVE;
                fileArray.push(sampleFile);
            })
        }
    } else {
        selectedMaster.forEach(sample => {
            let sampleFile = {};
            sampleFile['nregattachmentcode'] = selectedRecord.nregattachmentcode ? selectedRecord.nregattachmentcode : 0;
            sampleFile["npreregno"] = sample.npreregno;
            sampleFile['nformcode'] = saveParam.userInfo.nformcode
            sampleFile['nusercode'] = saveParam.userInfo.nusercode
            sampleFile['nuserrolecode'] = saveParam.userInfo.nuserrole
            sampleFile["nlinkcode"] = selectedRecord.nlinkcode.value ? selectedRecord.nlinkcode.value : -1;
            sampleFile['jsondata'] = {
               // susername: saveParam.userInfo.susername,
                susername:Lims_JSON_stringify(saveParam.userInfo.susername ? saveParam.userInfo.susername.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim(): "",false),
               // suserrolename: saveParam.userInfo.suserrolename,
               suserrolename:Lims_JSON_stringify(saveParam.userInfo.suserrolename? saveParam.userInfo.suserrolename.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim(): "",false),
                ssystemfilename: "",
                sfilename:Lims_JSON_stringify( selectedRecord.slinkfilename.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim(),false),
                nfilesize: 0,
                slinkname: selectedRecord.nlinkcode.label,
                sdescription:Lims_JSON_stringify(  selectedRecord.slinkdescription ? selectedRecord.slinkdescription.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim(): "",false),
                sheader:Lims_JSON_stringify(selectedRecord.sheader ? selectedRecord.sheader.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false) ,

            }
            sampleFile['nattachmenttypecode'] = nattachmenttypecode
            // sampleFile["ssystemfilename"] = "";
            sampleFile['nstatus'] = transactionStatus.ACTIVE;
            fileArray.push(sampleFile);
        })
    }
    formData.append("ncontrolCode", saveParam.ncontrolCode);
    formData.append("isFileEdited", isFileEdited);
    formData.append("sampleattachment", JSON.stringify(fileArray));
    //ALPD-1728
    //formData.append("sampleattachment", JSON.stringify(fileArray[0]).replaceAll('\\n','#r#'));
    formData.append("nattachmenttypecode", nattachmenttypecode);
    formData.append("npreregno", saveParam.npreregno);
    //formData.append("userinfo", JSON.stringify(saveParam.userInfo));
    formData.append("userinfo", JSON.stringify({...saveParam.userInfo,
                                                sformname: Lims_JSON_stringify(saveParam.userInfo.sformname),
                                                smodulename: Lims_JSON_stringify(saveParam.userInfo.smodulename),
                                                slanguagename: Lims_JSON_stringify(saveParam.userInfo.slanguagename)}));
    const inputParam = {
       // inputData: { userinfo: saveParam.userInfo },
       inputData: {// userinfo: saveParam.userInfo },
                    "userinfo": {...saveParam.userInfo,
                    sformname: Lims_JSON_stringify(saveParam.userInfo.sformname),
                    smodulename: Lims_JSON_stringify(saveParam.userInfo.smodulename),
                    slanguagename: Lims_JSON_stringify(saveParam.userInfo.slanguagename)}},
        formData: formData,
        isFileupload: true,
        operation: saveParam.operation,
        classUrl: "attachment",
        saveType: saveParam.saveType,
        formRef: saveParam.formRef,
        methodUrl: "SampleAttachment"
    }
    return inputParam;
}

export function onSaveTestAttachment(saveParam, selectedMaster) {

    const formData = new FormData();
    const selectedRecord = saveParam.selectedRecord;
    const acceptedFiles = selectedRecord.sfilename;
    const nattachmenttypecode = selectedRecord.nattachmenttypecode;
    let isFileEdited = transactionStatus.NO;
    let fileArray = [];
    let testindex1 = {
        index: 0
    };

    if (nattachmenttypecode === attachmentType.FTP) {
        if (acceptedFiles && Array.isArray(acceptedFiles) && acceptedFiles.length > 0) {
            if(saveParam.operation==='create'){
                acceptedFiles.forEach((file, index) => {

                    const splittedFileName = file.name.split('.');
                    const fileExtension = file.name.split('.')[splittedFileName.length - 1];
    
    
                    selectedMaster.forEach((test, testindex) => {
                        const fileName = selectedRecord.nregattachmentcode && selectedRecord.nregattachmentcode > 0 && selectedRecord.ssystemfilename && selectedRecord.ssystemfilename !== "" ? selectedRecord.ssystemfilename.split('.')[0] : create_UUID()
                        const uniquefilename = fileName + '.' + fileExtension;
                        const tempData = {};
                        tempData['ntestattachmentcode'] = selectedRecord.ntestattachmentcode ? selectedRecord.ntestattachmentcode : 0;
                        tempData["ntransactiontestcode"] = test.ntransactiontestcode;
                        tempData["ntransactionsamplecode"] = test.ntransactionsamplecode;
                        tempData["npreregno"] = test.npreregno;
                        tempData['nformcode'] = saveParam.userInfo.nformcode
                        tempData['nusercode'] = saveParam.userInfo.nusercode
                        tempData['nuserrolecode'] = saveParam.userInfo.nuserrole
                        tempData["nlinkcode"] = transactionStatus.NA;
                        tempData['nattachmenttypecode'] = nattachmenttypecode
                        tempData['jsondata'] = {
                            stestsynonym:Lims_JSON_stringify(test.stestsynonym.trim(),false),
                           // susername: saveParam.userInfo.susername,
                            susername:Lims_JSON_stringify(saveParam.userInfo.susername ? saveParam.userInfo.susername.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false),            
                           // suserrolename: saveParam.userInfo.suserrolename,
                            suserrolename:Lims_JSON_stringify(saveParam.userInfo.suserrolename ? saveParam.userInfo.suserrolename.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false),
                            nfilesize: file.size,
                            ssystemfilename: uniquefilename,
                            sfilename:Lims_JSON_stringify(file.name.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim(),false) ,
                            slinkname: "",                         
                            sdescription:Lims_JSON_stringify(selectedRecord.sdescription ? selectedRecord.sdescription.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false),
                            nneedreport:selectedRecord.nneedreport ?  selectedRecord.nneedreport  : transactionStatus.NO,
                            sheader:Lims_JSON_stringify(selectedRecord.sheader ? selectedRecord.sheader.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false),
                        }
                        // tempData["nfilesize"] = file.size; :
                        // tempData["ssystemfilename"] = uniquefilename;
                        // tempData["sfilename"] = file.name.trim();
                        // tempData["sdescription"] = selectedRecord.sdescription? selectedRecord.sdescription.trim(): "";
                        tempData['nstatus'] = transactionStatus.ACTIVE;
    
    
                        formData.append("uploadedFile" + testindex1["index"], file);
                        formData.append("uniquefilename" + testindex1["index"], uniquefilename);
                        fileArray.push(tempData);
                        testindex1["index"] = testindex1["index"] + 1;
                    })
                });
                formData.append("filecount", (acceptedFiles.length * selectedMaster.length));
                isFileEdited = transactionStatus.YES;
            }else {
                acceptedFiles.forEach((file, index) => {

                    const splittedFileName = file.name.split('.');
                    const fileExtension = file.name.split('.')[splittedFileName.length - 1];
    
    
                    selectedMaster.forEach((test, testindex) => {
                        const fileName = selectedRecord.nregattachmentcode && selectedRecord.nregattachmentcode > 0 && selectedRecord.ssystemfilename && selectedRecord.ssystemfilename !== "" ? selectedRecord.ssystemfilename.split('.')[0] : create_UUID()
                        const uniquefilename = fileName + '.' + fileExtension;
                        const tempData = {};
                        tempData['ntestattachmentcode'] = selectedRecord.ntestattachmentcode ? selectedRecord.ntestattachmentcode : 0;
                        tempData["ntransactiontestcode"] = selectedRecord.ntransactiontestcode;
                        tempData["ntransactionsamplecode"] = selectedRecord.ntransactionsamplecode;
                        tempData["npreregno"] = selectedRecord.npreregno;
                        tempData['nformcode'] = saveParam.userInfo.nformcode
                        tempData['nusercode'] = saveParam.userInfo.nusercode
                        tempData['nuserrolecode'] = saveParam.userInfo.nuserrole
                        tempData["nlinkcode"] = transactionStatus.NA;
                        tempData['nattachmenttypecode'] = nattachmenttypecode
                        tempData['jsondata'] = {
                            stestsynonym:Lims_JSON_stringify(selectedRecord.stestsynonym.trim(),false),
                            // susername: saveParam.userInfo.susername,
                            susername:Lims_JSON_stringify(saveParam.userInfo.susername ? saveParam.userInfo.susername.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false),
                             // suserrolename: saveParam.userInfo.suserrolename,
                            suserrolename:Lims_JSON_stringify(saveParam.userInfo.suserrolename ? saveParam.userInfo.suserrolename.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false),
                            nfilesize: file.size,
                            ssystemfilename: uniquefilename,
                            sfilename:Lims_JSON_stringify(file.name.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim(),false) ,
                            slinkname: "",
                            sdescription:Lims_JSON_stringify(selectedRecord.sdescription ? selectedRecord.sdescription.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim():"",false),
                            nneedreport:selectedRecord.nneedreport ?  selectedRecord.nneedreport  : transactionStatus.NO   ,
                            sheader:Lims_JSON_stringify(selectedRecord.sheader ? selectedRecord.sheader.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false) ,
                        }
                        // tempData["nfilesize"] = file.size;
                        // tempData["ssystemfilename"] = uniquefilename;
                        // tempData["sfilename"] = file.name.trim();
                        // tempData["sdescription"] = selectedRecord.sdescription? selectedRecord.sdescription.trim(): "";
                        tempData['nstatus'] = transactionStatus.ACTIVE;
    
    
                        formData.append("uploadedFile" + testindex1["index"], file);
                        formData.append("uniquefilename" + testindex1["index"], uniquefilename);
                        fileArray.push(tempData);
                        testindex1["index"] = testindex1["index"] + 1;
                    })
                });
                formData.append("filecount", (acceptedFiles.length * selectedMaster.length));
                isFileEdited = transactionStatus.YES;
            }

            
        } else {
            selectedMaster.forEach(test => {
                let sampleFile = {};
                sampleFile['ntestattachmentcode'] = selectedRecord.ntestattachmentcode ? selectedRecord.ntestattachmentcode : 0;
                sampleFile["ntransactiontestcode"] = selectedRecord.ntransactiontestcode;
                sampleFile["ntransactionsamplecode"] = selectedRecord.ntransactionsamplecode;
                sampleFile["npreregno"] = selectedRecord.npreregno;
                sampleFile['nformcode'] = saveParam.userInfo.nformcode
                sampleFile['nusercode'] = saveParam.userInfo.nusercode
                sampleFile['nuserrolecode'] = saveParam.userInfo.nuserrole
                sampleFile["nlinkcode"] = transactionStatus.NA;
                // sampleFile["nfilesize"] = selectedRecord.nfilesize;
                sampleFile['nattachmenttypecode'] = nattachmenttypecode
                sampleFile['jsondata'] = {
                    stestsynonym:Lims_JSON_stringify(selectedRecord.stestsynonym.trim(),false),
                    // susername: saveParam.userInfo.susername,
                    susername:Lims_JSON_stringify(saveParam.userInfo.susername ? saveParam.userInfo.susername.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false),                            
                    // suserrolename: saveParam.userInfo.suserrolename,
                    suserrolename:Lims_JSON_stringify(saveParam.userInfo.suserrolename ? saveParam.userInfo.suserrolename.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false),
                    nfilesize: selectedRecord.size,
                    ssystemfilename: selectedRecord.ssystemfilename,
                    sfilename:Lims_JSON_stringify(selectedRecord.sfilename.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim(),false) ,
                    slinkname: "",
                    sdescription:Lims_JSON_stringify(selectedRecord.sdescription ? selectedRecord.sdescription.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim(): "",false),
                    nneedreport:selectedRecord.nneedreport ? selectedRecord.nneedreport : transactionStatus.NO,
                    sheader:Lims_JSON_stringify(selectedRecord.sheader ? selectedRecord.sheader.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false) ,
                }
                // sampleFile["ssystemfilename"] = selectedRecord.ssystemfilename;
                // sampleFile["sfilename"] = selectedRecord.sfilename.trim();
                // sampleFile["sdescription"] = selectedRecord.sdescription? selectedRecord.sdescription.trim(): "";
                sampleFile['nstatus'] = transactionStatus.ACTIVE;
                fileArray.push(sampleFile);
            })
        }
    } else {
        if(saveParam.operation==='create'){
            selectedMaster.forEach(test => {
                let sampleFile = {};
                sampleFile['ntestattachmentcode'] = selectedRecord.ntestattachmentcode ? selectedRecord.ntestattachmentcode : 0;
                sampleFile["ntransactiontestcode"] = test.ntransactiontestcode;
                sampleFile["ntransactionsamplecode"] = test.ntransactionsamplecode;
                sampleFile["npreregno"] = test.npreregno;
                sampleFile['nformcode'] = saveParam.userInfo.nformcode
                sampleFile['nusercode'] = saveParam.userInfo.nusercode
                sampleFile['nuserrolecode'] = saveParam.userInfo.nuserrole
                sampleFile["nlinkcode"] = selectedRecord.nlinkcode.value ? selectedRecord.nlinkcode.value : -1;
                sampleFile["jsondata"] = {
                    stestsynonym:Lims_JSON_stringify(test.stestsynonym.trim(),false),
                    // susername: saveParam.userInfo.susername,
                    susername:Lims_JSON_stringify(saveParam.userInfo.susername ? saveParam.userInfo.susername.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false),                        
                    // suserrolename: saveParam.userInfo.suserrolename,
                    suserrolename:Lims_JSON_stringify(saveParam.userInfo.suserrolename ? saveParam.userInfo.suserrolename.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false),
                    ssystemfilename: "",
                    sfilename:Lims_JSON_stringify(selectedRecord.slinkfilename.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim(),false)  ,
                    nfilesize: 0,
                    slinkname: selectedRecord.nlinkcode.label,
                    sdescription:Lims_JSON_stringify( selectedRecord.slinkdescription ? selectedRecord.slinkdescription.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false),
                    nneedreport : transactionStatus.NO,
                    sheader:Lims_JSON_stringify(selectedRecord.sheader ? selectedRecord.sheader.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false) ,
                };
                sampleFile['nattachmenttypecode'] = nattachmenttypecode
                sampleFile['nstatus'] = transactionStatus.ACTIVE;
                fileArray.push(sampleFile);
            })
        }else {
            selectedMaster.forEach(test => {
                let sampleFile = {};
                sampleFile['ntestattachmentcode'] = selectedRecord.ntestattachmentcode ? selectedRecord.ntestattachmentcode : 0;
                sampleFile["ntransactiontestcode"] = selectedRecord.ntransactiontestcode;
                sampleFile["ntransactionsamplecode"] = selectedRecord.ntransactionsamplecode;
                sampleFile["npreregno"] = selectedRecord.npreregno;
                sampleFile['nformcode'] = saveParam.userInfo.nformcode
                sampleFile['nusercode'] = saveParam.userInfo.nusercode
                sampleFile['nuserrolecode'] = saveParam.userInfo.nuserrole
                sampleFile["nlinkcode"] = selectedRecord.nlinkcode.value ? selectedRecord.nlinkcode.value : -1;
                sampleFile["jsondata"] = {
                    stestsynonym:Lims_JSON_stringify(selectedRecord.stestsynonym.trim(),false),
                     // susername: saveParam.userInfo.susername,
                     susername:Lims_JSON_stringify(saveParam.userInfo.susername ? saveParam.userInfo.susername.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false),                            
                     // suserrolename: saveParam.userInfo.suserrolename,
                     suserrolename:Lims_JSON_stringify(saveParam.userInfo.suserrolename ? saveParam.userInfo.suserrolename.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false),
                    ssystemfilename: "",
                    sfilename:Lims_JSON_stringify(selectedRecord.slinkfilename.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim(),false)  ,
                    nfilesize: 0,
                    slinkname: selectedRecord.nlinkcode.label,
                    sdescription:Lims_JSON_stringify(selectedRecord.slinkdescription ? selectedRecord.slinkdescription.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim():"",false),
                    nneedreport : transactionStatus.NO,
                    sheader:Lims_JSON_stringify(selectedRecord.sheader ? selectedRecord.sheader.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false) ,
                };
                sampleFile['nattachmenttypecode'] = nattachmenttypecode
                sampleFile['nstatus'] = transactionStatus.ACTIVE;
                fileArray.push(sampleFile);
            })
        }

    }
    formData.append("isFileEdited", isFileEdited);
    formData.append("testattachment", JSON.stringify(fileArray));
    //ALPD-1728
   // formData.append("testattachment", JSON.stringify(fileArray[0]).replaceAll('\\n','#r#'));
    formData.append("nattachmenttypecode", nattachmenttypecode);
    formData.append("ntransactiontestcode", saveParam.ntransactiontestcode);
   // formData.append("userinfo", JSON.stringify(saveParam.userInfo));


    const inputParam = {
        inputData: { "userinfo": {...saveParam.userInfo,
            sformname: Lims_JSON_stringify(saveParam.userInfo.sformname),
            smodulename: Lims_JSON_stringify(saveParam.userInfo.smodulename),
            slanguagename: Lims_JSON_stringify(saveParam.userInfo.slanguagename)} },
        formData: formData,
        isFileupload: true,
        operation: saveParam.operation,
        classUrl: "attachment",
        saveType: saveParam.saveType,
        formRef: saveParam.formRef,
        methodUrl: "TestAttachment"
    }
    return inputParam;
}

export function onSaveBatchAttachment(saveParam, selectedMaster) {

    const formData = new FormData();
    const selectedRecord = saveParam.selectedRecord;
    const acceptedFiles = selectedRecord.sfilename;
    const nattachmenttypecode = selectedRecord.nattachmenttypecode;
    let isFileEdited = transactionStatus.NO;
    let fileArray = [];
    let nreleasebatchcode = selectedMaster.nreleasebatchcode;

    if (nattachmenttypecode === attachmentType.FTP) {
        if (acceptedFiles && Array.isArray(acceptedFiles) && acceptedFiles.length > 0) {
            acceptedFiles.forEach((file, index) => {

                const splittedFileName = file.name.split('.');
                const fileExtension = file.name.split('.')[splittedFileName.length - 1];
                const fileName = selectedRecord.nbatchfilecode && selectedRecord.nbatchfilecode > 0 &&
                    selectedRecord.ssystemfilename && selectedRecord.ssystemfilename !== "" ?
                    selectedRecord.ssystemfilename.split('.')[0] : create_UUID()
                const uniquefilename = fileName + '.' + fileExtension;

                //selectedMaster.forEach(sample=>{

                const tempData = {};
                tempData['nbatchfilecode'] = selectedRecord.nbatchfilecode ?
                    selectedRecord.nbatchfilecode : 0;
                tempData["nreleasebatchcode"] = selectedMaster.nreleasebatchcode;
                tempData["nlinkcode"] = transactionStatus.NA;
                tempData['nattachmenttypecode'] = nattachmenttypecode;
                tempData["ssystemfilename"] = uniquefilename;
                tempData["sfilename"] =Lims_JSON_stringify(file.name.trim(),false)  ;
                tempData["sdescription"] =Lims_JSON_stringify( selectedRecord.sdescription ? selectedRecord.sdescription.trim().replaceAll('\\n','#r#'):"",false)  ;
                tempData['nstatus'] = transactionStatus.ACTIVE;


                formData.append("uploadedFile" + index, file);
                formData.append("uniquefilename" + index, uniquefilename);
                fileArray.push(tempData);
                //nreleasebatchcode.push(selectedMaster.releasebatchcode)
                //})
            });
            formData.append("filecount", acceptedFiles.length);
            isFileEdited = transactionStatus.YES;
        }
        else {
            // selectedMaster.forEach(sample=>{
            let sampleFile = {};
            sampleFile['nbatchfilecode'] = selectedRecord.nbatchfilecode ? selectedRecord.nbatchfilecode : 0;
            sampleFile["nreleasebatchcode"] = selectedMaster.nreleasebatchcode;
            sampleFile["nlinkcode"] = transactionStatus.NA;
            sampleFile['nattachmenttypecode'] = nattachmenttypecode
            sampleFile["ssystemfilename"] = selectedRecord.ssystemfilename;
            sampleFile["sfilename"] =Lims_JSON_stringify(selectedRecord.sfilename.trim(),false)  ;
            sampleFile["sdescription"] =Lims_JSON_stringify(  selectedRecord.sdescription ? selectedRecord.sdescription.trim().replaceAll('\\n','#r#') : "",false);
            sampleFile['nstatus'] = transactionStatus.ACTIVE;

            //npreregno.push(sample.npreregno)
            fileArray.push(sampleFile);
            // })
        }
    } else {
        //selectedMaster.forEach(sample=>{
        let sampleFile = {};
        sampleFile['nbatchfilecode'] = selectedRecord.nbatchfilecode ? selectedRecord.nbatchfilecode : 0;
        sampleFile["nreleasebatchcode"] = selectedMaster.nreleasebatchcode;
        sampleFile["nlinkcode"] = selectedRecord.nlinkcode.value ? selectedRecord.nlinkcode.value : -1;
        sampleFile['nattachmenttypecode'] = nattachmenttypecode
        sampleFile["ssystemfilename"] = "";
        sampleFile["sfilename"] =Lims_JSON_stringify(selectedRecord.slinkfilename.trim(),false)  ;
        sampleFile["sdescription"] =Lims_JSON_stringify(selectedRecord.slinkdescription ? selectedRecord.slinkdescription.trim() : "",false)  ;
        sampleFile['nstatus'] = transactionStatus.ACTIVE;
        fileArray.push(sampleFile);
        //npreregno.push(sample.npreregno)
        //})  
    }
    formData.append("isFileEdited", isFileEdited);
    formData.append("batchcreationfile", JSON.stringify(fileArray));
    //ALPD-1728
    //formData.append("batchcreationfile", JSON.stringify(fileArray[0]).replaceAll('\\n','#r#'));
    formData.append("nattachmenttypecode", nattachmenttypecode);
    formData.append("nreleasebatchcode", nreleasebatchcode);
    formData.append("userinfo", JSON.stringify(saveParam.userInfo));

    const inputParam = {
        inputData: { userinfo: saveParam.userInfo },
        formData: formData,
        isFileupload: true,
        operation: saveParam.operation,
        classUrl: "attachment",
        saveType: saveParam.saveType,
        formRef: saveParam.formRef,
        methodUrl: "BatchCreationFile"
    }
    return inputParam;
}

export function onSaveSubSampleAttachment(saveParam, selectedMaster) {

    const formData = new FormData();
    const selectedRecord = saveParam.selectedRecord;
    const acceptedFiles = selectedRecord.sfilename;
    const nattachmenttypecode = selectedRecord.nattachmenttypecode;
    let isFileEdited = transactionStatus.NO;
    let fileArray = [];
    let samindex = {
        index: 0
    };
    if (nattachmenttypecode === attachmentType.FTP) {
        if (acceptedFiles && Array.isArray(acceptedFiles) && acceptedFiles.length > 0) {
            acceptedFiles.forEach((file, index) => {

                const splittedFileName = file.name.split('.');
                const fileExtension = file.name.split('.')[splittedFileName.length - 1];
                // const uniquefilename = nattachmenttypecode === attachmentType.FTP? selectedRecord.nregattachmentcode && selectedRecord.nregattachmentcode>0 
                //         ? selectedRecord.ssystemfilename: create_UUID()+'.'+fileExtension: "";


                selectedMaster.forEach((sample, sampleindex) => {
                    const fileName = selectedRecord.nsampleattachmentcode && selectedRecord.nsampleattachmentcode > 0 && selectedRecord.ssystemfilename && selectedRecord.ssystemfilename !== "" ? selectedRecord.ssystemfilename.split('.')[0] : create_UUID()
                    const uniquefilename = fileName + '.' + fileExtension;
                    const tempData = {};
                    tempData['nsampleattachmentcode'] = selectedRecord.nsampleattachmentcode ? selectedRecord.nsampleattachmentcode : 0;
                    tempData["npreregno"] = sample.npreregno;
                    tempData["ntransactionsamplecode"] = sample.ntransactionsamplecode;
                    tempData['nformcode'] = saveParam.userInfo.nformcode
                    tempData['nusercode'] = saveParam.userInfo.nusercode
                    tempData['nuserrolecode'] = saveParam.userInfo.nuserrole
                    tempData["nlinkcode"] = transactionStatus.NA;
                    // tempData["nfilesize"] = file.size;
                    tempData['jsondata'] = {
                        // susername: saveParam.userInfo.susername,
                        susername:Lims_JSON_stringify(saveParam.userInfo.susername ? saveParam.userInfo.susername.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false),                            
                        // suserrolename: saveParam.userInfo.suserrolename,
                        suserrolename:Lims_JSON_stringify(saveParam.userInfo.suserrolename ? saveParam.userInfo.suserrolename.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false),
                        ssystemfilename: uniquefilename,
                        sfilename:Lims_JSON_stringify(file.name.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim(),false)  ,
                        nfilesize: file.size,
                        sdescription:Lims_JSON_stringify(selectedRecord.sdescription ? selectedRecord.sdescription.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false)  ,
                        slinkname: "",
                        sheader:Lims_JSON_stringify(selectedRecord.sheader ? selectedRecord.sheader.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false) ,
                    }
                    tempData['nattachmenttypecode'] = nattachmenttypecode
                    // tempData["ssystemfilename"] = uniquefilename;
                    // tempData["sfilename"] = file.name.trim();
                    // tempData["sdescription"] = selectedRecord.sdescription? selectedRecord.sdescription.trim(): "";
                    tempData['nstatus'] = transactionStatus.ACTIVE;



                    formData.append("uploadedFile" + samindex["index"], file);
                    formData.append("uniquefilename" + samindex["index"], uniquefilename);
                    fileArray.push(tempData);
                    samindex["index"] = samindex["index"] + 1;
                })
            });
            formData.append("filecount", (acceptedFiles.length * selectedMaster.length));

            isFileEdited = transactionStatus.YES;
        } else {
            selectedMaster.forEach(sample => {
                let sampleFile = {};
                sampleFile['nsampleattachmentcode'] = selectedRecord.nsampleattachmentcode ? selectedRecord.nsampleattachmentcode : 0;
                sampleFile["npreregno"] = sample.npreregno;
                sampleFile["ntransactionsamplecode"] = sample.ntransactionsamplecode;
                sampleFile['nformcode'] = saveParam.userInfo.nformcode
                sampleFile['nusercode'] = saveParam.userInfo.nusercode
                sampleFile['nuserrolecode'] = saveParam.userInfo.nuserrole
                sampleFile["nlinkcode"] = transactionStatus.NA;
                // sampleFile["nfilesize"] = selectedRecord.nfilesize;
                sampleFile['nattachmenttypecode'] = nattachmenttypecode
                sampleFile['jsondata'] = {
                    // susername: saveParam.userInfo.susername,
                    susername:Lims_JSON_stringify(saveParam.userInfo.susername ? saveParam.userInfo.susername.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false),                            
                    // suserrolename: saveParam.userInfo.suserrolename,
                    suserrolename:Lims_JSON_stringify(saveParam.userInfo.suserrolename ? saveParam.userInfo.suserrolename.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false),
                    ssystemfilename: selectedRecord.ssystemfilename,
                    sfilename:Lims_JSON_stringify(selectedRecord.sfilename.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim(),false)  ,
                    nfilesize: selectedRecord.nfilesize,
                    sdescription:Lims_JSON_stringify(selectedRecord.sdescription ? selectedRecord.sdescription.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false) ,
                    slinkname: "",
                    sheader:Lims_JSON_stringify(selectedRecord.sheader ? selectedRecord.sheader.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false) ,
                }
                sampleFile["ssystemfilename"] = selectedRecord.ssystemfilename;
                //sampleFile["sfilename"] = selectedRecord.sfilename.trim();
                // sampleFile["sdescription"] = selectedRecord.sdescription? selectedRecord.sdescription.trim(): "";
                sampleFile['nstatus'] = transactionStatus.ACTIVE;
                fileArray.push(sampleFile);
            })
        }
    } else {
        selectedMaster.forEach(sample => {
            let sampleFile = {};
            sampleFile['nsampleattachmentcode'] = selectedRecord.nsampleattachmentcode ? selectedRecord.nsampleattachmentcode : 0;
            sampleFile["npreregno"] = sample.npreregno;
            sampleFile["ntransactionsamplecode"] = sample.ntransactionsamplecode;
            sampleFile['nformcode'] = saveParam.userInfo.nformcode
            sampleFile['nusercode'] = saveParam.userInfo.nusercode
            sampleFile['nuserrolecode'] = saveParam.userInfo.nuserrole
            sampleFile["nlinkcode"] = selectedRecord.nlinkcode.value ? selectedRecord.nlinkcode.value : -1;
            sampleFile['jsondata'] = {
                // susername: saveParam.userInfo.susername,
                susername:Lims_JSON_stringify(saveParam.userInfo.susername ? saveParam.userInfo.susername.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false),                            
                // suserrolename: saveParam.userInfo.suserrolename,
                suserrolename:Lims_JSON_stringify(saveParam.userInfo.suserrolename ? saveParam.userInfo.suserrolename.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false),
                ssystemfilename: "",
                sfilename:Lims_JSON_stringify( selectedRecord.slinkfilename.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim(),false) ,
                nfilesize: 0,
                slinkname: selectedRecord.nlinkcode.label,
                sdescription:Lims_JSON_stringify( selectedRecord.slinkdescription ? selectedRecord.slinkdescription.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false),
                sheader:Lims_JSON_stringify(selectedRecord.sheader ? selectedRecord.sheader.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim() : "",false) ,
            }
            sampleFile['nattachmenttypecode'] = nattachmenttypecode
            // sampleFile["ssystemfilename"] = "";
            sampleFile['nstatus'] = transactionStatus.ACTIVE;
            fileArray.push(sampleFile);
        })
    }
    formData.append("ncontrolCode", saveParam.ncontrolCode);
    formData.append("isFileEdited", isFileEdited);
    formData.append("subsampleattachment", JSON.stringify(fileArray));
    //ALPD-1728
    //formData.append("subsampleattachment", JSON.stringify(fileArray[0]).replaceAll('\\n','#r#'));
    formData.append("nattachmenttypecode", nattachmenttypecode);
    formData.append("npreregno", saveParam.npreregno);
    formData.append("ntransactionsamplecode", saveParam.ntransactionsamplecode);
    //formData.append("userinfo", JSON.stringify(saveParam.userInfo));

    formData.append("userinfo", JSON.stringify({...saveParam.userInfo,
        sformname: Lims_JSON_stringify(saveParam.userInfo.sformname),
        smodulename: Lims_JSON_stringify(saveParam.userInfo.smodulename),
        slanguagename: Lims_JSON_stringify(saveParam.userInfo.slanguagename)}));

    const inputParam = {
        inputData: {// userinfo: saveParam.userInfo },
                    "userinfo": {...saveParam.userInfo,
                    sformname: Lims_JSON_stringify(saveParam.userInfo.sformname),
                    smodulename: Lims_JSON_stringify(saveParam.userInfo.smodulename),
                    slanguagename: Lims_JSON_stringify(saveParam.userInfo.slanguagename)}},
        formData: formData,
        isFileupload: true,
        operation: saveParam.operation,
        classUrl: "attachment",
        saveType: saveParam.saveType,
        formRef: saveParam.formRef,
        methodUrl: "SubSampleAttachment"
    }
    return inputParam;
}