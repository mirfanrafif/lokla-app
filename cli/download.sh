#!/bin/bash

host='http://localhost:3001/api'
project='pms'
locales=('en' 'jp')
directory='src/core/resources/locales'

for locale in "${locales[@]}"; do
  for file in "${directory}/${locale}"/*; do
    namespace=$(basename "${file}" .json)
    data=$(curl -s "${host}/translations/export?project=${project}&namespace=${namespace}&locale=${locale}")
    echo "${data}" >"${file}"
  done
done
