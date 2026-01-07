import styled from 'styled-components';
export const ClientList = styled.div`

`;

export const ReadOnlyText = styled.span`
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary-color);
    display: block;
    margin-bottom: 10px;
    line-height: 1;
`;

export const SearchAdd = styled.div`
    padding: .688rem 1.5rem;
    border-right: 1px solid var(--border-primary);
    .form-control {
        color: var(--text-primary-color);
        max-width: 12rem;
        font-size: 0.875rem;
    }
    .input-group>.form-control:not(:last-child) {
        border-radius: 0.25rem;
    }
    .input-group-text {
        background: none;
        border: 0;
    }
`;
export const MediaHeader = styled.h5`
    color: var(--text-primary-color);
    margin-top: 0;
    margin-bottom: 0;
    font-weight: 600;
    word-break: break-all;
`;
export const MediaSubHeader = styled.div`
    color: var(--text-primary-color);
    font-size: .875rem;
`;
export const MediaLabel = styled.span`

`;
export const ContentPanel = styled.div`
    &.border-left-1 {
        border-left: 1px solid var(--border-primary);
    }
`;
export const ContentHeader = styled.h1`
        font-size: 2.25rem;
        font-weight: 600;
        color: #172b4d;
`;
export const MediaSubHeaderText = styled.h5`
    color: var(--text-secondary-color) !important;
    font-size: .875rem!important;
    margin-bottom:0;
`;


// Common Theme
export const ModalInner = styled.div`
    .card-body {
        padding: 2rem;
    }
`;

// For common spacing 

export const AtWell = styled.div`
    padding: 0 1.5rem;
    /* margin-bottom: .5rem */
`;
export const AtSubCard = styled.div`
    padding: 1rem 2rem;
    .form-group {
        margin-bottom: 0;
    }
    .btn-circle.nav-link {
        padding: .5rem .85rem !important;
    }
`;

//Added by L.Subashini
export const OutlineTransactionStatus = styled.span`
    padding: 0.20rem 1.2rem;
    border-radius: 2rem;
    border: 2px solid transparent;
    text-transform: uppercase;
    line-height: 1.3;
    font-size: 0.8rem !important; 
    font-weight: 600 !important;
    margin-left:1rem  ;
    border-color: ${props =>props.transcolor};
    color: ${props =>props.transcolor};
`;

export const DecisionStatus = styled.span`
    margin-left:1rem  ;
    font-size: 1rem !important; 
    font-weight: 600 !important;
    color: ${props =>props.decisioncolor};
`;

// Search Icon must be wrapped inside input group
export const SearchIcon = styled.span`

`;

