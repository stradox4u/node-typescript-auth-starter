import { expect } from "chai"
import isOwner from "../src/middleware/isOwner"

describe("Is owner middleware tests", () => {
  it("Throws correct error if auth user & params don't match", async () => {
    const req = {
      params: {
        userId: "correctUserId",
      },
      user: {
        id: "incorrectUserId",
      },
    }

    const result = await isOwner(req, {}, () => {})

    expect(result).to.throw
    expect(result).to.have.property("statusCode", 403)
    expect(result).to.have.property("title", "Forbidden")
  })
})
