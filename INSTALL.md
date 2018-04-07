1. Create a branch `gh-pages` through `git checkout -b gh-pages; git push origin gh-pages; git checkout master`
2. Adapt the `_config.yml` file
3. Adapt the `.travis.yml` file 
    * Get a Github secret at https://github.com/settings/tokens
      * Rights required: `user:email, read:org, repo_deployment, repo:status, public_repo, write:repo_hook`
    * Create a secret with: `travis encrypt 'GIT_NAME="YOUR_USERNAME" GIT_EMAIL="YOUR_EMAIL" GH_TOKEN="YOUR_TOKEN"' -r <gh_user>/<gh_repo>`
    * More info: https://docs.travis-ci.com/user/encryption-keys/

  