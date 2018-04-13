require 'rake'
require 'tmpdir'

REPO_SLUG = ENV['TRAVIS_REPO_SLUG']
TARGET_BRANCH = "master" # We push the build site to master on a user website
COMMIT_MSG = "Travis-CI: Updated site via #{ENV['TRAVIS_COMMIT']}"
ORIGIN = "https://$GIT_NAME:$GH_TOKEN@github.com/#{REPO_SLUG}.git".freeze

namespace :site do
  desc "Generate the site and push changes to remote origin"
  task :deploy do
    # Detect pull request
    if ENV['TRAVIS_PULL_REQUEST'].to_s.to_i > 0
      puts 'Pull request detected. Not proceeding with deploy.'
      exit
    end

    # Configure git if this is run in Travis CI
    if ENV["TRAVIS"]
      sh "git config --global user.name $GIT_NAME"
      sh "git config --global user.email $GIT_EMAIL"
      sh "git config --global push.default simple"
    end

    # Build everything
    sh "bundle exec jekyll build"

    Dir.mktmpdir do |tmp|
      cp_r 'build/.', tmp
      cp_r 'demos/.', tmp # Copy our demos over

      cd tmp do
        # Init a new repo in the build folder, this one we will push to the TARGET_BRANCH
        sh "git init"
        sh "git remote add origin #{ORIGIN}"

        # Push the changes
        sh "git add ."
        sh "git commit -m '#{COMMIT_MSG}'"
        sh "git push origin master:refs/heads/#{TARGET_BRANCH} --force"

        puts "Pushed updated branch #{TARGET_BRANCH} to GitHub Pages"
      end
    end
  end
end