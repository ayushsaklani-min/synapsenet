export interface SynapseEvent {
  id: string;
  type: 'price_update' | 'score_update' | string;
  data: Record<string, unknown>;
  timestamp: number;
  sourceChain: string;
}

