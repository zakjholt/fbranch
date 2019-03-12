const FuzzySearch = require("fuzzy-search");
const prompts = require("prompts");

class Git {
  constructor(dir) {
    // TODO: Check if there's a .git in the current dir
    this.git = require("simple-git")(dir);
  }

  getAllBranches() {
    return new Promise((resolve, reject) => {
      this.git.branch(null, (err, res) => {
        if (!!err) {
          reject(err);
        }
        resolve(res.all);
      });
    });
  }

  async getResults(args) {
    const branches = await this.getAllBranches();
    const queryListObjects = branches.map(el => ({ content: el }));

    const searcher = new FuzzySearch(queryListObjects, ["content"]);

    const results = searcher.search(args.join(""));

    return results.map(e => e.content);
  }

  checkoutBranch(name) {
    return new Promise((resolve, reject) => {
      this.git.checkout(name, (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);

        console.log(`Switched to branch "${name}"`);
      });
    });
  }

  selectBranchToCheckout(results) {
    return prompts([
      {
        type: "select",
        name: "branchName",
        message: `${results.length} branches found`,
        choices: results.map(r => ({ title: r, value: r }))
      }
    ]);
  }

  async searchByQuery(args) {
    const results = await this.getResults(args);

    if (results.length === 0) {
      this.interactiveSearchByQuery();

      return;
    }

    if (results.length > 1) {
      const { branchName } = await this.selectBranchToCheckout(results);

      await this.checkoutBranch(branchName);
      return;
    }

    const [branchName] = results;

    await this.checkoutBranch(branchName);
  }

  async interactiveSearchByQuery() {
    const branches = await this.getAllBranches();

    const { branchName } = await prompts([
      {
        type: "autocomplete",
        name: "branchName",
        message: "search for a branch",
        choices: branches.map(b => ({ title: b, value: b }))
      }
    ]);

    this.checkoutBranch(branchName);
  }
}

module.exports = Git;
