const { createChangeSet, deleteChangeSet } = require("./changeSetActions");
const core = require("@actions/core");
const dotenv = require("dotenv");
const sinon = require("sinon");

describe("changeSetActions", function() {
  dotenv.config();
  const STACK_NAME = "cfn-deploy-changeset-action-test-stack";

  let sandbox = sinon.createSandbox();
  let getInputStub;

  const stubSetInput = (key, value) => {
    getInputStub.withArgs(key).returns(value);
  };

  beforeEach(function() {
    getInputStub = sandbox.stub(core, "getInput");
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("create", function() {
    it("should return changeset id and name", async function() {
      stubSetInput("stack_name", STACK_NAME);
      stubSetInput("aws_access_key_id", process.env.AWS_ACCESS_KEY_ID);
      stubSetInput("aws_secret_access_key", process.env.AWS_SECRET_ACCESS_KEY);
      stubSetInput("aws_region", "eu-west-1");
      stubSetInput("template_file", "./tests/template.yml");

      const response = await createChangeSet();

      should(response.id).not.be.null;
      should(response.name).not.be.null;
    });
  });

  describe("delete", function() {
    it("should delete change set", async function() {
      stubSetInput("stack_name", STACK_NAME);
      stubSetInput("aws_access_key_id", process.env.AWS_ACCESS_KEY_ID);
      stubSetInput("aws_secret_access_key", process.env.AWS_SECRET_ACCESS_KEY);
      stubSetInput("aws_region", "eu-west-1");
      stubSetInput("changeset_name", "cfn-deploy-changeset-action-test-stack-cf55040b-7cd0-40be-9fad-2a295463e6d5");

      await deleteChangeSet();
    });
  });
});
