---
title: "AWS CloudFormation — Complete Guide for AWS Solutions Architect Associate"
date: "2025-04-10"
excerpt: "A complete guide to AWS CloudFormation covering templates, stacks, change sets, drift detection, and best practices for infrastructure as code."
tags: ["AWS", "CloudFormation", "IaC", "DevOps", "Architecture"]
---

# <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" width="40" align="center"/> AWS CloudFormation — Complete Guide for AWS Solutions Architect Associate

> **AWS CloudFormation** is AWS's Infrastructure as Code (IaC) service that lets you model, provision, and manage AWS and third-party resources by treating infrastructure as code — declaratively, repeatably, and safely.

---

## 📐 Architecture & Infrastructure

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/Physical-and-Logical-Resources-1.png" width="750"/>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/Physical-and-Logical-Resources-2.png" width="750"/>
</p>

### How CloudFormation Works — The Big Picture

```
Developer writes Template (JSON/YAML)
          │
          ▼
   CloudFormation Service
          │
    ┌─────┴──────┐
    │  Template   │  ← Parsed, validated, dependency-resolved
    │  Engine     │
    └─────┬──────┘
          │
    ┌─────▼──────────────────────────────────┐
    │              Stack                      │
    │  (Logical grouping of AWS resources)    │
    └─────┬──────────────────────────────────┘
          │
    ┌─────▼──────────────────────────────────┐
    │         Provisioned Resources           │
    │  EC2 | S3 | RDS | VPC | IAM | Lambda   │
    └────────────────────────────────────────┘
```

CloudFormation reads your template, builds a dependency graph, and provisions resources in the correct order — automatically handling creation, updates, and deletion as a single atomic unit.

### Core Concepts

| Concept | Description |
|---|---|
| **Template** | JSON or YAML file describing the desired infrastructure state. |
| **Stack** | A deployed instance of a template. All resources in a stack are managed together. |
| **Change Set** | A preview of proposed changes before applying an update to a stack. |
| **Stack Set** | Deploy stacks across multiple AWS accounts and regions from a single operation. |
| **Drift** | When a resource's actual configuration differs from what CloudFormation expects. |
| **Nested Stack** | A stack created as a resource within another (parent) stack. |

---

## 🧱 Template Anatomy

A CloudFormation template has up to 10 sections. Only `Resources` is mandatory.

```yaml
AWSTemplateFormatVersion: "2010-09-09"   # Optional — always this value if used

Description: "My CloudFormation Template"  # Optional — string description

Metadata:                                  # Optional — additional info for tools/console
  AWS::CloudFormation::Interface:
    ParameterGroups: [...]

Parameters:                                # Optional — dynamic inputs at deploy time
  EnvironmentType:
    Type: String
    AllowedValues: [dev, staging, prod]
    Default: dev

Mappings:                                  # Optional — static lookup tables
  RegionAMIMap:
    us-east-1:
      AMI: ami-0abcdef1234567890

Conditions:                                # Optional — conditional resource creation
  IsProd: !Equals [!Ref EnvironmentType, prod]

Transform:                                 # Optional — macros (e.g., SAM transform)
  - AWS::Serverless-2016-10-31

Resources:                                 # REQUIRED — the actual AWS resources
  MyBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: my-app-bucket

Outputs:                                   # Optional — values to export or display
  BucketName:
    Value: !Ref MyBucket
    Export:
      Name: MyAppBucketName
```

### Template Sections Breakdown

| Section | Required | Purpose |
|---|---|---|
| **AWSTemplateFormatVersion** | No | Template version identifier |
| **Description** | No | Human-readable description |
| **Metadata** | No | Console UI hints, parameter grouping |
| **Parameters** | No | Runtime inputs — make templates reusable |
| **Mappings** | No | Static key-value lookup tables |
| **Conditions** | No | Conditionally create/configure resources |
| **Transform** | No | Apply macros (SAM, custom macros) |
| **Resources** | ✅ Yes | Define AWS resources — the core of every template |
| **Outputs** | No | Export values for cross-stack references or display |

---

## ⚙️ How CloudFormation Operates

### Stack Lifecycle

