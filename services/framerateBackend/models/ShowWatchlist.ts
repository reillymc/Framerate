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
import type { ShowWatchlistEntry } from './ShowWatchlistEntry';
import {
    ShowWatchlistEntryFromJSON,
    ShowWatchlistEntryFromJSONTyped,
    ShowWatchlistEntryToJSON,
    ShowWatchlistEntryToJSONTyped,
} from './ShowWatchlistEntry';

/**
 * 
 * @export
 * @interface ShowWatchlist
 */
export interface ShowWatchlist {
    /**
     * 
     * @type {Array<ShowWatchlistEntry>}
     * @memberof ShowWatchlist
     */
    entries?: Array<ShowWatchlistEntry>;
    /**
     * 
     * @type {string}
     * @memberof ShowWatchlist
     */
    name: string;
}

/**
 * Check if a given object implements the ShowWatchlist interface.
 */
export function instanceOfShowWatchlist(value: object): value is ShowWatchlist {
    if (!('name' in value) || value['name'] === undefined) return false;
    return true;
}

export function ShowWatchlistFromJSON(json: any): ShowWatchlist {
    return ShowWatchlistFromJSONTyped(json, false);
}

export function ShowWatchlistFromJSONTyped(json: any, ignoreDiscriminator: boolean): ShowWatchlist {
    if (json == null) {
        return json;
    }
    return {
        
        'entries': json['entries'] == null ? undefined : ((json['entries'] as Array<any>).map(ShowWatchlistEntryFromJSON)),
        'name': json['name'],
    };
}

export function ShowWatchlistToJSON(json: any): ShowWatchlist {
    return ShowWatchlistToJSONTyped(json, false);
}

export function ShowWatchlistToJSONTyped(value?: ShowWatchlist | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'entries': value['entries'] == null ? undefined : ((value['entries'] as Array<any>).map(ShowWatchlistEntryToJSON)),
        'name': value['name'],
    };
}

