import rsapi from '../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './LoginTypes';
import { toast } from 'react-toastify';
import Axios from 'axios'
import { initRequest } from './LoginAction';
import { sortData } from '../components/CommonScript';
import { intl } from '../components/App';

export function fetchById(languagesParam) {
    return function (dispatch) {
        let primaryKeyField = 0;
        let findIndex = 0;
        let fieldName = "";
        let selectedJsondata;
        let jsondataKeys;
        let URL;
        if (languagesParam.masterData.headername == "Menu") {
            URL = rsapi().post("language/getActiveMenuByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "nmenucode": languagesParam.languagesRow.nmenucode })
            primaryKeyField = languagesParam.languagesRow.nmenucode;
            fieldName = "sdisplayname";
        } else if (languagesParam.masterData.headername == "Module") {
            URL = rsapi().post("language/getActiveModuleByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "nmodulecode": languagesParam.languagesRow.nmodulecode })
            primaryKeyField = languagesParam.languagesRow.nmodulecode
            fieldName = "sdisplayname";
        } else if (languagesParam.masterData.headername == "Forms") {
            URL = rsapi().post("language/getActiveFormByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "nformcode": languagesParam.languagesRow.nformcode })
            primaryKeyField = languagesParam.languagesRow.nformcode;
            fieldName = "sdisplayname";
        } else if (languagesParam.masterData.headername == "Transaction Status") {
            URL = rsapi().post("language/getActiveTransactionStatusByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "ntranscode": languagesParam.languagesRow.ntranscode })
            primaryKeyField = languagesParam.languagesRow.ntranscode;
            jsondataKeys = Object.keys(languagesParam.languagesRow.jsondata)
            fieldName = jsondataKeys;
        } else if (languagesParam.masterData.headername == "Control Master") {
            URL = rsapi().post("language/getActiveControlMasterByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "ncontrolcode": languagesParam.languagesRow.ncontrolcode })
            primaryKeyField = languagesParam.languagesRow.ncontrolcode;
            fieldName = "scontrolids";
        } else if (languagesParam.masterData.headername == "Approval Sub Type") {
            URL = rsapi().post("language/getActiveApprovalSubTypeByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "napprovalsubtypecode": languagesParam.languagesRow.napprovalsubtypecode })
            primaryKeyField = languagesParam.languagesRow.napprovalsubtypecode;
            fieldName = "approvalsubtypename";
        } else if (languagesParam.masterData.headername == "Sample Type") {
            URL = rsapi().post("language/getActiveSampleTypeByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "nsampletypecode": languagesParam.languagesRow.nsampletypecode })
            primaryKeyField = languagesParam.languagesRow.nsampletypecode;
            fieldName = "sampletypename";
        }
        // else if (languagesParam.masterData.headername == "Template Design") {
        //     URL = rsapi().post("language/getActiveTemplateTypeByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "ntemplatetypecode": languagesParam.languagesRow.ntemplatetypecode })
        //     primaryKeyField = languagesParam.languagesRow.ntemplatetypecode;
        //     fieldName = "stemplatetypename";
        // } 
        else if (languagesParam.masterData.headername == "Period") {
            URL = rsapi().post("language/getActivePeriodByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "nperiodcode": languagesParam.languagesRow.nperiodcode })
            primaryKeyField = languagesParam.languagesRow.nperiodcode;
            fieldName = "speriodname";
        } else if (languagesParam.masterData.headername == "Gender") {
            URL = rsapi().post("language/getActiveGenderByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "ngendercode": languagesParam.languagesRow.ngendercode })
            primaryKeyField = languagesParam.languagesRow.ngendercode;
            fieldName = "sgendername";
        } else if (languagesParam.masterData.headername == "Grade") {
            URL = rsapi().post("language/getActiveGradeByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "ngradecode": languagesParam.languagesRow.ngradecode })
            primaryKeyField = languagesParam.languagesRow.ngradecode;
            fieldName = "sdisplayname";
        } else if (languagesParam.masterData.headername == "Scheduler Type") {
            URL = rsapi().post("language/getActiveSchedulerTypeByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "nschedulertypecode": languagesParam.languagesRow.nschedulertypecode })
            primaryKeyField = languagesParam.languagesRow.nschedulertypecode;
            fieldName = "sschedulertypename";
        } else if (languagesParam.masterData.headername == "Query Builder Tables") {
            URL = rsapi().post("language/getActiveQueryBuilderTablesByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "nquerybuildertablecode": languagesParam.languagesRow.nquerybuildertablecode })
            primaryKeyField = languagesParam.languagesRow.nquerybuildertablecode;
            fieldName = "tablename";
        } else if (languagesParam.masterData.headername == "Query Builder Views") {
            URL = rsapi().post("language/getActiveQueryBuilderViewsByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "nquerybuilderviewscode": languagesParam.languagesRow.nquerybuilderviewscode })
            primaryKeyField = languagesParam.languagesRow.nquerybuilderviewscode;
            fieldName = "displayname";
        } else if (languagesParam.masterData.headername == "Query Builder Views Columns") {
            URL = rsapi().post("language/getActiveQueryBuilderViewsColumnsByID", {
                "languagesParam": languagesParam.languagesRow.keys === "conditionfields" ? languagesParam.languagesRow.index - languagesParam.languagesRow.jsondata.selectfields.length : languagesParam.languagesRow.index,
                // "languagesParam": languagesParam.languagesRow.jsondata[languagesParam.languagesRow.keys].findIndex((item) => (item.displayname[languagesParam.userInfo.slanguagetypecode] == languagesParam.languagesRow.sdisplayname ? item : "")), 
                "userinfo": languagesParam.userInfo, "sviewname": languagesParam.languagesRow.sviewname, "keysvalue": languagesParam.languagesRow.keys
            })
            // primaryKeyField = languagesParam.languagesRow.jsondata[languagesParam.languagesRow.keys].findIndex((item) => (item.displayname[languagesParam.userInfo.slanguagetypecode] == languagesParam.languagesRow.sdisplayname ? item : ""));
            // findIndex = languagesParam.languagesRow.jsondata[languagesParam.languagesRow.keys].findIndex((item) => (item.displayname[languagesParam.userInfo.slanguagetypecode] == languagesParam.languagesRow.sdisplayname ? item : ""));
            findIndex = languagesParam.languagesRow.index;
            primaryKeyField = languagesParam.languagesRow.index;
            fieldName = "displayname";
        } else if (languagesParam.masterData.headername == "Multilingual Masters") {
            URL = rsapi().post("language/getActiveMultilingualMastersByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "nmultilingualmasterscode": languagesParam.languagesRow.nmultilingualmasterscode })
            primaryKeyField = languagesParam.languagesRow.nmultilingualmasterscode;
            fieldName = "sdisplayname";
        } else if (languagesParam.masterData.headername == "Material Type") {
            URL = rsapi().post("language/getActiveMaterialTypeByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "nmaterialtypecode": languagesParam.languagesRow.nmaterialtypecode })
            primaryKeyField = languagesParam.languagesRow.nmaterialtypecode;
            fieldName = "smaterialtypename";
        } else if (languagesParam.masterData.headername == "Interface Type") {
            URL = rsapi().post("language/getActiveInterfaceTypeByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "ninterfacetypecode": languagesParam.languagesRow.ninterfacetypecode })
            primaryKeyField = languagesParam.languagesRow.ninterfacetypecode;
            fieldName = "sinterfacetypename";
        } else if (languagesParam.masterData.headername == "Audit Action Filter") {
            URL = rsapi().post("language/getActiveAuditActionFilterByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "nauditactionfiltercode": languagesParam.languagesRow.nauditactionfiltercode })
            primaryKeyField = languagesParam.languagesRow.nauditactionfiltercode;
            fieldName = "sdisplayname";
        } else if (languagesParam.masterData.headername == "Attachment Type") {
            URL = rsapi().post("language/getActiveAttachmentTypeByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "nattachmenttypecode": languagesParam.languagesRow.nattachmenttypecode })
            primaryKeyField = languagesParam.languagesRow.nattachmenttypecode;
            fieldName = "sattachmenttype";
        } else if (languagesParam.masterData.headername == "FTP Type") {
            URL = rsapi().post("language/getActiveFTPTypeByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "nftptypecode": languagesParam.languagesRow.nftptypecode })
            primaryKeyField = languagesParam.languagesRow.nftptypecode;
            fieldName = "sftptypename";
        } else if (languagesParam.masterData.headername == "Report Type") {
            URL = rsapi().post("language/getActiveReportTypeByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "nreporttypecode": languagesParam.languagesRow.nreporttypecode })
            primaryKeyField = languagesParam.languagesRow.nreporttypecode;
            fieldName = "sdisplayname";
        } else if (languagesParam.masterData.headername == "COAReport Type") {
            URL = rsapi().post("language/getActiveCOAReportTypeByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "ncoareporttypecode": languagesParam.languagesRow.ncoareporttypecode })
            primaryKeyField = languagesParam.languagesRow.ncoareporttypecode;
            fieldName = "sdisplayname";
        } else if (languagesParam.masterData.headername == "React Components") {
            URL = rsapi().post("language/getActiveReactComponentByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "nreactcomponentcode": languagesParam.languagesRow.nreactcomponentcode })
            primaryKeyField = languagesParam.languagesRow.nreactcomponentcode;
            fieldName = "componentname";
        } else if (languagesParam.masterData.headername == "Functions") {
            URL = rsapi().post("language/getActiveFunctionsByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "nfunctioncode": languagesParam.languagesRow.nfunctioncode })
            primaryKeyField = languagesParam.languagesRow.nfunctioncode;
            fieldName = "sdisplayname";
        } else if (languagesParam.masterData.headername == "Dynamic Formula Fields") {
            URL = rsapi().post("language/getActiveDynamicFormulaFieldByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "ndynamicformulafieldcode": languagesParam.languagesRow.ndynamicformulafieldcode })
            primaryKeyField = languagesParam.languagesRow.ndynamicformulafieldcode;
            fieldName = "sdisplayname";
        } else if (languagesParam.masterData.headername == "Chart Type") {
            URL = rsapi().post("language/getActiveChartTypeByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "ncharttypecode": languagesParam.languagesRow.ncharttypecode })
            primaryKeyField = languagesParam.languagesRow.ncharttypecode;
            fieldName = "sdisplayname";
        } else if (languagesParam.masterData.headername == "Design Components") {
            URL = rsapi().post("language/getActiveDesignComponentByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "ndesigncomponentcode": languagesParam.languagesRow.ndesigncomponentcode })
            primaryKeyField = languagesParam.languagesRow.ndesigncomponentcode;
            fieldName = "sdisplayname";
        } else if (languagesParam.masterData.headername == "CheckList Component") {
            URL = rsapi().post("language/getActiveCheckListComponentByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "nchecklistcomponentcode": languagesParam.languagesRow.nchecklistcomponentcode })
            primaryKeyField = languagesParam.languagesRow.nchecklistcomponentcode;
            fieldName = "sdisplayname";
        } else if (languagesParam.masterData.headername == "Generic Label") {
            URL = rsapi().post("language/getActiveGenericLabelByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "ngenericlabelcode": languagesParam.languagesRow.ngenericlabelcode })
            primaryKeyField = languagesParam.languagesRow.ngenericlabelcode;
            fieldName = "sdisplayname";
        } else if (languagesParam.masterData.headername == "Query Builder Table Columns") {
            URL = rsapi().post("language/getActiveQueryBuilderTableColumnsByID", { "languagesParam": languagesParam.languagesRow[languagesParam.masterData.selectedQueryBuilderScolumnList[0].scolumnname] && languagesParam.languagesRow[languagesParam.masterData.selectedQueryBuilderScolumnList[0].scolumnname].value, "userinfo": languagesParam.userInfo, "nquerybuildertablecode": languagesParam.languagesRow.nquerybuildertablecode, "tablecolumnname": languagesParam.masterData.selectedQueryBuilderScolumnList[0].scolumnname, "sdisplayname": languagesParam.languagesRow.sdisplayname, "scolumnname": languagesParam.languagesRow.scolumnname.value })
            primaryKeyField = languagesParam.languagesRow.index;
            fieldName = "displayname";
        } else if (languagesParam.masterData.headername == "Dynamic Audit Table") {
            URL = rsapi().post("language/getActiveDynamicAuditTableByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "ndynamicaudittablecode": languagesParam.languagesRow.ndynamicaudittablecode, "subsampleenabledisable": languagesParam.languagesRow.fieldname, "keyname": Object.keys(JSON.parse(languagesParam.languagesRow.jsondata.value))[0], "conditioncheck": languagesParam.languagesRow.jsondata.value })
            primaryKeyField = languagesParam.languagesRow.index;
            fieldName = Object.keys(JSON.parse(languagesParam.languagesRow.jsondata.value))[0];
        } else if (languagesParam.masterData.headername == "Mapped Template Field Props") {
            URL = rsapi().post("language/getActiveMappedTemplateFieldPropsByID", { "languagesParam": languagesParam.languagesRow.sdisplayname, "userinfo": languagesParam.userInfo, "nmappedtemplatefieldpropcode": languagesParam.masterData.selectedLstMappedTemplateFieldProps && languagesParam.masterData.selectedLstMappedTemplateFieldProps[0].nmappedtemplatefieldpropcode, "indexQualisforms": languagesParam.masterData.selectedLstQualisforms && languagesParam.masterData.selectedLstQualisforms[0].indexQualisforms, "nformcode": languagesParam.masterData.selectedLstQualisforms && languagesParam.masterData.selectedLstQualisforms[0].nformcode, "sformname": languagesParam.masterData.selectedLstQualisforms && languagesParam.masterData.selectedLstQualisforms[0].sformname, "indexPropertiesKey": languagesParam.masterData.selectedLstSampleItems && languagesParam.masterData.selectedLstSampleItems[0].indexPropertiesKey, "indexPropertiesValue": languagesParam.masterData.selectedLstSampleItems && languagesParam.masterData.selectedLstSampleItems[0].indexPropertiesValue, "indexFieldKey": languagesParam.masterData.selectedLstSampleField && languagesParam.masterData.selectedLstSampleField[0].indexFieldKey, "indexFieldValue": languagesParam.masterData.selectedLstSampleField && languagesParam.masterData.selectedLstSampleField[0].indexFieldValue, "index": languagesParam.languagesRow.index })
            primaryKeyField = languagesParam.languagesRow.index;
            fieldName = languagesParam.masterData.selectedLstSampleField && (languagesParam.masterData.selectedLstSampleField[0].indexFieldValue === "selectfields" || languagesParam.masterData.selectedLstSampleField[0].indexFieldValue === "conditionfields" || languagesParam.masterData.selectedLstSampleField[0].indexFieldValue === "querybuildertablecolumnsfordynamicview") ? "displayname" : "1";
        }
        dispatch(initRequest(true));
        Axios.all([URL])
            .then(response => {
                response[0].data.sjsondata = response[0].data.sjsondata && response[0].data.sjsondata.value ? JSON.parse(response[0].data.sjsondata.value) : response[0].data.sjsondata;
                const selectedRecord = {
                    ...languagesParam.selectedRecord,
                    ...response[0].data.sjsondata,
                    ...response[0].data,
                    ...response[0].data.jsondata, fieldName,
                    selectedJsondata,
                    findIndex, keys: languagesParam.languagesRow.keys,
                    //jsondata:languagesParam.masterData.headername == "Query Builder Views Columns"? languagesParam.languagesRow.jsondata:response[0].data.jsondata
                }
                delete (selectedRecord.esigncomments);
                delete (selectedRecord.esignpassword);
                delete (selectedRecord.esignreason);
                delete (selectedRecord.agree);
                dispatch({
                    type: DEFAULT_RETURN, payload: {
                        selectedRecord,
                        operation: languagesParam.operation,
                        openModal: true,
                        screenName: languagesParam.screenName,
                        ncontrolcode: languagesParam.ncontrolCode,
                        loading: false, selectedId: primaryKeyField,
                        data: undefined, dataState: undefined,
                    }
                });
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          dispatch({
            type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}

export function comboService(methodParam) {
    return function (dispatch) {
        let URL;
        let needHeader;
        if (methodParam.item.displayname == "Menu") {
            URL = rsapi().post("language/getMenuComboService", { "userinfo": methodParam.userinfo, "nmenucode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "Module") {
            URL = rsapi().post("language/getModuleComboService", { "userinfo": methodParam.userinfo, "nmodulecode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "Forms") {
            URL = rsapi().post("language/getFormComboService", { "userinfo": methodParam.userinfo, "nformcode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "Transaction Status") {
            URL = rsapi().post("language/getTransactionStatusComboService", { "userinfo": methodParam.userinfo, "ntranscode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "Control Master") {
            URL = rsapi().post("language/getControlMasterComboService", { "userinfo": methodParam.userinfo, "ncontrolcode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "Approval Sub Type") {
            URL = rsapi().post("language/getApprovalSubTypeComboService", { "userinfo": methodParam.userinfo, "napprovalsubtypecode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "Sample Type") {
            URL = rsapi().post("language/getSampleTypeComboService", { "userinfo": methodParam.userinfo, "nsampletypecode": methodParam.inputData.primarykey })
        }
        // else if (methodParam.item.displayname == "Template Design") {
        //     URL = rsapi().post("language/getTemplateTypeComboService", { "userinfo": methodParam.userinfo, "ntemplatetypecode": methodParam.inputData.primarykey })
        // }
        else if (methodParam.item.displayname == "Period") {
            URL = rsapi().post("language/getPeriodComboService", { "userinfo": methodParam.userinfo, "nperiodcode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "Gender") {
            URL = rsapi().post("language/getGenderComboService", { "userinfo": methodParam.userinfo, "ngendercode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "Grade") {
            URL = rsapi().post("language/getGradeComboService", { "userinfo": methodParam.userinfo, "ngradecode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "Scheduler Type") {
            URL = rsapi().post("language/getSchedulerTypeComboService", { "userinfo": methodParam.userinfo, "nschedulertypecode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "Query Builder Tables") {
            URL = rsapi().post("language/getQueryBuilderTablesComboService", { "userinfo": methodParam.userinfo, "nquerybuildertablecode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "Query Builder Views") {
            URL = rsapi().post("language/getQueryBuilderViewsComboService", { "userinfo": methodParam.userinfo, "nquerybuilderviewscode": methodParam.inputData.primarykey })
        }
        else if ((methodParam.item.displayname == "Query Builder Views Columns" || methodParam.masterData.headername == "Query Builder Views Columns")) {
            URL = rsapi().post("language/getQueryBuilderViewsColumnsComboService", { "userinfo": methodParam.userinfo, "sviewname": methodParam.inputData.item.displayname ? methodParam.inputData.item.displayname : methodParam.inputData.sdisplayname })
        }
        else if (methodParam.item.displayname == "Material Config") {
            URL = rsapi().post("language/getMaterialConfigComboService", { "userinfo": methodParam.userinfo, "nmaterialconfigcode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "Multilingual Masters") {
            URL = rsapi().post("language/getMultilingualMastersComboService", { "userinfo": methodParam.userinfo, "nmultilingualmasterscode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "Material Type") {
            URL = rsapi().post("language/getMaterialTypeComboService", { "userinfo": methodParam.userinfo, "nmaterialtypecode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "Interface Type") {
            URL = rsapi().post("language/getInterfaceTypeComboService", { "userinfo": methodParam.userinfo, "ninterfacetypecode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "Audit Action Filter") {
            URL = rsapi().post("language/getAuditActionFilterComboService", { "userinfo": methodParam.userinfo, "nauditactionfiltercode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "Attachment Type") {
            URL = rsapi().post("language/getAttachmenttypeComboService", { "userinfo": methodParam.userinfo, "nattachmenttypecode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "FTP Type") {
            URL = rsapi().post("language/getFTPtypeComboService", { "userinfo": methodParam.userinfo, "nftptypecode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "Report Type") {
            URL = rsapi().post("language/getReportTypeComboService", { "userinfo": methodParam.userinfo, "nreporttypecode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "COA Report Type") {
            URL = rsapi().post("language/getCOAReportTypeComboService", { "userinfo": methodParam.userinfo, "ncoareporttypecode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "React Components") {
            URL = rsapi().post("language/getReactComponentsComboService", { "userinfo": methodParam.userinfo, "nreactcomponentcode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "Functions") {
            URL = rsapi().post("language/getFunctionsComboService", { "userinfo": methodParam.userinfo, "nfunctioncode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "Dynamic Formula Fields") {
            URL = rsapi().post("language/getDynamicFormulaFieldsComboService", { "userinfo": methodParam.userinfo, "ndynamicformulafieldcode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "Chart Type") {
            URL = rsapi().post("language/getChartTypeComboService", { "userinfo": methodParam.userinfo, "ncharttypecode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "Design Components") {
            URL = rsapi().post("language/getDesignComponentsComboService", { "userinfo": methodParam.userinfo, "ndesigncomponentcode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "CheckList Component") {
            URL = rsapi().post("language/getCheckListComponentService", { "userinfo": methodParam.userinfo, "nchecklistcomponentcode": methodParam.inputData.primarykey })
        }
        else if (methodParam.item.displayname == "Generic Label") {
            URL = rsapi().post("language/getGenericLabelService", { "userinfo": methodParam.userinfo, "ngenericlabelcode": methodParam.inputData.primarykey })
        }
        // else if ((methodParam.item.displayname == "Query Builder Views Columns" || methodParam.masterData.headername == "Query Builder Views Columns")) {
        //     URL = rsapi().post("language/getQueryBuilderViewsColumnsComboService", { "userinfo": methodParam.userinfo, "sviewname": methodParam.inputData.sdisplayname })
        // }
        else if ((methodParam.item.displayname === "Query Builder Table Columns" || methodParam.masterData.headername === "Query Builder Table Columns")) {
            URL = rsapi().post("language/getQueryBuilderTableColumnsService", { "userinfo": methodParam.userinfo, "nquerybuildertablecode": methodParam.inputData.fieldName ? methodParam.inputData.fieldName === "nquerybuildertablecode" ? methodParam.inputData.primarykey : methodParam.inputData.selectedvalues[0].value : null, "tablecolumnname": methodParam.inputData.fieldName ? methodParam.inputData.fieldName === "nquerybuildertablecode" ? null : methodParam.inputData.sdisplayname : null })
        }
        else if (methodParam.item.displayname == "Dynamic Audit Table" || methodParam.masterData.headername === "Dynamic Audit Table") {
            URL = rsapi().post("language/getDynamicAuditTableService", { "userinfo": methodParam.userinfo, "ndynamicaudittablecode": methodParam.inputData.fieldName ? methodParam.inputData.primarykey : null, "nformcode": methodParam.inputData.fieldName ? methodParam.inputData.formPrimayKey : null })
        }
        else if (methodParam.item.displayname == "Mapped Template Field Props" || methodParam.masterData.headername === "Mapped Template Field Props") {
            URL = rsapi().post("language/getMappedTemplateFieldPropsService", { "userinfo": methodParam.userinfo, "nmappedtemplatefieldpropcode": methodParam.inputData.fieldName ? methodParam.inputData.fieldName === "nmappedtemplatefieldpropcode" ? methodParam.inputData.primarykey : methodParam.masterData.selectedLstMappedTemplateFieldProps ? methodParam.masterData.selectedLstMappedTemplateFieldProps[0].nmappedtemplatefieldpropcode : null : null, "indexQualisforms": methodParam.inputData.fieldName ? methodParam.inputData.fieldName === "indexQualisforms" ? methodParam.inputData.item.indexQualisforms : (methodParam.inputData.fieldName === "indexPropertiesKey" || methodParam.inputData.fieldName === "indexFieldKey") ? methodParam.masterData.selectedLstQualisforms ? methodParam.masterData.selectedLstQualisforms[0].indexQualisforms : null : null : null, "indexPropertiesKey": methodParam.inputData.fieldName ? methodParam.inputData.fieldName === "indexPropertiesKey" ? methodParam.inputData.item.indexPropertiesKey : methodParam.inputData.fieldName === "indexFieldKey" ? methodParam.masterData.selectedLstSampleItems ? methodParam.masterData.selectedLstSampleItems[0].indexPropertiesKey : null : null : null, "indexFieldKey": methodParam.inputData.fieldName && methodParam.inputData.fieldName === "indexFieldKey" ? methodParam.inputData.item.indexFieldKey : null })
        }

        dispatch(initRequest(true));
        Axios.all([URL])
            .then(response => {
                let masterData;
                const selectedRecord = { ...methodParam.sdisplayname, nquerybuilderviewscode: undefined };
                masterData = {
                    ...methodParam.inputData.item,
                    ...response[0].data
                };
                sortData(masterData)
                dispatch({ type: DEFAULT_RETURN, payload: { selectedRecord, masterData, loading: false, data: undefined, dataState: undefined, selectedId: null } })
            })
            .catch(error => {
                dispatch({ type: DEFAULT_RETURN, payload: { loading: false } })
                if (error.response?.status === 429) {
                    toast.warn(intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
                    dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
                } else if (error.response?.status === 401 || error.response?.status === 403) {
          dispatch({
            type: UN_AUTHORIZED_ACCESS,
                        payload: {
                            navigation: 'forbiddenaccess',
                            loading: false,
                            responseStatus: error.response.status
                        }
            
          });
        } else if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }
}
