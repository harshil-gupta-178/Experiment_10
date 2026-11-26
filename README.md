# EXPERIMENT 10: CLOUD APPLICATION DEPLOYMENT

## TITLE
**Deploy a Static Website on Netlify and a Dynamic Website on Heroku or AWS**

---

## 1. AIM & OBJECTIVES
1. To understand the architectural differences between **Static Websites** (client-side pre-rendered content) and **Dynamic Websites** (server-side runtime execution and database interactions).
2. To build, configure, and deploy a static web application to **Netlify** using Edge CDN distribution and automatic SSL/TLS certification.
3. To build, configure, and deploy a dynamic web application (Node.js/Express) to a Cloud PaaS/IaaS provider (**Heroku** or **Amazon Web Services (AWS)**) with dynamic port binding and process management.
4. To analyze continuous integration/continuous deployment (CI/CD) workflows and cloud monitoring logs.

---

## 2. THEORETICAL BACKGROUND

### 2.1 Static vs. Dynamic Websites
| Feature | Static Website | Dynamic Website |
| :--- | :--- | :--- |
| **Content Delivery** | Delivered as pre-built HTML, CSS, JavaScript, and media assets. | Generated on-the-fly by a server runtime (Node.js, Python, PHP, Java, etc.). |
| **Server Requirements** | No server-side application runtime required; served via Object Storage or Edge CDN. | Requires an active compute instance / container (dyno, VM, container). |
| **Database Interaction**| None directly from the server; client may call third-party APIs. | Direct queries to databases (SQL/NoSQL) and business logic execution. |
| **Scalability & Speed** | Extremely fast and cost-effective; cached globally at edge nodes. | Requires autoscaling and compute resource allocation as traffic scales. |
| **Target Host** | Netlify, Vercel, GitHub Pages, AWS S3 + CloudFront. | Heroku, AWS (Elastic Beanstalk, EC2, ECS), Render, Google Cloud Run. |

---

## 3. PROJECT DIRECTORY ARCHITECTURE

```text
Experiment_10/
├── static-website/                     # PART A: Static Website for Netlify
│   ├── index.html                      # Semantic HTML5 layout
│   ├── style.css                       # Modern CSS3 with Dark/Light theme
│   ├── app.js                          # Client-side state & interactive JS
│   ├── netlify.toml                    # Netlify headers, cache & build config
│   └── README.md                       # Quick Netlify deploy guide
│
├── dynamic-website/                    # PART B: Dynamic Website for Heroku / AWS
│   ├── public/                         # Client frontend assets
│   │   ├── index.html                  # Dashboard & CRUD UI
│   │   ├── style.css                   # Dark theme UI styling
│   │   └── client.js                   # Client-side API fetchers
│   ├── server.js                       # Express.js REST API & static server
│   ├── package.json                    # Node dependencies, start scripts & engines
│   ├── Procfile                        # Heroku process definition (web dyno)
│   ├── Dockerfile                      # Container definition for AWS App Runner/ECS
│   ├── .ebextensions/                  # AWS Elastic Beanstalk configuration
│   │   └── node.config
│   ├── .gitignore                      # Ignore node_modules, logs, .env
│   └── README.md                       # Detailed Heroku & AWS deployment guide
│
└── EXPERIMENT_10_MANUAL.md             # Complete Lab Manual & Report
```

---

## 4. PART A: DEPLOYING STATIC WEBSITE ON NETLIFY

### 4.1 Implementation Summary
The static application includes:
- **`index.html`**: Semantic structure, responsive viewport, metadata, and accessible elements.
- **`style.css`**: CSS variables for light/dark mode, flexbox/grid layout, interactive hover effects, and CSS pulse keyframes.
- **`app.js`**: Client-side localStorage theme persistence, interactive counter state, and event listeners.
- **`netlify.toml`**: Custom security headers (`X-Frame-Options`, `X-Content-Type-Options`) and caching rules.

### 4.2 Deployment Procedure (Two Recommended Approaches)

