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
 * @interface ExternalIds
 */
export interface ExternalIds {
    /**
     * 
     * @type {string}
     * @memberof ExternalIds
     */
    imdbId?: string;
    /**
     * 
     * @type {number}
     * @memberof ExternalIds
     */
    tvdbId?: number;
}

/**
 * Check if a given object implements the ExternalIds interface.
 */
export function instanceOfExternalIds(value: object): value is ExternalIds {
    return true;
}

export function ExternalIdsFromJSON(json: any): ExternalIds {
    return ExternalIdsFromJSONTyped(json, false);
}

export function ExternalIdsFromJSONTyped(json: any, ignoreDiscriminator: boolean): ExternalIds {
    if (json == null) {
        return json;
    }
    return {
        
        'imdbId': json['imdbId'] == null ? undefined : json['imdbId'],
        'tvdbId': json['tvdbId'] == null ? undefined : json['tvdbId'],
    };
}

export function ExternalIdsToJSON(json: any): ExternalIds {
    return ExternalIdsToJSONTyped(json, false);
}

export function ExternalIdsToJSONTyped(value?: ExternalIds | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'imdbId': value['imdbId'],
        'tvdbId': value['tvdbId'],
    };
}

