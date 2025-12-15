// Global type declarations for window properties

// Crisp Chat Widget types
interface CrispConfig {
  website_id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// interface CrispAPI {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   push: (args: any[]) => void;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   [key: string]: any;
// }

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
    CRISP_TOKEN_ID?: string;
    CRISP_RUNTIME_CONFIG?: CrispConfig;
  }
}

export {}; // This makes the file a module
