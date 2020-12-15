if [ $# -eq 0 ]; then
  if [ -n "$DEBUG" ]; then
    node --inspect-brk=0.0.0.0 src/index.js
  elif [ -n "$WATCH" ]; then
    node_modules/.bin/nodemon --inspect=0.0.0.0 -L src/index.js
  else
    exec node src/index.js
  fi
else
  exec "$@"
fi

exit $?