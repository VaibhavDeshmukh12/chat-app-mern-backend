const User = require("../model/user.model");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  // console.log(req.body);
  try {
    const { username, email, password } = req.body;
    const isExisted = await User.findOne({ username });

    if (isExisted) {
      return res.json({ msg: "Username already used", status: false });
    }
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.json({ msg: "Email already used", status: false });
    }
    const hashpwd = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashpwd,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const user = await User.findByIdAndUpdate(userId, {
        isAvatarImageSet: true,
      avatarImage,
    });
    return res.json({
      isSet: user.isAvatarImageSet,
      image: user.avatarImage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({_id:{$ne:req.params.id}}).select([
            'email','username','avatarImage',"_id"
        ]);
        return res.json(users);
    } catch (error) {
        next(error);
    }
}