const { existsSync, readFileSync } = require("fs");
const CloudFormation = require("aws-sdk/clients/cloudformation");
const uuidV4 = require("uuid/v4");

async function createChangeSet(inputs) {
  const {
    awsAccessKeyId,
    awsRegion,
    awsSecretAccessKey,
    parameters,
    stackName,
    templateFile
  } = inputs;

  if (existsSync(templateFile)) {
    const file = await readFileSync(templateFile);

    const cfn = new CloudFormation({
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
      region: awsRegion
    });

    let params = {
      Capabilities: ["CAPABILITY_IAM"],
      ChangeSetType: "CREATE",
      ChangeSetName: `${stackName}-${uuidV4()}`,
      StackName: stackName,
      TemplateBody: file.toString(),
      Parameters: []
    };

    if (parameters && parameters.trim() !== "") {
      const keyValues = parameters.split(",");

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
    throw new Error(`${templateFile} not found`);
  }
}

async function executeChangeSet(inputs) {
  const {
    awsAccessKeyId,
    awsRegion,
    awsSecretAccessKey,
    changeSetName,
    stackName
  } = inputs;

  const cfn = new CloudFormation({
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
    region: awsRegion
  });

  await cfn
    .executeChangeSet({ ChangeSetName: changeSetName, StackName: stackName })
    .promise();
}

async function deleteChangeSet(inputs) {
  const {
    awsAccessKeyId,
    awsRegion,
    awsSecretAccessKey,
    changeSetName,
    stackName
  } = inputs;

  const cfn = new CloudFormation({
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
    region: awsRegion
  });

  await cfn
    .deleteChangeSet({ ChangeSetName: changeSetName, StackName: stackName })
    .promise();
}

module.exports = {
  createChangeSet,
  deleteChangeSet,
  executeChangeSet
};
