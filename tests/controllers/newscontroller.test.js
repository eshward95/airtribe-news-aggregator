const sinon = require("sinon");
let chai = require("chai");
let chaiHttp = require("chai-http");
chai.use(chaiHttp);
const path = require("path");
const fs = require("fs");

const server = require("../../src/app");
const { getNews } = require("../../src/controllers/newsController");
let paths = path.join(__dirname, "..", "..", "dev-db", "test_users.json");

let newsIds = [];
describe("Verifies news controller", () => {
  beforeEach(function (done) {
    // console.log("calling  before each");
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
  afterEach(function (done) {
    // console.log("calling after each");
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
  context("Get news", () => {
    it("Should return the news details after login", (done) => {
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
                .get("/news")
                .set("authorization", `Bearer ${siginResponse.body.token}`)
                .end((err, res) => {
                  newsIds.push(res.body.data[0].id);
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
  });
  describe("stub getNews function", () => {
    let req, res, next;

    beforeEach(() => {
      (req = { user: { preference: ["general", "technology"] } }),
        (res = {
          status: sinon.stub().returns({
            json: sinon.stub(),
          }),
        });
      next = sinon.stub();
    });

    it("should return stubbed data for news", async () => {
      await getNews(req, res, next);
      chai.expect(res.status.calledOnce).to.be.true;
      chai.expect(res.status.calledWith(200)).to.be.true;
      chai.expect(res.status().json.calledOnce).to.be.true;
    });
  });
  describe("/GET read news", () => {
    it("Should return true with read articles", (done) => {
      let signupBody = {
        name: "test name",
        email: "test1234@gmail.com",
        role: "admin",
        password: "test1234",
        preference: ["general"],
        readarticle: ["article1", "article2"],
      };
      chai
        .request(server)
        .post("/register")
        .send(signupBody)
        .end((err, res) => {
          let signInBody = {
            email: "test1234@gmail.com",
            password: "test1234",
          };
          chai
            .request(server)
            .post("/login")
            .send(signInBody)
            .end((err, siginResponse) => {
              chai
                .request(server)
                .get("/news/read")
                .set("authorization", `Bearer ${siginResponse.body.token}`)
                .end((err, res) => {
                  if (err) {
                    return done(err);
                  }
                  chai.expect(res.status).equal(200);
                  chai
                    .expect(res.body)
                    .to.have.property("result")
                    .to.equal("success");
                  chai
                    .expect(res.body)
                    .to.have.property("data")
                    .that.is.an("array");
                  done();
                });
            });
        });
    });
    it("Should return true with no read articles", (done) => {
      let signupBody = {
        name: "test name",
        email: "test1234@gmail.com",
        role: "admin",
        password: "test1234",
        preference: ["general"],
      };
      chai
        .request(server)
        .post("/register")
        .send(signupBody)
        .end((err, res) => {
          let signInBody = {
            email: "test1234@gmail.com",
            password: "test1234",
          };
          chai
            .request(server)
            .post("/login")
            .send(signInBody)
            .end((err, siginResponse) => {
              chai
                .request(server)
                .get("/news/read")
                .set("authorization", `Bearer ${siginResponse.body.token}`)
                .end((err, res) => {
                  if (err) {
                    return done(err);
                  }
                  chai.expect(res.status).equal(404);
                  chai.expect(res.body.message).to.equal("No read articles");
                  done();
                });
            });
        });
    });
  });
  describe("/GET favorite news", () => {
    it("Should return true with favorite articles", (done) => {
      let signupBody = {
        name: "test name",
        email: "test1234@gmail.com",
        role: "admin",
        password: "test1234",
        preference: ["general"],
        favoriteArticle: ["article1", "article2"],
      };
      chai
        .request(server)
        .post("/register")
        .send(signupBody)
        .end((err, res) => {
          let signInBody = {
            email: "test1234@gmail.com",
            password: "test1234",
          };
          chai
            .request(server)
            .post("/login")
            .send(signInBody)
            .end((err, siginResponse) => {
              chai
                .request(server)
                .get("/news/favorite")
                .set("authorization", `Bearer ${siginResponse.body.token}`)
                .end((err, res) => {
                  if (err) {
                    return done(err);
                  }
                  chai.expect(res.status).equal(200);
                  chai
                    .expect(res.body)
                    .to.have.property("result")
                    .to.equal("success");
                  chai
                    .expect(res.body)
                    .to.have.property("data")
                    .that.is.an("array");
                  done();
                });
            });
        });
    });
    it("Should return true with no favorite articles", (done) => {
      let signupBody = {
        name: "test name",
        email: "test1234@gmail.com",
        role: "admin",
        password: "test1234",
        preference: ["general"],
      };
      chai
        .request(server)
        .post("/register")
        .send(signupBody)
        .end((err, res) => {
          let signInBody = {
            email: "test1234@gmail.com",
            password: "test1234",
          };
          chai
            .request(server)
            .post("/login")
            .send(signInBody)
            .end((err, siginResponse) => {
              chai
                .request(server)
                .get("/news/favorite")
                .set("authorization", `Bearer ${siginResponse.body.token}`)
                .end((err, res) => {
                  if (err) {
                    return done(err);
                  }
                  chai.expect(res.status).equal(404);
                  chai
                    .expect(res.body.message)
                    .to.equal("No favorite articles");
                  done();
                });
            });
        });
    });
  });
  describe("/POST /news/:id/favorite favorite news", () => {
    it("Should return true with favorite articles", (done) => {
      let signupBody = {
        name: "test name",
        email: "test1234@gmail.com",
        role: "admin",
        password: "test1234",
        preference: ["general"],
        favoriteArticle: ["article1", "article2"],
      };
      chai
        .request(server)
        .post("/register")
        .send(signupBody)
        .end((err, res) => {
          let signInBody = {
            email: "test1234@gmail.com",
            password: "test1234",
          };
          chai
            .request(server)
            .post("/login")
            .send(signInBody)
            .end((err, siginResponse) => {
              chai
                .request(server)
                .post(`/news/${newsIds[0]}/favorite`)
                .set("authorization", `Bearer ${siginResponse.body.token}`)
                .end((err, res) => {
                  if (err) {
                    return done(err);
                  }
                  chai.expect(res.status).equal(200);
                  chai
                    .expect(res.body)
                    .to.have.property("result")
                    .to.equal("success");
                  chai
                    .expect(res.body.data)
                    .to.have.property("favoriteArticle")
                    .that.is.an("array");
                  done();
                });
            });
        });
    });
    it("Should return true with no favorite articles", (done) => {
      let signupBody = {
        name: "test name",
        email: "test1234@gmail.com",
        role: "admin",
        password: "test1234",
        preference: ["general"],
        favoriteArticle: ["article1", "article2"],
      };
      chai
        .request(server)
        .post("/register")
        .send(signupBody)
        .end((err, res) => {
          let signInBody = {
            email: "test1234@gmail.com",
            password: "test1234",
          };
          chai
            .request(server)
            .post("/login")
            .send(signInBody)
            .end((err, siginResponse) => {
              chai
                .request(server)
                .post(`/news/123/favorite`)
                .set("authorization", `Bearer ${siginResponse.body.token}`)
                .end((err, res) => {
                  if (err) {
                    return done(err);
                  }
                  chai.expect(res.status).equal(400);
                  chai.expect(res.body.message).to.equal("No matching id");
                  done();
                });
            });
        });
    });
  });
});
