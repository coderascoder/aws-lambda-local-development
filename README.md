# aws-lambda-local-development
Develop AWS Lambda locally with Docker and LocalStack

## Don't need to install any runtime
You don't need to install Node/NPM on your local drive, it's good if you need to change computer or OS

## Prerequisition
 - Docker
 - AWS SAM CLI (For running serverless application like Lambda locally)
 - LocalStack Image (For emulate AWS services (e.g. S3) locally in a container)

## All code is Typescript
All code is written in TypeScript

## Commands
 - make install: install npm packages
 - make startlocalstack: start localstack container to have a local AWS services enviroment
 - make build: build typescript files in src and output to dist
 - sam local invoke "HelloNameFunction" -e events/event.json: call lambda function

## Get Started
1. Install Docker, AWS SAM CLI (use below command to check if it installed successfully)
```
$ docker --verion
$ sam --version
```

2. Start LocalStack container
```
$ make startlocalstack
```
(Access http://localhost:4566/health in browser to check if it start successfully)

3. Install Packages 
 ```
 $ make install
 ```
 (a node_modules folder will be created)


4. Build TypeScript files
 ```
 $ make build
 ```
 (a dist folder will be created with generated .mjs files inside)

5. Call lambda function
```
$ sam local invoke "HelloNameFunction" -e events/event.json
```