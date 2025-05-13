import * as esbuild from 'esbuild';
import { createBuildSettings } from './esbuild.config.js';

const settings = createBuildSettings({ minify: true, platform: "node" });

await esbuild.build(settings);
