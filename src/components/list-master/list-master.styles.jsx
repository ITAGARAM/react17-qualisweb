import styled from 'styled-components';
export const ListMasterWrapper = styled.div`
    .search-add {
        padding: .688rem 2rem;
        border-right: 1px solid var(--border-primary);
    }
    .product-list {
        border-right: 1px solid var(--border-primary);
        // min-height: 100vh;
    }
    //  .list_rightborder{
    //     min-height: 79vh;
    // }
    .product-list .list-group .k-listview {
        border: 0;
    }
    .product-list .list-group-item:first-child {
        border-radius: 0;
    }
    .product-list .list-group-item {
        border-color: var(--border-primary);
        padding: 1.25rem  1.5rem ;
        background-color: transparent;
    }
    .product-list .list-group-item .media .media-body, .product-list .list-group-item .media .media-body h5 {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary-color);
    }
    .product-list .list-group-item.active {
        border-radius: 0;
        z-index: 0;
        position :relative;
    }
    .product-list .list-group-item.active:after{
        position: absolute;
        right:-1px;
        top:0;
        bottom:0;
        width:4px;
        background: var(--background-primary-active);
        content:"";
        z-index:99;
    }
    .label-circle {
        height: 2.5rem;
        width: 2.5rem;
        font-size: 1rem;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 100%;
        border: 1px solid transparent;
    }

    .label-orange {
        color: #e63109;
        border-color: #fcd7cd;
        background-color: #fce6e1;
    }

    .label-green {
        background: #e5f8f1;
        border: 1px solid #c6f6e4;
        color: #2fb47d;
    }

    .label-yellow {
        background: #fcf3dd;
        border: 1px solid #fde2a4;
        color: #eaa203;
    }

    .label-purple {
        background: #e7e6f5;
        border: 1px solid #cbc5f7;
        color: #6554c0;
    }

    .product-list .custom-control-label::before {
    width: 1.5rem;
    height: 1.5rem;
 
    }

    .product-list .custom-control-label::after {
        width: 1.5rem;
        height: 1.5rem;
        left: -2rem;
        top: 0.50rem;
    }

    .product-list .custom-control-label::before {
        left: -2rem;
        top: 0.50rem;
    }

    .product-list .custom-checkbox .custom-control-label::before {
        border-radius: 100%;
    }
    .product-list h3 {
        font-size: 16px;
        font-weight: bold;
        color: var(--text-primary-color);
        margin-bottom: 0;
    }
    
    .product-list .product-list-status {
        font-size: 14px;
        color: #97a0af;
    }
    .list-group-search {
        position: relative;
        .search-icon {
            color: rgba(80, 95, 121, 0.34);
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            z-index: 5;
            margin-left: .65rem;
            font-size: .75rem;
        }
        .search-icon + .form-control {
            padding-left: 1.875rem;
        }
        .form-control:not(:first-child) {
            border-radius: .25rem;
        }
     
    }
`;