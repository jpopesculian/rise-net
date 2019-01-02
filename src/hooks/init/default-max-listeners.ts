import { Hook } from "@oclif/config";
import { EventEmitter } from "events";

const hook: Hook<"init"> = async function() {
  EventEmitter.defaultMaxListeners = 0;
};

export default hook;
