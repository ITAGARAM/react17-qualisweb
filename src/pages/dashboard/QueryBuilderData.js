export const stringOperatorData = [
    { label: "equals(=)", value: 1, items: { label: "==", value: 1, symbol: "$eq", isInputVisible: true, symbolType: 1, needmasterdata: true } },
    { label: "!=", value: 2, items: { label: "!=", value: 2, symbol: "$ne", isInputVisible: true, symbolType: 1, needmasterdata: true } },
    { label: "Is empty", value: 3, items: { label: "Is empty", value: 3, symbol: "$eq", isInputVisible: false, symbolType: 2, needmasterdata: false } },
    { label: "Is not empty", value: 4, items: { label: "Is not empty", value: 4, symbol: "$ne", isInputVisible: false, symbolType: 2, needmasterdata: false } },
    { label: "Is null", value: 5, items: { label: "Is null", value: 5, symbol: "$nnull", isInputVisible: false, symbolType: 3, needmasterdata: false } },
    { label: "Is not null", value: 6, items: { label: "Is not null", value: 6, symbol: "$null", isInputVisible: false, symbolType: 3, needmasterdata: false } },
    { label: "Like", value: 7, items: { label: "Like", value: 7, symbol: "$like", replacewith: "'%_%'", isInputVisible: true, symbolType: 4, needmasterdata: false } },
    { label: "Not like", value: 8, items: { label: "Not like", value: 8, symbol: "$nlike", replacewith: "'%_%'", isInputVisible: true, symbolType: 4, needmasterdata: false } },
    { label: "Starts with", value: 9, items: { label: "Starts with", value: 9, symbol: "$like", replacewith: "'_%'", isInputVisible: true, symbolType: 4, needmasterdata: false } },
    { label: "Ends with", value: 10, items: { label: "Ends with", value: 10, symbol: "$like", replacewith: "'%_'", isInputVisible: true, symbolType: 4, needmasterdata: false } },
    { label: "Any in", value: 11, items: { label: "Any in", value: 3, symbol: "$in", isInputVisible: true, ismulti: true, symbolType: 6, needmasterdata: true } },
    { label: "Not in", value: 12, items: { label: "Not in", value: 4, symbol: "$nin", isInputVisible: true, ismulti: true, symbolType: 6, needmasterdata: true } }
];

export const numericOperatorData = [
    { label: "equals(=)", value: 1, items: { label: "==", value: 1, symbol: "$eq", isInputVisible: true, symbolType: 1 } },
    { label: "!=", value: 2, items: { label: "!=", value: 2, symbol: "$ne", isInputVisible: true, symbolType: 1 } },
    { label: "<", value: 3, items: { label: "<", value: 3, symbol: "$lt", isInputVisible: true, symbolType: 1 } },
    { label: "<=", value: 4, items: { label: "<=", value: 4, symbol: "$lte", isInputVisible: true, symbolType: 1 } },
    { label: ">", value: 5, items: { label: ">", value: 5, symbol: "$gt", isInputVisible: true, symbolType: 1 } },
    { label: ">=", value: 6 , items: { label: ">=", value: 6, symbol: "$gte", isInputVisible: true, symbolType: 1 }},
    { label: "Between", value: 7, items: { label: "Between", value: 7, symbol: "", replacewith: ["$gte", "$lte"], isInputVisible: true, symbolType: 5 } },
    { label: "Not between", value: 8, items: { label: "Not between", value: 8, symbol: "$not", replacewith: ["$gte", "$lte"], isInputVisible: true, symbolType: 5 } },
    { label: "Is null", value: 9, items: { label: "Is null", value: 9, symbol: "$nnull", isInputVisible: false, symbolType: 3 } },
    { label: "Is not null", value: 10, items: { label: "Is not null", value: 10, symbol: "$null", isInputVisible: false, symbolType: 3 } }
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
    { label: "Inner join", value: 1, items: { label: "Inner join", value: 1, symbol: "inner" } },
    { label: "Left join", value: 2, items: { label: "Left join", value: 2, symbol: "left" } },
    { label: "Right join", value: 3, items: { label: "Right join", value: 3, symbol: "right" } }
];

export const aggregateFunction = [
    { label: "Min", value: 1, items: { label: "Min", value: 1 } },
    { label: "Max", value: 2, items: { label: "Max", value: 2 } },
    { label: "Sum", value: 3, items: {  label: "Sum", value: 3 } },
    { label: "Count", value: 4, items: { label: "Count", value: 4 } },
    { label: "Avg", value: 5, items: {  label: "Avg", value: 5 } }
];

export const orderByList = [
    { label: "asc", value: 1, items: { label: "asc", value: 1 } },
    { label: "desc", value: 2, items: { label: "desc", value: 2 } }
];