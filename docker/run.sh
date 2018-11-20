#!/bin/bash

do_help() {
    echo "Help for RISE Node Container:"
    echo -e "\tstart                    | alias for 'manager start all'"
    echo -e "\tmanager [command] <args> | access manager.sh"
}

start_all() {
    ./manager.sh start all
    tail -f logs/*
}

cd out
rm data/pg/postmaster.pid 2> /dev/null
sudo chown $(whoami):$(whoami) etc

case $1 in
    "start")
        start_all
        ;;
    "dev")
        cd src
        npm install --no-package-lock
        cd ../
        start_all
        ;;
    "manager")
        ./manager.sh "${@:2}"
        ;;
    *)
        do_help
        ;;
esac
