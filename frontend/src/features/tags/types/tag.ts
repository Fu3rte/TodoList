export interface Tag {
  id: number;
  name: string;
  user_id: number;
  created_at: string;
}

export interface CreateTagInput {
  name: string;
}

export interface UpdateTagInput {
  name?: string;
}
