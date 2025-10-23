export interface SynapseEvent {
  id: string;
  type: 'price_update' | 'score_update';
  data: {
    token?: string;
    price?: number;
    user_id?: string;
    score?: number;
    source?: string;
    network?: string;
  };
  timestamp: number;
  sourceChain: string;
}
