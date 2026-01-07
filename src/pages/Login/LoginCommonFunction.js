import {
    toast
} from "react-toastify";
import {
    intl
} from "../../components/App";

export const fnPassMessage = (pwdpolicymsg) => {
    let msg = ``;
    msg = `${intl.formatMessage({ id: "IDS_YOURPASSWORDMUSTBE" })} ${pwdpolicymsg["nminpasslength"]} ${intl.formatMessage({ id: "IDS_CHARACTERS" })} ${intl.formatMessage({ id: "IDS_MAXCHARACTERS" })} ${pwdpolicymsg["nmaxpasslength"]} ${intl.formatMessage({ id: "IDS_CHARACTERS" })}`;
    if (pwdpolicymsg["nminnoofnumberchar"] > 0) {
        msg = `${msg}, ${pwdpolicymsg["nminnoofnumberchar"]} ${intl.formatMessage({ id: "IDS_NUMERICCHARACTERS" })}`;
    }
    if (pwdpolicymsg["nminnooflowerchar"] > 0) {
        msg = `${msg}, ${pwdpolicymsg["nminnooflowerchar"]} ${intl.formatMessage({ id: "IDS_LOWERCASECHARACTER" })}`;
    }
    if (pwdpolicymsg["nminnoofupperchar"] > 0) {
        msg = `${msg}, ${pwdpolicymsg["nminnoofupperchar"]} ${intl.formatMessage({ id: "IDS_UPPERCASECHARACTER" })}`;
    }
    if (pwdpolicymsg["nminnoofspecialchar"] > 0) {
        msg = `${msg}, ${pwdpolicymsg["nminnoofspecialchar"]} ${intl.formatMessage({ id: "IDS_SPECIALCHARACTERS" })}`;
    }
    return `${msg}.`;
}

export const changePasswordValidation = (createPwdRecord, passwordPolicy, sloginid) => {
    const snewpassword = createPwdRecord.snewpassword.trim();
    const sconfirmpassword = createPwdRecord.sconfirmpassword.trim();
    const soldpassword = createPwdRecord.soldpassword.trim();
    if (snewpassword === soldpassword) {
        toast.warn(intl.formatMessage({
            id: "IDS_NEWANDOLDPASSWORDSHOULDNOTSAME"
        }));
    } else if (sloginid === snewpassword) {
        toast.warn(intl.formatMessage({
            id: "IDS_PASSWORDSHOULDNOTSAMEASLOGINID"
        }));
    } else if (sconfirmpassword !== snewpassword) {
        toast.warn(intl.formatMessage({
            id: "IDS_PASSWORDNOTMATCHED"
        }));
    } else {
        return fnValidatePassword(passwordPolicy, snewpassword);
    }
}

export const fnValidatePassword = (PasswordPolicy, snewpassword) => {
    const passwordPolicy = PasswordPolicy;
    const passwordletters = snewpassword.split('');
    let upperCaseCount = 0;
    let lowerCaseCount = 0;
    let specialCharCount = 0;
    let numberCount = 0;
    if (passwordletters.length < passwordPolicy.nminpasslength) {
        toast.info(`${intl.formatMessage({ id: "IDS_PASSMINREQUIRED" })} ${passwordPolicy.nminpasslength} ${intl.formatMessage({ id: "IDS_CHARACTERS" })}`);
    } else if (passwordletters.length > passwordPolicy.nmaxpasslength) {
        toast.info(`${intl.formatMessage({ id: "IDS_PASSWRDLENGTHEXCEED" })} ${passwordPolicy.nmaxpasslength} ${intl.formatMessage({ id: "IDS_CHARACTERS" })}`);
    } else if (passwordletters.length >= passwordPolicy.nminpasslength &&
        passwordletters.length <= passwordPolicy.nmaxpasslength) {
        passwordletters.forEach(function (letters) {
            if (letters.charCodeAt() >= 65 && letters.charCodeAt() <= 90) {
                upperCaseCount += 1;
            } else if (letters.charCodeAt() >= 97 && letters.charCodeAt() <= 122) {
                lowerCaseCount += 1;
            } else if ((letters.charCodeAt() >= 48 && letters.charCodeAt() <= 57) ||
                (letters.charCodeAt() >= 96 && letters.charCodeAt() <= 105)) {
                numberCount += 1;
            } else {
                specialCharCount += 1;
            }
        });
        if (upperCaseCount < passwordPolicy.nminnoofupperchar) {
            return `${intl.formatMessage({ id: "IDS_PASSMINREQUIRED" })} ${passwordPolicy.nminnoofupperchar} ${intl.formatMessage({ id: "IDS_UPPERCASECHARACTER" })}`;
        } else if (lowerCaseCount < passwordPolicy.nminnooflowerchar) {
            return `${intl.formatMessage({ id: "IDS_PASSMINREQUIRED" })} ${passwordPolicy.nminnooflowerchar} ${intl.formatMessage({ id: "IDS_LOWERCASECHARACTER" })}`;
        } else if (specialCharCount < passwordPolicy.nminnoofspecialchar) {
            return `${intl.formatMessage({ id: "IDS_PASSMINREQUIRED" })} ${passwordPolicy.nminnoofspecialchar} ${intl.formatMessage({ id: "IDS_SPECIALCHARACTERS" })}`;
        } else if (numberCount < passwordPolicy.nminnoofnumberchar) {
            return `${intl.formatMessage({ id: "IDS_PASSMINREQUIRED" })} ${passwordPolicy.nminnoofnumberchar} ${intl.formatMessage({ id: "IDS_NUMERICCHARACTERS" })}`;
        } else {
            return 0;
        }
    }
}