import styled, {css} from 'styled-components';

export const AtTableWrap = styled.div`
.k-grid-toolbar {
    background-color: #FFF;
    margin: -1px -1px 0 -1px;
    padding: 1rem 0;
    border-color: var(--border-primary);
    text-align: right;
    display:block;
}
.k-grid, .k-grid .k-grid-content, .k-grid-header, .k-grid-header th.k-grid-header-sticky {
    border-color: var(--border-primary);
}
.k-grid th {
    font-size: .85rem;
    color: #172b4d;
    /* text-transform: uppercase; */
    font-weight: bold;
    // padding: 1rem 2rem;
}
/* For Adjusting last column in grid */
${props => props.actionColWidth && css`
    table > colgroup col:last-of-type{
        width: ${props.actionColWidth};
    }
    .k-grid-table col:last-of-type{
        width: ${props.actionColWidth};
    }
`}

.k-grid-header .k-header.active > div > div {
    color: var(--background-primary);
}
.k-grid .k-master-row td.active {
    background-color: var(--background-primary-shadow);
    /* rgba(0, 123, 255, 0.25); */
}
.no-paging .k-pager-numbers-wrap{
    display:none;
}
.k-grid th, .k-grid td {
    /* border-width: 0; */
    // padding: 1rem 2rem;
}
.k-grid td {
    border-width: 0 0 1px 0;
    border-color: var(--border-primary);
    font-weight: 600;
    color: var(--text-primary-color);
    padding: .5rem .75rem;
    background-color: #fff;
    /* overflow: hidden;
    text-overflow: ellipsis; */
    white-space: nowrap;
}
.k-grid .k-alt, 
.k-master-row.k-alt .k-grid-content-sticky,
.k-master-row:hover .k-grid-content-sticky {
    background-color: #fff;
}
.k-grid-pager {
    border-color: var(--border-primary);
    color: var(--text-primary-color);
    background-color: #fff;
    padding: 1rem 2rem;
    border: 0;
}
.k-pager-input, .k-pager-sizes, .k-pager-info {
    display: flex !important;
}
.k-grid-pager .k-i-arrow-e::before {
	content: 'A'
}

.k-grid-pager .k-i-arrow-w::before {
	content: 'B'
}
.k-pager-numbers .k-link.k-state-selected {
    border-color: var(--background-primary);
    background-color: #FFF;
    color: var(--background-primary);
}
.k-pager-numbers .k-link.k-selected{
    border-color: var(--background-primary);
    background-color: #FFF;
    color: var(--background-primary);
    border-width:1px;
}
.k-pager-numbers .k-link, .k-pager-nav.k-link {
    color: var(--text-primary-color);
    border-color: var(--border-primary);
    font-weight: 600;
    &:hover {
        background-color: var(--background-primary);
        color: #FFF;
        border-color: var(--background-primary);
    }
}
.k-pager-wrap .k-dropdown .k-dropdown-wrap {
    border-color: var(--border-primary);
}
.k-pager-numbers .k-link:focus {
    box-shadow: none;
}
.k-grid  .k-hierarchy-cell {
    padding: 0;
}
.k-grid-header th.k-grid-header-sticky {
    background-color:#f8f9fa;
    color: #172b4d;
}
// For Multilevel Table Resize issue 
.k-grid-table {
    width: 100% !important;
}
.k-grid-header-wrap > table{
    width: 100% !important;
}
/*grid filter color change sathish*/
.k-grid .k-filterable.k-header.active > span > div.k-grid-filter
{
color:var(--background-primary);
}

`;
export const FormControlStatic = styled.div`
    color: var(--text-primary-color);
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 10px;
    white-space: normal;
`;
export const FontIconWrap = styled.span`

`;