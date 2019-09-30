# ChainDigger

Hi! **ChainDigger** is a block explorer, which actually visualize transactions happening in the blockchain.

# Installation
+ Install neo4j database from https://neo4j.com/
+ Install **ChainDigger** 
    + `git pull https://github.com/asketak/chaindigger.git`
  + ` cd chaindigger/backend`
  + ` sudo neo4j-admin import --nodes:ADDRESS ./adresy.txt --relationships:TRANSACTION ./transactions-full-data.csv --ignore-missing-nodes --delimiter="," --high-io=true --ignore-duplicate-nodes`
  +  `cd ../..`
  + `    env FLASK_APP=webserver.py flask run`
  + `npm install`
  + `node server.js`
  
  The explorer is available at http://localhost:8080/index.html
  ![enter image description here](sdgfsdgfsdgf.com)
