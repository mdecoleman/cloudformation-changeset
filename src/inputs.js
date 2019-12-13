const core = require("@actions/core");

function getInputs() {
  return {
    method: core.getInput("method"),
    awsAccessKeyId: core.getInput("aws_access_key_id"),
    awsRegion: core.getInput("aws_region"),
    awsSecretAccessKey: core.getInput("aws_secret_access_key"),
    changeSetName: core.getInput("changeset_name"),
    parameters: core.getInput("parameters"),
    stackName: core.getInput("stack_name"),
    templateFile: core.getInput("template_file")
  };
}

module.exports = {
  getInputs
};
