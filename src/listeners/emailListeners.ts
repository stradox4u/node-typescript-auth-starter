import { EventEmitter } from "events"
import sgMail from '@sendgrid/mail'
import { VerifyEmailInputs } from "../utils/types"

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
const sender: string = process.env.SENDGRID_SENDER_EMAIL!

const eventEmitter = new EventEmitter()

eventEmitter.on("verifyEmail", async (inputs: VerifyEmailInputs) => {
  const msg = {
    to: inputs.recipient,
    from: sender,
    templateId: "d-24ed52aaa6244b5e95c652e110c7da6f",
    dynamicTemplateData: {
      name: inputs.name,
      verifyLink: inputs.verifyLink,
    },
  }

  try {
    const sentMail = await sgMail.send(msg)
    if (sentMail) {
      console.log("Email sent!")
    }
  } catch (err: any) {
    console.log(err)
  }
})

export default eventEmitter