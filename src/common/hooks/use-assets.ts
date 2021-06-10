import { useLoadable } from '@common/hooks/use-loadable';
import {
  assetsState,
  fungibleTokensState,
  nonFungibleTokensState,
  stxTokenState,
  transferableAssetsState,
} from '@store/assets/tokens';

export function useAssets() {
  return useLoadable(assetsState);
}

export function useTransferableAssets() {
  return useLoadable(transferableAssetsState);
}

export function useFungibleTokenState() {
  return useLoadable(fungibleTokensState);
}

export function useNonFungibleTokenState() {
  return useLoadable(nonFungibleTokensState);
}

export function useStxTokenState() {
  return useLoadable(stxTokenState);
}
