import styled from 'styled-components';
export const AtAccordion = styled.div `
.accordion .card {
    border: 1px solid var(--border-primary);
}
 /* .accordion .card-header .card-title:after {
     width: 1rem;
     text-align: center;
     float: right;
     vertical-align: 0;
     border: 0;
     font-weight: 900;
     content: '\f077';
     font-family: 'Font Awesome 5 Free';
     color: #4e607c;
 }
 .accordion .card-header.collapsed .card-title:after {
     content: "\f078";
 } */
.accordion>.card .card-header {
    margin-bottom: 0px;
    background: none;
    border-bottom: 1px solid var(--border-primary);
    cursor: pointer;
}
.accordion>.card .card-header.collapsed {
    margin-bottom: -1px;
}

.accordion>.card .card-header .card-title {
    font-size: 1rem;
    font-weight: bold;
    color: #172b4d;
    margin-bottom: 0;
}

.accordion>.card .card-header.collapsed .card-title {
    font-weight: normal;
}
// .accordion>.card .card-body .form-group.floating-label{
//     margin-bottom: 0;
// }
/* .form-group.floating-label + .form-group.floating-label {
    margin-bottom: 0 !important;
} */
`;