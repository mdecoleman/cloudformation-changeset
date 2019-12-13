# CloudFormation Change Set

GitHub Action that creates, deletes and executes CloudFormation change sets.

# Usage

## Create

```yaml
- uses: mdecoleman/cloudformation-changeset@v1
  with:
    method: create
    stack_name: "some-stack"
    template_file: "./path/to/template.yml"
    aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws_region: "eu-west-1"
    parameters: Runtime=nodejs8.10,Role=arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

## Delete

```yaml
- uses: mdecoleman/cloudformation-changeset@v1
  with:
    method: delete
    stack_name: "some-stack"
    changeset_name: "some-changeset-name"
    aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws_region: "eu-west-1"
```

## Execute

```yaml
- uses: mdecoleman/cloudformation-changeset@v1
  with:
    method: execute
    stack_name: "some-stack"
    changeset_name: "some-changeset-name"
    aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws_region: "eu-west-1"
```

For documentation of available inputs and outputs see [action.yml](action.yml)

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
