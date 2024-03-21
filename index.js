const axios = require('axios');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

class GitYang {
    constructor(user, token, repo, branch) {
        this.user = 'none';
        this.token = 'none';
        this.repo = 'none';
        this.branch = 'main';

        if (user) {
            this.user = user;
        }

        if (token) {
            this.token = token;
        }

        if (repo) {
            this.repo = repo;
        }

        if (branch) {
            this.branch = branch;
        }
    }

    setBranch(branch) {
        this.branch = branch;
        return this;
    }

    setRepo(repo) {
        this.repo = repo;
        return this;
    }

    validate() {
        let rs = {
            success: true,
            message: []
        }
        if (!this.user || this.user == 'none') {
            rs.success = false
            rs.message.push('Add value for  github user')
        }
        if (!this.token || this.token == 'none') {
            rs.success = false
            rs.message.push('Add value for  github token')
        }
        if (!this.branch || this.branch == 'none') {
            rs.success = false
            rs.message.push('Add value for  github branch')
        }
        if (!this.repo || this.repo == 'none') {
            rs.success = false
            rs.message.push('Add value for  github repo')
        }
        return rs

    }

    async createRepo(repo, isPrivate = false) {

        if (repo) {
            this.repo = repo;
        }
        let x = this.validate()
        if (!x.success) {
            throw new Error(x.message.join('\n '))
        }

        try {

            const response = await axios.post(
                'https://api.github.com/user/repos',
                {
                    name: this.repo,
                    private: isPrivate,
                    auto_init: true
                },
                {
                    headers: {
                        Authorization: `token ${this.token}`,
                        Accept: 'application/vnd.github.v3+json',
                    },
                }
            );

            //let info = this.createBranch(this.repo, null, 'main', true)

            //return { repo: response.data, branch: info };
            return response.data

        } catch (e) {
            throw e
        }
    }
    async createBranch(repo, branch_base = 'main', branch, start) {
        if (repo) {
            this.repo = repo;
        }
        if (branch) {
            this.branch = branch;
        }
        let x = this.validate()
        if (!x.success) {
            throw new Error(x.message.join('\n '))
        }
        try {
            if (start) {

                // Create new branch
                let createBranchResponse = await axios.post(
                    `https://api.github.com/repos/${this.user}/${this.repo}/git/refs`,
                    {
                        ref: `refs/heads/${this.branch}`,

                    },
                    {
                        headers: {
                            Authorization: `token ${this.token}`,
                            Accept: 'application/vnd.github.v3+json',
                        },
                    }
                );

                return createBranchResponse.data
            } else {
                let branchResponse = await axios.get(
                    `https://api.github.com/repos/${this.user}/${this.repo}/branches/${branch_base}`,
                    {
                        headers: {
                            Authorization: `token ${this.token}`,
                            Accept: 'application/vnd.github.v3+json',
                        },
                    }
                );

                let baseBranchSHA = branchResponse.data.commit.sha;

                // Create new branch
                let createBranchResponse = await axios.post(
                    `https://api.github.com/repos/${this.user}/${this.repo}/git/refs`,
                    {
                        ref: `refs/heads/${this.branch}`,
                        sha: baseBranchSHA,
                    },
                    {
                        headers: {
                            Authorization: `token ${this.token}`,
                            Accept: 'application/vnd.github.v3+json',
                        },
                    }
                );

                return createBranchResponse.data
            }



        } catch (e) {
            throw e
        }


    }
    async uploadfilesRepo(filesArr, commitMessage, repo, base = '') {
        if (repo) {
            this.repo = repo;
        }
        let x = this.validate()
        if (!x.success) {
            throw new Error(x.message.join('\n '))
        }

        if (commitMessage) {
            commitMessage = 'Uploading files ' + filesArr.join(',') + ' ' + moment().format()
        }
        try {

            let files_ = []
            let errors = []
            for (let file of filesArr) {
                let file_rt_path = file.replace(base, '')

                if (!fs.existsSync(path.resolve(file))) {
                    errors.push(Error(`The file ${file} doesn't exist`))
                    continue
                }
                let stats = await fs.promises.stat(file);
                if (!stats.isFile()) {
                    errors.push(Error(`The path ${file} is not file, it could be a directory`))
                    continue
                }

                const fileContent = fs.readFileSync(file, 'utf-8');

                // Create a new file in the repository
                const createFileResponse = await axios.put(
                    `https://api.github.com/repos/${this.user}/${this.repo}/contents/${file_rt_path}`,
                    {
                        message: commitMessage,
                        content: Buffer.from(fileContent).toString('base64'),
                        branch: this.branch,
                        sha: branchSHA,
                    },
                    {
                        headers: {
                            Authorization: `token ${this.token}`,
                            Accept: 'application/vnd.github.v3+json',
                        },
                    }
                );

                files_.push(createFileResponse.data)
            }

            return {
                success: files_,
                error: errors
            }



        } catch (e) {
            throw e
        }


    }
    async uploadSinglefileRepo(commitMessage, file, repo, base = '') {
        if (repo) {
            this.repo = repo;
        }
        let x = this.validate()
        if (!x.success) {
            throw new Error(x.message.join('\n '))
        }

        if (commitMessage) {
            commitMessage = 'Uploading file ' + file + ' ' + moment().format()
        }

        try {

            if (!fs.existsSync(path.resolve(file))) {
                throw new Error(`The file ${file} doesn't exist`)
            }
            let stats = await fs.promises.stat(file);
            if (!stats.isFile()) {
                throw new Error(`The path ${file} is not file, it could be a directory`)
            }

            const fileContent = fs.readFileSync(file, 'utf-8');

            let file_rt_path = file.replace(base, '')
            if (file_rt_path.startsWith('/')) {
                file_rt_path = file_rt_path.substring(1);
            }


            /* const branchResponse = await axios.get(
                 `https://api.github.com/repos/${this.user}/${this.repo}/branches/${this.branch}`,
                 {
                     headers: {
                         Authorization: `token ${this.token}`,
                         Accept: 'application/vnd.github.v3+json',
                     },
                 }
             );
 
             const branchSHA = branchResponse.data.commit.sha;
 */
            // Create a new file in the repository
            const createFileResponse = await axios.put(
                `https://api.github.com/repos/${this.user}/${this.repo}/contents/${file_rt_path}`,
                {
                    message: commitMessage,
                    content: Buffer.from(fileContent).toString('base64'),
                    branch: this.branch,
                    //sha: branchSHA,
                },
                {
                    headers: {
                        Authorization: `token ${this.token}`,
                        Accept: 'application/vnd.github.v3+json',
                    },
                }
            );
            return createFileResponse.data

        } catch (e) {
            throw e
        }


    }
    async uploadFolderRepo(folder, commitMessage, repo, base) {
        if (repo) {
            this.repo = repo;
        }
        let x = this.validate()
        if (!x.success) {
            throw new Error(x.message.join('\n '))
        }

        if (commitMessage) {
            commitMessage = 'Uploading files ' + folder + ' ' + moment().format()
        }

        if (!base) {
            base = folder
        }
        try {

            if (!fs.existsSync(path.resolve(folder))) {
                throw new Error(`The folder ${folder} doesn't exist`)
            }
            let stats = await fs.promises.stat(folder);
            if (!stats.isDirectory()) {
                throw new Error(`The path ${folder} is not a folder, it could be a file`)
            }

            const folderContent = fs.readdirSync(folder);

            console.log('file list', folderContent);

            let filesUploaded = [];
            let errors = [];

            for (const item of folderContent) {
                const itemPath = path.join(folder, item);
                const subFolderStats = fs.statSync(itemPath);

                if (subFolderStats.isDirectory()) {
                    console.log('*directory ', itemPath);
                    const subFolderFiles = await this.uploadFolderRepo(itemPath, commitMessage, repo, itemPath);
                    filesUploaded = filesUploaded.concat(subFolderFiles);
                } else if (subFolderStats.isFile()) {
                    try {

                        const uploadedFile = await this.uploadSinglefileRepo(commitMessage, itemPath, repo, base);
                        console.log('*uplad file', uploadedFile);
                        filesUploaded.push(uploadedFile);
                    } catch (error) {
                        console.log('* * * * * * ** * * * ** * ', error);
                        errors.push(error);
                    }
                }
            }

            return { success: filesUploaded, errors };

        } catch (e) {
            throw e
        }


    }
    async downloadRepo(localFolder, repo) {
        if (repo) {
            this.repo = repo;
        }
        let x = this.validate()
        if (!x.success) {
            throw new Error(x.message.join('\n '))
        }
        try {

            const treeUrl = `https://api.github.com/repos/${this.user}/${this.repo}/git/trees/${this.branch}?recursive=1`;
            const response = await axios.get(treeUrl, {
                headers: {
                    Authorization: `token ${this.token}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            });

            const treeData = response.data.tree.filter(item => item.type === 'blob'); // Filter out only files

            for (const item of treeData) {
                const filePath = path.join(localFolder, item.path);
                const fileDir = path.dirname(filePath);

                // Ensure directory structure exists
                if (!fs.existsSync(fileDir)) {
                    fs.mkdirSync(fileDir, { recursive: true });
                }

                // Download file content and write to local file
                const fileResponse = await axios.get(item.url, {
                    headers: {
                        Authorization: `token ${this.token}`,
                        Accept: 'application/vnd.github.v3.raw',
                    },
                });

                console.log('** * * ** * * * ** ** * ** *  fileresponse ', fileResponse);

                fs.writeFileSync(filePath, fileResponse.data);
            }

            return true;


        } catch (e) {
            throw e
        }

    }

    async downloadFileFromRepo(fileName, localPath, repo) {
        if (repo) {
            this.repo = repo;
        }

        let x = this.validate();
        if (!x.success) {
            throw new Error(x.message.join('\n '));
        }

        try {
            const fileResponse = await axios.get(
                `https://api.github.com/repos/${this.user}/${this.repo}/contents/${fileName}?ref=${this.branch}`,
                {
                    headers: {
                        Authorization: `token ${this.token}`,
                        Accept: 'application/vnd.github.v3.raw',
                    },
                }
            );

            const fileContent = fileResponse.data;
            const filePath = path.join(localPath, fileName);

            fs.writeFileSync(filePath, fileContent);

            return filePath;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = GitYang;
