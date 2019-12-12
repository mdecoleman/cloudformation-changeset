const core = require("@actions/core");
const CloudFormation = require("aws-sdk/clients/cloudformation");
const { existsSync, readFileSync } = require("fs");
const uuidV4 = require("uuid/v4");

async function run() {
  try {
    const STACK_NAME = core.getInput("STACK_NAME");
    const TEMPLATE_FILE = core.getInput("TEMPLATE_FILE");
    const AWS_ACCESS_KEY_ID = core.getInput("AWS_ACCESS_KEY_ID");
    const AWS_SECRET_ACCESS_KEY = core.getInput("AWS_SECRET_ACCESS_KEY");
    const AWS_REGION = core.getInput("AWS_REGION");

    if (existsSync(TEMPLATE_FILE)) {
      const file = await readFileSync(TEMPLATE_FILE);

      const cfn = new CloudFormation({
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
        region: AWS_REGION
      });

      let params = {
        Capabilities: ["CAPABILITY_IAM"],
        ChangeSetType: "CREATE",
        ChangeSetName: `${STACK_NAME}-${uuidV4()}`,
        StackName: STACK_NAME,
        TemplateBody: file.toString()
      };

      const response = await cfn.createChangeSet(params).promise();

      core.info(`Changeset created: ${response.Id}`);
      core.setOutput("changeset_id", response.Id);
    } else {
      core.setFailed(`${TEMPLATE_FILE} not found`);
    }
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

module.exports = run;
