import { expect } from "chai"
import sinon from "sinon"

const { postRegisterUser } = require("../dist/controllers/registerController")
const db = require("../models")
const sendVerificationEmail = require("../src/actions/sendVerificationEmail")

describe("Registration Controller", () => {
  afterEach(async () => {
    await db.User.destroy({
      truncate: true,
    })
  })
  it("Is able to register a new user", async () => {
    const req = {
      body: {
        name: "Test User",
        email: "test@test.com",
        password: "password",
        confirm_password: "password",
      },
    }

    const myStub = sinon.stub(sendVerificationEmail, "sendVerificationMail")

    await postRegisterUser(req, {}, () => {})

    const user = await db.User.findOne({
      where: { name: "Test User" },
    })

    expect(user.dataValues.name).to.equal("Test User")
    expect(user.dataValues.email).to.equal("test@test.com")

    myStub.restore()
  })
})
