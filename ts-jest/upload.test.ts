import { expect, test } from '@jest/globals';
import * as bucket from '../src/bucket';
import * as upload from '../src/upload';
import { Inputs } from '../src/interface';

const ObsClient = require('esdk-obs-nodejs');
function getObsClient(inputs: Inputs) {
    return new ObsClient({
        access_key_id: inputs.accessKey,       
        secret_access_key: inputs.secretKey,       
        server : `https://obs.${inputs.region}.myhuaweicloud.com`,
    });
}

// ------------------------------file---------------------------------

test('upload a exist file without rename to obs folder "obsTest1"', async () => {
    const inputs = {
        accessKey: '******',
        secretKey: '******',
        bucketName: 'hdn-hcloudtoolkit-devkitgithubaction-obs',
        operationType: 'upload',
        obsFilePath: 'obsTest1/file1.txt',
        localFilePath: ['resource/uploadDir/file1.txt'],
        region: 'cn-north-6',   
    }
    const obs = getObsClient(inputs);
    await upload.startUpload(obs, inputs);
    const objList = await bucket.listObjects(obs, inputs.bucketName);
    expect(objList.indexOf('obsTest1/file1.txt')).toBeGreaterThan(-1);
});

test('upload a exist file and rename to obs root', async () => {
    const inputs = {
        accessKey: '******',
        secretKey: '******',
        bucketName: 'hdn-hcloudtoolkit-devkitgithubaction-obs',
        operationType: 'upload',
        obsFilePath: 'elif.txt',
        localFilePath: ['resource/uploadDir/file1.txt'],
        region: 'cn-north-6',   
    }
    const obs = getObsClient(inputs);
    await upload.startUpload(obs, inputs);
    const objList = await bucket.listObjects(obs, inputs.bucketName);
    expect(objList.indexOf('elif.txt')).toBeGreaterThan(-1);
});

test('upload a nonexist file to obs root', async () => {
    const inputs = {
        accessKey: '******',
        secretKey: '******',
        bucketName: 'hdn-hcloudtoolkit-devkitgithubaction-obs',
        operationType: 'upload',
        obsFilePath: '',
        localFilePath: ['resource/uploadDir/file2.txt'],
        region: 'cn-north-6',
        includeSelfFolder: 'true'
    }
    const obs = getObsClient(inputs);
    await upload.startUpload(obs, inputs);
    const objList = await bucket.listObjects(obs, inputs.bucketName);
    expect(objList.indexOf('file1.txt')).toEqual(-1);
});

test('upload a big file to obs', async () => {
    const inputs = {
        accessKey: '******',
        secretKey: '******',
        bucketName: 'hdn-hcloudtoolkit-devkitgithubaction-obs',
        operationType: 'upload',
        obsFilePath: 'src/bigFile.zip',
        localFilePath: ['resource/bigFile.zip'],
        region: 'cn-north-6'
    }
    const obs = getObsClient(inputs);
    await upload.startUpload(obs, inputs);
    const objList = await bucket.listObjects(obs, inputs.bucketName);
    expect(objList.indexOf('src/bigFile.zip')).toEqual(-1);
});

// ------------------------------folder---------------------------------

test('upload a exist empty folder to obs "obsTest2"', async () => {
    const inputs = {
        accessKey: '******',
        secretKey: '******',
        bucketName: 'hdn-hcloudtoolkit-devkitgithubaction-obs',
        operationType: 'upload',
        obsFilePath: 'obsTest2',
        localFilePath: ['resource/uploadDir/test1'],
        region: 'cn-north-6',
        includeSelfFolder: 'y'
    }
    const obs = getObsClient(inputs);
    await upload.startUpload(obs, inputs);
    const objList = await bucket.listObjects(obs, inputs.bucketName);
    expect(objList.indexOf('obsTest2/test1/')).toBeGreaterThan(-1);
});

test('upload a exist folder to obs "obsTest3" and include local folder "uploadDir" itself', async () => {
    const inputs = {
        accessKey: '******',
        secretKey: '******',
        bucketName: 'hdn-hcloudtoolkit-devkitgithubaction-obs',
        operationType: 'upload',
        obsFilePath: 'obsTest3',
        localFilePath: ['resource/uploadDir/'],
        region: 'cn-north-6',
        includeSelfFolder: 'Y'
    }
    const obs = getObsClient(inputs);
    await upload.startUpload(obs, inputs);
    const objList = await bucket.listObjects(obs, inputs.bucketName);
    expect(objList.indexOf('obsTest3/uploadDir/test-mult/other1.txt')).toBeGreaterThan(-1);
});

