const emailRegex = /\S+@\S+\.\S+/;

const signupValidator = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  if (!email) return res.json({ message: "Email is required!" });

  if (!emailRegex.test(email))
    return res.json({ message: "Do you tell that an email!?" });

  if (!password) return res.json({ message: "Password is required!" });

  if (!(password?.length >= 6))
    return res.json({ message: "Do you tell that a password?" });

  if (password !== confirmPassword)
    return res.json({ message: "Passwords don't match!" });

  next();
};

module.exports = {
  signupValidator,
};
