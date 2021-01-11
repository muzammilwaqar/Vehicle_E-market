let jwt = require('jsonwebtoken');

const verifySocket= (token) => {
  // console.log("TOkenL ",token);
  try {
      const decoded = jwt.verify(token,process.env.JWT_KEY);
     // console.log("decoded: ",decoded);
      // req.userData = decoded;
      // console.log(req.userData.userId);
      return decoded;

      // return jwt.verify(req.headers.token, publicKEY, verifyOptions);
  } catch (err) {
   // console.log("Erro: ",err);
      return null;
  }
}


module.exports = verifySocket
