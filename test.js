const GitYang = require('./index.js'); // Path to your GitYang class file

async function main() {
    const user = 'XXXX';
    const token = 'xxxxxxxxxxx';
    const repoName = 'xxxxxx';
    const branchName = 'main';
    const localFolderToUpload = '/Users/myfolder/Documents/GitHub/git-yang/test1';
    const localFolderToDownload = '/Users/myfolder/Documents/GitHub/git-yang/test2';

    try {
        // Create an instance of GitYang class
        const gitHub = new GitYang(user, token, repoName, branchName);

        // Create a new repository
        console.log('Creating repository...');
        await gitHub.createRepo(repoName);
        console.log('Repository created successfully.');

        console.log('Creating branch...');
        //await gitHub.createBranch(repoName, null, branchName, true);
        console.log('branch created successfully.');

        // Upload a folder to the repository
        console.log('Uploading folder to repository...');
        await gitHub.uploadFolderRepo(localFolderToUpload, 'Uploaded folder content');
        console.log('Folder uploaded successfully.');

        // Download the repository contents to a local folder
        console.log('Downloading repository contents...');
        await gitHub.downloadRepo(localFolderToDownload, 'material-dashboard-react');
        console.log('Repository contents downloaded successfully.');
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// Call the main function
main();
