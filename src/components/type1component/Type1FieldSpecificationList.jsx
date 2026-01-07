//import React from 'react';
// import FormInput from '../form-input/form-input.component';
// import FormTextarea from '../form-textarea/form-textarea.component';

export function getFieldSpecification() {
    const screenMap = new Map();
    screenMap.set("EDQMManufacturer", [{ "fieldLength": "NA", "dataField": "nofficialmanufcode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_MANUFACTURERNAME", "dataField": "sofficialmanufname", "width": "200px", "mandatoryLabel":"IDS_ENTER"},
    { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel":"IDS_ENTER"}
    ]);

    screenMap.set("EDQMProductDomain", [{ "fieldLength": "NA", "dataField": "nproductdomaincode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "10", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PRODUCTDOMAIN", "dataField": "sproductdomain", "width": "200px" , "mandatoryLabel":"IDS_ENTER"},
    { "fieldLength": "100", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdomaindesc", "width": "400px" , "mandatoryLabel":"IDS_ENTER"}
    ]);

    screenMap.set("EDQMMasterFileType", [{ "fieldLength": "NA", "dataField": "nmasterfiletypecode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "10", "mandatory": true, "controlType": "textbox", "idsName": "IDS_MASTERFILETYPE", "dataField": "smasterfiletype", "width": "200px", "mandatoryLabel":"IDS_ENTER" },
    { "fieldLength": "100", "mandatory": false, "controlType": "textarea", "idsName": "IDS_MASTERFILETYPEDESC", "dataField": "smasterfiletypedesc", "width": "400px" , "mandatoryLabel":"IDS_ENTER"}
    ]);

    screenMap.set("EDQMBulkType", [{ "fieldLength": "NA", "dataField": "nbulktypecode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "10", "mandatory": true, "controlType": "textbox", "idsName": "IDS_BULKTYPE", "dataField": "sbulktype", "width": "200px" , "mandatoryLabel":"IDS_ENTER"},
    { "fieldLength": "100", "mandatory": false, "controlType": "textarea", "idsName": "IDS_BULKTYPEDESC", "dataField": "sbulktypedesc", "width": "400px", "mandatoryLabel":"IDS_ENTER" }
    ]);

    screenMap.set("EDQMComponentBulkGroup", [{ "fieldLength": "NA", "dataField": "ncomponentbulkgroupcode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "10", "mandatory": true, "controlType": "textbox", "idsName": "IDS_COMPONENTBULKGROUP", "dataField": "scomponentbulkgroup", "width": "200px", "mandatoryLabel":"IDS_ENTER"},
    { "fieldLength": "100", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "scomponentbulkgroupdesc", "width": "400px", "mandatoryLabel":"IDS_ENTER"}
    ]);
    screenMap.set("UserRole", [{ "fieldLength": "NA", "dataField": "nuserrolecode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_USERROLENAME", "dataField": "suserrolename", "width": "200px" , "mandatoryLabel":"IDS_ENTER"},
    { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel":"IDS_ENTER" }
    ]);
    screenMap.set("EProtocol", [{ "fieldLength": "NA", "dataField": "neprotocolcode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_EPROTOCOLNAME", "dataField": "seprotocolname", "width": "200px", "mandatoryLabel":"IDS_ENTER" },
    { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel":"IDS_ENTER" }
    ]);
    screenMap.set("QBCategory", [{ "fieldLength": "NA", "dataField": "nchecklistqbcategorycode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_QBCATEGORYNAME", "dataField": "schecklistqbcategoryname", "width": "200px", "mandatoryLabel":"IDS_ENTER" },
    { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel":"IDS_ENTER" }
    ]);
    screenMap.set("Lab", [{ "fieldLength": "NA", "dataField": "nlabcode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_LAB", "dataField": "slabname", "width": "200px", "mandatoryLabel":"IDS_ENTER" },
    { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel":"IDS_ENTER" }
    ]);

    screenMap.set("MethodCategory", [{ "fieldLength": "NA", "dataField": "nmethodcatcode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_METHODCATEGORY", "dataField": "smethodcatname", "width": "200px" , "mandatoryLabel":"IDS_ENTER","isClearField":true},
    { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel":"IDS_ENTER","isClearField":true}
    ]);
    // screenMap.set("SupplierCategory", [{ "fieldLength": "NA", "dataField": "nsuppliercatcode", "mandatory": false, "controlType": "NA" },
    // { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_SUPPLIERCATEGORY", "dataField": "ssuppliercatname", "width": "200px", "mandatoryLabel":"IDS_ENTER"},
    // { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "200px", "mandatoryLabel":"IDS_ENTER"}
    // ]);
    screenMap.set("StorageLocation", [{ "fieldLength": "NA", "dataField": "nstoragelocationcode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_STORAGELOCATION", "dataField": "sstoragelocationname", "width": "200px", "mandatoryLabel":"IDS_ENTER" },
    { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel":"IDS_ENTER" }
    ]);
    screenMap.set("Technique", [{ "fieldLength": "NA", "dataField": "ntechniquecode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_TECHNIQUE", "dataField": "stechniquename", "width": "200px", "mandatoryLabel":"IDS_ENTER" },
    { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel":"IDS_ENTER" }
    ]);
    screenMap.set("InstitutionCategory", [{ "fieldLength": "NA", "dataField": "ninstitutioncatcode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_INSTITUTIONCATEGORY", "dataField": "sinstitutioncatname", "width": "200px", "mandatoryLabel":"IDS_ENTER" },
    { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel":"IDS_ENTER" }
    ]);
    screenMap.set("StorageCategory", [{ "fieldLength": "NA", "dataField": "nstoragecategorycode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_STORAGECATEGORYNAME", "dataField": "sstoragecategoryname", "width": "200px", "mandatoryLabel":"IDS_ENTER" },
    { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel":"IDS_ENTER" }
    ]);
    return screenMap;
}

