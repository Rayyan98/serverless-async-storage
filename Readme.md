# Serverless Async Storage

[![NPM version](https://img.shields.io/npm/v/serverless-async-storage.svg?style=flat-square)](https://www.npmjs.com/package/serverless-async-storage)

Keep each Lambda execution in a separate context, including warm Lambdas

## Table of Contents

<!-- TOC -->

- [Installation](#installation)
- [Quick Usage](#quick-usage)
- [Features](#features)
- [When and Why](#when-and-why)
  - [The Want](#the-want)
  - [The Problem](#the-problem)
  - [The Solution - Middlewaring](#the-solution---middlewaring)

<!-- TOC END -->

## Installation

Don't install this as a dev dependency as you will most likely be using functions from it to access the store inside the handlers. The plugin is incredibly lightweight so should not cause any size issues.

`npm install serverless-async-storage`

## Quick Usage

```yaml
# serverless.yml
plugins:
  # order matters
  # make sure it is before other plugins that also wrap handlers like datadog
  - serverless-async-storage/plugin
  - serverless-plugin-datadog
```

```javascript
// handler.js
import { setInStore } from 'serverless-async-storage';

const handler = (event) => {
    setInStore('userId', event.userId)
}

// some deep inner file.js
import { getFromStore } from 'serverless-async-storage';

export const someDeepInnerFunction = () => {
    const userId = getFromStore('userId')
}
```

## Features

- Light weight
- No dependencies
- Plug and Play
- Seamless working with Deployments and Serverless Offline

## When and Why

### The Want

The nature of cloud functions and lambda functions is such that it encourages developers to write pure functions and pass explicit arguments in their code. However, often times situations arise where a developer wants to set things into a "context" and then retrieve them later in the execution without having to prop drill them through several function calls. Such a feature is supported by many major languages in the form of Thread Local Storage, Async Local Storage or something of the sort. Therefore, it is only natural for developers to eventually want to be able to do this in cloud functions as well and/or find a way to do so.

### The Problem

The problems generally arise from how to achieve it and can be broadly divided into functional and maintenance.

One way to achieve it could be to have local variables in a context file and have getters and setters to it, like so

```javascript
// context-manager.js
let userId = null

export const setUserId = (_userId) => { userId = _userId }
export const getUserId = () => userId

// handler.js
export const handler = (event) => {
    setUserId(event.userId)
    // actual handler code
}

// some deep inner file.js
export const someDeepInnerFunction = () => {
    const userId = getUserId()
}
```

On first glance, the code may seem that it will work fine but it has a major problem.

As your code paths in the Lambda become more complex you might run into issues with warm lambdas. These can arise in a situation for example, a particular code path sets and retrieves the user id correctly and completes its execution correctly. Its runtime is now reused for a second invocation of the same Lambda but now a different code path runs where the developer had forgotten to set the user id but when the code path gets the user id from context, it receives the value from the last invocation. This happens because these are file local variables. A similar problem can happen using static members of classes and several other ways to approach this.

A way to get around this problem could be to reinitialize the context at the top of the handler.

```javascript
// context-manager.js
let contextStorage = {}

export const setUserId = (_userId) => { contextStorage.userId = _userId }
export const getUserId = () => contextStorage.userId
export const resetContext = () => { contextStorage = {} }

// handler.js
export const handler = (event) => {
    resetContext()
    // more code
}
```

This solves the functional problem but introduces a maintenance overhead which can become worse if you have common code used in several handlers that pulls things from context. Then you must ensure that all handlers are resetting the context appropriately even as new handlers are created otherwise functional issues pointed out before can arise. You could also approach this by wrapping each handler in node's `asyncLocalStorage.run` call but the maintenance overhead to make sure every handler in the application is properly wrapped would always exist.

```javascript
// context-manager.js
export const asyncLocalStorage = new AsyncLocalStorage();

export const setUserId = (_userId) => { 
    asyncLocalStorage.getStore().userId = _userId 
}
export const getUserId = () => asyncLocalStorage.getStore().userId
export const wrapInContextRun = (cb) => {
    return (...args) => asyncLocalStorage.run({}, cb(...args))
}

// handler.js
export handler = wrapInContextRun((event) => {
    resetContext()
    // actual handler code
})
```

These problems are notorious because its very difficult to catch them in local development or testing environments and usually only appear under very diligent testing or on actual production if they slip through reviews.

### The Solution - Middlewaring

One ideal solution here would be if the `wrapInContextRun` part ran automatically for each execution of the Lambda like middlewares in server applications And also like middlewares it automatically bonded to each handler or through some configuration in a centralized place rather than having to be done on each handler.

This is what the [`serverless-async-storage`](https://www.npmjs.com/package/serverless-async-storage) plugin does. It replaces every handler with its own while pushing the original lambda handler to the env variables. Thus, whenever the lambda is invoked, the plugin gets invoked and runs the original handler fetched from the env with a new empty store, killing two birds with one stone.
