/* tslint:disable */
/* eslint-disable */
/**
 * Framerate API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface LoginResponse
 */
export interface LoginResponse {
    /**
     * 
     * @type {string}
     * @memberof LoginResponse
     */
    token: string;
    /**
     * 
     * @type {string}
     * @memberof LoginResponse
     */
    userId: string;
}

/**
 * Check if a given object implements the LoginResponse interface.
 */
export function instanceOfLoginResponse(value: object): value is LoginResponse {
    if (!('token' in value) || value['token'] === undefined) return false;
    if (!('userId' in value) || value['userId'] === undefined) return false;
    return true;
}

export function LoginResponseFromJSON(json: any): LoginResponse {
    return LoginResponseFromJSONTyped(json, false);
}

export function LoginResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): LoginResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'token': json['token'],
        'userId': json['userId'],
    };
}

export function LoginResponseToJSON(json: any): LoginResponse {
    return LoginResponseToJSONTyped(json, false);
}

export function LoginResponseToJSONTyped(value?: LoginResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'token': value['token'],
        'userId': value['userId'],
    };
}

