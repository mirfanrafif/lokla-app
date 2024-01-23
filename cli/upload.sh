# upload each file in the selected directory to the server

host='http://localhost:3001/api'
project='pms'
locales=('en' 'jp')
directory='src/core/resources/locales'

# get file changed compared to branch develop
filesChanged=$(git diff --name-only develop)

for locale in "${locales[@]}"; do
  for file in "${directory}/${locale}"/*; do
    # check if file changed
    # if [[ ! $filesChanged =~ $file ]]; then
    #   continue
    # fi

    namespace=$(basename "$file" .json)
    data=$(cat "$file")
    curl -s -X POST -H "Content-Type: application/json" -d "{\"data\": $data}" "${host}/translations/import/ci?project=${project}&namespace=${namespace}&locale=${locale}"
  done
done
