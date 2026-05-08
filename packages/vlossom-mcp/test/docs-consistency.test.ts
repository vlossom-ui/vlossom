import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const packageRoot = process.cwd();

function readDoc(filePath) {
    return readFileSync(path.join(packageRoot, filePath), 'utf8');
}

function listPackageFiles(dir = packageRoot) {
    const entries = readdirSync(dir);
    const files = [];

    for (const entry of entries) {
        if (entry === 'node_modules' || entry === 'dist') continue;

        const fullPath = path.join(dir, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
            files.push(...listPackageFiles(fullPath));
        } else {
            files.push(path.relative(packageRoot, fullPath).replace(/\\/g, '/'));
        }
    }

    return files;
}

const docs = {
    readme: readDoc('README.md'),
    readmeKo: readDoc('README.ko.md'),
    philosophy: readDoc('PHILOSOPHY.md'),
    architecture: readDoc('ARCHITECTURE.md'),
    features: readDoc('FEATURES.md'),
    claude: readDoc('CLAUDE.md'),
    claudeKo: readDoc('CLAUDE.ko.md'),
    skill: readDoc('skill/SKILL.md'),
    decisions: readDoc('DECISIONS.md'),
};

const packageJson = JSON.parse(readDoc('package.json'));

const coreTools = ['search_vlossom', 'get_vlossom_reference', 'scaffold_vlossom_code', 'validate_vlossom_usage'];

const contractDocs = ['readme', 'readmeKo', 'philosophy', 'architecture', 'features', 'skill'];
const agentDocs = ['claude', 'claudeKo'];

test('contract docs describe the four core tools', () => {
    for (const docKey of contractDocs) {
        for (const tool of coreTools) {
            assert.ok(docs[docKey].includes(tool), `${docKey} should mention ${tool}`);
        }
    }

    assert.match(
        `${docs.philosophy}\n${docs.readme}\n${docs.readmeKo}\n${docs.architecture}`,
        /four tools|4개 도구|4개 facade/,
    );
    assert.ok(docs.readme.includes('Search'));
    assert.ok(docs.readme.includes('Reference'));
    assert.ok(docs.readme.includes('Scaffold'));
    assert.ok(docs.readme.includes('Validate'));
});

test('agent docs stay concise and deletion-first', () => {
    for (const docKey of agentDocs) {
        assert.ok(docs[docKey].includes('search_vlossom'));
        assert.ok(docs[docKey].includes('validate_vlossom_usage'));
        assert.match(docs[docKey], /Prefer deletion|삭제/);
    }
});

test('resources are documented outside the minimal README', () => {
    const resources = [
        'vlossom://components',
        'vlossom://components/{name}',
        'vlossom://tokens/css',
        'vlossom://options/create-vlossom',
        'vlossom://rules/coding',
        'vlossom://rules/style-set',
        'vlossom://rules/vlossom-first',
        'vlossom://changelog',
        'vlossom://decisions',
        'vlossom://mcp/usage-examples',
    ];

    for (const resource of resources) {
        for (const docKey of ['architecture', 'skill']) {
            assert.ok(docs[docKey].includes(resource), `${docKey} should mention ${resource}`);
        }
    }

    assert.equal(docs.readme.includes('## Resources And Prompts'), false);
    assert.equal(docs.readmeKo.includes('## Resources와 Prompts'), false);
});

test('current docs do not document removed core prompts', () => {
    const prompts = [
        'vlossom.start-project',
        'vlossom.migrate-project',
        'vlossom.implement-feature',
        'vlossom.review-sfc',
        'vlossom.create-style-set',
        'vlossom.review-style-set',
    ];

    for (const docKey of [...contractDocs, ...agentDocs]) {
        for (const prompt of prompts) {
            assert.equal(docs[docKey].includes(prompt), false, `${docKey} should not mention ${prompt}`);
        }
    }
});

test('current docs describe harness-first scope', () => {
    for (const docKey of ['readme', 'readmeKo', 'philosophy', 'architecture', 'features', 'skill']) {
        assert.match(
            docs[docKey],
            /harness|하네스|source-of-truth|사실/,
            `${docKey} should describe harness-first scope`,
        );
    }
});

test('current docs describe default Vlossom-first guard', () => {
    for (const docKey of ['readme', 'readmeKo', 'philosophy', 'architecture', 'features', 'skill']) {
        assert.match(docs[docKey], /Vlossom-first|vlossomFirst/, `${docKey} should describe Vlossom-first behavior`);
        assert.match(docs[docKey], /default|기본/, `${docKey} should describe Vlossom-first as the default`);
    }
});

