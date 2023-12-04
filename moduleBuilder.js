/* eslint-disable max-lines */
/* eslint-disable no-console */
/**
 * @author Ahmad Igbaryya
 * @description Build SDK Module + Index File. 
 * 
 * In General this Builder should build for you 2 things: 
 *  1 - New Module: 
 *      Each module will contain slice under the SDK Store, the Module should have it own business logic. 
 *      SDK Modules should contain the below files, 
 *          A) Reducer: Scriptor which owner to disptach Actions
 *          B) Selector: Scriptor which owner to select data from the Module Slice
 *          C) Config: Module configurations
 *          D) Infterface: Interfaces for the module
 *          E) API: Class Module which will contain the Actions (Public and Internal, Internal Actions should start with _, example _thisIsInternalFunc()) 
 *             and other functionality based on business logc.
 *          F) Index: You know it :) 
 *  2 - Build Indexes:
 *      If you have created the Module internally, Please note that you should export that module in order to be identified on this SDK. 
 *      hence this builder can loop each dir and build index file for you. you dont have to change the index file manually. 
 *  3 - Delete existing module.
 */

const fs = require('fs');
const prompts = require('prompts');

const ENCODING = "utf8";
const SDK_INTERFACES_PATH = "./src/sdk/interfaces/sdkInterface.ts";
const BASE_MODULE_PATH = "./src/sdk/reduxBase/baseApi/index.ts";
const BUILDER_TEMPLATE_PATH = "./builder/template/module";
const BASE_PATH = "./src/sdk/modules";
const INDEX_PATH = `${BASE_PATH}/index.ts`;

const importTemlate = `import {MODULE_NAME}Api, { config as {MODULE_NAME}Config, reducer as {MODULE_NAME}Reducer } from './{DIR_NAME}';`;
const moduleTemplate = `\n\t[{MODULE_NAME}Config.sliceName]: {\n\t\treducer: {MODULE_NAME}Reducer,\n\t\tclass: {MODULE_NAME}Api\n\t}`;
const template = `{ALL_IMPORTS}\n\nconst modules = {{ALL_MODULES}};\nexport default modules;\n`;

let allImports = [];
let allDirs = [];
let allModules = {};

class Logger {
    static log({msg, nls = true, nle, type = 'INFO'}) {
        let color;
        switch (type) {
            case 'WARNING':
                color = '33';
                break;
            case 'ERROR':
                color = '31';
                break;
            case 'SUCCESS':
                color = '32';
                break;
            case 'INFO_B':
                color = '36';
                break;
            default:
                color = '';
                break;
        }
        const fmsg = `${nls ? '\n' : ''}[${type.split('_')[0]}] ${new Date().toLocaleTimeString()}: ${msg}${nle ? '\n' : ''}`;
        if (color) {
            console.log(`\x1b[${color}m%s\x1b[0m`, fmsg);
        } else {
            console.log(fmsg);
        }
    }
}
class Builder {
    constructor() {
        this.readModules();
    }
    start = async() => {
        await this.showMenu();
    };
    showMenu = async () => {
        const menu = [
            'Exit Builder',
            'Build new module',
            'Build Module index.ts',
            'Delete existing module'
        ];
        const {option} = await prompts({
            type: 'number',
            name: 'option',
            message: `What would you like to do?\n${menu.map((m, idx) => `[${idx}] ${m}`).join('\n')}\nPlease select option:`,
            validate: value => value < 0 || value > 3 ? `Please select valid input` : true
        });
        switch (option) {
            case 1:
                Logger.log({msg: 'Building new project...', nle: true});
                const {status: type, msg} = await this.buildModule();
                Logger.log({msg, type});
                if (type === 'SUCCESS') {
                    this.rebuildIndexes();
                }
                break;
            case 2:
                Logger.log({msg: 'Building index...', nls: true, nle: false});
                await this.buildIndexFile();
                Logger.log({msg: 'Index has been built successfully.', type: 'SUCCESS', nls: false});
                break;
            case 3:
                Logger.log({msg: 'Deleting existing module', nle: true});
                const {status: typeB, msg: msgB} = await this.deleteModule();
                Logger.log({msg: msgB, type: typeB});
                if (typeB === 'SUCCESS') {
                    this.rebuildIndexes();
                }
                break;
            case 0:
                Logger.log({msg: 'Leaving builder, See you later ;)', type: 'INFO_B'});
                process.exit(1);
            default:
                Logger.log('\nPlease select valid input!.\n');
                this.showMenu();
                break;
        }
    };

    rebuildIndexes = async (infoMsg = 'Building index...', successMsg = 'Index has been built successfully.') => {
        Logger.log({msg: infoMsg, nls: true, nle: false});
        await this.readModules();
        await this.buildIndexFile();
        Logger.log({msg: successMsg, type: 'SUCCESS', nls: false});
    };

