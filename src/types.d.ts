/// <reference types="@compiled/react" />

import '@compiled/react';

declare module 'react' {
  interface HTMLAttributes<T> {
    css?: any;
  }
}
