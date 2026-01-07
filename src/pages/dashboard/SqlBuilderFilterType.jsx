export const stringOperatorData = [
    { label: "NULL", value: "IS NULL", items: { label: "NULL", value: "IS NULL",  symbol: "$eq", isInputVisible: true, symbolType: 1, needmasterdata: true } },
    { label: "NOT NULL", value:"IS NOT NULL", items: { label: "NOT NULL", value:"IS NOT NULL", symbol: "$ne", isInputVisible: true, symbolType: 1, needmasterdata: true } },
    { label: "PRESENT", value: "PRESENT", items: { label: "PRESENT", value: "PRESENT", symbol: "$eq", isInputVisible: false, symbolType: 2, needmasterdata: false } },
    { label: "BLANK", value: "BLANK", items: {label: "BLANK", value: "BLANK",  symbol: "$ne", isInputVisible: false, symbolType: 2, needmasterdata: false } },
    { label: "LIKE", value: "LIKE", items: {  label: "LIKE", value: "LIKE", symbol: "$nnull", isInputVisible: false, symbolType: 3, needmasterdata: false } },
    { label: "NOT LIKE", value: "NOT LIKE", items: {  label: "NOT LIKE", value: "NOT LIKE", value: 6, symbol: "$null", isInputVisible: false, symbolType: 3, needmasterdata: false } },
    { label: "IS", value:"=", items: { label: "IS", value:"=",symbol: "$like", replacewith: "'%_%'", isInputVisible: true, symbolType: 4, needmasterdata: false } },
    { label: "NOT", value: "NOT", items: { label: "NOT", value: "NOT", symbol: "$nlike", replacewith: "'%_%'", isInputVisible: true, symbolType: 4, needmasterdata: false } },
    { label: "STARTS WITH", value: "STARTS WITH", items: { label: "STARTS WITH", value: "STARTS WITH", symbol: "$like", replacewith: "'_%'", isInputVisible: true, symbolType: 4, needmasterdata: false } },
    { label: "ENDS WITH", value:"ENDS WITH", items: { label: "ENDS WITH", value:"ENDS WITH",  symbol: "$like", replacewith: "'%_'", isInputVisible: true, symbolType: 4, needmasterdata: false } },
    { label: "IN", value: "IN", items: {label: "IN", value: "IN", symbol: "$in", isInputVisible: true, ismulti: true, symbolType: 6, needmasterdata: true } },
    { label: "CONTAINS", value:"CONTAINS", items: { label: "CONTAINS", value:"CONTAINS", symbol: "$nin", isInputVisible: true, ismulti: true, symbolType: 6, needmasterdata: true } }
];

export const numericOperatorData = [
    { label: "=", value: "=", items: { label: "=", value: "=",  symbol: "$eq", isInputVisible: true, symbolType: 1 } },
    { label: "!=", value: "!=", items: { label: "!=", value: "!=", symbol: "$ne", isInputVisible: true, symbolType: 1 } },
    { label: "<", value: "<", items: {label: "<", value: "<", symbol: "$lt", isInputVisible: true, symbolType: 1 } },
    { label: "<=", value: "<=", items: {label: "<=", value: "<=", symbol: "$lte", isInputVisible: true, symbolType: 1 } },
    { label: ">", value: ">", items: { label: ">", value: ">",  symbol: "$gt", isInputVisible: true, symbolType: 1 } },
    { label: ">=", value:">=" , items: { label: ">=", value:">=" , symbol: "$gte", isInputVisible: true, symbolType: 1 }},
    { label: "IN", value:"IN", items: { label: "IN", value:"IN", symbol: "", replacewith: ["$gte", "$lte"], isInputVisible: true, symbolType: 5 } },
    { label: "NULL", value:"NULL", items: {label: "NULL", value:"NULL", symbol: "$not", replacewith: ["$gte", "$lte"], isInputVisible: true, symbolType: 5 } },
    { label: "NOT NULL", value: "NOT NULL", items: { label: "NOT NULL", value: "NOT NULL", symbol: "$nnull", isInputVisible: false, symbolType: 3 } }

];

