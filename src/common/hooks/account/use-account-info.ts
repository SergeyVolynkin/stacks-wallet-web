import { accountBalancesState, accountDataState } from '@store/accounts';
import { useLoadable } from '../use-loadable';

export function useFetchAccountData() {
  return useLoadable(accountDataState);
}

export function useFetchBalances() {
  return useLoadable(accountBalancesState);
}
