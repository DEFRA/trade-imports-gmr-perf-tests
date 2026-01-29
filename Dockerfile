FROM grafana/k6:1.5.0

ENV TZ="Europe/London"

USER root

RUN apk add --no-cache \
  aws-cli \
  curl \
  nodejs \
  npm

USER k6

WORKDIR /k6

COPY . .

RUN npm ci

ENTRYPOINT [ "./scripts/entrypoint.sh" ]
