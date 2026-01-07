//import { CommonDragLogic } from '@progress/kendo-react-grid/dist/npm/drag/CommonDragLogic';
import { toast } from 'react-toastify';
import { rearrangeDateFormatforKendoDataTool } from '../actions';
import { checkBoxOperation, designProperties, transactionStatus } from './Enumeration';
//import CryptoJS from 'crypto-js';
//import CryptoJS from 'crypto-js';
import CryptoJS from 'crypto-js';
import { intl } from '../components/App';

//added by perumalraj on 07-08-2020
export function extractFieldHeader(fieldList) {
  let columnList = [];
  if (fieldList !== undefined && fieldList.length !== 0) {
    columnList = fieldList.filter(function (value, index, arr) {
      return (value["controlType"] !== "NA");
    });
  }
  return columnList;
}
export function ltrim(text) {
  if (text !== undefined) {
    return text.replace(/^\s+/, "").replace(/\\n/g, '')
  }

}
export function whitespaceTrim(event) {
  if (event.target !== undefined)
    event.target.value = event.target.value.trim()
  return event
}
export function rtrim(text) {
  if (text !== undefined && text !== "")
    return text.replace(/\s+$/, "");
}
export function getCurrentDateTime() {
  const tempDate = new Date();
  const date = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate() + ' ' + tempDate.getHours() + ':' + tempDate.getMinutes() + ':' + tempDate.getSeconds();
  return date;
}

// Added by maruthu
export function validateNumberOnly(inputValue) {
  let output = "";
  let regAllow = /^[0-9]+$/; //Only Numeric 0 to 1 only allowed.
  if (inputValue.match(regAllow)) {

    output = inputValue;
  }
  return output;
}

export function sortData(masterData, sortType, columnName) {
  if (masterData) {
    if (Array.isArray(masterData)) {
      sortByField(masterData, sortType, columnName);
    }
    else {
      Object.keys(masterData).map((data) => {
        if (Array.isArray(masterData[data])) {
          sortByField(masterData[data], sortType, columnName)
        }
        return null;
      });
    }
  }
  return masterData;
}

// export function sortDataForDate(sampleList){
//   let value=[];
//   sampleList.map((item,index)=> {
//     const valueFormed={"dtransactiondate":new Date(item.dtransactiondate),...sampleList[index]}
//     value.push(valueFormed)})
//     sampleList = value.sort(compareDatetime);
//     sampleList.reverse();
//      // (objA, objB) => Number(objA.dtransactiondate) - Number(objB.dtransactiondate),
//    // );
//     return sampleList;
//   }

export function sortDataForDate(sampleList,DateColumn,AdditionalColumn){
  let value=[];
  sampleList.map((item,index)=> {
    const valueFormed={
      //DateColumn:new Date(item[DateColumn]),
      ...sampleList[index]}
    value.push(valueFormed)})
    sampleList = value.sort((a,b)=>{
    const dateValueA = new Date(a[DateColumn]).getTime();
    const dateValueB = new Date(b[DateColumn]).getTime();
    const valueA=a[AdditionalColumn];
    const valueB=b[AdditionalColumn];
    if(dateValueA === dateValueB){
     return valueA-valueB
     //valueA.toString().localeCompare(valueB.toString())
    }else{
      return dateValueA - dateValueB;
    }
   });
    // sampleList = value.sort(compareDatetime);
    sampleList.reverse();
    // (objA, objB) => Number(objA.dtransactiondate) - Number(objB.dtransactiondate),
    // );
    return sampleList;
  }
   
  function compareDatetime(a, b) {
    const dateA = new Date(a.dtransactiondate).getTime();
    const dateB = new Date(b.dtransactiondate).getTime();
    const sarnoA=a.sarno;
    const sarnoB=b.sarno;
    if(dateA === dateB){
     return sarnoA.toString().localeCompare(sarnoB.toString())
     // sarnoA-sarnoB
     
    }else{
      return dateA - dateB;
    }
  }
   export function sortDataByParent(masterData,parentList,columnName){
    let childDataList=[];
    parentList.map(item=>{
      masterData.map(item1=>{
        if(item[columnName]===item1[columnName]){
          childDataList.push(item1);
        }
      })
    })
    return childDataList;
   }



export function sortByField(masterData, sortType, columnName) {
  if (masterData !== undefined && masterData.length > 0) {
    if (columnName === undefined || columnName === null) {
      if (masterData[0] !== undefined) {
        columnName = Object.keys(masterData[0])[0];
      }
    }
    if (sortType === "ascending") {
      masterData.sort((obj1, obj2) => obj1[columnName] !== null && obj2[columnName] !== null ?
        ((typeof (obj1[columnName]) === 'string' && typeof (obj2[columnName]) === 'string') ?
          obj1[columnName].toLowerCase() > obj2[columnName].toLowerCase() ? 1 : -1
          : obj1[columnName] > obj2[columnName] ? 1 : -1)
        : ""
      );

    }
    else {
      // console.log(columnName)
      masterData.sort((obj1, obj2) => obj1[columnName] !== null && obj2[columnName] !== null ?
        ((typeof (obj1[columnName]) === 'string' && typeof (obj2[columnName]) === 'string') ?
          obj1[columnName].toLowerCase() < obj2[columnName].toLowerCase() ? 1 : -1
          : obj1[columnName] < obj2[columnName] ? 1 : -1)
        : ""
      );
    }
  }
  return masterData;
}

export function searchData(filterValue, originalData, fieldList,filterOperator) {
  let searchedData = [];
  if (originalData && originalData.length > 0) {
    let temp = originalData.filter(item => {
      const itemArray = [];
      fieldList.map(itemKey =>
        item[itemKey] && item[itemKey] !== null ?
          itemArray.push(typeof item[itemKey] === "string" ? item[itemKey].toLowerCase()
            : item[itemKey].toString().toLowerCase())
          : "")
      //   console.log(itemArray.findIndex(element => element.includes(filterValue.toLowerCase())) > -1)
      //  console.log(filterValue.toLowerCase())
     // return itemArray.findIndex(element => element.includes(filterValue.toLowerCase())) > -1
      //   return itemArray.findIndex(element => element.includes(filterValue.toLowerCase())) > -1

		  //To search data based on startswith,endswith etc., which is defined in database --ALPD-4167 ,work done by Dhanushya R I

      if (filterOperator) {
        return eval(filterOperator) > -1;
      }
      else {
      return itemArray.findIndex(element => element.includes(filterValue.toLowerCase())) > -1
      }
    }
    )
    searchedData = temp;
  }
  return searchedData;
}
//end- search logic

//For Searching Json Data
export function searchJsonData(filterValue, originalData, fieldList) {
  let searchedData = [];

  if (originalData.length > 0) {
    let temp = originalData.filter(item => {
      const itemArray = [];
      fieldList.map(itemKey =>
        itemKey.jsonfeild ?
          item[itemKey.jsonfeild][itemKey.feild] && item[itemKey.jsonfeild][itemKey.feild] !== null ?
            itemArray.push(typeof item[itemKey.jsonfeild][itemKey.feild] === "string" ? item[itemKey.jsonfeild][itemKey.feild].toLowerCase()
              : item[itemKey.jsonfeild][itemKey.feild].toString().toLowerCase())
            : ""
          :
          item[itemKey.feild] && item[itemKey.feild] !== null ?
            itemArray.push(typeof item[itemKey.feild] === "string" ?
              item[itemKey.feild].toLowerCase()
              : item[itemKey.feild].toString().toLowerCase())
            : "")
      //   console.log(itemArray.findIndex(element => element.includes(filterValue.toLowerCase())) > -1)
      //  console.log(filterValue.toLowerCase())
      return itemArray.findIndex(element => element.includes(filterValue.toLowerCase())) > -1
    }
    )
    searchedData = temp;
  }
  return searchedData;
}



//Given by Perumal
//To get Label Value Pair for a search select combo box
export function getComboLabelValue(selectedItem, optionList, findKey, labelKey, jsonfeild, slanguagetypecode) {

  let lblValueList = [];
  optionList.map((option) => {
    if (option[jsonfeild]) {
      if (selectedItem && selectedItem[findKey] === option[findKey]) {
        lblValueList.push({
          "value": option[findKey], "label": option[jsonfeild][labelKey][slanguagetypecode] ?
            option[jsonfeild][labelKey][slanguagetypecode] : option[jsonfeild][labelKey]
        })
      }
      return null;
    }
    else {
      if (selectedItem && selectedItem[findKey] === option[findKey]) {
        lblValueList.push({ "value": option[findKey], "label": option[labelKey] })
      }
      return null;
    }

  })
  return selectedItem[findKey] = lblValueList[0];
}

// To provide esign rights
export function showEsign(itemMap, nformcode, ncontrolcode) {
  const controlList = itemMap[nformcode] ? Object.values(itemMap[nformcode]) : [];
  const index = controlList.findIndex(x => x.ncontrolcode === ncontrolcode);
  return controlList[index] && controlList[index].nneedesign === transactionStatus.YES ? true : false;
}

// SWSM-48 - Added by gowtham(18-09-2025) - to get user email for E-sign mail authentication
export function showEsignOTP(itemMap, nformcode, ncontrolcode) {
  const controlList = itemMap[nformcode] ? Object.values(itemMap[nformcode]) : [];
  const index = controlList.findIndex(x => x.ncontrolcode === ncontrolcode);
  return controlList[index] && controlList[index].nneedemailotp === transactionStatus.YES ? true : false;
}
//INVOICE MODULE - 24-SEP-2025
// To provide control rights
export function getControlMap(itemMap, nformcode) {
  const controlList = itemMap ? itemMap[nformcode] ? Object.values(itemMap[nformcode]) : [] : [];
  const controlMap = new Map();
  controlList.map(item => {
    return controlMap.set(item.scontrolname, { ...item })
  })
  return controlMap;
}

export function formatDate(date, dateType) {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = '' + d.getFullYear(),
    hour = '' + d.getHours(),
    min = '' + d.getMinutes(),
    sec = '' + d.getSeconds();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  if (hour.length < 2) hour = '0' + hour;
  if (min.length < 2) min = '0' + min;
  if (sec.length < 2) sec = '0' + sec;

  return [year, month, day].join('-').concat(" " + hour + ":" + min + ":" + sec);

  // if(dateType === "dateonly"){
  //   return [year, month, day].join('-')
  // }
  // else if(dateType === "timeonly"){
  //   return [hour + ":" + min + ":" + sec];
  // }
  // else{
  //   return [year, month, day].join('-').concat(" " + hour + ":" + min + ":" + sec);
  // }  
}

export function getStartOfDay(date) {
  date.setHours(0, 0, 0);
  return formatDate(date);
}

export function getEndOfDay(date) {
  date.setHours(23, 59, 59);
  return formatDate(date);
}

export function getDateByMinutes(date, holdMinutes) {
  const someDate = new Date(date);
  const adjustedDate = new Date(someDate);
  return adjustedDate.setMinutes(someDate.getMinutes() + holdMinutes);
}

export function validateTwoDigitDate(value) {
  if (value.length === 1) {
    value = "0".concat(value);
  }
  return value;
}

// To provide esign rights for child Tabs
export function showEsignForChildTabs(itemMap, ncontrolcode) {
  //  const controlList = itemMap[nformcode] ? Object.values(itemMap[nformcode]) : [];
  const index = itemMap.findIndex(x => x.ncontrolcode === ncontrolcode);
  return itemMap[index] && itemMap[index].nneedesign === 3 ? true : false;
}

export function addDays(dateValue, daysToAdd) {
  const copy = new Date(Number(dateValue))
  copy.setDate(dateValue.getDate() + daysToAdd);
  return copy;
}
//INVOICE MODULE - 24-SEP-2025
export function validatePhoneNumber(inputValue) {
  let output = "";
  // Get the regular expression to test against for this particular object
  let regAllow = /^[0-9,',',\n,\s,[,\], '+',-]+$/;
  // Check for an allowed character, if not found, cancel the keypress's event bubbling
  if (inputValue.match(regAllow)) {
    // Do nothing, i.e. allow.
    output = inputValue;
  }
  return output;
}

export function validateDays(inputValue) {
  let output = "";
  let isTrue = false;
  let regAllow = /^[+|-]?[0-9]+$/
  if (inputValue.length > 1) {
    const s = inputValue.substring(inputValue.length - 1)
    if (s !== "+" && s !== "-") {
      isTrue = regAllow.test(inputValue);
    }
  } else {
    const s = inputValue.substring(inputValue.length - 1)
    if (s !== "+" && s !== "-") {
      isTrue = regAllow.test(inputValue);
    } else {
      isTrue = true
    }
  }
  if (isTrue) {
    output = inputValue;
  }
  return output;
}

export function validateCreateView(inputValue) {
  const regAllow = /^[a-z0-9_]+$/
  const regLagAllow =/[а-яЁё]/
  const regStringAllow =/^[a-z]+$/
  //  /[а-яЁё]/
  //  /^[a-z]+$/
 //return  regStringAllow.test(inputValue[0]) ? regAllow.test(inputValue[inputValue.length-1]) ?
 // inputValue : ""  : regStringAllow.test(inputValue) ? inputValue : "";
     return  regLagAllow.test(inputValue[inputValue.length-1]) ? 
     inputValue : regStringAllow.test(inputValue[inputValue.length-1]) ? inputValue : inputValue.length>1?regAllow.test(inputValue[inputValue.length-1])?inputValue: "":"";
}


