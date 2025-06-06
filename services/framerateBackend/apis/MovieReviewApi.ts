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


import * as runtime from '../runtime';
import type {
  MovieReviewResponse,
  SaveMovieReviewRequest,
} from '../models/index';
import {
    MovieReviewResponseFromJSON,
    MovieReviewResponseToJSON,
    SaveMovieReviewRequestFromJSON,
    SaveMovieReviewRequestToJSON,
} from '../models/index';

export interface MovieReviewApiCreateRequest {
    movieId: number;
    saveMovieReviewRequest: SaveMovieReviewRequest;
}

export interface MovieReviewApiFindAllRequest {
    orderBy?: string;
    sort?: string;
    page?: number;
    pageSize?: number;
    ratingMin?: number;
    ratingMax?: number;
    atVenue?: string;
    withCompany?: string;
}

export interface MovieReviewApiFindByMovieIdRequest {
    movieId: number;
}

export interface MovieReviewApiFindByReviewIdRequest {
    reviewId: string;
}

export interface MovieReviewApiUpdateRequest {
    movieId: number;
    reviewId: string;
    saveMovieReviewRequest: SaveMovieReviewRequest;
}

/**
 * MovieReviewApi - interface
 * 
 * @export
 * @interface MovieReviewApiInterface
 */
