export const transactionStatus = {
    NA: -1,
    ALL: 0,
    ACTIVE: 1,
    DEACTIVE: 2,
    YES: 3,
    NO: 4,
    LOCK: 5,
    UNLOCK: 6,
    RETIRED: 7,
    DRAFT: 8,
    MANUAL: 9,
    SYSTEM: 10,
    RECEIVED: 14,
    GOODS_IN: 15,
    GOODS_RECEIVED: 16,
    PARTIAL: 36,
    APPROVED: 31,
    RECOMMENDRETEST: 27,
    RECOMMENDRECALC: 26,
    RETEST: 32,
    RECALC: 24,
    PASS: 50,
    FAIL: 51,
    WITHDRAWN: 47,
    CORRECTION: 48,
    LOGINTYPE_INTERNAL: 1,
    LOGINTYPE_ADS: 2,
    ACCREDITED: 62,
    NOTACCREDITED: 63,
    PARTIALAPPROVAL: 75,
    AUTOAPPROVAL: 74,
    AUTOCOMPLETE:73,
    SECTIONWISEAPPROVAL: 76,
    BLACKLIST: 79,
    PREREGISTER: 17,
    REGISTER: 18,
    QUARANTINE: 37,
    RELEASED: 33,
    CANCELLED: 35,
    ACCEPT: 22,
    REJECT: 34,
    COMPLETED: 25,
    REVIEWED: 29,
    CERTIFIED: 49,
    SENT: 70,
    NULLIFIED: 71,
    CERTIFICATECORRECTION: 75,
    START: 11,
    STOP: 13,
    AUTO: 44,
    ISSUE: 43,
    CALIBRATION: 56,
    VALIDATION: 54,
    MAINTENANCE: 58,
    UNDERCALIBIRATION:57,
    UNDERMAINTANENCE:59,
    UNDERVALIDATION:55,
    REQUESTED:118,
    CONDUCTED: 60,
    ATTENDED:61,
    EXPIRED:50,
    DISCARD: 80,
    CLOSED:81,
    SCHEDULED: 41,
    RESCHEDULED: 21,
    INVITED: 42,
    INITIATED:23,
    ALLOTTED:20,
    Disposed:91,
    Offsite:86,
    FAIL_43:43,
    FAILED: 89,
    CHECKED: 28,
    Retrieved:97,
    PRELIMINARYRELEASE:98,
    UNPROCESSED:112,
    PROCESSED: 113,
    ALIQUOTED: 114, 
    STORED: 115,
    REQUESTED:118,
    TOBERETURN: 121,
    MOVETODISPOSE: 119,
    MOVETORETURN: 120,    
	TOBEDISPOSE: 116,
	PLANNED:117,
	REQUESTED:118,
    AMENDED:122
}

export const operators = {
    CLOSEPARENTHESIS: 18,
    OPENPARENTHESIS: 20
}

export const attachmentType = {
    FTP: 1,
    LINK: 2,
    PRN: 3,
    OTHERS: 4
}

export const parameterType = {
    NUMERIC: 1,
    PREDEFINED: 2,
    CHARACTER: 3,
    ATTACHMENT: 4
}


/* commented by SYED 20-NOV-2023
export const grade = {
    PASS: 1,
    FIO: 4,
    2: 'OOT',
    3: 'OOS',
    4: 'FIO',
    5: 'BELOW',
    6: 'BQL',
    7: 'BDL',
    8: 'BLOQ',
    9: 'BLOD'
}*/

// modified by SYED 20-NOV-2023
export const ResultEntry = {
    RESULTSTATUS_PASS: 1,
    RESULTSTATUS_OOS: 3,
    RESULTSTATUS_OOT: 2,
    RESULTSTATUS_FIO: 4,
    RESULTSTATUS_BELOWDISREGARD: 5,
    RESULTSTATUS_HLOQ: 6,
    RESULTSTATUS_HLOD: 7,
    RESULTSTATUS_LLOQ: 8,
    RESULTSTATUS_LLOD: 9,
    RESULTSTATUS_HOOT: 10,
    RESULTSTATUS_HOOS: 11,
}
//Added by sonia on 8th OCT 2024 for jira id : ALPD-5024
export const ApprovalSubType = {
    TESTGROUPAPPROVAL: 1,
    TESTRESULTAPPROVAL: 2,
    BATCHAPPROVAL: 3,
    PRODUCTAPPROVAL: 4,
    PRODUCTMAHAPPROVAL: 5,
    PROTOCOLAPPROVAL: 6
}