export function validateEmail(inputValue) {
  let output = true;
  const emailAddresses = inputValue.split(',');
  //let regAllow = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //checks for presence of '@', '.' and 2 characters after '.'
  //let regAllow = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  //let regAllow = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g;

  //A form with an email field that that must be in the following order: characters@characters.domain 
  //(characters followed by an @ sign, followed by more characters, and then a ".". After the "." sign, you can only write 2 to 3 letters from a to z:

  //commented by sonia on 05th May 2025 for jira id:ALPD-5851
  //let regAllow = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  //Added by sonia on 05th May 2025 for jira id:ALPD-5851
  let regAllow = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

  // Check for an allowed character, if not found, cancel the keypress's event bubbling
  for (const emailAddress of emailAddresses) {
    if (!emailAddress.match(regAllow)) {
      // If any email address is invalid, return false
      output = false;
      break;
    }
  }
  // if (inputValue.match(regAllow)) {

  //   // Do nothing, i.e. allow.
  //   output = true;//inputValue;
  // }
  return output;
}
//INVOICE MODULE - 24-SEP-2025
export function formatInputDate(date, includeMilliseconds) {
  let formattedDate = "";
  if (includeMilliseconds) {
    formattedDate = date.getFullYear() + "-" +
      ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
      ("00" + date.getDate()).slice(-2) +
      'T' +
      ("00" + date.getHours()).slice(-2) + ":" +
      ("00" + date.getMinutes()).slice(-2) + ":" +
      ("00" + date.getSeconds()).slice(-2)
      + "." +
      ("000" + date.getMilliseconds()).slice(-3) + "Z";
  }
  else {
    formattedDate = date.getFullYear() + "-" +
      ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
      ("00" + date.getDate()).slice(-2) +
      'T' +
      ("00" + date.getHours()).slice(-2) + ":" +
      ("00" + date.getMinutes()).slice(-2) + ":" +
      ("00" + date.getSeconds()).slice(-2) + "Z";
  }
  return formattedDate;
}

export function formatInputDateWithoutT(date, includeMilliseconds) {
  let formattedDate = "";
  if (includeMilliseconds) {
    formattedDate = date.getFullYear() + "-" +
      ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
      ("00" + date.getDate()).slice(-2) + " " +
      ("00" + date.getHours()).slice(-2) + ":" +
      ("00" + date.getMinutes()).slice(-2) + ":" +
      ("00" + date.getSeconds()).slice(-2)
      + "." +
      ("000" + date.getMilliseconds()).slice(-3);
  }
  else {
    formattedDate = date.getFullYear() + "-" +
      ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
      ("00" + date.getDate()).slice(-2) + " " +
      ("00" + date.getHours()).slice(-2) + ":" +
      ("00" + date.getMinutes()).slice(-2) + ":" +
      ("00" + date.getSeconds()).slice(-2);
  }
  return formattedDate;
}

export function create_UUID() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === 'x' ? r : (r && 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

//added by perumalraj on 03/11/2020
//compare two arrays of object and filter the record which are not present in the second array and vice versa
// export function filterRecordBasedOnTwoArrays(firstArray, secondArray, PrimaryKey,SecondaryKey) {
//   let filterArray;
//     if(SecondaryKey !==undefined){
//       filterArray = firstArray.filter(function (x) {
//         return !secondArray.some(function (y) {
//           //console.log(y)
//           return x[PrimaryKey] === y[PrimaryKey] || x[SecondaryKey] === y[SecondaryKey]
//         })
//       });
//     }else{
//       filterArray = firstArray.filter(function (x) {
//         return !secondArray.some(function (y) {
//           //console.log(y)
//           return x[PrimaryKey] === y[PrimaryKey]
//         })
//       });
//     } 
//   return filterArray;
// }

export function filterRecordBasedOnTwoArrays(firstArray, secondArray, PrimaryKey) {
  const filterArray = firstArray.filter(function (x) {
    return !secondArray.some(function (y) {
      //console.log(y)
      return x[PrimaryKey] === y[PrimaryKey]
    })
  });
  return filterArray;
}

export function listDataFromDynamicArray(arr, indexvalue) {
  return arr && arr.filter(x => x[indexvalue]);
}

// export const fileViewURL = 'http://192.168.0.79:8097/';

//Added by P.Sudharshanan
export function replaceUpdatedObject(newList, oldList, primaryKey) {
  newList && newList.length > 0 && newList.map(newlistItem => {
    let oldIndex = oldList ? oldList.findIndex(x => x[primaryKey] === newlistItem[primaryKey]) : -1
    if(oldIndex !== -1){
    oldList.splice(oldIndex, 1, newlistItem)
  }
    return null;
  })
  return oldList;
}
//added by perumalraj for insert newly added element into an array
// ALPD-4914 Modified codes for scheduler configuration screen
export function updatedObjectWithNewElement(oldList, newList,name) {
 let newlistItem=newList;
if(name==='Sample'){
 newlistItem.map((item,index)=>{
  if(oldList[0].npreregno===item.npreregno){
    newlistItem.splice(index,1)
   // [newFirstElement].concat(array)
   }
  })
  newlistItem.unshift(oldList[0]);
  oldList =[...newlistItem];
} else if(name==='SchedulerConfigSample') {
  newlistItem.map((item,index)=>{
    if(oldList[0].nschedulersamplecode===item.nschedulersamplecode){
      newlistItem.splice(index,1)
     }
    })
    newlistItem.unshift(oldList[0]);
    oldList =[...newlistItem];
}else {
 oldList =[...newlistItem, ...oldList];
}
  return oldList;
}
//added by perumalraj for replace the old values wih new one into an array
export function replaceObjectWithNewElement(oldList) {
  oldList = [...oldList];
  return oldList;
}

//Added by L.Subashini to find the index positions nf the occurence of the specified character
// export const findIndices = (str, char) =>
//   str.split('').reduce((indices, letter, index) => {
//     letter === char && indices.push(index);
//     return indices;
//   }, [])

//added by perumalraj on 23/12/2020
//compare two arrays of object and filter the record which are not present in the second array and vice versa
export function filterStatusBasedOnTwoArrays(firstArray, secondArray, PrimaryKey, colorColName) {
  // const Peru = Object.keys(Array2).map(function (k) { return Array2[k][PrimaryKey] }).join(",");
  // alert(Peru);
  //const TestSet = new Set(Peru);
  // const FinalOutput = [
  //   ...Array1.filter(({ PrimaryKey }) => !TestSet.has(PrimaryKey))
  // ];
  // Array1 = Array1.filter(val => !Array2.includes(val[PrimaryKey]));
  // alert(Array1)
  // return Array1;
  const filterArray = firstArray.filter(function (x) {
    return secondArray.some(function (y) {
      if (x[PrimaryKey] === y[PrimaryKey]) {
        x[colorColName] = y[colorColName];
      }
      return x[PrimaryKey] === y[PrimaryKey]
    })
  });
  return filterArray;
}
export function filterStatusBasedOnSingleArray(DataArray, PrimaryKey) {

  // const filterArray = DataArray.filter((record, index, self) =>
  //   index === self.findIndex((x) => (
  //       x.PrimaryKey === record.PrimaryKey
  //   ))
    
  // );
  const uniqueMap = new Map();
  DataArray.forEach(record => {
  uniqueMap.set(record[PrimaryKey], record);
});

const filterArray = Array.from(uniqueMap.values());
  return filterArray;
}
//INVOICE MODULE - 24-SEP-2025
export function constructOptionList(options, optionId,
  optionValue, sortField, sortOrder, alphabeticalSort,
  defaultStatusFieldName) {
  const optionMap = new Map();
  const defaultValue = [];
  const defaultStatus = defaultStatusFieldName ? defaultStatusFieldName : "ndefaultstatus";
  const optionList = Object.values((sortField ? ((sortOrder === "ascending" ?
    options.sort((itemA, itemB) => itemA[sortField] < itemB[sortField] ? -1 : 1)
    : options.sort((itemA, itemB) => itemA[sortField] > itemB[sortField] ? -1 : 1))
  )
    : (alphabeticalSort ?
      options.sort((itemA, itemB) =>
      (typeof (itemA[optionValue]) === 'string' ?
        itemA[optionValue].toLowerCase() < itemB[optionValue].toLowerCase() ?
          -1 : 1 : itemA[optionValue] < itemB[optionValue] ? -1 : 1)) : options)
  )
  ).map(item => {
    if (item && item[defaultStatus] === transactionStatus.YES) {
      (defaultValue.push(
        {
          label: item[optionValue], value: item[optionId],
          item: item
        }
      ))
    }
    return {
      label: item[optionValue], value: item[optionId],
      item: item
    }
  });
  optionMap.set("OptionList", optionList);
  if (defaultValue.length > 0) {
    optionMap.set("DefaultValue", defaultValue[0]);
  }
  return optionMap;
}

export function constructjsonOptionList(options,
  optionId, optionValue, sortField, sortOrder,
  alphabeticalSort, defaultStatusFieldName,
  source, isMultiLingual, languageTypeCode, column) {
  const optionMap = new Map();
  const defaultValue = [];
  defaultStatusFieldName = defaultStatusFieldName ? defaultStatusFieldName : "ndefaultstatus";
  // const optionList = Object.values((sortField ? ((sortOrder === "ascending" ?
  //   options.sort((itemA, itemB) =>
  //     itemA[source].value ? JSON.parse(itemA[source].value)[sortField] : itemA[source][sortField] <
  //       itemB[source].value ? JSON.parse(itemB[source].value)[sortField] : itemB[source][sortField] ? -1 : 1
  //   )

  //   :
  //   options = options.sort((itemA, itemB) =>
  //     itemA[source].value ? JSON.parse(itemA[source].value)[sortField] : itemB[source].value ? JSON.parse(itemB[source].value)[sortField] : itemB[source][sortField] ? -1 : 1
  //   )
  // ))
  //   : (alphabeticalSort ?
  //     options.sort((itemA, itemB) =>
  //     (typeof (JSON.parse(itemA[source].value)[optionValue]) === 'string' ?
  //       JSON.parse(itemA[source].value)[optionValue].toLowerCase() < JSON.parse(itemB[source].value)[optionValue].toLowerCase() ?
  //         -1 : 1 : JSON.parse(itemA[source].value)[optionValue] < JSON.parse(itemB[source].value)[optionValue] ? -1 : 1)) : options)
  // )
  // )
  const optionList = options.map(item => {
    const jsondata = item[source] ? item[source].value ?
      JSON.parse(item[source].value) : item.jsondata : item.jsondata
    let defaultStatus = jsondata[defaultStatusFieldName]
      || item[defaultStatusFieldName]
    if (defaultStatus === transactionStatus.YES) {
      defaultValue.push({
        label: isMultiLingual ?
          jsondata[optionValue] ? jsondata[optionValue][languageTypeCode] || jsondata[optionValue]['en-US'] :
            jsondata['jsondata'][optionValue][languageTypeCode] || jsondata['jsondata'][optionValue]['en-US'] :
          jsondata[optionValue],
          // ALPD-3839
        value: jsondata[optionId] || item[optionId],
        item: {
          ...item, pkey: optionId,
          nquerybuildertablecode: column ? column.nquerybuildertablecode : -100,
          source: source
        }
      })
    }
    let label = isMultiLingual ?
      jsondata[optionValue] ? jsondata[optionValue][languageTypeCode] || jsondata[optionValue]['en-US'] :
        jsondata['jsondata'][optionValue][languageTypeCode] || jsondata['jsondata'][optionValue]['en-US'] :
      jsondata[optionValue];
    let value = jsondata[optionId] || item[optionId]
    return {
      label, value, item: {
        ...item, pkey: optionId, nquerybuildertablecode: column ? column.nquerybuildertablecode : -100,
        source: source
      }
    }
  });
  optionMap.set("OptionList", optionList);
  if (defaultValue.length > 0) {
    optionMap.set("DefaultValue", defaultValue[0]);
  }
  return optionMap;
}


export function constructjsonOptionDefault(options,
  optionId, optionValue, sortField, sortOrder,
  alphabeticalSort, defaultStatusFieldName,
  source, isMultiLingual, languageTypeCode, column) {
  const optionMap = new Map();
  const defaultValue = [];
  defaultStatusFieldName = defaultStatusFieldName ? defaultStatusFieldName : "ndefaultstatus";
  // const optionList = Object.values((sortField ? ((sortOrder === "ascending" ?
  //   options.sort((itemA, itemB) =>
  //     itemA[source].value ? JSON.parse(itemA[source].value)[sortField] : itemA[source][sortField] <
  //       itemB[source].value ? JSON.parse(itemB[source].value)[sortField] : itemB[source][sortField] ? -1 : 1
  //   )

  //   :
  //   options = options.sort((itemA, itemB) =>
  //     itemA[source].value ? JSON.parse(itemA[source].value)[sortField] : itemB[source].value ? JSON.parse(itemB[source].value)[sortField] : itemB[source][sortField] ? -1 : 1
  //   )
  // ))
  //   : (alphabeticalSort ?
  //     options.sort((itemA, itemB) =>
  //     (typeof (JSON.parse(itemA[source].value)[optionValue]) === 'string' ?
  //       JSON.parse(itemA[source].value)[optionValue].toLowerCase() < JSON.parse(itemB[source].value)[optionValue].toLowerCase() ?
  //         -1 : 1 : JSON.parse(itemA[source].value)[optionValue] < JSON.parse(itemB[source].value)[optionValue] ? -1 : 1)) : options)
  // )
  // )
  const optionList = options.map(item => {
    const jsondata = item[source] ? item[source].value ?
      JSON.parse(item[source].value) : item.item.jsondata : item.item.jsondata
    let defaultStatus = jsondata[defaultStatusFieldName]
      || item[defaultStatusFieldName]
    if (defaultStatus === transactionStatus.YES) {
      defaultValue.push({
        label: isMultiLingual ?
          jsondata[optionValue] ? jsondata[optionValue][languageTypeCode] : jsondata['jsondata'][optionValue][languageTypeCode] :
          jsondata[optionValue],
        value: jsondata[optionId],
        //ALPD-2106
        item: { ...item.item, pkey: optionId, nquerybuildertablecode: column ? column.nquerybuildertablecode : -100, source: source }
      })
    }
  });
  //optionMap.set("OptionList", optionList);
  if (defaultValue.length > 0) {
    optionMap.set("DefaultValue", defaultValue[0]);
  }
  return optionMap;
}


export function validateLoginId(inputValue) {
  let output = false;
  //let regAllow = /^\w+(\w+)*$/;
  let regAllow = /^[a-zA-Z0-9-_.]*$/;
  //let regAllow = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g;
  if (inputValue.match(regAllow)) {
    output = true;
  }
  return output;
}

//added by perumalraj on 02-02-2021 for single click java function in list master view and 
export function fillRecordBasedOnCheckBoxSelection(masterData, backEndResponse, mapKeys, CheckBoxOperation, primaryKeyName, removeElementFromArray) {
  //if (CheckBoxOperation === 1) {  //check box select
  if (CheckBoxOperation === checkBoxOperation.MULTISELECT) {  //check box select  
    mapKeys.forEach((item) => {
      return masterData[item] = updatedObjectWithNewElement(masterData[item] ? masterData[item] : [], backEndResponse[item] ? backEndResponse[item] : []);
      //return masterData[item] = replaceOnlyNewList(backEndResponse[item] ? backEndResponse[item] : []);
    });
  //} else if (CheckBoxOperation === 2) {  //check box de-select
  } else if (CheckBoxOperation === checkBoxOperation.DESELECT) {  //check box de-select  
    
    mapKeys.forEach((item) => {
      return masterData[item] = filterRecordBasedOnPrimaryKeyName(masterData[item] ? masterData[item] : [], removeElementFromArray.length > 0 && removeElementFromArray[0][primaryKeyName] ? removeElementFromArray[0][primaryKeyName] : "", primaryKeyName);
    });
  //} else if (CheckBoxOperation === 3) {  //single select
  } else if (CheckBoxOperation === checkBoxOperation.SINGLESELECT) {  //single select  
    mapKeys.forEach((item) => {
      return masterData[item] = replaceObjectWithNewElement(backEndResponse[item] ? backEndResponse[item] : []);
    })
  //} else if (CheckBoxOperation === 4) {  //single de-select 
  } else if (CheckBoxOperation === checkBoxOperation.SINGLEDESELECT) {  //single de-select  
    mapKeys.forEach((item) => {
      return masterData[item] = getRecordBasedOnPrimaryKeyName(masterData[item] ? masterData[item] : [], backEndResponse.length > 0 && backEndResponse[0][primaryKeyName] ? backEndResponse[0][primaryKeyName] : "", primaryKeyName);
    });

    // return masterData[item] = replaceObjectWithNewElement(masterData[item] ? masterData[item] : [], backEndResponse[item] ? backEndResponse[item] : []);
  //} else if (CheckBoxOperation === 5) {  //after multi select and then click single record
  } else if (CheckBoxOperation === checkBoxOperation.QUICKSELECTSTATUS) {  //after multi select and then click single record  
    mapKeys.forEach((item) => {
      let filteredmasterData = filterRecordBasedOnTwoArrays(masterData[item] ? masterData[item] : [], removeElementFromArray, primaryKeyName);
      return masterData[item] = updatedObjectWithNewElement(filteredmasterData, backEndResponse[item] ? backEndResponse[item] : []);
    });
  //} else if (CheckBoxOperation === 6) {  //after multi select and then click single record
  } else if (CheckBoxOperation === checkBoxOperation.QUICKSELECTNONE) {  //after multi select and then click single record  
    mapKeys.forEach((item) => {
      filterRecordBasedOnTwoArrays(masterData[item] ? masterData[item] : [], removeElementFromArray, primaryKeyName);
      return masterData[item] = getSameRecordFromTwoArrays(masterData[item] ? masterData[item] : [], backEndResponse ? backEndResponse : [], primaryKeyName);
    });
  }
  //else if (CheckBoxOperation === 7) {  //check box select
  else if (CheckBoxOperation === checkBoxOperation.QUICKSELECTALL) {  //check box select  
    mapKeys.forEach((item) => {
      //return masterData[item] = updatedObjectWithNewElement(masterData[item] ? masterData[item] : [], backEndResponse[item] ? backEndResponse[item] : []);
      return masterData[item] = replaceOnlyNewList(backEndResponse[item] ? backEndResponse[item] : []);
    });
  } else {
    Object.keys(backEndResponse).forEach((item) => {
      return masterData[item] = backEndResponse[item]
    })
  }
}
//added by Sathish on 06-04-2022
export function reArrangeArrays(firstArray, secondArray, PrimaryKey) {
  let filterArray = [];
  for (var i = 0; i < firstArray.length; i++) {
    for (var j = 0; j < secondArray.length; j++) {
      if (firstArray[i][PrimaryKey] == secondArray[j][PrimaryKey]) {
        filterArray.push(secondArray[j]);
      }
    }
  }
  return filterArray;
}

//added by Sathish on 31-03-2022
export function replaceOnlyNewList(newList) {
  const array = [];
  array.push(...newList);
  return array;
}

//added by perumalraj on 02-02-2021
export function filterRecordBasedOnPrimaryKeyName(masterData, value, primaryKeyName) {
  const finalValueAfterFilter = masterData.filter(function (master) {
    return master[primaryKeyName] !== value;
  });
  return finalValueAfterFilter;
}

//added by perumalraj on 02-02-2021
export function getRecordBasedOnPrimaryKeyName(masterData, value, primaryKeyName) {
  const finalValueAfterFilter = masterData.filter(function (master) {
    return master[primaryKeyName] === value;
  });
  return finalValueAfterFilter;
}

//added by perumalraj on 06/02/2021
//compare two arrays of object and filter the record which are not present in the second array and first array data will be 
//returned with the filtered data
// export function getSameRecordFromTwoArrays(firstArray, secondArray, PrimaryKey) {
//   const filterArray = firstArray.filter(function (x) {
//     if (Array.isArray(secondArray)) {
//       return secondArray.some(function (y) {
//         return x[PrimaryKey] === y[PrimaryKey]
//       })
//     }
//   });
//   return filterArray;

// }

export function getSameRecordFromTwoArrays(firstArray, secondArray, PrimaryKey, SecondaryKey) {
  let filterArray;
  if (SecondaryKey !== undefined) {
    filterArray = firstArray.filter(function (x) {
      if (Array.isArray(secondArray)) {
        return secondArray.some(function (y) {
          return x[PrimaryKey] === y[PrimaryKey] && x[SecondaryKey] === y[SecondaryKey]
        })
      }
    });
  } else {
    filterArray = firstArray.filter(function (x) {
      if (Array.isArray(secondArray)) {
        return secondArray.some(function (y) {
          return x[PrimaryKey] === y[PrimaryKey]
        })
      }
    });
  }

  return filterArray;

}

//added by perumalraj on 16-02-2021
//compare two arrays and remove the same element and add the newer one into it
export function getRemovedRecordAndAddNewRecord(firstArray, secondArray, ElementToSearch, PrimaryKey) {
  ElementToSearch.forEach(item => {
    let itemAfterfilter = filterRecordBasedOnPrimaryKeyName(firstArray, item, PrimaryKey);
    firstArray = itemAfterfilter;
  });
  return updatedObjectWithNewElement(firstArray, secondArray);
}

export function bytesToSize(bytes) {
  if (!isNaN(parseInt(bytes))) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  } else {
    return bytes;
  }
}

