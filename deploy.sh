#!/bin/bash

# sed -i '' "s|export let BASE_URL = 'http://localhost:8081';|export let BASE_URL = 'http://3.34.10.32:8080';|g" ./src/Constants.ts

docker build --platform linux/amd64 -t nomadhuns/front-pure:dev .

docker push nomadhuns/front-pure:dev

# sed -i '' "s|export let BASE_URL = 'http://3.34.10.32:8080';|export let BASE_URL = 'http://localhost:8081';|g" ./src/Constants.ts