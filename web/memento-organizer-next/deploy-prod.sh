git fetch 
git checkout main
git pull origin main

#remenber to declare those variables in your enviroment
vercel --cwd ./ --name "$mementoOrganizerProductionName" --env mementoOrganizerApiUrl=$mementoOrganizerApiUrl --prod --yes
