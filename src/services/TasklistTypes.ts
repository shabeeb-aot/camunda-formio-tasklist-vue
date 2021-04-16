export interface Payload{
    active: boolean;
    sorting: Array<object>;
    orQueries?: Array<object>;
    maxResults?: number;
    firstResult?: number;
  }
