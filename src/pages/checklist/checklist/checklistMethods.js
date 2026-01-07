export function getSaveInputData(id,operation,Login,availableQBCategory,selectedRecord,selectedVersion,formRef,searchRef,dataState){
    let inputData = [];
    let postParam={ selectedObject : "selectedchecklist", primaryKeyField : "nchecklistcode" };
    inputData["userinfo"] = Login.userInfo;
    let selectedId=null;
    if ( operation === "update"){
        // edit
        
        if(id==='checklist'){
            postParam = { inputListName : "checklist", selectedObject : "selectedchecklist",
                        primaryKeyField : "nchecklistcode", 
                        primaryKeyValue : Login.masterData.selectedchecklist.nchecklistcode,
                        fetchUrl : "checklist/getChecklistVersion",
                        fecthInputObject : {userinfo:Login.userInfo}
                    }
            inputData["checklist"] = {
                "nchecklistcode":selectedRecord.nchecklistcode,
                "schecklistname":selectedRecord.schecklistname,
                "sdescription":selectedRecord.sdescription?selectedRecord.sdescription:"",
                "nsitecode":Login.userInfo.nmastersitecode
            }  
        }else{
            selectedId=selectedRecord.nchecklistversionqbcode
            inputData["checklistversionqb"]={
                nchecklistversionqbcode:selectedRecord.nchecklistversionqbcode,
                nchecklistqbcategorycode: selectedRecord.nchecklistqbcategorycode,
                nchecklistversioncode: selectedVersion.nchecklistversioncode,
                nmandatoryfield:selectedRecord.nmandatoryfield,
                nchecklistqbcode:selectedRecord.nchecklistqbcode,
            }
        }
    } else{

        if(id==='checklist'){
            postParam = { inputListName:"checklist",selectedObject : "selectedchecklist", primaryKeyField : "nchecklistcode" }
            inputData["checklist"] = {
                "schecklistname":selectedRecord.schecklistname,
                "sdescription":selectedRecord.sdescription?selectedRecord.sdescription:"",
                "nsitecode":Login.userInfo.nmastersitecode
            } 
        }else{
            dataState=undefined;
            let checklistversionqb=[];
            if(selectedRecord){
                availableQBCategory.map(checklistQBCat=>
                    selectedRecord[checklistQBCat.label]?selectedRecord[checklistQBCat.label].map(checklistQB=>
                        checklistversionqb.push({
                            nchecklistqbcategorycode:checklistQBCat.value,
                            nchecklistversioncode: selectedVersion.nchecklistversioncode,
                            nchecklistqbcode:checklistQB.value,
                            nmandatoryfield:checklistQB.item.nmandatory
                    
                })):"")
            }
            inputData["checklistversionqb"]=checklistversionqb
        }
    }           
    const inputParam = {
        methodUrl:id==='checklist'?"Checklist":"ChecklistVersionQB",
        classUrl: Login.inputParam.classUrl,
        inputData: inputData,
        operation: operation ,
        postParam,formRef,searchRef,dataState,selectedId,
        displayName:id==='checklist'?Login.inputParam.displayName:"IDS_CHECKLISTVERSIONQB",
        selectedRecord: {...selectedRecord}     
    }
    return inputParam;
}
export function versionCreate(selectedRecord,selectedChecklist,Login){
    let inputData = [];
    let postParam={ selectedObject : "selectedchecklist", primaryKeyField : "nchecklistcode" };
    inputData["userinfo"] = Login.userInfo;
        //add               
        inputData["checklistversion"] = {
            "nchecklistversioncode":selectedRecord.nchecklistversioncode?selectedRecord.nchecklistversioncode:0,
            "nchecklistcode":selectedChecklist.nchecklistcode,
            "schecklistversionname":selectedRecord.schecklistversionname
        }                 
    const inputParam = {
        methodUrl: "ChecklistVersion",
        classUrl: Login.inputParam.classUrl,
        inputData: inputData,postParam,
        operation: Login.operation,
        selectedRecord: {...selectedRecord}      
    }
    return inputParam;
}