```
Template Submitted
       │
       ▼
  REVIEW_IN_PROGRESS
       │
       ▼
  CREATE_IN_PROGRESS  ──► CREATE_FAILED ──► ROLLBACK_IN_PROGRESS ──► ROLLBACK_COMPLETE
       │
       ▼
  CREATE_COMPLETE
       │
       ▼
  UPDATE_IN_PROGRESS  ──► UPDATE_FAILED ──► UPDATE_ROLLBACK_IN_PROGRESS
       │
       ▼
  UPDATE_COMPLETE
       │
       ▼
  DELETE_IN_PROGRESS  ──► DELETE_FAILED
       │
       ▼
  DELETE_COMPLETE
```

### Resource Provisioning Order

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/CloudFormationDependsOn.png" width="750"/>
</p>

CloudFormation builds an internal dependency graph using `DependsOn` and intrinsic function references (`!Ref`, `!GetAtt`). Resources with no dependencies are provisioned in parallel; dependent resources wait.

```yaml
Resources:
  MyVPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16

  MySubnet:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref MyVPC          # ← CloudFormation knows Subnet depends on VPC
      CidrBlock: 10.0.1.0/24
```

### Rollback Behavior

| Scenario | Default Behavior |
|---|---|
| Stack creation fails | Entire stack rolls back and all resources are deleted |
| Stack update fails | Rolls back to the last known good state |
| Rollback itself fails | Stack enters `UPDATE_ROLLBACK_FAILED` — requires manual intervention |

> 💡 **Tip:** You can disable rollback on creation failure (useful for debugging) using `--disable-rollback` in the CLI.

---

## 🔧 Parameters

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/TemplateParameters-1.png" width="750"/>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/PseudoParameters-1.png" width="750"/>
</p>

Parameters make templates reusable across environments.

```yaml
Parameters:
  InstanceType:
    Type: String
    Default: t3.micro
    AllowedValues:
      - t3.micro
      - t3.small
      - t3.medium
    Description: EC2 instance type

  DBPassword:
    Type: String
    NoEcho: true          # ← Masks value in console and CLI output
    MinLength: 8
```

### Parameter Types

| Type | Description |
|---|---|
| `String` | Plain text value |
| `Number` | Integer or float |
| `List<Number>` | Comma-separated list of numbers |
| `CommaDelimitedList` | Comma-separated list of strings |
| `AWS::EC2::KeyPair::KeyName` | Validates key pair exists in the account |
| `AWS::EC2::VPC::Id` | Validates VPC ID exists |
| `AWS::SSM::Parameter::Value<String>` | Pulls value from SSM Parameter Store at deploy time |

> 💡 **Exam Tip:** Use `NoEcho: true` for sensitive parameters like passwords. The value is never shown in the console, CLI, or CloudFormation events.

---

## 🗺️ Mappings

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/CloudFormationMappings.png" width="750"/>
</p>

Mappings are static lookup tables — great for region-to-AMI or environment-to-size mappings.

```yaml
Mappings:
  EnvironmentConfig:
    prod:
      InstanceType: t3.large
      MultiAZ: true
    dev:
      InstanceType: t3.micro
      MultiAZ: false

Resources:
  MyInstance:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: !FindInMap [EnvironmentConfig, !Ref EnvironmentType, InstanceType]
```

---

## 🔀 Conditions

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/CloudFormationConditions.png" width="750"/>
</p>

Conditions allow you to create resources or set property values based on logic.

```yaml
Conditions:
  IsProd: !Equals [!Ref EnvironmentType, prod]
  IsNotProd: !Not [!Condition IsProd]

Resources:
  ProdOnlyBucket:
    Type: AWS::S3::Bucket
    Condition: IsProd          # ← Only created in prod

  MyInstance:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: !If [IsProd, t3.large, t3.micro]   # ← Conditional value
```

### Condition Functions

| Function | Description |
|---|---|
| `!Equals` | True if two values are equal |
| `!Not` | Inverts a condition |
| `!And` | True if all conditions are true |
| `!Or` | True if any condition is true |
| `!If` | Returns one of two values based on a condition |

---

## 🔗 Intrinsic Functions

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/IntrinsicFunctions-1.png" width="750"/>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/IntrinsicFunctions-2.png" width="750"/>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/IntrinsicFunctions-3.png" width="750"/>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/IntrinsicFunctions-4.png" width="750"/>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/IntrinsicFunctions-5.png" width="750"/>
</p>

