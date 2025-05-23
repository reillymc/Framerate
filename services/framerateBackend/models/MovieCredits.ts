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
import type { MovieCrew } from './MovieCrew';
import {
    MovieCrewFromJSON,
    MovieCrewFromJSONTyped,
    MovieCrewToJSON,
    MovieCrewToJSONTyped,
} from './MovieCrew';
import type { MovieCast } from './MovieCast';
import {
    MovieCastFromJSON,
    MovieCastFromJSONTyped,
    MovieCastToJSON,
    MovieCastToJSONTyped,
} from './MovieCast';

/**
 * 
 * @export
 * @interface MovieCredits
 */
export interface MovieCredits {
    /**
     * 
     * @type {Array<MovieCast>}
     * @memberof MovieCredits
     */
    cast: Array<MovieCast>;
    /**
     * 
     * @type {Array<MovieCrew>}
     * @memberof MovieCredits
     */
    crew: Array<MovieCrew>;
}

/**
 * Check if a given object implements the MovieCredits interface.
 */
export function instanceOfMovieCredits(value: object): value is MovieCredits {
    if (!('cast' in value) || value['cast'] === undefined) return false;
    if (!('crew' in value) || value['crew'] === undefined) return false;
    return true;
}

export function MovieCreditsFromJSON(json: any): MovieCredits {
    return MovieCreditsFromJSONTyped(json, false);
}

export function MovieCreditsFromJSONTyped(json: any, ignoreDiscriminator: boolean): MovieCredits {
    if (json == null) {
        return json;
    }
    return {
        
        'cast': ((json['cast'] as Array<any>).map(MovieCastFromJSON)),
        'crew': ((json['crew'] as Array<any>).map(MovieCrewFromJSON)),
    };
}

export function MovieCreditsToJSON(json: any): MovieCredits {
    return MovieCreditsToJSONTyped(json, false);
}

export function MovieCreditsToJSONTyped(value?: MovieCredits | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'cast': ((value['cast'] as Array<any>).map(MovieCastToJSON)),
        'crew': ((value['crew'] as Array<any>).map(MovieCrewToJSON)),
    };
}

