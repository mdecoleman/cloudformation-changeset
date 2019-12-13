# CloudFormation Change Set

GitHub Action that creates, updates, deletes and applies CloudFormation change sets.

# Methods

Currently only `CREATE` change set is implemented

# Usage

```yaml
- uses: mdecoleman/cloudformation-changeset@v1
  id: cfn
  with:
    METHOD: CREATE
    STACK_NAME: "some-stack-name"
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    AWS_REGION: "eu-west-1"
    TEMPLATE_FILE: "./path/to/template.yml"
- run: echo ${{ steps.cfn.outputs.changeset_id }}
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
