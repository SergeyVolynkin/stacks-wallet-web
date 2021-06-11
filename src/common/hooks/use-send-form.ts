import { FormikProps } from 'formik';

import { useFetchBalances } from '@common/hooks/account/use-account-info';
import { useSelectedAsset } from '@common/hooks/use-selected-asset';
import { usePrevious } from '@stacks/ui';
import { useAssets } from '@common/hooks/use-assets';
import React, { useCallback, useEffect } from 'react';
import { microStxToStx } from '@common/stacks-utils';
import { FormValues } from '@pages/popup/send-form';
import { removeCommas } from '@common/token-utils';
import { STX_TRANSFER_TX_SIZE_BYTES } from '@common/constants';
import { useCurrentFee } from './transaction/use-current-fee';
import BigNumber from 'bignumber.js';

export function useSendAmountFieldActions({
  setFieldValue,
}: Pick<FormikProps<FormValues>, 'setFieldValue'>) {
  const balances = useFetchBalances();
  const { selectedAsset, balance } = useSelectedAsset();
  const fee = useCurrentFee();
  const isStx = selectedAsset?.type === 'stx';

  const handleSetSendMax = useCallback(() => {
    if (!selectedAsset || !balances.value) return;
    if (isStx) {
      const availableBalance = new BigNumber(balances.value.stx.balance).minus(
        balances.value.stx.locked
      );
      const txFee = microStxToStx(
        new BigNumber(fee ?? 1).multipliedBy(STX_TRANSFER_TX_SIZE_BYTES).toString()
      );
      const stx = microStxToStx(availableBalance.toString()).minus(txFee);
      setFieldValue('amount', stx.toNumber());
    } else {
      if (balance) setFieldValue('amount', removeCommas(balance));
    }
  }, [selectedAsset, balances.value, isStx, fee, setFieldValue, balance]);

  const handleOnKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const hasDecimals = typeof selectedAsset?.meta?.decimals === 'number';
      const { key } = event;
      const value = event.currentTarget.value;
      // leading zeros
      if (
        selectedAsset?.type !== 'stx' &&
        // if no leading 0 of we don't know the status of decimals
        ((key === '0' && value.length === 0 && !hasDecimals) ||
          // only one leading zero allowed
          (key === '0' && value[0] === '0' && value[1] !== '.'))
      )
        return event.preventDefault();
      // decimals check
      if (key === '.') {
        if (!hasDecimals && selectedAsset?.type !== 'stx') return event.preventDefault();
        const hasPeriod = value.includes('.');
        // only one period allowed
        if (hasPeriod && key === '.') {
          return event.preventDefault();
        }
      }
    },
    [selectedAsset]
  );
  return { handleSetSendMax, handleOnKeyDown };
}

interface SendFormEffectOptions
  extends Pick<FormikProps<FormValues>, 'isSubmitting' | 'setSubmitting' | 'setFieldValue'> {
  amountFieldRef: any;
  setAssetError: (error: string | undefined) => void;
  assetError?: string;
}

export function useSendForm({
  amountFieldRef,
  assetError,
  setAssetError,
  isSubmitting,
  setSubmitting,
}: SendFormEffectOptions) {
  const { selectedAsset } = useSelectedAsset();
  const previous = usePrevious(selectedAsset);
  const assets = useAssets();

  useEffect(() => {
    if (assets.value?.length === 1 && amountFieldRef.current) {
      amountFieldRef?.current?.focus?.();
    }
  }, [amountFieldRef, assets.value?.length]);

  useEffect(() => {
    if (previous !== selectedAsset) {
      if (isSubmitting) {
        setSubmitting(false);
      }
    }
  }, [setAssetError, assetError, isSubmitting, setSubmitting, previous, selectedAsset]);
}
