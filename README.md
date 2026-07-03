# CPUs SQL

## Table of Contents

- [About](#about)
- [ENV variables](#env-variables)
- [Setup](#setup)
- [Usage](#usage)
- [Docker](#docker)
- [CRUD Operations](#crud-operations)


## About

A React frontend with an Express + Sequelize server fullstack application. Build with TypeScript.
CPUs SQL displays a list with your favorite CPUs specifications, you can add, remove and customize your own personal list of processors.

<img src="./img/web-ui.png" alt="CPUs SQL Web UI" width="400"/>


## ENV variables

The following variables are required inside of `./server/.env`
```conf
DATABASE_URL=postgres://<username>:<password>@<hostname>:<port>/<database_name>
PORT=3001
```


## Setup

- Enter the server folder
  ```bash
  cd ./server
  ```

- Install dependencies
  ```bash
  npm install
  ```

- Enter the client folder
  ```bash
  cd ./client
  ```

- Install dependencies
  ```bash
  npm install
  ```


## Usage

### Backend

- Production mode (serves a static build of the frontend)
  ```bash
  npm run start
  ```

- Development mode (enables hot reloading of files)
  ```bash
  npm run dev
  ```

- HTTP requests on http://localhost:3001

### Frontend

- Start the frontend
  ```bash
  npm run dev
  ```

- Access the Web UI on http://localhost:5173



## Docker

### Development mode

- Supports hot reloading of files for both Frontend and Backend.

- Uses Nginx as a reverse proxy.

Start the Docker Compose orchestration
```bash
docker compose -f ./docker-compose.dev.yml up --build
```

- Web UI access on http://localhost:8000

- API requests on http://localhost:8000/api

Cleanup
```bash
docker compose -f ./docker-compose.dev.yml down -v
```

#### Database access via Client UI

Access the database with the following credentials

- Username: `admin`
- Password: `admin`
- Database: `data`
- Port: `5434`
- **Disable** the SSL connection if using tools such as **pgAdmin**

#### Database access via psql

Enter the container
```bash
docker exec -it cpus-sql-dev-db bash
```

Access psql
```bash
psql -U admin -W -d data
```

- Password: `admin`


## CRUD operations

- GET
  ```
  curl -X GET http://localhost:3001/api/cpus
  ```

- GET by ID
  ```
  curl -X GET http://localhost:3001/api/cpus/<id>
  ```

- POST (Example)
  ```
  curl -X POST http://localhost:3001/api/cpus -H "Content-Type: application/json" -d '{ "manufacturer":"AMD", "model":"Ryzen 7 7800X3D", "cores":8, "threads":16, "cache":104, "baseclock":4.2, "boostclock":5.2, "architecture":"Zen 4", "mbsocket":"AM5" }'
  ```

- PUT (All columns are necessary, including the ones that are not going to be updated)
  ```
  curl -X PUT http://localhost:3001/api/cpus/20 -H "Content-Type: application/json" -d '{ "manufacturer":"AMD", "model":"Ryzen 5 7600X", "cores":6, "threads":12, "cache":38, "baseclock":4.7, "boostclock":5.3, "architecture":"Zen 4", "mbsocket":"AM5" }'
  ```

- DELETE
  ```
  curl -X DELETE http://localhost:3001/api/cpus/<id>'
  ```
