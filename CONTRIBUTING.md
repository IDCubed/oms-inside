# Contributing to Inside

Please take a moment to review this document in order to make the contribution
process easy and effective for everyone involved.

Following these guidelines helps to communicate that you respect the time of
the developers managing and developing this open source project. In return,
they should reciprocate that respect in addressing your issue, assessing
changes, and helping you finalize your pull requests.


## Using the issue tracker

The issue tracker is the preferred channel for [bug reports](#bugs),
[features requests](#features) and [submitting pull requests](#pull-requests).
When using the tracker, please keep the discussion on topic and respect others' opinions.


<a name="bugs"></a>
## Bug reports

A bug is a _demonstrable problem_ that is caused by the code in the repository.
Good bug reports are extremely helpful - thank you!

Bugs should be added to the issue tracker.  Before adding them however:

Guidelines for bug reports:

1. **Use the GitHub issue search** &mdash; check if the issue has already been
   reported.

2. **Check if the issue has been fixed** &mdash; try to reproduce it using the
   latest `master` or development branch in the repository.

3. **Isolate the problem** &mdash; ideally create a [reduced test
   case](http://css-tricks.com/6263-reduced-test-cases/).

A good bug report shouldn't leave others needing to chase you up for more
information. Please try to be as detailed as possible in your report. What is
your environment? What steps will reproduce the issue? What OS experiences the
problem? What would you expect to be the outcome? All these details will help
people to fix any potential bugs.

Example:

> Short and descriptive example bug report title
>
> A summary of the issue and the browser/OS environment in which it occurs. If
> suitable, include the steps required to reproduce the bug.
>
> 1. This is the first step
> 2. This is the second step
> 3. Further steps, etc.
>
> `<url>` - a link to the reduced test case
>
> Any other information you want to share that is relevant to the issue being
> reported. This might include the lines of code that you have identified as
> causing the bug, and potential solutions (and your opinions on their
> merits).


<a name="features"></a>
## Feature requests

Feature requests are welcome.  They go in the issue tracker.  Keep in mind that they need to fit within the scope and aims of the project to be added.  Please provide as much detail and context as possible.


<a name="pull-requests"></a>
## Contributing Code (i.e. Pull requests)

Good pull requests - patches, improvements, new features - are a fantastic
help. They should remain focused in scope and avoid unrelated commits.

**Please ask first** in an issue before embarking on any significant pull
request (e.g. implementing features, refactoring code), otherwise you may spend
a lot of time working on something that the project's maintainers may not
want to merge into the project.

Following this process is the best way to get your work included.  (we're happy to answer questions on [IRC](https://github.com/IDCubed/oms-inside#communication)):

1. [Fork](http://help.github.com/fork-a-repo/) the project using the Fork Button on the project's github page.

2. Make a comment in the related issue where this change was discussed to indicate that you're starting on it.

3. Create a new topic branch from master (named issue+#), to contain your feature, change, or fix, where the
   issue number refers to the issue you discussed this change with. e.g.:

   ```bash
   git checkout -b issue42
   ```

4. For JavaScript and Angular expressions in the html, make sure to add tests.
   Patches and features will not be accepted without tests. If you're running `grunt watch` while developing (and you should be!), you should see these fail in the terminal window where you ran `grunt watch`.

   For more, see TODO(how to write tests).

5. If you forked more than a day ago, add the project repo as a remote, get the latest changes, and run the tests:

   ```bash
   git remote add upstream https://github.com/IDCubed/oms-inside
   git checkout master
   git pull upstream master
   git checkout issue42
   git merge master
   grunt
   ```

6. Push your topic branch up to your fork (a.k.a. origin):

   ```bash
   git push origin issue42
   ```

7. [Open a Pull Request](https://help.github.com/articles/using-pull-requests/)
    for your branch to kick off discussion.  If further changes are necessary
    before merging the pull request into the project repo, pushing them
    to your fork will update the pull request automatically.

**IMPORTANT**: By submitting code, you agree to license your work under the
same license as that used by the project.

<a name="style"></a>
### Code Style

Please follow the style guide for the language you're working in:
JavaScript TBD
Python TBD
SQL TBD
(Don't worry about style until these are linked)

<a name="maintainers"></a>
## Maintainers

If you have commit access, please follow this process for merging patches and cutting new releases.  This workflow does use GitHub's Merge button to lower barriers to entry and speed up the process.  Iteration speed and ease of integrating new contributors is more important than log readability.

### Reviewing changes

1. Check that a change is within the scope and philosophy of the project.
2. Check that a change has any necessary tests and a proper, descriptive commit message.
3. Checkout the change and test it locally.
4. Apply the change to `master` locally (feel free to amend any minor problems in the author's
   original commit if necessary).  If the change is authored by someone who cannot commit to
   `master`, merge it with the Merge button on GitHub, then delete the branch.
5. If the change is good, and authored by another maintainer/collaborator, give
   them a "Ship it!" comment and let them handle the merge.

### Submitting changes

1. All non-trivial changes should be put up for review using GitHub Pull
   Requests.
2. Your change should not be merged into `master` (or another feature branch),
   without at least one "Ship it!" comment from another maintainer/collaborator
   on the project. "Looks good to me" is not the same as "Ship it!".
3. Accept your branch's pull request into the project repo.  Use the merge button to merge it into master, and delete the branch from the project repo.
4. Don't break the build.

### Releasing a new version

1. Include all new functional changes in the CHANGELOG.
2. Use a dedicated commit to increment the version. The version needs to be
   added to the `CHANGELOG.md` (inc. date) and the `package.json`.
3. The commit message must be of `v0.0.0` format.
4. Create an annotated tag for the version: `git tag -m "v0.0.0" v0.0.0`.
5. Push the changes and tags to GitHub: `git push --tags origin master`.
6. Publish the new version to npm: `npm publish`.
