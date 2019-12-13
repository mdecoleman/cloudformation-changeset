# CloudFormation Change Set

GitHub Action that creates, updates, deletes and applies CloudFormation change sets.

# Methods

Currently only `create` change set is implemented

# Usage

```yaml
- uses: mdecoleman/cloudformation-changeset@v1
  with:
    method: create
    stack_name: "some-stack"
    template_file: "./path/to/template.yml"
    aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws_region: "eu-west-1"
```

For documentation of available inputs and outputs see [action.yml](action.yml)

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