    deleteModule = async() => {
        const rimraf = require("rimraf");

        const {moduleName} = await prompts({
            type: 'text',
            name: 'moduleName',
            message: 'Please enter module name to remove:',
            validate: (value) => {
                if (!allDirs.find((module) => module.toUpperCase() === value.toUpperCase())) {
                    return `Module ${value} didn't found.`;
                }
                return true;
            }
        });
        if (!moduleName) {
            return {status: 'ERROR', msg: 'No module name provided, Exiting process..'};
        }
        const moduleNameCC = this.fileToModuleName(moduleName);
        const confirms = ['y', 'yes', 'no', 'n'];
        const {confirm} = await prompts({
            type: 'text',
            name: 'confirm',
            message: 'Are you sure? (y/N):',
            validate: (value) => {
                return confirms.find(c => c ===`${value}`.toLowerCase()) ? true : 'Please select valid value.';
            }
        });
        const t = `${confirm}`.toLowerCase();
        if (t !== 'y' && t !== 'yes') {
            return {status: 'WARNING', msg: 'Skipping process..'};
        }
        await rimraf.sync(`${BASE_PATH}/${moduleName}`);
        const toRemoveFromInterface = [
            `import { ${moduleNameCC}State } from 'sdk/modules/${moduleName}/${moduleName}Interface';\n`,
            `import ${moduleNameCC}Api from 'sdk/modules/${moduleName}/${moduleName}Api';\n`,
            `\t${moduleName}Api: ${moduleNameCC}State;\n`,
            `\t${moduleName}Api: ${moduleNameCC}Api;\n`
        ];
        const toRemoveFromBaseApi = [
            `\tget ${moduleName}Api() {\n\t\treturn this.sdkInstance.${moduleName}Api;\n\t}\n`
        ];
        let content = await fs.readFileSync(`${BASE_MODULE_PATH}`, ENCODING);
        toRemoveFromBaseApi.forEach((toRemove) => {
            content = content.replace(toRemove, '');
        });
        await fs.writeFileSync(BASE_MODULE_PATH, content, ENCODING);

        content = await fs.readFileSync(`${SDK_INTERFACES_PATH}`, ENCODING);
        toRemoveFromInterface.forEach((toRemove) => {
            content = content.replace(toRemove, '');
        });
        await fs.writeFileSync(SDK_INTERFACES_PATH, content, ENCODING);
        return {status: 'SUCCESS', msg: `Module ${moduleName} deleted successfully..`};
    };
    buildModule = async () => {
        let {moduleName} = await prompts({
            type: 'text',
            name: 'moduleName',
            message: 'Please enter module name (Camel case, [A-Z, a-z]):',
            validate: (value) => {
                const MIN_MODULE_LENGTH = 3;
                const MAX_MODULE_LENGTH = 20;
                if (!value || typeof value !== 'string') {
                    return 'Please enter valid module name!';
                }
                if (value.length < MIN_MODULE_LENGTH || value.length > MAX_MODULE_LENGTH) {
                    return `Module name should be between ${MIN_MODULE_LENGTH} and ${MAX_MODULE_LENGTH} characters only!.`;
                }
                const stringReg = new RegExp("^[a-zA-Z]+$");
                if (!stringReg.test(value)) {
                    return 'Module name should be only String';
                }
                const firstChar = value.charAt(0);
                if (firstChar.toLowerCase() !== firstChar) {
                    return 'Module should be CamelCase only. (testModule)';
                }
                if (!!allDirs.find((module) => module.toUpperCase() === value.toUpperCase())) {
                    return `Module/Directory "${value}" already exists!`;
                }
                return true;
            }
        });
        if (!moduleName) {
            return {status: 'ERROR', msg: 'No module name provided, Exiting process..'};
        }
        const {author} = await prompts({
            type: 'text',
            name: 'author',
            message: 'Author (Your username or Fullname):',
            validate: (value) => {
                if (!value || typeof value !== 'string') {
                    return 'Please enter valid Author name';
                }
                return true;
            }
        });
        if (!author) {
            return {status: 'ERROR', msg: 'No valid author entered, Exiting process...'};
        }
        const {description = 'NA'} = await prompts({
            type: 'text',
            name: 'description',
            message: 'Description (In high level what this module do):',
            validate: () => true
        });

        const newModulePath = `${BASE_PATH}/${moduleName}`;
        await fs.mkdirSync(newModulePath);
        const files = [
            {
                src: 'api.temp',
                trg: `${moduleName}Api.ts`
            },
            {
                src: 'config.temp',
                trg: `${moduleName}Config.ts`
            },
            {
                src: 'index.temp',
                trg: `index.ts`
            },
            {
                src: 'interface.temp',
                trg: `${moduleName}Interface.ts`
            },
            {
                src: 'reducer.temp',
                trg: `${moduleName}Reducer.ts`
            },
            {
                src: 'selector.temp',
                trg: `${moduleName}Selector.ts`
            }
        ];
        const moduleNameCC = this.fileToModuleName(moduleName);
        await Promise.all(files.map(({src, trg}) => {
            return fs.copyFileSync(`${BUILDER_TEMPLATE_PATH}/${src}`, `${newModulePath}/${trg}`);
        }));
        await Promise.all(files.map(({trg, src}) => {
            return (async() => {
                const filePath = `${newModulePath}/${trg}`;
                let content = await fs.readFileSync(filePath, ENCODING);
                content = content.replace(/{MODULE_NAME}/g, moduleName);
                content = content.replace(/{MODULE_NAME_CC}/g, moduleNameCC);
                if (src === 'api.temp') {
                    content = content.replace(/{AUTHOR}/g, author);
                    content = content.replace(/{DESCRIPTION}/g, description);
                }
                await fs.writeFileSync(filePath, content, ENCODING);
            })();
        }));

        let interfaces = await fs.readFileSync(SDK_INTERFACES_PATH, ENCODING);
        interfaces = interfaces.replace(/\/\/ {GENERATOR_LINE_IMPORT}/g, `import { ${moduleNameCC}State } from 'sdk/modules/${moduleName}/${moduleName}Interface';\n// {GENERATOR_LINE_IMPORT}`);
        interfaces = interfaces.replace(/\/\/ {GENERATOR_LINE_EXPORT}/g, `${moduleName}Api: ${moduleNameCC}State;\n\t// {GENERATOR_LINE_EXPORT}`);
        
        interfaces = interfaces.replace(/\/\/ {GENERATOR_API_LINE_IMPORT}/g, `import ${moduleNameCC}Api from 'sdk/modules/${moduleName}/${moduleName}Api';\n// {GENERATOR_API_LINE_IMPORT}`);
        interfaces = interfaces.replace(/\/\/ {GENERATOR_API_LINE_EXPORT}/g, `${moduleName}Api: ${moduleNameCC}Api;\n\t// {GENERATOR_API_LINE_EXPORT}`);
        await fs.writeFileSync(SDK_INTERFACES_PATH, interfaces, ENCODING);
        
        let apiInstances = await fs.readFileSync(BASE_MODULE_PATH, ENCODING);
        apiInstances = apiInstances.replace(/\/\/ {APIS_INSTANCES}/g, `get ${moduleName}Api() {\n\t\treturn this.sdkInstance.${moduleName}Api;\n\t}\n\t// {APIS_INSTANCES}`);
        await fs.writeFileSync(BASE_MODULE_PATH, apiInstances, ENCODING);
        
        return {status: 'SUCCESS', msg: 'Module Created Successfully!'};
    };