Intrinsic functions are built-in helpers used within templates.

| Function | Purpose | Example |
|---|---|---|
| `!Ref` | Reference a parameter or resource's primary ID | `!Ref MyBucket` |
| `!GetAtt` | Get an attribute of a resource | `!GetAtt MyBucket.Arn` |
| `!Sub` | String substitution | `!Sub "arn:aws:s3:::${BucketName}/*"` |
| `!Join` | Join values with a delimiter | `!Join [":", [a, b, c]]` → `a:b:c` |
| `!Split` | Split a string into a list | `!Split [",", "a,b,c"]` |
| `!Select` | Select item from a list by index | `!Select [0, !Split [",", "a,b"]]` |
| `!FindInMap` | Look up a value in Mappings | `!FindInMap [MapName, Key1, Key2]` |
| `!ImportValue` | Import an exported output from another stack | `!ImportValue SharedVPCId` |
| `!Base64` | Encode a string to Base64 (used in UserData) | `!Base64 "#!/bin/bash\nyum update -y"` |
| `!Cidr` | Generate CIDR blocks | `!Cidr [10.0.0.0/16, 4, 8]` |

---

## 📤 Outputs & Cross-Stack References

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/CloudFormationOutputs.png" width="750"/>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/CloudFormationCrossStackReferences-1.png" width="750"/>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/CloudFormationCrossStackReferences-2.png" width="750"/>
</p>

Outputs expose values from a stack that can be consumed by other stacks or displayed in the console.

```yaml
Outputs:
  VPCId:
    Description: "The VPC ID"
    Value: !Ref MyVPC
    Export:
      Name: !Sub "${AWS::StackName}-VPCId"   # ← Must be unique per region/account
```

Consuming stack:

```yaml
Resources:
  MySubnet:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !ImportValue "NetworkStack-VPCId"
```

> ⚠️ **Important:** You cannot delete a stack that has exported outputs being consumed by another stack. Delete the consuming stack first.

---

## 🏗️ Nested Stacks

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/CloudFormationNestedStacks-1.png" width="750"/>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/CloudFormationNestedStacks-2.png" width="750"/>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/CloudFormationNestedStacks-3.png" width="750"/>
</p>

Nested stacks allow you to break large templates into reusable modules.

```
Root Stack (Master)
    ├── Network Stack (VPC, Subnets, IGW)
    ├── Security Stack (IAM Roles, Security Groups)
    └── Application Stack (EC2, RDS, ALB)
```

```yaml
Resources:
  NetworkStack:
    Type: AWS::CloudFormation::Stack
    Properties:
      TemplateURL: https://s3.amazonaws.com/my-bucket/network.yaml
      Parameters:
        VPCCidr: 10.0.0.0/16
```

> 💡 **Exam Tip:** Nested stacks are best for reusable components. Cross-stack references (Outputs + ImportValue) are best for sharing values between independently managed stacks.

---

## 📦 Stack Sets

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/CloudFormationStackSets.png" width="750"/>
</p>

Deploy the same stack across multiple AWS accounts and regions from a single operation.

```
Management Account
        │
        ▼
   StackSet Definition
        │
   ┌────┴────────────────────────────────┐
   │                                     │
   ▼                                     ▼
Account A (us-east-1)           Account B (eu-west-1)
Stack Instance                  Stack Instance
```

### Permission Models

| Model | Description |
|---|---|
| **Self-managed** | You create IAM roles in each target account manually |
| **Service-managed** | Uses AWS Organizations — automatic role creation, deploy to entire OUs |

> 💡 **Exam Tip:** Service-managed StackSets with AWS Organizations can automatically deploy to new accounts added to an OU.

---

## 🔍 Change Sets

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/CloudFormationChangeSets.png" width="750"/>
</p>

Change Sets let you preview what will happen before executing a stack update — no surprises.

```
Current Stack State  +  New Template  →  Change Set (Preview)  →  Execute
```

```bash
# Create a change set
aws cloudformation create-change-set \
  --stack-name my-stack \
  --template-body file://updated-template.yaml \
  --change-set-name my-changes

# Review the change set
aws cloudformation describe-change-set \
  --stack-name my-stack \
  --change-set-name my-changes

# Execute if satisfied
aws cloudformation execute-change-set \
  --stack-name my-stack \
  --change-set-name my-changes
```

