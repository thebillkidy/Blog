#############################################################################
#
# Modified version of jekyllrb Rakefile
# https://github.com/jekyll/jekyll/blob/master/Rakefile
#
#############################################################################

require 'rake'
require 'date'
require 'yaml'

CONFIG = YAML.load(File.read('_config.yml'))
USERNAME = CONFIG["username"]
REPO = CONFIG["repo"]
SOURCE_BRANCH = CONFIG["branch"]
DESTINATION_BRANCH = "gh-pages"
REMOTE_NAME = "origin"
PROJECT_ROOT = ENV.fetch("PROJECT_ROOT", `git rev-parse --show-toplevel`.chomp)
BUILD_DIR = File.join(PROJECT_ROOT, "build")

def check_destination
  unless Dir.exist? CONFIG["destination"]
    sh "git clone https://$GIT_NAME:$GH_TOKEN@github.com/#{USERNAME}/#{REPO}.git #{CONFIG["destination"]}"
  end
end

namespace :site do
  desc "Generate the site"
  task :build do
    check_destination
    sh "bundle exec jekyll build"
  end

  desc "Generate the site and serve locally"
  task :serve do
    check_destination
    sh "bundle exec jekyll serve"
  end

  desc "Generate the site, serve locally and watch for changes"
  task :watch do
    sh "bundle exec jekyll serve --watch"
  end

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

    # Make sure destination folder exists as git repo
    check_destination

    # Create the build dir
    sh "mkdir #{BUILD_DIR}"

    # Get repo url
    repo_url = nil
    cd PROJECT_ROOT do
      repo_url = `git config --get remote.#{REMOTE_NAME}.url`.chomp
    end

    # Set up the gh-pages branch
    cd BUILD_DIR do
      sh "git init"
      sh "git remote add #{REMOTE_NAME} #{repo_url}"
      sh "git fetch --depth 1 #{REMOTE_NAME}"
  
      if `git branch -r` =~ /#{DESTINATION_BRANCH}/
        sh "git checkout #{DESTINATION_BRANCH}"
      else
        sh "git checkout --orphan #{DESTINATION_BRANCH}"
        FileUtils.touch("index.html")
        sh "git add ."
        sh "git commit -m \"initial gh-pages commit\""
        sh "git push #{REMOTE_NAME} #{DESTINATION_BRANCH}"
      end
    end

    Dir.chdir(CONFIG["destination"]) { sh "git checkout #{DESTINATION_BRANCH}" }

    # Generate the site
    sh "bundle exec jekyll build"

    # Commit and push to github
    sha = `git log`.match(/[a-z0-9]{40}/)[0]
    Dir.chdir(CONFIG["destination"]) do
      # check if there is anything to add and commit, and pushes it
      sh "if [ -n '$(git status)' ]; then
            git add --all .;
            git commit -m 'Updating to #{USERNAME}/#{REPO}@#{sha}.';
            git push --quiet origin #{DESTINATION_BRANCH};
         fi"
      puts "Pushed updated branch #{DESTINATION_BRANCH} to GitHub Pages"
    end
  end
end