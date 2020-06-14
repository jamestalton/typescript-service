#!/usr/bin/env bash

set -e

function usage {
    echo
    echo "  NPM Dependency Updater"
    echo
    echo "    Required Environment Variables"
    echo
    echo "        GITHUB_TOKEN: Github access token with scope: repo"
    echo "          GITHUB_ORG: Github org or username"
    echo
    echo "    Optional Environment Variables"
    echo
    echo "            GIT_USER: Git user name for git operations"
    echo "           GIT_EMAIL: Git user email for git operations"
    echo "         GITHUB_HOST: Defaults to github.com"
    echo "            GIT_REPO: Defaults to project name in package.json"
    echo "          GIT_BRANCH: Defaults to master branch"
    echo "      UPDATE_COMMAND: Defaults to updating dependencies and running tests"
    echo "           CREATE_PR: If set to true, will create a PR for the update"
    echo
}

if  [ -z "$GITHUB_TOKEN" ] ; then
    usage
    echo "  Environment variable GITHUB_TOKEN is required"
    echo
    exit 1
fi

if [ -z "$GITHUB_HOST" ]; then
    GITHUB_HOST="github.com"
fi

if [ -z "$GITHUB_ORG" ]; then
    usage
    echo "  Environment variable GITHUB_ORG is required"
    echo
    exit 1
fi

if [ -z "$GIT_REPO" ]; then
    GIT_REPO=`cat package.json | jq .name | tr -d '"'`
fi

if [ -z "$GIT_USER" ]; then
    GIT_USER="npm dependency updater"
fi

if [ -z "$GIT_EMAIL" ]; then
    GIT_EMAIL="npm.dependency.updater@example.com"
fi

if [ -z "$GIT_BRANCH" ]; then
    GIT_BRANCH="master"
fi

if [ -z "$UPDATE_COMMAND" ]; then
    UPDATE_COMMAND="rm -rf package-lock.json node_modules && npx npm-check-updates -u && npm install && npm audit fix && npm test"
fi

git config user.name "$GIT_USER"
git config user.email "$GIT_EMAIL"

git remote remove origin
git remote add origin https://$GITHUB_TOKEN@$GITHUB_HOST/$GITHUB_ORG/$GIT_REPO.git > /dev/null 2>&1
git fetch
git pull origin $GIT_BRANCH

if [ "$CREATE_PR" = "true" ]; then
    if [ -z "$(which hub)" ]; then
        echo "  hub must be installed. See: https://github.com/github/hub"
        echo
        exit 1
    fi

    echo "Hub CLI version: " `$(hub version)`
    EXISTING_PR=`hub pr list --head $GIT_BRANCH-dependency-updates`
    if [ ! -z "$EXISTING_PR" ]; then
        git branch -D "$GIT_BRANCH-dependency-updates"
    fi
    git checkout -b "$GIT_BRANCH-dependency-updates"
else
    git checkout $GIT_BRANCH
fi

echo "Updating dependencies"
eval $UPDATE_COMMAND

if git diff --name-only | grep 'package.json\|package-lock.json'; then
    echo "Dependencies updated"
else
    echo "No dependency updates available"
    exit 0
fi

git add -u :/
git commit -m "fix(deps): update dependencies"

if [ "$CREATE_PR" = "true" ]; then
    echo "Pushing branch: $GIT_BRANCH-dependency-updates"
    git push origin "$GIT_BRANCH-dependency-updates"
    if [ -z "$EXISTING_PR" ]; then
        echo "Creating pull request: $GIT_BRANCH-dependency-updates"
        hub pull-request -b "$GIT_BRANCH-dependency-updates" -h "$GIT_BRANCH-dependency-updates" -m "Dependency updates"
    fi
else
    echo "Pushing branch: $GIT_BRANCH"
    git push origin $GIT_BRANCH
fi