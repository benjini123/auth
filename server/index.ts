import { sequelize } from "../db/db";
import * as express from "express";
import { User } from "../db/user";
import { Auth } from "../db/auth";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

// sequelize.sync({ force: true }).then((res) => {
//   console.log(res);
// });

const SECRET = "odsjfiofjaspoij";

function getSHA256ofString(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

// const port = process.env.PORT || 5656;
const port = 5656;
const app = express();

app.use(express.json());

//signup
app.post("/auth", async (req, res) => {
  const { email, name, birthdate, password } = req.body;
  const [user, created] = await User.findOrCreate({
    where: { email },
    defaults: {
      email,
      name,
      birthdate,
    },
  });
  const [auth, authCreated] = await Auth.findOrCreate({
    where: { user_id: user.get("id") },
    defaults: {
      email,
      password: getSHA256ofString(password),
      user_id: user.get("id"),
    },
  });
  res.json(auth);
});

//sign in
app.post("/auth/token", async (req, res) => {
  const { email, password } = req.body;
  const passwordHasheado = getSHA256ofString(password);

  const auth = await Auth.findOne({
    where: { email, password: passwordHasheado },
  });
  const token = jwt.sign({ id: auth.get("user_id") }, SECRET, {
    algorithm: "RS256",
  });

  if (auth) {
    res.json({ token });
  } else {
    res.status(400).json({ error: "email or pass incorrect " });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
