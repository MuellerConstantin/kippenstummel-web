export interface Cvm {
  id: string;
  latitude: number;
  longitude: number;
  score: number;
  recentlyReported: {
    missing: number;
    spam: number;
    inactive: number;
    inaccessible: number;
  };
  alreadyVoted?: "upvote" | "downvote";
  createdAt: string;
  updatedAt: string;
}

export interface CvmCluster {
  cluster: boolean;
  latitude: number;
  longitude: number;
  count: number;
}
