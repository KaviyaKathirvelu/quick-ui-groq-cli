#!/usr/bin/env node

import 'dotenv/config';
import { Command } from 'commander';
import * as p from '@clack/prompts';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import prettier from 'prettier';
import Conf from 'conf';
import Groq from 'groq-sdk';

const config = new Conf({ projectName: 'quick-ui' });
const program = new Command();

interface ProjectStack {
  extension: 'tsx' | 'jsx';
  framework: 'next-app' | 'next-pages' | 'vite' | 'react';
  tailwindVersion: 'v3' | 'v4' | 'none';
  defaultOutputDir: string;
}

async function inspectProjectStack(): Promise<ProjectStack> {
  const stack: ProjectStack = {
    extension: 'jsx',
    framework: 'react',
    tailwindVersion: 'v3',
    defaultOutputDir: 'src/components',
  };

  const pkgPath = path.join(process.cwd(), 'package.json');
  if (await fs.pathExists(pkgPath)) {
    try {
      const pkg = await fs.readJson(pkgPath);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      if (deps && deps.typescript) {
        stack.extension = 'tsx';
      }

      if (deps && deps.next) {
        if (await fs.pathExists(path.join(process.cwd(), 'app'))) {
          stack.framework = 'next-app';
          stack.defaultOutputDir = 'app/components';
        } else {
          stack.framework = 'next-pages';
          stack.defaultOutputDir = 'components';
        }
      } else if (deps && deps.vite) {
        stack.framework = 'vite';
        stack.defaultOutputDir = 'src/components';
      }

      if (deps && deps['@tailwindcss/vite']) {
        stack.tailwindVersion = 'v4';
      } else if (deps && deps.tailwindcss) {
        const version = String(deps.tailwindcss);
        stack.tailwindVersion = version.includes('4') ? 'v4' : 'v3';
      }
    } catch (e) {
      // Use defaults on error
    }
  }

  return stack;
}

function extractCode(rawResponse: string): string {
  const codeBlockRegex = /```(?:jsx|tsx|javascript|typescript|react)?\n([\s\S]*?)```/i;
  const match = rawResponse.match(codeBlockRegex);
  return match ? match[1].trim() : rawResponse.trim();
}

function buildSystemPrompt(promptText: string, stack: ProjectStack): string {
  return `You are an expert React and Tailwind CSS engineer.
Create a complete, single-file React component based on this prompt: "${promptText}".

PROJECT STACK ENVIRONMENT:
- File Extension: .${stack.extension}
- Framework Target: ${stack.framework}
- Styling System: Tailwind CSS ${stack.tailwindVersion}

STRICT GENERATION RULES:
1. Return ONLY valid, executable React code wrapped inside a single \`\`\`${stack.extension} code block.
2. Do NOT write markdown introductions, preamble, or explanations outside the block.
3. Do NOT import third-party utility packages like 'clsx', 'tailwind-merge', or icon libraries. Use standard string templates for conditional classes (e.g., className=\`base-class \${active ? "bg-blue-500" : ""}\`) and native inline SVGs for icons.
4. Use modern Tailwind CSS utility classes following standard design tokens:
   - Ensure WCAG AA accessible color contrast.
   - Support dark mode classes (e.g., dark:bg-slate-900 dark:text-white).
   - Use consistent spacing tokens (p-4, p-6, gap-4).
5. Export the component as the default export.
6. If using Next.js App Router and interactivity is needed, include 'use client'; at the top.`;
}

program
  .name('quick-ui')
  .description('Instantly scaffold React + Tailwind UI components via Groq AI')
  .version('1.0.0');

program
  .command('config')
  .description('Set your local Groq API key globally')
  .option('-k, --key <key>', 'Groq API key')
  .action(async (options: { key?: string }) => {
    let key = options.key;
    if (!key) {
      const response = await p.text({
        message: 'Enter your Groq API Key (from console.groq.com):',
        placeholder: 'gsk_...',
        validate: (value) => (!value || value.trim().length === 0 ? 'API Key cannot be empty' : undefined),
      });
      if (p.isCancel(response)) {
        p.cancel('Operation cancelled.');
        process.exit(0);
      }
      key = response as string;
    }
    config.set('GROQ_API_KEY', key);
    p.outro(chalk.green('✔ Groq API key saved locally!'));
  });

