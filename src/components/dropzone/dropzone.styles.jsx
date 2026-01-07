import styled from 'styled-components';

export const Dzwrap = styled.div`
    .dropzone {
        border: 2px dashed #caced6;
        background-color: rgba(226, 229, 233, 0.29);
        border-radius: 1rem;
        font-size: 0.85rem;
        color: rgba(80, 95, 121, 0.66);
        margin: .75rem 0;
        padding: 20px 20px;
        min-height: 150px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
    .dropzone:focus {
        outline: 0;
    }
    .list-group-item {
        border-color: var(--border-primary);
        padding: .75rem 0;
    }
`;
export const DzMessage = styled.div` 
    .dz-message {
        border-color: var(--border-primary);
    }

`;
export const Attachments = styled.div` 
    .svg-inline--fa {
        cursor: pointer;
    }
`;
// export const DzHeader = styled.h3` 
//     color: #172b4d;
//     font-size: 18px;
//     font-weight: 600;
//     margin-bottom: 0;
// `;