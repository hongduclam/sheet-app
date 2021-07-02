cd client
npm install && npm run build
cd ..
npm install && pm2 restart ecosystem.config.js --name sheet-app
