# Smart Alarm
## File Structure
    |-config
        |-config.js
    |-package.json
    |-alarm.js
        
#### Config folder
Contains the config file
#### package.json
Node module dependencies
#### alarm.js
NodeJS alarm script

## Installation
1. Install nodejs
    - Windows/Mac - https://nodejs.org/en/download/
    - Linux - https://www.ostechnix.com/install-node-js-linux/
2. Clone repo

       git clone https://github.com/ajimal1992/smart-alarm-rpi.git
3. Go to repo directory

       cd smart-alarm-rpi
4. Install dependencies

       npm install
5. Start alarm script

       node alarm.js

##### Note
Please remember to add the the dependency module to package.json if you have installed any. You can do so by

    npm install <some-package> --save
