import ListComponent from '@dashboard/components/ListComponent/ListComponent';
import LoadingComponent from '@dashboard/components/LoadingComponent/LoadingComponent';
import copy from 'copy-to-clipboard';
import {
  useCreateAccessTokenMutation,
  useMyAccessTokenConnectionQuery,
  useDeleteAccessTokenMutation,
  UserAccessToken,
} from '@graphql';
import {
  Alert,
  Button,
  Input,
  List,
  message,
  Modal,
  Popconfirm,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function AccessTokensComponent() {
  const { t } = useTranslation();
  const [newAccessToken, setNewAccessToken] = useState<
    Partial<UserAccessToken>
  >(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [memo, setMemo] = useState('');
  const {
    loading,
    data,
    refetch,
    fetchMore,
  } = useMyAccessTokenConnectionQuery();
  const [createAccessToken] = useCreateAccessTokenMutation({
    update(_, { data: { createAccessToken } }) {
      setMemo('');
      setModalVisible(false);
      setNewAccessToken(createAccessToken);
      refetch();
    },
  });
  const [deleteAccessToken] = useDeleteAccessTokenMutation({
    update(_, { data: { deleteAccessToken: res } }) {
      refetch();
      if (res) {
        message.success(t('messages.successDeleted'));
      }
    },
  });

  if (loading) {
    return <LoadingComponent />;
  }

  const {
    myAccessTokenConnection: {
      nodes: accessTokens,
      pageInfo: { hasNextPage, endCursor },
    },
  } = data;

  return (
    <>
      {newAccessToken && (
        <div className='mb-4'>
          <Alert
            type='success'
            showIcon
            closable
            message={t('dashboard.settingsPage.accessToken.generatedTips')}
            description={
              <>
                <Typography.Text className='block mb-2' type='danger'>
                  {t('dashboard.settingsPage.accessToken.securityTips')}
                </Typography.Text>
                <div className='flex'>
                  <Typography.Text code>{newAccessToken.value}</Typography.Text>
                  <Button
                    className='ml-2'
                    size='small'
                    onClick={() => {
                      copy(newAccessToken.value);
                      message.success(t('messages.successCopied'));
                    }}
                  >
                    {t('dashboard.settingsPage.accessToken.copyBtn')}
                  </Button>
                </div>
              </>
            }
          />
        </div>
      )}
      <div className='mb-4'>
        <Popconfirm
          title={t('dashboard.settingsPage.accessToken.confirmGenerateToken')}
          onConfirm={() => setModalVisible(true)}
        >
          <Button type='primary'>
            {t('dashboard.settingsPage.accessToken.generateToken')}
          </Button>
        </Popconfirm>
        <Modal
          title={t('dashboard.settingsPage.accessToken.generateToken')}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={() => createAccessToken({ variables: { input: { memo } } })}
          okButtonProps={{ disabled: !Boolean(memo) }}
        >
          <Input
            value={memo}
            placeholder={t(
              'dashboard.settingsPage.accessToken.memoPlaceholader',
            )}
            onChange={(e) => setMemo(e.currentTarget.value)}
          />
        </Modal>
      </div>
      <ListComponent
        loading={loading}
        hasNextPage={hasNextPage}
        fetchMore={() => fetchMore({ variables: { after: endCursor } })}
        dataSource={accessTokens}
        renderItem={(accessToken: Partial<UserAccessToken>) => (
          <List.Item
            key={accessToken.id}
            actions={[
              <Popconfirm
                title={t(
                  'dashboard.settingsPage.accessToken.deleteConfirmTips',
                )}
                onConfirm={() =>
                  deleteAccessToken({
                    variables: { input: { id: accessToken.id } },
                  })
                }
              >
                <Button size='small'>{t('common.deleteBtn')}</Button>
              </Popconfirm>,
            ]}
          >
            <div className='flex-1 line-clamp-1'>{accessToken.memo}</div>
            <div className='flex-1 '>
              <Typography.Text code>
                {accessToken.desensitizedValue}
              </Typography.Text>
            </div>
          </List.Item>
        )}
      />
    </>
  );
}
