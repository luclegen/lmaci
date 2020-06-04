# COMMAND

# * Prerequisites *
sudo npm i -g npm
sudo npm i -g @angular/cli
sudo npm i -g nodemon

# I. ANGULAR CLIENT
ng new client
clear; cd client; ng s -o
ng g class user --type=model
npm i --save @syncfusion/ej2-angular-richtexteditor @syncfusion/ej2-angular-popups @syncfusion/ej2-angular-buttons

# Optional
kill -9 $(lsof -t -i:4200); clear; ng s

# II. NODEJS SERVER

mkdir server; cd server; npm init
npm i --save express mongoose body-parser bcryptjs cors jsonwebtoken passport passport-local lodash nodemailer
clear; nodemon

# Optional
kill -9 $(lsof -t -i:3000); clear; nodemon