export function onDropAttachFileList(selectedRecord, attachedFiles, maxSize) {
  if (selectedRecord) {
    let listFile = selectedRecord ? selectedRecord : []
    if (listFile.length + attachedFiles.length <= maxSize || maxSize === 0) {
      attachedFiles && attachedFiles.length > 0 && attachedFiles.map(newlistItem => {
        let oldIndex = listFile ? listFile.findIndex(x => x['name'] === newlistItem['name']) : -1
        if (oldIndex === -1) {
          listFile.splice(listFile.length, 0, newlistItem)
        } else {
          listFile.splice(oldIndex, 1, newlistItem)
        }
        return null;
      })
      return listFile;
    }
    return attachedFiles;
  } else {
    return attachedFiles;
  }
}

export function deleteAttachmentDropZone(selectedRecord, file) {
  let remainingList;
  if (typeof selectedRecord === "string") {
    remainingList = "";
  }
  else {
    if (selectedRecord.length >= 1) {
      const fileList = selectedRecord.filter(fileItem => {
        return fileItem.name !== file.name
      })
      remainingList = fileList;
    }
    else {
      remainingList = "";
    }
  }
  return remainingList;
}

export function checkCancelAndReject(sample) {
  return (sample.ntransactionstatus === transactionStatus.CANCELLED || sample.ntransactionstatus === transactionStatus.REJECT)
}

export function covertDatetoString(newDate) {
  const startDate = new Date(newDate);
  const prevMonth = validateTwoDigitDate(String(startDate.getMonth() + 1));
  const prevDay = validateTwoDigitDate(String(startDate.getDate()));
  const fromDate = startDate.getFullYear() + '-' + prevMonth + '-' + prevDay
  return fromDate;
}

export function convertDatetoStringByTimeZone(userInfo, value) {

  const dateValue = new Date(value);
  const prevMonth = validateTwoDigitDate(String(dateValue.getMonth() + 1));
  const prevDay = validateTwoDigitDate(String(dateValue.getDate()));
  const dateArray = [];

  const splitChar = getSplitCharacter(userInfo);
  const firstField = userInfo.ssitedatetime && userInfo.ssitedatetime.split(splitChar)[0];
  const secondField = userInfo.ssitedatetime && userInfo.ssitedatetime.split(splitChar)[1];

  if (firstField === "dd") {
    dateArray.push(prevDay);
    dateArray.push(splitChar);
    if (secondField === "MM") {
      dateArray.push(prevMonth);
      dateArray.push(splitChar);
      dateArray.push(dateValue.getFullYear());
    }
    else {
      dateArray.push(dateValue.getFullYear());
      dateArray.push(splitChar);
      dateArray.push(prevMonth);
    }
  }
  else if (firstField === "MM") {
    dateArray.push(prevMonth);
    dateArray.push(splitChar);
    if (secondField === "dd") {
      dateArray.push(prevDay);
      dateArray.push(splitChar);
      dateArray.push(dateValue.getFullYear());
    }
    else {
      dateArray.push(dateValue.getFullYear());
      dateArray.push(splitChar);
      dateArray.push(prevDay);
    }
  }
  else {
    dateArray.push(dateValue.getFullYear());
    dateArray.push(splitChar);
    if (secondField === "dd") {
      dateArray.push(prevDay);
      dateArray.push(splitChar);
      dateArray.push(prevMonth);
    }
    else {
      dateArray.push(prevMonth);
      dateArray.push(splitChar);
      dateArray.push(prevDay);
    }
  }
  return dateArray;
}

export function convertDateValuetoString(startDateValue, endDateValue, userInfo, noBreadCrumb) {

  const startDate = startDateValue ? rearrangeDateFormat(userInfo, startDateValue) : new Date();
  const endDate = endDateValue ? rearrangeDateFormat(userInfo, endDateValue) : new Date();

  // const startDate = startDateValue ? new Date(startDateValue) : new Date();
  // const endDate = endDateValue ? new Date(endDateValue) : new Date();

  const prevMonth = validateTwoDigitDate(String(startDate.getMonth() + 1));
  const currentMonth = validateTwoDigitDate(String(endDate.getMonth() + 1));
  const prevDay = validateTwoDigitDate(String(startDate.getDate()));
  const currentDay = validateTwoDigitDate(String(endDate.getDate()));

  //const splitChar = userInfo.ssitedatetime && userInfo.ssitedatetime.indexOf("/") !== -1 ? "/" : "-";
  const fromDateOnly = startDate.getFullYear() + '-' + prevMonth + '-' + prevDay;
  const toDateOnly = endDate.getFullYear() + '-' + currentMonth + '-' + currentDay;
  const fromDate = fromDateOnly + "T00:00:00";
  const toDate = toDateOnly + "T23:59:59";

  if (noBreadCrumb) {
    return ({ fromDate, toDate });
  }
  else {
    const breadCrumbFrom = convertDatetoStringByTimeZone(userInfo, startDate);//startDate.getFullYear() + splitChar + prevMonth + splitChar + prevDay;
    const breadCrumbto = convertDatetoStringByTimeZone(userInfo, endDate);//endDate.getFullYear() + splitChar + currentMonth + splitChar + currentDay;

    return ({ fromDate, toDate, breadCrumbFrom, breadCrumbto });
  }

}

export function getSplitCharacter(userInfo) {
  const specialChars = `\`_-\[\]'"\\|,.\/`
  let splitChar = '';
  userInfo.ssitedatetime
    && userInfo.ssitedatetime.split('').some(word => {
      if (splitChar === undefined || splitChar === '') {
        if (specialChars.includes(word)) {
          splitChar = word;
        }
      }
    });


  specialChars.split('').some(specialChar => {
    if (splitChar === undefined || splitChar === '') {
      userInfo.ssitedatetime && userInfo.ssitedatetime.split('').some(word => {
        if (splitChar === undefined || splitChar === '') {
          if (word.includes(specialChar)) {
            splitChar = word;
          }
        }
      })
    }
  });
  return splitChar;
}