### Change Set Actions

| Action | Meaning |
|---|---|
| **Add** | New resource will be created |
| **Modify** | Existing resource will be updated |
| **Remove** | Existing resource will be deleted |

### Replacement Column

| Value | Meaning |
|---|---|
| **True** | Resource will be deleted and recreated (causes downtime) |
| **False** | Resource will be updated in-place |
| **Conditional** | Depends on the actual property values at execution time |

---

## 🛡️ Stack Policies

Stack policies protect critical resources from unintentional updates or replacements during stack updates.

```json
{
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "Update:*",
      "Principal": "*",
      "Resource": "*"
    },
    {
      "Effect": "Deny",
      "Action": ["Update:Replace", "Update:Delete"],
      "Principal": "*",
      "Resource": "LogicalResourceId/ProductionDatabase"
    }
  ]
}
```

> ⚠️ Once a stack policy is set, it cannot be deleted — only updated. All resources are protected by default if a policy exists with no explicit Allow.

---

## 🔄 Drift Detection

Drift occurs when someone manually changes a resource outside of CloudFormation.

```
CloudFormation Expected State  ≠  Actual Resource State  →  DRIFTED
```

```bash
# Detect drift on a stack
aws cloudformation detect-stack-drift --stack-name my-stack

# Check drift results
aws cloudformation describe-stack-resource-drifts \
  --stack-name my-stack \
  --stack-resource-drift-status-filters MODIFIED DELETED
```

### Drift Status Values

| Status | Meaning |
|---|---|
| **IN_SYNC** | Resource matches the template |
| **MODIFIED** | Resource exists but properties differ |
| **DELETED** | Resource was deleted outside CloudFormation |
| **NOT_CHECKED** | Drift detection not supported for this resource type |

---

## 🧩 Custom Resources

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/CloudFormationCustomResources.png" width="750"/>
</p>

Custom Resources let you extend CloudFormation to manage resources it doesn't natively support — or run arbitrary logic during stack operations.

```
CloudFormation Stack
        │
        │  Create/Update/Delete event
        ▼
  Lambda Function / SNS Topic
        │
        │  Performs custom logic
        ▼
  Sends response back to CloudFormation
  (Success or Failure + Data)
```

```yaml
Resources:
  MyCustomResource:
    Type: Custom::MyLogic
    Properties:
      ServiceToken: !GetAtt MyLambdaFunction.Arn
      SomeInput: "value"
```

### Use Cases

- Provision third-party resources (e.g., Datadog monitors, GitHub repos)
- Run pre/post deployment scripts
- Populate DynamoDB tables with seed data
- Validate configurations before stack proceeds

> 💡 **Exam Tip:** Custom Resources must send a response back to a pre-signed S3 URL provided by CloudFormation. If the Lambda times out without responding, the stack will hang until the 1-hour timeout.

---

## 🔐 Security & IAM

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/CloudFormationStackRoles.png" width="750"/>
</p>

### Execution Roles

CloudFormation needs permissions to create resources on your behalf.

```
You (User/Role)
      │
      │  Submit template
      ▼
CloudFormation Service
      │
      │  Uses Service Role (if specified) OR your credentials
      ▼
  Creates AWS Resources
```

| Approach | Description |
|---|---|
| **No service role** | CloudFormation uses the permissions of the user/role that initiated the operation |
| **Service role** | CloudFormation assumes a dedicated IAM role — least privilege, auditable |

### Service Role Example

```yaml
# IAM Role for CloudFormation
Type: AWS::IAM::Role
Properties:
  AssumeRolePolicyDocument:
    Statement:
      - Effect: Allow
        Principal:
          Service: cloudformation.amazonaws.com
        Action: sts:AssumeRole
```

> 💡 **Best Practice:** Always use a dedicated CloudFormation service role with least-privilege permissions. This prevents privilege escalation — a user with limited permissions can't use CloudFormation to create resources they couldn't create directly.

---

## 🚀 Deployment Methods

### AWS Console

- Upload template directly or reference an S3 URL
- Guided wizard for parameters, tags, and options
- Visual stack designer available

### AWS CLI

