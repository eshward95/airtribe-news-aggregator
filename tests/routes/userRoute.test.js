process.env.NODE_ENV = "test";
let chai = require("chai");
let chaiHttp = require("chai-http");
chai.use(chaiHttp);
const server = require("../../src/app");

describe("User routes", () => {
  //   let paths = path.join(__dirname, "..", "..", "dev-db", "test_users.json");
  //   before(function (done) {
  //     console.log("calling  before each");
  //     fs.writeFile(
  //       paths,
  //       JSON.stringify([]),
  //       {
  //         encoding: "utf8",
  //         flag: "w",
  //       },
  //       done
  //     );
  //   });
  //   after(function (done) {
  //     console.log("calling after each");
  //     fs.writeFile(
  //       paths,
  //       JSON.stringify([]),
  //       {
  //         encoding: "utf8",
  //         flag: "w",
  //       },
  //       done
  //     );
  //   });
  context("/register POST Create user", () => {
    it("Should create user", (done) => {
      const signInBody = {
        name: "ed",
        email: "test@gm.com",
        password: "123",
        role: "admin",
      };
      chai
        .request(server)
        .post("/register")
        .send(signInBody)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          //   console.log(res);
          chai.expect(res).status(201);
          done();
        });
    });
    it("Should throw a validation error", (done) => {
      const signInBody = {
        name: "ed",
        email: "",
        password: "",
        role: "",
      };
      chai
        .request(server)
        .post("/register")
        .send(signInBody)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          chai.expect(res).status(422);
          chai.expect(res.body).to.have.property("message").to.equal("failed");
          chai.expect(res.body).to.have.property("errors");
          done();
        });
    });
    // it("Should throw a user already exist", (done) => {
    //   const signInBody = {
    //     name: "ed",
    //     email: "test@gm.com",
    //     password: "123",
    //     role: "admin",
    //   };
    //   chai
    //     .request(server)
    //     .post("/register")
    //     .send(signInBody)
    //     .end((err, res) => {
    //       if (err) {
    //         return done(err);
    //       }
    //       chai.expect(res).status(422);
    //       chai.expect(res.body).to.have.property("message").to.equal("failed");
    //       chai.expect(res.body).to.have.property("errors");
    //       done();
    //     });
    // });
  });
  context("/login Login user", () => {
    it("should return true when user is able to login", (done) => {
      const signInBody = {
        email: "test@gm.com",
        password: "123",
      };
      chai
        .request(server)
        .post("/login")
        .send(signInBody)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          chai.expect(res).status(200);
          chai.expect(res.body).to.have.property("result").to.equal("success");
          done();
        });
    });
    it("Password not match error", (done) => {
      const signInBody = {
        email: "test@gm.com",
        password: "1",
      };
      chai
        .request(server)
        .post("/login")
        .send(signInBody)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          chai.expect(res).status(401);
          chai
            .expect(res.body)
            .to.have.property("message")
            .to.equal("Incorrect email or password");
          done();
        });
    });
    it("Email not match error", (done) => {
      const signInBody = {
        email: "test1@gm.com",
        password: "1234",
      };
      chai
        .request(server)
        .post("/login")
        .send(signInBody)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          chai.expect(res).status(401);
          chai
            .expect(res.body)
            .to.have.property("message")
            .to.equal("Incorrect email or password");
          done();
        });
    });
  });
  context("/Get all users", () => {
    it("signs in validates the token and fetches the users data", (done) => {
      let signupBody = {
        name: "test name",
        email: "test12345@gmail.com",
        role: "admin",
        password: "test1234",
      };
      chai
        .request(server)
        .post("/register")
        .send(signupBody)
        .end((err, res) => {
          let signInBody = {
            email: "test12345@gmail.com",
            password: "test1234",
          };
          chai
            .request(server)
            .post("/login")
            .send(signInBody)
            .end((err, siginResponse) => {
              chai
                .request(server)
                .get("/users")
                .set("authorization", `Bearer ${siginResponse.body.token}`)
                .end((err, res) => {
                  chai.expect(res.status).equal(200);
                  chai
                    .expect(res.body)
                    .to.have.property("result")
                    .to.equal("success");
                  done();
                });
            });
        });
    });

    it("signs in, validates the token and and does not pass the authoriation header", (done) => {
      let signupBody = {
        fullName: "test name",
        email: "test12345@gmail.com",
        role: "admin",
        password: "test1234",
      };
      chai
        .request(server)
        .post("/register")
        .send(signupBody)
        .end((err, res) => {
          let signInBody = {
            email: "test12345@gmail.com",
            password: "test1234",
          };
          chai
            .request(server)
            .post("/login")
            .send(signInBody)
            .end((err, siginResponse) => {
              chai
                .request(server)
                .get("/users")
                .end((err, res) => {
                  chai.expect(res.status).equal(401);
                  chai.expect(res.body.message).equal("You are not logged in");
                  done();
                });
            });
        });
    });

    it("signs in, validates the token and and does not pass the valid access header", (done) => {
      let signupBody = {
        fullName: "test name",
        email: "test12345@gmail.com",
        role: "admin",
        password: "test1234",
      };
      chai
        .request(server)
        .post("/register")
        .send(signupBody)
        .end((err, res) => {
          let signInBody = {
            email: "test12345@gmail.com",
            password: "test1234",
          };
          chai
            .request(server)
            .post("/login")
            .send(signInBody)
            .end((err, siginResponse) => {
              chai
                .request(server)
                .get("/users")
                .set("authorization", `Bearer ${siginResponse.body.token}abcd`)
                .end((err, res) => {
                  chai.expect(res.status).equal(401);
                  chai.expect(res.body.message).equal("invalid signature");
                  done();
                });
            });
        });
    });
  });
});
