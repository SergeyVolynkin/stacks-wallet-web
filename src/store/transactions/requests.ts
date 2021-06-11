import { atom, selector } from 'recoil';
import { getPayloadFromToken } from '@store/transactions/utils';
import { feesApiClientState } from '@store/common/api-clients';

enum RequestKeys {
  REQUEST_TOKEN = 'requests/REQUEST_TOKEN',
  REQUEST_TOKEN_PAYLOAD = 'requests/REQUEST_TOKEN_PAYLOAD',
  ADDRESS = 'requests/ADDRESS',
  NETWORK = 'requests/NETWORK',
  FEE = 'requests/FEE',
}

export const requestTokenState = atom<string | null>({
  key: RequestKeys.REQUEST_TOKEN,
  default: null,
  effects_UNSTABLE: [
    ({ setSelf, trigger }) => {
      if (trigger === 'get') {
        const requestToken = window.location.href?.split('?request=')[1];
        if (requestToken) {
          setSelf(requestToken);
        }
      }

      return () => {
        setSelf(null);
      };
    },
  ],
});

export const requestTokenPayloadState = selector({
  key: RequestKeys.REQUEST_TOKEN_PAYLOAD,
  get: ({ get }) => {
    const token = get(requestTokenState);
    return token ? getPayloadFromToken(token) : null;
  },
});

export const transactionRequestStxAddressState = selector({
  key: RequestKeys.ADDRESS,
  get: ({ get }) => get(requestTokenPayloadState)?.stxAddress,
});

export const transactionRequestNetwork = selector({
  key: RequestKeys.NETWORK,
  get: ({ get }) => get(requestTokenPayloadState)?.network,
});

export const feeRateState = selector({
  key: RequestKeys.FEE,
  get: async ({ get }) => {
    return get(feesApiClientState).getFeeTransfer() as unknown as Promise<number>;
  },
});
