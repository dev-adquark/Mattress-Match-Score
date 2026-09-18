#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

const reactVersion = pkg.dependencies?.react || pkg.devDependencies?.react;
const reactDomVersion = pkg.dependencies?.['react-dom'] || pkg.devDependencies?.['react-dom'];

if (!reactVersion || !reactDomVersion) {
  console.error('❌ Error: react or react-dom not found in package.json');
  process.exit(1);
}

const parseVersion = (v) => {
  const match = v.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) {
    console.error(`❌ Error: Unable to parse version "${v}"`);
    process.exit(1);
  }
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
};

const react = parseVersion(reactVersion);
const reactDom = parseVersion(reactDomVersion);

const isValid = (v) => v.major === 19 && v.minor >= 0 && v.minor < 3;

if (!isValid(react)) {
  console.error(
    `❌ Error: react@${reactVersion} is outside the required range [19.0.0, 19.3.0). ` +
    `@react-three/fiber@9.7.0 requires react >=19 <19.3.`
  );
  process.exit(1);
}

if (!isValid(reactDom)) {
  console.error(
    `❌ Error: react-dom@${reactDomVersion} is outside the required range [19.0.0, 19.3.0). ` +
    `@react-three/fiber@9.7.0 requires react-dom >=19 <19.3.`
  );
  process.exit(1);
}

console.log(`✓ React version check passed: react@${reactVersion}, react-dom@${reactDomVersion}`);
