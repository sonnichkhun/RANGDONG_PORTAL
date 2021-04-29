import { SexFilter } from 'models/SexFilter';
import { Sex } from 'models/Sex';
import { PureModelData } from 'react3l';
import { ProvinceFilter } from './../../models/ProvinceFilter';
import { AppUser } from 'models/AppUser';
import { AxiosResponse } from 'axios';
import { url } from 'core/helpers/string';
import { Repository } from './../../core/repositories/Repository';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { API_PROFILE_ROUTE } from 'config/api-consts';
import kebabCase from 'lodash/kebabCase';
import nameof from 'ts-nameof.macro';
import { Province } from 'models/Province';
export class ProfileRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_PROFILE_ROUTE));
  }

  public update = (profile: AppUser): Promise<AppUser> => {
    return this.http
      .post<AppUser>(kebabCase(nameof(this.update)), profile)
      .then((response: AxiosResponse<AppUser>) =>
        AppUser.clone<AppUser>(response.data),
      );
  };

  public get = (): Promise<AppUser> => {
    return this.http
      .post<AppUser>(kebabCase(nameof(this.get)))
      .then((response: AxiosResponse<AppUser>) =>
        AppUser.clone<AppUser>(response.data),
      );
  };

  public singleListProvince = (
    provinceFilter: ProvinceFilter,
  ): Promise<Province[]> => {
    return this.http
      .post<Province[]>(
        kebabCase(nameof(this.singleListProvince)),
        provinceFilter,
      )
      .then((response: AxiosResponse<Province[]>) => {
        return response.data.map((province: PureModelData<Province>) =>
          Province.clone<Province>(province),
        );
      });
  };
  public singleListSex = (): Promise<Sex[]> => {
    return this.http
      .post<Sex[]>(kebabCase(nameof(this.singleListSex)), new SexFilter())
      .then((response: AxiosResponse<Sex[]>) => {
        return response.data.map((sex: PureModelData<Sex>) =>
          Sex.clone<Sex>(sex),
        );
      });
  };

  public changePassword = (appUser: AppUser): Promise<AppUser> => {
    return this.http
      .post<AppUser>(kebabCase(nameof(this.changePassword)), appUser)
      .then((response: AxiosResponse<AppUser>) =>
        AppUser.clone<AppUser>(response.data),
      );
  };

  public saveImage = (
    file: File,
    params?: { [key: string]: any },
  ): Promise<string> => {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http
      .post(kebabCase(nameof(this.saveImage)), formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params,
      })
      .then((response: AxiosResponse<string>) => response.data);
  };
}

export const profileRepository: AppUser = new ProfileRepository();
