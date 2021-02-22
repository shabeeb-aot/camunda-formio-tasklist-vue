import jwt from "jsonwebtoken";


export const authenticateFormio = (userEmail: any, roles: any) => {
    const USER_RESOURCE_FORM_ID = process.env.VUE_APP_USER_RESOURCE_ID;
    const FORMIO_TOKEN = jwt.sign(
        {
            form: {
                _id: USER_RESOURCE_FORM_ID, // form.io form Id of user resource
            },
            user: {
                _id: userEmail, // keep it like that
                roles: roles,
            },
        },
        "--- change me now ---"
    ); 
    sessionStorage.setItem("formioToken", FORMIO_TOKEN);
    localStorage.setItem("formioToken", FORMIO_TOKEN)
};