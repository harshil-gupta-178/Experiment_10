# Dynamic Website Deployment Guide: Heroku & AWS

This project is a dynamic Node.js/Express web application featuring real-time server diagnostics and a dynamic REST API.

---

## Part 1: Deploying to Heroku

### Prerequisites
1. Free or active [Heroku Account](https://signup.heroku.com).
2. [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed (`heroku --version`).
3. Git installed.

### Step-by-Step Heroku CLI Deployment

1. **Log in to Heroku via Terminal**:
   ```bash
   heroku login
   ```

2. **Initialize Git repository (if not already done)**:
   ```bash
   git init
   git add .
   git commit -m "Deploy dynamic app to Heroku"
   ```

3. **Create a Heroku App**:
   ```bash
   heroku create my-dynamic-cloud-app
   ```
   *(Replace `my-dynamic-cloud-app` with your custom unique name)*

4. **Verify the Procfile and Port**:
   - The included `Procfile` specifies: `web: node server.js`.
   - `server.js` listens to `process.env.PORT || 3000`. Heroku automatically injects the `$PORT` environment variable.

5. **Deploy Code via Git**:
   ```bash
   git push heroku main
   ```
   *(or `git push heroku master` depending on your active branch)*

6. **Scale Web Dyno & Open App**:
   ```bash
   heroku ps:scale web=1
   heroku open
   ```

7. **View Live Server Logs**:
   ```bash
   heroku logs --tail
   ```

---

## Part 2: Deploying to AWS

You can deploy this dynamic app to AWS using either **AWS Elastic Beanstalk (PaaS)** or **AWS EC2 (IaaS)**.

### Option A: AWS Elastic Beanstalk (Recommended / Easiest)

1. **Package the Application**:
   Create a `.zip` archive containing:
   - `server.js`
   - `package.json`
   - `package-lock.json`
   - `Procfile`
   - `.ebextensions/`
   - `public/` folder
   *(⚠️ Do NOT include `node_modules` in the zip; Elastic Beanstalk installs them during deployment).*

   PowerShell command:
   ```powershell
   Compress-Archive -Path server.js, package.json, package-lock.json, Procfile, .ebextensions, public -DestinationPath dynamic-app.zip
   ```

2. **Open AWS Management Console**:
   - Navigate to **AWS Elastic Beanstalk**.
   - Click **Create Application**.
   - **Application Name**: `DynamicWebApp`.
   - **Platform**: `Node.js` (Branch: Node.js 20 on Amazon Linux 2023).
   - **Application Code**: Select **Upload your code** and upload `dynamic-app.zip`.
   - Click **Create Application**.

3. **Verification**:
   Once the environment health shows **Green (OK)**, click the provided environment URL (e.g., `http://dynamicwebapp-env.eba-xxx.region.elasticbeanstalk.com`).

---

### Option B: AWS EC2 (Virtual Machine with Linux + PM2 + Nginx)

1. **Launch an EC2 Instance**:
   - OS: Ubuntu Server 24.04 LTS or Amazon Linux 2023.
   - Instance Type: `t2.micro` (Free Tier).
   - Security Group: Allow HTTP (Port 80) and SSH (Port 22).

2. **SSH into the Instance**:
   ```bash
   ssh -i your-key.pem ubuntu@<your-ec2-public-ip>
   ```

3. **Install Node.js, Git, and PM2 (Process Manager)**:
   ```bash
   sudo apt update
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs git
   sudo npm install -g pm2
   ```

4. **Clone or Copy App Code**:
   ```bash
   git clone <your-repo-url> app
   cd app
   npm install --omit=dev
   ```

5. **Start App with PM2**:
   ```bash
   pm2 start server.js --name "dynamic-app"
   pm2 startup
   pm2 save
   ```

6. **Configure Port Forwarding (Port 80 to 3000)**:
   ```bash
   sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000
   ```
   Now visit `http://<your-ec2-public-ip>` in your browser.
