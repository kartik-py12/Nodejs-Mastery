/* Summary walkthrough

When the user creates a Promise, they give an executor function. 
JavaScript internally provides resolve and reject functions to that executor. 
Inside the constructor, we define state (pending, etc.) and callback stacks. 
When the executor runs, it might start an async task like fetching data. 
Once resolve() is called, we store the value and execute the .then() callback, either immediately (if already resolved) or later (if pending). 
Similarly, reject() stores the error and triggers .catch().

*/

const { error } = require("console");
const { type } = require("os");



// step 1: Defining the structure and states
class MyPromise{
    constructor(executor){
        this.state='pending'; //'fulfield' or 'rejected' will be set later
        this.value=undefined; // for resolved value
        this.reason=undefined; // for rejected reason

        this.onFulfilledCallbacks=[]; // store .then callbacks
        this.onRejectedCallbacks=[]; // store .catch callbacks

        /*
        When you create a promise with new MyPromise(...), it starts in a pending state.
        
        The executor(resolve, reject) function is run immediately (just like in native Promises).

        We store:
            value: result passed to resolve()
            reason: error passed to reject()
            onFulfilledCallbacks: queue of .then() callbacks
            onRejectedCallbacks: queue of .catch() callbacks

        */

        // step 2: Defining resolve() and reject()

        const resolve = (value) => {
            if(this.state==='pending'){
                this.state='fulfilled';
                this.value=value;
                this.onFulfilledCallbacks.forEach((callback) => callback(value));
            }
        };

        const reject = (reason) => {
            if(this.state==='pending'){
                this.state='rejected';
                this.reason=reason;
                this.onRejectedCallbacks.forEach((callback) => callback(reason));
            }
        };


        /* 
        A promise can be settled only once. That's why we check if (this.state === 'pending').
        
        When resolve(value) is called:
            The state changes to 'fulfilled'
            Stored .then() callbacks are executed with value

        When reject(reason) is called:
            The state changes to 'rejected'
            Stored .catch() callbacks are executed with reason
        
        */

        try {
            executor(resolve,reject);
        } catch (error) {
            reject(error);
        }
    }

    then(onFulfilled,onRejected){
        return new MyPromise((resolve,reject) => {
            const handleFulfilled = (value) => {
                try {
                    if(typeof onFulfilled ==="function"){
                        const result = onFulfilled(value);
                        result instanceof MyPromise ? result.then(resolve,reject) : resolve(result);
                    /*
                    // EXPLANATION:
                         When a `.then()` callback returns a value, we must handle two cases:
                         1. If it returns a regular value (like a string, number, object), we immediately call `resolve(result)`
                            and pass it to the next `.then()` in the chain.
                         2. BUT — if it returns another `MyPromise` (like a nested async task),
                            we must "wait" for that inner promise to settle before continuing.
                        
                         This is why we check: `if (result instanceof MyPromise)`
                         If true, we call `result.then(resolve, reject)`, meaning:
                            → Let the inner promise finish
                            → Then pass its resolved value or error to the outer promise's `resolve` or `reject`
                        
                         ✅ Important: This does NOT handle nested `.then()` calls — those are treated separately.
                         We're ONLY handling the case where a `.then()` returns another promise,
                         and chaining is done by *waiting for* that inner-most promise to complete first.
                        
                         Example:
                         myPromise.then(val => {
                           return new MyPromise((res, rej) => setTimeout(() => res("inner"), 1000));
                         }).then(console.log);
                        
                         In this case, the second `.then()` won’t run until the inner promise resolves.
                         That's what this block enables: *proper chaining of promise-returning `.then()` functions.*
                    */

                    }else{
                        // If no onFulfilled provided, pass the value through
                        resolve(value);
                    }
                } catch (error) {
                    reject(error);
                }
            };

            const handleRejected = (reason) => {
                try {
                    if(typeof onRejected === 'function'){
                        const result = onRejected(reason);
                        result instanceof MyPromise ? result.then(resolve,reject) : resolve(result);
                    }else{
                        // if no onRejected provided, pass the rejection through
                        reject(reason);
                    }
                } catch (error) {
                    reject(error);
                }
            };

            if(this.state === 'fulfilled'){
                handleFulfilled(this.value);
            }else if(this.state==='rejected'){
                handleRejected(this.reason);
            }else{
                this.onFulfilledCallbacks.push(handleFulfilled);
                this.onRejectedCallbacks.push(handleRejected);
            }
        });
    }


    catch(onRejected){
        return this.then(undefined,onRejected);
    };
}

const p = new MyPromise((resolve,reject) => {
    setTimeout(()=>{
        reject("Failed");
        // resolve("Done");
    },2000);
});

p.then((val) => {
    console.log("Resolved with: ",val);
    return "Next value";
}).then((val)=>{
    console.log("Next function resolved with: ",val);
    return "last value";
}).then((val) => {
    console.log("last function resolved with: ",val);
}).catch((err) => {
    console.error("Caught error: ",err);
})



/* --------------------------------------------------------------------------
📘 Promise Chaining & Error Propagation Summary:

✔️ Problem Identified:
Initially, chaining `.catch()` after multiple `.then()` calls didn’t work correctly.
This happened because our `.then()` method didn’t handle rejected states or forward rejections properly.
As a result, errors were not reaching `.catch()` if any `.then()` in the chain didn't handle or pass the rejection down.

✔️ How Native Promises Work:
- `.then(onFulfilled, onRejected)` is the **core** method that handles both resolve and reject paths.
- `.catch(onRejected)` is simply **syntactic sugar** for `.then(undefined, onRejected)`.
- If a `.then()` doesn't handle a rejection, it must pass the error forward by calling `reject(reason)` on the returned promise.
- Native Promise chaining works because each `.then()` returns a new Promise that either:
    - Resolves with the return value of the callback
    - Rejects if the callback throws
    - Waits if the callback returns another Promise

✔️ Fix Implemented:
- Enhanced `.then()` to accept both `onFulfilled` and `onRejected`.
- Inside `.then()`, if the current promise is already rejected, and `onRejected` is provided, it is called.
- If no `onRejected` is provided, the rejection is passed to the next promise using `reject(reason)`.
- `.catch()` was simplified to: `this.then(undefined, onRejected)`.

✔️ Now Supported:
- Full `.then().then().catch()` chaining
- Rejection propagation across multiple `.then()` calls
- Custom `MyPromise` now behaves like the native Promise API in terms of basic chaining

🧠 Takeaway:
Understanding rejection flow and proper chaining is critical for building any Promise-compliant abstraction.
This update ensures that every error either gets handled or continues down the chain until it is caught — just like native promises.

-------------------------------------------------------------------------- */
