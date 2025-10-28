/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WS_URL: string
  readonly VITE_API_URL: string
  readonly VITE_CHAINLINK_CONTRACT: string
  readonly VITE_POLYGON_AMOY_RPC: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
