import passport from "passport";
import jwt from "jsonwebtoken";
import got from "got";
import httpStrategies from "passport-http";
import debugSetup from "debug";
import path from "path";
import Auth0Strategy from "passport-auth0";
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();
const debug = debugSetup("vonnegut:auth");
// const LocalStrategy = require('passport-local').Strategy
// const {Firestore} = require('@google-cloud/firestore');
// const firestore = new Firestore();
// const bcrypt = require('bcrypt');

function generateToken(user) {
  const expiresIn = "30m";
  return jwt.sign({ sub: user.id }, process.env.SECRETORKEY, {
    algorithm: "HS256",
    expiresIn,
    audience: process.env.AUDIENCE || "",
    issuer: process.env.ISSUER
  });
}

async function getProfile(user) {
  const response = await got(`${process.env.API_SERVER}whoami`, {
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  }).json();
  return response;
}

async function deserialise(user) {
  if (!user.token) {
    user.token = generateToken(user);
  } else if (user.token) {
    jwt.verify(
      user.token,
      process.env.SECRETORKEY,
      {
        algorithm: "HS256",
        audience: process.env.AUDIENCE || "",
        issuer: process.env.ISSUER
      },
      (err, decoded) => {
        if (err && err.name === "TokenExpiredError") {
          user.token = generateToken(user);
        } else if (err) {
          debug(err);
          throw err;
        }
      }
    );
  }
  if (!user.profile || !user.profile.id) {
    try {
      user.profile = await getProfile(user);
    } catch (err) {
      try {
        console.error("Auth failed error: ", err)
        console.error("Auth failed, response body: ", err.response.body);
      } catch (err) {}
      if (err.response && err.response.statusCode === 404) {
        try {
          await got.post(`${process.env.API_SERVER}readers`, {
            headers: {
              "content-type": "application/ld+json",
              Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify({
              type: "Person",
              summary: `Reader profile`
            })
          });
          user.profile = await getProfile(user);

          // CREATE NOTEBOOK
          const resNotebook = await got.post(`${process.env.API_SERVER}notebooks`, {
            headers: {
              "content-type": "application/ld+json",
              Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify({
              name: "Sample Notebook"
            })
          });
          let notebook = JSON.parse(resNotebook.body)


          // CREATE EMPTY SOURCE
          await got.post(`${process.env.API_SERVER}sources`, {
            headers: {
              "content-type": "application/ld+json",
              Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify({
              name: "Sample Source (no content)",
              type: "Book",
              json: {},
              notebooks: [notebook]
            })
          });

          // CREATE NOTE

          // need to give it a colour
          const tags = await got.get(`${process.env.API_SERVER}tags`, {
            headers: {
              "content-type": "application/ld+json",
              Authorization: `Bearer ${user.token}`
            }
          });

          const tagsList = JSON.parse(tags.body)
          let colour1Tag = tagsList.filter(x => x.name === "colour1")

          await got.post(`${process.env.API_SERVER}notes`, {
            headers: {
              "content-type": "application/ld+json",
              Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify({
              body: {
                motivation: "commenting",
                content: "This is a note. Click to edit or delete it."
              },
              tags: [colour1Tag[0]],
              notebooks: [notebook]
            })
          });

        } catch (err) {
          console.error(err);
        }
      } else {
        user.profile = null;
      }
    }
  }
  return user;
}

export function setup(app) {
  passport.serializeUser((user, done) => {
    // console.log('serialise: ', user)
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    // console.log('deserialise: ', user)
    return deserialise(user)
      .then(user => done(null, user))
      .catch(err => done(err));
  });
  app.use(passport.initialize());
  app.use(passport.session());

  if (process.env.PASSPORT_STRATEGY === "auth0") {
    console.log("auth0");
    passport.use(
      new Auth0Strategy(
        {
          domain: process.env.AUTH0_DOMAIN,
          clientID: process.env.AUTH0_CLIENT_ID,
          clientSecret: process.env.AUTH0_CLIENT_SECRET,
          callbackURL: process.env.CALLBACK_URL
        },
        (accessToken, refreshToken, extraParams, profile, done) => {
          return done(null, { id: profile.id, email: profile._json.email, email_verified: profile._json.email_verified, name: profile.name, nickname: profile.nickname, picture: profile.picture });
        }
      )
    );
    app.get("/callback", (req, res, next) => {
      passport.authenticate("auth0", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.redirect("/failure?info=" + JSON.stringify(info));

        req.logIn(user, err => {
          if (err) return next(err);

          const returnTo = req.session.returnTo;
          delete req.session.returnTo;
          res.redirect(returnTo || "/");
        });
      })(req, res, next);
    });
    // app.get("/callback", passport.authenticate("auth0", function (err, user, info) {
    //   if(err) return next(err)
    //   if(!user) return res.redirect("/failure?info=" + JSON.stringify(info))
    //   console.log(err, user, info)
    // }, {}), function(
    //   req,
    //   res,
    //   next
    // ) {
    //   res.redirect("/library/all/all");
    // });
  } else {
    // console.log('basic')
    passport.use(
      new httpStrategies.BasicStrategy((username, password, callback) => {
        console.log("using basic");
        if (password === "devpassword") {
          const user = { id: `dev-testing11|${username}` };
          return callback(null, user);
        } else {
          return callback(null, false);
        }
      })
    );
    // passport.use(new LocalStrategy(async function (username, password, done) {
    //   const existing = await firestore.collection('users').where('email', '==', username)
    //   if (existing.empty) return done(null, false, { message: 'Incorrect email or password' });
    //   const [userDoc] = existing.docs
    //   const passwordHash = userDoc.get('password')
    //   const match = await bcrypt.compare(password, passwordHash)
    //   if (!match) {
    //     return done(null, false, { message: 'Incorrect email or password' });
    //   } else {
    //     return done(null, userDoc.data())
    //   }
    // }))
  }

  app.use("/login", function(req, res, next) {
    if (req.body.betaCode !== process.env.BETACODE) {
      return res.sendStatus(403);
    } else {
      next();
    }
  });
  app.use(
    "/login",
    passport.authenticate(process.env.PASSPORT_STRATEGY),
    function(req, res, next) {
      res.redirect("/");
    }
  );
  app.use("/logout", (req, res) => {
    if (!req.user) return res.redirect("/");
    req.session.destroy(() => {
      req.logout();
      let redirect;
      if (process.env.PASSPORT_STRATEGY === "auth0" && process.env.SIGNOUTURL) {
        redirect = `https://${process.env.AUTH0_DOMAIN}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${process.env.SIGNOUTURL}`;
      } else {
        redirect = "/";
      }
      res.redirect(redirect);
    });
  });
  return app;
}