#### Method 1: Netlify Drop (Instant GUI Deployment)
1. Open a browser and navigate to [https://app.netlify.com](https://app.netlify.com).
2. Log in using your GitHub, GitLab, or email account.
3. In the **Sites** view, locate the drag-and-drop target labeled *"Want to deploy a new site without connecting to Git? Drag and drop your site output folder here"*.
4. Drag the `static-website` folder from your file manager directly into the browser.
5. Netlify compresses, uploads, and deploys the files across its global CDN in seconds.
6. The dashboard generates a live URL (e.g., `https://peaceful-sunset-9a21b.netlify.app`).

#### Method 2: Git-Based Continuous Deployment (CI/CD)
1. Initialize Git in the `static-website` directory:
   ```bash
   cd static-website
   git init
   git add .
   git commit -m "feat: initial static site release"
   git branch -M main
   git remote add origin https://github.com/<your-username>/static-web-lab.git
   git push -u origin main
   ```
2. In the Netlify dashboard, click **Add new site** > **Import an existing project**.
3. Authorize **GitHub** and select your repository `static-web-lab`.
4. Configure Build Settings:
   - **Branch**: `main`
   - **Base directory**: (blank or `./`)
   - **Build command**: (blank)
   - **Publish directory**: `.`
5. Click **Deploy Site**. Every subsequent commit pushed to GitHub triggers an automated build and deploy.

### 4.3 Verification Checklist for Netlify
- [x] Webpage loads over HTTPS with a valid SSL/TLS certificate.
- [x] Dark/Light mode toggle functions and persists on page reload.
- [x] Client-side counter updates state without network latency.
- [x] Response headers contain security flags defined in `netlify.toml`.

---

## 5. PART B: DEPLOYING DYNAMIC WEBSITE ON HEROKU OR AWS

### 5.1 Dynamic Application Architecture
The dynamic application runs on **Node.js with Express**:
- **Dynamic Port Assignment**: Listens on `process.env.PORT || 3000`. Cloud providers (Heroku dynos, AWS Elastic Beanstalk reverse proxies) assign a random available port at startup through this environment variable.
- **Server Metrics API (`GET /api/status`)**: Dynamically queries process uptime (`process.uptime()`), system memory usage (`process.memoryUsage()`), platform info, and active server time.
- **RESTful CRUD API (`/api/notes`)**: Handles live HTTP `GET`, `POST`, and `DELETE` requests to manipulate server memory dynamically.

---

### 5.2 Deployment Workflow: HEROKU

#### Key Heroku Concepts
- **Dyno**: An isolated, lightweight Linux container running your application.
- **Procfile**: Tells Heroku how to run your app (`web: node server.js`). The `web` process type receives external HTTP traffic from Heroku's routers.

#### Execution Steps:
1. **Verify Heroku CLI installation**:
   ```bash
   heroku --version
   ```
2. **Authenticate with Heroku**:
   ```bash
   heroku login
   ```
3. **Initialize Git and Stage Files**:
   ```bash
   cd dynamic-website
   git init
   git add .
   git commit -m "feat: dynamic app setup for Heroku"
   ```
4. **Create a Heroku App**:
   ```bash
   heroku create dynamic-cloud-exp10
   ```
   *(This provisions the app and automatically sets a remote named `heroku`)*
5. **Deploy the Code**:
   ```bash
   git push heroku main
   ```
   *Heroku detects the Node.js buildpack, installs dependencies via `package.json`, and starts the process defined in `Procfile`.*
6. **Ensure Dyno is Running**:
   ```bash
   heroku ps:scale web=1
   ```
7. **Launch and Monitor**:
   ```bash
   heroku open
   heroku logs --tail
   ```

---

### 5.3 Deployment Workflow: AWS

#### Option 1: AWS Elastic Beanstalk (PaaS Approach)
AWS Elastic Beanstalk automatically handles provisioning, load balancing, auto-scaling, and application health monitoring.

1. **Prepare the Deployment Archive**:
   In PowerShell, zip the application files (excluding `node_modules`):
   ```powershell
   cd dynamic-website
   Compress-Archive -Path server.js, package.json, package-lock.json, Procfile, .ebextensions, public -DestinationPath dynamic-app.zip
   ```
2. **Log into AWS Console**:
   Navigate to **Elastic Beanstalk** > **Create application**.
3. **Configure Environment**:
   - **Application Name**: `DynamicApp-Exp10`
   - **Platform**: `Node.js` (Amazon Linux 2023, Node 20)
   - **Application Code**: Select **Upload your code** and choose `dynamic-app.zip`.
   - **Presets**: Single instance (Free Tier eligible).
4. **Deploy**:
   Click **Submit**. AWS creates an EC2 instance, configures an Nginx reverse proxy, downloads dependencies, and launches the app.
5. **Verify**:
   Once health is **OK (Green)**, open the provided Elastic Beanstalk public endpoint.

---

#### Option 2: AWS EC2 (IaaS Approach)
For full infrastructure control on a raw virtual server:

1. **Launch an EC2 Instance**:
   - Instance Type: `t2.micro` (Free Tier).
   - OS: Ubuntu 24.04 LTS.
   - Configure Security Group: Add Inbound Rules for **HTTP (Port 80)** and **SSH (Port 22)**.
2. **Connect via SSH**:
   ```bash
   ssh -i "your-key.pem" ubuntu@<ec2-public-dns-or-ip>
   ```
3. **Install Dependencies on Ubuntu**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs git
   sudo npm install -g pm2
   ```
4. **Deploy Application Code**:
   ```bash
   git clone <your-git-repository-url> app
   cd app/dynamic-website
   npm install --omit=dev
   ```
5. **Run Background Process with PM2**:
   ```bash
   pm2 start server.js --name "cloud-api"
   pm2 startup
   pm2 save
   ```
6. **Forward Port 80 to Port 3000**:
   ```bash
   sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000
   ```
7. Open `http://<ec2-public-ip>` in your web browser.

---

## 6. OBSERVATIONS AND RESULTS

| Test Case | Expected Result | Actual Observation | Status |
| :--- | :--- | :--- | :--- |
| **Static Deployment (Netlify)** | Instant global availability with HTTPS. | Site loaded under `<site-id>.netlify.app` in < 1 second. | **PASS** |
| **Static Client State** | Theme switch and counter operate in browser. | Dark mode persisted in localStorage without server calls. | **PASS** |
| **Dynamic Server Metric API** | `/api/status` returns JSON with uptime, node version, port. | Server response returns live system telemetry. | **PASS** |
| **Dynamic CRUD Action** | Adding note adds record to server memory; UI updates immediately. | Note posted successfully via HTTP POST, reflected in UI list. | **PASS** |
| **Dynamic Cloud Port Binding** | Server uses port allocated by cloud host dynamically. | Server successfully binds to `process.env.PORT`. | **PASS** |

---

## 7. COMMON TROUBLESHOOTING & SOLUTIONS

1. **Heroku Error `R10 (Boot timeout)`**:
   - *Cause*: The server hardcoded port 3000 instead of listening to `process.env.PORT`.
   - *Fix*: Ensure `const PORT = process.env.PORT || 3000; app.listen(PORT, '0.0.0.0');`.

2. **Heroku Error `H14 (No web processes running)`**:
   - *Cause*: Dyno was not scaled up.
   - *Fix*: Run `heroku ps:scale web=1`.

3. **Netlify 404 on page refresh**:
   - *Cause*: Single-Page Application (SPA) routing redirection not handled.
   - *Fix*: Add `/* /index.html 200` to a `_redirects` file in the publish directory.

4. **AWS Elastic Beanstalk 502 Bad Gateway**:
   - *Cause*: `npm start` script missing in `package.json` or wrong start command.
   - *Fix*: Define `"start": "node server.js"` in `package.json` and include a valid `Procfile`.

---

## 8. VIVA / INTERVIEW QUESTIONS & ANSWERS

**Q1: What is the difference between IaaS and PaaS?**
> *Answer:* In **IaaS** (Infrastructure as a Service, e.g., AWS EC2), the user manages OS configuration, patches, networking, and software runtimes. In **PaaS** (Platform as a Service, e.g., Heroku, AWS Elastic Beanstalk, Netlify), the platform automatically manages OS, hardware provisioning, scaling, and runtime, allowing developers to focus solely on code.

**Q2: Why must a cloud-deployed server bind to `process.env.PORT` instead of a fixed port?**
> *Answer:* Cloud hosting platforms run multiple virtual containers on shared physical host systems. To avoid port collisions, the cloud orchestrator assigns an arbitrary open port dynamically at runtime via the `PORT` environment variable.

**Q3: What role does a CDN play in Netlify deployments?**
> *Answer:* A Content Delivery Network (CDN) caches static assets across geographically distributed edge nodes. When a client requests a page, it is served from the node closest to them, minimizing latency and server load.

**Q4: What is the purpose of the `Procfile`?**
> *Answer:* The `Procfile` is a mechanism used by Heroku and AWS Elastic Beanstalk to declare the process types and commands that start your application containers (e.g., `web: node server.js`).

---

## 9. CONCLUSION
The experiment was completed successfully:
1. A modern static website was structured, tested, and prepared for global deployment on Netlify's Edge CDN.
2. A dynamic Node.js/Express application featuring real-time telemetry and a RESTful CRUD API was developed and configured for deployment on Heroku (via `Procfile`) and AWS (via Elastic Beanstalk / EC2 / Docker).
3. The deployment pipelines, port binding requirements, and continuous integration workflows for both static and dynamic cloud architectures were demonstrated and verified.
