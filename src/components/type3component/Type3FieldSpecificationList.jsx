//import { validateEmail } from '../CommonScript';
import { //SampleType, 
  designComponents, transactionStatus
} from '../Enumeration';

/* Keys and their functionalities:
zeroNotAllowed -> If this key is true, then in text or numeric type, if type 0, then it will become empty.
formInputType -> If this key is contains then it will check for value as "text" or "password". If key is not present, then default it will take it as "text". Only for ndesigncomponentcode: 1. If it is "password" then, in slideout that field values will be displayed as "****".
dataGridColumnHide -> If this key contains and value is true, then the current column will not displayed in data grid but displayed in slideout.
*/

export function getFieldSpecification(props) {
  const screenMap = new Map();

  // screenMap.set("Unit", [{ "fieldLength": "NA", "dataField": "nunitcode", "mandatory": false, "controlType": "NA" },
  // { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_UNITNAME", "dataField": "sunitname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1 },
  // { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2 },
  // { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_DISPLAYSTATUS", "dataField": "sdisplaystatus", "width": "200px", "controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 6 },
  // { "fieldLength": "NA", "mandatory": false, "controlType": "datepicker", "idsName": "IDS_DATE", "dataField": "sdateofjoin", "dateField": "ddateofjoin", "width": "200px", "controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 4,"showtime":false },
  // { "fieldLength": "10", "mandatory": true, "controlType": "numericinput", "idsName": "IDS_QUANTITY", "dataField": "nqty", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 5 }

  // ]);

  screenMap.set("Unit", [{ "fieldLength": "NA", "dataField": "nunitcode", "mandatory": false, "controlType": "NA" },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_UNITNAME", "dataField": "sunitname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isSynonymNeed": true, "ssynonymname": "sunitsynonym", "isClearField": true },
  { "fieldLength": "255", "mandatory": true, "controlType": "textarea", "idsName": "IDS_UNITSYNONYM", "dataField": "sunitsynonym", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true },
  { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true },
  { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdisplaystatus", "width": "200px", "controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 6, "preSetValue": 4, "isClearField": true }
  ]);

  screenMap.set("Reason", [{ "fieldLength": "NA", "dataField": "nreasoncode", "mandatory": false, "controlType": "NA" },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_REASON", "dataField": "sreason", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true }
  ]);

  screenMap.set("ProjectType", [{ "fieldLength": "NA", "dataField": "nprojecttypecode", "mandatory": false, "controlType": "NA" },
  { "fieldLength": "50", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PROJECTTYPE", "dataField": "sprojecttypename", "jsonObjectName": "jsondata", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "jsonObjectName": "jsondata", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true },

  ]);

  /*    screenMap.set("ProjectMaster", [{ "fieldLength": "NA", "dataField": "nprojectmastercode", "mandatory": false, "controlType": "NA" },
      { "fieldLength": "50", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PROJECTYPE", "dataField": "sprojecttypename","jsonObjectName":"jsondata", "width": "200px" , "mandatoryLabel":"IDS_ENTER","ndesigncomponentcode":1},
      { "fieldLength": "255", "mandatory": true, "controlType": "textarea", "idsName": "IDS_PROJECTTITLE", "dataField": "sprojecttypename","jsonObjectName":"jsondata", "width": "200px" , "mandatoryLabel":"IDS_ENTER","ndesigncomponentcode":2},
      { "fieldLength": "50", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PROJECTCODE", "dataField": "sprojectcode","jsonObjectName":"jsondata", "width": "200px" , "mandatoryLabel":"IDS_ENTER","ndesigncomponentcode":1},
      { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_PROJECTDESCRIPTION", "dataField": "sprojectdescription","jsonObjectName":"jsondata", "width": "200px" , "mandatoryLabel":"IDS_ENTER","ndesigncomponentcode":2},
      { "fieldLength": "50", "mandatory": true, "controlType": "selectbox", "idsName": "IDS_STUDYDIRECTOR", "dataField": "susername","jsonObjectName":"jsondata", "width": "200px" , "mandatoryLabel":"IDS_ENTER","ndesigncomponentcode":3,"classUrl": "users","methodUrl":"getUsers", "foreignDataField":"nusercode", "objectValue":"Users"},
      { "fieldLength": "50", "mandatory": true, "controlType": "selectbox", "idsName": "IDS_TEAMMEMBERS", "dataField": "susername","jsonObjectName":"jsondata", "width": "200px" , "mandatoryLabel":"IDS_ENTER","ndesigncomponentcode":3, "classUrl": "users","methodUrl":"getUsers", "foreignDataField":"nusercode", "objectValue":"Users"},
      { "fieldLength": "50", "mandatory": true, "controlType": "datepicker", "idsName": "IDS_RFWDATE", "dataField": "srfwdate","jsonObjectName":"jsondata", "width": "200px" , "mandatoryLabel":"IDS_ENTER","ndesigncomponentcode":4},
      { "fieldLength": "50", "mandatory": true, "controlType": "datepicker", "idsName": "IDS_PROJECTSTARTDATE", "dataField": "sprojectstartdate","jsonObjectName":"jsondata", "width": "200px" , "mandatoryLabel":"IDS_ENTER","ndesigncomponentcode":4},
      { "fieldLength": "50", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PROJECTDURATION", "dataField": "nprojectduration","jsonObjectName":"jsondata", "width": "200px" , "mandatoryLabel":"IDS_ENTER","ndesigncomponentcode":1},
     //  { "fieldLength": "50", "mandatory": true, "controlType": "selectbox", "idsName": "IDS_DURATIONPERIOD", "dataField": "speriodname", "jsonObjectName":"jsondata","width": "400px" , "mandatoryLabel":"IDS_ENTER","ndesigncomponentcode":3,  "classUrl": "region","methodUrl":"getRegion", "foreignDataField":"nregioncode", "objectValue":null},
   //   
      ]); */


  screenMap.set("District", [{ "fieldLength": "NA", "dataField": "ndistrictcode", "mandatory": false, "controlType": "NA" },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_REGIONNAME", "dataField": "sregionname", "tableDataField": "nregioncode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "region", "methodUrl": "getRegion", "foreignDataField": "nregioncode", "objectValue": null },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_DISTRICTNAME", "dataField": "sdistrictname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "5", "mandatory": true, "controlType": "textbox", "idsName": "IDS_DISTRICTCODE", "dataField": "sdistrictcode", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },

  ]);

  screenMap.set("Region", [{ "fieldLength": "NA", "dataField": "nregioncode", "mandatory": false, "controlType": "NA" },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_REGIONNAME", "dataField": "sregionname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "5", "mandatory": true, "controlType": "textbox", "idsName": "IDS_REGIONCODE", "dataField": "sregioncode", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  ]);

  screenMap.set("PackageCategory", [{ "fieldLength": "NA", "dataField": "npackagecategorycode", "mandatory": false, "controlType": "NA" },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PACKAGECATEGORYNAME", "dataField": "spackagecategoryname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true },

  ]);

  screenMap.set("PackageMaster", [{ "fieldLength": "NA", "dataField": "npackagemastercode", "mandatory": false, "controlType": "NA" },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_PACKAGECATEGORYNAME", "dataField": "spackagecategoryname", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "packagecategory", "methodUrl": "getPackageCategory", "foreignDataField": "npackagecategorycode", "tableDataField": "npackagecategorycode", "objectValue": null },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PACKAGENAME", "dataField": "spackagename", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true },

  ]);


  screenMap.set("DiscountBand", [{ "fieldLength": "NA", "dataField": "ndiscountbandcode", "mandatory": false, "controlType": "NA" },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_BANDNAME", "dataField": "sdiscountbandname", "jsonObjectName": "jsondata", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "5", "mandatory": true, "controlType": "numericinput", "idsName": "IDS_AMOUNT", "dataField": "namount", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 5, "precision": 2 }

  ]);

  screenMap.set("VATBand", [{ "fieldLength": "NA", "dataField": "nvatbandcode", "mandatory": false, "controlType": "NA" },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_BANDNAME", "dataField": "svatbandname", "jsonObjectName": "jsondata", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "5", "mandatory": true, "controlType": "numericinput", "idsName": "IDS_AMOUNT", "dataField": "namount", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 5, "precision": 2 }

  ]);

  screenMap.set("Settings", [{ "fieldLength": "NA", "dataField": "nsettingcode", "mandatory": false, "controlType": "NA" },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_SETTINGNAME", "dataField": "ssettingname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isDisabled": true, "isClearField": true },
  { "fieldLength": "200", "mandatory": true, "controlType": "textarea", "idsName": "IDS_SETTINGVALUE", "dataField": "ssettingvalue", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true }

  ]);

  screenMap.set("ReportSettings", [{ "fieldLength": "NA", "dataField": "nreportsettingcode", "mandatory": false, "controlType": "NA" },
  { "fieldLength": "50", "mandatory": true, "controlType": "textbox", "idsName": "IDS_REPORTSETTINGNAME", "dataField": "ssettingname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isDisabled": true, "isClearField": true },
  { "fieldLength": "255", "mandatory": true, "controlType": "textarea", "idsName": "IDS_REPORTSETTINGVALUE", "dataField": "ssettingvalue", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true }

  ]);



  screenMap.set("Patient", [{ "fieldLength": "NA", "dataField": "npatientcode", "mandatory": false, "controlType": "NA" },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_FIRSTNAME", "dataField": "sfirstname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_LASTNAME", "dataField": "slastname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "100", "mandatory": false, "controlType": "textbox", "idsName": "IDS_FATHERNAME", "dataField": "sfathername", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_GENDER", "dataField": "sgendername", "foreignDisplayMember": "sgendername", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "patient", "methodUrl": "getGender", "tableDataField": "ngendercode", "foreignDataField": "ngendercode", "objectValue": "genderList" },
  { "fieldLength": "NA", "mandatory": true, "controlType": "datepicker", "idsName": "IDS_DATEOFBIRTH", "dataField": "sdob", "dateField": "ddob", "width": "200px", "controlName": "ddob", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 4, "showtime": false },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_AGE", "dataField": "sage", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isDisabled": true },
  { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_MIGRANT", "dataField": "sdisplaystatus", "width": "200px", "controlName": "nneedmigrant", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 6 },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_COUNTRY", "dataField": "scountryname", "foreignDisplayMember": "scountryname", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "patient", "methodUrl": "getCountry", "tableDataField": "ncountrycode", "foreignDataField": "ncountrycode", "objectValue": "countryList" },
  { "mandatory": false, "controlType": "selectbox", "idsName": "IDS_REGION", "dataField": "sregionname", "foreignDisplayMember": "sregionname", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "patient", "methodUrl": "getRegion", "tableDataField": "nregioncode", "foreignDataField": "nregioncode", "objectValue": "regionList", "childIndex": 10 },
//  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_DISTRICT", "dataField": "sdistrictname", "foreignDisplayMember": "sdistrictname", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "patient", "methodUrl": "getDistrict", "tableDataField": "ndistrictcode", "foreignDataField": "ndistrictcode", "objectValue": "districtList", "childIndex": 11, "needService": false, "child": true },
  //{ "mandatory": true, "controlType": "selectbox", "idsName": "IDS_CITY", "dataField": "scityname", "foreignDisplayMember": "scityname", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "patient", "methodUrl": "getCity", "tableDataField": "ncitycode", "foreignDataField": "ncitycode", "objectValue": "cityList", "needService": false, "child": true },
  { "mandatory": false, "controlType": "selectbox", "idsName": "IDS_DISTRICT", "dataField": "sdistrictname", "foreignDisplayMember": "sdistrictname", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "patient", "methodUrl": "getDistrict", "tableDataField": "ndistrictcode", "foreignDataField": "ndistrictcode", "objectValue": "districtList","needService": false },
  { "fieldLength": "100", "mandatory": false, "controlType": "textbox", "idsName": "IDS_REGIONCITY", "dataField": "scityname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isMasterAdd": true, "isClearField": true },
 
  { "fieldLength": "20", "mandatory": false, "controlType": "textbox", "idsName": "IDS_POSTALCODE", "dataField": "spostalcode", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "100", "mandatory": false, "controlType": "textbox", "idsName": "IDS_STREET", "dataField": "sstreet", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "20", "mandatory": false, "controlType": "textbox", "idsName": "IDS_HOUSENO", "dataField": "shouseno", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "20", "mandatory": false, "controlType": "textbox", "idsName": "IDS_FLATNO", "dataField": "sflatno", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_ADDRESSSTATUS", "dataField": "nneedcurrentaddress", "width": "200px", "controlName": "nneedcurrentaddress", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 6 },
  { "mandatory": false, "controlType": "selectbox", "idsName": "IDS_REGION", "dataField": "sregionnametemp", "foreignDisplayMember": "sregionname", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "patient", "methodUrl": "getRegion", "tableDataField": "nregioncodetemp", "foreignDataField": "nregioncode", "objectValue": "regionList", "needService": false, "useService": 2, "childIndex": 18, "isMasterAdd": true },
  //{ "mandatory": true, "controlType": "selectbox", "idsName": "IDS_DISTRICT", "dataField": "sdistrictnametemp", "foreignDisplayMember": "sdistrictname", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "patient", "methodUrl": "getDistrict", "tableDataField": "ndistrictcodetemp", "foreignDataField": "ndistrictcode", "objectValue": "districtList", "needService": false, "useService": 3, "childIndex": 19, "child": true, "isMasterAdd": true },
  //{ "mandatory": true, "controlType": "selectbox", "idsName": "IDS_CITY", "dataField": "scitynametemp", "foreignDisplayMember": "scityname", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "patient", "methodUrl": "getCity", "tableDataField": "ncitycodetemp", "foreignDataField": "ncitycode", "objectValue": "cityList", "needService": false, "useService": 4, "child": true, "isMasterAdd": true },
  { "mandatory": false, "controlType": "selectbox", "idsName": "IDS_DISTRICT", "dataField": "sdistrictnametemp", "foreignDisplayMember": "sdistrictname", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "patient", "methodUrl": "getDistrict", "tableDataField": "ndistrictcodetemp", "foreignDataField": "ndistrictcode", "objectValue": "districtList","needService": false },
  { "fieldLength": "100", "mandatory": false, "controlType": "textbox", "idsName": "IDS_REGIONCITY", "dataField": "scitynametemp", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isMasterAdd": true, "isClearField": true },
 
  { "fieldLength": "20", "mandatory": false, "controlType": "textbox", "idsName": "IDS_POSTALCODE", "dataField": "spostalcodetemp", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isMasterAdd": true, "isClearField": true },
  { "fieldLength": "100", "mandatory": false, "controlType": "textbox", "idsName": "IDS_STREET", "dataField": "sstreettemp", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isMasterAdd": true, "isClearField": true },
  { "fieldLength": "20", "mandatory": false, "controlType": "textbox", "idsName": "IDS_HOUSENO", "dataField": "shousenotemp", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isMasterAdd": true, "isClearField": true },
  { "fieldLength": "20", "mandatory": false, "controlType": "textbox", "idsName": "IDS_FLATNO", "dataField": "sflatnotemp", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isMasterAdd": true, "isClearField": true },
  { "fieldLength": "20", "mandatory": false, "controlType": "textbox", "idsName": "IDS_PHONENO", "dataField": "sphoneno", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "20", "mandatory": false, "controlType": "textbox", "idsName": "IDS_MOBILENO", "dataField": "smobileno", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "100", "mandatory": false, "controlType": "textbox", "idsName": "IDS_EMAIL", "dataField": "semail", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "50", "mandatory": false, "controlType": "textbox", "idsName": "IDS_PASSPORTNO", "dataField": "spassportno", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "255", "mandatory": false, "controlType": "textbox", "idsName": "IDS_REFERENCEID", "dataField": "srefid", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "255", "mandatory": false, "controlType": "textbox", "idsName": "IDS_EXTERNALID", "dataField": "sexternalid", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  ]);



  screenMap.set("LimsElnUsermapping", [{ "fieldLength": "NA", "dataField": "nelnusermappingcode", "mandatory": false, "controlType": "NA" },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_LIMSID", "dataField": "sloginid", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "limselnusermapping", "methodUrl": "getLimsUsers", "foreignDataField": "nlimsusercode", "objectValue": null, "readOnlyChild": "slimsusername", "readOnlyParentData": "slimsusername" },
  { "fieldLength": "100", "mandatory": false, "controlType": "textbox", "idsName": "IDS_LIMSUSERNAME", "dataField": "slimsusername", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isDisabled": true, "isClearField": true },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_ELNID", "dataField": "username", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "foreignDataField": "usercode", "objectValue": null, "elnget": true, "readOnlyChild": "userfullname", "readOnlyParentData": "userfullname" },
  { "fieldLength": "100", "mandatory": false, "controlType": "textbox", "idsName": "IDS_ELNUSERNAME", "dataField": "userfullname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isDisabled": true, "isClearField": true },
  ]);

  screenMap.set("LimsElnSitemapping", [{ "fieldLength": "NA", "dataField": "nelnsitemappingcode", "mandatory": false, "controlType": "NA" },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_LIMSSITENAME", "dataField": "ssitename", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "limselnsitemapping", "methodUrl": "getLimsSite", "foreignDataField": "nlimssitecode", "objectValue": null },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_ELNSITE", "dataField": "sitename", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "foreignDataField": "sitecode", "objectValue": null, "elnget": true },
  ]);

  screenMap.set("InstrumentLocation", [{ "fieldLength": "NA", "dataField": "ninstrumentlocationcode", "mandatory": false, "controlType": "NA" },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_INSTRUMENTLOCATION", "dataField": "sinstrumentlocationname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true },
  { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdisplaystatus", "width": "200px", "controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 6, "isClearField": true, "preSetValue": 4 },

  ]);
  screenMap.set("SampleCycle", [{ "fieldLength": "NA", "dataField": "nsamplecyclecode", "mandatory": false, "controlType": "NA" },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_PROJECTTYPE", "dataField": "sprojecttypename", "tableDataField": "nprojecttypecode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "projecttype", "methodUrl": "getProjectType", "foreignDataField": "nprojecttypecode", "objectValue": null },
  { "fieldLength": "30", "mandatory": true, "controlType": "textbox", "idsName": "IDS_SAMPLECYCLENAME", "dataField": "ssamplecyclename", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "1", "mandatory": true, "controlType": "numericinput", "idsName": "IDS_CODE", "dataField": "ncode", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 5, "zeroNotAllowed": true },

  ]);
  screenMap.set("VisitNumber", [{ "fieldLength": "NA", "dataField": "nvisitnumbercode", "mandatory": false, "controlType": "NA" },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_PROJECTTYPE", "dataField": "sprojecttypename", "tableDataField": "nprojecttypecode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "projecttype", "methodUrl": "getProjectType", "foreignDataField": "nprojecttypecode", "objectValue": null },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_VISITNUMBER", "dataField": "svisitnumber", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "1", "mandatory": true, "controlType": "numericinput", "idsName": "IDS_CODELENGTH", "dataField": "ncodelength", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 5, "child": "true", "childprops": "fieldLength", "childdatafield": "scode", "min": 1, "max": 2 },
  { "fieldLength": "2", "mandatory": true, "controlType": "textbox", "idsName": "IDS_CODE", "dataField": "scode", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "existinglength": true, "codelength": "ncodelength", "lengthofcode": true, "isClearField": true }, //removed the zeroAllowed  and added the lengthofcode field for validation 

  ]);
  screenMap.set("CollectionSite", [{ "fieldLength": "NA", "dataField": "ncollectionsitecode", "mandatory": false, "controlType": "NA" },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_PROJECTTYPE", "dataField": "sprojecttypename", "tableDataField": "nprojecttypecode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "projecttype", "methodUrl": "getProjectType", "foreignDataField": "nprojecttypecode", "objectValue": null },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_SITENAME", "dataField": "ssitename", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "2", "mandatory": true, "controlType": "textbox", "idsName": "IDS_CODE", "dataField": "scode", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true }, // removed the zeroAllowed for barcode pdf file first number is '0'

  ]);
  screenMap.set("SampleType", [{ "fieldLength": "NA", "dataField": "nsampletypecode", "mandatory": false, "controlType": "NA" },
  { "fieldLength": "100", "mandatory": false, "controlType": "textbox", "idsName": "IDS_SAMPLETYPE", "dataField": "ssampletypename", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isDisabled": true, "isClearField": true },
  /*{ "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_CATEGORYBASEDFLOWREQUIRED", "dataField": "scategorybasedflowrequired", "width": "200px", "controlName": "ncategorybasedflowrequired", "mandatoryLabel":"IDS_SELECT","ndesigncomponentcode": 6 },
  { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_CLINICALTYPEREQUIRED", "dataField": "sclinicaltyperequired", "width": "200px", "controlName": "nclinicaltyperequired", "mandatoryLabel":"IDS_SELECT","ndesigncomponentcode": 6 },
  { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_PROJECTSPECREQUIRED", "dataField": "sprojectspecrequired", "width": "200px", "controlName": "nprojectspecrequired", "mandatoryLabel":"IDS_SELECT","ndesigncomponentcode": 6 },
  { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_COMPONENTREQUIRED", "dataField": "scomponentrequired", "width": "200px", "controlName": "ncomponentrequired", "mandatoryLabel":"IDS_SELECT","ndesigncomponentcode": 6 },
  { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_PORTALREQUIRED", "dataField": "sportalrequired", "width": "200px", "controlName": "nportalrequired", "mandatoryLabel":"IDS_SELECT","ndesigncomponentcode": 6 },
  { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_RULESENGINEREQUIRED", "dataField": "srulesenginerequired", "width": "200px", "controlName": "nrulesenginerequired", "mandatoryLabel":"IDS_SELECT","ndesigncomponentcode": 6 ,"expanded":true  },
  { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_OUTSOURCEREQUIRED", "dataField": "soutsourcerequired", "width": "200px", "controlName": "noutsourcerequired", "mandatoryLabel":"IDS_SELECT","ndesigncomponentcode": 6,"expanded":true  },*/
  { "mandatory": false, "controlType": "selectbox", "idsName": "IDS_TRANSACTIONFILTERTYPE", "dataField": "stransfiltertypename", "tableDataField": "ntransfiltertypecode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "sampletype", "methodUrl": "getTransactionFilterType", "foreignDataField": "ntransfiltertypecode", "objectValue": null }]);


  screenMap.set("ExternalOrder",

    [

      //Start of  Patient search with saved filter
      {
        "fieldLength": "100", "mandatory": false, "controlType": "search",
        "idsName": "IDS_SEARCHPATIENT", "dataField": "sfirstname", "width": "200px",
        "mandatoryLabel": "IDS_SEARCH", "ndesigncomponentcode": 7,
        "inputtype": "backendsearchfilter",
        //  "id": "JsWyTB1AI",
        ///  "type": "component",
        "label": "Patient",
        "table": {
          "item": {
            "nstatus": 0,
            "classUrl": "patient",
            "jsondata": null,
            "component": "Type3Component",
            "masterAdd": true,
            "methodUrl": "Patient",
            "nformcode": 137,
            "nsitecode": 0,
            "sformname": null,
            "stablename": "view_patientmaster",
            "sdefaultname": null,
            "sdisplayname": "Patient",
            "dmodifieddate": null,
            "addControlCode": 600,
            "nismastertable": 0,
            "nquerybuildertablecode": 228
          },
          "label": "Patient",
          "value": 228
        },
        "source": "view_patientmaster",
        // "inputtype": "backendsearchfilter",
        "awesomeTree": {
          "id": "8a889bb8-89ab-4cde-b012-31865506821b",
          "path": [
            "8a889bb8-89ab-4cde-b012-31865506821b"
          ],
          "type": "group",
          "children1": {
            "98b99a99-0123-4456-b89a-b18655068ca8": {
              "id": "98b99a99-0123-4456-b89a-b18655068ca8",
              "path": [
                "8a889bb8-89ab-4cde-b012-31865506821b",
                "98b99a99-0123-4456-b89a-b18655068ca8"
              ],
              "type": "rule",
              "properties": {
                "field": "\"sfirstname\"",
                "value": [""],
                "operator": "like",
                "valueSrc": ["value"],
                "valueType": ["text"],
                "valueError": [null],
                "operatorOptions": null
              }
            },
            "98a98aab-4567-489a-bcde-f18943dd387f": {
              "id": "98a98aab-4567-489a-bcde-f18943dd387f",
              "path": [
                "ba988a8b-0123-4456-b89a-b18943dd0fcf",
                "98a98aab-4567-489a-bcde-f18943dd387f"
              ],
              "type": "rule",
              "properties": {
                "field": "\"slastname\"",
                "value": [""],
                "operator": "like",
                "valueSrc": ["value"],
                "valueType": ["text"],
                "valueError": [null],
                "operatorOptions": null
              }
            }
          },
          "properties": {
            "conjunction": "AND"
          }
        },
        "displayname": {
          "en-US": "Patient",
          "ru-RU": "пациента",
          "tg-TG": "Бемор"
        },
        //"filterquery": "(\"sfirstname\" LIKE '%%' OR \"slastname\" LIKE '%%')",
        //"filterquery": "\"sfirstname\" IS NOT NULL",
        "isAddMaster": false,
        "valuemember": "spatientid",
        "filterfields": [
          {
            "columnname": "spatientid",
            "default": true,
            "displayname": { "ru-RU": 'Идентификатор пациента', "en-US": 'Patient ID', "tg-TG": 'ID бемор' },
            "filterinputtype": "text",
            "type": undefined
          },
          {
            "columnname": "sfirstname",
            "default": true,
            "displayname": { "ru-RU": 'Имя', "en-US": 'First name', "tg-TG": 'ном' },
            "filterinputtype": "text",
            "type": undefined
          },
          {
            "columnname": "slastname",
            "displayname": { "ru-RU": 'Фамилия', "en-US": 'Last Name', "tg-TG": 'Номи падар' },
            "filterinputtype": "text",
            "type": undefined
          },
          {
            "columnname": "sfathername",
            "displayname": { "ru-RU": 'Отчество', "en-US": 'Father Name', "tg-TG": 'Father Name' },
            "filterinputtype": "text",
            "type": undefined
          },
          {
            "columnname": "ddob",
            "displayname": { "ru-RU": 'Дата рождения', "en-US": 'DOB', "tg-TG": 'ДОБ' },
            "filterinputtype": "date",
            "type": undefined
          },
          {
            "columnname": "sage",
            "displayname": { "ru-RU": 'Возраст', "en-US": 'Age', "tg-TG": 'Синну сол' },
            "filterinputtype": "text",
            "type": undefined
          },
          {
            "columnname": "sgendername",
            "displayname": { "ru-RU": 'Пол', "en-US": 'Gender', "tg-TG": 'Гендер' },
            "filterinputtype": "text",
            "type": undefined
          }
        ],

        "awesomeConfig": {
          "funcs": {
            "NOW": {
              "label": "Now",
              "jsonLogic": "now",
              "returnType": "datetime",
              "jsonLogicCustomOps": {}
            },
            "LOWER": {
              "args": {
                "str": {
                  "type": "text",
                  "label": "String",
                  "widgets": {
                    "func": {},
                    "text": {
                      "widgetProps": {}
                    },
                    "field": {},
                    "textarea": {}
                  },
                  "_isFuncArg": true,
                  "mainWidget": "text",
                  "valueSources": [
                    "value",
                    "field"
                  ],
                  "fieldSettings": {}
                }
              },
              "label": "Lowercase",
              "jsonLogic": "toLowerCase",
              "mongoFunc": "$toLower",
              "returnType": "text",
              "jsonLogicCustomOps": {}
            },
            "UPPER": {
              "args": {
                "str": {
                  "type": "text",
                  "label": "String",
                  "widgets": {
                    "func": {},
                    "text": {
                      "widgetProps": {}
                    },
                    "field": {},
                    "textarea": {}
                  },
                  "_isFuncArg": true,
                  "mainWidget": "text",
                  "valueSources": [
                    "value",
                    "field"
                  ],
                  "fieldSettings": {}
                }
              },
              "label": "Uppercase",
              "jsonLogic": "toUpperCase",
              "mongoFunc": "$toUpper",
              "returnType": "text",
              "jsonLogicCustomOps": {}
            },
            "LINEAR_REGRESSION": {
              "args": {
                "val": {
                  "type": "number",
                  "label": "Value",
                  "widgets": {
                    "func": {},
                    "field": {},
                    "number": {
                      "widgetProps": {}
                    },
                    "slider": {}
                  },
                  "_isFuncArg": true,
                  "mainWidget": "number",
                  "valueSources": [
                    "value",
                    "field"
                  ],
                  "fieldSettings": {}
                },
                "bias": {
                  "type": "number",
                  "label": "Bias",
                  "widgets": {
                    "func": {},
                    "field": {},
                    "number": {
                      "widgetProps": {}
                    },
                    "slider": {}
                  },
                  "_isFuncArg": true,
                  "mainWidget": "number",
                  "defaultValue": 0,
                  "valueSources": [
                    "value"
                  ],
                  "fieldSettings": {}
                },
                "coef": {
                  "type": "number",
                  "label": "Coef",
                  "widgets": {
                    "func": {},
                    "field": {},
                    "number": {
                      "widgetProps": {}
                    },
                    "slider": {}
                  },
                  "_isFuncArg": true,
                  "mainWidget": "number",
                  "defaultValue": 1,
                  "valueSources": [
                    "value"
                  ],
                  "fieldSettings": {}
                }
              },
              "label": "Linear Regression",
              "renderSeps": [
                " * ",
                " + "
              ],
              "returnType": "number",
              "renderBrackets": [
                "",
                ""
              ]
            },
            "RELATIVE_DATETIME": {
              "args": {
                "op": {
                  "type": "select",
                  "label": "Op",
                  "widgets": {
                    "func": {},
                    "field": {},
                    "select": {
                      "widgetProps": {
                        "customProps": {
                          "showSearch": false
                        }
                      }
                    },
                    "multiselect": {}
                  },
                  "_isFuncArg": true,
                  "mainWidget": "select",
                  "defaultValue": "plus",
                  "valueSources": [
                    "value"
                  ],
                  "fieldSettings": {
                    "listValues": {
                      "plus": "+",
                      "minus": "-"
                    }
                  },
                  "mainWidgetProps": {
                    "customProps": {
                      "showSearch": false
                    }
                  }
                },
                "dim": {
                  "type": "select",
                  "label": "Dimension",
                  "widgets": {
                    "func": {},
                    "field": {},
                    "select": {
                      "widgetProps": {
                        "customProps": {
                          "showSearch": false
                        }
                      }
                    },
                    "multiselect": {}
                  },
                  "_isFuncArg": true,
                  "mainWidget": "select",
                  "defaultValue": "day",
                  "valueSources": [
                    "value"
                  ],
                  "fieldSettings": {
                    "listValues": {
                      "day": "day",
                      "week": "week",
                      "year": "year",
                      "month": "month"
                    }
                  },
                  "mainWidgetProps": {
                    "customProps": {
                      "showSearch": false
                    }
                  }
                },
                "val": {
                  "type": "number",
                  "label": "Value",
                  "widgets": {
                    "func": {},
                    "field": {},
                    "number": {
                      "widgetProps": {}
                    },
                    "slider": {}
                  },
                  "_isFuncArg": true,
                  "mainWidget": "number",
                  "defaultValue": 0,
                  "valueSources": [
                    "value"
                  ],
                  "fieldSettings": {
                    "min": 0
                  }
                },
                "date": {
                  "type": "datetime",
                  "label": "Date",
                  "widgets": {
                    "func": {},
                    "field": {},
                    "datetime": {
                      "widgetProps": {}
                    }
                  },
                  "_isFuncArg": true,
                  "mainWidget": "datetime",
                  "defaultValue": {
                    "args": [],
                    "func": "NOW"
                  },
                  "valueSources": [
                    "func",
                    "field"
                  ],
                  "fieldSettings": {}
                }
              },
              "label": "Relative",
              "renderSeps": [
                "",
                "",
                ""
              ],
              "returnType": "datetime",
              "renderBrackets": [
                "",
                ""
              ],
              "mongoFormatFunc": null,
              "jsonLogicCustomOps": {}
            }
          },
          "types": {
            "date": {
              "widgets": {
                "date": {
                  "operators": [
                    "equal",
                    "not_equal",
                    "less",
                    "less_or_equal",
                    "greater",
                    "greater_or_equal",
                    "between",
                    "not_between",
                    "is_null",
                    "is_not_null"
                  ],
                  "widgetProps": {}
                },
                "func": {},
                "field": {}
              },
              "operators": [
                "equal",
                "not_equal",
                "less",
                "less_or_equal",
                "greater",
                "greater_or_equal",
                "between",
                "not_between",
                "is_null",
                "is_not_null"
              ],
              "mainWidget": "date",
              "valueSources": [
                "value",
                "field",
                "func"
              ],
              "defaultOperator": "equal"
            },
            "text": {
              "widgets": {
                "func": {},
                "text": {
                  "opProps": {},
                  "operators": [
                    "equal",
                    "not_equal",
                    "is_empty",
                    "is_not_empty",
                    "is_null",
                    "is_not_null",
                    "like",
                    "not_like",
                    "starts_with",
                    "ends_with",
                    "proximity"
                  ],
                  "widgetProps": {}
                },
                "field": {
                  "operators": [
                    "equal",
                    "not_equal",
                    "proximity"
                  ]
                },
                "textarea": {
                  "opProps": {},
                  "operators": [
                    "equal",
                    "not_equal",
                    "is_empty",
                    "is_not_empty",
                    "is_null",
                    "is_not_null",
                    "like",
                    "not_like",
                    "starts_with",
                    "ends_with"
                  ],
                  "widgetProps": {}
                }
              },
              "operators": [
                "equal",
                "not_equal",
                "is_empty",
                "is_not_empty",
                "is_null",
                "is_not_null",
                "like",
                "not_like",
                "starts_with",
                "ends_with",
                "proximity"
              ],
              "mainWidget": "text",
              "valueSources": [
                "value",
                "field",
                "func"
              ],
              "defaultOperator": "equal"
            },
            "time": {
              "widgets": {
                "func": {},
                "time": {
                  "operators": [
                    "equal",
                    "not_equal",
                    "less",
                    "less_or_equal",
                    "greater",
                    "greater_or_equal",
                    "between",
                    "not_between",
                    "is_null",
                    "is_not_null"
                  ],
                  "widgetProps": {}
                },
                "field": {}
              },
              "operators": [
                "equal",
                "not_equal",
                "less",
                "less_or_equal",
                "greater",
                "greater_or_equal",
                "between",
                "not_between",
                "is_null",
                "is_not_null"
              ],
              "mainWidget": "time",
              "valueSources": [
                "value",
                "field",
                "func"
              ],
              "defaultOperator": "equal"
            },
            "!group": {
              "widgets": {
                "func": {},
                "field": {},
                "number": {
                  "opProps": {
                    "less": {
                      "label": "Count <"
                    },
                    "equal": {
                      "label": "Count =="
                    },
                    "between": {
                      "label": "Count between"
                    },
                    "greater": {
                      "label": "Count >"
                    },
                    "not_equal": {
                      "label": "Count !="
                    },
                    "not_between": {
                      "label": "Count not between"
                    },
                    "less_or_equal": {
                      "label": "Count <="
                    },
                    "greater_or_equal": {
                      "label": "Count >="
                    }
                  },
                  "operators": [
                    "some",
                    "all",
                    "none",
                    "equal",
                    "not_equal",
                    "less",
                    "less_or_equal",
                    "greater",
                    "greater_or_equal",
                    "between",
                    "not_between"
                  ],
                  "widgetProps": {
                    "min": 0
                  }
                }
              },
              "operators": [
                "some",
                "all",
                "none",
                "equal",
                "not_equal",
                "less",
                "less_or_equal",
                "greater",
                "greater_or_equal",
                "between",
                "not_between"
              ],
              "mainWidget": "number",
              "valueSources": [
                "value",
                "field",
                "func"
              ],
              "defaultOperator": "some"
            },
            "number": {
              "widgets": {
                "func": {},
                "field": {},
                "number": {
                  "operators": [
                    "equal",
                    "not_equal",
                    "less",
                    "less_or_equal",
                    "greater",
                    "greater_or_equal",
                    "between",
                    "not_between",
                    "is_null",
                    "is_not_null"
                  ],
                  "widgetProps": {}
                },
                "slider": {
                  "operators": [
                    "equal",
                    "not_equal",
                    "less",
                    "less_or_equal",
                    "greater",
                    "greater_or_equal",
                    "is_null",
                    "is_not_null"
                  ]
                }
              },
              "operators": [
                "equal",
                "not_equal",
                "less",
                "less_or_equal",
                "greater",
                "greater_or_equal",
                "between",
                "not_between",
                "is_null",
                "is_not_null"
              ],
              "mainWidget": "number",
              "valueSources": [
                "value",
                "field",
                "func"
              ],
              "defaultOperator": "equal"
            },
            "select": {
              "widgets": {
                "func": {},
                "field": {},
                "select": {
                  "operators": [
                    "select_equals",
                    "select_not_equals",
                    "is_null",
                    "is_not_null"
                  ],
                  "widgetProps": {
                    "customProps": {
                      "showSearch": true
                    }
                  }
                },
                "multiselect": {
                  "operators": [
                    "select_any_in",
                    "select_not_any_in",
                    "is_null",
                    "is_not_null"
                  ]
                }
              },
              "operators": [
                "select_equals",
                "select_not_equals",
                "select_any_in",
                "select_not_any_in",
                "is_null",
                "is_not_null"
              ],
              "mainWidget": "select",
              "valueSources": [
                "value",
                "field",
                "func"
              ],
              "defaultOperator": "select_equals"
            },
            "boolean": {
              "widgets": {
                "func": {},
                "field": {
                  "operators": [
                    "equal",
                    "not_equal"
                  ]
                },
                "boolean": {
                  "operators": [
                    "equal",
                    "not_equal",
                    "is_null",
                    "is_not_null"
                  ],
                  "widgetProps": {
                    "hideOperator": true,
                    "operatorInlineLabel": "is"
                  }
                }
              },
              "operators": [
                "equal",
                "not_equal",
                "is_null",
                "is_not_null"
              ],
              "mainWidget": "boolean",
              "valueSources": [
                "value",
                "field",
                "func"
              ],
              "defaultOperator": "equal"
            },
            "datetime": {
              "widgets": {
                "func": {},
                "field": {},
                "datetime": {
                  "operators": [
                    "equal",
                    "not_equal",
                    "less",
                    "less_or_equal",
                    "greater",
                    "greater_or_equal",
                    "between",
                    "not_between",
                    "is_null",
                    "is_not_null"
                  ],
                  "widgetProps": {}
                }
              },
              "operators": [
                "equal",
                "not_equal",
                "less",
                "less_or_equal",
                "greater",
                "greater_or_equal",
                "between",
                "not_between",
                "is_null",
                "is_not_null"
              ],
              "mainWidget": "datetime",
              "valueSources": [
                "value",
                "field",
                "func"
              ],
              "defaultOperator": "equal"
            },
            "multiselect": {
              "widgets": {
                "func": {},
                "field": {},
                "multiselect": {
                  "operators": [
                    "multiselect_equals",
                    "multiselect_not_equals",
                    "is_null",
                    "is_not_null"
                  ],
                  "widgetProps": {}
                }
              },
              "operators": [
                "multiselect_equals",
                "multiselect_not_equals",
                "is_null",
                "is_not_null"
              ],
              "mainWidget": "multiselect",
              "valueSources": [
                "value",
                "field",
                "func"
              ],
              "defaultOperator": "multiselect_equals"
            }
          },
          "fields": {
            "\"sfirstname\"": {
              "type": "text",
              "label": "First name",
              "widgets": {
                "func": {},
                "text": {
                  "widgetProps": {
                    "valueLabel": "Name",
                    "valuePlaceholder": "EnterFirst name"
                  }
                },
                "field": {},
                "textarea": {}
              },
              "mainWidget": "text",
              "valueSources": [
                "value",
                "func"
              ],
              "fieldSettings": {},
              "mainWidgetProps": {
                "valueLabel": "Name",
                "valuePlaceholder": "EnterFirst name"
              }
            },
            "\"slastname\"": {
              "type": "text",
              "label": "Last name",
              "widgets": {
                "func": {},
                "text": {
                  "widgetProps": {
                    "valueLabel": "Name",
                    "valuePlaceholder": "EnterLast name"
                  }
                },
                "field": {},
                "textarea": {}
              },
              "mainWidget": "text",
              "valueSources": [
                "value",
                "func"
              ],
              "fieldSettings": {},
              "mainWidgetProps": {
                "valueLabel": "Name",
                "valuePlaceholder": "EnterLast name"
              }
            }
          },
          "widgets": {
            "date": {
              "type": "date",
              "jsType": "string",
              "valueSrc": "value",
              "dateFormat": "DD.MM.YYYY",
              "valueLabel": "Date",
              "useKeyboard": true,
              "valueFormat": "YYYY-MM-DD",
              "valueLabels": [
                {
                  "label": "Date from",
                  "placeholder": "Enter date from"
                },
                {
                  "label": "Date to",
                  "placeholder": "Enter date to"
                }
              ],
              "valuePlaceholder": "Enter date"
            },
            "func": {
              "valueSrc": "func",
              "valueLabel": "Function",
              "customProps": {},
              "valuePlaceholder": "Select function"
            },
            "text": {
              "type": "text",
              "jsType": "string",
              "valueSrc": "value",
              "valueLabel": "String",
              "valuePlaceholder": "Enter string"
            },
            "time": {
              "type": "time",
              "jsType": "string",
              "valueSrc": "value",
              "timeFormat": "HH:mm",
              "use12Hours": false,
              "valueLabel": "Time",
              "useKeyboard": true,
              "valueFormat": "HH:mm:ss",
              "valueLabels": [
                {
                  "label": "Time from",
                  "placeholder": "Enter time from"
                },
                {
                  "label": "Time to",
                  "placeholder": "Enter time to"
                }
              ],
              "valuePlaceholder": "Enter time"
            },
            "field": {
              "valueSrc": "field",
              "valueLabel": "Field to compare",
              "customProps": {
                "showSearch": true
              },
              "valuePlaceholder": "Select field to compare"
            },
            "number": {
              "type": "number",
              "jsType": "number",
              "valueSrc": "value",
              "valueLabel": "Number",
              "valueLabels": [
                {
                  "label": "Number from",
                  "placeholder": "Enter number from"
                },
                {
                  "label": "Number to",
                  "placeholder": "Enter number to"
                }
              ],
              "valuePlaceholder": "Enter number"
            },
            "select": {
              "type": "select",
              "jsType": "string",
              "valueSrc": "value",
              "valueLabel": "Value",
              "valuePlaceholder": "Select value"
            },
            "slider": {
              "type": "number",
              "jsType": "number",
              "valueSrc": "value",
              "valueLabel": "Number",
              "valuePlaceholder": "Enter number or move slider"
            },
            "boolean": {
              "type": "boolean",
              "jsType": "boolean",
              "labelNo": "No",
              "labelYes": "Yes",
              "valueSrc": "value",
              "defaultValue": false
            },
            "datetime": {
              "type": "datetime",
              "jsType": "string",
              "valueSrc": "value",
              "dateFormat": "DD.MM.YYYY",
              "timeFormat": "HH:mm",
              "use12Hours": false,
              "valueLabel": "Datetime",
              "useKeyboard": true,
              "valueFormat": "YYYY-MM-DD HH:mm:ss",
              "valueLabels": [
                {
                  "label": "Datetime from",
                  "placeholder": "Enter datetime from"
                },
                {
                  "label": "Datetime to",
                  "placeholder": "Enter datetime to"
                }
              ],
              "valuePlaceholder": "Enter datetime"
            },
            "textarea": {
              "type": "text",
              "jsType": "string",
              "valueSrc": "value",
              "fullWidth": true,
              "valueLabel": "Text",
              "valuePlaceholder": "Enter text"
            },
            "multiselect": {
              "type": "multiselect",
              "jsType": "array",
              "valueSrc": "value",
              "valueLabel": "Values",
              "valuePlaceholder": "Select values"
            }
          },
          "settings": {
            "locale": {
              "moment": "ru"
            },
            "showNot": true,
            "notLabel": "Not",
            "showLock": false,
            "funcLabel": "Functions",
            "jsonLogic": {
              "lockedOp": "locked",
              "altVarKey": "var",
              "groupVarKey": "var"
            },
            "lockLabel": "Lock",
            "canRegroup": true,
            "canReorder": true,
            "fieldLabel": "Field",
            "maxNesting": 5,
            "renderSize": "small",
            "valueLabel": "Value",
            "deleteLabel": null,
            "lockedLabel": "Locked",
            "addRuleLabel": "Add Rule",
            "addGroupLabel": "Add Group",
            "delGroupLabel": null,
            "forceShowConj": false,
            "operatorLabel": "Operator",
            "defaultMaxRows": 5,
            "fieldSeparator": ".",
            "groupOperators": [
              "some",
              "all",
              "none"
            ],
            "addSubRuleLabel": "Add sub rule",
            "canDeleteLocked": false,
            "funcPlaceholder": "Select function",
            "maxLabelsLength": 100,
            "fieldPlaceholder": "Select field",
            "showErrorMessage": true,
            "valuePlaceholder": "Value",
            "valueSourcesInfo": {
              "func": {
                "label": "Functions",
                "widget": "func"
              },
              "field": {
                "label": "Field",
                "widget": "field"
              },
              "value": {
                "label": "Value"
              }
            },
            "canLeaveEmptyGroup": true,
            "canShortMongoQuery": true,
            "convertableWidgets": {
              "text": [
                "textarea"
              ],
              "number": [
                "slider",
                "rangeslider"
              ],
              "slider": [
                "number",
                "rangeslider"
              ],
              "textarea": [
                "text"
              ],
              "rangeslider": [
                "number",
                "slider"
              ]
            },
            "defaultSearchWidth": "100px",
            "defaultSelectWidth": "200px",
            "defaultSliderWidth": "200px",
            "setOpOnChangeField": [
              "keep",
              "default"
            ],
            "operatorPlaceholder": "Select operator",
            "groupActionsPosition": "topRight",
            "fieldSeparatorDisplay": ".",
            "customFieldSelectProps": {
              "showSearch": true
            },
            "shouldCreateEmptyGroup": false,
            "valueSourcesPopupTitle": "Select value source",
            "defaultGroupConjunction": "AND",
            "removeRuleConfirmOptions": null,
            "removeGroupConfirmOptions": null
          },
          "operators": {
            "all": {
              "label": "All",
              "jsonLogic": "all",
              "cardinality": 0,
              "labelForFormat": "ALL"
            },
            "less": {
              "label": "Less than",
              "sqlOp": "<",
              "jsonLogic": "<",
              "reversedOp": "greater_or_equal",
              "labelForFormat": "<",
              "elasticSearchQueryType": "range"
            },
            "like": {
              "label": "Like",
              "sqlOp": "LIKE",
              "jsonLogic": "in",
              "reversedOp": "not_like",
              "valueSources": [
                "value"
              ],
              "labelForFormat": "Like",
              "_jsonLogicIsRevArgs": true,
              "elasticSearchQueryType": "regexp"
            },
            "none": {
              "label": "None",
              "jsonLogic": "none",
              "cardinality": 0,
              "labelForFormat": "NONE"
            },
            "some": {
              "label": "Some",
              "jsonLogic": "some",
              "cardinality": 0,
              "labelForFormat": "SOME"
            },
            "equal": {
              "label": "Equal to",
              "sqlOp": "=",
              "jsonLogic": "==",
              "reversedOp": "not_equal",
              "labelForFormat": "==",
              "elasticSearchQueryType": "term"
            },
            "between": {
              "label": "Between",
              "sqlOp": "BETWEEN",
              "jsonLogic": "<=",
              "reversedOp": "not_between",
              "cardinality": 2,
              "valueLabels": [
                "Value from",
                "Value to"
              ],
              "labelForFormat": "BETWEEN",
              "textSeparators": [
                "from",
                "to"
              ]
            },
            "greater": {
              "label": "Greater than",
              "sqlOp": ">",
              "jsonLogic": ">",
              "reversedOp": "less_or_equal",
              "labelForFormat": ">",
              "elasticSearchQueryType": "range"
            },
            "is_null": {
              "label": "Is null",
              "sqlOp": "IS NULL",
              "jsonLogic": "==",
              "reversedOp": "is_not_null",
              "cardinality": 0,
              "labelForFormat": "IS NULL"
            },
            "is_empty": {
              "label": "Is empty",
              "jsonLogic": "!",
              "reversedOp": "is_not_empty",
              "cardinality": 0,
              "labelForFormat": "IS EMPTY"
            },
            "not_like": {
              "label": "Not Like",
              "sqlOp": "NOT LIKE",
              "isNotOp": true,
              "reversedOp": "like",
              "valueSources": [
                "value"
              ],
              "labelForFormat": "Not Like"
            },
            "ends_with": {
              "label": "Ends With",
              "sqlOp": "LIKE",
              "valueSources": [
                "value"
              ],
              "labelForFormat": "Ends with"
            },
            "not_equal": {
              "label": "Not equal to",
              "sqlOp": "<>",
              "isNotOp": true,
              "jsonLogic": "!=",
              "reversedOp": "equal",
              "labelForFormat": "!="
            },
            "is_not_null": {
              "label": "Is not null",
              "sqlOp": "IS NOT NULL",
              "jsonLogic": "!=",
              "reversedOp": "is_null",
              "cardinality": 0,
              "labelForFormat": "IS NOT NULL",
              "elasticSearchQueryType": "exists"
            },
            "not_between": {
              "label": "Not Between",
              "sqlOp": "NOT BETWEEN",
              "isNotOp": true,
              "reversedOp": "between",
              "cardinality": 2,
              "valueLabels": [
                "Value from",
                "Value to"
              ],
              "labelForFormat": "NOT BETWEEN",
              "textSeparators": [
                null,
                "and"
              ]
            },
            "starts_with": {
              "label": "Starts With",
              "sqlOp": "LIKE",
              "valueSources": [
                "value"
              ],
              "labelForFormat": "Starts with"
            },
            "is_not_empty": {
              "label": "Is not empty",
              "isNotOp": true,
              "jsonLogic": "!!",
              "reversedOp": "is_empty",
              "cardinality": 0,
              "labelForFormat": "IS NOT EMPTY",
              "elasticSearchQueryType": "exists"
            },
            "less_or_equal": {
              "label": "Greater than or equal to",
              "sqlOp": "<=",
              "jsonLogic": "<=",
              "reversedOp": "greater",
              "labelForFormat": "<=",
              "elasticSearchQueryType": "range"
            },
            "select_any_in": {
              "label": "Any In",
              "sqlOp": "IN",
              "jsonLogic": "in",
              "reversedOp": "select_not_any_in",
              "labelForFormat": "IN",
              "elasticSearchQueryType": "term"
            },
            "select_equals": {
              "label": "Equal to",
              "sqlOp": "=",
              "jsonLogic": "==",
              "reversedOp": "select_not_equals",
              "labelForFormat": "==",
              "elasticSearchQueryType": "term"
            },
            "greater_or_equal": {
              "label": "Less than or equal to",
              "sqlOp": ">=",
              "jsonLogic": ">=",
              "reversedOp": "less",
              "labelForFormat": ">=",
              "elasticSearchQueryType": "range"
            },
            "select_not_any_in": {
              "label": "Not In",
              "sqlOp": "NOT IN",
              "isNotOp": true,
              "reversedOp": "select_any_in",
              "labelForFormat": "NOT IN"
            },
            "select_not_equals": {
              "label": "Not equal to",
              "sqlOp": "<>",
              "isNotOp": true,
              "jsonLogic": "!=",
              "reversedOp": "select_equals",
              "labelForFormat": "!="
            },
            "multiselect_equals": {
              "label": "Equals",
              "sqlOp": "=",
              "jsonLogic2": "all-in",
              "reversedOp": "multiselect_not_equals",
              "labelForFormat": "==",
              "elasticSearchQueryType": "term"
            },
            "multiselect_not_equals": {
              "label": "Not equals",
              "sqlOp": "<>",
              "isNotOp": true,
              "reversedOp": "multiselect_equals",
              "labelForFormat": "!="
            }
          },
          "__fieldNames": {},
          "conjunctions": {
            "OR": {
              "label": "Or",
              "mongoConj": "$or",
              "reversedConj": "AND"
            },
            "AND": {
              "label": "And",
              "mongoConj": "$and",
              "reversedConj": "OR"
            }
          },
          "_funcsCntByType": {
            "text": 2,
            "number": 1,
            "datetime": 2
          },
          "_fieldsCntByType": {
            "text": 1
          }
        },
        "componentcode": 11,
        "componentname": "Search",
        "displaymember": "sfirstname",
        "customsearchfilter": [
          {
            "item": {
              "default": true,
              "columnname": "sfirstname",
              "displayname": {
                "en-US": "First name",
                "ru-RU": "Имя",
                "tg-TG": "ном"
              },
              "filterinputtype": "text"
            },
            "type": "static",
            "label": "First name",
            "value": "sfirstname"
          }
        ],
        "nquerybuildertablecode": 228,
        "childFields": [{ "columnname": "spatientid", "ndesigncomponentcode": designComponents.TEXTBOX },
        { "columnname": "sfirstname", "ndesigncomponentcode": designComponents.TEXTBOX },
        { "columnname": "slastname", "ndesigncomponentcode": designComponents.TEXTBOX },
        { "columnname": "sfathername", "ndesigncomponentcode": designComponents.TEXTBOX },
        { "columnname": "ddob", "ndesigncomponentcode": designComponents.DATEPICKER },
        { "columnname": "sage", "ndesigncomponentcode": designComponents.TEXTBOX },
        { "columnname": "sgendername", "ndesigncomponentcode": designComponents.COMBOBOX, "svaluemember": "ngendercode", "sdisplaymember": "sgendername" }]

      },
      //End of patient search with saved filter


      { "fieldLength": "NA", "dataField": "nproductcode", "mandatory": false, "controlType": "NA", "isDisabled": true },
      { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PATIENTID", "dataField": "spatientid", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": designComponents.TEXTBOX, "isDisabled": true, "isJsonField": true, "jsonObjectName": "jsondata" },
      { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_FIRSTNAME", "dataField": "sfirstname", "tableDataField": "spatientfirstname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": designComponents.TEXTBOX, "isDisabled": true, "isJsonField": true, "jsonObjectName": "jsondata" },
      { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_LASTNAME", "dataField": "slastname", "tableDataField": "spatientlastname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": designComponents.TEXTBOX, "isDisabled": true, "isJsonField": true, "jsonObjectName": "jsondata" },
      { "fieldLength": "100", "mandatory": false, "controlType": "textbox", "idsName": "IDS_FATHERNAME", "dataField": "sfathername", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": designComponents.TEXTBOX, "isDisabled": true, "isJsonField": true, "jsonObjectName": "jsondata" },
      { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_GENDER", "dataField": "sgendername", "foreignDisplayMember": "sgendername", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": designComponents.COMBOBOX, "isDisabled": true, "classUrl": "patient", "methodUrl": "getGender", "tableDataField": "ngendercode", "foreignDataField": "ngendercode", "objectValue": "genderList", "isJsonField": true, "jsonObjectName": "jsondata" },
      { "fieldLength": "NA", "mandatory": true, "controlType": "datepicker", "idsName": "IDS_DATEOFBIRTH", "dataField": "ddob", "dateField": "sdob", "width": "200px", "controlName": "ddob", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": designComponents.DATEPICKER, "isDisabled": true, "isJsonField": true, "jsonObjectName": "jsondata", "showtime": false },
      { "fieldLength": "100", "mandatory": false, "controlType": "textbox", "idsName": "IDS_AGE", "dataField": "sage", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": designComponents.TEXTBOX, "isDisabled": true, "isJsonField": true, "jsonObjectName": "jsondata" },
      { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_EXTERNALORDERTYPE", "dataField": "sexternalordertypename", "foreignDisplayMember": "sexternalordertypename", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": designComponents.COMBOBOX, "classUrl": "externalorder", "methodUrl": "getExternalOrderType", "tableDataField": "nexternalordertypecode", "foreignDataField": "nexternalordertypecode", "objectValue": "ExternalOrderType" },
      { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_DIAGNOSTICCASETYPE", "dataField": "sdiagnosticcasename", "foreignDisplayMember": "sdiagnosticcasename", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": designComponents.COMBOBOX, "classUrl": "externalorder", "methodUrl": "getDiagnosticcase", "tableDataField": "ndiagnosticcasecode", "foreignDataField": "ndiagnosticcasecode", "objectValue": "Diagnosticcase" },

      {
        "mandatory": true, "controlType": "selectbox", "idsName": "IDS_DISTRICT",
        "dataField": "sdistrictname", "foreignDisplayMember": "sdistrictname",
        "width": "200px",
        "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": designComponents.COMBOBOX,
        "objectValue": null,
        "classUrl": "institution", "methodUrl": "getInstitutionDistrict",
        "tableDataField": "ndistrictcode",
        "foreignDataField": "ndistrictcode",
        "isMasterAdd": false, "childIndex": 12, //"needService":false,"useService":3,
        "childFieldToClear": [

          {
            "label": "ssubmittername",
            "foriegntablePK": "ssubmittercode",
            "tablecolumnname": "ssubmittername"
          },
          {
            "label": "sinstitutionname",
            "foriegntablePK": "ninstitutioncode",
            "tablecolumnname": "ninstitutioncode"
          },
          {
            "label": "sinstitutionsitename",
            "foriegntablePK": "ninstitutionsitecode",
            "tablecolumnname": "ninstitutionsitecode"
          },
        ],
      },
      {
        "mandatory": true, "controlType": "selectbox", "idsName": "IDS_INSTITUTIONCATEGORY",
        "dataField": "sinstitutioncatname", "foreignDisplayMember": "sinstitutioncatname", "width": "200px",
        "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": designComponents.COMBOBOX, "objectValue": null,
        "classUrl": "institution", "methodUrl": "getInstitutionCategoryByDistrict",
        "tableDataField": "ninstitutioncatcode",
        "foreignDataField": "ninstitutioncatcode",
        "parenttableDataField": "ndistrictcode",
        "isMasterAdd": false, "childIndex": 13, "needService": false, "useService": 4,
        "childFieldToClear": [
          {
            "label": "sinstitutionsitename",
            "foriegntablePK": "ninstitutionsitecode",
            "tablecolumnname": "ninstitutionsitecode"
          },
          {
            "label": "ssubmittername",
            "foriegntablePK": "ssubmittercode",
            "tablecolumnname": "ssubmittername"
          }
        ],
      },

      {
        "mandatory": true, "controlType": "selectbox", "idsName": "IDS_INSTITUTION",
        "dataField": "sinstitutionname", "foreignDisplayMember": "sinstitutionname", "width": "200px",
        "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": designComponents.COMBOBOX,
        "classUrl": "institution", "methodUrl": "getInstitutionByMappedCategory",
        "tableDataField": "ninstitutioncode", "objectValue": null,
        "foreignDataField": "ninstitutioncode", "child": true, "parenttableDataField": "ninstitutioncatcode",
        "needService": false, "useService": 5, "isMasterAdd": false, "childIndex": 14,
        "childFieldToClear": [
          {
            "label": "ssubmittername",
            "foriegntablePK": "ssubmittercode",
            "tablecolumnname": "ssubmittername"
          }
        ], "ismutipleparent": true, "parentMutipleTableDataField": "ndistrictcode"
      },
      {
        "mandatory": true, "controlType": "selectbox", "idsName": "IDS_INSTITUTIONSITE",
        "dataField": "sinstitutionsitename", "foreignDisplayMember": "sinstitutionsitename", "width": "200px",
        "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": designComponents.COMBOBOX,
        "classUrl": "institution", "methodUrl": "getInstitutionSiteByMappedInstitution",
        "tableDataField": "ninstitutionsitecode", "child": true,
        "foreignDataField": "ninstitutionsitecode", "objectValue": null,
        "needService": false, "useService": 6, "childIndex": 15, "isMasterAdd": false,
        "parenttableDataField": "ninstitutioncode", "ismutipleparent": true, "parentMutipleTableDataField": "ndistrictcode"
      },

      {
        "mandatory": true, "controlType": "selectbox", "idsName": "IDS_SUBMITTER",
        "dataField": "ssubmittername", "foreignDisplayMember": "ssubmittername", "width": "200px",
        "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": designComponents.COMBOBOX,
        "classUrl": "submitter", //"methodUrl": "getActiveSubmitterByInstitution",  
        "methodUrl": "getSubmitterByInstitutionSite",
        "tableDataField": "ssubmittercode", //"child":true, 
        "foreignDataField": "ssubmittercode", "objectValue": "Submitter", "childIndex": 16,
        "needService": false, "useService": 7, "isMasterAdd": false, "parenttableDataField": "ninstitutionsitecode", "ismutipleparent": true, "parentMutipleTableDataField": "ninstitutioncode"
      },


      {
        "mandatory": true, "controlType": "selectbox", "idsName": "IDS_SAMPLECATEGORY",
        "dataField": "sproductcatname", "foreignDisplayMember": "sproductcatname", "width": "200px",
        "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": designComponents.COMBOBOX, "objectValue": null,
        "classUrl": "externalorder", "methodUrl": "getProductCategory",
        "tableDataField": "nproductcatcode",
        "foreignDataField": "nproductcatcode",
        "isMasterAdd": false,
      },
      //  { "mandatory": true, "controlType": "datepicker", "idsName": "IDS_COLLECTIONDATE", "dataField": "dcollectiondate","dateField": "dcollectiondate",  "width": "200px","controlName": "dcollectiondate", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": designComponents.DATEPICKER,"isJsonField": true,"jsonObjectName": "jsondata","showtime":true},
      // ALPD-3575
    ]);

  screenMap.set("OEM", [{ "fieldLength": "NA", "dataField": "noemcode", "mandatory": false, "controlType": "NA" },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_OEM", "dataField": "soemname", "jsonObjectName": "jsondata", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "250", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "jsonObjectName": "jsondata", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true },

  ]);

  screenMap.set("StudyIdentity", [{ "fieldLength": "NA", "dataField": "nstudyidentitycode", "mandatory": false, "controlType": "NA" },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_PROJECTTYPE", "dataField": "sprojecttypename", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "projecttype", "methodUrl": "getProjectType", "foreignDataField": "nprojecttypecode", "tableDataField": "nprojecttypecode", "objectValue": null },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_IDENTIFICATIONNAME", "dataField": "sidentificationname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "1", "mandatory": true, "controlType": "textbox", "idsName": "IDS_CODE", "dataField": "scode", "width": "200", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "zeroNotAllowed": true, "isClearField": true },
  ]);

  screenMap.set("SampleDonor", [{ "fieldLength": "NA", "dataField": "nsampledonorcode", "mandatory": false, "controlType": "NA" },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_PROJECTTYPE", "dataField": "sprojecttypename", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "projecttype", "methodUrl": "getProjectType", "foreignDataField": "nprojecttypecode", "tableDataField": "nprojecttypecode", "objectValue": null },
  { "fieldLength": "50", "mandatory": true, "controlType": "textbox", "idsName": "IDS_SAMPLEDONOR", "dataField": "ssampledonor", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "1", "mandatory": true, "controlType": "numericinput", "idsName": "IDS_CODE", "dataField": "ncode", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 5, "zeroNotAllowed": true }
  ]);

  screenMap.set("CollectionTubeType", [{ "fieldLength": "NA", "dataField": "ncollectiontubetypecode", "mandatory": false, "controlType": "NA" },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_PROJECTTYPE", "dataField": "sprojecttypename", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "projecttype", "methodUrl": "getProjectType", "foreignDataField": "nprojecttypecode", "tableDataField": "nprojecttypecode", "objectValue": null },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_COLLECTIONTUBETYPE", "dataField": "stubename", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "1", "mandatory": true, "controlType": "numericinput", "idsName": "IDS_CODE", "dataField": "ncode", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 5, "zeroNotAllowed": true }
  ]);
  screenMap.set("PatientCategory", [{ "fieldLength": "NA", "dataField": "npatientcatcode", "mandatory": false, "controlType": "NA" },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_PROJECTTYPE", "dataField": "sprojecttypename", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "projecttype", "methodUrl": "getProjectType", "foreignDataField": "nprojecttypecode", "tableDataField": "nprojecttypecode", "objectValue": null },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PATIENTCATEGORY", "dataField": "spatientcatname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "1", "mandatory": true, "controlType": "numericinput", "idsName": "IDS_CODE", "dataField": "ncode", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 5, "zeroNotAllowed": true }
  ]);
  screenMap.set("SampleCollectionType", [{ "fieldLength": "NA", "dataField": "nsamplecollectiontypecode", "mandatory": false, "controlType": "NA" },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_PROJECTTYPE", "dataField": "sprojecttypename", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "projecttype", "methodUrl": "getProjectType", "foreignDataField": "nprojecttypecode", "tableDataField": "nprojecttypecode", "objectValue": null },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_SAMPLETYPE", "dataField": "sproductname", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "product", "methodUrl": "getProduct", "foreignDataField": "nproductcode", "tableDataField": "nproductcode", "objectValue": "Product" },
  { "fieldLength": "2", "mandatory": true, "controlType": "textbox", "idsName": "IDS_CODE", "dataField": "scode", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true }
  ]);

  screenMap.set("SamplePunchSite", [{ "fieldLength": "NA", "dataField": "nsamplepunchsitecode", "mandatory": false, "controlType": "NA" },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_PROJECTTYPE", "dataField": "sprojecttypename", "tableDataField": "nprojecttypecode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "samplepunchsite", "methodUrl": "getProjecttype", "onChangeUrl": "getSampleType", "foreignDataField": "nprojecttypecode", "childPrimaryField": "nproductcode", "childdataField": "sproductname", "objectValue": "projecttypeList", "childObjectValue": "sampletypeList" },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_SAMPLETYPE", "dataField": "sproductname", "foreignDisplayMember": "sproductname", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "samplepunchsite", "methodUrl": "getSampleType", "objectValue": "sampletypeList", "tableDataField": "nproductcode", "foreignDataField": "nproductcode", "child": true, "parentPrimaryField": "nprojecttypecode" },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PUNCHDESCRIPTION", "dataField": "spunchdescription", "jsonObjectName": "jsondata", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true },
  { "fieldLength": "1", "mandatory": true, "controlType": "numericinput", "idsName": "IDS_CODE", "dataField": "ncode", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 5, "zeroNotAllowed": true },
  ]);

  screenMap.set("InterfacerMapping", [
    { "fieldLength": "NA", "dataField": "ninterfacemappingcode", "mandatory": false, "controlType": "NA" },
    //{ "mandatory": true, "controlType": "selectbox", "idsName": "IDS_INTERFACETYPENAME", "dataField": "sinterfacetypename", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "interfacermapping", "methodUrl": "getInterfaceType","foreignDataField":"ninterfacetypecode" ,"tableDataField":"ninterfacetypecode","objectValue": null },
    {
      "mandatory": true, "controlType": "selectbox", "idsName": "IDS_INTERFACETYPENAME",
      "dataField": "sinterfacetypename", "tableDataField": "ninterfacetypecode",
      "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3,
      "classUrl": "interfacermapping", "methodUrl": "getInterfaceType", "onChangeUrl": "getTestMaster",
      "foreignDataField": "ninterfacetypecode", "childPrimaryField": "ntestcode",
      "childdataField": "stestsynonym", "objectValue": null,
      "childObjectValue": null
    },

    {
      "mandatory": true, "controlType": "selectbox", "idsName": "IDS_TESTCODE",
      "dataField": "stestsynonym", "width": "200px", "mandatoryLabel": "IDS_SELECT",
      "foreignDisplayMember": "stestsynonym", "ndesigncomponentcode": 3, "classUrl": "interfacermapping", "methodUrl": "getTestMaster",
      "foreignDataField": "ntestcode", "tableDataField": "ntestcode", "objectValue": null, "parentPrimaryField": "ninterfacetypecode"
    },
    // { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_INTERFACERTEST","dataField": "stestname", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "interfacermapping", "methodUrl": "getInterfaceTest","foreignDataField":"ninterfacertestcode", "tableDataField":"ninterfacertestcode", "objectValue": null },
    {
      "mandatory": true, "fieldLength": "50", "controlType": "textbox", "idsName": "IDS_INTERFACERTEST",
      "dataField": "stestname", "width": "200px", "mandatoryLabel": "IDS_ENTER",
      "ndesigncomponentcode": 1, "combobasedLabel": "true", "isClearField": true
    },
    //{  "mandatory": true,"fieldLength": "100", "controlType": "textbox", "idsName": "IDS_SDMSTEST", "dataField": "sinterfacername", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1 },

  ]);  //sinterfacettype
  screenMap.set("ContainerStructure", [{ "fieldLength": "NA", "dataField": "ncontainerstructurecode", "mandatory": false, "controlType": "NA" },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_CONTAINERTYPE", "dataField": "scontainertype", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "containertype", "methodUrl": "getContainerType", "foreignDataField": "ncontainertypecode", "tableDataField": "ncontainertypecode", "objectValue": null },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_CONTAINERSTRUCTURENAME", "dataField": "scontainerstructurename", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "2", "mandatory": true, "controlType": "numericinput", "idsName": "IDS_ROW", "dataField": "nrow", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 5, "maxValue": true, "isClearField": true },
  { "fieldLength": "2", "mandatory": true, "controlType": "numericinput", "idsName": "IDS_COLUMN", "dataField": "ncolumn", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 5, "maxValue": true, "isClearField": true }

  ]);

  screenMap.set("UnitConversion", [
    { "fieldLength": "NA", "dataField": "nunitconversioncode", "mandatory": false, "controlType": "NA" },
    { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_REALUNIT", "dataField": "sunitname", "tableDataField": "nsourceunitcode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "unitconversion", "methodUrl": "getUnit", "foreignDataField": "nsourceunitcode", "objectValue": null, "tablecolumnname": "nsourceunitcode" },
    { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_CONVERSIONUNIT", "dataField": "sunitname1", "tableDataField": "ndestinationunitcode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "unitconversion", "methodUrl": "getUnit", "foreignDataField": "ndestinationunitcode", "objectValue": null, "tablecolumnname": "ndestinationunitcode" },
    { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_CONVERSIONOPERATOR", "dataField": "soperator", "tableDataField": "noperatorcode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "unitconversion", "methodUrl": "getConversionOperator", "foreignDataField": "noperatorcode", "objectValue": null, "tablecolumnname": "noperatorcode" },
    { "fieldLength": "10", "mandatory": true, "controlType": "numericinput", "idsName": "IDS_CONVERSIONFACTOR", "dataField": "nconversionfactor", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 5, "precision": 5, "tablecolumnname": "nconversionfactor" },

  ]);

  screenMap.set("SampleAppearance", [{ "fieldLength": "NA", "dataField": "nsampleappearancecode", "mandatory": false, "controlType": "NA" },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_SAMPLEAPPEARANCE", "dataField": "ssampleappearance", "jsonObjectName": "jsondata", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "jsonObjectName": "jsondata", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true },
  { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdisplaystatus", "width": "200px", "controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 6, "isClearField": true }

  ]);

  screenMap.set("FusionPlant", [
    { "fieldLength": "NA", "dataField": "nplantcode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "5", "controlType": "textbox", "idsName": "IDS_SITECODE", "width": "150px", "dataField": "nsitecode" },
    { "fieldLength": "5", "mandatory": true, "controlType": "textbox", "idsName": "IDS_SITE", "dataField": "sdisplaylabel", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
    { "fieldLength": "5", "controlType": "textbox", "idsName": "IDS_PLANTCODE", "width": "150px", "dataField": "nplantcode" },
    { "fieldLength": "30", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PLANT", "dataField": "splantshortdesc", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
    { "fieldLength": "150", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PLANTDESCRIPTION", "dataField": "splantdescription", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
    { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_ISLAB", "dataField": "sdisplaystatus", "width": "200px", "controlName": "defaultFusionPlant", "componentName": "toggle", "ndesigncomponentcode": 6, "switchStatus": transactionStatus.NO, "switchFieldName": "nislab", "needRights": true }

  ]);

  screenMap.set("SampleGroup", [{ "fieldLength": "NA", "dataField": "nsamplegroupcode", "mandatory": false, "controlType": "NA" },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_SAMPLEGROUPNAME", "dataField": "ssamplegroupname", "jsonObjectName": "jsondata", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "jsonObjectName": "jsondata", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true }

  ]);

  screenMap.set("FusionSite", [{ "fieldLength": "NA", "dataField": "nsitecode", "mandatory": false, "controlType": "NA" },
  { "fieldLength": "5", "controlType": "textbox", "idsName": "IDS_SITECODE", "dataField": "nsitecode" },
  { "fieldLength": "100", "controlType": "textarea", "idsName": "IDS_SITE", "dataField": "sdisplaylabel" }

  ]);


  screenMap.set("FusionUsers", [{ "fieldLength": "NA", "dataField": "necno", "mandatory": false, "controlType": "NA" },
  { "fieldLength": "5", "idsName": "IDS_ECNO", "dataField": "necno" },
  { "fieldLength": "100", "idsName": "IDS_USERNAME", "dataField": "susername" },
  { "fieldLength": "5", "controlType": "textbox", "idsName": "IDS_PLANTCODE", "dataField": "nplantcode" },
  { "fieldLength": "5", "idsName": "IDS_PLANT", "dataField": "splantshortdesc" },
  { "fieldLength": "5", "controlType": "textbox", "idsName": "IDS_SITECODE", "dataField": "nsitecode" },
  { "fieldLength": "5", "idsName": "IDS_SITE", "dataField": "sdisplaylabel" },
  { "fieldLength": "100", "idsName": "IDS_DESIGNATION", "dataField": "sdesignation" }

  ]);

  screenMap.set("ADSSettings", [{ "fieldLength": "NA", "dataField": "nadssettingscode", "mandatory": false, "controlType": "NA" },
  { "fieldLength": "50", "mandatory": true, "controlType": "textbox", "idsName": "IDS_SERVERNAME", "dataField": "sservername", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "50", "mandatory": true, "controlType": "textbox", "idsName": "IDS_DOMAINNAME", "dataField": "sdomainname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "50", "mandatory": false, "controlType": "textbox", "idsName": "IDS_ORGANISATIONUNIT", "dataField": "sorganisationunit", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "50", "mandatory": false, "controlType": "textbox", "idsName": "IDS_GROUPNAME", "dataField": "sgroupname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "50", "mandatory": true, "controlType": "textbox", "idsName": "IDS_ACCOUNTID", "dataField": "suserid", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "50", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PASSWORD", "dataField": "spassword", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "formInputType": "password", "dataGridColumnHide": true, "isClearField": true },
  { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdisplaystatus", "width": "200px", "controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 6, "isClearField": true }
  ]);
  screenMap.set("SamplePlantMapping",
    [{ "fieldLength": "NA", "dataField": "nsampleplantmappingcode", "mandatory": false, "controlType": "NA" },
    { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_SITE", "dataField": "ssitename", "tableDataField": "nmappingsitecode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "sampleplantmapping", "methodUrl": "getSite", "onChangeUrl": "getSiteBasedPlant", "foreignDataField": "nmappingsitecode", "childPrimaryField": "nplantcode", "childdataField": "splantshortdesc", "objectValue": null, "childObjectValue": null },
    { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_PLANT", "dataField": "splantshortdesc", "foreignDisplayMember": "splantshortdesc", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "sampleplantmapping", "methodUrl": "getSiteBasedPlant", "objectValue": null, "tableDataField": "nplantcode", "foreignDataField": "nplantcode", "parentPrimaryField": "nmappingsitecode", "childObjectValue": null },
    { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_SAMPLETYPECATEGORY", "dataField": "sproductcatname", "tableDataField": "nproductcatcode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "sampleplantmapping", "methodUrl": "getProductCategory", "onChangeUrl": "getProduct", "foreignDataField": "nproductcatcode", "childPrimaryField": "nproductcode", "childdataField": "sproductname", "objectValue": null, "childObjectValue": null },
    { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_PRODUCT", "dataField": "sproductname", "foreignDisplayMember": "sproductname", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "sampleplantmapping", "methodUrl": "getProduct", "objectValue": null, "tableDataField": "nproductcode", "foreignDataField": "nproductcode", "parentPrimaryField": "nproductcatcode" },
    { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_LAB", "dataField": "slabname", "tableDataField": "nlabcode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "lab", "methodUrl": "getLab", "foreignDataField": "nlabcode", "objectValue": null, "childObjectValue": null },
    { "mandatory": false, "controlType": "selectbox", "idsName": "IDS_COMPONENTTYPE", "dataField": "scomponenttypename", "tableDataField": "ncomponenttypecode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "sampleplantmapping", "methodUrl": "getComponentType", "foreignDataField": "ncomponenttypecode", "objectValue": null, "childObjectValue": null, "hideNARecord": "ncomponenttypecode" },
    { "mandatory": false, "controlType": "selectbox", "idsName": "IDS_SAMPLEGROUPNAME", "dataField": "ssamplegroupname", "tableDataField": "nsamplegroupcode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "samplegroup", "methodUrl": "getSampleGroup", "foreignDataField": "nsamplegroupcode", "objectValue": null, "childObjectValue": null, "hideNARecord": "nsamplegroupcode" },
    { "mandatory": false, "controlType": "selectbox", "idsName": "IDS_SAMPLESTATE", "dataField": "ssamplestate", "tableDataField": "nsamplestatecode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "sampleplantmapping", "methodUrl": "getSampleState", "foreignDataField": "nsamplestatecode", "objectValue": null, "childObjectValue": null, "hideNARecord": "nsamplestatecode" },
    { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_UNIT", "dataField": "sunitname", "tableDataField": "nunitcode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "unit", "methodUrl": "getUnit", "foreignDataField": "nunitcode", "objectValue": null, "childObjectValue": null },
    { "mandatory": false, "controlType": "selectbox", "idsName": "IDS_CALCULATIONTYPE", "dataField": "scalculationtype", "tableDataField": "ncalculationtypecode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "sampleplantmapping", "methodUrl": "getCalculationType", "foreignDataField": "ncalculationtypecode", "objectValue": null, "childObjectValue": null, "hideNARecord": "ncalculationtypecode" },
    { "fieldLength": "10", "mandatory": false, "controlType": "numericinput", "idsName": "IDS_URANIUMCONVERSIONFACTOR", "dataField": "suraniumconversionfactor", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 5, "precision": 5 },
    { "mandatory": false, "controlType": "selectbox", "idsName": "IDS_URANIUMCONTENTTYPE", "dataField": "suraniumcontenttype", "tableDataField": "nuraniumcontenttypecode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "sampleplantmapping", "methodUrl": "getUraniumContentType", "foreignDataField": "nuraniumcontenttypecode", "objectValue": null, "childObjectValue": null, "hideNARecord": "nuraniumcontenttypecode" },
    { "mandatory": false, "controlType": "selectbox", "idsName": "IDS_REPORTTYPE", "dataField": "scoareporttypename", "tableDataField": "ncoareporttypecode", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 3, "classUrl": "sampleplantmapping", "methodUrl": "getCOAReportType", "foreignDataField": "ncoareporttypecode", "objectValue": null, "childObjectValue": null, "hideNARecord": "ncoareporttypecode" },
    { "fieldLength": "100", "mandatory": false, "controlType": "textbox", "idsName": "IDS_REPORTRECIPIENTMAILID", "dataField": "sreportrecipientmailid", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isEmail": true, "noteNeed": true, "noteText": "IDS_COMMABETWEENEMAILID", "isClearField": true },
    { "fieldLength": "100", "mandatory": false, "controlType": "textbox", "idsName": "IDS_REPORTCCRECIPIENTMAILID", "dataField": "sreportccrecipientmailid", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isEmail": true, "noteNeed": true, "noteText": "IDS_COMMABETWEENEMAILID", "isClearField": true }

    ]);
  screenMap.set("TestCategory", [{ "fieldLength": "NA", "dataField": "ntestcategorycode", "mandatory": false, "controlType": "NA" },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_TESTCATEGORY", "dataField": "stestcategoryname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true },
  { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_NEEDAGEBASEDSPEC", "dataField": "sclinicalstatus", "width": "200px", "controlName": "nclinicaltyperequired", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 6, "defaultvalue": props && props.settings['49'] === '3' ? true : false },
  { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdisplaystatus", "width": "200px", "controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 6, "isClearField": true, "preSetValue": 4 }
  ]);

  screenMap.set("FusionPlantUser", [
    { "fieldLength": "10", "mandatory": false, "controlType": "textbox", "idsName": "IDS_ECNO", "dataField": "necno", "jsonObjectName": "jsondata", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
    { "fieldLength": "100", "idsName": "IDS_USERNAME", "dataField": "susername" },
    { "fieldLength": "5", "mandatory": false, "controlType": "textbox", "idsName": "IDS_PLANTCODE", "dataField": "nplantcode", "jsonObjectName": "jsondata", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
    { "fieldLength": "5", "idsName": "IDS_PLANT", "dataField": "splantshortdesc" },

  ]);
  screenMap.set("EBCFactor",
    [{ "fieldLength": "NA", "dataField": "nebcfactorcode", "mandatory": false, "controlType": "NA" },
    { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_TESTNAME", "dataField": "stestname", "tableDataField": "ntestcode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "ebcfactor", "methodUrl": "getTest", "onChangeUrl": "getTestParameter", "foreignDataField": "ntestcode", "childPrimaryField": "ntestparametercode", "childdataField": "stestparametername", "objectValue": null, "childObjectValue": null },
    { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_PARAMETERNAME", "dataField": "stestparametername", "foreignDisplayMember": "stestparametername", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "ebcfactor", "methodUrl": "getTestParameter", "objectValue": null, "tableDataField": "ntestparametercode", "foreignDataField": "ntestparametercode", "parentPrimaryField": "ntestcode", "hideNARecord": "ntestparametercode" },
    { "fieldLength": "10", "mandatory": true, "controlType": "numericinput", "idsName": "IDS_EBCFACTOR", "dataField": "nfactorvalue", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 5, "precision": 5 },

    ]);

  screenMap.set("MaterialAccountingPlantGroup", [
    { "fieldLength": "NA", "dataField": "nmaterialaccountingplantgroupcode", "mandatory": false, "controlType": "NA" },

    {
      "mandatory": true, "controlType": "selectbox", "idsName": "IDS_MATERIALGROUPNAME", "dataField": "smaterialaccountinggroupname",
      "tableDataField": "nmaterialaccountinggroupcode", "width": "200px", "mandatoryLabel": "IDS_SELECT",
      "ndesigncomponentcode": 3, "classUrl": "materialaccountinplantggroup",
      "methodUrl": "materialAccountingPlantGroupName",
      "onChangeUrl": "getSite",
      "foreignDataField": "nmaterialaccountinggroupcode",
      "childPrimaryField": "nmaterialaccountinggroupcode",
      "childdataField": "nmaterialaccountinggroupcode", "objectValue": null,
      "childObjectValue": null
    },

    {
      "mandatory": true, "controlType": "selectbox", "idsName": "IDS_SITE",
      "dataField": "sdisplaylabel", "tableDataField": "nfusionSiteCode",
      "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3,
      "classUrl": "materialaccountinplantggroup", "methodUrl": "getSite", "onChangeUrl": "getPlantGroupDepartment",
      "foreignDataField": "nfusionSiteCode", "childPrimaryField": "nplantcode",
      "childdataField": "splantshortdesc", "objectValue": null,
      "childObjectValue": null
    },  //[nfusionSiteCode,nmaterialaccountinggroupcode]

    {
      "mandatory": true, "controlType": "multiselect", "idsName": "IDS_PLANT",
      "dataField": "splantshortdesc", "width": "200px", "mandatoryLabel": "IDS_SELECT",
      "foreignDisplayMember": "splantshortdesc", "ndesigncomponentcode": 8, "classUrl": "materialaccountinplantggroup", "methodUrl": "getPlantGroupDepartment",
      "foreignDataField": "nplantcode", "tableDataField": "nplantcode", "objectValue": null,
      "parentPrimaryField": "nfusionSiteCode", "valueKey": "plantKey", "valueName": "plantName"
    },

  ]);
  screenMap.set("MaterialAccountingUnit", [
    { "fieldLength": "NA", "dataField": "nmaterialaccountingunitcode", "mandatory": false, "controlType": "NA" },

    {
      "mandatory": true, "controlType": "selectbox", "idsName": "IDS_SAMPLESTATE", "dataField": "ssamplestate",
      "tableDataField": "nsamplestatecode", "width": "200px", "mandatoryLabel": "IDS_SELECT",
      "ndesigncomponentcode": 3, "classUrl": "materialaccountingunit",
      "methodUrl": "getSampleState",
      "onChangeUrl": "getBasicUnit",
      "foreignDataField": "nsamplestatecode",
      "childPrimaryField": "nsamplestatecode",
      "childdataField": "nsamplestatecode", "objectValue": null,
      "childObjectValue": null
    },

    {
      "mandatory": true, "controlType": "selectbox", "idsName": "IDS_BASICUOM",//IDS_BASICUOM
      "dataField": "sbasicunitname", "tableDataField": "nbasicunit",
      "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3,
      "classUrl": "materialaccountingunit", "methodUrl": "getBasicUnit", "onChangeUrl": "getUnitConversion",
      "foreignDataField": "nbasicunit", "childPrimaryField": "nconversionunit",
      "childdataField": "sconversionunit", "objectValue": null,
      "childObjectValue": null
    },

    {
      "mandatory": true, "controlType": "selectbox", "idsName": "IDS_CONVERSIONUNIT",
      "dataField": "sconversionunit", "tableDataField": "nconversionunit",
      "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "foreignDisplayMember": "sconversionunit",
      "classUrl": "materialaccountingunit", "methodUrl": "getUnitConversion", "onChangeUrl": "getConversionOperatorAndFactor",
      "foreignDataField": "nconversionunit", "objectValue": null, "childdataField": "soperator", "childPrimaryField": "nconversionunit",
      "childObjectValue": null, "parentPrimaryField": "nbasicunit"
    },

    { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true },

  ]);
  screenMap.set("ProcessType", [{ "fieldLength": "NA", "dataField": "nprocesstypecode", "mandatory": false, "controlType": "NA" },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PROCESSTYPENAME", "dataField": "sprocesstypename", "jsonObjectName": "jsondata", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "jsonObjectName": "jsondata", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true }

  ]);

  screenMap.set("Purge", [{ "fieldLength": "NA", "dataField": "npurgemastercode", "mandatory": false, "controlType": "NA" },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_SITENAME", "dataField": "ssitename", "tableDataField": "npurgesitecode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "purge", "methodUrl": "getSite", "onChangeUrl": null, "foreignDataField": "npurgesitecode", "childPrimaryField": null, "childdataField": null, "objectValue": null, "childObjectValue": null },
  { "fieldLength": "NA", "mandatory": true, "controlType": "datepicker", "idsName": "IDS_PURGEDATETILL", "dataField": "stodate", "dateField": "stodate", "width": "200px", "controlName": "dtodate", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 4, "showtime": false },
  { "fieldLength": "255", "mandatory": true, "controlType": "textarea", "idsName": "IDS_REMARKS", "dataField": "sdescription", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true },
  { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_TRANSACTIONSTATUS", "dataField": "stransactionstatus", "width": "200px", "controlName": "ntransactionstatus", "mandatoryLabel": "IDS_SELECT" },
  { "fieldLength": "50", "mandatory": false, "controlType": "textarea", "idsName": "IDS_PURGECREATEDATE", "dataField": "smodifieddate", "width": "200px", "mandatoryLabel": "IDS_ENTER" },
  { "fieldLength": "50", "mandatory": false, "controlType": "textarea", "idsName": "IDS_CREATEDBY", "dataField": "smodifiedby", "width": "200px", "mandatoryLabel": "IDS_ENTER" }
  ]);

  screenMap.set("RestoreMaster",
    [{ "fieldLength": "NA", "dataField": "nrestoremastercode", "mandatory": false, "controlType": "NA" },
    { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_SITENAME", "dataField": "ssitename", "tableDataField": "nrestoresitecode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "restoremaster", "methodUrl": "getSite", "onChangeUrl": "getPurgeDate", "foreignDataField": "nrestoresitecode", "childPrimaryField": "npurgemastercode", "childdataField": "stodate", "objectValue": null, "childObjectValue": null },
    { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_PURGEDATE", "dataField": "stodate", "foreignDisplayMember": "stodate", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "restoremaster", "methodUrl": "getPurgeDate", "objectValue": null, "tableDataField": "npurgemastercode", "foreignDataField": "npurgemastercode", "parentPrimaryField": "nrestoresitecode", "hideNARecord": "npurgemastercode" },
    { "fieldLength": "255", "mandatory": true, "controlType": "textarea", "idsName": "IDS_REMARKS", "dataField": "sdescription", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true },
    { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_TRANSACTIONSTATUS", "dataField": "stransactionstatus", "width": "200px", "controlName": "ntransactionstatus", "mandatoryLabel": "IDS_SELECT" },
    { "fieldLength": "50", "mandatory": false, "controlType": "textarea", "idsName": "IDS_PURGECREATEDATE", "dataField": "smodifieddate", "width": "200px", "mandatoryLabel": "IDS_ENTER" },
    { "fieldLength": "50", "mandatory": false, "controlType": "textarea", "idsName": "IDS_CREATEDBY", "dataField": "smodifiedby", "width": "200px", "mandatoryLabel": "IDS_ENTER" }
      //{ "fieldLength": "NA", "mandatory": false, "controlType": "textarea", "idsName": "IDS_PURGEMASTERCODE", "dataField": "npurgemastercode", "width": "400px", "mandatoryLabel": "IDS_ENTER" }
    ]);
  //Added by sonia for jira id:ALPD-5348
  screenMap.set("SamplingPointCategory", [{ "fieldLength": "NA", "dataField": "nsamplingpointcatcode", "mandatory": false, "controlType": "NA" },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_SAMPLINGPOINTCATEGORY", "dataField": "ssamplingpointcatname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true },
  { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdisplaystatus", "width": "200px", "controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 6, "preSetValue": 4, "isClearField": true }
  ]);

  //Added by sonia for jira id:ALPD-5348
  screenMap.set("SamplingPoint", [
    { "fieldLength": "NA", "dataField": "nsamplingpointcode", "mandatory": false, "controlType": "NA" },
    { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_SAMPLINGPOINTCATEGORY", "dataField": "ssamplingpointcatname", "tableDataField": "nsamplingpointcatcode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "samplingpoint", "methodUrl": "getSamplingPointCategory", "foreignDataField": "nsamplingpointcatcode", "objectValue": null, "tablecolumnname": "nsamplingpointcatcode" },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_SAMPLINGPOINT", "dataField": "ssamplingpointname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
    { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true },
    { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "sdisplaystatus", "width": "200px", "controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 6, "preSetValue": 4, "isClearField": true }

  ]);

  //Added by Sujatha for jira id: BGSI-1
  screenMap.set("DiseaseCategory", [
    { "fieldLength": "NA", "dataField": "ndiseasecategorycode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_DISEASECATEGORYNAME", "dataField": "sdiseasecategoryname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
    { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true }
  ]);

  //Disease
  //Mullai Balaji
  //BGSI-2
  //26/06/2025 
  screenMap.set("Disease", [{ "fieldLength": "NA", "dataField": "ndiseasecode", "mandatory": false, "controlType": "NA" },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_DISEASECATEGORYNAME", "dataField": "sdiseasecategoryname", "tableDataField": "ndiseasecategorycode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "diseasecategory", "methodUrl": "getDiseaseCategory", "foreignDataField": "ndiseasecategorycode", "objectValue": null },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_DISEASENAME", "dataField": "sdiseasename", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true },
  ]);


  //Added by Mullai Balaji for jira:BGSI-7                                              
  screenMap.set("ProjectAndSiteHierarchyMapping", [{ "fieldLength": "NA", "dataField": "nprojectsitehierarchymapcode", "mandatory": false, "controlType": "NA" },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_BIOPROJECTTITLE", "dataField": "sprojecttitle", "tableDataField": "nbioprojectcode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "projectandsitehierarchymapping", "methodUrl": "getBioproject", "foreignDataField": "nbioprojectcode", "objectValue": null },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_SITEHIERARCHYCONFIGURATIONNAME", "dataField": "sconfigname", "tableDataField": "nsitehierarchyconfigcode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "projectandsitehierarchymapping", "methodUrl": "getSitemap", "foreignDataField": "nsitehierarchyconfigcode", "objectValue": null },
  ]);


  //Mullai Balaji Hospital for jira id:BGSI-4
  screenMap.set("Hospital", [
    { "fieldLength": "NA", "dataField": "nhospitalcode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_HOSPITALNAME", "dataField": "shospitalname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
    // { "fieldLength": "2", "mandatory": true, "controlType": "textbox", "idsName": "IDS_HOSPITALCODE", "dataField": "shospitalcode", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true,"isaplhabet":true},
    { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true }
  ])
  screenMap.set("BioProject", [{ "fieldLength": "NA", "dataField": "nbioprojectcode", "mandatory": false, "controlType": "NA" },


  // { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_DISEASECATEGORYNAME", "dataField": "sdiseasecategoryname", "tableDataField": "ndiseasecategorycode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "diseasecategory", "methodUrl": "getDiseaseCategory", "foreignDataField": "ndiseasecategorycode", "objectValue": null },
  //{ "mandatory": true, "controlType": "selectbox", "idsName": "IDS_DISEASENAME", "dataField": "sdiseasename", "tableDataField": "ndiseasecode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "bioproject", "methodUrl": "getDiseaseByCatgory", "foreignDataField": "ndiseasecode", "objectValue": null },
  {
    "mandatory": true, "controlType": "selectbox", "idsName": "IDS_DISEASECATEGORYNAME",
    "dataField": "sdiseasecategoryname", "tableDataField": "ndiseasecategorycode",
    "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3,
    "classUrl": "bioproject", "methodUrl": "getDiseaseCategory", "onChangeUrl": "getDiseaseByCategory",
    "foreignDataField": "ndiseasecategorycode", "childPrimaryField": "ndiseasecode",
    "childdataField": "sdiseasename", "objectValue": null,
    "childObjectValue": null
  },

  {
    "mandatory": true, "controlType": "selectbox", "idsName": "IDS_DISEASENAME",
    "dataField": "sdiseasename", "width": "200px", "mandatoryLabel": "IDS_SELECT",
    "foreignDisplayMember": "sdiseasename", "ndesigncomponentcode": 3, "classUrl": "bioproject", "methodUrl": "getDiseaseByCategory",
    "foreignDataField": "ndiseasecode", "tableDataField": "ndiseasecode", "objectValue": null, "parentPrimaryField": "ndiseasecategorycode"
  },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_BIOPROJECTTITLENAME", "dataField": "sprojecttitle", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
  // BGSI-77  Modified length from 2 to 8 by Vishakh (19/09/2025)
  { "fieldLength": "8", "mandatory": true, "controlType": "textbox", "idsName": "IDS_BIOPROJECTCODE", "dataField": "sprojectcode", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true, "isaplhabet": true },
  { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_INVESTIGATORNAME", "dataField": "suserName", "tableDataField": "nusercode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "bioproject", "methodUrl": "getUsers", "foreignDataField": "nusercode", "objectValue": null },

  ]);
  //Added By Sujatha for BGSI-5 on 02/07/2025
  screenMap.set("SiteType", [
    { "fieldLength": "NA", "dataField": "nsitetypecode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_SITETYPENAME", "dataField": "ssitetypename", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
    { "fieldLength": "2", "min": 1, "max": 99, "mandatory": true, "controlType": "numericinput", "idsName": "IDS_HIERARCHICALORDERNO", "dataField": "nhierarchicalorderno", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 5, "isClearField": true },
    { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true }
  ]);

  screenMap.set("SampleCodeCreation", [{ "fieldLength": "NA", "dataField": "nproductcodemappingcode", "mandatory": false, "controlType": "NA" },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_SAMPLETYPE", "dataField": "sproductname", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "samplecodecreation", "methodUrl": "getProduct", "foreignDataField": "nproductcode", "tableDataField": "nproductcode", "objectValue": null},
  { "fieldLength": "2", "mandatory": true, "controlType": "textbox", "idsName": "IDS_CODE", "dataField": "sproductcode", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true }
  ]);

  screenMap.set("ContainerType", [{ "fieldLength": "NA", "dataField": "ncontainertypecode", "mandatory": false, "controlType": "NA" },
    // added isClearField: true by sujatha ATE_274 ALPDJ21-59
  { "mandatory": true, "controlType": "textarea", "idsName": "IDS_CONTAINERTYPE", "dataField": "scontainertype", "tableDataField": "scontainertype", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode":2, "isClearField": true },
  { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true },
  { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_SAMPLECONTAINER", "dataField": "stransdisplaystatus", "width": "200px", "controlName": "nsamplecontainer", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 6, "preSetValue": 4, "isClearField": true }

  ]);

 //Added by Sujatha for swsm-1 on 19/07/2025
      screenMap.set("AuditStandardCategory",[
        { "fieldLength":"NA", "dataField":"nauditstandardcatcode","mandatory":false, "controlType": "NA"},
        { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_AUDITSTANDARDCATEGORYNAME", "dataField": "sauditstandardcatname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true},
        { "fieldLength": "2","min": 1, "max": 99, "mandatory": true, "controlType": "numericinput", "idsName": "IDS_AUDITREMAINDERDAYS", "dataField": "sauditremainderdays", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 5, "isClearField": true}, //Added By Sonia for SWSM-12 on 02/09/2025
        { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true}
      ]);
      //Added by Sujatha for SWSM-3 on 19/07/2025
      screenMap.set("AuditCategory",[
        { "fieldLength":"NA", "dataField":"nauditcategorycode","mandatory":false, "controlType": "NA"},
        { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_AUDITCATEGORY", "dataField": "sauditcategoryname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true},
        { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true}
      ]);
      //Added by Sujatha for SWSM-4 on 22/07/2025
      screenMap.set("Village", 
        [
        { "fieldLength": "NA", "dataField": "nvillagecode", "mandatory": false, "controlType": "NA" },
        { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_TALUKA", "dataField": "siteconfigname", 
          "tableDataField": "nnodesitecode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, 
          "classUrl": "village", "methodUrl": "getTaluka", "foreignDataField": "nnodesitecode", "objectValue": null },
        { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_VILLAGE", "dataField": "svillagename", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
        // modified by sujatha ATE_274 length from 5 to 15 SWSM-4 17-09-2025
        { "fieldLength": "15", "mandatory": true, "controlType": "textarea", "idsName": "IDS_VILLAGECODE", "dataField": "svillagecode", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true },
      ]);
      //modified  by Sujatha ATE_274 17-09-2025 from change using type3component to a separate grid master
      //Added by Sujatha for SWSM-5 on 26/07/2025 --> Added 2 fields in fieldspecification(clearAllChildField, clearFields), 
          //  in order to clear all child fields the below code is used
      // screenMap.set("SampleLocation", 
      //   [{ "fieldLength": "NA", "dataField": "nsamplelocationcode", "mandatory": false, "controlType": "NA" },
      //   {
      //    "mandatory": true, "controlType": "selectbox", "idsName": "IDS_REGION",
      //    "dataField": "sregionname", "tableDataField": "nregioncode",
      //    "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3,
      //    "classUrl": "samplelocation", "methodUrl": "getRegion", "onChangeUrl": "getDistrict",
      //    "foreignDataField": "nregioncode", "childPrimaryField": "ndistrictcode","clearAllChildField":true,
      //    "clearFields":["sdistrictname","scityname","svillagename"],"childdataField": "sdistrictname", "objectValue": null,
      //    "childObjectValue": null
      //   },
      //   {
      //    "mandatory": true, "controlType": "selectbox", "idsName": "IDS_DISTRICT",
      //    "dataField": "sdistrictname", "width": "200px", "mandatoryLabel": "IDS_SELECT",
      //    "foreignDisplayMember": "sdistrictname", "ndesigncomponentcode": 3, "classUrl": "samplelocation", 
      //    "methodUrl": "getDistrict", "onChangeUrl": "getCity","foreignDataField": "ndistrictcode", "clearAllChildField":true,
      //    "clearFields":["scityname","svillagename"],"childPrimaryField": "ncitycode","childdataField": "scityname","childObjectValue": null,
      //    "tableDataField": "ndistrictcode", "objectValue": null, "parentPrimaryField": "nregioncode"
      //   },
      //   {
      //    "mandatory": true, "controlType": "selectbox", "idsName": "IDS_CITY",
      //    "dataField": "scityname", "width": "200px", "mandatoryLabel": "IDS_SELECT",
      //    "foreignDisplayMember": "scityname", "ndesigncomponentcode": 3, "classUrl": "samplelocation", 
      //    "methodUrl": "getCity",  "onChangeUrl": "getVillage", "foreignDataField": "ncitycode", "clearAllChildField":true,
      //    "clearFields":["svillagename"],"childPrimaryField": "nvillagecode","childdataField": "svillagename","childObjectValue": null,
      //    "tableDataField": "ncitycode", "objectValue": null, "parentPrimaryField": "ndistrictcode"
      //   },
      //   {
      //    "mandatory": true, "controlType": "selectbox", "idsName": "IDS_VILLAGE",
      //    "dataField": "svillagename", "width": "200px", "mandatoryLabel": "IDS_SELECT",
      //    "foreignDisplayMember": "svillagename", "ndesigncomponentcode": 3, "classUrl": "samplelocation", 
      //    "methodUrl": "getVillage","foreignDataField": "nvillagecode", "clearAllChildField":false,
      //    "tableDataField": "nvillagecode", "objectValue": null, "parentPrimaryField": "ncitycode"
      //   },

      //   { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_SAMPLELOCATION", "dataField": "ssamplelocationname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true },
      //   //modified by Sujatha for SWSM-5 on 05/08/2025 from textarea to textbox ,  fieldlength from 100 to 10, ndesigncomponentcode from 2 to 1
      //   { "fieldLength": "10", "mandatory": false, "controlType": "textbox", "idsName": "IDS_LATITUDE", "dataField": "slatitude", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true},
      //   //modified by Sujatha for SWSM-5 on 05/08/2025 from textarea to textbox & fieldlength from 100 to 10,  ndesigncomponentcode from 2 to 1
      //   { "fieldLength": "10", "mandatory": false, "controlType": "textbox", "idsName": "IDS_LONGITUDE", "dataField": "slongitude", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true},
      //   { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true},
      // ]);
            //Added by Sujatha for SWSM-8 on 01/08/2025
      screenMap.set("ManPower", [
        //modified by sujatha to show ID in grid
        //modified semail fieldLength by MullaiBalaji jira swsm-105 
        { "fieldLength": "NA","mandatory": false, "idsName": "IDS_ID", "dataField": "noutsourceempcode", "width": "200px", "mandatoryLabel": "NA" },
        { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_SITE", "dataField": "ssitename", "tableDataField": "nsitemastercode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "manpower", "methodUrl": "getSite", "foreignDataField": "nsitecode", "objectValue": null },
        { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_FIRSTNAME", "dataField": "sfirstname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1 ,"isClearField":true},
        { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_LASTNAME", "dataField": "slastname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1,"isClearField":true },
        { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_DESIGNATION", "dataField": "sdesignation", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1 ,"isClearField":true},
        { "fieldLength": "NA", "mandatory": false, "controlType": "datepicker", "idsName": "IDS_DATEOFBIRTH", "dataField": "sdateofbirth", "dateField": "ddateofbirth", "width": "200px", "controlName": "ddateofbirth", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 4, "showtime": false, "isClearField":true},
        { "fieldLength": "NA", "mandatory": false, "controlType": "datepicker", "idsName": "IDS_DATEOFJOIN", "dataField": "sdateofjoin", "dateField": "ddateofjoin", "width": "200px", "controlName": "ddateofjoin", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 4,"showtime":false, "isClearField":true},
        { "fieldLength": "20", "mandatory": true, "controlType": "textbox", "idsName": "IDS_MOBILENO", "dataField": "smobileno", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1 ,"isClearField":true, "noAlphabets":true},
        { "fieldLength": "50", "mandatory": true, "controlType": "textbox", "idsName": "IDS_EMAIL", "dataField": "semail", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1 , "isEmail": true, "isClearField":true},
        { "fieldLength": "250", "mandatory": true, "controlType": "textarea", "idsName": "IDS_ADDRESS", "dataField": "saddress", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true},
      ]);
	//Added By Sonia for SWSM-2 on 21/07/2025
      screenMap.set("AuditMaster",[
        { "fieldLength":"NA", "dataField":"nauditmastercode","mandatory":false, "controlType": "NA"},
        { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_AUDITORNAME", "dataField": "sauditorname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true},
        { "fieldLength": "50", "mandatory": true, "controlType": "textbox", "idsName": "IDS_DEPARTMENT", "dataField": "sdepartment", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true},
        { "fieldLength": "50", "mandatory": true, "controlType": "textbox", "idsName": "IDS_EMAIL", "dataField": "semail", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true,  "isEmail": true},
        { "fieldLength": "20", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PHONENO", "dataField": "sphoneno", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1, "isClearField": true,"noAlphabets":true },
        { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_LEADAUDITOR", "dataField": "sleadauditor", "width": "200px", "controlName": "nleadauditor", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 6 ,"preSetValue":4,"isClearField":true},
        { "fieldLength": "250", "mandatory": false, "controlType": "textarea", "idsName": "IDS_SKILLDETAILS", "dataField": "sskilldetails", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true}
      ]);

  screenMap.set("SupplierCategory", [{ "fieldLength": "NA", "dataField": "nsuppliercatcode", "mandatory": false, "controlType": "NA" },
  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_SUPPLIERTYPE", "dataField": "ssuppliertypename", "foreignDisplayMember": "ssuppliertypename", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "suppliercategory", "methodUrl": "getSupplierType", "objectValue": null, "tableDataField": "nsuppliertypecode", "foreignDataField": "nsuppliertypecode", "parentPrimaryField": "nsuppliercategorycode", "hideNARecord": "nsuppliertypecode" },
  //  { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_SITENAME", "dataField": "ssitename", "tableDataField": "nrestoresitecode", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "restoremaster", "methodUrl": "getSite", "onChangeUrl": "getPurgeDate", "foreignDataField": "nrestoresitecode", "childPrimaryField": "npurgemastercode", "childdataField": "stodate", "objectValue": null, "childObjectValue": null },
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_SUPPLIERCATEGORY", "dataField": "ssuppliercatname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2 },
  { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2 }
  ]);
 //added by sujatha v ATE_274 for SWSM-14 on 31/08/2025
  screenMap.set("SiteSampleExpiryMapping", [
        { "fieldLength": "NA","mandatory": false, "dataField": "nsiteexpirymappingcode", "mandatoryLabel": "NA", "controlType": "NA" },
        { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_SITE","dataField": "ssitename", "tableDataField": "nsitemastercode", "width": "200px", 
          "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "siteexpirymapping", "methodUrl": "getSite", "foreignDataField": "nsitecode", "objectValue": null },
        { "fieldLength": "3", "mandatory": true, "controlType": "textbox", "idsName": "IDS_EXPIRYDAYS", "dataField": "sexpirydays", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1 ,"isClearField":true, "noAlphabets":true,},
        { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_PERIOD", "dataField": "speriodname", "tableDataField": "nperiodcode", "width": "200px", "mandatoryLabel": "IDS_SELECT",
           "ndesigncomponentcode": 3, "classUrl": "siteexpirymapping", "methodUrl": "getPeriod", "foreignDataField": "nperiodcode", "objectValue": null,"defaultValueRequired":true, "isDisabled": true},
        { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField":true }
      ]);
      
      
   //INVOICE MODULE - 20-SEP-2025
  //Added By DhivyaBharathi for SWSM-2 on 15/08/2025
        screenMap.set("InvoiceCurrencyType", [{ "fieldLength": "NA", "dataField": "ncurrencycode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "50", "mandatory": true, "controlType": "textbox", "idsName": "IDS_CURRENCY", "dataField": "scurrency", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1 },
    { "fieldLength": "5", "mandatory": true, "controlType": "textbox", "idsName": "IDS_SYMBOL", "dataField": "ssymbol", "width": "100px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1 },
    { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_ACTIVE", "dataField": "sdisplaystatus", "width": "100px", "controlName": "nactive", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 6 }
 
    ]);
    //Added By DhivyaBharathi for SWSM-2 on 18/08/2025
    screenMap.set("InvoicePaymentMode", [
      { "fieldLength": "NA", "dataField": "npaymentcode", "mandatory": false, "controlType": "NA" },
      { "fieldLength": "50", "mandatory": true, "controlType": "textbox", "idsName": "IDS_PAYMENTMODE", "dataField": "spaymentmode", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1 },
 
    ]);
    //Added By DhivyaBharathi for SWSM-2 on 18/08/2025
    screenMap.set("BankDetails", [
      { "fieldLength": "NA", "dataField": "nbankcode", "mandatory": false, "controlType": "NA" },
      { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_BANKACCOUNTNAME", "dataField": "sbankname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1 },
      { "fieldLength": "50", "mandatory": true, "controlType": "numericinput", "idsName": "IDS_ACCOUNTNO", "dataField": "saccountno", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 5 },
      { "fieldLength": "30", "mandatory": true, "controlType": "textbox", "idsName": "IDS_BANKIFSCCODE", "dataField": "sifsccode", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1 },
      { "fieldLength": "200", "mandatory": false, "controlType": "textarea", "idsName": "IDS_BANKADDRESS", "dataField": "saddress", "width": "300px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2 },
      { "fieldLength": "200", "mandatory": false, "controlType": "textarea", "idsName": "IDS_BANKOTHERDETAILS", "dataField": "sotherdetails", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2 },
      { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_ACTIVE", "dataField": "sdisplaystatus", "width": "100px", "controlName": "nactive", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 6 }
  
    ]);
   //Added By Gayathri for SWSM-2 on 18/08/2025
     screenMap.set("InvoiceProductType", [{ "fieldLength": "NA", "dataField": "ntypecode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "50", "mandatory": true, "controlType": "textbox", "idsName": "IDS_TYPENAME", "dataField": "stypename", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1 },
    { "fieldLength": "450", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2 },
    { "fieldLength": "NA", "mandatory": false, "controlType": "checkbox", "idsName": "IDS_ACTIVE", "dataField": "sdisplaystatus", "width": "100px", "controlName": "nactive", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 6 }
    ]);
     //Added By Gayathri for SWSM-2 on 18/08/2025
     screenMap.set("InvoiceTaxtype", [{ "fieldLength": "NA", "dataField": "ntaxcode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "50", "mandatory": true, "controlType": "textbox", "idsName": "IDS_TAXNAME", "dataField": "staxname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1 },
    { "fieldLength": "5", "mandatory": true, "controlType": "numericinput", "idsName": "IDS_TAX", "dataField": "ntax", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 5, "precision": 2 },
    { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_INVERSIONNO", "dataField": "sversionno", "foreignDisplayMember": "sversionno", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "invoicetaxtype", "foreignDataField": "nversionnocode", "methodUrl": "getVersionno", "tableDataField": "nversionnocode", "objectValue": "invoiceversionnoList" },
    { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_TAXCALTYPE", "dataField": "staxcaltype", "foreignDisplayMember": "staxcaltype", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "invoicetaxtype", "foreignDataField": "ncaltypecode", "methodUrl": "getTaxcaltype", "tableDataField": "ncaltypecode", "objectValue": "invoicetaxcaltypeList" },
    { "fieldLength": "NA", "mandatory": true, "controlType": "datetimepicker", "idsName": "IDS_INDATEFROM", "dataField": "sdatefrom","dateField": "ddatefrom",  "width": "200px", "controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 4,"showtime":false },
    { "fieldLength": "NA", "mandatory": false, "controlType": "datetimepicker", "idsName": "IDS_INDATETO", "dataField": "sdateto","dateField": "ddateto",  "width": "200px", "controlName": "ndefaultstatus","mandatoryLabel": "IDS_SELECT",  "ndesigncomponentcode": 4,"showtime":false },
    { "fieldLength": "200", "mandatory": false, "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2 },
    { "mandatory": true, "controlType": "selectbox", "idsName": "IDS_STATUS", "dataField": "stransstatus", "foreignDisplayMember": "stransstatus", "width": "200px", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 3, "classUrl": "invoicetaxtype","foreignDataField": "ntranscode", "methodUrl": "getStatus", "tableDataField": "ntranscode", "objectValue": "statusList" },
 
  ]);
  

  screenMap.set("BGSITransfer", [{ "fieldLength": "NA", "dataField": "ntransfercode", "mandatory": false, "controlType": "NA" },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_FORMNO", "dataField": "stransferformno", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1,  "isClearField": true },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_DESTINATIONSITENAME", "dataField": "destinationsitename", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1,  "isClearField": true },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_NONSITENAME", "dataField": "snonsitename", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1,  "isClearField": true },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_TECHNICIANNAME", "dataField": "stechnicianname", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1,  "isClearField": true },
    { "fieldLength": "NA", "mandatory": true, "controlType": "datepicker", "idsName": "IDS_TRANSFERDATE", "dataField": "stransferdetaildate", "dateField": "stransferdetaildate", "width": "200px", "controlName": "stransferdetaildate", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 4, "showtime": false },   
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_TRANSFERSTATUS", "dataField": "transferstatus", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1,  "isClearField": true },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_STATUS", "dataField": "status", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1,  "isClearField": true },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_TEMPERATURE", "dataField": "stemperature", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1,  "isClearField": true },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_SENDERNAME", "dataField": "ssendername", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1,  "isClearField": true },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_COURIERNAME", "dataField": "scouriername", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1,  "isClearField": true },
    { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_SITENAME", "dataField": "ssitename", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1,  "isClearField": true },
  //{ "fieldLength": "NA", "mandatory": true, "controlType": "datepicker", "idsName": "IDS_TRANSFERDATE", "dataField": "stransferdate", "dateField": "dtransferdate", "width": "200px", "controlName": "dtransferdate", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 4, "showtime": false },
  //{ "fieldLength": "NA", "mandatory": true, "controlType": "datepicker", "idsName": "IDS_ACTUALTRANSFERDATE", "dataField": "sactualtransferdate", "dateField": "dactualtransferdate", "width": "200px", "controlName": "dactualtransferdate", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 4, "showtime": false },
  
  { "fieldLength": "100", "mandatory": true, "controlType": "textbox", "idsName": "IDS_TRIPLEPACKAGING", "dataField": "striplepackaging", "width": "200px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 1,  "isClearField": true },
  { "fieldLength": "255", "mandatory": false, "controlType": "textarea", "idsName": "IDS_REMARKS", "dataField": "remarks", "width": "400px", "mandatoryLabel": "IDS_ENTER", "ndesigncomponentcode": 2, "isClearField": true },
  
  
  //{ "fieldLength": "NA", "mandatory": true, "controlType": "datepicker", "idsName": "IDS_CREATEDDATE", "dataField": "screateddate", "dateField": "dcreateddate", "width": "200px", "controlName": "dcreateddate", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 4, "showtime": false },
  //{ "fieldLength": "NA", "mandatory": true, "controlType": "datepicker", "idsName": "IDS_UPDATEDDATE", "dataField": "supdateddate", "dateField": "dupdateddate", "width": "200px", "controlName": "dupdateddate", "mandatoryLabel": "IDS_SELECT", "ndesigncomponentcode": 4, "showtime": false },
  
  

  
  ]);
  
  return screenMap;
}

