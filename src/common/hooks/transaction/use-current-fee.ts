import { useRecoilValue } from 'recoil';

import { feeRateState } from '@store/common/api-request';

export function useCurrentFee() {
  return useRecoilValue(feeRateState);
}
