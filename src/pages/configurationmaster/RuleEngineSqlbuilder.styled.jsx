import styled from 'styled-components';

export const BuilderBorder = styled.div`
    margin-bottom: 1em;
    padding: 4px;
    border: 1px solid #dee2e6;
`;

export const DeleteRule = styled.div`
    margin-left: ${props => props.marginLeft}rem;
    padding: 0.6rem 0.75rem;
`;

export const ContionalButton = styled.button`
    margin-left: ${props => props.marginLeft}rem;
    height: 24px;
    padding: 0px 7px;
    border: 1px solid transparent;
`;