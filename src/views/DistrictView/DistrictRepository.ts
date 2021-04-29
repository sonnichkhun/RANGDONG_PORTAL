import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import {BatchId, PureModelData} from 'react3l';
import {httpConfig} from 'config/http';
import {API_BASE_URL} from 'core/config';

import {API_DISTRICT_ROUTE} from 'config/api-consts';
import { District } from 'models/District';
import { DistrictFilter } from 'models/DistrictFilter';
import { Province } from 'models/Province';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';

export class DistrictRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_DISTRICT_ROUTE));
  }

  public count = (districtFilter?: DistrictFilter): Promise<number> => {
    return this.http.post<number>(kebabCase(nameof(this.count)), districtFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (districtFilter?: DistrictFilter): Promise<District[]> => {
    return this.http.post<District[]>(kebabCase(nameof(this.list)), districtFilter)
      .then((response: AxiosResponse<District[]>) => {
        return response.data?.map((district: PureModelData<District>) =>  District.clone<District>(district));
    });
  };

  public get = (id: number | string): Promise<District> => {
    return this.http.post<District>
      (kebabCase(nameof(this.get)), { id })
        .then((response: AxiosResponse<District>) => District.clone<District>(response.data));
  };

  public create = (district: District): Promise<District> => {
    return this.http.post<District>(kebabCase(nameof(this.create)), district)
      .then((response: AxiosResponse<PureModelData<District>>) => District.clone<District>(response.data));
  };

  public update = (district: District): Promise<District> => {
    return this.http.post<District>(kebabCase(nameof(this.update)), district)
      .then((response: AxiosResponse<District>) => District.clone<District>(response.data));
  };

  public delete = (district: District): Promise<District> => {
      return this.http.post<District>(kebabCase(nameof(this.delete)), district)
        .then((response: AxiosResponse<District>) => District.clone<District>(response.data));
  };

  public save = (district: District): Promise<District> => {
      return district.id ? this.update(district) : this.create(district);
  };

  public singleListProvince = (provinceFilter: ProvinceFilter): Promise<Province[]> => {
      return this.http.post<Province[]>(kebabCase(nameof(this.singleListProvince)), provinceFilter)
        .then((response: AxiosResponse<Province[]>) => {
          return response.data.map((province: PureModelData<Province>) => Province.clone<Province>(province));
        });
  };

  public filterListProvince = (provinceFilter: ProvinceFilter): Promise<Province[]> => {
    return this.http.post<Province[]>(kebabCase(nameof(this.filterListProvince)), provinceFilter)
      .then((response: AxiosResponse<Province[]>) => {
        return response.data.map((province: PureModelData<Province>) => Province.clone<Province>(province));
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

  export const districtRepository: District = new DistrictRepository();
