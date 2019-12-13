const core = require("@actions/core");
const CloudFormation = require("aws-sdk/clients/cloudformation");
const { existsSync, readFileSync } = require("fs");
const uuidV4 = require("uuid/v4");

async function create() {
  const STACK_NAME = core.getInput("stack_name");
  const TEMPLATE_FILE = core.getInput("template_file");
  const AWS_ACCESS_KEY_ID = core.getInput("aws_access_key_id");
  const AWS_SECRET_ACCESS_KEY = core.getInput("aws_secret_access_key");
  const AWS_REGION = core.getInput("aws_region");
  const PARAMETERS = core.getInput("parameters");

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
      TemplateBody: file.toString(),
      Parameters: []
    };

    if (PARAMETERS && PARAMETERS.trim() !== "") {
      const keyValues = PARAMETERS.split(",");

      keyValues.forEach(kv => {
        const values = kv.split("=");
        params.Parameters.push({
          ParameterKey: values[0],
          ParameterValue: values[1]
        });
      });
    }

    const response = await cfn.createChangeSet(params).promise();

    core.setOutput("changeset_id", response.Id);
  } else {
    core.setFailed(`${TEMPLATE_FILE} not found`);
  }
}

async function run() {
  try {
    const METHOD = core.getInput("method");

    switch (METHOD) {
      case "create":
        create();
        break;
      default:
        core.setFailed(`method ${METHOD} not supported`);
    }
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

module.exports = run;
