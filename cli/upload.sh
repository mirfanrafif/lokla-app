# variables
host=${ENDPOINT:-https://lokla.mirfanrafif.my.id}
project=${PROJECT_ID:-$1}
apiKey=${API_KEY:-$2}
directory=${DIRECTORY:-$3}
mainBranch=${MAIN_BRANCH:-$4}

# pull target branch
git fetch origin $mainBranch

# get file changed compared to branch develop in origin
filesChanged=$(git diff --name-only origin/$mainBranch)

# get all locales
locales=($(ls -d $directory/* | xargs -n 1 basename))

for locale in "${locales[@]}"; do
  for file in "${directory}/${locale}"/*; do
    # check if file changed and not force upload
    if [[ ! $filesChanged =~ $file ]] && [[ $1 != '-f' ]]; then
      continue
    fi

    namespace=$(basename "$file" .json)
    data=$(cat "$file")
    echo "Uploading ${locale}/${namespace} to ${host}..."
    curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Api-Key ${apiKey}" -d "{\"data\": $data}" "${host}/translations/import/ci?project=${project}&namespace=${namespace}&locale=${locale}"
  done
done
