const core = require("@actions/core");
const { getInputs } = require("./inputs");

const {
  createChangeSet,
  deleteChangeSet,
  executeChangeSet
} = require("./changeSetActions");

async function run() {
  try {
    const inputs = getInputs();

    switch (inputs.METHOD) {
      case "create":
        const { id, name } = await createChangeSet(inputs);

        core.setOutput("changeset_id", id);
        core.setOutput("changeset_name", name);
        break;
      case "delete":
        await deleteChangeSet(inputs);

        break;
      case "execute":
        await executeChangeSet(inputs);

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
