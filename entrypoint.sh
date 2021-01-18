#!/usr/bin/env bash

pid=0

# SIGTERM-handler
term_handler() {
  if [ $pid -ne 0 ]; then
    kill -SIGTERM "$pid"
    wait "$pid"
  fi
  exit 0;
  # exit 143; # 128 + 15 -- SIGTERM
}

# on SIGTERM or SIGINT kill the last background process and execute term_handler
trap 'kill ${!}; term_handler' SIGTERM
trap 'echo; kill ${!}; term_handler' SIGINT

# the redirection trick makes sure that $! is the pid
# of the "node build/index.js" process
node lib/main.js > >(./node_modules/.bin/pino-zen -i time,instance) &
pid="$!"

# wait forever
while true
do
  tail -f /dev/null &
  wait ${!}
done