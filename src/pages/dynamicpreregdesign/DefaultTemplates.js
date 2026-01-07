export const productDefaultTemplate = [{
    "id": "pv1OWbsMYq",
    "type": "row",
    "children": [{
        "id": "Nybc4TT-jv",
        "templatemandatory": true,
        "children": [
          {
            "id": "L7BUKHDn3",
            "label": "Sample Category",
            "displayname": {
                "en-US": "Sample Category",
                "ru-RU": "Sample Category",
                "tg-TG": "Sample Category"
            },
            "child": [
              {
                "label": "Sample Type",
                "childPath": "0-0-1-0",
                "foriegntablePK": "nproductcatcode",
                "tablecolumnname": "nproductcatcode"
              }
            ],
            "templatemandatory": true,
            "table": {
                "item": {
                    "stablename": "productcategory",
                    "displayname": "Sample Category"
                },
                "label": "Sample Category",
                "value": "productcategory"
            },
            "column": {
                "item": {
                    "default": true,
                    "columnname": "sproductcatname",
                    "displayname": {
                        "en-US": "Sample Category Name",
                        "ru-RU": "Sample Category Name",
                        "tg-TG": "Sample Category Name"
                    },
                    "nquerybuildertablecode":"107",
                    "pkey": "nproductcatcode", 
                    "source": "productcategory"
                },
                "label": "Sample Category Name",
                "value": "sproductcatname"
            },
            "source": "productcategory",
            "nquerybuildertablecode":"107",
            "name": "Product Category",
            "inputtype": "combo",
            "valuemember": "nproductcatcode",
            "componentcode": 3,
            "componentname": "Combo Box",
            "displaymember": "sproductcatname",
            "componentprops": [
                "source",
                "displaymember"
            ],
            "mandatory":true
        },
        {
            "id": "wwi4eC9iw",
            "type": "component",
            "label": "Sample Type",
            "nquerybuildertablecode":"105",
            "displayname": {
                "en-US": "Sample Type",
                "ru-RU": "Sample Type",
                "tg-TG": "Sample Type"
            },
            "templatemandatory": true,
            "table": {
                "item": {
                    "stablename": "product",
                    "displayname": "Sample Type"
                },
                "label": "Sample Type",
                "value": "product"
            },
            "column": {
                "item": {
                    "default": true,
                    "columnname": "sproductname",
                    "displayname": {
                        "en-US": "Sample Type",
                        "ru-RU": "Sample Type",
                        "tg-TG": "Sample Type"
                    },
                    "nquerybuildertablecode":"105",
                    "pkey": "nproductcode",
                    "source": "product"
                },
                "label": "Sample Type",
                "value": "sproductname"
            },
            "source": "product",
            "name": "Product",
            "inputtype": "combo",
            "valuemember": "nproductcode",
            "componentcode": 3,
            "componentname": "Combo Box",
            "displaymember": "sproductname",
            "componentprops": [
                "source",
                "displaymember"
            ],
            "mandatory":true,
            "childValue": {
              "path": "0-0-0-0",
              "label": "Sample Category",
              "value": "Sample Category",
              "source": "productcategory",
              "inputtype": "combo",
              "valuemember": "nproductcatcode",
              "nquerybuildertablecode": "107"
            },
            "parentPath": "0-0-0-0",
        }

        ]
    }]
}];

export const InstrumentDefaultTemplate = [
    {
      "id": "pv1OWbsMYq",
      "type": "row",
      "children": [
        {
          "id": "Nybc4TT-jv",
          "type": "column",
          "children": [
            {
              "id": "L7BUKHDn3",
              "name": "Instrument Category",
              "type": "component",
              "child": [
                {
                  "label": "Instrument ID",
                  "childPath": "0-0-1-0",
                  "tablecolumnname": "ninstrumentcatcode"
                }
              ],
              "label": "Instrument Category",
              "table": {
                "item": {
                  "stablename": "instrumentcategory",
                  "displayname": "Instrument Category"
                },
                "label": "Instrument Category",
                "value": "instrumentcategory"
              },
              "column": {
                "item": {
                  "default": true,
                  "columnname": "sinstrumentcatname",
                  "displayname": {
                    "en-US": "Instrument Category Name",
                    "ru-RU": "Instrument Category Name",
                    "tg-TG": "Instrument Category Name"
                  },
                  "nquerybuildertablecode":"78",
                  "pkey": "sinstrumentcatname",
                  "source": "instrumentcategory"
                },
                "label": "Instrument Category Name",
                "value": "sinstrumentcatname"
              },
              "source": "instrumentcategory",
              "inputtype": "combo",
              "mandatory": true,
              "displayname": {
                "en-US": "Instrument Category",
                "ru-RU": "Instrument Category",
                "tg-TG": "Instrument Category"
              },
              "valuemember": "ninstrumentcatcode",
              "componentcode": 3,
              "componentname": "Combo Box",
              "displaymember": "sinstrumentcatname",
              "componentprops": [
                "source",
                "displaymember"
              ],
              "templatemandatory": true,
              "nquerybuildertablecode": "78"
              ,"mandatory":true
            },
            {
              "id": "wwi4eC9iw",
              "name": "Instrument",
              "type": "component",
              "child": [
                {
                  "label": "Instrument Name",
                  "childPath": "0-0-2-0"
                }
              ],
              "label": "Instrument ID",
              "table": {
                "item": {
                  "stablename": "view_instrument",
                  "displayname": "Instrument"
                },
                "label": "Instrument",
                "value": "instrumentid"
              },
              "column": {
                "item": {
                  "default": true,
                  "columnname": "sinstrumentid",
                  "displayname": {
                    "en-US": "Instrument ID",
                    "ru-RU": "Instrument ID",
                    "tg-TG": "Instrument ID"
                  },
                  "nquerybuildertablecode":"76",
                  "pkey": "sinstrumentid",
                  "source": "view_instrument"
                },
                "label": "Instrument ID",
                "value": "sinstrumentid"
              },
              "source": "view_instrument",
              "condition": "",
              "inputtype": "combo",
              "mandatory": true,
              "childValue": {
                "path": "0-0-0-0",
                "label": "Instrument Category",
                "value": "Instrument Category",
                "source": "instrumentcategory",
                "valuemember": "ninstrumentcatcode",
                "nquerybuildertablecode": "78"
              },
              "parentPath": "0-0-0-0",
              "displayname": {
                "en-US": "Instrument ID",
                "ru-RU": "Instrument ID",
                "tg-TG": "Instrument ID"
              },
              "filtervalue": "",
              "valuemember": "ninstrumentcode",
              "filtercolumn": "",
              "componentcode": 3,
              "componentname": "Combo Box",
              "displaymember": "sinstrumentid",
              "componentprops": [
                "source",
                "displaymember"
              ],
              "conditionstring": " and ncalibrationstatus = '57' and npreregno = -1 and dopendate isnull and dclosedate isnull",
              "conditionArrayUI": [
                "Instrument Calibration = Under Calibration"
              ],
              "conditionArraySQL": [
                " and ncalibrationstatus = '57'"
              ],
              "templatemandatory": true,
              "nquerybuildertablecode": "76"
              ,"mandatory":true
            },
            {
              "id": "r0bJcPdVP",
              "type": "component",
              "label": "Instrument Name",
              "templatemandatory": true,
              "column": {
                "item": {
                  "default": false,
                  "columnname": "sinstrumentname",
                  "displayname": {
                    "en-US": "Instrument Name",
                    "ru-RU": "Instrument Name",
                    "tg-TG": "Instrument Name"
                  }
                },
                "type": "static",
                "label": "Instrument Name",
                "value": "sinstrumentname"
              },
              "readonly": true,
              "inputtype": "textinput",
              "mandatory": true,
              "childValue": {
                "path": "0-0-1-0",
                "label": "Instrument ID",
                "value": "Instrument ID",
                "source": "view_instrument",
                "valuemember": "ninstrumentcode",
                "nquerybuildertablecode": "76"
              },
              "parentPath": "0-0-1-0",
              "displayname": {
                "en-US": "Instrument Name",
                "ru-RU": "Instrument Name",
                "tg-TG": "Instrument Name"
              },
              "valuemember": "ninstrumentcode",
              "componentcode": 1,
              "componentname": "Short Text",
              "displaymember": "sinstrumentname",
              "mandatory":true
            }
          ]
        }
      ]
    }
  ]

