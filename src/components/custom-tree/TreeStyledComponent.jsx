import styled from "styled-components";

// const getNodeWidth = (level, type) => {
//     let width = level * 20;
//     if(type === 'root') {
//         return width += 10;
//     } else {
//         return width;
//     }
// }

// const getMarginLeft = (level, type) => {
//     let marginLeft = 40;
//     if(type === "root") {
//         return marginLeft;
//     } else {
//         return (level * 10) + marginLeft;
//     }
// }

export const ListNode = styled.div`
    list-style-type: none;
`;

export const ChildNode = styled.div`
    margin-left: ${props => props.type === "root" && props.childLength === 0?  20:(props.level + 4) * 10}px;
    &:hover {
        background: rgba(0, 123, 255, 0.25);
    }
`;

// export const StyledTreeNode = styled.div`
//     display: flex;
//     flex-direction: row;
//     align-items: center;
//     padding: 5px 8px 5px 0px;
// `;

export const NodeIcon = styled.span`
    font-size: 0.75rem;
    color: #97a0af;
    // background: ${props => props.type === "root" && props.length>0? "": "#e2e5e9"};
`;

// export const NodeIcon = styled.div`
//     font-size: 12px;
//     margin-right: ${props => props.marginRight? props.marginRight: 5}px;
// `;

// export const TreeLine = styled.span`
//     display: inline-block;
//     height: 1px;
//     width: ${props => getNodeWidth(props.level, props.type)}px;
//     position: relative;
//     background: #e2e5e9;
// `;

// export const Spacer = styled.i`
//     width: 15px;
//     display: inline-block;
//     height: 1px;
//     margin-left: -10px;
//     position: relative;
//     background: #e2e5e9;
// `;

// export const TemplateNodeName = styled.span`
//     font-size: 0.75rem;
//     color: #97a0af;
//     margin-bottom: 0;
// `;

export const NodeInput = styled.div`
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary-color);
    border-bottom: 1px solid #e2e5e9;
    margin-bottom: 1rem;
`;

export const TreeDiv = styled.div`
    border-left: 1px solid #e2e5e9; 
    &:before {
        content: '';
        display: inline-block;
        width: 1px;
        height: 14px;
        background-color: #fff;
        margin-top: 0;
        position: absolute;
        left: 20px;
    }
    &:after {
        content: '';
        display: inline-block;
        left: 1.25rem;
        bottom: 1.3rem;
        width: 1px;
        height: 50px;
        background-color: #fff;
        margin-top: -90px;
        position: absolute;
    }
`;

export const ProfileTag = styled.div`
    border-left: 1px solid #e2e5e9; 
    &:before {
        content: '';
        display: inline-block;
        width: 1px;
        height: 14px;
        background-color: #fff;
        margin-top: -1px;
        position: absolute;
        left: 15px;
    }
    &:after {
        content: '';
        display: inline-block;
        left: 0.95rem;
        bottom: 1.25rem;
        width: 1px;
        height: 50px;
        background-color: #fff;
        margin-top: -70px;
        position: absolute;
    }
`;