const cloudTasks = require('@google-cloud/tasks');

module.exports = async ({email, password, action}) => {
  const client = new cloudTasks.CloudTasksClient();

  // Construct the fully qualified queue name.
  const parent = client.queuePath(process.env.GOOGLE_CLOUD_PROJECT, process.env.DAKOKU_LOCATION, process.env.DAKOKU_QUEUE_DAKOKU_SCRIPT);

  const task = {
    appEngineHttpRequest: {
      httpMethod: 'POST',
      relativeUri: '/',
      headers: {
        'Content-Type': 'application/json'
      },
      body: Buffer.from(JSON.stringify({user: email, password, action})).toString('base64')
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
