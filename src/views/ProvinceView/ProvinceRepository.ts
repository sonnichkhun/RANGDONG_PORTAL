import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import {BatchId, PureModelData} from 'react3l';
import {httpConfig} from 'config/http';
import {API_BASE_URL} from 'core/config';

import {API_PROVINCE_ROUTE} from 'config/api-consts';
import { Province } from 'models/Province';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';

export class ProvinceRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_PROVINCE_ROUTE));
  }

  public count = (provinceFilter?: ProvinceFilter): Promise<number> => {
    return this.http.post<number>(kebabCase(nameof(this.count)), provinceFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (provinceFilter?: ProvinceFilter): Promise<Province[]> => {
    return this.http.post<Province[]>(kebabCase(nameof(this.list)), provinceFilter)
      .then((response: AxiosResponse<Province[]>) => {
        return response.data?.map((province: PureModelData<Province>) =>  Province.clone<Province>(province));
    });
  };

  public get = (id: number | string): Promise<Province> => {
    return this.http.post<Province>
      (kebabCase(nameof(this.get)), { id })
        .then((response: AxiosResponse<Province>) => Province.clone<Province>(response.data));
  };

  public create = (province: Province): Promise<Province> => {
    return this.http.post<Province>(kebabCase(nameof(this.create)), province)
      .then((response: AxiosResponse<PureModelData<Province>>) => Province.clone<Province>(response.data));
  };

  public update = (province: Province): Promise<Province> => {
    return this.http.post<Province>(kebabCase(nameof(this.update)), province)
      .then((response: AxiosResponse<Province>) => Province.clone<Province>(response.data));
  };

  public delete = (province: Province): Promise<Province> => {
      return this.http.post<Province>(kebabCase(nameof(this.delete)), province)
        .then((response: AxiosResponse<Province>) => Province.clone<Province>(response.data));
  };

  public save = (province: Province): Promise<Province> => {
      return province.id ? this.update(province) : this.create(province);
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
  public export = (provinceFilter?: ProvinceFilter): Promise<AxiosResponse<any>> => {
    return this.http.post('export', provinceFilter, {
      responseType: 'arraybuffer',
    });
  };

  public import = (file: File, name: string = nameof(file)): Promise<void> => {
    const formData: FormData = new FormData();
    formData.append(name, file);
    return this.http.post<void>(kebabCase(nameof(this.import)), formData)
      .then((response: AxiosResponse<void>) => response.data);
    };
  }

  export const provinceRepository: Province = new ProvinceRepository();