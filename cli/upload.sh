# variables
host=${ENDPOINT:-https://lokla.mirfanrafif.my.id}
project=${PROJECT_ID:-$1}
API_KEY=${API_KEY:-$2}
directory=${DIRECTORY:-$3}
PROJECT_ID=${PROJECT_ID:-$4}

# get file changed compared to branch develop
filesChanged=$(git diff --name-only $PROJECT_ID)

for locale in "${locales[@]}"; do
  for file in "${directory}/${locale}"/*; do
    # check if file changed and not force upload
    if [[ ! $filesChanged =~ $file ]] && [[ $1 != '-f' ]]; then
      continue
    fi

    namespace=$(basename "$file" .json)
    data=$(cat "$file")
    curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Api-Key ${API_KEY}" -d "{\"data\": $data}" "${host}/translations/import/ci?project=${project}&namespace=${namespace}&locale=${locale}"
  done
done
