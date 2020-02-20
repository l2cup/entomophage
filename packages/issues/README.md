# Entomophage-issues

This is the issues service for the issue/bug tracker Entomophage. This service is responsible for managing issues and projects.

## About

This service is responsible for crud operations on issues and projects. It contains services and routing for the whole service.

### About issues

As this is a issue tracker the issues are the main focus here.

Issues have 5 required fields and a optional field called metadata which is a map of type string,string which can hold anything.
The required fileds are it's label, state, name, project they belong to and the issuedBy field which is the issuer's username.

The ```label``` field is an emum which contains one of the next 5 values: 

- CHANGE : 'Change'
- BUG = 'Bug'
- INCIDENT = 'Incident'
- FEATURE_RECOMMENDATION = 'Feature recommendation'
- FEATURE_IMPLEMENTATION = 'Feature implementation'

Where each of this values is self-explanatory. The label represents the type of the issue. Users can search issues based on their labels. Labels can be changed but it is not advised to do so. Only the issuer can change the label.

The ```state``` field represents state of the issue. It also can be changed, and issues can be searched by it. It is represented
by an enum which contains one of the next 5 values:

- OPEN
- ACCEPTED
- IN_PROGRESS
- RESOLVED
- DECLINED

As an issue can't be deleted, for deletion it can either be stated ___RESOLVED___ or ___DECLINED___.
You can search an issue by it's name or keywords in it's name. If you want to search an exact issue, you can do that by it's id.

Issues belong to projects. There isn't anything unique about an issue except it's id, so issue can be repeated. This is not final as this is still an alpha verison.

A user can open as much issues as he wants.

### About projects

Projects are similar to repositories on github. Projects have their team, website, author which is the user that created the project or a team if the project belongs to no user specifically. It's name is immutable and unique. It is composed as `author/project_name`. An example of this would be if i `l2cup` made a project called `project1`, the whole project name would be `l2cup/project1` so it would be unique. Someone else can make a project called `project1` but i `l2cup` can't make two projects called `l2cup`. The same login github uses for it's repositories.

Projects have issues that belong to them. They also have a description consisting of 300 characters, more than that you should put in a README.md. They also have a license, where you should put a license name, not the whole license file. 

You can search a project by it's name. You can also update everything into a project except it's name.

## Running

It uses mongo for data storage, the configuration for the database connection should be in the .env file as seen in the example provided in the repo. The port should be configured there too, if not it uses port 5060.

### Nodemon

Nodemon is available as a yarn script using ```yarn serve-watch``` it uses @ts-node so it watches over .ts files and allows development without rebuilding when changing files.

As sometimes the module resolution will work in typescript and not in javascript please run node directly over the javascript files before pushing to production to see if the module resolution is working.
