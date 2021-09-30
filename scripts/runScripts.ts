import chalk from 'chalk';
import { cacheAllEventsForLyraContract } from './events';
import { updateBlockNumbers } from './events/blockNumbers';
import { getCurrentLPPosition } from './events/getLPcurrentPnL';
import { getTradeVolume } from './events/getTradeVolume';
import { getNetworkProvider, getSelectedNetwork } from './util';

const RUN_PARAMS = {
  updateBlockNumbers: false,
  updateEvents: false,
  getTradeVol: true,
  getCurrentLPPosition: true,
};

async function main() {
  const network = getSelectedNetwork();
  const params = { network, provider: getNetworkProvider(network) };

  if (RUN_PARAMS.updateBlockNumbers) {
    await updateBlockNumbers(params);
  }

  if (RUN_PARAMS.updateEvents) {
    const endBlock = (await params.provider.getBlock('latest')).number;
    await cacheAllEventsForLyraContract(params, 'OptionMarket', endBlock, 'sETH');
    await cacheAllEventsForLyraContract(params, 'LiquidityPool', endBlock, 'sETH');
    await cacheAllEventsForLyraContract(params, 'ShortCollateral', endBlock, 'sETH');
  }

  if (RUN_PARAMS.getTradeVol) {
    await getTradeVolume(params, ['sETH']);
  }
  if (RUN_PARAMS.getCurrentLPPosition) {
    await getCurrentLPPosition(params, ['sETH']);
  }

  console.log(chalk.greenBright('\n=== Success! ===\n'));
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });