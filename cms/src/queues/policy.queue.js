const { Queue } =
require("bullmq");

const connection =
require("../lib/redis");

const policyQueue =
new Queue(
  "policy-processing",
  {
    connection,
  }
);

module.exports =
policyQueue;