import { type Locale } from "$lib/types";

const LocalStorageUtil = {
    setUserData(user: any) {
        localStorage.setItem("userData", JSON.stringify(user));
    },

    getUserData() {
        const userString = localStorage.getItem("userData");
        return userString ? JSON.parse(userString) : null;
    },

    removeUserData() {
        localStorage.removeItem("userData");
    },

    getUserRoles() {
        return this.getUserData()?.roles || [];
    },

    setLocale(locale: Locale) {
        localStorage.setItem("locale", locale);
    },

    getLocale(): Locale {
        if (!localStorage.getItem("locale")) this.setLocale("de");
        return localStorage.getItem("locale") as Locale;
    },
};

export default LocalStorageUtil;