test('upload a exist folder to obs "obsTest4"', async () => {
    const inputs = {
        accessKey: '******',
        secretKey: '******',
        bucketName: 'hdn-hcloudtoolkit-devkitgithubaction-obs',
        operationType: 'upload',
        obsFilePath: 'obsTest4',
        localFilePath: ['resource/uploadDir/'],
        region: 'cn-north-6'
    }
    const obs = getObsClient(inputs);
    await upload.startUpload(obs, inputs);
    const objList = await bucket.listObjects(obs, inputs.bucketName);
    expect(objList.indexOf('obsTest4/test-mult/other1.txt')).toBeGreaterThan(-1);
});

test('upload a nonexist folder to obs root ', async () => {
    const inputs = {
        accessKey: '******',
        secretKey: '******',
        bucketName: 'hdn-hcloudtoolkit-devkitgithubaction-obs',
        operationType: 'upload',
        obsFilePath: '',
        localFilePath: ['resource/uploadDir/testabab'],
        region: 'cn-north-6'
    }
    const obs = getObsClient(inputs);
    await upload.startUpload(obs, inputs);
    const objList = await bucket.listObjects(obs, inputs.bucketName);
    expect(objList.indexOf('testabab/')).toEqual(-1);
});

test('upload a exist folder include lots of files to obs "obsTest5" ', async () => {
    const inputs = {
        accessKey: '******',
        secretKey: '******',
        bucketName: 'hdn-hcloudtoolkit-devkitgithubaction-obs',
        operationType: 'upload',
        obsFilePath: 'obsTest5',
        localFilePath: ['D:/project/spring-boot-main'],
        includeSelfFolder: 'y',
        region: 'cn-north-6'
    }
    const obs = getObsClient(inputs);
    await upload.startUpload(obs, inputs);
    const objList = await bucket.listObjects(obs, inputs.bucketName);
    expect(objList.indexOf('obsTest5/spring-boot-mai/')).toEqual(-1);
});

// ----------------------------------------funciton----------------------------------------

test('fileDisplay', async () => {
    const uploadList = {
        file: [],
        folder: []
    };
    const inputs = {
        accessKey: '******',
        secretKey: '******',
        bucketName: 'hdn-hcloudtoolkit-devkitgithubaction-obs',
        operationType: 'upload',
        obsFilePath: 'obsTest6',
        localFilePath: ['resource/uploadDir'],
        region: 'cn-north-6',   
    };
    await upload.fileDisplay(getObsClient(inputs), inputs, 'resource/uploadDir', '', uploadList);
    expect(uploadList.file.length).toEqual(5);
    expect(uploadList.folder).toEqual(['test', 'test/test2', 'test-mult', 'test-mult/other1', 'test1']);
});

test('getObsRootFile', () => {
    expect(upload.getObsRootFile('Y', 'obs', 'local')).toEqual('obs/local');
    expect(upload.getObsRootFile('n', 'obs', 'local')).toEqual('obs');
});

test('uploadFile', async () => {
    const inputs = {
        accessKey: '******',
        secretKey: '******',
        bucketName: 'hdn-hcloudtoolkit-devkitgithubaction-obs',
        operationType: 'upload',
        obsFilePath: 'obsTest6',
        localFilePath: ['resource/uploadDir/file1.txt'],
        region: 'cn-north-6',   
    };
    const obs = getObsClient(inputs);
    await upload.uploadFile(obs, inputs.bucketName, inputs.localFilePath[0], inputs.obsFilePath);
    const objList = await bucket.listObjects(obs, inputs.bucketName);
    expect(objList.indexOf('obsTest6/file1.txt') > -1).toBeTruthy;
});

test('uploadFolder', async () => {
    const inputs = {
        accessKey: '******',
        secretKey: '******',
        bucketName: 'hdn-hcloudtoolkit-devkitgithubaction-obs',
        operationType: 'upload',
        obsFilePath: 'obsTest6/emptyFolder1',
        localFilePath: ['resource/uploadDir/file1.txt'],
        region: 'cn-north-6',   
    };
    const obs = getObsClient(inputs);
    await upload.uploadFolder(obs, inputs.bucketName, inputs.obsFilePath);
    const objList = await bucket.listObjects(obs, inputs.bucketName);
    expect(objList.indexOf('obsTest6/emptyFolder1') > -1).toBeTruthy;
});

test('obsCreateRootFolder', async () => {
    const inputs = {
        accessKey: '******',
        secretKey: '******',
        bucketName: 'hdn-hcloudtoolkit-devkitgithubaction-obs',
        operationType: 'upload',
        obsFilePath: 'obsTest6/root1/root2/root3',
        localFilePath: ['resource/uploadDir/file1.txt'],
        region: 'cn-north-6',   
    };
    const obs = getObsClient(inputs);
    await upload.obsCreateRootFolder(obs, inputs.bucketName, inputs.obsFilePath);
    const objList = await bucket.listObjects(obs, inputs.bucketName);
    expect(objList.indexOf('obsTest6/root1/') > -1).toBeTruthy;
});