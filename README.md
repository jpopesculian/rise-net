rise-net
========



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/rise-net.svg)](https://npmjs.org/package/rise-net)
[![Downloads/week](https://img.shields.io/npm/dw/rise-net.svg)](https://npmjs.org/package/rise-net)
[![License](https://img.shields.io/npm/l/rise-net.svg)](https://github.com/jpopesculian/rise-net/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g rise-net
$ rise-net COMMAND
running command...
$ rise-net (-v|--version|version)
rise-net/0.0.0 linux-x64 node-v10.13.0
$ rise-net --help [COMMAND]
USAGE
  $ rise-net COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`rise-net hello [FILE]`](#rise-net-hello-file)
* [`rise-net help [COMMAND]`](#rise-net-help-command)
* [`rise-net node [FILE]`](#rise-net-node-file)
* [`rise-net node:start [FILE]`](#rise-net-nodestart-file)

## `rise-net hello [FILE]`

describe the command here

```
USAGE
  $ rise-net hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ rise-net hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/jpopesculian/rise-net/blob/v0.0.0/src/commands/hello.ts)_

## `rise-net help [COMMAND]`

display help for rise-net

```
USAGE
  $ rise-net help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.4/src/commands/help.ts)_

## `rise-net node [FILE]`

describe the command here

```
USAGE
  $ rise-net node [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ rise-net node start
```

_See code: [src/commands/node.ts](https://github.com/jpopesculian/rise-net/blob/v0.0.0/src/commands/node.ts)_

## `rise-net node:start [FILE]`

describe the command here

```
USAGE
  $ rise-net node:start [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/node/start.ts](https://github.com/jpopesculian/rise-net/blob/v0.0.0/src/commands/node/start.ts)_
<!-- commandsstop -->
