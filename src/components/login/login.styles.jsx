import styled from 'styled-components';
import { Dropdown } from 'react-bootstrap';
export const LoginLeftContainer = styled.div`
    padding: 1rem 8rem;
    @media (max-width: 575.98px) {
        padding: 1.5rem;
    }
    @media (min-width: 576px) and (max-width: 767.98px) {
        padding: 1.5rem;
    }
    @media (min-width: 768px) and (max-width: 991.98px) {
        padding: 1.875rem;
    }
    @media (min-width: 992px) and (max-width: 1199.98px) {
        padding: 2.5rem;
    }
`;
export const LogoContainer = styled.div`

`;
export const VersionTxt = styled.span`
    color: #97a0af;
    font-size: .85rem;
    padding-top: 0rem;
`;
export const WelcomeTxt = styled.h1`
    color: #26385;
    font-size: 1.875rem;
    @media (max-width: 575.98px) {
        font-size: 1.275rem;
    }
    @media (min-width: 576px) and (max-width: 767.98px) {
        font-size: 1.5rem;
    }
    @media (min-width: 768px) and (max-width: 991.98px) {
        font-size: 1.675rem;
    }
    @media (min-width: 992px) and (max-width: 1199.98px) {
        font-size: 1.875rem;
    }
    @media (min-width: 1200px) and (max-width: 1399.98px) {
        font-size: 1.5rem;
    }
`;
export const SubTxt = styled.span`
    color: #1268e3;
`;
export const TagLine = styled.p`
    color: #97a0af;
    font-size: .85rem;
    margin-bottom: 3.5rem;
    @media (max-width: 575.98px) {
        margin-bottom: 1.85rem;
    }
    @media (min-width: 576px) and (max-width: 767.98px) {
        margin-bottom: 2rem;
    }
    @media (min-width: 768px) and (max-width: 991.98px) {
        margin-bottom: 2.25rem;
    }
    @media (min-width: 992px) and (max-width: 1199.98px) {
        margin-bottom: 2.5rem;
    }
    @media (min-width: 1200px) and (max-width: 1399.98px) {
        margin-bottom: 1rem;
    }
`;
export const CardImgRight = styled.div`
    text-align: right;
    .card-img {
        width: 416px;
    }
`;
export const LoginRightContainer = styled.div`
    .card-title {
        font-size: 2.25rem;
        color: #263858;
        font-weight: 600;
        margin-bottom: 1.5rem;
    }
    .card {
        background-color: #e2edff;
        border-color: transparent;
        border-radius: 0;
    }

    .card-body {
        padding: 2rem 7rem;
    }
    .media-heading {
        font-size: 1.625rem;
        color: #263858;
        font-weight: 600;
    }
    .media-body {
        color: #97a0af;
        font-size: .85rem;
    }
    @media (max-width: 575.98px) {
        .card-title {
            font-size: 1.5rem;
        }
        .card-body {
            padding: 1.5rem;
        }
    }
    @media (min-width: 576px) and (max-width: 767.98px) {
        .card-title {
            font-size: 1.675rem;
        }
        .card-body {
            padding: 1.5rem;
        }
    }
    @media (min-width: 768px) and (max-width: 991.98px) {
        .card-title {
            font-size: 1.875rem;
        }
        .card-body {
            padding: 1.875rem;
        }
    }
    @media (min-width: 992px) and (max-width: 1199.98px) {
        .card-title {
            font-size: 2rem;
        }
        .card-body {
            padding: 2.5rem;
        }
    }
`;

export const Toggle = styled(Dropdown.Toggle)`
    padding: 0;
    background: #1268e3;
    border: none;
    border-radius: 1.2em;
    :after {
        display: none;
    }
`;

// export const ReadOnlyText = styled.span`
//     font-size: 16px;
//     font-weight: 600;
//     color: #505f79;
//     display: block;
//     margin-bottom: 10px;
// `