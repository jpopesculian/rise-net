FROM ubuntu:18.04

ARG coin=rise
ENV HOME=/home/$coin
ARG USER_ID=1000
ARG GROUP_ID=1000

ARG NODE_VERSION=8.11.1
ARG NODE_URL=https://nodejs.org/download/release/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz

ARG PARALLEL_MAKE_JOBS=4

ARG POSTGRES_DIR=postgresql-10.4
ARG POSTGRES_URL=https://ftp.postgresql.org/pub/source/v10.4/$POSTGRES_DIR.tar.gz

ARG REDIS_DIR=redis-3.2.11
ARG REDIS_URL=http://download.redis.io/releases/$REDIS_DIR.tar.gz

ARG JQ_DIR=jq-1.5
ARG JQ_URL=https://github.com/stedolan/jq/releases/download/$JQ_DIR/$JQ_DIR.tar.gz

ARG LOGROTATE_VER=3.13.0
ARG LOGROTATE_DIR=logrotate-$LOGROTATE_VER
ARG LOGROTATE_URL=https://github.com/logrotate/logrotate/releases/download/$LOGROTATE_VER/logrotate-${LOGROTATE_VER}.tar.gz

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

RUN apt-get update

# Set locales

RUN apt-get install -y -qq locales && \
    locale-gen $LANG && \
    sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \
    dpkg-reconfigure --frontend=noninteractive locales && \
    update-locale LANG=$LANG

# Install prerequisites to build with

RUN apt-get install -y -qq \
        autoconf \
        automake \
        bison \
        build-essential \
        ca-certificates \
        chrpath \
        cron \
        curl \
        flex \
        git \
        libncurses5-dev \
        libonig-dev \
        libpopt-dev \
        libreadline6-dev \
        libsodium-dev \
        libssl-dev \
        libtool \
        python \
        sudo \
        zlib1g-dev

# Setup user

WORKDIR $HOME

RUN groupadd -r -g $GROUP_ID $coin &&\
    useradd --no-log-init -r -u $USER_ID -g $coin $coin && \
    chown $coin:$coin -R . && \
    usermod -aG sudo $coin && \
    echo "$coin ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/$coin

USER $coin
SHELL ["/bin/bash", "-c"]

# Make folder structure
RUN mkdir -p \
    out/bin out/lib \
    out/data/pg \
    out/data/redis \
    out/etc \
    out/logs \
    out/pids && \
    chmod 0700 out/data/pg

### BUILD NODE DEPS ###

RUN gpg --keyserver ha.pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4
RUN curl -o gosu -SL "https://github.com/tianon/gosu/releases/download/1.4/gosu-$(dpkg --print-architecture)" && \
    curl -o gosu.asc -SL "https://github.com/tianon/gosu/releases/download/1.4/gosu-$(dpkg --print-architecture).asc" && \
    gpg --verify gosu.asc && \
    rm gosu.asc && \
    sudo mv gosu /usr/local/bin/gosu && \
    sudo chmod +x /usr/local/bin/gosu

# Build PostGres
RUN curl -o postgres.tar.gz $POSTGRES_URL && \
    tar -zxf postgres.tar.gz && \
    rm postgres.tar.gz

RUN cd $POSTGRES_DIR && \
    ./configure --prefix=$HOME/postgres --with-libs=/usr/local/lib --with-includes=/usr/local/include && \
    make -j $PARALLEL_MAKE_JOBS && \
    make install && \
    cd contrib/pgcrypto && \
    make && make install

RUN cp -a postgres/lib out/ && \
    cp -a postgres/bin out/ && \
    cp -a postgres/share out/

# Build Redis
RUN curl -o redis.tar.gz $REDIS_URL && \
    tar -zxf redis.tar.gz && \
    rm redis.tar.gz && \
    mv $REDIS_DIR redis

RUN cd redis && \
    make -j $PARALLEL_MAKE_JOBS

RUN cp -a redis/src/redis-cli out/bin && \
    cp -a redis/src/redis-server out/bin

# # Build jq binary -> https://github.com/stedolan/jq/
RUN curl -o jq.tar.gz -J -L $JQ_URL && \
    tar -zxf jq.tar.gz && \
    rm jq.tar.gz && \
    mv $JQ_DIR jq

RUN cd jq && \
    ./configure  && \
    make -j $PARALLEL_MAKE_JOBS

RUN cp -a jq/jq out/bin

# Build nodejs
RUN curl -o node.tar.gz -J -L $NODE_URL && \
    tar -zxf node.tar.gz && \
    rm node.tar.gz && \
    mv node-v${NODE_VERSION}-linux-x64 node;

# Install npm libraries
RUN export PATH="$HOME/node/bin:$PATH" && node/bin/npm install -g \
    pm2 \
    typescript \
    lerna \
    chokidar-cli \
    yarn

RUN cp -a ./node/lib/node_modules ./out/lib && \
    cp -a ./node/bin/* ./out/bin

# Build logrotate
RUN curl -o logrotate.tar.gz -J -L $LOGROTATE_URL && \
    tar -zxf logrotate.tar.gz && \
    rm logrotate.tar.gz && \
    mv $LOGROTATE_DIR logrotate;

RUN cd logrotate && \
    autoreconf -fiv  && \
    ./configure --with-state-file-path='./data/logrotate.status' && \
    make

RUN cp -a logrotate/logrotate out/bin

# Set libs/bin environment

ENV PATH="$HOME/postgres/bin:$HOME/out/bin:$PATH"
ENV LD_LIBRARY_PATH="$HOME/postgres/lib:$HOME/out/lib:$LD_LIBRARY_PATH"

# Download Rise Node src

ARG RISE_DIR=core
ARG RISE_URL=https://github.com/RiseVision/rise-node.git
ARG VERSION=1.2.0

RUN git clone $RISE_URL $RISE_DIR
RUN cd $RISE_DIR && \
    git checkout tags/v$VERSION -b docker-versioned-$VERSION && \
    git log -1 --format="%h" | tee build

RUN cp -a core/ out/ && \
    mv out/core out/src && \
    rm -rf out/src/.git

# Build Rise Node

COPY ./bootstrap-node /usr/local/bin/bootstrap-node
RUN cd out/src && \
    rm -rf node_modules && \
    /usr/local/bin/bootstrap-node . && \
    npm run transpile && \
    npm prune  --production >> /dev/null

# Copy build assets

COPY ./build-assets/etc out/etc/
COPY ./build-assets/scripts out/scripts/

# Symlinks

RUN ln -s $HOME/out/scripts/manager.sh $HOME/out/manager.sh
RUN ln -s $HOME/out/data/pg/postmaster.pid $HOME/out/pids/pg.pid

# Install Rise Node

ARG NETWORK="mainnet"
RUN echo $NETWORK | tee out/etc/.network
RUN cd out && ./manager.sh

# Copy run script

COPY ./run-node /usr/local/bin/run-node
COPY ./entrypoint.sh ./entrypoint.sh

EXPOSE 5555

ENTRYPOINT ["./entrypoint.sh"]
CMD ["/usr/local/bin/run-node", "start"]
