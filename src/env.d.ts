/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    session: import('./lib/auth').SessionPayload | null;
  }
}

interface ImportMetaEnv {
  readonly JWT_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