export interface MovieReviewApiInterface {
    /**
     * 
     * @param {number} movieId 
     * @param {SaveMovieReviewRequest} saveMovieReviewRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MovieReviewApiInterface
     */
    createRaw(requestParameters: MovieReviewApiCreateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<MovieReviewResponse>>;

    /**
     */
    create(requestParameters: MovieReviewApiCreateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<MovieReviewResponse>;

    /**
     * 
     * @param {string} [orderBy] 
     * @param {string} [sort] 
     * @param {number} [page] 
     * @param {number} [pageSize] 
     * @param {number} [ratingMin] 
     * @param {number} [ratingMax] 
     * @param {string} [atVenue] 
     * @param {string} [withCompany] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MovieReviewApiInterface
     */
    findAllRaw(requestParameters: MovieReviewApiFindAllRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<MovieReviewResponse>>>;

    /**
     */
    findAll(requestParameters: MovieReviewApiFindAllRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<MovieReviewResponse>>;

    /**
     * 
     * @param {number} movieId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MovieReviewApiInterface
     */
    findByMovieIdRaw(requestParameters: MovieReviewApiFindByMovieIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<MovieReviewResponse>>>;

    /**
     */
    findByMovieId(requestParameters: MovieReviewApiFindByMovieIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<MovieReviewResponse>>;

    /**
     * 
     * @param {string} reviewId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MovieReviewApiInterface
     */
    findByReviewIdRaw(requestParameters: MovieReviewApiFindByReviewIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<MovieReviewResponse>>;

    /**
     */
    findByReviewId(requestParameters: MovieReviewApiFindByReviewIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<MovieReviewResponse>;

    /**
     * 
     * @param {number} movieId 
     * @param {string} reviewId 
     * @param {SaveMovieReviewRequest} saveMovieReviewRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MovieReviewApiInterface
     */
    updateRaw(requestParameters: MovieReviewApiUpdateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<MovieReviewResponse>>;

    /**
     */
    update(requestParameters: MovieReviewApiUpdateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<MovieReviewResponse>;

}

/**
 * 
 */
export class MovieReviewApi extends runtime.BaseAPI implements MovieReviewApiInterface {

    /**
     */
    async createRaw(requestParameters: MovieReviewApiCreateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<MovieReviewResponse>> {
        if (requestParameters['movieId'] == null) {
            throw new runtime.RequiredError(
                'movieId',
                'Required parameter "movieId" was null or undefined when calling create().'
            );
        }

        if (requestParameters['saveMovieReviewRequest'] == null) {
            throw new runtime.RequiredError(
                'saveMovieReviewRequest',
                'Required parameter "saveMovieReviewRequest" was null or undefined when calling create().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearerAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/movies/{movie_id}/reviews`.replace(`{${"movie_id"}}`, encodeURIComponent(String(requestParameters['movieId']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SaveMovieReviewRequestToJSON(requestParameters['saveMovieReviewRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => MovieReviewResponseFromJSON(jsonValue));
    }

    /**
     */
    async create(requestParameters: MovieReviewApiCreateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<MovieReviewResponse> {
        const response = await this.createRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async findAllRaw(requestParameters: MovieReviewApiFindAllRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<MovieReviewResponse>>> {
        const queryParameters: any = {};

        if (requestParameters['orderBy'] != null) {
            queryParameters['orderBy'] = requestParameters['orderBy'];
        }

        if (requestParameters['sort'] != null) {
            queryParameters['sort'] = requestParameters['sort'];
        }

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['pageSize'] != null) {
            queryParameters['pageSize'] = requestParameters['pageSize'];
        }

        if (requestParameters['ratingMin'] != null) {
            queryParameters['ratingMin'] = requestParameters['ratingMin'];
        }

        if (requestParameters['ratingMax'] != null) {
            queryParameters['ratingMax'] = requestParameters['ratingMax'];
        }

        if (requestParameters['atVenue'] != null) {
            queryParameters['atVenue'] = requestParameters['atVenue'];
        }

        if (requestParameters['withCompany'] != null) {
            queryParameters['withCompany'] = requestParameters['withCompany'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearerAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/movies/reviews`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(MovieReviewResponseFromJSON));
    }

    /**
     */
    async findAll(requestParameters: MovieReviewApiFindAllRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<MovieReviewResponse>> {
        const response = await this.findAllRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async findByMovieIdRaw(requestParameters: MovieReviewApiFindByMovieIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<MovieReviewResponse>>> {
        if (requestParameters['movieId'] == null) {
            throw new runtime.RequiredError(
                'movieId',
                'Required parameter "movieId" was null or undefined when calling findByMovieId().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearerAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/movies/{movie_id}/reviews`.replace(`{${"movie_id"}}`, encodeURIComponent(String(requestParameters['movieId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(MovieReviewResponseFromJSON));
    }

    /**
     */
    async findByMovieId(requestParameters: MovieReviewApiFindByMovieIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<MovieReviewResponse>> {
        const response = await this.findByMovieIdRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async findByReviewIdRaw(requestParameters: MovieReviewApiFindByReviewIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<MovieReviewResponse>> {
        if (requestParameters['reviewId'] == null) {
            throw new runtime.RequiredError(
                'reviewId',
                'Required parameter "reviewId" was null or undefined when calling findByReviewId().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearerAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/movies/reviews/{review_id}`.replace(`{${"review_id"}}`, encodeURIComponent(String(requestParameters['reviewId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => MovieReviewResponseFromJSON(jsonValue));
    }

    /**
     */
    async findByReviewId(requestParameters: MovieReviewApiFindByReviewIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<MovieReviewResponse> {
        const response = await this.findByReviewIdRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async updateRaw(requestParameters: MovieReviewApiUpdateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<MovieReviewResponse>> {
        if (requestParameters['movieId'] == null) {
            throw new runtime.RequiredError(
                'movieId',
                'Required parameter "movieId" was null or undefined when calling update().'
            );
        }

        if (requestParameters['reviewId'] == null) {
            throw new runtime.RequiredError(
                'reviewId',
                'Required parameter "reviewId" was null or undefined when calling update().'
            );
        }

        if (requestParameters['saveMovieReviewRequest'] == null) {
            throw new runtime.RequiredError(
                'saveMovieReviewRequest',
                'Required parameter "saveMovieReviewRequest" was null or undefined when calling update().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearerAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/movies/{movie_id}/reviews/{review_id}`.replace(`{${"movie_id"}}`, encodeURIComponent(String(requestParameters['movieId']))).replace(`{${"review_id"}}`, encodeURIComponent(String(requestParameters['reviewId']))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: SaveMovieReviewRequestToJSON(requestParameters['saveMovieReviewRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => MovieReviewResponseFromJSON(jsonValue));
    }

    /**
     */
    async update(requestParameters: MovieReviewApiUpdateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<MovieReviewResponse> {
        const response = await this.updateRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
