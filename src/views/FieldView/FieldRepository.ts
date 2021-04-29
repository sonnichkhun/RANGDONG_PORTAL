import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import {BatchId, PureModelData} from 'react3l';
import {httpConfig} from 'config/http';
import {API_BASE_URL} from 'core/config';

import {API_FIELD_ROUTE} from 'config/api-consts';
import { Field } from 'models/Field';
import { FieldFilter } from 'models/FieldFilter';
import { Menu } from 'models/Menu';
import { MenuFilter } from 'models/MenuFilter';

export class FieldRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_FIELD_ROUTE));
  }

  public count = (fieldFilter?: FieldFilter): Promise<number> => {
    return this.http.post<number>(kebabCase(nameof(this.count)), fieldFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (fieldFilter?: FieldFilter): Promise<Field[]> => {
    return this.http.post<Field[]>(kebabCase(nameof(this.list)), fieldFilter)
      .then((response: AxiosResponse<Field[]>) => {
        return response.data?.map((field: PureModelData<Field>) =>  Field.clone<Field>(field));
    });
  };

  public get = (id: number | string): Promise<Field> => {
    return this.http.post<Field>
      (kebabCase(nameof(this.get)), { id })
        .then((response: AxiosResponse<Field>) => Field.clone<Field>(response.data));
  };

  public create = (field: Field): Promise<Field> => {
    return this.http.post<Field>(kebabCase(nameof(this.create)), field)
      .then((response: AxiosResponse<PureModelData<Field>>) => Field.clone<Field>(response.data));
  };

  public update = (field: Field): Promise<Field> => {
    return this.http.post<Field>(kebabCase(nameof(this.update)), field)
      .then((response: AxiosResponse<Field>) => Field.clone<Field>(response.data));
  };

  public delete = (field: Field): Promise<Field> => {
      return this.http.post<Field>(kebabCase(nameof(this.delete)), field)
        .then((response: AxiosResponse<Field>) => Field.clone<Field>(response.data));
  };

  public save = (field: Field): Promise<Field> => {
      return field.id ? this.update(field) : this.create(field);
  };

  public singleListMenu = (menuFilter: MenuFilter): Promise<Menu[]> => {
      return this.http.post<Menu[]>(kebabCase(nameof(this.singleListMenu)), menuFilter)
        .then((response: AxiosResponse<Menu[]>) => {
          return response.data.map((menu: PureModelData<Menu>) => Menu.clone<Menu>(menu));
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

  export const fieldRepository: Field = new FieldRepository();