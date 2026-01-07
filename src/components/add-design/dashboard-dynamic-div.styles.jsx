import styled from 'styled-components';

export const DynamicDiv = styled.div`
    height: ${props=> props.height}vh;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: ${props => props.borderTop ? "0": "1"}px;
    border-bottom: ${props => props.borderBottom ? "0": "1"}px;
    border-left: ${props => props.borderLeft ? "0": "1"}px;
    border-right: ${props => props.borderRight ? "0": "1"}px;
    border-color: #1268e3;
    border-style: solid;
`;

// export const DynamicDivPadding = styled.div`
//     height: 30vh; 
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     border-top: ${props => props.borderTop ? "0": "1"}px;
//     border-bottom: ${props => props.borderBottom ? "0": "1"}px;
//     border-left: ${props => props.borderLeft ? "0": "1"}px;
//     border-right: ${props => props.borderRight ? "0": "1"}px;
//     border-color: grey;
//     border-style: solid;
// `;

