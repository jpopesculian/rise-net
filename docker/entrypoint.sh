#!/bin/bash

rm out/data/pg/postmaster.pid 2> /dev/null

if [ -n "$LOCAL_USER_ID" ]; then
    USER_ID="$LOCAL_USER_ID"

    if [ -z "$LOCAL_GROUP_ID" ]; then
        GROUP_ID=$USER_ID
    else
        GROUP_ID="$LOCAL_GROUP_ID"
    fi

    if [ "$USER_ID" -ne "$(id -u rise)" ]; then
        echo "Starting with user : $USER_ID"
        echo "This may take a while to set permissions"
        echo "Consider building image with USER_ID arg set to host user id"

        sudo groupadd -r -g $GROUP_ID user
        sudo useradd --no-log-init -r -u $USER_ID -g user user
        sudo usermod -aG sudo user
        sudo usermod -aG root user
        sudo usermod -aG rise user
        echo "user ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/user

        chown user:user -R .

        sudo /usr/local/bin/gosu user "$@"
        exit 0
    fi
fi

exec "$@"


