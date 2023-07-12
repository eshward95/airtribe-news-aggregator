let chai = require("chai");
let chaiHttp = require("chai-http");
chai.use(chaiHttp);
const path = require("path");
const fs = require("fs");

const server = require("../../src/app");

let paths = path.join(__dirname, "..", "..", "dev-db", "test_users.json");

before(function (done) {
  console.log("calling  before each");
  fs.writeFile(
    paths,
    JSON.stringify([]),
    {
      encoding: "utf8",
      flag: "w",
    },
    done
  );
});
after(function (done) {
  console.log("calling after each");
  fs.writeFile(
    paths,
    JSON.stringify([]),
    {
      encoding: "utf8",
      flag: "w",
    },
    done
  );
});
describe("Verifies the authcontroller", () => {
  context("Register user", () => {
    it("Successful signup", (done) => {
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
    it("Verifies the signup flow failing because of invalid role", (done) => {
      const signInBody = {
        name: "ed",
        email: "test@gm.com",
        password: "123",
        role: "test",
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
  context("Verifis the signin flow with", () => {
    it("Succesful login", (done) => {
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
    it("login fails because of password being incorrect", (done) => {
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
});
