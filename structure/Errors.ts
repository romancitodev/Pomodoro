export default class CustomError extends Error {
    description: string;
    constructor({ error, description }: { error: string, description: string }) {
        super(error);
        this.description = description;
        
        Object.setPrototypeOf(this, CustomError.prototype);
    }
    
}