export const RegistrationType = {
    ROUTINE: 6,
    INSTRUMENT: 4,
    MATERIAL: 5,
    BATCH: 1,
    NON_BATCH: 2,
    PLASMA_POOL: 3
}

export const RegistrationSubType = {
    PATIENT: 14,
    ROUTINE: 13,
    INSTRUMENT: 11,
    MATERIAL: 12,
    EU: 1,
    NON_EU: 2,
    WHO: 3,
    PRE_QUALIFICATION: 4,
    PROTOCOL: 5,
    PLASMA_POOL: 6,
    BULK: 7,
    CONTRACTTESTING: 8,
    CAPTESTING_AND_OTHERS: 9,
    EXTERNAL_POOL: 10

}
export const designProperties = {
    LABEL: 1,
    VALUE: 2,
    LISTITEM: 3,
    SINGLEITEMDATA: 4,
    GRIDITEM: 5,
    GRIDEXPANDABLEITEM: 6,
    LISTMOREITEM: 7,
    LISTMAINFIELD: 8,
    COLOUR: 9, 
    PRIMARYKEY:10,
    QUERYBUILDERTABLECODE:11,
    TABLENAME:12,
    COLUMNNAME:13,
    MULTILINGUAL:14,
    RECORDTYPE:15,
    COLUMNDETAILS:16
}
export const reportTypeEnum = {
    ALL:0,
    COA: 1,
    MIS: 2,
    BATCH: 3,
    SAMPLE: 4,
    SCREENWISE: 5,
    COAPREVIEW: 6,
    COAPRELIMINARY: 7

}

export const formCode = {
    MATERIALCATEGORY: 23,
    PRODUCTCATEGORY: 24,
    INSTRUMENTCATEGORY: 27,
    SAMPLEREGISTRATION: 43,
    RESULTENTRY: 56,   
    APPROVAL: 61,
    JOBALLOCATION: 110,
    MYJOBS: 107,
    TESTWISEMYJOBS:142,
    RELEASE:143,
    TESTPACKAGE:152,
    WORKLIST:173,
    BATCHCREATION:174,
    PATIENTMASTER:137,
    GOODSIN:7,
    PROJECT:172,
    PROTOCOL:245,
    STUDYALLOCATION:246,
    SCHEDULERCONFIGURATION:244  // ALPD-4914 Added enumeration for scheduler configuration screen
    
}

export const chartType = {
    GRID: -2,
    AREACHART: 1,
    BARCHART: 2,
    BUBBLE: 3,
    COLUMNCHART: 5,
    DONUT: 6,
    PIECHART: 8
}
export const designComponents = {
    TEXTBOX: 1,
    TEXTAREA: 2,
    COMBOBOX: 3,
    DATEPICKER: 4,
    NUMBER: 5,
    CHECKBOX: 6,
    PATH: 7,
    USERINFO: 8,
    
}
export const tableType = {
    ALL: -1,
    MODULES: 1,
    FORMS: 2
}
export const queryTypeFilter = {
    LIMSDASHBOARDQUERY: 1,
    LIMSALERTQUERY: 2,
    LIMSBARCODEQUERY: 3,
    LIMSGENERALQUERY: 4,
    LIMSFILTERQUERY: 5
}

export const LOGINTYPE = {
    INTERNAL: 1,
    ADS: 2
}

export const QUALISFORMS = {
    SAMPLEREGISTRATION: 43
}


export const REPORTTYPE = {
    COAREPORT: 1,
    MISREPORT: 2,
    BATCHREPORT: 3,
    SAMPLEREPORT: 4,
    CONTROLBASED: 5,
    COAPREVIEW:6,
    COAPRELIMINARY: 7
}

// export const COAREPORTTYPE={
// 	SAMPLEWISE:1,
// 	TESTWISE:2,
// 	CLIENTWISE:3,
// 	SAMPLEWISEPREVIEW:4,
// 	BATCHWISEPREVIEW:6,
// 	BATCHWISE:5,
// 	SAMPLEWISE:7
// } 


export const reportCOAType = {
    SAMPLEWISE: 1,
    TESTWISE: 2,
    CLIENTWISE: 3,
    SAMPLECERTIFICATEPRIVIEW: 4,
    BATCH: 5,
    BATCHPREVIEW: 6,
    // SAMPLECERTIFICATE: 7,
    PROJECTWISE: 7,
    // BATCHSTUDY: 8
    SECTIONWISE: 8,
    SECTIONWISEMULTIPLESAMPLE: 9,
    PATIENTWISE: 10,
    MULTIPLESAMPLE: 11,

}