export const summarizeOperatorData = [
    { label: "=", value: "=", items: { label: "=", value: "=",  symbol: "$eq", isInputVisible: true, symbolType: 1 } },
    { label: "!=", value: "!=", items: { label: "!=", value: "!=", symbol: "$ne", isInputVisible: true, symbolType: 1 } },
    { label: "<", value: "<", items: {label: "<", value: "<", symbol: "$lt", isInputVisible: true, symbolType: 1 } },
    { label: "<=", value: "<=", items: {label: "<=", value: "<=", symbol: "$lte", isInputVisible: true, symbolType: 1 } },
    { label: ">", value: ">", items: { label: ">", value: ">",  symbol: "$gt", isInputVisible: true, symbolType: 1 } },
    { label: ">=", value:">=" , items: { label: ">=", value:">=" , symbol: "$gte", isInputVisible: true, symbolType: 1 }}
];

export const conditionalOperatorData = [
    { label: "equals (=)", value: 1, items: { label: "equals (=)", value: 1, symbol: "$eq", isInputVisible: true, ismulti: false, symbolType: 1 } },
    { label: "not equals (!=)", value: 2, items: { label: "not equals (!=)", value: 2, symbol: "$ne", isInputVisible: true, ismulti: false, symbolType: 1 } },
    { label: "Any in", value: 3, items: { label: "Any in", value: 3, symbol: "$in", isInputVisible: true, ismulti: true, symbolType: 6 } },
    { label: "Not in", value: 4, items: { label: "Not in", value: 4, symbol: "$nin", isInputVisible: true, ismulti: true, symbolType: 6 } },
    { label: "Is null", value: 5, items: { label: "Is null", value: 5, symbol: "$nnull", isInputVisible: false, ismulti: false, symbolType: 3 } },
    { label: "Is not null", value: 6, items: { label: "Is not null", value: 6, symbol: "$null", isInputVisible: false, ismulti: false, symbolType: 3 } }
];

export const joinConditionData = [
    { label: "Inner Join", value: "INNER JOIN", items: { label: "Inner Join", value: "INNER JOIN", symbol: "inner" } },
    { label: "Left Join", value: "LEFT JOIN", items: { label: "Left Join", value: "LEFT JOIN", symbol: "left" } },
    { label: "Right Join", value:"RIGHT JOIN", items: { label: "Right Join", value: "RIGHT JOIN", symbol: "right" } }
];

export const dateConditionData = [
    { label: "NULL", value: "IS NULL" },
    { label: "NOT NULL", value: "IS NOT NULL"},
    { label: "ON", value: "=" },
    { label: "AFTER(ABSOLUTE)", value: ">" },
    { label: "BEFORE(ABSOLUTE", value: "<", items: { label: "Right join", value: 3, symbol: "right" } },
   // { label: "AFTER(RELATIVE)", value: "ON", items: { label: "Right join", value: 3, symbol: "right" } },
   // { label: "BEFORE(RELATIVE)", value: "ON", items: { label: "Right join", value: 3, symbol: "right" } },
    { label: "NOT", value: "NOT" },
    // { label: "TODAY", value: "TODAY"},
    // { label: "YESTERDAY", value: "YESTERDAY"},
    // { label: "THIS WEEK", value: "THIS WEEK" },
    // { label: "LAST WEEK", value: "LAST WEEK"},
    // { label: "THIS MONTH", value: "THIS MONTH" },
    // { label: "LAST MONTH", value: "LAST MONTH" },
];


export const aggregateFunction = [
   // { label: "Min", value: 1, items: { label: "Min", value: 1 } },
    //{ label: "Max", value: 2, items: { label: "Max", value: 2 } },
   // { label: "Sum", value: 3, items: {  label: "Sum", value: 3 } },
    { label: "Count", value: "COUNT", items: { label: "Count", value:"COUNT" } },
    { label: "Distinct Count", value:"DISTINCT", items: { label: "Count", value:"DISTINCT" } },
  //  { label: "Avg", value: 5, items: {  label: "Avg", value: 5 } }
];

export const orderByList = [
    { label: "Ascending", value: "asc", items: { label: "Ascending", value:"asc"} },
    { label: "Descending", value: "desc", items: { label: "Descending", value: "desc"} }
];

export const joinCondition = [
    { label: "And", value: 'And', items: { label: "asc", value: 1 } },
    { label: "OR", value: 'OR', items: { label: "desc", value: 2 } }
];