```bash
# Create a stack
aws cloudformation create-stack \
  --stack-name my-stack \
  --template-body file://template.yaml \
  --parameters ParameterKey=Env,ParameterValue=prod \
  --capabilities CAPABILITY_IAM

# Update a stack
aws cloudformation update-stack \
  --stack-name my-stack \
  --template-body file://template.yaml

# Delete a stack
aws cloudformation delete-stack --stack-name my-stack

# Wait for completion
aws cloudformation wait stack-create-complete --stack-name my-stack
```

### Capabilities Flag

Some templates require explicit acknowledgment before CloudFormation will proceed:

| Capability | When Required |
|---|---|
| `CAPABILITY_IAM` | Template creates IAM resources (roles, policies, groups) |
| `CAPABILITY_NAMED_IAM` | Template creates IAM resources with custom names |
| `CAPABILITY_AUTO_EXPAND` | Template uses macros or nested stacks with transforms |

---

## 🔁 CloudFormation & CI/CD

CloudFormation integrates natively with AWS developer tools for automated deployments.

```
CodeCommit (Source)
      │
      ▼
CodePipeline
      │
      ├──► CodeBuild (Lint/Validate template)
      │
      └──► CloudFormation Deploy Action
                  │
                  ├── Create/Update Stack
                  └── Execute Change Set
```

### Template Validation

```bash
# Validate template syntax before deploying
aws cloudformation validate-template --template-body file://template.yaml
```

### cfn-lint (Community Tool)

```bash
# Install
pip install cfn-lint

# Run linter
cfn-lint template.yaml
```

---

## 📊 Limits & Quotas

| Resource | Default Limit |
|---|---|
| Stacks per region per account | 2,000 |
| Template body size (direct upload) | 51,200 bytes |
| Template body size (S3 URL) | 1 MB |
| Parameters per template | 200 |
| Outputs per template | 200 |
| Resources per template | 500 |
| Mappings per template | 200 |
| StackSets per administrator account | 100 |
| Stack instances per StackSet | 2,000 |

> 💡 **Exam Tip:** If your template exceeds 51,200 bytes, you must upload it to S3 first and reference it via a URL. The S3 URL limit is 1 MB.

---

## 🧰 Additional Features

### cfn-init & cfn-signal (EC2 Bootstrap)

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/CloudFormationInit-and-Cfninit.png" width="750"/>
</p>

CloudFormation helper scripts allow EC2 instances to configure themselves and signal back when ready.

```yaml
Resources:
  MyInstance:
    Type: AWS::EC2::Instance
    Metadata:
      AWS::CloudFormation::Init:
        config:
          packages:
            yum:
              httpd: []
          services:
            sysvinit:
              httpd:
                enabled: true
                ensureRunning: true
    Properties:
      UserData:
        !Base64 |
          #!/bin/bash
          /opt/aws/bin/cfn-init -s !Ref AWS::StackId -r MyInstance --region !Ref AWS::Region
          /opt/aws/bin/cfn-signal -e $? --stack !Ref AWS::StackName --resource MyInstance --region !Ref AWS::Region
```

### CreationPolicy & WaitCondition

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/CloudFormationCreationPolicy.png" width="750"/>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/CloudFormationWaitConditions.png" width="750"/>
</p>

Pause stack creation until a resource signals success.

```yaml
MyInstance:
  Type: AWS::EC2::Instance
  CreationPolicy:
    ResourceSignal:
      Count: 1
      Timeout: PT15M    # Wait up to 15 minutes for signal
```

### DeletionPolicy

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/CloudFormationDeletionPolicy.png" width="750"/>
</p>

Control what happens to a resource when its stack is deleted.

| Value | Behavior |
|---|---|
| `Delete` | Default — resource is deleted with the stack |
| `Retain` | Resource is kept after stack deletion |
| `Snapshot` | Takes a snapshot before deletion (RDS, EBS, ElastiCache) |

```yaml
MyDatabase:
  Type: AWS::RDS::DBInstance
  DeletionPolicy: Snapshot    # ← Snapshot before delete
```

### UpdateReplacePolicy

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/2100-IAC_CLOUDFORMATION/00_LEARNINGAIDS/CloudFormationCfnHUP.png" width="750"/>
</p>

