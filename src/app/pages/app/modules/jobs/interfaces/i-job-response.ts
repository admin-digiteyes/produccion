export interface IJobResponse {
    id: number;

    /**
     * Job filename without format
     */
    uuid: string;
    filename_export: string;
    status: 'SUCCEEDED' | 'PENDING' | 'ERRORED';
    updated_at: string;

    /**
     * Template name
     */
    idTemplate: string;
}
