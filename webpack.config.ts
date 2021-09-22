import path from 'path'
import fs from 'fs'
import { Configuration } from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'
import UserScriptPlugin from 'webpack-userscript'
import parseJson from 'parse-json'

export default async (): Promise<Configuration> => {
  const json = await fs.promises.readFile(path.resolve(__dirname, 'package.json'))
  const { name, version, author } = parseJson(json.toString('utf-8'))
  return {
    mode: 'production',
    target: 'web',
    entry: path.resolve(__dirname, 'src', 'index.ts'),
    output: {
      path: path.join(__dirname, 'dist', 'js'),
      filename: `${name}.user.js`
    },
    devtool: false,
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      },
      extensions: ['.ts', '.js']
    },
    devServer: {
      allowedHosts: 'all',
      client: undefined,
      hot: false,
      host: '0.0.0.0',
      port: 5000
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          extractComments: false, // 禁止xxx.js.LICENSE.txt
          terserOptions: {
            mangle: true
          }
        })
      ]
    },
    performance: {
      maxAssetSize: 10485760,
      maxEntrypointSize: 10485760
    },
    plugins: [
      new UserScriptPlugin({
        headers: {
          name,
          author,
          version,
          match: 'https://www.baidu.com/',
          grant: 'GM.xmlHttpRequest'
        }
      })
    ]
  }
}
