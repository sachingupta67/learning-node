const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./ses-client");

const createSendEmailCommand = ({
  toAddress,
  fromAddress,
  body = "Sample Body text/html",
  subject = "EMAIL_SUBJECT:Hello word",
  text = "Sample text",
}) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: body,
        },
        Text: {
          Charset: "UTF-8",
          Data: text,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async ({
  toAddress = "sachingupta.coder@gmail.com",
  fromAddress = "support@trowio.com",
  subject,
  body,
  text,
}) => {
  const sendEmailCommand = createSendEmailCommand({
    toAddress,
    fromAddress,
    subject,
    body,
    text,
  });

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

module.exports = { run, createSendEmailCommand };