export function rearrangeDateFormat(userInfo, dateValue) {

  // let splitChar = userInfo.ssitedatetime 
  // && userInfo.ssitedatetime.indexOf("/") !== -1 ? "/" : "-";

  let splitChar = getSplitCharacter(userInfo);

  //   console.log("splitChar:", splitChar);
  if (typeof dateValue === "string") {//(splitChar === "/" || splitChar === "-") &&
    const firstField = userInfo.ssitedatetime && userInfo.ssitedatetime.split(splitChar)[0];
    // console.log("firstField:", firstField);
    const timeSplitChar = dateValue.indexOf("T") !== -1 ? "T" : " "
    const datetime = dateValue.split(timeSplitChar);
    const dateArray = datetime[0].split(splitChar);
    if (firstField === "dd") {
      const day = dateArray[0];
      const month = dateArray[1];
      const year = dateArray[2];
      const time = datetime[1] || "00:00:00";

      const formatted = year + "-" + month + "-" + day + "T" + time;
      return new Date(formatted);
    }
    else if (firstField === "yyyy") {
      const year = dateArray[0];
      const month = dateArray[1];
      const day = dateArray[2];
      const time = datetime[1] || "00:00:00";
      const formatted = year + "-" + month + "-" + day + "T" + time;
      return new Date(formatted);
    }
    else {
      return new Date(dateValue);
    }
  }
  else {
    return dateValue;
  }
}

export function rearrangeDateFormatforUI(userInfo, dateValue) {

  let splitChar = "-";
  //   console.log("splitChar:", splitChar);
  if (typeof dateValue === "string") {//(splitChar === "/" || splitChar === "-") &&
    const firstField = userInfo.ssitedatetime && userInfo.ssitedatetime.split(splitChar)[0];
    // console.log("firstField:", firstField);
    const timeSplitChar = dateValue.indexOf("T") !== -1 ? "T" : " "
    const datetime = dateValue.split(timeSplitChar);
    const dateArray = datetime[0].split(splitChar);
    if (firstField === "dd") {
      const day = dateArray[0];
      const month = dateArray[1];
      const year = dateArray[2];
      const time = datetime[1] || "00:00:00";

      const formatted = year + "-" + month + "-" + day + "T" + time;
      return new Date(formatted);
    }
    else if (firstField === "yyyy") {
      const year = dateArray[0];
      const month = dateArray[1];
      const day = dateArray[2];
      const time = datetime[1] || "00:00:00";
      const formatted = year + "-" + month + "-" + day + "T" + time;
      return new Date(formatted);
    }
    else {
      return new Date(dateValue);
    }
  }
  else {
    return dateValue;
  }
}

export function convertUTCDateToLocalDate(date) {
  var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

  var offset = date.getTimezoneOffset() / 60;
  var hours = date.getHours();

  newDate.setHours(hours - offset);

  return newDate;
}

export function convertDateTimetoString(inputDate, userInfo) {

  // let splitChar = userInfo.ssitedatetime && userInfo.ssitedatetime.indexOf("/") !== -1 ? "/" : "-";

  const specialChars = `\`_-\[\]'"\\|,.\/`
  let splitChar = '';
  userInfo.ssitedatetime
    && userInfo.ssitedatetime.split('').some(word => {
      if (splitChar === undefined || splitChar === '') {
        if (specialChars.includes(word)) {
          splitChar = word;
        }
      }
    });


  const month = validateTwoDigitDate(String(inputDate.getMonth() + 1));
  const day = validateTwoDigitDate(String(inputDate.getDate()));
  const year = inputDate.getFullYear();
  const hours = validateTwoDigitDate(String(inputDate.getHours()));
  const minutes = validateTwoDigitDate(String(inputDate.getMinutes()));
  const seconds = validateTwoDigitDate(String(inputDate.getSeconds()));

  //if (splitChar === "/" || splitChar === "-") {
  const firstField = userInfo.ssitedatetime && userInfo.ssitedatetime.split(splitChar)[0];
  if (firstField === "dd") {
    return day + splitChar + month + splitChar + year + " " + hours + ":" + minutes + ":" + seconds;
  } else if (firstField === "yyyy") {
    return year + splitChar + month + splitChar + day + "T" + hours + ":" + minutes + ":" + seconds;
  } else {
    return new Date(inputDate);
  }
  // } else {
  //   return inputDate;
  // }
}





export function convertDateTimetoStringDBFormat(inputDate, userInfo) {

  // let splitChar = userInfo.ssitedatetime &&
  //   userInfo.ssitedatetime.indexOf("/") !== -1 ? "/" : "-";

  const specialChars = `\`_-\[\]'"\\|,.\/`
  let splitChar = '';
  userInfo.ssitedatetime
    && userInfo.ssitedatetime.split('').some(word => {
      if (splitChar === undefined || splitChar === '') {
        if (specialChars.includes(word)) {
          splitChar = word;
        }
      }
    });


  let dbformat = "-"

  const month = validateTwoDigitDate(String(inputDate.getMonth() + 1));
  const day = validateTwoDigitDate(String(inputDate.getDate()));
  const year = inputDate.getFullYear();
  const hours = validateTwoDigitDate(String(inputDate.getHours()));
  const minutes = validateTwoDigitDate(String(inputDate.getMinutes()));
  const seconds = validateTwoDigitDate(String(inputDate.getSeconds()));

  // if (splitChar === "/" || splitChar === "-") {
  const firstField = userInfo.ssitedatetime && userInfo.ssitedatetime.split(splitChar)[0];
  if (firstField === "dd") {
    return year + dbformat + month + dbformat + day + " " + hours + ":" + minutes + ":" + seconds;
  } else if (firstField === "yyyy") {
    return year + dbformat + month + dbformat + day + " " + hours + ":" + minutes + ":" + seconds;
  } else {
    return new Date(inputDate);
  }
  // } else {
  //   return inputDate;
  // }
}



export function parentChildComboLoad(columnList, comboData, selectedRecord,
  childColumnList, withoutCombocomponent, ParentComboValues,
  languagetypeCode, userinfo, comboComponents) {
  //console.log("columnList:", columnList);
  let comboValues = {}
  if (columnList.length > 0) {
    columnList.map((x, index) => {
      if (x.inputtype === 'combo' && (x.readonly === undefined || x.readonly === false)) {
        if (comboData[x.label] && comboData[x.label].length > 0) //&& comboData[x.label][0].hasOwnProperty(x.source) 
        {
          selectedRecord[x.label] = undefined;
          if (comboData[x.label].length > 0) {
            if (comboData[x.label][0].label === undefined) {
              const optionList = constructjsonOptionList(comboData[x.label] || [], x.valuemember,
                x.displaymember, false, false, true, undefined, x.source, x.isMultiLingual, languagetypeCode, x)
              comboData[x.label] = optionList.get("OptionList");
              if (optionList.get("DefaultValue") !== undefined) {
                selectedRecord[x.label] = optionList.get("DefaultValue")
              }
            } else {
              comboData[x.label] = comboData[x.label]
              const optionList = constructjsonOptionDefault(comboData[x.label] || [], x.valuemember,
                x.displaymember, false, false, true, undefined, x.source, x.isMultiLingual, languagetypeCode, x)
              if (optionList.get("DefaultValue") !== undefined) {
                selectedRecord[x.label] = optionList.get("DefaultValue")
              }
            }
          } else {
            comboData[x.label] = []
          }
          comboValues = childComboLoad(x, comboData, selectedRecord, childColumnList,
            withoutCombocomponent, languagetypeCode, userinfo, selectedRecord[x.label])
        } else {
          selectedRecord[x.label] = undefined

          comboValues = childComboLoad(x, comboData, selectedRecord, childColumnList,
            withoutCombocomponent, languagetypeCode, userinfo, selectedRecord[x.label])

          //   comboValues = {
          //   "comboData": comboData,
          //   "selectedRecord": selectedRecord
          // }
        }
      }else if (x.inputtype === 'combo' && x.readonly === true && ParentComboValues.child.some(y=> y.label===x.label && y.isdifferentdisplaycolumn)) {
        let index = ParentComboValues.child.findIndex(y=> y.label===x.label)
        
        selectedRecord = {

          ...selectedRecord,
          [x.label]: {
            label: ParentComboValues.item.jsondata ?
              ParentComboValues.item.jsondata[ParentComboValues.child[index].displaycolumnname] :
              ParentComboValues.item[ParentComboValues.child[index].displaycolumnname] || "",
            value: ParentComboValues.item.jsondata ?
              ParentComboValues.item.jsondata[ParentComboValues.child[index].tablecolumnname] :
              ParentComboValues.item[ParentComboValues.child[index].tablecolumnname] || -1
          }
        }

        comboValues = {
          comboData: comboData,
          ...comboValues,
          selectedRecord
        }
      } else if (x.inputtype === 'combo' && x.readonly === true) {
        selectedRecord = {
          ...selectedRecord,
          [x.label]: {
            label: ParentComboValues.item.jsondata ?
              ParentComboValues.item.jsondata[x.displaymember] :
              ParentComboValues.item[x.displaymember] || "",
            value: ParentComboValues.item.jsondata ?
              ParentComboValues.item.jsondata[x.valuemember] :
              ParentComboValues.item[x.valuemember] || -1
          }
        }

        comboValues = {
          comboData: comboData,
          ...comboValues,
          selectedRecord
        }
      }
      else {
        if (x.isMultiLingual) {
          selectedRecord = {
            ...selectedRecord,
            [x.label]: ParentComboValues.item.jsondata ?
              ParentComboValues.item.jsondata[x.displaymember][languagetypeCode] : ParentComboValues.item[x.displaymember][languagetypeCode] || ""
          }
        } else {
          if (x.inputtype === "date") {
            selectedRecord = {
              ...selectedRecord,
              [x.label]: ParentComboValues.item.jsondata ?
                rearrangeDateFormatforKendoDataTool(userinfo, ParentComboValues.item.jsondata[x.displaymember]) :
                rearrangeDateFormatforKendoDataTool(userinfo, ParentComboValues.item[x.displaymember])
            }

            if (x.child) {
              const Age = withoutCombocomponent.filter(x => x.name === 'Age');
              x.child.map(k => {
                if (k.label === Age[0].label) {
                  const age = ageCalculate(selectedRecord[x.label]);

                  selectedRecord[Age[0].label] = age
                }
              })
            }

          } else {
            selectedRecord = {
              ...selectedRecord,
              [x.label]: ParentComboValues.item.jsondata ?
                ParentComboValues.item.jsondata[x.displaymember] :
                ParentComboValues.item[x.displaymember] || ""
            }
          }

        }
        comboValues = {
          comboData: comboData,
          ...comboValues,
          selectedRecord
        }
        // comboValues["selectedRecord"][x.label] = ParentComboValues[x.displaymember] ||""
      }
    })
  }
  else {
    comboValues = {
      "comboData": comboData,
      "selectedRecord": selectedRecord
    }
  }

  return comboValues;
}


