import { EventEmitter } from "events"
import sgMail from '@sendgrid/mail'
import {
  PasswordUpdatedInputsType,
  ResetPasswordInputsInterface,
  VerifyEmailInputsInterface,
} from "../utils/types"

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
const sender: string = process.env.SENDGRID_SENDER_EMAIL!

const eventEmitter = new EventEmitter()

eventEmitter.on("verifyEmail", async (inputs: VerifyEmailInputsInterface) => {
  const msg = {
    to: inputs.recipient,
    from: sender,
    templateId: process.env.VERIFY_EMAIL_TEMPLATE_ID as string,
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

eventEmitter.on(
  "resetPassword",
  async (inputs: ResetPasswordInputsInterface) => {
    const msg = {
      to: inputs.recipient,
      from: sender,
      templateId: process.env.RESET_PASSWORD_TEMPLATE_ID as string,
      dynamicTemplateData: {
        name: inputs.name,
        resetLink: inputs.resetLink,
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
  }
)

eventEmitter.on(
  "passwordUpdated",
  async (inputs: PasswordUpdatedInputsType) => {
    const msg = {
      to: inputs.recipient,
      from: sender,
      templateId: process.env.UPDATED_PASSWORD_TEMPLATE_ID as string,
      dynamicTemplateData: {
        name: inputs.name,
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
  }
)
export default eventEmitter