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
# Run client:
if [ $(lsof -t -i:4200) ]; then kill -9 $(lsof -t -i:4200); fi; clear; ng s

# II. NODEJS SERVER

mkdir server; cd server; npm init
npm i --save express mongoose body-parser bcryptjs cors jsonwebtoken passport passport-local lodash nodemailer
clear; nodemon

# Optional
# Run server:
if [ $(lsof -t -i:3000) ]; then kill -9 $(lsof -t -i:3000); fi; clear; nodemon