export function childComboLoad(x, comboData, selectedRecord, childColumnList,
  withoutCombocomponent, languagetypeCode, userinfo, ParentComboValues) {
  if (selectedRecord[x.label] !== undefined) {
    if (x.hasOwnProperty("child")) {
      x.child.map(y => {
        const index = childColumnList[x.label].findIndex(z => z.label === y.label)
        if (index !== -1) {
          if (childColumnList[x.label][index].inputtype === 'combo' && childColumnList[x.label][index].readonly === true && (y.isdifferentdisplaycolumn && y.isdifferentdisplaycolumn === true)) {
            selectedRecord = {
              ...selectedRecord,
              [childColumnList[x.label][index].label]: {
                label: ParentComboValues.item.jsondata ?
                  ParentComboValues.item.jsondata[y.displaycolumnname] :
                  ParentComboValues.item[y.displaycolumnname] || "",
                value: ParentComboValues.item.jsondata ?
                  ParentComboValues.item.jsondata[y.tablecolumnname] :
                  ParentComboValues.item[y.tablecolumnname] || -1
              }
            }
          }
          else if (childColumnList[x.label][index].inputtype === 'combo' && childColumnList[x.label][index].readonly === true) {
            selectedRecord = {
              ...selectedRecord,
              [childColumnList[x.label][index].label]: {
                label: ParentComboValues.item.jsondata ?
                  ParentComboValues.item.jsondata[childColumnList[x.label][index].displaymember] :
                  ParentComboValues.item[childColumnList[x.label][index].displaymember] || "",
                value: ParentComboValues.item.jsondata ?
                  ParentComboValues.item.jsondata[childColumnList[x.label][index].valuemember] :
                  ParentComboValues.item[childColumnList[x.label][index].valuemember] || -1
              }
            }
          }
          else if (comboData[y.label] && comboData[y.label].length > 0) {
            if (comboData[y.label][0].label === undefined) {
              // ALPD-3833
              const isMultilingual=  (childColumnList[x.label] && childColumnList[x.label][index] && childColumnList[x.label][index].isMultiLingual) || undefined;
              const optionChildList = constructjsonOptionList(comboData[y.label] || [], childColumnList[x.label][index].valuemember,
                childColumnList[x.label][index].displaymember, false, false, true, undefined, childColumnList[x.label][index].source, isMultilingual, languagetypeCode, y)
              comboData[y.label] = optionChildList.get("OptionList");
              if (optionChildList.get("DefaultValue") !== undefined) {
                selectedRecord[y.label] = optionChildList.get("DefaultValue")
                const newRecord1 = childComboLoad(childColumnList[x.label][index], comboData, selectedRecord, childColumnList, withoutCombocomponent, userinfo.slanguagetypecode, userinfo, selectedRecord[y.label])
                selectedRecord = { ...selectedRecord, ...newRecord1.selectedRecord }
                comboData = { ...comboData, ...newRecord1.comboData }

              } else {
                selectedRecord[y.label] = undefined
              }
            } else {
              //below code need to be veriifed for 'x' to be replced with 'y' or viceversa?
              comboData[y.label] = comboData[y.label]
              const optionChildList = constructjsonOptionDefault(comboData[y.label] || [], childColumnList[x.label][index].valuemember,
                childColumnList[x.label][index].displaymember, false, false, true, undefined, childColumnList[x.label][index].source, undefined, undefined, y)
              if (optionChildList.get("DefaultValue") !== undefined) {
                selectedRecord[y.label] = optionChildList.get("DefaultValue")
                const newRecord1 = childComboLoad(childColumnList[x.label][index], comboData, selectedRecord, childColumnList, withoutCombocomponent, userinfo.slanguagetypecode, userinfo, selectedRecord[y.label])
                selectedRecord = { ...selectedRecord, ...newRecord1.selectedRecord }
                comboData = { ...comboData, ...newRecord1.comboData }

              } else {
                selectedRecord[y.label] = undefined
              }
            }
          } else {
            selectedRecord[y.label] = undefined
            comboData[y.label] = []
            const newRecord1 = childComboLoad(childColumnList[x.label][index], comboData, selectedRecord, childColumnList, withoutCombocomponent, userinfo.slanguagetypecode, userinfo, selectedRecord[y.label])
            selectedRecord = { ...selectedRecord, ...newRecord1.selectedRecord }
            comboData = { ...comboData, ...newRecord1.comboData }
          }
        } else {
          const readonlyfields = withoutCombocomponent.findIndex(k => k.label === y.label);
          if (readonlyfields !== -1) {

            if (withoutCombocomponent[readonlyfields]["isMultiLingual"]) {
              selectedRecord[withoutCombocomponent[readonlyfields]["label"]] = selectedRecord[x.label].item.jsondata ?
                selectedRecord[x.label].item.jsondata[withoutCombocomponent[readonlyfields]["displaymember"]][languagetypeCode] : selectedRecord[x.label].item[withoutCombocomponent[readonlyfields]["displaymember"]][languagetypeCode]
            } else {
              if (withoutCombocomponent[readonlyfields]["inputtype"] === "date") {
                selectedRecord[withoutCombocomponent[readonlyfields]["label"]] = selectedRecord[x.label].item.jsondata ?
                  rearrangeDateFormatforKendoDataTool(userinfo, selectedRecord[x.label].item.jsondata[withoutCombocomponent[readonlyfields]["displaymember"]]) :
                  rearrangeDateFormatforKendoDataTool(userinfo, selectedRecord[x.label].item[withoutCombocomponent[readonlyfields]["displaymember"]])

                if (withoutCombocomponent[readonlyfields].child) {
                  const Age = withoutCombocomponent.filter(x => x.name === 'Age');
                  withoutCombocomponent[readonlyfields].child.map(k => {
                    if (k.label === Age[0].label) {
                      const age = ageCalculate(selectedRecord[withoutCombocomponent[readonlyfields]["label"]]);

                      selectedRecord[Age[0].label] = age
                    }
                  })
                }
              } else {
                selectedRecord[withoutCombocomponent[readonlyfields]["label"]] = selectedRecord[x.label].item.jsondata ?
                  selectedRecord[x.label].item.jsondata[withoutCombocomponent[readonlyfields]["displaymember"]] : selectedRecord[x.label].item[withoutCombocomponent[readonlyfields]["displaymember"]]
              }

            }
          }
        }
      })
    }
  }
  else if (x.name === 'manualsampleid' && selectedRecord['Order Type'].value === 1) {
    if (x.hasOwnProperty("child")) {
      x.child.map(y => {
        const index = childColumnList[x.label].findIndex(z => z.label === y.label)
        if (index !== -1) {
          if (childColumnList[x.label][index].inputtype === 'combo' && childColumnList[x.label][index].readonly === true) {
            selectedRecord = {
              ...selectedRecord,
              [childColumnList[x.label][index].label]: {
                label: ParentComboValues.item.jsondata ?
                  ParentComboValues.item.jsondata[childColumnList[x.label][index].displaymember] :
                  ParentComboValues.item[childColumnList[x.label][index].displaymember] || "",
                value: ParentComboValues.item.jsondata ?
                  ParentComboValues.item.jsondata[childColumnList[x.label][index].valuemember] :
                  ParentComboValues.item[childColumnList[x.label][index].valuemember] || -1
              }
            }
          }
          else if (comboData[y.label] && comboData[y.label].length > 0) {
            if (comboData[y.label][0].label === undefined) {
              const optionChildList = constructjsonOptionList(comboData[y.label] || [], childColumnList[x.label][index].valuemember,
                childColumnList[x.label][index].displaymember, false, false, true, undefined, childColumnList[x.label][index].source, y.isMultiLingual, languagetypeCode, y)
              comboData[y.label] = optionChildList.get("OptionList");
              if (optionChildList.get("DefaultValue") !== undefined) {
                selectedRecord[y.label] = optionChildList.get("DefaultValue")
                const newRecord1 = childComboLoad(childColumnList[x.label][index], comboData, selectedRecord, childColumnList, withoutCombocomponent, userinfo.slanguagetypecode, userinfo, selectedRecord[y.label])
                selectedRecord = { ...selectedRecord, ...newRecord1.selectedRecord }
                comboData = { ...comboData, ...newRecord1.comboData }
              } else {
                selectedRecord[y.label] = undefined
                const newRecord1 = childComboLoad(childColumnList[x.label][index], comboData, selectedRecord, childColumnList, withoutCombocomponent, userinfo.slanguagetypecode, userinfo, selectedRecord[y.label])
                selectedRecord = { ...selectedRecord, ...newRecord1.selectedRecord }
                comboData = { ...comboData, ...newRecord1.comboData }
              }
            } else {
              //below code need to be veriifed for 'x' to be replced with 'y' or viceversa?
              comboData[y.label] = comboData[y.label]
              const optionChildList = constructjsonOptionDefault(comboData[y.label] || [], childColumnList[x.label][index].valuemember,
                childColumnList[x.label][index].displaymember, false, false, true, undefined, childColumnList[x.label][index].source, undefined, undefined, y)
              if (optionChildList.get("DefaultValue") !== undefined) {
                selectedRecord[y.label] = optionChildList.get("DefaultValue")
                const newRecord1 = childComboLoad(childColumnList[x.label][index], comboData, selectedRecord, childColumnList, withoutCombocomponent, userinfo.slanguagetypecode, userinfo, selectedRecord[y.label])
                selectedRecord = { ...selectedRecord, ...newRecord1.selectedRecord }
                comboData = { ...comboData, ...newRecord1.comboData }
              } else {
                selectedRecord[y.label] = undefined
                const newRecord1 = childComboLoad(childColumnList[x.label][index], comboData, selectedRecord, childColumnList, withoutCombocomponent, userinfo.slanguagetypecode, userinfo, selectedRecord[y.label])
                selectedRecord = { ...selectedRecord, ...newRecord1.selectedRecord }
                comboData = { ...comboData, ...newRecord1.comboData }
              }
            }
          } else {
            selectedRecord[y.label] = undefined
            comboData[y.label] = []
            const newRecord1 = childComboLoad(childColumnList[x.label][index], comboData, selectedRecord, childColumnList, withoutCombocomponent, userinfo.slanguagetypecode, userinfo, selectedRecord[y.label])
            selectedRecord = { ...selectedRecord, ...newRecord1.selectedRecord }
            comboData = { ...comboData, ...newRecord1.comboData }
          }
        } else {
          const readonlyfields = withoutCombocomponent.findIndex(k => k.label === y.label);
          if (readonlyfields !== -1) {

            if (withoutCombocomponent[readonlyfields]["isMultiLingual"]) {
              selectedRecord[withoutCombocomponent[readonlyfields]["label"]] = selectedRecord[x.label].item.jsondata ?
                selectedRecord[x.label].item.jsondata[withoutCombocomponent[readonlyfields]["displaymember"]][languagetypeCode] : selectedRecord[x.label].item[withoutCombocomponent[readonlyfields]["displaymember"]][languagetypeCode]
            } else {
              if (withoutCombocomponent[readonlyfields]["inputtype"] === "date") {
                selectedRecord[withoutCombocomponent[readonlyfields]["label"]] = selectedRecord[x.label].item.jsondata ?
                  rearrangeDateFormatforKendoDataTool(userinfo, selectedRecord[x.label].item.jsondata[withoutCombocomponent[readonlyfields]["displaymember"]]) :
                  rearrangeDateFormatforKendoDataTool(userinfo, selectedRecord[x.label].item[withoutCombocomponent[readonlyfields]["displaymember"]])

                if (withoutCombocomponent[readonlyfields].child) {
                  const Age = withoutCombocomponent.filter(x => x.name === 'Age');
                  withoutCombocomponent[readonlyfields].child.map(k => {
                    if (k.label === Age[0].label) {
                      const age = ageCalculate(selectedRecord[withoutCombocomponent[readonlyfields]["label"]]);

                      selectedRecord[Age[0].label] = age
                    }
                  })
                }
              } else {
                selectedRecord[withoutCombocomponent[readonlyfields]["label"]] = selectedRecord[x.label].item.jsondata ?
                  selectedRecord[x.label].item.jsondata[withoutCombocomponent[readonlyfields]["displaymember"]] : selectedRecord[x.label].item[withoutCombocomponent[readonlyfields]["displaymember"]]
              }

            }
          }
        }
      })
    }
  }

  else {
    if (x.hasOwnProperty("child")) {
      x.child.map(y => {
        selectedRecord[y.label] = undefined
        const index = childColumnList[x.label] && childColumnList[x.label].findIndex(z => z.label === y.label)
        if (index !== undefined && index !== -1) {
          comboData[y.label] = undefined
          const newRecord1 = childComboLoad(childColumnList[x.label][index], comboData, selectedRecord, childColumnList, withoutCombocomponent)
          selectedRecord = { ...selectedRecord, ...newRecord1.selectedRecord }
          comboData = { ...comboData, ...newRecord1.comboData }
        }

        else {
          const index = withoutCombocomponent.findIndex(b => b.label === y.label)
          if (index !== -1) {
            if (withoutCombocomponent[index].hasOwnProperty("child")) {
              withoutCombocomponent[index].child.map(k => {
                selectedRecord[k.label] = undefined
              })
            }
          }
        }
      })
    }
  }
  const newRecord = {
    "comboData": comboData,
    "selectedRecord": selectedRecord
  }
  return newRecord;
}



export function childComboLoadForEdit(x, comboData, selectedRecord, childColumnList, withoutCombocomponent, languagetypeCode) {
  if (selectedRecord[x.label] !== undefined) {
    if (x.hasOwnProperty("child")) {
      x.child.map(y => {
        const index = childColumnList[x.label].findIndex(z => z.label === y.label)
        if (index !== -1) {
          // const childOptionData = comboData[y.label].filter(filterData =>
          //     JSON.parse(filterData[y.source].value)[x.valuemember] === selectedRecord[x.label].item[x.valuemember])
          if (comboData[y.label] && comboData[y.label].length > 0) {
            if (comboData[y.label][0].label === undefined) {
              const optionChildList = constructjsonOptionList(comboData[y.label] || [], childColumnList[x.label][index].valuemember,
                childColumnList[x.label][index].displaymember, false, false, true, undefined, childColumnList[x.label][index].source, y.isMultiLingual, languagetypeCode, y)
              comboData[y.label] = optionChildList.get("OptionList");

              // if (optionChildList.get("DefaultValue") !== undefined) {
              //   selectedRecord[y.label] = optionChildList.get("DefaultValue")
              childComboLoadForEdit(childColumnList[x.label][index], comboData, selectedRecord, childColumnList, withoutCombocomponent)
              // } else {
              //   selectedRecord[y.label] = undefined
              // }
            } else {
              comboData[y.label] = comboData[y.label]
              const optionChildList = constructjsonOptionList(comboData[y.label] || [], childColumnList[x.label][index].valuemember,
                childColumnList[x.label][index].displaymember, false, false, true, undefined, childColumnList[x.label][index].source, undefined, undefined, y)
              // if (optionChildList.get("DefaultValue") !== undefined) {
              //   selectedRecord[y.label] = optionChildList.get("DefaultValue")
              childComboLoadForEdit(childColumnList[x.label][index], comboData, selectedRecord, childColumnList, withoutCombocomponent)
              // } else {
              //   selectedRecord[y.label] = undefined
              // }
            }
          } else {
            comboData[y.label] = []
          }
        }
        //else {
        //   const readonlyfields = withoutCombocomponent.findIndex(k => k.label === y.label);
        //   if (readonlyfields !== -1) {

        //     if(withoutCombocomponent[readonlyfields]["isMultiLingual"]){
        //     selectedRecord[withoutCombocomponent[readonlyfields]["label"]] = selectedRecord[x.label].item.jsondata ?
        //       selectedRecord[x.label].item.jsondata[withoutCombocomponent[readonlyfields]["displaymember"]][languagetypeCode] : selectedRecord[x.label].item[withoutCombocomponent[readonlyfields]["displaymember"]][languagetypeCode] 
        //     }else{
        //       selectedRecord[withoutCombocomponent[readonlyfields]["label"]] = selectedRecord[x.label].item.jsondata ?
        //       selectedRecord[x.label].item.jsondata[withoutCombocomponent[readonlyfields]["displaymember"]] : selectedRecord[x.label].item[withoutCombocomponent[readonlyfields]["displaymember"]]
        //     }
        //   }
        // }
      })
    }
  } else {
    if (x.hasOwnProperty("child")) {
      x.child.map(y => {
        selectedRecord[y.label] = undefined
        comboData[y.label] = undefined
      })
    }
  }
  const newRecord = {
    "comboData": comboData,
    "selectedRecord": selectedRecord
  }
  return newRecord;
}


