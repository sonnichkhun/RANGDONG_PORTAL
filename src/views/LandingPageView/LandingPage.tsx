import { Col, Row, Spin } from 'antd';
import axios, { AxiosResponse } from 'axios';
import classNames from 'classnames';
import { SIGNALR_CHANNEL } from 'config/consts';
import { SignalRContext } from 'core/components/App/AppContext';
import useDefaultHeader from 'layouts/DefaultLayout/DefaultHeader/DefaultHeaderHook';
import userNotificationRepository from 'layouts/DefaultLayout/DefaultHeader/UserNotificationRepository';
import { AppUser } from 'models/AppUser';
import { AppUserSiteMapping } from 'models/AppUserSiteMapping';
import { UserNoticationFilter } from 'models/UserNoticationFilter';
import moment from 'moment';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { CSSTransition } from 'react-transition-group';
import { useGlobal } from 'reactn';
import { ButtonDropdown, DropdownToggle } from 'reactstrap';
import './LandingPage.scss';

function LandingPage() {
  const [user] = useGlobal<AppUser>('user');
  const signalRContext = useContext(SignalRContext);
  const date = moment().format('D');
  const month = moment().format('M');
  const days = [
    'Chủ nhật',
    'Thứ hai',
    'Thứ ba',
    'Thứ tư',
    'Thứ năm',
    'Thứ sáu',
    'Thứ bảy',
  ];
  const dayName = days[new Date().getDay()];

  const [weather, setWeather] = React.useState<any>(null);
  const [temp, setTemp] = React.useState<number>(null);
  const [translate] = useTranslation();
  const [description, setDescription] = React.useState<string[]>(null);
  const [unreadAll, setUnreadAll] = React.useState<number>(null);
  const [notificationFilter] = React.useState<
    UserNoticationFilter
  >(new UserNoticationFilter());

  const { loading, visibleMenuAction, handleToggleMenuAction, menuLandingPage } = useDefaultHeader(
    user,
    signalRContext,
    SIGNALR_CHANNEL,
    unreadAll,
  );

  const [loadingLandingPage, setLoadingLandingPage] = React.useState<boolean>(
    true,
  );

  React.useEffect(() => {
    if (user) {
      setLoadingLandingPage(false);
    }
  }, [user]);

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const URL = (`https://api.openweathermap.org/data/2.5/weather?lat=${`${position.coords.latitude}`}&lon=${`${position.coords.longitude}`}&units=metric&lang=vi&APPID=eeb187d817b5bd18a829c8eb10fe32a2`);

      await axios.get(URL)
        .then(async (response: AxiosResponse<any>) => {
          setWeather(response.data);
          const tmp = response.data.weather[0].description.split(' ');
          setDescription(tmp);
          setTemp(Math.round(response.data.main.temp));
        });
    });

    userNotificationRepository.countUnread(
      notificationFilter,
    ).then(res => {
      setUnreadAll(res);
    });

  }, [notificationFilter]);

  const startTime = React.useCallback(() => {
    const today = new Date();
    const h = today.getHours();
    let m = today.getMinutes();
    // let s = today.getSeconds();
    m = checkTime(m);
    // s = checkTime(s);
    document.getElementById('clock').innerHTML = h + ':' + m;
    setTimeout(startTime, 500);
  }, []);

  function checkTime(i) {
    if (i < 10) {
      i = '0' + i;
    } // add zero in front of numbers < 10
    return i;
  }

  const items = React.useMemo(
    () => (
      <React.Fragment>
        <div className={classNames('container-site d-flex')}>
          {user?.appUserSiteMappings?.length > 0 &&
            user?.appUserSiteMappings?.map(
              (item, i) =>
                item?.enabled &&
                item.siteId < 100 && (
                  <SiteCard key={i} item={item} index={i} />
                ),
            )}
        </div>
      </React.Fragment>
    ),
    [user],
  );

  return (
    <>
      <CSSTransition
        in={!loadingLandingPage}
        timeout={100}
        classNames="landing-page"
        unmountOnExit
        onLoad={startTime}
      >
        <div className="landing-page">
          <Row className="header">
            <Col span={12}>
              <div className="d-flex align-items-center justify-content-start">
                {user?.appUserSiteMappings?.length > 0 &&
                  user?.appUserSiteMappings?.map(
                    item =>
                      item?.enabled &&
                      item.siteId === 100 && (
                        <div className="logo" key={item?.siteId}>
                          <img
                            src={item.site.icon}
                            alt={'noImage'}
                            width="100"
                          />
                        </div>
                      ),
                  )}
              </div>
            </Col>
            <Col span={12}>
              <div className="actions d-flex justify-content-end">
                <Spin spinning={loading}>
                  <div className="d-flex align-items-center welcome-display-name">
                    Welcome back {user?.displayName}
                    <ButtonDropdown
                      direction="right"
                      isOpen={visibleMenuAction}
                      toggle={handleToggleMenuAction}
                    >
                      <DropdownToggle className="btn btn-toggle-action pt-0 pb-0 pl-3 pr-2">
                        <i className="tio tio-menu_hamburger ml-3" />

                      </DropdownToggle>
                      {menuLandingPage}
                    </ButtonDropdown>
                    {/* <Dropdown
                      overlay={menu}
                      trigger={['click']}
                      className="pt-2 pb-2 mt-0"
                      placement="bottomRight"
                    >
                      <div className="button-hover" >
                        <i className="tio tio-menu_hamburger ml-3" />
                      </div>
                    </Dropdown> */}
                  </div>
                </Spin>
              </div>
            </Col>
          </Row>
          <Row className="full-box full-box-1">
            <Col span={8} />
            <Col span={8}>
              <div className="box-weather mt-3 ">
                {weather && (
                  <div className="weather mr-5">

                    <div className="d-flex des">

                      {temp}
                      <div className="temperature">o</div>
                      <span>C</span>
                    </div>
                    <div className="temperature-des">
                      <span className="temperature-des-first">{description && description?.length > 0 && description[0]}</span>
                      {
                        description && description.length > 0 && description.map((value, index) => (
                          <span key={index}>
                            {
                              index > 0 && (
                                <> {value}</>
                              )
                            }
                          </span>
                        ))
                      }
                      <span>, <span>{translate('general.landingPage.humidity')}</span> {weather?.main?.humidity}%</span>
                    </div>

                  </div>
                )}

                <div className="welcome" key={user?.id}>
                  <span id="clock" className="landing-page-time" />
                  <div className="landing-page-date-time">
                    {dayName}, {date} tháng {month}
                  </div>
                </div>
              </div>
            </Col>
            <Col span={8} />
          </Row>

          <Row className="full-box full-box-2 mt-5">
            <Col span={7} />
            <Col span={10}>
              {items}
            </Col>
            <Col span={7} />
          </Row>

        </div>
      </CSSTransition>
      <CSSTransition
        in={loadingLandingPage}
        timeout={100}
        classNames="landing-page-mask"
        unmountOnExit
      >
        <div id="loader-wrapper">
          <div id="loader"></div>

          <div className="loader-section section-left"></div>
          <div className="loader-section section-right"></div>
        </div>
      </CSSTransition>
    </>
  );
}

