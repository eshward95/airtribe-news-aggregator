process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
chai.use(chaiHttp);

const server = require("../../src/app");

describe("Verifies user controller", () => {
  it("Should return true when Update user preference", (done) => {
    let signupBody = {
      name: "test name",
      email: "test12345@gmail.com",
      role: "admin",
      password: "test1234",
    };
    let preference = { preference: ["technology"] };
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
              .put("/preference")
              .send(preference)
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

  it("Update user preference error for invalid key", (done) => {
    let signupBody = {
      name: "test name",
      email: "test12345@gmail.com",
      role: "admin",
      password: "test1234",
    };
    let preference = { preference: [""] };
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
              .put("/preference")
              .send(preference)
              .set("authorization", `Bearer ${siginResponse.body.token}`)
              .end((err, res) => {
                chai.expect(res.status).equal(422);
                chai.expect(res.body.message).equal("failed");
                done();
              });
          });
      });
  });
  it("should return user preference", (done) => {
    let signupBody = {
      name: "test name",
      email: "test12345@gmail.com",
      role: "admin",
      password: "test1234",
      preference: [],
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
              .get("/preference")
              .set("authorization", `Bearer ${siginResponse.body.token}`)
              .end((err, res) => {
                // console.log(res);
                chai.expect(res.status).equal(200);
                chai.expect(res.body.message).equal("success");
                done();
              });
          });
      });
  });
});
