# onem2m-agri-its

## Requirements
* JAVA 8 to run the CSE
* Node to run Agri IPE, ITS IPE and Safety AE

## Run oneM2M platform
1. open "cse" folder
2. You can configure the CSE using file config/config.ini (Optional)
3. Execute "start.sh" on linux or "start.bat" on Windows
4. Open the CSE web interface. Default address: http://127.0.0.1:8080/web
5. Login using "Cae-admin" as username and "changeme" as password

## Run Agri-IPE
1. open the "agri-ipe" folder
2. You can configure the "agri-ipe" using file config.json (Optional)
3. Run the agri-ipe using command: node app.js

## Run ITS-IPE
1. open the "its-ipe" folder
2. You can configure the "its-ipe" using file config.json (Optional)
3. Run the its-ipe using command: node app.js

## Run Safety-AE
1. open the "safety-ae" folder
2. You can configure the "safety-ae" using file config.json (Optional)
3. Run the safety-ae using command: node app.js
