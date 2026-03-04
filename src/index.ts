import { defineTheme } from '@zevcommerce/theme-sdk';
import { settingsSchema } from './settings';
import { auroraSectionRegistry } from './registry';
import { auroraBlockRegistry } from './blocks';
import preset from './preset.json';

const theme = defineTheme({
  handle: 'aurora',
  name: 'Aurora',
  version: '2.0.0',
  author: {
    name: 'ZevCommerce',
    url: 'https://zevcommerce.com',
  },
  description: 'Warm and earthy with serif typography — a premium ZevCommerce theme.',
  tags: ['warm', 'earthy', 'serif', 'premium', 'responsive'],
  settingsSchema,
  defaultPreset: preset as any,
  registry: {
    sections: auroraSectionRegistry,
    blocks: auroraBlockRegistry,
  },
});

export default theme;
export { settingsSchema } from './settings';
export { auroraSectionRegistry } from './registry';
export { auroraBlockRegistry } from './blocks';
