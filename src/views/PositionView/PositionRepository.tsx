import { Repository } from 'core/repositories/Repository';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { API_POSITION_ROUTE } from 'config/api-consts';
import { url } from 'core/helpers/string';
import kebabCase from 'lodash/kebabCase';
import { AxiosResponse } from 'axios';
import { PureModelData, BatchId } from 'react3l';
import { Position } from 'models/Position';
import { PositionFilter } from 'models/PositionFilter';
import { StatusFilter } from 'models/StatusFilter';
import { Status } from 'models/Status';
import nameof from 'ts-nameof.macro';
export class PositionRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_POSITION_ROUTE));
  }

  public count = (positionFilter?: PositionFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), positionFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (positionFilter?: PositionFilter): Promise<Position[]> => {
    return this.http
      .post<Position[]>(kebabCase(nameof(this.list)), positionFilter)
      .then((response: AxiosResponse<Position[]>) => {
        return response.data?.map((position: PureModelData<Position>) =>
          Position.clone<Position>(position),
        );
      });
  };

  public get = (id: number | string): Promise<Position> => {
    return this.http
      .post<Position>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<Position>) => Position.clone<Position>(response.data));
  };

  public create = (position: Position): Promise<Position> => {
    return this.http
      .post<Position>(kebabCase(nameof(this.create)), position)
      .then((response: AxiosResponse<PureModelData<Position>>) =>
        Position.clone<Position>(response.data),
      );
  };

  public update = (position: Position): Promise<Position> => {
    return this.http
      .post<Position>(kebabCase(nameof(this.update)), position)
      .then((response: AxiosResponse<Position>) => Position.clone<Position>(response.data));
  };


  public delete = (position: Position): Promise<Position> => {
    return this.http
      .post<Position>(kebabCase(nameof(this.delete)), position)
      .then((response: AxiosResponse<Position>) => Position.clone<Position>(response.data));
  };

  public save = (position: Position): Promise<Position> => {
    return position.id ? this.update(position) : this.create(position);
  };

  public singleListStatus = (): Promise<Status[]> => {
    return this.http.post<Status[]>(kebabCase(nameof(this.singleListStatus)), new StatusFilter())
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) => Status.clone<Status>(status));
      });
  };



  public singleListPosition = (filter: PositionFilter): Promise<Position[]> => {
    return this.http
      .post<Position[]>(kebabCase(nameof(this.singleListPosition)), filter)
      .then((response: AxiosResponse<Position[]>) => {
        return response.data.map((position: PureModelData<Position>) =>
          Position.clone<Position>(position),
        );
      });
  };

  public bulkDelete = (idList: BatchId): Promise<void> => {
    return this.http
      .post(kebabCase(nameof(this.bulkDelete)), idList)
      .then((response: AxiosResponse<void>) => response.data);
  };


}
export const positionRepository: Position = new PositionRepository();
