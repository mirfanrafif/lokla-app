# Lokla App

![App Logo](./assets/app_logo.png)

Since translation app is mostly not compatible with namespaces (i18next), and also pricing is also needs to be considered,
We made this app to solve it's problem. With this app, you are able to translate with ease.

## Features

These are our key point developing this project

### Open Source

Everyone can contribute to this repository to provide their needs

### Self-Hosted

If you don't want to add additional cost to host the translation, we configure this app so it can be self-hosted with ease.
You only need to run it with docker (using docker compose for easier deployment)

### Github Actions

We add the github action to the marketplace, so no need to hardly configure your github actions. Only need to call our github actions and fill some parameters, you are ready to go.

## Installations

## Github Action

To upload the translation to Lokla, Add this to your Github Actions:

```yaml
- uses: mirfanrafif/lokla-app@0.0.12
  with:
    project-id: dbk
    endpoint: ${{ secrets.lokla_endpoint }}
    api-key:  ${{ secrets.lokla_api_key }}
    main-branch: ${{ github.base_ref }}
    directory: src/core/resources/locales
```

## Download Translation

To update your local translation, fetch the translation from API

```sh
#!/bin/bash

host=''
project=''
directory=''
apiKey=''

# get all locales
locales=($(ls -d $directory/* | xargs -n 1 basename))

for locale in "${locales[@]}"; do
  for file in "${directory}/${locale}"/*; do
    namespace=$(basename "${file}" .json)
    data=$(curl -s -H "Authorization: Api-Key ${apiKey}" "${host}/api/translations/export?project=${project}&namespace=${namespace}&locale=${locale}")
    echo "${data}" >"${file}"
  done
done

```

### Self Hosted

To deploy the app and API service, we provided `docker-compose.yaml`. Don't forget to setup `.env` as we provided the `.env.example`
