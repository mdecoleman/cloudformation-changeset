const { existsSync, readFileSync } = require("fs");
const CloudFormation = require("aws-sdk/clients/cloudformation");
const core = require("@actions/core");
const uuidV4 = require("uuid/v4");

async function createChangeSet() {
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

    const { Id } = await cfn.createChangeSet(params).promise();

    return { id: Id, name: params.ChangeSetName };
  } else {
    throw new Error(`${TEMPLATE_FILE} not found`);
  }
}

async function executeChangeSet() {
  const STACK_NAME = core.getInput("stack_name");
  const CHANGESET_NAME = core.getInput("changeset_name");
  const AWS_ACCESS_KEY_ID = core.getInput("aws_access_key_id");
  const AWS_SECRET_ACCESS_KEY = core.getInput("aws_secret_access_key");
  const AWS_REGION = core.getInput("aws_region");

  const cfn = new CloudFormation({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION
  });

  await cfn
    .executeChangeSet({ ChangeSetName: CHANGESET_NAME, StackName: STACK_NAME })
    .promise();
}

async function deleteChangeSet() {
  const STACK_NAME = core.getInput("stack_name");
  const CHANGESET_NAME = core.getInput("changeset_name");
  const AWS_ACCESS_KEY_ID = core.getInput("aws_access_key_id");
  const AWS_SECRET_ACCESS_KEY = core.getInput("aws_secret_access_key");
  const AWS_REGION = core.getInput("aws_region");

  const cfn = new CloudFormation({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION
  });

  await cfn
    .deleteChangeSet({ ChangeSetName: CHANGESET_NAME, StackName: STACK_NAME })
    .promise();
}

module.exports = {
  createChangeSet,
  deleteChangeSet,
  executeChangeSet
};
