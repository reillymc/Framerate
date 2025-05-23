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
 * @interface UserResponse
 */
export interface UserResponse {
    [key: string]: any | any;
    /**
     * 
     * @type {string}
     * @memberof UserResponse
     */
    avatarUri?: string;
    /**
     * 
     * @type {string}
     * @memberof UserResponse
     */
    firstName: string;
    /**
     * 
     * @type {string}
     * @memberof UserResponse
     */
    lastName: string;
    /**
     * 
     * @type {string}
     * @memberof UserResponse
     */
    userId: string;
}

/**
 * Check if a given object implements the UserResponse interface.
 */
export function instanceOfUserResponse(value: object): value is UserResponse {
    if (!('firstName' in value) || value['firstName'] === undefined) return false;
    if (!('lastName' in value) || value['lastName'] === undefined) return false;
    if (!('userId' in value) || value['userId'] === undefined) return false;
    return true;
}

export function UserResponseFromJSON(json: any): UserResponse {
    return UserResponseFromJSONTyped(json, false);
}

export function UserResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserResponse {
    if (json == null) {
        return json;
    }
    return {
        
            ...json,
        'avatarUri': json['avatarUri'] == null ? undefined : json['avatarUri'],
        'firstName': json['firstName'],
        'lastName': json['lastName'],
        'userId': json['userId'],
    };
}

export function UserResponseToJSON(json: any): UserResponse {
    return UserResponseToJSONTyped(json, false);
}

export function UserResponseToJSONTyped(value?: UserResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
            ...value,
        'avatarUri': value['avatarUri'],
        'firstName': value['firstName'],
        'lastName': value['lastName'],
        'userId': value['userId'],
    };
}

