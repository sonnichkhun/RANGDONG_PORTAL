import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import {BatchId, PureModelData} from 'react3l';
import {httpConfig} from 'config/http';
import {API_BASE_URL} from 'core/config';

import {API_WARD_ROUTE} from 'config/api-consts';
import { Ward } from 'models/Ward';
import { WardFilter } from 'models/WardFilter';
import { District } from 'models/District';
import { DistrictFilter } from 'models/DistrictFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';

export class WardRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_WARD_ROUTE));
  }

  public count = (wardFilter?: WardFilter): Promise<number> => {
    return this.http.post<number>(kebabCase(nameof(this.count)), wardFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (wardFilter?: WardFilter): Promise<Ward[]> => {
    return this.http.post<Ward[]>(kebabCase(nameof(this.list)), wardFilter)
      .then((response: AxiosResponse<Ward[]>) => {
        return response.data?.map((ward: PureModelData<Ward>) =>  Ward.clone<Ward>(ward));
    });
  };

  public get = (id: number | string): Promise<Ward> => {
    return this.http.post<Ward>
      (kebabCase(nameof(this.get)), { id })
        .then((response: AxiosResponse<Ward>) => Ward.clone<Ward>(response.data));
  };

  public create = (ward: Ward): Promise<Ward> => {
    return this.http.post<Ward>(kebabCase(nameof(this.create)), ward)
      .then((response: AxiosResponse<PureModelData<Ward>>) => Ward.clone<Ward>(response.data));
  };

  public update = (ward: Ward): Promise<Ward> => {
    return this.http.post<Ward>(kebabCase(nameof(this.update)), ward)
      .then((response: AxiosResponse<Ward>) => Ward.clone<Ward>(response.data));
  };

  public delete = (ward: Ward): Promise<Ward> => {
      return this.http.post<Ward>(kebabCase(nameof(this.delete)), ward)
        .then((response: AxiosResponse<Ward>) => Ward.clone<Ward>(response.data));
  };

  public save = (ward: Ward): Promise<Ward> => {
      return ward.id ? this.update(ward) : this.create(ward);
  };

  public singleListDistrict = (districtFilter: DistrictFilter): Promise<District[]> => {
      return this.http.post<District[]>(kebabCase(nameof(this.singleListDistrict)), districtFilter)
        .then((response: AxiosResponse<District[]>) => {
          return response.data.map((district: PureModelData<District>) => District.clone<District>(district));
        });
  };

  public filterListDistrict = (districtFilter: DistrictFilter): Promise<District[]> => {
    return this.http.post<District[]>(kebabCase(nameof(this.filterListDistrict)), districtFilter)
      .then((response: AxiosResponse<District[]>) => {
        return response.data.map((district: PureModelData<District>) => District.clone<District>(district));
      });
};
  public singleListStatus = (): Promise<Status[]> =>
  {
      return this.http.post<Status[]>(kebabCase(nameof(this.singleListStatus)), new StatusFilter())
        .then((response: AxiosResponse<Status[]>) => {
          return response.data.map((status: PureModelData<Status>) => Status.clone<Status>(status));
      });
  };


  public bulkDelete = (idList: BatchId): Promise<void> => {
    return this.http.post(kebabCase(nameof(this.bulkDelete)), idList)
    .then((response: AxiosResponse<void>) => response.data);
  };

  public import = (file: File, name: string = nameof(file)): Promise<void> => {
    const formData: FormData = new FormData();
    formData.append(name, file);
    return this.http.post<void>(kebabCase(nameof(this.import)), formData)
      .then((response: AxiosResponse<void>) => response.data);
    };
  }

  export const wardRepository: Ward = new WardRepository();
