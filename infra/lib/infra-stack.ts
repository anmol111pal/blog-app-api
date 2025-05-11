import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Table, AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import { Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userDataScript = ec2.UserData.forLinux();
    userDataScript.addCommands(
      'sudo apt update -y',
      'sudo apt install -y nodejs npm',
      'sudo apt upgrade -y',
      'sudo npm install -g typescript',
    );

    const blogAppVpc = new ec2.Vpc(this, 'Blog-App-VPC', {
      vpcName: 'Blog-App-VPC',
      maxAzs: 1,
      ipProtocol: ec2.IpProtocol.DUAL_STACK,
      subnetConfiguration: [{
        cidrMask: 24,
        name: 'Public',
        subnetType: ec2.SubnetType.PUBLIC,
      }],
    });

    const blogAppSecurityGroup = new ec2.SecurityGroup(this, 'Blog-App-SecurityGroup', {
      securityGroupName: 'Blog-App-SecurityGroup',
      description: 'Security group for the blog application',
      vpc: blogAppVpc,
      allowAllOutbound: true,
    });

    blogAppSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.SSH, 'Allow SSH access');
    blogAppSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.HTTP, 'Allow incoming HTTP traffic');
    blogAppSecurityGroup.addIngressRule(ec2.Peer.anyIpv6(), ec2.Port.HTTP, 'Allow incoming HTTP traffic');
    blogAppSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.HTTPS, 'Allow incoming HTTPS traffic');
    blogAppSecurityGroup.addIngressRule(ec2.Peer.anyIpv6(), ec2.Port.HTTPS, 'Allow incoming HTTPS traffic');

    const ec2InstanceRole = new Role(this, 'Blog-Instance-Role', {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
      ],
    });

    const machineImage = ec2.MachineImage.fromSsmParameter(
      '/aws/service/canonical/ubuntu/server/22.04/stable/current/amd64/hvm/ebs-gp2/ami-id'
    );

    const ec2Instance = new ec2.Instance(this, 'Blog-Instance', {
      instanceName: 'Blog-App-Instance',
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: machineImage,
      userData: userDataScript,
      vpc: blogAppVpc,
      securityGroup: blogAppSecurityGroup,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      role: ec2InstanceRole,
      requireImdsv2: true,
      associatePublicIpAddress: true,
      keyPair: ec2.KeyPair.fromKeyPairName(this, 'Blog-App-KeyPair', 'ec2-keypair'),
      disableApiTermination: true,
    });

    const blogTable = new Table(this, 'BlogTable', {
      tableName: 'BlogTable',
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'createdAt',
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const userTable = new Table(this, 'UserTable', {
      tableName: 'UserTable',
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'createdAt',
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    userTable.grantReadWriteData(ec2InstanceRole);
    blogTable.grantReadWriteData(ec2InstanceRole);
  }
}
