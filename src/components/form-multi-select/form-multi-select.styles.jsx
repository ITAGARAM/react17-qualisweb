import styled from 'styled-components';

export const MultiSelectWrap = styled.div`
    .form-label {
        margin-bottom: 0;
    }
    .multi-select { 
        .dropdown-container {
            border-radius: 0;
            border-left: 0;
            border-right: 0;
            border-top: 0;
            color: var(--text-primary-color);
            font-weight: 600;
            border-color: rgba(192, 198, 206, 0.46);
            &:focus-within {
                outline: 0;
                box-shadow: none;
                border-color: rgba(192, 198, 206, 0.46);
            }
            .dropdown-heading {
                padding: .375rem 0;
                &:focus {
                    outline: 0;
                    box-shadow: none;
                    border-color: rgba(192, 198, 206, 0.46);
                }
                .dropdown-heading-value {
                    outline: 0;
                    .gray {
                        // color: var(--text-primary-color);
                        color:#bab9b9;
                        font-size:.85rem;
                    }
                }
            }
            .dropdown-content {
                z-index: 10;
                &:focus {
                    outline: 0;
                    box-shadow: none;
                    border-color: rgba(192, 198, 206, 0.46);
                }
            }
        }
    }
`;
