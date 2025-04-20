# How to send Email : Using Amazon SES (Simple Email Service)

Prerequisites: 
- you have to go to IAM
- have to create a IAM Role
    - this will give , lets say create user and give them access to certain services
- Create a User
- Click on user
- Click on Create user 
    - give name
    - next
    - we can create group and add user to group , right now just attaching policy to user
    - attach policy 
        - AmazonSESFullAccess (search for this)
        - next 
    - create user , it will create user
- Now got console and search SES 


# Continue to setup SES 
- Look fo Simple Email Service or SES  and go to dashboard
- make sure you are in correct region (mumbai)
- Now we need to create and identity (look of indentity)
  - enter domain or email (selecting domain )
  - select => Easy DKIM
  - RSA_2048_Bit
  - Click Create Identity
  - Now Look for Public DNS Records => we need to in DNS Setting 
    - Copy all DNS records and paste into CLoudFlare | make sure you turn off the proxy
    - once done it will take some time to update
    - once done you will see verified

# How to test / send email 
- Navigate to 'Get Set up' on SES 

=> Production : Request for production access
   - fill details
     - addtional contacts : support@trowio.com
   - submit 
   - wait for 24 hours to get approval
=> Testing 
   => use sandbox

=> development  (Pre-req)
   : we need ses sdk (will do this later)
   : need secret key for the user that we created
      - go to IAM
      - go to user
      - click on security credentials
      - click on access keys
         - select other 
         - done : will get access key and secret key
         - accessKey: secretAccessKey
         ```
         AWS_ACCESS_KEY : AWS_SECRET_KEY
         
         ```
=> Lets' Do Code
   => https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html
   => https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/javascriptv3/example_code/ses#code-examples

   - need to install this
     ```
     @aws-sdk/client-ses
     ```
   - follow the code from github for 'send-email in ses'
   => Note : sender & receiver should be verified in SES (Sandbox)
      eg [trowio.com] // any email id with this domain
        [sachingupta.coder@gmail.com] // your personal email to verify
      how can make anyone render & receiveer

