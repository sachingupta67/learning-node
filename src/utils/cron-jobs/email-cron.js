const cron = require("node-cron");
const ConnectRequestModel = require("../../models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("../ses/send-email");

cron.schedule("14 2 * * *", async () => {
    // 02:14 AM | 14 2 * * *
  //  send emails to all people who got requestss the previous day at 08:00 every day | 0 8 * * *
  try {
    const yesterday = subDays(new Date(), 0);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingConnectionRequest = await ConnectRequestModel.find({
      status: "interested",
        createdAt: {
          $gte: yesterdayStart,
          $lt: yesterdayEnd,
        },
    }).populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(pendingConnectionRequest.map((res) => res.toUserId.emailId)),
      "sachingupta.coder@gmail.com",
    ];
    listOfEmails?.forEach(async (item) => {
      if (item === "sachingupta.coder@gmail.com") {
        const res = await sendEmail.run({
          toAddress: item,
          body:`Hi Checking Code`
        });
        console.log("Res::::",res)
      }
    });
  } catch (err) {
    console.log("err", err);
  }
});
