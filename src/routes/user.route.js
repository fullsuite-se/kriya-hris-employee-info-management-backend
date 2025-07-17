const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

/* NOTES
1) Why expose the user_id in the params?
the practice is that /hris-user-account/me and it is stored inside the token.
but, the hris will be used by user-system and the system (payroll & ats) to system(hris). 
so we can't have the user_id in the token. we can add it in the body, 
but it is not ideal since it is dedicated for contents. 
*/

router.get('/', userController.getHrisUserAccounts); //fetch all hris-user-accounts -> includes searching after ?
// router.post('/', userController.createHrisUserAccount); //create hris-user-account
router.get('/:user_id', userController.getHrisUserAccount);

module.exports = router;