export function comboChild(data, columnList, childColumnList, slice) {
  let retunObj = {}
  // if (data.findIndex(x => x.label === columnList.label) !== -1) {
  if (!childColumnList.hasOwnProperty(columnList.label)) {
    if (childColumnList[columnList.label] === undefined) {
      if (columnList.hasOwnProperty("child")) {
        let childList = []
        columnList.child.map(childData => {
          const index = data.findIndex(x => x.label === childData.label)
          if (index !== -1) {
            childList.push(data[index])
            if (slice) {
              data = [...data.slice(0, index), ...data.slice(index + 1)]
            }
          }
        })
        childColumnList[columnList.label] = childList;
        if (childList.length > 0) {
          childList.map(y => {
            if (y.hasOwnProperty("child")) {
              const val = comboChild(data, y, childColumnList, slice)
              retunObj["data"] = val.data;
              retunObj["childColumnList"] = val.childColumnList;
            } else {
              retunObj["data"] = data;
              retunObj["childColumnList"] = childColumnList;
            }
          })
        } else {
          retunObj["data"] = data;
          retunObj["childColumnList"] = childColumnList;
        }
      } else {
        retunObj["data"] = data;
        retunObj["childColumnList"] = childColumnList;
      }
    } else {
      retunObj["data"] = data;
      retunObj["childColumnList"] = childColumnList;

    }
  } else {
    retunObj["data"] = data;
    retunObj["childColumnList"] = childColumnList;

  }
  return retunObj;
}
export function ageCalculate(date, checkValue) {
  const now = new Date();
  const today = new Date(now.getYear(), now.getMonth(), now.getDate());

  let yearNow = now.getYear();
  let monthNow = now.getMonth();
  let dateNow = now.getDate();

  let dob = new Date(date);

  let yearDob = dob.getYear();
  let monthDob = dob.getMonth();
  let dateDob = dob.getDate();
  let age = {};
  let ageString = "";
  let yearString = "";
  let monthString = "";
  let dayString = "";


  let yearAge = yearNow - yearDob;
  let monthAge = 0;
  let dateAge = 0;

  if (monthNow >= monthDob)
    monthAge = monthNow - monthDob;
  else {
    yearAge--;
    monthAge = 12 + monthNow - monthDob;
  }

  if (dateNow >= dateDob)
    dateAge = dateNow - dateDob;
  else {
    monthAge--;
    dateAge = 31 + dateNow - dateDob;

    if (monthAge < 0) {
      monthAge = 11;
      yearAge--;
    }
  }

  age = {
    years: yearAge,
    months: monthAge,
    days: dateAge
  };

  if (age.years > 1) yearString = intl.formatMessage({ id: "IDS_YEARS" });
  else yearString = intl.formatMessage({ id: "IDS_YEAR" });
  if (age.months > 1) monthString = intl.formatMessage({ id: "IDS_MONTHS" });
  else monthString = intl.formatMessage({ id: "IDS_MONTH" });
  if (age.days > 1) dayString = intl.formatMessage({ id: "IDS_DAYS" });
  else dayString = intl.formatMessage({ id: "IDS_DAY" });

  if (checkValue === true) {
    if ((age.years > 0) && (age.months > 0) && (age.days > 0))
      ageString = age.years;
    else if ((age.years === 0) && (age.months === 0) && (age.days > 0))
      ageString = "1";
    else if ((age.years > 0) && (age.months === 0) && (age.days === 0))
      ageString = age.years;
    else if ((age.years > 0) && (age.months > 0) && (age.days === 0))
      ageString = age.years;
    else if ((age.years === 0) && (age.months > 0) && (age.days > 0))
      ageString = "1";
    else if ((age.years > 0) && (age.months === 0) && (age.days > 0))
      ageString = age.years;
    else if ((age.years === 0) && (age.months > 0) && (age.days === 0))
      ageString = age.months;
    else ageString = "1";
    // console.log(ageString);

  }
  else {
    if ((age.years > 0) && (age.months > 0) && (age.days > 0))
      ageString = age.years + yearString + ", " + age.months + monthString + " and " + age.days + dayString + " ";
    else if ((age.years === 0) && (age.months === 0) && (age.days > 0))
      ageString = " " + age.days + dayString + " ";
    else if ((age.years > 0) && (age.months === 0) && (age.days === 0))
      ageString = age.years + yearString + "  ";
    else if ((age.years > 0) && (age.months > 0) && (age.days === 0))
      ageString = age.years + yearString + " and " + age.months + monthString + " ";
    else if ((age.years === 0) && (age.months > 0) && (age.days > 0))
      ageString = age.months + monthString + " and " + age.days + dayString + "";
    else if ((age.years > 0) && (age.months === 0) && (age.days > 0))
      ageString = age.years + yearString + " and " + age.days + dayString + " ";
    else if ((age.years === 0) && (age.months > 0) && (age.days === 0))
      ageString = age.months + monthString + " ";
    else ageString = "0 " + intl.formatMessage({ id: "IDS_DAYS" });
    // console.log(ageString);
  }
  return ageString;

}
// export function ageCalculateOnlyForYear(date,checkValue) {
//   const now = new Date();
//   const today = new Date(now.getYear(), now.getMonth(), now.getDate());

//   let yearNow = now.getYear();
//   let monthNow = now.getMonth();
//   let dateNow = now.getDate();

//   let dob = new Date(date);

//   let yearDob = dob.getYear();
//   let monthDob = dob.getMonth();
//   let dateDob = dob.getDate();
//   let age = {};
//   let ageString = "";

//   let yearAge = yearNow - yearDob;
//   let monthAge = 0;
//   let dateAge = 0;

//   if (monthNow >= monthDob)
//     monthAge = monthNow - monthDob;
//   else {
//     yearAge--;
//     monthAge = 12 + monthNow - monthDob;
//   }

//   if (dateNow >= dateDob)
//     dateAge = dateNow - dateDob;
//   else {
//     monthAge--;
//     dateAge = 31 + dateNow - dateDob;

//     if (monthAge < 0) {
//       monthAge = 11;
//       yearAge--;
//     }
//   }

//   age = {
//     years: yearAge,
//     months: monthAge,
//     days: dateAge
//   };

//   if ((age.years > 0) && (age.months > 0) && (age.days > 0))
//     ageString = age.years;
//   else if ((age.years === 0) && (age.months === 0) && (age.days > 0))
//     ageString = "1";
//   else if ((age.years > 0) && (age.months === 0) && (age.days === 0))
//     ageString = age.years ;
//   else if ((age.years > 0) && (age.months > 0) && (age.days === 0))
//     ageString = age.years;
//   else if ((age.years === 0) && (age.months > 0) && (age.days > 0))
//     ageString = "1";
//   else if ((age.years > 0) && (age.months === 0) && (age.days > 0))
//     ageString = age.years;
//   else if ((age.years === 0) && (age.months > 0) && (age.days === 0))
//     ageString = age.months;
//   else ageString = "1";
//   return ageString;
// }


export function rearrangeDateFormatDateOnly(userInfo, dateValue) {

  // let splitChar = userInfo.ssitedatetime && userInfo.ssitedatetime.indexOf("/") !== -1 ? "/" : "-";

  const specialChars = `\`_-\[\]'"\\|,.\/`
  let splitChar = '';
  userInfo.ssitedatetime
    && userInfo.ssitedatetime.split('').some(word => {
      if (splitChar === undefined || splitChar === '') {
        if (specialChars.includes(word)) {
          splitChar = word;
        }
      }
    });


  if (typeof dateValue === "string") {//(splitChar === "/" || splitChar === "-") &&
    const firstField = userInfo.ssitedatetime && userInfo.ssitedatetime.split(splitChar)[0];
    const timeSplitChar = dateValue.indexOf("T") !== -1 ? "T" : " "
    const datetime = dateValue.split(timeSplitChar);
    return datetime[0];
  }
  else {
    return dateValue;
  }
}


export function getSameRecordFromTwoDifferentArrays(firstArray, secondArray, PrimaryKey) {
  let filterArray = [];
  for (var i = 0; i < firstArray.length; i++) {
    for (var j = 0; j < secondArray.length; j++) {
      if (firstArray[i][PrimaryKey] == secondArray[j][PrimaryKey]) {
        filterArray.push(secondArray[j]);
      }
    }
  }
  return filterArray;
}

export function childComboClear(inputParam) {
  if (inputParam.control.child && inputParam.control.child.length > 0) {
    inputParam.control.child.map(item => {
      inputParam.selectedRecord[item.label] = null;
      delete inputParam.comboData[item.label]
      const comboComponents = inputParam.comboComponents.filter(x => x.label === item.label)
      if (comboComponents.length > 0) {
        if (comboComponents[0].child && comboComponents[0].child.length > 0) {

          const inputChilParam = {
            control: comboComponents[0], comboComponents: inputParam.comboComponents,
            withoutCombocomponent: inputParam.withoutCombocomponent,
            selectedRecord: inputParam.selectedRecord, comboData: inputParam.comboData
          }
          const { selectedRecord, comboData } = childComboClear(inputChilParam)
          inputParam['selectedRecord'] = selectedRecord
          inputParam['comboData'] = comboData
        }

      }
    })
  }
  // else if(inputParam.control.dependedChildValues && inputParam.control.dependedChildValues.length > 0){
  //     inputParam.control.dependedChildValues.map(item => {
  //       inputParam.selectedRecord[item.label] = null;
  //       delete inputParam.comboData[item.label]
  //       const comboComponents = inputParam.comboComponents.filter(x => x.label === item.label)
  //       if (comboComponents.length > 0) {
  //         if (comboComponents[0].dependedChildValues && comboComponents[0].dependedChildValues.length > 0) {
  
  //           const inputChilParam = {
  //             control: comboComponents[0], comboComponents: inputParam.comboComponents,
  //             withoutCombocomponent: inputParam.withoutCombocomponent,
  //             selectedRecord: inputParam.selectedRecord, comboData: inputParam.comboData
  //           }
  //           const { selectedRecord, comboData } = childComboClear(inputChilParam)
  //           inputParam['selectedRecord'] = selectedRecord
  //           inputParam['comboData'] = comboData
  //         }
  
  //       }
  //     })
  //   }
  
  return { selectedRecord: inputParam.selectedRecord, comboData: inputParam.comboData }
}

export function childComboClearSubSample(inputParam) {
  if (inputParam.control.child && inputParam.control.child.length > 0) {
    inputParam.control.child.map(item => {
      inputParam.selectedRecord[item.label] = null;

      const optionList = constructjsonOptionDefault(inputParam.comboData[inputParam.control.label] || [], inputParam.control.valuemember,
        inputParam.control.displaymember, false, false, true, undefined, inputParam.control.source, inputParam.control.isMultiLingual)
      if (optionList.get("DefaultValue") === undefined) {
        delete inputParam.comboData[item.label]
      }
      const comboComponents = inputParam.comboComponents.filter(x => x.label === item.label)
      if (comboComponents.length > 0) {
        if (comboComponents[0].child && comboComponents[0].child.length > 0) {

          const inputChilParam = {
            control: comboComponents[0], comboComponents: inputParam.comboComponents,
            withoutCombocomponent: inputParam.withoutCombocomponent,
            selectedRecord: inputParam.selectedRecord, comboData: inputParam.comboData, clearComboData: true
          }
          const { selectedRecord, comboData } = childComboClearSubSample(inputChilParam)
          inputParam['selectedRecord'] = selectedRecord
          inputParam['comboData'] = comboData
        }

      }
    })
  }
  return { selectedRecord: inputParam.selectedRecord, comboData: inputParam.comboData }
}

export function CF_encryptionData(Data) {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const key = CryptoJS.PBKDF2("AGARAM_SDMS_SCRT", salt, {
    keySize: 128 / 32,
    iterations: 100,
  });
  const iv = CryptoJS.lib.WordArray.random(128 / 8);
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(Data), key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  const transitmessage = salt.toString() + iv.toString() + encrypted.toString();
  const ct = {
    EncryptData: transitmessage,
  };
  return ct;
}
export function removeIndex(data, removeIndex) {
  const data1 = [...data.splice(0, removeIndex), ...data.splice(removeIndex + 1)]
  return data1
}

export function compareArrays(a, b) {
  let boolean = false;
  if (a.length === b.length) {
    boolean = a.every(x => b.some(y => y.toString() === x.toString()));
  }
  return boolean;
};

export function Lims_JSON_stringify(s, emit_unicode) {
  var json = s;
  return emit_unicode ? json : json.replace(/[\u007f-\uffff]/g,
    function (c) {
      return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
    }
  );
}

export function copyText(text) {
  if (navigator && navigator.clipboard) {
    navigator.clipboard.writeText(text)
  } else {
    var textField = document.createElement('textarea')
    textField.innerText = text
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }

}

