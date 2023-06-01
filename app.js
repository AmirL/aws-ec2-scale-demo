// Include the cluster module
const cluster = require('cluster');

// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    const cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (let i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for terminating workers
    cluster.on('exit', function (worker) {

        // Replace the terminated workers
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();

    });

// Code to run if we're in a worker process
} else {
    const AWS = require('aws-sdk');
    const express = require('express');

    AWS.config.region = process.env.REGION

    const ddb = new AWS.DynamoDB();

    const productsTable = process.env.PRODUCTS_TABLE;
    const app = express();


    app.get('/', function(req, res) {
        // get a sample item from the products table
        ddb.getItem({
            TableName: productsTable,
            Key: {
                id: {
                    S: 'banana'
                }
            }
        }, function(err, data) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            } else {
                // and return it if it exists
                return res.status(200).json({
                    message: 'Success',
                    obj: data
                });
            }
        });
    });

    const port = process.env.PORT || 3000;

    const server = app.listen(port, function () {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
}