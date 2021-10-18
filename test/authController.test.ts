import { expect } from "chai"
import sinon from "sinon"

import loginUser from "../src/actions/loginUser"
import { postLogin } from "../src/controllers/authController"
import { generateToken } from "../src/utils/jwtHelpers"
import { filteredUserType } from "../src/utils/types"

describe("Auth Controller Tests", () => {
  beforeEach(() => {
    process.env.ACCESS_JWT_SECRET = "oompaloompa"
    process.env.REFRESH_JWT_SECRET = "akwanya1"
  })
  it("Sets the refresh cookie and returns the user", async () => {
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
})
