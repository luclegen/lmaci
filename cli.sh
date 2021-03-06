# COMMAND

# * Prerequisites *
sudo npm i -g npm @angular/cli@9 nodemon

# I. ANGULAR CLIENT
ng new client
clear; cd client; ng s -o
ng g class user --type=model
npm i -s dotenv ngx-image-cropper multer ngx-image-zoom @syncfusion/ej2-angular-richtexteditor @syncfusion/ej2-angular-popups @syncfusion/ej2-angular-buttons @angular/cdk

# Optional
# Run client:
kill -9 $(lsof -t -i:4200); clear; ng s

# II. EXPRESSJS SERVER

mkdir server; cd server; npm init
npm i -s dotenv mongoose express body-parser bcryptjs cors jsonwebtoken passport passport-local lodash nodemailer rimraf
clear; nodemon

# Optional
# Run server:
kill -9 $(lsof -t -i:3000); clear; nodemon
