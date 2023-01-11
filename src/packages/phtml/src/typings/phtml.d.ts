export type Cleanup = () => void;
export type Effect = () => void | Cleanup;