Controls what happens to the old resource when it must be replaced during an update.

```yaml
MyDatabase:
  Type: AWS::RDS::DBInstance
  UpdateReplacePolicy: Snapshot
  DeletionPolicy: Retain
```

---

## 📋 Quick Reference — Exam Tips

| Topic | Key Point |
|---|---|
| Only required section | `Resources` — all other sections are optional |
| Template size limit | 51,200 bytes direct upload; **1 MB via S3 URL** |
| Rollback on failure | Default behavior — can be disabled with `--disable-rollback` |
| Change Sets | Preview changes before applying — no automatic execution |
| Stack Policy | Protects resources from update/delete — cannot be removed once set |
| DeletionPolicy Snapshot | Supported for **RDS, EBS, ElastiCache** — not all resource types |
| Cross-stack reference | Use `Outputs` + `Export` + `!ImportValue` — consuming stack blocks deletion |
| Nested vs Cross-stack | Nested = reusable modules; Cross-stack = independently managed stacks sharing values |
| Custom Resource timeout | Lambda must respond within **1 hour** or stack hangs |
| StackSets + Organizations | Service-managed model auto-deploys to new accounts in an OU |
| CAPABILITY_IAM | Required whenever template creates **any IAM resource** |
| cfn-signal | Used with `CreationPolicy` to pause stack until EC2 is fully configured |
| Drift Detection | Identifies manual changes — does **not** auto-remediate |
| `!Ref` on a resource | Returns the resource's **primary identifier** (e.g., bucket name, instance ID) |
| `!GetAtt` | Returns a **specific attribute** (e.g., ARN, DNS name) |

---

## 🏆 Golden Keypoints — Lessons from Production

These are the kinds of lessons that don't usually appear in certification exams but make a huge difference when designing and operating production-grade cloud solutions.

---

### 🔹 CloudFormation can't be used with S3 presigned URLs as Template URLs

CloudFormation needs to continuously access the template during stack operations — not just at the moment of submission. Temporary presigned URLs expire and can become inaccessible mid-operation, causing stack failures that are difficult to diagnose. Always use a **permanent, publicly accessible S3 URL** or a bucket policy that grants CloudFormation access to the object.

```
❌ https://s3.amazonaws.com/bucket/template.yaml?X-Amz-Expires=3600&X-Amz-Signature=...
✅ https://s3.amazonaws.com/bucket/template.yaml  (with appropriate bucket/IAM policy)
```

---

### 🔹 CloudFormation can't create tags for resources it doesn't own

CloudFormation can only manage the lifecycle of resources that are part of its own stack. If a resource was created outside of CloudFormation (manually, via CLI, or by another tool), CloudFormation has no authority to tag or modify it — even if you reference it in a template. For tagging external resources, use:

- **Custom Resources** backed by Lambda to apply tags programmatically
- **AWS Config + Automation** to enforce tagging compliance
- **Tag Editor** in the AWS Console for one-time bulk tagging
- **Automation scripts** (CLI/SDK) as part of your deployment pipeline

```
✅ Resources CloudFormation created → CloudFormation can tag
❌ Pre-existing external resources  → CloudFormation cannot tag
```

---

### 🔹 CloudFormation template URL encoding for prefilled parameters

When generating **stack launch links** with pre-populated parameters (e.g., a "Launch Stack" button in documentation or a portal), every parameter value in the URL must be properly URL-encoded. A single unencoded special character — a space, `+`, `=`, or `/` — silently breaks the parameter parsing and causes confusing deployment failures.

```
# Stack launch URL format
https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/create/review
  ?templateURL=https%3A%2F%2Fs3.amazonaws.com%2Fbucket%2Ftemplate.yaml
  &param_EnvironmentType=prod
  &param_AppName=my%2Bapp%2Bname    ← URL-encode special characters
```

Always URL-encode parameter values when constructing launch links programmatically, and test the full URL end-to-end before publishing it.

> 📸 **Visual diagrams throughout this guide are sourced from [Adrian Cantrill's AWS SAA-C03 course](https://learn.cantrill.io) — highly recommended for anyone serious about AWS certifications.**

---

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" width="60"/><br/>
  <em>AWS CloudFormation — Model, provision, and manage your entire infrastructure as code.</em>
</p>
