<p align="center">
  <img src="./assets/dantes-logo.png" alt="Logo" width="200" />
</p>

# Dantes 🧭

Dantes is a fully self-hostable, zero dependancy, extremely quick and lightweight, asynchronous background job orchastrator with a built in dashboard.

Deploy it once, and use in any language.

## Table of contents

- [Dantes 🧭](#dantes-)
  - [Table of contents](#table-of-contents)
  - [What is Dantes?](#what-is-dantes)
  - [Setup](#setup)
      - [1. Clone dantes](#1-clone-dantes)
      - [2. Run the setup script](#2-run-the-setup-script)
  - [How it works](#how-it-works)
  - [The dashboard](#the-dashboard)
  - [Contributing](#contributing)

## What is Dantes?

Dantes is a asynchronous job orchastrator, with quick low-effort setup, giving you complete control over your the jobs you want to run. Written in typescript form scratch, the goal has been to deploy and leave a self-sufficient, atomic and durable orchastrator engine, so that you can focus on building better workers, not managers.

Dantes comes with out-of-the-box support for retries, scheduled jobs, and CRON jobs. You can trace through time all executions of a job, payloads and success and error states. It is heavily configurable to your needs, simply by modifying the environment, or customising your Queue.

## Setup

#### 1. Clone dantes

```sh
git clone https://github.com/iammohitvs/dantes.git

cd dantes
```

#### 2. Run the setup script

```sh
chmod +x setup.sh

./setup.sh
```

## How it works

Dantes runs on the well-known concept of Queues and Jobs. Think of Queues like an overall blueprint of the job, and think of Jobs as an execution defined by the queue it is part of. Queues host information like what worker must be hit, how many times a retry must happen, how long to wait for a response. Jobs hold more execution level information, like when to execute, what payload to deliver, scoped retry counts, and execution history. There are 3 types of jobs dantes can manage: Jobs requiring immediate schduling, Jobs that require scheduling sometime in the future, CRON Jobs.

Dantes - by default - will at once send out 5 jobs to be executed by their workers. This is a configurable number. The jobs execute, and then replaced by the next job. An internal loop schedules these jobs, and a mutex makes sure no two jobs are confused inside the database, ensuring isolation while picking up jobs. When picking up jobs, dantes will execute them in this order: CRON Jobs -> Jobs were scheduled to be executed at the moment -> Jobs that unscheduled (immediate execution)

Internally, Dantes has a running loop, that searches for jobs every 500 ms, when there is space to accomodate one, and pushes it out to the worker. The worker must respond within 60 secomds, or the job is marked as timed-out. Again, all these numbers are configurable. Dantes is built to be very customisable.

Dantes is very very quick, with millisecond response times imminent. It uses an SQLite DB on-disk for super fast reads and writes on low system requirements, and fastify as the backend server. The main core logic is purely Typescript.

<p align="left">
  <img src="./assets/how-it-works.png" alt="Logo" width="800" />
</p>

## The dashboard

A dashboard (Vite + react-router) is your insight into the execution of all of your jobs, to view and manage how and why they may fail.



## Contributing

Dantes will be worked on and improved every now and then, and is very welcome to contributions.

Dantes has been built from the ground up, <b>WITHOUT ANY AI</b>, and will remain so for the forseeable future. All contributions must be made in light of that knowleedge.
AI is amazing tooling to move forward engineering, but this is a project built solely to scratch an internal itch of writing code for self-fulfillment and joy.

Thank you, and please star us ❤️ 🤗
