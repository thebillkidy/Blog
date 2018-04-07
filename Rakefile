require 'rake'
require 'tmpdir'

REPO_SLUG = ENV['TRAVIS_REPO_SLUG']
TARGET_BRANCH = "gh-pages"
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

    Dir.mktmpdir do |tmp|
      cp_r './', tmp

      cd tmp do
        sh "git init"
        sh "git remote set-url origin #{ORIGIN}"
        #sh "git remote add origin #{ORIGIN}"
        sh "git fetch --depth 1 origin"

        # Set up our gh-pages branch
        if `git branch -r` =~ /#{TARGET_BRANCH}/
          sh "git checkout #{TARGET_BRANCH}"
        else
          sh "git checkout -b #{TARGET_BRANCH}"
        end

        # Build everything
        sh "bundle exec jekyll build"

        # Push the changes
        sh "git add ."
        sh "git commit -m '#{COMMIT_MSG}'"
        sh "git push origin #{TARGET_BRANCH}"

        puts "Pushed updated branch #{DESTINATION_BRANCH} to GitHub Pages"
      end
    end
  end
end