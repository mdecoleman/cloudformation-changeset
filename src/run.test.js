const run = require("./run");
const sinon = require("sinon");
const core = require("@actions/core");
const dotenv = require("dotenv");

describe("run", async function() {
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

  it("should fail when template file not found", async function() {
    stubSetInput("method", "create");
    stubSetInput("stack_name", STACK_NAME);
    stubSetInput("aws_access_key_id", process.env.AWS_ACCESS_KEY_ID);
    stubSetInput("aws_secret_access_key", process.env.AWS_SECRET_ACCESS_KEY);
    stubSetInput("aws_region", "eu-west-1");
    stubSetInput("template_file", "./some-file.yml");

    let spy = sandbox.spy(core, "setFailed");

    await run();

    should(spy.calledWithMatch("./some-file.yml not found")).be.true;
  });

  it("should set changeset_id output when succeeded", async function() {
    stubSetInput("method", "create");
    stubSetInput("stack_name", STACK_NAME);
    stubSetInput("aws_access_key_id", process.env.AWS_ACCESS_KEY_ID);
    stubSetInput("aws_secret_access_key", process.env.AWS_SECRET_ACCESS_KEY);
    stubSetInput("aws_region", "eu-west-1");
    stubSetInput("template_file", "./tests/template.yml");

    let spy = sandbox.spy(core, "setOutput");

    await run();

    should(spy.calledOnce).be.true;
  });
});
