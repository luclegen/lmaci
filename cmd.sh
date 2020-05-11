# COMMAND

# * Prerequisites *
sudo npm install -g @angular/cli
sudo npm install -g nodemon

# I. ANGULAR CLIENT
ng new client
cd client; ng s -o
ng g class user --type=model

# Optional
kill -9 $(lsof -t -i:4200); clear; ng s

# II. NODEJS SERVER

mkdir server; cd server; npm init
npm i --save express mongoose body-parser bcryptjs cors jsonwebtoken passport passport-local lodash nodemailer
clear; nodemon

# Optional
kill -9 $(lsof -t -i:3000); clear; nodemon