export const MaterialDefaultTemplate = [
    {
        "id": "pv1OWbsMYq",
        "type": "row",
        "children": [
            {
                "id": "2zMtRhjb2t",
                "type": "column",
                "children": [
                    {
                        "id": "_QLuLFE8y",
                        "type": "component",
                        "child": [
                            {
                                "label": "Material Category",
                                "childPath": "0-0-1-0",
                                "tablecolumnname": "nmaterialtypecode"
                            }
                        ],
                        "label": "Material Type",
                        "name": "Material Type",
                        "templatemandatory": true,
                        "table": {
                            "item": {
                                "nstatus": 0,
                                "jsondata": null,
                                "nformcode": 0,
                                "stablename": "materialtype",
                                "displayname": "Material Type",
                                "nismastertable": 0,
                                "nquerybuildertablecode": 98
                            },
                            "label": "Material Type",
                            "value": 125
                        },
                        "column": {
                            "item": {
                                "default": true,
                                "columnname": "smaterialtypename",
                                "displayname": {
                                    "en-US": "Material Type",
                                    "ru-RU": "Material Type",
                                    "tg-TG": "Material Type"
                                },
                                "ismultilingual": true
                            },
                            "type": "static",
                            "label": "Material Type",
                            "value": "smaterialtypename"
                        },
                        "source": "materialtype",
                        "inputtype": "combo",
                        "mandatory": true,
                        "displayname": {
                            "en-US": "Material Type",
                            "ru-RU": "Material Type",
                            "tg-TG": "Material Type"
                        },
                        "valuemember": "nmaterialtypecode",
                        "componentcode": 3,
                        "componentname": "Drop Down",
                        "displaymember": "smaterialtypename",
                        "isMultiLingual": true,
                        "nquerybuildertablecode": 98,
                        "mandatory":true
                    },
                    {
                        "id": "wxDxMVbc4",
                        "type": "component",
                        "child": [
                            {
                                "label": "Material",
                                "childPath": "0-0-2-0",
                                "tablecolumnname": "nmaterialcatcode"
                            }
                        ],
                        "label": "Material Category",
                        "templatemandatory": true,
                        "table": {
                            "item": {
                                "nstatus": 0,
                                "jsondata": null,
                                "nformcode": 0,
                                "stablename": "materialcategory",
                                "displayname": "Material Category",
                                "nismastertable": 0,
                                "nquerybuildertablecode": 97
                            },
                            "label": "Material Category",
                            "value": 124
                        },
                        "column": {
                            "item": {
                                "default": true,
                                "columnname": "smaterialcatname",
                                "displayname": {
                                    "en-US": "Material Category Name",
                                    "ru-RU": "Material Category Name",
                                    "tg-TG": "Material Category Name"
                                }
                            },
                            "type": "static",
                            "label": "Material Category Name",
                            "value": "smaterialcatname"
                        },
                        "source": "materialcategory",
                        "name": "Material Category",
                        "inputtype": "combo",
                        "mandatory": true,
                        "childValue": {
                            "path": "0-0-0-0",
                            "label": "Material Type",
                            "value": "Material Type",
                            "source": "materialtype",
                            "valuemember": "nmaterialtypecode",
                            "nquerybuildertablecode": 98
                        },
                        "parentPath": "0-0-0-0",
                        "displayname": {
                            "en-US": "Material Category",
                            "ru-RU": "Material Category",
                            "tg-TG": "Material Category"
                        },
                        "valuemember": "nmaterialcatcode",
                        "componentcode": 3,
                        "componentname": "Drop Down",
                        "displaymember": "smaterialcatname",
                        "nquerybuildertablecode": 97,
                        "mandatory":true
                    },
                    {
                        "id": "YopH9QocF",
                        "type": "component",
                        "child": [
                            {
                                "label": "Material Inventory",
                                "childPath": "0-0-3-0",
                                "tablecolumnname": "nmaterialcode"
                            }
                        ],
                        "label": "Material",
                        "templatemandatory": true,
                        "table": {
                            "item": {
                                "nstatus": 0,
                                "jsondata": null,
                                "nformcode": 0,
                                "stablename": "material",
                                "displayname": "Material",
                                "nismastertable": 0,
                                "nquerybuildertablecode": 226
                            },
                            "label": "Material",
                            "value": 226
                        },
                        "column": {
                            "item": {
                                "columnname": "Material Name",
                                "displayname": {
                                    "en-US": "Material Name",
                                    "ru-RU": "Material Name",
                                    "tg-TG": "Material Name"
                                }
                            },
                            "type": "dynamic",
                            "label": "Material Name",
                            "value": "Material Name"
                        },
                        "source": "material",
                        "name": "Material",
                        "condition": "",
                        "inputtype": "combo",
                        "mandatory": true,
                        "childValue": {
                            "path": "0-0-1-0",
                            "child": [
                                {
                                    "label": "Material",
                                    "childPath": "0-0-2-0",
                                    "tablecolumnname": "nmaterialcatcode"
                                }
                            ],
                            "label": "Material Category",
                            "value": "Material Category",
                            "source": "materialcategory",
                            "valuemember": "nmaterialcatcode",
                            "nquerybuildertablecode": 97
                        },
                        "parentPath": "0-0-1-0",
                        "displayname": {
                            "en-US": "Material",
                            "ru-RU": "Material",
                            "tg-TG": "Material"
                        },
                        "filtervalue": "",
                        "valuemember": "nmaterialcode",
                        "filtercolumn": "",
                        "componentcode": 3,
                        "componentname": "Drop Down",
                        "displaymember": "Material Name",
                        "conditionstring": " and ntransactionstatus = '3'",
                        "conditionArrayUI": [
                            "Quarantine Status = Yes"
                        ],
                        "conditionArraySQL": [
                            " and ntransactionstatus = '3'"
                        ],
                        "nquerybuildertablecode": 226,
                        "mandatory":true
                    },
                    {
                        "id": "bYgXv-tLS",
                        "type": "component",
                        "label": "Material Inventory",
                        "templatemandatory": true,
                        "table": {
                            "item": {
                                "nstatus": 0,
                                "jsondata": null,
                                "nformcode": 0,
                                "stablename": "materialinventory",
                                "displayname": "Material Inventory",
                                "nismastertable": 0,
                                "nquerybuildertablecode": 227
                            },
                            "label": "Material Inventory",
                            "value": 277
                        },
                        "column": {
                            "item": {
                                "columnname": "Inventory ID",
                                "displayname": {
                                    "en-US": "Inventory ID",
                                    "ru-RU": "Inventory ID",
                                    "tg-TG": "Inventory ID"
                                }
                            },
                            "type": "dynamic",
                            "label": "Inventory ID",
                            "value": "Inventory ID"
                        },
                        "source": "materialinventory",
                        "condition": "",
                        "inputtype": "combo",
                        "childValue": {
                            "path": "0-0-2-0",
                            "label": "Material",
                            "value": "Material",
                            "source": "material",
                            "valuemember": "nmaterialcode",
                            "nquerybuildertablecode": 226
                        },
                        "parentPath": "0-0-2-0",
                        "displayname": {
                            "en-US": "Material Inventory",
                            "ru-RU": "Material Inventory",
                            "tg-TG": "Material Inventory"
                        },
                        "filtervalue": "",
                        "valuemember": "nmaterialinventorycode",
                        "filtercolumn": "",
                        "componentcode": 3,
                        "componentname": "Drop Down",
                        "displaymember": "Inventory ID",
                        "conditionstring": " and ntransactionstatus = '37'",
                        "conditionArrayUI": [
                            "Quarantine Status = Quarantined"
                        ],
                        "conditionArraySQL": [
                            " and ntransactionstatus = '37'"
                        ],
                        "nquerybuildertablecode": 227,
                        "mandatory":true
                    }
                ]
            }
        ]
    }
];
  
