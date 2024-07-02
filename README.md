> It's not done yet

# Pioneer 3

#### A Vue.js WebSocket client to explore `$SYS/#` topics.

![MQTT](https://img.shields.io/badge/MQTT-DASHBOARD-informational?style=for-the-badge&logo=mqtt)
![MQTT](https://img.shields.io/badge/MQTT-TOPIC_TREE-important?style=for-the-badge&logo=mqtt)

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat-square&logo=javascript&logoColor=%23F7DF1E)
![Vue.js](https://img.shields.io/badge/Vue_3-35495E?style=flat-square&logo=vuedotjs&logoColor=%234FC08D)
![mqtt-vue-hook](https://img.shields.io/github/package-json/v/tommy44458/mqtt-vue-hook?label=mqtt-vue-hook&style=flat-square)
![Pinia](https://img.shields.io/badge/PINIA-v2-yellow?style=flat-square)
![Bootstrap](https://img.shields.io/badge/bootstrap-v5.3.0-%238511FA.svg?style=flat-square&logo=bootstrap&logoColor=white)
![Chart.js](https://img.shields.io/badge/chart.js-v4.3.0-F5788D.svg?style=flat-square&logo=chart.js&logoColor=white)

See it in action at https://pioneer3.onebiot.cz/#/

[![Dashboard](docs/assets/dashboard.png)](#)

## Features
- it's online
- you don't need setup anything, just connect
- primary compatible with Mosquitto brokers
- it is Single Page Application (SPA) client, I do not save any data about you or your connections

## Cons
- you can connect only to broker supporting websockets
- no connection manager (for storing credentials and hosts use
![Bitwarden](https://img.shields.io/badge/BITWARDEN-informational?style=flat-square&logo=bitwarden&logoColor=white) or ![1password](https://img.shields.io/badge/1PASSWORD-9cf?style=flat-square&logo=1password&logoColor=black))

## Usage

### online
You can try everything online without any installation at https://pioneer3.onebiot.cz/#/. Client has predefined connection
to test.mosquitto.org public broker to see a basic functions. 

### locally
Clone repository from **github**:

```shell
git clone https://github.com/1biot/pioneer-3.git
```

Install dependencies and build client:

```shell
cd pioneer-3
npm install
npm run build
```

Run locally:

```shell
npm run preview
```

at your browser: http://localhost:5174/#/

or use docker:

```shell
npm run docker:dist
```

at your browser: http://localhost:9000/#/

## Documentation
Read [the documentation ](https://github.com/1biot/pioneer-3/blob/master/docs/README.md)
in order to learn more about the project.

## Contribute
I am open to new ideas how to improve this client. If you want you can

- fork this repository
- create a new branch at your fork
- implement new feature or bugfix (`npm run dev` for development at http://localhost:5174/#/)
- create a pull request

[![JavaScript Style Guide - Standard Style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)
