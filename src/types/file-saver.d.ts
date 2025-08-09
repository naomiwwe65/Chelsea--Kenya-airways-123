declare module 'file-saver' {
  /**
   * Save data to a file on the client.
   */
  export function saveAs(
    data: Blob | File | string,
    filename?: string,
    options?: { autoBom?: boolean }
  ): void;
}


