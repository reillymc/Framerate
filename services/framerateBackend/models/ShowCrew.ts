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
import type { Job } from './Job';
import {
    JobFromJSON,
    JobFromJSONTyped,
    JobToJSON,
    JobToJSONTyped,
} from './Job';

/**
 * 
 * @export
 * @interface ShowCrew
 */
export interface ShowCrew {
    /**
     * 
     * @type {string}
     * @memberof ShowCrew
     */
    department?: string;
    /**
     * 
     * @type {number}
     * @memberof ShowCrew
     */
    id: number;
    /**
     * 
     * @type {Array<Job>}
     * @memberof ShowCrew
     */
    jobs: Array<Job>;
    /**
     * 
     * @type {string}
     * @memberof ShowCrew
     */
    knownForDepartment?: string;
    /**
     * 
     * @type {string}
     * @memberof ShowCrew
     */
    name?: string;
    /**
     * 
     * @type {number}
     * @memberof ShowCrew
     */
    popularity: number;
    /**
     * 
     * @type {string}
     * @memberof ShowCrew
     */
    profilePath?: string;
    /**
     * 
     * @type {number}
     * @memberof ShowCrew
     */
    totalEpisodeCount: number;
}

/**
 * Check if a given object implements the ShowCrew interface.
 */
export function instanceOfShowCrew(value: object): value is ShowCrew {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('jobs' in value) || value['jobs'] === undefined) return false;
    if (!('popularity' in value) || value['popularity'] === undefined) return false;
    if (!('totalEpisodeCount' in value) || value['totalEpisodeCount'] === undefined) return false;
    return true;
}

export function ShowCrewFromJSON(json: any): ShowCrew {
    return ShowCrewFromJSONTyped(json, false);
}

export function ShowCrewFromJSONTyped(json: any, ignoreDiscriminator: boolean): ShowCrew {
    if (json == null) {
        return json;
    }
    return {
        
        'department': json['department'] == null ? undefined : json['department'],
        'id': json['id'],
        'jobs': ((json['jobs'] as Array<any>).map(JobFromJSON)),
        'knownForDepartment': json['knownForDepartment'] == null ? undefined : json['knownForDepartment'],
        'name': json['name'] == null ? undefined : json['name'],
        'popularity': json['popularity'],
        'profilePath': json['profilePath'] == null ? undefined : json['profilePath'],
        'totalEpisodeCount': json['totalEpisodeCount'],
    };
}

export function ShowCrewToJSON(json: any): ShowCrew {
    return ShowCrewToJSONTyped(json, false);
}

export function ShowCrewToJSONTyped(value?: ShowCrew | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'department': value['department'],
        'id': value['id'],
        'jobs': ((value['jobs'] as Array<any>).map(JobToJSON)),
        'knownForDepartment': value['knownForDepartment'],
        'name': value['name'],
        'popularity': value['popularity'],
        'profilePath': value['profilePath'],
        'totalEpisodeCount': value['totalEpisodeCount'],
    };
}

