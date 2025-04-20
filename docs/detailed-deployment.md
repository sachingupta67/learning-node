

# 🚀 Deploy React Frontend on AWS EC2 (Ubuntu + Node.js + Nginx)

## ✅ What We're Doing:
We are deploying a production-ready React frontend app on a virtual machine (EC2 instance) using **Ubuntu** OS. We'll:
- Install **Node.js** to build the frontend
- Use **Nginx** to serve static files
- Configure security rules to allow web traffic

---

## 1. Launch EC2 Instance (`DevTinder-web-dev`)

### ➤ What is an EC2 instance?
EC2 (Elastic Compute Cloud) is a **virtual server** in AWS cloud, where we can host applications like on any physical server.

### Step-by-Step:
1. Go to **EC2 Dashboard** → Click **Launch Instance**
2. Set instance name: `DevTinder-web-dev`
3. OS: **Ubuntu** – common Linux OS, widely used for production
4. Instance type: **t2.micro** – Free Tier eligible, suitable for small apps
5. Key Pair:
   - Used to securely SSH (login) into the instance
   - Download `.pem` file and **keep it safe**
6. Leave **Network Settings** and **Storage** as default
7. Click **Launch Instance**
8. Go to **Instances** → wait for:
   - `Instance State: running`
   - `Status Check: passed` (means it's ready to use)

---

## 2. Connect to EC2 via SSH

### ➤ What is SSH?
SSH (Secure Shell) lets you remotely access the server terminal from your local computer.

### Commands:
```bash
chmod 400 DevTinder-web-dev-secret.pem
# Makes the key file secure

ssh -i "DevTinder-web-dev-secret.pem" ubuntu@<your-ec2-public-dns>
# Connects to the instance using the key
```

---

## 3. Install Node.js

### ➤ Why Node.js?
React projects use Node.js to install packages and build the project. We only need Node to **build the frontend**, not run it.

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v && npm -v  # Check versions
```

---

## 4. Clone and Build Project

### ➤ Why Build?
React apps use tools like Vite or Create React App to generate a `dist` or `build` folder with **static HTML/CSS/JS** files. These are what we actually deploy.

```bash
git clone <your-repo-url>       # Download your code
cd <project-folder>
npm install                     # Install project dependencies
npm run build                   # Creates production-ready files in dist/
```

---

## 5. Install and Configure Nginx

### ➤ What is Nginx?
Nginx is a **web server** that can serve static files like HTML, CSS, and JS. It listens on port 80 and delivers your website to users.

```bash
sudo apt update
sudo apt install nginx
sudo systemctl start nginx      # Start the server
sudo systemctl enable nginx     # Auto-start on reboot
```

---

## 6. Deploy Build Files

### ➤ Where are files served from?
Nginx serves files from `/var/www/html` by default. So we place our build files there.

```bash
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html
```

---

## 7. Open Port 80 (HTTP)

### ➤ Why Port 80?
Port 80 is the default for HTTP websites. AWS blocks it by default — we need to allow it manually.

### Steps:
1. Go to EC2 → Click Instance ID → Click **Security Group**
2. Click **Edit Inbound Rules** → **Add Rule**
   - Type: **HTTP**
   - Port: `80`
   - Source: `0.0.0.0/0` → allows anyone to access it
3. Save rules

---

## 8. Access Your App 🎉

Visit in browser:  
```text
http://<your-public-ip>
```

You should now see your deployed frontend app.

---


Here's a more detailed and informative version of the deployment process:

### Deploy Backend on AWS EC2

1. **Clone the Backend Code:**
   - SSH into your EC2 instance.
   - Clone the repository containing the backend code:
     ```bash
     git clone <repo_url>
     ```
   
2. **Navigate to the Project Directory:**
   - Change to the project folder:
     ```bash
     cd <project_folder>
     ```

3. **Install Dependencies:**
   - Install all the necessary dependencies:
     ```bash
     npm install
     ```

4. **Start the Application in Production Mode:**
   - Start your application:
     ```bash
     npm start
     ```
   - Your app should now be running at `localhost:8080` on the EC2 instance. However, it will only run as long as the terminal is open.

---

### Handling Database Connection Issues (MongoDB)

- If MongoDB is not connecting to the EC2 instance, update the network settings of MongoDB to allow access from your EC2 instance's IP address:
  1. **Get the EC2 Instance Public IP:**
     - Go to the **EC2 dashboard**, and click on the running **instance-id**.
     - Find the **Public IPv4 address** under the instance details.
     - Copy the IP address to use later.

  2. **Update MongoDB Network Settings:**
     - In MongoDB, go to the **Network Access** settings.
     - Add the EC2 instance's public IP address to allow connections from that IP.

---

### Access the Backend Application

- In your local setup, you might access the backend at `localhost:8080`. On the EC2 instance, you can try to access it with the EC2 public IP, e.g., `<copied_ip>:8080`.
  
  However, **it may not work** because the security group needs to allow inbound traffic on port 8080.

---

### Update Security Group to Allow Port 8080

1. **Edit Inbound Rules for Security Group:**
   - Go to **EC2** → **Security Groups**.
   - Find the security group associated with your EC2 instance.
   - Click on **Inbound Rules** and then **Edit Inbound Rules**.
   - Add a new inbound rule:
     - **Type**: Custom TCP
     - **Port Range**: 8080
     - **Source**: Anywhere (or specific IP address if you need more control)
   - Click **Save rules**.

Now, you should be able to access your backend at `http://<copied_ip>:8080`.

---

### Keeping the Backend Application Running in the Background

#### Issue: Terminal Will Close the Application

- By default, the application will stop running if you close the terminal or disconnect from SSH.

#### Solution: Use PM2 to Keep the Application Running

**PM2** is a process manager for Node.js applications that helps keep your application running in the background.

1. **Install PM2:**
   - Install PM2 globally:
     ```bash
     npm install pm2 -g
     ```

2. **Start the Application with PM2:**
   - Start your application with PM2:
     ```bash
     pm2 start npm -- start
     ```

3. **Check Logs:**
   - To view logs, use:
     ```bash
     pm2 logs
     ```

4. **Clear Logs:**
   - To clear logs, run:
     ```bash
     pm2 flush <application_name>  # Example: pm2 flush npm
     ```

5. **Get Application Name:**
   - To find your application name, use:
     ```bash
     pm2 list
     ```

6. **Managing the Application:**
   - **Stop the application:**
     ```bash
     pm2 stop <application_name>
     ```
   - **Restart the application:**
     ```bash
     pm2 restart <application_name>
     ```
   - **Delete the application:**
     ```bash
     pm2 delete <application_name>
     ```
   - **Rename an application:**
     First, stop the app and then:
     ```bash
     pm2 start <old_application_name> --name <new_application_name>
     ```
   - **Monitor the application:**
     ```bash
     pm2 monit
     ```

7. **Stopping All Applications:**
   - To stop all running applications:
     ```bash
     pm2 stop all
     ```

8. **Deleting All Applications:**
   - To delete all applications:
     ```bash
     pm2 delete all
     ```

---

### Additional Notes

- **Running the Application in the Background**:
   - PM2 ensures that your application stays running even if the terminal session is closed or the server reboots. It is ideal for production environments where you need a process manager to handle crashes and restarts.

- **Monitor Application Health**:
   - You can monitor the health of your application and server using PM2's `monit` or other server monitoring tools like `htop` or `top`.

By following these steps, you'll be able to deploy, manage, and monitor your backend application on AWS EC2 efficiently.


