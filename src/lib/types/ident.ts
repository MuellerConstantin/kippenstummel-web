export interface IdentInfo {
  identity: string;
  createdAt: string;
  updatedAt: string;
  credibility: number;
  karma: number;
}

export interface KarmaEvent {
  type:
    | "registration"
    | "upvote_received"
    | "downvote_received"
    | "upvote_cast"
    | "downvote_cast"
    | "report_cast"
    | "report_received";
  delta: number;
  occurredAt: string;
  cvmId: string;
}
