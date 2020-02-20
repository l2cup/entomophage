import { Document } from 'mongoose';

/**
 * @description This is an issue document used to represent an Issue model
 */
export type IssueDocument = Document & {

  label: IssueLabel;
  state: IssueState;
  name: string;
  project: string;
  issuedBy: string;

  metadata?: Map<string, string>;
}

/**
 * @description This is an issue label enum used to represent all the possible issue labels.
 */
export enum IssueLabel {

  CHANGE = 'Change',
  BUG = 'Bug',
  INCIDENT = 'Incident',
  FEATURE_RECOMMENDATION = 'Feature recommendation',
  FEATURE_IMPLEMENTATION = 'Feature implementation',

}

/**
 * @description This is an issue state enum used to represent all the possible issue states.
 */
export enum IssueState {

 OPEN,
 ACCEPTED,
 IN_PROGRESS,
 RESOLVED,
 DECLINED

}
