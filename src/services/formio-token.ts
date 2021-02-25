import jwt from "jsonwebtoken";


export const authenticateFormio = (userEmail: any, UserRoles: any) => {
    const STAFF_REVIEWER_ID = process.env.VUE_APP_REVIEWER_ROLE_ID
    const STAFF_REVIEWER = process.env.VUE_APP_REVIEWER_ROLE

    const ROLES = [
    {
        id: STAFF_REVIEWER_ID,
        title: STAFF_REVIEWER,
    },
    ];

    let roles: any[] = [];
    const roleData = ROLES.find((x) => x.title === UserRoles);
    if (roleData) {
        roles = roles.concat(roleData.id);
    }
    console.log(roles)
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