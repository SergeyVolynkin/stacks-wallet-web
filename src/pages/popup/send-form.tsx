import React, { memo, useCallback, useState } from 'react';
import { Box, Text, Button, Stack } from '@stacks/ui';
import { Formik, useFormikContext } from 'formik';

import { PopupContainer } from '@components/popup/container';
import { ConfirmSendDrawer } from '@components/drawer/confirm-send-drawer';
import { useDoChangeScreen } from '@common/hooks/use-do-change-screen';

import { ScreenPaths } from '@store/common/types';
import { ErrorLabel } from '@components/error-label';
import { AssetSearch } from '@components/asset-search/asset-search';

import { Header } from '@components/header';
import { useSelectedAsset } from '@common/hooks/use-selected-asset';

import { useRevalidateApi } from '@common/hooks/use-revalidate-api';
import { useSendFormValidation } from '@common/hooks/use-send-form-validation';
import { AmountField } from '@components/send-form/amount-field';
import { RecipientField } from '@components/send-form/recipient-field';
import { MemoField } from '@components/send-form/memo-field';
import { useTransferableAssets } from '@common/hooks/use-assets';

type Amount = number | '';

export interface FormValues {
  amount: Amount;
  recipient: string;
  memo: string;
}

const initialValues: FormValues = {
  amount: '',
  recipient: '',
  memo: '',
};

interface SendFormProps {
  assetError: string | undefined;
  setAssetError: (error: string | undefined) => void;
}

const SendForm = (props: SendFormProps) => {
  const { assetError } = props;

  const doChangeScreen = useDoChangeScreen();
  const revalidate = useRevalidateApi();
  const { selectedAsset } = useSelectedAsset();
  const assets = useTransferableAssets();

  const { handleSubmit, handleChange, values, setFieldValue, setErrors, setValues, errors } =
    useFormikContext<FormValues>();

  const onChange = useCallback(
    (e: React.ChangeEvent<any>) => {
      setErrors({});
      handleChange(e);
    },
    [setErrors, handleChange]
  );

  const onSubmit = useCallback(async () => {
    if (values.amount && values.recipient && selectedAsset) {
      await revalidate(); // we want up to date data
      handleSubmit();
    }
  }, [revalidate, handleSubmit, values, selectedAsset]);

  const onItemClick = useCallback(() => {
    if (assets.contents === 1) {
      return;
    }
    setValues({ ...values, amount: '' });
  }, [assets.contents, setValues, values]);

  const hasValues = values.amount && values.recipient !== '';

  return (
    <PopupContainer
      header={<Header title="Send" onClose={() => doChangeScreen(ScreenPaths.POPUP_HOME)} />}
    >
      <Stack spacing="loose" flexDirection="column" flexGrow={1}>
        <AssetSearch onItemClick={onItemClick} />
        <AmountField
          setFieldValue={setFieldValue}
          value={values.amount || 0}
          onChange={onChange}
          error={errors.amount}
        />
        <RecipientField error={errors.recipient} value={values.recipient} onChange={onChange} />
        {selectedAsset?.hasMemo && (
          <MemoField value={values.memo} error={errors.memo} onChange={onChange} />
        )}
        <Box mt="auto">
          {assetError && (
            <ErrorLabel mb="base">
              <Text textStyle="caption">{assetError}</Text>
            </ErrorLabel>
          )}
          <Button borderRadius="12px" width="100%" onClick={onSubmit} isDisabled={!hasValues}>
            Preview
          </Button>
        </Box>
      </Stack>
    </PopupContainer>
  );
};

export const PopupSendForm: React.FC = memo(() => {
  const [isShowing, setShowing] = useState(false);
  const [assetError, setAssetError] = useState<string | undefined>();
  const { selectedAsset } = useSelectedAsset();

  const onValidate = useSendFormValidation({ setAssetError });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={values => {
        if (values.amount && values.recipient && values.recipient !== '' && selectedAsset)
          if (!assetError) {
            setShowing(true);
          }
      }}
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={false}
      validate={onValidate}
    >
      {form => (
        <>
          <React.Suspense fallback={<></>}>
            <ConfirmSendDrawer
              onClose={() => {
                setShowing(false);
                form.setSubmitting(false);
              }}
              {...form.values}
              amount={form.values.amount || 0}
              isShowing={isShowing}
            />
          </React.Suspense>
          <React.Suspense fallback={<></>}>
            <SendForm setAssetError={setAssetError} assetError={assetError} />
          </React.Suspense>
        </>
      )}
    </Formik>
  );
});
