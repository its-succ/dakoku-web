const cloudTasks = require('@google-cloud/tasks');

module.exports = async ({email, password}) => {
  const client = new cloudTasks.CloudTasksClient();

  // const queue = 'my-appengine-queue';
  // const location = 'us-central1';

  // Construct the fully qualified queue name.
  const parent = client.queuePath(process.env.GOOGLE_CLOUD_PROJECT, process.env.DAKOKU_LOCATION, process.env.DAKOKU_QUEUE_DAKOKU_SCRIPT);

  const task = {
    appEngineHttpRequest: {
      httpMethod: 'POST',
      relativeUri: '/',
      headers: {
        'Content-Type': 'application/json'
      },
      body: Buffer.from(JSON.stringify({user: email, password: password})).toString('base64')
    },
  };

  const request = {
    parent: parent,
    task: task,
  };

  // Send create task request.
  const [response] = await client.createTask(request);
  const name = response.name;
  console.log(`Created task ${name}`);
};