export function childSpecLoadCheck(templateManRecord, childcolumnlist, productCategory, map, parentLabel, selectedRecord) {
  let val = { productCategory, map }
  if (templateManRecord.child && templateManRecord.child.length > 0) {
    templateManRecord.child.map(ch => {
      const indexTemplateMandatory1 = childcolumnlist[parentLabel].findIndex(z => z.label === ch.label && z.templatemandatory && z.name === 'Product Category')
      if (indexTemplateMandatory1 !== -1) {
        const data = childcolumnlist[parentLabel][indexTemplateMandatory1]
        if (data.name === 'Product Category') {
          val = {
            productCategory: selectedRecord[data.label] === undefined ? false : true, map: {
              ...map, nproductcatcode: selectedRecord[data.label] ?
                selectedRecord[data.label].value : -1, nproductcode: -1
            }
          }
        }
      } else {
        if (childcolumnlist[ch.label]) {
          const vals = childcolumnlist[templateManRecord.label].filter(x => x.label === ch.label)
          if (vals.length > 0) {
            val = childSpecLoadCheck(vals[0], childcolumnlist, val.productCategory, val.map, ch.label, selectedRecord)
          }

        }
      }
    })
  }
  return { ...val }
}

//remove space for react awesome query builder
export function removeSpaceFromFirst(str, query1) {
  let query = query1;
  if(str!==undefined){
    const index = str.indexOf("'");
  // if(index !== undefined){
  if (index !== -1  ) {
    const st = str.substring(0, index + 1);
    const st1 = str.substring(index + 1);
    const index1 = st1.indexOf("'");
    if (st1.substring(0, 1) === " ") {
      query = query + st + st1.substring(1, index1 + 1);
      query = removeSpaceFromFirst(st1.substring(index1 + 1), query)
    } else if (st1.substring(0, 1) === "%") {
      if (st1.substring(1, 2) === " ") {
        query = query + st + st1.substring(0, 1) + st1.substring(2, index1 + 1);
        query = removeSpaceFromFirst(st1.substring(index1 + 1), query);
      } else {
        query = query + st + st1.substring(0, index1 + 1);
        query = removeSpaceFromFirst(st1.substring(index1 + 1), query);
      }
    } else {
      query = query + st + st1.substring(0, index1 + 1);
      query = removeSpaceFromFirst(st1.substring(index1 + 1), query);
    }
  } else {
    query = query + str;
  }
}else{
  query=str;
}
  return query
}

