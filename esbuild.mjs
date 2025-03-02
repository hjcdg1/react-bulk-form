import fs from 'fs';
import { build } from 'esbuild';
import babel from 'esbuild-plugin-babel';

const packageJson = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url)));

const dependencies = Object.keys({ ...packageJson.dependencies, ...packageJson.peerDependencies })

const exportsToBuild = Object.entries(packageJson.exports)
  .map(([path, maps]) => {
    if (path.match(/\./g) && path !== '.') {
      return null;
    }
    return {
      entryPoint: maps.import.replace('./dist', 'src').replace('.mjs', '.ts'),
      outputs: [
        {
          format: 'esm',
          outfile: maps.import,
          plugins: [babel({ config: { envName: 'esmodule' } })]
        },
        {
          format: 'cjs',
          outfile: maps.require,
          plugins: [babel({ config: { envName: 'commonjs' } })]
        }
      ]
    };
  })
  .filter(Boolean);

const buildExports = () => {
  return exportsToBuild
    .map(({ entryPoint, outputs }) =>
      outputs.map(({ format, outfile, plugins }) =>
        build({
          bundle: true,
          minify: true,
          target: ['es2015', 'node16'],
          external: dependencies,
          platform: 'neutral',
          entryPoints: [entryPoint],
          format,
          outfile,
          plugins
        })
      )
    )
    .flat();
};

Promise.all(buildExports()).then(() => {
  console.log('Build success!');
});