program
  .argument('[prompt]', 'Description of the UI component to generate')
  .option('-k, --key <key>', 'Pass API key directly for this run')
  .option('-o, --output <dir>', 'Target output directory override')
  .option('-n, --name <name>', 'Component file name (e.g., PricingCard)')
  .option('-f, --force', 'Overwrite existing file without confirmation', false)
  .action(async (promptArg: string | undefined, options: { key?: string; output?: string; name?: string; force?: boolean }) => {
    p.intro(chalk.bgGreen.black(' quick-ui (Powered by Groq) '));

    const apiKey = (options.key || process.env.GROQ_API_KEY || config.get('GROQ_API_KEY')) as string;
    if (!apiKey) {
      p.note(
        `No API key found!\nRun ${chalk.cyan('npx quick-ui config')} or set ${chalk.cyan('GROQ_API_KEY')} in your .env file or pass ${chalk.cyan('--key=<key>')}.`,
        'API Key Missing'
      );
      process.exit(1);
    }

    let userPrompt = promptArg;
    if (!userPrompt) {
      const response = await p.text({
        message: 'Describe the UI component you want to build:',
        placeholder: 'e.g., responsive pricing card with 3 tiers and dark mode toggle',
      validate: (value) => (!value || value.trim().length === 0 ? 'Prompt cannot be empty' : undefined),
      });
      if (p.isCancel(response)) {
        p.cancel('Operation cancelled.');
        process.exit(0);
      }
      userPrompt = response as string;
    }

    const stack = await inspectProjectStack();
    const targetFolder = options.output || stack.defaultOutputDir;

    let fileName = options.name;
    if (!fileName) {
      const defaultName = userPrompt
        .split(' ')
        .slice(0, 3)
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).replace(/[^a-zA-Z0-9]/g, ''))
        .join('');
      fileName = defaultName || 'QuickComponent';
    }

    const outputDir = path.resolve(process.cwd(), targetFolder);
    const filePath = path.join(outputDir, `${fileName}.${stack.extension}`);

    if (await fs.pathExists(filePath)) {
      if (!options.force) {
        const overwrite = await p.confirm({
          message: `File ${chalk.yellow(`${fileName}.${stack.extension}`)} already exists in ${targetFolder}. Overwrite?`,
        });
        if (p.isCancel(overwrite) || !overwrite) {
          p.cancel('Generation aborted.');
          process.exit(0);
        }
      }
    }

    const spinner = p.spinner();
    spinner.start(`Detected stack: ${stack.framework} (${stack.extension}) + Tailwind ${stack.tailwindVersion}. Connecting to Groq...`);

    const groq = new Groq({ apiKey });
    const systemPrompt = buildSystemPrompt(userPrompt, stack);

    const candidateModels = [
      'openai/gpt-oss-120b',
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'openai/gpt-oss-20b',
    ];

    let rawOutput = '';
    let usedModel = '';

    for (const model of candidateModels) {
      try {
        spinner.message(`Generating component using ${model}...`);
        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Generate this UI component: ${userPrompt}` },
          ],
          model,
          temperature: 0.2,
        });

        rawOutput = completion.choices[0]?.message?.content || '';
        if (rawOutput) {
          usedModel = model;
          break;
        }
      } catch (err: unknown) {
        continue;
      }
    }

    if (!rawOutput) {
      spinner.stop(chalk.red('Failed to generate code.'));
      p.note('None of the candidate models were reachable. Please verify your Groq API Key.', 'API Error');
      process.exit(1);
    }

    const extractedCode = extractCode(rawOutput);

    spinner.message('Formatting generated code with Prettier...');
    let formattedCode = extractedCode;
    try {
      formattedCode = await prettier.format(extractedCode, {
        parser: stack.extension === 'tsx' ? 'typescript' : 'babel',
        semi: true,
        singleQuote: true,
        trailingComma: 'es5',
      });
    } catch (e) {
      // Fallback to unformatted code if formatting fails
    }

    await fs.ensureDir(outputDir);
    await fs.writeFile(filePath, formattedCode, 'utf-8');

    spinner.stop(chalk.green(`Component generated successfully using ${usedModel}!`));

    p.note(
      `${chalk.bold('File Created:')} ${filePath}\n${chalk.bold('Usage:')} import ${fileName} from '${targetFolder}/${fileName}';`,
      'Success'
    );
    p.outro(chalk.green('Ready to build!'));
  });

program.parse(process.argv);