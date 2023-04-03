const emailRegex = /\S+@\S+\.\S+/;

const signupValidator = async (req, res, next) => {
  const { email, password, confirm_password } = req.body;

  if (!email) return res.json({ message: "Email is required!" });

  if (!emailRegex.test(email))
    return res.json({ message: "Do you tell that an email!?" });

  if (!password) return res.json({ message: "Password is required!" });

  if (!(password?.length >= 6))
    return res.json({ message: "Do you tell that a password?" });

  if (password !== confirm_password)
    return res.json({ message: "Passwords don't match!" });

  next();
};

module.exports = {
  signupValidator,
};
