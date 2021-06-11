import { selector } from 'recoil';
import { currentNetworkState } from '@store/networks';
import {
  Configuration,
  AccountsApi,
  SmartContractsApi,
  InfoApi,
  BlocksApi,
  FeesApi,
} from '@stacks/blockchain-api-client';
import { fetcher } from '@common/api/wrapped-fetch';

enum ApiClientKeys {
  CONFIG = 'clients/CONFIG',
  SMART_CONTRACTS = 'clients/SMART_CONTRACTS',
  ACCOUNTS = 'clients/ACCOUNTS',
  INFO = 'clients/INFO',
  BLOCKS = 'clients/BLOCKS',
  FEES = 'clients/FEES',
}

export const apiClientConfiguration = selector({
  key: ApiClientKeys.CONFIG,
  get: ({ get }) => {
    const network = get(currentNetworkState);
    return new Configuration({ basePath: network.url, fetchApi: fetcher });
  },
});

export const smartContractClientState = selector({
  key: ApiClientKeys.SMART_CONTRACTS,
  get: ({ get }) => {
    const config = get(apiClientConfiguration);
    return new SmartContractsApi(config);
  },
});

export const accountsApiClientState = selector({
  key: ApiClientKeys.ACCOUNTS,
  get: ({ get }) => {
    const config = get(apiClientConfiguration);
    return new AccountsApi(config);
  },
});

export const infoApiClientState = selector({
  key: ApiClientKeys.INFO,
  get: ({ get }) => {
    const config = get(apiClientConfiguration);
    return new InfoApi(config);
  },
});

export const blocksApiClientState = selector({
  key: ApiClientKeys.BLOCKS,
  get: ({ get }) => {
    const config = get(apiClientConfiguration);
    return new BlocksApi(config);
  },
});

export const feesApiClientState = selector({
  key: ApiClientKeys.FEES,
  get: ({ get }) => {
    const config = get(apiClientConfiguration);
    return new FeesApi(config);
  },
});
