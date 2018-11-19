#!/bin/bash

cd out
rm data/pg/postmaster.pid 2> /dev/null
sudo chown $(whoami):$(whoami) etc

do_help() {
    echo "Help for RISE Node Container:"
    echo -e "\tstart                    | alias for 'manager start all'"
    echo -e "\tmanager [command] <args> | access manager.sh"
}

start_all() {
    ./manager.sh start all
    tail -f logs/*
}

stop_all() {
    ./manager.sh stop all
}

case $1 in
    "start")
        start_all
        trap stop_all EXIT
        ;;
    "manager")
        ./manager.sh "${@:1}"
        ;;
    *)
        do_help
        ;;
esac
