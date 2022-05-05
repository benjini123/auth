import { sequelize } from "../db/db";
import * as express from "express";
import { User } from "../db/user";
import { Auth } from "../db/auth";
import * as crypto from "crypto";

// sequelize.sync({ force: true }).then((res) => {
//   console.log(res);
// });

function getSHA256ofString(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

// const port = process.env.PORT || 5656;
const port = 5656;
const app = express();

app.use(express.json());

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
      password,
      user_id: user.get("id"),
    },
  });
  res.json({ original: password, hash: getSHA256ofString(password) });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
