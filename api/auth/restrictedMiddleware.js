const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  // add code here to verify users are logged in
  const token = req.headers.authorization

  if (token) {
    const secret = process.env.JWT_SECRET || "keepitsecret,keepitsafe!"

    jwt.verify(token, secret, (error, decodedToken) => {
      if (error) {
        // the token is invalid
        res.status(401).json({ message: "you cannot pass!" })
      } else {
        // the token is good
        req.jwt = decodedToken
        // console.log(req.jwt)
        next()
      }
    })
  } else {
    res.status(400).json({ message: "You shall not pass!" })
  }
}