//Added For Mandatory Validation Start
export function onSaveMandatoryValidation(selectedRecord, mandatoryFields, onSaveClick, loadEsign, saveType) {
  const failedControls = [];
  const startLabel = [];
  let label = "IDS_ENTER";
  mandatoryFields.forEach(item => {
    if (selectedRecord[item.dataField] === undefined || selectedRecord[item.dataField] === null) {
      const alertMessage = (item.alertPreFix ? item.alertPreFix + " " : '') +
        intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? " " + item.alertSuffix : '')
      failedControls.push(alertMessage);
      startLabel.push(item.mandatoryLabel)
    }
    else {
      if (item.validateFunction) {
        const validateData = item.validateFunction;
        if (selectedRecord[item.dataField].trim().length === 0) {
          const alertMessage = intl.formatMessage({ id: item.idsName });
          failedControls.push(alertMessage);
          startLabel.push(item.mandatoryLabel)
        }
        else if (validateData(selectedRecord[item.dataField]) === false) {
          const alertMessage = (item.alertPreFix ? item.alertPreFix + " " : '') + intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? " " + item.alertSuffix : '')
          failedControls.push(alertMessage);
          startLabel.push(item.mandatoryLabel)
        }
      }
      else {
        if (typeof selectedRecord[item.dataField] === "object") {
          if (item.ismultilingual == "true") {
            let dataArray = 0;
            Object.values(selectedRecord[item.dataField])
              .map(lang => {
                if (lang.length === 0) {
                  dataArray++
                }
              }
              )
            if (dataArray > 0) {
              const alertMessage = (item.alertPreFix ? item.alertPreFix + " " : '') + intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? " " + item.alertSuffix : '')
              failedControls.push(alertMessage);
              startLabel.push(item.mandatoryLabel)//"I
            }
          } else {
            if (selectedRecord[item.dataField] && selectedRecord[item.dataField].length === 0) {
              const alertMessage = (item.alertPreFix ? item.alertPreFix + " " : '') + intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? " " + item.alertSuffix : '')
              failedControls.push(alertMessage);
              startLabel.push(item.mandatoryLabel)
            }
          }
        }
        else if (typeof selectedRecord[item.dataField] === "string") {
          if (selectedRecord[item.dataField].trim().length === 0) {
            const alertMessage = (item.alertPreFix ? item.alertPreFix + " " : '') + intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? " " + item.alertSuffix : '')
            failedControls.push(alertMessage);
            startLabel.push(item.mandatoryLabel)
          }
        }
        else {
          if (selectedRecord[item.dataField].length === 0
          ) {
            const alertMessage = (item.alertPreFix ? item.alertPreFix + " " : '') + intl.formatMessage({ id: item.idsName }) + (item.alertSuffix ? " " + item.alertSuffix : '')
            failedControls.push(alertMessage);
            startLabel.push(item.mandatoryLabel)
          }
        }
      }
    }
  });
  if (failedControls.length === 0) {
    //ALPD-3511 For checking esign agree
    if(loadEsign && loadEsign === true && selectedRecord.hasOwnProperty("agree") && selectedRecord["agree"] === transactionStatus.NO){
      toast.info(intl.formatMessage({ id: "IDS_CHECKAGREE" }));
    } else {
      onSaveClick(saveType);
    }
  }
  else {
    label = startLabel[0] === undefined ? label : startLabel[0];
    toast.info(`${intl.formatMessage({ id: label })} ${failedControls[0]}`);
  }

}
//Added for Mandatory Validation End
export function conditionBasedInput(control, value, name,defaultValue) {
  let inputvalues;
  if (control) {
    switch (control && control.label === name) {

      case control['isnumeric']: {
        //if (!control.ncustomization) {
         if( (control.precision && control.precision.length) > 0 ){
              let count=0;
        let  splitDotvalue=value.split("");
              splitDotvalue.map(x=>{
            if(x==='.'){
              count++;
            }
          })
          let precision=parseInt(control.precision);
          const regexPattern = new RegExp(`^-?\\d*(\\.\\d{0,${precision}})?$`);
          if(regexPattern.test(value)){
            if (parseFloat(control.max) < parseFloat(value)) {
            inputvalues =value.includes('.')?control.max.includes('.')?control.max:parseInt(control.max).toFixed(parseInt(control.precision)):parseInt(control.max).toFixed(parseInt(control.precision));
          } else if (parseFloat(control.min) > parseFloat(value)) {
            inputvalues = control.min.includes('.')?control.min:parseInt(control.min).toFixed(parseInt(control.precision))//:parseInt(control.min).toFixed(parseInt(control.precision));//defaultValue//control.min+'.' + valueSplit['1'];
          }else{
            if(value!== ''){
            let valueNumeric=parseInt(value.replace(/[^0-9.]/g, ''));
            inputvalues= count === 1 ? value: valueNumeric.toFixed(parseInt(control.precision));
            }
          }
          }else{
            inputvalues=defaultValue;
          }
      //     let splitDotvalue=[];
      //     let valueSplit=[];
      //     let count=0;
      //     valueSplit=value.split(".");
      //     splitDotvalue=value.split("");
      //     splitDotvalue.map(x=>{
      //       if(x==='.'){
      //         count++;
      //       }
      //     })
      //  //   let str=parseInt(control.sfieldlength)-parseInt(control.precision)
      //     if (parseInt(control.max) < parseInt(value)) {
      //       inputvalues =count === 1?control.max: control.max+'.' + valueSplit['1'];
      //     } else if (parseInt(control.min) > parseInt(value)) {
      //       inputvalues = defaultValue//control.min+'.' + valueSplit['1'];
      //     }else{
      //     //if(parseInt(str) <parseInt(valueSplit['0'] && valueSplit['0'].length)){
      //      // inputvalues =   (valueSplit['0'].slice(0, -1) + '' )+'.' + valueSplit['1'];
      //     //}else
      //      if(parseInt(control.precision)<parseInt(valueSplit['1'] && valueSplit['1'].length)){
      //       inputvalues = valueSplit['0']+'.'+ (valueSplit['1'].slice(0, -1) + '' );
      //     }else{
      //     let ValueString=value.replace(/[^0-9.]/g, '');
      //    let valueNumeric=parseInt(value.replace(/[^0-9.]/g, ''));
      //    // inputvalues =count > 1 ?  value.slice(0, -1) + '' :count === 1 ? 
      //     inputvalues =count > 1 ?  defaultValue : count === 1 ? 
      //     ValueString : value.match(/^[0-9]+$/) == null ? "": valueNumeric.toFixed(parseInt(control.precision));
      //   }
      // }
            }
            else{
          if (parseInt(control.max) < parseInt(value)) {
            inputvalues = control.max
          } else if (parseInt(control.min) > parseInt(value)) {
            inputvalues = control.min
          } else {
            inputvalues = value.replace(/[^0-9]/g, '');
          }
        }
       // } else {
         // inputvalues = value.replace(/[^0-9]/g, '');
      ///  }
        break;
      }
      case control['isalphabetsmall']: {
        inputvalues = value.replace(/[^a-z]/g, '');
        break;
      }
      case control['isalphabetcaptial']: {
        inputvalues = value.replace(/[^A-Z]/g, '');
        break;
      }
      case control['isalphabetspl']: {
        if (control.ncustomization) {
          let notAllowChar = false;
          if (control.nsplcharnotallow) {
            const splChar = control.nsplcharnotallow.split(/(?!$)/u);
            const valueList=value.split(/(?!$)/u);
            splChar.map(item => { valueList.map(item1=>{if(item === item1){notAllowChar = true}}) })  
          }
          if((parseInt(control.nmaxsmallletters) < value.replace(/[^a-z]/g, '').length)
          ||(parseInt(control.nmaxcapticalletters) < value.replace(/[^A-Z]/g, '').length)
// ALPD-5470 Added Spl Characters (,:,) Added by Abdul
          ||(parseInt(control.nsplchar) < value.replace(/[^!#$@%&'*+",./=?^_`{|}~():-]/gi, '').length)
          ||(parseInt(control.nmaxletters) < value.replace(/[^A-Z]/g, '').length))
          {
            inputvalues=defaultValue;
          }else{
            inputvalues=
            control.naviodsplchar ? 
// ALPD-5470 Added Spl Characters (,:,) Added by Abdul
            (notAllowChar ? defaultValue : value.replace(/[^a-z.!#$@%&'*+",./=?^_`{|}~():-]/gi, '')):
            control.ncasesensitive ?  value.replace(/[^A-Z.!#$@%&'*+",./=?^_`{|}~():-]/gi, '') : 
            control.ncaptialletters ?  value.replace(/[^A-Z.!#$@%&'*+",./=?^_`{|}~():-]/g, '') :
            control.nsmallletters ? value.replace(/[^a-z.!#$@%&'*+",./=?^_`{|}~():-]/g, '') 
            :value.replace(/[^a-z.!#$@%&'*+",./=?^_`{|}~():-]/gi, '')
            
          }
          // if (control.ncasesensitive) {
          //   if (parseInt(control.nmaxsmallletters) < value.replace(/[^a-z]/g, '').length) {
          //     inputvalues = value.slice(0, -1) + '';
          //   } else if (parseInt(control.nmaxcapticalletters) < value.replace(/[^A-Z]/g, '').length) {
          //     inputvalues = value.slice(0, -1) + '';
          //   }
          //   else if (parseInt(control.nsplchar) < value.replace(/[^!#$@%&'*+",./=?^_`{|}~-]/gi, '').length) {
          //     inputvalues = value.slice(0, -1) + '';
          //   } else {
          //     inputvalues = control.naviodsplchar ? notAllowChar ? value.slice(0, -1) + '' : value.replace(/[^A-Z.!#$@%&'*+",./=?^_`{|}~-]/g, '') : value.replace(/[^a-z.!#$@%&'*+",./=?^_`{|}~-]/gi, '');
          //   }
          // } else if (control.ncaptialletters) {
          //   if (parseInt(control.nmaxletters) < value.replace(/[^A-Z]/g, '').length) {
          //     inputvalues = value.slice(0, -1) + '';
          //   } else if (parseInt(control.nsplchar) < value.replace(/[^!#$@%&'*+",./=?^_`{|}~-]/gi, '').length) {
          //     inputvalues = value.slice(0, -1) + '';
          //   }
          //   else {
          //     inputvalues = control.naviodsplchar ? notAllowChar ? value.slice(0, -1) + '' : value.replace(/[^A-Z.!#$@%&'*+",./=?^_`{|}~-]/g, '') : value.replace(/[^A-Z.!#$@%&'*+",./=?^_`{|}~-]/g, '');
          //   }
          // } else if (control.nsmallletters) {
          //   if (parseInt(control.nmaxletters) < value.replace(/[^a-z]/g, '').length) {
          //     inputvalues = value.slice(0, -1) + '';
          //   } else if (parseInt(control.nsplchar) < value.replace(/[^!#$@%&'*+",./=?^_`{|}~-]/gi, '').length) {
          //     inputvalues = value.slice(0, -1) + '';
          //   } else {
          //     inputvalues = control.naviodsplchar ? notAllowChar ? value.slice(0, -1) + '' : value.replace(/[^a-z.!#$@%&'*+",./=?^_`{|}~-]/g, '') : value.replace(/[^a-z.!#$@%&'*+",./=?^_`{|}~-]/g, '');
          //   }
          // } else {
          //   if (parseInt(control.nmaxletters) < value.replace(/[^a-zA-Z]/gi, '').length) {
          //     inputvalues = value.slice(0, -1) + '';
          //   } else if (parseInt(control.nsplchar) < value.replace(/[^!#$@%&'*+",./=?^_`{|}~-]/gi, '').length) {
          //     inputvalues = value.slice(0, -1) + '';
          //   } else {

          //     inputvalues = control.naviodsplchar ? notAllowChar ? value.slice(0, -1) + '' : value.replace(/[^a-z.!#$@%&'*+",./=?^_`{|}~-]/gi, '') : value.replace(/[^a-z.!#$@%&'*+",./=?^_`{|}~-]/gi, '');
          //   }
          // }
        } else {
// ALPD-5470 Added Spl Characters (,:,) Added by Abdul
          inputvalues = value.replace(/[^a-z.!#$@%&'*+",./=?^_`{|}~():-]/gi, '');
        }
        break;
      }
      case control['isnumericspl']: {
        if (control.ncustomization) {
          let notAllowChar = false;
          if (control.nsplcharnotallow) {
            const splChar = control.nsplcharnotallow.split(/(?!$)/u);
            const valueList=value.split(/(?!$)/u);
            splChar.map(item => { valueList.map(item1=>{if(item === item1){notAllowChar = true}}) })  
            //splChar.map(item => { if (item === value.charAt(value.length - 1)) { notAllowChar = true } })
          }
          if ((parseInt(control.nmaxnumeric) < value.replace(/[^0-9]/g, '').length)
// ALPD-5470 Added Spl Characters (,:,) Added by Abdul
          ||(parseInt(control.nsplchar) < value.replace(/[^!#$@%&'*+",./=?^_`{|}~():-]/gi, '').length) ) {
            inputvalues=defaultValue;
            //inputvalues = value.slice(0, -1) + '';
          } 
          //else if (parseInt(control.nsplchar) < value.replace(/[^!#$@%&'*+",./=?^_`{|}~-]/gi, '').length) {
           // inputvalues = value.slice(0, -1) + '';
         // } 
          else {
            inputvalues = control.naviodsplchar ? notAllowChar ? defaultValue : 
            // ALPD-5470 Added Spl Characters (,:,) Added by Abdul
            value.replace(/[^0-9.!#$@%&'*+",./=?^_`{|}~():-]/g, '') : value.replace(/[^0-9.!#$@%&'*+",./=?^_`{|}~():-]/g, '');

          }
        } else {
          // ALPD-5470 Added Spl Characters (,:,) Added by Abdul
          inputvalues = value.replace(/[^0-9.!#$@%&'*+",./=?^_`{|}~():-]/g, '');
        } break;
      }
      case control['isalphanumeric']: {
        if (control.ncustomization) {
          if((parseInt(control.nmaxsmallletters) < value.replace(/[^a-z]/g, '').length)
          ||(parseInt(control.nmaxcapticalletters) < value.replace(/[^A-Z]/g, '').length)
        ||(parseInt(control.nmaxnumeric) < value.replace(/[^0-9]/g, '').length)
        ||(parseInt(control.nmaxletters) < value.replace(/[^A-Z]/g, '').length))
          {
            inputvalues=defaultValue;
          }else{
            inputvalues = control.ncasesensitive ? value.replace(/[^a-z0-9]/gi, '') : 
            control.ncaptialletters?value.replace(/[^A-Z0-9]/g, ''):
            control.nsmallletters?value.replace(/[^a-z0-9]/g, ''):value.replace(/[^a-z0-9]/gi, '');
          }
          // if (control.ncasesensitive) {
          //   if (parseInt(control.nmaxsmallletters) < value.replace(/[^a-z]/g, '').length) {
          //     inputvalues = value.slice(0, -1) + '';
          //   } else if (parseInt(control.nmaxcapticalletters) < value.replace(/[^A-Z]/g, '').length) {
          //     inputvalues = value.slice(0, -1) + '';
          //   } else if (parseInt(control.nmaxnumeric) < value.replace(/[^0-9]/g, '').length) {
          //     inputvalues = value.slice(0, -1) + '';
          //   } else {
          //     inputvalues = value.replace(/[^a-z0-9]/gi, '');
          //   }
          // } else if (control.ncaptialletters) {
          //   if (parseInt(control.nmaxletters) < value.replace(/[^A-Z]/g, '').length) {
          //     inputvalues = value.slice(0, -1) + '';
          //   }
          //   else if (parseInt(control.nmaxnumeric) < value.replace(/[^0-9]/g, '').length) {
          //     inputvalues = value.slice(0, -1) + '';
          //   } else {
          //     inputvalues = value.replace(/[^A-Z0-9]/g, '');
          //   }
          // } else if (control.nsmallletters) {
          //   if (parseInt(control.nmaxletters) < value.replace(/[^a-z]/g, '').length) {
          //     inputvalues = value.slice(0, -1) + '';
          //   } else if (parseInt(control.nmaxnumeric) < value.replace(/[^0-9]/g, '').length) {
          //     inputvalues = value.slice(0, -1) + '';
          //   } else {
          //     inputvalues = value.replace(/[^a-z0-9]/g, '');
          //   }
          // }
          // else {
          //   if (parseInt(control.nmaxletters) < value.replace(/[^a-zA-Z]/gi, '').length) {
          //     inputvalues = value.slice(0, -1) + '';
          //   } else if (parseInt(control.nmaxnumeric) < value.replace(/[^0-9]/gi, '').length) {
          //     inputvalues = value.slice(0, -1) + '';
          //   } else {
          //     inputvalues = value.replace(/[^a-z0-9]/gi, '');
          //   }
          // }
        } else {
          inputvalues = value.replace(/[^a-z0-9]/gi, '');
        }
        break;
      }
      case control['startnospecialcharacter']: {
        // if(value[0] !== '' && value[0].match(/[^a-zA-Z0-9]/)){
          if(/[^a-zA-Z0-9]/.test(value[0])){

          inputvalues=defaultValue;
        }else{
          inputvalues=value;
        }
        break;
      }

      default:
        if (control.ncustomization) {
          // if (control.ncasesensitive) {
          //   if (parseInt(control.nmaxsmallletters) < value.replace(/[^a-z]/g, '').length) {
          //     inputvalues = value.slice(0, -1) + '';
          //   } else if (parseInt(control.nmaxcapticalletters) < value.replace(/[^A-Z]/g, '').length) {
          //     inputvalues = value.slice(0, -1) + '';
          //   } else if (parseInt(control.nmaxnumeric) < value.replace(/[^0-9]/g, '').length) {
          //     inputvalues = value.slice(0, -1) + '';
          //   } else if (parseInt(control.nsplchar) < value.replace(/[^!#$@%&'*+",./=?^_`{|}~-]/gi, '').length) {
          //     inputvalues = value.slice(0, -1) + '';
          //   } else {
          //     inputvalues = value.replace(/[^a-z0-9.!#$@%&'*+",./=?^_`{|}~-]/gi, '');
          //   }
          // } else {
          //   if (parseInt(control.nmaxletters) < value.replace(/[^a-zA-Z]/gi, '').length) {
          //     inputvalues = value.slice(0, -1) + '';
          //   } else if (parseInt(control.nmaxnumeric) < value.replace(/[^0-9]/gi, '').length) {
          //     inputvalues = value.slice(0, -1) + '';
          //   }
          //   else if (parseInt(control.nsplchar) < value.replace(/[^!#$@%&'*+",./=?^_`{|}~-]/gi, '').length) {
          //     inputvalues = value.slice(0, -1) + '';
          //   } else {
          //     inputvalues = value.replace(/[^a-z0-9.!#$@%&'*+",./=?^_`{|}~-]/gi, '');
          //   }
          // }
          if((parseInt(control.nmaxsmallletters) < value.replace(/[^a-z]/g, '').length)
           ||(parseInt(control.nmaxcapticalletters) < value.replace(/[^A-Z]/g, '').length)
           ||(parseInt(control.nmaxnumeric) < value.replace(/[^0-9]/g, '').length)
// ALPD-5470 Added Spl Characters (,:,) Added by Abdul
           ||(parseInt(control.nsplchar) < value.replace(/[^!#$@%&'*+",./=?^_`{|}~():-]/gi, '').length)
           ||(parseInt(control.nmaxletters) < value.replace(/[^a-zA-Z]/gi, '').length))
           {
            inputvalues=defaultValue;
           // inputvalues = value.slice(0, -1) + '';
           }else{
// ALPD-5470 Added Spl Characters (,:,) Added by Abdul
            inputvalues = value.replace(/[^a-z0-9.!#$@%&'*+",./=?^_`{|}~():-]/gi, '');
           }
        } else {
          inputvalues = value;
        }
        break;
    }
  } else {
    inputvalues = value;
  }
  return inputvalues;
}

export function replaceBackSlash(dataList){ 

  return (dataList.replaceAll('\\','\\\\\\\\').replaceAll('\n','\\\\n').replaceAll('"','\\"').trim());
  
 };

 
 export function checkFilterIsEmptyQueryBuilder(treeData) {
  let ParentItem = { ...treeData };
  let isFilterEmpty=true;
      let childArray = ParentItem.children1;
      if (childArray && childArray.length > 0 && childArray !== undefined) {
          for (var i = 0; i < childArray.length; i++) {
              let childData = childArray[i]
              if (!childData.hasOwnProperty('children1')) {
                  if( childData.properties.field !== null && childData.properties.operator!=="is_empty"
                    && childData.properties.operator!=="is_not_empty"
                    && childData.properties.operator!=="is_null"
                    && childData.properties.operator!=="is_not_null" ){
                      if( childData.properties.field !== null && (childData.properties.operator==="not_equal"||childData.properties.operator==="equal") &&
                      childData.properties.valueSrc[0]==='func'){
                     isFilterEmpty= childData.properties.value[0] && childData.properties.value[0].args.str && childData.properties.value[0].args.str.value!=="" && 
                     childData.properties.value[0] && childData.properties.value[0].args.str && childData.properties.value[0].args.str.value!==undefined ? true:false;
                      }else{
                      isFilterEmpty= (childData.properties.value[0]!=="" && childData.properties.value[0]!==undefined)? true:false;
                      }
                      if(!isFilterEmpty){
                      return isFilterEmpty;
                  }
              }
              } else {
                  if (childData) {
                      ParentItem = checkFilterIsEmptyQueryBuilder(childData)
                      if(!ParentItem){
                          return ParentItem;
                      }
                  } 
              }
          }
      }
      return isFilterEmpty;
}

export function getFilterConditionsBasedonDataType(extractedColumnList,comboValues) {
  let fields = {};
  if (extractedColumnList.length > 0) {
    extractedColumnList.map(field => {
      field["staticField"]=field && field.staticField?true:false
        let fieldName = field.staticField ? field.dataField : field.idsName;
        switch (field.filterinputtype) {
            case "textinput":
                fields = {
                    ...fields,
                    [field.dataField]: {
                        "label": field.staticField ? intl.formatMessage({
                            id: field.idsName,
                        }) : field.idsName,
                        "type": "text",
                        "valueSources": ["value", "func"],
                    }
                }
                break;
            case "combo":
                fields = {
                    ...fields,
                    [field.dataField]: {
                        "label": field.staticField ? intl.formatMessage({
                            id: field.idsName,
                        }) : field.idsName,
                        "type": "select",
                        "valueSources": ["value"],
                        "fieldSettings": {
                            "listValues": comboValues && comboValues[fieldName]
                        }
                    }
                }
                break;
            case "date":
                fields = {
                    ...fields,
                    [field.dataField]: {
                        "label": field.staticField ? intl.formatMessage({
                            id: field.idsName,
                        }) : field.idsName,
                        "type": "date",
                        "valueSources": ["value"],
                    }
                }
                break;
            case "Numeric":
                fields = {
                    ...fields,
                    [field.dataField]: {
                        "label": field.staticField ? intl.formatMessage({
                            id: field.idsName,
                        }) : field.idsName,
                        "type": "number",
                        "valueSources": ["value"],
                    }
                }
                break;
        }
    });
}
return fields;
}
export function queryBuilderfillingColumns(data,slanguagetypecode){
  const temparray =[];
  data && data.map((option) => {  
    if(option.samplefiltertypefields ===true) { 
     temparray.push( {
         "idsName": option.realData[designProperties.LABEL][slanguagetypecode],
         "dataField": option[designProperties.RECORDTYPE]==='static'?"(jsondata->>'"+option[designProperties.PRIMARYKEY]+"')::int" :option.realData[designProperties.LISTITEM]==='combo'? 
         "(jsondata->'"+option.realData[designProperties.VALUE]+"'->>'"+option.realData[designProperties.PRIMARYKEY]+"')::int" : option.realData[designProperties.LISTITEM]==='Numeric'?"(jsondata->>'"+option.realData[designProperties.VALUE]+"')::int":"(jsondata->>'"+option.realData[designProperties.VALUE]+"')", "width": "200px", "filterinputtype": option.realData[designProperties.LISTITEM]
     })
 };
 });
 return temparray;
}
//SWSM-121 committed by rukshana behalf of Neeraj
export function isValidClosedTag(str) {
  const firstOpen = str.indexOf("<");
  const firstCloseAfterOpen = str.indexOf(">", firstOpen + 1);
  if (firstOpen !== -1 && firstCloseAfterOpen !== -1) {
    return false;
  }
  return true;
}