export const clinicalTypeDefaultTemplateWithProduct = [{
  "id": "pv1OWbsMYqv",
  "type": "row",
  "children": [{
      "id": "Nybc4TT-jvx",
      "templatemandatory": true,
      "children": [{
        "id": "L7BUKHDn3t",
        "label": "Client Category",
        "displayname": {
            "en-US": "Client Category",
            "ru-RU": "Клиническая категория",
            "tg-TG": "Категорияи клиникӣ"
        },
        "templatemandatory": true,
        "table": {
            "item": {
                "stablename": "productcategory",
                "displayname": "Sample Category"
            },
            "label": "Sample Category",
            "value": "productcategory"
        },
        "column": {
            "item": {
                "default": true,
                "columnname": "sproductcatname",
                "displayname": {
                    "en-US": "Sample Category Name",
                    "ru-RU": "Sample Category Name",
                    "tg-TG": "Sample Category Name"
                },
                "nquerybuildertablecode":"107",
                "pkey": "nproductcatcode", 
                "source": "productcategory"
            },
            "label": "Sample Category Name",
            "value": "sproductcatname"
        },
        "source": "productcategory",
        "nquerybuildertablecode":"107",
        "name": "Product Category",
        "inputtype": "combo",
        "valuemember": "nproductcatcode",
        "componentcode": 3,
        "componentname": "Combo Box",
        "displaymember": "sproductcatname",
        "componentprops": [
            "source",
            "displaymember"
        ],
        "mandatory":true
    },
    {
        "id": "wwi4eC9iwe",
        "type": "component",
        "label": "Specimen",
        "nquerybuildertablecode":"105",
        "displayname": {
            "en-US": "Specimen",
            "ru-RU": "Образец",
            "tg-TG": "Намуна"
        },
        "templatemandatory": true,
        "table": {
            "item": {
                "stablename": "product",
                "displayname": "Sample Type"
            },
            "label": "Sample Type",
            "value": "product"
        },
        "column": {
            "item": {
                "default": true,
                "columnname": "sproductname",
                "displayname": {
                    "en-US": "Sample Type",
                    "ru-RU": "Sample Type",
                    "tg-TG": "Sample Type"
                },
                "nquerybuildertablecode":"105",
                "pkey": "nproductcode",
                "source": "product"
            },
            "label": "Sample Type",
            "value": "sproductname"
        },
        "source": "product",
        "name": "Product",
        "inputtype": "combo",
        "valuemember": "nproductcode",
        "componentcode": 3,
        "componentname": "Combo Box",
        "displaymember": "sproductname",
        "componentprops": [
            "source",
            "displaymember"
        ],
        "mandatory":true
    },{
        "id": "hf4Kv2tqku",
        "type": "componentrow",
        "children": [
            {
                "id": "L7BUKHDn3d",
                "child": [
                    {
                        "label": "Age",
                        "childPath": "0-0-2-1"
                    }
                ],
                "name":"Date Of Birth",
                "label": "Date of birth",
                "inputtype": "date",
                "dateonly": true,
                "timeonly": false,
                "mandatory": true,
                "displayname": {
                    "en-US": "Date of birth",
                    "ru-RU": "Date of birth",
                    "tg-TG": "Date of birth"
                },
                "componentcode": 4,
                "componentname": "Date",
                "templatemandatory": true,
                "hideafterdate":true
            },
            {
                "id": "-T2UmWz_z",
                "type": "componentrow",
                "label": "Age",
                "column": {},
                "readonly": true,
                "inputtype": "textinput",
                "childValue": {
                    "path": "0-0-2-0",
                    "label": "Date of birth",
                    "value": "Date Of Birth",
                    "inputtype": "date"
                },
                "parentPath": "0-0-2-0",
                "displayname": {
                    "en-US": "Age",
                    "ru-RU": "Age",
                    "tg-TG": "Age"
                },
                "sfieldlength": "3",
                "displaymember":"",
                "componentcode": 1,
                "componentname": "Short Text",
                "name":"Age",
                "templatemandatory": true
            }
        ]
    },
          {
            "id": "-Q8z-kKY3",
            "type": "component",
            "label": "Gender",
            "templatemandatory": true,
            "table": {
                "item": {
                    "nstatus": 0,
                    "jsondata": null,
                    "nformcode": -3, 
                  //  "sformname": null,
                    "stablename": "gender",
                 //   "sdefaultname": null,
                    "sdisplayname": "Sex",
                    "nismastertable": 0,
                    "nquerybuildertablecode": 220
                },
                "label": "Sex",
                "value": 220
            },
            "column": {
                "item": {
                    "default": true,
                    "columnname": "sgendername",
                    "displayname": {
                        "en-US": "Gender Name"
                    },
                    "ismultilingual": true,
                    "filterinputtype": "text"
                },
                "type": "dynamic",
                "label": "Gender Name",
                "value": "sgendername"
            },
            "source": "gender",
            "inputtype": "combo",
            "displayname": {
                "en-US": "Gender",
                "ru-RU": "Gender",
                "tg-TG": "Gender"
            },
            "valuemember": "ngendercode",
            "componentcode": 3,
            "componentname": "Drop Down",
            "displaymember": "sgendername",
            "isMultiLingual": true,
            "nquerybuildertablecode": 220,
            "mandatory": true,
            "name":"Gender"

        }

      ]
  }]
}];

