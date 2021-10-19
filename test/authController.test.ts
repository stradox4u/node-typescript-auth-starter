import { expect } from "chai"

const db = require("../models")
import { postLogin, postLogout } from "../src/controllers/authController"
import { filteredUserType, userType } from "../src/utils/types"

describe("Auth Controller Tests", () => {
  beforeEach(() => {
    process.env.ACCESS_JWT_SECRET = "oompaloompa"
    process.env.REFRESH_JWT_SECRET = "akwanya1"
  })
  it("Sets the refresh cookie and returns the user on login", async () => {
    const req = {
      user: {
        id: "UserId",
        name: "Test User",
        email: "test@test.com",
      },
    }
    interface loginReturn {
      message: string
      user: filteredUserType
    }

    const res = {
      cookieText: "",
      cookieName: "",
      statusCode: 500,
      user: {} as filteredUserType,
      cookie: function (name: string, value: string) {
        this.cookieText = value
        this.cookieName = name
        return this
      },
      status: function (code: number) {
        this.statusCode = code
        return this
      },
      json: function (data: loginReturn) {
        this.user = data.user
      },
    }

    await postLogin(req, res, () => {})

    expect(res).to.have.property("cookieName", "refresh_cookie")
    expect(res).to.have.property("statusCode", 200)
    expect(res.user.id).to.equal("UserId")
    expect(res.user.name).to.equal("Test User")
    expect(res.user.email).to.equal("test@test.com")
  })

  it("Blacklists the refresh token on logout", async () => {
    const newUser = await db.User.create({
      name: "Test User",
      email: "test@test.com",
      password: "hashedPassword",
    })
    const req = {
      cookies: {
        refresh_cookie: "aRefreshCookieHere",
      },
      user: { id: newUser.id },
    }
    await postLogout(req, {}, () => {})

    const updatedUser = await db.User.findOne({
      where: { id: newUser.id },
    })

    expect(updatedUser.blacklisted_tokens).to.contain("aRefreshCookieHere")

    await db.User.destroy({
      truncate: true,
    })
  })

  it("Returns the correct response on logout", async () => {
    const newUser = await db.User.create({
      name: "Test User",
      email: "test@test.com",
      password: "hashedPassword",
    })
    const req = {
      cookies: {
        refresh_cookie: "aRefreshCookieHere",
      },
      user: { id: newUser.id },
      logout: function () {
        this.user = { id: null }
      },
    }
    type response = {
      message: string
    }
    const res = {
      statusCode: 500,
      message: "",
      status: function (code: number) {
        this.statusCode = code
        return this
      },
      json: function (data: response) {
        this.message = data.message
      },
    }
    await postLogout(req, res, () => {})

    expect(res.statusCode).to.equal(200)
    expect(res.message).to.equal("Logged out")

    await db.User.destroy({
      truncate: true,
    })
  })
})
