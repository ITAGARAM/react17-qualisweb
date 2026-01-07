import styled from "styled-components";

export const TreeDesign = styled.div`
border:1px solid rgba(192, 198, 206, 0.46);
height:16.5em;
pointer-events: ${props => props.operation === "update" ? "none": "auto"}
`;

// export const HeaderSpan = styled.span`
// position: relative;
// left:0px !important;
// top:5px;
// font-weight:600
// ` ;

export const HeaderSpan = styled.span`
position: absolute;
left:2px !important;
font-weight:600
` ;