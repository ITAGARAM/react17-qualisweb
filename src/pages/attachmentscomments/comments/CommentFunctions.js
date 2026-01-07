
import {  transactionStatus } from "../../../components/Enumeration";
import {  Lims_JSON_stringify } from "../../../components/CommonScript";

export function onSaveTestComments(saveParam,selectedMaster){

    const inputData = {};
    const selectedRecord = saveParam.selectedRecord;
    let commentArray = [];
    
    if(saveParam.operation==='update'){
        let comment = {};
        comment['ntestcommentcode']=selectedRecord.ntestcommentcode ?selectedRecord.ntestcommentcode: 0;
        comment["npreregno"]=selectedRecord.npreregno;
        comment["ntransactionsamplecode"]=selectedRecord.ntransactionsamplecode;
        comment["ntransactiontestcode"]=selectedRecord.ntransactiontestcode;
        comment['nformcode']=saveParam.userInfo.nformcode
        comment['nusercode']=saveParam.userInfo.nusercode
        comment['nuserrolecode']=saveParam.userInfo.nuserrole
        comment["jsondata"] = {
            stestsynonym :  selectedRecord.stestsynonym,
            scomments: selectedRecord.scomments ? selectedRecord.scomments.trim() : "",
            scommentsubtype:selectedRecord.ncommentsubtypecode&&selectedRecord.ncommentsubtypecode.label,
            spredefinedname:selectedRecord.nsampletestcommentscode&&selectedRecord.nsampletestcommentscode.label!==""?selectedRecord.nsampletestcommentscode.label:'-',
           // sdescription:selectedRecord.sdescription&&selectedRecord.sdescription,
            ncommentsubtypecode:selectedRecord.ncommentsubtypecode&&selectedRecord.ncommentsubtypecode,
            nsampletestcommentscode:selectedRecord.nsampletestcommentscode?selectedRecord.nsampletestcommentscode:'-',
            nneedreport:selectedRecord.nneedreport ?  selectedRecord.nneedreport  : transactionStatus.NO
        }
        comment["nsamplecommentscode"] = selectedRecord.nsamplecommentscode? selectedRecord.nsamplecommentscode.value: -1;
        comment['nstatus']=transactionStatus.ACTIVE;
        inputData["testcomment"]= comment;
    }else{
        selectedMaster.forEach(test=>{
            let comment = {};
            comment['ntestcommentcode']=selectedRecord.ntestcommentcode ?selectedRecord.ntestcommentcode: 0;
            comment["npreregno"]=test.npreregno;
            comment["ntransactionsamplecode"]=test.ntransactionsamplecode;
            comment["ntransactiontestcode"]=test.ntransactiontestcode;
            comment['nformcode']=saveParam.userInfo.nformcode
            comment['nusercode']=saveParam.userInfo.nusercode
            comment['nuserrolecode']=saveParam.userInfo.nuserrole
            comment["jsondata"] = {
                stestsynonym :  test.stestsynonym,
                scomments: selectedRecord.scomments ? selectedRecord.scomments.trim() : "",
                scommentsubtype:selectedRecord.ncommentsubtypecode&&selectedRecord.ncommentsubtypecode.label,
                spredefinedname:selectedRecord.nsampletestcommentscode&&selectedRecord.nsampletestcommentscode.label!==""?selectedRecord.nsampletestcommentscode.label:'-',
              //  sdescription:selectedRecord.sdescription&&selectedRecord.sdescription,
                ncommentsubtypecode:selectedRecord.ncommentsubtypecode&&selectedRecord.ncommentsubtypecode,
                nsampletestcommentscode:selectedRecord.nsampletestcommentscode?selectedRecord.nsampletestcommentscode:'-',
                nneedreport:selectedRecord.nneedreport ?  selectedRecord.nneedreport  : transactionStatus.NO

            }
            comment["nsamplecommentscode"] = selectedRecord.nsamplecommentscode? selectedRecord.nsamplecommentscode.value: -1;
            comment['nstatus']=transactionStatus.ACTIVE;
            commentArray.push(comment);
        })  
        inputData["testcomment"]= commentArray;
    }
    
   
    
    inputData["ntransactiontestcode"]=saveParam.ntransactiontestcode
    const inputParam = {
        inputData: {//userinfo: saveParam.userInfo,
                "userinfo": {...saveParam.userInfo,
                sformname: Lims_JSON_stringify(saveParam.userInfo.sformname),
                smodulename: Lims_JSON_stringify(saveParam.userInfo.smodulename),
                slanguagename: Lims_JSON_stringify(saveParam.userInfo.slanguagename)},
                ...inputData},
        operation: saveParam.operation, selectedId:selectedRecord.ntestcommentcode ?selectedRecord.ntestcommentcode: 0,
        classUrl: "comments",
        saveType:saveParam.saveType,
        formRef:saveParam.formRef,
         methodUrl: "TestComment"
    }
    return inputParam;
}

