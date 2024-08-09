FROM golang:1.18-rc AS build

LABEL os=linux
LABEL arch=amd64

ENV GOOS=linux
ENV GOARCH=amd64
ENV CGO_ENABLED=1

RUN apt update \
    && apt install -f -o Dpkg::Options::="--force-overwrite" -y --no-install-recommends \
        pkg-config \
        libwebkit2gtk-4.0-dev \
        libgtk-3-dev \
        upx \
        nodejs \
        npm \
    && rm -rf /var/lib/apt/lists/*

RUN go install github.com/wailsapp/wails/v2/cmd/wails@latest

WORKDIR /dev

COPY . /dev/
COPY frontend/package.json frontend/package-lock.json /dev/frontend/

RUN cd frontend && npm install --force

RUN wails build

FROM alpine:latest AS final

RUN apk --no-cache add ca-certificates libgtk-3 libwebkit2gtk-4.0 upx

COPY --from=build /dev/build /app

WORKDIR /app

ENTRYPOINT ["/app/To Do List"]
