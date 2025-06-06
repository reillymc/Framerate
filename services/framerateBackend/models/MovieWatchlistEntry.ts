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
 * @interface MovieWatchlistEntry
 */
export interface MovieWatchlistEntry {
    /**
     * 
     * @type {string}
     * @memberof MovieWatchlistEntry
     */
    imdbId?: string;
    /**
     * 
     * @type {number}
     * @memberof MovieWatchlistEntry
     */
    movieId: number;
    /**
     * 
     * @type {string}
     * @memberof MovieWatchlistEntry
     */
    posterPath?: string;
    /**
     * 
     * @type {string}
     * @memberof MovieWatchlistEntry
     */
    releaseDate?: string;
    /**
     * 
     * @type {string}
     * @memberof MovieWatchlistEntry
     */
    status?: string;
    /**
     * 
     * @type {string}
     * @memberof MovieWatchlistEntry
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof MovieWatchlistEntry
     */
    updatedAt: string;
}

/**
 * Check if a given object implements the MovieWatchlistEntry interface.
 */
export function instanceOfMovieWatchlistEntry(value: object): value is MovieWatchlistEntry {
    if (!('movieId' in value) || value['movieId'] === undefined) return false;
    if (!('title' in value) || value['title'] === undefined) return false;
    if (!('updatedAt' in value) || value['updatedAt'] === undefined) return false;
    return true;
}

export function MovieWatchlistEntryFromJSON(json: any): MovieWatchlistEntry {
    return MovieWatchlistEntryFromJSONTyped(json, false);
}

export function MovieWatchlistEntryFromJSONTyped(json: any, ignoreDiscriminator: boolean): MovieWatchlistEntry {
    if (json == null) {
        return json;
    }
    return {
        
        'imdbId': json['imdbId'] == null ? undefined : json['imdbId'],
        'movieId': json['movieId'],
        'posterPath': json['posterPath'] == null ? undefined : json['posterPath'],
        'releaseDate': json['releaseDate'] == null ? undefined : json['releaseDate'],
        'status': json['status'] == null ? undefined : json['status'],
        'title': json['title'],
        'updatedAt': json['updatedAt'],
    };
}

export function MovieWatchlistEntryToJSON(json: any): MovieWatchlistEntry {
    return MovieWatchlistEntryToJSONTyped(json, false);
}

export function MovieWatchlistEntryToJSONTyped(value?: MovieWatchlistEntry | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'imdbId': value['imdbId'],
        'movieId': value['movieId'],
        'posterPath': value['posterPath'],
        'releaseDate': value['releaseDate'],
        'status': value['status'],
        'title': value['title'],
        'updatedAt': value['updatedAt'],
    };
}