export const clinicalTypeDefaultTemplateWithoutProduct = [{
    "id": "pv1OWbsMYqv",
    "type": "row",
    "children": [
        {
        "id": "Nybc4TT-jvx",
        "templatemandatory": true,
        "children": [{
          "id": "L7BUKHDn3t",
          "label": "Clinical Category",
          "displayname": {
              "en-US": "Sample Category",
              "ru-RU": "Клиническая категория",
              "tg-TG": "Категорияи клиникӣ"
          },
          "templatemandatory": true,
          "table": {
              "item": {
                  "stablename": "productcategory",
                  "displayname": "Sample Category"
              },
              "label": "Sample Category",
              "value": "productcategory"
          },
          "column": {
              "item": {
                  "default": true,
                  "columnname": "sproductcatname",
                  "displayname": {
                      "en-US": "Sample Category Name",
                      "ru-RU": "Sample Category Name",
                      "tg-TG": "Sample Category Name"
                  },
                  "nquerybuildertablecode":"107",
                  "pkey": "nproductcatcode", 
                  "source": "productcategory"
              },
              "label": "Sample Category Name",
              "value": "sproductcatname"
          },
          "source": "productcategory",
          "nquerybuildertablecode":"107",
          "name": "Product Category",
          "inputtype": "combo",
          "valuemember": "nproductcatcode",
          "componentcode": 3,
          "componentname": "Combo Box",
          "displaymember": "sproductcatname",
          "componentprops": [
              "source",
              "displaymember"
          ],
          "mandatory":true
      },{
          "id": "hf4Kv2tqku",
          "type": "componentrow",
          "children": [
              {
                  "id": "L7BUKHDn3d",
                  "child": [
                      {
                          "label": "Age",
                          "childPath": "0-0-2-1"
                      }
                  ],
                  "label": "Date of birth",
                  "inputtype": "date",
                  "dateonly": true,
                  "timeonly": false,
                  "mandatory": true,
                  "displayname": {
                      "en-US": "Date of birth",
                      "ru-RU": "Date of birth",
                      "tg-TG": "Date of birth"
                  },
                  "componentcode": 4,
                  "componentname": "Date",
                  "templatemandatory": true,
                  "name": "Date Of Birth",
                  "hideafterdate":true
              },
              {
                  "id": "-T2UmWz_z",
                  "type": "componentrow",
                  "label": "Age",
                  "column": {},
                  "readonly": true,
                  "inputtype": "textinput",
                  "childValue": {
                      "path": "0-0-2-0",
                      "label": "Date Of Birth",
                      "value": "Date Of Birth",
                      "inputtype": "date"
                  },
                  "parentPath": "0-0-2-0",
                  "displayname": {
                      "en-US": "Age",
                      "ru-RU": "Age",
                      "tg-TG": "Age"
                  },
                  "sfieldlength": "3",
                  "displaymember":"",
                  "componentcode": 1,
                  "componentname": "Short Text",
                  "name":"Age",
                  "templatemandatory": true
              }
          ]
      },
            {
              "id": "-Q8z-kKY3",
              "type": "component",
              "label": "Gender",
              "templatemandatory": true,
              "table": {
                  "item": {
                      "nstatus": 0,
                      "jsondata": null,
                      "nformcode": -3, 
                    //  "sformname": null,
                      "stablename": "gender",
                   //   "sdefaultname": null,
                      "sdisplayname": "Sex",
                      "nismastertable": 0,
                      "nquerybuildertablecode": 220
                  },
                  "label": "Sex",
                  "value": 220
              },
              "column": {
                  "item": {
                      "default": true,
                      "columnname": "sgendername",
                      "displayname": {
                          "en-US": "Gender Name"
                      },
                      "ismultilingual": true,
                      "filterinputtype": "text"
                  },
                  "type": "dynamic",
                  "label": "Gender Name",
                  "value": "sgendername"
              },
              "source": "gender",
              "inputtype": "combo",
              "displayname": {
                  "en-US": "Gender",
                  "ru-RU": "Gender",
                  "tg-TG": "Gender"
              },
              "valuemember": "ngendercode",
              "componentcode": 3,
              "componentname": "Drop Down",
              "displaymember": "sgendername",
              "isMultiLingual": true,
              "nquerybuildertablecode": 220,
                "mandatory": true,
                "name":"Gender",
             
  
          }
  
        ]
    }]
  }];

