import styled from 'styled-components';
export const AtHeader = styled.div`
    .img-profile {
        height: 2rem;
        width: 2rem;
    }
    .profile-img{
        width:80px;
        margin-right: 0 !important;
        position:relative;
        z-index:1;
    }
    .profile-img-block:after {
        content: "";
        height: 65px;
        width: 100%;
        z-index: 0;
        background: #f8f9fa;
        position:absolute;
        top:0;
        border-radius:0.25rem 0.25rem 0 0;
    }
    .user-name {
        font-size: .75rem;
        font-weight: bold;
        display: flex;
        color: #172b4d;
        line-height: 1;
        color: var(--background-primary-active);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 10px;
    }
    .role {
        font-size: .65rem;
        font-weight: bold;
        display: flex;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 10px;
    }
    .user-role {
        overflow: hidden;
        display: block;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 80px;
    }
    .btn.btn-link:focus {
        text-decoration: none;
        box-shadow: 0;
    }
    .down-icon {
        font-size: 11px;
        font-weight: bold;
    }

`;
export const NavPrimaryHeader = styled.h2`
    color: #172b4d;
    font-size: 30px;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 1.5rem;
`;

export const DashboardIcon = styled.div`
    display: flex;
    align-items: center;
    margin-right: .5rem;
    cursor: pointer;
    .fa-chart-pie {
        font-size: 1.5rem;
        color: #2883fe;
    }
`;

export const ProfileImage = styled.div`
    // width: 2rem;
    // height: 2rem;
    // border-radius: 50%;
    // background: #512DA8;
    // font-size: 16px;
    // color: #fff;
    // text-align: center;
    // line-height: 2rem;
    // margin: 0px 4px;
`;

export const ProfileImageDD = styled.div`
    // width: 2rem;
    // height: 2rem;
    // border-radius: 50%;
    // background: #512DA8;
    // font-size: 16px;
    // color: #fff;
    // text-align: center;
    // line-height: 2rem;
    // margin: 0px 4px;
`;

export const ProfileLayer = styled.div`
    margin: 15px ​15p;
`;

export const ProfileImageLayer = styled.div`
    margin-bottom: 10px;
    position: relative;
    height: 86px;
    width: 86px;
    margin-left: 41px;
`;

export const Profile = styled.div`
    display: block;
    vertical-align: top;
    text-align: center;
`;

export const ProfileName = styled.div`
    color: #202124;
    font-size: 500 16px/22px;
    letter-spacing: .29px;
    margin: 0;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;   
`;

export const ProfileRole = styled.div`
    color: #5f6368;
    font-size: 400 14px/19px;
    letter-spacing: normal;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
`;