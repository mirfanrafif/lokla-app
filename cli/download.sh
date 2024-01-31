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
