import { SiteFilter } from './../../models/SiteFilter';
import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { PureModelData } from 'react3l';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';

import { API_SITE_ROUTE } from 'config/api-consts';
import { Site } from 'models/Site';

export class SiteRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_SITE_ROUTE));
  }

  public count = (siteFilter?: SiteFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), siteFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (siteFilter?: SiteFilter): Promise<Site[]> => {
    return this.http
      .post<Site[]>(kebabCase(nameof(this.list)), siteFilter)
      .then((response: AxiosResponse<Site[]>) => {
        return response.data?.map((site: PureModelData<Site>) =>
          Site.clone<Site>(site),
        );
      });
  };

  public get = (id: number | string): Promise<Site> => {
    return this.http
      .post<Site>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<Site>) => Site.clone<Site>(response.data));
  };


  public create = (site: Site): Promise<Site> => {
    return this.http
      .post<Site>(kebabCase(nameof(this.create)), site)
      .then((response: AxiosResponse<PureModelData<Site>>) =>
      Site.clone<Site>(response.data),
      );
  };

  public update = (site: Site): Promise<Site> => {
    return this.http
      .post<Site>(kebabCase(nameof(this.update)), site)
      .then((response: AxiosResponse<Site>) => Site.clone<Site>(response.data));
  };
  public save = (site: Site): Promise<Site> => {
    return site.id ? this.update(site) : this.create(site);
  };
}

export const siteRepository: Site = new SiteRepository();
