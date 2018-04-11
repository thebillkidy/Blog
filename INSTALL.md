1. Adapt the `_config.yml` file
2. Adapt the `.travis.yml` file 
    * Get a Github secret at https://github.com/settings/tokens
      * Rights required: `user:email, read:org, repo_deployment, repo:status, public_repo, write:repo_hook`
    * Create a secret with: `travis encrypt 'GIT_NAME="YOUR_USERNAME" GIT_EMAIL="YOUR_EMAIL" GH_TOKEN="YOUR_TOKEN"' -r <gh_user>/<gh_repo>`
    * More info: https://docs.travis-ci.com/user/encryption-keys/
3. After first build: go to your repo --> settings --> set branch to gh-pages

## Custom Domain
Set A records to:

* 192.30.252.153
* 192.30.252.154