export const clinicalTemplateWithExternalOrder =[
  {
    "id": "pv1OWbsMYqv",
    "type": "row",
    "children": [
      {
        "id": "Nybc4TT-jvx",
        "children": [
          {
            "id": "2muV3OKmd",
            "name": "manualordertype",
            "type": "component",
            "child": [
              {
                "label": "Order",
                "childPath": "0-0-1-0",
                "foriegntablePK": "nordertypecode",
                "tablecolumnname": "nordertypecode"
              }
            ],
            "label": "Order Type",
            "table": {
              "item": {
                "nstatus": 0,
                "classUrl": null,
                "jsondata": null,
                "component": null,
                "masterAdd": false,
                "methodUrl": null,
                "nformcode": -3,
                "nsitecode": 0,
                "sformname": null,
                "stablename": "ordertype",
                "sdefaultname": null,
                "sdisplayname": "Ordering System",
                "dmodifieddate": null,
                "addControlCode": 0,
                "nismastertable": 0,
                "nquerybuildertablecode": 246
              },
              "label": "Ordering System",
              "value": 246
            },
            "column": {
              "item": {
                "tablename": "ordertype",
                "columnname": "sdisplayname",
                "displayname": {
                  "en-US": "Display Name",
                  "ru-RU": "Показать имя",
                  "tg-TG": "Бозтоби ном"
                },
                "isjsoncolumn": true,
                "parametername": "slanguagetypecode",
                "columndatatype": "string",
                "ismultilingual": true,
                "jsoncolumnname": "jsondata"
              },
              "type": "dynamic",
              "label": "Display Name",
              "value": "sdisplayname"
            },
            "source": "ordertype",
            "inputtype": "combo",
            "mandatory": true,
            "displayname": {
              "en-US": "Order Type",
              "ru-RU": "Order Type",
              "tg-TG": "Order Type"
            },
            "isAddMaster": false,
            "valuemember": "nordertypecode",
            "componentcode": 3,
            "componentname": "Drop Down",
            "displaymember": "sdisplayname",
            "isMultiLingual": true,
            "templatemandatory": true,
            "nquerybuildertablecode": 246
          },
          {
            "id": "thvykmDbO",
            "name": "manualorderid",
            "type": "component",
            "child": [
              {
                "label": "Date of birth",
                "childPath": "0-0-2-0"
              },
              {
                "label": "Gender",
                "childPath": "0-0-3-0",
                "foriegntablePK": "ngendercode",
                "tablecolumnname": "ngendercode"
              },
              {
                "label": "Clinical Category",
                "childPath": "0-0-4-0",
                "foriegntablePK": "nproductcatcode",
                "tablecolumnname": "nproductcatcode"
              }
            ],
            "label": "Order",
            "table": {
              "item": {
                "nstatus": 0,
                "classUrl": "externalorder",
                "jsondata": null,
                "component": "Type3Component",
                "masterAdd": true,
                "methodUrl": "ExternalOrder",
                "nformcode": 43,
                "nsitecode": 0,
                "sformname": null,
                "stablename": "view_externalorder",
                "sdefaultname": null,
                "sdisplayname": "External Order",
                "dmodifieddate": null,
                "addControlCode": 948,
                "nismastertable": 0,
                "nquerybuildertablecode": 222
              },
              "label": "External Order",
              "value": 222
            },
            "column": {
              "item": {
                "columnname": "sexternalorderid",
                "displayname": {
                  "en-US": "External Order Id",
                  "ru-RU": "Идентификатор внешнего заказа",
                  "tg-TG": "Id фармоиши беруна"
                },
                "filterinputtype": "text"
              },
              "type": "static",
              "label": "External Order Id",
              "value": "sexternalorderid"
            },
            "isView": true,
            "source": "view_externalorder",
            "condition": {
              "label": "Equals",
              "value": 1
            },
            "inputtype": "combo",
            "mandatory": true,
            "childValue": {
              "path": "0-0-0-0",
              "child": [
                {
                  "label": "Order Id",
                  "childPath": "0-0-1-0",
                  "foriegntablePK": "nordertypecode",
                  "tablecolumnname": "nordertypecode"
                }
              ],
              "label": "Order Type",
              "value": "Order Type",
              "source": "ordertype",
              "inputtype": "combo",
              "valuemember": "nordertypecode",
              "nquerybuildertablecode": 246
            },
            "parentPath": "0-0-0-0",
            "displayname": {
              "en-US": "Order",
              "ru-RU": "Order",
              "tg-TG": "Order"
            },
            "filtervalue": "",
            "isAddMaster": true,
            "valuemember": "nexternalordercode",
            "filtercolumn": {
              "item": {
                "columnname": "sdisplayname",
                "displayname": {
                  "en-US": "Order Type",
                  "ru-RU": "Идентификатор внешнего заказа",
                  "tg-TG": "Id фармоиши беруна"
                },
                "filterinputtype": "text"
              },
              "type": "static",
              "label": "Order Type",
              "value": "sdisplayname"
            },
            "componentcode": 3,
            "componentname": "Drop Down",
            "displaymember": "sexternalorderid",
            "staticfiltervalue": "",
            "templatemandatory": true,
            "recordbasedreadonly": false,
            "recordbasedshowhide": false,
            "nsystemconfiguration": true,
            "nquerybuildertablecode": 222
          },
          {
            "id": "hf4Kv2tqku",
            "type": "componentrow",
            "children": [
              {
                "id": "L7BUKHDn3d",
                "name": "Date Of Birth",
                "child": [
                  {
                    "label": "Age",
                    "childPath": "0-0-2-1"
                  }
                ],
                "label": "Date of birth",
                "column": {
                  "item": {
                    "columnname": "ddob",
                    "displayname": {
                      "en-US": "Patient DOB",
                      "ru-RU": "Дата рождения пациента",
                      "tg-TG": "Бемор DOB"
                    },
                    "filterinputtype": "date"
                  },
                  "type": "static",
                  "label": "Patient DOB",
                  "value": "ddob"
                },
                "dateonly": true,
                "readonly": true,
                "timeonly": false,
                "inputtype": "date",
                "mandatory": true,
                "childValue": {
                  "path": "0-0-1-0",
                  "child": [
                    {
                      "label": "Clinical Category",
                      "childPath": "0-0-4-0",
                      "foriegntablePK": "nproductcatcode",
                      "tablecolumnname": "nproductcatcode"
                    },
                    {
                      "label": "Date of birth",
                      "childPath": "0-0-2-0"
                    },
                    {
                      "label": "Gender",
                      "childPath": "0-0-3-0",
                      "foriegntablePK": "ngendercode",
                      "tablecolumnname": "ngendercode"
                    }
                  ],
                  "label": "Order",
                  "value": "Order",
                  "source": "view_externalorder",
                  "inputtype": "combo",
                  "valuemember": "nexternalordercode",
                  "nquerybuildertablecode": 222
                },
                "parentPath": "0-0-1-0",
                "displayname": {
                  "en-US": "Date of birth",
                  "ru-RU": "Date of birth",
                  "tg-TG": "Date of birth"
                },
                "valuemember": "nexternalordercode",
                "componentcode": 4,
                "componentname": "Date",
                "displaymember": "ddob",
                "hideafterdate": true,
                "templatemandatory": true
              },
              {
                "id": "-T2UmWz_z",
                "name": "Age",
                "type": "componentrow",
                "label": "Age",
                "column": {},
                "readonly": true,
                "inputtype": "textinput",
                "childValue": {
                  "path": "0-0-2-0",
                  "child": [
                    {
                      "label": "Age",
                      "childPath": "0-0-2-1"
                    }
                  ],
                  "label": "Date of birth",
                  "value": "Date of birth",
                  "inputtype": "date",
                  "valuemember": "nexternalordercode"
                },
                "parentPath": "0-0-2-0",
                "displayname": {
                  "en-US": "Age",
                  "ru-RU": "Age",
                  "tg-TG": "Age"
                },
                "sfieldlength": "3",
                "componentcode": 1,
                "componentname": "Short Text",
                "templatemandatory": true
              }
            ]
          },
          {
            "id": "-Q8z-kKY3",
            "name": "Gender",
            "type": "component",
            "label": "Gender",
            "table": {
              "item": {
                "nstatus": 0,
                "jsondata": null,
                "nformcode": -3,
                "stablename": "gender",
                "sdisplayname": "Sex",
                "nismastertable": 0,
                "nquerybuildertablecode": 220
              },
              "label": "Sex",
              "value": 220
            },
            "column": {
              "item": {
                "default": true,
                "columnname": "sgendername",
                "displayname": {
                  "en-US": "Gender Name"
                },
                "ismultilingual": true,
                "filterinputtype": "text"
              },
              "type": "dynamic",
              "label": "Gender Name",
              "value": "sgendername"
            },
            "source": "gender",
            "readonly": true,
            "inputtype": "combo",
            "mandatory": true,
            "childValue": {
              "path": "0-0-1-0",
              "child": [
                {
                  "label": "Clinical Category",
                  "childPath": "0-0-4-0",
                  "foriegntablePK": "nproductcatcode",
                  "tablecolumnname": "nproductcatcode"
                },
                {
                  "label": "Gender",
                  "childPath": "0-0-3-0",
                  "foriegntablePK": "ngendercode",
                  "tablecolumnname": "ngendercode"
                },
                {
                  "label": "Date of birth",
                  "childPath": "0-0-2-0"
                }
              ],
              "label": "Order",
              "value": "Order",
              "source": "view_externalorder",
              "inputtype": "combo",
              "valuemember": "nexternalordercode",
              "nquerybuildertablecode": 222
            },
            "parentPath": "0-0-1-0",
            "displayname": {
              "en-US": "Gender",
              "ru-RU": "Gender",
              "tg-TG": "Gender"
            },
            "valuemember": "ngendercode",
            "componentcode": 3,
            "componentname": "Drop Down",
            "displaymember": "sgendername",
            "isMultiLingual": true,
            "templatemandatory": true,
            "nquerybuildertablecode": 220
          },
          {
            "id": "E7j7nTJrWh",
            "name": "Product Category",
            "type": "component",
            "label": "Clinical Category",
            "table": {
              "item": {
                "stablename": "productcategory",
                "displayname": "Sample Category"
              },
              "label": "Sample Category",
              "value": "productcategory"
            },
            "column": {
              "item": {
                "pkey": "nproductcatcode",
                "source": "productcategory",
                "default": true,
                "columnname": "sproductcatname",
                "displayname": {
                  "en-US": "Sample Category Name",
                  "ru-RU": "Sample Category Name",
                  "tg-TG": "Sample Category Name"
                },
                "nquerybuildertablecode": "107"
              },
              "label": "Sample Category Name",
              "value": "sproductcatname"
            },
            "source": "productcategory",
            "inputtype": "combo",
            "mandatory": true,
            "childValue": {
              "path": "0-0-1-0",
              "child": [
                {
                  "label": "Clinical Category",
                  "childPath": "0-0-4-0",
                  "foriegntablePK": "nproductcatcode",
                  "tablecolumnname": "nproductcatcode"
                },
                {
                  "label": "Date of birth",
                  "childPath": "0-0-2-0"
                },
                {
                  "label": "Gender",
                  "childPath": "0-0-3-0",
                  "foriegntablePK": "ngendercode",
                  "tablecolumnname": "ngendercode"
                }
              ],
              "label": "Order",
              "value": "Order",
              "source": "view_externalorder",
              "inputtype": "combo",
              "valuemember": "nexternalordercode",
              "nquerybuildertablecode": 222
            },
            "parentPath": "0-0-1-0",
            "displayname": {
              "en-US": "Clinical Category",
              "ru-RU": "Clinical Category",
              "tg-TG": "Clinical Category"
            },
            "valuemember": "nproductcatcode",
            "componentcode": 3,
            "componentname": "Combo Box",
            "displaymember": "sproductcatname",
            "componentprops": [
              "source",
              "displaymember"
            ],
            "templatemandatory": true,
            "nquerybuildertablecode": "107"
          }
        ],
        "templatemandatory": true
      }
    ]
  }
];

