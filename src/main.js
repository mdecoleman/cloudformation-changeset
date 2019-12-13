const core = require("@actions/core");
const {
  createChangeSet,
  deleteChangeSet,
  executeChangeSet
} = require("./changeSetActions");

async function run() {
  try {
    const METHOD = core.getInput("method");

    switch (METHOD) {
      case "create":
        const { id, name } = await createChangeSet();

        core.setOutput("changeset_id", id);
        core.setOutput("changeset_name", name);
        break;
      case "delete":
        await deleteChangeSet();
        break;
      case "execute":
        await executeChangeSet();
        break;
      default:
        core.setFailed(`method ${METHOD} not supported`);
    }
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();
