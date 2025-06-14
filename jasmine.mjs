// Jasmine ESM runner for TypeScript
import 'ts-node/esm';
import Jasmine from 'jasmine';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const jasmine = new Jasmine({
  projectBaseDir: resolve(__dirname),
});

jasmine.loadConfigFile(resolve(__dirname, 'jasmine.json'));
jasmine.execute();
