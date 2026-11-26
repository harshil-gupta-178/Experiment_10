# Dynamic Website (Node.js & Express)

A dynamic Node.js and Express web application with live server diagnostics and a REST API.

## Run Locally
```bash
npm install
npm start
```
Open `http://localhost:3000` in your browser.

## Deploy
- **Heroku:** Includes a `Procfile` (`web: node server.js`) and uses `process.env.PORT`. Connect this `dynamic` branch or run `git push heroku dynamic:main`.
- **AWS (Elastic Beanstalk / EC2):** Ready for Node.js (`npm start` / `node server.js`).