export const FORMULAFIELDTYPE = {
    INTEGER: 1
}

export const ReactComponents = {
    TEXTINPUT: 1,
    TEXTAREA: 2,
    COMBO: 3,
    DATE: 4,
    NUMERIC: 5,
    EMAIL: 6,
    RADIO: 7,
    CHECKBOX: 8,
    FILE: 9,
    FRONTENDSEARCHFILTER:10,
    BACKENDSEARCHFILTER:11,
    PREDEFINEDDROPDOWN:12,
    LABEL:13

}
//Added by sonia on 8th OCT 2024 for jira id : ALPD-5024
export const SampleType = {    
    SUBSAMPLE: -1, 
    PRODUCT: 1, 
    INSTRUMENT: 2,
    MATERIAL: 3,
    Masters: 4,
    CLINICALTYPE: 5,
    PROJECTSAMPLETYPE:6,
    GOODSIN: 7,
    PROTOCOL:8,
    STABILITY:9
    
}

export const MaterialType = {
    STANDARDTYPE: 1,
    VOLUMETRICTYPE: 2,
    MATERIALINVENTORYTYPE: 3,
    IQCSTANDARDMATERIALTYPE: 4
}

export const ColumnType = {
    TEXTINPUT: 1,
    DATATIME: 2,
    DATE: 3,
    COMBO: 4,
    NUMERICINPUT: 5
}

export const condition = {
    EQUALS: 1,
    NOTEQUALS: 2,
    CONTAINS: 3,
    NOTCONTAINS: 4,
    STARTSWITH: 5,
    ENDSWITH: 6,
    INCLUDES: 7,
    LESSTHAN: 8,
    LESSTHANOREQUALS: 9,
    GREATERTHAN: 10,
    GREATERTHANEQUALS: 11,

}
// export const TemplateType = {
//     SUBSAMPLE: -1,
//     PRODUCT: 1,
//     INSTRUMENT: 2,
//     MATERIAL: 3,
//     Masters: 4
// }
export const CONTAINERTYPE = {
	YES: 3,
	NO: 4
}

export const templateMappingAction = {
	CONFIGSAMPLEDISPLAY:1,
    CONFIGSUBSAMPLEDISPLAY:2,
    CONFIGSAMPLEEDIT:3,
    CONFIGSUBSAMPLEEDIT:4,
    CONFIGUNIQUE:5,
    CONFIGSAMPLEAUDIT:6,
    CONFIGSENDTOSTORE:7,
    CONFIGEXPORTFIELDS:8,
    CONFIGURECHECKLIST:9,
    CONFIGURERELEASESAMPLEFILTER:10 
}

export const SideBarSeqno = {
    TEST: 1,
    SUBSAMPLE: 2,
    SAMPLE:3
}
export const SideBarTabIndex = {
    RESULT:1,
    ATTACHMENTS: 2,
	COMMENTS:3,
    INSTRUMENT:4,
    MATERIAL:5,
    TASK:6,
    TESTAPPROVALHISTORY:7,
    TESTVIEW:8,
    OUTSOURCE:9,
    HISTORY:10,
    TESTPACKAGE:11
}



export const SAMPLEAUDITFIELDS = ["sarno"];
export const SAMPLEAUDITEDITABLE = ["sarno"];
//export const SAMPLEAUDITMULTILINGUALFIELDS = [{"sarno": {"en-US": "AR.No.", "ru-RU": "AR.No.", "tg-TG": "AR.No."}}];
export const SUBSAMPLEAUDITFIELDS = ["sarno", "ssamplearno"];
export const SUBSAMPLEAUDITEDITABLE = ["sarno", "ssamplearno"];
// export const SUBSAMPLEAUDITMULTILINGUALFIELDS = [{"sarno": {"en-US": "AR.No.", "ru-RU": "AR.No.", "tg-TG": "AR.No."}},
//                                         {"ssamplearno": {"en-US": "Sub AR.No.", "ru-RU": "Sub AR.No.", "tg-TG": "Зер AR.№"}} ];

