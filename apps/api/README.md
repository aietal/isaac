# isaac-backend

Python backend for Isaac

## setup instructions

## Prerequisites

Working knowledge of docker, python, and command line programming. If you do not have docker set up, download it [here](https://www.docker.com/get-started/).

### step 1: clone repo

```console
git clone https://github.com/aietal/isaac-backend
docker build -t isaac-backend .
docker run -p 8000:8000 isaac-backend
```

### step 2: build with docker

```console
docker-compose up
```

### step 4 (optional): Test to see that it is working

```
curl --request GET \
  --url http://localhost:8000/
```