export interface SiteCardProps {
  index: number;
  item: AppUserSiteMapping;
}

export function SiteCard(props: AppUserSiteMapping) {
  const { item, index } = props;
  const [unread, setUnread] = React.useState<number>(0);
  const [loadingUnread, setLoadingUnread] = React.useState<boolean>(false);

  const handleClickSite = React.useCallback(() => {
    window.location.href = `${item?.site?.code}`;
  }, [item]);

  const firstLoad = React.useRef<boolean>(true);

  React.useEffect(() => {
    if (item?.siteId && item?.siteId < 100 && firstLoad.current) {
      firstLoad.current = false;
      const filter = {
        ...new UserNoticationFilter(),
        siteId: { equal: item.siteId },
      };
      setLoadingUnread(true);
      userNotificationRepository
        .countUnread(filter)
        .then((count: number) => {
          if (count > 0) setUnread(count);
        })
        .finally(() => {
          setLoadingUnread(false);
        });
    }
  }, [item]);

  const animationDelay = React.useMemo(() => `${(index as number) * 120}ms`, [
    index,
  ]);

  return (
    <div className="landing-page-site mt-3 mb-3" style={{ animationDelay }}>
      <div
        className={`box-site`}
        key={item?.siteId}
      >
        {
          unread !== null && unread !== 0 && (
            <span
              className={`noti-right mt-3`}
              key={item?.siteId}
            >
              <span
                className={`toggle-noti-badge-${item?.site.code.split('/')[1]}`}
              >
                {loadingUnread ? (
                  <Spin spinning={loadingUnread} size="small" />
                ) : (
                    unread
                  )}
              </span>
            </span>
          )
        }


        <div className="first-box mt-3">

          {/* eslint-disable-next-line */}
          <a
            href="#"
            onClick={handleClickSite}
            className="d-flex align-items-center"
          >
            <div className={item?.site.code.split('/')[1]}>
              <img
                className="icon"
                src={item?.site.icon}
                alt=""
              />
            </div>

          </a>
        </div>
        <div className={`text-under`}>
          {item?.site.name}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