export function onSaveSampleComments(saveParam,selectedMaster){

    const inputData = {};
    const selectedRecord = saveParam.selectedRecord;
    let commentArray = [];
    
    if(saveParam.operation==='update'){
        let comment = {};
        comment['nregcommentcode']=selectedRecord.nregcommentcode ?selectedRecord.nregcommentcode: 0;
        comment["npreregno"]=selectedRecord.npreregno;
        comment['nformcode']=saveParam.userInfo.nformcode
        comment['nusercode']=saveParam.userInfo.nusercode
        comment['nuserrolecode']=saveParam.userInfo.nuserrole
        comment["jsondata"] = {
            sarno :  selectedRecord.jsondata.sarno,
            scomments: selectedRecord.scomments ? selectedRecord.scomments.trim() : ""
        }
        comment["nsamplecommentscode"] = saveParam.isTestComment&&selectedRecord.nsamplecommentscode? selectedRecord.nsamplecommentscode.value: -1;
        comment['nstatus']=transactionStatus.ACTIVE;
        inputData["samplecomment"]= comment;
    }else{
        selectedMaster.forEach(sample=>{
            let comment = {};
            comment['nregcommentcode']=selectedRecord.nregcommentcode ?selectedRecord.nregcommentcode: 0;
            comment["npreregno"]=sample.npreregno;
            comment['nformcode']=saveParam.userInfo.nformcode
            comment['nusercode']=saveParam.userInfo.nusercode
            comment['nuserrolecode']=saveParam.userInfo.nuserrole
            comment["jsondata"] = {
                sarno :  sample.sarno,
                scomments: selectedRecord.scomments ? selectedRecord.scomments.trim() : ""
            }
            comment["nsamplecommentscode"] = saveParam.isTestComment&&selectedRecord.nsamplecommentscode? selectedRecord.nsamplecommentscode.value: -1;
            comment['nstatus']=transactionStatus.ACTIVE;
            commentArray.push(comment);
        })  
        inputData["samplecomment"]= commentArray;
    }
    
   
    
    inputData["npreregno"]=saveParam.npreregno
    const inputParam = {
        inputData: {//userinfo: saveParam.userInfo,
            "userinfo": {...saveParam.userInfo,
                sformname: Lims_JSON_stringify(saveParam.userInfo.sformname),
                smodulename: Lims_JSON_stringify(saveParam.userInfo.smodulename),
                slanguagename: Lims_JSON_stringify(saveParam.userInfo.slanguagename)},
                    ...inputData},
        operation: saveParam.operation, selectedId:selectedRecord.nregcommentcode ?selectedRecord.nregcommentcode: 0,
        classUrl: "comments",
        saveType:saveParam.saveType,
        formRef:saveParam.formRef,
         methodUrl: "SampleComment"
    }
    return inputParam;
}


export function onSaveSubSampleComments(saveParam,selectedMaster){

    const inputData = {};
    const selectedRecord = saveParam.selectedRecord;
    let commentArray = [];
    
    if(saveParam.operation==='update'){
        let comment = {};
        comment['nsamplecommentcode']=selectedRecord.nsamplecommentcode ?selectedRecord.nsamplecommentcode: 0;
        comment["ntransactionsamplecode"]=selectedRecord.ntransactionsamplecode;
        comment["npreregno"] = selectedRecord.npreregno;
        comment['nformcode']=saveParam.userInfo.nformcode
        comment['nusercode']=saveParam.userInfo.nusercode
        comment['nuserrolecode']=saveParam.userInfo.nuserrole
        comment["jsondata"] = {
            sarno :  selectedRecord.jsondata.sarno,
            ssamplearno :  selectedRecord.jsondata.ssamplearno,
            scomments: selectedRecord.scomments ? selectedRecord.scomments.trim() : ""
        }
        comment["nsamplecommentscode"] = saveParam.isTestComment&&selectedRecord.nsamplecommentscode? selectedRecord.nsamplecommentscode.value: -1;
        comment['nstatus']=transactionStatus.ACTIVE;
        inputData["subsamplecomment"]= comment;
    }else{
        selectedMaster.forEach(sample=>{
            let comment = {};
            comment['nsamplecommentcode']=selectedRecord.nsamplecommentcode ?selectedRecord.nsamplecommentcode: 0;
            comment["ntransactionsamplecode"]=sample.ntransactionsamplecode;
            comment["npreregno"] = sample.npreregno;
            comment['nformcode']=saveParam.userInfo.nformcode
            comment['nusercode']=saveParam.userInfo.nusercode
            comment['nuserrolecode']=saveParam.userInfo.nuserrole
            comment["jsondata"] = {
                sarno :  sample.sarno,
                ssamplearno :  sample.ssamplearno,
                scomments: selectedRecord.scomments ? selectedRecord.scomments.trim() : ""
            }
            comment["nsamplecommentscode"] = saveParam.isTestComment&&selectedRecord.nsamplecommentscode? selectedRecord.nsamplecommentscode.value: -1;
            comment['nstatus']=transactionStatus.ACTIVE;
            commentArray.push(comment);
        })  
        inputData["subsamplecomment"]= commentArray;
    }
    
   
    
    inputData["ntransactionsamplecode"]=saveParam.ntransactionsamplecode
    const inputParam = {
        inputData: {//userinfo: saveParam.userInfo,
            "userinfo": {...saveParam.userInfo,
                sformname: Lims_JSON_stringify(saveParam.userInfo.sformname),
                smodulename: Lims_JSON_stringify(saveParam.userInfo.smodulename),
                slanguagename: Lims_JSON_stringify(saveParam.userInfo.slanguagename)},
            ...inputData},
        operation: saveParam.operation, selectedId:selectedRecord.nsamplecommentcode ?selectedRecord.nsamplecommentcode: 0,
        classUrl: "comments",
        saveType:saveParam.saveType,
        formRef:saveParam.formRef,
         methodUrl: "SubSampleComment"
    }
    return inputParam;
}