export const InternalServerError = (error: Error) => {
    return ({ message: (error as Error).message, error: true })
}