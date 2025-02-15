import { useRecoilState } from 'recoil';
import { loadingState } from '@store/ui';

export enum LOADING_KEYS {
  SUBMIT_TRANSACTION = 'loading/SUBMIT_TRANSACTION',
}

export function useLoading(key: string) {
  const [state, setState] = useRecoilState(loadingState(key));

  const setIsLoading = () => setState(() => 'loading');
  const setIsIdle = () => setState(() => 'idle');

  const isLoading = state === 'loading';
  return {
    isLoading,
    setIsLoading,
    setIsIdle,
  };
}
