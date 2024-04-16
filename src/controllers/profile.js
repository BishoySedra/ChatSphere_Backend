import * as profileService from "../services/profile.js" 
export const getAllUsers = async (req, res, next) => {
    try {
      const users = await profileService.getAllUsers();
      return res.json({
        body: users,
        status: 200,
        message: "All users fetched successfully",
      });
    } catch (error) {
      next(error);
    }
};

export const getUser = async (req,res,next) => {
    try {
      console.log("CONTROL")
        const user = await profileService.getUser(req.params.email);
        return res.json({
          body: user,
          status: 200,
          message: "User fetched successfully",
        });
      } catch (error) {
        next(error);
      }
}

export const changeUsernameByEmail = async (req, res, next) => {
  try {
    const user = await profileService.changeUsernameByEmail(req.params.email,req.body.username);
    return res.json({
      body: user,
      status: 200,
      message: "Username updated successfully",
    });
  } catch (error) {
    next(error);
  }
}
