import { selector } from 'recoil';

import { feesApiClientState } from '@store/common/api-clients';

enum ApiRequestKeys {
  FEE = 'apiRequests/FEE_RATE',
}

export const feeRateState = selector({
  key: ApiRequestKeys.FEE,
  get: async ({ get }) => {
    return get(feesApiClientState).getFeeTransfer() as unknown as Promise<number>;
  },
});
