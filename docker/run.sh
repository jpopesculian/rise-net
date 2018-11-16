#!/bin/bash

cd out
rm data/pg/postmaster.pid 2> /dev/null

do_help() {
    echo "Help for RISE Node Container:"
    echo -e "\tstart                    | alias for 'manager start all'"
    echo -e "\tmanager [command] <args> | access manager.sh"
}

case $1 in
    "start")
        ./manager.sh start all
        tail -f logs/*
        ;;
    "manager")
        ./manager.sh "${@:1}"
        ;;
    *)
        do_help
        ;;
esac
