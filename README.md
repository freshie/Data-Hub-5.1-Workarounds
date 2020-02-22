This example project demonstrates how to create different flow configurations using DHF 5.

## How to install

To try this project out using QuickStart, start with a clean MarkLogic instance - i.e. without an existing Data hub installation.
Then, you can either install this project's application via QuickStart or via Gradle.

### Install via QuickStart

To install via QuickStart, simply start QuickStart and browse to this project folder. Use QuickStart to initialize
this project and then deploy the application.

### Install via Gradle

To install via Gradle, first initialize the project:

    ./gradlew -i hubInit
    
Then modify the gradle-local.properties file and either un-comment the mlUsername and mlPassword properties and set the
password for your admin user, or set the properties to a different MarkLogic user that is able to deploy applications. 

Then deploy the application:

    ./gradlew -i mlDeploy

Next, start up QuickStart and browse to this project folder and login to QuickStart. 

## How to test the flows
    
With the application deployed, you're ready to run each of the example flows, which are:

1) Change a URI after a mapping
Custom hooks to change the URIs and delete the previous documents
gradle hubRunFlow -PflowName=customHook

2) Map additional documents
Custom step and return an array of content objects.
gradle hubRunFlow -PflowName=additionalDocuments

3) Add reference data during mapping
Custom step with “acceptsBatch” option
gradle hubRunFlow -PflowName=acceptsBatch

4) Run step on a documents that matches a date range
Custom collector that calls a main module and returns the URIs
gradle hubRunFlow -PflowName=sourceQuery-modules 

5) Mark as processed or delete staging documents
Custom collector that returns URIs of processed document & customer hook to set collection to staged documents
gradle hubRunFlow -PflowName=MarkAsProcessedExample

6) Map two documents using one source document
Custom hook on the following step that changes the URI of the documents processed in the previous step.
gradle hubRunFlow -PflowName=mapping1to2