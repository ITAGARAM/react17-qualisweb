import styled from 'styled-components';

export const EditableTree = styled.div`
.k-widget {
    .k-treeview-item {
        .k-in {
            font-size: 12px;
            color: #415364;
            font-weight: 500;
            margin-left: .25rem;
            width: 100%;
            .form-group {
                display: inline-flex;
                align-items: center;
                width: 100%;
            }
            &.k-state-focused {
                box-shadow: none;
                background-color: #fff;
            }
            &:hover {
                box-shadow: none;
                background-color: #fff;
            }
        }
        .k-editable-text-wrap {
            .k-textbox {
                border-color: #b9c6d2;
                color: #415364;
                font-size: 14px;
                height: 30px;
                &:focus {
                    box-shadow: none;
                }
            }
            .k-icon {
                cursor: pointer;
                &.k-i-check {
                    color: #32b004;
                }
                &.k-i-close {
                    color: #ce3f0d;
                }
                &.k-i-delete {
                    color: #087cd0;
                }
            }
        }
        .k-mid + .k-animation-container-relative {
            width: 100%;
        }
    }
}
`;


