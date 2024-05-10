import { userModel } from "../models/users.js"

const getUserName = async () => {

    if (req.session.user.email)

    {
        my_user = await userModel.findOne({email: req.session.user.email})
        return my_user.first_name
    }
}

const getUserStatus = async () => {

    if (req.session.user.email)

    {
        my_user = await userModel.findOne({email: req.session.user.email})
        if(my_user.category == "Admin"){
            return true
        }
        else {
            return false
        }
    }
}

export {getUserName, getUserStatus}
