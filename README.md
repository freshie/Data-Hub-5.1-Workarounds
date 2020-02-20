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

1) sourceQuery-modules example
gradle hubRunFlow -PflowName=sourceQuery-modules 

2) acceptsBatch example
gradle hubRunFlow -PflowName=acceptsBatch

3) additionalDocuments example
gradle hubRunFlow -PflowName=additionalDocuments

4) customHook example
gradle hubRunFlow -PflowName=customHook

5) Mark as processed example
gradle hubRunFlow -PflowName=markAsProcessed
