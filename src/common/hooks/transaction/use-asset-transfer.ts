import {
  AnchorMode,
  bufferCVFromString,
  ClarityValue,
  createAddress,
  createAssetInfo,
  FungibleConditionCode,
  makeContractCall,
  makeStandardFungiblePostCondition,
  noneCV,
  PostCondition,
  someCV,
  standardPrincipalCVFromAddress,
  uintCV,
} from '@stacks/transactions';
import BN from 'bn.js';
import { useRecoilCallback } from 'recoil';
import { makeFungibleTokenTransferState } from '@store/transactions/fungible-token-transfer';
import { selectedAssetStore } from '@store/assets/asset-search';
import { ftUnshiftDecimals } from '@common/stacks-utils';

interface PostConditionsOptions {
  contractAddress: string;
  contractName: string;
  assetName: string;
  stxAddress: string;
  amount: string | number;
}

function makePostCondition(options: PostConditionsOptions): PostCondition {
  const { contractAddress, contractName, assetName, stxAddress, amount } = options;

  const assetInfo = createAssetInfo(contractAddress, contractName, assetName);
  return makeStandardFungiblePostCondition(
    stxAddress,
    FungibleConditionCode.Equal,
    new BN(amount, 10),
    assetInfo
  );
}

export function useMakeAssetTransfer() {
  return useRecoilCallback(({ snapshot }) => async ({ amount, recipient, memo }) => {
    const assetTransferState = await snapshot.getPromise(makeFungibleTokenTransferState);
    const selectedAsset = await snapshot.getPromise(selectedAssetStore);
    if (!assetTransferState || !selectedAsset) return;
    const {
      balances,
      network,
      senderKey,
      assetName,
      contractAddress,
      contractName,
      nonce,
      stxAddress,
    } = assetTransferState;

    const functionName = 'transfer';

    const tokenBalanceKey = Object.keys(balances?.fungible_tokens || {}).find(contract => {
      return contract.startsWith(contractAddress);
    });

    const realAmount =
      selectedAsset.type === 'ft'
        ? ftUnshiftDecimals(amount, selectedAsset?.meta?.decimals || 0)
        : amount;

    const postConditionOptions = tokenBalanceKey
      ? {
          contractAddress,
          contractName,
          assetName,
          stxAddress,
          amount: realAmount,
        }
      : undefined;

    const postConditions = postConditionOptions ? [makePostCondition(postConditionOptions)] : [];

    // (transfer (uint principal principal) (response bool uint))
    const functionArgs: ClarityValue[] = [
      uintCV(realAmount),
      standardPrincipalCVFromAddress(createAddress(stxAddress)),
      standardPrincipalCVFromAddress(createAddress(recipient)),
    ];

    if (selectedAsset.hasMemo) {
      functionArgs.push(memo !== '' ? someCV(bufferCVFromString(memo)) : noneCV());
    }
    const txOptions = {
      network,
      functionName,
      functionArgs,
      senderKey,
      contractAddress,
      contractName,
      postConditions,
      nonce: new BN(nonce, 10),
      anchorMode: AnchorMode.Any,
    };

    return makeContractCall(txOptions);
  });
}
