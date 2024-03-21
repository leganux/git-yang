# git-yang
A library to upload and downloas files and respos to github using nodejs

<center>
<img src="gityang.jpg" width="500px" >
</center>




**How to get token github**

To get a token from GitHub, you need to generate a Personal Access Token (PAT) through your GitHub account settings. Here are the steps to generate a token:

* Log in to your GitHub account: Go to GitHub's website and log in using your username and password.
* Access your account settings: Click on your profile icon in the top-right corner of the page, then select "Settings" from the dropdown menu.
* Navigate to Developer settings: In the left sidebar, scroll down and click on "Developer settings".
* Generate a new token: In the Developer settings page, click on "Personal access tokens".
* Generate a new token: Click on the "Generate new token" button. You may need to enter your password to continue.
* Configure the token: Give your token a descriptive name and select the scopes or permissions you need. Be careful with the scopes you select, as they determine the level of access the token will have.
* Generate the token: After configuring the token, click on the "Generate token" button.

* Copy the token: Once the token is generated, GitHub will display it on the screen. Copy the token and save it securely. You won't be able to see it again.

* Use the token: You can now use this token for authentication in your applications or scripts.

Remember to keep your tokens secure and never share them publicly or include them in your code repositories. They grant access to your GitHub account and repositories, so treat them like passwords.




markdown
Copy code
# GitYang Class

The `GitYang` class is a utility for interacting with GitHub repositories through the GitHub API. It provides methods for creating repositories, uploading files and folders, downloading repository contents, and more.

## Installation

You can install the `GitYang` class via npm:

```bash
npm install git-yang
````

Usage
To use the GitYang class, require it in your script:

```javascrip
const GitYang = require('git-yang');
```

Then, create an instance of the GitYang class with your GitHub username and personal access token:


```
const gitHub = new GitYang('your_github_username', 'your_github_token');
```
Methods

```
createRepo(repoName, private = false)
````

Creates a new repository with the specified name.

```
gitHub.createRepo('my_new_repo', true)
    .then(data => console.log('Repository created:', data))
    .catch(error => console.error('Error creating repository:', error));
uploadFolderRepo(folderPath, commitMessage)
```
Uploads a folder and its contents to the GitHub repository.

```
gitHub.uploadFolderRepo('/path/to/local/folder', 'Uploaded folder content')
    .then(data => console.log('Folder uploaded:', data))
    .catch(error => console.error('Error uploading folder:', error));
downloadRepo(localFolderPath)
```
Downloads the contents of the GitHub repository to the specified local folder.

```
gitHub.downloadRepo('/path/to/downloaded/folder')
    .then(() => console.log('Repository contents downloaded successfully.'))
    .catch(error => console.error('Error downloading repository contents:', error));
downloadFileFromRepo(fileName, localFolderPath)
```
Downloads a specific file from the GitHub repository to the specified local folder.

```
gitHub.downloadFileFromRepo('example.txt', '/path/to/downloaded/folder')
    .then(filePath => console.log('File downloaded:', filePath))
    .catch(error => console.error('Error downloading file:', error));
```


Example
Here's a complete example demonstrating how to use the GitYang class:

```
const GitYang = require('git-yang');

async function main() {
    const gitHub = new GitYang('your_github_username', 'your_github_token');

    try {
        // Create a new repository
        await gitHub.createRepo('my_new_repo', true);

        // Upload a folder to the repository
        await gitHub.uploadFolderRepo('/path/to/local/folder', 'Uploaded folder content');

        // Download the repository contents to a local folder
        await gitHub.downloadRepo('/path/to/downloaded/folder');
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();
````

Replace 'your_github_username' and 'your_github_token' with your GitHub username and personal access token, respectively. Also, update '/path/to/local/folder' and '/path/to/downloaded/folder' with the paths to your local folders for uploading and downloading.

