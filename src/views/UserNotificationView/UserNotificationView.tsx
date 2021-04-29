import React, { useState, useCallback, useEffect } from 'react';
import { Card, Row, Col, Spin } from 'antd';
import './UserNotificationView.scss';
import { useTranslation } from 'react-i18next';
import { generalLanguageKeys } from 'config/consts';
import { UserNotification } from 'models/UserNotication';
import userNotificationRepository from './UserNotificationRepository';
import { UserNoticationFilter } from 'models/UserNoticationFilter';
import InfiniteScroll from 'react-infinite-scroller';
import { debounce } from 'core/helpers/debounce';
import { formatDateTime } from 'core/helpers/date-time';
import { Link } from 'react-router-dom';
import { buildAbsoluteLink } from 'core/helpers/string';
import { DEFAULT_TAKE } from 'core/config';
function Notification() {
  const [translate] = useTranslation();
  const {
    notifications,
    loadingNotification,
    handleLoadReadNotifications,
    handleLoadAllNotifications,
    handleReadNotifications,
    handleInfiniteOnLoad,
    hasMore,
    total,
  } = useUserNotification();

  return (
    <>
      <div className="page master-page user-notification">
        <Card
          title={
            <div className="ml-3">{translate('appUsers.master.title')}</div>
          }
        >
          <Row className="ml-3 mb-4">
            <button
              className="btn btn-sm btn-primary mr-2"
              onClick={handleLoadAllNotifications}
            >
              {translate('general.placeholder.title')}
            </button>
            <button
              className="btn btn-sm btn-outline-primary ml-2"
              onClick={handleLoadReadNotifications}
            >
              {translate(generalLanguageKeys.actions.seen)}
            </button>
          </Row>
          {notifications.length > 0 && (
            <div
              className="infinite-container"
              style={{
                height: '600px',
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
            >
              <InfiniteScroll
                initialLoad={false}
                loadMore={handleInfiniteOnLoad}
                hasMore={!loadingNotification && hasMore}
                threshold={20}
                useWindow={false}
                pageStart={0}
              >
                {notifications.map(userNotification => (
                  <Link
                    key={userNotification.id}
                    to="#"
                    onClick={handleReadNotifications(
                      userNotification.id,
                      userNotification.linkWebsite
                        ? `${buildAbsoluteLink(userNotification.linkWebsite)}`
                        : '#',
                    )}
                  >
                    <Row
                      className="notification ml-3 mr-3 mb-3"
                      key={userNotification?.id}
                    >
                      <Col lg={12}>
                        <div className="d-flex align-items-center">
                          {userNotification?.unread === true ? (
                            <>
                              {
                                userNotification?.siteId === 2 && (
                                  <div className="icon-noti-dms ml-1 mr-3">
                                    <i className="tio-shop_outlined" />
                                  </div>
                                )
                              }

                              {
                                userNotification?.siteId === 1 && (
                                  <div className="icon-noti-portal ml-1 mr-3">
                                    <i className="tio-shop_outlined" />
                                  </div>
                                )
                              }

                              {
                                userNotification?.siteId === 3 && (
                                  <div className="icon-noti-crm ml-1 mr-3">
                                    <i className="tio-shop_outlined" />
                                  </div>
                                )
                              }

                              {
                                userNotification?.siteId === 4 && (
                                  <div className="icon-noti-report ml-1 mr-3">
                                    <i className="tio-shop_outlined" />
                                  </div>
                                )
                              }
                            </>
                          ) : (
                              <>
                                <div
                                  className="icon-noti-read mr-3"
                                >
                                  <span>
                                    <i className="tio-shop_outlined" />
                                  </span>
                                </div>
                              </>
                            )}

                          <span className="unread">
                            {userNotification.contentWeb}
                          </span>
                        </div>
                      </Col>
                      <Col lg={12}>
                        <div className="d-flex justify-content-end mt-3">
                          <b>{formatDateTime(userNotification.time)}</b>
                        </div>
                      </Col>
                    </Row>
                  </Link>
                ))}
                {!hasMore && (
                  <div
                    className="d-flex justify-content-center p-2"
                    style={{ background: '#e8e8e8', fontSize: 12 }}
                  >
                    Đã hiển thị tất cả <b>&nbsp;{total}&nbsp;</b> thông báo
                  </div>
                )}
              </InfiniteScroll>
            </div>
          )}
          {loadingNotification && (
            <div
              className="d-flex justify-content-center"
              style={{ width: '100%' }}
            >
              <div className="loading-container">
                <Spin spinning={loadingNotification} />
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

function useUserNotification() {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [fetchAllNotification, setFetchAllNotification] = useState<boolean>(
    true,
  );
  const [filterType, setFilterType] = useState<string>('all');
  const [loadingNotification, setLoadingNotification] = useState<boolean>(
    false,
  );
  const [notificationFilter, setNotificationFilter] = useState<
    UserNoticationFilter
  >(new UserNoticationFilter());
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const cancelled = false;
    if (fetchAllNotification) {
      const fetch = async () => {
        await setLoadingNotification(true);
        let data = [];
        let count = 0;
        switch (filterType) {
          case 'all': {
            data = await userNotificationRepository.list(notificationFilter);
            count = await userNotificationRepository.count(notificationFilter);
            break;
          }
          case 'read': {
            data = await userNotificationRepository.listRead(
              notificationFilter,
            );
            count = await userNotificationRepository.countRead(
              notificationFilter,
            );
            break;
          }
        }
        if (!cancelled) {
          await setNotifications([...data]);
          await setTotal(count);
        }
        await setFetchAllNotification(false);
        await setLoadingNotification(false);
      };
      fetch();
    }
  }, [fetchAllNotification, filterType, notificationFilter]);

  const handleLoadAllNotifications = useCallback(() => {
    // some async request here
    setNotificationFilter({
      ...notificationFilter,
      skip: 0,
      take: DEFAULT_TAKE,
    });
    setFilterType('all');
    setHasMore(true);
    setFetchAllNotification(true);
  }, [notificationFilter]);

  const handleLoadReadNotifications = useCallback(() => {
    // some async request here
    setNotificationFilter({
      ...notificationFilter,
      skip: 0,
      take: DEFAULT_TAKE,
    });
    setFilterType('read');
    setHasMore(true);
    setFetchAllNotification(true);
  }, [notificationFilter]);

  const handleReadNotifications = useCallback((id: number, url: string) => {
    // some async request here
    return async ev => {
      ev.preventDefault();
      await userNotificationRepository.read(id);
      window.location.href = url;
    };
  }, []);

  /* handleInfiniteOnLoad */
  const handleInfiniteOnLoad = useCallback(
    debounce(() => {
      if (notificationFilter.skip + 10 >= total) {
        setLoadingNotification(false);
        setHasMore(false);
        return;
      }
      /* fetch notification with effect */
      const fetch = async () => {
        await setLoadingNotification(true);
        let data = [];
        switch (filterType) {
          case 'all': {
            data = await userNotificationRepository.list({
              ...notificationFilter,
              skip: notificationFilter.skip + 10,
            });
            break;
          }
          case 'read': {
            data = await userNotificationRepository.listRead({
              ...notificationFilter,
              skip: notificationFilter.skip + 10,
            });
            break;
          }
        }
        await setNotifications([...notifications, ...data]);
        await setNotificationFilter({
          ...notificationFilter,
          skip: notificationFilter.skip + 10,
        });
        await setLoadingNotification(false);
      };
      fetch();
    }),
    [total, notificationFilter, notifications],
  );

  return {
    notifications,
    loadingNotification,
    handleLoadReadNotifications,
    handleLoadAllNotifications,
    handleReadNotifications,
    handleInfiniteOnLoad,
    total,
    hasMore,
  };
}

export default Notification;