    readModules = async () => {
        allImports = [];
        allDirs = [];
        allModules = {};
        const dirs = await fs.readdirSync(BASE_PATH);
        for (let idx in dirs) {
            const dirName = dirs[idx];
            const newPath = `${BASE_PATH}/${dirName}`;
            const stat = await fs.lstatSync(newPath);
            if (stat.isDirectory()) {
                allDirs.push(dirName);
                const moduleFiles = await fs.readdirSync(newPath);
                if (this.isModule(moduleFiles)) {
                    const moduleName = this.fileToModuleName(dirName);
                    const moduleObj = moduleTemplate.replace(/{MODULE_NAME}/g, moduleName);
                    const importModuleObj = importTemlate.replace(/{MODULE_NAME}/g, moduleName).replace(/{DIR_NAME}/g, dirName);
                    allModules[moduleName] = moduleObj;
                    allImports.push(importModuleObj);
                }
            }
        }
    };
    buildIndexFile = async () => {
        const modules = Object.keys(allModules);
        let indexContent = template.replace(/{ALL_IMPORTS}/g, allImports.join('\n'));
        const modulesObj = [];
        modules.forEach((moduleName, idx) => {
            const module = allModules[moduleName];
            modulesObj.push(idx === modules.length - 1 ? `${module}\n` : `${module},`);
        });
        indexContent = indexContent.replace(/{ALL_MODULES}/g, modulesObj.join(''));
        this.rewriteToFile(INDEX_PATH, indexContent);
    };

    rewriteToFile = async (file, newContent) => {
        await fs.unlinkSync(file);
        const stream = fs.createWriteStream(file);
        stream.once('open', () => {
            stream.write(newContent);
            stream.end();
        });
    };

    fileToModuleName = (file) => {
        return file
            .split('-')
            .map(str => str.replace(/(^|\s)([a-z])/g, (...args) => args[1] + args[2].toUpperCase()))
            .join('');
    };

    isModule = (files) => {
        return !!files.find(f => f.endsWith('Reducer.ts'));
    };
    
}
const builder = new Builder();
builder.start().catch((err) => { Logger.log({msg: 'Failed to run SDK builder!. See below log for more details...', nle: true, type: 'ERROR'}); console.error(err);});