export function templateChangeHandler(flag,selectedStateRecord,event,control){

    if(flag===1){//for Input Change Handle
        const selectedRecord = selectedStateRecord || {};
        //let lstQB=[] ;
        let lsteditedQB=selectedRecord["editedQB"]||[]
        let temp=selectedRecord[control.nchecklistversionqbcode]?-1:lsteditedQB.push(control.nchecklistversionqbcode)
       
        if (event.target.type === 'checkbox')
        {//for Check box
            let checkedValues=[];
            checkedValues=selectedRecord["checkbox_"+control.nchecklistversionqbcode]?selectedRecord["checkbox_"+control.nchecklistversionqbcode]:
                                control.sdefaultvalue?control.sdefaultvalue.split(","):[];
            if(event.currentTarget.checked){
                checkedValues.push(event.target.id)
                selectedRecord["checkbox_"+control.nchecklistversionqbcode]=checkedValues
                selectedRecord[control.nchecklistversionqbcode] = {
                    nchecklistversioncode:control.nchecklistversioncode,
                    nchecklistversionqbcode:control.nchecklistversionqbcode,
                    nchecklistqbcode:control.nchecklistqbcode,
                    sdefaultvalue: checkedValues.toString(),
                    jsondata:{ nchecklistversionqbcode:control.nchecklistversionqbcode,sdefaultvalue:checkedValues.toString()},
                };
                selectedRecord['jsondata']={
                    ...selectedRecord['jsondata'],
                    [control.nchecklistversionqbcode]:checkedValues.toString()
                }
                selectedRecord["editedQB"]=temp!==-1?lsteditedQB:selectedRecord["editedQB"]
            }else{
                checkedValues.splice(checkedValues.indexOf(event.target.id),1)
                selectedRecord["checkbox_"+control.nchecklistversionqbcode]=checkedValues
                selectedRecord[control.nchecklistversionqbcode] = {
                    nchecklistversioncode:control.nchecklistversioncode,
                    nchecklistversionqbcode:control.nchecklistversionqbcode,
                    nchecklistqbcode:control.nchecklistqbcode,
                    sdefaultvalue: checkedValues.toString(),
                    jsondata:{ nchecklistversionqbcode:control.nchecklistversionqbcode,sdefaultvalue:checkedValues.toString()},
                };
                selectedRecord['jsondata']={
                    ...selectedRecord['jsondata'],
                    [control.nchecklistversionqbcode]:checkedValues.toString()
                }
                selectedRecord["editedQB"]=temp!==-1?lsteditedQB:selectedRecord["editedQB"]
                
            }
            
        }else if(event.target.type === 'radio'){//For Radio
            selectedRecord[control.nchecklistversionqbcode] = {
                nchecklistversioncode:control.nchecklistversioncode,
                nchecklistversionqbcode:control.nchecklistversionqbcode,
                nchecklistqbcode:control.nchecklistqbcode,
                sdefaultvalue: event.target.id,
                jsondata:{ nchecklistversionqbcode:control.nchecklistversionqbcode,sdefaultvalue:event.target.id},
            };
            selectedRecord['jsondata']={
                ...selectedRecord['jsondata'],
                [control.nchecklistversionqbcode]:event.target.id
            }
            selectedRecord["editedQB"]=temp!==-1?lsteditedQB:selectedRecord["editedQB"]
        }
        else{
            //for other inputs
            selectedRecord[control.nchecklistversionqbcode] = {
                nchecklistversioncode:control.nchecklistversioncode,
                nchecklistversionqbcode:control.nchecklistversionqbcode,
                nchecklistqbcode:control.nchecklistqbcode,
                sdefaultvalue:event.target.value,
                jsondata:{ nchecklistversionqbcode:control.nchecklistversionqbcode,sdefaultvalue:event.target.value},
               
            };
            selectedRecord['jsondata']={
                ...selectedRecord['jsondata'],
                [control.nchecklistversionqbcode]:event.target.value
            }
            selectedRecord["editedQB"]=temp!==-1?lsteditedQB:selectedRecord["editedQB"]
        }
        return selectedRecord;
    }else if(flag===3){
        const selectedRecord = selectedStateRecord || {};
        let lsteditedQB=selectedRecord["editedQB"]||[]
        let temp=selectedRecord[control.nchecklistversionqbcode]?-1:lsteditedQB.push(control.nchecklistversionqbcode)
        selectedRecord["editedQB"]=temp!==-1?lsteditedQB:selectedRecord["editedQB"]
        selectedRecord[control.nchecklistversionqbcode] = {
            nchecklistversioncode:control.nchecklistversioncode,
            nchecklistversionqbcode:control.nchecklistversionqbcode,
            nchecklistqbcode:control.nchecklistqbcode,
          //  sdefaultvalue: this.props.formatInputDate(event,false),
            sdefaultvalue: event,
            jsondata:{ nchecklistversionqbcode:control.nchecklistversionqbcode,sdefaultvalue:event},

            
        };
        selectedRecord['jsondata']={
            ...selectedRecord['jsondata'],
            [control.nchecklistversionqbcode]:event
        }
        selectedRecord["editedQB"]=temp!==-1?lsteditedQB:selectedRecord["editedQB"]
        return selectedRecord;
    }else{//for combo change handle
        const selectedRecord = selectedStateRecord || {};
        let lsteditedQB=selectedRecord["editedQB"]||[]
        let temp=selectedRecord[control.nchecklistversionqbcode]?-1:
                                    lsteditedQB.push(control.nchecklistversionqbcode)
        selectedRecord["editedQB"]=temp!==-1?lsteditedQB:selectedRecord["editedQB"]
        if(event){//if combo has value
            selectedRecord[control.nchecklistversionqbcode] = {
                nchecklistversioncode:control.nchecklistversioncode,
                nchecklistversionqbcode:control.nchecklistversionqbcode,
                nchecklistqbcode:control.nchecklistqbcode,
                sdefaultvalue: event.label,
                jsondata:{ nchecklistversionqbcode:control.nchecklistversionqbcode,sdefaultvalue:event.label}                
            };
            selectedRecord['jsondata']={
                 ...selectedRecord['jsondata'],
                [control.nchecklistversionqbcode]:event.label
            };
        selectedRecord["editedQB"]=temp!==-1?lsteditedQB:selectedRecord["editedQB"]
            
        }else{//if combo does not have
            selectedRecord[control.nchecklistversionqbcode] = {
                nchecklistversioncode:control.nchecklistversioncode,
                nchecklistversionqbcode:control.nchecklistversionqbcode,
                nchecklistqbcode:control.nchecklistqbcode,
                sdefaultvalue: "",
                jsondata:{ nchecklistversionqbcode:control.nchecklistversionqbcode,sdefaultvalue:""}  
            };
            selectedRecord['jsondata']={
                ...selectedRecord['jsondata'],
               [control.nchecklistversionqbcode]:""
           };
       selectedRecord["editedQB"]=temp!==-1?lsteditedQB:selectedRecord["editedQB"]
        }

        return selectedRecord;
    }
}