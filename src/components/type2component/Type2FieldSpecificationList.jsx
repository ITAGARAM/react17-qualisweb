export function getFieldSpecification() {
    const screenMap = new Map();

    // screenMap.set("Unit", [{ "fieldLength": "NA", "dataField": "nunitcode", "mandatory": false, "controlType": "NA" },
    // { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_UNITNAME", "dataField": "sunitname", "width": "200px", "mandatoryLabel": "IDS_ENTER" },
    // { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px" , "mandatoryLabel":"IDS_ENTER"},
    // { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdisplaystatus", "width": "200px", "controlName": "ndefaultstatus", "mandatoryLabel":"IDS_SELECT" }
    // ]);

    screenMap.set("Department", [{ "fieldLength": "NA", "dataField": "ndeptcode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_DEPTNAME", "dataField": "sdeptname", "width": "200px" , "mandatoryLabel":"IDS_ENTER","isClearField":true},
    { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px" , "mandatoryLabel":"IDS_ENTER","isClearField":true},
    { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdisplaystatus", "width": "200px", "controlName": "ndefaultstatus" , "mandatoryLabel":"IDS_SELECT","preSetValue":4,"isClearField":true}
    ]);

    screenMap.set("Designation", [{ "fieldLength": "NA", "dataField": "ndesignationcode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_DESIGNATIONNAME", "dataField": "sdesignationname", "width": "200px" , "mandatoryLabel":"IDS_ENTER","isClearField":true},
    { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px" , "mandatoryLabel":"IDS_ENTER","isClearField":true},
    { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdisplaystatus", "width": "200px", "controlName": "ndefaultstatus", "mandatoryLabel":"IDS_SELECT","preSetValue":4,"isClearField":true }
    ]);

    screenMap.set("Section", [{ "fieldLength": "NA", "dataField": "nsectioncode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_SECTIONNAME", "dataField": "ssectionname", "width": "200px" , "mandatoryLabel":"IDS_ENTER","isClearField":true},
    { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px" , "mandatoryLabel":"IDS_ENTER","isClearField":true},
    { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdisplaystatus", "width": "200px", "controlName": "ndefaultstatus" , "mandatoryLabel":"IDS_SELECT","preSetValue":4,"isClearField":true}
    ]);

    // screenMap.set("TestCategory", [{ "fieldLength": "NA", "dataField": "ntestcategorycode", "mandatory": false, "controlType": "NA" },
    // { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_TESTCATEGORY", "dataField": "stestcategoryname", "width": "200px" , "mandatoryLabel":"IDS_ENTER"},
    // { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px" , "mandatoryLabel":"IDS_ENTER"},
    // { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdisplaystatus", "width": "200px", "controlName": "ndefaultstatus", "mandatoryLabel":"IDS_SELECT" }
    // ]);


    screenMap.set("EDQMProductType", [{ "fieldLength": "NA", "dataField": "nproducttypecode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "10", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PRODUCTTYPE", "dataField": "sproducttype", "width": "200px" , "mandatoryLabel":"IDS_ENTER"},
    { "fieldLength": "100", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sproducttypedesc", "width": "400px" , "mandatoryLabel":"IDS_ENTER"},
    { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_REQUIREDFORSAFETYMARKER", "dataField": "sdisplaystatus", "width": "200px", "controlName": "nsafetymarkermand", "mandatoryLabel":"IDS_SELECT"}
    ]);

    screenMap.set("EDQMProductDescription", [{ "fieldLength": "NA", "dataField": "nproductdesccode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "10", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PRODUCTCLASS", "dataField": "sproductclass", "width": "200px" , "mandatoryLabel":"IDS_ENTER"},
    { "fieldLength": "100", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sproductdesc", "width": "400px" , "mandatoryLabel":"IDS_ENTER"},
    { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_REFERPRODUCTTYPE", "dataField": "sdisplaystatus", "width": "200px", "controlName": "nproducttypemand", "mandatoryLabel":"IDS_SELECT"}
    ]);

    screenMap.set("ClientCategory", [{ "fieldLength": "NA", "dataField": "nclientcatcode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_CLIENTCATEGORY", "dataField": "sclientcatname", "width": "200px" , "mandatoryLabel":"IDS_ENTER","isClearField":true},
    { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px" , "mandatoryLabel":"IDS_ENTER","isClearField":true},
    { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdisplaystatus", "width": "200px", "controlName": "ndefaultstatus" , "mandatoryLabel":"IDS_SELECT","preSetValue":4,"isClearField":true}
    ]);

    screenMap.set("StorageCondition", [{ "fieldLength": "NA", "dataField": "nstorageconditioncode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_STORAGECONDITION", "dataField": "sstorageconditionname", "width": "200px" , "mandatoryLabel":"IDS_ENTER","isClearField":true},
    { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px" , "mandatoryLabel":"IDS_ENTER","isClearField":true},
    { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdisplaystatus", "width": "200px", "controlName": "ndefaultstatus", "mandatoryLabel":"IDS_SELECT","preSetValue":4,"isClearField":true}
    ]);

    screenMap.set("Source", [{ "fieldLength": "NA", "dataField": "nsourcecode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "50", "mandatory": true, "controlType": "textbox", "idsName": "IDS_SOURCENAME", "dataField": "ssourcename", "width": "200px" , "mandatoryLabel":"IDS_ENTER","isClearField":true},
    { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px" , "mandatoryLabel":"IDS_ENTER","isClearField":true},
    { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdisplaystatus", "width": "200px", "controlName": "ndefaultstatus", "mandatoryLabel":"IDS_SELECT","preSetValue":4,"isClearField":true}
    ]);
    screenMap.set("TrainingCategory", [{ "fieldLength": "NA", "dataField": "ntrainingcategorycode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_TRAININGCATEGORY", "dataField": "strainingcategoryname", "width": "200px" , "mandatoryLabel":"IDS_ENTER","isClearField":true},
    { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px","isClearField":true },
    { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdisplaystatus", "width": "200px", "controlName": "ndefaultstatus","preSetValue":4,"isClearField":true}
    ]);
    // screenMap.set("SampleTestComments", [{ "fieldLength": "NA", "dataField": "nsampletestcommentcode", "mandatory": false, "controlType": "NA" },
    // { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_SAMPLETESTCOMMENTS", "dataField": "ssampletestcommentname", "width": "200px" , "mandatoryLabel":"IDS_ENTER"},
    // { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px" },
    // { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "stransdisplaystatus", "width": "200px", "controlName": "ndefaultstatus"}
    // ]);
    screenMap.set("MaterialGrade", [{ "fieldLength": "NA", "dataField": "nmaterialgradecode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_MATERIALGRADE", "dataField": "smaterialgradename","isJsonField":true,"jsonObjectName":"jsondata", "width": "200px" , "mandatoryLabel":"IDS_ENTER","isClearField":true},
    { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription","isJsonField":true, "jsonObjectName":"jsondata","width": "400px" , "mandatoryLabel":"IDS_ENTER","isClearField":true},
    { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdisplaystatus", "width": "200px", "controlName": "ndefaultstatus" , "mandatoryLabel":"IDS_SELECT","preSetValue":4,"isClearField":true}
    ]);


    return screenMap;
}