// export const SAMPLETEMPLATEFIELDS= [
//     {
//     "1": {
//         "en-US": "AR.No.",
//         "ru-RU": "AR.No.",
//         "tg-TG": "AR.No."
//         },
//     "2": "sarno"
//     },
//     {
//         "1": {
//             "en-US": "Specification", 
//             "ru-RU": "Спецификация", 
//             "tg-TG": "Мушаххасот" 
//             },
//         "2": "sspecname"
//     },
//     {
//         "1": {
//             "en-US": "Reg. Date",
//             "ru-RU": "Рег. Датировать",
//             "tg-TG": "Рег. Сана"
//             },
//         "2": "dregdate"
//     },
//     {
//         "1": {
//             "en-US": "Transaction Status",
//             "ru-RU": "Статус транзакции",
//             "tg-TG": "Ҳолати транзаксия"
//             },
//         "2": "stransdisplaystatus"
//     }
// ];

// export const SUBSAMPLETEMPLATEFIELDS= [
//     {
//     "1": {
//         "en-US": "AR.No.",
//         "ru-RU": "AR.No.",
//         "tg-TG": "AR.No."
//         },
//     "2": "sarno"
//     },
//     {
//         "1": {
//             "en-US": "Sub AR.No.",
//             "ru-RU": "Sub AR.No.",
//             "tg-TG": "Зер AR.№"
//             },
//         "2": "ssamplearno"
//     },
//     {
//         "1": {
//             "en-US": "Transaction Status",
//             "ru-RU": "Статус транзакции",
//             "tg-TG": "Ҳолати транзаксия"
//             },
//         "2": "stransdisplaystatus"
//     },
// ];

//export const ARNOMULTILINGUAL = { "en-US": "AR.No.", "ru-RU": "AR.No.", "tg-TG": "AR.No." };

//export const SUBARNOMULTILINGUAL = { "en-US": "Sub AR.No.", "ru-RU": "Sub AR.No.", "tg-TG": "Зер AR.№" }

export const orderType = {
    NA: -1,
    MANUAL:1,
    EXTERNAL:2
}

export const checkBoxOperation = {
    MULTISELECT : 1,
    DESELECT : 2,
    SINGLESELECT : 3,
    SINGLEDESELECT : 4,
    QUICKSELECTSTATUS : 5,
    QUICKSELECTNONE : 6,
    QUICKSELECTALL : 7   

}

/**ALPD-4466 - Label Component - L.Subashini**/
export const FontSizeProperty = {
    FONTSIZE_10: 10,
    FONTSIZE_25: 25
}

//ALPD-4498--Vignesh R--12/07/2024
export const SampleCycle = {
    COLLECTION : 1,
    PROCESSING : 2,
    STORAGE : 3 
}
// Gowtham R -- ALPD-5190 -- 14/12/2024 -- for Vacuum (03:58 am to 04:16 am)
export const PostgreSQLMaintenance = {
    STARTHOUR : 3,
    ENDHOUR : 4,
    STARTMINUTE : 58,
    ENDMINUTE : 16,
    DAY : 0
}
//janakumar ALPD-4937 Sample Storage -> In the cell color changes.  18.09.2024
export const samplestoragedireaction = {
    LEFTTORIGHT: 1,
    TOPTOBOTTOM: 2,
}

//ALPD-4941--Added by Vignesh R(19-02-2024)-->Mandatory validation for the Scheduler Master applies only to the external type.  
export const schedulerConfigType={
    INTERNAL:1,
    EXTERNAL:2
}
//ALPD-6042--Added by vignesh(09-07-2025)--Email Authentication types.
export const authenticatioType={
    EMAIL:1,
    MOBILEAPP:2,
    SMS:3
}


export const releaseTestFilter={
    DEFAULT:1,
    SECTION:2,
    ACCREDITEDSTATUS:3
}

//BGSI-87--Added by Vishakh(22-09-2025)--Email Form Types.
export const formType={
    TRANSFER:1,
    RETURN:2
}

export const RequestFormType = {
  BIO_SAMPLE_BASED: 1,
  PARENT_SAMPLE_BASED: 2
};

export const TransferType = {
  BIOBANK: 1,
  EXTERNAL: 2
};

export const mailScheduleType = {
  CONTROL_BASED_MAIL: 1,
  SCHEDULE_BASED_MAIL: 2
};

// added by sujatha ATE_274 BGSI-185 for userrole Configtype enumeration needed
export const userRoleConfigType = {
   LIMS:1,
   BIOBANK:2
};

//#SECURITY-VULNERABILITY-MERGING-START
// Added by Gowtham on nov 24 2025 for jira-id:SWSM-121
export const NetworkEncryption = {
  SECRET_KEY: "d4f8c6a3e1b97f2cd9a4bb7c1f2e89f5a0c3b2d17ef44c9b83a6d2f4c58e7ab1"
};
//#SECURITY-VULNERABILITY-MERGING-END