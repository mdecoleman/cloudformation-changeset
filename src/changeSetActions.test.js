const {
  createChangeSet,
  deleteChangeSet,
  executeChangeSet
} = require("./changeSetActions");
const core = require("@actions/core");
const dotenv = require("dotenv");
const sinon = require("sinon");

describe("changeSetActions", function() {
  dotenv.config();
  const STACK_NAME = "cfn-deploy-changeset-action-test-stack";

  let sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  describe("create", function() {
    it("should return changeset id and name", async function() {
      const inputs = {
        awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
        awsRegion: "eu-west-1",
        awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        stackName: STACK_NAME,
        templateFile: "./tests/template.yml"
      };

      const response = await createChangeSet(inputs);

      should(response.id).not.be.null;
      should(response.name).not.be.null;
    });
  });

  describe("execute", function() {
    it("should execute change set", async function() {
      const inputs = {
        awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
        awsRegion: "eu-west-1",
        awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        stackName: STACK_NAME,
        changeSetName:
          "cfn-deploy-changeset-action-test-stack-cf55040b-7cd0-40be-9fad-2a295463e6d5"
      };

      await executeChangeSet(inputs);
    });
  });

  describe("delete", function() {
    it("should delete change set", async function() {
      const inputs = {
        awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
        awsRegion: "eu-west-1",
        awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        stackName: STACK_NAME,
        changeSetName:
          "cfn-deploy-changeset-action-test-stack-cf55040b-7cd0-40be-9fad-2a295463e6d5"
      };

      await deleteChangeSet(inputs);
    });
  });
});
