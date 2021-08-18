import { StackProps } from "@aws-cdk/core";
import { NestedStackProps } from "@aws-cdk/core";

export interface MyStackProps extends StackProps {
  UserBranch?: string;
  ServiceName?: string;
  AppSyncId?: string;
  AppSyncArn?: string;
  ParamPath?: string;
  Region?: string;
  Account?: string;
  BackendAccount?: string;
}

export interface LambdaEnvironmentVariables {
  name: string,
  value: string
}

export interface MyNestedStackProps extends NestedStackProps {
  UserBranch?: string;
  ServiceName?: string;
  AppSyncId?: string;
  AppSyncArn?: string;
  ParamPath?: string;
  Region?: string;
  Account?: string;
  BackendAccount?: string;
  router?: string;
}

export enum ServiceCode {
  Integrated = "Integrated",
  Member = "Member",
  Team = "Team",
  Player = "Player",
  LeagueSchedule = "LeagueSchedule",
  Division = "Division",
  Coffee = "Coffee"
}

export enum BranchCode {
  Master = "master",
  Staging = "master",
  Development = "develop",
  Local = "local"
}