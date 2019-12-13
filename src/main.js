const core = require("@actions/core");
const { createChangeSet, deleteChangeSet } = require("./changeSetActions");

async function run() {
  try {
    const METHOD = core.getInput("method");

    switch (METHOD) {
      case "create":
        const { id, name } = createChangeSet();

        core.setOutput("changeset_id", id);
        core.setOutput("changeset_name", name);
        break;
      case "delete":
        deleteChangeSet();
      default:
        core.setFailed(`method ${METHOD} not supported`);
    }
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();
