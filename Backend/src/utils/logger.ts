export const logger = {
    // pour les informations générales
    info : (message:string)=>
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`),

    error : (message: string, error?: unknown) =>
        console.error( `[ERROR] ${new Date().toISOString()} - ${message}`,error),

    warn : (message: string)=>
        console.warn(`[WARNING] ${new Date().toISOString()} - ${message}`),
}