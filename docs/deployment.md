# Deploy Application on AWS

## Launch instance (DevTinder-web-dev)

1- taka a machine on rent (eg: ec2 instance for that | Elastic Compute) - Virtual Server
2- default - 0 instance running
   - we need to launch a new instance  ( means launch a server)
3- Click on Launch Instance
   - Give a name eg: DevTinder-web-dev
   - it will ask you to OS on this instance to install 
      eg: Amazon Linux, macos, Ubuntu, Windows, ...
      preferred: Ubuntu (most company used the same)
   - Go down till you find 'Instance Type'
4- Instance Type
   - by default offerring free Tier T2 | Keep the same for now later on we can upgrade
5- Key Pair Login 
   - click on create 
   - enter key-pair name eg: DevTinder-web-dev-secret
   - Keep RSA & .pem (default)
   - click to create
   - .pem file will be downloaded (its a like a key to access your instance or server)

5- Network Setting  - No touch for now
   - Create Security Group (Default select)
6 - Keep all default now
7- Click  Launch instance (it will take time a bit to launch)
8- Go to instance
   - Look for instance eg: DevTinder-web-dev
   - instance state : running
   - Status Check : wait to complete intitalisation if you are new
9- Try to login into this instance or machine with SSH-Command

Note - if you want to see the info of machine then click on instance id 


## Connect to machine or instance
 1. one machine info screen where we came from instance > instance id
 2. Look for connect 
 3. Click on Connect 
 4. Here you will see ways to connect
    - will choose to SSH

### Using SSH How to connect
 1. Locate .pem file in your system which you have downloaded
 2. Change the permission for this file with following command
    ```
       chmod 400 <pem-file>.pem
    ```
 3. ssh -i "DevTinder-web-dev-secret.pem" ubuntu@ec2-16-171-235-188.eu-north-1.compute.amazonaws.com
    Note : you have to be on folder where .pem file is located
 4. once above done : we will get the linux terminal
    eg: ubuntu@ip-172-31-22-122
 5. its a fresh machine right , and we want to setup frontend , so we need to install node for react
    - install correct version of node eg: identify which version you can using on local to run that project
 6. Clone the Project from git | we can clone multiple project here right now did one 
 7. on Production , 
    - we create build first then start the project | on dev we run 'npm run dev' not work here
 8. Create Build 
    - npm install (if node_modules not there)
    - npm run build
 9. We need nginx - to make deployment | it acts as web server | create http server
    - sudo apt update
    - sudo apt install nginx
    - sudo systemctl start nginx   => for start nginx
    - sudo systemctl enable nginx
    - Copy Build from /dist to nginx server (/var/www/html)
      - sudo scp -r dist/* /var/www/html
      - done
    - how to verify
       - go to instance
       - click instance-id
       - look for Public IPv4 address
       - copy ip to access our web application 
       - but you will not see application running if setting up first time
          - because => AWS block the port : which is port 80 of our instance
          - on instance info => go to security
          - go to security group
          - add inbound rule to allow access port number 80 => click on edit inbound rule
          - click => add rule 
          - give port range = 80  with HTTP
          - give 0.0.0.0 for allow from anywhere 
          - save rules
          - wait for some time - and check again public -ip
          - later on will map with this domain





### Deploy BE on aws 
 -> will continue in same instance 
 -> will clone first in the same instance 
 -> go to folder
 -> npm install
 -> Production : npm start 

Note : if database not connected , then in Mongo we need to Go to Network setting and update the IP address setting
eg: we can allow IP of AWS 
- go to instance 
- click instance-id
- look for Public IPv4 address
- copy ip to access our web application
- paste into mongo to access

->Now we know in Local : localhost:8080 that was working for BE
->Same we can check in the URL with following : <copied_ip>:8080
-> but it will not run because we need to allow port 8080 in the security group
-> go to security
-> go to security group
-> add inbound rule to allow access port number 8080 => click on edit inbound rule (with custom TCP)


Note ::::
-> Note application will only runing till the terminal is running
-> if we close the terminal then application will stop running

Solution : we need to run this into background

# Get IP Instance which is running on which IP
 -> curl ifconfig.me

# How to run application in background
 -> we need to use pm2 tool
 -> its a deamon process manager , which keep your application running online 24/7
 -> install this on server
    - npm install pm2 -g
    - pm2 start npm -- start

# how to check logs 
  - pm2 logs
  - clear the logs : pm2 flush <application_name> eg:npm
  - how to get <application_name>
     - run=> pm2 list 
  - change <application_name>
  - how to stop => pm2 stop <application_name>
  - how to restart => pm2 restart <application_name>
  - how to delete => pm2 delete <application_name>
  - how to update => [first stop] => pm2 start <old_application/current_application_name> --name <new_application_name>
   Or [restart] => pm2 restart <old_application/current_application_name> --name <new_application_name>
  - how to monitor => pm2 monit
  - how to stop all => pm2 stop all
  - how to delete all => pm2 delete all


# Proxy Pass
eg: FE => http://16.16.183.51/  
    BE => http://16.16.183.51:8080
    Expacation [BE] => http://16.16.183.51:api 

    In Actual Work
    FE => www.abc.com 
    BE => www.abc.com:8080 [BAD]
    Correct => www.abc.com/api 

    Will use for that proxy pass
    - Nginx will take care of it 
    - we have to update config file of nginx

    ```
     server {
    listen 80;
    server_name www.abc.com;

    # Frontend
    location / {
        root /var/www/frontend;  # replace with actual build path
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Backend (proxied to Express API)
    location /api/ {
        proxy_pass http://localhost:8080/; # or 127.0.0.1 if running locally
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # CORS support if needed
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Credentials true;
    }
}


    ```


# How to edit nginx config on server
- root access should be for edit 
- sudo nano /etc/nginx/sites-available/default
- update server name 
   eg:[if not having domain]-16.16.183.51
      [if having domain] -www.abc.com
   server_name www.abc.com;
- below the server_name will add another rule =>
  location /api/ {
        proxy_pass http://localhost:8080/; # or 127.0.0.1 if running locally
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # CORS support if needed
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Credentials true;
    }

  - save & exit
  - restart nginx
    - sudo systemctl restart nginx  

  # If we refresh page it says 404 Non found
  - for SPA 
    ```
    location / {
       
       try_files $uri $uri/ =404;
    }
    ```

  - update this : 

  ```
    location / {
       
       try_files $uri /index.html; # replaced $uri/ =404 to /index.html
    }
    ```
   => CTRL+X , Y ,ENTER
   - Restrat nginx
     - sudo systemctl restart nginx

  # Imp = FE & BE has same domain right then 
    const BASE_URL = "/api"  it will take automatically 
    eg: BASE_URL ="http://localhost:8080/api"
        BASE_URL ="abc.com/api"