import jwt from "jsonwebtoken";


export const authenticateFormio = (formIOResourceId: any, formIOReviewereId: any, formIOReviewer: any ,userEmail: any, formIOUserRoles: any) => {
  const STAFF_REVIEWER_ID = formIOReviewereId ||  process.env.VUE_APP_REVIEWER_ROLE_ID
  const STAFF_REVIEWER = formIOReviewer ||  process.env.VUE_APP_REVIEWER_ROLE

  const ROLES = [
    {
      id: STAFF_REVIEWER_ID,
      title: STAFF_REVIEWER,
    },
  ];

  let roles: any[] = [];
  for(let i=0; i<formIOUserRoles.length; i++) {
    const roleData = ROLES.find((x) => x.title === formIOUserRoles[i]);
    if (roleData) {
      roles = roles.concat(roleData.id);
    }
  }
  console.log(roles)
  if(roles.length === 0){
    console.error("Null roles");
    roles = [STAFF_REVIEWER_ID];
  }
  
  const USER_RESOURCE_FORM_ID = formIOResourceId || process.env.VUE_APP_USER_RESOURCE_ID;

  const FORMIO_TOKEN = jwt.sign(
    {
      form: {
        _id: USER_RESOURCE_FORM_ID, // form.io form Id of user resource
      },
      user: {
        _id: userEmail || 'external', // keep it like that
        roles: roles,
      },
    },
    "--- change me now ---"
  );

  sessionStorage.setItem("formioToken", FORMIO_TOKEN);
  localStorage.setItem("formioToken", FORMIO_TOKEN)
};