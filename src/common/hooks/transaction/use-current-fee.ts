import { useRecoilValue } from 'recoil';
import { feeRateState } from '@store/transactions/requests';

export function useCurrentFee() {
  return useRecoilValue(feeRateState);
}
