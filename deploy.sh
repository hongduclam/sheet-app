cd client
npm install && npm run build
cd ..
pm2 restart ecosystem.config.js --name sheet-app