export const clinicalTemplateWithExternalOrder11 = [
  {
    "id": "pv1OWbsMYqv",
    "type": "row",
    "children": [
      {
        "id": "Nybc4TT-jvx",
        "templatemandatory": true,
        "children": [
          {
            "id": "2muV3OKmd",
            "type": "component",
            "child": [
              {
                "label": "Order Id",
                "childPath": "0-0-1-0",
                "foriegntablePK": "nordertypecode",
                "tablecolumnname": "nordertypecode"
              }
            ],
            "label": "Order Type",
            "templatemandatory": true,
            "table": {
              "item": {
                "nstatus": 0,
                "classUrl": null,
                "jsondata": null,
                "component": null,
                "masterAdd": false,
                "methodUrl": null,
                "nformcode": -3,
                "nsitecode": 0,
                "sformname": null,
                "stablename": "ordertype",
                "sdefaultname": null,
                "sdisplayname": "Ordering System",
                "dmodifieddate": null,
                "addControlCode": 0,
                "nismastertable": 0,
                "nquerybuildertablecode": 246
              },
              "label": "Ordering System",
              "value": 246
            },
            "column": {
              "item": {
                "tablename": "ordertype",
                "columnname": "sdisplayname",
                "displayname": {
                  "en-US": "Display Name",
                  "ru-RU": "Показать имя",
                  "tg-TG": "Бозтоби ном"
                },
                "isjsoncolumn": true,
                "parametername": "slanguagetypecode",
                "columndatatype": "string",
                "ismultilingual": true,
                "jsoncolumnname": "jsondata"
              },
              "type": "dynamic",
              "label": "Display Name",
              "value": "sdisplayname"
            },
            "source": "ordertype",
            "inputtype": "combo",
            "mandatory": true,           
            "displayname": {
              "en-US": "Order Type",
              "ru-RU": "Order Type",
              "tg-TG": "Order Type"
            },
            "isAddMaster": false,
            "valuemember": "nordertypecode",
            "componentcode": 3,
            "componentname": "Drop Down",
            "displaymember": "sdisplayname",
            "isMultiLingual": true,
            "nquerybuildertablecode": 246
          },
          {
            "id": "thvykmDbO",
            "type": "component",
           
            "child": [
              {
                "label": "Clinical Category",
                "childPath": "0-0-2-0",
                "foriegntablePK": "nproductcatcode",
                "tablecolumnname": "nproductcatcode"
              },
              {
                "label": "Date of birth",
                "childPath": "0-0-3-0"
              },
              {
                "label": "Gender",
                "childPath": "0-0-4-0",
                "foriegntablePK": "ngendercode",
                "tablecolumnname": "ngendercode"
              }
            ],
            "label": "Order Id",
            "table": {
              "item": {
                "nstatus": 0,
                "classUrl": "externalorder",
                "jsondata": null,
                "component": "Type3Component",
                "masterAdd": true,
                "methodUrl": "ExternalOrder",
                "nformcode": 43,
                "nsitecode": 0,
                "sformname": null,
                "stablename": "view_externalorder",
                "sdefaultname": null,
                "sdisplayname": "External Order",
                "dmodifieddate": null,
                "addControlCode": 948,
                "nismastertable": 0,
                "nquerybuildertablecode": 222
              },
              "label": "External Order",
              "value": 222
            },
            "column": {
              "item": {
                "columnname": "sexternalorderid",
                "displayname": {
                  "en-US": "External Order Id",
                  "ru-RU": "Идентификатор внешнего заказа",
                  "tg-TG": "Id фармоиши беруна"
                },
                "filterinputtype": "text"
              },
              "type": "static",
              "label": "External Order Id",
              "value": "sexternalorderid"
            },
            "isView": true,
            "source": "view_externalorder",
            "condition": {
              "label": "Equals",
              "value": 1
            },
            "inputtype": "combo",
            "mandatory": true,           
            "childValue": {
              "path": "0-0-0-0",
              "label": "Order Type",
              "value": "Order Type",
              "source": "ordertype",
              "inputtype": "combo",
              "valuemember": "nordertypecode",
              "nquerybuildertablecode": 246
            },
            "parentPath": "0-0-0-0",
            "displayname": {
              "en-US": "Order Id",
              "ru-RU": "Order Id",
              "tg-TG": "Order Id"
            },
            "filtervalue": "",
            "isAddMaster": true,
            "valuemember": "nexternalordercode",
            "filtercolumn": {
              "item": {
                "columnname": "sdisplayname",
                "displayname": {
                  "en-US": "Order Type",
                  "ru-RU": "Идентификатор внешнего заказа",
                  "tg-TG": "Id фармоиши беруна"
                },
                "filterinputtype": "text"
              },
              "type": "static",
              "label": "Order Type",
              "value": "sdisplayname"
            },
            "componentcode": 3,
            "componentname": "Drop Down",
            "displaymember": "sexternalorderid",
            "staticfiltervalue": "",
            "recordbasedreadonly": false,
            "recordbasedshowhide": false,
            "nsystemconfiguration": true,
            "nquerybuildertablecode": 222
          },
          {
            "id": "L7BUKHDn3t",
            "name": "Product Category",
            "label": "Clinical Category",
            "table": {
              "item": {
                "stablename": "productcategory",
                "displayname": "Sample Category"
              },
              "label": "Sample Category",
              "value": "productcategory"
            },
            "column": {
              "item": {
                "pkey": "nproductcatcode",
                "source": "productcategory",
                "default": true,
                "columnname": "sproductcatname",
                "displayname": {
                  "en-US": "Sample Category Name",
                  "ru-RU": "Sample Category Name",
                  "tg-TG": "Sample Category Name"
                },
                "nquerybuildertablecode": "107"
              },
              "label": "Sample Category Name",
              "value": "sproductcatname"
            },
            "source": "productcategory",
            "inputtype": "combo",
            "mandatory": true,
            "childValue": {
              "path": "0-0-1-0",
              "child": [
                {
                  "label": "Sample Category",
                  "childPath": "0-0-3-0",
                  "foriegntablePK": "nproductcatcode",
                  "tablecolumnname": "nproductcatcode"
                },
                {
                  "label": "Date of birth",
                  "childPath": "0-0-4-0"
                },
                {
                  "label": "Gender",
                  "childPath": "0-0-5-0",
                  "foriegntablePK": "ngendercode",
                  "tablecolumnname": "ngendercode"
                },
                {
                  "label": "Patient",
                  "childPath": "0-0-2-0",
                  "foriegntablePK": "spatientid",
                  "tablecolumnname": "spatientid"
                }
              ],
              "label": "Order Id",
              "value": "Order Id",
              "source": "view_externalorder",
              "inputtype": "combo",
              "valuemember": "nexternalordercode",
              "nquerybuildertablecode": 222
            },
            "parentPath": "0-0-1-0",
            "displayname": {
              "en-US": "Clinical Category",
              "ru-RU": "Clinical Category",
              "tg-TG": "Clinical Category"
            },
            "valuemember": "nproductcatcode",
            "componentcode": 3,
            "componentname": "Combo Box",
            "displaymember": "sproductcatname",
            "componentprops": [
              "source",
              "displaymember"
            ],
            "templatemandatory": true,
            "nquerybuildertablecode": "107"
          },
          {
            "id": "hf4Kv2tqku",
            "type": "componentrow",
            "children": [
              {
                "id": "L7BUKHDn3d",
                "name": "Date Of Birth",
                "child": [
                  {
                    "label": "Age",
                    "childPath": "0-0-3-1"
                  }
                ],
                "label": "Date of birth",
                "column": {
                  "item": {
                    "columnname": "ddob",
                    "displayname": {
                      "en-US": "Patient DOB",
                      "ru-RU": "Дата рождения пациента",
                      "tg-TG": "Бемор DOB"
                    },
                    "filterinputtype": "date"
                  },
                  "type": "static",
                  "label": "Patient DOB",
                  "value": "ddob"
                },
                "dateonly": true,
                "readonly": true,
                "timeonly": false,
                "inputtype": "date",
                "mandatory": true,
                "childValue": {
                  "path": "0-0-1-0",
                  "child": [
                    {
                      "label": "Date of birth",
                      "childPath": "0-0-4-0"
                    },
                    {
                      "label": "Gender",
                      "childPath": "0-0-5-0",
                      "foriegntablePK": "ngendercode",
                      "tablecolumnname": "ngendercode"
                    },
                    {
                      "label": "Patient",
                      "childPath": "0-0-2-0",
                      "foriegntablePK": "spatientid",
                      "tablecolumnname": "spatientid"
                    },
                    {
                      "label": "Sample Category",
                      "childPath": "0-0-3-0",
                      "foriegntablePK": "nproductcatcode",
                      "tablecolumnname": "nproductcatcode"
                    }
                  ],
                  "label": "Order Id",
                  "value": "Order Id",
                  "source": "view_externalorder",
                  "inputtype": "combo",
                  "valuemember": "nexternalordercode",
                  "nquerybuildertablecode": 222
                },
                "parentPath": "0-0-1-0",
                "displayname": {
                  "en-US": "Date of birth",
                  "ru-RU": "Date of birth",
                  "tg-TG": "Date of birth"
                },
                "valuemember": "nexternalordercode",
                "componentcode": 4,
                "componentname": "Date",
                "displaymember": "ddob",
                "hideafterdate": true,
                "templatemandatory": true
              },
              {
                "id": "-T2UmWz_z",
                "name": "Age",
                "type": "componentrow",
                "label": "Age",
                "column": {},
                "readonly": true,
                "inputtype": "textinput",
                "childValue": {
                  "path": "0-0-4-0",
                  "child": [
                    {
                      "label": "Age",
                      "childPath": "0-0-4-1"
                    }
                  ],
                  "label": "Date of birth",
                  "value": "Date of birth",
                  "inputtype": "date",
                  "valuemember": "nexternalordercode"
                },
                "parentPath": "0-0-3-0",
                "displayname": {
                  "en-US": "Age",
                  "ru-RU": "Age",
                  "tg-TG": "Age"
                },
                "sfieldlength": "3",
                "componentcode": 1,
                "componentname": "Short Text",
                "templatemandatory": true
              }
            ]
          },
          {
            "id": "-Q8z-kKY3",
            "name": "Gender",
            "type": "component",
            "label": "Gender",
            "table": {
              "item": {
                "nstatus": 0,
                "jsondata": null,
                "nformcode": -3,
                "stablename": "gender",
                "sdisplayname": "Sex",
                "nismastertable": 0,
                "nquerybuildertablecode": 220
              },
              "label": "Sex",
              "value": 220
            },
            "column": {
              "item": {
                "default": true,
                "columnname": "sgendername",
                "displayname": {
                  "en-US": "Gender Name"
                },
                "ismultilingual": true,
                "filterinputtype": "text"
              },
              "type": "dynamic",
              "label": "Gender Name",
              "value": "sgendername"
            },
            "source": "gender",
            "readonly": true,
            "inputtype": "combo",
            "mandatory": true,
            "childValue": {
              "path": "0-0-1-0",
              "child": [
                {
                  "label": "Gender",
                  "childPath": "0-0-5-0",
                  "foriegntablePK": "ngendercode",
                  "tablecolumnname": "ngendercode"
                },
                {
                  "label": "Patient",
                  "childPath": "0-0-2-0",
                  "foriegntablePK": "spatientid",
                  "tablecolumnname": "spatientid"
                },
                {
                  "label": "Sample Category",
                  "childPath": "0-0-3-0",
                  "foriegntablePK": "nproductcatcode",
                  "tablecolumnname": "nproductcatcode"
                },
                {
                  "label": "Date of birth",
                  "childPath": "0-0-4-0"
                }
              ],
              "label": "Order Id",
              "value": "Order Id",
              "source": "view_externalorder",
              "inputtype": "combo",
              "valuemember": "nexternalordercode",
              "nquerybuildertablecode": 222
            },
            "parentPath": "0-0-1-0",
            "displayname": {
              "en-US": "Gender",
              "ru-RU": "Gender",
              "tg-TG": "Gender"
            },
            "valuemember": "ngendercode",
            "componentcode": 3,
            "componentname": "Drop Down",
            "displaymember": "sgendername",
            "isMultiLingual": true,
            "templatemandatory": true,
            "nquerybuildertablecode": 220
          }
        ],
       
      }
    ]
  }
];