test('current docs describe installed-version guidance', () => {
    for (const docKey of ['readme', 'readmeKo', 'philosophy', 'architecture', 'features', 'skill']) {
        assert.ok(docs[docKey].includes('versionContext'), `${docKey} should mention versionContext`);
    }

    for (const docKey of ['readme', 'readmeKo', 'features', 'claude', 'claudeKo', 'skill']) {
        assert.ok(docs[docKey].includes('versionSupport'), `${docKey} should mention versionSupport`);
    }
});

test('generated JSON data and scripts are not active runtime dependencies', () => {
    for (const file of [
        'src/data/build-info.json',
        'src/data/components-meta.json',
        'src/data/composables.json',
        'src/data/css-tokens.json',
        'src/data/directives.json',
        'src/data/relationships.json',
        'src/data/components-data.json',
        'src/data/components-source.json',
        'src/data/changelog.json',
        'scripts/build-info.ts',
        'scripts/build-meta.ts',
        'scripts/build-sources.ts',
        'scripts/build-tokens.ts',
        'scripts/copy-data.ts',
        'scripts/copy-relationships.ts',
        'scripts/relationships.json',
        'scripts/generate-components.ts',
        'scripts/build-changelog.ts',
    ]) {
        assert.equal(existsSync(path.join(packageRoot, file)), false, `${file} should be removed`);
    }

    assert.equal(Object.hasOwn(packageJson.scripts, 'generate'), false);
    assert.equal(packageJson.scripts.build.includes('copy-data'), false);
    assert.equal(packageJson.scripts.build, 'npm run clean && tsc');
    if (existsSync(path.join(packageRoot, 'dist/data'))) {
        assert.deepEqual(
            readdirSync(path.join(packageRoot, 'dist/data')).filter((file) => file.endsWith('.json')),
            [],
        );
    }
    assert.ok(docs.architecture.includes('no longer bundles generated `src/data/*.json`'));
});

test('current docs do not present legacy tools as the default contract', () => {
    const legacyNames = [
        'VLOSSOM_MCP_STEPPER',
        'VLOSSOM_MCP_LEGACY_TOOLS',
        'set_github_token',
        'check_github_token',
        'report_issue',
        'generate_component_code',
        'generate_style_set',
        'search_components',
        'suggest_components',
        'list_components',
        'get_component_source',
        'get_css_tokens',
        'get_vlossom_options',
        'get_changelog',
        'get_usage_examples',
        'validate_component_usage',
        'validate_project_setup',
        'clarify_intent',
        'submit_vlossom_issue',
        'record_external_step',
        'VLOSSOM_MCP_GITHUB_ISSUES',
        'VLOSSOM_MCP_DEBUG_STEPPER',
        'issueCandidate',
    ];

    for (const docKey of [...contractDocs, ...agentDocs]) {
        for (const legacyName of legacyNames) {
            assert.equal(
                docs[docKey].includes(legacyName),
                false,
                `${docKey} should not mention removed legacy surface ${legacyName}`,
            );
        }
    }
});

test('decision log is historical while README keeps current positioning', () => {
    assert.ok(docs.decisions.includes('chronological decision log'));
    assert.ok(docs.readme.includes('not a GitHub issue bot'));
    assert.ok(docs.readmeKo.includes('GitHub 이슈 봇이 아닙니다'));
});

test('historical plan files are removed from the current documentation set', () => {
    assert.equal(existsSync(path.join(packageRoot, 'PLAN.md')), false);
    assert.equal(existsSync(path.join(packageRoot, 'PLAN.ko.md')), false);

    for (const docKey of [...contractDocs, ...agentDocs]) {
        assert.equal(docs[docKey].includes('PLAN.md'), false, `${docKey} should not link PLAN.md`);
        assert.equal(docs[docKey].includes('PLAN.ko.md'), false, `${docKey} should not link PLAN.ko.md`);
    }
});

test('package source, scripts, and tests do not use authored JS files', () => {
    const authoredJavaScriptFiles = listPackageFiles().filter((file) => /\.(?:js|mjs|cjs)$/.test(file));

    assert.deepEqual(authoredJavaScriptFiles, []);
});

test('authored TypeScript uses extensionless relative import paths', () => {
    const relativeJsImport =
        /from\s+["']\.{1,2}[^"']*\.js["']|import\s+["']\.{1,2}[^"']*\.js["']|import\(\s*["']\.{1,2}[^"']*\.js["']\s*\)/;
    const offenders = listPackageFiles()
        .filter((file) => /^(?:src|scripts|test)\/.*\.ts$/.test(file))
        .filter((file) => relativeJsImport.test(readDoc(file)));

    assert.deepEqual(offenders, []);
});

test('published package includes docs linked from README', () => {
    for (const file of ['README.ko.md', 'PHILOSOPHY.md', 'ARCHITECTURE.md', 'FEATURES.md']) {
        assert.ok(packageJson.files.includes(file), `package files should include ${file}`);
    }
});
