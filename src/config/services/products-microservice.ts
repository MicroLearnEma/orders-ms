export namespace ProductsMicroservice {
    export const name = "PRODUCTS_MS";
    export enum Actions {
        FIND_ALL = 'find_all',
        FIND_ONE = 'find_one',
        DELETE   = 'delete_product',
        CREATE   = 'create_product',
        UPDATE   = 'update_product',
        VALIDATE = 'validate_products',
    }
}