export const projectDefaultTemplate = [
  {
    "id": "pv1OWbsMYq",
    "type": "row",
    "children": [
      {
        "id": "Nybc4TT-jv",
        "children": [
          {
            "id": "L7BUKHDn3",
            "name": "Product Category",
            "label": "Sample Category",
            "table": {
              "item": {
                "stablename": "productcategory",
                "displayname": "Sample Category"
              },
              "label": "Sample Category",
              "value": "productcategory"
            },
            "child": [
              {
                "label": "Sample Type",
                "childPath": "0-0-1-0",
                "foriegntablePK": "nproductcatcode",
                "tablecolumnname": "nproductcatcode"
              }
            ],
            "column": {
              "item": {
                "pkey": "nproductcatcode",
                "source": "productcategory",
                "default": true,
                "columnname": "sproductcatname",
                "displayname": {
                  "en-US": "Sample Category Name",
                  "ru-RU": "Sample Category Name",
                  "tg-TG": "Sample Category Name"
                },
                "nquerybuildertablecode": "107"
              },
              "label": "Sample Category Name",
              "value": "sproductcatname"
            },
            "source": "productcategory",
            "inputtype": "combo",
            "mandatory": true,
            "displayname": {
              "en-US": "Sample Category",
              "ru-RU": "Sample Category",
              "tg-TG": "Sample Category"
            },
            "valuemember": "nproductcatcode",
            "componentcode": 3,
            "componentname": "Combo Box",
            "displaymember": "sproductcatname",
            "componentprops": [
              "source",
              "displaymember"
            ],
            "templatemandatory": true,
            "nquerybuildertablecode": "107"
          },
          {
            "id": "wwi4eC9iw",
            "name": "Product",
            "type": "component",
            "label": "Sample Type",
            "table": {
              "item": {
                "stablename": "product",
                "displayname": "Sample Type"
              },
              "label": "Sample Type",
              "value": "product"
            },
            "column": {
              "item": {
                "pkey": "nproductcode",
                "source": "product",
                "default": true,
                "columnname": "sproductname",
                "displayname": {
                  "en-US": "Sample Type",
                  "ru-RU": "Sample Type",
                  "tg-TG": "Sample Type"
                },
                "nquerybuildertablecode": "105"
              },
              "label": "Sample Type",
              "value": "sproductname"
            },
            "source": "product",
            "inputtype": "combo",
            "mandatory": true,
            "displayname": {
              "en-US": "Sample Type",
              "ru-RU": "Sample Type",
              "tg-TG": "Sample Type"
            },
            "valuemember": "nproductcode",
            "componentcode": 3,
            "componentname": "Combo Box",
            "displaymember": "sproductname",
            "componentprops": [
              "source",
              "displaymember"
            ],
            "templatemandatory": true,
            "nquerybuildertablecode": "105",
            "childValue": {
              "path": "0-0-0-0",
              "label": "Sample Category",
              "value": "Sample Category",
              "source": "productcategory",
              "inputtype": "combo",
              "valuemember": "nproductcatcode",
              "nquerybuildertablecode": "107"
            },
            "parentPath": "0-0-0-0",
          },
          {
            "id": "XLM--DaaS",
            "type": "component",
            "child": [
              {
                "label": "Project Code",
                "childPath": "0-0-3-0"
              }
            ],
            "label": "Project Type",
            "table": {
              "item": {
                "nstatus": 0,
                "jsondata": null,
                "nformcode": 163,
                "sformname": null,
                "stablename": "view_memberprojecttype",
                "sdefaultname": null,
                "sdisplayname": "User Project Type",
                "nismastertable": 0,
                "nquerybuildertablecode": 238
              },
              "label": "User Project Type",
              "value": 238
            },
            "column": {
              "item": {
                "default": true,
                "columnname": "sprojecttypename",
                "displayname": {
                  "en-US": "Project Type"
                },
                "filterinputtype": "text"
              },
              "type": "static",
              "label": "Project Type",
              "value": "sprojecttypename"
            },
            "source": "view_memberprojecttype",
            "condition": "",
            "inputtype": "combo",
            "mandatory": true,
            "displayname": {
              "en-US": "Project Type",
              "ru-RU": "Project Type",
              "tg-TG": "Project Type"
            },
            "filtervalue": "",
            "valuemember": "nprojecttypecode",
            "filtercolumn": "",
            "componentcode": 3,
            "componentname": "Drop Down",
            "displaymember": "sprojecttypename",
            "conditionstring": " and nusercode = P$userinfo.nusercode$P",
            "conditionArrayUI": [
              "User = Login User"
            ],
            "conditionArraySQL": [
              " and nusercode = P$userinfo.nusercode$P"
            ],
            "staticfiltertable": "",
            "staticfiltercolumn": "",
            "nsystemconfiguration": false,
            "templatemandatory": true,
            "name":"Project Type",
            "nquerybuildertablecode": 238
          },
          {
            "id": "_g4AGfjFD",
            "type": "component",
            "child": [
              {
                "label": "Project Title",
                "childPath": "0-0-4-0"
              }
            ],
            "label": "Project Code",
            "table": {
              "item": {
                "nstatus": 0,
                "jsondata": null,
                "nformcode": 172,
                "sformname": null,
                "stablename": "view_memberproject",
                "sdefaultname": null,
                "sdisplayname": "User Project",
                "nismastertable": 0,
                "nquerybuildertablecode": 237
              },
              "label": "User Project",
              "value": 351
            },
            "column": {
              "item": {
                "default": true,
                "columnname": "sprojectcode",
                "displayname": {
                  "en-US": "Project Code"
                },
                "filterinputtype": "text"
              },
              "type": "static",
              "label": "Project Code",
              "value": "sprojectcode"
            },
            "source": "view_memberproject",
            "condition": "",
            "inputtype": "combo",
            "mandatory": true,
            "childValue": {
              "path": "0-0-2-0",
              "label": "Project Type",
              "value": "Project Type",
              "source": "view_memberprojecttype",
              "inputtype": "combo",
              "valuemember": "nprojecttypecode",
              "nquerybuildertablecode": 238
            },
            "parentPath": "0-0-2-0",
            "displayname": {
              "en-US": "Project Code",
              "ru-RU": "Project Code",
              "tg-TG": "Project Code"
            },
            "filtervalue": "",
            "valuemember": "nprojectmastercode",
            "filtercolumn": "",
            "componentcode": 3,
            "componentname": "Drop Down",
            "displaymember": "sprojectcode",
            "conditionstring": " and nusercode = P$userinfo.nusercode$P",
            "conditionArrayUI": [
              "User = Login User"
            ],
            "conditionArraySQL": [
              " and nusercode = P$userinfo.nusercode$P"
            ],
            "staticfiltertable": "",
            "staticfiltercolumn": "",
            "nsystemconfiguration": false,
            "templatemandatory": true,
            "name":"Project Code",
            "nquerybuildertablecode": 237
          },
          {
            "id": "vPrvAo-rY",
            "type": "component",
            "label": "Project Title",
            "column": {
              "item": {
                "default": true,
                "columnname": "sprojecttitle",
                "displayname": {
                  "en-US": "Project Title"
                },
                "filterinputtype": "text"
              },
              "type": "static",
              "label": "Project Title",
              "value": "sprojecttitle"
            },
            "readonly": true,
            "inputtype": "textarea",
            "mandatory": false,
            "childValue": {
              "path": "0-0-3-0",
              "label": "Project Code",
              "value": "Project Code",
              "source": "view_memberproject",
              "inputtype": "combo",
              "valuemember": "nprojectmastercode",
              "nquerybuildertablecode": 237
            },
            "parentPath": "0-0-3-0",
            "displayname": {
              "en-US": "Project Title",
              "ru-RU": "Project Title",
              "tg-TG": "Project Title"
            },
            "valuemember": "nprojectmastercode",
            "componentcode": 2,
            "componentname": "Paragarph",
            "displaymember": "sprojecttitle",
            "templatemandatory": true,
            "name":"Project Type",
          }
        ],
        "templatemandatory": true,
      }
    ]
  }
];
