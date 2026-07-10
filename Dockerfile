FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine AS fixture-generator

WORKDIR /generator
COPY tools/fixture-generator/ .

RUN --mount=type=secret,id=DEFRA_NUGET_PAT \
  DEFRA_NUGET_PAT="$(cat /run/secrets/DEFRA_NUGET_PAT)" \
  dotnet restore

RUN dotnet run --configuration Release --no-restore -- /output 5000

# Stage 2: k6 test runner
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
COPY --from=fixture-generator /output/ ./src/data/

RUN npm ci
RUN npm run format:check
RUN npm run lint

ENTRYPOINT [ "./scripts/entrypoint.sh" ]
