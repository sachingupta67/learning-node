# Scheduling cron jobs
=> eg: lets say we want to send some email to the users every day at 12:00 pm
=> we can use cron jobs to schedule the email
=> What we want : want to schedule cron job for email sending


## How to do it ??
 - command : npm i node-cron
 ```
 // email-cron.js
const cron = require("node-cron");

cron.schedule("* * * * * *", () => {
    console.log("Running a task every minute");
});



 ```
- run this code as soon as server starts
 
 ```
 require("./utils/cron-jobs/email-cron");

 ```

=> now this will run the cron job based on CRON STRING

# CRON String
 => eg: * * * * * *
 - 1* => second
 - 2* => minute
 - 3* => hour
 - 4* => day of the month
 - 5* => month
 - 6* => day of the week

=> for every second : * * * * * * 
=> for every minute : * * * * * 
=> eg: we want 08:00 AM every day : 0 8 * * * 
  - play ground : https://crontab.guru

Example

Schedule | Cron String | Meaning
Every minute | * * * * * | Runs every minute
Every 5 minutes | */5 * * * * | Every 5 minutes
Every 15 minutes | */15 * * * * | Every 15 minutes
Every hour | 0 * * * * | At the start of every hour
Every 6 hours | 0 */6 * * * | Every 6 hours

============

Schedule | Cron String | Meaning
Every day at midnight | 0 0 * * * | 12:00 AM every day
Every day at 6 AM | 0 6 * * * | 6:00 AM every day
Every Monday at 9 AM | 0 9 * * 1 | 9:00 AM every Monday
Every Friday at 5 PM | 0 17 * * 5 | 5:00 PM every Friday
Every Sunday at midnight | 0 0 * * 0 | 12:00 AM every Sunday
1st of month at 1 AM | 0 1 1 * * | 1:00 AM on the 1st of each month


# we have create a cron to email scheduling
  - here we run to loop over list of email
  - not a good way  for Million Users
     - we need to do queuing and send data in bulk or batches of 100 , 100
     - query should be paginated 
     package : bee-queue
     - ses also can handle